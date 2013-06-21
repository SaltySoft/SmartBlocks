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
        $api_key->setLastSync(time());

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

    public function addItems($tasks = array())
    {
        $get_data = $this->get();
        $commands_ = array();
        foreach ($get_data["Projects"] as $project)
        {
            if ($project["name"] == "SmartBlocks items")
            {
                $id = $project["id"];
                break;
            }
        }


        if (!isset($id))
        {
            $id = "#" . microtime();
            $commands_[] = array(
                "type" => "project_add",
                "temp_id" => $id,
                "args" => array(
                    "name" => "SmartBlocks items",
                    "item_order" => 1,
                    "indent" => 1,
                    "color" => 1
                ),
                "timestamp" => time()
            );
        }

        foreach ($tasks as $task)
        {
            //Correction for todoist system
            $date = $task->getDueDate() + 23 * 3600 + 59 * 60 + 59;
            if ($task->getTodoistId() == null)
            {

                $commands_[] = array(
                    "type" => "item_add",
                    "temp_id" => $task->getId(),
                    "timestamp" => time(),
                    "args" => array(
                        "content" => $task->getName(),
                        "project_id" => $id,
                        "priority" => 1,
                        "date_string" => gmdate("Y-m-d\\TH:i:s\\Z", $date),
                        "due_date_utc" => gmdate("Y-m-d\\TH:i:s\\Z", $date),
                        "item_order" => 1
                    )
                );
            }
            else
            {
                echo $task->getLastUpdated() . " " . $this->api_key->getLastSync() . " - ";
                if ($task->getLastUpdated() > $this->api_key->getLastSync())
                {
                    echo "UPDATING";
                    $commands_[] = array(
                        "type" => "item_update",
                        "timestamp" => time(),
                        "args" => array(
                            "content" => $task->getName(),
                            "date_string" => gmdate("Y-m-d\\TH:i:s\\Z", $date),
                            "due_date_utc" => gmdate("Y-m-d\\TH:i:s\\Z", $date),
                            "id" => $task->getTodoistId()
                        )
                    );
                }

            }
        }

        $data = $this->api_diplomat->post2json("/TodoistSync/v2/syncAndGetUpdated", array(
            'api_token' => $this->api_key->getToken(),
            'items_to_sync' => json_encode($commands_)
        ));
        $em = \Model::getEntityManager();
        foreach ($data["TempIdMapping"] as $key => $id)
        {
            $task = Task::find($key);
            if (is_object($task))
            {
                $task->setTodoistId($id);
                $em->persist($task);
            }
        }
        $em->flush();

        return $data;
    }

    public function constructCommand()
    {

    }

    public function isReady()
    {
        return $this->is_ready;
    }

    public function setLastSynced()
    {
        $this->api_key->setLastSync(time());
        $this->api_key->save();
    }


}