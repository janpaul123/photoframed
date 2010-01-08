<?php

require_once("config.php");

$myFile = 'cache/photodir.txt';
$fh = fopen($myFile, 'r');
$photodir = fread( $fh, filesize($myFile) );
fclose( $fh );

function makeImagesList($path) 
{
	global $mylist,$mylistctr, $mydirs, $mydirctr;
	
    if ( $img_dir = @opendir($path) ) 
	{
        while ( false !== ($img_file = readdir($img_dir)) )
		{
            if (substr($img_file,strlen($img_file)-4,4) == ".jpg" || substr($img_file,strlen($img_file)-4,4) == ".JPG") 
			{
                $mylist[$mylistctr] = $path . '/' . $img_file;
                $mylistctr++;
				if ($mydirctr <= 0)
				{				
					$mydirs[$mydirctr] = $path;
					$mydirctr++;
				}
				else
				{
					if ($mydirs[$mydirctr-1] != $path)
					{
						$mydirs[$mydirctr] = $path;
						$mydirctr++;
					}
				}
            }
			
			if (is_dir($path . '/' . $img_file) && $img_file != '.' && $img_file != '..' && $img_file != '/')
			{
				makeImagesList($path . '/' . $img_file);
			}
        }
        closedir($img_dir);
    }
}

$Width = $Settings["display.width"];
$Height = $Settings["display.height"];

$mylist = array();
$mylistctr = 0;
$mydirs = array();
$mydirctr = 0;
makeImagesList($photodir);

$newdirmax = 2;
if ($mylistctr <= 1) $newdirmax = 1;
if ($mylistctr <= 0) $newdirmax = 0;

if (rand(0,$mylistctr-1) <= $newdirmax)
{
	// new directory
	
	$mylist = array();
	$mylistctr = 0;
	$mydirs = array();
	$mydirctr = 0;
	
	for ($i=0; $i<count($ImageDirs); $i++)
	{
		makeImagesList($ImageDirs[$i]);
	}
	
	$x = rand(0,$mydirctr-1);
	$photodir = $mydirs[$x];
	
	$myFile = 'cache/photodir.txt';
	
	/*if (file_exists($myfile))
	{
		unlink( $myFile );
	}*/
	
	$fh = fopen($myFile, 'w');
	fwrite( $fh, $photodir );
	fclose( $fh );
	
	$mylist = array();
	$mylistctr = 0;
	$mydirs = array();
	$mydirctr = 0;
	makeImagesList($photodir);
}

$ImageDir = $photodir;

if(isset($_REQUEST['w']) && is_numeric($_REQUEST['w'])) {
  $Width = $_REQUEST['w'];
  $Height = ($Height/$Width)*$Width;
}

$x = rand(0,$mylistctr-1);

$fn = $mylist[$x];

// Info string
$info = $mylist[$x];
$info .= $Settings["photo.copyright"];

// make GD work
header("Content-type: image/jpeg");
$picture = imagecreatefromjpeg($fn);

$img = imagecreatetruecolor($Width, $Height);

$col = imagecolorallocate($img, 255,255,255);
$shadow = imagecolorallocate($img,0,0,0);

$src_width  = imagesx($picture);
$src_height = imagesy($picture);

if ($src_width > $src_height)
{
	$ratio_x = ( $src_width / $Width );
	$ratio_y = $ratio_x;
}
else
{
	$ratio_y = ( $src_height / $Height );
	$ratio_x = $ratio_y;
}

if ($ratio_x < 1) $ratio_x = 1;
if ($ratio_y < 1) $ratio_y = 1;

$dst_width = round( $src_width / $ratio_x );
$dst_height = round( $src_height / $ratio_y );


imagecopyresampled($img,$picture, ($Width - $dst_width)/2, ($Height - $dst_height)/2, 0,0, $dst_width, $dst_height, $src_width, $src_height);

imagestring($img,$Settings["photo.fontsize"],($Width / 2) - ((strlen($info) * imagefontwidth($Settings["photo.fontsize"])) / 2),$Height-20,$info,$shadow);
imagestring($img,$Settings["photo.fontsize"],($Width / 2) - ((strlen($info) * imagefontwidth($Settings["photo.fontsize"])) / 2) - 1,$Height-21,$info,$col);

imagejpeg($img,NULL,100);
