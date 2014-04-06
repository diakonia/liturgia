<?php


  
/*abstract*/ class htbase {


	/*private*/ var $htFile= "";
	
	function htbase ($htFile = "")
	{
		if(!empty($htFile))
		{
			$this->init($htFile);
		}
		return;
	}

	function init ($htFile)
	{
		$this->htFile	= $htFile;

		if(empty($htFile))
		{		
			$this->error("Empty file passed to init",1);
		}
		
		if ($this->canRead()) {
			$this->loadFile();
		}
	}

	function reload() {
		$this->loadFile();
	}		
	
	function canRead ($filename = "")
	{		
	
		if (empty($filename)) {
			$filename = $this->htFile;
		}
		
		if (!(file_exists($filename))) {
			//empty file is OK.		
			return true;
		}
		
		if (!(is_readable($filename)))
		{
			$this->error("File [$filename] not readable",0);
			return false;
		}
		
		if(is_dir($filename))
		{
			$this->error("File [$filename] is a directory",0);
			return false;
		}		

		return true;
	}
	
    function canModify() {    	
    	
    	if (!file_exists($this->htFile)) {
    		return is_writable(dirname($this->htFile));	
    	}
    	
    	if(is_link($this->htFile))
		{
			$this->error("File [$this->htFile] is a symlink",0);
			return false;
		}
    
    	return is_writable($this->htFile);
    }
    
    /*protected*/ function htFile() {
    	return $this->htFile;
    }
    
    /*protected*/ /*abstract*/ function loadFile() {
    }
    
    /*protected*/ /*abstract*/ function writeFile() { 
    }
    
	  /*protected*/ function error($text,$level=0) {
		  msg($text,$level);	
	  }
	
	
}
 

class htgroup extends htbase {

	//Maintain both users in group and groups for user.
	var $groups=array();
	var $users=array();
	var $defGrp;
	
	function htgroup($file="",$defGrp = null) {
		if (isset($defGrp)) $this->defGrp = trim($defGrp);	
		htbase::htbase($file);
	}
	 			
    function getGroupsByUser() {
    	return $this->users;
    }
    
    function getGroupsForUser($user) {
    	return isset ($this->users[$user]) ? $this->users[$user] : false;
    }    
    
    function setGroupsForUser($user,$groups) {
    	
    	if (isset($this->defGrp) && !in_array($this->defGrp,$groups)) {
    		$groups = array_merge(array($this->defGrp),$groups);
    	}
    	
    	$this->users[$user]=$groups;
		$this->resetGroups();
    	
    	return $this->writeFile();    		
    }
    
    function delete($user,$writeFile = true) {
    	if (!is_array($user)) {
    		if (isset($this->users[$user])) {
    			unset($this->users[$user]);
    		}
    	} else {
    		foreach ($user as $aUser) {
    			$this->delete($aUser,false);
    		}
    	}
    	
    	if ($writeFile) {
    	    $this->resetGroups();
    		return $this->writeFile();
    	}
    	
    	return true;
    
    }

    //reset groups array from users array. Will delete group 
    /*private*/ function resetGroups() {
    	$this->groups = array();
    	foreach ($this->users as $user => $groups) {
    		foreach ($groups as $group) {
    			$this->groups[$group][]=$user;
    		}
    	}
    }
	/*protected*/ function loadFile ()
	{
		$this->groups = array();
		$this->users = array();
		
		if (!file_exists($this->htFile())) return;
		
		$lines = file($this->htFile());
		foreach ($lines as $line) {
			$line = preg_replace('/#.*$/', '', $line); //ignore comments
			$line = trim($line);
			if (empty ($line)) continue;
			$row = split(":", $line, 2);
			$group = trim($row[0]);
			if (empty ($group)) continue;
			
			if ($group == $this->defGrp) continue;
			
			$users_in_group = preg_split("'\s'", $row[1]);
			foreach ($users_in_group as $user) {
				if (empty ($user))
					continue;
				
				if (isset($this->defGrp) && !array_key_exists($user,$this->users)) {
					$this->users[$user][] = $this->defGrp;					
				}
				
				$this->groups[$group][] = $user;	
				$this->users[$user][] = $group;
			}

		}
		
	}
	
	/*protected*/ function writeFile ()
	{	
		if (!$this->htFile()) return false;
			
		$fd = fopen( $this->htFile(), "w" );

		foreach ($this->groups as $group => $users) {
			
			if ($group == $this->defGrp) continue;
			
			fwrite($fd,"$group:");
			foreach($users as $user) {
				fwrite($fd," $user");
			}
			fwrite($fd,"\n");
		}

		fclose( $fd );
		return true;
	}
}
