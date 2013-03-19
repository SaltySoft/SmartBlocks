<?php

namespace BusinessManagement;

/**
 * This is the main logic class of the server app.
 */
class SmartBlocks
{
    private static $core_block;
    private static $core_apps_directory_name = array();
    private static $plugins_blocks = array();

    /***************************************************************************/
    /***************************** public functions ****************************/
    /***************************************************************************/

    public static function loadAllBlocks()
    {
        self::getCoreBlock();
        self::loadPlugins();
     }

    public static function getAllBlocks()
    {
        $blocks = array();
        $blocks[] = self::getCoreBlock();
        foreach (self::getPluginsBlocks() as $pluginBlock)
        {
            $blocks[] = $pluginBlock;
        }

        return $blocks;
    }

    public static function getCoreBlock()
    {
        self::getCoreBlockInfo();
        self::getCoreAppsDirectoriesName();
        self::retrieveCoreAppsInfo();
    }

    public static function getPluginsBlocks()
    {
        self::getPluginsDirectoriesName();
        self::getPluginsBlocksInfo();
        self::retrievePluginsAppsInfo();
    }

    /***************************** public functions ****************************/
    /********************************** END ************************************/

    /***************************************************************************/
    /***************************** CORE STUFF **********************************/
    /********************************BEGIN**************************************/

    private static function getCoreBlockInfo()
    {
        if (file_exists(ROOT . DS . "Config" . DS . "block.json"))
        {
            $data = file_get_contents(ROOT . DS . "Config" . DS . "block.json");
            try
            {
                $data = json_decode($data, true);
                $coreBlock = new \ApplicationBlock();
                $coreBlock->setName($data["name"]);
                $coreBlock->setToken($data["token"]);
                $coreBlock->setDescription($data["description"]);
                if (isset($data["logoUrl"]))
                    $coreBlock->setLogoUrl($data["logoUrl"]);
                if (isset($data["color"]))
                    $coreBlock->setColor($data["color"]);
                $coreBlock->save();
                self::$core_block = $coreBlock;
            } catch (\Exception $e)
            {
                \MuffinApplication::addError($e->getMessage());
            }
        }
    }

    /**
     * Loop through Public/Apps directory.
     * Get each directory name other that '.' and '..'.
     * Into $core_apps_directory_name.
     **/
    private static function getCoreAppsDirectoriesName()
    {
        if (file_exists(ROOT . DS . 'Public' . DS . 'Apps') &&  $handle = opendir(ROOT . DS . 'Public' . DS . 'Apps'))
        {
            while (false !== ($dir = readdir($handle)))
            {
                if (is_dir(ROOT . DS . 'Public' . DS . 'Apps' . DS . $dir) && $dir != "." && $dir != "..")
                {
                    self::$core_apps_directory_name[] = $dir;
                }
            }
            closedir($handle);
        }
    }

    private static function retrieveCoreAppsInfo()
    {
        $appsDirectoryName = self::$core_apps_directory_name;

        foreach ($appsDirectoryName as $appDirectoryName)
        {
            if (file_exists(ROOT . DS . "Public" . DS . 'Apps' . DS . $appDirectoryName . DS . "Config") &&  $handle = opendir(ROOT . DS . "Public" . DS . 'Apps' . DS . $appDirectoryName . DS . "Config"))
            {
                if (file_exists(ROOT . DS . "Public" . DS . 'Apps' . DS . $appDirectoryName . DS . "Config" . DS . "app.json"))
                {
                    $data = file_get_contents(ROOT . DS . "Public" . DS . 'Apps' . DS . $appDirectoryName . DS . "Config" . DS . "app.json");
                    try
                    {
                        $data = json_decode($data, true);

                        $app = new \Application();
                        $app->setName($data["name"]);
                        $app->setToken($data["token"]);
                        $app->setDescription($data["description"]);
                        $app->setLink($data["link"]);
                        $app->setAdminApp(isset($data["admin"]) && $data["admin"]);
                        if (isset($data["logoUrl"]))
                            $app->setLogoUrl($data["logoUrl"]);
                        $app->setBlock(self::$core_block);
                        $app->save();
                    } catch (\Exception $e)
                    {
                        \MuffinApplication::addError($e->getMessage());
                    }
                }
            }
        }
    }

    /***************************** CORE STUFF **********************************/
    /*********************************END***************************************/


    /***************************************************************************/
    /**************************** PLUGINS STUFF ********************************/
    /*********************************BEGIN*************************************/

