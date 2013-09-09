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

use BusinessManagement\ApiDiplomat;

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
     * @Column(type="text")
     */
    private $description;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $owner;

    /**
     * @OneToMany(targetEntity="\Organization\TaskUser", mappedBy="task")
     */
    private $linked_users;

    /**
     * @Column(type="bigint")
     */
    private $creation_date;

    /**
     * @Column(type="integer", nullable=true)
     */
    private $completion_date;

    /**
     * @Column(type="datetime", nullable=true)
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

    /**
     * @Column(type="string", nullable=true)
     */
    private $todoist_id;

    /**
     * @Column(type="bigint")
     */
    private $last_updated;

    /**
     * @Column(type="boolean")
     */
    private $active;

    /**
     * @ManyToOne(targetEntity="TaskType")
     */
    private $type;

    /**
     * @ManyToMany(targetEntity="\Organization\Activity", mappedBy="tasks")
     */
    private $activities;

    /**
     * @ManyToMany(targetEntity="\Organization\TaskTag", inversedBy="tasks")
     */
    private $tags;

    /**
     * @ManyToOne(targetEntity="\Organization\Task")
     */
    private $parent;

    /**
     * @OneToMany(targetEntity="\Organization\Task", mappedBy="parent")
     */
    private $children;

    /**
     * @OneToMany(targetEntity="\Organization\Subtask", mappedBy="task")
     */
    private $subtasks;

    /**
     * @Column(type="bigint")
     */
    private $required_time;

    /**
     * @ManyToOne(targetEntity="\Organization\Deadline")
     */
    private $deadline;


    public function __construct()
    {
        $this->owner = \User::current_user();
        $this->name = "New task";
        $this->description = "";
        $this->creation_date = microtime();
        $this->order_index = self::count() + 1;
        $this->linked_users = new \Doctrine\Common\Collections\ArrayCollection();
        $this->last_updated = time();
        $this->active = true;
        $this->activities = new \Doctrine\Common\Collections\ArrayCollection();
        $this->tags = new \Doctrine\Common\Collections\ArrayCollection();
        $this->children = new \Doctrine\Common\Collections\ArrayCollection();
        $this->subtasks = new \Doctrine\Common\Collections\ArrayCollection();
        $this->required_time = 0;
        $this->planned_tasks = new \Doctrine\Common\Collections\ArrayCollection();
        $this->subtasks = new \Doctrine\Common\Collections\ArrayCollection();
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

        if (is_integer($due_date))
        {
            $date = new \DateTime();
            $date->setTimestamp($due_date);
            $due_date = $date;
        }
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

    public function setTodoistId($todoist_id)
    {
        $this->todoist_id = $todoist_id;
    }

    public function getTodoistId()
    {
        return $this->todoist_id;
    }

    public function setLastUpdated($last_updated)
    {
        $this->last_updated = $last_updated;
    }

    public function getLastUpdated()
    {
        return $this->last_updated;
    }

    public function setActive($active)
    {
        $this->active = $active;
    }

    public function getActive()
    {
        return $this->active;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function getType()
    {
        return $this->type;
    }

    public function getActivities()
    {
        return $this->activities;
    }

    public function getTags()
    {
        return $this->tags;
    }

    public function setParent($parent)
    {
        $this->parent = $parent;
    }

    public function getParent()
    {
        return $this->parent;
    }

    public function getChildren()
    {
        return $this->children;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setRequiredTime($required_time)
    {
        $this->required_time = $required_time;
    }

    public function setDeadline($deadline)
    {
        $this->deadline = $deadline;
    }

    public function getDeadline()
    {
        return $this->deadline;
    }

    public function addSubtask($subtask)
    {
        $this->subtasks[] = $subtask;
    }

    public function getSubtasks()
    {
        return $this->subtasks;
    }




    public function getRequiredTime()
    {
        $required_time = $this->required_time;
        if (!$this->children->isEmpty())
        {
            $required_time = 0;
            foreach ($this->children as $child)
            {
                $required_time += $child->getRequiredTime();
            }
        }
        return $required_time;
    }


    public static function getTypes()
    {
        if (file_exists(ROOT . DS . "Plugins" . DS . "Organization" . DS . "Config" . DS . "task_types.json"))
        {
            $contents = file_get_contents(ROOT . DS . "Plugins" . DS . "Organization" . DS . "Config" . DS . "task_types.json");
            return json_decode($contents, true);
        }
        else
        {
            return array();
        }
    }


    public static function fetch_todoist()
    {
        $todoistDiplomat = new \ApiDiplomat("https://api.todoist.com");

        $user = $todoistDiplomat->post2json("/API/login", array(
            'email' => 'a.j.william26@gmail.com',
            'password' => 'william90'
        ));
        $data = $todoistDiplomat->post2json("/TodoistSync/v2/get", array(
            'api_token' => $user["api_token"]
        ));

        $tasks_list = array();
        $em = \Model::getEntityManager();
        foreach ($data["Projects"] as $project)
        {
            foreach ($project["items"] as $item)
            {
                if ($item["due_date"] != null)
                {
                    $task = new Task();
                    $date = new \DateTime($item["due_date"]);
                    $task->setDueDate($date->getTimestamp() - 23 * 3600 - 59 * 60 - 59);
                    $task->setName($item["content"]);
                    $task->setOwner(\User::current_user());
                    $task->setTodoistId($item["id"]);
                    $tasks_list[] = $task->toArray();
                    $em->persist($task);
                }
            }
        }

//        $em->flush();
        echo json_encode($tasks_list);
    }

    public function updateNotif()
    {
        \NodeDiplomat::sendMessage($this->owner->getSessionId(), array(
            "app" => "organizer",
            "action" => "task_saved",
            "task" => $this->toArray()
        ));
    }

    function save()
    {
        $this->setLastUpdated(time());
        parent::save();

        \NodeDiplomat::sendMessage($this->owner->getSessionId(), array(
            "app" => "organizer",
            "action" => "task_saved",
            "task" => $this->toArray()
        ));
    }

    function delete()
    {
        foreach ($this->getPlannedTasks() as $planned_task)
        {
//                $planned_task->setTask(null);
//                $planned_task->setActive(false);
//                $planned_task->save();
            $planned_task->delete();
        }
        foreach ($this->getChildren() as $child)
        {
            $child->delete();
        }
        foreach ($this->getSubtasks() as $subtask)
        {
            $subtask->delete();
        }
        \NodeDiplomat::sendMessage($this->owner->getSessionId(), array(
            "app" => "organizer",
            "action" => "task_deleted",
            "task" => $this->toArray()
        ));
        parent::delete();
    }

    private static function getAllPlannedTasks(Task $task)
    {
        $planned = array();

        foreach ($task->planned_tasks as $planned_task)
        {

            if ($planned_task->getActive())
                $planned[] = $planned_task->toArray(true, false);

        }

        foreach ($task->children as $stask)
        {
            $planned = array_merge($planned, self::getAllPlannedTasks($stask));
        }

        return $planned;
    }

    private static function getUserActivities($task)
    {
        $activities = array();

        foreach ($task->getActivities() as $activity)
        {
            if ($activity->getCreator() == \User::current_user())
                $activities[] = $activity->toArray(false);
        }


        if (is_object($task->parent))
        {
            $activities = array_merge($activities, self::getUserActivities($task->parent));
        }

        return $activities;
    }

    public function toArray($show_task_users = true, $show_activities = true, $show_parent = true, $show_children = true, $show_subtasks = true)
    {
        $tags = array();
        foreach ($this->tags as $tag)
        {
            $tags[] = $tag->toArray();
        }

        $array = array(
            "id" => $this->id,
            "name" => $this->name,
            "description" => $this->description,
            "required_time" => $this->getRequiredTime(),
            "active" => $this->active,
            "owner" => $this->owner->toArray(0),
            "creation_date" => $this->creation_date,
            "completion_date" => $this->completion_date,
            "order_index" => $this->order_index,
            "due_date" => is_object($this->due_date) ? $this->due_date->getTimeStamp() : null,
            "deadline" => $this->deadline,
            "type" => $this->type != null ? $this->type->toArray() : null,
            "tags" => $tags,
            "deadline" => $this->deadline != null ? $this->deadline->toArray(false) : null
        );

        if ($show_children)
        {
            $planned_tasks = self::getAllPlannedTasks($this);
            $array["planned_tasks"] = $planned_tasks;
        }

        if ($show_activities)
        {
            $activities = array();

            foreach ($this->activities as $activity)
            {
                if ($activity->getCreator() == \User::current_user())
                    $activities[] = $activity->toArray(false);
            }
            $array["activities"] = $activities;
            $acts = self::getUserActivities($this);
            $array["activity"] = isset($acts[0]) ? $acts[0] : null;
        }

        if ($show_task_users)
        {
            $linked_users = array();
            foreach ($this->linked_users as $task_user)
            {
                $linked_users[] = $task_user->toArray(false);
            }
            $array["task_users"] = $linked_users;
        }
        if ($show_parent)
        {
            $array["parent"] = is_object($this->parent) ? $this->parent->toArray(false, false, true, false) : null;
        }

//        if ($show_children)
//        {
//            $children = array();
//            $em = \Model::getEntityManager();
//            $qb = $em->createQueryBuilder();
//            $qb->select("task")->from('\Organization\Task', 'task');
//            $qb->where("task.parent = :parent")->setParameter("parent", $this);
//            $result = $qb->getQuery()->getResult();
//
//            foreach ($result as $child)
//            {
//                $children[] = $child->toArray(false, false, false, true);
//            }
//            $array["children"] = $children;
//        }

        if ($show_subtasks)
        {
//            $em = \Model::getEntityManager();
//            $qb = $em->createQueryBuilder();
//            $qb->select("subtask")->from('\Organization\Subtask', 'subtask');
//            $qb->where("subtask.task = :task")->setParameter("task", $this);
//            $result = $qb->getQuery()->getResult();

            $subtasks = array();
            foreach ($this->subtasks as $subtask)
            {
                $subtasks[] = $subtask->toArray(false);
            }
            $array["subtasks"] = $subtasks;
        }

        return $array;
    }
}

