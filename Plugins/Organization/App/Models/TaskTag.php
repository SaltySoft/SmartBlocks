<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 7/12/13
 * Time: 2:13 PM
 */

namespace Organization;

/**
 * @Entity @Table(name="organization_task_tags")
 */
class TaskTag extends \Model
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
     * @ManyToMany(targetEntity="\Organization\Task", mappedBy="tags")
     */
    private $tasks;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $creator;

    /**
     * @Column(type="datetime")
     */
    private $created;

    /**
     * @Column(type="datetime")
     */
    private $updated;

    public function __construct()
    {
        $this->created = new \DateTime();
        $this->updated = new \DateTime();
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

    public function setCreated($created)
    {
        $this->created = $created;
    }

    public function getCreated()
    {
        return $this->created;
    }

    public function setUpdated($updated)
    {
        $this->updated = $updated;
    }

    public function getUpdated()
    {
        return $this->updated;
    }

    public function save()
    {
        $this->updated = new \DateTime();
        parent::save();
    }


    public function delete($force = false)
    {
        $em = \Model::getEntityManager();

        $qb = $em->createQueryBuilder();
        $qb->select("COUNT(task)")->from('\Organization\Task', 'task')->leftJoin('task.tags', 'tag')
            ->where('tag = :tag')->setParameter("tag", $this);

        if ($qb->getQuery()->getSingleScalarResult() > 0)
        {
            if (!$force)
            {
                throw new PotentialOrphanException("Tasks that are linked with this tag exist");
            }
            else
            {
                $qb = $em->createQueryBuilder();
                $qb->select("task")->from('\Organization\Task', 'task')->leftJoin('task.tags', 'tag')
                    ->where('tag = :tag')->setParameter("tag", $this);
                $tasks = $qb->getQuery()->getResult();

                foreach ($tasks as $task)
                {
                    $task->getTags()->removeElement($this);
                    $em->persist($task);
                }
                $em->flush();
            }
        }
        else
        {
            parent::delete();
        }
    }

    public function toArray()
    {
        $myArray = array();
        $myArray["id"] = $this->id;
        if ($this->name)
            $myArray["name"] = $this->name;
        if ($this->creator)
            $myArray["creator"] = $this->creator->toArray(0);
        $myArray["created"] = $this->created;
        $myArray["updated"] = $this->updated;

        return $myArray;
    }
}