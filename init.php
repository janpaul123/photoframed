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

if (!file_exists(dirname(__FILE__) . '/user/config.php'))
{
	die('Please check your photoframed/user folder and rename one of the configuration templates to config.php');
}

if (!is_writeable(dirname(__FILE__) . '/cache'))
{
	die('Make sure that the cache directory is writeable!<br> Run this in the console: <strong>chmod -R 0777 cache</strong> or <strong>sudo chmod -R 0777 cache</strong>');
}

require_once(dirname(__FILE__) . '/user/config.php');

$version = '250dev';