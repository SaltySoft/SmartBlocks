<?php
namespace ProjectManagement;

/**
 * @Entity @Table(name="pm_working_hours")
 */
class WorkingDuration extends \Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @Column(type="integer")
     */
    private $hours_number;

    /**
     * @Column(type="integer")
     */
    private $date;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $user;

    /**
     * @ManyToOne(targetEntity="Project", inversedBy="working_durations")
     */
    private $project;

    public function getId()
    {
        return $this->id;
    }

    public function setHoursNumber($hours_number)
    {
        $this->hours_number = $hours_number;
    }

    public function getHoursNumber()
    {
        return $this->hours_number;
    }

    public function setDate($date)
    {
        $this->date = $date;
    }

    public function getDate()
    {
        return $this->date;
    }

    public function setUser($user)
    {
        $this->user = $user;
    }

    public function getUser()
    {
        return $this->user;
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
        $myArray["hours_number"] = $this->hours_number;
        $myArray["date"] = $this->date;
        $myArray["project"] = $this->project->toArray();
        $myArray["user"] = $this->user->toArray();

        return $myArray;
    }
}