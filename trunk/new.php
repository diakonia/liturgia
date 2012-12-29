<?php
  require_once('core.php');
  
  getChurch(false);
  
	$oFilePath = new filepath($_REQUEST);
  $sFullFilePath = $oFilePath->getFullFile();
  
  if (file_exists($sFullFilePath))
  {
    apiSendResult(array('exists' => 
                                array( 'file'  => $oFilePath->getFile(),
                                       'name'  => $oFilePath->getName()
                                       )
                                ));
  }
  
  $oTemplatePath = clone $oFilePath;
  $oTemplatePath->setName('template');
  $oTemplatePath->setPath('');
  $sTemplate = file_get_contents($oTemplatePath->getFullFile());
  if($oTemplatePath->getType() == 'set')
  {
    $sTemplate = str_replace('<'.$oTemplatePath->getType().' name="template">', '<set name="'.$oFilePath->getName().'">', $sTemplate);
  }
    
  file_put_contents($sFullFilePath, $sTemplate);
  $oFilePath->changeGroup();
  if(CONST_SVN_AUTO && defined('SVN_REVISION_HEAD'))
  {
    if(isset($_SERVER['PHP_AUTH_USER']))
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
  
  apiSendResult(array('newset' =>
                              array( 'file'  => $oFilePath->getFile(),
                                     'name'  => $oFilePath->getName()
                                     )
                              ));


