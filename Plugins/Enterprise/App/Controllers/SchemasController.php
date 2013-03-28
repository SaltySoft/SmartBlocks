<?php
/**
 * Date: 26/03/2013
 * Time: 18:31
 * This is the model class called Schema
 */

namespace Enterprise;

class SchemasController extends \Controller
{
    public function app() {
        $this->set("app", "Enterprise/Apps/Schemas/app");
    }

    public function share() {
        $data = $this->getRequestData();

        foreach (User::all() as $user) {
            \NodeDiplomat::sendMessage($user->getSessionId(), array("data" => $data["image"]));
        }

    }
}

