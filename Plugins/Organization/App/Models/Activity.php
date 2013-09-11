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
 * @Entity @Table(name="organization_activity")
 */
class Activity extends \Model
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
     * @Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $creator;

    /**
     * @ManyToMany(targetEntity="\Organization\Task", inversedBy="activities")
     */
    private $tasks;

    /**
     * @Column(type="datetime")
     */
    private $created;

    /**
     * @Column(type="datetime")
     */
    private $updated;

    /**
     * @ManyToOne(targetEntity="\Organization\ActivityType")
     */
    private $type;

    /**
     * @Column(type="boolean")
     */
    private $archived;

    /**
     * @OneToMany*(targetEntity="\Organization\Deadline", mappedBy="activity")
     */
    private $deadlines;

    public function __construct()
    {
        $this->tasks = new \Doctrine\Common\Collections\ArrayCollection();
        $this->created = new \DateTime();
        $this->updated = new \DateTime();
        $this->archived = false;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setCreated($created)
    {
        $this->created = $created;
    }

    public function getCreated()
    {
        return $this->created;
    }

    public function setCreator($creator)
    {
        $this->creator = $creator;
    }

    public function getCreator()
    {
        return $this->creator;
    }

    public function setDescription($description)
    {
        $this->description = htmlentities($description);
    }

    public function getDescription()
    {
        return str_replace("\n", "<br/>", $this->description);
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

    public function setUpdated($updated)
    {
        $this->updated = $updated;
    }

    public function getUpdated()
    {
        return $this->updated;
    }

    public function before_save()
    {
        $this->updated = new \DateTime();
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function getType()
    {
        return $this->type;
    }

    public function setArchived($archived)
    {
        $this->archived = $archived;
    }

    public function getArchived()
    {
        return $this->archived;
    }

    public function getDeadlines()
    {
        return $this->deadlines;
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
                $task->getActivities()->removeElement($this);
            }
        }
        parent::delete();
    }

    public function toArray($show_tasks = true)
    {
        $array = array(
            "id" => $this->id,
            "name" => $this->name,
            "description" => $this->getDescription(),
            "creator" => $this->creator->toArray(0),

            "created" => $this->created,
            "updated" => $this->updated,
            "type" => $this->type->toArray(),
            "archived" => $this->archived
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