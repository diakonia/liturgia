<?php
  require_once('core.php');
  $aEvents = array();
  
  if(CONST_GOOGLE_EVENT_FEED)
  {
    if(isNetworkAvailable())
    {
      addEvents('EVENTS', CONST_GOOGLE_EVENT_FEED, time(), addMonths(time(), 3), $aEvents);
    }
    else
    {
      header('HTTP/1.1 404 Not Found', true, 404);
      exit;
    }
  }
  
  if(count($aEvents))
  {
    $aData = array( 'sNotices' => renderEvents($aEvents),
                    'sSummary' => getEventsSummary($aEvents)
                    );
    echo json_encode($aData);
  }
  
  exit;
  
  
  
  function renderEvents($aEvents)
  {//$aEvents[$sDate]['aData'][$iStartKey][$sName][]
    ksort($aEvents);
    $aSlides = array();
    foreach($aEvents as $sDate => $aDateInfo)
    {
      foreach($aDateInfo['aData'] as $iStartKey => $aEventsAtTime)
      {
        foreach($aEventsAtTime['EVENTS'] as $aEvent)
        {
        
        $sSlide = $aEvent['sTitle'].($aEvent['sStart']?("\n".$aEvent['sStart']):"")."\n\n".($aEvent['sWhere']?($aEvent['sWhere']."\n"):'').$aEvent['sContent'];
        $aSlides[] = $sSlide;
        }
      }
    }
    $sSlides = join("\n---\n", $aSlides);
    return $sSlides;
  }
  
  function getEventsSummary($aEvents)
  {//$aEvents[$sDate]['aData'][$iStartKey][$sName][]
    ksort($aEvents);
    $aSlides = array();
    foreach($aEvents as $sDate => $aDateInfo)
    {
      foreach($aDateInfo['aData'] as $iStartKey => $aEventsAtTime)
      {
        foreach($aEventsAtTime['EVENTS'] as $aEvent)
        {
          $aSlides[] = $aEvent['sTitle'];
        }
      }
    }
    $sSlides = join(", \n", $aSlides);
    return $sSlides;
  }
