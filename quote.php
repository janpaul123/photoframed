<?php
session_start();
require_once("config.php");

if ($settings['rss.random'])
{
	$current = rand(0, count($settings['rss.feeds'])-1);
}
else
{
	$current = (isset($_SESSION['rss.current']) ? $_SESSION['rss.current'] + 1 : 0);
	if ($current >= count($settings['rss.feeds'])) $current = 0;
}

$_SESSION['rss.current'] = $current;

// choose a RSS host
$feed = $settings['rss.feeds'][$current];
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
	$customWidth = (isset($feed['width']) ? ' style="width: ' . $feed['width'] . '"' : '');
	echo('<div class="holder quote"' . $customWidth . '><div class="center">');
	echo('<ul>');
	foreach ($list as $item)
	{
		echo('<li>' . $item . '</li>');
	}
	echo('</ul>');
	echo('</div></div>');
}
