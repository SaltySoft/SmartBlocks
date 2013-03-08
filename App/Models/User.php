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

/**
 * @Entity @Table(name="users")
 */
class User extends UserBase
{

    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @Column(type="string")
     */
    private $lastname;

    /**
     * @Column(type="string")
     */
    private $firstname;

    /**
     * @ManyToMany(targetEntity="Group", inversedBy="users")
     */
    private $groups;

    /**
     * @ManyToMany(targetEntity="Job", inversedBy="users")
     */
    private $jobs;

    public function __construct()
    {
        $this->firstname = "";
        $this->lastname = "";
    }

    public function getId()
    {
        return $this->id;
    }

    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;
    }

    public function getFirstname()
    {
        return $this->firstname;
    }

    public function setLastActivity($last_activity)
    {
        $this->last_activity = $last_activity;
    }

    public function getLastActivity()
    {
        return $this->last_activity;
    }

    public function setLastname($lastname)
    {
        $this->lastname = $lastname;
    }

    public function getLastname()
    {
        return $this->lastname;
    }

    public function getRoles()
    {
        return $this->roles;
    }

    public function addGroup($group)
    {
        $this->groups[] = $group;
    }

    public function removeGroup($group)
    {
        $this->groups->removeElement($group);
    }

    public function getGroups()
    {
        return $this->groups;
    }

    public function addJob($job)
    {
        $this->jobs[] = $job;
    }

    public function removeJob($job)
    {
        $this->jobs->removeElement($job);
    }

    public function getJobs()
    {
        return $this->jobs;
    }



    public function toArray()
    {
        return array(
            "id" => $this->getId(),
            "firstname" => $this->getFirstname(),
            "lastname" => $this->getLastname(),
            "username" => $this->getName()
        );
    }

    /**
     * Returns true if the user has the right somewhere, or in
     * the specified group (the group must be a token).
     *
     * @param $right_token
     * @param null $group_token
     * @return bool
     */
    public function hasRight($right_token, $group_token = null)
    {
        $hasright = false;
        foreach ($this->roles as $role)
        {

            foreach ($role->getJob()->getRights() as $right)
            {
                if ($group_token == null)
                {
                    $hasright = $right->getToken() == $right_token;
                }
                else
                {
                    $hasright = $right->getToken() == $token && $role->getGroup()->getToken() == $group_token;
                }
            }

        }
        return $hasright;
    }
}