<?php

if (!file_exists(dirname(__FILE__) . '/user/config.php'))
{
	die('Please check your photogenix/user folder and rename one of the configuration templates to config.php');
}

if (!is_writeable(dirname(__FILE__) . '/cache'))
{
	die('Make sure that the cache directory is writeable!<br> Run this in the console: <strong>chmod -R 0777 cache</strong> or <strong>sudo chmod -R 0777 cache</strong>');
}

require_once(dirname(__FILE__) . '/user/config.php');