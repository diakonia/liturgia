Element.implement({
  getValues: function(options) {
    var form = this;
		if (form.get("tag") == "form") {
			options = $extend({
				fStartProportion: [0, 0], //The start position from 0 -1  [X, Y]
        iFPS: 16, //Frames per second
        iSecondsAtTopSpeed: [2, 2], // how long from one extreme to the other at full speed [X, Y]
        fDeadZone: [0.3, 0.3] // the size of the central dead zone 0  = no dead zone 1 turns off scrolling for that direction [X, Y]
			}, options);
      
      this.options = options;
      var aValues = {};
      
      var aControls = this.getElements('input,select,textarea').each(function(item, index){
        var sName = item.get('name');
        if (sName === null)
        {
          sName = item.get('id');
        }
        var xValue = item.get('value');
        if (item.get('type') != 'submit' && sName)
        {
          aValues[sName] = xValue;
        }
      });
      return aValues;
    }
	  return form;
  }
});

