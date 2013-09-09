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
 * @Entity @Table(name="organization_deadline")
 */
class Deadline extends \Model
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
    private $creator;

    /**
     * @OneToMany(targetEntity="\Organization\Task", mappedBy="deadline")
     */
    private $tasks;

    /**
     * @Column(type="datetime")
     */
    private $start_time;

    /**
     * @Column(type="datetime")
     */
    private $stop_time;

    /**
     * @Column(type="boolean")
     */
    private $archived;

    /**
     * @ManyToOne(targetEntity="\Organization\Activity")
     */
    private $activity;


    public function __construct()
    {
        $this->tasks = new \Doctrine\Common\Collections\ArrayCollection();
        $this->start_time = new \DateTime();
        $this->stop_time = new \DateTime();
        $this->archived = false;
        $this->creator = \User::current_user();
    }

    public function getId()
    {
        return $this->id;
    }

    public function setCreator($creator)
    {
        $this->creator = $creator;
    }

    public function getCreator()
    {
        return $this->creator;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getTasks()
    {
        return $this->tasks;
    }

    public function setArchived($archived)
    {
        $this->archived = $archived;
    }

    public function getArchived()
    {
        return $this->archived;
    }

    public function setActivity($activity)
    {
        $this->activity = $activity;
    }

    public function getActivity()
    {
        return $this->activity;
    }

    public function setStartTime($start_time)
    {
        $this->start_time = $start_time;
    }

    public function getStartTime()
    {
        return $this->start_time;
    }

    public function setStopTime($stop_time)
    {
        $this->stop_time = $stop_time;
    }

    public function getStopTime()
    {
        return $this->stop_time;
    }


    function delete()
    {
        foreach ($this->getTasks() as $task)
        {
            if ($task->getOwner() == \User::current_user())
            {
                $task->delete();
            }
            else
            {
//                $task->getActivities()->removeElement($this);
            }
        }
        parent::delete();
    }

    public function toArray($show_tasks = true)
    {
        $array = array(
            "id" => $this->id,
            "name" => $this->name,
            "creator" => $this->creator->toArray(0),
            "start" => $this->start_time->getTimestamp() * 1000,
            "stop" => $this->stop_time->getTimestamp() * 1000,
            "archived" => $this->archived,
            "activity" => is_object($this->activity) ? $this->activity->toArray(false) : null
        );

        if ($show_tasks)
        {
            $tasks = array();
            foreach ($this->getTasks() as $task)
            {
                if ($task->getActive())
                    $tasks[] = $task->toArray(true, false);
            }
            $array["tasks"] = $tasks;
        }

        return $array;
    }

}