<?php
include('old.php');//todo remove this useless file :\
include('men.html');
chdir('up/');
?>
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
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 30%;
}
</style>
<body>
<div class="container">
  <form action="" method="get">
    <label for="fname">Image</label>
    <input type="text" id="nome" name="img" placeholder="Image name">
    <center><input type="submit" value="Submit"></center>
</form>
</div>
</body>
<?php

if (isset($_GET["img"])) {
    if(preg_match('/^(ftp|zlib|https?|data|glob|phar|ssh2|compress.bzip2|compress.zlib|rar|ogg|expect)(.|\\s)*|(.|\\s)*(file|data|\.\.)(.|\\s)*/i',$_GET['img'])){
        die("no hack !");}

$img=$_GET["img"].'.jpg';
$a='data:image/png;base64,' . base64_encode(file_get_contents($img));
echo "<img class='center' src='$a'>";
}
