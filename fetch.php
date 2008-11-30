<?php

	$aFetch  = $_REQUEST;
	
	$sPath = '../OpenSong/';
	switch ($aFetch['type'])
	{
		case 'song':
			$sPath .= 'Songs/';
			break;
		case 'set':
			$sPath .= 'Sets/';
			break;
	}
	
	$sPath .= $aFetch['file'];
	
	header('Content-type: text/xml');
	
	readfile($sPath);
