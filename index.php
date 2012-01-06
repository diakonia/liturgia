<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" href="css/moosong.css" type="text/css"  media="screen"/>
	
  <link rel="stylesheet" href="css/sexyalertbox.css" type="text/css" media="screen" />
  <!--<link rel="stylesheet" href="sexy/sexyalertbox.css" type="text/css" media="screen" />-->
  
  <?php
  require('core.php');

  getChurch(true);
  
  checkDataFolder();

  
  if(CONST_SVN_AUTO === 0 || (isset($_REQUEST['updated']) && $_REQUEST['updated']) )
  {
   require('set.php');
  }
  else
  {
   require('update.php');
  }
  
