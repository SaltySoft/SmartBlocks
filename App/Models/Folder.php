<?php
/**
 * Date: 12/03/2013
 * Time: 11:27
 * This is the model class called Folder
 */

/**
 * @Entity @Table(name="folders")
 */
class Folder extends Model
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
    private $parent_folder;

    /**
     * @ManyToOne(targetEntity="User")
     */
    private $creator;

    /**
     * @ManyToMany(targetEntity="User")
     */
    private $users_allowed;

    /**
     * @ManyToMany(targetEntity="Group")
     */
    private $groups_allowed;

    /**
     * @OneToMany(targetEntity="File", mappedBy="parent_folder")
     */
    private $files;

    public function setCreator($creator)
    {
        $this->creator = $creator;
    }

    public function getCreator()
    {
        return $this->creator;
    }

    public function setFiles($files)
    {
        $this->files = $files;
    }

    public function getFiles()
    {
        return $this->files;
    }

    public function setGroupsAllowed($groups_allowed)
    {
        $this->groups_allowed = $groups_allowed;
    }

    public function getGroupsAllowed()
    {
        return $this->groups_allowed;
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

    public function setUsersAllowed($users_allowed)
    {
        $this->users_allowed = $users_allowed;
    }

    public function getUsersAllowed()
    {
        return $this->users_allowed;
    }

    public function toArray()
    {
        $files = array();
        foreach ($this->files as $file)
        {
            $files[] = $file->toArray();
        }

        $users = array();
        foreach ($this->users_allowed as $user)
        {
            $users[] = $user->toArray();
        }

        $groups = array();
        foreach ($this->groups_allowed as $group)
        {
            $groups[] = $group->toArray();
        }

        return array(
            "id" => $this->id,
            "name" => $this->name,
            "parent_folder" => $this->parent_folder,
            "creator" => $this->creator,
            "users_allowed" => $users,
            "groups_allowed" => $groups,
            "files" => $files
        );
    }

    public function addUser($user)
    {
        $this->users_allowed[] = $user;
    }

    public function addGroup($group)
    {
        $this->groups_allowed[] = $group;
    }

    public function addFile($file)
    {
        $this->files[] = $file;
    }
}

