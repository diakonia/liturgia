<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" href="css/moosong.css" type="text/css"  media="screen"/>
	
  <link rel="stylesheet" href="css/sexyalertbox.css" type="text/css" media="screen" />
  <!--<link rel="stylesheet" href="sexy/sexyalertbox.css" type="text/css" media="screen" />-->
  
  <?php
  require('core.php');

$sChurch = ''; 
  if(defined('GROUPS_FILE'))
  {
    $grp = new  htgroup(GROUPS_FILE);
    $aGrps = $grp->getGroupsForUser($_SERVER['PHP_AUTH_USER']);
    $aChurches = array();
    foreach($aGrps as $sGroup)
    {
      if(strpos($sGroup, 'ms_') === 0)
      {
        $sChurch = substr($sGroup, 3);
        $aChurches[] = $sChurch;
      }
    }
    if(count($aChurches) === 0)
    {
      $aChurches[] = 'default';
    }
 
    if(count($aChurches) > 1 && !isset($_REQUEST['church']))
    {
      require('church_choice.php');
    } 

    if(isset($_REQUEST['church']))
    {
//echo $_REQUEST['church'];
      if(in_array($_REQUEST['church'], $aChurches))
      {
        $sChurch = $_REQUEST['church'];
      }
      else
      {
        die ("Don't have permission for this church");
      }
    }
    elseif(count($aChurches) === 1)
    {
      $sChurch = $aChurches[0];
    }
    else
    {
      die ('something missing');
    }
  }

    @define('CONST_CHOOSEN_CHURCH', $sChurch);
  
  checkDataFolder();

  
  if(CONST_SVN_AUTO === 0 || (isset($_REQUEST['updated']) && $_REQUEST['updated']) )
  {
   require('set.php');
  }
  else
  {
   require('update.php');
  }
  
