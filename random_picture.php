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

header('Content-type: image/jpeg');
session_start();
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

function newDir($paths)
{
	$dirs = array();
	foreach ($paths as $path) 
	{
		// strip trailing slashes
		if (substr($path, -1) == '/' || substr($path, -1) == '\\') $path = substr($path, 0, -1);
		 
		findDirsRecursive($path, $dirs);
	}
	
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


$dir       = @$_SESSION['display.dir'];
$dircount  = @$_SESSION['display.dircount'];
$previous  = @$_SESSION['display.previous'];

if (strlen($dir) <= 0 || file_exists($dir)) {
	$dir      = newDir($settings['photo.dirs']);
	$dircount = 0;
}

$files = findFiles($dir);
if ($dircount > $settings['photo.max_from_dir'] || $dircount >= count($files)) {
	$tries        = 0;
	do {
		$dir      = newDir($settings['photo.dirs']);
		$dircount = 0;
		$files    = findFiles($dir);
	} while ((count($files) <= 0 || $previousDir == $dir) && $tries++ < 100);
}

do
{
	$file = $files[rand(0, count($files)-1)];
} while ($file == $previous && count($files) > 1);

$dircount++;
$_SESSION['display.dir']      = $dir;
$_SESSION['display.dircount'] = $dircount;
$_SESSION['display.previous']  = $file;

$width  = $_REQUEST['width'];
$height = $_REQUEST['height'];

// Info string
$info  = '';

if ($settings['photo.show_filename'])
{
	$infoFilename = $file;
	if ($settings['photo.format_filename'])
	{
		// convert all paths to one format of slashes and add trailing slash
		$newPhotodirs = array();
		foreach ($settings['photo.dirs'] as $photodir)
		{
			$newPhotodir = str_ireplace('\\', '/', $photodir);
			if (substr($newPhotodir, -1) != '/') $newPhotodir .= '/';
			$newPhotodirs[] = $newPhotodir;
		}
		
		$infoFilename = str_ireplace('\\', '/', $infoFilename);
		
		// format the filename nicely
		$infoFilename = str_ireplace($newPhotodirs,           '',    $infoFilename);
		$infoFilename = str_ireplace('.jpg',                  '',    $infoFilename);
		$infoFilename = str_ireplace('/',                     ' - ', $infoFilename);
		$infoFilename = str_ireplace(array('_', '.'),         ' ',   $infoFilename);
	}
	
	$info .= $infoFilename;
}

// add the copyright notification
$info .= $settings['photo.copyright'];

// make GD work
$picture = imagecreatefromjpeg($file);

$img = imagecreatetruecolor($width, $height);

$col = imagecolorallocate($img, 255,255,255);
$shadow = imagecolorallocate($img,0,0,0);

$src_width  = imagesx($picture);
$src_height = imagesy($picture);

$ratio = min(($width / $src_width), ($height / $src_height));

$dst_width = round($src_width * $ratio);
$dst_height = round($src_height * $ratio);

imagecopyresampled($img, $picture, ($width - $dst_width)/2, ($height - $dst_height)/2, 0,0, $dst_width, $dst_height, $src_width, $src_height);

imagestring($img,$settings['photo.fontsize'],($width / 2) - ((strlen($info) * imagefontwidth($settings['photo.fontsize'])) / 2), $height-20,$info,$shadow);
imagestring($img,$settings['photo.fontsize'],($width / 2) - ((strlen($info) * imagefontwidth($settings['photo.fontsize'])) / 2) - 1, $height-21,$info,$col);

imagejpeg($img, NULL, 100);
