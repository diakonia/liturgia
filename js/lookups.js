
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
      $$('.vlc-live').addClass('hidden');
      oVLCRequest.send('vlctest=true');
      
      $$('.vlc-start').addEvent('click', function(){oVLCRequest.send('pos=start');});
      $$('.vlc-end').addEvent('click', function(){oVLCRequest.send('pos=end');});
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

