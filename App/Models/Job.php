<?php
/**
 * Date: 01/03/2013
 * Time: 22:05
 * This is the model class called Job
 */

/**
 * @Entity @Table(name="jobs")
 */
class Job extends Model
{
    /**
     * @Id @GeneratedValue(strategy="AUTO") @Column(type="integer")
     */
    public $id;
    
    /**
     * @Column(type="string")
     */
    private $name;

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


    
}

