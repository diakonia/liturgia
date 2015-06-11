function PadDigits(n, totalDigits)
{
    n = n.toString();
    var pd = '';
    if (totalDigits > n.length)
    {
        for (var i = 0; i < (totalDigits - n.length); i++)
        {
            pd += '0';
        }
    }
    return pd + n.toString();
}

function parseIntOrNull(s)
{
    if (s === null || s === '')
        return null;
    else
        return parseInt(s);
}

function optionJsonField(option, field)
{
    return (option === undefined || option === null || option === '' ||
            option.value === undefined) ?
        undefined :
        (option.value === null || option.value === '') ?
        option.value :
        JSON.parse(option.value)[field];
}

function formDataJsonField(formdata, selectName, field)
{
    var selectValue = safeGet(formdata, selectName);
    return (selectValue === undefined || selectValue === null || selectValue === '') ?
        selectValue : JSON.parse(selectValue)[field];
}

function safeGet(obj, field)
{
    return (undefined === obj || null === obj || '' === obj) ? obj : (field === undefined || field === null || field === '' || undefined === obj[field]) ? undefined : obj[field];
}