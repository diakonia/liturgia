<?php require_once('config.php'); ?>
<script type="text/javascript">
    var CONST_SundayCutOff = <?php echo CONST_SundayCutOff; ?>;
    var CONST_SiteTitle = "<?php echo CONST_SiteTitle; ?>";
    var CONST_MaxFileUpload = "<?php echo CONST_MaxFileUpload; ?>";
    var CONST_Client_OpenSongData = "<?php echo addslashes(CONST_Client_OpenSongData); ?>";
    var CONST_CHOOSEN_CHURCH = "<?php
if (defined('CONST_CHOOSEN_CHURCH'))
{
    echo CONST_CHOOSEN_CHURCH;
}
?>";
</script>
