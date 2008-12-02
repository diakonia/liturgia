window.addEvent('domready', function(){
	// You can skip the following line. We need it to make sure demos
	// are runnable on MooTools demos web page.
	
  
//Variables
  var eBlanksDoc = null;
	var aBlankNodes = {};
  var eSetDoc = null;
	var eSongDoc = null;
	var sCurrLiID = '';
  
	
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

		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure: function(){
			alert( 'The request failed.');
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
			
		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure: function(){
			alert( 'The request failed.');
		}
	});
  
	//We can use one Request object many times.
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

		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure: function(){
			alert( 'The request failed.');
		}

	});

  var oSetNewRequest = new Request.JSON({
    method:'get',
		url: "new.php?type=set",
		onComplete: function(jsonObj) {
      if($chk(jsonObj.exists))
      {
        var sName = prompt('Name in use, please try again', jsonObj.exists.name);
        if(sName == null)
        {
          return;
        }
        oSetNewRequest.send({'data':{name:sName}});
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
			
		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure: function(){
			alert( 'The request failed.');
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
			
		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure: function(){
			alert( 'The request failed.');
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

		// Our request will most likely succeed, but just in case, we'll add an
		// onFailure method which will let the user know what happened.
		onFailure: function(){
			alert( 'The request failed.');
		}
	});


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
    $('bodySetSlide').set('value',  sText);
    $('notesSetSlide').set('value', xmlnode.getElement('notes').get('text'));
    $('titleSetSlide').set('value', xmlnode.getElement('notes').get('text'));
    $('nameSetSlide').set('value', xmlnode.getAttribute('name'));
    
  };
  
  
  var getDefaultSetName = function()
  {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + (7 - oDate.getDay()));
    var sNextSunday = oDate.getFullYear() +'-'+(1+oDate.getMonth())+'-'+oDate.getDate() + '-Morning';
    return sNextSunday;
  }
  
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
    li.addEvent('click', function(e){editSetItem(this)});
		//We have to add the list item to our Sortable object so it's sortable.
		oSlideGroups.addItems(li);
		return li;
	};
	
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
      //console.log("aNames =", aNames);
      for( var i=0; i < this.aSliders.length; i++)
      {
          //console.log("this.aSliders["+i+"] =", this.aSliders[i]);
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
      //console.log("aNames =", aNames);
      for( var i=0; i < this.aSliders.length; i++)
      {
          //console.log("this.aSliders["+i+"] =", this.aSliders[i]);
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
  
  
//Buttons
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
		
		var oSetSaveRequest = new Request({
      method:'get',
			url: "save.php?type=set",
			onSuccess: function(txt){
				alert(txt);
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
  
  $('textChooseSong').addEvent('change', function(e) {
		e.stop();
		//Get the value of the text input.
		var val = this.get('value');
		oSongListFetchRequest.send({data:{q:val}});
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
        oPanelSliders.show('none');
      }
	});
  
  $('btnChooseSongSearch').addEvent('click', function(e) {
		e.stop();
		//Get the value of the text input.
		var val = $('textChooseSong').get('value');
		oSongListFetchRequest.send({data:{q:val}});
	});
  
  $('btnDeleteSetItem').addEvent('click', function(e) {
		e.stop();
    var li = $(sCurrLiID);
  	oSlideGroups.removeItems(li).destroy();
	});
  
  $('selectChooseSong').addEvent('change', function(e) {
		e.stop();
		//Get the value of the text input.
		var sFile = this.get('value');
		//The code here will execute if the input is empty.
		if (!sFile || sFile == 'null') {
      $('displayChooseSong').empty(); 
		}
    oSongFetchRequest.send({data:{type:'song', file:sFile}});
    $('selectSetChooser').empty();
	});
  
  $('btnNewSong').addEvent('click',  function(e) {
		e.stop();
    oPanelSliders.show('chooseSong');
  });
  
  $('btnNewSetSlide').addEvent('click', function(e){
    e.stop();
    var sName = prompt('Name For New Slides');
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
  });
  
  $('btnSetNew').addEvent('click',  function(e) {
		e.stop();
		var sName = prompt('Name For New Set', getDefaultSetName());
    if(sName == null)
    {
      return;
    }
    oSetNewRequest.send({'data':{name:sName}});
	});
  
//Doing
  oSetListFetchRequest.send();
  oSetFetchRequest.send({data:{file:getDefaultSetName()}});
  oSongListFetchRequest.send();
	oBlanksRequest.send();
});
