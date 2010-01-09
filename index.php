<?php 
session_start();
require_once("init.php"); 
?>
<html>
	<head>
		<title><?php echo $settings["display.name"] ?></title>
		<link rel="stylesheet" href="css/default.css" type="text/css" />
		
		<script type="text/javascript" src="js/jquery-1.3.2.min.js"></script>
		<script type="text/javascript" src="js/PhotoFrame.js"></script>
		
		<script type="text/javascript">
		$(document).ready(function(){
			PhotoFrame.init();
			PhotoFrame.setDisplayInterval(<?php echo($settings["display.interval"]); ?>);
			PhotoFrame.setEnableFX(<?php echo($settings["display.fx"]?'true':'false'); ?>);
			PhotoFrame.start();
		});
		</script>
	</head>
	
	<body>
		<div id="container">
			<div id="background"></div>
			<div id="overlay">
				<div id="clock">
					<div class="holder" id="hours"></div>
					<div class="holder" id="minutes"></div>
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