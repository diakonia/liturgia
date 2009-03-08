<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" href="css/moosong.css" type="text/css"  media="screen"/>
  <link rel="stylesheet" href="css/moosongprint.css" type="text/css"  media="print"/>
  <link rel="stylesheet" href="css/sexyalertbox.css" type="text/css" media="screen" />
  <title>MooSong</title>
  <?php require_once('core.php'); 
  if(CONST_SVN_AUTO && defined('SVN_REVISION_HEAD'))
  {
    svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_USERNAME, $_SERVER['PHP_AUTH_USER']);
    svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_PASSWORD, $_SERVER['PHP_AUTH_PW']);
    $iRev = svn_update(realpath(filepath::getRoot().'Sets/'));
    if($iRev === false)
    {
       throw(new exception('Could Not Update Files'));
    }
  }
  ?>
</head>
<body id="mainbody">
  
  
	<div id="setpanel">
    <h4>Set</h4>
    <form id="SetChooser">
			<select id="selectSetChooser"><option value="null">Loading ....</option></select><br />
			Set:
      <input id="btnSetNew" type="submit" value="New" />
      <input id="btnSetSave" type="submit" value="Save" />
      <input id="btnSetDownload" type="submit" value="Download" />
      <input id="btnSetPrint" type="submit" value="Print" />
      <br />
      Insert:
      <input id="btnNewSong" type="submit" value="Song" />
      <br />
      Insert:
      <select id="selectNewSetSlide"></select>
      <input id="btnNewSetSlide" type="submit" value="Slide" />
      <!--<input id="btnNewSetNotices" type="submit" value="Gospel" /> GO FETCH THE NOTICES-->
      
      <br />
      <input id="btnDeleteSetItem" type="submit" value="Delete Item" />
      
		</form>
		
		<!--<form id="addSG">
			<input type="text" id="newSGName" />
			<select id="newSGType" >
				<option value="song">Song</option>
				<option value="custom">Slides</option>
				<option value="custom_reading">Reading</option>
				<option value="custom_gospel">Gospel Reading</option>
			</select>
			<input type="submit" value="Add SlideGroup" />
		</form>-->
		
		<h4>Slides</h4>
		<div id="SlideGroupArea">
			<ol id="slidegroups"></ol>
		</div>
	</div>
  
	<div id="editpanel">
    <div id="chooseSongPanel">
      <h4>Choose Song</h4>
      <form id="chooseSong">
        <input type="text" id="textChooseSong" /><input id="btnChooseSongSearch" type="submit" value="Search" />
        <select id="selectChooseSongSearchType">
          <option value="name">Name Only</option>
          <option value="full">Full Text</option>
          </select>
          <br />
        <select id="selectChooseSong" size="10" multiple="multiple" >
        </select>
        <br />
        <input id="btnChooseSong" type="submit" value="Confirm" /><br />
      </form>
      
    </div>
    
    <div id="displaySetSongInfoPanel">
      <h4>Song - <span id="displaySongTitle"></span></h4>
      <h5>Author - <span id="displaySongAuthor"></span><br />
      Copyright - <span id="displaySongCopyright"></span><br />
      Source - <span id="displaySongSource"></span></h5>
    </div>
    
    
    <div id="editSetSongPanel">
      Presentation Order - <span id="displaySongOrder"></span> <!--Custom Order<input name="submit" value="" />-->
    </div>
    
    <div id="displaySongLyricsPanel">
      
      <span id="displaySongLyrics">
      </span>
      
    </div>
    
    
    <div id="editSetSlidePanel">
      <h4>Slide Edit</h4>
      <form id="editSetSlide">
        Name:<input id="nameSetSlide" type="text" value="" /><br />
        Title:<input id="titleSetSlide" type="text" value="" />
        <input id="btnSaveSetSlide" type="submit" value="Save Slides" /><br />
        Slides:<br />
        <textarea id="bodySetSlide"></textarea>
        <br />
        Notes / Who: <br />
        <textarea id="notesSetSlide"></textarea>
        
        
        <br />
      </form>
      
    </div>
    
    
    
  </div>
  <div id="forms" style="display:none; visibility:hidden;">
  <?php include('forms.html'); ?>
  </div>
   <script type="text/javascript">
   var CONST_SundayCutOff = <?php echo CONST_SundayCutOff ?>;
  </script>
  <script type="text/javascript" src="js/mootools.js"></script>
  <script type="text/javascript" src="js/moosong.js"></script>
  <script src="js/sexyalertbox.v1.1.js" type="text/javascript"></script>
 
</body>
</html>
