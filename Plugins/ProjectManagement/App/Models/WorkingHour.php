<?php
namespace ProjectManagement;

/**
 * @Entity @Table(name="pm_working_hours")
 */
class WorkingHour extends \Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @Column(type="integer")
     */
    private $number;

    /**
     * @ManyToMany(targetEntity="\User")
     * @JoinTable(name="pm_workinghour_user")
     */
    private $users;

    /**
     * @ManyToOne(targetEntity="Project", inversedBy="working_hours")
     */
    private $project;

    public function setUsers($users)
    {
        $this->users = $users;
    }

    public function addUser($user)
    {
        $this->users[] = $user;
    }

    public function getUsers()
    {
        return $this->users;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setNumber($number)
    {
        $this->number = $number;
    }

    public function getNumber()
    {
        return $this->number;
    }

    public function setProject($project)
    {
        $this->project = $project;
    }

    public function getProject()
    {
        return $this->project;
    }

    public function toArray()
    {
        $myArray = array();
        $myArray["id"] = $this->id;
        $myArray["number"] = $this->number;
        $myArray["project"] = $this->project->toArray();
        $users = array();
        foreach ($this->users as $user)
        {
            $users[] = $user->toArray();
        }
        $myArray["users"] = $users;

        return $myArray;
    }
}