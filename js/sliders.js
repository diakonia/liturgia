var oPanelSliders = {
    aSliders: [
        ['chooseSong', $('chooseSongPanel').addClass('hidden')],
        ['editSetSong', $('editSetSongPanel').addClass('hidden')],
        ['displaySetSongInfo', $('displaySetSongInfoPanel').addClass('hidden')],
        ['displaySongLyrics', $('displaySongLyricsPanel').addClass('hidden')],
        ['editSetSlide', $('editSetSlidePanel').addClass('hidden')]
    ],
    add: function(aNames)
    {
        aNames = Array.from(aNames);
        for (var i = 0; i < this.aSliders.length; i++)
        {
            if (aNames.indexOf(this.aSliders[i][0]) == -1)
            {

            }
            else
            {
                this.aSliders[i][1].removeClass('hidden');
            }
        }
    },
    show: function(aNames)
    {
        aNames = Array.from(aNames);
        for (var i = 0; i < this.aSliders.length; i++)
        {
            if (aNames.indexOf(this.aSliders[i][0]) == -1)
            {
                this.aSliders[i][1].addClass('hidden');
            }
            else
            {
                this.aSliders[i][1].removeClass('hidden');
            }
        }
    }
};




/*var oPanelSliders = {
 aSliders: [
 ['chooseSong',         new Fx.Slide('chooseSongPanel', {'mode':'vertical'}).slideOut()],
 ['editSetSong',        new Fx.Slide('editSetSongPanel', {'mode':'vertical'}).slideOut()],
 ['displaySetSongInfo', new Fx.Slide('displaySetSongInfoPanel', {'mode':'vertical'}).slideOut()],
 ['displaySongLyrics',  new Fx.Slide('displaySongLyricsPanel', {'mode':'vertical'}).slideOut()],
 ['editSetSlide',       new Fx.Slide('editSetSlidePanel', {'mode':'vertical'}).slideOut()]
 ],
 
 add:  function(aNames)
 {
 aNames = Array.from(aNames);
 for( var i=0; i < this.aSliders.length; i++)
 {
 if(aNames.indexOf(this.aSliders[i][0]) == -1)
 {
 
 }
 else
 {
 this.aSliders[i][1].slideIn();
 }
 }
 },
 
 show: function(aNames)
 {
 aNames = Array.from(aNames);
 for( var i=0; i < this.aSliders.length; i++)
 {
 if(aNames.indexOf(this.aSliders[i][0]) == -1)
 {
 this.aSliders[i][1].slideOut();
 }
 else
 {
 this.aSliders[i][1].slideIn();
 }
 }
 }
 };
 */