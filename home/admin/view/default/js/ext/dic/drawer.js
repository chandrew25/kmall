Ext.namespace("Kmall.Admin.Drawer");
Km = Kmall.Admin;
Km.Drawer={
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
			 * 显示开票方的视图相对开票方列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示开票方信息页(或者打开新窗口)
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
		if (Km.Drawer.Cookie.get('View.Direction')){
			Km.Drawer.Config.View.Direction=Km.Drawer.Cookie.get('View.Direction');
		}
		if (Km.Drawer.Cookie.get('View.IsFix')!=null){
			Km.Drawer.Config.View.IsFix=Km.Drawer.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Drawer.Store = {
	/**
	 * 开票方
	 */
	drawerStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
                {name: 'drawer_id',type: 'int'},
                {name: 'drawer_name',type: 'string'},
                {name: 'sort_order',type: 'int'},
                {name: 'isShow',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (!options.params.limit)options.params.limit=Km.Drawer.Config.PageSize;
					Ext.apply(options.params, Km.Drawer.View.Running.drawerGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:开票方显示组件
 */
Km.Drawer.View={
	/**
	 * 编辑窗口：新建或者修改开票方
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
							xtype : 'textfield',anchor:'98%'
						},
						items : [
                            {xtype: 'hidden',name : 'drawer_id',ref:'../drawer_id'},
                            {fieldLabel : '开票方',name : 'drawer_name'},
                            {fieldLabel : '排序',name : 'sort_order',xtype : 'numberfield'},
                            {fieldLabel : '是否显示',hiddenName : 'isShow'
                                 ,xtype:'combo',ref:'../isShow',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否显示',
                                 valueField : 'value',displayField : 'text'
                            }
						]
					})
				],
				buttons : [{
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {

						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;
						if (this.savetype==0){
							this.editForm.api.submit=ExtServiceDrawer.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Drawer.View.Running.drawerGrid.doSelectDrawer();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
									Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceDrawer.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Km.Drawer.View.Running.drawerGrid.store.reload();
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Drawer.View.Running.drawerGrid.bottomToolbar.doRefresh();
									}});
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
									Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
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
						this.editForm.form.loadRecord(Km.Drawer.View.Running.drawerGrid.getSelectionModel().getSelected());

					}
				}]
			}, config);
			Km.Drawer.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示开票方详情
	 */
	DrawerView:{
		/**
		 * Tab页：容器包含显示与开票方所有相关的信息
		 */
		Tabs:Ext.extend(Ext.TabPanel,{
			constructor : function(config) {
				config = Ext.apply({
					region : 'south',collapseMode : 'mini',split : true,
					activeTab: 1, tabPosition:"bottom",resizeTabs : true,
					header:false,enableTabScroll : true,tabWidth:'auto', margins : '0 3 3 0',
					defaults : {
						autoScroll : true,
						layout:'fit'
					},
					listeners:{
						beforetabchange:function(tabs,newtab,currentTab){
							if (tabs.tabFix==newtab){
								if (Km.Drawer.View.Running.drawerGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择开票方！');
									return false;
								}
								Km.Drawer.Config.View.IsShow=1;
								Km.Drawer.View.Running.drawerGrid.showDrawer();
								Km.Drawer.View.Running.drawerGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Drawer.View.DrawerView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Drawer.Config.View.Direction==1)||(Km.Drawer.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabDrawerDetail',iconCls:'tabs',
					 tpl: [
						 '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">开票方</td><td class="content">{drawer_name}</td></tr>',
                         '    <tr class="entry"><td class="head">排序</td><td class="content">{sort_order}</td></tr>',
                         '    <tr class="entry"><td class="head">是否显示</td><td class="content"><tpl if="isShow == true">是</tpl><tpl if="isShow == false">否</tpl></td></tr>',
						 '</table>'
					 ]}
				);
                this.add(
                    {title: '其他',iconCls:'tabs'}
                );
			}
		}),
		/**
		 * 窗口:显示开票方信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看开票方",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Drawer.View.DrawerView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Drawer.Config.View.IsShow=0;
							Km.Drawer.View.Running.drawerGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Drawer.View.Running.drawerGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增开票方',scope:this,
						handler : function() {this.hide();Km.Drawer.View.Running.drawerGrid.addDrawer();}
					},{
						text: '修改开票方',scope:this,
						handler : function() {this.hide();Km.Drawer.View.Running.drawerGrid.updateDrawer();}
					}]
				}, config);
				Km.Drawer.View.DrawerView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传开票方
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量上传开票方数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
				layout : 'fit',plain : true,bodyStyle : 'padding:5px;',buttonAlign : 'center',closeAction : "hide",
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
							emptyText: '请上传开票方Excel文件',buttonText: '',
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
							validationExpression   =/([\u4E00-\u9FA5]|\w)+(.xlsx|.XLSX|.xls|.XLS)$/;/**允许中文名*/
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
									url : 'index.php?go=admin.upload.uploadDrawer',
									success : function(form, response) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Drawer.View.Running.drawerGrid.doSelectDrawer();
									},
									failure : function(form, response) {
										Ext.Msg.alert('错误', response.result.data);
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
			Km.Drawer.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),

	/**
	 * 视图：开票方列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Drawer.Store.drawerStore,
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
                        {header : '标识',dataIndex : 'drawer_id',hidden:true},
                        {header : '开票方',dataIndex : 'drawer_name'},
                        {header : '排序',dataIndex : 'sort_order'},
                        {header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}}
					]
				}),
				tbar : {
					xtype : 'container',layout : 'anchor',height : 27 * 2,style:'font-size:14px',
					defaults : {
						height : 27,anchor : '100%'
					},
					items : [
						new Ext.Toolbar({
							enableOverflow: true,width : 100,
							defaults : {
								xtype : 'textfield',
								listeners : {
								   specialkey : function(field, e) {
										if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectDrawer();
									}
								}
							},
							items : [

								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectDrawer();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {

										this.filter={};
										this.doSelectDrawer();
									}
								}]
						}),
						new Ext.Toolbar({
							defaults:{scope: this},
							items : [
								{
									text: '反选',iconCls : 'icon-reverse',
									handler: function(){
										this.onReverseSelect();
									}
								},'-',{
									text : '添加开票方',iconCls : 'icon-add',
									handler : function() {
										this.addDrawer();
									}
								},'-',{
									text : '修改开票方',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateDrawer();
									}
								},'-',{
									text : '删除开票方', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteDrawer();
									}
								},'-',{
									xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
									handler : function() {
										this.importDrawer();
									},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'批量导入开票方',iconCls : 'icon-import',scope:this,handler:function(){this.importDrawer()}}
										]}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportDrawer();
									}
								},'-',{
									xtype:'tbsplit',text: '查看开票方', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showDrawer()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideDrawer();Km.Drawer.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Drawer.Cookie.set('View.IsFix',Km.Drawer.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Drawer.Config.PageSize,
					store: Km.Drawer.Store.drawerStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
						change:function(thisbar,pagedata){
							if (Km.Drawer.Viewport){
								if (Km.Drawer.Config.View.IsShow==1){
									Km.Drawer.View.IsSelectView=1;
								}
								this.ownerCt.hideDrawer();
								Km.Drawer.Config.View.IsShow=0;
							}
						}
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Drawer.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Drawer.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Drawer.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectDrawer();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Drawer.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Drawer.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectDrawer();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示开票方列表
			this.doSelectDrawer();
			Km.Drawer.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的开票方信息Tab页
			Km.Drawer.View.Running.viewTabs=new Km.Drawer.View.DrawerView.Tabs();
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
					this.grid.updateViewDrawer();
					if (sm.getCount() != 1){
						this.grid.hideDrawer();
						Km.Drawer.Config.View.IsShow=0;
					}else{
						if (Km.Drawer.View.IsSelectView==1){
							Km.Drawer.View.IsSelectView=0;
							this.grid.showDrawer();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Drawer.Config.View.IsShow==1){
							Km.Drawer.View.IsSelectView=1;
						}
						this.grid.hideDrawer();
						Km.Drawer.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Drawer.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showDrawer();
				this.tvpView.toggle(true);
			}else{
				this.hideDrawer();
				Km.Drawer.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Drawer.Config.View.IsFix=1;
			}else{
			   Km.Drawer.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Drawer.Config.View.IsShow=0;
				return ;
			}
			if (Km.Drawer.Config.View.IsShow==1){
			   this.hideDrawer();
			   Km.Drawer.Config.View.IsShow=0;
			}
			this.showDrawer();
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
		 * 查询符合条件的开票方
		 */
		doSelectDrawer : function() {
			if (this.topToolbar){


			}
			var condition = {'start':0,'limit':Km.Drawer.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceDrawer.queryPageDrawer(condition,function(provider, response) {
				if (response.result&&response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Drawer.Store.drawerStore.loadData(result);
				} else {
					Km.Drawer.Store.drawerStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的开票方！');
				}
			});
		},
		/**
		 * 显示开票方视图
		 * 显示开票方的视图相对开票方列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Drawer.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Drawer.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Drawer.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Drawer.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Drawer.View.Running.viewTabs);
					break;
			}
			Km.Drawer.Cookie.set('View.Direction',Km.Drawer.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Drawer.Config.View.IsFix==0)&&(Km.Drawer.Config.View.IsShow==1)){
					this.showDrawer();
				}
				Km.Drawer.Config.View.IsFix=1;
				Km.Drawer.View.Running.drawerGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Drawer.Config.View.IsShow=0;
				this.showDrawer();
			}
		},
		/**
		 * 显示开票方
		 */
		showDrawer : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择开票方！');
				Km.Drawer.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Drawer.Config.View.IsFix==0){
				if (Km.Drawer.View.Running.view_window==null){
					Km.Drawer.View.Running.view_window=new Km.Drawer.View.DrawerView.Window();
				}
				if (Km.Drawer.View.Running.view_window.hidden){
					Km.Drawer.View.Running.view_window.show();
					Km.Drawer.View.Running.view_window.winTabs.hideTabStripItem(Km.Drawer.View.Running.view_window.winTabs.tabFix);
					this.updateViewDrawer();
					this.tvpView.toggle(true);
					Km.Drawer.Config.View.IsShow=1;
				}else{
					this.hideDrawer();
					Km.Drawer.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Drawer.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Drawer.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Drawer.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Drawer.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Drawer.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Drawer.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Drawer.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Drawer.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Drawer.View.Running.viewTabs);
					}
					break;
			}
			this.hideDrawer();
			if (Km.Drawer.Config.View.IsShow==0){
				Km.Drawer.View.Running.viewTabs.enableCollapse();
				switch(Km.Drawer.Config.View.Direction){
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
				this.updateViewDrawer();
				this.tvpView.toggle(true);
				Km.Drawer.Config.View.IsShow=1;
			}else{
				Km.Drawer.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏开票方
		 */
		hideDrawer : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Drawer.View.Running.view_window!=null){
				Km.Drawer.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前开票方显示信息
		 */
		updateViewDrawer : function() {

			if (Km.Drawer.View.Running.view_window!=null){
				Km.Drawer.View.Running.view_window.winTabs.tabDrawerDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Drawer.View.Running.viewTabs.tabDrawerDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建开票方
		 */
		addDrawer : function() {
			if (Km.Drawer.View.Running.edit_window==null){
				Km.Drawer.View.Running.edit_window=new Km.Drawer.View.EditWindow();
			}
			Km.Drawer.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Drawer.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Drawer.View.Running.edit_window.setTitle('添加开票方');
			Km.Drawer.View.Running.edit_window.savetype=0;
			Km.Drawer.View.Running.edit_window.drawer_id.setValue("");

			Km.Drawer.View.Running.edit_window.show();
			Km.Drawer.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑开票方时先获得选中的开票方信息
		 */
		updateDrawer : function() {
			if (Km.Drawer.View.Running.edit_window==null){
				Km.Drawer.View.Running.edit_window=new Km.Drawer.View.EditWindow();
			}
			Km.Drawer.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Drawer.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Drawer.View.Running.edit_window.setTitle('修改开票方');
			Km.Drawer.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Drawer.View.Running.edit_window.savetype=1;

			Km.Drawer.View.Running.edit_window.show();
			Km.Drawer.View.Running.edit_window.maximize();
		},
		/**
		 * 删除开票方
		 */
		deleteDrawer : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的开票方吗?', this.confirmDeleteDrawer,this);
		},
		/**
		 * 确认删除开票方
		 */
		confirmDeleteDrawer : function(btn) {
			if (btn == 'yes') {
				var del_drawer_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_drawer_ids=del_drawer_ids+selectedRows[flag].data.drawer_id+",";
				}
				ExtServiceDrawer.deleteByIds(del_drawer_ids);
				this.doSelectDrawer();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出开票方
		 */
		exportDrawer : function() {
			ExtServiceDrawer.exportDrawer(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入开票方
		 */
		importDrawer : function() {
			if (Km.Drawer.View.current_uploadWindow==null){
				Km.Drawer.View.current_uploadWindow=new Km.Drawer.View.UploadWindow();
			}
			Km.Drawer.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Drawer.View.Running.drawerGrid=new Km.Drawer.View.Grid();
			if (Km.Drawer.Config.View.IsFix==0){
				Km.Drawer.View.Running.drawerGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Drawer.View.Running.drawerGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Drawer.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Drawer.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前开票方Grid对象
		 */
		drawerGrid:null,

		/**
		 * 显示开票方信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Drawer.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Drawer.Init();
	/**
	 * 开票方数据模型获取数据Direct调用
	 */
	Km.Drawer.Store.drawerStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceDrawer.queryPageDrawer}
	});
	/**
	 * 开票方页面布局
	 */
	Km.Drawer.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Drawer.View.Panel()]
	});
	Km.Drawer.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});