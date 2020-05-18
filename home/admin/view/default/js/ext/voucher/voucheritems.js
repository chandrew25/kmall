Ext.namespace("Kmall.Admin.Voucheritems");
Km = Kmall.Admin;
Km.Voucheritems={
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
			 * 显示票卡券实体表的视图相对票卡券实体表列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示票卡券实体表信息页(或者打开新窗口)
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
		if (Km.Voucheritems.Cookie.get('View.Direction')){
			Km.Voucheritems.Config.View.Direction=Km.Voucheritems.Cookie.get('View.Direction');
		}
		if (Km.Voucheritems.Cookie.get('View.IsFix')!=null){
			Km.Voucheritems.Config.View.IsFix=Km.Voucheritems.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Voucheritems.Store = {
	/**
	 * 票卡券实体表
	 */
	voucheritemsStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
                {name: 'voucheritems_id',type: 'int'},
                {name: 'voucher_id',type: 'int'},
                {name: 'vi_key',type: 'string'},
                {name: 'isExchange',type: 'string'},
                {name: 'sort_order',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (!options.params.limit)options.params.limit=Km.Voucheritems.Config.PageSize;
					Ext.apply(options.params, Km.Voucheritems.View.Running.voucheritemsGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:票卡券实体表显示组件
 */
Km.Voucheritems.View={
	/**
	 * 编辑窗口：新建或者修改票卡券实体表
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
                            {xtype: 'hidden',name : 'voucheritems_id',ref:'../voucheritems_id'},
                            {fieldLabel : '票卡券',name : 'voucher_id',xtype : 'numberfield'},
                            {fieldLabel : '票卡券实体号码',name : 'vi_key'},
                            {fieldLabel : '是否兑换(<font color=red>*</font>)',hiddenName : 'isExchange',allowBlank : false
                                 ,xtype:'combo',ref:'../isExchange',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否兑换',
                                 valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '排序',name : 'sort_order'}
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
							this.editForm.api.submit=ExtServiceVoucheritems.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Voucheritems.View.Running.voucheritemsGrid.doSelectVoucheritems();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
									Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceVoucheritems.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Km.Voucheritems.View.Running.voucheritemsGrid.store.reload();
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Voucheritems.View.Running.voucheritemsGrid.bottomToolbar.doRefresh();
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
						this.editForm.form.loadRecord(Km.Voucheritems.View.Running.voucheritemsGrid.getSelectionModel().getSelected());

					}
				}]
			}, config);
			Km.Voucheritems.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示票卡券实体表详情
	 */
	VoucheritemsView:{
		/**
		 * Tab页：容器包含显示与票卡券实体表所有相关的信息
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
								if (Km.Voucheritems.View.Running.voucheritemsGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择票卡券实体表！');
									return false;
								}
								Km.Voucheritems.Config.View.IsShow=1;
								Km.Voucheritems.View.Running.voucheritemsGrid.showVoucheritems();
								Km.Voucheritems.View.Running.voucheritemsGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Voucheritems.View.VoucheritemsView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Voucheritems.Config.View.Direction==1)||(Km.Voucheritems.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabVoucheritemsDetail',iconCls:'tabs',
					 tpl: [
						 '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">票卡券</td><td class="content">{voucher_id}</td></tr>',
                         '    <tr class="entry"><td class="head">票卡券实体号码</td><td class="content">{vi_key}</td></tr>',
                         '    <tr class="entry"><td class="head">是否兑换</td><td class="content"><tpl if="isExchange == true">是</tpl><tpl if="isExchange == false">否</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">排序</td><td class="content">{sort_order}</td></tr>',
						 '</table>'
					 ]}
				);
                this.add(
                    {title: '其他',iconCls:'tabs'}
                );
			}
		}),
		/**
		 * 窗口:显示票卡券实体表信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看票卡券实体表",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Voucheritems.View.VoucheritemsView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Voucheritems.Config.View.IsShow=0;
							Km.Voucheritems.View.Running.voucheritemsGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Voucheritems.View.Running.voucheritemsGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增票卡券实体表',scope:this,
						handler : function() {this.hide();Km.Voucheritems.View.Running.voucheritemsGrid.addVoucheritems();}
					},{
						text: '修改票卡券实体表',scope:this,
						handler : function() {this.hide();Km.Voucheritems.View.Running.voucheritemsGrid.updateVoucheritems();}
					}]
				}, config);
				Km.Voucheritems.View.VoucheritemsView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传票卡券实体表
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量上传票卡券实体表数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
							emptyText: '请上传票卡券实体表Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadVoucheritems',
									success : function(form, response) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Voucheritems.View.Running.voucheritemsGrid.doSelectVoucheritems();
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
			Km.Voucheritems.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：票卡券实体表列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Voucheritems.Store.voucheritemsStore,
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
                        {header : '标识',dataIndex : 'voucheritems_id',hidden:true},
                        {header : '票卡券',dataIndex : 'voucher_id'},
                        {header : '票卡券实体号码',dataIndex : 'vi_key'},
                        {header : '是否兑换',dataIndex : 'isExchange',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '排序',dataIndex : 'sort_order'}
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
										if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectVoucheritems();
									}
								}
							},
							items : [

								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectVoucheritems();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {

										this.filter={};
										this.doSelectVoucheritems();
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
									xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
									handler : function() {
										this.importVoucheritems();
									},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'批量导入票卡券实体表',iconCls : 'icon-import',scope:this,handler:function(){this.importVoucheritems()}}
										]}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportVoucheritems();
									}
								},'-',{
									xtype:'tbsplit',text: '查看票卡券实体表', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showVoucheritems()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideVoucheritems();Km.Voucheritems.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Voucheritems.Cookie.set('View.IsFix',Km.Voucheritems.Config.View.IsFix);}}
										]}
								},'-']
							}
						)
					]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Voucheritems.Config.PageSize,
					store: Km.Voucheritems.Store.voucheritemsStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
						change:function(thisbar,pagedata){
							if (Km.Voucheritems.Viewport){
								if (Km.Voucheritems.Config.View.IsShow==1){
									Km.Voucheritems.View.IsSelectView=1;
								}
								this.ownerCt.hideVoucheritems();
								Km.Voucheritems.Config.View.IsShow=0;
							}
						}
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Voucheritems.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Voucheritems.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Voucheritems.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectVoucheritems();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Voucheritems.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Voucheritems.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectVoucheritems();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示票卡券实体表列表
			this.doSelectVoucheritems();
			Km.Voucheritems.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的票卡券实体表信息Tab页
			Km.Voucheritems.View.Running.viewTabs=new Km.Voucheritems.View.VoucheritemsView.Tabs();
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
					this.grid.updateViewVoucheritems();
					if (sm.getCount() != 1){
						this.grid.hideVoucheritems();
						Km.Voucheritems.Config.View.IsShow=0;
					}else{
						if (Km.Voucheritems.View.IsSelectView==1){
							Km.Voucheritems.View.IsSelectView=0;
							this.grid.showVoucheritems();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Voucheritems.Config.View.IsShow==1){
							Km.Voucheritems.View.IsSelectView=1;
						}
						this.grid.hideVoucheritems();
						Km.Voucheritems.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Voucheritems.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showVoucheritems();
				this.tvpView.toggle(true);
			}else{
				this.hideVoucheritems();
				Km.Voucheritems.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Voucheritems.Config.View.IsFix=1;
			}else{
			   Km.Voucheritems.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Voucheritems.Config.View.IsShow=0;
				return ;
			}
			if (Km.Voucheritems.Config.View.IsShow==1){
			   this.hideVoucheritems();
			   Km.Voucheritems.Config.View.IsShow=0;
			}
			this.showVoucheritems();
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
		 * 查询符合条件的票卡券实体表
		 */
		doSelectVoucheritems : function() {
			if (this.topToolbar){


			}
			var condition = {'start':0,'limit':Km.Voucheritems.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceVoucheritems.queryPageVoucheritems(condition,function(provider, response) {
				if (response.result&&response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Voucheritems.Store.voucheritemsStore.loadData(result);
				} else {
					Km.Voucheritems.Store.voucheritemsStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的票卡券实体表！');
				}
			});
		},
		/**
		 * 显示票卡券实体表视图
		 * 显示票卡券实体表的视图相对票卡券实体表列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Voucheritems.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Voucheritems.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Voucheritems.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Voucheritems.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Voucheritems.View.Running.viewTabs);
					break;
			}
			Km.Voucheritems.Cookie.set('View.Direction',Km.Voucheritems.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Voucheritems.Config.View.IsFix==0)&&(Km.Voucheritems.Config.View.IsShow==1)){
					this.showVoucheritems();
				}
				Km.Voucheritems.Config.View.IsFix=1;
				Km.Voucheritems.View.Running.voucheritemsGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Voucheritems.Config.View.IsShow=0;
				this.showVoucheritems();
			}
		},
		/**
		 * 显示票卡券实体表
		 */
		showVoucheritems : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择票卡券实体表！');
				Km.Voucheritems.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Voucheritems.Config.View.IsFix==0){
				if (Km.Voucheritems.View.Running.view_window==null){
					Km.Voucheritems.View.Running.view_window=new Km.Voucheritems.View.VoucheritemsView.Window();
				}
				if (Km.Voucheritems.View.Running.view_window.hidden){
					Km.Voucheritems.View.Running.view_window.show();
					Km.Voucheritems.View.Running.view_window.winTabs.hideTabStripItem(Km.Voucheritems.View.Running.view_window.winTabs.tabFix);
					this.updateViewVoucheritems();
					this.tvpView.toggle(true);
					Km.Voucheritems.Config.View.IsShow=1;
				}else{
					this.hideVoucheritems();
					Km.Voucheritems.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Voucheritems.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Voucheritems.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Voucheritems.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Voucheritems.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Voucheritems.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Voucheritems.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Voucheritems.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Voucheritems.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Voucheritems.View.Running.viewTabs);
					}
					break;
			}
			this.hideVoucheritems();
			if (Km.Voucheritems.Config.View.IsShow==0){
				Km.Voucheritems.View.Running.viewTabs.enableCollapse();
				switch(Km.Voucheritems.Config.View.Direction){
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
				this.updateViewVoucheritems();
				this.tvpView.toggle(true);
				Km.Voucheritems.Config.View.IsShow=1;
			}else{
				Km.Voucheritems.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏票卡券实体表
		 */
		hideVoucheritems : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Voucheritems.View.Running.view_window!=null){
				Km.Voucheritems.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前票卡券实体表显示信息
		 */
		updateViewVoucheritems : function() {

			if (Km.Voucheritems.View.Running.view_window!=null){
				Km.Voucheritems.View.Running.view_window.winTabs.tabVoucheritemsDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Voucheritems.View.Running.viewTabs.tabVoucheritemsDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 导出票卡券实体表
		 */
		exportVoucheritems : function() {
			ExtServiceVoucheritems.exportVoucheritems(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入票卡券实体表
		 */
		importVoucheritems : function() {
			if (Km.Voucheritems.View.current_uploadWindow==null){
				Km.Voucheritems.View.current_uploadWindow=new Km.Voucheritems.View.UploadWindow();
			}
			Km.Voucheritems.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Voucheritems.View.Running.voucheritemsGrid=new Km.Voucheritems.View.Grid();
			if (Km.Voucheritems.Config.View.IsFix==0){
				Km.Voucheritems.View.Running.voucheritemsGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Voucheritems.View.Running.voucheritemsGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Voucheritems.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Voucheritems.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前票卡券实体表Grid对象
		 */
		voucheritemsGrid:null,

		/**
		 * 显示票卡券实体表信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Voucheritems.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Voucheritems.Init();
	/**
	 * 票卡券实体表数据模型获取数据Direct调用
	 */
	Km.Voucheritems.Store.voucheritemsStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceVoucheritems.queryPageVoucheritems}
	});
	/**
	 * 票卡券实体表页面布局
	 */
	Km.Voucheritems.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Voucheritems.View.Panel()]
	});
	Km.Voucheritems.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});