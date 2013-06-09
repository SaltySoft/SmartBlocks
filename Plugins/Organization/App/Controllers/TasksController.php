<?php

namespace Organization;

class TasksController extends \Controller
{
    public function security_check()
    {
        if (!\User::logged_in())
        {
            $this->redirect("/Meetings/Schemas/error");
        }
    }

    public function security_check_token($token)
    {
        $users = \User::where(array("token" => $token));
        if ($users != null && count($users) == 0)
        {
            $this->redirect("Meetings/Schemas/error");
        }
    }

    public function error()
    {
        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode(array("status" => "error", "message" => "You are not logged in"));
    }

    public function index()
    {
        if (isset($_GET["token"]) && $_GET["token"] != "")
            $this->security_check_token($_GET["token"]);
        else
            $this->security_check();

        $em = \Model::getEntityManager();

        $qb = $em->createQueryBuilder();

        if (\User::current_user() != null)
            $qb->select("t")
                ->from("\\Organization\\Task", "t")
                ->leftJoin("t.linked_users", "tu")
                ->where("t.owner = :user OR (tu.user = :user)")
                ->setParameter("user", \User::current_user())
                ->orderBy("t.due_date");
        else
        {
            $users = \User::where(array("token" => $_GET["token"]));
            $user = $users[0];
            $qb->select("t")
                ->from("\\Organization\\Task", "t")
                ->leftJoin("t.linked_users", "tu")
                ->where("t.owner = :user OR (tu.user = :user)")
                ->setParameter("user", $user)
                ->orderBy("t.due_date");
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
        if (isset($_GET["token"]) && $_GET["token"] != "")
            $this->security_check_token($_GET["token"]);
        else
            $this->security_check();

        $data = $this->getRequestData();

        $task = new Task;

        $task->setName($data["name"]);
        $task->setDueDate($data["due_date"]);

        if (isset($_GET["token"]) && $_GET["token"] != "")
        {
            $users = \User::where(array("token" => $_GET["token"]));
            $user = $users[0];
            $task->setOwner($user);
        }

        $task->save();

        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode($task->toArray());
    }

    public function show($params = array())
    {
        if (isset($_GET["token"]) && $_GET["token"] != "")
            $this->security_check_token($_GET["token"]);
        else
            $this->security_check();

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
        if (isset($_GET["token"]) && $_GET["token"] != "")
            $this->security_check_token($_GET["token"]);
        else
            $this->security_check();

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
        if (isset($_GET["token"]) && $_GET["token"] != "")
            $this->security_check_token($_GET["token"]);
        else
            $this->security_check();

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