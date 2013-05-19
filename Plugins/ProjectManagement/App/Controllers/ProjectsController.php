<?php

namespace ProjectManagement;

class ProjectsController extends \Controller
{
    public function security_check()
    {
        if (!\User::logged_in() || \User::current_user() == null)
        {
            $this->redirect("/Users/login_form");
        }
    }

    public function index()
    {
        $this->render = false;
        header("Content-Type: application/json");
        $response = array();
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();

        if (isset($_GET["current_user_only"]) && $_GET["current_user_only"] == "true")
        {
            $qb->select("p")
                ->from("ProjectManagement\\Project", "p")
                ->leftJoin("p.users", "user")
                ->andWhere("user = :user")
                ->setParameter("user", \User::current_user());
        }
        else
        {
            $qb->select("p")
                ->from("ProjectManagement\\Project", "p");
        }

        $models = $qb->getQuery()->getResult();
        foreach ($models as $model)
        {
            $response[] = $model->toArray();
        }
        echo json_encode($response);
    }

    public function show($params = array())
    {
        $this->render = false;
        header("Content-Type: application/json");

        $model = Project::find($params['id']);

        if (is_object($model))
        {
            echo json_encode($model->toArray());
        }
        else
        {
            echo json_encode(array("error"));
        }
    }

    public function create()
    {
        $this->security_check();

        $this->render = false;
        header("Content-Type: application/json");

        $model = new Project();
        $data = $this->getRequestData();
        $model->setName($data["name"]);

        $model->addUser(\User::current_user());
        $model->save();

        if (is_object($model))
        {
            echo json_encode($model->toArray());
        }
        else
        {
            echo json_encode(array("error"));
        }
    }

    public function update($params = array())
    {
        $this->render = false;
        header("Content-Type: application/json");

        $model = Project::find($params["id"]);
        $data = $this->getRequestData();
        $model->setName($data["name"]);

        $model->getUsers()->clear();
        foreach ($data["users"] as $p)
        {
            $user = \User::find($p["id"]);
            if (is_object($user))
            {
                $model->addUser($user);
            }
        }

        $model->getWorkingDurations()->clear();
        foreach ($data["working_durations"] as $p)
        {
            $working_duration = WorkingDuration::find($p["id"]);
            if (is_object($working_duration))
            {
                $model->addWorkingDurations($working_duration);
            }
        }

        $model->save();

        if (is_object($model))
        {
            echo json_encode($model->toArray());
        }
        else
        {
            echo json_encode(array("error"));
        }
    }

    public function destroy($params = array())
    {
        $this->render = false;
        header("Content-Type: application/json");

        $model = Project::find($params["id"]);
        if (is_object($model))
        {
            foreach ($model->getWorkingDurations() as $working_duration)
            {
                $working_duration->delete();
            }
            $model->delete();
            echo json_encode(array("success"));
        }
        else
        {
            echo json_encode(array("error"));
        }
    }
}