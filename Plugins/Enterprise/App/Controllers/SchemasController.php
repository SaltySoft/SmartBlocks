<?php
/**
 * Date: 26/03/2013
 * Time: 18:31
 * This is the model class called Schema
 */

namespace Enterprise;

class SchemasController extends \Controller
{
    public function security_check()
    {
        if (!\User::logged_in()) {
            $this->redirect("/Enterprise/Schemas/error");
        }
    }

    public function error() {
        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode(array("status" => "error", "message" => "You are not logged in"));
    }

    public function interface_security_check()
    {

    }

    public function app($params = array()) {
        $this->set("app", "Enterprise/Apps/Schemas/app");
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
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();
        $qb->select("s")
            ->from("Enterprise\\Schema", "s")
            ->leftJoin("s.participants", "p")
            ->where("s.creator = :user OR p = :user")
            ->setParameter("user", \User::current_user());

        if (isset($_GET["page"])) {
            $page = (isset($_GET["page"]) ? $_GET["page"] : 1);
            $page_size = (isset($_GET["page_size"]) ? $_GET["page_size"] : 10);
            $qb->setFirstResult(($page - 1) * $page_size)
                ->setMaxResults($page_size);
        }


        if (isset($_GET["filter"]) && $_GET["filter"] != "") {
            $qb->andWhere("s.name LIKE :name")
                ->setParameter("name", '%' . mysql_real_escape_string($_GET["filter"]) . '%');
        }

        $schemas = $qb->getQuery()->getResult();

        $response = array();

        foreach ($schemas as $schema) {
            $response[] = $schema->toArray();
        }
        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode($response);
    }

    public function show($params = array())
    {
        header("Content-Type: application/json");
        $this->render = false;

        $schema = Schema::find($params["id"]);

        if (is_object($schema)) {
            echo json_encode($schema->toArray());
        } else {
            echo json_encode(array("error"));
        }
    }

    public function create()
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $schema = new Schema();
        $data = $this->getRequestData();
        $schema->setName(isset($data["name"]) ? $data["name"] : "new image");
        $filename = md5(microtime()).".png";
        $schema->setFilename($filename);
       // echo base64_encode(base64_decode(str_replace("data:image/png;base64,","",$data["data"])));

        file_put_contents(ROOT.DS."Data".DS."Schemas".DS.$filename, base64_decode(str_replace("data:image/png;base64,","",$data["data"])));


        $schema->save();
        echo json_encode($schema->toArray());

    }

    public function update($params = array())
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $schema = Schema::find($params["id"]);
        $data = $this->getRequestData();
        $schema->setName($data["name"]);
        file_put_contents(ROOT.DS."Data".DS."Schemas".DS.$schema->getFilename(), base64_decode(str_replace("data:image/png;base64,","",$data["data"])));
        $schema->save();

        if (is_object($schema)) {
            echo json_encode($schema->toArray());
        } else {
            echo json_encode(array("error"));
        }
    }

    public function destroy($params = array())
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $schema = Schema::find($params["id"]);
        $schema->delete();

        echo json_encode(array("message" => "Job successfully deleted"));
    }


    public function share() {
        $data = $this->getRequestData();
        $schema = Schema::find($_POST["schema_id"]);
        if (is_object($schema)) {
            foreach ($schema->getParticipants() as $user) {
                if ($user->getId() != \User::current_user()->getId())
                    \NodeDiplomat::sendMessage($user->getSessionId(), array("app" => "schemas", "data" => urlencode($data["image"])));
            }
        }


    }
}

