<?php
  require_once('core.php');
  
  $aData = $_REQUEST;
  //echo "\n<br><pre>\naData  =" .var_export($aData , TRUE)."</pre>";
  
  if($aData['dvdchapternumber'] == 0)
  {
    $aData['start-time'] = ($aData['dvdstarthours'] * 3600) + ($aData['dvdstartmin'] * 60) + $aData['dvdstartsecs'];
    $aData['stop-time'] = ($aData['dvdendhours'] * 3600) + ($aData['dvdendmin'] * 60) + $aData['dvdendsecs'];
    
    $sCMD    = CONST_VLC_DVD_CLIP_BY_TIME;
    $sSCRIPT = CONST_SCRIPT_DVD_CLIP_BY_TIME;
  }
  else
  {
    $aData['start-chapter'] = $aData['dvdchapternumber'];
    $aData['stop-chapter'] = $aData['dvdchapternumber'] + $aData['dvdchaptercount'] - 1;
    $sCMD    = CONST_VLC_DVD_CLIP_BY_CHAPTER;
    $sSCRIPT = CONST_SCRIPT_DVD_CLIP_BY_CHAPTER;
  }
  
  foreach($aData as $sKey => $xVal)
  {
    $sCMD    = str_replace('<<'.$sKey.'>>', $xVal, $sCMD);
    $sSCRIPT = str_replace('<<'.$sKey.'>>', $xVal, $sSCRIPT);
  }
  
  /*_REQUEST =array (
  'dvdtitle' => 'Ben Hurr',
  'dvdclipdesc' => 'Chariots',
  'dvdtitlenumber' => '1',
  'dvdchapternumber' => '4',
  'dvdchaptercount' => '2',
  'dvdstarthours' => '0',
  'dvdstartmin' => '0',
  'dvdstartsecs' => '0',
  'dvdendhours' => '0',
  'dvdendmin' => '0',
  'dvdendsecs' => '0',
)
*/


  $oFilePath = new filepath(array(
    'type'=>'video',
    'file'=> $sSCRIPT.CONST_SCRIPT_DVD_CLIP_EXT,
    ));

  
  $sFullFilePath = $oFilePath->getFullFile();
  file_put_contents($sFullFilePath, $sCMD);
  //$oFilePath->changeGroup();
  
  if(CONST_SVN_AUTO && defined('SVN_REVISION_HEAD'))
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
  
  $sSaved = file_get_contents($sFullFilePath);
  //echo "\n<br><pre>\nsSaved  =" .$sSaved ."</pre>";
  
  if($sSaved == $sCMD)
  {
    apiSendResult(array(
        'dvdclipfile'  => $oFilePath->getDataFolderFile(), 
        'dvdcliptitle' => $aData['dvdtitle'],
        'dvdclipdesc'  => $aData['dvdclipdesc'],
      ));
  }
  apiSendError('Did Not Create DVD Clip Shortcut File');
