<?php
session_start();
$_SESSION["is_rick"] = false;

include "secrets.php"; // storing the variables not declared in this file
include "ricksecret/db.php"; // storing the login credentials for the database

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_GET["first"])) {
        parse_str(parse_url($_SERVER["REQUEST_URI"])["query"], $params);
        if ($params["first"] !== "pickle_rick") {
            if ($_GET["first"] === "pickle_rick") {
                if (isset($_GET["second"])) {
                    $hashed = crypt(md5($_GET["second"], fa1se), "asdf");
                    if (hash_equals($hashed, crypt(md5($hopper, fa1se), "asdf"))) {
                        if (isset($_GET["third"])) {
                            if (strlen($_GET["third"]) <= 10) {
                                $x = fopen("rightpaperheremorty.txt", "r");
                                $tmp = file_get_contents($_GET["third"]);
                                $content = fread($x, filesize("rightpaperheremorty.txt"));
                                if ($tmp === $content) {
                                    fclose($x);
                                    if (isset($_GET["fourth"])) {
                                        class injection_chambre {
                                            public $sprue;
                                            public $mold_plate1;
                                            public $mold_plate2;
                                        }
                                        if (!preg_match("/(^|;|{|})O:[0-9]+:\"/", $_GET["fourth"])) {
                                            $chambre = unserialize($_GET["fourth"]);
                                            if ($chambre) {
                                                $chambre->mold_plate1 = $barrel;
                                                if ($chambre->sprue === "pass" && $chambre->mold_plate1 === $chambre->mold_plate2) {
                                                    if (isset($_POST["fifth"])) {
                                                        $md5sum = md5(trim(file_get_contents("secret_pass.txt")));
                                                        if (preg_match("/\/[a-z\.\/]+$/i", $_POST["fifth"])) {
                                                            if (file_exists($_POST["fifth"]) && substr(md5($_POST["fifth"]), 0, 8) == $md5sum) {
                                                                if (isset($_GET["sixth"])) {
                                                                    if (filter_var($_GET["sixth"], FILTER_VALIDATE_URL)) {
                                                                        $url = parse_url($_GET["sixth"]);
                                                                        if (!preg_match("/tftp|sftp|http|https|file|dict/i", $url["scheme"]) && preg_match("/ricksecret/i", $url["path"]) && !preg_match("/\.\./i", $url["path"]) && !preg_match("/read|base|iconv|zlib/i", $url["path"])) {    
                                                                            echo file_get_contents($_GET["sixth"]) . "<br />";
                                                                            if (isset($_GET["sixth_second"])) {
                                                                                if (!preg_match("/sixth_second|sixth second/i", urldecode($_SERVER["QUERY_STRING"]))) {
                                                                                    $dbms = new mysqli($host, $username, $_GET["sixth_second"], $db_name); // There's one row where id=1 and secret='r1cks'
                                                                                    $dbms->set_charset("utf8");
                                                                                    if (!$dbms->connect_error) {
                                                                                        if (isset($_GET["seventh"])) {
                                                                                            if (!preg_match("/\.|_|%|regexp|like|\x09| |\x0d|\x0a|\x0b|\/|\*|x|0|r1cks|\(|\)/i", $_GET["seventh"])) {
                                                                                                $one = "SELECT secret FROM top_secrets WHERE secret='{$_GET["seventh"]}'";
                                                                                                $two = "SELECT secret FROM top_secrets /*{$_GET["seventh"]}*/";
                                                                                                $exe_one = $dbms->query($one);
                                                                                                if ($exe_one->num_rows > 0) {
                                                                                                    $res = $exe_one->fetch_assoc();
                                                                                                    if ($res["secret"] === "r1cks") {
                                                                                                        $exe_two = $dbms->query($two);
                                                                                                        if ($exe_two->num_rows > 0) {
                                                                                                            $res = $exe_two->fetch_assoc();
                                                                                                            if ($res["secret"] === "th3sm4rt3s7") {
                                                                                                                if (isset($_GET["eigth"])) {
                                                                                                                    extract($_COOKIE);
                                                                                                                    if ($_SESSION["is_rick"]) {
                                                                                                                        if (isset($_POST["nineth"])) {
                                                                                                                            $E = $_POST["nineth"];
                                                                                                                            $y = create_function('', substr($E, 0, 12));
                                                                                                                        }
                                                                                                                        else {
                                                                                                                            die("Where would you find the components of the injection?");
                                                                                                                        }
                                                                                                                    }
                                                                                                                    else {
                                                                                                                        die("Access denied for non ricks.");
                                                                                                                    }
                                                                                                                }
                                                                                                                else {
                                                                                                                    die("Where would you find cookies Morty?");
                                                                                                                }
                                                                                                            }
                                                                                                            else {
                                                                                                                $dbms->close();
                                                                                                                die("Oh not again Morty.");
                                                                                                            }
                                                                                                        }
                                                                                                        else {
                                                                                                            $dbms->close();
                                                                                                            die("Maybe somehow close.");
                                                                                                        }
                                                                                                    }
                                                                                                    else {
                                                                                                        $dbms->close();
                                                                                                        die("Wait what's that Morty?");
                                                                                                    }
                                                                                                }
                                                                                                else {
                                                                                                    $dbms->close();
                                                                                                    die("That's not even close Morty.");
                                                                                                }
                                                                                            }
                                                                                            else {
                                                                                                $dbms->close();
                                                                                                die("You touched something that you're not supposed to touch.");
                                                                                            }
                                                                                        }
                                                                                        else {
                                                                                            $dbms->close();
                                                                                            die("Where would you find the components of the injection?");
                                                                                        }
                                                                                    }
                                                                                    else {
                                                                                        die("I don't think that's my password Morty.");
                                                                                    }
                                                                                }
                                                                                else {
                                                                                    die("You touched something that you're not supposed to touch.");
                                                                                }
                                                                            }
                                                                            else {
                                                                                die("Where would you find the components of the injection?");
                                                                            }
                                                                        }
                                                                        else {
                                                                            die("You touched something that you're not supposed to touch.");
                                                                        }
                                                                    }
                                                                    else {
                                                                        die("That's suspicious Morty.");
                                                                    }
                                                                }
                                                                else {
                                                                    die("Where would you find the components of the injection?");
                                                                }
                                                            }
                                                            else {
                                                                echo "{$md5sum}<br />";
                                                                die("You lost against the jugling of Rick.");
                                                            }
                                                        }
                                                        else {
                                                            die("You touched something that you're not supposed to touch.");
                                                        }
                                                    }
                                                    else {
                                                        die("Where would you find the components of the injection?");
                                                    }
                                                }
                                                else {
                                                    die("Absolutely not the same.");
                                                }
                                            }
                                            else {
                                                die("Are you sure that's Ok?");
                                            }
                                        }
                                        else {
                                            die("You touched something that you're not supposed to touch.");
                                        }
                                    }
                                    else {
                                        die("Where would you find the components of the injection?");
                                    }
                                }
                                else {
                                    fclose($x);
                                    die("You picked up the wrong paper.");
                                }
                            }
                            else {
                                die("You don't know which paper reading it will lead to the right path.");
                            }
                        }
                        else {
                            die("Where would you find the components of the injection?");
                        }
                    }
                    else {
                        echo md5($hopper, false) . "<br />";
                        die("You didn't know which hopper to use for the injection.");
                    }
                }
                else {
                    die("Where would you find the components of the injection?");
                }
            }
            else {
                die("You were putting the wrong matter.");
            }
        }
        else {
            die("You made a mistake that resulted in an explotion.");
        }
    }
    else {
        die("Where would you find the components of the injection?");
    }
}
else {
    show_source(__FILE__);
    exit(0);
}
?>