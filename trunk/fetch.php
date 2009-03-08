<?php

  require_once('core.php');
  $oFilePath = new filepath($_REQUEST);
  $sFullFilePath = $oFilePath->getFullFile();
  
  if(file_exists(realpath($sFullFilePath)) && CONST_SVN_AUTO && defined('SVN_REVISION_HEAD'))
  {
    svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_USERNAME, $_SERVER['PHP_AUTH_USER']);
    svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_PASSWORD, $_SERVER['PHP_AUTH_PW']);
    $iRev = svn_update(realpath($sFullFilePath));
    if($iRev === false)
    {
       throw(new exception('Could Not Update File'));
    }
  }
  
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
