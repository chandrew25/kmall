Ext.namespace("Kmall.Admin.Warehouse");
Km = Kmall.Admin.Warehouse;
Km.Warehouse={
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
			 * 显示仓库的视图相对仓库列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示仓库信息页(或者打开新窗口)
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
		if (Km.Warehouse.Cookie.get('View.Direction')){
			Km.Warehouse.Config.View.Direction=Km.Warehouse.Cookie.get('View.Direction');
		}
		if (Km.Warehouse.Cookie.get('View.IsFix')!=null){
			Km.Warehouse.Config.View.IsFix=Km.Warehouse.Cookie.get('View.IsFix');
		}
	}
}; 
/**
 * Model:数据模型   
 */
Km.Warehouse.Store = { 
	/**
	 * 仓库
	 */ 
	warehouseStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',  
			root: 'data',remoteSort: true,                
			fields : [
				{name: 'warehouse_id',type: 'int'},
				{name: 'supplier_id',type: 'int'},
				{name: 'sp_name',type: 'string'},
				{name: 'warehouse_name',type: 'string'},
				{name: 'contactman',type: 'string'},
				{name: 'mobilephone',type: 'string'},
				{name: 'isDefault',type: 'string'},
				{name: 'address',type: 'string'}
			]}         
		),
		writer: new Ext.data.JsonWriter({
			encode: false 
		}),
		listeners : {    
			beforeload : function(store, options) {   
				if (Ext.isReady) {  
					Ext.apply(options.params, Km.Warehouse.View.Running.warehouseGrid.filter);//保证分页也将查询条件带上  
				}
			}
		}    
	}),
	/**
	 * 供应商
	 */
	supplierStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/supplier.php'
		}),
		reader: new Ext.data.JsonReader({
			root: 'suppliers',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'supplier_id'
		}, [
			{name: 'supplier_id', mapping: 'supplier_id'}, 
			{name: 'sp_name', mapping: 'sp_name'} 
		])
	})      
};
/**
 * View:仓库显示组件   
 */
