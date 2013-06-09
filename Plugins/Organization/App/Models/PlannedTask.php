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
     */
    private $task;

    /**
     * @Column(type="bigint")
     */
    private $start;

    /**
     * @Column(type="bigint")
     */
    private $duration;


    public function __construct()
    {
        $this->start= time();
        $this->duration = 30 * 60;
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

    public function toArray($show_task_users = true)
    {
        $array = array(
            "id" => $this->id,
            "task" => $this->task->toArray(),
            "start" => $this->start,
            "duration" => $this->duration
        );

        return $array;
    }
}

