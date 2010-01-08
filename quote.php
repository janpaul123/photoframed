<?php

require_once("config.php");

// choose a RSS host
$feed = $settings['rss.feeds'][rand(0,count($settings['rss.feeds'])-1)];
$cache = 'cache/' . $feed['cache'];


// load news file if older than 15 minutes
$time = file_exists($cache) ? filemtime($cache) : 0;
if ($time + 5*60 < time()) 
{
	$file    = fopen($cache, "w");
	$xml     = file_get_contents($feed['url']);
	fwrite($file, $xml);
	fclose($file);
}
else 
{
	$xml = file_get_contents($cache);
}

$data = simplexml_load_string($xml);

echo('<div class="holder logo"><div class="center">');
echo('<img src="' . $feed["logo"].'""/>');
echo('</div></div>');

if (empty($data->channel->item))
{
	@unlink($cache);
	echo('<div class="holder"><div class="center">');
	echo('<ul><li>' . $settings['rss.error_message'] . '</li></ul>');
	echo('</div></div>');
	exit();
}

$dataArray = array();
foreach ($data->channel->item as $item) {
	$dataArray[] = (isset($feed['all']) && $feed['all'] ? $item->description : $item->title);
}

$lists = array_chunk($dataArray, 3);

foreach ($lists as $list) 
{
	echo('<div class="holder quote"><div class="center quote">');
	echo('<ul>');
	foreach ($list as $item)
	{
		echo('<li>' . $item . '</li>');
	}
	echo('</ul>');
	echo('</div></div>');
}
