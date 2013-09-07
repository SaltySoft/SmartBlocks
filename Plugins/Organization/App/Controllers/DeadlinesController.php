<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 9/7/13
 * Time: 12:26 PM
 */

namespace Organization;


class DeadlinesController extends \Controller
{

    public function index()
    {
        $em = \Model::getEntityManager();

        $qb = $em->createQueryBuilder();
        $qb->select("d")->from('\Organization\Deadline', 'd')->where('d.creator = :user');
        $qb->setParameter('user', \User::current_user());

        $query_response = $qb->getQuery()->getResult();
        $response = array();

        foreach ($query_response as $deadline)
        {
            $response[] = $deadline->toArray();
        }

        $this->return_json($response);

    }

    public function show($params = array())
    {
        $deadline = Deadline::find($params["id"]);

        if (is_object($deadline))
        {
            if ($deadline->getCreator() == \User::current_user())
            {
                $response = $deadline->toArray();
                $this->return_json($response);
            }
            else
            {
                $this->json_error("unauthorized_request", 401);
            }
        }
        else
        {
            $this->json_error("not_found", 404);
        }
    }

    private function save($data, $id = null)
    {
        if ($id != null)
        {
            $deadline = Deadline::find($id);
        }
        else
        {
            $deadline = new Deadline();
        }

        $deadline->setName($data["name"]);
        if (isset($data["archived"]))
            $deadline->setArchived($data["archived"]);
        if (isset($data["activity"]) && is_array($data["activity"]))
        {
            $activity = Activity::find($data["activity"]["id"]);
            if (is_object($activity))
            {
                $deadline->setActivity($activity);
            }
        }

        $start = new \DateTime();
        $start->setTimestamp($data["start"] / 1000);
        $stop = new \DateTime();
        $stop->setTimestamp($data["stop"] / 1000);

        $deadline->setStartTime($start);
        $deadline->setStopTime($stop);

        if ($deadline->getCreator() == \User::current_user())
        {
            $deadline->save();
            return $deadline;
        }
        else
        {
            return null;
        }

    }

    public function create()
    {
        $data = $this->getRequestData();
        $deadline = $this->save($data);

        if (is_object($deadline))
        {
            $response = $deadline->toArray();
            $this->return_json($response);
        }
        else
        {
            $this->json_error("unauthorized_request", 401);
        }

    }

    public function update($params = array())
    {
        $data = $this->getRequestData();
        $deadline = $this->save($data, $params["id"]);

        if (is_object($deadline))
        {
            $response = $deadline->toArray();
            $this->return_json($response);
        }
        else
        {
            $this->json_error("unauthorized_request", 401);
        }
    }

    public function destroy($params = array())
    {
        $deadline = Deadline::find($params["id"]);
        if ($deadline->getCreator() == \User::current_user())
        {
            $deadline->delete();
            $this->json_message("deadline_deleted");
        }
        else
        {
            $this->json_error("unauthorized_request", 401);
        }
    }

}