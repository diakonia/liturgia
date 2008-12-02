<?php

  require_once('core.php');
	$oFilePath = new filepath($_REQUEST);
  
  $sQ = $_REQUEST['q'];
  $sQ = str_replace(' ','.+', $sQ);
  if(empty($sQ))
  {
  $sQ = '.+'; 
  }
  $sPattern = '/'.$sQ.'/i';
  
  $aResults = array();
  $d = new RecDir($sData = $oFilePath->getFullDataFolder(), false);
  while (false !== ($entry = $d->read())) {
    $iRes = preg_match($sPattern, $entry);
    if($iRes)
    {
      $oFilePath->setFullFile($entry);
      $sFile = $oFilePath->getFile();
      $sName = $oFilePath->getName();
      $aResults[$sName] = array('name'=>$sName, 'file' => $sFile);
    }
    
  
  }
  $d->close();
  asort($aResults);


	$sTest = json_encode(array($oFilePath->getType().'list' => array_values($aResults)));
	echo $sTest;


class RecDir
{
   protected $currentPath;
   protected $slash;
   protected $rootPath;
   protected $recursiveTree;  

   function __construct($rootPath,$win=false)
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
            array_pop($this->recursiveTree)->close();
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
      return end($this->recursiveTree)->rewind();
   }
}
	
	exit;
	
	$sTest = '{"previews":[
	{"name":"Blue Earth", "src":"earth-blue.jpg", "description":"A blue version of Earth.", "views":200},
	{"name":"User Profile", "src":"user.jpg", "description":"A chubby user guy.", "views":0},
	{"name":"Mouse", "src":"mouse.jpg", "description":"Standard mouse icon.", "views":99},
	{"name":"Gold Earth", "src":"earth-gold.jpg", "description":"A gold version of Earth.", "views":7855},
	{"name":"Page and Pencil", "src":"edit.jpg", "description":"A piece of paper and a pencil.", "views":5},
	{"name":"Speaker", "src":"speaker.jpg", "description":"A speaker.", "views":16},
	{"name":"Orange Monitor", "src":"monitor.jpg", "description":"A yellow, glowing monitor.", "views":355},
	{"name":"Software Box", "src":"package.jpg", "description":"A nice wrapped package in a box.", "views":23452},
	{"name":"FIRE!!!!", "src":"fire.jpg", "description":"Orange flame.", "views":395},
	{"name":"Screwdriver Paper", "src":"setting.jpg", "description":"An always useful screwdriver.", "views":42}
]}';

