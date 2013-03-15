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
    private static $plugins_application_blocks = array();
    private static $core_application_block;
    private static $core_blocks_name = array();
    private static $core_loaded = false;

    private static function retrievePluginsAppBlocksInfo()
    {
        $blocknames = MuffinApplication::getPlugins();

        foreach ($blocknames as $blockname)
        {
            if (file_exists(ROOT . DS . "Plugins" . DS . $blockname . DS . "Config" . DS . "block.json"))
            {
                $data = file_get_contents(ROOT . DS . "Plugins" . DS . $blockname . DS . "Config" . DS . "block.json");

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
                    self::$plugins_application_blocks[] = $appblock;
                } catch (Exception $e)
                {
                    MuffinApplication::addError($e->getMessage());
                }
            }
        }
    }

    private static function getCore()
    {
//        if (!self::$core_loaded)
        self::loadCore();
        return self::$core_blocks_name;
    }

    private static function loadCore()
    {
        self::$core_loaded = true;
        if ($handle = opendir(ROOT . DS . 'Public' . DS . 'Apps'))
        {
            /* loop through directory. */
            while (false !== ($dir = readdir($handle)))
            {
                if (is_dir(ROOT . DS . 'Public' . DS . 'Apps' . DS . $dir) && $dir != "." && $dir != "..")
                {
                    self::$core_blocks_name[] = $dir;
                }
            }
            closedir($handle);
        }
    }

    private static function retrieveCoreAppBlocksInfo()
    {
        $appnames = self::getCore();
        $appblock = new ApplicationBlock();
        $appblock->setName("CoreAppBlock");
        $appblock->setDescription("This contain the core applications of SmartBlocks.");

        foreach ($appnames as $appname)
        {
            if (file_exists(ROOT . DS . "Public" . DS . 'Apps' . DS . $appname . DS . "Config" . DS . "app.json"))
            {
                $data = file_get_contents(ROOT . DS . "Public" . DS . 'Apps' . DS . $appname . DS . "Config" . DS . "app.json");
                try
                {
                    $data = json_decode($data, true);

                    $app = new Application();
                    $app->setName($data["name"]);
                    $app->setDescription($data["description"]);
                    $app->setLink($data["link"]);
                    $appblock->addApp($app);
                } catch (Exception $e)
                {
                    MuffinApplication::addError($e->getMessage());
                }
            }
        }
        self::$core_application_block = $appblock;
    }

    public static function getPluginsApplicationBlocks()
    {
        self::retrievePluginsAppBlocksInfo();
        return self::$plugins_application_blocks;
    }

    public static function getCoreAppsName()
    {
        return self::getCore();
    }

    public static function getCoreApplicationBlocks()
    {
        self::retrieveCoreAppBlocksInfo();
        return self::$core_application_block;
    }

    public static function getAllApplicationBlocks()
    {
        $allAppBlocks = array();
        $allAppBlocks[] = self::getCoreApplicationBlocks();
        foreach (self::getPluginsApplicationBlocks() as $pluginsAppBlock)
        {
            $allAppBlocks[] = $pluginsAppBlock;
        }

        return $allAppBlocks;
    }
}