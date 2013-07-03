<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 7/1/13
 * Time: 5:35 PM
 */

namespace Organization;


class TaskTypesController extends \Controller
{

    public function index()
    {
        $em = \Model::getEntityManager();

        $qb = $em->createQueryBuilder();

        $qb->select("task_type")
         ->from('\Organization\TaskType', "task_type");

        $this->render = false;

        $results = $qb->getQuery()->getResult();

        $response = array();

        foreach ($results as $type)
        {
            $response[] = $type->toArray();
        }

        $this->return_json($response);
    }
}