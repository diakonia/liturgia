<?php

  //echo "\n<br><pre>\n_FILES =" .var_export($_FILES, TRUE)."</pre>";

  require_once('core.php');
	
  getChurch(false);
  
  $result = array();
  $return = array();
  
  $result['time'] = date('r');
  $result['addr'] = substr_replace(gethostbyaddr($_SERVER['REMOTE_ADDR']), '******', 0, 6);
  $result['agent'] = $_SERVER['HTTP_USER_AGENT'];

  if (count($_GET)) {
    $result['get'] = $_GET;
  }
  if (count($_POST)) {
    $result['post'] = $_POST;
  }
  if (count($_FILES)) {
    $result['files'] = $_FILES;
  }
  
  
//Validattion  
$error = false;

if (!isset($_FILES['Filedata']) || !is_uploaded_file($_FILES['Filedata']['tmp_name'])) {
	$error = 'Invalid Upload';
}

/**
 * You would add more validation, checking image type or user rights.
 *
*/

if (!$error && $_FILES['Filedata']['size'] > CONST_MaxFileUpload)
{
	$error = 'Please upload only files smaller than the max!';
}

/*
if (!$error && !($size = @getimagesize($_FILES['Filedata']['tmp_name']) ) )
{
	$error = 'Please upload only images, no other files are supported.';
}

if (!$error && !in_array($size[2], array(1, 2, 3, 7, 8) ) )
{
	$error = 'Please upload only images of type JPEG, GIF or PNG.';
}

if (!$error && ($size[0] < 25) || ($size[1] < 25))
{
	$error = 'Please upload an image bigger than 25px.';
}
*/


// Processing

/**
 * Its a demo, you would move or process the file like:
 *
 * move_uploaded_file($_FILES['Filedata']['tmp_name'], '../uploads/' . $_FILES['Filedata']['name']);
 * $return['src'] = '/uploads/' . $_FILES['Filedata']['name'];
 *
 * or
 *
 * $return['link'] = YourImageLibrary::createThumbnail($_FILES['Filedata']['tmp_name']);
 *
 */

if ($error) {

	$return = array(
		'status' => '0',
		'error' => $error,
		'name'  =>$_FILES['Filedata']['name']
	);

} else {

	
/*
	// Our processing, we get a hash value from the file
	$return['hash'] = md5_file($_FILES['Filedata']['tmp_name']);

	// ... and if available, we get image data
	$info = @getimagesize($_FILES['Filedata']['tmp_name']);
*/
	if ($info) {
		//$return['width'] = $info[0];
		//$return['height'] = $info[1];
		$return['mime'] = $info['mime'];
	}



  $aFileInfo = array('type' => $_REQUEST['type'],
	  	     'name' => $_FILES['Filedata']['name']
	  );
  	
  $oFilePath = new filepath($aFileInfo);
  $sFullFilePath = $oFilePath->getFullFile();
  //echo "\n<br><pre>\nsFullFilePath  =" .$sFullFilePath ."</pre>";
  
  
  if (file_exists($sFullFilePath))
  {
   $return = array(
    'status' => '0',
    'error' => 'File with that name already Exits',
    'name'  => $oFilePath->getName(),
    'exists' => true,
   );
  }
  else
  {
    move_uploaded_file($_FILES['Filedata']['tmp_name'], $sFullFilePath);
    $oFilePath->changeGroup();
    $return = array(
     'status' => '1',
     'file'  => $oFilePath->getFile(),
     'name'  => $oFilePath->getName(),
     'path'  => $oFilePath->getPath(),
     'client_os_file' => $oFilePath->getClientExternalRelativeFile(),
     'client_abs_file' => $oFilePath->getClientExternalAbsFile()
    );
    
    $oFilePath->changeGroup();
    if(CONST_SVN_AUTO && defined('SVN_REVISION_HEAD'))
    {
      svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_USERNAME, $_SERVER['PHP_AUTH_USER']);
      svn_auth_set_parameter(SVN_AUTH_PARAM_DEFAULT_PASSWORD, $_SERVER['PHP_AUTH_PW']);
      $aCommitLog = svn_add(realpath($sFullFilePath));
      if($aCommitLog === false)
      {
         $return = array(
          'status' => '0',
          'error' => 'Could Not Add File',
          'name'  => $oFilePath->getName()
        );
      }
      $aCommitLog = svn_commit('Intial auto commit from MooSong user '.$_SERVER['PHP_AUTH_USER'], array(realpath($sFullFilePath)));
      if($aCommitLog === false)
      {
        $return = array(
          'status' => '0',
          'error' => 'Could Not Commit File',
          'name'  => $oFilePath->getName()   
        );
         
      }
    }
  }
}
// Output

/**
 * Again, a demo case. We can switch here, for different showcases
 * between different formats. You can also return plain data, like an URL
 * or whatever you want.
 *
 * The Content-type headers are uncommented, since Flash doesn't care for them
 * anyway. This way also the IFrame-based uploader sees the content.
 */

if (isset($_REQUEST['response']) && $_REQUEST['response'] == 'xml') {
	// header('Content-type: text/xml');

	// Really dirty, use DOM and CDATA section!
	echo '<response>';
	foreach ($return as $key => $value) {
		echo "<$key><![CDATA[$value]]></$key>";
	}
	echo '</response>';
} else {
	// header('Content-type: application/json');

	echo json_encode($return);
}
//workout a way of dumping a copy of the echos to file 
