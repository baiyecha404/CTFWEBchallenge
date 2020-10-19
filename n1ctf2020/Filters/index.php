<?php

isset($_POST['filters'])?print_r("show me your filters!"): die(highlight_file(__FILE__));
$input = explode("/",$_POST['filters']);
$source_file = "/var/tmp/".sha1($_SERVER["REMOTE_ADDR"]);
$file_contents = [];
foreach($input as $filter){
    array_push($file_contents, file_get_contents("php://filter/".$filter."/resource=/usr/bin/php"));
}
shuffle($file_contents);
file_put_contents($source_file, $file_contents);
try {
    require_once $source_file;
}
catch(\Throwable $e){
    pass;
}

unlink($source_file);

?>