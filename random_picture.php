<?php
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
		// strip preceding slash
		if (in_array(substr($infoFileName, 0, 1), array('/', '\\'))) $infoFileName = substr($infoFileName, 1);
		
		// format the filename nicely
		$infoFilename = str_ireplace($settings['photo.dirs'], '',    $infoFilename);
		$infoFilename = str_ireplace('.jpg',                  '',    $infoFilename);
		$infoFilename = str_ireplace(array('/', '\\'),        ' - ', $infoFilename);
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
