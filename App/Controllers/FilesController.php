<?php
/**
 * Date: 12/03/2013
 * Time: 12:33
 * This is the model class called File
 */

class FilesController extends Controller
{
    public function security_check()
    {

    }

    public function interface_security_check()
    {

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
        $em = Model::getEntityManager();
        $qb = $em->createQueryBuilder();
        $qb->select("f")
            ->from("File", "f");

        if (isset($_GET["page"])) {
            $page = (isset($_GET["page"]) ? $_GET["page"] : 1);
            $page_size = (isset($_GET["page_size"]) ? $_GET["page_size"] : 10);
            $qb->setFirstResult(($page - 1) * $page_size)
                ->setMaxResults($page_size);
        }


        if (isset($_GET["filter"]) && $_GET["filter"] != "") {
            $qb->andWhere("f.name LIKE :name")
                ->setParameter("name", '%' . mysql_real_escape_string($_GET["filter"]) . '%');
        }

        $files = $qb->getQuery()->getResult();

        $response = array();

        foreach ($files as $file)
        {
            $response[] = $file->toArray();
        }
        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode($response);
    }


    public function show($params = array())
    {
        header("Content-Type: application/json");
        $this->render = false;

        $file = File::find($params["id"]);

        if (is_object($file)) {
            echo json_encode($file->toArray());
        } else {
            echo json_encode(array("error"));
        }
    }

    public function create()
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $file = new File();
        $data = $this->getRequestData();
        $file->setName($data["name"]);
        $file->setPath(md5(microtime()));
        $file->setParentFolder($data["parent_folder"]);

        if (isset($_FILES["file"]))
        {
            $path = ROOT.DS . "App" . DS . "Data" . DS . "User_files" . DS;
            $file->setPath($file->getPath() . PATHINFO_EXTENSION);
            move_uploaded_file($_FILES["file"]["tmp_name"], $path, $file->getPath());
        }

        $file->save();
        echo json_encode($file->toArray());
    }

    public function update($params = array())
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $file = File::find(($params["id"]));
        $data = $this->getRequestData();

        if (is_object($file))
        {
            $file->setName($data["name"]);
            $file->setParentFolder($data["parent_folder"]);
            $file->save();
            echo json_encode($file->toArray());
        }
        else
            echo json_encode(array("error"));
    }

    public function destroy($params = array())
    {
        $this->security_check();
        header("Content-type: application/json");
        $this->render = false;

        $file = File::find($params["id"]);

        if (is_object($file))
        {
            $file->delete();
            echo json_encode(array("message" => "File successfully deleted"));
        }
        else
            echo json_encode(array("message" => "An error occured"));
    }
}

