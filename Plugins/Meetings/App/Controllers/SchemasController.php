<?php
/**
 * Date: 26/03/2013
 * Time: 18:31
 * This is the model class called Schema
 */

namespace Meetings;

class SchemasController extends \Controller
{
    public function security_check()
    {
        if (!\User::logged_in())
        {
            $this->redirect("/Meetings/Schemas/error");
        }
    }

    public function security_check_token($token)
    {
        $users = \User::where(array("token" => $token));
        if ($users != null && count($users) == 0)
        {
            $this->redirect("Meetings/Schemas/error");
        }
    }

    public function error()
    {
        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode(array("status" => "error", "message" => "You are not logged in"));
    }

    public function interface_security_check()
    {

    }

    public function app($params = array())
    {
        $this->set("app", "Meetings/Apps/Schemas/app");
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
        if (isset($_GET["token"]) && $_GET["token"] != "")
            $this->security_check_token($_GET["token"]);
        else
            $this->security_check();

        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();

        if (\User::current_user() != null)
            $qb->select("s")
                ->from("Meetings\\Schema", "s")
                ->leftJoin("s.participants", "p")
                ->where("s.creator = :user OR p = :user")
                ->setParameter("user", \User::current_user());
        else
        {
            $users = \User::where(array("token" => $_GET["token"]));
            $user = $users[0];
            $qb->select("s")
                ->from("Meetings\\Schema", "s")
                ->leftJoin("s.participants", "p")
                ->where("s.creator = :user OR p = :user")
                ->setParameter("user", $user);
        }

        if (isset($_GET["page"]))
        {
            $page = (isset($_GET["page"]) ? $_GET["page"] : 1);
            $page_size = (isset($_GET["page_size"]) ? $_GET["page_size"] : 10);
            $qb->setFirstResult(($page - 1) * $page_size)
                ->setMaxResults($page_size);
        }


        if (isset($_GET["filter"]) && $_GET["filter"] != "")
        {
            $qb->andWhere("s.name LIKE :name")
                ->setParameter("name", '%' . mysql_real_escape_string($_GET["filter"]) . '%');
        }

        $schemas = $qb->getQuery()->getResult();

        $response = array();

        //if (\User::current_user() != null)
        //{
            foreach ($schemas as $schema)
            {
                $response[] = $schema->toArray();
            }
        //}
        //else
        //{
            //foreach ($schemas as $schema)
            //{
                //$response[] = $schema->toArray(1);
            //}
        //}

        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode($response);
    }

    public function show($params = array())
    {
        if (isset($_GET["token"]) && $_GET["token"] != "")
            $this->security_check_token($_GET["token"]);
        else
            $this->security_check();

        header("Content-Type: application/json");
        $this->render = false;

        $schema = Schema::find($params["id"]);

        if (is_object($schema))
        {
            echo json_encode($schema->toArray());
        }
        else
        {
            echo json_encode(array("error"));
        }
    }

    public function create()
    {
        if (isset($_GET["token"]) && $_GET["token"] != "")
            $this->security_check_token($_GET["token"]);
        else
            $this->security_check();

        header("Content-Type: application/json");
        $this->render = false;

        $schema = new Schema();
        $data = $this->getRequestData();
        $schema->setName(isset($data["name"]) ? $data["name"] : "new image");
        $filename = md5(microtime()) . ".png";
        $schema->setFilename($filename);

        foreach ($data["participants"] as $p)
        {
            $user = \User::find($p["id"]);
            if (is_object($user))
            {
                $schema->addParticipant($user);
            }
        }
        // echo base64_encode(base64_decode(str_replace("data:image/png;base64,","",$data["data"])));
        if (isset($data["data"]))
            file_put_contents(ROOT . DS . "Data" . DS . "Schemas" . DS . $filename, base64_decode(str_replace("data:image/png;base64,", "", $data["data"])));
        else
            file_put_contents(ROOT . DS . "Data" . DS . "Schemas" . DS . $filename, "");
        $schema->save();
        echo json_encode($schema->toArray());

    }

    public function update($params = array())
    {
        if (isset($_GET["token"]) && $_GET["token"] != "")
            $this->security_check_token($_GET["token"]);
        else
            $this->security_check();

        header("Content-Type: application/json");
        $this->render = false;

        $schema = Schema::find($params["id"]);
        $data = $this->getRequestData();
        $schema->setName($data["name"]);
        file_put_contents(ROOT . DS . "Data" . DS . "Schemas" . DS . $schema->getFilename(), base64_decode(str_replace("data:image/png;base64,", "", $data["data"])));
        foreach ($data["texts"] as $text)
        {
            if (isset($text["id"]))
                $s_text = SchemaText::find($text["id"]);
            else
                $s_text  = new SchemaText();
            if (is_object($s_text))
            {
                $s_text->setPosx($text["x"]);
                $s_text->setPosy($text["y"]);
                $s_text->setContent($text["content"]);
                $s_text->setSchema($schema);
                $s_text->save();
            }
        }
        $schema->save();

        if (\User::current_user() != null)
        {
            foreach ($schema->getParticipants() as $user)
            {
                if ($user->getId() != \User::current_user()->getId())
                    \NodeDiplomat::sendMessage($user->getSessionId(), array("app" => "schemas", "action" => "received_data", "schema_id" => $schema->getId(), "user" => \User::current_user()->getSessionId()));
            }
        }
        else
        {
            $users = \User::where(array("token" => $_GET["token"]));
            $current_user = $users[0];
            foreach ($schema->getParticipants() as $user)
            {
                if ($user->getId() != $current_user->getId())
                    \NodeDiplomat::sendMessage($user->getSessionId(), array("app" => "schemas", "action" => "received_data", "schema_id" => $schema->getId(), "user" => $current_user->getSessionId()));
            }
        }

        if (is_object($schema))
        {
            echo json_encode($schema->toArray());
        }
        else
        {
            echo json_encode(array("error"));
        }
    }

    public function destroy($params = array())
    {
        if (isset($_GET["token"]) && $_GET["token"] != "")
            $this->security_check_token($_GET["token"]);
        else
            $this->security_check();

        header("Content-Type: application/json");
        $this->render = false;

        $schema = Schema::find($params["id"]);
        $schema->delete();

        echo json_encode(array("message" => "Job successfully deleted"));
    }


    public function share()
    {
        $data = $this->getRequestData();
        $schema = Schema::find($_POST["schema_id"]);
        if (is_object($schema))
        {
            foreach ($schema->getParticipants() as $user)
            {
                if ($user->getId() != \User::current_user()->getId())
                    \NodeDiplomat::sendMessage($user->getSessionId(), array("app" => "schemas", "data" => urlencode($data["image"])));
            }
        }
    }
}

