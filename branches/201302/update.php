<?php 
  @apache_setenv('no-gzip', 1);
  @ini_set('zlib.output_compression', 0);
  @ini_set('implicit_flush', 1);
  for ($i = 0; $i < ob_get_level(); $i++) { ob_end_flush(); }
  ob_implicit_flush(1);
  
  require_once('core.php');
 
  getChurch(false);
     
  echo '<title id="windowtitle">'.CONST_SiteTitle.': Service Editor</title>';
  
  ?>
</head>
<body id="mainbody">
  <h1>Starting <?=CONST_SiteTitle; ?></h1>
  <form id="svnform" method="POST" action="index.php" ><input type="hidden" name="updated" value="1" /></form>
  <?php
    
  $aAllErrors = array();
  if(CONST_SVN_AUTO )
  {
    foreach(array_keys(filepath::$aServerDirectoryNames) as $sType)
    { 
      echo "<h3>Updating ".filepath::$aDirectoryNames[$sType]."<h3>";
      $aMessages = $aErrors = array();
      filepath::svnUpdateType($sType, $aMessages, $aErrors);
      echo (nl2br(join("\n", array_merge($aMessages, $aErrors))));
      $aAllErrors = array_merge($aAllErrors, $aErrors);
    }
    if(count($aAllErrors))
    {
      echo "errors halting";
      exit;
    }
  }
  
  ?>
  
  
  <h3>Loading Editor</h3>
  
  <script type="text/javascript">
<!--
document.getElementById('svnform').submit();
//window.location = "set.php";
//-->
</script>

