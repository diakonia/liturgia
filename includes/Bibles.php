<?php

// The purpose of this overly complex piece of code is implement
// Something analogous to me - a very lazy bible reader!

class BookFilter
{

    public $include;
    public $exclude;

    function match($book)
    {
        return ((NULL == $this->include || $book->section == $this->include) &&
                (NULL == $this->exclude || $book->section != $this->exclude));
    }

    public function __construct($include, $exclude)
    {
        $this->include = $include;
        $this->exclude = $exclude;
    }

}

class Verse
{

    public $verseNum;
    public $pageNum;
    public $word;
    public $verseText;

    public function save($saveHandle)
    {
        $pos = ftell($saveHandle);
        fwrite($saveHandle, serialize($this) . "\n");
        return $pos;
    }

    public function loadFromXml($xpath, $xoVerse)
    {
        $verseNum = $xoVerse->getAttribute('n');
        $this->verseNum = (NULL === $verseNum) ? null : intval($verseNum);
        $pageNum = $xoVerse->getAttribute('page');
        $this->pageNum = (NULL === $pageNum) ? null : intval($pageNum);
        $word = $xoVerse->getAttribute('word');
        $this->word = (NULL === $word) ? null : $word;
        $this->verseText = $xoVerse->textContent;
    }

    static public function getInstance($loadHandle, $pos)
    {
        fseek($loadHandle, $pos);
        $instance = unserialize(fgets($loadHandle));
        $instance->loadHandle = $loadHandle;
        return $instance;
    }

}

class Verses implements ArrayAccess
{

    private $arrVerses = array();
    private $arrIndex = array();
    private $loadHandle;

    public function __sleep()
    {
        return array('arrIndex');
    }

    public function offsetSet($offset, $value)
    {
        if (is_null($offset))
        {
            $this->arrVerses[] = $value;
        }
        else
        {
            $this->arrVerses[$offset] = $value;
        }
    }

    public function offsetExists($offset)
    {
        return isset($this->arrVerses[$offset]) || isset($this->arrIndex[offset]);
    }

    public function offsetUnset($offset)
    {
        unset($this->arrVerses[$offset]);
        unset($this->arrIndex[$offset]);
    }

    public function offsetGet($offset)
    {
        if (isset($this->arrVerses[$offset]))
        {
            return $this->arrVerses[$offset];
        }
        else
        {
            if (isset($this->arrIndex[$offset]))
            {
                return ($this->arrVerses[$offset] = Verse::getInstance($this->loadHandle, $this->arrIndex[$offset]));
            }
            else
            {
                return null;
            }
        }
    }

    function toArray()
    {
        foreach ($this->arrIndex as $key => $value)
            $dummy = $this[$key];
        return $this->arrVerses;
    }

    public function save($saveHandle)
    {
        foreach ($this->arrVerses as $key => $verse)
        {
            $this->arrIndex[$key] = $verse->save($saveHandle);
        }
        $pos = ftell($saveHandle);
        fwrite($saveHandle, serialize($this) . "\n");
        return $pos;
    }

    public function loadFromXml($xpath, $xoVerses)
    {
        for ($k = 0; $k < $xoVerses->length; $k++)
        {
            $xoVerse = $xoVerses->item($k);
            $verse = New Verse();
            $verse->loadFromXml($xpath, $xoVerse);
            $this->arrVerses[$verse->verseNum] = $verse;
        }
    }

    static public function getInstance($loadHandle, $pos)
    {
        fseek($loadHandle, $pos);
        $instance = unserialize(fgets($loadHandle));
        $instance->loadHandle = $loadHandle;
        return $instance;
    }

}

class Chapter
{

    public $chapterNum;
    private $verses = null;
    private $versesPos;
    private $loadHandle = null;

    public function save($saveHandle)
    {
        $this->versesPos = $this->verses->save($saveHandle);
        $pos = ftell($saveHandle);
        fwrite($saveHandle, serialize($this) . "\n");
        return $pos;
    }

