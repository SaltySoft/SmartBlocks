<?php
/**
 * Date: 12/03/2013
 * Time: 11:28
 * This is the model class called File
 */

/**
 * @Entity @Table(name="files")
 */
class File extends Model
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
     * @Column(type="string")
     */
    private $path;

    /**
     * @ManyToOne(targetEntity="User")
     */
    private $owner;

    /**
     * @ManyToOne(targetEntity="Folder", inversedBy="files")
     */
    private $parent_folder;

    public function __construct()
    {

    }

    public function setId($id)
    {
        $this->id = $id;
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

    public function setParentFolder($parent_folder)
    {
        $this->parent_folder = $parent_folder;
    }

    public function getParentFolder()
    {
        return $this->parent_folder;
    }

    public function setPath($path)
    {
        $this->path = $path;
    }

    public function getPath()
    {
        return $this->path;
    }

    public function setOwner($owner)
    {
        $this->owner = $owner;
    }

    public function getOwner()
    {
        return $this->owner;
    }

    public function toArray()
    {
        return array(
            "id" => $this->id,
            "name" => $this->name,
            "parent_folder" => $this->parent_folder != null ? $this->parent_folder->toArray() : null,
            "owner" => $this->getOwner() != null ? $this->getOwner()->toArray() : null,
        );
    }
}

