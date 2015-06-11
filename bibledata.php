<?php

header('Content-Type: application/json');
require_once('includes/core.php');
require_once('includes/Bibles.php');

if ($_REQUEST['type'] == "bibles")
{
    apiSendResult(array('bibles' => array_values(Bibles::getInstance()->toArray())));
}
else
{
    $bible = Bibles::getInstance()[$_REQUEST['bible']];
    if ($_REQUEST['type'] == "books")
    {
        $exclude = (array_key_exists('exclude', $_REQUEST)) ? $_REQUEST['exclude'] : null;
        $include = (array_key_exists('include', $_REQUEST)) ? $_REQUEST['include'] : null;
        apiSendResult(array('books' => array_values($bible->getBooks()->toArray($include, $exclude))));
    }
    else
    {
        $book = $bible->getBooks()[$_REQUEST['book']];
        if (NULL == $book)
        {
            apiSendError("Book is not found!");
            exit;
        }
        if ($_REQUEST['type'] == "chapters")
        {
            apiSendResult(array('chapters' => array_values($book->getChapters()->toArray())));
        }
        else
        {
            if ($_REQUEST['type'] == "verses_text")
            {
                apiSendResult(array('verses_text' => array_values($book->getVerseRange($_REQUEST['chapter'], $_REQUEST['verse'], $_REQUEST['chapter2'], $_REQUEST['verse2']))));
            }
            else
            {
                $chapter = $book->getChapters()[$_REQUEST['chapter']];
                if ($_REQUEST['type'] == "verses")
                {
                    apiSendResult(array('verses' => array_values($chapter->getVerses()->toArray())));
                }
            }
        }
    }
}
