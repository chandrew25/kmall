Ext.namespace("Kmall.Admin.Ptypeshow");
Km = Kmall.Admin.Ptypeshow;
Km.Ptypeshow={
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
			 * 显示商品显示的视图相对商品显示列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示商品显示信息页(或者打开新窗口)
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
		if (Km.Ptypeshow.Cookie.get('View.Direction')){
			Km.Ptypeshow.Config.View.Direction=Km.Ptypeshow.Cookie.get('View.Direction');
		}
		if (Km.Ptypeshow.Cookie.get('View.IsFix')!=null){
			Km.Ptypeshow.Config.View.IsFix=Km.Ptypeshow.Cookie.get('View.IsFix');
		}
	}
}; 
/**
 * Model:数据模型   
 */
Km.Ptypeshow.Store = { 
	/**
	 * 商品显示
	 */ 
	ptypeshowStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',  
			root: 'data',remoteSort: true,                
			fields : [
				{name: 'ptypeshow_id',type: 'int'},
				{name: 'product_id',type: 'int'},
				{name: 'product_name',type: 'string'},
				{name: 'ico',type: 'string'},
				{name: 'showtype',type: 'string'},
                {name: 'showtypeShow',type: 'string'},
				{name: 'unit',type: 'string'},
				{name: 'market_price',type: 'float'},
				{name: 'price',type: 'float'},
				{name: 'isShow',type: 'string'},
				{name: 'sort_order',type: 'int'}
			]}         
		),
		writer: new Ext.data.JsonWriter({
			encode: false 
		}),
		listeners : {    
			beforeload : function(store, options) {   
				if (Ext.isReady) {  
					Ext.apply(options.params, Km.Ptypeshow.View.Running.ptypeshowGrid.filter);//保证分页也将查询条件带上  
				}
			}
		}    
	}),
	/**
	 * 商品
	 */
	productStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/product.php'
		}),
		reader: new Ext.data.JsonReader({
			root: 'products',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'product_id'
		}, [
			{name: 'product_id', mapping: 'product_id'}, 
			{name: 'product_name', mapping: 'product_name'} 
		])
	}),
	/**
	 * 量词
	 */
	quantifierStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/quantifier.php'
		}),
		reader: new Ext.data.JsonReader({
			root: 'quantifiers',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'quantifier_id'
		}, [                                     
			{name: 'quantifier_name', mapping: 'quantifier_name'} 
		])
	})                  
};
/**
 * View:商品显示显示组件   
 */
