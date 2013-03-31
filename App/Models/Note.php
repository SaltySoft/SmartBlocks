<?php

    /**
     * @Entity @Table(name="notes")
     */
class Note extends Model
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
     * @Colum(type="boolean")
     */
    private $archived;

    /**
     * @Colum(type="boolean")
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
        $noteArray["title"] = $this->title;
        $noteArray["archived"] = $this->archived;
        $noteArray["important"] = $this->importante;

        return $noteArray;
    }
}