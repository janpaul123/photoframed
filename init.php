<?php

if (!file_exists(dirname(__FILE__) . '/user/config.php'))
{
	die('Please check your photogenix/user folder and rename one of the configuration templates to config.php');
}

require_once(dirname(__FILE__) . '/user/config.php');