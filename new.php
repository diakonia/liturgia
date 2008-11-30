<?php

	$aFetch  = $_REQUEST;
	//echo "\n<br><pre>\naFetch   =" .var_export($aFetch  , TRUE)."</pre>";
	
	$sFullPath = '../OpenSong/';
	switch ($aFetch['type'])
	{
		case 'song':
			$sFullPath .= 'Songs/';
			break;
		case 'set':
			$sFullPath .= 'Sets/';
			break;
	}
  
  $sPath = '';
	if($aFetch['path'])
  {
    $sPath .= $aFetch['path'].'/';
  }
  
	$sBaseName = str_replace(array('\'','"','!','/'), '', $aFetch['name']);
  //echo "\n<br><pre>\nsBaseName  =" .$sBaseName ."</pre>";
  
	$sFullPath .= $sPath.$sBaseName;
  
  if (file_exists($sFullPath))
  {
    $sText = json_encode(array('exists' => array('path'=>$sPath, 'name'=>$sBaseName)));
    //echo $sText;
    exit;
  }
  
  if($aFetch['type'] == 'set')
  {
    
    $sTemplatePath = '../OpenSong/';
    switch ($aFetch['type'])
    {
      case 'song':
        $sTemplatePath .= 'Songs/';
        break;
      case 'set':
        $sTemplatePath .= 'Sets/';
    }
    $sTemplatePath .= 'template';
    
    $sTemplate = file_get_contents($sTemplatePath);
    
    $sTemplate = str_replace('<set name="template">', '<set name="'.$aFetch['name'].'">', $sTemplate);
    
    file_put_contents($sFullPath, $sTemplate);
    //chown  ( $sFullPath  , 'martyn'  );
    $sText = json_encode(array('newset' => array(
                                            'path' => $sPath,
                                            'name' => $sBaseName,
                                            )));
    echo $sText;
    exit;
  }


