
var noticesLookup = function()
{
  oNoticesFetchRequest.send();
};

var readingLookup = function()
{
    oSexyAlertForm.form($('readinglookup').get('html'), {
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


var getRecordFromList = function(aList, sField, xValue)
{
  //console.log('getRecordFromList  aList=',aList,'  sField=',sField,'  xValue=',xValue,')');

  for(var j=0; j < aList.length; j++)
  {
    if(aList[j][sField] == xValue)
    {
      return new Hash(aList[j]);
    }
  }
  return false;
};
  
var getNodeChanges = function(sLiID, oFile)
{
           
           var li = $($('slidegroups').retrieve(sLiID));
           var xNode = li.retrieve('xmlnode');
           var attributes = xNode.attributes;
           var outputs ={};
           for(var i=0; i<attributes.length; i++)
           {
             sCurAttribute = attributes[i].nodeValue;
             oFile.each(function(item, index){
               sCurAttribute = sCurAttribute.replace('[['+index+']]', item);
             });             
             xNode.set(attributes[i].name, sCurAttribute);
             //sNotes = sNotes.replace('[[file]]', returnvalue.existingfile);
             outputs[attributes[i].name] = sCurAttribute;
           }
           
           //console.log("outputs =", outputs);
           return outputs;
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
         var myEl = new Element('option', {'value':item.file, 'text':item.name});
         eSelect.adopt(myEl);
       });
      });
  
  oSexyAlertForm.form($('videolookup').get('html'), {
      onComplete:function(returnvalue) {
         if(returnvalue)
         {
           var sText = $('bodySetSlide').get('value');
           var sNotes = $('notesSetSlide').get('value');
           
           var oFile = getRecordFromList(aFileData.video, 'file', returnvalue.existingfile);
           
           oFile.each(function(item, index){
               sNotes = sNotes.replace('[['+index+']]', item);
               sText = sText.replace('[['+index+']]', item);
           });     
           
           $('bodySetSlide').set('value', '');
           $('notesSetSlide').set('value', sNotes);
           
           var outputs = getNodeChanges('sCurrLiID', oFile);
           saveSetSlide(outputs);
         }
        
      },
      aFileList:aFileData.video,
      sFileType:'video'
    });
};


var DVDClipLookup = function()
{
  Sexy.addEvent('onShowComplete', function(e) {
      $$('.vlc-live').addClass('hidden');
      oVLCRequest.send('vlctest=true');
      
      $$('.vlc-start').addEvent('click', function(){oVLCRequest.send('pos=start');});
      $$('.vlc-end').addEvent('click', function(){oVLCRequest.send('pos=end');});
    });
  
  oSexyAlertForm.form($('dvdcliplookup').get('html'), {
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
         var myEl = new Element('option', {'value':item.file, 'text':item.name});
         eSelect.adopt(myEl);
       });
      });
  
  oSexyAlertForm.form($('presentationlookup').get('html'), {
      onComplete:function(returnvalue) {
         if(returnvalue)
         {
           var sText = $('bodySetSlide').get('value');
           var sNotes = $('notesSetSlide').get('value');
           
           var oFile = getRecordFromList(aFileData.presentation, 'file', returnvalue.existingfile);
           
           oFile.each(function(item, index){
               sNotes = sNotes.replace('[['+index+']]', item);
               sText = sText.replace('[['+index+']]', item);
           });     
           
           $('bodySetSlide').set('value', '');
           $('notesSetSlide').set('value', sNotes);
           
           var outputs = getNodeChanges('sCurrLiID', oFile);
           saveSetSlide(outputs);
         }
        
      },
      aFileList:aFileData.presentation,
      sFileType:'presentation'
    });
};

var YouTubeLookup = function()
{
  oSexyAlertForm.form($('youtubelookup1').get('html'), {
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

