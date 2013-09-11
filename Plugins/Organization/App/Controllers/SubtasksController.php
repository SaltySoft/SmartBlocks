<?php

namespace Organization;

class SubtasksController extends \Controller
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

        $qb->select("s")
            ->from("Organization\\Subtask", "s");

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

        $model = Subtask::find($params['id']);

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

        $model = new Subtask();
        $data = $this->getRequestData();
        if (isset($data["name"]))
            $model->setName($data["name"]);

        if (is_array($data["task"]))
        {
            $task = Task::find($data["task"]["id"]);

            if ($task && is_object($task))
            {
                $model->setTask($task);
                $task->addSubtask($model);
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

        $model = Subtask::find($params["id"]);
        $data = $this->getRequestData();
        $model->setName($data["name"]);
        $model->setDescription($data["description"]);
        $model->setOrderIndex(isset($data["orderIndex"]) ? $data["orderIndex"] : $model->getOrderIndex());
        $model->setDuration($data["duration"]);
        $model->setFinished(isset($data["finished"]) ? $data["finished"] : $model->getFinished());

        if (isset($data["task"]) && is_array($data["task"]))
        {
            $task = Task::find($data["task"]["id"]);

            if ($task && is_object($task))
            {
                $model->setTask($task);
                $task->addSubtask($model);
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

        $model = Subtask::find($params["id"]);
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