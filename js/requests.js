/* global Request, CONST_CHOOSEN_CHURCH, aBlankNodes, Sexy, CONST_DEFAULT_BIBLE, oPanelSliders, aFileData, $$, aBibleList */

var oSetFetchRequest = function() {};

//REQUEST OBJECTS
//Gets the set with the blank reading etc in.
var oBlanksRequest = new Request(
{
    url: "fetch.php?church=" + CONST_CHOOSEN_CHURCH + "&type=set&file=blanks",
    onSuccess: function(txt, xml)
    {
        eBlanksDoc = xml.documentElement;
        var sName = '';
        var aBlanks = eBlanksDoc.getElementsByTagName('slide_group');
        Array.each(aBlanks, function(item, index, object)
        {
            var names = item.getAttribute('name').split("||");
            sName = names[0];

            aBlankNodes[sName] = item;
            var myEl = new Element('option',
            {
                'value': sName,
                'text': sName
            });
            $('selectNewSetSlide').adopt(myEl);
        });
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
        Sexy.error('The "Blanks" request failed.');
    }
});

var BibleDataRequest = new Class(
{
    Extends: Request.JSON,
    onSuccess: function(jsonObj)
    {
        if (jsonObj === null)
        {
            Sexy.error('The "Bible Data" request failed.');
            return;
        }
        if (jsonObj.success === false)
        {
            Sexy.error(jsonObj.message);
            return;
        }
        if (typeOf(this.target) === "array")
        {
            var target = this.target;
            target.empty();
            jsonObj[this.reqType].each(function(item, index)
            {
                target.push(item);
            });
        }
        else
        {
            var target = this.target;
            var targetval;

            // if we have no explicitly defined desired target value...
            if (this.targetval === undefined || this.targetval === null)
            {
                // Save the current value
                targetval = optionJsonField(this.target, this.fieldName);
            }
            else
            {
                // else use the explicit value.
                targetval = this.targetval;
            }
            var found = false;
            var fullvalue = null;
            var fieldName = this.fieldName;
            target.empty();
            if (this.reqType !== 'bibles' && this.reqType !== 'verses')
            {
                var myEl = new Element('option',
                {
                    'value': null,
                    'text': ''
                });
                target.adopt(myEl);
            }
            jsonObj[this.reqType].each(function(item, index)
            {
                var value = JSON.stringify(item);
                var myEl = new Element('option',
                {
                    'value': value,
                    'text': item[fieldName]
                });
                myEl.store('data', item);
                if (targetval !== null && targetval !== '' && item[fieldName] === targetval)
                {
                    fullvalue = value;
                    found = true;
                }
                target.adopt(myEl);
            });
            if (found)
                target.value = fullvalue;
        }
        if (this.options.chainTo !== undefined && this.options.chainTo !== null && this.options.chainTo !==
            {})
        {
            this.options.chainTo();
        }
        showThinking(false);
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
        Sexy.error('The "Bible Data" request failed.');
    },

    target: null,
    targetval: null,
    bible: null,
    book: null,
    include: null,
    exclude: null,
    chapter: null,
    verse: null,
    chapter2: null,
    verse2: null,
    reqType: null,
    fieldName: null,

    initialize: function(options, target, targetval, bible, include, exclude, book, chapter, verse, chapter2, verse2)
    {
        var this_options = {
            onSuccess: this.onSuccess,
            onComplete: this.onComplete,
            onFailure: this.onFailure,
            onRequest: this.onRequest,
            method: 'get',
            url: "bibledata.php?church=" + CONST_CHOOSEN_CHURCH
        };

        Object.append(this_options, options);

        this.parent(this_options);

        this.target = target;
        if (targetval !== undefined)
        {
            this.targetval = targetval;
        }
        if (bible !== undefined)
        {
            this.bible = bible;
        }
        if (book !== undefined)
        {
            this.book = book;
        }
        if (include !== undefined)
        {
            this.include = include;
        }
        if (exclude !== undefined)
        {
            this.exclude = exclude;
        }
        if (chapter !== undefined)
        {
            this.chapter = chapter;
        }
        if (verse !== undefined)
        {
            this.verse = verse;
        }
        if (chapter2 !== undefined)
        {
            this.chapter2 = chapter2;
        }
        if (verse2 !== undefined)
        {
            this.verse2 = verse2;
        }
    },

    send: function(target, targetval, bible, include, exclude, book, chapter, verse, chapter2, verse2)
    {
        var url2 = this.options.url;
        
        this.reqType = "bibles";
        this.fieldName = "bibleName";
        if (target !== undefined) this.target = target;
        if (targetval !== undefined) this.targetval = targetval;
        if (bible !== undefined)
        {
            this.bible = bible;
        }
        if (this.bible !== null)
        {
            url2 = url2 + "&bible=" + this.bible;
            this.reqType = "books";
            this.fieldName = "bookName";
        }
        if (book !== undefined)
        {
            this.book = book;
        }
        if (this.book !== null)
        {
            url2 = url2 + "&book=" + this.book;
            this.reqType = "chapters";
            this.fieldName = "chapterNum";
        }
        if (include !== undefined)
        {
            this.include = include;
        }
        if (this.include !== null)
        {
            url2 = url2 + "&include=" + this.include;
        }
        if (exclude !== undefined)
        {
            this.exclude = exclude;
        }
        if (this.exclude !== null)
        {
            url2 = url2 + "&exclude=" + this.exclude;
        }
        if (chapter !== undefined)
        {
            this.chapter = chapter;
        }
        if (this.chapter !== null)
        {
            url2 = url2 + "&chapter=" + this.chapter;
            this.reqType = "verses";
            this.fieldName = "verseNum";
        }
        if (verse !== undefined)
        {
            this.verse = verse;
        }
        if (chapter2 !== undefined)
        {
            this.chapter2 = chapter2;
        }
        if (verse2 !== undefined)
        {
            this.verse2 = verse2;
        }
        if (this.verse !== null && this.chapter2 !== null && this.verse2 !== null)
        {
            url2 = url2 + "&verse=" + this.verse;
            url2 = url2 + "&chapter2=" + this.chapter2;
            url2 = url2 + "&verse2=" + this.verse2;
            this.reqType = "verses_text";
            this.fieldName = null;
        }
        if (this.reqType)
        {
            url2 = url2 + "&type=" + this.reqType;
        }
        this.options.url = url2;

        this.parent();
    }

});

