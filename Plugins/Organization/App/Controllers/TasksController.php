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
                ->leftJoin("t.tags", "ta")
                ->where("t.owner = :user OR (tu.user = :user)")
                ->andWhere("t.active = true")
                ->andWhere("t.parent is NULL")
                ->setParameter("user", \User::current_user())
                ->orderBy("t.due_date");
        else
        {
            $users = \User::where(array("token" => $_GET["token"]));
            $user = $users[0];
            $qb->select("t")
                ->from("\\Organization\\Task", "t")
                ->leftJoin("t.linked_users", "tu")
                ->leftJoin("t.tags", "ta")
                ->where("t.owner = :user OR (tu.user = :user)")
                ->andWhere("t.active = true")
                ->andWhere("t.parent is NULL")
                ->setParameter("user", $user)
                ->orderBy("t.due_date");
        }

        $data = $this->getRequestData();
        if (isset($data["date"]))
        {
            $start = new \DateTime();
            $start->setTimestamp($data["date"]);
            $start->setTime(0, 0, 0);
            $end = new \DateTime();
            $end->setTimestamp($data["date"]);
            $end->setTime(23, 59, 59);
            $qb->andWhere("(t.due_date >= :start_date AND t.due_date < :stop_date)")
                ->setParameter("start_date", $start)
                ->setParameter("stop_date", $end);
        }

        if (isset($data["filter"]) && $data["filter"] == "undone")
        {
            $qb->andWhere("t.completion_date is NULL");
        }

        if (isset($data["name"]) && $data["name"] != "")
        {
            $qb->andWhere("upper(t.name) LIKE :name")
                ->setParameter("name", '%' . strtoupper($data["name"]) . '%');
        }

        if (isset($data["tags_str"]) && $data["tags_str"] != "")
        {
            $tags_id = explode(",", $data["tags_str"]);
            $tags_query = "";
            foreach ($tags_id as $tag_id)
            {
                $tag = TaskTag::find($tag_id);
                if (is_object($tag))
                {
                    if ($tags_query != "")
                        $tags_query .= " OR ";
                    $tags_query .= "ta = :tag" . $tag_id;
                }
                $qb->setParameter("tag" . $tag_id, $tag);
            }

            if ($tags_query != "")
            {
                $qb->andWhere($tags_query);
            }
        }

        $results = $qb->getQuery()->getResult();
        $return_array = $results;
        if (isset($data["filter"]) && $data["filter"] == "undone")
        {
            $return_array = new  \Doctrine\Common\Collections\ArrayCollection();
            foreach ($results as $result)
            {
                $count = 0;
                $duration = $result->getRequiredTime() / 1000;
                $furthest_end = new \DateTime();
                $furthest_end->setTimestamp(0);
                foreach ($result->getPlannedTasks() as $pt)
                {
                    $furthest_end = new \DateTime();
                    $end = $pt->getStart()->getTimestamp() + $pt->getDuration() / 1000;
                    $count += $pt->getDuration() / 1000;
                    if ($furthest_end->getTimestamp() < $end)
                    {
                        $furthest_end->setTimestamp($end);
                    }
                }
                if ($count < $duration || $furthest_end->getTimestamp() > (new \DateTime())->getTimestamp())
                {
                    $return_array->add($result);
                }
            }
        }
        $results = $return_array;
        if (isset($data["tags"]) && $data["tags"] != "")
        {

            $tags = explode(",", $data["tags"]);
            if (count($tags) > 0)
            {
                $return_array = new  \Doctrine\Common\Collections\ArrayCollection();
                foreach ($results as $result)
                {
                    foreach ($result->getTags() as $task_tag)
                    {
                        foreach ($tags as $tag)
                            if ($tag != "" && strpos($task_tag->getName(), $tag) !== FALSE)
                            {
                                $return_array->add($result);
                            }
                    }
                }
            }
            $results = $return_array;
        }

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
        $task->setDescription(isset($data["description"]) ? $data["description"] : "");
        if (isset($data["required_time"]))
        {
            $task->setRequiredTime($data["required_time"]);
        }
        if (isset($data["due_date"]))
        {
            $due_date = new \DateTime();
            $due_date->setTimestamp($data["due_date"]);
            $task->setDueDate($due_date);
        }

        if (isset($_GET["token"]) && $_GET["token"] != "")
        {
            $users = \User::where(array("token" => $_GET["token"]));
            $user = $users[0];
            $task->setOwner($user);
        }

        if (isset($data["tags"]))
        {
            foreach ($data["tags"] as $tag_a)
            {
                $tag = TaskTag::find($tag_a);
                if (is_object($tag))
                {
                    $task->getTags()->add($tag);
                }
            }
        }

        if (isset($data["active"]))
        {
            $task->setActive($data["active"]);
        }

        if (isset($data["creation_date"]))
        {
            $task->setCreationDate($data["creation_date"]);
        }

        if (isset($data['deadline']))
        {
            $deadline = Deadline::find($data['deadline']);
            if (is_object($deadline))
            {
                $task->setDeadline($deadline);
            }
        }

        if (isset($data["parent"]))
        {
            if (is_array($data["parent"]))
            {
                $parent = Task::find($data["parent"]["id"]);
                if (is_object($parent))
                {
                    $task->setParent($parent);
                }
            }
            else
            {
                $task->setParent(null);
            }
        }

        if (isset($data["children"]))
        {
            $task->getChildren()->clear();
            foreach ($data["children"] as $child_a)
            {
                $child = Task::find($child_a["id"]);
                if (is_object($child))
                {
                    $task->getChildren()->add($child);
                }
            }
        }


        $task->save();

        if (isset($data["activity"]))
        {
            $activity = Activity::find($data["activity"]["id"]);
            if (is_object($activity))
            {
                $activity->getTasks()->add($task);
                $activity->save();
            }
        }
        if (isset($data["activities"]))
        {
            if (is_array($data["activities"]))
            {
                foreach ($data["activities"] as $activity_array)
                {
                    $activity = Activity::find($activity_array["id"]);
                    if (is_object($activity))
                    {
                        $activity->getTasks()->add($task);
                        $activity->save();
                    }
                }
            }
        }
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
            $task->setDescription(isset($data["description"]) ? $data["description"] : "");
            $task->setCompletionDate($data["completion_date"]);
            $task->setOrderIndex($data["order_index"]);
            if (isset($data["required_time"]))
            {
                $task->setRequiredTime($data["required_time"]);
            }

            if (isset($data["due_date"]))
            {
                $due_date = new \DateTime();
                $due_date->setTimestamp($data["due_date"]);
                $task->setDueDate($due_date);
            }
            else
            {
                $task->setDueDate(null);
            }

            if (isset($data["parent"]))
            {
                $parent = Task::find($data["parent"]["id"]);
                if (is_object($parent))
                {
                    $task->setParent($parent);
                }
            }


            if (isset($data["tags"]))
            {
                $task->getTags()->clear();

                foreach ($data["tags"] as $tag_a)
                {
                    $tag = TaskTag::find($tag_a["id"]);
                    if (is_object($tag))
                    {
                        $task->getTags()->add($tag);
                    }
                }
            }

            if (isset($data["creation_date"]))
            {
                $task->setCreationDate($data["creation_date"]);
            }

            if (isset($data["active"]))
            {
                $task->setActive($data["active"]);
            }

            if (isset($data['deadline']))
            {
                $deadline = Deadline::find($data['deadline']);
                if (is_object($deadline))
                {
                    $task->setDeadline($deadline);
                }
            }

            $em = \Model::getEntityManager();
            if (isset($data["children"]))
            {

                foreach ($task->getChildren() as $child)
                {
                    $child->setParent(null);
                    $em->persist($child);
                }


                foreach ($data["children"] as $child_a)
                {
                    $child = Task::find($child_a["id"]);
                    if (is_object($child))
                    {
                        $child->setParent($task);
                        $em->persist($child);
                    }
                }
                $em->flush();
            }

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


