<?php

namespace Meetings;

class NotesController extends \Controller
{
    public function security_check()
    {
        if (!\User::logged_in() || \User::current_user() == null)
        {
            $this->redirect("/Users/login_form");
        }
    }

    public function dashboard($params = array())
    {
        $this->set("app", "Meetings/Apps/Notes/app");
    }

    public function index()
    {
        $this->render = false;
        header("Content-Type: application/json");
        $response = array();
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();

        $qb->select("n")
            ->from("Meetings\\Note", "n")
            ->leftJoin("n.users", "user")
            ->andWhere("user = :user")
            ->setParameter("user", \User::current_user());

        if (isset($_GET["importants"]) && $_GET["importants"] == "true")
        {
            $qb->andWhere("n.important = 1");
        }
        $notes = $qb->getQuery()->getResult();
        foreach ($notes as $note)
        {
            $response[] = $note->toArray();
        }
        echo json_encode($response);
    }

    public function show($params = array())
    {
        $this->render = false;
        header("Content-Type: application/json");

        $note = Note::find($params['id']);

        if (is_object($note))
        {
            echo json_encode($note->toArray());
        }
        else
        {
            echo json_encode(array("error"));
        }
    }

    public function create()
    {
        $this->security_check();

        $this->render = false;
        header("Content-Type: application/json");

        $note = new Note();
        $data = $this->getRequestData();
        $note->setTitle($data["title"]);
        $note->setArchived($data["archived"]);
        $note->setImportant($data["important"]);
        $note->setDescription($data["description"]);

        $note->addUser(\User::current_user());
        $note->save();

        if (is_object($note))
        {
            echo json_encode($note->toArray());
        }
        else
        {
            echo json_encode(array("error"));
        }
    }

    public function update($params = array())
    {
        $this->render = false;
        header("Content-Type: application/json");

        $note = Note::find($params["id"]);
        $data = $this->getRequestData();
        $note->setTitle($data["title"]);
        $note->setArchived($data["archived"]);
        $note->setImportant(isset($data["importante"]) ? $data["importante"] : $note->getImportant());
        $note->getUsers()->clear();
        foreach ($data["users"] as $p)
        {
            $user = \User::find($p["id"]);
            if (is_object($user))
            {
                $note->addUser($user);
            }
        }

        $note->save();

        if (is_object($note))
        {
            echo json_encode($note->toArray());
        }
        else
        {
            echo json_encode(array("error"));
        }
    }

    public function destroy($params = array())
    {
        $this->render = false;
        header("Content-Type: application/json");

        $note = Note::find($params["id"]);
        if (is_object($note))
        {
            foreach ($note->getSubnotes() as $subnote)
            {
                $subnote->delete();
            }
            $note->delete();
            echo json_encode(array("success"));
        }
        else
        {
            echo json_encode(array("error"));
        }
    }
}