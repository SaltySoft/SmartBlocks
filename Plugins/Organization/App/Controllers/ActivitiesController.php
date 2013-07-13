<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 7/12/13
 * Time: 12:09 PM
 */

namespace Organization;


use Doctrine\DBAL\Types\Type;

class ActivitiesController extends \Controller
{
    public function index($params = array())
    {
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();
        $qb->select("activity")->from('\Organization\Activity', 'activity');
        $qb->leftJoin("activity.tasks", "task")->leftJoin("task.linked_users", "linked_user");
        $qb->where("activity.creator = :user OR task.owner = :user OR linked_user = :user");
        $qb->setParameter("user", \User::current_user());
        $result = $qb->getQuery()->getResult();
        $response = array();
        foreach ($result as $activity)
        {
            $response[] = $activity->toArray();
        }
        $this->return_json($response);
    }

    public function show($params = array())
    {
        $activity = Activity::find($params["id"]);
        if (is_object($activity))
        {
            $this->return_json($activity->toArray());
        }
        else
        {
            $this->json_error("This activity does not exist", 404);
        }
    }

    public function create($params = array())
    {
        $data = $this->getRequestData();

        $activity = new Activity();
        $activity->setName($data["name"]);
        $activity->setArchived(isset($data["archived"]) ? $data["archived"] : false);
        $activity->setDescription(isset($data["description"]) ? $data["description"] : null);
        $activity->setCreator(\User::current_user());
        if (isset($data["type"])) {
            if (is_array($data["type"])) {
                $type = ActivityType::find($data["type"]["id"]);
            } else {
                $type = ActivityType::find($data["type"]);
            }

            if (is_object($type))
            {
                $activity->setType($type);
                $activity->save();

                $this->return_json($activity->toArray());
            }
            else
            {
                $this->json_error("The provided type does not exist", 404);
            }
        } else {
            $this->json_error("You must provide a type", 406);
        }



    }

    public function update($params = array())
    {
        $data = $this->getRequestData();
        $activity = Activity::find($params["id"]);
        if (is_object($activity))
        {
            if ($activity->getCreator() == \User::current_user())
            {
                $activity->setName($data["name"]);
                if (isset($data["archived"]))
                    $activity->setArchived($data["archived"]);
                $activity->setDescription(isset($data["description"]) ? $data["description"] : null);
                $activity->getTasks()->clear();
                foreach ($data["tasks"] as $task_array)
                {
                    $task = Task::find($task_array["id"]);
                    if (is_object($task))
                    {
                        $activity->getTasks()->add($task);
                    }
                }
                $type = ActivityType::find($data["type"]["id"]);
                if (is_object($type))
                {
                    $activity->setType($type);
                    $activity->save();
                    $this->return_json($activity->toArray());
                }
                else
                {
                    $this->json_error("The provided type does not exist", 404);
                }
            }
            else
            {
                $this->json_error("You can't update an activity you didn't create", 401);
            }
        }
        else
        {
            $this->json_error("This activity does not exist", 404);
        }
    }

    public function destroy($params = array())
    {
        $activity = Activity::find($params["id"]);
        if (is_object($activity))
        {
            if ($activity->getCreator() == \User::current_user())
            {
                $activity->delete();
                $this->json_message("Success");
            }
            else
            {
                $this->json_error("You can't delete an activity you didn't create", 401);
            }
        }
        else
        {
            $this->json_error("This activity does not exist", 404);
        }
    }
}