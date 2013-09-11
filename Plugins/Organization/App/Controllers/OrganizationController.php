<?php

namespace Organization;

class OrganizationController extends \Controller
{

    public function sec_check()
    {
        if (!\User::logged_in() || !\User::is_admin())
        {
            $this->redirect("/Organization/Organization/unauthorized");
        }
    }

    public function unauthorized()
    {
        header("HTTP/1.0 401 Unauthorized");
        $this->render = false;
    }

    public function install()
    {
        $this->render = false;
        $this->sec_check();

        $task_types = Task::getTypes();

        foreach ($task_types as $key => $typearray)
        {
            $existings = TaskType::where(array("name" => $key));
            if (!isset($existings[0]))
            {
                $type = new TaskType();
                $type->setName($key);
                $type->setColor(isset($typearray["color"]) ? $typearray["color"] : "#888888");
                $type->save();
            }
            else
            {
                $existings[0]->setColor(isset($typearray["color"]) ? $typearray["color"] : "#888888");
                $existings[0]->save();
            }
        }


    }

}