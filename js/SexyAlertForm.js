var SexyAlertForm = new Class({
		Extends: SexyAlertBox,
		initialize: function(options) {
			options = (options || {});
			if(! ('name' in options))
				options.name = 'SexyAlertForm';
			this.parent(options);
		},
		form: function(message, properties, input)
		{
			
			this.chain(function () {
					properties = $extend
					(
						{
							'textBoxBtnOk': 'OK',
							'textBoxBtnPrint': 'Print',
							'textBoxBtnCancel': 'Cancel',
							'textBoxInputPrompt': null,
							'password': false,
							'onComplete': $empty,
							'formsubmits': false
						},
						properties || {}
						);
					
					this.options.onReturnFunction = properties.onComplete;
					
					this.ContenedorBotones = new Element('div', {
							'id': this.options.name + '-Buttons'
					});
					
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
					
					if(!this.options.formsubmits)
					{
						this.FormBtnOk.addEvent('click', function() {
								this.options.onReturn = this.FormForm.getValues();
								this.display(0);
						}.bind(this));
						
						this.FormForm.addEvent('submit', function(event) {
								event.preventDefault();
								this.options.onReturn = this.FormForm.getValues();
								this.display(0);
						}.bind(this));
					}
					
					this.FormBtnCancel.addEvent('click', function() {
							this.options.onReturn = false;
							this.display(0);
					}.bind(this));
					
					
					//this.Content.setProperty('class','BoxForm').set('html',message );
					this.Content.setProperty('class','BoxForm');
					this.FormForm.set('html',message );
					this.FormForm.injectInside(this.Content);
					var Junk = new Element('br').injectInside(this.Content);
					this.FormBtnOk.injectInside(this.ContenedorBotones);
					this.FormBtnCancel.injectInside(this.ContenedorBotones);
					
					
					this.ContenedorBotones.injectInside(this.Content);
					//TODO: Could probably use the input to poputale the fields,
					this.display(1);
			});
			this.i++;
			
			if(this.i==1)
			{
				this.callChain();
			}
		},
});

var oSexyAlertForm;

window.addEvent('domready', function() {
		oSexyAlertForm = new SexyAlertForm();
});
