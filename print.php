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
      if(file_get_contents($sFoFile) === false)
      {
        header('HTTP/1.1 500 Internal Server Error', true, 500);
        echo "<h1>No FOP File</h1>";
        exit;
      }
      $sCMD = CONST_FOP_PATH.' '.$sFoFile.' '.$sPdfFile;
      exec($sCMD);
      if(file_get_contents($sPdfFile) === false)
      {
        header('HTTP/1.1 500 Internal Server Error', true, 500);
        echo "<h1>No PDF File Created</h1>";
        echo "<p>".$sCMD."</pdf>";
        exit;
      }
      header('Content-type: application/pdf');
      header('Content-Disposition: attachment; filename="'.$oFilePath->getBaseName().'.pdf"');
      readfile($sPdfFile);
    }
    else
    {
      header('HTTP/1.1 500 Internal Server Error', true, 500);
      echo "<h1>No TMP File</h1>";
    }
    exit;
  }
  
  header('HTTP/1.1 404 Not Found', true, 404);
?>