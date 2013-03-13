<?php
/**
 * Date: 10/03/2013
 * Time: 16:19
 * This is the model class called Discussion
 */

class DiscussionsController extends Controller
{
    public function security_check()
    {

        if (!User::logged_in() || (!(isset($_GET["user_id"]) && $_GET["user_id"] == User::current_user()->getId()) && !User::current_user()->isAdmin()))
        {
            $this->redirect("error");
        }

    }

    public function error()
    {
        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode(array("status" => "error"));
    }

    public function interface_security_check()
    {

    }


    private function tokenize($string)
    {
        $string = preg_replace("/[^a-zA-Z0-9]/", "_", strtolower($string));
        return $string;
    }

    /**
     * Lists all jobs
     * Parameters :
     * - page : if set, paged response
     * - page_size : if set, fixes number of elements per page (if page is set)
     * - filter : if set, filters jobs by name with given string
     * By default, all jobs are returned
     */
    public function index()
    {
        $this->security_check();
        $em = Model::getEntityManager();
        $qb = $em->createQueryBuilder();
        $qb->select("d")
            ->from("Discussion", "d");

        if (isset($_GET["page"]))
        {
            $page = (isset($_GET["page"]) ? $_GET["page"] : 1);
            $page_size = (isset($_GET["page_size"]) ? $_GET["page_size"] : 10);
            $qb->setFirstResult(($page - 1) * $page_size)
                ->setMaxResults($page_size);
        }


        if (isset($_GET["filter"]) && $_GET["filter"] != "")
        {
            $qb->andWhere("d.name LIKE :name")
                ->setParameter("name", '%' . mysql_real_escape_string($_GET["filter"]) . '%');
        }

        if (isset($_GET["user_id"]))
        {

            $qb->join("d.participants", "p")
                ->andWhere("p.id = :user_id")
                ->setParameter("user_id", $_GET["user_id"]);
        }

        $discussions = $qb->getQuery()->getResult();

        $response = array();

        foreach ($discussions as $discussion)
        {
            $response[] = $discussion->toArray();
        }
        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode($response);
    }


    public function show($params = array())
    {
        header("Content-Type: application/json");
        $this->render = false;

        $discussion = Discussion::find($params["id"]);

        if (is_object($discussion))
        {
            echo json_encode($discussion->toArray(1));
        }
        else
        {
            echo json_encode(array("error"));
        }
    }

    public function create()
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $discussion = new Discussion();
        $data = $this->getRequestData();
        $discussion->setCreator(User::current_user());
        $discussion->addParticipant(User::current_user());

        foreach ($data["participants"] as $part_array)
        {
            $user = User::find($part_array["id"]);
            if (is_object($user))
            {
                $discussion->addParticipant($user);
            }
        }

        $discussion->setName($data["name"]);

        $discussion->save();

        foreach ($discussion->getParticipants() as $user)
        {
            NodeDiplomat::sendMessage($user->getSessionId(), array("app" => "k_chat", "status" => "new_discussion"));
        }


        echo json_encode($discussion->toArray());

    }

    public function update($params = array())
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $discussion = Discussion::find($params["id"]);
        $data = $this->getRequestData();
        $discussion->setName($data["name"]);
        $discussion->save();

        if (is_object($discussion))
        {
            echo json_encode($discussion->toArray());
        }
        else
        {
            echo json_encode(array("error"));
        }
    }

    public function destroy($params = array())
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $discussion = Discussion::find($params["id"]);
        $participants = $discussion->getParticipants();
        $session_ids = array();
        foreach ($participants as $user)
        {
            $session_ids[] =  $user->getSessionId();

        }
        foreach ($discussion->getMessages() as $message)
        {
            $message->delete();
        }

        $discussion->delete();

        foreach ($session_ids as $session_id)
        {
            NodeDiplomat::sendMessage($session_id, array("app" => "k_chat", "status" => "deleted_discussion"));
        }

        echo json_encode(array("message" => "Discussion successfully deleted"));

    }
}

