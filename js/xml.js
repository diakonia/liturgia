var getDefaultSetName = function()
{
    var oDate = new Date();
    var iHour = oDate.getHours();
    oDate.setDate(oDate.getDate() + (7 - ((oDate.getDay() !== 0) ? (oDate.getDay()) : (oDate.getHours() < CONST_SundayCutOff ? 7 : 0))));
    var sNextSunday = oDate.getFullYear() + '-' + PadDigits(1 + oDate.getMonth(), 2) + '-' + PadDigits(oDate.getDate(), 2) + '-Morning';
    return sNextSunday;
};



var showLyricsFromXML = function(sXML)
{
    eSongDoc = sXML.documentElement;
    $('displaySongLyrics').empty();
    var sLyrics = eSongDoc.getElementsByTagName('lyrics')[0].get('text').replace(/\n/g, '<br />');
    var sTitle = eSongDoc.getElementsByTagName('title')[0].get('text');
    $('displaySongTitle').set('html', sTitle);
    $('displaySongLyrics').set('html', sLyrics);

    var sSource = null;
    var eUser1 = eSongDoc.getElementsByTagName('user1')[0];
    if (eUser1)
    {
        sSource = eUser1.textContent;
    }
    if (!sSource)
    {
        if (eSongDoc.getElementsByTagName('hymnNumber')[0] != undefined)
        {
            sSource = eSongDoc.getElementsByTagName('hymnNumber')[0].textContent;
        }
    }
    if (!sSource)
    {
        if (eSongDoc.getElementsByTagName('hymn_number')[0] != undefined)
        {
            sSource = eSongDoc.getElementsByTagName('hymn_number')[0].textContent;
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
    $('displaySongAuthor').set('html', eSongDoc.getElementsByTagName('author')[0].textContent);
    $('displaySongCopyright').set('html', eSongDoc.getElementsByTagName('copyright')[0].textContent);

    //var sPath = eSongDoc.getElement('').get('text');
    //$('displaySongPath').set('html', sPath);

};

//XML / Data Stuff



var getSetXML = function()
{
    var eSGsOld = eSetDoc.getElementsByTagName('slide_groups')[0];
    var eSGsNew = myXMLDoc.createElement('slide_groups')


    var items = $('slidegroups').childNodes;

    for (var i = 0; i < items.length; i++)
    {
        var item = items[i];
        eSGsNew.appendChild(item.retrieve('xmlnode').cloneNode(true));
    }
    eSetDoc.replaceChild(eSGsNew, eSGsOld);

    var serializer = new XMLSerializer();
    var xString = serializer.serializeToString(eSetDoc);

    var rNS = new RegExp('xmlns="http://www\\.w3\\.org/1999/xhtml"', 'g');
    xString = xString.replace(rNS, '');

    //console.log("getSetXML xString =", xString);
    var xmlString = vkbeautify.xml(xString, 2);
    //console.log("getSetXML xmlString =", xmlString);
    return xmlString;
};



var dirtyCheckStop = function()
{
    if (bDirty)
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
    var oSetSaveRequest = new Request.JSON(
    {
        method: 'post',
        url: "save.php?type=set",
        onSuccess: function(jsonObj)
        {
            if (jsonObj === null)
            {
                Sexy.error('The "Save" request failed.');
                return;
            }
            if (jsonObj.success === false)
            {
                Sexy.error(jsonObj.message);
                return;
            }
            Sexy.info(jsonObj.txt);
            setDirty(false);
        },
        onRequest: function()
        {
            showThinking(true);
        },
        onComplete: function()
        {
            showThinking(false);
        },
        onFailure: function()
        {
            Sexy.error('The "Save Set" request failed.');
        }
    });

    var sFilePath = $('selectSetChooser').get('value');
    oSetSaveRequest.send(
    {
        data:
        {
            church: CONST_CHOOSEN_CHURCH,
            'xml': xmlString,
            file: sFilePath
        }
    });
};


var saveSetSlide = function(options)
{

    var aText = $('bodySetSlide').get('value').split('\n---\n');
    //var li = $(sCurrLiID);
    var li = $($('slidegroups').retrieve('sCurrLiID'));
    var xNode = li.retrieve('xmlnode');

    if (typeof options !== 'undefined')
    {
        var hOptions = new Hash(options);
        hOptions.each(function(item, index)
        {
            xNode.setAttribute(index, (item));
        });
    }

    xNode.getElementsByTagName('notes')[0].textContent = $('notesSetSlide').get('value');
    xNode.getElementsByTagName('title')[0].textContent = $('titleSetSlide').get('value');
    xNode.setAttribute('name', $('nameSetSlide').get('value'));
    //console.log("xNode =", xNode);
    var eSlidesOld = xNode.getElementsByTagName('slides')[0];
    var eSlidesNew = myXMLDoc.createElement('slides');

    aText.each(function(item, index)
    {
        var mySlide = myXMLDoc.createElement('slide');
        var myBody = myXMLDoc.createElement('body');
        myBody.textContent = item;
        mySlide.appendChild(myBody);
        eSlidesNew.appendChild(mySlide);
    });
    xNode.replaceChild(eSlidesNew, eSlidesOld);
    li.store('xmlnode', xNode);
    setDirty();
};