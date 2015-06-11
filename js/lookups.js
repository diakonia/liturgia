/* global oNoticesFetchRequest, oVLCRequest, oDVDClipRequest */
/* global oYouTubeFetchRequest */
/* global aBibleData, aFileData, aBibleList, aBlankNodes */
/* global oSexyAlertForm, $$ */
/* global CONST_DEFAULT_BIBLE, CONST_READING_VERSES_PER_SLIDE */
/* global CONST_READING_FORMAT, CONST_READING_CHARS_PER_SLIDE */
/* global CONST_READING_ACCLAMATION, CONST_READING_TEXT, CONST_DEFAULT_BIBLE */

var noticesLookup = function()
{
    oNoticesFetchRequest.send();
};

var readingLookup = function(ltype, ldata)
{
    var aVersesText = [];

    var formatReadingText = function(format, maxCharsPerSlide, versesPerSlide)
    {
        var sAll = "";
        var s = "";
        var ccount = 0;
        var vcount = 0;
        Array.each(aVersesText, function(item, index)
        {
            if (index === 0)
            {
                sAll = item.verseText;
                vcount = 1;
                ccount = sAll.length;
            }
            else
            {
                if (format === "Verse")
                {
                    s = "\n" + item.verseText;
                }
                else
                {
                    s = " " + item.verseText;
                }
                vcount++;
                ccount += s.length;
                if (ccount > maxCharsPerSlide || vcount > versesPerSlide)
                {
                    sAll += "\n---\n";
                    sAll += item.verseText;
                    vcount = 1;
                    ccount = item.verseText.length;
                }
                else
                    sAll += s;
            }
        });
        return sAll;
    };

    var popupForm = new SexyAlertForm(
    {
        onShowComplete: function()
        {
            var eSelectBible = this.Content.getElement('select[name=bible_select]');
            var eSelectBook = this.Content.getElement('select[name=book_select]');
            var eSelectChapter = this.Content.getElement('select[name=chapter_select]');
            var eSelectVerse = this.Content.getElement('select[name=verse_select]');
            var eSelectChapter2 = this.Content.getElement('select[name=chapter2_select]');
            var eSelectVerse2 = this.Content.getElement('select[name=verse2_select]');
            var eCheckText = this.Content.getElement('input[name=include_text]');
            var eCheckAcclamation = this.Content.getElement('input[name=include_acclamation]');
            var eReader = this.Content.getElement('input[name=reader]');
            var eSelectFormat = this.Content.getElement('select[name=format]');
            var eSelectVersesPerSlide = this.Content.getElement('select[name=verses_per_slide]');
            var eInputMaxCharsPerSlide = this.Content.getElement('input[name=max_chars_per_slide]');
            var eTextAreaTextPreview = this.Content.getElement('textarea[id=text_preview]');
            var aFormatRows = this.Content.getElements('.format_row');
            var include = this.options.include;
            var exclude = this.options.exclude;
            aVersesText = [];

            var renderVersesText = function()
            {
                eTextAreaTextPreview.value = formatReadingText(eSelectFormat.value, eInputMaxCharsPerSlide.value, eSelectVersesPerSlide.value);
            };

            var loadVersesText = function()
            {
                var bible = eSelectBible.value;
                var bookName = optionJsonField(eSelectBook, 'bookName');
                var chapterNum = optionJsonField(eSelectChapter, 'chapterNum');
                var verseNum = optionJsonField(eSelectVerse, 'verseNum');
                var chapter2Num = optionJsonField(eSelectChapter2, 'chapterNum');
                var verse2Num = optionJsonField(eSelectVerse2, 'verseNum');

                if (bible !== undefined && bible !== null && bible !== '' &&
                    bookName !== undefined && bookName !== null && bookName !== '' &&
                    chapterNum !== undefined && chapterNum !== null && chapterNum !== '' &&
                    verseNum !== undefined && verseNum !== null && verseNum !== '' &&
                    chapter2Num !== undefined && chapter2Num !== null && chapter2Num !== '' &&
                    verse2Num !== undefined && verse2Num !== null && verse2Num !== '')
                {
                    new BibleDataRequest(
                    {
                        'chainTo': renderVersesText
                    }, aVersesText, null, bible, include, exclude, bookName, chapterNum, verseNum, chapter2Num, verse2Num).send();
                }
                else
                {
                    aVersesText.empty();
                    eTextAreaTextPreview.value = '';
                }
            };

            var loadVerse2s = function(setValues)
            {
                var bible = eSelectBible.value;
                var bookName = optionJsonField(eSelectBook, 'bookName');
                var chapterNum = optionJsonField(eSelectChapter, 'chapterNum');
                var verseNum = optionJsonField(eSelectVerse, 'verseNum');
                var chapter2Num = optionJsonField(eSelectChapter2, 'chapterNum');

                if (bible !== undefined && bible !== null && bible !== '' &&
                    bookName !== undefined && bookName !== null && bookName !== '' &&
                    chapterNum !== undefined && chapterNum !== null && chapterNum !== '' &&
                    verseNum !== undefined && verseNum !== null && verseNum !== '' &&
                    chapter2Num !== undefined && chapter2Num !== null && chapter2Num !== '')
                {

                    var targetVerse2Num = formDataJsonField(setValues, 'verse2_select', 'verseNum');
                    if (undefined === targetVerse2Num)
                    {
                        targetVerse2Num = optionJsonField(eSelectVerse2, 'verseNum');
                    }

                    if (chapterNum === chapter2Num)
                    {
                        eSelectVerse2.empty();
                        var found = false;
                        var fullvalue = null;

                        if (verseNum !== undefined && verseNum !== null && verseNum !== '')
                        {
                            eSelectVerse.getChildren().each(function(item, key, obj)
                            {
                                if (optionJsonField(item, 'verseNum') >= verseNum)
                                {
                                    eSelectVerse2.adopt(item.clone());
                                    if (undefined !== targetVerse2Num && null !== targetVerse2Num && optionJsonField(item, 'verseNum') === targetVerse2Num)
                                    {
                                        found = true;
                                        fullvalue = item.value;
                                    }
                                }
                            });
                            if (found)
                                eSelectVerse2.value = fullvalue;
                        }
                        loadVersesText();
                    }
                    else
                    {
                        new BibleDataRequest(
                        {
                            chainTo: loadVersesText
                        }, eSelectVerse2, targetVerse2Num, bible, include, exclude, bookName, chapter2Num).send();
                    }
                }
                else
                {
                    eSelectVerse2.empty();
                    aVersesText.empty();
                    eTextAreaTextPreview.value = '';
                }
            };

            var loadVerses = function(setValues)
            {
                var bible = eSelectBible.value;
                var bookName = optionJsonField(eSelectBook, 'bookName');
                var chapterNum = optionJsonField(eSelectChapter, 'chapterNum');

                if (bible !== undefined && bible !== null && bible !== '' &&
                    bookName !== undefined && bookName !== null && bookName !== '' &&
                    chapterNum !== undefined && chapterNum !== null && chapterNum !== '')
                {

                    var targetVerseNum = formDataJsonField(setValues, 'verse_select', 'verseNum');
                    if (undefined === targetVerseNum)
                    {
                        targetVerseNum = optionJsonField(eSelectVerse, 'verseNum');
                    }


                    new BibleDataRequest(
                    {
                        'chainTo': function()
                        {
                            loadChapter2s(setValues);
                        }
                    }, eSelectVerse, targetVerseNum, bible, include, exclude, bookName, chapterNum).send();
                }
                else
                {
                    eSelectVerse.empty();
                    if (eSelectChapter.value === "")
                        eSelectChapter2.empty();
                    eSelectVerse2.empty();
                    aVersesText.empty();
                    eTextAreaTextPreview.value = '';
                }
            };

            var loadChapter2s = function(setValues)
            {

                var bible = eSelectBible.value;
                var bookName = optionJsonField(eSelectBook, 'bookName');
                var chapterNum = optionJsonField(eSelectChapter, 'chapterNum');

                if (bible !== undefined && bible !== null && bible !== '' &&
                    bookName !== undefined && bookName !== null && bookName !== '' &&
                    chapterNum !== undefined && chapterNum !== null && chapterNum !== '')
                {

                    var targetChapter2Num = formDataJsonField(setValues, 'chapter2_select', 'chapterNum');
                    if (undefined === targetChapter2Num)
                    {
                        targetChapter2Num = optionJsonField(eSelectChapter2, 'chapterNum');
                    }

                    eSelectChapter2.empty();
                    var found = false;
                    var fullvalue = null;

                    eSelectChapter.getChildren().each(function(item, key, obj)
                    {
                        if (optionJsonField(item, 'chapterNum') >= chapterNum)
                        {
                            eSelectChapter2.adopt(item.clone());
                            if (targetChapter2Num !== undefined && targetChapter2Num !== null && targetChapter2Num !== '' &&
                                optionJsonField(item, 'chapterNum') === targetChapter2Num)
                            {
                                found = true;
                                fullvalue = item.value;
                            }
                        }
                    });
                    if (found)
                        eSelectChapter2.value = fullvalue;
                    loadVerse2s(setValues);
                }
                else
                {
                    eSelectChapter2.empty();
                    eSelectVerse2.empty();
                    aVersesText.empty();
                    eTextAreaTextPreview.value = '';
                }
            };

            var loadChapters = function(setValues)
            {
                var bible = eSelectBible.value;
                var bookName = optionJsonField(eSelectBook, 'bookName');

                if (bible !== undefined && bible !== null && bible !== '' &&
                    bookName !== undefined && bookName !== null && bookName !== '')
                {
                    var targetChapterNum = formDataJsonField(setValues, 'chapter_select', 'chapterNum');
                    if (undefined === targetChapterNum)
                    {
                        targetChapterNum = optionJsonField(eSelectChapter, 'chapterNum');
                    }

                    new BibleDataRequest(
                    {
                        'chainTo': function()
                        {
                            loadVerses(setValues);
                        }
                    }, eSelectChapter, targetChapterNum, bible, include, exclude, bookName).send();
                }
                else
                {
                    eSelectChapter.empty();
                    eSelectChapter2.empty();
                    eSelectVerse2.empty();
                    eSelectVerse.empty();
                    aVersesText.empty();
                    eTextAreaTextPreview.value = '';
                }
            };

            var loadBooks = function(setValues)
            {
                var bible = eSelectBible.value;
                if (bible !== undefined && bible !== null && bible !== '')
                {
                    var targetBookName = formDataJsonField(setValues, 'book_select', 'bookName');
                    if (undefined === targetBookName)
                    {
                        targetBookName = optionJsonField(eSelectBook, 'bookName');;
                    }

                    new BibleDataRequest(
                    {
                        chainTo: function()
                        {
                            loadChapters(setValues);
                        }
                    }, eSelectBook, targetBookName, bible, include, exclude).send();
                }
                else
                {
                    eSelectBook.empty();
                    eSelectChapter.empty();
                    eSelectChapter2.empty();
                    eSelectVerse2.empty();
                    eSelectVerse.empty();
                    aVersesText.empty();
                    eTextAreaTextPreview.value = '';
                }
            };

            var loadBibles = function(setValues)
            {
                var targetBible = safeGet(setValues, 'bible_select');

                if (undefined === targetBible)
                {
                    targetBible = eSelectBible.value;
                }

                eSelectBible.empty();
                var firstBible = null;
                var found = false;

                aBibleList.each(function(item, index)
                {
                    if (index === 0)
                        firstBible = item.bibleName;
                    if (undefined !== targetBible && null !== targetBible && '' !== targetBible && item.bibleName === targetBible)
                    {
                        found = true;
                    }
                    var myEl = new Element('option',
                    {
                        'value': item.bibleName,
                        'text': item.bibleName
                    });
                    eSelectBible.adopt(myEl);
                });
                if (undefined !== targetBible && null !== targetBible && '' !== targetBible)
                {
                    if (targetBible === '*first*')
                    {
                        if (undefined !== firstBible && null !== firstBible && '' !== firstBible)
                            eSelectBible.value = firstBible;
                    }
                    else if (found)
                    {
                        eSelectBible.value = targetBible;
                    }
                }
                loadBooks(setValues);
            };

            if (ldata === undefined || ldata === null || ldata === '')
            {
                eCheckText.checked = CONST_READING_TEXT;
                eCheckAcclamation.checked = CONST_READING_ACCLAMATION;
                eInputMaxCharsPerSlide.value = CONST_READING_CHARS_PER_SLIDE;
                eSelectFormat.value = CONST_READING_FORMAT;
                eSelectVersesPerSlide.value = CONST_READING_VERSES_PER_SLIDE;
                loadBibles(
                {
                    bible_select: CONST_DEFAULT_BIBLE
                });
            }
            else
            {
                var oData = JSON.parse(ldata);
                eCheckText.checked = oData.include_text;
                eCheckAcclamation.checked = oData.include_acclamation;
                eReader.value = oData.reader;
                eInputMaxCharsPerSlide.value = oData.max_chars_per_slide;
                eSelectFormat.value = oData.format;
                eSelectVersesPerSlide.value = oData.verses_per_slide;
                loadBibles(oData);
            }
            Array.each(aFormatRows, function(item)
            {
                item.hidden = !eCheckText.checked;
            });

            eSelectBible.addEvent('change', function(e)
            {
                loadBooks();
            });
            eSelectBook.addEvent('change', function(e)
            {
                loadChapters();
            });
            eSelectChapter.addEvent('change', function(e)
            {
                loadVerses();
            });
            eSelectChapter2.addEvent('change', function(e)
            {
                loadVerse2s();
            });
            eSelectVerse.addEvent('change', function(e)
            {
                loadChapter2s();
            });
            eSelectVerse2.addEvent('change', function(e)
            {
                loadVersesText();
            });
            eCheckText.addEvent('change', function()
            {
                Array.each(aFormatRows, function(item)
                {
                    item.hidden = !eCheckText.checked;
                });
            });
            eSelectFormat.addEvent('change', renderVersesText);
            eSelectVersesPerSlide.addEvent('change', renderVersesText);
            eInputMaxCharsPerSlide.addEvent('change', renderVersesText);
        }
    });

    switch (ltype)
    {
        case 'P':
            popupForm.options.include = "OT/Ps";
            popupForm.options.exclude = "";
            break;
        case 'O':
            popupForm.options.include = "";
            popupForm.options.exclude = "NT/G";
            break;
        case 'G':
            popupForm.options.include = "NT/G";
            popupForm.options.exclude = "";
            break;
    }
    popupForm.options.ltype = ltype;

    popupForm.form($('readinglookup').get('html'),
    {
        onComplete: function(returnvalue)
        {
            if (returnvalue)
            {
                var ltype = this.ltype;
                var templateSlideNode = null;

                Object.each(aBlankNodes, function(item, index, object)
                {
                    if (item.getAttribute('ltype') === ltype)
                        templateSlideNode = item;
                });

                var returnvalueex = Object.clone(returnvalue);

                var ltypes = [];

                if (returnvalue.include_acclamation)
                {
                    ltypes.push('acclamation');
                }

                if (returnvalue.include_text)
                {
                    ltypes.push('text');
                    returnvalueex.text = formatReadingText(
                        returnvalue.format, returnvalue.max_chars_per_slide, returnvalue.verses_per_slide
                    );
                }
                var sText = getSlideText(templateSlideNode, ltypes);
                var sNotes = templateSlideNode.getElementsByTagName('notes')[0].textContent;
                var sName = templateSlideNode.getElementsByTagName('title')[0].textContent;
                var sTitle = templateSlideNode.getAttribute('name');

                var oVerse = JSON.parse(returnvalue.verse_select);
                var oVerse2 = JSON.parse(returnvalue.verse2_select);
                var oChapter = JSON.parse(returnvalue.chapter_select);
                var oChapter2 = JSON.parse(returnvalue.chapter2_select);
                var oBook = JSON.parse(returnvalue.book_select);

                returnvalueex.bible = returnvalue.bible_select;
                returnvalueex.book = oBook.bookName;
                returnvalueex.chapter = oChapter.chapterNum;
                returnvalueex.chapter2 = oChapter2.chapterNum;
                returnvalueex.verse = oVerse.verseNum;
                returnvalueex.verse2 = oVerse2.verseNum;

                if (oVerse.pageNum === undefined || oVerse.pageNum === null || oVerse.pageNum === '')
                {

                    sText = sText.replace(/\{\{page\}\}.*\{\{\/page\}\}/mg, '');
                    sNotes = sNotes.replace(/\{\{page\}\}.*\{\{\/page\}\}/mg, '');
                    sName = sName.replace(/\{\{page\}\}.*\{\{\/page\}\}/mg, '');
                    sTitle = sTitle.replace(/\{\{page\}\}.*\{\{\/page\}\}/mg, '');
                }
                else
                {
                    sText = sText.replace(/\{\{\/?page\}\}/g, '');
                    sNotes = sNotes.replace(/\{\{\/?page\}\}/g, '');
                    sName = sName.replace(/\{\{\/?page\}\}/g, '');
                    sTitle = sTitle.replace(/\{\{\/?page\}\}/g, '');
                    returnvalueex.page = oVerse.pageNum;
                }

                var shortBook = oBook.chapterCount === 1;
                var reference = "";

                if (shortBook)
                {
                    reference = "" + oVerse.verseNum;
                    if (oVerse.verseNum !== oVerse2.verseNum)
                        reference = reference + "-" + oVerse2.verseNum;
                }
                else
                {
                    reference = oChapter.chapterNum + ":" + oVerse.verseNum;

                    if (oChapter.chapterNum === oChapter2.chapterNum)
                    {
                        if (oVerse.verseNum !== oVerse2.verseNum)
                            reference = reference + "-" + oVerse2.verseNum;
                    }
                    else
                    {
                        reference = reference + "-" + oChapter2.chapterNum + ":" + oVerse2.verseNum;
                    }
                }
                returnvalueex.reference = reference;

                Object.each(returnvalueex, function(xFieldValue, sFieldName)
                {
                    sText = sText.replace('[[' + sFieldName + ']]', xFieldValue);
                    sNotes = sNotes.replace('[[' + sFieldName + ']]', xFieldValue);
                    sName = sName.replace('[[' + sFieldName + ']]', xFieldValue);
                    sTitle = sTitle.replace('[[' + sFieldName + ']]', xFieldValue);
                });
                $('bodySetSlide').set('value', sText);
                $('notesSetSlide').set('value', sNotes);
                $('nameSetSlide').set('value', sName);
                $('titleSetSlide').set('value', sTitle);
                saveSetSlide(
                {
                    'ldata': JSON.stringify(returnvalue)
                });
            }
        }
    });

};


