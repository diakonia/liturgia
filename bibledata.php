<?php

header('Content-Type: application/json');
require_once('core.php');

$xmlDoc = new DOMDocument();
$xmlDoc->load('bibles/' . $_REQUEST['bible'] . '.xml');

$xpath = new DOMXpath($xmlDoc);

$aBooks = array();

$oBooks = $xpath->query("/bible/b");
if (!is_null($oBooks))
{
    for ($i = 0; $i < $oBooks->length; $i++)
    {
        $oBook = $oBooks->item($i);
        $sBookName = $oBook->getAttribute('n');
        $aChapters = array();
        $oChapters = $xpath->query("c", $oBook);
        if (!is_null($oChapters))
        {
            for ($j = 0; $j < $oChapters->length; $j++)
            {
                //set_time_limit  ( int $seconds  );
                $oChapter = $oChapters->item($j);
                $aPages = array();
                $oPages = $xpath->query("v[@word]", $oChapter);
                if (!is_null($oPages))
                {
                    for ($k = 0; $k < $oPages->length; $k++)
                    {
                        $aPages[$oPages->item($k)->getAttribute('n')] = (int) $oPages->item($k)->getAttribute('page');
                    }
                }
                $oVerses = $xpath->query("v", $oChapter);
                if (!is_null($oVerses))
                {
                    $aPages[$oVerses->item($oVerses->length - 1)->getAttribute('n')] = (int) $oVerses->item($oVerses->length - 1)->getAttribute('page');
                }

                $aChapters[$oChapter->getAttribute('n')] = $aPages;
            }
        }
        $aBooks[$oBook->getAttribute('n')] = $aChapters;
    }
}

apiSendResult(array('bible' => $aBooks));
