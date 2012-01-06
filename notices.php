<?php
  require_once('core.php');
  
  getChurch(false);
  
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
    apiSendResult($aData);
  }
  else
  {
    apiSendError('Calendar Feed Contains No Events');
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
         if($aEvent['sTag'] == 'TBC')
         {
          continue;
         }
         $sHead = $sContent = '';
         
         if($aEvent['sTag'] !== 'NOTICE')
         {
          $aEvent['sStart'] = date('l jS \of F Y g:i A', $aEvent['iStart']);
          $sTitle = $aEvent['sTitle'];
          $sHead1 = ($aEvent['sStart']?("\n".$aEvent['sStart']):"")."\n\n".($aEvent['sWhere']?($aEvent['sWhere']."\n"):'');
          $sHead2 = "\n\n";
          $sContent = $aEvent['sContent'];
         }
         else
         {
          $sTitle = $aEvent['sTitle'];
          $sHead1 = "\n\n";
          $sHead2 = "\n\n";
          $sContent = $aEvent['sContent'];
         }
         
         $aContent = split("\n\n", $sContent);
         $aChunks = array();

         foreach($aContent as $iKey => $sChunk)
         {
          //$aChunks = array_merge($aChunks, split("\n\n", wordwrap($sChunk, 250, "\n\n")));
          
          $sCurrentLines = '';
          $iCurrentLine = 0;
          $aCurrChunk = array();
          $aChunkLines = split("\n", $sChunk);
          while($sLine = array_shift($aChunkLines))
          {
           $iUsedLines = count($aCurrChunk)?count(split("\n", $sHead2)):count(split("\n", ($iKey?$sHead2:$sHead1)));
           
           if(strlen($sLine) > 250)
           {
            $aChunks[] = join("\n", $aCurrChunk);
            $aChunks[] = $sLine;
            $aCurrChunk = array();
           }
           else
           {
            $aCurrChunk[] = $sLine;
            if((count($aCurrChunk) + $iUsedLines)  > 6 || strlen(join("\n", $aCurrChunk)) > 250)
            {
             $aChunks[] = join("\n", $aCurrChunk);
             $aCurrChunk = array();
            }
           }
          }
          
          if(count($aCurrChunk))
          { 
           $aChunks[] = join("\n", $aCurrChunk);
          }
         }
         
         foreach($aChunks as $iKey => $sChunk)
         {
          $aSlides[] = trim($sTitle.($iKey?$sHead2:$sHead1).$sChunk, "\n");
         }
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
          if($aEvent['sTag'] == 'TBC')
          {
           continue;
          }
          $aSlides[] = $aEvent['sTitle'];
        }
      }
    }
    $sSlides = join(", \n", $aSlides);
    return $sSlides;
  }
