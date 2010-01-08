<?php 
session_start();
require_once("config.php"); 
?>
<html>
	<head>
		<title><?php echo $settings["display.name"] ?></title>
		<link rel="stylesheet" href="css/default.css" type="text/css" />
		
		<script type="text/javascript">
		var DisplayInterval = <?php echo $settings["js.interval"] ?>;
		</script>
		<script type="text/javascript" src="js/jquery-1.3.2.min.js"></script>
		<script type="text/javascript" src="js/content.js"></script>
	</head>
	
	<body onload="DisplayStart();" onclick="DisplayUpdate();">
		<div id="container">
			<div id="background"></div>
			<div id="overlay">
				<div id="clock">
					<div id="hours"></div>
					<div id="minutes"></div>
				</div>
				<div id="quotes"></div>
			</div>
			<div id="files">
				<img class="overlaymap" src="img/nederland.png"/>
				<img src="<?php echo $settings["files.url"]; ?>" id="filemap" />
			</div>
		</div>
	</body>
</html>