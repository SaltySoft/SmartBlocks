<?php
/**
 * Date: 15/03/2013
 * Time: 16:27
 * This is the model class called Application
 */

/**
 * @Entity @Table(name="applications")
 */
class Application extends Model
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

    /**
     * @Column(type="text")
     */
    private $description;

    /**
     * @Column(type="string")
     */
    private $link;

    /**
     * @ManyToOne(targetEntity="ApplicationBlock", inversedBy="applications")
     */
    private $block;

    public function getId()
    {
        return $this->id;
    }

    public function setDescription($description)
    {
        $this->description = $description;
    }

    public function getDescription()
    {
        return $this->description;
    }

    public function setLink($link)
    {
        $this->link = $link;
    }

    public function getLink()
    {
        return $this->link;
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

    public function setBlock($block)
    {
        $this->block = $block;
    }

    public function getBlock()
    {
        return $this->block;
    }

    public function toArray()
    {
        $appArray = array();
        $appArray["name"] = $this->name;
        $appArray["token"] = $this->token;
        $appArray["description"] = $this->description;
        $appArray["link"] = $this->link;

        return $appArray;
    }
}

