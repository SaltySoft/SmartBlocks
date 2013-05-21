<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Antoine
 * Date: 5/21/13
 * Time: 12:06 AM
 * To change this template use File | Settings | File Templates.
 */

namespace Organization;


class TasksUsersController extends \Controller
{

    private function security_check()
    {
        return \User::logged_in();
    }

    private function return_json($response)
    {
        header("Content-Type: application/json");
        $this->render = false;
        echo json_encode($response);
    }

    private function json_error($message)
    {
        $this->return_json(array("success" => false, "error" => true, "message" => $message));
    }

    private function json_message($message)
    {
        $this->return_json(array("success" => true, "error" => false, "message" => $message));
    }

    public function index()
    {
        if ($this->security_check())
        {
            $em = \Model::getEntityManager();
            $qb = $em->createQueryBuilder();

            $qb->select("tu")
                ->from("\\Organization\\TaskUser", "tu")
                ->where("tu.user = :user AND tu.pending = true")
                ->setParameter("user", \User::current_user());

            $results = $qb->getQuery()->getResult();

            $response = array();

            foreach ($results as $tu) {
                $response[] = $tu->toArray();
            }
            $this->return_json($response);
        }
        else
        {
            $this->json_error("You have to be connected");
        }
    }

    public function show($params = array())
    {
        if ($this->security_check())
        {
            $task_user = TaskUser::find($params["id"]);
            if (is_object($task_user))
            {
                $this->return_json($task_user->toArray());
            }
            else
            {
                $this->json_error("The object could not be found");
            }
        }
        else
        {
            $this->json_error("You have to be connected");
        }
    }

    public function update($params = array())
    {
        if ($this->security_check())
        {
            $task_user = TaskUser::find($params["id"]);
            if (is_object($task_user))
            {
                $data = $this->getRequestData();

                $task_user->setPending($data["pending"]);
                $task_user->setAccepted($data["accepted"]);
                $task_user->save();
                $this->return_json($task_user->toArray());
            }
            else
            {
                $this->json_error("The object could not be found");
            }
        }
        else
        {
            $this->json_error("You have to be connected");
        }
    }

    public function destroy($params = array())
    {
        if ($this->security_check())
        {

        }
        else
        {
            $this->json_error("You have to be connected");
        }
    }
}