<?php

require_once("ApplicationBlock.php");
require_once("Application.php");
/**
 * Writer: Antoine Jackson
 * Date: 3/1/13
 * Time: 2:16 AM
 * This is the main logic class of the server app.
 */
class SmartBlocks
{
    private static $application_blocks = array();

    private static function retrieveAppBlocksInfo()
    {
        $blocknames = MuffinApplication::getPlugins();

        foreach ($blocknames as $blockname)
        {
            if (file_exists(ROOT.DS."Plugins".DS.$blockname.DS."Config".DS."block.json"))
            {
                $data = file_get_contents(ROOT.DS."Plugins".DS.$blockname.DS."Config".DS."block.json");
                try
                {
                    $data = json_decode($data, true);

                    $appblock = new ApplicationBlock();
                    $appblock->setName($data["name"]);
                    $appblock->setDescription($data["description"]);

                    foreach ($data["applications"] as $app_array)
                    {
                        $app = new Application();
                        $app->setName($app_array["name"]);
                        $app->setDescription($app_array["description"]);
                        $app->setLink($app_array["link"]);
                        $appblock->addApp($app);
                    }
                    self::$application_blocks[] = $appblock;
                }
                catch (Exception $e)
                {
                    MuffinApplication::addError($e->getMessage());
                }

            }
        }
    }

    public static function  getApplicationBlocks()
    {
        self::retrieveAppBlocksInfo();
    }
}
