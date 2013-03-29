<?php

class NotesController extends Controller
{

    public function dashboard($params = array())
    {
        $this->set("app", "Enterprise/Apps/Notes/app");
    }
}