<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link rel="stylesheet" href="css/application.css" type="text/css"  media="screen"/>

        <link rel="stylesheet" href="css/sexyalertbox.css" type="text/css" media="screen" />
        <link rel="stylesheet" href="css/sexyalertform.css" type="text/css" media="screen" />
        <!--<link rel="stylesheet" href="sexy/sexyalertbox.css" type="text/css" media="screen" />-->

        <?php
        session_start();
        echo '<script type="text/javascript" defer="defer">' .
        'var setToLoad="' . (array_key_exists('selectedSet', $_REQUEST) ? $_REQUEST['selectedSet'] : '') .
        '";</script>' . "\n";
        require_once('includes/core.php');

        getChurch(true);

        checkDataFolder();


        if (CONST_SVN_AUTO === 0 || (isset($_REQUEST['updated']) && $_REQUEST['updated']))
        {
            require_once('includes/jsconfig.php');
            require_once('includes/scripts.php');
            require('includes/set.php');
        }
        else
        {
            require('includes/update.php');
        }
  
