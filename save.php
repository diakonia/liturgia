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
    $aCommitLog = svn_commit('Auto commit from MooSong', array(realpath($sFullFilePath)));
    if($aCommitLog === false)
    {
       throw(new exception('Coulkd Not Commit File'));
    }
  }
  echo "File Saved";
