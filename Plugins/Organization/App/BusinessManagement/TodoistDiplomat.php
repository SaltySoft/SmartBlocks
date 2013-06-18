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


    public function login($email, $password)
    {
        $api_keys = \ApiKey::where(array("api_name" => "todoist", "user" => \User::current_user()));

        if (isset($api_keys[0]))
        {
            $this->api_key = $api_keys[0];

        }
        else
        {
            $user_data = $this->api_diplomat->post2json("/API/login", array(
                "email" => $email,
                "password" => $password
            ));

            $this->api_key = new \ApiKey();
            $this->api_key->setApiName("todoist");
            $this->api_key->setToken($user_data["api_token"]);
            $this->api_key->setUser(\User::current_user());

            $this->api_key->save();
        }
    }

    public function __construct()
    {
        $this->api_diplomat = new \ApiDiplomat("https://api.todoist.com");
        $api_keys = \ApiKey::where(array("api_name" => "todoist", "user" => \User::current_user()));

        if (isset($api_keys[0]))
        {
            $this->api_key = $api_keys[0];
        }
        else
        {

            \NodeDiplomat::sendMessage(\User::current_user()->getSessionId(), array(
                "app" => "user_requester",
                "data" => array(
                    "notification_text" => "Would you like to link your todoist account with this account ?",
                    "action" => "/Organization/todoist_link",
                    "class" => "todoist_request",
                    "fields" => array(
                        array(
                            "label" => "email",
                            "type" => "text"
                        ),
                        array(
                            "label" => "password",
                            "type" => "password"
                        )
                    )
                )
            ));
//            throw new \ApiKeyNotFoundException("No key found for todoist");
        }

    }

    public function get()
    {

    }



}