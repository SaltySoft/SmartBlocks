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
 * @Entity @Table(name="planned_tasks")
 */
class PlannedTask extends \Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @ManyToOne(targetEntity="\Organization\Task")
     * @JoinColumn(name="task_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $task;

    /**
     * @Column(type="string", nullable=true)
     */
    private $content;

    /**
     * @Column(type="datetime")
     */
    private $start;

    /**
     * @Column(type="bigint")
     */
    private $duration;

    /**
     * @Column(type="bigint")
     */
    private $last_updated;

    /**
     * @Column(type="string", nullable=true)
     */
    private $gcal_id;

    /**
     * @Column(type="string", nullable=true)
     */
    private $todoist_id;

    /**
     * @Column(type="string", nullable=true)
     */
    private $todoist_proj_id;

    /**
     * @Column(type="boolean")
     */
    private $active;

    /**
     * @Column(type="boolean")
     */
    private $completed;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $owner;

    /**
     * @Column(type="boolean")
     */
    private $validated;

    public function __construct()
    {
        $this->start = time();
        $this->duration = 30 * 60;
        $this->active = true;
        $this->completed = false;
        $this->validated = false;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setDuration($duration)
    {
        $this->duration = $duration;
    }

    public function getDuration()
    {
        return $this->duration;
    }

    public function setStart($start)
    {
        $this->start = $start;
    }

    public function getStart()
    {
        return $this->start;
    }

    public function setTask($task)
    {
        $this->task = $task;
    }

    public function getTask()
    {
        return $this->task;
    }

    public function setLastUpdated($last_updated)
    {

        $this->last_updated = $last_updated;
    }

    public function getLastUpdated()
    {
        return $this->last_updated;
    }

    public function setGcalId($gcal_id)
    {
        $this->gcal_id = $gcal_id;
    }

    public function getGcalId()
    {
        return $this->gcal_id;
    }

    public function before_save()
    {
        \NodeDiplomat::sendMessage($this->owner->getSessionId(), array(
            "type" => "data_update",
            "class" => "planned_task",
            "object" => $this->toArray(false, false)
        ));
        $this->last_updated = time();
    }

    public function setContent($content)
    {
        $this->content = $content;
    }

    public function setActive($active)
    {
        $this->active = $active;
    }

    public function getActive()
    {
        return $this->active;
    }

    public function setCompleted($completed)
    {
        $this->completed = $completed;
    }

    public function getCompleted()
    {
        return $this->completed;
    }

    public function setOwner($owner)
    {
        $this->owner = $owner;
    }

    public function getOwner()
    {
        return $this->owner;
    }

    public function setTodoistId($todoist_id)
    {
        $this->todoist_id = $todoist_id;
    }

    public function getTodoistId()
    {
        return $this->todoist_id;
    }

    public function getValidated()
    {
        return $this->validated;
    }

    public function setValidated($validated)
    {
        $this->validated = $validated;
    }

    public function setTodoistProjId($todoist_proj_id)
    {
        $this->todoist_proj_id = $todoist_proj_id;
    }

    public function getTodoistProjId()
    {
        return $this->todoist_proj_id;
    }



    public function getContent($force = false)
    {
        if (is_object($this->task) && !$force)
        {
            return $this->task->getName();
        }
        else
        {
            return $this->content;
        }
    }

    public function toArray($show_task_users = true, $show_task = true)
    {
        $array = array(
            "id" => $this->id,

            "start" => $this->start->getTimeStamp() * 1000,
            "duration" => $this->duration,
            "completed" => $this->completed,
            "content" => $this->content
        );

        if ($show_task)
        {
            $array["task"] = is_object($this->task) ? $this->task->toArray() : null;
        }

        return $array;
    }
}

