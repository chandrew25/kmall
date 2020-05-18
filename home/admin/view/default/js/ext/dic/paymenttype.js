Ext.namespace("Kmall.Admin.Paymenttype");
Km = Kmall.Admin.Paymenttype;
Km.Paymenttype={
	/**
	 * 全局配置
	 */
	Config:{
		/**
		 *分页:每页显示记录数
		 */
		PageSize:100,
		/**
		 *显示配置
		 */
		View:{
			/**
			 * 显示支付方式的视图相对支付方式列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示支付方式信息页(或者打开新窗口)
			 */
			IsFix:0
		}
	},
	/**
	 * Cookie设置
	 */
	Cookie:new Ext.state.CookieProvider(),
	/**
	 * 初始化
	 */
	Init:function(){
		if (Km.Paymenttype.Cookie.get('View.Direction')){
			Km.Paymenttype.Config.View.Direction=Km.Paymenttype.Cookie.get('View.Direction');
		}
		if (Km.Paymenttype.Cookie.get('View.IsFix')!=null){
			Km.Paymenttype.Config.View.IsFix=Km.Paymenttype.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Paymenttype.Store = {
	/**
	 * 支付方式
	 */
	paymenttypeStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
                {name: 'paymenttype_id',type: 'string'},
                {name: 'paymenttype_code',type: 'string'},
                {name: 'name',type: 'string'},
                {name: 'description',type: 'string'},
                {name: 'value',type: 'string'},
                {name: 'issetup',type: 'string'},
                {name: 'pay_fee',type: 'string'},
                {name: 'ico',type: 'string'},
                {name: 'level',type: 'string'},
                {name: 'parent_id',type: 'string'},
                {name: 'sort_order',type: 'int'},
                {name: 'notifyurl',type: 'string'},
                {name: 'pageurl',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					Ext.apply(options.params, Km.Paymenttype.View.Running.paymenttypeGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:支付方式显示组件
 */
Km.Paymenttype.View={
	/**
	 * 编辑窗口：新建或者修改支付方式
	 */
	EditWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 自定义类型:保存类型
				 * 0:保存窗口,1:修改窗口
				 */
				savetype:0,
				closeAction : "hide",
				constrainHeader:true,maximizable: true,collapsible: true,
				width : 450,height : 550,minWidth : 400,minHeight : 450,
				layout : 'fit',plain : true,buttonAlign : 'center',
				defaults : {
					autoScroll : true
				},
				listeners:{
					beforehide:function(){
						this.editForm.form.getEl().dom.reset();
					},
					afterrender:function(){
						ckeditor_replace_description();
					}
				},
				items : [
					new Ext.form.FormPanel({
                        //fileUpload : true 上传文件
						ref:'editForm',layout:'form',fileUpload : true,
						labelWidth : 100,labelAlign : "center",
						bodyStyle : 'padding:5px 5px 0',align : "center",
						api : {},
						defaults : {
							xtype : 'textfield',anchor:'98%'
						},
						items : [
                            {xtype: 'hidden',name : 'paymenttype_id',ref:'../paymenttype_id'},
                            {fieldLabel : '名称',name : 'name',id : 'name_read'},
                            {xtype: 'hidden',  name : 'ico',ref:'../ico'},
                            {fieldLabel : '登录图标',name : 'icoUpload',ref:'../icoUpload',xtype:'fileuploadfield',
                              emptyText: '请上传登录图标文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {fieldLabel : '描述',name : 'description',xtype : 'textarea',id:'description',ref:'description',allowBlank : false},
                            {fieldLabel : '手续费',name : 'pay_fee',allowBlank : false,xtype : 'numberfield'},
                            {fieldLabel : '排序',name : 'sort_order',xtype : 'numberfield'}
						]
					})
				],
				buttons : [ {
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {
                        switch (Km.Paymenttype.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Paymenttype.View.EditWindow.KindEditor_description)this.editForm.description.setValue(Km.Paymenttype.View.EditWindow.KindEditor_description.html());
                                break
                            case 3:
                                if (xhEditor_description)this.editForm.description.setValue(xhEditor_description.getSource());
                                break
                            default:
                                if (CKEDITOR.instances.description) this.editForm.description.setValue(CKEDITOR.instances.description.getData());
                        }
						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;
						if (this.savetype==0){
							this.editForm.api.submit=ExtServicePaymenttype.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Paymenttype.View.Running.paymenttypeGrid.doSelectPaymenttype();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
                            //提取配置文件的值
                            var value="";
                            var form=Km.Paymenttype.View.Running.edit_window.editForm;
                            for(var i=0;i<100;i++){
                                var com=form.get("com"+i);
                                if(!com){//如果找不到元素则停止查找
                                    break;
                                }
                                if(i>0){
                                    value+="&"+com.getName()+"="+com.getValue();
                                }else{
                                    value+=com.getName()+"="+com.getValue();
                                }
                            }
							this.editForm.api.submit=ExtServicePaymenttype.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Paymenttype.View.Running.paymenttypeGrid.doSelectPaymenttype();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}
					}
				}, {
					text : "取 消",scope:this,
					handler : function() {
						this.hide();
					}
				}, {
					text : "重 置",ref:'../resetBtn',scope:this,
					handler : function() {
						this.editForm.form.loadRecord(Km.Paymenttype.View.Running.paymenttypeGrid.getSelectionModel().getSelected());
						if (CKEDITOR.instances.description){
							CKEDITOR.instances.description.setData(Km.Paymenttype.View.Running.paymenttypeGrid.getSelectionModel().getSelected().data.description);
						}
                        this.icoUpload.setValue(this.ico.getValue());
					}
				}]
			}, config);
			Km.Paymenttype.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示支付方式详情
	 */
	PaymenttypeView:{
		/**
		 * Tab页：容器包含显示与支付方式所有相关的信息
		 */
		Tabs:Ext.extend(Ext.TabPanel,{
			constructor : function(config) {
				config = Ext.apply({
					region : 'south',
					collapseMode : 'mini',split : true,
					activeTab: 1, tabPosition:"bottom",resizeTabs : true,
					header:false,enableTabScroll : true,tabWidth:'auto', margins : '0 3 3 0',
					defaults : {
						autoScroll : true
					},
					listeners:{
						beforetabchange:function(tabs,newtab,currentTab){
							if (tabs.tabFix==newtab){
								if (Km.Paymenttype.View.Running.paymenttypeGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择支付方式！');
									return false;
								}
								Km.Paymenttype.Config.View.IsShow=1;
								Km.Paymenttype.View.Running.paymenttypeGrid.showPaymenttype();
								Km.Paymenttype.View.Running.paymenttypeGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Paymenttype.View.PaymenttypeView.Tabs.superclass.constructor.call(this, config);
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Paymenttype.Config.View.Direction==1)||(Km.Paymenttype.Config.View.Direction==2)){
					this.width =Ext.getBody().getViewSize().width;
					this.height=Ext.getBody().getViewSize().height/2;
				}else{
					this.width =Ext.getBody().getViewSize().width/2;
					this.height=Ext.getBody().getViewSize().height;
				}
				this.ownerCt.setSize(this.width,this.height);
				if (this.ownerCt.collapsed)this.ownerCt.expand();
				this.ownerCt.collapsed=false;
			},
			onAddItems:function(){
				this.add(
					{title: '基本信息',ref:'tabPaymenttypeDetail',iconCls:'tabs',
					 tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">支付方式代码</td><td class="content">{paymenttype_code}</td></tr>',
                         '    <tr class="entry"><td class="head">名称</td><td class="content">{name}</td></tr>',
                         '    <tr class="entry"><td class="head">描述</td><td class="content">{description}</td></tr>',
                         '    <tr class="entry"><td class="head">是否安装</td><td class="content"><tpl if="issetup == true">是</tpl><tpl if="issetup == false">否</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">手续费</td><td class="content">{pay_fee}</td></tr>',
                         '    <tr class="entry"><td class="head">图标</td><td class="content"><tpl if="ico"><img src="upload/images/{ico}" /></tpl></td></tr>',
                         '    <tpl if="level&gt;1"><tr class="entry"><td class="head">浏览器回调地址</td><td class="content">{pageurl}</td></tr><tr class="entry"><td class="head">商户后台回调地址</td><td class="content">{notifyurl}</td></tr></tpl>',
                         '    <tr class="entry"><td class="head">排序</td><td class="content">{sort_order}</td></tr>',
                         '</table>'
					 ]
					}
				);
			}
		}),
		/**
		 * 窗口:显示支付方式信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看支付方式",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Paymenttype.View.PaymenttypeView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Paymenttype.Config.View.IsShow=0;
							Km.Paymenttype.View.Running.paymenttypeGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Paymenttype.Config.View.IsShow=0;
							Km.Paymenttype.View.Running.paymenttypeGrid.tvpView.toggle(false);
						}
					}
				}, config);
				Km.Paymenttype.View.PaymenttypeView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 视图：支付方式列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Paymenttype.Store.paymenttypeStore,
				sm : this.sm,
				frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
				loadMask : true,stripeRows : true,headerAsText : false,
				defaults : {
					autoScroll : true
				},
				cm : new Ext.grid.ColumnModel({
					defaults:{
						width:120,sortable : true
					},
					columns : [
						{header : '支付方式代码',dataIndex : 'paymenttype_code'},
						{header : '名称',dataIndex : 'name'},
                        {header : '是否安装',dataIndex : 'issetup',renderer:function(value){if (value == true) {return "<font color=green>是</font>";}else{return "<font color=red>否</font>";}}},
						{header : '手续费',dataIndex : 'pay_fee'},
						{header : '描述',dataIndex : 'description'},
						{header : '排序',dataIndex : 'sort_order'}
					]
				}),
				tbar : {
					xtype : 'container',layout : 'anchor',
					height : 27,style:'font-size:14px',
					defaults : {
						height : 27,anchor : '100%'
					},
					items : [
						new Ext.Toolbar({
							defaults:{
							  scope: this
							},
							items : [
								{
									text : '安装',iconCls : 'icon-add',ref: '../../btnInstall',disabled : true,
									handler : function() {
										this.installPaymenttype();
									}
								},'-',{
									text : '编辑',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updatePaymenttype();
									}
								},'-',{
									text : '卸载', ref: '../../btnUnload',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.unloadPaymenttype();
									}
								},'-',{
									xtype:'tbsplit',text: '查看支付方式', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showPaymenttype()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hidePaymenttype();Km.Paymenttype.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Paymenttype.Cookie.set('View.IsFix',Km.Paymenttype.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				}
			}, config);
			//初始化显示支付方式列表
			this.doSelectPaymenttype();
			Km.Paymenttype.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的支付方式信息Tab页
			Km.Paymenttype.View.Running.viewTabs=new Km.Paymenttype.View.PaymenttypeView.Tabs();
			this.addListener('rowdblclick', this.onRowDoubleClick);
		},
		/**
		 * 行选择器
		 */
		sm : new Ext.grid.CheckboxSelectionModel({
			//handleMouseDown : Ext.emptyFn,
			listeners : {
				selectionchange:function(sm) {
					// 判断更新和详情按钮是否可以激活
                    this.grid.tvpView.setDisabled(sm.getCount() != 1);
                    this.grid.btnUpdate.setDisabled(sm.getCount() != 1);
				},
				rowselect: function(sm, rowIndex, record) {
					this.grid.updateViewPaymenttype();
					if (sm.getCount() > 1){
                        this.grid.btnUpdate.setDisabled(true);
                        this.grid.tvpView.setDisabled(true);
                        this.grid.btnInstall.setDisabled(false);
                        this.grid.btnUnload.setDisabled(false);
						this.grid.hidePaymenttype();
						Km.Paymenttype.Config.View.IsShow=0;
					}else if(sm.getCount() == 1){
                        this.grid.tvpView.setDisabled(false);
                        this.grid.btnUpdate.setDisabled(false);
                        var data=this.grid.getSelectionModel().getSelected().data;
                        if(data.issetup=="1"){
                            this.grid.btnInstall.setDisabled(true);
                            this.grid.btnUnload.setDisabled(false);
                        }else{
                            this.grid.btnInstall.setDisabled(false);
                            this.grid.btnUnload.setDisabled(true);
                        }
                        if (Km.Paymenttype.View.IsSelectView==1){
                            Km.Paymenttype.View.IsSelectView=0;
                            this.grid.showPaymenttype();
                        }
                    }else{
                        this.grid.btnInstall.setDisabled(true);
                        this.grid.btnUnload.setDisabled(true);
                        this.grid.btnUpdate.setDisabled(true);
                        this.grid.tvpView.setDisabled(true);
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Paymenttype.Config.View.IsShow==1){
							Km.Paymenttype.View.IsSelectView=1;
						}
						this.grid.hidePaymenttype();
						Km.Paymenttype.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Paymenttype.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showPaymenttype();
				this.tvpView.toggle(true);
			}else{
				this.hidePaymenttype();
				Km.Paymenttype.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Paymenttype.Config.View.IsFix=1;
			}else{
			   Km.Paymenttype.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Paymenttype.Config.View.IsShow=0;
				return ;
			}
			if (Km.Paymenttype.Config.View.IsShow==1){
			   this.hidePaymenttype();
			   Km.Paymenttype.Config.View.IsShow=0;
			}
			this.showPaymenttype();
		},
		/**
		 * 反选
		 */
		onReverseSelect:function() {
			for (var i = this.getView().getRows().length - 1; i >= 0; i--) {
				if (this.sm.isSelected(i)) {
					this.sm.deselectRow(i);
				}else {
					this.sm.selectRow(i, true);
				}
			}
		},
		/**
		 * 查询符合条件的支付方式
		 */
		doSelectPaymenttype : function() {
            this.filter = "";
            var condition = {'start':0,'limit':Km.Paymenttype.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServicePaymenttype.queryPagePaymenttype(condition,function(provider, response) {
                window.xml=response.result.xml;//保存配置文件信息
                if (response.result&&response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Paymenttype.Store.paymenttypeStore.loadData(result);
                } else {
                    Km.Paymenttype.Store.paymenttypeStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的支付方式！');
                }
            });
		},
		/**
		 * 显示支付方式视图
		 * 显示支付方式的视图相对支付方式列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Paymenttype.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Paymenttype.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Paymenttype.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Paymenttype.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Paymenttype.View.Running.viewTabs);
					break;
			}
			Km.Paymenttype.Cookie.set('View.Direction',Km.Paymenttype.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Paymenttype.Config.View.IsFix==0)&&(Km.Paymenttype.Config.View.IsShow==1)){
					this.showPaymenttype();
				}
				Km.Paymenttype.Config.View.IsFix=1;
				Km.Paymenttype.View.Running.paymenttypeGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Paymenttype.Config.View.IsShow=0;
				this.showPaymenttype();
			}
		},
		/**
		 * 显示支付方式
		 */
		showPaymenttype : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择支付方式！');
				Km.Paymenttype.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Paymenttype.Config.View.IsFix==0){
				if (Km.Paymenttype.View.Running.view_window==null){
					Km.Paymenttype.View.Running.view_window=new Km.Paymenttype.View.PaymenttypeView.Window();
				}
				if (Km.Paymenttype.View.Running.view_window.hidden){
					Km.Paymenttype.View.Running.view_window.show();
					Km.Paymenttype.View.Running.view_window.winTabs.hideTabStripItem(Km.Paymenttype.View.Running.view_window.winTabs.tabFix);
					this.updateViewPaymenttype();
					this.tvpView.toggle(true);
					Km.Paymenttype.Config.View.IsShow=1;
				}else{
					this.hidePaymenttype();
					Km.Paymenttype.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Paymenttype.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Paymenttype.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Paymenttype.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Paymenttype.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Paymenttype.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Paymenttype.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Paymenttype.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Paymenttype.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Paymenttype.View.Running.viewTabs);
					}
					break;
			}
			this.hidePaymenttype();
			if (Km.Paymenttype.Config.View.IsShow==0){
				Km.Paymenttype.View.Running.viewTabs.enableCollapse();
				switch(Km.Paymenttype.Config.View.Direction){
					case 1:
						this.ownerCt.north.show();
						break;
					case 2:
						this.ownerCt.south.show();
						break;
					case 3:
						this.ownerCt.west.show();
						break;
					case 4:
						this.ownerCt.east.show();
						break;
				}
				this.updateViewPaymenttype();
				this.tvpView.toggle(true);
				Km.Paymenttype.Config.View.IsShow=1;
			}else{
				Km.Paymenttype.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏支付方式
		 */
		hidePaymenttype : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Paymenttype.View.Running.view_window!=null){
				Km.Paymenttype.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前支付方式显示信息
		 */
		updateViewPaymenttype : function() {
			if (Km.Paymenttype.View.Running.view_window!=null){
				Km.Paymenttype.View.Running.view_window.winTabs.tabPaymenttypeDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Paymenttype.View.Running.viewTabs.tabPaymenttypeDetail.update(this.getSelectionModel().getSelected().data);
            //调用路径
            var data=Km.Paymenttype.View.Running.paymenttypeGrid.getSelectionModel().getSelected().data;
            for(var i=0;i<xml.payment.length;i++){
                if(xml.payment[i].code==data.paymenttype_code){
                    data.pageurl=xml.payment[i].pageurl;
                    data.notifyurl=xml.payment[i].notifyurl;
                    break;
                }
            }
		},
        /**
         * 安装支付方式
         */
        installPaymenttype : function() {
            var somedata=Km.Paymenttype.View.Running.paymenttypeGrid.getSelectionModel().getSelections();
            var paymenttype_ids ="";
            for (var flag = 0; flag < somedata.length; flag++) {
                paymenttype_ids=paymenttype_ids+somedata[flag].data.paymenttype_id+",";
            }
            ExtServicePaymenttype.installPaymenttype(paymenttype_ids,function(provider, response) {
                var grid=Km.Paymenttype.View.Running.paymenttypeGrid;
                //批量改变store值
                for(i=0;i<somedata.length;i++){
                    somedata[i].data.issetup="1";
                }
                //grid刷新值
                grid.getView().refresh();
                grid.btnInstall.setDisabled(true);
                grid.btnUnload.setDisabled(false);
                grid.updateViewPaymenttype();
            });
        },
        /**
         * 卸载支付方式
         */
        unloadPaymenttype : function() {
            var somedata=Km.Paymenttype.View.Running.paymenttypeGrid.getSelectionModel().getSelections();
            var paymenttype_ids ="";
            for (var flag = 0; flag < somedata.length; flag++) {
                paymenttype_ids=paymenttype_ids+somedata[flag].data.paymenttype_id+",";
            }
            ExtServicePaymenttype.unloadPaymenttype(paymenttype_ids,function(provider, response) {
                var grid=Km.Paymenttype.View.Running.paymenttypeGrid;
                //批量改变store值
                for(i=0;i<somedata.length;i++){
                    somedata[i].data.issetup="0";
                }
                //grid刷新值
                grid.getView().refresh();
                grid.btnInstall.setDisabled(false);
                grid.btnUnload.setDisabled(true);
                grid.updateViewPaymenttype();
            });
        },
		/**
		 * 编辑支付方式时先获得选中的支付方式信息
		 */
		updatePaymenttype : function() {
            if (Km.Paymenttype.View.Running.edit_window==null){
                Km.Paymenttype.View.Running.edit_window=new Km.Paymenttype.View.EditWindow();
            }
            //获取选中的支付方式
            var payment={};
            var data=Km.Paymenttype.View.Running.paymenttypeGrid.getSelectionModel().getSelected().data;
            for(var i=0;i<xml.payment.length;i++){
                if(xml.payment[i].code==data.paymenttype_code){
                    payment=xml.payment[i];
                    break;
                }
            }
            //取得存放数据库的值
            var value={};
            var arv=data.value.split("&");
            for(var i=0;i<arv.length;i++){
                var v=arv[i].split("=");
                value[v[0]]=v[1];
            }
            var form=Km.Paymenttype.View.Running.edit_window.editForm;
            //删除之前添加的表单元素
            for(var i=0;i<100;i++){
                var com=form.get("com"+i);
                if(!com){//如果找不到元素则停止查找
                    break;
                }
                form.remove(com);
            }
            //根据配置信息添加表单元素
            if(payment.attr&&(payment.code=="shengpay"||payment.code=="alipay")){
                for(var i=0;i<payment.attr.length;i++){
                    var attr=payment.attr[i],com,ini=2;
                    if(attr.type=="input"){
                        com=new Ext.form.TextField({
                            id:"com"+i,
                            anchor:'98%',
                            allowBlank:false,
                            fieldLabel:attr.show+"(<font color=red>*</font>)",
                            name:attr.name
                        });
                    }
                    com.setValue(value[attr.name]);//赋值
                    form.items.insert(ini+i,com);//按顺序插入指定位置
                }
            }
            if(data.level!=1){
                Km.Paymenttype.View.Running.edit_window.icoUpload.hide();
            }else{
                Km.Paymenttype.View.Running.edit_window.icoUpload.show();
            }

            Km.Paymenttype.View.Running.edit_window.doLayout();//重新布局

            Km.Paymenttype.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Paymenttype.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Paymenttype.View.Running.edit_window.setTitle('编 辑');
            Km.Paymenttype.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Paymenttype.View.Running.edit_window.icoUpload.setValue(Km.Paymenttype.View.Running.edit_window.ico.getValue());
            Km.Paymenttype.View.Running.edit_window.savetype=1;
            switch (Km.Paymenttype.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Paymenttype.View.EditWindow.KindEditor_description) Km.Paymenttype.View.EditWindow.KindEditor_description.html(this.getSelectionModel().getSelected().data.description);
                    break
                case 3:
                    if (xhEditor_description)xhEditor_description.setSource(this.getSelectionModel().getSelected().data.description);
                    break
                default:
                    if (CKEDITOR.instances.description) CKEDITOR.instances.description.setData(this.getSelectionModel().getSelected().data.description);
            }
            Km.Paymenttype.View.Running.edit_window.show();
            Km.Paymenttype.View.Running.edit_window.maximize();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Paymenttype.View.Running.paymenttypeGrid=new Km.Paymenttype.View.Grid();
			if (Km.Paymenttype.Config.View.IsFix==0){
				Km.Paymenttype.View.Running.paymenttypeGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Paymenttype.View.Running.paymenttypeGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Paymenttype.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Paymenttype.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前支付方式Grid对象
		 */
		paymenttypeGrid:null,
		/**
		 * 显示支付方式信息及关联信息列表的Tab页
		 */
		viewTabs:null,
		/**
		 * 当前创建的编辑窗口
		 */
		edit_window:null,
		/**
		 * 当前的显示窗口
		 */
		view_window:null
	}
};
/**
 * Controller:主程序
 */
Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.state.Manager.setProvider(Km.Paymenttype.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Paymenttype.Init();
	/**
	 * 支付方式数据模型获取数据Direct调用
	 */
	Km.Paymenttype.Store.paymenttypeStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServicePaymenttype.queryPagePaymenttype}
	});
	/**
	 * 支付方式页面布局
	 */
	Km.Paymenttype.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Paymenttype.View.Panel()]
	});
	Km.Paymenttype.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});
