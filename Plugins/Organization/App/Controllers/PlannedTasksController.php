<?php

namespace Organization;

class PlannedTasksController extends \Controller
{
    public function index()
    {
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();

        $qb->select("pt")
            ->from("\\Organization\\PlannedTask", "pt")
            ->join("pt.task", "t")
            ->where("t.owner = :user")
            ->andWhere('pt.active = true')
            ->setParameter("user", \User::current_user());

        $data = $this->getRequestData();

        if (isset($data["date"]))
        {
            $start = new \DateTime();
            $start->setTimestamp($data["date"] / 1000);
            $start->setTime(0, 0, 0);
            $stop = new \DateTime();
            $stop->setTimestamp($data["date"] / 1000);
            $stop->setTime(23, 59, 59);
            $qb->andWhere("pt.start >= :start AND pt.start <= :stop")
                ->setParameter("start", $start)
                ->setParameter("stop", $stop);
        }


        $results = $qb->getQuery()->getResult();

        $response = array();
        foreach ($results as $pt)
        {
            $response[] = $pt->toArray();
        }

        $this->render = false;
        header("Content-type: application/json");
        echo json_encode($response);
    }

    public function show($params = array())
    {
        $planned_task = PlannedTask::find($params["id"]);
        if (is_object($planned_task) && $planned_task->getTask()->getOwner()->getId() == \User::current_user()->getId())
        {
            $response = $planned_task->toArray();
        }
        else
        {
            $response = array("status" => "error", "message" => "Planned task not found");
        }
        $this->render = false;
        header("Content-type: application/json");
        echo json_encode($response);
    }

    public function create()
    {
        $data = $this->getRequestData();
        $planned_task = new PlannedTask();

        $task = Task::find($data["task"]["id"]);
        if (is_object($task) && $task->getOwner()->getId() == \User::current_user()->getId())
        {
            $planned_task->setTask($task);
            $planned_task->setDuration($data["duration"]);
            $date = new \DateTime();
            $date->setTimestamp($data["start"] / 1000);
            $planned_task->setStart($date);
            $planned_task->save();
            $response = $planned_task->toArray();
        }
        else
        {
            $response = array("status" => "error", "message" => "Task not found");
        }


        $this->render = false;
        header("Content-type: application/json");
        echo json_encode($response);
    }

    public function update($params = array())
    {
        $planned_task = PlannedTask::find($params["id"]);
        if (is_object($planned_task) && $planned_task->getTask()->getOwner()->getId() == \User::current_user()->getId())
        {
            $data = $this->getRequestData();

            $task = Task::find($data["task"]["id"]);
            if (is_object($task))
            {
                $planned_task->setTask($task);
                $planned_task->setDuration($data["duration"]);
                $date = new \DateTime();
                $date->setTimestamp($data["start"] / 1000);
                $planned_task->setStart($date);
                $planned_task->save();
                $response = $planned_task->toArray();
            }
            else
            {
                $response = array("status" => "error", "message" => "Task not found");
            }
        }
        else
        {
            $response = array("status" => "error", "message" => "Planned task not found");
        }
        $this->render = false;
        header("Content-type: application/json");
        echo json_encode($response);
    }

    public function destroy($params = array())
    {
        $planned_task = PlannedTask::find($params["id"]);
        if (is_object($planned_task) && $planned_task->getTask()->getOwner()->getId() == \User::current_user()->getId())
        {
            $planned_task->setActive(false);
            $planned_task->save();
            $response = array("status" => "success", "message" => "Planned task successfully destroyed");
        }
        else
        {
            $response = array("status" => "error", "message" => "Planned task not found");
        }
        $this->render = false;
        header("Content-type: application/json");
        echo json_encode($response);
    }
}