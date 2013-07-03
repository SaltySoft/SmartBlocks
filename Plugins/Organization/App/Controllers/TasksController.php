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
                ->andWhere("t.active = true")
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
                ->andWhere("t.active = true")
                ->setParameter("user", $user)
                ->orderBy("t.due_date");
        }

        $data = $this->getRequestData();
        if (isset($data["date"]))
        {
            $start = new \DateTime();
            $start->setTimestamp($data["date"]);
            $start->setTime(0,0,0);
            $end = new \DateTime();
            $end->setTimestamp($data["date"]);
            $end->setTime(23,59,59);
            $qb->andWhere("(t.due_date >= :start_date AND t.due_date < :stop_date)")
                ->setParameter("start_date", $start)
                ->setParameter("stop_date", $end);
        }

        if (isset($data["filter"]) && $data["filter"] = "undone")
        {
            $qb->andWhere("t.completion_date is NULL");
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
        $due_date = new \DateTime();
        $due_date->setTimestamp($data["due_date"]);
        $task->setDueDate($due_date);

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
            $due_date = new \DateTime();
            $due_date->setTimestamp($data["due_date"]);
            $task->setDueDate($due_date);

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
                $planned_task->setTask(null);
                $planned_task->setActive(false);
                $planned_task->save();
            }

            $task->setActive(false);
            $task->save();
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

    public function gcal_sync()
    {
        $this->render = false;
        $gcal_diplomat = new GoogleCalDiplomat();
////
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();
        $qb->select("pt")
            ->from("\\Organization\\PlannedTask", "pt")
            ->join("pt.task", "task")
            ->where("task.owner = :user")
            ->andWhere("pt.gcal_id is NULL")
            ->setParameter("user", \User::current_user());

        $planned_tasks = $qb->getQuery()->getResult();

        $gcal_diplomat->addEvents($planned_tasks);
//
        $list = $gcal_diplomat->getEvents();
        $ids = array();
        foreach ($list as $event)
        {
            $date = $event->getStart();

            $planned_tasks = PlannedTask::where(array("gcal_id" => $event->getId()));
            $ids[] = $event->getId();
            if (is_object($date) && $event->getSummary() != null && !isset($planned_tasks[0]))
            {
                $planned_task = new PlannedTask();

                $date = new \DateTime($date->getDateTime());
                $stop = $event->getEnd();
                if (is_object($stop))
                {
                    $stop = new \DateTime($stop->getDateTime());
                    $planned_task->setDuration($stop->getTimestamp() * 1000 - $date->getTimestamp() * 1000);
                }
                else
                {
                    $planned_task->setDuration(3600000);
                    $stop = new \DateTime($date->getTimestamp() + 3600);
                }
                $em = \Model::getEntityManager();
                $qb = $em->createQueryBuilder();
                $stop = clone $date;
                $stop->modify("+".($planned_task->getDuration() / 1000)." seconds");
                $qb->select("task")
                    ->from('\Organization\Task', 'task')
                    ->where('task.due_date >= :date')
                    ->andWhere('task.owner = :user')
                    ->andWhere('task.name = :name')
                    ->setParameter("date", $stop)
                    ->setParameter('user', \User::current_user())
                    ->setParameter('name', $event->getSummary());
                $tasks = $qb->getQuery()->getResult();
                echo $event->getSummary()."SUMMARY" . ($date->getTimestamp() - ($date->getTimestamp() % (24 * 3600))) . " " . ($date->getTimestamp() - ($date->getTimestamp() % (24 * 3600)) + 24 * 3600);
                if (isset($tasks[0]))
                {
                    $task = $tasks[0];
                    echo "\nTOOK EXISTING TASK\n";
                }
                else
                {
                    $task = new Task();
                }
                if (is_object($stop))
                {
                    $task->setDueDate($stop);
                }

                $task->setName($event->getSummary());
                $task->setOwner(\User::current_user());
                $task->save();
                $planned_task->setTask($task);
                $planned_task->setStart($date);
                $planned_task->setGcalId($event->getId());

                \Model::persist($planned_task);
            }
            else
            {
                $gcal_diplomat->updateEvent($planned_tasks[0], $event);
            }
        }

        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();

        $qb->select("pt")
                ->from('\Organization\PlannedTask', 'pt')
                ->leftJoin("pt.task", "task")
                ->where("task.owner = :user")
                ->setParameter("user", \User::current_user())
                ->andWhere("pt.gcal_id is not NULL")
                ->andWhere("pt.active = true");
        $i = 0;
        foreach ($ids as $id)
        {
            $qb->andWhere("pt.gcal_id <> :id" . $i)
                ->setParameter("id" . $i++, $id);
        }
        $result = $qb->getQuery()->getResult();
        echo $qb->getQuery()->getDql();
        foreach ($result as $pt)
        {
            $pt->setActive(false);
            \Model::persist($pt);
        }

        \Model::flush();
        $gcal_diplomat->setLastSync();
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
                        $stop = clone $date;
                        $stop->modify("- 23 hours");
                        $stop->modify("- 59 minutes");
                        $stop->modify("- 59 seconds");
                        $task->setDueDate($stop);
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

                                $task->setDueDate($stop);
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

            $yesterday = new \DateTime();
            $yesterday->modify("- 1 day");

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
                ->setParameter("yesterday", $yesterday);
            $tasks_ = $qb->getQuery()->getResult();
            foreach ($tasks_ as $task)
            {
                $task->delete();
            }

            $qb = $em->createQueryBuilder();

            $qb->select("t")
                ->from("\\Organization\\Task", "t")
                ->where("t.owner = :user")
                ->setParameter("user", \User::current_user());

            $results = $qb->getQuery()->getResult();

//            $todoist_diplomat->setLastSynced();
            echo json_encode($todoist_diplomat->addItems($results));
        }
    }
}