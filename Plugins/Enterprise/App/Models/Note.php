<?php
namespace Enterprise;

/**
 * @Entity @Table(name="ent_notes")
 */
class Note extends \Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;

    /**
     * @Column(type="string")
     */
    private $title;

    /**
     * @Column(type="string", length=80)
     */
    private $description;

    /**
     * @Column(type="boolean")
     */
    private $archived;

    /**
     * @Column(type="boolean")
     */
    private $important;

    public function setArchived($archived)
    {
        $this->archived = $archived;
    }

    public function getArchived()
    {
        return $this->archived;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setImportant($important)
    {
        $this->important = $important;
    }

    public function getImportant()
    {
        return $this->important;
    }

    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function toArray()
    {
        $noteArray = array();
        $noteArray["id"] = $this->id;
        $noteArray["title"] = $this->title;
        $noteArray["description"] = $this->description;
        $noteArray["archived"] = $this->archived;
        $noteArray["important"] = $this->important;

        return $noteArray;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getDescription()
    {
        return $this->description;
    }
}