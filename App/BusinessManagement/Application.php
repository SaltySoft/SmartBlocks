<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Antoine
 * Date: 3/1/13
 * Time: 2:14 AM
 * An application is an entity registered inside the kernel.
 * This kind of entity represents all the applications of blocks.
 */
class Application
{
    private $id = 0;
    private $name = "";
    private $description = "";
    private $link = "";

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setLink($link)
    {
        $this->link = $link;
    }

    public function getLink()
    {
        return $this->link;
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
        $appArray = array();
        $appArray["name"] = $this->name;
        $appArray["description"] = $this->description;
        $appArray["link"] = $this->link;

        return $appArray;
    }
}