var oBibleDataRequest = new BibleDataRequest(
{}, aBibleList);


var oSetListFetchRequest = new Request.JSON(
{
    method: 'get',
    url: "list.php?church=" + CONST_CHOOSEN_CHURCH + "&type=set",
    onSuccess: function(jsonObj)
    {
        if (jsonObj === null)
        {
            Sexy.error('The "Set List" request failed.');
            return;
        }
        if (jsonObj.success === false)
        {
            Sexy.error(jsonObj.message);
            return;
        }

        $('selectSetChooser').empty();
        var myEl = new Element('option',
        {
            'value': 'null',
            'text': 'Choose One'
        });
        $('selectSetChooser').adopt(myEl);
        jsonObj.setlist.each(function(item, index)
        {
            var myEl = new Element('option',
            {
                'value': item.file,
                'text': item.name
            });
            $('selectSetChooser').adopt(myEl);
        });
        $('selectSetChooser').set('value', getDefaultSetName());
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
        Sexy.error('The "Set List" request failed.');
    }
});

var oSetNewRequest = new Request.JSON(
{
    method: 'get',
    url: "new.php?church=" + CONST_CHOOSEN_CHURCH + "&type=set",
    onSuccess: function(jsonObj)
    {
        if (jsonObj === null)
        {
            Sexy.error('The "New Set" request failed.');
            return;
        }
        if (jsonObj.success === false)
        {
            Sexy.error(jsonObj.message);
            return;
        }

        if (!!(jsonObj.exists))
        {
            Sexy.prompt('<h1>Name in use, please try again.</h1>', jsonObj.exists.name,
            {
                onComplete: function(returnvalue)
                {
                    if (returnvalue)
                    {
                        oSetNewRequest.send(
                        {
                            'data':
                            {
                                name: returnvalue
                            }
                        });
                    }
                }
            });

            return;
        }

        if (!!(jsonObj.newset))
        {
            var myEl = new Element('option',
            {
                'value': jsonObj.newset.file,
                'text': jsonObj.newset.name
            });
            $('selectSetChooser').adopt(myEl);
            $('selectSetChooser').set('value', jsonObj.newset.file);
            oSetFetchRequest.send(
            {
                data:
                {
                    church: CONST_CHOOSEN_CHURCH,
                    type: 'set',
                    file: jsonObj.newset.file
                }
            });
        }
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
        Sexy.error('The "New Set" request failed.');
    }
});

