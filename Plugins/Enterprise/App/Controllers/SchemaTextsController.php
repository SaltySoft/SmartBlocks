<?php
/**
 * Date: 26/03/2013
 * Time: 18:31
 * This is the model class called Schema
 */

namespace Enterprise;

class SchemaTextsController extends \Controller
{
    public function security_check()
    {
        if (!\User::logged_in())
        {
            $this->redirect("/Enterprise/Schemas/error");
        }
    }

    public function security_check_token($token)
    {
        $users = \User::where(array("token" => $token));
        if ($users != null && count($users) == 0)
        {
            $this->redirect("Enterprise/Schemas/error");
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

    public function index()
    {
        if (isset($_GET["token"]) && $_GET["token"] != "")
            $this->security_check_token($_GET["token"]);
        else
            $this->security_check();

        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();
        $qb->select("st")
            ->from("Enterprise\\SchemaText", "st");
        $data = $this->getRequestData();
        if (isset($data["schema_id"]))
        {
            $schema = Schema::find($data["schema_id"]);
            $qb->andWhere("st.schema = :schema")
                ->setParameter("schema", $schema);
        }

        $schemas = $qb->getQuery()->getResult();

        $response = array();

        foreach ($schemas as $schema)
        {
            $response[] = $schema->toArray();
        }
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

        $schema = SchemaText::find($params["id"]);

        if (is_object($schema))
        {
            echo json_encode($schema->toArray());
        }
        else
        {
            echo json_encode(array("error" => true, "message" => "No schema text found for this id."));
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

        $schema_text = new SchemaText();
        $data = $this->getRequestData();
        $schema = Schema::find($data["schema_id"]);
        if (is_object($schema))
        {
            $schema_text->setSchema($schema);
            $schema_text->setContent(isset($data["content"]) ? $data["content"] : "new text");

            $schema_text->setPosx($data["x"]);
            $schema_text->setPosy($data["y"]);
            $schema_text->save();
            echo json_encode($schema_text->toArray());
        }
        else
        {
            echo json_encode(array("error" => true, "message" => "Associated schema could not be found"));
        }


    }

    public function update($params = array())
    {
        if (isset($_GET["token"]) && $_GET["token"] != "")
            $this->security_check_token($_GET["token"]);
        else
            $this->security_check();

        header("Content-Type: application/json");
        $this->render = false;

        $schema_text = SchemaText::find($params["id"]);
        $data = $this->getRequestData();
        $schema_text->setContent($data["content"]);
        $schema_text->setPosx($data["x"]);
        $schema_text->setPosy($data["y"]);
        $schema = Schema::find($data["schema_id"]);
        if (is_object($schema))
        {
            $schema_text->setSchema($schema);

            if (\User::current_user() != null)
            {
                foreach ($schema->getParticipants() as $user)
                {
                    if (is_object($user))
                    {
                        \NodeDiplomat::sendMessage($user->getSessionId(), array(
                            "app" => "schemas",
                            "action" => "update_text",
                            "schema_id" => $schema->getId(),
                            "user" => \User::current_user()->getSessionId()
                        ));
                    }
                }
            }
            else
            {
                $users = \User::where(array("token" => $_GET["token"]));
                $current_user = $users[0];

                foreach ($schema->getParticipants() as $user)
                {
                    if (is_object($user))
                    {
                        \NodeDiplomat::sendMessage($user->getSessionId(), array(
                            "app" => "schemas",
                            "action" => "update_text",
                            "schema_id" => $schema->getId(),
                            "user" => $current_user->getSessionId()
                        ));
                    }
                }
            }
        }


        $schema_text->save();

        if (is_object($schema_text))
        {
            echo json_encode($schema_text->toArray());
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

        $schema_text = SchemaText::find($params["id"]);
        $schema_text->delete();

        echo json_encode(array("message" => "Schema successfully deleted"));
    }
}

