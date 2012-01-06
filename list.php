<?php

  require_once('core.php');
  
  getChurch(false);
  
	$oFilePath = new filepath($_REQUEST);
  
  $sQ = $_REQUEST['q'];
  $sQ = str_replace(' ','.+', $sQ);
  if(empty($sQ))
  {
    $sQ = '.+'; 
  }
  $sPattern = '/'.$sQ.'/i';
  $sVisiblePattern = '/\/.*[^\~]$/';
  
  $bExternal = false;
  if(isset($_REQUEST['e']) && $_REQUEST['e'])
  {
    $bExternal = true;
  }
  
  $sType = $oFilePath->getType();
  
  $aResults = array();
  $d = new RecDir($sData = $oFilePath->getFullDataFolder(), false);
  while (false !== ($entry = $d->read())) {
    if(strpos($entry, '.svn') === false && strpos($entry, '_cache') === false)
    {
      if(preg_match($sVisiblePattern, $entry))
      {
        $iRes = preg_match($sPattern, $entry);
        if(!$iRes && $_REQUEST['s'] == 'full' )
        {
          $oFilePath->setFullFile($entry);
          $sFullFilePath = $oFilePath->getFullFile();
          $sContent = @file_get_contents($sFullFilePath);
          if($sContent)
          {
            $iRes = preg_match($sPattern, $sContent);
          }
        }
        if($iRes)
        {
          $oFilePath->setFullFile($entry);
          $sFile = $oFilePath->getFile();
          $sName = $oFilePath->getName();
          if($_REQUEST['chgrp'])
          {
            $oFilePath->changeGroup();
          }
          $aResults[$sName] = array('name'=>$sName, 'file' => $sFile);
          if(in_array($sType, array('presentation','video')))
          {
            $aResults[$sName]['client_os_file'] = $oFilePath->getClientExternalRelativeFile();
            $aResults[$sName]['client_abs_file'] = $oFilePath->getClientExternalAbsFile();
          }
        }
      }
    }
  }
  $d->close();
  
  if(false)
  {
    natcasesort($aResults);
  }
  else
  {
    asort($aResults);
  }
  
  
  
  if($_REQUEST['type'] == 'set')
  {
    $aResults = array_reverse( $aResults, true);
    unset($aResults['template']);
    unset($aResults['blanks']);
  }
  
  
	apiSendResult(array($oFilePath->getType().'list' => array_values($aResults)));
	
  class RecDir
  {
     protected $currentPath;
     protected $slash;
     protected $rootPath;
     protected $recursiveTree;  
  
     function __construct($rootPath, $win=false)
     {
        switch($win)
        {
           case true:
              $this->slash = '\\';
              break;
           default:
              $this->slash = '/';
        }
        $this->rootPath = $rootPath;
        $this->currentPath = $rootPath;
        $this->recursiveTree = array(dir($this->rootPath));
        $this->rewind();
     }
  
     function __destruct()
     {
        $this->close();
     }
  
     public function close()
     {
        while(true === ($d = array_pop($this->recursiveTree)))
        {
           $d->close();
        }
     }
  
     public function closeChildren()
     {
        while(count($this->recursiveTree)>1 && false !== ($d = array_pop($this->recursiveTree)))
        {
           $d->close();
           return true;
        }
        return false;
     }
  
     public function getRootPath()
     {
        if(isset($this->rootPath))
        {
           return $this->rootPath;
        }
        return false;
     }
  
     public function getCurrentPath()
     {
        if(isset($this->currentPath))
        {
           return $this->currentPath;
        }
        return false;
     }
    
     public function read()
     {
        while(count($this->recursiveTree)>0)
        {
           $d = end($this->recursiveTree);
           if((false !== ($entry = $d->read())))
           {
              if($entry!='.' && $entry!='..')
              {
                 $path = $d->path.$entry;
                
                 if(is_file($path))
                 {
                    return $path;
                 }
                 elseif(is_dir($path.$this->slash))
                 {
                    $this->currentPath = $path.$this->slash;
                    if($child = @dir($path.$this->slash))
                    {
                       $this->recursiveTree[] = $child;
                    }
                 }
              }
           }
           else
           {
              $junk = array_pop($this->recursiveTree);
              $junk->close();
           }
        }
        return false;
     }
  
     public function rewind()
     {
        $this->closeChildren();
        $this->rewindCurrent();
     }
  
     public function rewindCurrent()
     {
       $oLast = end($this->recursiveTree);
       return $oLast->rewind();
     }
  }
	
	exit;