    private static function getPluginsDirectoriesName()
    {
        $plugins_directories_name = array();
        if (file_exists(ROOT . DS . 'Plugins') &&  $handle = opendir(ROOT . DS . 'Plugins'))
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

    private static function loadPlugins()
    {
        $plugins_directories_name = array();
        if (file_exists(ROOT . DS . 'Plugins') &&  $handle = opendir(ROOT . DS . 'Plugins'))
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

        foreach ($plugins_directories_name as $directoryName)
        {
            if (file_exists(ROOT . DS . "Plugins" . DS . $directoryName . DS . "Config") &&  $handle = opendir(ROOT . DS . "Plugins" . DS . $directoryName . DS . "Config"))
            {
                if (file_exists(ROOT . DS . "Plugins" . DS . $directoryName . DS . "Config" . DS . "block.json"))
                {
                    $data = file_get_contents(ROOT . DS . "Plugins" . DS . $directoryName . DS . "Config" . DS . "block.json");

                    try
                    {
                        $data = json_decode($data, true);

                        $pluginBlock = new \ApplicationBlock();
                        $pluginBlock->setName($data["name"]);
                        $pluginBlock->setToken($data["token"]);
                        $pluginBlock->setDescription($data["description"]);
                        if (isset($data["logoUrl"]))
                            $pluginBlock->setLogoUrl($data["logoUrl"]);
                        if (isset($data["color"]))
                            $pluginBlock->setColor($data["color"]);
                        $pluginBlock->save();
                        $pluginsAppsDirectoriesName = array();

                        if (file_exists(ROOT . DS . 'Plugins' . DS . $directoryName . DS . "Public" . DS . "Apps") &&  $handle = opendir(ROOT . DS . 'Plugins' . DS . $directoryName . DS . "Public" . DS . "Apps"))
                        {
                            while (false !== ($dir = readdir($handle)))
                            {
                                if (is_dir(ROOT . DS . 'Plugins' . DS . $directoryName . DS . "Public" . DS . "Apps" . DS . $dir) && $dir != "." && $dir != "..")
                                {
                                    $pluginsAppsDirectoriesName[] = $dir;
                                }
                            }
                            closedir($handle);
                        }

                        foreach ($pluginsAppsDirectoriesName as $pluginsAppDirectoryName)
                        {
                            if (file_exists(ROOT . DS . "Plugins" . DS . $directoryName . DS . "Public" . DS . "Apps" . DS . $pluginsAppDirectoryName . DS . "Config" . DS . "app.json"))
                            {
                                $data = file_get_contents(ROOT . DS . "Plugins" . DS . $directoryName . DS . "Public" . DS . "Apps" . DS . $pluginsAppDirectoryName . DS . "Config" . DS . "app.json");

                                try
                                {
                                    $data = json_decode($data, true);

                                    $app = new \Application();
                                    $app->setName($data["name"]);
                                    $app->setToken($data["token"]);
                                    $app->setDescription($data["description"]);
                                    $app->setLink($data["link"]);
                                    $app->setAdminApp(isset($data["admin"]) && $data["admin"]);
                                    if (isset($data["logoUrl"]))
                                        $app->setLogoUrl($data["logoUrl"]);
                                    $app->setBlock($pluginBlock);
                                    $app->save();
                                } catch (\Exception $e)
                                {
                                    \MuffinApplication::addError($e->getMessage());
                                }
                            }
                        }
                    } catch (\Exception $e)
                    {
                        \MuffinApplication::addError($e->getMessage());
                    }
                }
            }
        }
    }

    private static function getPluginsBlocksInfo()
    {
        $directoriesNames = self::getPluginsDirectoriesName();

        foreach ($directoriesNames as $directoryName)
        {
            if (file_exists(ROOT . DS . "Plugins" . DS . $directoryName . DS . "Config" . DS . "block.json"))
            {
                $data = file_get_contents(ROOT . DS . "Plugins" . DS . $directoryName . DS . "Config" . DS . "block.json");

                try
                {
                    $data = json_decode($data, true);

                    $pluginBlock = new \ApplicationBlock();
                    $pluginBlock->setName($data["name"]);
                    $pluginBlock->setToken($data["token"]);
                    $pluginBlock->setDescription($data["description"]);
                    if (isset($data["logoUrl"]))
                        $pluginBlock->setLogoUrl($data["logoUrl"]);
                    if (isset($data["color"]))
                        $pluginBlock->setColor($data["color"]);
                    $pluginBlock->save();
                    self::$plugins_blocks[] = $pluginBlock;
                } catch (\Exception $e)
                {
                    \MuffinApplication::addError($e->getMessage());
                }
            }
        }
    }

    private static function retrievePluginsAppsInfo()
    {
        $directoriesName = self::getPluginsDirectoriesName();
        $counter = 0;

        foreach ($directoriesName as $directoryName)
        {
            $pluginsAppsDirectoriesName = array();

            if (file_exists(ROOT . DS . 'Plugins' . DS . $directoryName . DS . "Public" . DS . "Apps") &&  $handle = opendir(ROOT . DS . 'Plugins' . DS . $directoryName . DS . "Public" . DS . "Apps"))
            {
                while (false !== ($dir = readdir($handle)))
                {
                    if (is_dir(ROOT . DS . 'Plugins' . DS . $directoryName . DS . "Public" . DS . "Apps" . DS . $dir) && $dir != "." && $dir != "..")
                    {
                        $pluginsAppsDirectoriesName[] = $dir;
                    }
                }
                closedir($handle);
            }

            foreach ($pluginsAppsDirectoriesName as $pluginsAppDirectoryName)
            {
                if (file_exists(ROOT . DS . "Plugins" . DS . $directoryName . DS . "Public" . DS . "Apps" . DS . $pluginsAppDirectoryName . DS . "Config" . DS . "app.json"))
                {
                    $data = file_get_contents(ROOT . DS . "Plugins" . DS . $directoryName . DS . "Public" . DS . "Apps" . DS . $pluginsAppDirectoryName . DS . "Config" . DS . "app.json");

                    try
                    {
                        $data = json_decode($data, true);

                        $app = new \Application();
                        $app->setName($data["name"]);
                        $app->setToken($data["token"]);
                        $app->setDescription($data["description"]);
                        $app->setLink($data["link"]);
                        $app->setAdminApp(isset($data["admin"]) && $data["admin"]);
                        if (isset($data["logoUrl"]))
                            $app->setLogoUrl($data["logoUrl"]);
                        $app->setBlock(self::$plugins_blocks[$counter]);
                        $app->save();
                    } catch (\Exception $e)
                    {
                        \MuffinApplication::addError($e->getMessage());
                    }
                }
            }
            $counter++;
        }
    }

    /**************************** PLUGINS STUFF ********************************/
    /*********************************END***************************************/
}