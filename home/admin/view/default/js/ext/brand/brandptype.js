Ext.namespace("Kmall.Admin.Brandptype");
Km = Kmall.Admin.Brandptype;
Km.Brandptype={
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
			 * 显示品牌商品分类关系的视图相对品牌商品分类关系列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示品牌商品分类关系信息页(或者打开新窗口)
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
		if (Km.Brandptype.Cookie.get('View.Direction')){
			Km.Brandptype.Config.View.Direction=Km.Brandptype.Cookie.get('View.Direction');
		}
		if (Km.Brandptype.Cookie.get('View.IsFix')!=null){
			Km.Brandptype.Config.View.IsFix=Km.Brandptype.Cookie.get('View.IsFix');
		}
	}
}; 
/**
 * Model:数据模型   
 */
Km.Brandptype.Store = { 
	/**
	 * 品牌商品分类关系
	 */ 
	brandptypeStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',  
			root: 'data',remoteSort: true,                
			fields : [
				{name: 'brandptype_id',type: 'int'},
				{name: 'brand_id',type: 'int'},
				{name: 'brand_name',type: 'string'},
				{name: 'ptype_id',type: 'int'},
				{name: 'ptype1_name',type: 'string'},
				{name: 'ptype2_name',type: 'string'},
				{name: 'name',type: 'string'}, 
				{name: 'isShow',type: 'string'},
				{name: 'isRecommend',type: 'string'}
			]}         
		),
		writer: new Ext.data.JsonWriter({
			encode: false 
		}),
		listeners : {    
			beforeload : function(store, options) {   
				if (Ext.isReady) {  
					Ext.apply(options.params, Km.Brandptype.View.Running.brandptypeGrid.filter);//保证分页也将查询条件带上  
				}
			}
		}    
	}),
	/**
	 * 品牌
	 */
	brandStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/brand.php'
		}),
		reader: new Ext.data.JsonReader({
			root: 'brands',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'brand_id'
		}, [
			{name: 'brand_id', mapping: 'brand_id'}, 
			{name: 'brand_name', mapping: 'brand_name'} 
		])
	}),
	/**
	 * 商品类型
	 */
	ptypeStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/ptype.php'
		}),
		reader: new Ext.data.JsonReader({
			root: 'ptypes',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'ptype_id'
		}, [
			{name: 'ptype_id', mapping: 'ptype_id'}, 
			{name: 'name', mapping: 'name'} 
		])
	})      
};
/**
 * View:品牌商品分类关系显示组件   
 */
