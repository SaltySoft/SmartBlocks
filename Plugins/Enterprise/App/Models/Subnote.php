<?php
namespace Enterprise;

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
}