<?php
	$q = $_GET['q'];
	// decode json
	$data = base64_decode($q);
	$json_data = json_decode($data, true);
	$device_id = $json_data["device_id"];
	$sig = $json_data["sig"];

	// verify sig
	if(!hash_equals(hash_hmac("sha384", $device_id, "supers3cr3T"), $sig)){
	    die("invalid sig");
	}

	$conn = mysqli_connect('db', 'user', 'test', "myDb") or die(mysqli_error($conn));

	$query = "insert into analytics_data(device_id) values('".$device_id."')";
	$result = mysqli_query($conn, $query) or die(mysqli_error($conn));

	mysqli_close($conn);
	echo "OK. Here's one flag for you flag{Gr8_n0w_gO_h4ck_3m!}";
?>
