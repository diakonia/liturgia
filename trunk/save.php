<?php

	$aFetch  = $_REQUEST;
	//echo "\n<br><pre>\naFetch   =" .var_export($aFetch  , TRUE)."</pre>";
	
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
  
  $sXML = stripslashes(urldecode($aFetch['xml']));
  //echo "sXML  =" .$sXML ."";
  
  file_put_contents($sPath.'2', $sXML);
  
  
	//$sText = file_get_contents($sPath);
  
  //echo "\n<br><pre>\nsText  =" .$sText ."</pre>";
  
  echo "File Saved";
