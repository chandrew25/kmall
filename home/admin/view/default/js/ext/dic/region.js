Ext.namespace("Kmall.Admin.Region");
Km = Kmall.Admin.Region;
Km.Region={
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
			 * 显示地区的视图相对地区列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示地区信息页(或者打开新窗口)
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
		if (Km.Region.Cookie.get('View.Direction')){
			Km.Region.Config.View.Direction=Km.Region.Cookie.get('View.Direction');
		}
		if (Km.Region.Cookie.get('View.IsFix')!=null){
			Km.Region.Config.View.IsFix=Km.Region.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Region.Store = {
	/**
	 * 地区
	 */
	regionStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				{name: 'region_id',type: 'string'},
				{name: 'parent_id',type: 'string'},
				{name: 'region_name',type: 'string'},
				{name: 'region_type',type: 'string'},
                {name: 'region_typeShow',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					Ext.apply(options.params, Km.Region.View.Running.regionGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:地区显示组件
 */
Km.Region.View={
	/**
	 * 编辑窗口：新建或者修改地区
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
							{xtype: 'hidden',  name : 'region_id',ref:'../region_id'},
							{fieldLabel : '父地区标识(<font color=red>*</font>)',name : 'parent_id',allowBlank : false},
							{fieldLabel : '地区名称(<font color=red>*</font>)',name : 'region_name',allowBlank : false},
							{fieldLabel : '地区类型(<font color=red>*</font>)',hiddenName : 'region_type',allowBlank : false,xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '国家'],['1', '省'],['2', '市'],['3', '区']]
								}),emptyText: '请选择地区类型',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							}
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
							this.editForm.api.submit=ExtServiceRegion.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Region.View.Running.regionGrid.doSelectRegion();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceRegion.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Region.View.Running.regionGrid.doSelectRegion();
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
						this.editForm.form.loadRecord(Km.Region.View.Running.regionGrid.getSelectionModel().getSelected());

					}
				}]
			}, config);
			Km.Region.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示地区详情
	 */
	RegionView:{
		/**
		 * Tab页：容器包含显示与地区所有相关的信息
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
								if (Km.Region.View.Running.regionGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择地区！');
									return false;
								}
								Km.Region.Config.View.IsShow=1;
								Km.Region.View.Running.regionGrid.showRegion();
								Km.Region.View.Running.regionGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Region.View.RegionView.Tabs.superclass.constructor.call(this, config);
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Region.Config.View.Direction==1)||(Km.Region.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabRegionDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">',
						 '<tr class="entry"><td class="head">父地区标识 :</td><td class="content">{parent_id}</td></tr>',
						 '<tr class="entry"><td class="head">地区名称 :</td><td class="content">{region_name}</td></tr>',
						 '<tr class="entry"><td class="head">地区类型 :</td><td class="content">{region_typeShow}</td></tr>',
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
		 * 窗口:显示地区信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看地区",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Region.View.RegionView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Region.Config.View.IsShow=0;
							Km.Region.View.Running.regionGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Region.Config.View.IsShow=0;
							Km.Region.View.Running.regionGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Region.View.Running.regionGrid.addRegion();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Region.View.Running.regionGrid.updateRegion();}
					}]
				}, config);
				Km.Region.View.RegionView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传地区
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量地区上传',
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
							emptyText: '请上传地区Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadRegion',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Region.View.Running.regionGrid.doSelectRegion();
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
			Km.Region.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：地区列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Region.Store.regionStore,
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
						{header : '父地区标识',dataIndex : 'parent_id'},
						{header : '地区名称',dataIndex : 'region_name'},
						{header : '地区类型',dataIndex : 'region_typeShow'}
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
								'地区名称　',{ref: '../rregion_name'},'&nbsp;&nbsp;',
								'地区类型　',{ref: '../rregion_type',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '国家'],['1', '省'],['2', '市'],['3', '区']]
									}),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectRegion();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.rregion_name.setValue("");
										this.topToolbar.rregion_type.setValue("");
										this.filter={};
										this.doSelectRegion();
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
									text : '添加地区',iconCls : 'icon-add',
									handler : function() {
										this.addRegion();
									}
								},'-',{
									text : '修改地区',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateRegion();
									}
								},'-',{
									text : '删除地区', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteRegion();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import',
									handler : function() {
										this.importRegion();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportRegion();
									}
								},'-',{
									xtype:'tbsplit',text: '查看地区', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showRegion()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideRegion();Km.Region.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Region.Cookie.set('View.IsFix',Km.Region.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Region.Config.PageSize,
					store: Km.Region.Store.regionStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Region.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Region.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Region.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectRegion();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Region.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Region.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectRegion();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示地区列表
			this.doSelectRegion();
			Km.Region.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的地区信息Tab页
			Km.Region.View.Running.viewTabs=new Km.Region.View.RegionView.Tabs();
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
					this.grid.updateViewRegion();
					if (sm.getCount() != 1){
						this.grid.hideRegion();
						Km.Region.Config.View.IsShow=0;
					}else{
						if (Km.Region.View.IsSelectView==1){
							Km.Region.View.IsSelectView=0;
							this.grid.showRegion();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Region.Config.View.IsShow==1){
							Km.Region.View.IsSelectView=1;
						}
						this.grid.hideRegion();
						Km.Region.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Region.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showRegion();
				this.tvpView.toggle(true);
			}else{
				this.hideRegion();
				Km.Region.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Region.Config.View.IsFix=1;
			}else{
			   Km.Region.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Region.Config.View.IsShow=0;
				return ;
			}
			if (Km.Region.Config.View.IsShow==1){
			   this.hideRegion();
			   Km.Region.Config.View.IsShow=0;
			}
			this.showRegion();
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
		 * 查询符合条件的地区
		 */
		doSelectRegion : function() {
			if (this.topToolbar){
				var rregion_name = this.topToolbar.rregion_name.getValue();
				var rregion_type = this.topToolbar.rregion_type.getValue();
				this.filter       ={'region_name':rregion_name,'region_type':rregion_type};
			}
			var condition = {'start':0,'limit':Km.Region.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceRegion.queryPageRegion(condition,function(provider, response) {
				if (response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Region.Store.regionStore.loadData(result);
				} else {
					Km.Region.Store.regionStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的地区！');
				}
			});
		},
		/**
		 * 显示地区视图
		 * 显示地区的视图相对地区列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Region.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Region.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Region.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Region.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Region.View.Running.viewTabs);
					break;
			}
			Km.Region.Cookie.set('View.Direction',Km.Region.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Region.Config.View.IsFix==0)&&(Km.Region.Config.View.IsShow==1)){
					this.showRegion();
				}
				Km.Region.Config.View.IsFix=1;
				Km.Region.View.Running.regionGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Region.Config.View.IsShow=0;
				this.showRegion();
			}
		},
		/**
		 * 显示地区
		 */
		showRegion : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择地区！');
				Km.Region.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Region.Config.View.IsFix==0){
				if (Km.Region.View.Running.view_window==null){
					Km.Region.View.Running.view_window=new Km.Region.View.RegionView.Window();
				}
				if (Km.Region.View.Running.view_window.hidden){
					Km.Region.View.Running.view_window.show();
					Km.Region.View.Running.view_window.winTabs.hideTabStripItem(Km.Region.View.Running.view_window.winTabs.tabFix);
					this.updateViewRegion();
					this.tvpView.toggle(true);
					Km.Region.Config.View.IsShow=1;
				}else{
					this.hideRegion();
					Km.Region.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Region.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Region.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Region.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Region.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Region.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Region.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Region.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Region.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Region.View.Running.viewTabs);
					}
					break;
			}
			this.hideRegion();
			if (Km.Region.Config.View.IsShow==0){
				Km.Region.View.Running.viewTabs.enableCollapse();
				switch(Km.Region.Config.View.Direction){
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
				this.updateViewRegion();
				this.tvpView.toggle(true);
				Km.Region.Config.View.IsShow=1;
			}else{
				Km.Region.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏地区
		 */
		hideRegion : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Region.View.Running.view_window!=null){
				Km.Region.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前地区显示信息
		 */
		updateViewRegion : function() {
			if (Km.Region.View.Running.view_window!=null){
				Km.Region.View.Running.view_window.winTabs.tabRegionDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Region.View.Running.viewTabs.tabRegionDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建地区
		 */
		addRegion : function() {
			if (Km.Region.View.Running.edit_window==null){
				Km.Region.View.Running.edit_window=new Km.Region.View.EditWindow();
			}
			Km.Region.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Region.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Region.View.Running.edit_window.setTitle('添加地区');
			Km.Region.View.Running.edit_window.savetype=0;
			Km.Region.View.Running.edit_window.region_id.setValue("");

			Km.Region.View.Running.edit_window.show();
			Km.Region.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑地区时先获得选中的地区信息
		 */
		updateRegion : function() {
			if (Km.Region.View.Running.edit_window==null){
				Km.Region.View.Running.edit_window=new Km.Region.View.EditWindow();
			}
			Km.Region.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Region.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Region.View.Running.edit_window.setTitle('修改地区');
			Km.Region.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Region.View.Running.edit_window.savetype=1;

			Km.Region.View.Running.edit_window.show();
			Km.Region.View.Running.edit_window.maximize();
		},
		/**
		 * 删除地区
		 */
		deleteRegion : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的地区吗?', this.confirmDeleteRegion,this);
		},
		/**
		 * 确认删除地区
		 */
		confirmDeleteRegion : function(btn) {
			if (btn == 'yes') {
				var del_region_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_region_ids=del_region_ids+selectedRows[flag].data.region_id+",";
				}
				ExtServiceRegion.deleteByIds(del_region_ids);
				this.doSelectRegion();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出地区
		 */
		exportRegion : function() {
			ExtServiceRegion.exportRegion(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入地区
		 */
		importRegion : function() {
			if (Km.Region.View.current_uploadWindow==null){
				Km.Region.View.current_uploadWindow=new Km.Region.View.UploadWindow();
			}
			Km.Region.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Region.View.Running.regionGrid=new Km.Region.View.Grid();
			if (Km.Region.Config.View.IsFix==0){
				Km.Region.View.Running.regionGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Region.View.Running.regionGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Region.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Region.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前地区Grid对象
		 */
		regionGrid:null,
		/**
		 * 显示地区信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Region.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Region.Init();
	/**
	 * 地区数据模型获取数据Direct调用
	 */
	Km.Region.Store.regionStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceRegion.queryPageRegion}
	});
	/**
	 * 地区页面布局
	 */
	Km.Region.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Region.View.Panel()]
	});
	Km.Region.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});
