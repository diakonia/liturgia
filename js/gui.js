
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
  //oSongEditFetchRequest.send({data:{church:CONST_CHOOSEN_CHURCH, type:'song', file:sFile}});
  oSongEditFetchRequest.send({data:{church:CONST_CHOOSEN_CHURCH, file:sFile}});
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
    if(sType == 'custom' || sType == 'external')
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
    oSetFetchRequest.send({data:{church:CONST_CHOOSEN_CHURCH, file:sFile}});
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


$('btnSongsPrint').addEvent('click', function(e) {
  e.stop();
  //Get the value of the text input.
  var sFile = $('selectSetChooser').get('value');
  //The code here will execute if the input is empty.
  var sURL = 'printhtml.php?type=set&file='+sFile; //Would prefer to use the XHR fuctions but can't work ouit how to use it to calculate the URL
  //console.log("sURL =", sURL);
  window.open(sURL);
  return false;
});

$('textChooseSong').addEvent('change', function(e) {
  e.stop();
  //Get the value of the text input.
  var val = this.get('value');
  oSongListFetchRequest.send({data:{church:CONST_CHOOSEN_CHURCH, q:val}});
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
  oSongListFetchRequest.send({data:{church:CONST_CHOOSEN_CHURCH, q:val, s:sType}});
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
  //oSongPreviewFetchRequest.send({data:{church:CONST_CHOOSEN_CHURCH, type:'song', file:sFile}});
  oSongPreviewFetchRequest.send({data:{church:CONST_CHOOSEN_CHURCH, file:sFile}});
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

