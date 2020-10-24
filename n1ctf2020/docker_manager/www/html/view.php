<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">-->
    <link rel="stylesheet" href="css/bulma.min.css">
    <!--<script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>-->
    <script defer src="js/fa.js"></script>
    <title>Docker Manager</title>
  </head>
  <body>
    <section class="section">
      <div class="container">
        <h1 class="title">Docker Manager</h1>
        <figure class="image is-128x128">
          <img class="is-rounded" src="./img/docker.jpg">
        </figure>
        <p>
          <span class="has-text-primary has-text-weight-bold">Result:</span>
<?php

$request = $_REQUEST;
function grab_request_var($varname, $default = "")
{
    global $request;
    $v = $default;
    if (isset($request[$varname])) {
        $v = $request[$varname];
    }
    return $v;
}

$mode = grab_request_var('mode', 'containers');
if (!in_array($mode, array('containers', 'networks'))) {
  $mode = 'containers';
}

$objects = array();

$cert = escapeshellarg(grab_request_var('cert', ''));
if (!empty($cert) && $cert !== "''") {
  $cert = " --cert=" . $cert; 
}
else {
  $cert = "";
}

$key = escapeshellarg(grab_request_var('key', ''));
if (!empty($key) && $key !== "''") {
  $key = " --key=" . $key; 
}
else {
  $key = "";
}

$cacert = escapeshellarg(grab_request_var('cacert', ''));
if (!empty($cacert) && $cacert !== "''") {
  $cacert = " --cacert=" . $cacert; 
}
else {
  $cacert = "";
}

$host_addr = grab_request_var('host', '');

if (!$host_addr) {
  echo json_encode("error_host");
  exit();
}
if (substr($host_addr, -1) !== '/') {
  $host_addr .= '/';
}


if ($mode === 'containers')
  $mode .= '/json';
else 
  $mode .= '/';

$host_addr .= $mode . '?all=true';
$host_addr = escapeshellarg($host_addr);

$cmd = 'curl --connect-timeout 10 ' . $host_addr . ' -g ' . $cert . $key . $cacert;
$output = array();
$ret = 0;
exec($cmd, $output, $ret);

if ($ret > 0) {
  echo json_encode("error_curl");
  exit();
}

$output = implode("\n", $output);

$output = json_decode($output, true);

if (isset($output['message'])) {
  $output['cmd'] = $cmd;
  echo json_encode($output);
  exit();
}

foreach($output as $item) {

  preg_replace("/[^a-f0-9]/", '', $item['Id']);
  $name_or_id = $item['Id'];

  if (array_key_exists('Names', $item) && is_array($item['Names'])) {
    preg_replace("/[^a-z_]/", '', $item['Names'][0]);
    $name_or_id = $item['Names'][0];
  }
  else if (array_key_exists('Name', $item)) {
    preg_replace("/[^a-z_]/", '', $item['Name']);
    $name_or_id = $item['Name'];  
  }

  $objects[] = $name_or_id;
}
echo json_encode($objects);
exit();
?>
        </p>
      </div>
    </section>
  </body>
</html>