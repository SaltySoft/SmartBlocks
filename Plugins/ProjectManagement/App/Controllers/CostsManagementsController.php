<?php

namespace ProjectManagement;

class CostsManagementsController extends \Controller
{
    public function app($params = array())
    {
        $this->set("app", "ProjectManagement/Apps/CostsManagement/app");
    }
}