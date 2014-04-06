<?php 
  foreach($aEvents as $sDate => $aDateInfo)
  {
    $iDayCount = 0;
    //$aEvents[$sDate]['aData'][$iStartKey][$sName][] = array(
    foreach($aDateInfo['aData'] as $iStartKey => $aEventsAtTime)
    {
      foreach($aEventsAtTime['EVENTS'] as $aEvent)
      {
       if($aEvent['sTag'] == 'TBC')
       {
        continue;
       }
        ?><p>
        <font size="5" face="Arial"><?php echo $aEvent['sTitle'];?></font><br />
        <?php if($aEvent['sTag'] !== 'NOTICE') { ?>
         <font size="3" face="Arial"><?php echo date('l j F Y  - g:i A', $aEvent['iStart']);?></font><br />
         <font size="3" face="Arial"><?php echo $aEvent['sWhere'];?></font>
        <?php } ?>
        <br />
        <font size="3" face="Arial"><?php echo $aEvent['sContent'];?></font>
        </p>
        <?php
       
      }
    }
  } ?>

