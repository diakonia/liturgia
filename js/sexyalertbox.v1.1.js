/*
Script: SexyAlertBox.js
  http://www.coders.me/web-js-html/javascript/sexy-alert-box
  
Version:
  1.1

Author: 
  Eduardo D. Sada 
  http://www.coders.me

License:
	MIT license.

Based in <PBBAcpBox> (Pokemon_JOJO, <http://www.mibhouse.org/pokemon_jojo>)

Features:
  Mootools 1.2 100% Compatible
  Chain Implemented (Cola de mensajes)
  More styles (info, error, alert, prompt, confirm)

*/

/*
Class: SexyAlertBox
	Clone class of original javascript function : 'alert', 'confirm' and 'prompt'

Arguments:
	options - see Options below

Options:
	name - name of the box for use different style
	zIndex - integer, zindex of the box
	onReturn - return value when box is closed. defaults to false
	onReturnFunction - a function to fire when return box value
	BoxStyles - stylesheets of the box
	OverlayStyles - stylesheets of overlay
	showDuration - duration of the box transition when showing (defaults to 200 ms)
	showEffect - transitions, to be used when showing
	closeDuration - Duration of the box transition when closing (defaults to 100 ms)
	closeEffect - transitions, to be used when closing
	onShowStart - a function to fire when box start to showing
	onCloseStart - a function to fire when box start to closing
	onShowComplete - a function to fire when box done showing
	onCloseComplete - a function to fire when box done closing
*/

