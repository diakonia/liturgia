<?php
  require_once('config.php');
  date_default_timezone_set(CONST_DEFAULT_TIMEZONE);
  $sSetFolder = filepath::getServerFolderFromType('set');
  if(!file_exists($sSetFolder))
  {
    throw(new exception('Open Song Sets Directory Does Not Exist ('.$sSetFolder.')'));
  }
  
  $aDefaultFiles = array('template', 'blanks'); 
  
  foreach($aDefaultFiles as $sDefaultFile)
  {
   if(!file_exists(filepath::getServerFolderFromType('set').$sDefaultFile) || $_REQUEST['install'])
    {
      $bCopied = copy('templates/Sets/'.$sDefaultFile, filepath::getServerFolderFromType('set').$sDefaultFile);
      if(!$bCopied)
      {
        throw(new exception('Could not copy templates, Check Open Song Data Folder is  writeable'));
      }
    }
  }
  
  class filepath
  {
    protected $sType = '';
    protected $sName = '';
    protected $sPath = '';
    
    public static $aDirectoryNames = array(
      'song'  => 'Songs',
      'set'   => 'Sets',
      'video' => 'Videos',
      'image' => 'Images',
      'presentation' => 'Presentations',
      );
    
    public static $aServerDirectoryNames = array(
      'song'  => CONST_OpenSongSongs,
      'set'   => CONST_OpenSongSets,
      'video' => CONST_OpenSongVideos,
      'image' => CONST_OpenSongImages,
      'presentation' => CONST_OpenSongPresentations,
      );
    
    function __construct($aFileInfo = array())
    {
      if (isset($aFileInfo['type'])) $this->setType($aFileInfo['type']);
      if (isset($aFileInfo['file'])) $this->setFile(stripslashes($aFileInfo['file']));
      if (isset($aFileInfo['name'])) $this->setName($aFileInfo['name']);
      if (isset($aFileInfo['path'])) $this->setPath($aFileInfo['path']);
      foreach (array_keys(self::$aServerDirectoryNames) as $sName)
      {
       self::$aServerDirectoryNames[$sName] = str_replace('{USER}', $_SERVER['PHP_AUTH_USER'], self::$aServerDirectoryNames[$sName]);
      }
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
      $sValue = str_replace(self::$aServerDirectoryNames, '', $sValue);
      $this->setFile($sValue);
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
      return $this->getServerDataFolder();
    }
    
    function getServerDataFolder()
    {
     return self::getServerFolderFromType($this->getType());
    }
    
    public static function getServerFolderFromType($sType)
    {
      $sDir = '';
      if (isset(self::$aServerDirectoryNames[$sType]))
      {
       $sDir = self::$aServerDirectoryNames[$sType];
      }
      $sDir = str_replace('{USER}', $_SERVER['PHP_AUTH_USER'],  $sDir);
      return $sDir;
    }
    
    function getFolderFromType($sType)
    {
      $sDir = '';
      if (isset(self::$aDirectoryNames[$sType]))
      {
       $sDir = self::$aDirectoryNames[$sType];
      }
      return $sDir;
    }
    
    function getOpenSongDataFolder()
    {
      $sDir = $this->getFolderFromType($this->getType());
      if($sDir)
      {
        $sDir = $sDir.'\\';
      }
      return $sDir;
    }
    
    function getType()
    {
      return $this->sType;
    }
    
    function getFullPath()
    {
      return $this->getServerDataFolder().$this->sPath;
    }
    
    function getName()
    {
      return $this->sName;
    }
    
    function getBaseName()
    { 
     return $this->sName;
     #return  str_replace(array('!','/'), '', $this->sName);
    }
    
    function getFile()
    {
      return $this->getPath().$this->getBaseName();
    }
    
    function getFullFile()
    {
      return $this->getFullPath().$this->getBaseName();
    }
    
    function getDataFolderFile()
    {
      $sDir = $this->getOpenSongDataFolder();
      return $sDir.$this->getBaseName();
    }
    
    function changeGroup()
    {
      if (CONST_FileGroup)
      {
        @chgrp($this->getFullFile(), CONST_FileGroup);
        @chmod(realpath($this->getFullFile()), 0775);
      }
    }
    
    function svnUpdateType($sType, &$aMessages, &$aErrors)
    {
      $sServerFolderPath = realpath(filepath::getServerFolderFromType($sType));
      if(CONST_SVN_PHP)
      {
       if(defined('SVN_REVISION_HEAD'))
       {
        svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_USERNAME, $_SERVER['PHP_AUTH_USER']);
        svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_PASSWORD, $_SERVER['PHP_AUTH_PW']);
        $iRev = @svn_update($sServerFolderPath);
        if($iRev === false)
        {
         throw(new exception("Could Not Update Files '$sServerFolderPath'"));
        }
       }
       else
       {
        $aErrors[] = 'PHP SVN not installed';
       }
      }
      else
      {
       $sCMD = '/usr/bin/svn update "'.$sServerFolderPath.'"';
    
       $descriptorspec = array(
          0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
          1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
          2 => array("pipe", "w") // stderr is a file to write to
       );
   
       $cwd = $sServerFolderPath;
      
       $process = proc_open($sCMD, $descriptorspec, $pipes, $cwd);
       $bProcess = is_resource($process);
       
       if (is_resource($process)) {
           // $pipes now looks like this:
           // 0 => writeable handle connected to child stdin
           // 1 => readable handle connected to child stdout
           // 2 => readable handle connected to child sterr
           $sError = fread($pipes[2], 3000);
       
           if ($sError)
           {
            if(strpos( $sError , 'ertificate') !== false)
            {
             fclose($pipes[0]);
             fclose($pipes[1]);
             fclose($pipes[2]);
             $aErrors[] = 'Certificate not valid';
             return;
            }
            //Working copy '/home/martyn/Projects/OpenSong/OpenSongSVN' locked
            if(strpos( $sError , ' locked') !== false)
            {
             $aErrors = "The SVN Folder '$sServerFolderPath' is locked try 'svn cleanup'";
            fclose($pipes[0]);
            fclose($pipes[1]);
            fclose($pipes[2]);
             return;
             #throw(new exception("The SVN Folder '$sServerFolderPath' is locked try 'svn cleanup'"));
            }
           }
           $sOut = stream_get_contents($pipes[1]);
           $aMessages[] = (trim($sOut));
           
           $sError = stream_get_contents($pipes[2]);
           $aErrors[] = (trim($sError));
           //echo "\n<br><pre>\nsError  =" .$sError ."</pre>";
           
           fclose($pipes[0]);
           fclose($pipes[1]);
           fclose($pipes[2]);
           
           // It is important that you close any pipes before calling
           // proc_close in order to avoid a deadlock
           $return_value = proc_close($process);
           
          }
      }
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
   

  function addEvents($sName, $sURL, $iMin, $iMax, &$aEvents)
  {
    $sQ  = "?max-results=200&singleevents=true&orderby=starttime&";
    $sQ .= "start-min=".urlencode(date3339($iMin))."&";//2007-05-22T09%3A58%3A47-04%3A00
    $sQ .= "start-max=".urlencode(date3339($iMax));//2007-11-06T09%3A58%3A47-04%3A00
    
    $xmlDoc = new DOMDocument();
    $bTest = $xmlDoc->load($sURL.$sQ);
    if(!$bTest)
    {
      header('HTTP/1.1 404 Not Found', true, 404);
      exit; //not sure it should fail if one fails
      return;
    }
    
    $sXML = $xmlDoc->saveXML();
    $xpath = new DOMXpath($xmlDoc);
    
    $xpath->registerNamespace('xmlns','http://www.w3.org/2005/Atom' );
    $xpath->registerNamespace('openSearch', "http://a9.com/-/spec/opensearchrss/1.0/");
    $xpath->registerNamespace('batch', "http://schemas.google.com/gdata/batch");
    $xpath->registerNamespace('gCal', "http://schemas.google.com/gCal/2005");
    $xpath->registerNamespace('gd', "http://schemas.google.com/g/2005");
    
    $oEvents = $xpath->query("//xmlns:entry");
    
    if (!is_null($oEvents))
    {
      for($i = 0; $i < $oEvents->length; $i++)
      {
        $oEvent = $oEvents->item($i);
        $oTitle = $oEvent->getElementsByTagName ('title');
        $sTitle = $oTitle->item(0)->textContent;
        
        $oContent = $oEvent->getElementsByTagName('content');
        $sContent = $oContent->item(0)->textContent;
        
        $sWhere = $xpath->query("gd:where", $oEvent)->item(0)->getAttribute('valueString');
        
        $oWhen = $xpath->query("gd:when", $oEvent)->item(0);
        $sStart = $oWhen->getAttribute('startTime');
        $oStart = new DateTime($sStart);
        $oNow =  new DateTime($sStart);
        
        $sStartConved = $oStart->format('l jS \of F Y g:i A');
        
        $sEnd = $oWhen->getAttribute('endTime');
        $oEnd = new DateTime($sEnd);
        $sEndConved = $oEnd->format('l jS \of F Y g:i A');
        
        $iStart = $iStartKey = (int) $oStart->format('U');
        $iEnd = (int) $oEnd->format('U');
        
        if($iEnd >= $iMin && $iEnd <= $iMax)
        {
          $sDate = $oStart->format("Y/m/d");
          $aEvents[$sDate]['iDayTime'] = $oStart->format("U");
          
          if(!isset($aEvents[$sDate]['iTypeCount'][$sName]))
          {
            $aEvents[$sDate]['iTypeCount'][$sName] = 0;
          }
          $aEvents[$sDate]['iTypeCount'][$sName] ++;
          
          if($sName == 'LECTIONARY')// && $oStart->format("D") == 'Sun')
          {
            $aEvents[$sDate]['sDayName'] = $sWhere;
          }
          else
          {
           $aMatches = null;
           $iMatches = preg_match_all ( '/\[([^\]]+)\]/' , $sTitle , $aMatches);
            $sTag = "";
            if($iMatches)
            {
             $sTitle = trim(str_replace($aMatches[0][0], "", $sTitle));
             $sTag = $aMatches[1][0];
            }
            $aEvents[$sDate]['aData'][$iStartKey][$sName][] = array(
              'sTitle'    => $sTitle,
              'sWhere'    => $sWhere,
              'sContent'  => $sContent,
              'sTag'      => $sTag,
              //'sStart'    => $sStartConved,
              //'sEnd'      => $sEndConved,
              'iStart'    => $iStart,
              'iEnd'      => $iEnd,
            );
          }
        }
      }
    }
  }
  
