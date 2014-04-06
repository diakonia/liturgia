<?php
  
  @include_once('localconfig.php');
  
  @define('CONST_MooSongJS', 'js/moosong.php');
  @define('CONST_OpenSongData', '../OpenSong/');
  @define('CONST_Client_OpenSongData', '/usr/share/opensong/OpenSong/');
  @define('CONST_ExternaFolderSeperator', '/');
  @define('CONST_InternaFolderSeperator', '/');
  @define('CONST_ExternaClient_FolderSeperator', '\\');
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
  
  //@define('CONST_DVD_CLIP_BY_TIME_CMD_1', CONST_VLC_BIN.' "dvdsimple:///D:@<<dvdtitlenumber>>" ":start-time=<<start-time>>" ":stop-time=<<stop-time>>"');
  @define('CONST_DVD_CLIP_BY_TIME_CMD_1', '<?xml version="1.0" encoding="UTF-8"?>
<playlist xmlns="http://xspf.org/ns/0/" xmlns:vlc="http://www.videolan.org/vlc/playlist/ns/0/">
	<title>Playlist</title>
	<trackList>
		<track>
			<location>dvdsimple:///D:\#<<dvdtitlenumber>></location>
			<extension application="http://www.videolan.org/vlc/playlist/0">
				<vlc:id>0</vlc:id>
				<vlc:option>disc-caching=300</vlc:option>
				<vlc:option>start-time=<<start-time>></vlc:option>
				<vlc:option>stop-time=<<stop-time>></vlc:option>
			</extension>
		</track>
	</trackList>
	<extension application="http://www.videolan.org/vlc/playlist/0">
			<vlc:item tid="0" />
	</extension>
</playlist>');

  @define('CONST_DVD_CLIP_BY_TIME_FILENAME_1', '<<dvdtitle>>_<<dvdtitlenumber>>_<<start-time>>_<<stop-time>>');
  @define('CONST_DVD_CLIP_BY_TIME_INSTRUCTIONS_1', 'DVD:"<<dvdtitle>>" Title:<<dvdtitlenumber>> Start:<<dvdstarthours>>:<<dvdstartmin>>:<<dvdstartsecs>> End:<<dvdendhours>>:<<dvdendmin>>:<<dvdendsecs>>');
  
  
  //@define('CONST_DVD_CLIP_BY_TIME_CMD_2', CONST_VLC_BIN.' "dvdsimple:///D:@<<dvdtitlenumber>>:<<start-chapter>>" ":start-time=<<start-time>>" ":stop-time=<<stop-time>>"');
  @define('CONST_DVD_CLIP_BY_TIME_CMD_2', '<?xml version="1.0" encoding="UTF-8"?>
<playlist xmlns="http://xspf.org/ns/0/" xmlns:vlc="http://www.videolan.org/vlc/playlist/ns/0/">
	<title>Playlist</title>
	<trackList>
		<track>
			<location>dvd:///D:\#<<dvdtitlenumber>>:<<start-chapter>></location>
			<extension application="http://www.videolan.org/vlc/playlist/0">
				<vlc:id>0</vlc:id>
				<vlc:option>disc-caching=300</vlc:option>
				<vlc:option>start-time=<<start-time>></vlc:option>
				<vlc:option>stop-time=<<stop-time>></vlc:option>
			</extension>
		</track>
	</trackList>
	<extension application="http://www.videolan.org/vlc/playlist/0">
			<vlc:item tid="0" />
	</extension>
</playlist>');

  
  @define('CONST_DVD_CLIP_BY_TIME_FILENAME_2', CONST_DVD_CLIP_BY_TIME_FILENAME_1.'_TRY_2ND');

  
  //@define('CONST_DVD_CLIP_BY_CHAPTER_CMD_1', CONST_VLC_BIN.' "dvdsimple:///D:@<<dvdtitlenumber>>:<<start-chapter>>-<<dvdtitlenumber>>:<<stop-chapter>>"');  
  
  @define('CONST_DVD_CLIP_BY_CHAPTER_CMD_1', '<?xml version="1.0" encoding="UTF-8"?>
<playlist xmlns="http://xspf.org/ns/0/" xmlns:vlc="http://www.videolan.org/vlc/playlist/ns/0/">
	<title>Playlist</title>
	<trackList>
		<track>
			<location>dvdsimple:///D:\#<<dvdtitlenumber>>:<<start-chapter>>-<<dvdtitlenumber>>:<<stop-chapter>></location>
			<extension application="http://www.videolan.org/vlc/playlist/0">
				<vlc:id>0</vlc:id>
				<vlc:option>disc-caching=300</vlc:option>
			</extension>
		</track>
	</trackList>
	<extension application="http://www.videolan.org/vlc/playlist/0">
			<vlc:item tid="0" />
	</extension>
</playlist>');

  

  @define('CONST_DVD_CLIP_BY_CHAPTER_FILENAME_1', '<<dvdtitle>>_<<dvdtitlenumber>>_<<start-chapter>>-<<dvdtitlenumber>>_<<stop-chapter>>');
  @define('CONST_DVD_CLIP_BY_CHAPTER_INSTRUCTIONS_1', 'DVD:"<<dvdtitle>>" Start Title:<<dvdtitlenumber>> Start Chapter:<<start-chapter>> End Title:<<dvdtitlenumber>> Stop Chapter:<<stop-chapter>>');

  @define('CONST_DVD_CLIP_SCRIPT_EXTENSION','.xspf');

