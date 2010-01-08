<?php
error_reporting(0);
$Settings = array();
$RSS = array();
$ImageDirs = array();

// Display size in pixels, only used for picture resizing
$Settings["display.width"] = 1024;
$Settings["display.height"] = 768;
$Settings["display.name"] = "Fotolijst"; // any name you like
$Settings["js.interval"] = "20000"; // interval for retrieving a new picture/quote; in ms

/** RSS FEEDS **/
$RSS[] = array("url" => "http://www.nu.nl/deeplink_rss2/index.jsp?r=Algemeen", "cache" => "nu.nl.xml", "logo" => "content/images/nu.nl.png");
$RSS[] = array("url" => "http://feeds.feedburner.com/tweakers/mixed", cache => "tweakers.net.xml", "logo" => "content/images/tweakers.net.png");
//$RSS[] = array("url" => "http://zuzu.nl/feed.rss?U=330509&P=837eaecb351a661867996759fdefc5a4&C=2", cache => "kalender.rss.xml", "logo" => "content/images/balloons.png");
$RSS[] = array("url" => "http://rss.weeronline.nl/weernieuws/2/nederland.xml", cache => "weather.rss.xml", "logo" => "content/images/weather.png", "all" => true);

/** FILEKAART SETTINGS **/
$Settings["files.url"] = "http://www.traphic.nl/generated/verkeersinformatie.png";


/** FOTO SETTINGS **/
//$ImageDirs[] = "F:/Fotos"; // zonder slash aan het einde!
$ImageDirs[] = "C:/Wallpapers"; 


$Settings["photo.copyright"] = "";
$Settings["photo.fontsize"] = 3; // 1 to 5

?>