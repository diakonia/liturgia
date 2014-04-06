<?php
  require_once('core.php');
  
  getChurch(false);
  
  $aEvents = array();
  $iNow = time();
  
  $aRotaNames = array_combine(split(',', CONST_GOOGLE_ROTAS_TO_DISPLAY), split(',', CONST_GOOGLE_ROTAS_TO_DISPLAY));
  
  
  $iStartOfThisMonth = $iTableStart = mktime(0, 0, 0, (int) date("n"), 1, (int) date("Y"));
  
	
	if($_GET['back'])
	{
		$iTableEnd = addMonths($iStartOfThisMonth, 1)+(60*60*24*7);
		$iEventsEnd = addMonths($iStartOfThisMonth, 3) - 1;
	}
	else
	{
		$iTableStart = addMonths($iStartOfThisMonth, 1);
		$iTableEnd = addMonths($iStartOfThisMonth, 2)+(60*60*24*7);
		$iEventsEnd = addMonths($iStartOfThisMonth, 4) - 1;
	}
  $aFeeds = array( 
      'LECTIONARY'    => CONST_GOOGLE_LECTIONARY_FEED,
      'REGULAR_EVENT' => CONST_GOOGLE_REGULAR_EVENT_FEED,
      'ROTAS'         => CONST_GOOGLE_ROTAS_FEED,
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
	if($_GET['back'])
	{
		?><a href="?back=0">Forward to default month</a><br><br>
  <?php
	}
	else
	{
		?><a href="?back=1">Back a month</a><br><br>
  <?php
	}
	
  include ('tableoutput.php');
  
  
  $aEvents = array();
  addEvents('EVENTS', CONST_GOOGLE_EVENT_FEED, $iTableStart, $iEventsEnd, $aEvents);
  ksort($aEvents);
  include ('eventoutput.php');
  
  ?>
</body></html>
