<?php
namespace Organization;
require_once("src/config.php");
require_once("src/Google_Client.php");
require_once("src/contrib/Google_CalendarService.php");


class GoogleCalDiplomat
{
    private $api_client;
    private $service;
    private $ready = false;
    private $api_key = null;


    public function __construct()
    {

        $this->api_client = new \Google_Client();

        $this->service = new \Google_CalendarService($this->api_client);

        $api_keys = \ApiKey::where(array(
            "api_name" => "google_refresh_token",
            "user" => \User::current_user()
        ));

        if (isset($api_keys[0]))
        {
            $this->api_key = $api_keys[0];
            $this->is_ready = true;
            $this->api_client->refreshToken($this->api_key->getToken());
        }
        else
        {
            if (isset($_SESSION["google_oauth_token"]) && is_string($_SESSION["google_oauth_token"]))
            {
                echo "ASDASD";
                print_r($_SESSION["google_oauth_token"]);
                $this->api_client->setAccessToken($_SESSION["google_oauth_token"]);
                $api_key = new \ApiKey();
                $api_key->setApiName("google_refresh_token");
                $apiValues = json_decode($_SESSION["google_oauth_token"], true);
                $api_key->setToken($apiValues["refresh_token"]);
                $api_key->setUser(\User::current_user());
                $api_key->setLastSync(time());

                $api_key->save();
                $this->api_key = $api_key;
                $this->ready = true;
            }
            else
            {
                $token = $this->api_client->authenticate();
                $apiValues = json_decode($token, true);
                $api_key = new \ApiKey();
                $api_key->setApiName("google_refresh_token");
                $api_key->setToken($apiValues["refresh_token"]);
                $api_key->setUser(\User::current_user());
                $api_key->setLastSync(time());
                $api_key->save();
                $this->api_key = $api_key;
                $_SESSION["google_oauth_token"] = $token;
            }
        }




    }

    public function addEvents($planned_tasks)
    {
        foreach ($planned_tasks as $planned_task)
        {

            $task = $planned_task->getTask();
            $event = new \Google_Event();
            $date = $planned_task->getStart() / 1000;
            $date2 = $planned_task->getStart() / 1000 + $planned_task->getDuration() / 1000;
            $event->setSummary($task->getName());
            $start = new \Google_EventDateTime();
            $start->setDateTime(gmdate("Y-m-d\\TH:i:s\\Z", $date));
            $event->setStart($start);
            $end = new \Google_EventDateTime();
            $end->setDateTime(gmdate("Y-m-d\\TH:i:s\\Z", $date2));
            $event->setEnd($end);
            echo "<br/>";
            echo "Added one";
            echo "<br/>";
            echo "<br/>";
            echo $date . " " . gmdate("Y-m-d\\TH:i:s\\Z", $date);
            echo $date2 . " " . gmdate("Y-m-d\\TH:i:s\\Z", $date2);

            $this->service->events->insert('primary', $event);
        }
    }

    public function getEvents()
    {
        $list = $this->service->events->listEvents('primary');
        print_r($list);
    }

    public function setLastSync()
    {
        $this->api_key->setLastSync(time());
        $this->api_key->save();
    }
}