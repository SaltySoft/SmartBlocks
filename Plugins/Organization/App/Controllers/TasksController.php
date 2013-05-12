<?php

namespace Organization;

class TasksController extends \Controller
{


    public function index()
    {
        $em = \Model::getEntityManager();

        $qb = $em->createQueryBuilder();

        $qb->select("t")
            ->from("\\Organization\\Task", "t")
            ->where("t.owner = :user")
            ->setParameter("user", \User::current_user())
            ->orderBy("t.order_index");

        $results = $qb->getQuery()->getResult();

        $this->render = false;
        header("Content-Type: application/json");
        $render_array = array();
        foreach($results as $result)
        {
            $render_array[] = $result->toArray();
        }
        echo json_encode($render_array);
    }

    public function create()
    {
        $data = $this->getRequestData();

        $task = new Task;

        $task->setName($data["name"]);
        $task->save();

        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode($task->toArray());
    }

    public function show($params = array())
    {
        $task = Task::find($params["id"]);
        $this->render = false;
        header("Content-Type: application/json");
        if (is_object($task))
        {
            echo json_encode($task->toArray());
        }
        else
        {
            echo json_encode(array("error" => true, "message" => "The task could not be found."));
        }
    }

    public function update($params = array())
    {
        $task = Task::find($params["id"]);
        $this->render = false;
        header("Content-Type: application/json");
        if (is_object($task))
        {
            $data = $this->getRequestData();
            $task->setName($data["name"]);
            $task->setCompletionDate($data["completion_date"]);
            $task->setOrderIndex($data["order_index"]);
            $task->setDueDate($data["due_date"]);
            $task->save();
            echo json_encode($task->toArray());
        }
        else
        {
            echo json_encode(array("error" => true, "message" => "The task could not be found."));
        }
    }

    public function destroy($params = array())
    {
        $this->render = false;
        header("Content-Type: application/json");
        $task = Task::find($params["id"]);
        if (is_object($task))
        {
            $task->delete();
            echo json_encode(array("success" => true));
        }
        else
        {
            echo json_encode(array("error" => true, "message" => "The task could not be found."));
        }
    }

    public function app()
    {
        $this->set("app", "/Organization/Apps/Tasks/app.js");
    }

    public function calendar()
    {
        $this->set("app", "/Organization/Apps/Calendar/app.js");
    }
}