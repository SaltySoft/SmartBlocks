<?php
/**
 * Copyright (C) 2013 Antoine Jackson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */

namespace Organization;

/**
 * @Entity @Table(name="tasks")
 */
class Task extends \Model
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
     * @ManyToOne(targetEntity="\User")
     */
    private $owner;

    /**
     * @OneToMany(targetEntity="\Organization\TaskUser", mappedBy="task")
     */
    private $linked_users;

    /**
     * @Column(type="integer")
     */
    private $creation_date;

    /**
     * @Column(type="integer", nullable=true)
     */
    private $completion_date;

    /**
     * @Column(type="integer", nullable=true)
     */
    private $due_date;

    /**
     * @Column(type="integer")
     */
    private $order_index;

    /**
     * @OneToMany(targetEntity="\Organization\PlannedTask", mappedBy="task")
     */
    private $planned_tasks;

    public function __construct()
    {
        $this->owner = \User::current_user();
        $this->name = "New task";
        $this->creation_date = time();
        $this->order_index = self::count() + 1;
        $this->linked_users = new \Doctrine\Common\Collections\ArrayCollection();
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

    public function setOwner($creator)
    {
        $this->owner = $creator;
    }

    public function getOwner()
    {
        return $this->owner;
    }

    public function setCompletionDate($completion_date)
    {
        $this->completion_date = $completion_date;
    }

    public function getCompletionDate()
    {
        return $this->completion_date;
    }

    public function setCreationDate($creation_date)
    {
        $this->creation_date = $creation_date;
    }

    public function getCreationDate()
    {
        return $this->creation_date;
    }

    public function setOrderIndex($order_index)
    {
        $this->order_index = $order_index;
    }

    public function getOrderIndex()
    {
        return $this->order_index;
    }

    public function setDueDate($due_date)
    {
        $this->due_date = $due_date;
    }

    public function getDueDate()
    {
        return $this->due_date;
    }

    public function setLinkedUsers($linked_users)
    {
        $this->linked_users = $linked_users;
    }

    public function getLinkedUsers()
    {
        return $this->linked_users;
    }

    public function getPlannedTasks()
    {
        return $this->planned_tasks;
    }



    public function toArray($show_task_users = true)
    {



        $array = array(
            "id" => $this->id,
            "name" => $this->name,
            "owner" => $this->owner->toArray(),
            "creation_date" => $this->creation_date,
            "completion_date" => $this->completion_date,
            "order_index" => $this->order_index,
            "due_date" => $this->due_date
        );

        if ($show_task_users)
        {
            $linked_users = array();
            foreach ($this->linked_users as $task_user)
            {
                $linked_users[] = $task_user->toArray(false);
            }
            $array["task_users"] = $linked_users;
        }
        return $array;
    }
}

