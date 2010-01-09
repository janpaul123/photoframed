<?php
/*
 * Photogenix, custom photoframe software
 * Copyright (C) 2009-2010
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

			<?php if($settings["display.about"]) echo('$("#about").show("fast");'); ?>
			
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
			<div id="about">
				<a href="http://github.com/janpaul123/photogenix" target="_blank">
					<img src="img/logo.png"/>
					github.com/janpaul123/photogenix
				</a>
			</div>
		</div>
	</body>
</html>