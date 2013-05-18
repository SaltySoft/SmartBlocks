<?php

namespace WorkingHours;

class WorkingHoursController extends \Controller
{
    public function security_check()
    {
        if (!\User::logged_in() || \User::current_user() == null)
        {
            $this->redirect("/Users/login_form");
        }
    }

    public function app($params = array())
    {
        $this->set("app", "ProjectManagement/Apps/WorkingHours/app");
    }
}