Km.Brandptype.View={ 
	/**
	 * 编辑窗口：新建或者修改品牌商品分类关系
	 */        
	EditWindow:Ext.extend(Ext.Window,{
		constructor : function(config) { 
			config = Ext.apply({ 
				/**
				 * 自定义类型:保存类型
				 * 0:保存窗口,1:修改窗口
				 */
				savetype:0,closeAction : "hide",  
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
							{xtype: 'hidden',  name : 'brandptype_id',ref:'../brandptype_id'},
							{xtype: 'hidden',name : 'brand_id',id:'brand_id'},
							{
								 fieldLabel : '品牌',xtype: 'combo',name : 'brand_name',id : 'brand_name',
								 store:Km.Brandptype.Store.brandStore,emptyText: '请选择品牌',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Brandptype.Config.PageSize,
								 displayField:'brand_name',// 显示文本
								 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
								 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
								 tpl:new Ext.XTemplate(
											'<tpl for="."><div class="search-item">',
												'<h3>{brand_name}</h3>',
											'</div></tpl>'
								 ),
								 onSelect:function(record,index){
									 if(this.fireEvent('beforeselect', this, record, index) !== false){
										Ext.getCmp("brand_id").setValue(record.data.brand_id);
										Ext.getCmp("brand_name").setValue(record.data.brand_name);
										this.collapse();
									 }
								 }
							},
							{xtype: 'hidden',name : 'ptype_id',id:'ptype_id'},
							{
								 fieldLabel : '商品类型',xtype: 'combo',name : 'name',id : 'name',
								 store:Km.Brandptype.Store.ptypeStore,emptyText: '请选择商品类型',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Brandptype.Config.PageSize,
								 displayField:'name',// 显示文本
								 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
								 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
								 tpl:new Ext.XTemplate(
											'<tpl for="."><div class="search-item">',
												'<h3>{name}</h3>',
											'</div></tpl>'
								 ),
								 onSelect:function(record,index){
									 if(this.fireEvent('beforeselect', this, record, index) !== false){
										Ext.getCmp("ptype_id").setValue(record.data.ptype_id);
										Ext.getCmp("name").setValue(record.data.name);
										this.collapse();
									 }
								 }
							},                                                                       
							{fieldLabel : '是否显示',hiddenName : 'isShow',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '否'], ['1', '是']]
								}),emptyText: '请选择是否显示',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							{fieldLabel : '是否推荐',hiddenName : 'isRecommend',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '否'], ['1', '是']]
								}),emptyText: '请选择是否推荐',
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
							this.editForm.api.submit=ExtServiceBrandptype.save;                   
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Brandptype.View.Running.brandptypeGrid.doSelectBrandptype();
									form.reset(); 
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceBrandptype.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Brandptype.View.Running.brandptypeGrid.doSelectBrandptype();
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
						this.editForm.form.loadRecord(Km.Brandptype.View.Running.brandptypeGrid.getSelectionModel().getSelected());
 
					}                  
				}]    
			}, config);  
			Km.Brandptype.View.EditWindow.superclass.constructor.call(this, config);     
		}
	}),
	/**
	 * 显示品牌商品分类关系详情
	 */
	BrandptypeView:{
		/**
		 * Tab页：容器包含显示与品牌商品分类关系所有相关的信息
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
								if (Km.Brandptype.View.Running.brandptypeGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择品牌商品分类关系！');
									return false;
								} 
								Km.Brandptype.Config.View.IsShow=1;
								Km.Brandptype.View.Running.brandptypeGrid.showBrandptype();   
								Km.Brandptype.View.Running.brandptypeGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title: '+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Brandptype.View.BrandptypeView.Tabs.superclass.constructor.call(this, config); 
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Brandptype.Config.View.Direction==1)||(Km.Brandptype.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabBrandptypeDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">', 
						 '<tr class="entry"><td class="head">品牌</td><td class="content">{brand_name}</td></tr>',
						 '<tr class="entry"><td class="head">商品类型</td><td class="content">{name}</td></tr>',      
						 '<tr class="entry"><td class="head">商品分类[一级]</td><td class="content">{ptype1_name}</td></tr>',
						 '<tr class="entry"><td class="head">商品分类[二级]</td><td class="content">{ptype2_name}</td></tr>',
						 '<tr class="entry"><td class="head">是否显示</td><td class="content"><tpl if="isShow == true">是</tpl><tpl if="isShow == false">否</tpl></td></tr>',
						 '<tr class="entry"><td class="head">是否推荐</td><td class="content"><tpl if="isRecommend == true">是</tpl><tpl if="isRecommend == false">否</tpl></td></tr>',                      
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
		 * 窗口:显示品牌商品分类关系信息
		 */
		Window:Ext.extend(Ext.Window,{ 
			constructor : function(config) { 
				config = Ext.apply({
					title:"查看品牌商品分类关系",constrainHeader:true,maximizable: true,minimizable : true, 
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Brandptype.View.BrandptypeView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: { 
						minimize:function(w){
							w.hide();
							Km.Brandptype.Config.View.IsShow=0;
							Km.Brandptype.View.Running.brandptypeGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Brandptype.View.Running.brandptypeGrid.tvpView.toggle(false);
						}   
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Brandptype.View.Running.brandptypeGrid.addBrandptype();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Brandptype.View.Running.brandptypeGrid.updateBrandptype();}
					}]
				}, config);  
				Km.Brandptype.View.BrandptypeView.Window.superclass.constructor.call(this, config);   
			}        
		})
	},
	/**
	 * 窗口：批量上传品牌商品分类关系
	 */        
	UploadWindow:Ext.extend(Ext.Window,{ 
		constructor : function(config) { 
			config = Ext.apply({     
				title : '批量品牌商品分类关系上传',
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
							emptyText: '请上传品牌商品分类关系Excel文件',buttonText: '',
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
							validationExpression   =/([\u4E00-\u9FA5]|\w)+(.xlsx|.XLSX|.xls|.XLS)$/;
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
									url : 'index.php?go=admin.upload.uploadBrandptype',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Brandptype.View.Running.brandptypeGrid.doSelectBrandptype();
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
			Km.Brandptype.View.UploadWindow.superclass.constructor.call(this, config);     
		}        
	}),
	/**
	 * 视图：品牌商品分类关系列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件  
				 */
				filter:null,
				region : 'center',
				store : Km.Brandptype.Store.brandptypeStore,
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
						{header : '品牌',dataIndex : 'brand_name'},
						{header : '商品类型',dataIndex : 'name'},
						{header : '商品分类[一级]',dataIndex : 'ptype1_name'},
						{header : '商品分类[二级]',dataIndex : 'ptype2_name'},
						{header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
						{header : '是否推荐',dataIndex : 'isRecommend',renderer:function(value){if (value == true) {return "是";}else{return "否";}}}                                 
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
								'是否显示　',{ref: '../bisShow',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '否'], ['1', '是']]
									}),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',                                
								{
									xtype : 'button',text : '查询',scope: this, 
									handler : function() {
										this.doSelectBrandptype();
									}
								}, 
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.bisShow.setValue("");                                        
										this.filter={};
										this.doSelectBrandptype();
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
									text : '添加品牌商品分类关系',iconCls : 'icon-add',
									handler : function() {
										this.addBrandptype();
									}
								},'-',{
									text : '修改品牌商品分类关系',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
									handler : function() {
										this.updateBrandptype();
									}
								},'-',{
									text : '删除品牌商品分类关系', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
									handler : function() {
										this.deleteBrandptype();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import', 
									handler : function() {
										this.importBrandptype();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export', 
									handler : function() { 
										this.exportBrandptype();
									}
								},'-',{ 
									xtype:'tbsplit',text: '查看品牌商品分类关系', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,  
									handler:function(){this.showBrandptype()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideBrandptype();Km.Brandptype.Config.View.IsShow=0;}},'-', 
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Brandptype.Cookie.set('View.IsFix',Km.Brandptype.Config.View.IsFix);}} 
										]}
								},'-',{                                                                       
									xtype:'tbsplit',text: '操作', ref:'../../contract',iconCls : 'icon-updown',  
									disabled : false,    
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'一键生成',iconCls : 'icon-import',scope:this,handler:function(){this.onekeycreat()}}
										]}
								}
								]}
					)]
				},                
				bbar: new Ext.PagingToolbar({          
					pageSize: Km.Brandptype.Config.PageSize,
					store: Km.Brandptype.Store.brandptypeStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Brandptype.Config.PageSize,minValue:1,width:35, 
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Brandptype.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Brandptype.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectBrandptype();
								}, 
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Brandptype.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Brandptype.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectBrandptype();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示品牌商品分类关系列表
			this.doSelectBrandptype();
			Km.Brandptype.View.Grid.superclass.constructor.call(this, config); 
			//创建在Grid里显示的品牌商品分类关系信息Tab页
			Km.Brandptype.View.Running.viewTabs=new Km.Brandptype.View.BrandptypeView.Tabs();
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
					this.grid.updateViewBrandptype();                     
					if (sm.getCount() != 1){
						this.grid.hideBrandptype();
						Km.Brandptype.Config.View.IsShow=0;
					}else{
						if (Km.Brandptype.View.IsSelectView==1){
							Km.Brandptype.View.IsSelectView=0;  
							this.grid.showBrandptype();   
						}     
					}    
				},
				rowdeselect: function(sm, rowIndex, record) {  
					if (sm.getCount() != 1){
						if (Km.Brandptype.Config.View.IsShow==1){
							Km.Brandptype.View.IsSelectView=1;    
						}             
						this.grid.hideBrandptype();
						Km.Brandptype.Config.View.IsShow=0;
					}    
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){  
			if (!Km.Brandptype.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showBrandptype();
				this.tvpView.toggle(true);
			}else{
				this.hideBrandptype();
				Km.Brandptype.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){ 
			if (checked){             
			   Km.Brandptype.Config.View.IsFix=1; 
			}else{ 
			   Km.Brandptype.Config.View.IsFix=0;   
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Brandptype.Config.View.IsShow=0;
				return ;
			}
			if (Km.Brandptype.Config.View.IsShow==1){
			   this.hideBrandptype(); 
			   Km.Brandptype.Config.View.IsShow=0;
			}
			this.showBrandptype();   
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
		 * 查询符合条件的品牌商品分类关系
		 */
		doSelectBrandptype : function() {
			if (this.topToolbar){
				var bisShow = this.topToolbar.bisShow.getValue();
				this.filter       ={'isShow':bisShow};
			}
			var condition = {'start':0,'limit':Km.Brandptype.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceBrandptype.queryPageBrandptype(condition,function(provider, response) {   
				if (response.result.data) {   
					var result           = new Array();
					result['data']       =response.result.data; 
					result['totalCount'] =response.result.totalCount;
					Km.Brandptype.Store.brandptypeStore.loadData(result); 
				} else {
					Km.Brandptype.Store.brandptypeStore.removeAll();                        
					Ext.Msg.alert('提示', '无符合条件的品牌商品分类关系！');
				}
			});
		}, 
		/**
		 * 显示品牌商品分类关系视图
		 * 显示品牌商品分类关系的视图相对品牌商品分类关系列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Brandptype.Config.View.Direction=viewDirection; 
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Brandptype.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Brandptype.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Brandptype.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Brandptype.View.Running.viewTabs);
					break;    
			}  
			Km.Brandptype.Cookie.set('View.Direction',Km.Brandptype.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Brandptype.Config.View.IsFix==0)&&(Km.Brandptype.Config.View.IsShow==1)){
					this.showBrandptype();     
				}
				Km.Brandptype.Config.View.IsFix=1;
				Km.Brandptype.View.Running.brandptypeGrid.tvpView.menu.mBind.setChecked(true,true);  
				Km.Brandptype.Config.View.IsShow=0;
				this.showBrandptype();     
			}
		}, 
		/**
		 * 显示品牌商品分类关系
		 */
		showBrandptype : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择品牌商品分类关系！');
				Km.Brandptype.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			} 
			if (Km.Brandptype.Config.View.IsFix==0){
				if (Km.Brandptype.View.Running.view_window==null){
					Km.Brandptype.View.Running.view_window=new Km.Brandptype.View.BrandptypeView.Window();
				}
				if (Km.Brandptype.View.Running.view_window.hidden){
					Km.Brandptype.View.Running.view_window.show();
					Km.Brandptype.View.Running.view_window.winTabs.hideTabStripItem(Km.Brandptype.View.Running.view_window.winTabs.tabFix);   
					this.updateViewBrandptype();
					this.tvpView.toggle(true);
					Km.Brandptype.Config.View.IsShow=1;
				}else{
					this.hideBrandptype();
					Km.Brandptype.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Brandptype.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Brandptype.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Brandptype.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Brandptype.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Brandptype.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Brandptype.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Brandptype.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Brandptype.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Brandptype.View.Running.viewTabs);
					}
					break;    
			}  
			this.hideBrandptype();
			if (Km.Brandptype.Config.View.IsShow==0){
				Km.Brandptype.View.Running.viewTabs.enableCollapse();  
				switch(Km.Brandptype.Config.View.Direction){
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
				this.updateViewBrandptype();
				this.tvpView.toggle(true);
				Km.Brandptype.Config.View.IsShow=1;
			}else{
				Km.Brandptype.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏品牌商品分类关系
		 */
		hideBrandptype : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();   
			this.ownerCt.east.hide(); 
			if (Km.Brandptype.View.Running.view_window!=null){
				Km.Brandptype.View.Running.view_window.hide();
			}            
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前品牌商品分类关系显示信息
		 */
		updateViewBrandptype : function() {
			if (Km.Brandptype.View.Running.view_window!=null){
				Km.Brandptype.View.Running.view_window.winTabs.tabBrandptypeDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Brandptype.View.Running.viewTabs.tabBrandptypeDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建品牌商品分类关系
		 */
		addBrandptype : function() {  
			if (Km.Brandptype.View.Running.edit_window==null){   
				Km.Brandptype.View.Running.edit_window=new Km.Brandptype.View.EditWindow();   
			}     
			Km.Brandptype.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Brandptype.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Brandptype.View.Running.edit_window.setTitle('添加品牌商品分类关系');
			Km.Brandptype.View.Running.edit_window.savetype=0;
			Km.Brandptype.View.Running.edit_window.brandptype_id.setValue("");
			
			Km.Brandptype.View.Running.edit_window.show();   
			Km.Brandptype.View.Running.edit_window.maximize();               
		},   
		/**
		 * 编辑品牌商品分类关系时先获得选中的品牌商品分类关系信息
		 */
		updateBrandptype : function() {
			if (Km.Brandptype.View.Running.edit_window==null){   
				Km.Brandptype.View.Running.edit_window=new Km.Brandptype.View.EditWindow();   
			}            
			Km.Brandptype.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Brandptype.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Brandptype.View.Running.edit_window.setTitle('修改品牌商品分类关系');
			Km.Brandptype.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Brandptype.View.Running.edit_window.savetype=1;
			
			Km.Brandptype.View.Running.edit_window.show();    
			Km.Brandptype.View.Running.edit_window.maximize();                  
		},        
		/**
		 * 删除品牌商品分类关系
		 */
		deleteBrandptype : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的品牌商品分类关系吗?', this.confirmDeleteBrandptype,this);
		}, 
		/**
		 * 确认删除品牌商品分类关系
		 */
		confirmDeleteBrandptype : function(btn) {
			if (btn == 'yes') {  
				var del_brandptype_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_brandptype_ids=del_brandptype_ids+selectedRows[flag].data.brandptype_id+",";
				}
				ExtServiceBrandptype.deleteByIds(del_brandptype_ids);
				this.doSelectBrandptype();
				Ext.Msg.alert("提示", "删除成功！");        
			}
		},
		/**
		 * 导出品牌商品分类关系
		 */
		exportBrandptype : function() {            
			ExtServiceBrandptype.exportBrandptype(this.filter,function(provider, response) {  
				if (response.result.data) {
					window.open(response.result.data);
				}
			});                        
		},
		/**
		 * 导入品牌商品分类关系
		 */
		importBrandptype : function() { 
			if (Km.Brandptype.View.current_uploadWindow==null){   
				Km.Brandptype.View.current_uploadWindow=new Km.Brandptype.View.UploadWindow();   
			}     
			Km.Brandptype.View.current_uploadWindow.show();
		},
		
		/**
		* 一键生成
		*/
		onekeycreat : function() {                                          
			Ext.Msg.show({
				title : '请等待',msg : '文件正在上传中，请稍后...',
				animEl : 'loading',icon : Ext.Msg.WARNING,
				closable : true,progress : true,progressText : '',width : 300
			});
			ExtServiceBrandptype.saveToBrandptype(function(result, action) { 
				if(result.success){
					Ext.Msg.alert('成功', '成功');
				}else{
					Ext.Msg.alert('错误', action.result.msg);
				} 
			});                                 
		}                
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Brandptype.View.Running.brandptypeGrid=new Km.Brandptype.View.Grid();           
			if (Km.Brandptype.Config.View.IsFix==0){
				Km.Brandptype.View.Running.brandptypeGrid.tvpView.menu.mBind.setChecked(false,true);  
			}
			config = Ext.apply({ 
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Brandptype.View.Running.brandptypeGrid, 
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Brandptype.View.Running.viewTabs]}, 
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
					]
				}
			}, config);   
			Km.Brandptype.View.Panel.superclass.constructor.call(this, config);  
		}        
	}),
	/**
	 * 当前运行的可视化对象
	 */ 
	Running:{         
		/**
		 * 当前品牌商品分类关系Grid对象
		 */
		brandptypeGrid:null,  
		/**
		 * 显示品牌商品分类关系信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Brandptype.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);     
	Km.Brandptype.Init();
	/**
	 * 品牌商品分类关系数据模型获取数据Direct调用
	 */        
	Km.Brandptype.Store.brandptypeStore.proxy=new Ext.data.DirectProxy({ 
		api: {read:ExtServiceBrandptype.queryPageBrandptype}
	});   
	/**
	 * 品牌商品分类关系页面布局
	 */
	Km.Brandptype.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Brandptype.View.Panel()]
	});
	Km.Brandptype.Viewport.doLayout();                               
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
}); 