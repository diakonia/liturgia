//DIRTY
this.addEvent('beforeunload', function(e)
{
    if (bDirty && e != undefined)
    {
        e.stop();
    }
});

var setDirty = function(bIsDirty)
{
    if (bIsDirty == undefined)
    {
        bIsDirty = true;
    }
    bDirty = bIsDirty;
    var sTitle = CONST_SiteTitle + ': ' + $('selectSetChooser').value;
    $('dirtytext').empty();
    if (bDirty)
    {
        sTitle = sTitle + ' (Modified)';
        $('dirtytext').set('html', '(Modified)');
    }
    $('windowtitle').set('html', sTitle);
};