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

var typeOf=function(i)
{
  if(i===null)
  {
    return "null";
  }
  /*if(i.$family)
  {
    return i.$family();
  }*/
  if(i.nodeName)
  {
    if(i.nodeType==1)
    {
      return"element";
    }
    if(i.nodeType==3)
    {
      return(/\S/).test(i.nodeValue)?"textnode":"whitespace";
    }
  }
  else
  {
    if(typeof i.length=="number")
    {
      if(i.callee)
      {
        return "arguments";
      }
      /*if("item" in i)
      {
        return "collection";
      }*/
    }
  }
  return typeof i;
};

/*
---

script: Request.JSONP.js

name: Request.JSONP

description: Defines Request.JSONP, a class for cross domain javascript via script injection.

license: MIT-style license

authors:
  - Aaron Newton
  - Guillermo Rauch
  - Arian Stolwijk

requires:
  - Core/Element
  - Core/Request
  - MooTools.More

provides: [Request.JSONP]

...
*/

Request.JSONP = new Class({

	Implements: [Chain, Events, Options],

	options: {/*
		onRequest: function(src, scriptElement){},
		onComplete: function(data){},
		onSuccess: function(data){},
		onCancel: function(){},
		onTimeout: function(){},
		onError: function(){}, */
		onRequest: function(src){
			if (this.options.log && window.console && console.log){
				console.log('JSONP retrieving script with url:' + src);
			}
		},
		onError: function(src){
			if (this.options.log && window.console && console.warn){
				console.warn('JSONP '+ src +' will fail in Internet Explorer, which enforces a 2083 bytes length limit on URIs');
			}
		},
		url: '',
		callbackKey: 'callback',
		injectScript: document.head,
		data: '',
		link: 'ignore',
		timeout: 0,
		log: false
	},

	initialize: function(options){
		this.setOptions(options);
	},

	send: function(options){
		if (!Request.prototype.check.call(this, options))
		{
		  return this;
		}
		this.running = true;

		var type = typeOf(options);
		if (type == 'string' || type == 'element')
		{
		  options = {data: options};
		}
		options = $extend(this.options, options || {});
		
		var data = options.data;
		switch (typeOf(data)){
			case 'element': data = document.id(data).toQueryString(); break;
			case 'object': case 'hash': data = Object.toQueryString(data);
		}

		var index = Request.JSONP.counter++;
		this.index = index;
		
		var src = options.url +
			(options.url.test('\\?') ? '&' :'?') +
			(options.callbackKey) +
			'=Request.JSONP.request_map.request_'+ index +
			(data ? '&' + data : '');

		if (src.length > 2083)
		{
		  this.fireEvent('error', src);
		}
		
		Request.JSONP.request_map['request_' + index] = function(){
			this.success(arguments, index);
		}.bind(this);

		var script = this.getScript(src).inject(options.injectScript);
		this.fireEvent('request', [src, script]);

		if (options.timeout)
		{
		  this.timeout.delay(options.timeout, this);
		}
		
		return this;
	},

	getScript: function(src){
		if (!this.script){
		  this.script = new Element('script', {
			type: 'text/javascript',
			async: true,
			src: src
		});
		}
		return this.script;
	},

	success: function(args, index){
		if (!this.running)
		{
		  return;
		}
		this.clear()
			.fireEvent('complete', args).fireEvent('success', args)
			.callChain();
	},

	cancel: function(){
		if (this.running) 
		{
		  this.clear().fireEvent('cancel');
		}
		return this;
	},

	isRunning: function(){
		return !!this.running;
	},

	clear: function(){
		this.running = false;
		if (this.script){
			this.script.destroy();
			this.script = null;
		}
		return this;
	},

	timeout: function(){
		if (this.running){
			this.running = false;
			this.fireEvent('timeout', [this.script.get('src'), this.script]).fireEvent('failure').cancel();
		}
		return this;
	}

});

Request.JSONP.counter = 0;
Request.JSONP.request_map = {};


