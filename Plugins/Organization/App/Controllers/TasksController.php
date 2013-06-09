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
            ->leftJoin("t.linked_users", "tu")
            ->where("t.owner = :user OR (tu.user = :user)")
            ->setParameter("user", \User::current_user())
            ->orderBy("t.due_date");

        $data = $this->getRequestData();
        if (isset($data["date"])) {
            $qb->andWhere("(t.due_date >= :start_date AND t.due_date < :stop_date)")
            ->setParameter("start_date", $data["date"])
            ->setParameter("stop_date", $data["date"]  + 60 * 60 * 24);
        }

        $results = $qb->getQuery()->getResult();

        $this->render = false;
        header("Content-Type: application/json");
        $render_array = array();
        foreach ($results as $result)
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
        $task->setDueDate($data["due_date"]);
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

//            foreach ($data["linked_users"] as $user_array)
//            {
//                $user = \User::find($user_array['id']);
//                $add = true;
//                if (is_object($user))
//                {
//                    foreach ($task->getLinkedUsers() as $task_user)
//                    {
//                        if ($task_user->getUser()->getId() == $user->getId())
//                        {
//                            $add = false;
//                        }
//                    }
//                }
//                if ($add)
//                {
//                    $task_user = new \Organization\TaskUser();
//                    $task_user->setUser($user);
//                    $task_user->setTask($task);
//                    $task_user->setPending(true);
//                    $task_user->save();
//                }
//            }

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
        $this->set("app", "/Organization/Apps/Common/app.js");
    }

    public function appHA()
    {
        $this->set("app", "/Organization/Apps/Tasks/app.js");
    }


    public function calendar()
    {
        $this->set("app", "/Organization/Apps/Calendar/app.js");
    }
}