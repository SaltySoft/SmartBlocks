<?php

namespace ProjectManagement;

class WorkingDurationsController extends \Controller
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

        $qb->select("wd")
            ->from("ProjectManagement\\WorkingDuration", "wd");

        if (isset($_GET["current_user_only"]) && $_GET["current_user_only"] == "true")
        {
            $qb->andWhere("user = :user")
                ->setParameter("user", \User::current_user());
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
        $data = $this->getRequestData();

//        $timestamp = $data["date"];
//        $day = date('j', $timestamp);
//        $month = date('n', $timestamp);
//        $year = date('Y', $timestamp);
//
//        $em = \Model::getEntityManager();
//        $qb = $em->createQueryBuilder();
//
//        $qb->select("wd")
//            ->from("ProjectManagement\\WorkingDuration", "wd");
//
//        if (isset($_GET["current_user_only"]) && $_GET["current_user_only"] == "true")
//        {
//            $qb->andWhere("user = :user")
//                ->setParameter("user", \User::current_user());
//        }
//        $models = $qb->getQuery()->getResult();


        $model = new WorkingDuration();
        $model->setHoursNumber($data["hours_number"]);
        $model->setDate($data["date"]);
        $model->setProject(Project::find($data["project_id"]));
        $model->setUser(\User::current_user());

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

        $model = WorkingDuration::find($params["id"]);
        $data = $this->getRequestData();
        $model->setHoursNumber($data["hours_number"]);

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
            $model->delete();
            echo json_encode(array("success"));
        }
        else
        {
            echo json_encode(array("error"));
        }
    }
}