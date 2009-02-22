<?php
  require_once('core.php');
  $aEvents = array();
  
  if(CONST_GOOGLE_EVENT_FEED)
  {
    if(isNetworkAvailable())
    {
      addEvents(CONST_GOOGLE_EVENT_FEED, CONST_GOOGLE_EVENT_MAX_DAYS_FUTURE, $aEvents);
    }
    else
    {
      header('HTTP/1.1 404 Not Found', true, 404);
      exit;
    }
  }
  
  if(count($aEvents))
  {
    renderEvents($aEvents);
  }
  
  exit;
  
  function addEvents($sURL, $iMaxDays, &$aEvents)
  {
    
    $xmlDoc = new DOMDocument();
    $bTest = $xmlDoc->load($sURL);
    if(!$bTest)
    {
      header('HTTP/1.1 404 Not Found', true, 404);
      exit; //not sure it should fail if one fails
      return;
    }
    
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
    
    $iNow = time();
    $iMax = $iNow + ($iMaxDays * 60 * 60 * 24);
    
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
        
        if($iEnd > $iNow && $iEnd < $iMax)
        {
        
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
            'iStart'    => $iStart,
            'iEnd'      => $iEnd,
          );
        }
      }
    }
  }
  
  function renderEvents($aEvents)
  {
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
