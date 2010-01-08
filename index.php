<?php require("config.php"); ?>
<html>
  <head>
    <title><?php echo $Settings["display.name"] ?></title>
    <link rel="stylesheet" href="default.css" type="text/css" />
    <script type="text/javascript">
    /** Settings to use in the script **/
    var DisplayInterval = <?php echo $Settings["js.interval"] ?>;
    </script>
    <script type="text/javascript" src="content.js"></script>
  </head>
  
  <body onload="DisplayStart();" onclick="DisplayUpdate();">
    <div id="container">
      <img id="background" src="random_picture.php" onerror="UpdatePicture();"/>
      <div id="overlay"></div>
      <div id="time">
        <div id="hours"></div>
        <div id="minutes"></div>
      </div>
      
      <div id="secondsBar"></div>
      
      <div id="quotes">
      </div>

      <div id="files">
        <img class="overlaymap" src="nederland.png"/>
        <img src="<?php echo $Settings["files.url"]; ?>" id="filemap" />
      </div>
    </div>
  </body>
</html>