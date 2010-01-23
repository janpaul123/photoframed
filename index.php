<?php
/*
 * Photoframed, custom photoframe software
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
		
		<link rel="stylesheet" href="css/default.css?<?php echo $version;?>" type="text/css" />
		
		<script type="text/javascript" src="js/jquery-1.4.min.js?<?php echo $version;?>"></script>
		<script type="text/javascript" src="js/PhotoFrame.js?<?php echo $version;?>"></script>
		
		<script type="text/javascript">
		$(document).ready(function(){
			PhotoFrame.init();
			PhotoFrame.setDisplayInterval  ( <?php echo($settings["display.interval"]);           ?> );
			PhotoFrame.setTrafficMap       ("<?php echo($settings["traffic.map"]);                ?>");
			PhotoFrame.setTrafficOverlay   ("<?php echo($settings["traffic.overlay"]);            ?>");
			PhotoFrame.setEnableBar        ( <?php echo($settings["display.bar"]?'true':'false'); ?> );
			PhotoFrame.setEnableFX         ( <?php echo($settings["display.fx"]?'true':'false');  ?> );
			PhotoFrame.setWebcamsInterval  ( <?php echo($settings["webcams.interval"]);           ?> );
			PhotoFrame.setConnectionURL    ("<?php echo(isset($settings["connection.url"])?$settings["connection.url"]:'http://www.nu.nl/images/logo_nu_nl.gif'); ?>");
			
			$(document).keypress(function (event) {
				var letter = String.fromCharCode(event.which);
				
				<?php 
					foreach ($settings['display.keys'] as $key => $options)
					{
						echo('if (letter == "' . substr($key, 0, 1) .'") {');
						echo($options['function'] . ';');
						echo('}');
					}
				?>

				event.stopPropagation()
				return 0;
			});

			<?php 
				foreach ($settings['webcams.cams'] as $nr => $cam)
				{
					echo('PhotoFrame.addWebcam("webcam-' . $nr . '", "' . $cam['url'] . '");');
				}
			?>

			<?php if($settings["display.about"])    echo('PhotoFrame.showAbout();'); ?>
			<?php if($settings["connection.check"]) echo('PhotoFrame.checkConnection();'); ?>

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
					<?php if ($settings['connection.wifi']) {?>
						<img id="connectionerror" src="img/transmit_error.png?<?php echo $version;?>"/>
					<?php } else {?>
						<img id="connectionerror" src="img/disconnect.png?<?php echo $version;?>"/>
					<?php } ?>
				</div>
				<div id="quotes"></div>
			</div>
			<?php } ?>
			<div id="traffic">
				<img class="map" src="<?php echo $settings["traffic.map"]; ?>"/>
				<img class="overlay" src="<?php echo $settings["traffic.overlay"]; ?>" />
			</div>
			<div id="about">
				<a href="http://github.com/janpaul123/photoframed" target="_blank">
					<img src="img/logo.png?<?php echo $version;?>"/>
					<div class="title">Photoframed</div>
					<div class="link">github.com/janpaul123/photoframed</div>
				</a>
				press <strong>h</strong> for keyboard commands 
			</div>
			<div id="help">
				<table>
				<?php 
					foreach ($settings['display.keys'] as $key => $options)
					{
						echo('<tr><td class="key">');
						echo('<strong>' . (isset($options['key']) ? $options['key'] : $key) .'</strong>');
						echo('</td><td class="title">');
						echo($options['title'] . '<br />');
						echo('</tr>');
					}
				?>
				</table>
			</div>
			<div id="webcams">
				<?php 
					$styleDivAllowed   = array('top', 'bottom', 'left', 'right', 'float');
					$styleImageAllowed = array('width', 'height', 'max-width', 'max-height', 'min-width', 'min-height');
					foreach ($settings['webcams.cams'] as $nr => $cam)
					{
						$styleDiv='';
						
						foreach($styleDivAllowed as $element) 
						{
							if (isset($cam[$element])) $styleDiv .= $element . ': ' . $cam[$element] . '; ';
						}
						
						foreach($styleImageAllowed as $element) 
						{
							if (isset($cam[$element])) $styleImage .= $element . ': ' . $cam[$element] . '; ';
						}
						
						if (isset($cam['top']) || isset($cam['bottom']) || isset($cam['left']) || isset($cam['right']))
						{
							$styleDiv .= 'position: fixed; ';
						}
						
						echo('<div class="container" style="' . $styleDiv . '">');
						echo('<div class="holder">');
						echo('<div class="border"></div>');
						echo('<div id="webcam-' . $nr . '" >');
						echo('<img class="webcam" style="' . $styleImage . '"/>');
						echo('</div>');
						echo('<div class="title">' . $cam['title'] . '</div>');
						echo('<div class="shadow" id="shadow-webcam-' . $nr . '"></div>');
						echo('<img class="error"  id="error-webcam-'  . $nr . '" src="img/webcam_error.png?<?php echo $version;?>"/>');
						echo('</div>');
						echo('</div>');
					}
				?>
			</div>
		</div>
	</body>
</html>