    public function getVerses()
    {
        if (null === $this->verses)
        {
            $this->verses = Verses::getInstance($this->loadHandle, $this->versesPos);
        }
        return $this->verses;
    }

    public function getLastVerseNum()
    {
        $arr = $this->verses->toArray();
        return end($arr)->verseNum;
    }

    public function __sleep()
    {
        return array('chapterNum', 'versesPos');
    }

    public function loadFromXml($xpath, $xoChapter)
    {
        $chapterNum = $xoChapter->getAttribute('n');
        $this->chapterNum = (NULL === $chapterNum) ? null : intval($chapterNum);
        $xoVerses = $xpath->query("v", $xoChapter);
        if (!is_null($xoVerses))
        {
            $this->verses = new Verses();
            $this->verses->loadFromXml($xpath, $xoVerses);
        }
    }

    static public function getInstance($loadHandle, $pos)
    {
        fseek($loadHandle, $pos);
        $instance = unserialize(fgets($loadHandle));
        $instance->loadHandle = $loadHandle;
        return $instance;
    }

}

class Chapters implements ArrayAccess
{

    private $arrChapters = array();
    private $arrIndex = array();
    private $loadHandle;

    public function count()
    {
        return count($this->arrIndex);
    }

    public function __sleep()
    {
        return array('arrIndex');
    }

    public function offsetSet($offset, $value)
    {
        if (is_null($offset))
        {
            $this->arrChapters[] = $value;
        }
        else
        {
            $this->arrChapters[$offset] = $value;
        }
    }

    public function offsetExists($offset)
    {
        return isset($this->arrChapters[$offset]) || isset($this->arrIndex[offset]);
    }

    public function offsetUnset($offset)
    {
        unset($this->arrChapters[$offset]);
        unset($this->arrIndex[$offset]);
    }

    public function offsetGet($offset)
    {
        if (isset($this->arrChapters[$offset]))
        {
            return $this->arrChapters[$offset];
        }
        else
        {
            if (isset($this->arrIndex[$offset]))
            {
                return ($this->arrChapters[$offset] = Chapter::getInstance($this->loadHandle, $this->arrIndex[$offset]));
            }
            else
            {
                return null;
            }
        }
    }

    function toArray()
    {
        foreach ($this->arrIndex as $key => $value)
            $dummy = $this[$key];
        return $this->arrChapters;
    }

    public function save($saveHandle)
    {
        $pos = ftell($saveHandle);
        foreach ($this->arrChapters as $key => $chapter)
        {
            $this->arrIndex[$key] = $chapter->save($saveHandle);
        }
        fwrite($saveHandle, serialize($this) . "\n");
        return $pos;
    }

    public function loadFromXml($xpath, $xoChapters)
    {
        for ($j = 0; $j < $xoChapters->length; $j++)
        {
            $xoChapter = $xoChapters->item($j);
            $chapter = New Chapter();
            $chapter->loadFromXml($xpath, $xoChapter);
            $this->arrChapters[$chapter->chapterNum] = $chapter;
        }
    }

    static public function getInstance($loadHandle, $pos)
    {
        fseek($loadHandle, $pos);
        $instance = unserialize(fgets($loadHandle));
        $instance->loadHandle = $loadHandle;
        return $instance;
    }

}

class Book
{

    public $bookName;
    public $section;
    private $chapters = null;
    private $chaptersPos;
    private $loadHandle = null;
    public $chapterCount;

    public function save($saveHandle)
    {
        $this->chaptersPos = $this->chapters->save($saveHandle);
        $pos = ftell($saveHandle);
        fwrite($saveHandle, serialize($this) . "\n");
        return $pos;
    }

    public function getChapters()
    {
        if (null === $this->chapters)
        {
            $this->chapters = Chapters::getInstance($this->loadHandle, $this->chaptersPos);
        }
        return $this->chapters;
    }

