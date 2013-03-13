<?php
/**
 * Date: 12/03/2013
 * Time: 12:33
 * This is the model class called Folder
 */

class FoldersController extends Controller
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
            ->from("Folder", "f");

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

        $folders = $qb->getQuery()->getResult();

        $response = array();

        foreach ($folders as $folder) {
            $response[] = $folder->toArray();
        }
        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode($response);
    }


    public function show($params = array())
    {
        header("Content-Type: application/json");
        $this->render = false;

        $folder = Folder::find($params["id"]);

        if (is_object($folder)) {
            echo json_encode($folder->toArray());
        } else {
            echo json_encode(array("error"));
        }
    }

    public function create()
    {
        $this->render = false;
        header("Content-Type: application/json");

        $folder = new Folder();
        $data = $this->getRequestData();

        $folder->setName($data["name"]);
        $folder->setCreator($data["creator"]);
        $folder->setParentFolder($data["parent_folder"]);
        $folder->setFiles($data["files"]);
        $folder->setGroupsAllowed($data["groups_allowed"]);
        $folder->setUsersAllowed($data["users_allowed"]);

        $folder->save();
        echo json_encode($folder->toArray());
    }

    public function update($params = array())
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $folder = Folder::find($params["id"]);
        $data = $this->getRequestData();

        if (is_object($folder))
        {
            $folder->setName($data["name"]);
            $folder->setCreator($data["creator"]);
            $folder->setParentFolder($data["parent_folder"]);
            $folder->setFiles($data["files"]);
            $folder->setGroupsAllowed($data["groups_allowed"]);
            $folder->setUsersAllowed($data["users_allowed"]);
        }
        else
            echo json_encode(array("error"));
    }

    public function destroy($params = array())
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $folder = Folder::find($params["id"]);

        if (is_object($folder))
        {
            $files = $folder->getFiles();

            if (is_array($files))
            {
                foreach($files as $file)
                {
                    $file->delete();
                }
            }

            $folder->delete();
            echo json_encode(array("message" => "Job successfully deleted"));
        }
        else
            echo json_encode(array("error"));
    }
}

