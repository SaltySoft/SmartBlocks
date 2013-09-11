<?php

namespace Organization;

/**
 * @Entity @Table(name="subtasks")
 */
class Subtask extends \Model
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
     * @Column(type="text")
     */
    private $description;

    /**
     * @Column(type="bigint")
     */
    private $duration;

    /**
     * @Column(type="boolean")
     */
    private $finished;

    /**
     * @Column(type="integer", nullable=true)
     */
    private $order_index;

    /**
     * @ManyToOne(targetEntity="\Organization\Task", inversedBy="subtasks")
     */
    private $task;

    public function __construct()
    {
        $this->name = "New subtask";
        $this->description = "New subtask description.";
        $this->duration = 0;
        $this->finished = false;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getDescription()
    {
        return $this->description;
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

    public function setTask($task)
    {
        $this->task = $task;
    }

    public function getTask()
    {
        return $this->task;
    }

    public function setOrderIndex($order_index)
    {
        $this->order_index = $order_index;
    }

    public function getOrderIndex()
    {
        return $this->order_index;
    }

    public function setDuration($duration)
    {
        $this->duration = $duration;
    }

    public function getDuration()
    {
        return $this->duration;
    }

    public function setFinished($finished)
    {
        $this->finished = $finished;
    }

    public function getFinished()
    {
        return $this->finished;
    }

    public function toArray($full = true)
    {
        $myArray = array();
        $myArray["id"] = $this->id;
        $myArray["name"] = $this->name;
        $myArray["description"] = $this->description;
        $myArray["duration"] = $this->duration;
        $myArray["finished"] = $this->finished;
        $myArray["order_index"] = $this->order_index;
        if ($full)
        {
            $myArray["task"] = $this->task->toArray(true, true, true, true, false);
        }

        return $myArray;
    }
}