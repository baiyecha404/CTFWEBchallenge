<?php
	session_start();
	if(@$_GET['new']){
		session_regenerate_id();
		session_destroy();
		header('location: ./'); exit ;
	}
	$dir="./projects/".md5(session_id().$_SERVER['REMOTE_ADDR']);
	if (!file_exists($dir)) {
        mkdir($dir, 0777, true);
        file_put_contents($dir.'/file.md', '');
    }
?>
<!DOCTYPE HTML>
<html lang="en">
<head>
	<title>REPORTER</title>
	<meta charset="utf-8">
	<link rel="stylesheet" href="css/style.css" type="text/css" media="all" />
	<link href="//fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&amp;subset=devanagari,latin-ext"
	 rel="stylesheet">
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" >
	<link rel="stylesheet" href="css/mystyles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.3/styles/default.min.css">
</head>
<body class="bg-dark2">
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark2 bg-border">
	  <a class="navbar-brand" href="#">REPORTER</a>
	  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
	    <span class="navbar-toggler-icon"></span>
	  </button>

	  <div class="collapse navbar-collapse" id="navbarSupportedContent">
	    <ul class="navbar-nav mr-auto">
	      <li class="nav-item active">
	        <a href="./?new=true">New Project</a>
	      </li>
	    </ul>
	  </div>
	</nav>
<section>
	<div class="container">
		<div class="row bg-dark2">
		  <div class="col-sm-12" style="padding-top: 50px;">
		  	<div class=" text-center justify-content-center">
			  		<div style="display: inline-flex;">
						<div class="wrapper"><button class="btn btn-secondary" id="edit">Edit</button></div>
						<div class="wrapper"><button style="margin-left:5px;" class="btn btn-secondary" id="preview" align="center">Preview</button></div>
						<div class="wrapper"><button style="margin-left:5px;" class="btn btn-secondary" id="save" align="center">Save</button></div>
						<div class="wrapper"><button style="margin-left:5px;" class="btn btn-secondary" id="deliver" align="center">Deliver</button></div>
					</div>
					<center>
						<img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/source.gif" width="100" height="100" align="center" id="loading">
					</center>
					<center>
						<label id="alert" class="label label-success"></label>
					</center>
				<br>
				<br>
				<div id="filecontent" class="display_res">
				</div>
				<center>
					<div class="textarea-wrapper">
						<textarea id="mdcontent" cols="100" rows="33"><?=(file_get_contents($dir.'/file.md'))?></textarea>
					</div>
					<br>
				</center>
			</div>	  	
		  </div>
		</div>
	</div>
	
</section>
	<script src="https://code.jquery.com/jquery-3.5.1.min.js" ></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" ></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.0.3/highlight.min.js"></script>
	<script src="https://cdn.jsdelivr.net/remarkable/1.7.1/remarkable.min.js"></script>
	<script src="js/funcs.js"></script>
</body>

</html>