var swfUploadFile = function(){};
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
  if(typeOf(oResponse) == 'object')
  {
   if (oResponse.error) {
    Sexy.error('Failed Upload<br />Uploading <em>' + oResponse.name + '</em> failed, please try again. (Error: #' + oResponse.code + ' ' + oResponse.error + ')');
   } else {
    
    var sNewSlideType = $('selectNewSetSlide').get('value');
    var newSG = aBlankNodes[sNewSlideType].cloneNode(true);
    var sName = sNewSlideType;
    newSG.setAttribute('name', sName);
    newSG.setAttribute('title', sName);
    newSG.getElement('body').empty();
    var notesElt = newSG.getElementsByTagName('notes')[0];
    if(notesElt != undefined)
    {
        var sNotes =  notesElt.textContent;
        sNotes = sNotes.replace('[[file]]', oResponse.client_os_file);
    
        notesElt.textContent = sNotes;
    }
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

