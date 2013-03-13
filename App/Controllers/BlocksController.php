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

    /**
     * Web Service :
     * Get all the Applications Blocks and their respective Applications in an array.
     */
    public function index()
    {
        $blocks = SmartBlocks::getAllApplicationBlocks();
//        $blocks = SmartBlocks::getApplicationBlocks();
        $response = array();
//        $coreAppNames = SmartBlocks::getCoreAppsName();
//        foreach ($coreAppNames as $appname)
//        {
//            $response[] = $appname;
//        }
            foreach ($blocks as $block)
        {
            $response[] = $block->toArray();
        }
        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode($response);
    }

    public function show($params = array())
    {
    }

    public function create()
    {
    }

    public function update($params = array())
    {
    }

    public function destroy($params = array())
    {
    }
}