Km.Ptypeshow.View={ 
	/**
	 * 编辑窗口：新建或者修改商品显示
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
						ref:'editForm',layout:'form',fileUpload: true, 
						labelWidth : 100,labelAlign : "center",
						bodyStyle : 'padding:5px 5px 0',align : "center",
						api : {},
						defaults : {
							xtype : 'textfield',anchor:'100%'
						},
						items : [ 
							{xtype: 'hidden',  name : 'ptypeshow_id',ref:'../ptypeshow_id'},
							{xtype: 'hidden',name : 'product_id',id:'product_id'},
							{
								 fieldLabel : '商品名称',xtype: 'combo',name : 'product_name',id : 'product_name',
								 store:Km.Ptypeshow.Store.productStore,emptyText: '请选择商品名称',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Ptypeshow.Config.PageSize,
								 displayField:'product_name',// 显示文本
								 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
								 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
								 tpl:new Ext.XTemplate(
											'<tpl for="."><div class="search-item">',
												'<h3>{product_name}</h3>',
											'</div></tpl>'
								 ),
								 onSelect:function(record,index){
									 if(this.fireEvent('beforeselect', this, record, index) !== false){
										Ext.getCmp("product_id").setValue(record.data.product_id);
										Ext.getCmp("product_name").setValue(record.data.product_name);
										this.collapse();
									 }
								 }
							},
							{xtype: 'hidden',  name : 'ico',ref:'../ico'},
							{fieldLabel : '商品显示图片',name : 'imageUpload',ref:'../imageUpload',xtype:'fileuploadfield',
							 emptyText: '请上传商品显示图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
							{fieldLabel : '显示类型',hiddenName : 'showtype',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['1', '新品推介'],['2', '打折优惠'],['3', '热销排行']]
								}),emptyText: '请选择显示类型',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},	
							{
								 fieldLabel : '商品量词',xtype: 'combo',name : 'unit',id : 'unit',
								 store:Km.Ptypeshow.Store.quantifierStore,emptyText: '请选择商品量词',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Ptypeshow.Config.PageSize,
								 displayField:'quantifier_name',// 显示文本
								 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
								 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
								 tpl:new Ext.XTemplate(
											'<tpl for="."><div class="search-item">',
												'<h3>{quantifier_name}</h3>',
											'</div></tpl>'
								 ),
								 onSelect:function(record,index){
									 if(this.fireEvent('beforeselect', this, record, index) !== false){            
										Ext.getCmp("unit").setValue(record.data.quantifier_name);
										this.collapse();
									 }
								 }
							},  
							{fieldLabel : '市场价',name : 'market_price'},
							{fieldLabel : '销售价',name : 'price'},
							{fieldLabel : '是否显示',hiddenName : 'isShow',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '否'], ['1', '是']]
								}),emptyText: '请选择是否显示',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							{fieldLabel : '排序',name : 'sort_order'}        
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
							this.editForm.api.submit=ExtServicePtypeshow.save;                   
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Ptypeshow.View.Running.ptypeshowGrid.doSelectPtypeshow();
									form.reset(); 
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServicePtypeshow.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Ptypeshow.View.Running.ptypeshowGrid.doSelectPtypeshow();
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
						this.editForm.form.loadRecord(Km.Ptypeshow.View.Running.ptypeshowGrid.getSelectionModel().getSelected());
						this.imageUpload.setValue(this.ico.getValue());
 
					}                  
				}]    
			}, config);  
			Km.Ptypeshow.View.EditWindow.superclass.constructor.call(this, config);     
		}
	}),
	/**
	 * 显示商品显示详情
	 */
	PtypeshowView:{
		/**
		 * Tab页：容器包含显示与商品显示所有相关的信息
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
								if (Km.Ptypeshow.View.Running.ptypeshowGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择商品显示！');
									return false;
								} 
								Km.Ptypeshow.Config.View.IsShow=1;
								Km.Ptypeshow.View.Running.ptypeshowGrid.showPtypeshow();   
								Km.Ptypeshow.View.Running.ptypeshowGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Ptypeshow.View.PtypeshowView.Tabs.superclass.constructor.call(this, config); 
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Ptypeshow.Config.View.Direction==1)||(Km.Ptypeshow.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabPtypeshowDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">', 
						 '<tr class="entry"><td class="head">商品名称 :</td><td class="content">{name}</td></tr>',
						 '<tr class="entry"><td class="head">商品缩略图路径 :</td><td class="content">{ico}</td></tr>',
						 '<tr class="entry"><td class="head">商品缩略图 :</td><td class="content"><img src="upload/images/{ico}" /></td></tr>',
						 '<tr class="entry"><td class="head">显示类型 :</td><td class="content">{showtypeShow}</td></tr>',
						 '<tr class="entry"><td class="head">商品量词 :</td><td class="content">{unit}</td></tr>',
						 '<tr class="entry"><td class="head">市场价 :</td><td class="content">{market_price}</td></tr>',
						 '<tr class="entry"><td class="head">销售价 :</td><td class="content">{price}</td></tr>',
						 '<tr class="entry"><td class="head">是否显示 :</td><td class="content">{isShow}</td></tr>',
						 '<tr class="entry"><td class="head">排序 :</td><td class="content">{sort_order}</td></tr>',                      
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
		 * 窗口:显示商品显示信息
		 */
		Window:Ext.extend(Ext.Window,{ 
			constructor : function(config) { 
				config = Ext.apply({
					title:"查看商品显示",constrainHeader:true,maximizable: true,minimizable : true, 
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Ptypeshow.View.PtypeshowView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: { 
						minimize:function(w){
							w.hide();
							Km.Ptypeshow.Config.View.IsShow=0;
							Km.Ptypeshow.View.Running.ptypeshowGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Ptypeshow.View.Running.ptypeshowGrid.tvpView.toggle(false);
						}   
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Ptypeshow.View.Running.ptypeshowGrid.addPtypeshow();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Ptypeshow.View.Running.ptypeshowGrid.updatePtypeshow();}
					}]
				}, config);  
				Km.Ptypeshow.View.PtypeshowView.Window.superclass.constructor.call(this, config);   
			}        
		})
	},
	/**
	 * 窗口：批量上传商品显示
	 */        
	UploadWindow:Ext.extend(Ext.Window,{ 
		constructor : function(config) { 
			config = Ext.apply({     
				title : '批量商品显示上传',
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
							emptyText: '请上传商品显示Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadPtypeshow',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Ptypeshow.View.Running.ptypeshowGrid.doSelectPtypeshow();
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
			Km.Ptypeshow.View.UploadWindow.superclass.constructor.call(this, config);     
		}        
	}),
	/**
	 * 视图：商品显示列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件  
				 */
				filter:null,
				region : 'center',
				store : Km.Ptypeshow.Store.ptypeshowStore,
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
						{header : '商品名称',dataIndex : 'product_name'},
						{header : '商品缩略图',dataIndex : 'ico'},
						{header : '显示类型',dataIndex : 'showtypeShow'},
						{header : '商品量词',dataIndex : 'unit'},
						{header : '市场价',dataIndex : 'market_price'},
						{header : '销售价',dataIndex : 'price'},
						{header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
						{header : '排序',dataIndex : 'sort_order'}                                 
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
								'商品名称　',{ref: '../pname'},'&nbsp;&nbsp;',
								'显示类型　',{ref: '../pshowtype'},'&nbsp;&nbsp;',
								'是否显示　',{ref: '../pisShow',xtype : 'combo',mode : 'local',
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
										this.doSelectPtypeshow();
									}
								}, 
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.pname.setValue("");
										this.topToolbar.pshowtype.setValue("");
										this.topToolbar.pisShow.setValue("");                                        
										this.filter={};
										this.doSelectPtypeshow();
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
									text : '添加商品显示',iconCls : 'icon-add',
									handler : function() {
										this.addPtypeshow();
									}
								},'-',{
									text : '修改商品显示',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
									handler : function() {
										this.updatePtypeshow();
									}
								},'-',{
									text : '删除商品显示', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
									handler : function() {
										this.deletePtypeshow();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import', 
									handler : function() {
										this.importPtypeshow();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export', 
									handler : function() { 
										this.exportPtypeshow();
									}
								},'-',{ 
									xtype:'tbsplit',text: '查看商品显示', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,  
									handler:function(){this.showPtypeshow()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hidePtypeshow();Km.Ptypeshow.Config.View.IsShow=0;}},'-', 
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Ptypeshow.Cookie.set('View.IsFix',Km.Ptypeshow.Config.View.IsFix);}} 
										]}
								},'-']}
					)]
				},                
				bbar: new Ext.PagingToolbar({          
					pageSize: Km.Ptypeshow.Config.PageSize,
					store: Km.Ptypeshow.Store.ptypeshowStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Ptypeshow.Config.PageSize,minValue:1,width:35, 
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Ptypeshow.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Ptypeshow.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectPtypeshow();
								}, 
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Ptypeshow.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Ptypeshow.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectPtypeshow();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示商品显示列表
			this.doSelectPtypeshow();
			Km.Ptypeshow.View.Grid.superclass.constructor.call(this, config); 
			//创建在Grid里显示的商品显示信息Tab页
			Km.Ptypeshow.View.Running.viewTabs=new Km.Ptypeshow.View.PtypeshowView.Tabs();
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
					this.grid.updateViewPtypeshow();                     
					if (sm.getCount() != 1){
						this.grid.hidePtypeshow();
						Km.Ptypeshow.Config.View.IsShow=0;
					}else{
						if (Km.Ptypeshow.View.IsSelectView==1){
							Km.Ptypeshow.View.IsSelectView=0;  
							this.grid.showPtypeshow();   
						}     
					}    
				},
				rowdeselect: function(sm, rowIndex, record) {  
					if (sm.getCount() != 1){
						if (Km.Ptypeshow.Config.View.IsShow==1){
							Km.Ptypeshow.View.IsSelectView=1;    
						}             
						this.grid.hidePtypeshow();
						Km.Ptypeshow.Config.View.IsShow=0;
					}    
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){  
			if (!Km.Ptypeshow.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showPtypeshow();
				this.tvpView.toggle(true);
			}else{
				this.hidePtypeshow();
				Km.Ptypeshow.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){ 
			if (checked){             
			   Km.Ptypeshow.Config.View.IsFix=1; 
			}else{ 
			   Km.Ptypeshow.Config.View.IsFix=0;   
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Ptypeshow.Config.View.IsShow=0;
				return ;
			}
			if (Km.Ptypeshow.Config.View.IsShow==1){
			   this.hidePtypeshow(); 
			   Km.Ptypeshow.Config.View.IsShow=0;
			}
			this.showPtypeshow();   
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
		 * 查询符合条件的商品显示
		 */
		doSelectPtypeshow : function() {
			if (this.topToolbar){
				var pname = this.topToolbar.pname.getValue();
				var pshowtype = this.topToolbar.pshowtype.getValue();
				var pisShow = this.topToolbar.pisShow.getValue();
				this.filter       ={'name':pname,'showtype':pshowtype,'isShow':pisShow};
			}
			var condition = {'start':0,'limit':Km.Ptypeshow.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServicePtypeshow.queryPagePtypeshow(condition,function(provider, response) {   
				if (response.result.data) {   
					var result           = new Array();
					result['data']       =response.result.data; 
					result['totalCount'] =response.result.totalCount;
					Km.Ptypeshow.Store.ptypeshowStore.loadData(result); 
				} else {
					Km.Ptypeshow.Store.ptypeshowStore.removeAll();                        
					Ext.Msg.alert('提示', '无符合条件的商品显示！');
				}
			});
		}, 
		/**
		 * 显示商品显示视图
		 * 显示商品显示的视图相对商品显示列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Ptypeshow.Config.View.Direction=viewDirection; 
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Ptypeshow.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Ptypeshow.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Ptypeshow.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Ptypeshow.View.Running.viewTabs);
					break;    
			}  
			Km.Ptypeshow.Cookie.set('View.Direction',Km.Ptypeshow.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Ptypeshow.Config.View.IsFix==0)&&(Km.Ptypeshow.Config.View.IsShow==1)){
					this.showPtypeshow();     
				}
				Km.Ptypeshow.Config.View.IsFix=1;
				Km.Ptypeshow.View.Running.ptypeshowGrid.tvpView.menu.mBind.setChecked(true,true);  
				Km.Ptypeshow.Config.View.IsShow=0;
				this.showPtypeshow();     
			}
		}, 
		/**
		 * 显示商品显示
		 */
		showPtypeshow : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择商品显示！');
				Km.Ptypeshow.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			} 
			if (Km.Ptypeshow.Config.View.IsFix==0){
				if (Km.Ptypeshow.View.Running.view_window==null){
					Km.Ptypeshow.View.Running.view_window=new Km.Ptypeshow.View.PtypeshowView.Window();
				}
				if (Km.Ptypeshow.View.Running.view_window.hidden){
					Km.Ptypeshow.View.Running.view_window.show();
					Km.Ptypeshow.View.Running.view_window.winTabs.hideTabStripItem(Km.Ptypeshow.View.Running.view_window.winTabs.tabFix);   
					this.updateViewPtypeshow();
					this.tvpView.toggle(true);
					Km.Ptypeshow.Config.View.IsShow=1;
				}else{
					this.hidePtypeshow();
					Km.Ptypeshow.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Ptypeshow.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Ptypeshow.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Ptypeshow.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Ptypeshow.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Ptypeshow.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Ptypeshow.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Ptypeshow.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Ptypeshow.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Ptypeshow.View.Running.viewTabs);
					}
					break;    
			}  
			this.hidePtypeshow();
			if (Km.Ptypeshow.Config.View.IsShow==0){
				Km.Ptypeshow.View.Running.viewTabs.enableCollapse();  
				switch(Km.Ptypeshow.Config.View.Direction){
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
				this.updateViewPtypeshow();
				this.tvpView.toggle(true);
				Km.Ptypeshow.Config.View.IsShow=1;
			}else{
				Km.Ptypeshow.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏商品显示
		 */
		hidePtypeshow : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();   
			this.ownerCt.east.hide(); 
			if (Km.Ptypeshow.View.Running.view_window!=null){
				Km.Ptypeshow.View.Running.view_window.hide();
			}            
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前商品显示显示信息
		 */
		updateViewPtypeshow : function() {
			if (Km.Ptypeshow.View.Running.view_window!=null){
				Km.Ptypeshow.View.Running.view_window.winTabs.tabPtypeshowDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Ptypeshow.View.Running.viewTabs.tabPtypeshowDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建商品显示
		 */
		addPtypeshow : function() {  
			if (Km.Ptypeshow.View.Running.edit_window==null){   
				Km.Ptypeshow.View.Running.edit_window=new Km.Ptypeshow.View.EditWindow();   
			}     
			Km.Ptypeshow.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Ptypeshow.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Ptypeshow.View.Running.edit_window.setTitle('添加商品显示');
			Km.Ptypeshow.View.Running.edit_window.savetype=0;
			Km.Ptypeshow.View.Running.edit_window.ico.setValue("");
			
			Km.Ptypeshow.View.Running.edit_window.show();   
			Km.Ptypeshow.View.Running.edit_window.maximize();               
		},   
		/**
		 * 编辑商品显示时先获得选中的商品显示信息
		 */
		updatePtypeshow : function() {
			if (Km.Ptypeshow.View.Running.edit_window==null){   
				Km.Ptypeshow.View.Running.edit_window=new Km.Ptypeshow.View.EditWindow();   
			}            
			Km.Ptypeshow.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Ptypeshow.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Ptypeshow.View.Running.edit_window.setTitle('修改商品显示');
			Km.Ptypeshow.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Ptypeshow.View.Running.edit_window.savetype=1;
			Km.Ptypeshow.View.Running.edit_window.imageUpload.setValue(Km.Ptypeshow.View.Running.edit_window.ico.getValue());
			
			Km.Ptypeshow.View.Running.edit_window.show();    
			Km.Ptypeshow.View.Running.edit_window.maximize();                  
		},        
		/**
		 * 删除商品显示
		 */
		deletePtypeshow : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的商品显示吗?', this.confirmDeletePtypeshow,this);
		}, 
		/**
		 * 确认删除商品显示
		 */
		confirmDeletePtypeshow : function(btn) {
			if (btn == 'yes') {  
				var del_ptypeshow_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_ptypeshow_ids=del_ptypeshow_ids+selectedRows[flag].data.ptypeshow_id+",";
				}
				ExtServicePtypeshow.deleteByIds(del_ptypeshow_ids);
				this.doSelectPtypeshow();
				Ext.Msg.alert("提示", "删除成功！");        
			}
		},
		/**
		 * 导出商品显示
		 */
		exportPtypeshow : function() {            
			ExtServicePtypeshow.exportPtypeshow(this.filter,function(provider, response) {  
				if (response.result.data) {
					window.open(response.result.data);
				}
			});                        
		},
		/**
		 * 导入商品显示
		 */
		importPtypeshow : function() { 
			if (Km.Ptypeshow.View.current_uploadWindow==null){   
				Km.Ptypeshow.View.current_uploadWindow=new Km.Ptypeshow.View.UploadWindow();   
			}     
			Km.Ptypeshow.View.current_uploadWindow.show();
		}                
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Ptypeshow.View.Running.ptypeshowGrid=new Km.Ptypeshow.View.Grid();           
			if (Km.Ptypeshow.Config.View.IsFix==0){
				Km.Ptypeshow.View.Running.ptypeshowGrid.tvpView.menu.mBind.setChecked(false,true);  
			}
			config = Ext.apply({ 
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Ptypeshow.View.Running.ptypeshowGrid, 
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Ptypeshow.View.Running.viewTabs]}, 
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
					]
				}
			}, config);   
			Km.Ptypeshow.View.Panel.superclass.constructor.call(this, config);  
		}        
	}),
	/**
	 * 当前运行的可视化对象
	 */ 
	Running:{         
		/**
		 * 当前商品显示Grid对象
		 */
		ptypeshowGrid:null,  
		/**
		 * 显示商品显示信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Ptypeshow.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);     
	Km.Ptypeshow.Init();
	/**
	 * 商品显示数据模型获取数据Direct调用
	 */        
	Km.Ptypeshow.Store.ptypeshowStore.proxy=new Ext.data.DirectProxy({ 
		api: {read:ExtServicePtypeshow.queryPagePtypeshow}
	});   
	/**
	 * 商品显示页面布局
	 */
	Km.Ptypeshow.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Ptypeshow.View.Panel()]
	});
	Km.Ptypeshow.Viewport.doLayout();    
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});   