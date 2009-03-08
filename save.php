<?php
  require_once('core.php');
	$oFilePath = new filepath($_REQUEST);
  $sXML = stripslashes(urldecode($_REQUEST['xml']));
  $sFullFilePath = $oFilePath->getFullFile();
  file_put_contents($sFullFilePath, $sXML);
  
  if(CONST_SVN_AUTO && defined('SVN_REVISION_HEAD'))
  {
    svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_USERNAME, $_SERVER['PHP_AUTH_USER']);
    svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_PASSWORD, $_SERVER['PHP_AUTH_PW']);
    
    $iRev = svn_update(realpath($sFullFilePath));
    if($iRev === false)
    {
       throw(new exception('Could Not Update File'));
    }
    
    $aCommitLog = svn_commit('Auto commit from MooSong user '.$_SERVER['PHP_AUTH_USER'], array(realpath($sFullFilePath)));
    if($aCommitLog === false)
    {
       throw(new exception('Could Not Commit File'));
    }
  }
  echo "File Saved";
