<?php
  require_once('core.php');
	
  getChurch(false);
  
  if(CONST_YouTube_DL == false)
  {
    apiSendError("Video download functions turned off");
  }
  if(empty($_REQUEST['youtubeurl']))
  {
    apiSendError("No Video URL sent");
  }
  $sCmd = CONST_YouTube_DL.' -e '. escapeshellarg($_REQUEST['youtubeurl']);
  $aTitle = null;
  exec ( $sCmd, $aTitle, $iReturnVar);
  
  if($iReturnVar !== 0)
  {
    apiSendError("Could not find video");
  }
  $sTitle = $aTitle[0];
  $oFilePath = new filepath(array(
                              'type' => 'video',
                              'name' => str_replace(' ', '_', $sTitle).'.mp4'
                              ));
  
  $sFullFilePath = $oFilePath->getFullFile();
  $bFileExists = file_exists(realpath($sFullFilePath));
  
  if($bFileExists)
  {
    apiSendError("File already exists -  Use the Video option to select it");
  }
  
  #$sCmd = CONST_YouTube_DL.' -b -o '.escapeshellarg($sFullFilePath).' '. escapeshellarg($_REQUEST['youtubeurl']);
  $sCmd = CONST_YouTube_DL.' -o '.escapeshellarg($sFullFilePath).' '. escapeshellarg($_REQUEST['youtubeurl']);
  $aOutput = null;
  exec ( $sCmd, $aOutput, $iReturnVar);
  if($iReturnVar !== 0)
  {
    apiSendError("Video download failed");
  }
  
  if(file_exists($sFullFilePath) && CONST_SVN_AUTO && defined('SVN_REVISION_HEAD'))
  {
    if(!isset($_SERVER['PHP_AUTH_USER']))
    {
      apiSendError('Set-up must use http authentication');
    }
    else
    {
      svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_USERNAME, $_SERVER['PHP_AUTH_USER']);
      svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_PASSWORD, $_SERVER['PHP_AUTH_PW']);
      $aCommitLog = svn_add(realpath($sFullFilePath));
      if($aCommitLog === false)
      {
         apiSendError('Could Not Add File');
      }
      $aCommitLog = svn_commit('Intial auto commit from MooSong user '.$_SERVER['PHP_AUTH_USER'], array(realpath($sFullFilePath)));
      if($aCommitLog === false)
      {
         apiSendError('Could Not Commit File');
      }
    }
  }
  
  //chown  ( $sFullPath  , 'martyn'  );
  apiSendResult(
                              array( 'file'  => $oFilePath->getFile(),
                                     'name'  => $oFilePath->getName(),
                                     'path'  => $oFilePath->getPath(),
                                     'title'  => $sTitle,
                                     'client_os_file' => $oFilePath->getClientExternalRelativeFile(),
                                     'client_abs_file' => $oFilePath->getClientExternalAbsFile()
                                     )
                              );


