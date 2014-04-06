
  var getDefaultSetName = function()
  {
    var oDate = new Date();
    var iHour = oDate.getHours();
    oDate.setDate(oDate.getDate() + (7 - ((oDate.getDay() !== 0)?(oDate.getDay()):(oDate.getHours()<CONST_SundayCutOff?7:0))));
    var sNextSunday = oDate.getFullYear() +'-'+PadDigits(1+oDate.getMonth(), 2)+'-'+PadDigits(oDate.getDate(), 2) + '-Morning';
    return sNextSunday;
  };
  


  var showLyricsFromXML = function(sXML)
  {
    eSongDoc = $(sXML);
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
		
		var serializer = new XMLSerializer();
		var xString = serializer.serializeToString(eSetDoc);
		
		rNS = new RegExp('xmlns="http://www\\.w3\\.org/1999/xhtml"','g');
		xString = xString.replace(rNS, '');

		//console.log("getSetXML xString =", xString);
		xmlString = vkbeautify.xml(xString, 2);
		//console.log("getSetXML xmlString =", xmlString);
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
    oSetSaveRequest.send({data:{church:CONST_CHOOSEN_CHURCH, 'xml':xmlString, file:sFilePath}});
  };
  
 
  var saveSetSlide = function(options)
  {
    
    var aText = $('bodySetSlide').get('value').split('\n---\n');
    //var li = $(sCurrLiID);
    var li = $($('slidegroups').retrieve('sCurrLiID'));
    var xNode = li.retrieve('xmlnode');
    
    if(typeof options !== 'undefined')
    {
      var hOptions = new Hash(options);
      hOptions.each(function(item, index){
        xNode.setAttribute(index, (item));
      }); 
    }
    
    xNode.getElement('notes').set('text', $('notesSetSlide').get('value'));
    xNode.getElement('title').set('text', $('titleSetSlide').get('value'));
    xNode.setAttribute('name', $('nameSetSlide').get('value'));
    //console.log("xNode =", xNode);
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
  
