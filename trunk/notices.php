<?php
  require_once('core.php');
  if(CONST_GOOGLE_EVENT_FEED)
  {
    $xmlDoc = new DOMDocument();
    $xmlDoc->load(CONST_GOOGLE_EVENT_FEED);
    $sXML = $xmlDoc->saveXML();
    $xpath = new DOMXpath($xmlDoc);
    
    $aEvents = array();
    $xpath->registerNamespace('xmlns','http://www.w3.org/2005/Atom' );
    $xpath->registerNamespace('openSearch', "http://a9.com/-/spec/opensearchrss/1.0/");
    $xpath->registerNamespace('batch', "http://schemas.google.com/gdata/batch");
    $xpath->registerNamespace('gCal', "http://schemas.google.com/gCal/2005");
    $xpath->registerNamespace('gd', "http://schemas.google.com/g/2005");
    
    $oEvents = $xpath->query("//xmlns:entry");
    $aEvents = array();
    
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
        //$sEnd = $oWhen->getAttribute('endTime');
        //echo "\n<br><pre>\nsEnd =" .$sEnd."</pre>";
        
        //$oStart = DateTime::createFromFormat('d-m-Y\TH:i:s.u\Z', $sStart);
        $oStart = new DateTime($sStart);
        $sStartConved = $oStart->format('l jS \of F Y h:i A');
        
        $oEnd = new DateTime($sEnd);
        $sEndConved = $oEnd->format('l jS \of F Y h:i A');
        /*
        $oInterval = $oEnd->diff($oStart);
        
        $sDiff = $oInterval->format();
        echo "\n<br><pre>\nsDiff  =" .$sDiff ."</pre>";
        */
        $iStartKey = $oStart->format('YmdHis');
        
        while(isset($aEvents[$iStartKey]))
        {
          $iStartKey ++;
        }
        
        $aEvents[$iStartKey] = array(
          'sTitle'    => $sTitle,
          'sWhere'    => $sWhere,
          'sContent'  => $sContent,
          'sStart'    => $sStartConved,
          'sEnd'      => $sEndConved,
        );
        
      }
      
      
      ksort($aEvents);
      $aSlides = array();
      foreach($aEvents as $aEvent)
      {
        $sSlide = $aEvent['sTitle'].($aEvent['sStart']?("\n".$aEvent['sStart']):"")."\n\n".($aEvent['sWhere']?($aEvent['sWhere']."\n"):'').$aEvent['sContent'];
        $aSlides[] = $sSlide;
      }
      
      $sSlides = join("\n---\n", $aSlides);
      echo $sSlides;
    }
  }
  
  