var getRecordFromList = function(aList, sField, xValue)
{
    //console.log('getRecordFromList  aList=',aList,'  sField=',sField,'  xValue=',xValue,')');

    for (var j = 0; j < aList.length; j++)
    {
        if (aList[j][sField] === xValue)
        {
            return new Object(aList[j]);
        }
    }
    return false;
};

var getNodeChanges = function(sLiID, oFile)
{

    var li = $($('slidegroups').retrieve(sLiID));
    var xNode = li.retrieve('xmlnode');
    var attributes = xNode.attributes;
    var outputs = {};
    for (var i = 0; i < attributes.length; i++)
    {
        var sCurAttribute = attributes[i].nodeValue;
        oFile.each(function(item, index)
        {
            sCurAttribute = sCurAttribute.replace('[[' + index + ']]', item);
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
    oSexyAlertForm.addEvent('onShowComplete', function(e)
    {
        var eSelect = this.Content.getElement('select[name=existingfile]');

        eSelect.empty();
        var myEl = new Element('option',
        {
            'value': 'null',
            'text': 'Choose One'
        });
        eSelect.adopt(myEl);
        aFileData.video.each(function(item, index)
        {
            var myEl = new Element('option',
            {
                'value': item.file,
                'text': item.name
            });
            eSelect.adopt(myEl);
        });
    });

    oSexyAlertForm.form($('videolookup').get('html'),
    {
        onComplete: function(returnvalue)
        {
            if (returnvalue)
            {
                var sText = $('bodySetSlide').value;
                var sNotes = $('notesSetSlide').value;

                var oFile = getRecordFromList(aFileData.video, 'file', returnvalue.existingfile);

                oFile.each(function(item, index)
                {
                    sNotes = sNotes.replace('[[' + index + ']]', item);
                    sText = sText.replace('[[' + index + ']]', item);
                });

                $('bodySetSlide').set('value', '');
                $('notesSetSlide').set('value', sNotes);

                var outputs = getNodeChanges('sCurrLiID', oFile);
                saveSetSlide(outputs);
            }

        },
        aFileList: aFileData.video,
        sFileType: 'video'
    });
};


var DVDClipLookup = function()
{
    oSexyAlertForm.addEvent('onShowComplete', function(e)
    {
        $$('.vlc-live').addClass('hidden');
        oVLCRequest.send('vlctest=true');

        $$('.vlc-start').addEvent('click', function()
        {
            oVLCRequest.send('pos=start');
        });
        $$('.vlc-end').addEvent('click', function()
        {
            oVLCRequest.send('pos=end');
        });
    });

    oSexyAlertForm.form($('dvdcliplookup').get('html'),
    {
        onComplete: function(returnvalue)
        {
            if (returnvalue)
            {
                returnvalue = new Object(returnvalue);
                oDVDClipRequest.send(
                {
                    data: returnvalue
                });
            }
        }
    });
};



var PresentationLookup = function()
{
    oSexyAlertForm.addEvent('onShowComplete', function(e)
    {
        var eSelect = this.Content.getElement('select[name=existingfile]');

        eSelect.empty();
        var myEl = new Element('option',
        {
            'value': 'null',
            'text': 'Choose One'
        });
        eSelect.adopt(myEl);
        aFileData.presentation.each(function(item, index)
        {
            var myEl = new Element('option',
            {
                'value': item.file,
                'text': item.name
            });
            eSelect.adopt(myEl);
        });
    });

    oSexyAlertForm.form($('presentationlookup').get('html'),
    {
        onComplete: function(returnvalue)
        {
            if (returnvalue)
            {
                var sText = $('bodySetSlide').value;
                var sNotes = $('notesSetSlide').value;

                var oFile = getRecordFromList(aFileData.presentation, 'file', returnvalue.existingfile);

                oFile.each(function(item, index)
                {
                    sNotes = sNotes.replace('[[' + index + ']]', item);
                    sText = sText.replace('[[' + index + ']]', item);
                });

                $('bodySetSlide').set('value', '');
                $('notesSetSlide').set('value', sNotes);

                var outputs = getNodeChanges('sCurrLiID', oFile);
                saveSetSlide(outputs);
            }

        },
        aFileList: aFileData.presentation,
        sFileType: 'presentation'
    });
};

var YouTubeLookup = function()
{
    oSexyAlertForm.form($('youtubelookup1').get('html'),
    {
        onComplete: function(returnvalue)
        {
            var sText = $('bodySetSlide').value;
            var sNotes = $('notesSetSlide').value;
            if (returnvalue)
            {
                returnvalue = new Object(returnvalue);
                oYouTubeFetchRequest.send(
                {
                    data: returnvalue
                });
            }
        }
    });
};