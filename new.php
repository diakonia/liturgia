<?php
  require_once('core.php');
	$oFilePath = new filepath($_REQUEST);
  $sFullFilePath = $oFilePath->getFullFile();
  
  if (file_exists($sFullFilePath))
  {
    $sText = json_encode(array('exists' => 
                                array( 'file'  => $oFilePath->getFile(),
                                       'name'  => $oFilePath->getName()
                                       )
                                ));
    echo $sText;
    exit;
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
  //chown  ( $sFullPath  , 'martyn'  );
  $sText = json_encode(array('newset' =>
                              array( 'file'  => $oFilePath->getFile(),
                                     'name'  => $oFilePath->getName()
                                     )
                              ));
  echo $sText;
  exit;

