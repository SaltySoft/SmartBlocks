<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 7/12/13
 * Time: 1:15 PM
 */

namespace Organization;

/**
 * @Entity @Table(name="organization_activity_type")
 */
class ActivityType extends \Model
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
     * @Column(type="string", nullable=true)
     */
    private $color;

    /**
     * @ManyToOne(targetEntity="\User")
     */
    private $creator;

    /**
     * @Column(type="datetime")
     */
    private $created;

    /**
     * @Column(type="datetime")
     */
    private $updated;

    public function __construct()
    {
        $this->created = new \DateTime();
        $this->updated = new \DateTime();
    }

    public function getId()
    {
        return $this->id;
    }

    public function setColor($color)
    {
        $this->color = $color;
    }

    public function getColor()
    {
        return $this->color;
    }

    public function setName($name)
    {
        $this->name = $name;
    }

    public function getName()
    {
        return $this->name;
    }

    public function setCreator($creator)
    {
        $this->creator = $creator;
    }

    public function getCreator()
    {
        return $this->creator;
    }

    public function setCreated($created)
    {
        $this->created = $created;
    }

    public function getCreated()
    {
        return $this->created;
    }

    public function setUpdated($updated)
    {
        $this->updated = $updated;
    }

    public function getUpdated()
    {
        return $this->updated;
    }

    public function save()
    {
        $this->updated = new \DateTime();
        parent::save();
    }

    public function delete()
    {
        $em = \Model::getEntityManager();
        $qb = $em->createQuerybuilder();

        $qb->select("COUNT(activity)")->from('Organization\Activity', 'activity')->where("activity.type = :type")
            ->setParameter("type", $this);

        if ($qb->getQuery()->getSingleScalarResult() > 0)
        {
            throw new PotentialOrphanException("Activities are linked to this type");
        }
        else
        {
            parent::delete();
        }
    }

    public function toArray()
    {
        $array = array(
            "id" => $this->id,
            "name" => $this->name,
            "color" => $this->color,
            "creator" => $this->creator->toArray(0),
            "created" => $this->created,
            "updated" => $this->updated
        );

        return $array;
    }

}