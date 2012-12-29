<?php

  $iMaxUpload = return_bytes(ini_get('upload_max_filesize'));
  if(!$iMaxUpload)
  {
    $iMaxUpload = 8 * 1024 * 1024;
  }
  
  @define('CONST_MaxFileUpload', $iMaxUpload); // = 2 * 1024 * 1024
  
  require_once('config.php');
  
  if(defined('CONST_FIREPHP') && CONST_FIREPHP == true)
  {
    require_once('FirePHPCore/FirePHP.class.php');
    require_once('FirePHPCore/fb.php');
    ob_start();
  }
  
  
  date_default_timezone_set(CONST_DEFAULT_TIMEZONE);
  
  function getChurch($bShowChurchChoice = false)
  {
    $sChurch = ''; 
    
    if(defined('GROUPS_FILE') && isset($_SERVER['PHP_AUTH_USER']))
    {
      $grp = new  htgroup(GROUPS_FILE);
      $aGrps = $grp->getGroupsForUser($_SERVER['PHP_AUTH_USER']);
      $aChurches = array();
      foreach($aGrps as $sGroup)
      {
        if(strpos($sGroup, 'ms_') === 0)
        {
          $sChurch = substr($sGroup, 3);
          $aChurches[] = $sChurch;
        }
      }
      
      if(count($aChurches) === 0)
      {
        $aChurches[] = 'default';
      }
      
      if(isset($_REQUEST['church']))
      {
        //echo $_REQUEST['church'];
        if(in_array($_REQUEST['church'], $aChurches))
        {
          $sChurch = $_REQUEST['church'];
        }
        else
        {
          die ("Don't have permission for this church");
        }
      }
      else
      {
        if(count($aChurches) === 0)
        {
          die ('something missing');
        }
        elseif(count($aChurches) === 1)
        {
          $sChurch = $aChurches[0];
        }
        else
        {
          if($bShowChurchChoice)
          {
            require('church_choice.php');
          }
        }
      }
    }
    @define('CONST_CHOOSEN_CHURCH', $sChurch);
    return $sChurch;
  }
  
  function checkDataFolder()
  {
    $sSetFolder = filepath::getServerFolderFromType('set');
    if(!file_exists($sSetFolder))
    {
      throw(new exception('Open Song Sets Directory Does Not Exist ('.$sSetFolder.')'));
    }
    
    $aDefaultFiles = array('template', 'blanks'); 
    
    foreach($aDefaultFiles as $sDefaultFile)
    {
     if(!file_exists(filepath::getServerFolderFromType('set').$sDefaultFile) || (isset($_REQUEST['install']) && $_REQUEST['install']))
      {
        $bCopied = copy('templates/Sets/'.$sDefaultFile, filepath::getServerFolderFromType('set').$sDefaultFile);
        if(!$bCopied)
        {
          throw(new exception('Could not copy templates, Check Open Song Data Folder is  writeable'));
        }
      }
    }
  }
  
  function return_bytes($size_str)
  {
    switch (substr ($size_str, -1))
    {
      case 'M': case 'm': return (int)$size_str * 1048576;
      case 'K': case 'k': return (int)$size_str * 1024;
      case 'G': case 'g': return (int)$size_str * 1073741824;
      default: return $size_str;
    }
  }
  
  function apiSendResult($aData)
  {
    $aData['success'] = true;
    $sText = json_encode($aData);
    echo $sText;
    exit;
  }
  
  function apiSendError($sMessage)
  {
    $aData = array(
                'success' => false,
                'message' => $sMessage
                );
    $sText = json_encode($aData);
    echo $sText;
    exit;
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
        if(isset($_SERVER['PHP_AUTH_USER']))
        {
          self::$aServerDirectoryNames[$sName] = str_replace('{USER}', $_SERVER['PHP_AUTH_USER'], self::$aServerDirectoryNames[$sName]);
        }
        if(CONST_CHOOSEN_CHURCH)
        {
          self::$aServerDirectoryNames[$sName] = str_replace('{CHURCH}', CONST_CHOOSEN_CHURCH, self::$aServerDirectoryNames[$sName]);
        }  
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
      
      if(isset($_SERVER['PHP_AUTH_USER']))
      {
        $sDir = str_replace('{USER}', $_SERVER['PHP_AUTH_USER'],  $sDir);
      }
      
      if(CONST_CHOOSEN_CHURCH)
      {
        $sDir = str_replace('{CHURCH}', CONST_CHOOSEN_CHURCH, self::$aServerDirectoryNames[$sType]);
      } 
      //self::$aServerDirectoryNames[$sType] = $sDir;
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
        $sDir = $sDir.CONST_ExternaFolderSeperator;
      }
      return $sDir;
    }
    
    function getType()
    {
      return $this->sType;
    }
    
    function getFileExtension()
    {
      return pathinfo($this->getBaseName(), PATHINFO_EXTENSION); 
    }
    
    function getMimeType()
    {
      if($this->getType() == 'video')
      {
        $aFormats =array(
          'xspf'=>'application/xspf+xml',
          'ai' => 'application/postscript',
          'aif' => 'audio/x-aiff',
          'aifc' => 'audio/x-aiff',
          'aiff' => 'audio/x-aiff',
          'asc' => 'text/plain',
          'atom' => 'application/atom+xml',
          'au' => 'audio/basic',
          'avi' => 'video/x-msvideo',
          'bcpio' => 'application/x-bcpio',
          'bin' => 'application/octet-stream',
          'bmp' => 'image/bmp',
          'cdf' => 'application/x-netcdf',
          'cgm' => 'image/cgm',
          'class' => 'application/octet-stream',
          'cpio' => 'application/x-cpio',
          'cpt' => 'application/mac-compactpro',
          'csh' => 'application/x-csh',
          'css' => 'text/css',
          'dcr' => 'application/x-director',
          'dif' => 'video/x-dv',
          'dir' => 'application/x-director',
          'djv' => 'image/vnd.djvu',
          'djvu' => 'image/vnd.djvu',
          'dll' => 'application/octet-stream',
          'dmg' => 'application/octet-stream',
          'dms' => 'application/octet-stream',
          'doc' => 'application/msword',
          'dtd' => 'application/xml-dtd',
          'dv' => 'video/x-dv',
          'dvi' => 'application/x-dvi',
          'dxr' => 'application/x-director',
          'eps' => 'application/postscript',
          'etx' => 'text/x-setext',
          'exe' => 'application/octet-stream',
          'ez' => 'application/andrew-inset',
          'gif' => 'image/gif',
          'gram' => 'application/srgs',
          'grxml' => 'application/srgs+xml',
          'gtar' => 'application/x-gtar',
          'hdf' => 'application/x-hdf',
          'hqx' => 'application/mac-binhex40',
          'htm' => 'text/html',
          'html' => 'text/html',
          'ice' => 'x-conference/x-cooltalk',
          'ico' => 'image/x-icon',
          'ics' => 'text/calendar',
          'ief' => 'image/ief',
          'ifb' => 'text/calendar',
          'iges' => 'model/iges',
          'igs' => 'model/iges',
          'jnlp' => 'application/x-java-jnlp-file',
          'jp' => 'image/jp2',
          'jpe' => 'image/jpeg',
          'jpeg' => 'image/jpeg',
          'jpg' => 'image/jpeg',
          'js' => 'application/x-javascript',
          'kar' => 'audio/midi',
          'latex' => 'application/x-latex',
          'lha' => 'application/octet-stream',
          'lzh' => 'application/octet-stream',
          'm' => 'u 	audio/x-mpegurl',
          'm' => 'a 	audio/mp4a-latm',
          'm' => 'b 	audio/mp4a-latm',
          'm' => 'p 	audio/mp4a-latm',
          'm' => 'u 	video/vnd.mpegurl',
          'm' => 'v 	video/x-m4v',
          'mac' => 'image/x-macpaint',
          'man' => 'application/x-troff-man',
          'mathml' => 'application/mathml+xml',
          'me' => 'application/x-troff-me',
          'mesh' => 'model/mesh',
          'mid' => 'audio/midi',
          'midi' => 'audio/midi',
          'mif' => 'application/vnd.mif',
          'mov' => 'video/quicktime',
          'movie' => 'video/x-sgi-movie',
          'mp' => 'audio/mpeg',
          'mp' => 'audio/mpeg',
          'mp' => 'video/mp4',
          'mpe' => 'video/mpeg',
          'mpeg' => 'video/mpeg',
          'mpg' => 'video/mpeg',
          'mpga' => 'audio/mpeg',
          'ms' => 'application/x-troff-ms',
          'msh' => 'model/mesh',
          'mxu' => 'video/vnd.mpegurl',
          'nc' => 'application/x-netcdf',
          'oda' => 'application/oda',
          'ogg' => 'application/ogg',
          'pbm' => 'image/x-portable-bitmap',
          'pct' => 'image/pict',
          'pdb' => 'chemical/x-pdb',
          'pdf' => 'application/pdf',
          'pgm' => 'image/x-portable-graymap',
          'pgn' => 'application/x-chess-pgn',
          'pic' => 'image/pict',
          'pict' => 'image/pict',
          'png' => 'image/png',
          'pnm' => 'image/x-portable-anymap',
          'pnt' => 'image/x-macpaint',
          'pntg' => 'image/x-macpaint',
          'ppm' => 'image/x-portable-pixmap',
          'ppt' => 'application/vnd.ms-powerpoint',
          'ps' => 'application/postscript',
          'qt' => 'video/quicktime',
          'qti' => 'image/x-quicktime',
          'qtif' => 'image/x-quicktime',
          'ra' => 'audio/x-pn-realaudio',
          'ram' => 'audio/x-pn-realaudio',
          'ras' => 'image/x-cmu-raster',
          'rdf' => 'application/rdf+xml',
          'rgb' => 'image/x-rgb',
          'rm' => 'application/vnd.rn-realmedia',
          'roff' => 'application/x-troff',
          'rtf' => 'text/rtf',
          'rtx' => 'text/richtext',
          'sgm' => 'text/sgml',
          'sgml' => 'text/sgml',
          'sh' => 'application/x-sh',
          'shar' => 'application/x-shar',
          'silo' => 'model/mesh',
          'sit' => 'application/x-stuffit',
          'skd' => 'application/x-koan',
          'skm' => 'application/x-koan',
          'skp' => 'application/x-koan',
          'skt' => 'application/x-koan',
          'smi' => 'application/smil',
          'smil' => 'application/smil',
          'snd' => 'audio/basic',
          'so' => 'application/octet-stream',
          'spl' => 'application/x-futuresplash',
          'src' => 'application/x-wais-source',
          'sv' => 'cpio 	application/x-sv4cpio',
          'sv' => 'crc 	application/x-sv4crc',
          'svg' => 'image/svg+xml',
          'swf' => 'application/x-shockwave-flash',
          't' => 'application/x-troff',
          'tar' => 'application/x-tar',
          'tcl' => 'application/x-tcl',
          'tex' => 'application/x-tex',
          'texi' => 'application/x-texinfo',
          'texinfo' => 'application/x-texinfo',
          'tif' => 'image/tiff',
          'tiff' => 'image/tiff',
          'tr' => 'application/x-troff',
          'tsv' => 'text/tab-separated-values',
          'txt' => 'text/plain',
          'ustar' => 'application/x-ustar',
          'vcd' => 'application/x-cdlink',
          'vrml' => 'model/vrml',
          'vxml' => 'application/voicexml+xml',
          'wav' => 'audio/x-wav',
          'wbmp' => 'image/vnd.wap.wbmp',
          'wbmxl' => 'application/vnd.wap.wbxml',
          'wml' => 'text/vnd.wap.wml',
          'wmlc' => 'application/vnd.wap.wmlc',
          'wmls' => 'text/vnd.wap.wmlscript',
          'wmlsc' => 'application/vnd.wap.wmlscriptc',
          'wrl' => 'model/vrml',
          'xbm' => 'image/x-xbitmap',
          'xht' => 'application/xhtml+xml',
          'xhtml' => 'application/xhtml+xml',
          'xls' => 'application/vnd.ms-excel',
          'xml' => 'application/xml',
          'xpm' => 'image/x-xpixmap',
          'xsl' => 'application/xml',
          'xslt' => 'application/xslt+xml',
          'xul' => 'application/vnd.mozilla.xul+xml',
          'xwd' => 'image/x-xwindowdump',
          'xyz' => 'chemical/x-xyz',
          'zip' => 'application/zip',
        );
           
        if(isset($aFormats[$this->getFileExtension()]))
        {
          return $aFormats[$this->getFileExtension()];
        }
        
      }
      return 'text/xml';
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
    
    function getClientExternalRelativeFile()
    {
      $sDir = $this->getOpenSongDataFolder();
      return $sDir.$this->getBaseName();
    }
    
    function getClientExternalAbsFile()
    {
      $sDir = $this->getOpenSongDataFolder();
      return CONST_Client_OpenSongData.$sDir.$this->getBaseName();
    }
    
    
    
    function changeGroup()
    {
      if (defined('CONST_FileGroup') && CONST_FileGroup)
      {
        @chgrp($this->getFullFile(), CONST_FileGroup);
      }
      @chmod(realpath($this->getFullFile()), 0775);
    }
    
    function svnUpdateType($sType, &$aMessages, &$aErrors)
    {
      $sServerFolderPath = realpath(filepath::getServerFolderFromType($sType));
      if(isset($_SERVER['PHP_AUTH_USER']))
      {
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
          $sCMD = '/usr/bin/svn update --username '.$_SERVER['PHP_AUTH_USER'].' --password '.$_SERVER['PHP_AUTH_PW'].' "'.$sServerFolderPath.'"';
      
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
              $aErrors[] = $sError;
              $aErrors[] = 'Process Killed';
              fclose($pipes[0]);
              fclose($pipes[1]);
              fclose($pipes[2]);
              return;
            }
            $sOut = stream_get_contents($pipes[1]);
            $aMessages[] = (trim($sOut));
             
             $sError = stream_get_contents($pipes[2]);
            $aErrorLines = split("\n", $sError);
            $aRealErrors = array();
            foreach(array_keys($aErrorLines) as $iKey)
            {
              if(preg_match('/[UAD] /', $aErrorLines[$iKey]))
              {
                $aMessages[] = $aErrorLines[$iKey];
              }
              else
              {
                $aRealErrors[] = $aErrorLines[$iKey];
              }
            }
            $sError = join("\n", $aRealErrors);
            if($sError)
            {
              $aErrors[] = (trim($sError));
              //echo "\n<br><pre>\nsError  =" .$sError ."</pre>";
            }
            fclose($pipes[0]);
            fclose($pipes[1]);
            fclose($pipes[2]);
             
             // It is important that you close any pipes before calling
             // proc_close in order to avoid a deadlock
            $return_value = proc_close($process);
             
          }
        }
      }
      else 
      {
        $aErrors[] = 'Set-up must use http authentication';
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
  
require('htgroups.php');
