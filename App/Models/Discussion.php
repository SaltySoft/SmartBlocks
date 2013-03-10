<?php
/**
 * Date: 10/03/2013
 * Time: 15:34
 * This is the model class called Discussion
 */

/**
 * @Entity @Table(name="k_discussions")
 */
class Discussion extends Model
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
     * @Column(type="integer")
     */
    private $creation_date;

    /**
     * @Column(type="integer")
     */
    private $last_updated;

    /**
     * @OneToMany(targetEntity="Message", mappedBy="discussion")
     */
    private $messages;

    /**
     * @ManyToOne(targetEntity="User")
     */
    private $creator;

    /**
     * @ManyToMany(targetEntity="User")
     */
    private $participants;

    public function __construct()
    {
        $this->messages = new \Doctrine\Common\Collections\ArrayCollection();
        $this->name = "Conversation";
        $this->creation_date = time();
        $this->last_updated = time();
    }

    public function getId()
    {
        return $this->id;
    }

    public function setCreationDate($creation_date)
    {
        $this->creation_date = $creation_date;
    }

    public function getCreationDate()
    {
        return $this->creation_date;
    }

    public function setCreator($creator)
    {
        $this->creator = $creator;
    }

    public function getCreator()
    {
        return $this->creator;
    }

    public function setLastUpdated($last_updated)
    {
        $this->last_updated = $last_updated;
    }

    public function getLastUpdated()
    {
        return $this->last_updated;
    }

    public function setMessages($messages)
    {
        $this->messages = $messages;
    }

    public function getMessages()
    {
        return $this->messages;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setParticipants($participants)
    {
        $this->participants = $participants;
    }

    public function getParticipants()
    {
        return $this->participants;
    }

    public function toArray($load_sub = 0)
    {
        $messages = array();

        foreach ($this->messages as $message)
        {
            $messages[] = $message->toArray();
        }

        $participants = array();

        foreach ($this->participants as $participant)
        {
            $participants[] = $participant->toArray(0);
        }



        $array = array(
            "id" => $this->id,
            "participants" => $participants,
            "messages_count" => count($messages),
            "creator" => ($this->creator != null) ? $this->creator->toArray(0) : null
        );

        if ($load_sub == 1)
        {
            $array["messages"] = $messages;
        }
        return $array;
    }


}

