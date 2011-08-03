<?php
  
  @include_once('localconfig.php');
  
  @define('CONST_MooSongJS', 'js/moosong.php');
  @define('CONST_OpenSongData', '../OpenSong/');
  @define('CONST_SundayCutOff', 11);
  @define('CONST_FOP_PATH',     'fop');
  @define('CONST_TEMP_PATH',    '/tmp');
  @define('CONST_SVN_AUTO',     0);
  @define('CONST_GOOGLE_EVENT_FEED',  '');
  @define('CONST_GOOGLE_EVENT_MAX_DAYS_FUTURE',  120);
  @define('CONST_NETWORK_TEST_HOST',  'www.w3.org');
  @define('CONST_DEFAULT_TIMEZONE',  'Europe/London');
  @define('CONST_YouTube_DL',  './youtube-dl');
  @define('CONST_FileGroup',  false);
  @define('CONST_SiteTitle',  "MooSong");
  
  @define('CONST_OpenSongSets', CONST_OpenSongData.'Sets/');
  @define('CONST_OpenSongSongs', CONST_OpenSongData.'Songs/');
  @define('CONST_OpenSongVideos', CONST_OpenSongData.'Videos/');
  @define('CONST_OpenSongImages', CONST_OpenSongData.'Images/');
  @define('CONST_OpenSongPresentations', CONST_OpenSongData.'Presentations/');
  
  
  
  @define('CONST_VLC_BIN', '"C:\OSTools\VideoLan\VLC\VLC.EXE"');
  
  @define('CONST_DVD_CLIP_BY_TIME_CMD_1', CONST_VLC_BIN.' "dvdsimple://D:@<<dvdtitlenumber>>" ":start-time=<<start-time>>" ":stop-time=<<stop-time>>"');
  @define('CONST_DVD_CLIP_BY_TIME_FILENAME_1', '<<dvdtitle>>_<<dvdtitlenumber>>_<<start-time>>_<<stop-time>>');
  @define('CONST_DVD_CLIP_BY_TIME_INSTRUCTIONS_1', 'DVD:<<dvdtitle>> Title:<<dvdtitlenumber>> Start:<<dvdstarthours>>:<<dvdstartmin>>:<<dvdstartsecs>> End:<<dvdendhours>>:<<dvdendmin>>:<<dvdendsecs>>');
  
  
  @define('CONST_DVD_CLIP_BY_TIME_CMD_2', CONST_VLC_BIN.' "dvd://D:@<<dvdtitlenumber>>:<<start-chapter>>" ":start-time=<<start-time>>" ":stop-time=<<stop-time>>"');
  @define('CONST_DVD_CLIP_BY_TIME_FILENAME_2', CONST_DVD_CLIP_BY_TIME_FILENAME_1.'_TRY_2ND');

  
  @define('CONST_DVD_CLIP_BY_CHAPTER_CMD_1', CONST_VLC_BIN.' "dvdsimple://D:@<<dvdtitlenumber>>:<<start-chapter>>-<<dvdtitlenumber>>:<<stop-chapter>>"');  
  @define('CONST_DVD_CLIP_BY_CHAPTER_FILENAME_1', '<<dvdtitle>>_<<dvdtitlenumber>>_<<start-chapter>>-<<dvdtitlenumber>>_<<stop-chapter>>');
  @define('CONST_DVD_CLIP_BY_CHAPTER_INSTRUCTIONS_1', 'DVD:<<dvdtitle>> Start Title:<<dvdtitlenumber>> Start Chapter:<<start-chapter>> End Title<<dvdtitlenumber>> Start Chapter:<<stop-chapter>>');

  @define('CONST_DVD_CLIP_SCRIPT_EXTENSION','.bat');

