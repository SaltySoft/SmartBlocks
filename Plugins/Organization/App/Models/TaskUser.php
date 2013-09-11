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
 * @Entity @Table(name="tasks_users")
 */
class TaskUser extends \Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $user;

    /**
     * @ManyToOne(targetEntity="\Organization\Task")
     */
    private $task;

    /**
     * @Column(type="boolean")
     */
    private $accepted;

    /**
     * @Column(type="boolean")
     */
    private $pending;

    private $modified = false;

    public function __construct()
    {
        $this->accepted = false;
        $this->pending = true;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setPending($pending)
    {
        $this->pending = $pending;
        $this->modified = true;
    }

    public function getPending()
    {
        return $this->pending;
    }

    public function setUser($user)
    {
        $this->user = $user;

    }

    public function getUser()
    {
        return $this->user;
    }

    public function setTask($task)
    {
        $this->task = $task;
    }

    public function getTask()
    {
        return $this->task;
    }

    public function setAccepted($accepted)
    {
        $this->accepted = $accepted;
        $this->modified = true;
    }

    public function getAccepted()
    {
        return $this->accepted;
    }

    protected function after_save()
    {
        if ($this->modified)
        {
            if ($this->pending)
            {
                $n = new \Notification();
                $n->setUser($this->user);
                $n->setContent("You were invited for a task : " . $this->task->getName());
                $n->setLink("/Organization/Tasks/app#month");
            }
            else
            {
                $n = new \Notification();
                $n->setUser($this->task->getOwner());
                if ($this->accepted)
                    $n->setContent($this->user->getUsername() . " accepted your invitation for " . $this->task->getName());
                else
                    $n->setContent($this->user->getUsername() . " refused your invitation for " . $this->task->getName());
                $n->setLink("/Organization/Tasks/app#month");
            }
        }

        if (isset($n))
        {
            $n->save();
        }
    }

    public function toArray($show_task = true)
    {
        $array = array(
            "id" => $this->id,
            "user" => $this->user->toArray(),
            "accepted" => $this->accepted,
            "pending" => $this->pending
        );
        if ($show_task) {
            $array["task"] = $this->task->toArray(false);
        }
        return $array;
    }
}

