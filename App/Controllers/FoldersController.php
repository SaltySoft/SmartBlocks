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
     * Lists all Folders
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

        if (isset($_GET["page"]))
        {
            $page = (isset($_GET["page"]) ? $_GET["page"] : 1);
            $page_size = (isset($_GET["page_size"]) ? $_GET["page_size"] : 10);
            $qb->setFirstResult(($page - 1) * $page_size)
                ->setMaxResults($page_size);
        }


        if (isset($_GET["filter"]) && $_GET["filter"] != "")
        {
            $qb->andWhere("f.name LIKE :name")
                ->setParameter("name", '%' . mysql_real_escape_string($_GET["filter"]) . '%');
        }

        if (isset($_GET["folder_id"]))
        {
            $parent_folder = Folder::find($_GET["folder_id"]);
            if (is_object($parent_folder))
            {
                $qb->andWhere("f.parent_folder = :parent_folder")
                    ->setParameter("parent_folder", $parent_folder->getId());
            }
            else
            {
                $qb->andWhere("f.parent_folder = :parent_folder")
                    ->setParameter("parent_folder", 0);
            }
        }

        $folders = $qb->getQuery()->getResult();

        $response = array();

        foreach ($folders as $folder)
        {
            $response[] = $folder->toArray(0);
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

        if (is_object($folder))
        {
            echo json_encode($folder->toArray(0));
        }
        else
        {
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

        $creator = User::find($data["creator"]["id"]);
        if (is_object($creator))
        {
            $folder->setCreator($creator);
            $folder->setParentFolder($data["parent_folder"]);

            if (isset($data["files"]))
            {
                foreach ($data["files"] as $file)
                {
                    $folder->addFile($file);
                }
            }
            if (isset($data["groups_allowed"]))
            {
                foreach ($data["groups_allowed"] as $group)
                {
                    $folder->addGroup($group);
                }
            }
            if (isset($data["users_allowed"]))
            {
                foreach ($data["users_allowed"] as $user)
                {
                    $folder->addUser($user);
                }
            }
            $folder->save();
            echo json_encode($folder->toArray(0));
        }
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
            $creator = User::find($data["creator"]["id"]);
            if (is_object($creator))
            {
                $folder->setCreator($creator);
            }
            $folder->setParentFolder($data["parent_folder"]);

            foreach ($data["users_allowed"] as $user_array)
            {
                $user = User::find($user_array["id"]);
                if (is_object($user))
                {
                    $folder->addUser($user);
                }
            }

            foreach ($data["groups_allowed"] as $group_array)
            {
                $group = Group::find($group_array["id"]);
                if (is_object($group))
                {
                    $folder->addGroup($group);
                }
            }

            foreach ($data["files"] as $file_array)
            {
                $file = File::find($file_array["id"]);
                if (is_object($file))
                {
                    $folder->addFile($file);
                }
            }

            foreach ($data["folders"] as $folder_array)
            {
                $f = Folder::find($folder_array["id"]);
                if (is_object($f))
                {
                    $f->setParentFolder($folder->getId());
                }
                $f->save();
            }

            $folder->save();
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
                foreach ($files as $file)
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

