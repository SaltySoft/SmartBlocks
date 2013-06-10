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

    /**
     * @OneToOne(targetEntity="\Meetings\NotePreference", inversedBy="user")
     */
    private $note_preference;

    /**
     * @Column(type="string")
     */
    private $token;

    /**
     * @ManyToMany(targetEntity="Application")
     */
    private $authorized_apps;

    /**
     * @ManyToMany(targetEntity="User", inversedBy="contacts_with_me")
     *  @JoinTable(name="user_contacts",
     *      joinColumns={@JoinColumn(name="user_id", referencedColumnName="id")},
     *      inverseJoinColumns={@JoinColumn(name="contact_id", referencedColumnName="id")})
     */
    private $contacts;

    /**
     * @ManyToMany(targetEntity="User", mappedBy="contacts")
     */
    private $contact_with_me;


    public function __construct()
    {
        $this->firstname = "";
        $this->lastname = "";
        $this->token = "";
        $this->groups = new \Doctrine\Common\Collections\ArrayCollection();
        $this->jobs = new \Doctrine\Common\Collections\ArrayCollection();
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

    public function setToken($token)
    {
        $this->token = $token;
    }

    public function getToken()
    {
        return $this->token;
    }

    public function setAuthorizedApps($authorized_apps)
    {
        $this->authorized_apps = $authorized_apps;
    }

    public function getAuthorizedApps()
    {
        return $this->authorized_apps;
    }

    public function setContacts($contacts)
    {
        $this->contacts = $contacts;
    }

    public function getContacts()
    {
        return $this->contacts;
    }

    public function setContactWithMe($contact_with_me)
    {
        $this->contact_with_me = $contact_with_me;
    }

    public function getContactWithMe()
    {
        return $this->contact_with_me;
    }



    public function toArray($load_sub = 1)
    {
        $jobs = array();
        foreach ($this->jobs as $job)
        {
            $jobs[] = $job->toArray();
        }

        $groups = array();
        foreach ($this->groups as $group)
        {
            $groups[] = $group->toArray();
        }

        $authorized_apps = array();

        foreach ($this->authorized_apps as $app)
        {
            $authorized_apps[] = $app->toArray();
        }

        $contacts = array();

        if ($load_sub == 1)
        {
            foreach ($this->contacts as $contact)
            {
                $contacts[] = $contact->toArray(0);
            }
            foreach ($this->contact_with_me as $contact)
            {
                $contacts[] = $contact->toArray(0);
            }
        }

        $array = array(
            "id" => $this->getId(),
            "firstname" => $this->getFirstname(),
            "lastname" => $this->getLastname(),
            "username" => $this->getName(),
            "email" => $this->getEmail(),
            "jobs" => $jobs,
            "groups" => $groups,
            "session_id" => $this->getSessionId(),
            "authorized_apps" => $authorized_apps,
            "contacts" => $contacts
        );

        if ($load_sub == 1)
        {
            $array["jobs"] = $jobs;
            $array["groups"] = $groups;
        }

        return $array;
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

    public function setNotePreference($note_preference)
    {
        $this->note_preference = $note_preference;
    }

    public function getNotePreference()
    {
        return $this->note_preference;
    }
}