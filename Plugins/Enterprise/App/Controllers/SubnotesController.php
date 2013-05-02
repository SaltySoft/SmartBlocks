<?php

namespace Enterprise;

class SubnotesController extends \Controller
{
    public function index()
    {
        $this->render = false;
//        header("Content-Type: application/json");
        $response = array();
        $em = \Model::getEntityManager();
        $qb = $em->createQueryBuilder();

        if (isset($_GET["note_id"]))
        {
            $note = Note::find($_GET["note_id"]);
            if (is_object($note))
            {
                $qb->select("s")
                    ->from("Enterprise\\Subnote", "s")
                    ->where("s.note = :note")
                    ->setParameter("note", $note);
            }
        }

        $subnotes = $qb->getQuery()->getResult();
        foreach ($subnotes as $subnote)
        {
            $response[] = $subnote->toArray();
        }
        echo json_encode($response);
    }

    public function show($params = array())
    {
        $this->render = false;
        header("Content-Type: application/json");

        $subnote = Subnote::find($params['id']);

        if (is_object($subnote))
        {
            echo json_encode($subnote->toArray());
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

        $subnote = new Subnote();
        $data = $this->getRequestData();
        $note = Note::find($data["note_id"]);
        if (is_object($note))
        {
            $subnote->setNote($note);
            $subnote->setContent($data["content"]);
            $subnote->setType($data["type"]);
            $subnote->save();
            echo json_encode($subnote->toArray());
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

        $subnote = Subnote::find($params["id"]);
        $data = $this->getRequestData();
        $subnote->setContent($data["content"]);
        $note = Note::find($data["note_id"]);
        $subnote->setNote($note);
        $subnote->setType($data["type"]);
        $subnote->setFullSize($data["fullsize"]);
        $subnote->save();

        if (is_object($subnote))
        {
            echo json_encode($subnote->toArray());
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

        $subnote = Subnote::find($params["id"]);
        if (is_object($subnote))
        {
            $subnote->delete();
            $subnote = Subnote::find($params["id"]);
            if (!is_object($subnote))
            {
                echo json_encode(array("success"));
            }
            else
            {
                echo json_encode(array("error"));
            }
        }
        else
        {
            echo json_encode(array("error"));
        }
    }
}

