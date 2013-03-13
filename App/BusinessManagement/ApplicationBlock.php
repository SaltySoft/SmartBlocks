<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Antoine
 * Date: 3/1/13
 * Time: 2:15 AM
 * To change this template use File | Settings | File Templates.
 */
class ApplicationBlock
{
    private $name = "";
    private $description = "";
    private $apps = array();

    public function addApp($app)
    {
        $this->apps[] = $app;
    }

    public function getApps()
    {
        return $this->apps;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getName()
    {
        return $this->name;
    }

    public function toArray()
    {
        $appBlockArray = array();
        $appBlockArray["name"] = $this->name;
        $appBlockArray["description"] = $this->description;
        $appsArray = array();

        foreach ($this->getApps() as $app)
        {
            $appsArray[] = $app->toArray();
        }
        $appBlockArray["apps"] = $appsArray;

        return $appBlockArray;
    }
}
