<?php
  
  require_once('config.php');
  date_default_timezone_set(CONST_DEFAULT_TIMEZONE);
  if(!file_exists(CONST_OpenSongData))
  {
    throw(new exception('Open Song Data Directory Does Not Exist'));
  }
  
  $aDefaultFiles = array('Sets/template', 'Sets/blanks'); 
  
  foreach($aDefaultFiles as $sDefaultFile)
  {
    if(!file_exists(CONST_OpenSongData.$sDefaultFile) || $_REQUEST['install'])
    {
      $bCopied = copy('templates/'.$sDefaultFile, CONST_OpenSongData.$sDefaultFile);
      if(!$bCopied)
      {
        throw(new exception('Could not copy templates, Check Open Song Data Folder is  writeable'));
      }
    }
  }
  
  class filepath
  {
    private $sOpenSongRoot = CONST_OpenSongData;
    private $sType = '';
    private $sName = '';
    private $sPath = '';
    
    function __construct($aFileInfo)
    {
      if (isset($aFileInfo['type'])) $this->setType($aFileInfo['type']);
      if (isset($aFileInfo['file'])) $this->setFile($aFileInfo['file']);
      if (isset($aFileInfo['name'])) $this->setName($aFileInfo['name']);
      if (isset($aFileInfo['path'])) $this->setPath($aFileInfo['path']);
    }
    
    function setType($sValue)
    {
      $this->sType = $sValue;
    }
    
    function setFile($sValue)
    {
      $this->setName(basename($sValue));
      $this->setPath(dirname($sValue));
    }
    
    function setFullFile($sValue)
    {
      $this->setFile(str_replace($this->sOpenSongRoot.$this->getDataFolder(), '', $sValue));
    }
    
    function setName($sValue)
    {
      $this->sName = $sValue;
    }
    
    function setPath($sValue)
    {
      if ($sValue == '.')
      {
        $this->sPath = '';
      }
      else
      {
        $this->sPath = $sValue.'/';
      }
    }
    
   
    
    function getPath()
    {
      return $this->sPath;
    }
    
    function getFullDataFolder()
    {
      $sDir = $this->getDataFolder();
      return $this->sOpenSongRoot.$sDir;
    }
    
    function getDataFolder()
    {
      $sDir = '';
      switch ($this->sType)
      {
        case 'song':
          $sDir = 'Songs/';
          break;
        case 'set':
          $sDir = 'Sets/';
          break;
      }
      return $sDir;
    }
    
    function getType()
    {
      return $this->sType;
    }
    
    function getFullPath()
    {
      $sDir = $this->getDataFolder();
      return $this->sOpenSongRoot.$sDir.$this->sPath;
    }
    
    function getName()
    {
      return $this->sName;
    }
    
    function getBaseName()
    {
      return  str_replace(array('!','/'), '', $this->sName);
    }
    
    function getFile()
    {
      return $this->getPath().$this->getBaseName();
    }
    
    function getFullFile()
    {
      return $this->getFullPath().$this->getBaseName();
    }
  }
  
  function isNetworkAvailable()
  {
    $sIP = gethostbyname(CONST_NETWORK_TEST_HOST);
    $bIsNetworkAvailable = (CONST_NETWORK_TEST_HOST == $sIP)?false:true;
    return $bIsNetworkAvailable;
  }
  
  function date3339($timestamp=0) {

    if (!$timestamp) {
        $timestamp = time();
    }
    $date = date('Y-m-d\TH:i:s', $timestamp);

    $matches = array();
    if (preg_match('/^([\-+])(\d{2})(\d{2})$/', date('O', $timestamp), $matches)) {
        $date .= $matches[1].$matches[2].':'.$matches[3];
    } else {
        $date .= 'Z';
    }
    return $date;

}

function addMonths( $base_time = null, $months = 1 )
{
    if (is_null($base_time))
        $base_time = time();
   
    $x_months_to_the_future    = strtotime( "+" . $months . " months", $base_time );
   
    $month_before              = (int) date( "m", $base_time ) + 12 * (int) date( "Y", $base_time );
    $month_after               = (int) date( "m", $x_months_to_the_future ) + 12 * (int) date( "Y", $x_months_to_the_future );
   
    if ($month_after > $months + $month_before)
        $x_months_to_the_future = strtotime( date("Ym01His", $x_months_to_the_future) . " -1 day" );
   
    return $x_months_to_the_future;
} //get_x_months_to_the_future()
   
 
