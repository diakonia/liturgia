<?php

  require_once('core.php');
  $oFilePath = new filepath($_REQUEST);
  $sFullFilePath = $oFilePath->getFullFile();
  $sContent = @file_get_contents($sFullFilePath);
  if($sContent)
  {
    $xslDoc = new DOMDocument();
    $xslDoc->load('css/'.$oFilePath->getType().'.xsl');
    
    $xmlDoc = new DOMDocument();
    $xmlDoc->loadXML($sContent);
    
    $proc = new XSLTProcessor();
    $proc->importStylesheet($xslDoc);
    echo $proc->transformToXML($xmlDoc);
/*
    header('Content-type: text/xml');
    
    $sTop = '
<!DOCTYPE cv SYSTEM "http://demo1.cmjdevel.co.uk/~martyn/cv/cv.dtd"
[
<!ENTITY nbsp   "&#160;">
<!ENTITY copy   "&#169;">
<!ENTITY pound  "&#163;">
]>
<?xml-stylesheet type="text/xsl" href="css/'.$oFilePath->getType().'.xsl"?>
';
    $sTag = '<'.$oFilePath->getType().'';
    $sContent = str_replace($sTag, $sTop.$sTag, $sContent);
    echo $sContent;*/
    exit;
  }
  
  header('HTTP/1.1 404 Not Found', true, 404);
?>
