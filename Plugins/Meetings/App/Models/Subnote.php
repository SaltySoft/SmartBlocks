<?php
namespace Meetings;

/**
 * @Entity @Table(name="ent_subnotes")
 */
class Subnote extends \Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @Column(type="string")
     */
    private $type;

    /**
     * @Column(type="text")
     */
    private $content;

    /**
     * @ManyToOne(targetEntity="Note", inversedBy="subnotes")
     */
    private $note;

    /**
     * @Column(type="boolean")
     */
    private $full_size;

    public function __construct()
    {
        $this->full_size = false;
    }

    public function getId()
    {
        return $this->id;
    }

    public function toArray()
    {
        $noteArray = array();
        $noteArray["id"] = $this->id;
        $noteArray["type"] = $this->type;
        $noteArray["content"] = $this->content;
        $noteArray["note_id"] = $this->note->getId();
        $noteArray["fullsize"] = $this->full_size;
//        $note = $this->note->toArray();
//        $noteArray["note"] = $note;

        foreach ($this->note->getUsers() as $user)
        {
            $users[] = $user->toArray();
        }
        $noteArray["users"] = $users;

        return $noteArray;
    }

    public function setContent($content)
    {
        $this->content = $content;
    }

    public function getContent()
    {
        return $this->content;
    }

    public function setType($type)
    {
        $this->type = $type;
    }

    public function getType()
    {
        return $this->type;
    }

    public function setNote($note)
    {
        $this->note = $note;
    }

    public function getNote()
    {
        return $this->note;
    }

    public function setFullSize($full_size)
    {
        $this->full_size = $full_size;
    }

    public function isFullSize()
    {
        return $this->full_size;
    }
}