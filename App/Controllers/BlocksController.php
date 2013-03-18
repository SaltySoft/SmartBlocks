<?php
/**
 * Date: 11/03/2013
 * Time: 21:05
 * This is the model class called Block
 */

require_once(ROOT . DS . "App" . DS . "BusinessManagement" . DS . "SmartBlocks.php");
class BlocksController extends Controller
{
    private function security_check($user = null)
    {
        if (!User::logged_in() || !(User::current_user()->is_admin() || User::current_user() == $user))
        {
            $this->redirect("/Users/user_error");
        }
    }

    private function interface_security_check($user = null)
    {
        if (!User::logged_in() || !(User::current_user()->is_admin() || User::current_user() == $user))
        {
            $this->redirect("/");
        }
    }

    public function configure()
    {
        //security_check(User::current_user());

        \BusinessManagement\SmartBlocks::loadAllBlocks();

//        $blocks  = \BusinessManagement\SmartBlocks::getCoreBlock();
//        $first = true;
//        $blocksNumber = 0;
//        $pluginsBlocksNumber = 0;
//        $appsCoreNumber = 0;
//        $appsPluginsNumber = 0;
//
//        foreach ($blocks as $block)
//        {
//            if ($first)
//            {
//                $first = false;
//                $appsCoreNumber += count($block->getApplications());
//                $blocksNumber++;
//            }
//            else
//            {
//                $blocksNumber++;
//                $pluginsBlocksNumber++;
//                $appsPluginsNumber += count($block->getApplications());
//            }
//        }
//
        $this->set("blocksNumber", $blocksNumber);
//        $this->set("pluginsBlocksNumber", $pluginsBlocksNumber);
//        $this->set("appsCoreNumber", $appsCoreNumber);
//        $this->set("appsPluginsNumber", $appsPluginsNumber);
        $this->set("appsNumber", $appsCoreNumber + $appsPluginsNumber);
        $this->render = false;
    }

    /**
     * Web Service :
     * Get all the Applications Blocks and their respective Applications in an array.
     */
    public function index()
    {
        $response = array();

        foreach (ApplicationBlock::all() as $block)
        {
            $response[] = $block->toArray();
        }
        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode($response);
    }

    public function show($params = array())
    {
        $block = ApplicationBlock::find($params['id']);
        $this->render = false;
        header("Content-Type: application/json");
        echo json_encode($block->toArray());
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