/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.ux.RangeField = Ext.extend(Ext.form.Field,  {

	defaultType : "numberfield",

	allowDecimals : true,

	decimalPrecision : 2 ,

	allowNegative : true,

	emptyText : "",

	seperator : ",",

    initComponent : function(){
        Ext.ux.RangeField.superclass.initComponent.call(this);

		var type = this.initialConfig.defaultType||this.defaultType;

		switch(type.toLowerCase()){
			case "numberfield":
			    var numberfieldCfg = {
			        allowDecimals:this.allowDecimals,
			        decimalPrecision:this.decimalPrecision,
			        allowNegative:this.allowNegative,
				blankText:this.blankText,
			        listeners: {
			             change:{
			                fn:function(){
			                    this.fireEvent('change');
			                },
			                scope:this
			             }
			        }
			    }
				this.c1 = new Ext.form.NumberField(numberfieldCfg);
				this.c2 = new Ext.form.NumberField(numberfieldCfg);
				break;
			case "combo":
				var comboCfg = {
					editable:false,
					mode:"local",
					triggerAction:"all",
					displayField:this.displayField||"",
					valueField:this.valueField||"",
					blankText:this.blankText,
					emptyText:this.emptyText,
					store:this.store,
			        listeners: {
			             change:{
			                fn:function(){
			                    this.fireEvent('change');
			                },
			                scope:this
			             }
			        }
				};

				this.c1 = new Ext.form.ComboBox(comboCfg);
				this.c2 = new Ext.form.ComboBox(comboCfg);
				break;
			case "datefield":
				var dateCfg = {
                    format:'Y-m-d',
					blankText:this.blankText,
					emptyText:this.emptyText,
			        listeners: {
			             change:{
			                fn:function(){
			                    this.fireEvent('change');
			                },
			                scope:this
			             }
			        }
				};
				this.c1 = new Ext.form.DateField(dateCfg);
				this.c2 = new Ext.form.DateField(dateCfg);
				break;
			default:
				break;
		}
                this.c2.name=this.name+"_top";
                this.c1.name=this.name+"_bottom";
        this.addEvents(
            'change'
        );
    },

    // private
    initEvents : function(){
        Ext.ux.RangeField.superclass.initEvents.call(this);
    },

    // private
    onRender : function(ct, position){
	    Ext.ux.RangeField.superclass.onRender.call(this, ct, position);

		if(!this.wrap){

			this.el.dom.style.border = '0 none';
			this.el.dom.setAttribute('tabIndex', -1);
			this.el.addClass('x-hidden');

			this.wrap = this.el.wrap({
				cls:'x-form-rangefield-wrap'
			});

			this.control1 = this.wrap.createChild({cls:'x-form-rangefield-control'},this.el);
			this.sp = this.wrap.createChild({cls:'x-form-rangefield-split'},this.el).update('-');
			this.control2 = this.wrap.createChild({cls:'x-form-rangefield-control'},this.el);


			var w = this.wrap.getComputedWidth();
			var sw = this.sp.getComputedWidth();


			this.control1.setWidth((w-sw)/2);
			this.control2.setWidth((w-sw)/2);

			this.c1.render(this.control1);
			this.c2.render(this.control2);

		}

	},


    onResize : function(w, h){
        Ext.ux.RangeField.superclass.onResize.apply(this, arguments);
        if(this.wrap){

            if(typeof w == 'number'){
                var aw = w - this.wrap.getFrameWidth('lr');
				var sw = this.sp.getComputedWidth();

				var fix = 0;
				if(Ext.isIE){ // fix IE 1px bogus margin
					fix = 4;
				}

				this.wrap.setWidth(aw);

				this.control1.setWidth((aw-sw)/2);
				this.control2.setWidth((aw-sw)/2);

				this.c1.setWidth((aw-sw)/2+fix);
				this.c2.setWidth((aw-sw)/2+fix);
            }
        }
    },

    // private
    onEnable : function(){
        Ext.ux.RangeField.superclass.onEnable.call(this);
		this.c1.setDisabled(this.disabled);
		this.c2.setDisabled(this.disabled);
    },

    // private
    onDisable : function(){
        Ext.ux.RangeField.superclass.onDisable.call(this);
		this.c1.setDisabled(this.disabled);
		this.c2.setDisabled(this.disabled);
    },
    //private
	onDestroy : function(){
        if(this.rendered){
            Ext.destroy(this.control1,this.sp,this.control2,this.wrap);
        }
        Ext.ux.RangeField.superclass.onDestroy.call(this);
	},

	setValue : function(v){
		var value = v.split(this.seperator);

		if(value.length>=2&&this.c1&&this.c2){
			this.c1.setValue(value[0])
			this.c2.setValue(value[1])
		}
	},

	setDisabled : function(v){
        Ext.ux.RangeField.superclass.setDisabled.call(this);

		this["on" + (v?"Disable":"Enable")]();
	},

	getValue : function(){
		if(this.c1&&this.c2){
			return [this.c1.getValue(),this.c2.getValue()].join(this.seperator);
		}else{
			return this.value;
		}
	},

	getMinValue : function(){
		return this.c1.getValue();
	},

	getMaxValue : function(){
		return this.c2.getValue();
	}

});

Ext.reg('rangefield', Ext.ux.RangeField);
