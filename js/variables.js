//Variables  
var eBlanksDoc = null;
var aBlankNodes = {};
var eSetDoc = null;
var bDirty = false;
var eSongDoc = null;
//var sCurrLiID = '';
var aBibleData = {};
var aFileData = {
    video:
    {},
    presentation:
    {},
    image:
    {}
};
var iThinking = 0;
var sUploadButtonIdle = null;
var UploadButtonUpdate = function() {};

var myXMLDoc = (new DOMParser()).parseFromString('<?xml version="1.0" encoding="UTF-8"?><dummy />', "text/xml");