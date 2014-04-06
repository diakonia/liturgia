<?php

  require_once('core.php');
  
  getChurch(false);
  
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
    
    $foDoc = $proc->transformToDoc($xmlDoc);
    $foDoc->formatOutput   = true;
    $sFoFile = tempnam(CONST_TEMP_PATH, "MooSongFO");
    $sPdfFile = tempnam(CONST_TEMP_PATH, "MooSongPdf");
    if($sFoFile && $sPdfFile)
    {
      $foDoc->save($sFoFile);
      exec(CONST_FOP_PATH.' '.$sFoFile.' '.$sPdfFile);
      header('Content-type: application/pdf');
      header('Content-Disposition: attachment; filename="'.$oFilePath->getBaseName().'.pdf"');
      readfile($sPdfFile);
    }
    exit;
  }
  
  header('HTTP/1.1 404 Not Found', true, 404);
?>
