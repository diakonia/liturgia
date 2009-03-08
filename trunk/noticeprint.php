<?php
  require_once('core.php');
  $aEvents = array();
  $iNow = time();
  
  $iStartOfThisMonth = $iTableStart = mktime(0, 0, 0, (int) date("n"), 1, (int) date("Y"));
  
  $iTableStart = addMonths($iStartOfThisMonth, 1);
  $iTableEnd = addMonths($iStartOfThisMonth, 2)+(60*60*24*7);
  $iEventsEnd = addMonths($iStartOfThisMonth, 4) - 1;
  
  $aFeeds = array( 
      'LECTIONARY'    => 'http://www.google.com/calendar/feeds/sdr6vocc24tsebm6l6dbrbn0do%40group.calendar.google.com/private-2eeb147af35a65bcd5ced9227187f318/full',
      'REGULAR_EVENT' => 'http://www.google.com/calendar/feeds/ebrbnedrrlti3900mjuo7gq7fo%40group.calendar.google.com/public/full',
      'ROTAS'         => 'http://www.google.com/calendar/feeds/9nlsntlte1u1dtpbie0h5i297g%40group.calendar.google.com/public/full',
      );
  
  if(isNetworkAvailable())
  {
    foreach($aFeeds as $sName => $sURL)
    {
      addEvents($sName, $sURL, $iTableStart, $iTableEnd, $aEvents);
    }
  }
  else
  {
    header('HTTP/1.1 404 Not Found', true, 404);
    exit;
  }
  
  ksort($aEvents);
  
  $sTitle = "Notices Printable";
  
  
  ?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title><?php echo $sTitle; ?></title>
</head>
<body>
  
  <?php
  include ('tableoutput.php');
  
  
  $aEvents = array();
  addEvents('EVENTS', CONST_GOOGLE_EVENT_FEED, $iTableStart, $iEventsEnd, $aEvents);
  ksort($aEvents);
  include ('eventoutput.php');
  
  ?>
</body></html>