oSetFetchRequest = new Request(
{
    method: 'get',
    url: "fetch.php?church=" + CONST_CHOOSEN_CHURCH + "&type=set",
    onSuccess: function(txt, xml)
    {
        eSetDoc = xml.documentElement;
        var eSGs = $('slidegroups');
        eSGs.empty();
        var mySGs = eSetDoc.getElementsByTagName('slide_group');
        Array.each(mySGs, function(item, index, object)
        {
            item.setAttribute('id', 'sg_' + (index));
            var sName = item.getAttribute('name');
            var sType = item.getAttribute('type');
            addListItem('slidegroups', sName, item, sType);
        });
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
        var sName = getDefaultSetName();
        Sexy.confirm('<h1>The Set Fetch request failed.</h1>Would you like to create ' + sName + ' ?',
        {
            onComplete: function(returnvalue)
            {
                if (returnvalue)
                {
                    oSetNewRequest.send(
                    {
                        'data':
                        {
                            name: sName
                        }
                    });
                }
            }
        });

    }

});


var oSongListFetchRequest = new Request.JSON(
{
    method: 'get',
    url: "list.php?church=" + CONST_CHOOSEN_CHURCH + "&type=song",
    onSuccess: function(jsonObj)
    {
        if (jsonObj === null)
        {
            Sexy.error('The "Song List" request failed.');
            return;
        }
        if (jsonObj.success === false)
        {
            Sexy.error(jsonObj.message);
            return;
        }
        $('selectChooseSong').empty();
        jsonObj.songlist.each(function(item, index)
        {
            var myEl = new Element('option',
            {
                'value': item.file,
                'text': item.name
            });
            $('selectChooseSong').adopt(myEl);
        });
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
        Sexy.error('The "Song List" request failed.');
    }
});



var oSongEditFetchRequest = new Request(
{
    method: 'get',
    url: "fetch.php?church=" + CONST_CHOOSEN_CHURCH + "&type=song",
    onSuccess: function(txt, xml)
    {
        showLyricsFromXML(xml);
        oPanelSliders.show(['editSetSong', 'displaySetSongInfo', 'displaySongLyrics']);
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
        Sexy.error('The "Song Edit" request failed.');
    }
});

var oSongPreviewFetchRequest = new Request(
{
    method: 'get',
    url: "fetch.php?church=" + CONST_CHOOSEN_CHURCH + "&type=song",
    onSuccess: function(txt, xml)
    {
        showLyricsFromXML(xml);
        oPanelSliders.show(['chooseSong', 'displaySetSongInfo', 'displaySongLyrics']);
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
        Sexy.error('The "Song Preview" request failed.');
    }
});


var oNoticesFetchRequest = new Request.JSON(
{
    method: 'post',
    url: "notices.php?church=" + CONST_CHOOSEN_CHURCH,
    onSuccess: function(jsonObj)
    {
        if (jsonObj === null)
        {
            Sexy.error('The "Notices Fetch" request failed.');
            return;
        }
        if (jsonObj.success === false)
        {
            Sexy.error(jsonObj.message);
            return;
        }
        if (jsonObj.sNotices)
        {
            var sText = $('bodySetSlide').get('value');
            sText = sText.replace('[[notices]]', jsonObj.sNotices);
            $('bodySetSlide').set('value', sText);

            var sNotes = $('notesSetSlide').get('value');
            sNotes = sNotes.replace('[[noticessummary]]', jsonObj.sSummary);
            $('notesSetSlide').set('value', sNotes);

            saveSetSlide();
        }
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
        Sexy.error('The "Notices Fetch" request failed.');
    }
});


var oYouTubeFetchRequest = new Request.JSON(
{
    method: 'get',
    url: "youtube.php?church=" + CONST_CHOOSEN_CHURCH,
    onSuccess: function(jsonObj)
    {
        if (jsonObj === null)
        {
            Sexy.error('The "You Tube Video Fetch" request failed.');
            return;
        }
        if (jsonObj.success === false)
        {
            Sexy.error(jsonObj.message);
            return;
        }

        if (jsonObj.name)
        {
            var sText = $('bodySetSlide').get('value');
            $('bodySetSlide').set('value', "");
            var sNotes = $('notesSetSlide').get('value');
            sNotes = sNotes.replace('[[youtubefile]]', jsonObj.client_osong_rel_file);
            sNotes = sNotes.replace('[[youtubetitle]]', jsonObj.title);
            $('notesSetSlide').set('value', sNotes);
            saveSetSlide();
        }
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
        Sexy.error('The "You Tube Video Fetch" request failed.');
    }
});

