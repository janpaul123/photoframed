<?php

require_once("config.php");
$newsRSS = "";
$CacheDir = "cache/";

// choose a RSS host
$SiteN = rand(0,count($RSS)-1);
$Site = $RSS[$SiteN];

	// load news file if older than 15 minutes
	$time = file_exists($CacheDir.$Site["cache"])?filemtime($CacheDir.$Site["cache"]):0;
	if($time<time()-5*60) {
	  $fp = fopen($CacheDir.$Site["cache"], "w");
	  $newsRSS = file_get_contents($Site["url"]);
	  fwrite($fp, $newsRSS);
	  fclose($fp);
	}
	else {
	  $newsRSS = file_get_contents($CacheDir.$Site["cache"]);
	}

	$news = simplexml_load_string($newsRSS);

	echo '<div class="holder"><div class="center"><img src="'.$Site["logo"].'" id="content-logo" width="71" /></div></div>';

	if (empty($news->channel->item))
	{
		@unlink($CacheDir.$Site["cache"]);
		die("<ul><li>De router faalt.. alweer!</li></ul>");
	}
	
	echo '<div class="holder quote"><div class="center quote"><ul>';
	$i = 1;
	foreach($news->channel->item as $k=>$it) {
	if($i>6) break;
	  if ($Site["all"])
	  {
	  	echo "<li>".$it->description."</li>";
	  }
	  else
	  {
		echo "<li>".$it->title."</li>";
	  }
	  if($i%3==0) {
	    echo "</ul></div></div>";
	    echo '<div class="holder quote"><div class="center quote"><ul>';
	  }
	  $i++;
	}
	echo "</ul></div>";
