/* global oSetListFetchRequest, oBlanksRequest, oSetFetchRequest, oSongListFetchRequest, oVideoListFetchRequest */
/* global oPresentationListFetchRequest, oBibleDataRequest */

$("btnUploadFile").fade("out");
oSetListFetchRequest.send();
oBlanksRequest.send();
oSetFetchRequest.send(
{
    data:
    {
        file: getDefaultSetName()
    }
});
oSongListFetchRequest.send();
oVideoListFetchRequest.send();
oPresentationListFetchRequest.send();
oBibleDataRequest.send();