    public function getVerseRange($from_chapter, $from_verse, $to_chapter, $to_verse)
    {
        $result = array();
        $chapter = $this->getChapters()[$from_chapter];
        if ($from_chapter == $to_chapter)
        {
            $to_v1 = $to_verse;
            $to_v2 = -99;
        }
        else
        {
            $to_v1 = $chapter->getLastVerseNum();
            $to_v2 = $to_verse;
        }
        for ($iv = $from_verse; $iv <= $to_v1; $iv++)
        {
            $result[] = $chapter->getVerses()[$iv];
        }
        for ($ic = $from_chapter + 1; $ic < $to_chapter; $ic++)
        {
            $chapter = $this->getChapters()[$ic];
            foreach ($chapter->getVerses()->toArray() as $key => $verse)
            {
                $result[] = $verse;
            }
        }
        $chapter = $this->getChapters()[$to_chapter];
        for ($iv = 1; $iv <= $to_v2; $iv++)
        {
            $result[] = $chapter->getVerses()[$iv];
        }
        return $result;
    }

    public function __sleep()
    {
        return array('bookName', 'section', 'chaptersPos');
    }

    public function __wakeup()
    {
        $this->chapterCount = $this->getChapters()->count();
    }

    public function loadFromXML($xpath, $xoBook)
    {
        $this->bookName = $xoBook->getAttribute('n');
        $this->section = $xoBook->getAttribute('s');
        $xoChapters = $xpath->query("c", $xoBook);
        if (!is_null($xoChapters))
        {
            $this->chapters = new Chapters();
            $this->chapters->loadFromXml($xpath, $xoChapters);
        }
    }

    static public function getInstance($loadHandle, $pos)
    {
        fseek($loadHandle, $pos);
        $instance = unserialize(fgets($loadHandle));
        $instance->loadHandle = $loadHandle;
        return $instance;
    }

}

class Books implements ArrayAccess
{

    private $arrBooks = array();
    private $arrIndex = array();
    private $loadHandle;

    public function __sleep()
    {
        return array('arrIndex');
    }

    public function offsetSet($offset, $value)
    {
        if (is_null($offset))
        {
            $this->arrBooks[] = $value;
        }
        else
        {
            $this->arrBooks[$offset] = $value;
        }
    }

    public function offsetExists($offset)
    {
        return isset($this->arrBooks[$offset]) || isset($this->arrIndex[offset]);
    }

    public function offsetUnset($offset)
    {
        unset($this->arrBooks[$offset]);
        unset($this->arrIndex[$offset]);
    }

    public function offsetGet($offset)
    {
        if (isset($this->arrBooks[$offset]))
        {
            return $this->arrBooks[$offset];
        }
        else
        {
            if (isset($this->arrIndex[$offset]))
            {
                return ($this->arrBooks[$offset] = Book::getInstance($this->loadHandle, $this->arrIndex[$offset]));
            }
            else
            {
                return null;
            }
        }
    }

    function toArray($include = null, $exclude = null)
    {
        foreach ($this->arrIndex as $key => $value)
            $dummy = $this[$key];
        return array_filter($this->arrBooks, array(new BookFilter($include, $exclude), "match"));
    }

    public function save($saveHandle)
    {
        foreach ($this->arrBooks as $key => $book)
        {
            $this->arrIndex[$key] = $book->save($saveHandle);
        }
        $pos = ftell($saveHandle);
        fwrite($saveHandle, serialize($this) . "\n");
        return $pos;
    }

    public function loadFromXML($xpath, $xoBooks)
    {
        for ($i = 0; $i < $xoBooks->length; $i++)
        {
            $xoBook = $xoBooks->item($i);
            $book = new Book();
            $book->loadFromXML($xpath, $xoBook);
            $this->arrBooks[$book->bookName] = $book;
        }
    }

    static public function getInstance($loadHandle, $pos)
    {
        fseek($loadHandle, $pos);
        $instance = unserialize(fgets($loadHandle));
        $instance->loadHandle = $loadHandle;
        return $instance;
    }

}

