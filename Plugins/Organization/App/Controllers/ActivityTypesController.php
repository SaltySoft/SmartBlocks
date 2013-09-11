<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 7/12/13
 * Time: 1:17 PM
 */

namespace Organization;


class ActivityTypesController extends \Controller
{

    public function index($params = array())
    {
        $em = \Model::getEntityManager();

        $qb = $em->createQueryBuilder();

        $qb->select("type")->from('\Organization\ActivityType', 'type');

        $result = $qb->getQuery()->getResult();

        $response = array();

        foreach ($result as $type)
        {
            $response[] = $type->toArray();
        }

        $this->return_json($response);
    }

    public function show($params = array())
    {
        $type = ActivityType::find($params["id"]);

        if (is_object($type))
        {
            $this->return_json($type->toArray());
        }
        else
        {
            $this->json_error("This activity type does not exist", 404);
        }
    }

    public function create($params = array())
    {
        $data = $this->getRequestData();

        $type = new ActivityType();
        $type->setCreator(\User::current_user());
        $type->setName($data["name"]);
        $type->setColor(isset($data["color"]) ? $data["color"] : null);


        $type->save();
        $this->return_json($type->toArray());
    }

    public function update($params = array())
    {
        $data = $this->getRequestData();
        $type = ActivityType::find($params["id"]);

        if (is_object($type))
        {
            if ($type->getCreator() == \User::current_user())
            {
                $type->setName($data["name"]);
                $type->setColor(isset($data["color"]) ? $data["color"] : null);
                $type->save();
                $this->return_json($type->toArray());
            }
            else
            {
                $this->json_error("You cannot update an activity type you didn't create", 401);
            }

        }
        else
        {
            $this->json_error("This activity type does not exist", 404);
        }
    }

    public function destroy($params = array())
    {
        $type = ActivityType::find($params["id"]);

        if (is_object($type))
        {
            if ($type->getCreator() == \User::current_user())
            {
                try
                {
                    $type->delete();
                    $this->json_message("success");
                }
                catch (PotentialOrphanException $ex)
                {
                    $this->json_error("You cannot delete a type that has activities linked", 406);
                }
            }
            else
            {
                $this->json_error("You cannot update an activity type you didn't create", 401);
            }
        }
        else
        {
            $this->json_error("This activity type does not exist", 404);
        }
    }
}