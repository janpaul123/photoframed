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
			PhotoFrame.setDisplayInterval  ( <?php echo($settings["display.interval"]);           ?> );
			PhotoFrame.setTrafficMap       ("<?php echo($settings["traffic.map"]);                ?>");
			PhotoFrame.setTrafficOverlay   ("<?php echo($settings["traffic.overlay"]);            ?>");
			PhotoFrame.setEnableBar        ( <?php echo($settings["display.bar"]?'true':'false'); ?> );
			PhotoFrame.setEnableFX         ( <?php echo($settings["display.fx"]?'true':'false');  ?> );

			$(document).keypress(function (event) {
				var letter = String.fromCharCode(event.which);
				
				<?php 
					foreach ($settings['display.keys'] as $key => $function)
					{
						echo('if (letter == "' . substr($key, 0, 1) .'") {');
						echo($function . ';');
						echo('}');
					}
				?>

				event.stopPropagation()
				return 0;
			});

			PhotoFrame.start();
		});
		</script>
	</head>
	
	<body>
		<div id="container">
			<div id="background"></div>
			<?php if ($settings["display.bar"]) { ?>
			<div id="bar">
				<div id="clock">
					<div class="holder" id="hours"></div>
					<div class="holder" id="minutes"></div>
				</div>
				<div id="quotes"></div>
			</div>
			<?php } ?>
			<div id="traffic">
				<img class="map" src="<?php echo $settings["traffic.map"]; ?>"/>
				<img class="overlay" src="<?php echo $settings["traffic.overlay"]; ?>" />
			</div>
		</div>
	</body>
</html>