class Bible
{

    public $bibleName;
    private $books = null;
    private $booksPos;
    private $loadHandle = null;

    public function save()
    {
        $saveHandle = fopen("bibles/" . $this->bibleName . ".indexed", "w");
        if ($saveHandle)
        {
            $this->booksPos = $this->books->save($saveHandle);
            fwrite($saveHandle, str_pad(serialize($this), 1024, " "));
            fclose($saveHandle);
        }
        else
            return false;
    }

    public function getBooks()
    {
        if (null === $this->books)
        {
            if (null !== $this->loadHandle)
            {
                $this->books = Books::getInstance($this->loadHandle, $this->booksPos);
            }
            else if ($this->hasXml())
            {
                $this->loadFromXml("bibles/" . $this->bibleName . ".xml");
                $this->save();
            }
        }
        return $this->books;
    }

    public function __sleep()
    {
        return array('bibleName', 'booksPos');
    }

    public function __construct($bibleName)
    {
        $this->bibleName = $bibleName;
    }

    public function loadFromXml($filename)
    {
        $xmlDoc = new DOMDocument();
        $xmlDoc->load($filename);

        $xpath = new DOMXpath($xmlDoc);

        $xoBooks = $xpath->query("/bible/b");
        if (!is_null($xoBooks))
        {
            $this->books = New Books();
            $this->books->loadFromXml($xpath, $xoBooks);
        }
    }

    public function hasJSON()
    {
        return file_exists("bibles/" . $this->bibleName . ".json");
    }

    public function hasIdx()
    {
        return file_exists("bibles/" . $this->bibleName . ".indexed");
    }

    public function hasXml()
    {
        return file_exists("bibles/" . $this->bibleName . ".xml");
    }

    static public function getInstance($bibleName)
    {
        if (file_exists("bibles/" . $bibleName . ".indexed"))
        {
            $loadHandle = fopen("bibles/" . $this->bibleName . ".indexed", "r");
            fseek($loadHandle, -1024, SEEK_END);
            $instance = unserialize(fread($loadHandle, 1024));
            $instance->loadHandle = $loadHandle;
            return $instance;
        }
    }

}

/**
 * Description of Bibles
 *
 * @author parrysg
 */
class Bibles implements ArrayAccess
{

    private $arrBibles;

    static public function getInstance()
    {

        static $instance = null;
        if (null === $instance)
        {
            if (session_status() == PHP_SESSION_ACTIVE)
            {
                if (null === $_SESSION['BIBLES'])
                {
                    $_SESSION['BIBLES'] = ($instance = new static());
                    error_log("session first");
                }
                else
                {
                    $instance = $_SESSION['BIBLES'];
                    error_log("session hit");
                }
            }
            else
            {
                $instance = new static();
                error_log("session miss");
            }
        }
        return $instance;
    }

    public function offsetSet($offset, $value)
    {
        if (is_null($offset))
        {
            $this->arrBibles[] = $value;
        }
        else
        {
            $this->arrBibles[$offset] = $value;
        }
    }

    public function offsetExists($offset)
    {
        return isset($this->arrBibles[$offset]);
    }

    public function offsetUnset($offset)
    {
        unset($this->arrBibles[$offset]);
    }

    public function offsetGet($offset)
    {
        return isset($this->arrBibles[$offset]) ? $this->arrBibles[$offset] : null;
    }

    private function __construct()
    {
        $this->arrBibles = [];
        $d = dir("./bibles");
        $matches = [];
        while (false !== ($entry = $d->read()))
        {
            if (preg_match('/^(.*)\.(xml|bin|json)$/', $entry, $matches) && !array_key_exists($matches[1], $this->arrBibles))
            {
                $newBible = new Bible($matches[1]);
                $this->arrBibles[$matches[1]] = $newBible;
            }
        }
    }

    function toArray()
    {
        return $this->arrBibles;
    }

}
