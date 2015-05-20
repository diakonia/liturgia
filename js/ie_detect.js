if (Browser.name == 'ie')
{
    if (Browser.version <= 8)
    {
        Sexy.error('Liturgia will not work at all on IE 8 or lower. Please install another browser, e.g. <a target="_blank" href="http://getfirefox.com">firefox<a>.');
    }
    else
        Sexy.error('Liturgia is totally untested in Internet Explorer and will almost certainly break. Please install another browser, e.g. <a target="_blank" href="http://getfirefox.com">firefox<a>.');
}