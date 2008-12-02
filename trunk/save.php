<?php
  require_once('core.php');
	$oFilePath = new filepath($_REQUEST);
  $sXML = stripslashes(urldecode($_REQUEST['xml']));
  $sFullFilePath = $oFilePath->getFullFile();
  file_put_contents($sFullFilePath, $sXML);
  echo "File Saved";
