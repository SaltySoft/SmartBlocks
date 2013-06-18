<?php
/**
 * Created by Antoine Jackson
 * User: Antoine Jackson
 * Date: 6/17/13
 * Time: 11:05 PM
 */

namespace Organization;

/**
 * Class TodoistDiplomat
 * @package Organization
 * Deals with the todoist API
 */
class TodoistDiplomat
{
    private $api_diplomat = null;
    private $api_key = null;
    private $is_ready = false;


    public static function authenticate($email, $password)
    {
        $api_diplomat = new \ApiDiplomat("https://api.todoist.com");
        $user_data = $api_diplomat->post2json("/API/login", array(
            "email" => $email,
            "password" => $password
        ));

        $api_key = new \ApiKey();
        $api_key->setApiName("todoist");
        $api_key->setToken($user_data["api_token"]);
        $api_key->setUser(\User::current_user());

        $api_key->save();
        return $api_key;
    }

    public function __construct()
    {
        $this->api_diplomat = new \ApiDiplomat("https://api.todoist.com");
        $api_keys = \ApiKey::where(array("api_name" => "todoist", "user" => \User::current_user()));

        if (isset($api_keys[0]))
        {
            $this->api_key = $api_keys[0];
            $this->is_ready = true;
        }
        else
        {
            \NodeDiplomat::sendMessage(\User::current_user()->getSessionId(), array(
                "app" => "user_requester",
                "data" => array(
                    "title" => "Todoist connection",
                    "notification_text" => "Would you like to link your Todoist account with this account ?",
                    "form_text" => "Please enter your Todoist information. No credentials will be stored, only a token given by Todoist",
                    "action" => "/Organization/Tasks/todoist_link",
                    "class" => "todoist_request",
                    "fields" => array(
                        array(
                            "label" => "Your Todoist account's email",
                            "name" => "email",
                            "type" => "text"
                        ),
                        array(
                            "label" => "Your Todoist password",
                            "name" => "password",
                            "type" => "password"
                        )
                    )
                )
            ));
            $this->is_ready = false;
        }

    }

    public function get()
    {
        $data = $this->api_diplomat->post2json("/TodoistSync/v2/get", array(
            'api_token' => $this->api_key->getToken()
        ));
        return $data;
    }

    public function isReady()
    {
        return $this->is_ready;
    }




}