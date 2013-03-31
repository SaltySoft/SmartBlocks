<?php

class NotesController extends Controller
{

    public function dashboard($params = array())
    {
        $this->set("app", "Enterprise/Apps/Notes/app");
    }

    public function index()
    {
        $this->render = false;
        header("Content-Type: application/json");

        $notes = Note::all();

        echo json_encode($notes);
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