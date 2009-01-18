window.addEvent('domready', function(){	
//Variables
  var eBlanksDoc = null;
	var aBlankNodes = {};
  var eSetDoc = null;
	var eSongDoc = null;
	var sCurrLiID = '';
  var aBibleData = {};
  
	
//REQUEST OBJECTS
  //Gets the set with the blank reading etc in.
  var oBlanksRequest = new Request({
		url: "fetch.php?type=set&file=blanks",
		onSuccess: function(txt, xml){	
      eBlanksDoc = $(xml);
      var aBlanks = eBlanksDoc.getElements('slide_group');
      aBlanks.each(function(item,index){
          aBlankNodes[item.getAttribute('id')] = item;
      });
    },

		onFailure: function(){
			Sexy.error( 'The "Blanks" request failed.');
		}

	});
  
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
  
  var oBibleDataRequest = new Request.JSON({
    method: 'get',
    url: "bibles/poly_niv.json",
    //url: "bibledata.php?bible=NIV",
    onComplete: function(jsonObj) {
      aBibleData = jsonObj;
      //renderBibleLookUp(aBibleData, 'Genesis', 1, 1);
    },
    onFailure: function(){
      Sexy.error( 'The "Bible Data" request failed.');
    }
  });
  
	var oSetListFetchRequest = new Request.JSON({
    method:'get',
		url: "list.php?type=set",
		onComplete: function(jsonObj) {
        $('selectSetChooser').empty();
        var myEl = new Element('option', {'value':'null', 'text':'Choose One'});
        $('selectSetChooser').adopt(myEl);
        jsonObj.setlist.each(function(item, index){
          var myEl = new Element('option', {'value':item.file, 'text':item.name});
          $('selectSetChooser').adopt(myEl);
        });
        $('selectSetChooser').set('value', getDefaultSetName());
			},
			
		onFailure: function(){
			Sexy.error( 'The "Set List" request failed.');
		}
	});
  
	var oSetFetchRequest = new Request({
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

  var oSetNewRequest = new Request.JSON({
    method:'get',
		url: "new.php?type=set",
		onComplete: function(jsonObj) {
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
			
		onFailure: function(){
			Sexy.error( 'The "New Set" request failed.');
		}
	});
  
  
  var oSongListFetchRequest = new Request.JSON({
    method:'get',
		url: "list.php?type=song",
		onComplete: function(jsonObj) {
      $('selectChooseSong').empty();
        jsonObj.songlist.each(function(item, index){
          var myEl = new Element('option', {'value':item.file, 'text':item.name});
          $('selectChooseSong').adopt(myEl);
			});
    },
			
		onFailure: function(){
			Sexy.error( 'The "Song List" request failed.');
		}
	});
	
  
  var oSongFetchRequest = new Request({
    method:'get',
		url: "fetch.php?type=song",
    onSuccess: function(txt, xml){	
      eSongDoc = $(xml);
			$('displaySongLyrics').empty(); 
      var sLyrics = eSongDoc.getElement('lyrics').get('text').replace(/\n/g, '<br />');
      var sTitle = eSongDoc.getElement('title').get('text');
      $('displaySongTitle').set('html', sTitle);
			$('displaySongLyrics').set('html', sLyrics);
      oPanelSliders.add('displaySongLyrics');
    },

		onFailure: function(){
			Sexy.error( 'The "Song Fetch" request failed.');
		}
	});

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
		
		var xmlString = new XMLSerializer().serializeToString( eSetDoc );
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
		
    return xmlString;
    
  };
  
  var getDefaultSetName = function()
  {
    var oDate = new Date();
    var iHour = oDate.getHours();
    oDate.setDate(oDate.getDate() + (7 - ((oDate.getDay() !== 0)?(oDate.getDay()):(oDate.getHours()<CONST_SundayCutOff?7:0))));
    var sNextSunday = oDate.getFullYear() +'-'+PadDigits(1+oDate.getMonth(), 2)+'-'+PadDigits(oDate.getDate(), 2) + '-Morning';
    return sNextSunday;
  };
  

//GUI stuff
  var editSetItem = function(eLi)
  { 
    if (eLi.getAttribute('id') !== sCurrLiID)
    {
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
    sCurrLiID = eLi.getAttribute('id');
  };
  
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
    oSongFetchRequest.send({data:{type:'song', file:sFile}});
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
    
    if(sText.match('[[verse]]'))
    {
      Sexy.form($('readinglookup').get('html'), { onComplete: 
        function(returnvalue) {
          var sText = $('bodySetSlide').get('value');
          if(returnvalue)
          {
            returnvalue = new Hash(returnvalue);
            var iReturnVerse = parseInt(returnvalue.verse, 10);
            var sName = $('nameSetSlide').get('value')+' [[book]] [[chapter]]:[[verse]]';
            
            var oPages = new Hash(aBibleData[returnvalue.book][returnvalue.chapter]);
            var iCurrPage = 0;
            var aVerses = oPages.getKeys();
            var iVerseKey = -1;
            do
            {
                iVerseKey ++;
            }
            while (iReturnVerse > aVerses[iVerseKey]);
            returnvalue.page = iCurrPage = oPages[aVerses[iVerseKey]];
            
            returnvalue.each(function(xFieldValue, sFieldName){
                sText = sText.replace('[['+sFieldName+']]', xFieldValue);
                
                sName = sName.replace('[['+sFieldName+']]', xFieldValue);
            });
            $('nameSetSlide').set('value', sName);
            $('bodySetSlide').set('value', sText);
            saveSetSlide();
          }
        }
      });
    }
    
    $('bodySetSlide').set('value',  sText);
    $('notesSetSlide').set('value', xmlnode.getElement('notes').get('text'));
    $('titleSetSlide').set('value', xmlnode.getElement('title').get('text'));
    $('nameSetSlide').set('value', xmlnode.getAttribute('name'));
    
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
	var addListItem = function (listid, val, xNode, sType){
		var oList = $(listid);
		var i = $(listid).childNodes.length + 1 ;
		var li = new Element('li', {id: 'item-'+i, text:val});
		
		//This handle element will serve as the point where the user 'picks up'
		//the draggable element.
		var handle = new Element('div', {id:'handle-'+i, 'class':'drag-handle list_'+sType});
		handle.inject(li, 'top');
		//Set the value of the form to '', since we've added its value to the <li>.
		
		//Add the <li> to our list.
		$(listid).adopt(li);
    li.store('xmlnode',  xNode.clone(true));
    //Do a fancy effect on the <li>.
		li.highlight();
    li.addEvent('click', function(e){editSetItem(this);});
		//We have to add the list item to our Sortable object so it's sortable.
		oSlideGroups.addItems(li);
		return li;
	};
	
	var oPanelSliders = {
    aSliders: [
      ['chooseSong',         new Fx.Slide('chooseSongPanel', {'mode':'vertical'}).slideOut()],
      ['editSetSong',        new Fx.Slide('editSetSongPanel', {'mode':'vertical'}).slideOut()],
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
  
  
//Buttons


	$('btnSetSave').addEvent('click', function(e){
    e.stop();
		var xmlString = getSetXML();
		var oSetSaveRequest = new Request({
      method:'post',
			url: "save.php?type=set",
			onSuccess: function(txt){
				Sexy.info(txt);
			},
      onFailure: function(){
        Sexy.error( 'The "Save Set" request failed.');
		}
		});
    
    var sFilePath = $('selectSetChooser').get('value');
    oSetSaveRequest.send({data:{xml:xmlString, file:sFilePath}});
	});
  
  $('selectSetChooser').addEvent('change', function(e) {
		e.stop();
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
        addListItem('slidegroups', sName, newSong, 'song'); 
        oPanelSliders.show('none');
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
    var li = $(sCurrLiID);
  	oSlideGroups.removeItems(li).destroy();
	});
  
  $('selectChooseSong').addEvent('change', function(e) {
		e.stop();
		var sFile = this.get('value');
		if (!sFile || sFile == 'null') {
      $('displayChooseSong').empty(); 
		}
    oSongFetchRequest.send({data:{type:'song', file:sFile}});
    //$('selectSetChooser').empty();
	});
  
  $('btnNewSong').addEvent('click',  function(e) {
		e.stop();
    oPanelSliders.show('chooseSong');
  });
  
  $('btnNewSetSlide').addEvent('click', function(e){
    e.stop();
    var sName = prompt('Name For New Slides');
    if(sName === null)
    {
      return;
    }
    
    var newSG = aBlankNodes.slide.clone(true);
    newSG.setAttribute('name', sName);
    var li = addListItem('slidegroups', sName, newSG, 'custom'); 
    editSetItem(li);
  });
  
  var saveSetSlide = function()
  {
    var aText = $('bodySetSlide').get('value').split('\n---\n');
    var li = $(sCurrLiID);
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
  };
  
  $('btnSaveSetSlide').addEvent('click',  function(e) {
		e.stop();
    saveSetSlide();
  });
  
  $('btnSetNew').addEvent('click',  function(e) {
		e.stop();
    Sexy.prompt('<h1>Name For New Set.</h1>', getDefaultSetName(), { onComplete: 
        function(returnvalue) {
          if(returnvalue)
          {
             oSetNewRequest.send({'data':{name:returnvalue}});
          }
        }
      });
	});
  
//Utils

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
  
  
//Doing
  oSetListFetchRequest.send();
  oSetFetchRequest.send({data:{file:getDefaultSetName()}});
  oSongListFetchRequest.send();
  oBibleDataRequest.send();
	oBlanksRequest.send();
  Sexy = new SexyAlertBox();
  
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
      
      var aControls = this.getElements('input,select').each(function(item, index){
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
  

