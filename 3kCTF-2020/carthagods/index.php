<!DOCTYPE html>
<html lang="en">
<head>
	<title>Carthagods</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
<!--===============================================================================================-->	
	<link rel="icon" type="image/png" href="images/icons/favicon.ico"/>
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/bootstrap/css/bootstrap.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="fonts/font-awesome-4.7.0/css/font-awesome.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="fonts/iconic/css/material-design-iconic-font.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/animate/animate.css">
<!--===============================================================================================-->	
	<link rel="stylesheet" type="text/css" href="vendor/css-hamburgers/hamburgers.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/animsition/css/animsition.min.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="vendor/select2/select2.min.css">
<!--===============================================================================================-->	
	<link rel="stylesheet" type="text/css" href="vendor/daterangepicker/daterangepicker.css">
<!--===============================================================================================-->
	<link rel="stylesheet" type="text/css" href="css/util.css">
	<link rel="stylesheet" type="text/css" href="css/main.css">
<!--===============================================================================================-->
</head>
<body>
	
	<div class="limiter">
		<div class="container-login100" style="background-image: url('images/bg-01.jpg');">
			<div class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
				<form class="login100-form validate-form">
					<span class="login100-form-title p-b-49">
						Carthagods
					</span>

					<div class="wrap-input100 validate-input m-b-23" >
						<span class="label-input100"><a href="./baal">Baal</a></span>
					</div>
					<div class="wrap-input100 validate-input m-b-23">
						<span class="label-input100"><a href="./tanit">Tanit</a></span>
					</div>
					<div class="wrap-input100 validate-input m-b-23">
						<span class="label-input100"><a href="./dido">Dido</a></span>
					</div>
					<div class="wrap-input100 validate-input m-b-23">
						<span class="label-input100"><a href="./caelestis">caelestis</a></span>
					</div>
					<div class="wrap-input100 validate-input m-b-23">
						<span class="label-input100"><a href="./info.php">phpinfo</a></span>
					</div>
					<div class="wrap-input100 validate-input m-b-23">
						<span class="label-input100"><a href="./flag.php">FLAG</a></span>
					</div>

					<div class="wrap-input100 validate-input m-b-23">
						<textarea class="label-input100" style="color:black;width: 100%;height: 300px;"><?php
								if(@$_GET[*REDACTED*]){
									$file=$_GET[*REDACTED*];
									$f=file_get_contents('thecarthagods/'.$file);
									if (!preg_match("/<\?php/i", $f)){
									    echo $f;
									}else{
										echo 'php content detected';
									}
								}
							?>
						</textarea>
					</div>
					
					
					

					
				</form>
			</div>
		</div>
	</div>
	

	<div id="dropDownSelect1"></div>
	
<!--===============================================================================================-->
	<script src="vendor/jquery/jquery-3.2.1.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/animsition/js/animsition.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/bootstrap/js/popper.js"></script>
	<script src="vendor/bootstrap/js/bootstrap.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/select2/select2.min.js"></script>
<!--===============================================================================================-->
	<script src="vendor/daterangepicker/moment.min.js"></script>
	<script src="vendor/daterangepicker/daterangepicker.js"></script>
<!--===============================================================================================-->
	<script src="vendor/countdowntime/countdowntime.js"></script>
<!--===============================================================================================-->
	<script src="js/main.js"></script>

</body>
</html>
