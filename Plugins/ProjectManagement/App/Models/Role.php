<?php
namespace ProjectManagement;

/**
 * @Entity @Table(name="pm_role")
 */
class Role extends \Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $user;

    /**
     * @ManyToOne(targetEntity="\ProjectManagement\Project")
     */
    private $project;

    /**
     * @Column(type="string")
     */
    public $name;

    /**
     * @Column(type="integer")
     */
    public $cost;

    public function setCost($cost)
    {
        $this->cost = $cost;
    }

    public function getCost()
    {
        return $this->cost;
    }

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setProject($project)
    {
        $this->project = $project;
    }

    public function getProject()
    {
        return $this->project;
    }

    public function setUser($user)
    {
        $this->user = $user;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function toArray($full = true)
    {
        $myArray = array();
        $myArray["id"] = $this->id;
        $myArray["name"] = $this->name;
        $myArray["cost"] = $this->cost;
        $myArray["user"] = $this->user->toArray();
        $myArray["project"] = $this->project->toArray();

        return $myArray;
    }
}