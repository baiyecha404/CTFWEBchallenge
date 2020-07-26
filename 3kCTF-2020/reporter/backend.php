<?php
error_reporting(0);
session_start();
function fetch_remote_file($url) {
    $config['disallowed_remote_hosts'] = array('localhost');
    $config['disallowed_remote_addresses'] = array("0.0.0.0/8", "10.0.0.0/8", "100.64.0.0/10", "127.0.0.0/8", "169.254.0.0/16", "172.16.0.0/12", "192.0.0.0/29", "192.0.2.0/24", "192.88.99.0/24", "192.168.0.0/16", "198.18.0.0/15", "198.51.100.0/24", "203.0.113.0/24", "224.0.0.0/4", "240.0.0.0/4",);
    $url_components = @parse_url($url);
    if (!isset($url_components['scheme'])) {
        return false;
    }
    if (@($url_components['port'])) {
        return false;
    }
    if (!$url_components) {
        return false;
    }
    if ((!empty($url_components['scheme']) && !in_array($url_components['scheme'], array('http', 'https')))) {
        return false;
    }
    if (array_key_exists("user", $url_components) || array_key_exists("pass", $url_components)) {
        return false;
    }
    if ((!empty($config['disallowed_remote_hosts']) && in_array($url_components['host'], $config['disallowed_remote_hosts']))) {
        return false;
    }
    $addresses = get_ip_by_hostname($url_components['host']);
    $destination_address = $addresses[0];
    if (!empty($config['disallowed_remote_addresses'])) {
        foreach ($config['disallowed_remote_addresses'] as $disallowed_address) {
            $ip_range = fetch_ip_range($disallowed_address);
            $packed_address = my_inet_pton($destination_address);
            if (is_array($ip_range)) {
                if (strcmp($ip_range[0], $packed_address) <= 0 && strcmp($ip_range[1], $packed_address) >= 0) {
                    return false;
                }
            } elseif ($destination_address == $disallowed_address) {
                return false;
            }
        }
    }
    $opts = array('http' => array('follow_location' => 0,));
    $context = stream_context_create($opts);
    return file_get_contents($url, false, $context);
}
function get_ip_by_hostname($hostname) {
    $addresses = @gethostbynamel($hostname);
    if (!$addresses) {
        $result_set = @dns_get_record($hostname, DNS_A);
        if ($result_set) {
            $addresses = array_column($result_set, 'ip');
        } else {
            return false;
        }
    }
    return $addresses;
}
function fetch_ip_range($ipaddress) {
    if (strpos($ipaddress, '*') !== false) {
        if (strpos($ipaddress, ':') !== false) {
            $upper = str_replace('*', 'ffff', $ipaddress);
            $lower = str_replace('*', '0', $ipaddress);
        } else {
            $ip_bits = count(explode('.', $ipaddress));
            if ($ip_bits < 4) {
                $replacement = str_repeat('.*', 4 - $ip_bits);
                $ipaddress = substr_replace($ipaddress, $replacement, strrpos($ipaddress, '*') + 1, 0);
            }
            $upper = str_replace('*', '255', $ipaddress);
            $lower = str_replace('*', '0', $ipaddress);
        }
        $upper = my_inet_pton($upper);
        $lower = my_inet_pton($lower);
        if ($upper === false || $lower === false) {
            return false;
        }
        return array($lower, $upper);
    } elseif (strpos($ipaddress, '/') !== false) {
        $ipaddress = explode('/', $ipaddress);
        $ip_address = $ipaddress[0];
        $ip_range = (int)$ipaddress[1];
        if (empty($ip_address) || empty($ip_range)) {
            return false;
        } else {
            $ip_address = my_inet_pton($ip_address);
            if (!$ip_address) {
                return false;
            }
        }
        $ip_pack = $ip_address;
        $ip_pack_size = strlen($ip_pack);
        $ip_bits_size = $ip_pack_size * 8;
        $ip_bits = '';
        for ($i = 0;$i < $ip_pack_size;$i = $i + 1) {
            $bit = decbin(ord($ip_pack[$i]));
            $bit = str_pad($bit, 8, '0', STR_PAD_LEFT);
            $ip_bits.= $bit;
        }
        $ip_bits = substr($ip_bits, 0, $ip_range);
        $ip_lower_bits = str_pad($ip_bits, $ip_bits_size, '0', STR_PAD_RIGHT);
        $ip_higher_bits = str_pad($ip_bits, $ip_bits_size, '1', STR_PAD_RIGHT);
        $ip_lower_pack = '';
        for ($i = 0;$i < $ip_bits_size;$i = $i + 8) {
            $chr = substr($ip_lower_bits, $i, 8);
            $chr = chr(bindec($chr));
            $ip_lower_pack.= $chr;
        }
        $ip_higher_pack = '';
        for ($i = 0;$i < $ip_bits_size;$i = $i + 8) {
            $chr = substr($ip_higher_bits, $i, 8);
            $chr = chr(bindec($chr));
            $ip_higher_pack.= $chr;
        }
        return array($ip_lower_pack, $ip_higher_pack);
    } else {
        return my_inet_pton($ipaddress);
    }
}
function my_inet_pton($ip) {
    if (function_exists('inet_pton')) {
        return @inet_pton($ip);
    } else {
        $r = ip2long($ip);
        if ($r !== false && $r != - 1) {
            return pack('N', $r);
        }
        $delim_count = substr_count($ip, ':');
        if ($delim_count < 1 || $delim_count > 7) {
            return false;
        }
        $r = explode(':', $ip);
        $rcount = count($r);
        if (($doub = array_search('', $r, 1)) !== false) {
            $length = (!$doub || $doub == $rcount - 1 ? 2 : 1);
            array_splice($r, $doub, $length, array_fill(0, 8 + $length - $rcount, 0));
        }
        $r = array_map('hexdec', $r);
        array_unshift($r, 'n*');
        $r = call_user_func_array('pack', $r);
        return $r;
    }
}




$dir="./projects/".md5(session_id().$_SERVER['REMOTE_ADDR']);
if(@$_POST['filecontent'] AND @$_POST['mdcontent']){
	if (!file_exists($dir)) {
		exit;
	}
	file_put_contents($dir.'/file.md', $_POST["mdcontent"]);
	file_put_contents($dir.'/file.html', $_POST["filecontent"]);
	echo "done";
	exit;
}
if(@$_POST['deliver']){
	$thisDoc=file_get_contents($dir.'/file.html');
	$images = preg_match_all("/<img src=\"(.*?)\" /", $thisDoc, $matches);
	foreach ($matches[1] as $key => $value) {
		$thisDoc = str_replace($value , "data:image/png;base64,".base64_encode(fetch_remote_file($value)) , $thisDoc ) ;
	}
	$template='
	<!DOCTYPE html>
	<html>
	<head>
		<title>REPORT</title>
		<style type="text/css">
			.docu{
				background-color: #828282;
				-webkit-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
				-moz-box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
				box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75);
				width: 700px;border: 1px solid black;
			}
		</style>
	</head>
	<body>
		<center>
			<div class="docu">
				'.$thisDoc.'
			</div>
		</center>
	</body>
	</html>';
	file_put_contents($dir."/report.html", $template);
	echo $dir."/report.html";
	exit;
}
die('wut?');