<?php

$device_id="123";
$sig=hash_hmac("sha384", $device_id, "supers3cr3T");
//echo($sig);

$data=array("device_id"=>$device_id,
                "sig"=>$sig);
$payload=(base64_encode(json_encode($data)));
echo($payload);

