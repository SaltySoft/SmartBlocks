<?php

namespace ProjectManagement;

class RolesController extends \Controller
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

        if (isset($_GET["project_id"]) && $_GET["project_id"] != "")
        {
            $qb->select("r")
                ->from("ProjectManagement\\Role", "r")
                ->andWhere("r.project = :project_id")
                ->setParameter("project_id", $_GET["project_id"]);
        }
        else
        {
            $qb->select("r")
                ->from("ProjectManagement\\Role", "r");
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

        $model = Role::find($params['id']);

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

        $model = new Role();
        $data = $this->getRequestData();
        $model->setName($data["name"]);
        $model->setCost($data["cost"]);
        if (isset($data["user_id"]))
        {
            $user = \User::find($data["user_id"]);
            if (is_object($user))
            {
                $model->setUser($user);
            }
        }
        if (isset($data["project_id"]))
        {
            $project = \ProjectManagement\Project::find($data["project_id"]);
            if (is_object($project))
            {
                $model->setProject($project);
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

    public function update($params = array())
    {
        $this->render = false;
        header("Content-Type: application/json");

        $model = Role::find($params["id"]);
        $data = $this->getRequestData();
        $model->setName($data["name"]);
        $model->setCost($data["cost"]);
        if (isset($data["user_id"]))
        {
            $user = \User::find($data["user_id"]);
            if (is_object($user))
            {
                $model->setUser($user);
            }
        }
        if (isset($data["project_id"]))
        {
            $project = \ProjectManagement\Project::find($data["project_id"]);
            if (is_object($project))
            {
                $model->setProject($project);
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

        $model = Role::find($params["id"]);
        if (is_object($model))
        {
            $model->delete();
            echo json_encode(array("success"));
        }
        else
        {
            echo json_encode(array("error"));
        }
    }
}