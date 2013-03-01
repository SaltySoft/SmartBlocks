<?php
/**
 * Date: 01/03/2013
 * Time: 22:09
 * This is the model class called Role
 */

/**
 * @Entity @Table(name="roles")
 */
class Role extends Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @ManyToOne(targetEntity="User")
     */
    private $user;

    /**
     * @ManyToOne(targetEntity="Job")
     */
    private $job;

    /**
     * @ManyToOne(targetEntity="Group")
     */
    private $group;

    public function getId()
    {
        return $this->id;
    }

    public function setGroup($group)
    {
        $this->group = $group;
    }

    public function getGroup()
    {
        return $this->group;
    }

    public function setJob($job)
    {
        $this->job = $job;
    }

    public function getJob()
    {
        return $this->job;
    }

    public function setUser($user)
    {
        $this->user = $user;
    }

    public function getUser()
    {
        return $this->user;
    }



}

