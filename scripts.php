<?php
@require_once('config.php');


function print_deferred_script($item, $key)
{
    echo("<script src=\"$item\" defer=\"defer\" ></script>\n");
}

function print_script($item, $key)
{
    echo("<script src=\"$item\" ></script>\n");
}

function dump_script($item, $key)
{
    echo file_get_contents($item);
}

if(!isset($_GET['minify']) && (!isset($argc) || $argc < 2))
{
    if(CONST_UseMinifiedJS)
    {
        echo("<script src=\"". CONST_DeferredJSMinified . "\" defer=\"defer\" ></script>\n");
        echo("<script src=\"". CONST_JSMinified . "></script>\n");
    }
    else
    {
        array_walk($deferred_scripts,"print_deferred_script");
        array_walk($scripts,"print_script");
    }
}
elseif((isset($_GET['minify']) && $_GET['minify'] == 'deferred') || (isset($argc) && $argc == 2 && $argv[1] == 'deferred'))
{
    array_walk($deferred_scripts,"dump_script");
}
elseif((isset($_GET['minify']) && $_GET['minify'] == 'sync') || (isset($argc) && $argc == 2 && $argv[1] == 'sync'))
{
    echo "var dummy = 1;";
    array_walk($scripts,"dump_script");
}
?>

