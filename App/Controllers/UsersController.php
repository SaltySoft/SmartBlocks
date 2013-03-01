<?php
/**
 * Copyright (C) 2013 Antoine Jackson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */

class UsersController extends Controller
{

    private function security_check()
    {

    }

    function login($params = array())
    {
        if (isset($_POST["name"]) && isset($_POST["password"])) {
            $users = User::where(array("name" => $_POST["name"], "hash" => sha1($_POST["password"])));
            if (count($users) > 0) {
                $user = $users[0];
                $user->login();
            }
        }

        $this->redirect("/");
    }

    function logout($params = array())
    {
        $user = User::current_user();
        if ($user != null) {
            $user->logout();
        }
        $this->redirect("/");
    }


    function login_form()
    {

    }

    function create($params = array())
    {
        $user = new User();
        $usernames = User::where(array("name" => $_POST["name"]));
        $usermail = User::where(array("email" => $_POST["mail"]));
        if (count($usernames) == 0 && count($usermail) == 0)
        {
            $user->setName($_POST["name"]);
            $user->setMail($_POST["mail"]);
            $users = User::where(array("admin" => 1));
            if (count($users) == 0) {
                $user->setAdmin();
            }
            else
            {
                $user->setNormal();
            }

            $user->setHash($_POST["password"]);
            $user->save();
            $user->login();
            $this->redirect("/");
        }
        else
        {
            $this->flash("This user already exists");
            $this->redirect("/Users/login_form");
        }
    }



    function add($params = array())
    {

    }


    /**
     * This webservice waits for the following information :
     * firstname - first name of the user to update
     * lastname - last name of the user to update
     */
    function update($params = array())
    {
        $this->render = false;
        header("Content-Type: application/json");
        $user = User::find($params["id"]);
        $response = array();
        if (is_object($user))
        {
            $data = $this->getRequestData();

            $user->setFirstname(isset($data["firstname"]) ? $data["firstname"] : $user->getFirstname());
            $user->setLastname(isset($data["lastname"]) ? $data["lastname"] : $user->getLastname());

            $user->save();
            $response = array(
                "id" => $user->getId(),
                "firstname" => $user->getFirstname(),
            );
        }
        echo json_encode($response);
    }


}