//            $task->setActive(false);
//            $task->save();
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

    public function gcal_link()
    {
        $this->render = false;
        $api_key = GoogleCalDiplomat::authenticate($_POST["google_calendar_id"]);
        if (is_object($api_key))
        {
            $this->json_message("Your account has been linked");
        }
        else
        {
            $this->json_error("Your account could not be linked");
        }

    }

    /**
     *
     */
    public function gcal_sync()
    {
        $this->render = false;
        $gcal_diplomat = new GoogleCalDiplomat();
        if ($gcal_diplomat->isReady())
        {
            $em = \Model::getEntityManager();
            $qb = $em->createQueryBuilder();
            $qb->select("pt")
                ->from("\\Organization\\PlannedTask", "pt")
                ->join("pt.task", "task")
                ->where("task.owner = :user")
                ->andWhere("pt.gcal_id is NULL")
                ->setParameter("user", \User::current_user());

            $planned_tasks = $qb->getQuery()->getResult();

            //Distant update
            $gcal_diplomat->addEvents($planned_tasks);

            $list = $gcal_diplomat->getEvents();
            $ids = array();

            //Local update - Looping through gcal events
            //
            foreach ($list as $event)
            {
                $date = $event->getStart();

                $planned_tasks = PlannedTask::where(array("gcal_id" => $event->getId()));
                $ids[] = $event->getId();
                if (is_object($date) && $event->getSummary() != null && !isset($planned_tasks[0]))
                {
                    $planned_task = new PlannedTask();
                    $planned_task->setValidated(false);

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
                    $stop->modify("+" . ($planned_task->getDuration() / 1000) . " seconds");
                    $qb->select("task")
                        ->from('\Organization\Task', 'task')
                        ->where('task.due_date >= :date')
                        ->andWhere('task.owner = :user')
                        ->andWhere('task.name = :name')
                        ->setParameter("date", $stop)
                        ->setParameter('user', \User::current_user())
                        ->setParameter('name', $event->getSummary());
                    $tasks = $qb->getQuery()->getResult();
                    if (isset($tasks[0]))
                    {
                        $task = $tasks[0];
                        echo "\nTOOK EXISTING TASK\n";
                        $planned_task->setTask($task);
                        $planned_task->setStart($date);
                        $planned_task->setGcalId($event->getId());

                        \Model::persist($planned_task);

                    }
                }
                else
                {
                    $gcal_diplomat->updateEvent($planned_tasks[0], $event);
                }
            }


            //End of local update

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
    }

    /**
     * This function syncs planned tasks with Todoist.
     * That way the user can use his todoist app on his phone to visualize which
     * tasks he has to work on today.
     *
     * How it all works :
     *
     * First, we get data from Todoist, to see if updates were made on planned tasks there.
     * We update our planned tasks locally if they are older than the update of todoist.
     *
     * Then we call a function from the todoist diplomat that will send all our updated local
     * data to todoist, updating the distant data.
     */
    public function todoist_sync()
    {
        $this->render = false;
        $em = \Model::getEntityManager();
        $todoist_diplomat = new TodoistDiplomat();
        $ids = array();
        $items = array();
        if ($todoist_diplomat->isReady())
        {

            $todoist_data = $todoist_diplomat->get(); //Get state of todoist
            foreach ($todoist_data["Projects"] as $project)
            {

                $completed_items = $todoist_diplomat->getCompletedItems($project["id"]);
                $uncompleted_items = $todoist_diplomat->getUncompletedItems($project["id"]);
                $p_items = array_merge($completed_items, $uncompleted_items);

                foreach ($p_items as $item)
                {
                    $item["last_updated"] = $project["last_updated"];
                    $item["project_id"] = $project["id"];
                    $items[] = $item;
                }

            }
            foreach ($items as $item)
            {
                //Looping through items to update our local planned tasks (validation only)
                $ids[] = $item["id"];

                $pts = PlannedTask::where(array('todoist_id' => $item["id"]));

                if (isset($pts[0]))
                {
                    $pt = $pts[0];
                    if ($pt->getLastUpdated() - 3600 < round($item["last_updated"]))
                    {
                        $pt->setValidated($item["checked"] == 1);

                        $em->persist($pt);
                    }
                    $pt->setTodoistProjId($item["project_id"]);
                }
            }

            $em->flush();


            $qb = $em->createQueryBuilder();

            $qb->select("pts")
                ->from("\\Organization\\PlannedTask", "pts")
                ->where("pts.owner = :user")
                ->setParameter("user", \User::current_user());

            $results = $qb->getQuery()->getResult();

            $todoist_diplomat->setLastSynced();
            //Call to the todoist diplomat function to add planned tasks.
            $this->return_json($todoist_diplomat->addItems($results));
        }
    }
}