var SexyAlertBox = new Class({
  Implements: [Chain],

	getOptions: function(){
		return {
			name: 'SexyAlertBox',
			zIndex: 65555,
			onReturn: false,
			onReturnFunction : $empty,
			BoxStyles: {
				'width': 500
			},
			OverlayStyles: {
				'background-color': '#000',
				'opacity': 0.7
			},
			showDuration: 200,
			showEffect: Fx.Transitions.linear,
      closeDuration: 100,
			closeEffect: Fx.Transitions.linear,
			moveDuration: 500,
			moveEffect: Fx.Transitions.Back.easeOut,
			onShowStart : $empty,
			onShowComplete : $empty,
			onCloseStart : $empty,
			onCloseComplete : function(properties) {
				this.options.onReturnFunction(this.options.onReturn);
			}.bind(this)
		};
	},

  setWidth: function(val){
    this.options.BoxStyles.width = val;
    this.Box.setStyle('width',this.options.BoxStyles.width + 'px');
  },
  
  setHeight: function(val){
    this.options.BoxStyles.height = val;
    this.Box.setStyle('height',this.options.BoxStyles.height + 'px');
  },
  
  
  
	initialize: function(options){
    this.i=0;
    
		this.setOptions(this.getOptions(), options);

		this.Overlay = new Element('div', {
			'id': 'BoxOverlay',
			'styles': {
				'display': 'none',
				'z-index': this.options.zIndex,
				'position': 'absolute',
				'top': '0',
				'left': '0',
				'background-color': this.options.OverlayStyles['background-color'],
				'opacity': 0,
				'height': window.getScrollHeight() + 'px',
				'width': window.getScrollWidth() + 'px'
			}
		});

		this.Content = new Element('div', {
			'id': this.options.name + '-BoxContent'
		});

    this.Buttons = new Element('div', {
      'id': this.options.name + '-Buttons'
    }).adopt(this.Content);

		this.Box = new Element('div', {
			'id': this.options.name + '-Box',
			'styles': {
				'display': 'none',
				'z-index': this.options.zIndex + 2,
				'position': 'absolute',
				'top': '0',
				'left': '0',
				'width': this.options.BoxStyles.width + 'px'
			}
		}).adopt(this.Content);

    this.Overlay.injectInside(document.body);
    this.Box.injectInside(document.body);
    
    
    
    this.preloadImages();
    
		window.addEvent('resize', function() {
			if(this.options.display == 1) {
				this.Overlay.setStyles({
					'height': window.getScrollHeight() + 'px',
					'width': window.getScrollWidth() + 'px'
				});
				this.replaceBox();
			}
		}.bind(this));
		
		window.addEvent('scroll', this.replaceBox.bind(this));
	},

  preloadImages: function() {
  },


	/*
	Property: display
		Show or close box
		
	Argument:
		option - integer, 1 to Show box and 0 to close box (with a transition).
	*/	
	display: function(option){
    //console.log("this.Box =", this.Box);
		if(this.Transition)
    {
			this.Transition.cancel();				
    }
		// Show Box	
		if(this.options.display === 0 && option !== 0 || option === 1) {

      if(Browser.Engine.trident4)
      {
        $$('select', 'object', 'embed').each(function(node){ node.style.visibility = 'hidden';});
      }
      
			this.Overlay.setStyle('display', 'block');
			this.options.display = 1;
			this.fireEvent('onShowStart', [this.Overlay]);

			this.Transition = new Fx.Tween(this.Overlay,
				{
          property: 'opacity',
					duration: this.options.showDuration,
					transition: this.options.showEffect,
					onComplete: function() {

						sizes = window.getSize();
						scrollito = window.getScroll();
						this.Box.setStyles({
                
							'display': 'block',
							'left': (scrollito.x + (sizes.x - this.options.BoxStyles.width) / 2).toInt()
						});

						this.replaceBox();
						this.fireEvent('onShowComplete', [this.Overlay]);

					}.bind(this)
				}
			).start(this.options.OverlayStyles.opacity);

		}
		// Close Box
		else {

      if(Browser.Engine.trident4)
      {
        $$('select', 'object', 'embed').each(function(node){ node.style.visibility = 'visible'; });
      }
      
      this.queue.delay(500,this);

			this.Box.setStyles({
				'display': 'none',
				'top': 0
			});
			this.Content.empty();
			this.options.display = 0;

			this.fireEvent('onCloseStart', [this.Overlay]);

      if(this.i==1) {
        this.Transition = new Fx.Tween(this.Overlay,
          {
            property: 'opacity',
            duration: this.options.closeDuration,
            transition: this.options.closeEffect,
            onComplete: function() {
                this.fireEvent('onCloseComplete', [this.Overlay]);
            }.bind(this)
          }
        ).start(0);
      }

		}			
	},

	/*
	Property: replaceBox
		Move Box in screen center when brower is resize or scroll
	*/
	replaceBox: function() {
		if(this.options.display == 1) {
			sizes = window.getSize();
      scrollito = window.getScroll();

			if(this.MoveBox)
      {
				this.MoveBox.cancel();
			}
      
			this.MoveBox = new Fx.Morph(this.Box, {
				duration: this.options.moveDuration,
				transition: this.options.moveEffect
			}).start({
				'left': (scrollito.x + (sizes.x - this.options.BoxStyles.width) / 2).toInt(),
				'top': (scrollito.y + (sizes.y - this.Box.offsetHeight) / 2).toInt()
			});

		}
	},


	queue: function() {
		this.i--;
		this.callChain();
	},


	/*
	Property: messageBox
		Core system for show all type of box
		
	Argument:
		type - string, 'alert' or 'confirm' or 'prompt'
		message - text to show in the box
		properties - see Options below
		input - text value of default 'input' when prompt
		
	Options:
		textBoxBtnOk - text value of 'Ok' button
		textBoxBtnCancel - text value of 'Cancel' button
		onComplete - a function to fire when return box value
	*/	
	messageBox: function(type, message, properties, input) {

		this.chain(function () {

      properties = $extend({
        'textBoxBtnOk': 'OK',
        'textBoxBtnPrint': 'Print',
        'textBoxBtnCancel': 'Cancel',
        'textBoxInputPrompt': null,
        'password': false,
        'onComplete': $empty
      }, properties || {});


      this.options.onReturnFunction = properties.onComplete;

      this.Buttons = new Element('div', {
        'id': this.options.name + '-Buttons'
      });
      


      if(type == 'alert' || type == 'info' || type == 'error')
      {
          this.AlertBtnOk = new Element('input', {
            'id': 'BoxAlertBtnOk',
            'type': 'submit',
            'value': properties.textBoxBtnOk,
            'styles': {
              'width': '70px'
            }
          });
          
          this.AlertBtnOk.addEvent('click', function() {
            this.options.onReturn = true;
            this.display(0);
          }.bind(this));
        
          if(type == 'alert')
          {
            this.clase = 'BoxAlert';
          }
          else if(type == 'error')
          {
            this.clase = 'BoxError';
          }
          else if(type == 'info')
          {
            this.clase = 'BoxInfo';
          }
        
          this.Content.setProperty('class',this.clase).set('html',message);

          this.AlertBtnOk.injectInside(this.Buttons);

          this.Buttons.injectInside(this.Content);
          this.display(1);
      }
      else if(type == 'iframe')
      {
          this.setWidth(700);
          this.setHeight(400);
           this.ConfirmBtnOk = new Element('input', {
            'id': 'BoxConfirmBtnOk',
            'type': 'submit',
            'value': properties.textBoxBtnOk,
            'styles': {
              'width': '70px'
            }
          });
           
            this.PrintBtnOk = new Element('input', {
            'id': 'BoxPrintBtnOk',
            'type': 'submit',
            'value': properties.textBoxBtnPrint,
            'styles': {
              'width': '70px'
            }
          });
           this.clase = 'BoxIFrame';
        
          this.Content.setProperty('class',this.clase);
          //console.log("this.Content =", this.Content);


                  
          this.ConfirmIFrame = new Element('iframe', {
            'id': 'BoxIFrame',
            'src': message,
            'styles': {
              'border': 'none',
              'width': '100%',
              'height': '350px'
            }
          });

          
          this.ConfirmBtnOk.addEvent('click', function() {
            this.options.onReturn = true;
            this.display(0);
          }.bind(this));

          
          this.PrintBtnOk.addEvent('click', function() {
            this.ConfirmIFrame.focus();
            //console.log("this.ConfirmIFrame =", this.ConfirmIFrame);
            this.ConfirmIFrame.print();
          }.bind(this));
          
          this.ConfirmIFrame.injectInside(this.Content);
          
          this.PrintBtnOk.injectInside(this.Buttons);
          this.ConfirmBtnOk.injectInside(this.Buttons);
          this.Buttons.injectInside(this.Content);
          this.display(1);
          
      }
      else if(type == 'confirm')
      {
          this.ConfirmBtnOk = new Element('input', {
            'id': 'BoxConfirmBtnOk',
            'type': 'submit',
            'value': properties.textBoxBtnOk,
            'styles': {
              'width': '70px'
            }
          });

          this.ConfirmBtnCancel = new Element('input', {
            'id': 'BoxConfirmBtnCancel',
            'type': 'submit',
            'value': properties.textBoxBtnCancel,
            'styles': {
              'width': '70px'
            }
          });

          this.ConfirmBtnOk.addEvent('click', function() {
            this.options.onReturn = true;
            this.display(0);
          }.bind(this));

          this.ConfirmBtnCancel.addEvent('click', function() {
            this.options.onReturn = false;
            this.display(0);
          }.bind(this));

          this.Content.setProperty('class','BoxConfirm').set('html',message);

          this.ConfirmBtnOk.injectInside(this.Buttons);
          this.ConfirmBtnCancel.injectInside(this.Buttons);
          
          this.Buttons.injectInside(this.Content);
          this.display(1);
      }
      else if(type == 'prompt')
      {
          this.PromptBtnOk = new Element('input', {
            'id': 'BoxPromptBtnOk',
            'type': 'submit',
            'value': properties.textBoxBtnOk,
            'styles': {
              'width': '70px'
            }
          });

          this.PromptBtnCancel = new Element('input', {
            'id': 'BoxPromptBtnCancel',
            'type': 'submit',
            'value': properties.textBoxBtnCancel,
            'styles': {
              'width': '70px'
            }
          });
          
          type = properties.password ? 'password' : 'text';
          this.PromptInput = new Element('input', {
            'id': 'BoxPromptInput',
            'type': type,
            'value': input,
            'styles': {
              'width': '250px'
            }
          });

          this.PromptBtnOk.addEvent('click', function() {
            this.options.onReturn = this.PromptInput.value;
            this.display(0);
          }.bind(this));

          this.PromptBtnCancel.addEvent('click', function() {
            this.options.onReturn = false;
            this.display(0);
          }.bind(this));

          this.Content.setProperty('class','BoxPrompt').set('html',message + '<br />');
          this.PromptInput.injectInside(this.Content);
          var Junk = new Element('br').injectInside(this.Content);
          this.PromptBtnOk.injectInside(this.Buttons);
          this.PromptBtnCancel.injectInside(this.Buttons);


          this.Buttons.injectInside(this.Content);

          this.display(1);
      }
      else if(type == 'form')
      {
          this.FormBtnOk = new Element('input', {
            'id': 'BoxFormBtnOk',
            'type': 'submit',
            'value': properties.textBoxBtnOk,
            'styles': {
              'width': '70px'
            }
          });

          this.FormBtnCancel = new Element('input', {
            'id': 'BoxFormBtnCancel',
            'type': 'submit',
            'value': properties.textBoxBtnCancel,
            'styles': {
              'width': '70px'
            }
          });
          
          this.FormForm = new Element('form', {
            'id': 'BoxFormForm',
            'class':'form',
            'styles': {
              //'width': '250px'
            }
          });
          
          this.FormBtnOk.addEvent('click', function() {
            this.options.onReturn = this.FormForm.getValues();
            this.display(0);
          }.bind(this));

          this.FormBtnCancel.addEvent('click', function() {
            this.options.onReturn = false;
            this.display(0);
          }.bind(this));

          this.FormForm.addEvent('submit', function(event) {
            event.preventDefault();
            this.options.onReturn = this.FormForm.getValues();
            this.display(0);
          }.bind(this));

          //this.Content.setProperty('class','BoxForm').set('html',message );
          this.Content.setProperty('class','BoxForm');
          this.FormForm.set('html',message );
          this.FormForm.injectInside(this.Content);
          Junk = new Element('br').injectInside(this.Content);
          this.FormBtnOk.injectInside(this.Buttons);
          this.FormBtnCancel.injectInside(this.Buttons);


          this.Buttons.injectInside(this.Content);
          //TODO: Could probably use the input to poputale the fields,
          this.display(1);
      }
      
      else
      {
          this.options.onReturn = false;
          this.display(0);		
      }

    });

		this.i++;

		if(this.i==1)
    {
      this.callChain();
    }
	},

	/*
	Property: alert
		Shortcut for alert
		
	Argument:
		properties - see Options in messageBox
	*/		
	alert: function(message, properties){
		this.messageBox('alert', message, properties);
	},

	/*
	Property: info
		Shortcut for alert info
		
	Argument:
		properties - see Options in messageBox
	*/		
	info: function(message, properties){
		this.messageBox('info', message, properties);
	},

	/*
	Property: error
		Shortcut for alert error
		
	Argument:
		properties - see Options in messageBox
	*/		
	error: function(message, properties){
		this.messageBox('error', message, properties);
	},

	/*
	Property: confirm
		Shortcut for confirm
		
	Argument:
		properties - see Options in messageBox
	*/
	confirm: function(message, properties){
		this.messageBox('confirm', message, properties);
	},

  /*
	Property: iframe
		Shortcut for iframe
		
	Argument:
		properties - see Options in messageBox
	*/
	iframe: function(message, properties){
		this.messageBox('iframe', message, properties);
	},
  
  
  
  /*
	Property: form
		Shortcut for form
		
	Argument:
		properties - see Options in messageBox
	*/
	form: function(message, properties){
		this.messageBox('form', message, properties);
	},
  
  
	/*
	Property: prompt
		Shortcut for prompt
		
	Argument:
		properties - see Options in messageBox
	*/	
	prompt: function(message, input, properties){
		this.messageBox('prompt', message, properties, input);
	}
});

SexyAlertBox.implement(new Events(), new Options());