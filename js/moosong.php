<?php header('Content-type: text/javascript'); ?>
// TEST: Dirty Flag
// TODO: tighter calendar integration
// TEST: resource upload
// TODO: external slide format
<?php
@require_once('../config.php');

echo file_get_contents('../' . CONST_MooToolsJS);
echo file_get_contents("vkbeautify.0.99.00.beta.js");
?>

window.addEvent('domready', function(){	

<?php 

echo file_get_contents("ie_detect.js");
echo file_get_contents("variables.js"); 
echo file_get_contents("dirty.js");   
echo file_get_contents("requests.js");
echo file_get_contents("lookups.js");
echo file_get_contents("sliders.js");
echo file_get_contents("xml.js");
echo file_get_contents("gui.js");
echo file_get_contents("utils.js");  
echo file_get_contents("upload.js");
echo file_get_contents("doing.js");
?>
});


	
<?php 
echo file_get_contents("mootools-hacks.js");  
echo file_get_contents('../' . CONST_MooToolsExtensionsJS);  
echo file_get_contents('../' . CONST_SexyAlertBoxJS);
echo file_get_contents('SexyAlertForm.js');
echo file_get_contents('../fancyupload/source/Fx.ProgressBar.js');
echo file_get_contents('../fancyupload/source/Swiff.Uploader.js');
?>
