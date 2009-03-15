<?php
  require_once('core.php');
	
  if(CONST_YouTube_DL == false)
  {
    echo "YouTube functions turned off";
    exit;
    
  }
  if(empty($_REQUEST['youtubeurl']))
  {
    echo "No YouTube URL sent";
    exit;
    
  }
  $sCmd = CONST_YouTube_DL.' -e '. escapeshellarg($_REQUEST['youtubeurl']);
  $aTitle = null;
  exec ( $sCmd, $aTitle, $iReturnVar);
  
  if($iReturnVar !== 0)
  {
    echo "finding title failed";
    exit;
  }
  $sTitle = $aTitle[0];
  $oFilePath = new filepath(array(
                              'type' => 'video',
                              'name' => str_replace(' ', '_', $sTitle).'.mp4'
                              ));
  
  $sFullFilePath = $oFilePath->getFullFile();
  
  $sCmd = CONST_YouTube_DL.' -b -o '.escapeshellarg($sFullFilePath).' '. escapeshellarg($_REQUEST['youtubeurl']);
  $aOutput = null;
  exec ( $sCmd, $aOutput, $iReturnVar);
  if($iReturnVar !== 0)
  {
    echo "YouTube download failed";
    exit;
  }
  
  if(file_exists($sFullFilePath) && CONST_SVN_AUTO && defined('SVN_REVISION_HEAD'))
  {
    svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_USERNAME, $_SERVER['PHP_AUTH_USER']);
    svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_PASSWORD, $_SERVER['PHP_AUTH_PW']);
    $aCommitLog = svn_add(realpath($sFullFilePath));
    if($aCommitLog === false)
    {
       throw(new exception('Could Not Add File'));
    }
    $aCommitLog = svn_commit('Intial auto commit from MooSong user '.$_SERVER['PHP_AUTH_USER'], array(realpath($sFullFilePath)));
    if($aCommitLog === false)
    {
       throw(new exception('Could Not Commit File'));
    }
  }
  
  //chown  ( $sFullPath  , 'martyn'  );
  $sText = json_encode(
                              array( 'file'  => $oFilePath->getFile(),
                                     'name'  => $oFilePath->getName(),
                                     'path'  => $oFilePath->getPath(),
                                     'title'  => $sTitle,
                                     'relativefile' => $oFilePath->getDataFolderFile(),
                                     )
                              );
  echo $sText;
  exit;

