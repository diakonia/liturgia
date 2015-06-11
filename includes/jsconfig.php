<?php require_once('config.php'); ?>
<script type="text/javascript">
    var CONST_SundayCutOff = <?php echo CONST_SundayCutOff; ?>;
    var CONST_SiteTitle = "<?php echo str_replace("'", "\\'", CONST_SiteTitle); ?>";
    var CONST_MaxFileUpload = "<?php echo CONST_MaxFileUpload; ?>";
    var CONST_Client_OpenSongData = "<?php echo addslashes(CONST_Client_OpenSongData); ?>";
    var CONST_CHOOSEN_CHURCH = "<?php
if (defined('CONST_CHOOSEN_CHURCH'))
{
    echo CONST_CHOOSEN_CHURCH;
}
?>";
    var CONST_DEFAULT_BIBLE = "<?php echo CONST_DEFAULT_BIBLE; ?>";
    var CONST_READING_ACCLAMATION = <?php echo CONST_READING_ACCLAMATION ? "true" : "false" ?>;
    var CONST_READING_TEXT = <?php echo CONST_READING_TEXT ? "true" : "false" ?>;
    var CONST_READING_FORMAT = "<?php echo CONST_READING_FORMAT ?>";
    var CONST_READING_VERSES_PER_SLIDE = <?php echo CONST_READING_VERSES_PER_SLIDE ?>;
    var CONST_READING_CHARS_PER_SLIDE = <?php echo CONST_READING_CHARS_PER_SLIDE ?>;

</script>
