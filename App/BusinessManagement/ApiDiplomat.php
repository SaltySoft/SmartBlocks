<?php
/**
 * Created by Antoine Jackson
 * Date: 6/17/13
 * Time: 10:41 PM
 */

/**
 * Class ApiDiplomat
 * This class gives out a list of high level methods to deal with Http Apis
 */
class ApiDiplomat
{
    private $base_url;

    public function __construct($url)
    {
        $this->base_url = $url;
    }

    public function post2json($suburl, $params)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $this->base_url . $suburl);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_POSTFIELDS,
            http_build_query($params));
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $server_output = curl_exec($ch);

        return json_decode($server_output, true);
    }

}