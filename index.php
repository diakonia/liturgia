<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" href="css/moosong.css" type="text/css"  media="screen"/>
	
  <link rel="stylesheet" href="css/sexyalertbox.css" type="text/css" media="screen" />
  <link rel="stylesheet" href="css/sexyalertform.css" type="text/css" media="screen" />
  <!--<link rel="stylesheet" href="sexy/sexyalertbox.css" type="text/css" media="screen" />-->
  <?php
  require('core.php'); ?>
   <script type="text/javascript">
   var CONST_SundayCutOff = <?php echo CONST_SundayCutOff; ?>;
   var CONST_SiteTitle = "<?php echo CONST_SiteTitle; ?>";
   var CONST_MaxFileUpload = "<?php echo CONST_MaxFileUpload; ?>";
   var CONST_Client_OpenSongData = "!!<?php echo addslashes(CONST_Client_OpenSongData); ?>";
   var CONST_CHOOSEN_CHURCH =  "<?php if(defined('CONST_CHOOSEN_CHURCH')){echo CONST_CHOOSEN_CHURCH;} ?>";
  </script>
  <?php
  require_once('scripts.php');

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
  
