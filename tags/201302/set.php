  <?php require_once('core.php');
  echo '<title id="windowtitle">'.CONST_SiteTitle.': Service Editor</title>';
  ?>
</head>
<body id="mainbody">
  
  
	<div id="setpanel">
    <h4>Set</h4>
    <form id="SetChooser">
			<select id="selectSetChooser"><option value="null">Loading ....</option></select>
      <span id="dirtytext"></span><br />
			Set:
      <input id="btnSetNew" type="submit" value="New" />
      <input id="btnSetSave" type="submit" value="Save" />
      <input id="btnSetDownload" type="submit" value="Download" />
      <br />
      Print:
      <input id="btnSetPrint" type="submit" value="Set List" />
      
      <input id="btnSongsPrint" type="submit" value="Song Sheet" />
      <br />
      Insert:
      <input id="btnNewSong" type="submit" value="Song" />
      <br />
      Insert:
      <select id="selectNewSetSlide"></select>
      <input id="btnNewSetSlide" type="submit" value="Slide" />
      <button id="btnUploadFile">Upload</button>
      
      <!--<input id="btnNewSetNotices" type="submit" value="Gospel" /> GO FETCH THE NOTICES-->
      
      <br />
      <!--Upload: <button id="btnUploadVideo">Video</button>
      <button id="btnUploadPresentation">Presentation</button>
      <button id="btnUploadImage">Image</button>-->
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
    
    <div id="helpPanel">
      <h2>MooSong Service Editor</h2>
      <p>A free software (GPL2) service editor for OpenSong files.</p>
      <ul>
        <li><a href="http://code.google.com/p/moosong/" target="_blank">Project Website</a></li>
        <li><a href="http://code.google.com/p/moosong/wiki/Help" target="_blank">Help</a></li>
        <li><a href="http://code.google.com/p/moosong/issues/list" target="_blank">Report Bugs and Give Us Ideas</a></li>
        <li><a href="http://code.google.com/p/moosong/downloads/detail?name=statusjs.xml" target="_blank">Get the VLC DVD integration files.</a></li>
        </ul>
    </div>
    
    
  </div>
  <div id="forms" style="display:none; visibility:hidden;">
  <?php include('forms.html'); ?>
  </div>
   <script type="text/javascript">
   var CONST_SundayCutOff = <?php echo CONST_SundayCutOff; ?>;
   var CONST_SiteTitle = "<?php echo CONST_SiteTitle; ?>";
   var CONST_MaxFileUpload = "<?php echo CONST_MaxFileUpload; ?>";
   var CONST_Client_OpenSongData = "<?php echo CONST_Client_OpenSongData; ?>";
   var CONST_CHOOSEN_CHURCH =  "<?php echo CONST_CHOOSEN_CHURCH; ?>";
  </script>
  <script type="text/javascript" src="js/mootools.js"></script>
  
  <script type="text/javascript" src="<?php echo CONST_MooSongJS; ?>"></script>
  <script src="js/sexyalertbox.v1.1.js" type="text/javascript"></script>
  <script src="fancyupload/source/Fx.ProgressBar.js" type="text/javascript"></script>
  <script src="fancyupload/source/Swiff.Uploader.js" type="text/javascript"></script>
</body>
</html>
