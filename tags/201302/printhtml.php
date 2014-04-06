<?php

  require_once('core.php');
  
  getChurch(false);
  
  $oFilePath = new filepath($_REQUEST);
  $sFullFilePath = $oFilePath->getFullFile();
  $sContent = @file_get_contents($sFullFilePath);
  //echo "\n<br><pre>\nsContent  =" .htmlentities($sContent) ."</pre>";
  
  $sTemplate = file_get_contents('songs_template.html');
  $sBody = '';
  
  if($sContent)
  {
    $setDoc = new DOMDocument();
    $setDoc->loadXML($sContent);
    $oSlideGroups =  $setDoc->getElementsByTagName('slide_group');
    
    $nb = $oSlideGroups->length;
    for($pos=0; $pos<$nb; $pos++)
    {
      
      $oNode = $oSlideGroups->item($pos);
      $sType = $oNode->attributes->getNamedItem('type')->nodeValue;
      
      if($sType == 'song')
      {
        $sPath = $oNode->attributes->getNamedItem('path')->nodeValue;
        //echo "\n<br><pre>\nsPath  =" .$sPath ."</pre>";
        $sName = $oNode->attributes->getNamedItem('name')->nodeValue;
        //echo "\n<br><pre>\nsName  =" .$sName ."</pre>";
      
        $sPresentation = "";
        $oPresentation = $oNode->attributes->getNamedItem('presentation');
        if(is_object($oPresentation))
        {
          $sPresentation = $oPresentation->nodeValue;
        }
        
        $oSongPath = new filepath(array(
            'type' => 'song',
            'name' => $sName,
            'path' => $sPath
          ));
        
        $sSongFile = $oSongPath->getFullFile();
        $sSongContent = @file_get_contents($sSongFile);
        //echo "\n<br><pre>\nsSongContent  =" .htmlentities($sSongContent) ."</pre>";
    
        $songDoc = new DOMDocument();
        $songDoc->loadXML($sSongContent);
        $sTitle = $songDoc->getElementsByTagName('title')->item(0)->textContent;
        //echo "\n<br><pre>\nsTitle  =" .$sTitle ."</pre>";
  
        $sBody .= "<div class=\"song\"><h2>$sTitle</h2>\n";
        $sAuthor = $songDoc->getElementsByTagName('author')->item(0)->textContent;
        //echo "\n<br><pre>\nsAuthor  =" .$sAuthor ."</pre>";
        
        $sCopyright = $songDoc->getElementsByTagName('copyright')->item(0)->textContent;
        //echo "\n<br><pre>\nsCopyright  =" .$sCopyright ."</pre>";
        
        
        $sBody .= "<p class=\"songdetails\">$sAuthor";
        if($sCopyright)
        {
        #  $sBody .= "<br />&copy;$sCopyright";
        }
        $sBody .= "</p>\n";
        
        if(!$sPresentation)
        {
          $sPresentation = $songDoc->getElementsByTagName('presentation')->item(0)->textContent;
          
        }
        
        $sLyrics = trim($songDoc->getElementsByTagName('lyrics')->item(0)->textContent);
        
        $aParts = preg_match_all('/\\[([^\]]+)\\]\s*([^\[]+)/',$sLyrics, $aMatches);
        //echo "\n<br><pre>\naMatches =" .var_export($aMatches, TRUE)."</pre>";
        //echo "\n<br><pre>\naParts  =" .var_export($aParts , TRUE)."</pre>";
        if($sPresentation)
        {
          $aOrder = explode(' ', trim(strtoupper($sPresentation)));
        }
        else
        {
          $aOrder = $aMatches[1];
        }
        
        $bSectionHead = ($aOrder !== $aMatches[1]);
          
        
        $aLyrics = array();
          
        foreach($aMatches[1] as $iKey => $sName)
        {
          $aLyrics[$sName] = trim( str_replace('||','',$aMatches[2][$iKey]));
        }
        
        $sBody .= "<div class=\"lyrics\">";
        
        $aUses = array();
        foreach($aOrder as $sName)
        {
          if(!isset($aUses[$sName]))
          {
            $aUses[$sName] = 0;
          }
          $aUses[$sName] ++;
        }
        
        $aUsesWithoutChorus = $aUses; 
        unset($aUsesWithoutChorus['C']);
        $iMostUses = max($aUsesWithoutChorus);
        
        $aPrinted = array();
        
        foreach($aOrder as $sName)
        {
          $sBody .= "<p>";
          if($bSectionHead && ($iMostUses > 1 || strtolower($sName) == 'c'))
          {
            $sHead = str_replace(array('C','V','B','T'),
              array('Chorus ','Verse ','Bridge ','Tag '),
              strtoupper($sName));
            $sBody .= "<b>$sHead</b><br />\n";
          }
          
          if(!$bSectionHead || !isset($aPrinted[$sName]))
          {
            $sBody .= nl2br($aLyrics[$sName]);
          }
          $sBody .= "</p>";
          $aPrinted[$sName] = $sName;
        }
            
        #$sBody .= "<div class=\"lyrics\">".nl2br(str_replace('||','',$sLyrics))."</div>";
        
        $sBody .= "</div>";
        
        if($sCopyright)
        {
          $sBody .= "<p class=\"songdetails\">&copy;$sCopyright";
        
          $sBody .= "</p>\n";
        }
        $sBody .= "</div>";
        
      }
      
      
      
    }
    
    $sOutput = str_replace('{{body}}', $sBody, $sTemplate);
    echo $sOutput;
    
    exit;
  
    
  }
  
  header('HTTP/1.1 404 Not Found', true, 404);
?>
