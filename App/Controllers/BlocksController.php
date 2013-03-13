<?php
/**
 * Date: 11/03/2013
 * Time: 21:05
 * This is the model class called Block
 */

require_once(ROOT . DS . "App" . DS . "BusinessManagement" . DS . "SmartBlocks.php");
class BlocksController extends Controller
{
    public function security_check()
    {

    }

    public function interface_security_check()
    {

    }

    private function tokenize($string)
    {
        $string = preg_replace("/[^a-zA-Z0-9]/", "_", strtolower($string));
        return $string;
    }

    /**
     * Lists all jobs
     * Parameters :
     * - page : if set, paged response
     * - page_size : if set, fixes number of elements per page (if page is set)
     * - filter : if set, filters jobs by name with given string
     * By default, all jobs are returned
     */
    public function index()
    {
        $blocks = SmartBlocks::getApplicationBlocks();
        $response = array();

        foreach ($blocks as $block) {
            $response[] = $block->toArray();
        }
        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode($response);
    }

    public function show($params = array())
    {
        header("Content-Type: application/json");
        $this->render = false;

        $job = Job::find($params["id"]);

        if (is_object($job)) {
            echo json_encode($job->toArray());
        } else {
            echo json_encode(array("error"));
        }
    }

    public function create()
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $job = new Job();
        $data = $this->getRequestData();
        $job->setToken($this->tokenize($data["name"]));
        $job->setName($data["name"]);

        $job->save();
        echo json_encode($job->toArray());

    }

    public function update($params = array())
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $job = Job::find($params["id"]);
        $data = $this->getRequestData();
        $job->setToken($this->tokenize($data["name"]));
        $job->setName($data["name"]);
        $job->save();

        if (is_object($job)) {
            echo json_encode($job->toArray());
        } else {
            echo json_encode(array("error"));
        }
    }

    public function destroy($params = array())
    {
        $this->security_check();
        header("Content-Type: application/json");
        $this->render = false;

        $job = Job::find($params["id"]);
        $job->delete();

        echo json_encode(array("message" => "Job successfully deleted"));
    }
}