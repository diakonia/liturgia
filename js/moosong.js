window.addEvent('domready', function(){
	// You can skip the following line. We need it to make sure demos
	// are runnable on MooTools demos web page.
	
	var eSetDoc = null;
	var eSongDoc = null;
	var eBlanksDoc = null;
	var aBlankNodes = {};
	
	//This code initalizes the sortable list.
	var oSlideGroups = new Sortables('.slidegroups', {
		handle: '.drag-handle',
		//This will constrain the list items to the list.
		constrain: true,
		//We'll get to see a nice cloned element when we drag.
		clone: true,
    
    snap:0,
		//This function will happen when the user 'drops' an item in a new place.
		onStart: function(eLi){editSetItem(eLi)},
    
	});

  
	//This is the code that makes the text input add list items to the <ul>,
	//which we then make sortable.
	var i = 1;
	
	var addListItem = function (listid, val, xNode, sType){
		var oList = $(listid);
		i = $(listid).childNodes.length + 1 ;
		
		var li = new Element('li', {id: 'item-'+i, text:val});
		
		//This handle element will serve as the point where the user 'picks up'
		//the draggable element.
		var handle = new Element('div', {id:'handle-'+i, 'class':'drag-handle list_'+sType});
		handle.inject(li, 'top');
		//Set the value of the form to '', since we've added its value to the <li>.
		
		//Add the <li> to our list.
		$(listid).adopt(li);
    
    //console.log("xNode =", xNode);
    
    li.store('xmlnode',  xNode.clone(true));
    
    //var xTest = li.retrieve('xmlnode');
    //console.log("xTest =", xTest);
    
		//Do a fancy effect on the <li>.
		li.highlight();
    li.addEvent('click', function(e){editSetItem(this)});
		//We have to add the list item to our Sortable object so it's sortable.
		oSlideGroups.addItems(li);
		
		i++;
    return li;
	};
	var sCurrLiID = '';
	
  var oBlanksRequest = new Request({

		url: "fetch.php?type=set&file=blanks",

		onSuccess: function(txt, xml){	
      eBlanksDoc = $(xml);
      //console.log("eBlanksDoc =", eBlanksDoc);
      var aBlanks = eBlanksDoc.getElements('slide_group');
      aBlanks.each(function(item,index){
          aBlankNodes[item.getAttribute('id')] = item;
          
      });
      //console.log("aBlankNodes =", aBlankNodes);
    },

		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure: function(){
			$('result').set('text', 'The request failed.');
		}

	});
  oBlanksRequest.send();
  
  
  
	//We can use one Request object many times.
	var oSetFetchRequest = new Request({

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

		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure: function(){
			$('result').set('text', 'The request failed.');
		}

	});

	$('btnSetSave').addEvent('click', function(e){
    e.stop();
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
		//console.log("xmlString =", xmlString);
		
		var oSetSaveRequest = new Request({

			url: "save.php?type=set",
	
			onSuccess: function(txt){
				alert(txt);
				
			}
		});
    
    var sFilePath = $('selectSetChooser').get('value');
    //console.log("sFilePath =", sFilePath);
    oSetSaveRequest.send({data:{xml:xmlString, file:sFilePath}});
	});
	
	var oSetListFetchRequest = new Request.JSON({

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
			
		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure: function(){
			$('result').set('text', 'The request failed.');
		}
	});
	
  
  $('selectSetChooser').addEvent('change', function(e) {
		e.stop();402
		//Get the value of the text input.
		var val = this.get('value');
    //console.log("val =", val);
		//The code here will execute if the input is empty.
		if (!val || val == 'null') {
      $('slidegroups').empty(); 
		}
    oSetFetchRequest.send({data:{file:val}});
		//Create a new <li> to hold all our content.
	});
  
  
  var oSongFetchRequest = new Request({

		url: "fetch.php?type=song",

		onSuccess: function(txt, xml){	
      eSongDoc = $(xml);
			$('displaySongLyrics').empty(); 
      var sLyrics = eSongDoc.getElement('lyrics').get('text').replace(/\n/g, '<br />');
      var sTitle = eSongDoc.getElement('title').get('text');
      //console.log("sLyrics =", sLyrics);
      $('displaySongTitle').set('html', sTitle);
			$('displaySongLyrics').set('html', sLyrics);
      
      oPanelSliders.add('displaySongLyrics');
    },

		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure: function(){
			$('result').set('text', 'The request failed.');
		}

	});

  
  
  var oSongListFetchRequest = new Request.JSON({

		url: "list.php?type=song",

		onComplete: function(jsonObj) {
      $('selectChooseSong').empty();
        jsonObj.songlist.each(function(item, index){
          var myEl = new Element('option', {'value':item.file, 'text':item.name});
          $('selectChooseSong').adopt(myEl);
			});
      
			},
			
		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure: function(){
			$('result').set('text', 'The request failed.');
		}
	});
	
  
  $('textChooseSong').addEvent('change', function(e) {
		e.stop();
		//Get the value of the text input.
		var val = this.get('value');
		oSongListFetchRequest.send({data:{q:val}});
		//Create a new <li> to hold all our content.
	});
  
  $('btnChooseSong').addEvent('click', function(e) {
      e.stop();
      var sFile = $('selectChooseSong').get('value');
      //console.log("sFile =", sFile);
      var iSelectedIndex = $('selectChooseSong').selectedIndex;
      //console.log("iSelectedIndex =", iSelectedIndex);
      var eOption = $('selectChooseSong').options[iSelectedIndex];
      //console.log("eOption =", eOption);
      var sName = eOption.get('text');
      if (sFile)
      {
        sPath = sFile;
        sPath = sPath.replace(sName, '');
        var newSong = new Element('slide_group', {type: 'song', path:sPath, name:sName});
        
        addListItem('slidegroups', sName, newSong, 'song'); 
        /*chooseSongPanelSlide.slideOut();
        displaySongLyricsPanelSlide.slideOut();
        editSetSlidePanelSlide.slideOut();*/
        oPanelSliders.show('none');
      }
	});
  
  $('btnChooseSongSearch').addEvent('click', function(e) {
		e.stop();
		//Get the value of the text input.
		var val = $('textChooseSong').get('value');
		oSongListFetchRequest.send({data:{q:val}});
		//Create a new <li> to hold all our content.
	});
  
  
  $('btnDeleteSetItem').addEvent('click', function(e) {
		e.stop();
    var li = $(sCurrLiID);
    //console.log("li =", li);
		oSlideGroups.removeItems(li).destroy();
	});
  
  
  
  $('selectChooseSong').addEvent('change', function(e) {
		e.stop();
		//Get the value of the text input.
		var val = this.get('value');
		//The code here will execute if the input is empty.
		if (!val || val == 'null') {
      $('displayChooseSong').empty(); 
		}
    oSongFetchRequest.send({data:{type:'song', file:val}});
		//Create a new <li> to hold all our content.
	});
  
  var editSetItem = function(eLi)
  { 
    //chooseSongPanelSlide.slideOut();
    if (eLi.getAttribute('id') !== sCurrLiID)
    {
      //console.log("editSetItem eLi =", eLi);
      var sType = eLi.retrieve('xmlnode').getAttribute('type');
      
      //console.log("sType =", sType);
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
    var sName = xmlnode.getAttribute('name');
    var sFile = sPath+sName;
    
    
   
    oSongFetchRequest.send({data:{type:'song', file:sFile}});
  };
  
  
  var editSetSlide = function(eLi)
  {
    var xmlnode = eLi.retrieve('xmlnode');
    
    //console.log("xmlnode =", xmlnode);
    oPanelSliders.show('editSetSlide');
    /*
    editSetSlidePanelSlide.slideIn();
        chooseSongPanelSlide.slideOut();
    displaySongLyricsPanelSlide.slideOut();
    */
    var myBodys = xmlnode.getElements('body');
    //console.log("myBodys =", myBodys);
    var aText = [];
			myBodys.each(function(item, index){
          var nextText =  item.get('text');
          if(nextText.trim().length)
          {
            aText[aText.length] = nextText;
          }
		});
    var sText = aText.join("\n---\n");
    //console.log("sText =", sText);
    $('bodySetSlide').set('value',  sText);
    
    $('notesSetSlide').set('value', xmlnode.getElement('notes').get('text'));
    $('titleSetSlide').set('value', xmlnode.getElement('notes').get('text'));
    $('nameSetSlide').set('value', xmlnode.getAttribute('name'));
    
  };
  
  
  oSongListFetchRequest.send();
  
  /*
  var chooseSongPanelSlide = new Fx.Slide('chooseSongPanel', {'mode':'vertical'}).slideOut();
  var editSetSongPanelSlide = new Fx.Slide('editSetSongPanel', {'mode':'vertical'}).slideOut();
  var displaySongLyricsPanelSlide = new Fx.Slide('displaySongLyricsPanel', {'mode':'vertical'}).slideOut();
  var editSetSlidePanelSlide = new Fx.Slide('editSetSlidePanel', {'mode':'vertical'}).slideOut();
  */
  
   oSongListFetchRequest.send();
  
  var oPanelSliders = {
    
    aSliders: [
      ['chooseSong',         new Fx.Slide('chooseSongPanel', {'mode':'vertical'}).slideOut()],
      ['editSetSong',        new Fx.Slide('editSetSongPanel', {'mode':'vertical'}).slideOut()],
      ['displaySongLyrics',  new Fx.Slide('displaySongLyricsPanel', {'mode':'vertical'}).slideOut()],
      ['editSetSlide',       new Fx.Slide('editSetSlidePanel', {'mode':'vertical'}).slideOut()],
    ],
    
    add:  function(aNames)
    {
      aNames = $splat(aNames);
      console.log("aNames =", aNames);
      for( var i=0; i < this.aSliders.length; i++)
      {
          console.log("this.aSliders["+i+"] =", this.aSliders[i]);
          if(aNames.indexOf(this.aSliders[i][0]) == -1)
          {
           
          }
          else
          {
            this.aSliders[i][1].slideIn();
          }
          
      };
    },
    
    show: function(aNames)
    {
      aNames = $splat(aNames);
      console.log("aNames =", aNames);
      for( var i=0; i < this.aSliders.length; i++)
      {
          console.log("this.aSliders["+i+"] =", this.aSliders[i]);
          if(aNames.indexOf(this.aSliders[i][0]) == -1)
          {
            this.aSliders[i][1].slideOut();
          }
          else
          {
            this.aSliders[i][1].slideIn();
          }
          
      };
    }
  };
  
  
  var oSetNewRequest = new Request.JSON({
		url: "new.php?type=set",
		onComplete: function(jsonObj) {
      if($chk(jsonObj.exists))
      {
        var sName = prompt('Name in use, please try again', jsonObj.exists.name);
        if(sName == null)
        {
          return;
        }
        //console.log("sName =", sName);
        oSetNewRequest.send({'data':{name:sName}});
        return;
      }
      
      if($chk(jsonObj.newset))
      {
        //console.log("jsonObj =", jsonObj);
        var myEl = new Element('option', {'value':jsonObj.newset.file, 'text':jsonObj.newset.name});
        $('selectSetChooser').adopt(myEl);
        
        $('selectSetChooser').set('value', jsonObj.newset.file);
        //console.log("jsonObj.newset.path =", jsonObj.newset.path);
        //console.log("jsonObj.newset =", jsonObj.newset);
        oSetFetchRequest.send({data:{type:'set', file:jsonObj.newset.file}});
      }
      
		},
			
		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure: function(){
			$('result').set('text', 'The request failed.');
		}
	});
	
  $('btnNewSong').addEvent('click',  function(e) {
		e.stop();
    oPanelSliders.show('chooseSong');
    //chooseSongPanelSlide.slideIn();
  });
  
  $('btnNewSetSlide').addEvent('click', function(e){
    e.stop();
   
    var sName = prompt('Name For New Slides');
    //console.log("sName =", sName);
    if(sName == null)
    {
      return;
    }   
    
    var newSG = aBlankNodes.slide.clone(true);
    newSG.setAttribute('name', sName);
    var li = addListItem('slidegroups', sName, newSG, 'custom'); 
    editSetItem(li);
      
	});
  
  
   $('btnNewSetReading').addEvent('click', function(e){
    e.stop();
    var newSG = aBlankNodes.reading.clone(true);
    //console.log("newSG =", newSG);
    var li = addListItem('slidegroups', newSG.getAttribute('name'), newSG, 'custom'); 
    editSetItem(li);
	});
   
   $('btnNewSetGospelReading').addEvent('click', function(e){
    e.stop();
    var newSG = aBlankNodes.gospelreading.clone(true);
    var li = addListItem('slidegroups', newSG.getAttribute('name'), newSG, 'custom'); 
    editSetItem(li);
	});
  
  $('btnSaveSetSlide').addEvent('click',  function(e) {
		e.stop();
    
    var aText = $('bodySetSlide').get('value').split('\n---\n');
    //console.log("aText =", aText);
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
    
    //console.log("eSlides =", eSlides);
    
    li.store('xmlnode',  xNode);
    
  });
  
  var getDefaultSetName = function()
  {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + (7 - oDate.getDay()));
    var sNextSunday = oDate.getFullYear() +'-'+(1+oDate.getMonth())+'-'+oDate.getDate() + '-Morning';
    return sNextSunday;
  }
  
  $('btnSetNew').addEvent('click',  function(e) {
		e.stop();
		var sName = prompt('Name For New Set', getDefaultSetName());
    //console.log("sName =", sName);
    if(sName == null)
    {
      return;
    }
    oSetNewRequest.send({'data':{name:sName}});
	});
  
  
  
  oSetFetchRequest.send({data:{file:getDefaultSetName()}});
	oSetListFetchRequest.send();
	
	
});
