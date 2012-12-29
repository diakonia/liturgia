<?php

  require_once('core.php');
  
  getChurch(false);
  
  $oFilePath = new filepath($_REQUEST);
  //echo "\n<br><pre>\n_REQUEST =" .var_export($_REQUEST, TRUE)."</pre>";
  $sFile = $_REQUEST['file'];
  //echo "\n<br><pre>\nsFile  =" .$sFile ."</pre>";
  $sFullFilePath = $oFilePath->getFullFile();
  //echo "\n<br><pre>\nsFullFilePath  =" .$sFullFilePath ."</pre>";
  //echo "\n<br><pre>\noFilePath =" .var_export($oFilePath, TRUE)."</pre>";
  
  $bFileExists = file_exists(addslashes(realpath($sFullFilePath)));
  //echo "\n<br><pre>\nbFileExists  =" .var_export($bFileExists , TRUE)."</pre>";
  
  
  if(file_exists(realpath($sFullFilePath)) && $oFilePath->getName() !== 'blanks' && CONST_SVN_AUTO && defined('SVN_REVISION_HEAD'))
  {
    if(isset($_SERVER['PHP_AUTH_USER']))
    {
      //apiSendError('Set-up must use http authentication');
    }
    else
    {
      svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_USERNAME, $_SERVER['PHP_AUTH_USER']);
      svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_PASSWORD, $_SERVER['PHP_AUTH_PW']);
      $iRev = @svn_update(realpath($sFullFilePath));
      if($iRev === false)
      {
         //throw(new exception('Could Not Update File'));
      }
    }
  }
  
  $sContent = @file_get_contents($sFullFilePath);
  if($sContent)
  {
    header('Content-type: '.$oFilePath->getMimeType());
    header('Content-Disposition: attachment; filename="'.$oFilePath->getBaseName().'"');
    echo $sContent;
    exit;
  }
  
  header('HTTP/1.1 404 Not Found', true, 404);
?>
