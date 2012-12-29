<?php
  require_once('core.php');
  
  getChurch(false);
  
  $aData = $_REQUEST;
  //echo "\n<br><pre>\naData  =" .var_export($aData , TRUE)."</pre>";
  
  $aReturn = false;
  $aData['start-chapter'] = $aData['dvdchapternumber'];
  $aData['stop-chapter'] = $aData['dvdchapternumber'] + $aData['dvdchaptercount'] - 1;
  $aData['start-time'] = ($aData['dvdstarthours'] * 3600) + ($aData['dvdstartmin'] * 60) + $aData['dvdstartsecs'];
  $aData['stop-time'] = ($aData['dvdendhours'] * 3600) + ($aData['dvdendmin'] * 60) + $aData['dvdendsecs'];
    
  for($i = 1 ; $i <= 10; $i++)
  {
    $sInstructions = '';
    if($aData['dvdchaptercount'] == 0)
    {
      $sCMD_CONST    = 'CONST_DVD_CLIP_BY_TIME_CMD_'.$i;
      $sSCRIPT_CONST = 'CONST_DVD_CLIP_BY_TIME_FILENAME_'.$i;
      $sInstructions_CONST   = 'CONST_DVD_CLIP_BY_TIME_INSTRUCTIONS_'.$i;  
    }
    else
    {
      $sCMD_CONST    = 'CONST_DVD_CLIP_BY_CHAPTER_CMD_'.$i;
      $sSCRIPT_CONST = 'CONST_DVD_CLIP_BY_CHAPTER_FILENAME_'.$i;
      $sInstructions_CONST   = 'CONST_DVD_CLIP_BY_CHAPTER_INSTRUCTIONS_'.$i;
    }
    
    
    if(!(defined($sCMD_CONST) && defined($sSCRIPT_CONST)))
    {
      break;
    }
    
    $sCMD    = constant($sCMD_CONST);
    $sSCRIPT = constant($sSCRIPT_CONST);
    if(defined($sInstructions_CONST))
    {
      $sInstructions = constant($sInstructions_CONST);
    }
    
    
    foreach($aData as $sKey => $xVal)
    {
      $sCMD    = str_replace('<<'.$sKey.'>>', $xVal, $sCMD);
      $sSCRIPT = str_replace('<<'.$sKey.'>>', $xVal, $sSCRIPT);
      $sInstructions   = str_replace('<<'.$sKey.'>>', $xVal, $sInstructions);
    }
    
    $oFilePath = new filepath(array(
      'type'=>'video',
      'file'=> $sSCRIPT.CONST_DVD_CLIP_SCRIPT_EXTENSION,
      ));
  
    
    $sFullFilePath = $oFilePath->getFullFile();
    file_put_contents($sFullFilePath, $sCMD);
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
    
    $sSaved = file_get_contents($sFullFilePath);
    //echo "\n<br><pre>\nsSaved  =" .$sSaved ."</pre>";
    
    if($sSaved != $sCMD)
    {
      apiSendError('Did Not Create DVD Clip Shortcut File');
    }
    
    if($i == 1)
    {
      $aReturn = array(
        'client_os_file'  => $oFilePath->getClientExternalRelativeFile(), 
        'dvdcliptitle' => $aData['dvdtitle'],
        'dvdclipdesc'  => $aData['dvdclipdesc'],
        'dvdclipinstructions' => $sInstructions,
        'file'         => $oFilePath->getName(),
        'type'         => $oFilePath->getType(),
      );
    }
    
  }
  
  apiSendResult($aReturn);
  
