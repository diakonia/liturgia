var oSetFetchRequest = $empty;

//REQUEST OBJECTS
  //Gets the set with the blank reading etc in.
  var oBlanksRequest = new Request({
		url: "fetch.php?church="+CONST_CHOOSEN_CHURCH+"&type=set&file=blanks",
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
		url: "list.php?church="+CONST_CHOOSEN_CHURCH+"&type=set",
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
		url: "new.php?church="+CONST_CHOOSEN_CHURCH+"&type=set",
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
        oSetFetchRequest.send({data:{church:CONST_CHOOSEN_CHURCH, type:'set', file:jsonObj.newset.file}});
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
		url: "fetch.php?church="+CONST_CHOOSEN_CHURCH+"&type=set",
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
		url: "list.php?church="+CONST_CHOOSEN_CHURCH+"&type=song",
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
		url: "fetch.php?church="+CONST_CHOOSEN_CHURCH+"&type=song",
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
		url: "fetch.php?church="+CONST_CHOOSEN_CHURCH+"&type=song",
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
			url: "notices.php?church="+CONST_CHOOSEN_CHURCH,
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
			url: "youtube.php?church="+CONST_CHOOSEN_CHURCH,
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
          sNotes = sNotes.replace('[[youtubefile]]', jsonObj.client_os_file);
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
			url: "dvd.php?church="+CONST_CHOOSEN_CHURCH,
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
        
        if(jsonObj.client_os_file)
        {
          var sText = $('bodySetSlide').get('value');
          $('bodySetSlide').set('value', "");
          var sNotes = $('notesSetSlide').get('value');
          sNotes = sNotes.replace('[[client_os_file]]', jsonObj.client_os_file);
          sNotes = sNotes.replace('[[dvdcliptitle]]', jsonObj.dvdcliptitle);
          sNotes = sNotes.replace('[[dvdclipdesc]]', jsonObj.dvdclipdesc);
          sNotes = sNotes.replace('[[dvdclipinstructions]]', jsonObj.dvdclipinstructions);
          
          
          $('notesSetSlide').set('value', sNotes);
          saveSetSlide();
          saveSet();
          
          var sURL = 'fetch.php?church="+CONST_CHOOSEN_CHURCH+"&type='+jsonObj.type+'&file='+jsonObj.file; //Would prefer to use the XHR fuctions but can't work ouit how to use it to calculate the URL
          var delayed = function(){window.location = sURL;}.delay(5000);
          
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
		url: "list.php?church="+CONST_CHOOSEN_CHURCH+"&type=video",
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
		url: "list.php?church="+CONST_CHOOSEN_CHURCH+"&type=presentation",
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

	  
	var oVLCRequest = new Request.JSONP({
    method:'get',
		noCache:true,
		url: "http://localhost:8080/requests/statusjs.xml",
		onSuccess: function(jsonObj) {
		  if(jsonObj === null)
      {
        Sexy.error( 'The "VLC" request failed.');
        return;
      }
      if(jsonObj.success === false)
      {
        Sexy.error( jsonObj.message);
        return;
      }
    
      var time = jsonObj.time;
      
      if(this.options.data == 'vlctest=true')
      {
        $$('.vlc-live').removeClass('hidden');
      }
      else if(this.options.data != 'pos=end')
      {
        var dvdstartsecs = time % 60;
        $$('.dvdstartsecs').set('value', dvdstartsecs);
        
        var dvdstartmin = ((time - dvdstartsecs) / 60) % 60;
        $$('.dvdstartmin').set('value', dvdstartmin);
        
        var dvdstarthours = ((time - (dvdstartsecs + (dvdstartmin * 60))) / 60) / 60;
        $$('.dvdstarthours').set('value', dvdstarthours);
        
        var dvdchapternumber = jsonObj.input.chapter.value;
        $$('.dvdchapternumber').set('value', dvdchapternumber);
        
        var dvdtitlenumber = jsonObj.input.title.value;
        $$('.dvdtitlenumber').set('value', dvdtitlenumber);
        
        var dvdtitle = jsonObj.information['meta-information'].title;
        
        //var patt=new RegExp("dvd://[D-Z]");
        //dvdtitle = dvdtitle.replace(patt, "");
        
        $$('.dvdtitle').set('value', dvdtitle);
      }
      else
      {
        var dvdendsecs = time % 60;
        $$('.dvdendsecs').set('value', dvdendsecs);
        
        var dvdendmin = ((time - dvdendsecs) / 60) % 60;
        $$('.dvdendmin').set('value', dvdendmin);
        
        var dvdendhours = ((time - (dvdendsecs + (dvdendmin * 60))) / 60) / 60;
        $$('.dvdendhours').set('value', dvdendhours);
      }
    },
		onRequest: function(){
		  if(this.options.data != 'vlctest=true')
		  {
		    showThinking(true);
		  }
    },
    onComplete: function(){
      if(this.options.data != 'vlctest=true')
		  {
		    showThinking(false);
		  }
    },
		onFailure: function(){
		  if(this.options.data != 'vlctest=true')
		  {
		    Sexy.error( 'The "VLC" request failed.');
		    //console.log( 'The "VLC" request failed.');
		  }
		}
	});
