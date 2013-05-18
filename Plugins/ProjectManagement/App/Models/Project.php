<?php
namespace ProjectManagement;

/**
 * @Entity @Table(name="pm_projects")
 */
class Project extends \Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @Column(type="string")
     */
    private $name;

    /**
     * @ManyToMany(targetEntity="\User")
     * @JoinTable(name="pm_project_user")
     */
    private $users;

    /*
     * @OneToMany(targetEntity="WorkingHour", mappedBy="project")
     * @JoinTable(name="pm_project_user")
     */
    private $working_hours;

    public function addUser($user)
    {
        $this->users[] = $user;
    }

    public function getUsers()
    {
        return $this->users;
    }

    public function addWorkingHours($working_hours)
    {
        $this->working_hours[] = $working_hours;
    }

    public function getWorkingHours()
    {
        return $this->working_hours;
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

    public function toArray()
    {
        $myArray = array();
        $myArray["id"] = $this->id;
        $myArray["name"] = $this->name;
        $users = array();
        foreach ($this->users as $user)
        {
            $users[] = $user->toArray();
        }
        $myArray["users"] = $users;
        $workingHours = array();
        foreach ($this->working_hours as $working_hour)
        {
            $workingHours[] = $working_hour->toArray();
        }
        $myArray["working_hours"] = $workingHours;

        return $myArray;
    }
}