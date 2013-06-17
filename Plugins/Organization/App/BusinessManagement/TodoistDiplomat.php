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
    private $api_key = 0;

    private function login()
    {
        $api_keys = \ApiKey::where(array("api_name" => "todoist", "user" => \User::current_user()));

        if (isset($api_keys[0]))
        {
            
        }
        else
        {
            throw new \Exception("No key found for todoist");
        }
    }

    public function __construct()
    {

    }

}