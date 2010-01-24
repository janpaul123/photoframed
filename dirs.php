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

require_once("init.php");

function findDirsRecursive($path, array &$dirs) 
{
    if ($dir = @opendir($path)) 
	{
		$dirs[] = $path;
        while (false !== ($file = readdir($dir)))
		{
			if (is_dir($path . '/' . $file) && $file != '.' && $file != '..' && $file != '/')
			{
				findDirsRecursive($path . '/' . $file, $dirs);
			}
        }
        
        closedir($dir);
    }
    return $dirs;
}

function allDirs($paths)
{
	$dirs = array();
	foreach ($paths as $path) 
	{
		// strip trailing slashes
		if (substr($path, -1) == '/' || substr($path, -1) == '\\') $path = substr($path, 0, -1);
		 
		findDirsRecursive($path, $dirs);
	}
	
	return $dirs;
}

function newDir($paths)
{
	$dirs = allDirs($paths);
	return $dirs[rand(0, count($dirs)-1)];
}

function findFiles($path)
{
	if ($dir = @opendir($path)) 
	{
		$files = array();
        while (false !== ($file = readdir($dir)))
		{
			if (strtolower(substr($file,strlen($file)-4,4)) == '.jpg') 
			{
				$files[] = $path . '/' . $file;
			}
		}
		
		closedir($dir);
	}
	
	return $files;
}

function findAllFiles($paths)
{
	$dirs = allDirs($paths);
	$files = array();
	foreach($dirs as $dir) 
	{
		$files = array_merge($files, findFiles($dir));
	}
	return $files;
}