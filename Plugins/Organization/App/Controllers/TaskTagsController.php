<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 7/12/13
 * Time: 2:40 PM
 */

namespace Organization;


class TaskTagsController extends \Controller
{
    public function index($params = array())
    {
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();
        $qb->select("tag")->from('\Organization\TaskTag', 'tag')->where('tag.creator = :user')->setParameter("user", \User::current_user());
        $data = $this->getRequestData();
        if (isset($data["filter"]))
        {
            $qb->andWhere("tag.name LIKE :filter")->setParameter("filter", $data["filter"]."%");
        }

        $result = $qb->getQuery()->getResult();
        $response = array();
        foreach ($result as $tag)
        {
            $response[] = $tag->toArray();
        }
        $this->return_json($response);
    }

    public function show($params = array())
    {
        $tag = TaskTag::find($params["id"]);
        if (is_object($tag))
        {
            $this->return_json($tag->toArray());
        }
        else
        {
            $this->json_error("This task tag does not exist", 404);
        }
    }

    public function create($params = array())
    {
        $tag = new TaskTag();
        $data = $this->getRequestData();
        $tags = TaskTag::where(array("name" => $data["name"], "creator"=> \User::current_user()));
        if ($data["name"] != "" && !isset($tags[0])) {
            $tag->setName($data["name"]);
            $tag->setCreator(\User::current_user());
            $tag->save();
            $this->return_json($tag->toArray());
        } else {
            $this->json_error("Name cannot be blank or already existing.", 406);
        }

    }

    public function update($params = array())
    {
        $tag = TaskTag::find($params["id"]);
        $data = $this->getRequestData();
        if (is_object($tag))
        {
            if ($tag->getCreator() == \User::current_user())
            {
                $tag->setName($data["name"]);
                $tag->save();
                $this->return_json($tag->toArray());

            }
            else
            {
                $this->json_error("You cannot update a tag you didn't create", 401);
            }
        }
        else
        {
            $this->json_error("This task tag does not exist", 404);
        }
    }

    public function destroy($params = array())
    {
        $tag = TaskTag::find($params["id"]);
        if (is_object($tag))
        {
            if ($tag->getCreator() == \User::current_user())
            {
                if (!isset($params["force"]) || $params["force"] == false)
                {
                    try
                    {
                        $tag->delete(false);
                        $this->json_message("Successfully deleted tag");
                    } catch (PotentialOrphanException $ex)
                    {
                        $this->json_error("You must remove this tag from each tasks before deleting it. Or use force parameter.");
                    }
                }
                else
                {
                    $tag->delete(true);
                }
            }
            else
            {
                $this->json_error("You cannot delete a tag you didn't create", 401);
            }
        }
        else
        {
            $this->json_error("This task tag does not exist", 404);
        }
    }
}