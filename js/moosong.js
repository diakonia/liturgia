// TEST: Dirty Flag
// TODO: tighter calendar integration
// TEST: resource upload
// TODO: external slide format
window.addEvent('domready', function(){	

Sexy = new SexyAlertBox();
if($defined(Browser.Engine.trident) && Browser.Engine.trident)
{
  Sexy.error( 'This is "totally untested and highly dangerous" code <br/>and it don\'t work in I.E. try <a target="_blank" href="http://getfirefox.com">firefox<a>.');
  return;
}

//Variables  
  var eBlanksDoc = null;
	var aBlankNodes = {};
  var eSetDoc = null;
  var bDirty = false;
	var eSongDoc = null;
	//var sCurrLiID = '';
  var aBibleData = {};
  var aFileData = {video:{}, presentation:{}, image:{}};
  var iThinking = 0;
	var swfUpload = null;
  var sUploadButtonIdle = null;
  var UploadButtonUpdate = $empty;

//DIRTY
this.addEvent('beforeunload', function(e){
  if( bDirty && $defined(e))
  {
    e.stop();
  }
});

var setDirty = function(bIsDirty)
{
  if(!$defined(bIsDirty))
  {
    bIsDirty = true;
  }
  bDirty = bIsDirty;
  var sTitle = CONST_SiteTitle+': '+$('selectSetChooser').value;
  $('dirtytext').empty();
  if (bDirty)
  {
    sTitle = sTitle + ' (Modified)';
    $('dirtytext').set('html', '(Modified)');
  }
  $('windowtitle').set('html', sTitle);
};


var oSetFetchRequest = $empty;

//REQUEST OBJECTS
  //Gets the set with the blank reading etc in.
  var oBlanksRequest = new Request({
		url: "fetch.php?type=set&file=blanks",
		onSuccess: function(txt, xml){	
      eBlanksDoc = $(xml);
      var sName = '';
      var aBlanks = eBlanksDoc.getElements('slide_group');
      aBlanks.each(function(item,index){
          sName = item.getAttribute('name');
          aBlankNodes[sName] = item;
          var myEl = new Element('option', {'value':sName, 'text':sName});
          $('selectNewSetSlide').adopt(myEl);
      });
    },
     onRequest: function(){
      showThinking(true);
    },
    onComplete: function(){
      showThinking(false);
    },
		onFailure: function(){
			Sexy.error( 'The "Blanks" request failed.');
		}
	});
  
  
    
  var oBibleDataRequest = new Request.JSON({
    method: 'get',
    url: "bibles/poly_niv.json",
    //url: "bibledata.php?bible=NIV",
    onSuccess: function(jsonObj) {
      if(jsonObj === null)
      {
        Sexy.error( 'The "Bible Data" request failed.');
        return;
      }
      if(jsonObj.success === false)
      {
        Sexy.error( jsonObj.message);
        return;
      }
      aBibleData = jsonObj;
      //renderBibleLookUp(aBibleData, 'Genesis', 1, 1);
    },
     onRequest: function(){
      showThinking(true);
    },
    onComplete: function(){
      showThinking(false);
    },
    onFailure: function(){
      Sexy.error( 'The "Bible Data" request failed.');
    }
  });
  
	var oSetListFetchRequest = new Request.JSON({
    method:'get',
		url: "list.php?type=set",
		onSuccess: function(jsonObj) {
      if(jsonObj === null)
      {
        Sexy.error( 'The "Set List" request failed.');
        return;
      }
      if(jsonObj.success === false)
      {
        Sexy.error( jsonObj.message);
        return;
      }
      
        $('selectSetChooser').empty();
        var myEl = new Element('option', {'value':'null', 'text':'Choose One'});
        $('selectSetChooser').adopt(myEl);
        jsonObj.setlist.each(function(item, index){
          var myEl = new Element('option', {'value':item.file, 'text':item.name});
          $('selectSetChooser').adopt(myEl);
        });
        $('selectSetChooser').set('value', getDefaultSetName());
			},
		onRequest: function(){
      showThinking(true);
    },
    onComplete: function(){
      showThinking(false);
    },
		onFailure: function(){
			Sexy.error( 'The "Set List" request failed.');
		}
	});
  
  var oSetNewRequest = new Request.JSON({
    method:'get',
		url: "new.php?type=set",
		onSuccess: function(jsonObj) {
      if(jsonObj === null)
      {
        Sexy.error( 'The "New Set" request failed.');
        return;
      }
      if(jsonObj.success === false)
      {
        Sexy.error( jsonObj.message);
        return;
      }
      
      if($chk(jsonObj.exists))
      {
        Sexy.prompt('<h1>Name in use, please try again.</h1>', jsonObj.exists.name, { onComplete: 
          function(returnvalue) {
            if(returnvalue)
            {
               oSetNewRequest.send({'data':{name:returnvalue}});
            }
          }
        });
        
        return;
      }
      
      if($chk(jsonObj.newset))
      {
        var myEl = new Element('option', {'value':jsonObj.newset.file, 'text':jsonObj.newset.name});
        $('selectSetChooser').adopt(myEl);
        $('selectSetChooser').set('value', jsonObj.newset.file);
        oSetFetchRequest.send({data:{type:'set', file:jsonObj.newset.file}});
      }
		},
		onRequest: function(){
      showThinking(true);
    },
    onComplete: function(){
      showThinking(false);
    },
		onFailure: function(){
			Sexy.error( 'The "New Set" request failed.');
		}
	});

	oSetFetchRequest = new Request({
    method:'get',
		url: "fetch.php?type=set",
		onSuccess: function(txt, xml){	
      eSetDoc = $(xml);
			var eSGs = $('slidegroups');
			eSGs.empty();
			var mySGs = eSetDoc.getElements('slide_group');
			mySGs.each(function(item, index){
        item.setAttribute('id', 'sg_'+(index));
        var sName = item.getAttribute('name');	
        var sType = item.getAttribute('type');
        addListItem('slidegroups',sName , item, sType);
      });
      setDirty(false);
    },
    onRequest: function(){
      showThinking(true);
    },
    onComplete: function(){
      showThinking(false);
    },
		onFailure: function(){
      var sName = getDefaultSetName();
      Sexy.confirm('<h1>The Set Fetch request failed.</h1>Would you like to create '+sName+' ?', { onComplete: 
        function(returnvalue) {
          if(returnvalue)
          {
             oSetNewRequest.send({'data':{name:sName}});
          }
        }
      });
			
		}

	});
  
  
  var oSongListFetchRequest = new Request.JSON({
    method:'get',
		url: "list.php?type=song",
		onSuccess: function(jsonObj) {
      if(jsonObj === null)
      {
        Sexy.error( 'The "Song List" request failed.');
        return;
      }
      if(jsonObj.success === false)
      {
        Sexy.error( jsonObj.message);
        return;
      }
      $('selectChooseSong').empty();
        jsonObj.songlist.each(function(item, index){
          var myEl = new Element('option', {'value':item.file, 'text':item.name});
          $('selectChooseSong').adopt(myEl);
			});
    },
		 onRequest: function(){
      showThinking(true);
    },
    onComplete: function(){
      showThinking(false);
    },
		onFailure: function(){
			Sexy.error( 'The "Song List" request failed.');
		}
	});
	
  
  
  var oSongEditFetchRequest = new Request({
    method:'get',
		url: "fetch.php?type=song",
    onSuccess: function(txt, xml){
      showLyricsFromXML(xml);
      oPanelSliders.show(['editSetSong', 'displaySetSongInfo', 'displaySongLyrics']);
    },
     onRequest: function(){
      showThinking(true);
    },
    onComplete: function(){
      showThinking(false);
    },
		onFailure: function(){
			Sexy.error( 'The "Song Edit" request failed.');
		}
	});
  
  var oSongPreviewFetchRequest = new Request({
    method:'get',
		url: "fetch.php?type=song",
    onSuccess: function(txt, xml){	
      showLyricsFromXML(xml);
      oPanelSliders.show(['chooseSong','displaySetSongInfo','displaySongLyrics']);
    },
    onRequest: function(){
      showThinking(true);
    },
    onComplete: function(){
      showThinking(false);
    },
		onFailure: function(){
			Sexy.error( 'The "Song Preview" request failed.');
		}
	});


  var oNoticesFetchRequest = new Request.JSON({
      method:'post',
			url: "notices.php",
			onSuccess: function(jsonObj) {
        if(jsonObj === null)
        {
          Sexy.error( 'The "Notices Fetch" request failed.');
          return;
        }
        if(jsonObj.success === false)
        {
          Sexy.error( jsonObj.message);
          return;
        }
        if(jsonObj.sNotices)
        {
          var sText = $('bodySetSlide').get('value');
          sText = sText.replace('[[notices]]', jsonObj.sNotices);
          $('bodySetSlide').set('value', sText);
          
          var sNotes = $('notesSetSlide').get('value');
          sNotes = sNotes.replace('[[noticessummary]]', jsonObj.sSummary);
          $('notesSetSlide').set('value', sNotes);
          
          saveSetSlide();
        }
			},
      onRequest: function(){
        showThinking(true);
      },
      onComplete: function(){
        showThinking(false);
      },
      onFailure: function(){
        Sexy.error( 'The "Notices Fetch" request failed.');
		}
		});
    
  
  var oYouTubeFetchRequest = new Request.JSON({
      method:'get',
			url: "youtube.php",
			onSuccess: function(jsonObj) {
        if(jsonObj === null)
        {
          Sexy.error( 'The "You Tube Video Fetch" request failed.');
          return;
        }
        if(jsonObj.success === false)
        {
          Sexy.error( jsonObj.message);
          return;
        }
        
        if(jsonObj.name)
        {
          var sText = $('bodySetSlide').get('value');
          $('bodySetSlide').set('value', "");
          var sNotes = $('notesSetSlide').get('value');
          sNotes = sNotes.replace('[[youtubefile]]', jsonObj.relativefile);
          sNotes = sNotes.replace('[[youtubetitle]]', jsonObj.title);
          $('notesSetSlide').set('value', sNotes);
          saveSetSlide();
        }
			},
      onRequest: function(){
        showThinking(true);
      },
      onComplete: function(){
        showThinking(false);
      },
      onFailure: function(){
        Sexy.error( 'The "You Tube Video Fetch" request failed.');
		}
		});
  
  
	
  var oDVDClipRequest = new Request.JSON({
      method:'get',
			url: "dvd.php",
			onSuccess: function(jsonObj) {
        if(jsonObj === null)
        {
          Sexy.error( 'The "DVD Clip Video Fetch" request failed.');
          return;
        }
        if(jsonObj.success === false)
        {
          Sexy.error( jsonObj.message);
          return;
        }
        
        if(jsonObj.dvdclipfile)
        {
          var sText = $('bodySetSlide').get('value');
          $('bodySetSlide').set('value', "");
          var sNotes = $('notesSetSlide').get('value');
          sNotes = sNotes.replace('[[dvdclipfile]]', jsonObj.dvdclipfile);
          sNotes = sNotes.replace('[[dvdcliptitle]]', jsonObj.dvdcliptitle);
          sNotes = sNotes.replace('[[dvdclipdesc]]', jsonObj.dvdclipdesc);
          
          $('notesSetSlide').set('value', sNotes);
          saveSetSlide();
        }
			},
      onRequest: function(){
        showThinking(true);
      },
      onComplete: function(){
        showThinking(false);
      },
      onFailure: function(){
        Sexy.error( 'The "DVD Clip Video Fetch" request failed.');
		}
		});
  
	
  var oVideoListFetchRequest = new Request.JSON({
    method:'get',
		url: "list.php?type=video",
		onSuccess: function(jsonObj) {
      if(jsonObj === null)
      {
        Sexy.error( 'The "Video List" request failed.');
        return;
      }
      
      if(jsonObj.success === false)
      {
        Sexy.error( jsonObj.message);
        return;
      }
      aFileData.video = jsonObj.videolist;
      
    },
		onRequest: function(){
      showThinking(true);
    },
    onComplete: function(){
      showThinking(false);
    },
		onFailure: function(){
			Sexy.error( 'The "Video List" request failed.');
		}
	});

  
    var oPresentationListFetchRequest = new Request.JSON({
    method:'get',
		url: "list.php?type=presentation",
		onSuccess: function(jsonObj) {
      if(jsonObj === null)
      {
        Sexy.error( 'The "Presentation List" request failed.');
        return;
      }
      if(jsonObj.success === false)
      {
        Sexy.error( jsonObj.message);
        return;
      }
      aFileData.presentation = jsonObj.presentationlist;
      
    },
		onRequest: function(){
      showThinking(true);
    },
    onComplete: function(){
      showThinking(false);
    },
		onFailure: function(){
			Sexy.error( 'The "Presentation List" request failed.');
		}
	});


var noticesLookup = function()
{
  oNoticesFetchRequest.send();
};

var readingLookup = function()
{
    Sexy.form($('readinglookup').get('html'), {
      onComplete:function(returnvalue) {
        var sText = $('bodySetSlide').get('value');
        var sNotes = $('notesSetSlide').get('value');
        if(returnvalue)
        {
          returnvalue = new Hash(returnvalue);
          var iReturnVerse = parseInt(returnvalue.verse, 10);
          var sName = $('nameSetSlide').get('value')+' [[book]] [[chapter]]:[[verse]]';
          
          var oPages = new Hash(aBibleData[returnvalue.book][returnvalue.chapter]);
          if (oPages)
          {
            var iCurrPage = 0;
            var aVerses = oPages.getKeys();
            var iVerseKey = -1;
            do
            {
                iVerseKey ++;
            }
            while (iReturnVerse > aVerses[iVerseKey]);
            
            returnvalue.page = iCurrPage = oPages[aVerses[iVerseKey]];
            if(!iCurrPage)
            {
              readingLookup();
              return;
            }
            returnvalue.each(function(xFieldValue, sFieldName)
            {
                sText = sText.replace('[['+sFieldName+']]', xFieldValue);
                sNotes = sNotes.replace('[['+sFieldName+']]', xFieldValue);
                sName = sName.replace('[['+sFieldName+']]', xFieldValue);
            });
            //$('nameSetSlide').set('value', sName);
            $('bodySetSlide').set('value', sText);
            $('notesSetSlide').set('value', sNotes);
            saveSetSlide();
          }
          else
          {
            readingLookup();
            return;
          }
        }
      }
    });

};

var VideoLookup = function()
{
  Sexy.addEvent('onShowComplete', function(e) {
       var aSelect = this.Content.getElements('select');
       var eSelect = aSelect[0];
       var sSelectName = eSelect.get('name');
       if(sSelectName !== 'existingfile')
       {
        return;
       }
       
       eSelect.empty();
       var myEl = new Element('option', {'value':'null', 'text':'Choose One'});
       eSelect.adopt(myEl);
       aFileData.video.each(function(item, index){
         var myEl = new Element('option', {'value':item.relativefile, 'text':item.name});
         eSelect.adopt(myEl);
       });
      });
  
  Sexy.form($('videolookup').get('html'), {
      onComplete:function(returnvalue) {
         if(returnvalue)
         {
           var sText = $('bodySetSlide').get('value');
           var sNotes = $('notesSetSlide').get('value');
           returnvalue = new Hash(returnvalue);
           
           $('bodySetSlide').set('value', '');
           
           var sName = aFileData.video[returnvalue.existingfile];
           sNotes = sNotes.replace('[[file]]', returnvalue.existingfile);
           sNotes = sNotes.replace('[[name]]', sName);
           
           $('notesSetSlide').set('value', sNotes);
           saveSetSlide();
         }
        
      },
      aFileList:aFileData.video,
      sFileType:'video'
    });
};


var DVDClipLookup = function()
{
  Sexy.addEvent('onShowComplete', function(e) {
       
      });
  
  Sexy.form($('dvdcliplookup').get('html'), {
      onComplete:function(returnvalue) {
         if(returnvalue)
         {
           returnvalue = new Hash(returnvalue);
           oDVDClipRequest.send({data:returnvalue});
         }
      }
    });
};


var PresentationLookup = function()
{
  Sexy.addEvent('onShowComplete', function(e) {
       var aSelect = this.Content.getElements('select');
       var eSelect = aSelect[0];
       var sSelectName = eSelect.get('name');
       if(sSelectName !== 'existingfile')
       {
        return;
       }
       
       eSelect.empty();
       var myEl = new Element('option', {'value':'null', 'text':'Choose One'});
       eSelect.adopt(myEl);
       aFileData.presentation.each(function(item, index){
         var myEl = new Element('option', {'value':item.relativefile, 'text':item.name});
         eSelect.adopt(myEl);
       });
      });
  
  Sexy.form($('presentationlookup').get('html'), {
      onComplete:function(returnvalue) {
         if(returnvalue)
         {
           var sText = $('bodySetSlide').get('value');
           var sNotes = $('notesSetSlide').get('value');
           returnvalue = new Hash(returnvalue);
           
           $('bodySetSlide').set('value', '');
           
           var sName = aFileData.video[returnvalue.existingfile];
           sNotes = sNotes.replace('[[file]]', returnvalue.existingfile);
           sNotes = sNotes.replace('[[name]]', sName);
           
           $('notesSetSlide').set('value', sNotes);
           saveSetSlide();
         }
        
      },
      aFileList:aFileData.presentation,
      sFileType:'presentation'
    });
};


var YouTubeLookup = function()
{
  Sexy.form($('youtubelookup1').get('html'), {
    onComplete:function(returnvalue) {
      var sText = $('bodySetSlide').get('value');
      var sNotes = $('notesSetSlide').get('value');
      if(returnvalue)
      {
        returnvalue = new Hash(returnvalue);
        oYouTubeFetchRequest.send({data:returnvalue});
      }
    }
  });
};


  var oPanelSliders = {
    aSliders: [
      ['chooseSong',         $('chooseSongPanel').addClass('hidden')],
      ['editSetSong',        $('editSetSongPanel').addClass('hidden')],
      ['displaySetSongInfo', $('displaySetSongInfoPanel').addClass('hidden')],
      ['displaySongLyrics',  $('displaySongLyricsPanel').addClass('hidden')],
      ['editSetSlide',       $('editSetSlidePanel').addClass('hidden')]
    ],
    
    add:  function(aNames)
    {
      aNames = $splat(aNames);
      for( var i=0; i < this.aSliders.length; i++)
      {
          if(aNames.indexOf(this.aSliders[i][0]) == -1)
          {
           
          }
          else
          {
            this.aSliders[i][1].removeClass('hidden');
          }
      }
    },
    
    show: function(aNames)
    {
      aNames = $splat(aNames);
      for( var i=0; i < this.aSliders.length; i++)
      {
          if(aNames.indexOf(this.aSliders[i][0]) == -1)
          {
            this.aSliders[i][1].addClass('hidden');
          }
          else
          {
            this.aSliders[i][1].removeClass('hidden');
          }
      }
    }
  };
  
  


/*var oPanelSliders = {
    aSliders: [
      ['chooseSong',         new Fx.Slide('chooseSongPanel', {'mode':'vertical'}).slideOut()],
      ['editSetSong',        new Fx.Slide('editSetSongPanel', {'mode':'vertical'}).slideOut()],
      ['displaySetSongInfo', new Fx.Slide('displaySetSongInfoPanel', {'mode':'vertical'}).slideOut()],
      ['displaySongLyrics',  new Fx.Slide('displaySongLyricsPanel', {'mode':'vertical'}).slideOut()],
      ['editSetSlide',       new Fx.Slide('editSetSlidePanel', {'mode':'vertical'}).slideOut()]
    ],
    
    add:  function(aNames)
    {
      aNames = $splat(aNames);
      for( var i=0; i < this.aSliders.length; i++)
      {
          if(aNames.indexOf(this.aSliders[i][0]) == -1)
          {
           
          }
          else
          {
            this.aSliders[i][1].slideIn();
          }
      }
    },
    
    show: function(aNames)
    {
      aNames = $splat(aNames);
      for( var i=0; i < this.aSliders.length; i++)
      {
          if(aNames.indexOf(this.aSliders[i][0]) == -1)
          {
            this.aSliders[i][1].slideOut();
          }
          else
          {
            this.aSliders[i][1].slideIn();
          }
      }
    }
  };
  */



  var getDefaultSetName = function()
  {
    var oDate = new Date();
    var iHour = oDate.getHours();
    oDate.setDate(oDate.getDate() + (7 - ((oDate.getDay() !== 0)?(oDate.getDay()):(oDate.getHours()<CONST_SundayCutOff?7:0))));
    var sNextSunday = oDate.getFullYear() +'-'+PadDigits(1+oDate.getMonth(), 2)+'-'+PadDigits(oDate.getDate(), 2) + '-Morning';
    return sNextSunday;
  };
  


  var showLyricsFromXML = function(xml)
  {
    eSongDoc = $(xml);
    $('displaySongLyrics').empty(); 
    var sLyrics = eSongDoc.getElement('lyrics').get('text').replace(/\n/g, '<br />');
    var sTitle = eSongDoc.getElement('title').get('text');
    $('displaySongTitle').set('html', sTitle);
    $('displaySongLyrics').set('html', sLyrics);
    
    var sSource = null;
    var eUser1 = eSongDoc.getElement('user1');
    if(eUser1)
    {
     sSource = eUser1.get('text');
    }
    if (!sSource)
    {
      if(eSongDoc.getElement('hymnNumber'))
      {
        sSource = eSongDoc.getElement('hymnNumber').get('text');
      }
    }
    if (!sSource)
    {
      if(eSongDoc.getElement('hymn_number'))
      {
        sSource = eSongDoc.getElement('hymn_number').get('text');
      }
    }
    
    
    if (sSource)
    {
      $('displaySongSource').set('html', sSource);
    }
    else
    {
      $('displaySongSource').empty();
    }
    $('displaySongAuthor').set('html', eSongDoc.getElement('author').get('text'));
    $('displaySongCopyright').set('html', eSongDoc.getElement('copyright').get('text'));
    
    //var sPath = eSongDoc.getElement('').get('text');
    //$('displaySongPath').set('html', sPath);
    
  };
  
//XML / Data Stuff


  
  var getSetXML = function()
  {
    var eSGs = eSetDoc.getElement('slide_groups');
		eSGs.empty();
		
    var items = $('slidegroups').childNodes;
		
		for(var i = 0; i < items.length; i++)
		{
			item = items[i];
      eSGs.adopt(items[i].retrieve('xmlnode').clone(true));
		}
		
		//var xmlString = new XMLSerializer().serializeToString( eSetDoc );
		var serializer = new XMLSerializer();
		var xString = serializer.serializeToString(eSetDoc);
		xString = xString.replace(/^<\?xml\s+version\s*=\s*(["'])[^\1]+\1[^?]*\?>/, ""); // bug 336551
		var e4x = new XML(xString);
		var xmlString = XML(e4x).toXMLString();
		xmlString = unescape('%3C%3Fxml+version%3D%221.0%22+encoding%3D%22UTF-8%22%3F%3E')+"\n"+xmlString;
		
		xmlString = xmlString.replace(/SLIDE_GROUP/g, 'slide_group');
    xmlString = xmlString.replace(/SLIDES/g, 'slides');
    xmlString = xmlString.replace(/SLIDE/g, 'slide');
    xmlString = xmlString.replace(/BODY/g, 'body');
    xmlString = xmlString.replace(/SONG_SUBTITLE/g, 'song_subtitle');
    xmlString = xmlString.replace(/SUBTITLE/g, 'subtitle');
    xmlString = xmlString.replace(/TITLE/g, 'title');
    xmlString = xmlString.replace(/NOTES/g, 'notes');
    xmlString = xmlString.replace(/STYLE/g, 'style');
    xmlString = xmlString.replace(/BACKGROUND/g, 'background');
    
    rNS = new RegExp('xmlns="http://www\\.w3\\.org/1999/xhtml"','g');
		xmlString = xmlString.replace(rNS, '');
		
    return xmlString;
    
  };
  


var dirtyCheckStop = function()
  {
        if(bDirty)
        {
          Sexy.error('The current set is Modified the current action has been halted');
          return true;
        }
        return false;
  };
 


var saveSet = function()
  {
    var xmlString = getSetXML();
    // TODO : convert to json request with the error displaying
		var oSetSaveRequest = new Request.JSON({
      method:'post',
			url: "save.php?type=set",
			onSuccess: function(jsonObj){
			  if(jsonObj === null)
        {
          Sexy.error( 'The "Save" request failed.');
          return;
        }
        if(jsonObj.success === false)
        {
          Sexy.error( jsonObj.message);
          return;
        }
      	Sexy.info(jsonObj.txt);
        setDirty(false);
			},
      onRequest: function(){
        showThinking(true);
      },
      onComplete: function(){
        showThinking(false);
      },
      onFailure: function(){
        Sexy.error( 'The "Save Set" request failed.');
		}
		});
    
    var sFilePath = $('selectSetChooser').get('value');
    oSetSaveRequest.send({data:{xml:xmlString, file:sFilePath}});
  };
  
 
  var saveSetSlide = function()
  {
    var aText = $('bodySetSlide').get('value').split('\n---\n');
    //var li = $(sCurrLiID);
    var li = $($('slidegroups').retrieve('sCurrLiID'));
    var xNode = li.retrieve('xmlnode');
    xNode.getElement('notes').set('text', $('notesSetSlide').get('value'));
    xNode.getElement('title').set('text', $('titleSetSlide').get('value'));
    xNode.setAttribute('name', $('nameSetSlide').get('value'));
    var eSlides = xNode.getElement('slides');
		eSlides.empty();
    
    aText.each(function(item, index){
      var mySlide = new Element('slide');
      var myBody = new Element('body');
      myBody.set('text', item);
      mySlide.adopt(myBody);
      eSlides.adopt(mySlide);
    });
    li.store('xmlnode',  xNode);
    setDirty();
  };
  

//need to sort out the cloning ids problem
//TODO : remove renderBibleLookUp
var renderBibleLookUp = function (aBible, book, chapter, verse)
{
  aBible = new Hash(aBible);
  if ($('bookReading').options.length < 2)
  {
    $('bookReading').empty();
    aBible.each(function(aChapters, sBook)
    {
      var myEl = new Element('option', {'value':sBook, 'text':sBook});
      $('bookReading').adopt(myEl);
    });
  }
  $('bookReading').set('value', book);
  /*
  $('chapterReading').empty();
  var oChapter = new Hash(aBible[book]);
  oChapter.each(function(aPages, iChapter)
  {
    var myEl = new Element('option', {'value':iChapter, 'text':iChapter});
    $('chapterReading').adopt(myEl);
  });
  $('chapterReading').set('value', chapter);
  $('verseReading').empty();
  var oPages = new Hash(aBible[book][chapter]);
  var aPageKeys = oPages.getKeys();
  
  for(var i = 1 ; i < aPageKeys[aPageKeys.length - 1]; i++)
  {
    var myEl = new Element('option', {'value':i, 'text':i});
    $('verseReading').adopt(myEl);
  }
  $('verseReading').set('value', verse);
  */
};



//GUI stuff

var editSetSong = function(eLi)
{
  var xmlnode = eLi.retrieve('xmlnode');
  var sPath = xmlnode.getAttribute('path');
  if (sPath === null)
  {
    sPath = '';
  }
  var sName = xmlnode.getAttribute('name');
  var sFile = sPath+sName;
  //oSongEditFetchRequest.send({data:{type:'song', file:sFile}});
  oSongEditFetchRequest.send({data:{file:sFile}});
};

var editSetSlide = function(eLi)
{
  var xmlnode = eLi.retrieve('xmlnode');
  oPanelSliders.show('editSetSlide');
  var myBodys = xmlnode.getElements('body');
  var aText = [];
    myBodys.each(function(item, index){
        var nextText =  item.get('text');
        if(nextText.trim().length)
        {
          aText[aText.length] = nextText;
        }
  });
  var sText = aText.join("\n---\n");
  
  if(sText.match('\\[\\[verse\\]\\]'))
  {
    readingLookup();
  }
  
  if(sText.match('\\[\\[songs\\]\\]'))
  {
    oPanelSliders.show('chooseSong');
    return;
  }
  
  if(sText.match('\\[\\[notices\\]\\]'))
  {
    noticesLookup();
  }
  
  if(sText.match('\\[\\[youtube\\]\\]'))
  {
    YouTubeLookup();
  }
  if(sText.match('\\[\\[video\\]\\]'))
  {
    VideoLookup();
  }
  if(sText.match('\\[\\[dvdclip\\]\\]'))
  {
    DVDClipLookup();
  }
  
  if(sText.match('\\[\\[presentation\\]\\]'))
  {
    PresentationLookup();
  }
  
  
  
  
  $('bodySetSlide').set('value',  sText);
  $('notesSetSlide').set('value', xmlnode.getElement('notes').get('text'));
  $('titleSetSlide').set('value', xmlnode.getElement('title').get('text'));
  $('nameSetSlide').set('value', xmlnode.getAttribute('name'));
  
};


var editSetItem = function(eLi)
{ 
  var sCurrLiID =  eLi.parentNode.retrieve('sCurrLiID');
  if (eLi.getAttribute('id') !== sCurrLiID)
  {
    
    var eCurrEl = $(sCurrLiID);
    if(eCurrEl)
    {
      eCurrEl.removeClass('highlight');
    }
    
    eLi.addClass('highlight');
    
    var sType = eLi.retrieve('xmlnode').getAttribute('type');
    if(sType == 'song')
    {
      editSetSong(eLi);
    }
    if(sType == 'custom')
    {
      editSetSlide(eLi);
    }
  }
  //sCurrLiID = eLi.getAttribute('id');
  eLi.parentNode.store('sCurrLiID', eLi.getAttribute('id'));
};


//This code initalizes the sortable list.
var oSlideGroups = new Sortables('.slidegroups', {
  handle: '.drag-handle',
  //This will constrain the list items to the list.
  constrain: true,
  //We'll get to see a nice cloned element when we drag.
  clone: true,
  snap:0,
  //This function will happen when the user 'drops' an item in a new place.
  onStart: function(eLi){editSetItem(eLi);}
});


//This is the code that makes the text input add list items to the <ul>,
//which we then make sortable.
var addListItem = function (sListID, val, xNode, sType){
  var oList = $(sListID);
  var i = $(sListID).childNodes.length + 1 ;
  var li = new Element('li', {id: 'item-'+i, text:val});
  
  //This handle element will serve as the point where the user 'picks up'
  //the draggable element.
  var handle = new Element('div', {id:'handle-'+i, 'class':'drag-handle list_'+sType});
  handle.inject(li, 'top');
  //Set the value of the form to '', since we've added its value to the <li>.
  
  //Add the <li> to our list.
  var sCurrLiID = oList.retrieve('sCurrLiID');
  if(sCurrLiID)
  {
    li.inject(sCurrLiID, 'after');
  }
  else
  {
    li.inject(sListID, 'bottom');
  }
  li.store('xmlnode',  xNode.clone(true));
  //Do a fancy effect on the <li>.
  li.highlight();
  li.addEvent('click', function(e){editSetItem(this);});
  //We have to add the list item to our Sortable object so it's sortable.
  oSlideGroups.addItems(li);
  return li;
};



$('btnSetSave').addEvent('click', function(e){
  e.stop();
  saveSet();
});

$('selectNewSetSlide').addEvent('change', function(e) {
  var sSelectedType = this.get('value');
  if(sSelectedType == "Video")
  {
    $("btnUploadFile").fade("in");
    swfUploadFile.setOptions({
        url: 'upload.php?type=video&'
        //typeFilter: {
        //	'Images (*.mov, *.mp4, *.avi)': '*.mov; *.jpeg; *.mp4; *.avi'
        //},
    });
  }
  else if(sSelectedType == "Presentation")
  {
    $("btnUploadFile").fade("in");
    swfUploadFile.setOptions({
        url: 'upload.php?type=presentation&'
        //typeFilter: {
		//	'Images (*.mov, *.mp4, *.avi)': '*.mov; *.jpeg; *.mp4; *.avi'
		//},
    });
  }
  else
  {
    $("btnUploadFile").fade("out");
  }
});

$('selectSetChooser').addEvent('change', function(e) {
  e.stop();
  if(dirtyCheckStop())
  {
    return false;
  }
    //Get the value of the text input.
    var sFile = this.get('value');
    //The code here will execute if the input is empty.
    if (!sFile || sFile == 'null') {
      $('slidegroups').empty(); 
    }
    oSetFetchRequest.send({data:{file:sFile}});
});

$('btnSetDownload').addEvent('click', function(e) {
  e.stop();
  //Get the value of the text input.
  var sFile = $('selectSetChooser').get('value');
  //The code here will execute if the input is empty.
  var sURL = 'fetch.php?type=set&file='+sFile; //Would prefer to use the XHR fuctions but can't work ouit how to use it to calculate the URL
  window.location = sURL;
});

$('btnSetPrint').addEvent('click', function(e) {
  e.stop();
  //Get the value of the text input.
  var sFile = $('selectSetChooser').get('value');
  //The code here will execute if the input is empty.
  var sURL = 'print.php?type=set&file='+sFile; //Would prefer to use the XHR fuctions but can't work ouit how to use it to calculate the URL
  //Sexy.iframe(sURL);
  window.location = sURL;
});

$('textChooseSong').addEvent('change', function(e) {
  e.stop();
  //Get the value of the text input.
  var val = this.get('value');
  oSongListFetchRequest.send({data:{q:val}});
});

$('btnChooseSong').addEvent('click', function(e) {
    e.stop();
    var sFile = $('selectChooseSong').get('value');
    var iSelectedIndex = $('selectChooseSong').selectedIndex;
    var eOption = $('selectChooseSong').options[iSelectedIndex];
    var sName = eOption.get('text');
    if (sFile)
    {
      sPath = sFile;
      sPath = sPath.replace(sName, '');
      var newSong = new Element('slide_group', {type: 'song', path:sPath, name:sName});
      var newLi = addListItem('slidegroups', sName, newSong, 'song'); 
      //oPanelSliders.show('none');
      editSetItem(newLi);
      setDirty();
    }
});

$('btnChooseSongSearch').addEvent('click', function(e) {
  e.stop();
  var val = $('textChooseSong').get('value');
  var sType = $('selectChooseSongSearchType').get('value');
  oSongListFetchRequest.send({data:{q:val, s:sType}});
});

$('btnDeleteSetItem').addEvent('click', function(e) {
  e.stop();
  //var li = $(sCurrLiID);
  var li = $($('slidegroups').retrieve('sCurrLiID'));
  oSlideGroups.removeItems(li).destroy();
});

$('selectChooseSong').addEvent('change', function(e) {
  e.stop();
  var sFile = this.get('value');
  if (!sFile || sFile == 'null') {
    $('displayChooseSong').empty(); 
  }
  //oSongPreviewFetchRequest.send({data:{type:'song', file:sFile}});
  oSongPreviewFetchRequest.send({data:{file:sFile}});
  //$('selectSetChooser').empty();
});

$('btnNewSong').addEvent('click',  function(e) {
  e.stop();
  oPanelSliders.show('chooseSong');
});

$('btnNewSetSlide').addEvent('click', function(e){
  e.stop();
  var sName = '';
  var sNewSlideType = $('selectNewSetSlide').get('value');
  
  var newSG = aBlankNodes[sNewSlideType].clone(true);
  if (sNewSlideType == 'Blank')
  {
    sName = prompt('Name For New Slides');
    if(sName === null)
    {
      return;
    }
    newSG.setAttribute('name', sName);
  }
  else
  {
    sName = newSG.getAttribute('name');
  }
  
  var li = addListItem('slidegroups', sName, newSG, 'custom'); 
  editSetItem(li);
  setDirty();
});


$('btnSaveSetSlide').addEvent('click',  function(e) {
  e.stop();
  saveSetSlide();
});

$('btnSetNew').addEvent('click',  function(e) {
  e.stop();
  if(dirtyCheckStop())
  {
    return false;
  }
  Sexy.prompt('<h1>Name For New Set.</h1>', getDefaultSetName(), { onComplete: 
      function(returnvalue) {
        if(returnvalue)
        {
           oSetNewRequest.send({'data':{name:returnvalue}});
        }
      }
    });
});


var showThinking = function(bShow)
{
  if (bShow === null)
  {
    bShow = true;
  }
  
  if (bShow)
  {
    iThinking ++;
  }
  else
  {
    iThinking --;
  }
  
  if (iThinking > 0)
  {
    $('mainbody').getElements('body,div,select,input,textarea').addClass('thinking');
  }
  else
  {
    $('mainbody').getElements('body,div,select,input,textarea').removeClass('thinking');
  }
};


function PadDigits(n, totalDigits) 
{ 
  n = n.toString(); 
  var pd = ''; 
  if (totalDigits > n.length) 
  { 
    for (i=0; i < (totalDigits-n.length); i++) 
    { 
      pd += '0'; 
    } 
  } 
  return pd + n.toString(); 
} 
 


var swfUploadFile = $empty;
var eUploadFile = $('btnUploadFile');
var sUploadFileIdle = eUploadFile.get('html');
var UploadFileUpdate = function() 
{
 if (!swfUploadFile.uploading) 
 {
  return;
 }
 var size = Swiff.Uploader.formatUnit(swfUploadFile.size, 'b');
 eUploadFile.set('html', '<span class="small">' + swfUploadFile.percentLoaded + '% of ' + size + '</span>');
};

swfUploadFile = new Swiff.Uploader({
 path: 'fancyupload/source/Swiff.Uploader.swf',
 url: 'upload.php?type=video&',
 verbose: true,
 queued: false,
 multiple: false,
 target: eUploadFile,
 instantStart: true,
 //typeFilter: {
 //	'Videos (*.mov, *.mp4, *.avi)': '*.mov; *.jpeg; *.mp4; *.avi'
 //},
 fileSizeMax: CONST_MaxFileUpload,
 onSelectSuccess: function(files) {
  if (Browser.Platform.linux && !(Browser.Plugins.Flash.build >= 22 ))
  {
   window.alert('Warning: Due to a misbehaviour of Adobe Flash Player on Linux,\nthe browser will probably freeze during the upload process.\nSince you are prepared now, the upload will start right away ...');
  }
  //alert('Starting Upload', 'Uploading <em>' + files[0].name + '</em> (' + Swiff.Uploader.formatUnit(files[0].size, 'b') + ')');
  this.setEnabled(false);
 },
 onSelectFail: function(files) {
  Sexy.error('<em>' + files[0].name + '</em> was not added! <br> Please select an file smaller than '+(this.options.fileSizeMax/(1024*1024))+' Mb. (Error: #' + files[0].validationError + ')');
 },
 appendCookieData: true,
 onQueue: UploadFileUpdate,
 onFileComplete: function(file) {
  var oResponse = JSON.decode(file.response.text, true);
  if($type(oResponse) == 'object')
  {
   if (oResponse.error) {
    Sexy.error('Failed Upload<br />Uploading <em>' + oResponse.name + '</em> failed, please try again. (Error: #' + oResponse.code + ' ' + oResponse.error + ')');
   } else {
    
    var sNewSlideType = $('selectNewSetSlide').get('value');
    var newSG = aBlankNodes[sNewSlideType].clone(true);
    var sName = sNewSlideType;
    newSG.setAttribute('name', sName);
    newSG.setAttribute('title', sName);
    newSG.getElement('body').empty();
    var sNotes =  newSG.getElement('notes').get('text');
    sNotes = sNotes.replace('[[file]]', oResponse.relativefile);
    
    newSG.getElement('notes').set('text', sNotes);
    
    var li = addListItem('slidegroups', sName, newSG, 'custom');
    
    editSetItem(li);
    setDirty();
    saveSetSlide();
    oVideoListFetchRequest.send();
    oPresentationListFetchRequest.send();
   }
  }
  file.remove();
  this.setEnabled(true);
 },
 onComplete: function() {
  eUploadFile.set('html', sUploadFileIdle);
 }
});

//Doing
$("btnUploadFile").fade("out");
oSetListFetchRequest.send();
oBlanksRequest.send();
oSetFetchRequest.send({data:{file:getDefaultSetName()}});
oSongListFetchRequest.send();
oVideoListFetchRequest.send();
oPresentationListFetchRequest.send();
oBibleDataRequest.send();

});


	
Element.implement({
  getValues: function(options) {
    var form = this;
		if (form.get("tag") == "form") {
			options = $extend({
				fStartProportion: [0, 0], //The start position from 0 -1  [X, Y]
        iFPS: 16, //Frames per second
        iSecondsAtTopSpeed: [2, 2], // how long from one extreme to the other at full speed [X, Y]
        fDeadZone: [0.3, 0.3] // the size of the central dead zone 0  = no dead zone 1 turns off scrolling for that direction [X, Y]
			}, options);
      
      this.options = options;
      var aValues = {};
      
      var aControls = this.getElements('input,select,textarea').each(function(item, index){
        var sName = item.get('name');
        if (sName === null)
        {
          sName = item.get('id');
        }
        var xValue = item.get('value');
        if (item.get('type') != 'submit' && sName)
        {
          aValues[sName] = xValue;
        }
      });
      return aValues;
    }
	  return form;
  }
});

  

