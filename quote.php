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

if ($settings['rss.random'])
{
	$old = (isset($_SESSION['rss.current']) ? $_SESSION['rss.current'] : 0);
	do
	{
		$current = rand(0, count($settings['rss.feeds'])-1);
	} while ($current != $old && count($settings['rss.feeds']) > 1);
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
	try
	{
		$context = stream_context_create(array('http' => array('timeout' => 2))); 
		$xml = file_get_contents($feed['url'], 0, $context);
		if (empty($xml)) throw new Exception('empty xml');
		
		$file    = fopen($cache, "w");
		fwrite($file, $xml);
		fclose($file);
	}
	catch(Exception $e)
	{
		$xml = file_get_contents($cache);
	}
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
	$text = (isset($feed['all']) && $feed['all'] ? $item->description : $item->title);
	
	if (empty($feed['adexp']) || !preg_match($feed['adexp'], $text)) {
		$dataArray[] = array('text'=>$text, 'url'=>$item->link);
	}
}

$lists = array_chunk($dataArray, isset($feed['listcount']) ? $feed['listcount'] : 3);

foreach ($lists as $list) 
{
	$customWidth = (isset($feed['width']) ? ' style="width: ' . $feed['width'] . '"' : '');
	$noWrap = (isset($feed['nowrap']) && $feed['nowrap'] ? ' nowrap' : '');
	echo('<div class="holder quote' . $noWrap . '"' . $customWidth . '><div class="center">');
	echo('<ul>');
	foreach ($list as $item)
	{
		$html = $item['text'];
		if (!empty($item['url']))
		{
			$html = '<a href="' . $item['url'] . '" target="_blank">' . $html . '</a>';
		}
		
		echo('<li>' . $html . '</li>');
	}
	echo('</ul>');
	echo('</div></div>');
}
