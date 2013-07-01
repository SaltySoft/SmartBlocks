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

    private $calendar_id = '8iao4ib0lnqj398eoaoq1iaamo@group.calendar.google.com';


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

    public function addEvent($planned_task)
    {
        if ($planned_task->getGcalId() == null)
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
            //To be modified to the user's calendar
            //We need to handle several calendars... or not destroy the primary calendar
            $event = $this->service->events->insert('8iao4ib0lnqj398eoaoq1iaamo@group.calendar.google.com', $event);
            $planned_task->setGcalId($event->getId());
            \Model::persist($planned_task);
        }
    }

    public function updateSingleEvent(PlannedTask $planned_task)
    {
        $event = $this->service->events->get('8iao4ib0lnqj398eoaoq1iaamo@group.calendar.google.com', $planned_task->getGcalId());

        $updated = new \DateTime($event->getUpdated());

        if ($planned_task->getLastUpdated() > $updated->getTimestamp())
        {
            $task = $planned_task->getTask();
            $date = $planned_task->getStart() / 1000;
            $date2 = $planned_task->getStart() / 1000 + $planned_task->getDuration() / 1000;
            $event->setSummary($task->getName());
            $start = new \Google_EventDateTime();
            $start->setDateTime(gmdate("Y-m-d\\TH:i:s\\Z", $date));
            $event->setStart($start);
            $end = new \Google_EventDateTime();
            $end->setDateTime(gmdate("Y-m-d\\TH:i:s\\Z", $date2));
            $event->setEnd($end);
            $this->service->events->update('8iao4ib0lnqj398eoaoq1iaamo@group.calendar.google.com', $planned_task->getGcalId(), $event);
        }
        else
        {
            $date = $event->getStart();
            $task = $planned_task->getTask();
            $task->setName($event->getSummary() != null ? $stop = $event->getSummary() : "A task");
            if (is_object($date))
            {
                $date = new \DateTime($date->getDateTime());
                $planned_task->setStart($date);
                $stop = $event->getEnd();
                if (is_object($stop))
                {
                    $stop = new \DateTime($stop->getDateTime());
                    $planned_task->setDuration($stop->getTimestamp() * 1000 - $date->getTimestamp() * 1000);
                }
                else
                {
                    $planned_task->setDuration(3600000);
                }
            }
            $task->save();
            $planned_task->save();
        }
    }

    public function addEvents(array $planned_tasks)
    {
        foreach ($planned_tasks as $planned_task)
        {
            if ($planned_task->getGcalId() == null)
            {
                $task = $planned_task->getTask();
                $event = new \Google_Event();
                $date = $planned_task->getStart();

                $date2 = clone $planned_task->getStart();
                $date2->modify('+ '. ($planned_task->getDuration() / 1000). 'seconds');
                echo $date->format(DATE_RFC2822) + " " + $date2->format(DATE_RFC2822);
                $event->setSummary($task->getName());
                $start = new \Google_EventDateTime();
                $start->setDateTime($date->format(DATE_RFC3339));
                $event->setStart($start);
                $end = new \Google_EventDateTime();
                $end->setDateTime($date2->format(DATE_RFC3339));
                $event->setEnd($end);
                //To be modified to the user's calendar
                //We need to handle several calendars... or not destroy the primary calendar
                $event = $this->service->events->insert('8iao4ib0lnqj398eoaoq1iaamo@group.calendar.google.com', $event);
                $planned_task->setGcalId($event->getId());
                \Model::persist($planned_task);
                echo "\n";
            }
        }

        \Model::flush();
    }

    public function updateEvent(PlannedTask $planned_task, \Google_Event $event)
    {
        $updated = new \DateTime($event->getUpdated());

        if (!$planned_task->getActive())
        {
            $this->service->events->delete($this->calendar_id, $event->getId());
        }
        else
        {
            if ($planned_task->getLastUpdated() > $updated->getTimestamp())
            {
                $task = $planned_task->getTask();
                $date = $planned_task->getStart();
                $date2 = clone $date;
                $date2->modify('+'.($planned_task->getDuration() / 1000).' seconds');
                $event->setSummary($task->getName());
                $start = new \Google_EventDateTime();
                $start->setDateTime($date->format(DATE_RFC3339));
                $event->setStart($start);
                $end = new \Google_EventDateTime();
                $end->setDateTime($date2->format(DATE_RFC3339));
                $event->setEnd($end);
                //To be modified to the user's calendar
                //We need to handle several calendars... or not destroy the primary calendar

                $this->service->events->update('8iao4ib0lnqj398eoaoq1iaamo@group.calendar.google.com', $planned_task->getGcalId(), $event);
            }
            else
            {
                $date = $event->getStart();
                $task = $planned_task->getTask();

                $task->setName($event->getSummary() != null ? $stop = $event->getSummary() : "A task");
                if (is_object($date))
                {
                    $date = new \DateTime($date->getDateTime());
                    $planned_task->setStart($date);
                    $stop = $event->getEnd();
                    if (is_object($stop))
                    {
                        $stop = new \DateTime($stop->getDateTime());
                        $planned_task->setDuration($stop->getTimestamp() * 1000 - $date->getTimestamp() * 1000);
                    }
                    else
                    {
                        $planned_task->setDuration(3600000);
                    }
                }
                $task->save();
                $planned_task->save();
            }
        }
    }

    public function getEvents()
    {
        $list = $this->service->events->listEvents('8iao4ib0lnqj398eoaoq1iaamo@group.calendar.google.com');

        $items = $list->getItems();
        return $items;
    }

    public function setLastSync()
    {
        $this->api_key->setLastSync(time());
        $this->api_key->save();
    }
}