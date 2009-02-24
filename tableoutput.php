<table width="515" border="2" cellspacing="0">
  <tr>
    <td>
      <table cellspacing="0">
      <?php 
        foreach($aEvents as $sDate => $aDateInfo)
        {
          ksort($aDateInfo['aData']);
          $iDayCount = 0;
          //$aEvents[$sDate]['aData'][$iStartKey][$sName][] = array(
          foreach(array_keys($aDateInfo['aData']) as $iStartKey)
          {
            $aEventsAtTime = $aDateInfo['aData'][$iStartKey];
            $aRegular = $aEventsAtTime['REGULAR_EVENT'];
            if (!$aRegular || !is_array($aRegular) || count($aRegular) == 0)
            {
              break;
            }
            ksort($aRegular);
            foreach($aRegular as $aEvent)
            {
              $iDayCount ++; 
              ?>
              <tr valign="top">
                <?php if($iDayCount == 1)
                {
                  //echo "\n<br><pre>\nsDate  =" .$sDate ."</pre>";
                  //echo "\n<br><pre>\niDayCount  =" .var_export($iDayCount , TRUE)."</pre>";
                  ?>
                <td width="20%" rowspan="<?php echo $aDateInfo['iTypeCount']['REGULAR_EVENT'];?>">
                  <font size="3" face="Arial"><?php echo date('D j\<\s\u\p\>S\<\/\s\u\p\>', $aDateInfo['iDayTime']);?></font>
                  <?php if($aDateInfo['sDayName']){?>
                  <br/><font size="1" face="Arial"><?php 
                    //echo str_replace(array(' st',' nd',' rd',' th'),array('<sup>st</sup>','<sup>nd</sup>','<sup>rd</sup>','<sup>th</sup>'),$aDateInfo['sDayName']);
                    echo $aDateInfo['sDayName'];
                    ?>
                    </font>
                  <?php } ?>
                </td>
                <?php }?>
                <td width="20%">
                  <font size="3" face="Arial"><?php echo date('g.i a', $aEvent['iStart']);?></font>
                </td>
                <td>
                  <font size="3" face="Arial"><?php echo $aEvent['sTitle'];?></font>
                  <?php if($aEvent['sWhere']){ ?>
                    <font size="2" face="Arial"><?php  echo " - ".$aEvent['sWhere'];?></font>
                  <?php }?>
                  <?php if($aEvent['sContent']){ ?>
                    <font size="2" face="Arial"><?php  echo "<br>".$aEvent['sContent'];?></font>
                  <?php }?>
                  
                  
                  <?php
                    if($aEventsAtTime['ROTAS'])
                    {
                      ?>
                      <br><font size="1" face="Arial"><i>(
                      <?php
                        echo $aEventsAtTime['ROTAS'][0]['sTitle'].':'.$aEventsAtTime['ROTAS'][0]['sContent'];
                      ?>
                      )</i></font>
                      <?php
                    }
                  ?>
                </td>
              </tr>
              <?php 
              }
            }
          } ?>
      </table>
    </td>
  </tr>
</table>
      
