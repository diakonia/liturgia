<?php

  require_once('core.php');
  $oFilePath = new filepath($_REQUEST);
  $sFullFilePath = $oFilePath->getFullFile();
  $sContent = @file_get_contents($sFullFilePath);
  if($sContent)
  {
    header('Content-type: text/xml');
    header('Content-Disposition: attachment; filename="'.$oFilePath->getBaseName().'"');
    echo $sContent;
    exit;
  }
  
  header('HTTP/1.1 404 Not Found', true, 404);
?>
