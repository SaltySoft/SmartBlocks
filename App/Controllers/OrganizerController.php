<?php
/**
 * Date: 09/03/2013
 * Time: 17:23
 * This is the model class called Organizer
 */

class OrganizerController extends Controller
{
    private function security_check($user = null)
    {
        if (!User::logged_in() || !(User::current_user()->is_admin() || User::current_user() == $user))
        {
            $this->redirect("/Organizer/organizer_error");
        }
    }

    public function organizer_error($params = array())
    {
        $this->render = false;
        header("Content-Type: application/json");
        $response = array(
            "message" => "There was an error."
        );
        echo json_encode($response);
    }

    public function index()
    {

    }

    /**
     * This action is an admin page to access app organizer javascript apps.
     * @param array $params
     */
    public function app_organizer($params = array())
    {
//        $this->interface_security_check();
        $this->set("app", "AppOrganizer/app");
    }
}

