<?php

error_reporting(0);

$settings = array();
$RSS = array();

// Display size in pixels, only used for picture resizing
$settings['display.name']              = 'Fotolijst'; // any name you like
$settings['js.interval']               = '20000'; // interval for retrieving a new picture/quote; in ms

$settings['rss.feeds']                 = array();
$settings['rss.feeds'][]               = array('url' => 'http://www.nu.nl/deeplink_rss2/index.jsp?r=Algemeen', 'cache' => 'nu.nl.xml', 'logo' => 'content/images/nu.nl.png');
$settings['rss.feeds'][]               = array('url' => 'http://feeds.feedburner.com/tweakers/mixed', 'cache' => 'tweakers.net.xml', 'logo' => 'content/images/tweakers.net.png');
$settings['rss.feeds'][]               = array('url' => 'http://rss.weeronline.nl/weernieuws/2/nederland.xml', 'cache' => 'weather.rss.xml', 'logo' => 'content/images/weather.png', 'all' => true);

$settings['rss.error_message']         = 'De router faalt... alweer!';

$settings['files.url']                 = 'http://www.traphic.nl/generated/verkeersinformatie.png';

$settings['photo.dirs']                = array();
$settings['photo.dirs'][]              = '/Users/janpaul/Desktop/Wallpapers/';
 
$settings['photo.copyright']           = '';
$settings['photo.fontsize']            = 3; // 1 to 5
$settings['photo.show_filename']       = true;
$settings['photo.format_filename']     = true;