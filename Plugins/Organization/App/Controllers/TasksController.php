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

        $data = $this->getRequestData();
        if (isset($data["date"]))
        {
            $qb->andWhere("(t.due_date >= :start_date AND t.due_date < :stop_date)")
                ->setParameter("start_date", $data["date"])
                ->setParameter("stop_date", $data["date"] + 60 * 60 * 24);
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
        $task = \Organization\Task::find($params["id"]);

        if (is_object($task))
        {
            foreach ($task->getPlannedTasks() as $planned_task)
            {
                $planned_task->delete();
            }

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

    public function todoist_link()
    {
        $this->render = false;
        $api_key = TodoistDiplomat::authenticate($_POST["email"], $_POST["password"]);
        if (is_object($api_key))
        {
            $this->json_message("Your account has been linked");
        }
        else
        {
            $this->json_error("Your account could not be linked");
        }

    }

    public function todoist_sync()
    {
        $this->render = false;
        $em = \Model::getEntityManager();
        $todoist_diplomat = new TodoistDiplomat();
        $ids = array();
        if ($todoist_diplomat->isReady())
        {
            $todoist_data = $todoist_diplomat->get();
            $updates = array();
            foreach ($todoist_data["Projects"] as $project)
            {
                foreach ($project["items"] as $item)
                {
                    $ids[] = $item["id"];
                    if ($item["due_date"] != null)
                    {
                        $task = new Task();
                        $date = new \DateTime($item["due_date"]);
                        $task->setDueDate($date->getTimestamp() - 23 * 3600 - 59 * 60 - 59);
                        $task->setName($item["content"]);
                        $task->setOwner(\User::current_user());
                        $task->setTodoistId($item["id"]);
                        $tasks_list[] = $task->toArray();
                        $already_existing = Task::where(array("todoist_id" => $item["id"]));

                        if (!isset($already_existing[0]))
                        {
                            $em->persist($task);
                            $task->setLastUpdated(time());
                            $task->updateNotif();
                            $updates[] = $task;
                        }
                        else
                        {
                            if ($project["last_updated"] > $already_existing[0]->getLastUpdated())
                            {
                                $task = $already_existing[0];
                                $date = new \DateTime($item["due_date"]);

                                if (abs($date->getTimestamp() - 23 * 3600 - 59 * 60 - 59 - $task->getDueDate()) > 23 * 3600 + 59 * 60 + 59)
                                {
                                    foreach ($task->getPlannedTasks() as $planned_task)
                                    {
                                        $planned_task->delete();
                                    }
                                }

                                $task->setDueDate($date->getTimestamp() - 23 * 3600 - 59 * 60 - 59);
                                $task->setName($item["content"]);
                                $task->setLastUpdated(time());
                                $em->persist($task);

                                $updates[] = $task;
                            }
                        }
                    }
                }
            }
            $em->flush();

            //Update notifications
            foreach ($updates as $task)
            {
                $task->updateNotif();
            }

            $qb = $em->createQueryBuilder();
            $qb->select("t")
                ->from("\\Organization\\Task", "t")
                ->andWhere("t.todoist_id is not NULL");
            $i = 0;
            foreach ($ids as $id)
            {
                $qb->andWhere("t.todoist_id <> :id" . $i)
                    ->setParameter("id" . $i++, $id);
            }
            $qb->andWhere("t.due_date > :yesterday")
                ->setParameter("yesterday", time() - 3600 * 24);
            $tasks_ = $qb->getQuery()->getResult();
            echo "\n<br/>\n" . count($tasks_);
            foreach ($tasks_ as $task)
            {
                $task->delete();
            }

            echo json_encode($todoist_data);
        }
    }
}