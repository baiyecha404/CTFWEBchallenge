<?php

/*
     Welcome to my Unserialize Oriented Programming System:
 
             __    __________ 
            / /   / ____/ __ \
           / /   /___ \/ / / /
          / /_______/ / /_/ / 
         /_____/_____/_____/  
                     
         

*/

session_start();
ini_set('max_execution_time', '5');
set_time_limit(5);

$status = "new";
$cmd = "whoami";
$is_upload = false;
$is_unser_finished = false;
$l5d_file = NULL;

class L5D_Upload {

    function __wakeup() {
        global $cmd;
        global $is_upload;
        $cmd = "whoami";
        $_SESSION['name'] = randstr(14);
        $is_upload = (count($_FILES) > 0);
    }

    function __destruct() {
        global $is_upload;
        global $status;
        global $l5d_file;
        $status = "upload_fail";
        if ($is_upload) {

            foreach ($_FILES as $key => $value)
                $GLOBALS[$key] = $value;
        
            if(is_uploaded_file($l5d_file['tmp_name'])) {
                
                $check = @getimagesize($l5d_file["tmp_name"]);
                
                if($check !== false) {

                    $target_dir = "/var/tmp/";
                    $target_file = $target_dir . randstr(10);

                    if (file_exists($target_file)) {
                        echo "File already exists..<br>";
                        finalize();
                        exit;
                    }

                    if ($l5d_file["size"] > 500000) {
                        echo "File is too large..<br>";
                        finalize();
                        exit;
                    }

                    if (move_uploaded_file($l5d_file["tmp_name"], $target_file)) {
                        echo "File upload OK!<br>";
                        $l5d_file = $target_file;
                        $status = "upload_ok";
                    } else {
                        echo "Upload failed :(<br>";
                        finalize();
                        exit;
                    }

                } else {
                    finalize();
                    exit;
                }
                
            } else {
                echo "Bad hacker!<br>";
                finalize();
                exit;
            }
        }
    }
}

class L5D_ResetCMD {

    protected $new_cmd = "echo 'I am new cmd!'";

    function __wakeup() {
        global $cmd;
        global $is_upload;
        global $status;
        $_SESSION['name'] = randstr(14);
        $is_upload = false;

        if(!isset($this->new_cmd)) {
            $status = "error";
            $error = "Empty variable error!";
            throw new Exception($error);   
        }

        if(!is_string($this->new_cmd)) {
            $status = "error";
            $error = 'Type error!';
            throw new Exception($error);
        }
    }

    function __destruct() {
        global $cmd;
        global $status;
        $status = "reset";
        if($_SESSION['name'] === 'wubalubadubdub') {
            $cmd = $this->new_cmd;
        }
    }

}

class L5D_Login {

    function __wakeup() {
        $this->login();
    }

    function __destruct() {
        $this->logout();
    }

    function login() {
        $flag = file_get_contents("/flag");
        $p4ssw0rd = hash("sha256", $flag);
        if($_GET['p4ssw0rd'] === $p4ssw0rd)
            $_SESSION['name'] = "wubalubadubdub";
    }

    function logout() {
        global $status;
        unset($_SESSION['name']);
        $status = "finish";
    }

}

class L5D_SayMyName {

    function __wakeup() {
        if(!isset($_SESSION['name'])) 
            $_SESSION['name'] = randstr(14);
        echo "Your name is ".$_SESSION['name']."<br>";
    }

    function __destruct() {
        echo "Your name is ".$_SESSION['name']."<br>";
    }

}

class L5D_Command {

    function __wakeup() {
        global $cmd;
        global $is_upload;
        $_SESSION['name'] = randstr(14);
        $is_upload = false;
        $cmd = "whoami";
    }

    function __toString() {
        global $cmd;
        return "Here is your command: {$cmd} <br>";
    }

    function __destruct() {
        global $cmd;
        global $status;
        global $is_unser_finished;
        $status = "cmd";
        if($is_unser_finished === true) {
            echo "Your command [<span style='color:red'>{$cmd}</span>] result: ";
            echo "<span style='color:blue'>";
            @system($cmd);
            echo "</span>";
        }
    }

}

function randstr($len)
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_=';
    $randstring = '';
    for ($i = 0; $i < $len; $i++) {
        $randstring .= $characters[rand(0, strlen($characters))];
    }
    return $randstring;
}

function waf($s) {
    if(stripos($s, "*") !== FALSE)
        return false;
    return true;
}

function finalize() {
    $cmd = "";
    $is_upload = false;
    unset($_SESSION);
    @unlink($l5d_file);
    $status = "finish";
    echo "<img src='trippycat.gif'><br>";
}


if(isset($_GET['action'])) {
    $action = $_GET['action'];
    switch ($action) {
        case "src":
            highlight_file(__FILE__);
            break;
        case "cmd":
            echo "wanna run system command? here you are!";
            header('Location: /?%3f=O:11:"L5D_Command":0:{}');
            break;
        case "reset":
            echo "u must be very lucky to set the running cmd :p";
            header('Location: /?%3f=O:12:"L5D_ResetCMD":1:{}');
            break;
        case "upload":
            $resp = <<<EOF
<form action="/index.php?%3f=O:10:%22L5D_Upload%22:0:{}" method="post" enctype="multipart/form-data">
  <input type="file" name="l5d_file">
  <input type="submit" value="Upload Image" name="submit">
</form>
EOF;
            echo $resp;
            break;
        case "saymyname":
            echo base64_decode("PGltZyBzcmM9J3NheW15bmFtZS5naWYnPgo=");
            header('Location: /?%3f=O:13:"L5D_SayMyName":0:{}');
            break;
        default:
            echo "Nobody exists on purpose. Nobody belongs anywhere. Everybody's gonna die. Come watch TV.";
    }
    finalize();
    die("Thank you for using the L5D, bye!<br>");
}

if(isset($_GET['?'])) {
    
    $wtf = waf($_GET{'?'}) ? $_GET['?'] : (finalize() && die("Nice try!"));
    
    if($goodshit = @unserialize($wtf)) {
        $is_unser_finished = true;
    }

    if(in_array($status, array('new', 'cmd', 'upload_ok', 'upload_fail', 'reset'), true))
        finalize();
    die("Thank you for using the L5D, bye!<br>");
}

?>