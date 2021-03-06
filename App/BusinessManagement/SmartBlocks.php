<?php

namespace BusinessManagement;

/**
 * This is the main logic class of the server app.
 */
class SmartBlocks
{
    /***************************************************************************/
    /***************************** public functions ****************************/
    /***************************************************************************/

    public static function loadAllBlocksAndApps()
    {
        self::loadKernelBlock();
        self::loadKernelApps();
        self::loadPluginsBlocks();
        self::loadPluginsApps();
    }

    public static function loadKernelBlock()
    {
        self::loadBlockOf(ROOT);
    }

    public static function loadKernelApps()
    {
        self::loadAppsOf(ROOT);
    }

    public static function loadPluginsBlocks()
    {
        foreach (self::getPluginsDirectoriesName() as $pluginDirName)
        {
            self::loadBlockOf(ROOT . DS . "Plugins" . DS . $pluginDirName);
        }
    }

    public static function loadPluginsApps()
    {
        foreach (self::getPluginsDirectoriesName() as $pluginDirName)
        {
            self::loadAppsOf(ROOT . DS . "Plugins" . DS . $pluginDirName);
        }
    }

    /***************************** public functions ****************************/
    /********************************** END ************************************/

    private  static function getPluginsDirectoriesName()
    {
        $plugins_directories_name = array();
        if (file_exists(ROOT . DS . 'Plugins') && $handle = opendir(ROOT . DS . 'Plugins'))
        {
            while (false !== ($dir = readdir($handle)))
            {
                if (is_dir(ROOT . DS . 'Plugins' . DS . $dir) && $dir != "." && $dir != "..")
                {
                    $plugins_directories_name[] = $dir;
                }
            }
            closedir($handle);
        }

        return $plugins_directories_name;
    }

    private static function createBlockWith($data)
    {
        $data = json_decode($data, true);
        $blocks = \ApplicationBlock::where(array("token" => $data["token"]));
        if (count($blocks) < 1)
            $block = new \ApplicationBlock();
        else
            $block = $blocks[0];
        $block->setName($data["name"]);
        $block->setToken($data["token"]);
        $block->setDescription($data["description"]);
        if (isset($data["logo_url"]))
            $block->setLogoUrl($data["logo_url"]);
        if (isset($data["color"]))
            $block->setColor($data["color"]);
        $block->save();
    }

    private static function loadBlockOf($blockPath)
    {
        if (file_exists($blockPath . DS . "Config") && $handle = opendir($blockPath . DS . "Config"))
        {
            if (file_exists($blockPath . DS . "Config" . DS . "block.json"))
            {
                $data = file_get_contents($blockPath . DS . "Config" . DS . "block.json");
                try
                {
                    self::createBlockWith($data);
                } catch (\Exception $e)
                {
                    \MuffinApplication::addError($e->getMessage());
                }
            }
        }
    }

    private static function createAppWith($data)
    {
        $data = json_decode($data, true);
        $apps = \Application::where(array("token" => $data["token"]));
        if (count($apps) < 1)
            $app = new \Application();
        else
            $app = $apps[0];

        $app->setName($data["name"]);
        $app->setToken($data["token"]);
        $app->setDescription($data["description"]);
        $app->setLink($data["link"]);
        $app->setAdminApp(isset($data["admin"]) && $data["admin"]);
        if (isset($data["logo_url"]))
            $app->setLogoUrl($data["logo_url"]);

        $blocks = \ApplicationBlock::where(array("token" => $data["block_token"]));
        $app->setBlock($blocks[0]);
        $app->save();
    }

    private static function loadAppsOf($blockPath)
    {
        if (file_exists($blockPath . DS . "Public") && $handle = opendir($blockPath . DS . "Public"))
        {
            if (file_exists($blockPath . DS . "Public" . DS . "Apps") && $handle = opendir($blockPath . DS . "Public" . DS . "Apps"))
            {
                while (false !== ($dir = readdir($handle)))
                {
                    $appPath = $blockPath . DS . "Public" . DS . "Apps" . DS . $dir;

                    if (is_dir($appPath) && $dir != "." && $dir != "..")
                    {
                        self::loadAppOf($appPath);
                    }
                }
                closedir($handle);
            }
        }
    }

    private static function loadAppOf($appPath)
    {
        if (file_exists($appPath . DS . "Config") && $handle = opendir($appPath . DS . "Config"))
        {
            if (file_exists($appPath . DS . "Config" . DS . "app.json"))
            {
                $data = file_get_contents($appPath . DS . "Config" . DS . "app.json");
                try
                {
                    self::createAppWith($data);
                } catch (\Exception $e)
                {
                    \MuffinApplication::addError($e->getMessage());
                }
            }
        }
    }
}