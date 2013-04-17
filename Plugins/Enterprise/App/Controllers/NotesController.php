<?php

namespace Enterprise;

class NotesController extends \Controller
{
    public function dashboard($params = array())
    {
        $this->set("app", "Enterprise/Apps/Notes/app");
    }

    public function index()
    {

        $this->render = false;
//        header("Content-Type: application/json");
        $response = array();
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();

//        if ((isset($_GET["all"]) && $_GET["all"] == "true"))
//        {
            $qb->select("n")
                ->from("Enterprise\\Note", "n");
//        }
        if (isset($_GET["importants"]) && $_GET["importants"] == "true")
        {
            $qb->select("n")
                ->from("Enterprise\\Note", "n");
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
        $this->render = false;
        header("Content-Type: application/json");

        $note = new Note();
        $data = $this->getRequestData();
        $note->setTitle($data["title"]);
        $note->setArchived($data["archived"]);
        $note->setImportant($data["important"]);
        $note->setDescription("");
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
        $note->setImportant($data["importante"]);

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
    }
}