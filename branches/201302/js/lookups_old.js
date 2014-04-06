
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

var VideoUpload = function()
{
  console.log("VideoUpload");
  Sexy.addEvent('onShowComplete', function(e) {
      console.log("onShowComplete");
      var aButtons = this.Content.getElements('button');//this.Content.getElements('input');//
      var aSelect = this.Content.getElements('select');
      var eUploadButton = aButtons[0];
      var eSelect = aSelect[0];
      
      console.log("this.Content =", this.Content);
      console.log("eUploadButton =", eUploadButton);
      console.log("eSelect =", eSelect);
      
      eSelect.empty();
      var myEl = new Element('option', {'value':'null', 'text':'Choose One'});
      eSelect.adopt(myEl);
      aFileData.video.each(function(item, index){
          //console.log("item =", item);
        var myEl = new Element('option', {'value':item.file, 'text':item.name});
        eSelect.adopt(myEl);
      });
      
      
      sUploadButtonIdle = eUploadButton.get('html');
      console.log("sUploadButtonIdle =", sUploadButtonIdle);
      UploadButtonUpdate = function() {
        if (!swfUpload.uploading) 
        {
          return;
        }
        var size = Swiff.Uploader.formatUnit(swfUpload.size, 'b');
        eUploadButton.set('html', swfUpload.percentLoaded + '% of ' + size);
      };
    
      swfUpload = new Swiff.Uploader({
        path: 'fancyupload/source/Swiff.Uploader.swf',
        url: 'upload.php?type=video&',
        verbose: true,
        queued: false,
        multiple: false,
        target: eUploadButton,
        instantStart: true,
        //typeFilter: {
        //	'Images (*.mov, *.mp4, *.avi)': '*.mov; *.jpeg; *.mp4; *.avi'
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
          alert('<em>' + files[0].name + '</em> was not added!', 'Please select an image smaller than 2 Mb. (Error: #' + files[0].validationError + ')');
        },
        appendCookieData: true,
        onQueue: UploadButtonUpdate,
        onFileComplete: function(file) {
          console.log("file =", file);
          console.log("file.response.text =", file.response.text);
          // We *don't* save the uploaded images, we only take the md5 value and create a monsterid ;)
          if (file.response.error) {
            Sexy.error('Failed Upload<br />Uploading <em>' + this.fileList[0].name + '</em> failed, please try again. (Error: #' + this.fileList[0].response.code + ' ' + this.fileList[0].response.error + ')');
          } else {
            Sexy.alert('Successful Upload');
          }
          file.remove();
          this.setEnabled(true);
        },
        onComplete: function() {
          eUploadButton.set('html', sUploadButtonIdle);
        }
      });
      
      console.log("onShowStart swfUpload =", swfUpload);
      
      //console.log("aFileData =", aFileData);
        //console.log("onShowStart", this);
      });
  
  Sexy.form($('videoupload').get('html'), {
      onComplete:function(returnvalue) {
        console.log("returnvalue =", returnvalue);
      },
      aFileList:aFileData.video,
      sFileType:'video'
    });
  console.log("Sexy =", Sexy);
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

