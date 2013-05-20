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

    /**
     * @OneToMany(targetEntity="\ProjectManagement\WorkingDuration", mappedBy="project")
     */
    private $working_durations;

    public function __construct()
    {
        $this->working_durations = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function addUser($user)
    {
        $this->users[] = $user;
    }

    public function getUsers()
    {
        return $this->users;
    }

    public function addWorkingDurations($working_duration)
    {
        $this->working_durations[] = $working_duration;
    }

    public function getWorkingDurations()
    {
        return $this->working_durations;
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

    public function toArray($full = true)
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
        $workingDurations = array();
        if ($full)
        {
            foreach ($this->working_durations as $working_duration)
            {
                $workingDurations[] = $working_duration->toArray(false);
            }
            $myArray["working_durations"] = $workingDurations;
        }

        return $myArray;
    }
}