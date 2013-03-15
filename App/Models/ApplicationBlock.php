<?php
/**
 * Date: 15/03/2013
 * Time: 16:28
 * This is the model class called ApplicationBlock
 */

/**
 * @Entity @Table(name="applicationblocks")
 */
class ApplicationBlock extends Model
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
     * @Column(type="text")
     */
    private $description;

    /**
     * @OneToMany(targetEntity="Application", mappedBy="block")
     */
    private $applications;

    public function addApplication($application)
    {
        $this->applications[] = $application;
    }

    public function removeApplication($application)
    {
        $this->applications->removeElement($application);
    }

    public function getApplications()
    {
        return $this->applications;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getDescription()
    {
        return $this->description;
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

    public function toArray()
    {
        $appBlockArray = array();
        $appBlockArray["name"] = $this->name;
        $appBlockArray["description"] = $this->description;
        $appsArray = array();

        foreach ($this->getApplications() as $app)
        {
            $appsArray[] = $app->toArray();
        }
        $appBlockArray["apps"] = $appsArray;

        return $appBlockArray;
    }

}

