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
     * @Column(type="integer")
     */
    private $order_index;

    /**
     * @ManyToOne(targetEntity="\Organization\Task")
     */
    private $task;

    public function __construct()
    {
        $this->description = "New subtask";
        $this->description = "";
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
}