var oDVDClipRequest = new Request.JSON(
{
    method: 'get',
    url: "dvd.php?church=" + CONST_CHOOSEN_CHURCH,
    onSuccess: function(jsonObj)
    {
        if (jsonObj === null)
        {
            Sexy.error('The "DVD Clip Video Fetch" request failed.');
            return;
        }
        if (jsonObj.success === false)
        {
            Sexy.error(jsonObj.message);
            return;
        }

        if (jsonObj.client_osong_rel_file)
        {
            var sText = $('bodySetSlide').get('value');
            $('bodySetSlide').set('value', "");
            var sNotes = $('notesSetSlide').get('value');
            sNotes = sNotes.replace('[[client_osong_rel_file]]', jsonObj.client_osong_rel_file);
            sNotes = sNotes.replace('[[dvdcliptitle]]', jsonObj.dvdcliptitle);
            sNotes = sNotes.replace('[[dvdclipdesc]]', jsonObj.dvdclipdesc);
            sNotes = sNotes.replace('[[dvdclipinstructions]]', jsonObj.dvdclipinstructions);


            $('notesSetSlide').set('value', sNotes);
            saveSetSlide();
            saveSet();

            var sURL = 'fetch.php?church="+CONST_CHOOSEN_CHURCH+"&type=' + jsonObj.type + '&file=' + jsonObj.file; //Would prefer to use the XHR fuctions but can't work ouit how to use it to calculate the URL
            var delayed = function()
            {
                window.location = sURL;
            }.delay(5000);

        }
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
        Sexy.error('The "DVD Clip Video Fetch" request failed.');
    }
});



var oVideoListFetchRequest = new Request.JSON(
{
    method: 'get',
    url: "list.php?church=" + CONST_CHOOSEN_CHURCH + "&type=video",
    onSuccess: function(jsonObj)
    {
        if (jsonObj === null)
        {
            Sexy.error('The "Video List" request failed.');
            return;
        }

        if (jsonObj.success === false)
        {
            Sexy.error(jsonObj.message);
            return;
        }
        aFileData.video = jsonObj.videolist;

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
        Sexy.error('The "Video List" request failed.');
    }
});


var oPresentationListFetchRequest = new Request.JSON(
{
    method: 'get',
    url: "list.php?church=" + CONST_CHOOSEN_CHURCH + "&type=presentation",
    onSuccess: function(jsonObj)
    {
        if (jsonObj === null)
        {
            Sexy.error('The "Presentation List" request failed.');
            return;
        }
        if (jsonObj.success === false)
        {
            Sexy.error(jsonObj.message);
            return;
        }
        aFileData.presentation = jsonObj.presentationlist;

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
        Sexy.error('The "Presentation List" request failed.');
    }
});


var oVLCRequest = new Request.JSONP(
{
    method: 'get',
    noCache: true,
    url: "http://localhost:8080/requests/statusjs.xml",
    onSuccess: function(jsonObj)
    {
        if (jsonObj === null)
        {
            Sexy.error('The "VLC" request failed.');
            return;
        }
        if (jsonObj.success === false)
        {
            Sexy.error(jsonObj.message);
            return;
        }

        var time = jsonObj.time;

        if (this.options.data === 'vlctest=true')
        {
            $$('.vlc-live').removeClass('hidden');
        }
        else if (this.options.data !== 'pos=end')
        {
            var dvdstartsecs = time % 60;
            $$('.dvdstartsecs').set('value', dvdstartsecs);

            var dvdstartmin = ((time - dvdstartsecs) / 60) % 60;
            $$('.dvdstartmin').set('value', dvdstartmin);

            var dvdstarthours = ((time - (dvdstartsecs + (dvdstartmin * 60))) / 60) / 60;
            $$('.dvdstarthours').set('value', dvdstarthours);

            var dvdchapternumber = jsonObj.input.chapter.value;
            $$('.dvdchapternumber').set('value', dvdchapternumber);

            var dvdtitlenumber = jsonObj.input.title.value;
            $$('.dvdtitlenumber').set('value', dvdtitlenumber);

            var dvdtitle = jsonObj.information['meta-information'].title;

            //var patt=new RegExp("dvd://[D-Z]");
            //dvdtitle = dvdtitle.replace(patt, "");

            $$('.dvdtitle').set('value', dvdtitle);
        }
        else
        {
            var dvdendsecs = time % 60;
            $$('.dvdendsecs').set('value', dvdendsecs);

            var dvdendmin = ((time - dvdendsecs) / 60) % 60;
            $$('.dvdendmin').set('value', dvdendmin);

            var dvdendhours = ((time - (dvdendsecs + (dvdendmin * 60))) / 60) / 60;
            $$('.dvdendhours').set('value', dvdendhours);
        }
    },
    onRequest: function()
    {
        if (this.options.data !== 'vlctest=true')
        {
            showThinking(true);
        }
    },
    onComplete: function()
    {
        if (this.options.data !== 'vlctest=true')
        {
            showThinking(false);
        }
    },
    onFailure: function()
    {
        if (this.options.data !== 'vlctest=true')
        {
            Sexy.error('The "VLC" request failed.');
            //console.log( 'The "VLC" request failed.');
        }
    }
});