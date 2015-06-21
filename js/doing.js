/* global oSetListFetchRequest, oBlanksRequest, oSetFetchRequest, oSongListFetchRequest, oVideoListFetchRequest */
/* global oPresentationListFetchRequest, oBibleDataRequest, aBibleList, setToLoad */

$("btnUploadFile").fade("out");
oSetListFetchRequest.send();
oBlanksRequest.send();
oSetFetchRequest.send(
{
    data:
    {
        file: (setToLoad !== "") ? setToLoad : getDefaultSetName()
    }
});
oSongListFetchRequest.send();
oVideoListFetchRequest.send();
oPresentationListFetchRequest.send();
oBibleDataRequest.send(aBibleList);