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

    private function send_notifs($folder, $update_folder = 0)
    {
        if ($update_folder == 0)
            $update_folder = $folder->getId();

        if ($folder->getParent() != null)
            $this->send_notifs($folder->getParent(), $update_folder);

        NodeDiplomat::sendMessage($folder->getCreator()->getSessionId(), array("app" => "k_fs", "status" => "changed_directory", "folder_id" => $update_folder == 0 ? $folder->getId() : $update_folder));
        foreach ($folder->getUsersAllowed() as $user)
        {
            NodeDiplomat::sendMessage($user->getSessionId(), array("app" => "k_fs", "status" => "changed_directory", "folder_id" => $update_folder == 0 ? $folder->getId() : $update_folder));
        }
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
                $qb->andWhere("f.parent = :parent_folder")
                    ->setParameter("parent_folder", $parent_folder);
            }
            else
            {
                $qb->andWhere("f.parent is NULL");
            }
        }

        if (isset($_GET["shared"]))
        {
            $qb->join("f.users_allowed", "u")
                ->leftJoin("f.parent", "pf")
                ->leftJoin("pf.users_allowed", "pf_u")
                ->andWhere("u = :user")
                ->setParameter("user", User::current_user());
        }
        else
        {
//            $qb->leftJoin("f.parent", "pf")
//                ->leftJoin("pf.users_allowed", "ua")
//                ->andWhere("(f.creator = :user OR ua = :user OR pf.creator = :user)")
//                ->setParameter("user", User::current_user());
            $qb->leftJoin("f.users_allowed", "u")
                ->andWhere("(f.creator = :user OR (u = :user AND f.parent is not NULL))")
                ->setParameter("user", User::current_user());

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
        if (isset($data["creator"]["id"]))
        {
            $creator = User::find($data["creator"]["id"]);
            if (is_object($creator))
            {
                $folder->setCreator($creator);
            }
            else
            {
                $folder->setCreator(User::current_user());
            }
        }
        else
        {
            $folder->setCreator(User::current_user());
        }

        $parent = Folder::find(isset($data["parent_folder"]) ? $data["parent_folder"] : 0);
        if (is_object($parent))
        {
            $folder->setParent($parent);
//            $p = $parent;
//            while ($p != null)
//            {
//
//                foreach ($p->getUsersAllowed() as $user)
//                {
//                    if (!$folder->getUsersAllowed()->contains($user))
//                        $folder->addUser($user);
//                }
//                if (!$folder->getUsersAllowed()->contains($p->getCreator()))
//                    $folder->addUser($p->getCreator());
//                $p = $p->getParent();
//            }

            $this->send_notifs($parent);
        }

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


    public function delete_all()
    {
        if (User::is_admin())
        {
            foreach (Folder::all() as $f)
            {
                $this->recursive_destroy($f);
            }
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
            $parent = Folder::find(isset($data["parent_folder"]) ? $data["parent_folder"] : 0);
            if (is_object($parent))
                $folder->setParent($parent);

            $old_users = $folder->getUsersAllowed()->toArray();
            $folder->getUsersAllowed()->clear();
            foreach ($data["users_allowed"] as $user_array)
            {

                $user = User::find($user_array["id"]);
                if (is_object($user))
                {
                    $folder->addUser($user);


                    NodeDiplomat::sendMessage($user->getSessionId(), array("app" => "k_fs", "status" => "sharing_update"));
                }
            }

            NodeDiplomat::sendMessage($folder->getCreator()->getSessionId(), array("app" => "k_fs", "status" => "sharing_update"));
            foreach ($old_users as $user)
            {
                if (!$folder->getUsersAllowed()->contains($user))
                {
                    NodeDiplomat::sendMessage($user->getSessionId(), array("app" => "k_fs", "status" => "sharing_update"));
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
            NodeDiplomat::sendMessage($folder->getCreator()->getSessionId(), array("app" => "k_fs", "status" => "changed_directory", "folder_id" => $folder->getId()));
            foreach ($folder->getUsersAllowed() as $user)
            {
                NodeDiplomat::sendMessage($user->getSessionId(), array("app" => "k_fs", "status" => "changed_directory", "folder_id" => $folder->getId()));
            }
            echo json_encode($folder->toArray());
        }
        else
            echo json_encode(array("error"));
    }

    private function recursive_destroy($folder)
    {
        NodeDiplomat::sendMessage($folder->getCreator()->getSessionId(), array("app" => "k_fs", "status" => "sharing_update", "folder_id" => $folder->getId()));
        foreach ($folder->getUsersAllowed() as $user)
        {
            NodeDiplomat::sendMessage($user->getSessionId(), array("app" => "k_fs", "status" => "sharing_update", "folder_id" => $folder->getId()));
        }
        foreach ($folder->getChildren() as $child)
        {
            $this->recursive_destroy($child);
        }
        $files = $folder->getFiles();
        foreach ($files as $file)
        {
            if (file_exists(ROOT . DS . "Data" . DS . "User_files" . DS . $file->getPath()))
            {
                unlink(ROOT . DS . "Data" . DS . "User_files" . DS . $file->getPath());
            }

            $file->delete();
        }
        $parent = $folder->getParent();
        if (is_object($parent))
        {

            NodeDiplomat::sendMessage($parent->getCreator()->getSessionId(), array("app" => "k_fs", "status" => "changed_directory", "folder_id" => $parent->getId()));
            foreach ($parent->getUsersAllowed() as $user)
            {
                NodeDiplomat::sendMessage($user->getSessionId(), array("app" => "k_fs", "status" => "changed_directory", "folder_id" => $parent->getId()));
            }
        }

        $folder->delete();
    }

    public function destroy($params = array())
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $folder = Folder::find($params["id"]);



        if (is_object($folder))
        {

            $this->recursive_destroy($folder);
            echo json_encode(array("message" => "Folder successfully deleted"));
        }
        else
            echo json_encode(array("error"));
    }
}

