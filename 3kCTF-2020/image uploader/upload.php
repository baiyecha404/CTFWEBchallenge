<html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>
body {font-family: Arial, Helvetica, sans-serif;}
* {box-sizing: border-box;}

input[type=text], select, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 6px;
  margin-bottom: 16px;
  resize: vertical;
}

input[type=submit] {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type=submit]:hover {
  background-color: #45a049;
}

.container {
  border-radius: 5px;
  background-color: #ffffff;
  padding: 20px;
}
</style>
<style>
body {margin:0;}

.icon-bar {
  width: 100%;
  background-color: #555;
  overflow: auto;
}

.icon-bar a {
  float: left;
  width: 25%;
  text-align: center;
  padding: 12px 0;
  transition: all 0.3s ease;
  color: white;
  font-size: 36px;
}

.icon-bar a:hover {
  background-color: #000;
}

.active {
  background-color: #4CAF50;

}
</style>
<body>

<div class="icon-bar">
  <a href="/"><i class="fa fa-home"></i></a> 
  <a href="#"><i class=""></i></a> 
  <a class="active" href=""><i class="fa fa-upload"></i></a> 
  <a href="#"><i class=""></i></a>
  <a href="#"><i class=""></i></a> 
</div>

</body>
</html>
<body>
  <div class="container">
<form action="" method="post" enctype="multipart/form-data">
 <input type="file" name="image" >
 <input type="submit" value="submit">
 </form>
</div>
</body>
<?php

if (empty($_FILES['image']))
  die('Image file is missing');

$image = $_FILES['image'];

if ($image['error'] !== 0) {
   if ($image['error'] === 1) 
      die('Max upload size exceeded');

   die('Image uploading error: INI Error');
}

if (!file_exists($image['tmp_name']))
    die('Image file is missing in the server');
 $maxFileSize = 2 * 10e6; // = 2 000 000 bytes = 2MB
    if ($image['size'] > $maxFileSize)
        die('Max size limit exceeded');
$imageData = getimagesize($image['tmp_name']);
     if (!$imageData) 
     die('Invalid image');
$mimeType = $imageData['mime'];
$allowedMimeTypes = ['image/jpeg'];
 if (!in_array($mimeType, $allowedMimeTypes)) 
    die('Only JPEG is allowed');
$d =  bin2hex(random_bytes(32)).'.jpg';
$filename='/var/www/html/up/'.$d;
move_uploaded_file($_FILES['image']['tmp_name'],$filename);
echo 'done -> '.$d;



