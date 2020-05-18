Ext.namespace("Kmall.Admin.Deliverytype");
Km = Kmall.Admin.Deliverytype;
Km.Deliverytype={
	/**
	 * 全局配置
	 */
	Config:{
		/**
		 *分页:每页显示记录数
		 */
		PageSize:15,
		/**
		 *显示配置
		 */
		View:{
			/**
			 * 显示配送方式的视图相对配送方式列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示配送方式信息页(或者打开新窗口)
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
		if (Km.Deliverytype.Cookie.get('View.Direction')){
			Km.Deliverytype.Config.View.Direction=Km.Deliverytype.Cookie.get('View.Direction');
		}
		if (Km.Deliverytype.Cookie.get('View.IsFix')!=null){
			Km.Deliverytype.Config.View.IsFix=Km.Deliverytype.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Deliverytype.Store = {
	/**
	 * 配送方式
	 */
	deliverytypeStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				{name: 'deliverytype_id',type: 'string'},
				{name: 'deliverytype_code',type: 'string'},
				{name: 'name',type: 'string'},
				{name: 'description',type: 'string'},
				{name: 'insure',type: 'string'},
				{name: 'supportcod',type: 'string'},
				{name: 'fee',type: 'float'},
				{name: 'free_fee',type: 'float'},
				{name: 'inassurance_fee',type: 'float'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					Ext.apply(options.params, Km.Deliverytype.View.Running.deliverytypeGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:配送方式显示组件
 */
Km.Deliverytype.View={
	/**
	 * 编辑窗口：新建或者修改配送方式
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
					}
				},
				items : [
					new Ext.form.FormPanel({
						ref:'editForm',layout:'form',
						labelWidth : 100,labelAlign : "center",
						bodyStyle : 'padding:5px 5px 0',align : "center",
						api : {},
						defaults : {
							xtype : 'textfield',anchor:'100%'
						},
						items : [
							{xtype: 'hidden',  name : 'deliverytype_id',ref:'../deliverytype_id'},
							{fieldLabel : '付款方式代码(<font color=red>*</font>)',name : 'deliverytype_code',allowBlank : false},
							{fieldLabel : '名称(<font color=red>*</font>)',name : 'name',allowBlank : false},
							{fieldLabel : '描述(<font color=red>*</font>)',name : 'description',allowBlank : false},
							{fieldLabel : '是否使用(<font color=red>*</font>)',hiddenName : 'insure',allowBlank : false,xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '否'], ['1', '是']]
								}),emptyText: '请选择是否使用',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							{fieldLabel : '支持货到付款(<font color=red>*</font>)',hiddenName : 'supportcod',allowBlank : false,xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '否'], ['1', '是']]
								}),emptyText: '请选择支持货到付款',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							{fieldLabel : '费用',name : 'fee'},
							{fieldLabel : '免费额度',name : 'free_fee'},
							{fieldLabel : '保价费用',name : 'inassurance_fee'}
						]
					})
				],
				buttons : [ {
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {
						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;

						if (this.savetype==0){
							this.editForm.api.submit=ExtServiceDeliverytype.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Deliverytype.View.Running.deliverytypeGrid.doSelectDeliverytype();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceDeliverytype.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Deliverytype.View.Running.deliverytypeGrid.doSelectDeliverytype();
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
						this.editForm.form.loadRecord(Km.Deliverytype.View.Running.deliverytypeGrid.getSelectionModel().getSelected());

					}
				}]
			}, config);
			Km.Deliverytype.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示配送方式详情
	 */
	DeliverytypeView:{
		/**
		 * Tab页：容器包含显示与配送方式所有相关的信息
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
								if (Km.Deliverytype.View.Running.deliverytypeGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择配送方式！');
									return false;
								}
								Km.Deliverytype.Config.View.IsShow=1;
								Km.Deliverytype.View.Running.deliverytypeGrid.showDeliverytype();
								Km.Deliverytype.View.Running.deliverytypeGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Deliverytype.View.DeliverytypeView.Tabs.superclass.constructor.call(this, config);
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Deliverytype.Config.View.Direction==1)||(Km.Deliverytype.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabDeliverytypeDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">',
						 '<tr class="entry"><td class="head">付款方式代码 :</td><td class="content">{deliverytype_code}</td></tr>',
						 '<tr class="entry"><td class="head">名称 :</td><td class="content">{name}</td></tr>',
						 '<tr class="entry"><td class="head">描述 :</td><td class="content">{description}</td></tr>',
						 '<tr class="entry"><td class="head">是否使用 :</td><td class="content">{insure}</td></tr>',
						 '<tr class="entry"><td class="head">支持货到付款 :</td><td class="content">{supportcod}</td></tr>',
						 '<tr class="entry"><td class="head">费用 :</td><td class="content">{fee}</td></tr>',
						 '<tr class="entry"><td class="head">免费额度 :</td><td class="content">{free_fee}</td></tr>',
						 '<tr class="entry"><td class="head">保价费用 :</td><td class="content">{inassurance_fee}</td></tr>',
					 '</table>'
					 ]
					}
				);
				this.add(
					{title: '其他',iconCls:'tabs'}
				);
			}
		}),
		/**
		 * 窗口:显示配送方式信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看配送方式",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Deliverytype.View.DeliverytypeView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Deliverytype.Config.View.IsShow=0;
							Km.Deliverytype.View.Running.deliverytypeGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Deliverytype.Config.View.IsShow=0;
							Km.Deliverytype.View.Running.deliverytypeGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Deliverytype.View.Running.deliverytypeGrid.addDeliverytype();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Deliverytype.View.Running.deliverytypeGrid.updateDeliverytype();}
					}]
				}, config);
				Km.Deliverytype.View.DeliverytypeView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传配送方式
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量配送方式上传',
				width : 400,height : 110,minWidth : 300,minHeight : 100,
				layout : 'fit',plain : true,bodyStYle : 'padding:5px;',buttonAlign : 'center',
				closeAction : "hide",
				items : [
					new Ext.form.FormPanel({
						ref:'uploadForm',fileUpload: true,
						width: 500,labelWidth: 50,autoHeight: true,baseCls: 'x-plain',
						frame:true,bodyStyle: 'padding: 10px 10px 10px 10px;',
						defaults: {
							anchor: '95%',allowBlank: false,msgTarget: 'side'
						},
						items : [{
							xtype : 'fileuploadfield',
							fieldLabel : '文 件',name : 'upload_file',ref:'upload_file',
							emptyText: '请上传配送方式Excel文件',buttonText: '',
							accept:'application/vnd.ms-excel',
							buttonCfg: {iconCls: 'upload-icon'}
						}]
					})
				],
				buttons : [{
						text : '上 传',
						scope:this,
						handler : function() {
							uploadWindow           =this;
							validationExpression   =/\w+(.xlsx|.XLSX|.xls|.XLS)$/;
							var isValidExcelFormat = new RegExp(validationExpression);
							var result             = isValidExcelFormat.test(this.uploadForm.upload_file.getValue());
							if (!result){
								Ext.Msg.alert('提示', '请上传Excel文件，后缀名为xls或者xlsx！');
								return;
							}
							if (this.uploadForm.getForm().isValid()) {
								Ext.Msg.show({
									title : '请等待',msg : '文件正在上传中，请稍后...',
									animEl : 'loading',icon : Ext.Msg.WARNING,
									closable : true,progress : true,progressText : '',width : 300
								});
								this.uploadForm.getForm().submit({
									url : 'index.php?go=admin.upload.uploadDeliverytype',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Deliverytype.View.Running.deliverytypeGrid.doSelectDeliverytype();
									},
									failure : function(form, action) {
										Ext.Msg.alert('错误', action.result.msg);
									}
								});
							}
						}
					},{
						text : '取 消',
						scope:this,
						handler : function() {
							this.uploadForm.upload_file.setValue('');
							this.hide();
						}
					}]
				}, config);
			Km.Deliverytype.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：配送方式列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Deliverytype.Store.deliverytypeStore,
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
						this.sm,
						{header : '付款方式代码',dataIndex : 'deliverytype_code'},
						{header : '名称',dataIndex : 'name'},
						{header : '描述',dataIndex : 'description'},
						{header : '是否使用',dataIndex : 'insure',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
						{header : '支持货到付款',dataIndex : 'supportcod',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
						{header : '费用',dataIndex : 'fee'},
						{header : '免费额度',dataIndex : 'free_fee'},
						{header : '保价费用',dataIndex : 'inassurance_fee'}
					]
				}),
				tbar : {
					xtype : 'container',layout : 'anchor',
					height : 27 * 2,style:'font-size:14px',
					defaults : {
						height : 27,anchor : '100%'
					},
					items : [
						new Ext.Toolbar({
							width : 100,
							defaults : {
							   xtype : 'textfield'
							},
							items : [
								'名称　',{ref: '../dname'},'&nbsp;&nbsp;',
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectDeliverytype();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.dname.setValue("");
										this.filter={};
										this.doSelectDeliverytype();
									}
								}]
						}),
						new Ext.Toolbar({
							defaults:{
							  scope: this
							},
							items : [
								{
									text: '反选',iconCls : 'icon-reverse',
									handler: function(){
										this.onReverseSelect();
									}
								},'-',{
									text : '添加配送方式',iconCls : 'icon-add',
									handler : function() {
										this.addDeliverytype();
									}
								},'-',{
									text : '修改配送方式',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateDeliverytype();
									}
								},'-',{
									text : '删除配送方式', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteDeliverytype();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import',
									handler : function() {
										this.importDeliverytype();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportDeliverytype();
									}
								},'-',{
									xtype:'tbsplit',text: '查看配送方式', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showDeliverytype()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideDeliverytype();Km.Deliverytype.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Deliverytype.Cookie.set('View.IsFix',Km.Deliverytype.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Deliverytype.Config.PageSize,
					store: Km.Deliverytype.Store.deliverytypeStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Deliverytype.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Deliverytype.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Deliverytype.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectDeliverytype();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Deliverytype.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Deliverytype.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectDeliverytype();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示配送方式列表
			this.doSelectDeliverytype();
			Km.Deliverytype.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的配送方式信息Tab页
			Km.Deliverytype.View.Running.viewTabs=new Km.Deliverytype.View.DeliverytypeView.Tabs();
			this.addListener('rowdblclick', this.onRowDoubleClick);
		},
		/**
		 * 行选择器
		 */
		sm : new Ext.grid.CheckboxSelectionModel({
			//handleMouseDown : Ext.emptyFn,
			listeners : {
				selectionchange:function(sm) {
					// 判断删除和更新按钮是否可以激活
					this.grid.btnRemove.setDisabled(sm.getCount() < 1);
					this.grid.btnUpdate.setDisabled(sm.getCount() != 1);
					this.grid.tvpView.setDisabled(sm.getCount() != 1);
				},
				rowselect: function(sm, rowIndex, record) {
					this.grid.updateViewDeliverytype();
					if (sm.getCount() != 1){
						this.grid.hideDeliverytype();
						Km.Deliverytype.Config.View.IsShow=0;
					}else{
						if (Km.Deliverytype.View.IsSelectView==1){
							Km.Deliverytype.View.IsSelectView=0;
							this.grid.showDeliverytype();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Deliverytype.Config.View.IsShow==1){
							Km.Deliverytype.View.IsSelectView=1;
						}
						this.grid.hideDeliverytype();
						Km.Deliverytype.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Deliverytype.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showDeliverytype();
				this.tvpView.toggle(true);
			}else{
				this.hideDeliverytype();
				Km.Deliverytype.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Deliverytype.Config.View.IsFix=1;
			}else{
			   Km.Deliverytype.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Deliverytype.Config.View.IsShow=0;
				return ;
			}
			if (Km.Deliverytype.Config.View.IsShow==1){
			   this.hideDeliverytype();
			   Km.Deliverytype.Config.View.IsShow=0;
			}
			this.showDeliverytype();
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
		 * 查询符合条件的配送方式
		 */
		doSelectDeliverytype : function() {
			if (this.topToolbar){
				var dname = this.topToolbar.dname.getValue();
				this.filter       ={'name':dname};
			}
			var condition = {'start':0,'limit':Km.Deliverytype.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceDeliverytype.queryPageDeliverytype(condition,function(provider, response) {
				if (response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Deliverytype.Store.deliverytypeStore.loadData(result);
				} else {
					Km.Deliverytype.Store.deliverytypeStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的配送方式！');
				}
			});
		},
		/**
		 * 显示配送方式视图
		 * 显示配送方式的视图相对配送方式列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Deliverytype.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Deliverytype.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Deliverytype.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Deliverytype.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Deliverytype.View.Running.viewTabs);
					break;
			}
			Km.Deliverytype.Cookie.set('View.Direction',Km.Deliverytype.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Deliverytype.Config.View.IsFix==0)&&(Km.Deliverytype.Config.View.IsShow==1)){
					this.showDeliverytype();
				}
				Km.Deliverytype.Config.View.IsFix=1;
				Km.Deliverytype.View.Running.deliverytypeGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Deliverytype.Config.View.IsShow=0;
				this.showDeliverytype();
			}
		},
		/**
		 * 显示配送方式
		 */
		showDeliverytype : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择配送方式！');
				Km.Deliverytype.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Deliverytype.Config.View.IsFix==0){
				if (Km.Deliverytype.View.Running.view_window==null){
					Km.Deliverytype.View.Running.view_window=new Km.Deliverytype.View.DeliverytypeView.Window();
				}
				if (Km.Deliverytype.View.Running.view_window.hidden){
					Km.Deliverytype.View.Running.view_window.show();
					Km.Deliverytype.View.Running.view_window.winTabs.hideTabStripItem(Km.Deliverytype.View.Running.view_window.winTabs.tabFix);
					this.updateViewDeliverytype();
					this.tvpView.toggle(true);
					Km.Deliverytype.Config.View.IsShow=1;
				}else{
					this.hideDeliverytype();
					Km.Deliverytype.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Deliverytype.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Deliverytype.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Deliverytype.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Deliverytype.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Deliverytype.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Deliverytype.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Deliverytype.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Deliverytype.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Deliverytype.View.Running.viewTabs);
					}
					break;
			}
			this.hideDeliverytype();
			if (Km.Deliverytype.Config.View.IsShow==0){
				Km.Deliverytype.View.Running.viewTabs.enableCollapse();
				switch(Km.Deliverytype.Config.View.Direction){
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
				this.updateViewDeliverytype();
				this.tvpView.toggle(true);
				Km.Deliverytype.Config.View.IsShow=1;
			}else{
				Km.Deliverytype.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏配送方式
		 */
		hideDeliverytype : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Deliverytype.View.Running.view_window!=null){
				Km.Deliverytype.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前配送方式显示信息
		 */
		updateViewDeliverytype : function() {
			if (Km.Deliverytype.View.Running.view_window!=null){
				Km.Deliverytype.View.Running.view_window.winTabs.tabDeliverytypeDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Deliverytype.View.Running.viewTabs.tabDeliverytypeDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建配送方式
		 */
		addDeliverytype : function() {
			if (Km.Deliverytype.View.Running.edit_window==null){
				Km.Deliverytype.View.Running.edit_window=new Km.Deliverytype.View.EditWindow();
			}
			Km.Deliverytype.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Deliverytype.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Deliverytype.View.Running.edit_window.setTitle('添加配送方式');
			Km.Deliverytype.View.Running.edit_window.savetype=0;
			Km.Deliverytype.View.Running.edit_window.deliverytype_id.setValue("");

			Km.Deliverytype.View.Running.edit_window.show();
			Km.Deliverytype.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑配送方式时先获得选中的配送方式信息
		 */
		updateDeliverytype : function() {
			if (Km.Deliverytype.View.Running.edit_window==null){
				Km.Deliverytype.View.Running.edit_window=new Km.Deliverytype.View.EditWindow();
			}
			Km.Deliverytype.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Deliverytype.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Deliverytype.View.Running.edit_window.setTitle('修改配送方式');
			Km.Deliverytype.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Deliverytype.View.Running.edit_window.savetype=1;

			Km.Deliverytype.View.Running.edit_window.show();
			Km.Deliverytype.View.Running.edit_window.maximize();
		},
		/**
		 * 删除配送方式
		 */
		deleteDeliverytype : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的配送方式吗?', this.confirmDeleteDeliverytype,this);
		},
		/**
		 * 确认删除配送方式
		 */
		confirmDeleteDeliverytype : function(btn) {
			if (btn == 'yes') {
				var del_deliverytype_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_deliverytype_ids=del_deliverytype_ids+selectedRows[flag].data.deliverytype_id+",";
				}
				ExtServiceDeliverytype.deleteByIds(del_deliverytype_ids);
				this.doSelectDeliverytype();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出配送方式
		 */
		exportDeliverytype : function() {
			ExtServiceDeliverytype.exportDeliverytype(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入配送方式
		 */
		importDeliverytype : function() {
			if (Km.Deliverytype.View.current_uploadWindow==null){
				Km.Deliverytype.View.current_uploadWindow=new Km.Deliverytype.View.UploadWindow();
			}
			Km.Deliverytype.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Deliverytype.View.Running.deliverytypeGrid=new Km.Deliverytype.View.Grid();
			if (Km.Deliverytype.Config.View.IsFix==0){
				Km.Deliverytype.View.Running.deliverytypeGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Deliverytype.View.Running.deliverytypeGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Deliverytype.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Deliverytype.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前配送方式Grid对象
		 */
		deliverytypeGrid:null,
		/**
		 * 显示配送方式信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Deliverytype.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Deliverytype.Init();
	/**
	 * 配送方式数据模型获取数据Direct调用
	 */
	Km.Deliverytype.Store.deliverytypeStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceDeliverytype.queryPageDeliverytype}
	});
	/**
	 * 配送方式页面布局
	 */
	Km.Deliverytype.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Deliverytype.View.Panel()]
	});
	Km.Deliverytype.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});