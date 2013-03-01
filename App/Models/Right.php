<?php
/**
 * Date: 01/03/2013
 * Time: 22:06
 * This is the model class called Right
 */

/**
 * @Entity @Table(name="rights")
 */
class Right extends Model
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
    private $token;

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

    public function setToken($token)
    {
        $this->token = $token;
    }

    public function getToken()
    {
        return $this->token;
    }


    
}