Km.Warehouse.View={ 
	/**
	 * 编辑窗口：新建仓库
	 */        
	EditWindow:Ext.extend(Ext.Window,{
		constructor : function(config) { 
			config = Ext.apply({ 
				closeAction : "hide",title:'添加仓库',  
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
						api : {
							submit:ExtServiceWarehouse.save
						},
						defaults : {
							xtype : 'textfield',anchor:'98%'
						},
						items : [ 
							{xtype: 'hidden',  name : 'warehouse_id',ref:'../warehouse_id'},
							{xtype: 'hidden',name : 'sp_id',id:'sp_id'},
							{
								 fieldLabel : '供应商',xtype: 'combo',name : 'sp_name',id : 'sp_name',
								 store:Km.Warehouse.Store.supplierStore,emptyText: '请选择供应商',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Warehouse.Config.PageSize,
								 displayField:'sp_name',// 显示文本
								 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
								 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
								 tpl:new Ext.XTemplate(
											'<tpl for="."><div class="search-item">',
												'<h3>{sp_name}</h3>',
											'</div></tpl>'
								 ),
								 onSelect:function(record,index){
									 if(this.fireEvent('beforeselect', this, record, index) !== false){
										Ext.getCmp("sp_id").setValue(record.data.sp_id);
										Ext.getCmp("sp_name").setValue(record.data.sp_name);
										this.collapse();
									 }
								 }
							},
							{fieldLabel : '仓库名称',name : 'warehouse_name'},
							{fieldLabel : '联系人',name : 'contactman'},
							{fieldLabel : '联系电话',name : 'mobilephone'},
							{fieldLabel : '是否默认仓库',hiddenName : 'isDefault',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '否'], ['1', '是']]
								}),emptyText: '请选择是否默认仓库',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							{fieldLabel : '仓库地址',name : 'address'}        
						]
					})                
				],
				buttons : [ {         
					text: "保 存",ref : "../saveBtn",scope:this,
					handler : function() {   		 
						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;                 
						this.editForm.getForm().submit({
							success : function(form, action) {
								Ext.Msg.alert("提示", "保存成功！");
								Km.Warehouse.View.Running.warehouseGrid.doSelectWarehouse();
								form.reset(); 
								editWindow.hide();
							},
							failure : function(form, action) {
								Ext.Msg.alert('提示', '失败');
							}
						});
					}
				}, {
					text : "取 消",scope:this,
					handler : function() {  
						this.hide();
					}
				}, {
					text : "重 置",ref:'../resetBtn',scope:this,
					handler : function() {  
						this.editForm.form.reset(); 
 
					}                  
				}]    
			}, config);  
			Km.Warehouse.View.EditWindow.superclass.constructor.call(this, config);     
		}
	}),
	/**
	 * 编辑窗口：修改仓库
	 */        
	UpdateWindow:Ext.extend(Ext.Window,{
		constructor : function(config) { 
			config = Ext.apply({ 
				closeAction : "hide", title:'修改仓库', 
				constrainHeader:true,maximizable: true,collapsible: true,
				width : 450,height : 550,minWidth : 400,minHeight : 450,
				layout : 'fit',plain : true,buttonAlign : 'center',
				defaults : {
					autoScroll : true
				},                
				listeners:{
					beforehide:function(){
						this.updateForm.form.getEl().dom.reset();                    
					}
				},
				items : [ 
					new Ext.form.FormPanel({   
						ref:'updateForm',layout:'form',
						labelWidth : 100,labelAlign : "center",
						bodyStyle : 'padding:5px 5px 0',align : "center",
						api : {
							submit:ExtServiceWarehouse.update
						},
						defaults : {
							xtype : 'textfield',anchor:'98%'
						},
						items : [ 
							{xtype: 'hidden',  name : 'warehouse_id',ref:'../warehouse_id'},
							{xtype: 'hidden',name : 'supplier_id'},
							{fieldLabel : '供应商',name : 'sp_name',xtype:'displayfield',ref:'../wh_supplier_name'},
							{fieldLabel : '仓库名称',name : 'warehouse_name'},
							{fieldLabel : '联系人',name : 'contactman'},
							{fieldLabel : '联系电话',name : 'mobilephone'},
							{fieldLabel : '是否默认仓库',hiddenName : 'isDefault',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '否'], ['1', '是']]
								}),emptyText: '请选择是否默认仓库',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							{fieldLabel : '仓库地址',name : 'address'}        
						]
					})                
				],
				buttons : [ {         
					text: "修 改",ref : "../saveBtn",scope:this,
					handler : function() { 
						if (!this.updateForm.getForm().isValid()) {
							return;
						}
						updateWindow=this;  
						this.updateForm.getForm().submit({
							success : function(form, action) {
								Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
									Km.Warehouse.View.Running.warehouseGrid.bottomToolbar.doRefresh();
								}});   
								form.reset();
								updateWindow.hide();
							},
							failure : function(form, action) {
								Ext.Msg.alert('提示', '失败');
							}
						});
					}
				}, {
					text : "取 消",scope:this,
					handler : function() {  
						this.hide();
					}
				}, {
					text : "重 置",ref:'../resetBtn',scope:this,
					handler : function() {  
						this.updateForm.form.loadRecord(Km.Warehouse.View.Running.warehouseGrid.getSelectionModel().getSelected());
 
					}                  
				}]    
			}, config);  
			Km.Warehouse.View.EditWindow.superclass.constructor.call(this, config);     
		}
	}),
	/**
	 * 显示仓库详情
	 */
	WarehouseView:{
		/**
		 * Tab页：容器包含显示与仓库所有相关的信息
		 */  
		Tabs:Ext.extend(Ext.TabPanel,{ 
			constructor : function(config) { 
				config = Ext.apply({             
					region : 'south',collapseMode : 'mini',split : true,
					activeTab: 1, tabPosition:"bottom",resizeTabs : true,     
					header:false,enableTabScroll : true,tabWidth:'auto', margins : '0 3 3 0',
					defaults : {
						autoScroll : true
					},
					listeners:{
						beforetabchange:function(tabs,newtab,currentTab){  
							if (tabs.tabFix==newtab){            
								if (Km.Warehouse.View.Running.warehouseGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择仓库！');
									return false;
								} 
								Km.Warehouse.Config.View.IsShow=1;
								Km.Warehouse.View.Running.warehouseGrid.showWarehouse();   
								Km.Warehouse.View.Running.warehouseGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Warehouse.View.WarehouseView.Tabs.superclass.constructor.call(this, config); 
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Warehouse.Config.View.Direction==1)||(Km.Warehouse.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabWarehouseDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">', 
						 '<tr class="entry"><td class="head">供应商</td><td class="content">{sp_name}</td></tr>',
						 '<tr class="entry"><td class="head">仓库名称</td><td class="content">{warehouse_name}</td></tr>',
						 '<tr class="entry"><td class="head">联系人</td><td class="content">{contactman}</td></tr>',
						 '<tr class="entry"><td class="head">联系电话</td><td class="content">{mobilephone}</td></tr>',
						 '<tr class="entry"><td class="head">是否默认仓库</td><td class="content"><tpl if="isDefault == true">是</tpl><tpl if="isDefault == false">否</tpl></td></tr>',
						 '<tr class="entry"><td class="head">仓库地址</td><td class="content">{address}</td></tr>',                      
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
		 * 窗口:显示仓库信息
		 */
		Window:Ext.extend(Ext.Window,{ 
			constructor : function(config) { 
				config = Ext.apply({
					title:"查看仓库",constrainHeader:true,maximizable: true,minimizable : true, 
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Warehouse.View.WarehouseView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: { 
						minimize:function(w){
							w.hide();
							Km.Warehouse.Config.View.IsShow=0;
							Km.Warehouse.View.Running.warehouseGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Warehouse.View.Running.warehouseGrid.tvpView.toggle(false);
						}   
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Warehouse.View.Running.warehouseGrid.addWarehouse();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Warehouse.View.Running.warehouseGrid.updateWarehouse();}
					}]
				}, config);  
				Km.Warehouse.View.WarehouseView.Window.superclass.constructor.call(this, config);   
			}        
		})
	},
	/**
	 * 窗口：批量上传仓库
	 */        
	UploadWindow:Ext.extend(Ext.Window,{ 
		constructor : function(config) { 
			config = Ext.apply({     
				title : '批量仓库上传',
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
							emptyText: '请上传仓库Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadWarehouse',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Warehouse.View.Running.warehouseGrid.doSelectWarehouse();
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
			Km.Warehouse.View.UploadWindow.superclass.constructor.call(this, config);     
		}        
	}),
	/**
	 * 视图：仓库列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件  
				 */
				filter:null,
				region : 'center',
				store : Km.Warehouse.Store.warehouseStore,
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
						{header : '供应商',dataIndex : 'sp_name'},
						{header : '仓库名称',dataIndex : 'warehouse_name'},
						{header : '联系人',dataIndex : 'contactman'},
						{header : '联系电话',dataIndex : 'mobilephone'},
						{header : '是否默认仓库',dataIndex : 'isDefault',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
						{header : '仓库地址',dataIndex : 'address'}                                 
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
								'仓库名称　',{ref: '../wwarehouse_name'},'&nbsp;&nbsp;',
								'联系人　',{ref: '../wcontactman'},'&nbsp;&nbsp;',                                
								{
									xtype : 'button',text : '查询',scope: this, 
									handler : function() {
										this.doSelectWarehouse();
									}
								}, 
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.wwarehouse_name.setValue("");
										this.topToolbar.wcontactman.setValue("");                                        
										this.filter={};
										this.doSelectWarehouse();
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
								},'-',
/*                                {
									text : '添加仓库',iconCls : 'icon-add',
									handler : function() {
										this.addWarehouse();
									}
								},'-',*/
								{
									text : '修改仓库',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
									handler : function() {
										this.updateWarehouse();
									}
								},'-',
/*                                {
									text : '删除仓库', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
									handler : function() {
										this.deleteWarehouse();
									}
								},'-',
								{
									text : '导入',iconCls : 'icon-import', 
									handler : function() {
										this.importWarehouse();
									}
								},'-',*/
								{
									text : '导出',iconCls : 'icon-export', 
									handler : function() { 
										this.exportWarehouse();
									}
								},'-',{ 
									xtype:'tbsplit',text: '查看仓库', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,  
									handler:function(){this.showWarehouse()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideWarehouse();Km.Warehouse.Config.View.IsShow=0;}},'-', 
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Warehouse.Cookie.set('View.IsFix',Km.Warehouse.Config.View.IsFix);}} 
										]}
								},'-']}
					)]
				},                
				bbar: new Ext.PagingToolbar({          
					pageSize: Km.Warehouse.Config.PageSize,
					store: Km.Warehouse.Store.warehouseStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Warehouse.Config.PageSize,minValue:1,width:35, 
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Warehouse.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Warehouse.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectWarehouse();
								}, 
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Warehouse.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Warehouse.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectWarehouse();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示仓库列表
			this.doSelectWarehouse();
			Km.Warehouse.View.Grid.superclass.constructor.call(this, config); 
			//创建在Grid里显示的仓库信息Tab页
			Km.Warehouse.View.Running.viewTabs=new Km.Warehouse.View.WarehouseView.Tabs();
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
					//this.grid.btnRemove.setDisabled(sm.getCount() < 1);
					this.grid.btnUpdate.setDisabled(sm.getCount() != 1);
					this.grid.tvpView.setDisabled(sm.getCount() != 1); 
				},
				rowselect: function(sm, rowIndex, record) {  
					this.grid.updateViewWarehouse();                     
					if (sm.getCount() != 1){
						this.grid.hideWarehouse();
						Km.Warehouse.Config.View.IsShow=0;
					}else{
						if (Km.Warehouse.View.IsSelectView==1){
							Km.Warehouse.View.IsSelectView=0;  
							this.grid.showWarehouse();   
						}     
					}    
				},
				rowdeselect: function(sm, rowIndex, record) {  
					if (sm.getCount() != 1){
						if (Km.Warehouse.Config.View.IsShow==1){
							Km.Warehouse.View.IsSelectView=1;    
						}             
						this.grid.hideWarehouse();
						Km.Warehouse.Config.View.IsShow=0;
					}    
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){  
			if (!Km.Warehouse.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showWarehouse();
				this.tvpView.toggle(true);
			}else{
				this.hideWarehouse();
				Km.Warehouse.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){ 
			if (checked){             
			   Km.Warehouse.Config.View.IsFix=1; 
			}else{ 
			   Km.Warehouse.Config.View.IsFix=0;   
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Warehouse.Config.View.IsShow=0;
				return ;
			}
			if (Km.Warehouse.Config.View.IsShow==1){
			   this.hideWarehouse(); 
			   Km.Warehouse.Config.View.IsShow=0;
			}
			this.showWarehouse();   
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
		 * 查询符合条件的仓库
		 */
		doSelectWarehouse : function() {
			if (this.topToolbar){
				var wwarehouse_name = this.topToolbar.wwarehouse_name.getValue();
				var wcontactman = this.topToolbar.wcontactman.getValue();
				this.filter       ={'warehouse_name':wwarehouse_name,'contactman':wcontactman};
			}
			var condition = {'start':0,'limit':Km.Warehouse.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceWarehouse.queryPageWarehouse(condition,function(provider, response) {   
				if (response.result.data) {   
					var result           = new Array();
					result['data']       =response.result.data; 
					result['totalCount'] =response.result.totalCount;
					Km.Warehouse.Store.warehouseStore.loadData(result); 
				} else {
					Km.Warehouse.Store.warehouseStore.removeAll();                        
					Ext.Msg.alert('提示', '无符合条件的仓库！');
				}
			});
		}, 
		/**
		 * 显示仓库视图
		 * 显示仓库的视图相对仓库列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Warehouse.Config.View.Direction=viewDirection; 
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Warehouse.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Warehouse.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Warehouse.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Warehouse.View.Running.viewTabs);
					break;    
			}  
			Km.Warehouse.Cookie.set('View.Direction',Km.Warehouse.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Warehouse.Config.View.IsFix==0)&&(Km.Warehouse.Config.View.IsShow==1)){
					this.showWarehouse();     
				}
				Km.Warehouse.Config.View.IsFix=1;
				Km.Warehouse.View.Running.warehouseGrid.tvpView.menu.mBind.setChecked(true,true);  
				Km.Warehouse.Config.View.IsShow=0;
				this.showWarehouse();     
			}
		}, 
		/**
		 * 显示仓库
		 */
		showWarehouse : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择仓库！');
				Km.Warehouse.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			} 
			if (Km.Warehouse.Config.View.IsFix==0){
				if (Km.Warehouse.View.Running.view_window==null){
					Km.Warehouse.View.Running.view_window=new Km.Warehouse.View.WarehouseView.Window();
				}
				if (Km.Warehouse.View.Running.view_window.hidden){
					Km.Warehouse.View.Running.view_window.show();
					Km.Warehouse.View.Running.view_window.winTabs.hideTabStripItem(Km.Warehouse.View.Running.view_window.winTabs.tabFix);   
					this.updateViewWarehouse();
					this.tvpView.toggle(true);
					Km.Warehouse.Config.View.IsShow=1;
				}else{
					this.hideWarehouse();
					Km.Warehouse.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Warehouse.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Warehouse.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Warehouse.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Warehouse.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Warehouse.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Warehouse.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Warehouse.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Warehouse.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Warehouse.View.Running.viewTabs);
					}
					break;    
			}  
			this.hideWarehouse();
			if (Km.Warehouse.Config.View.IsShow==0){
				Km.Warehouse.View.Running.viewTabs.enableCollapse();  
				switch(Km.Warehouse.Config.View.Direction){
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
				this.updateViewWarehouse();
				this.tvpView.toggle(true);
				Km.Warehouse.Config.View.IsShow=1;
			}else{
				Km.Warehouse.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏仓库
		 */
		hideWarehouse : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();   
			this.ownerCt.east.hide(); 
			if (Km.Warehouse.View.Running.view_window!=null){
				Km.Warehouse.View.Running.view_window.hide();
			}            
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前仓库显示信息
		 */
		updateViewWarehouse : function() {
			if (Km.Warehouse.View.Running.view_window!=null){
				Km.Warehouse.View.Running.view_window.winTabs.tabWarehouseDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Warehouse.View.Running.viewTabs.tabWarehouseDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建仓库
		 */
		addWarehouse : function() {  
			if (Km.Warehouse.View.Running.edit_window==null){   
				Km.Warehouse.View.Running.edit_window=new Km.Warehouse.View.EditWindow();   
			}     			
			Km.Warehouse.View.Running.edit_window.show();   
			Km.Warehouse.View.Running.edit_window.maximize();               
		},   
		/**
		 * 编辑仓库时先获得选中的仓库信息
		 */
		updateWarehouse : function() {
			if (Km.Warehouse.View.Running.update_window==null){   
				Km.Warehouse.View.Running.update_window=new Km.Warehouse.View.UpdateWindow();   
			}            
			Km.Warehouse.View.Running.update_window.updateForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Warehouse.View.Running.update_window.show();    
			Km.Warehouse.View.Running.update_window.maximize();                  
		},        
		/**
		 * 删除仓库
		 */
		deleteWarehouse : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的仓库吗?', this.confirmDeleteWarehouse,this);
		}, 
		/**
		 * 确认删除仓库
		 */
		confirmDeleteWarehouse : function(btn) {
			if (btn == 'yes') {  
				var del_warehouse_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_warehouse_ids=del_warehouse_ids+selectedRows[flag].data.warehouse_id+",";
				}
				ExtServiceWarehouse.deleteByIds(del_warehouse_ids);
				this.doSelectWarehouse();
				Ext.Msg.alert("提示", "删除成功！");        
			}
		},
		/**
		 * 导出仓库
		 */
		exportWarehouse : function() {            
			ExtServiceWarehouse.exportWarehouse(this.filter,function(provider, response) {  
				if (response.result.data) {
					window.open(response.result.data);
				}
			});                        
		},
		/**
		 * 导入仓库
		 */
		importWarehouse : function() { 
			if (Km.Warehouse.View.current_uploadWindow==null){   
				Km.Warehouse.View.current_uploadWindow=new Km.Warehouse.View.UploadWindow();   
			}     
			Km.Warehouse.View.current_uploadWindow.show();
		}                
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Warehouse.View.Running.warehouseGrid=new Km.Warehouse.View.Grid();           
			if (Km.Warehouse.Config.View.IsFix==0){
				Km.Warehouse.View.Running.warehouseGrid.tvpView.menu.mBind.setChecked(false,true);  
			}
			config = Ext.apply({ 
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Warehouse.View.Running.warehouseGrid, 
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Warehouse.View.Running.viewTabs]}, 
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
					]
				}
			}, config);   
			Km.Warehouse.View.Panel.superclass.constructor.call(this, config);  
		}        
	}),
	/**
	 * 当前运行的可视化对象
	 */ 
	Running:{         
		/**
		 * 当前仓库Grid对象
		 */
		warehouseGrid:null,  
		/**
		 * 显示仓库信息及关联信息列表的Tab页
		 */
		viewTabs:null,
		/**
		 * 当前创建的新建窗口
		 */
		edit_window:null,  
		/**
		 * 当前创建的修改窗口
		 */
		update_window:null,  
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
	Ext.state.Manager.setProvider(Km.Warehouse.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);     
	Km.Warehouse.Init();
	/**
	 * 仓库数据模型获取数据Direct调用
	 */        
	Km.Warehouse.Store.warehouseStore.proxy=new Ext.data.DirectProxy({ 
		api: {read:ExtServiceWarehouse.queryPageWarehouse}
	});   
	/**
	 * 仓库页面布局
	 */
	Km.Warehouse.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Warehouse.View.Panel()]
	});
	Km.Warehouse.Viewport.doLayout();                                  
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});     