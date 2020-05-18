Ext.namespace("Kmall.Admin.Seriesimg");
Km = Kmall.Admin.Seriesimg;
Km.Seriesimg={
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
			 * 显示商品图片的视图相对商品图片列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示商品图片信息页(或者打开新窗口)
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
		if (Km.Seriesimg.Cookie.get('View.Direction')){
			Km.Seriesimg.Config.View.Direction=Km.Seriesimg.Cookie.get('View.Direction');
		}
		if (Km.Seriesimg.Cookie.get('View.IsFix')!=null){
			Km.Seriesimg.Config.View.IsFix=Km.Seriesimg.Cookie.get('View.IsFix');
		}
	}
}; 
/**
 * Model:数据模型   
 */
Km.Seriesimg.Store = { 
	/**
	 * 商品图片
	 */ 
	seriesimgStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',  
			root: 'data',remoteSort: true,                
			fields : [
				{name: 'seriesimg_id',type: 'int'},
				{name: 'product_id',type: 'int'},
				{name: 'product_name',type: 'string'},
				{name: 'ico',type: 'string'},
				{name: 'img',type: 'string'},
				{name: 'image_large',type: 'string'},
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
					Ext.apply(options.params, Km.Seriesimg.View.Running.seriesimgGrid.filter);//保证分页也将查询条件带上  
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
	})      
};
/**
 * View:商品图片显示组件   
 */
Km.Seriesimg.View={ 
	/**
	 * 编辑窗口：新建或者修改商品图片
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
							{xtype: 'hidden',  name : 'seriesimg_id',ref:'../seriesimg_id'},                                          
							{xtype: 'hidden',name : 'product_id',id:'product_id'},
							{
								 fieldLabel : '商品',xtype: 'combo',name : 'product_name',id : 'name',
								 store:Km.Seriesimg.Store.productStore,emptyText: '请选择商品',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Seriesimg.Config.PageSize,
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
										Ext.getCmp("name").setValue(record.data.product_name);
										this.collapse();
									 }
								 }
							},                                                           
							{xtype: 'hidden',  name : 'image_large',ref:'../image_large'},
							{fieldLabel : '商品最大图片',name : 'imageLargeUpload',ref:'../imageLargeUpload',xtype:'fileuploadfield',
							 emptyText: '请上传商品图片图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
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
							this.editForm.api.submit=ExtServiceSeriesimg.save;                   
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Seriesimg.View.Running.seriesimgGrid.doSelectSeriesimg();
									form.reset(); 
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceSeriesimg.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Seriesimg.View.Running.seriesimgGrid.doSelectSeriesimg();
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
						this.editForm.form.loadRecord(Km.Seriesimg.View.Running.seriesimgGrid.getSelectionModel().getSelected());
						this.imageLargeUpload.setValue(this.image_large.getValue());
 
					}                  
				}]    
			}, config);  
			Km.Seriesimg.View.EditWindow.superclass.constructor.call(this, config);     
		}
	}),
	/**
	 * 显示商品图片详情
	 */
	SeriesimgView:{
		/**
		 * Tab页：容器包含显示与商品图片所有相关的信息
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
								if (Km.Seriesimg.View.Running.seriesimgGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择商品图片！');
									return false;
								} 
								Km.Seriesimg.Config.View.IsShow=1;
								Km.Seriesimg.View.Running.seriesimgGrid.showSeriesimg();   
								Km.Seriesimg.View.Running.seriesimgGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Seriesimg.View.SeriesimgView.Tabs.superclass.constructor.call(this, config); 
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Seriesimg.Config.View.Direction==1)||(Km.Seriesimg.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabSeriesimgDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">',                                                                                                           
						 '<tr class="entry"><td class="head">商品名 :</td><td class="content">{product_name}</td></tr>',
						 '<tr class="entry"><td class="head">缩略图路径 :</td><td class="content">{ico}</td></tr>',
						 '<tr class="entry"><td class="head">缩略图 :</td><td class="content"><img src="upload/images/{ico}" /></td></tr>',
						 '<tr class="entry"><td class="head">图片路径 :</td><td class="content">{img}</td></tr>',
						 '<tr class="entry"><td class="head">图片 :</td><td class="content"><img src="upload/images/{img}" /></td></tr>',
						 '<tr class="entry"><td class="head">超大图路径 :</td><td class="content">{image_large}</td></tr>',
						 '<tr class="entry"><td class="head">超大图 :</td><td class="content"><img src="upload/images/{image_large}" /></td></tr>',
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
		 * 窗口:显示商品图片信息
		 */
		Window:Ext.extend(Ext.Window,{ 
			constructor : function(config) { 
				config = Ext.apply({
					title:"查看商品图片",constrainHeader:true,maximizable: true,minimizable : true, 
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Seriesimg.View.SeriesimgView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: { 
						minimize:function(w){
							w.hide();
							Km.Seriesimg.Config.View.IsShow=0;
							Km.Seriesimg.View.Running.seriesimgGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Seriesimg.View.Running.seriesimgGrid.tvpView.toggle(false);
						}   
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Seriesimg.View.Running.seriesimgGrid.addSeriesimg();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Seriesimg.View.Running.seriesimgGrid.updateSeriesimg();}
					}]
				}, config);  
				Km.Seriesimg.View.SeriesimgView.Window.superclass.constructor.call(this, config);   
			}        
		})
	},
	/**
	 * 窗口：批量上传商品图片
	 */        
	UploadWindow:Ext.extend(Ext.Window,{ 
		constructor : function(config) { 
			config = Ext.apply({     
				title : '批量商品图片上传',
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
							emptyText: '请上传商品图片Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadSeriesimg',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Seriesimg.View.Running.seriesimgGrid.doSelectSeriesimg();
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
			Km.Seriesimg.View.UploadWindow.superclass.constructor.call(this, config);     
		}        
	}),
	/**
	 * 视图：商品图片列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件  
				 */
				filter:null,
				region : 'center',
				store : Km.Seriesimg.Store.seriesimgStore,
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
						{header : '商品名',dataIndex : 'product_name'},
						{header : '缩略图',dataIndex : 'ico'},
						{header : '图片',dataIndex : 'img'},
						{header : '超大图',dataIndex : 'image_large'},
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
								'是否显示　',{ref: '../sisShow',xtype : 'combo',mode : 'local',
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
										this.doSelectSeriesimg();
									}
								}, 
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.sisShow.setValue("");                                        
										this.filter={};
										this.doSelectSeriesimg();
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
									text : '添加商品图片',iconCls : 'icon-add',
									handler : function() {
										this.addSeriesimg();
									}
								},'-',{
									text : '修改商品图片',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
									handler : function() {
										this.updateSeriesimg();
									}
								},'-',{
									text : '删除商品图片', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
									handler : function() {
										this.deleteSeriesimg();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import', 
									handler : function() {
										this.importSeriesimg();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export', 
									handler : function() { 
										this.exportSeriesimg();
									}
								},'-',{ 
									xtype:'tbsplit',text: '查看商品图片', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,  
									handler:function(){this.showSeriesimg()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideSeriesimg();Km.Seriesimg.Config.View.IsShow=0;}},'-', 
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Seriesimg.Cookie.set('View.IsFix',Km.Seriesimg.Config.View.IsFix);}} 
										]}
								},'-']}
					)]
				},                
				bbar: new Ext.PagingToolbar({          
					pageSize: Km.Seriesimg.Config.PageSize,
					store: Km.Seriesimg.Store.seriesimgStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Seriesimg.Config.PageSize,minValue:1,width:35, 
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Seriesimg.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Seriesimg.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectSeriesimg();
								}, 
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Seriesimg.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Seriesimg.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectSeriesimg();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示商品图片列表
			this.doSelectSeriesimg();
			Km.Seriesimg.View.Grid.superclass.constructor.call(this, config); 
			//创建在Grid里显示的商品图片信息Tab页
			Km.Seriesimg.View.Running.viewTabs=new Km.Seriesimg.View.SeriesimgView.Tabs();
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
					this.grid.updateViewSeriesimg();                     
					if (sm.getCount() != 1){
						this.grid.hideSeriesimg();
						Km.Seriesimg.Config.View.IsShow=0;
					}else{
						if (Km.Seriesimg.View.IsSelectView==1){
							Km.Seriesimg.View.IsSelectView=0;  
							this.grid.showSeriesimg();   
						}     
					}    
				},
				rowdeselect: function(sm, rowIndex, record) {  
					if (sm.getCount() != 1){
						if (Km.Seriesimg.Config.View.IsShow==1){
							Km.Seriesimg.View.IsSelectView=1;    
						}             
						this.grid.hideSeriesimg();
						Km.Seriesimg.Config.View.IsShow=0;
					}    
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){  
			if (!Km.Seriesimg.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showSeriesimg();
				this.tvpView.toggle(true);
			}else{
				this.hideSeriesimg();
				Km.Seriesimg.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){ 
			if (checked){             
			   Km.Seriesimg.Config.View.IsFix=1; 
			}else{ 
			   Km.Seriesimg.Config.View.IsFix=0;   
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Seriesimg.Config.View.IsShow=0;
				return ;
			}
			if (Km.Seriesimg.Config.View.IsShow==1){
			   this.hideSeriesimg(); 
			   Km.Seriesimg.Config.View.IsShow=0;
			}
			this.showSeriesimg();   
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
		 * 查询符合条件的商品图片
		 */
		doSelectSeriesimg : function() {
			if (this.topToolbar){
				var sisShow = this.topToolbar.sisShow.getValue();
				this.filter       ={'isShow':sisShow};
			}
			var condition = {'start':0,'limit':Km.Seriesimg.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceSeriesimg.queryPageSeriesimg(condition,function(provider, response) {   
				if (response.result.data) {   
					var result           = new Array();
					result['data']       =response.result.data; 
					result['totalCount'] =response.result.totalCount;
					Km.Seriesimg.Store.seriesimgStore.loadData(result); 
				} else {
					Km.Seriesimg.Store.seriesimgStore.removeAll();                        
					Ext.Msg.alert('提示', '无符合条件的商品图片！');
				}
			});
		}, 
		/**
		 * 显示商品图片视图
		 * 显示商品图片的视图相对商品图片列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Seriesimg.Config.View.Direction=viewDirection; 
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Seriesimg.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Seriesimg.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Seriesimg.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Seriesimg.View.Running.viewTabs);
					break;    
			}  
			Km.Seriesimg.Cookie.set('View.Direction',Km.Seriesimg.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Seriesimg.Config.View.IsFix==0)&&(Km.Seriesimg.Config.View.IsShow==1)){
					this.showSeriesimg();     
				}
				Km.Seriesimg.Config.View.IsFix=1;
				Km.Seriesimg.View.Running.seriesimgGrid.tvpView.menu.mBind.setChecked(true,true);  
				Km.Seriesimg.Config.View.IsShow=0;
				this.showSeriesimg();     
			}
		}, 
		/**
		 * 显示商品图片
		 */
		showSeriesimg : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择商品图片！');
				Km.Seriesimg.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			} 
			if (Km.Seriesimg.Config.View.IsFix==0){
				if (Km.Seriesimg.View.Running.view_window==null){
					Km.Seriesimg.View.Running.view_window=new Km.Seriesimg.View.SeriesimgView.Window();
				}
				if (Km.Seriesimg.View.Running.view_window.hidden){
					Km.Seriesimg.View.Running.view_window.show();
					Km.Seriesimg.View.Running.view_window.winTabs.hideTabStripItem(Km.Seriesimg.View.Running.view_window.winTabs.tabFix);   
					this.updateViewSeriesimg();
					this.tvpView.toggle(true);
					Km.Seriesimg.Config.View.IsShow=1;
				}else{
					this.hideSeriesimg();
					Km.Seriesimg.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Seriesimg.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Seriesimg.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Seriesimg.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Seriesimg.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Seriesimg.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Seriesimg.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Seriesimg.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Seriesimg.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Seriesimg.View.Running.viewTabs);
					}
					break;    
			}  
			this.hideSeriesimg();
			if (Km.Seriesimg.Config.View.IsShow==0){
				Km.Seriesimg.View.Running.viewTabs.enableCollapse();  
				switch(Km.Seriesimg.Config.View.Direction){
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
				this.updateViewSeriesimg();
				this.tvpView.toggle(true);
				Km.Seriesimg.Config.View.IsShow=1;
			}else{
				Km.Seriesimg.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏商品图片
		 */
		hideSeriesimg : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();   
			this.ownerCt.east.hide(); 
			if (Km.Seriesimg.View.Running.view_window!=null){
				Km.Seriesimg.View.Running.view_window.hide();
			}            
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前商品图片显示信息
		 */
		updateViewSeriesimg : function() {
			if (Km.Seriesimg.View.Running.view_window!=null){
				Km.Seriesimg.View.Running.view_window.winTabs.tabSeriesimgDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Seriesimg.View.Running.viewTabs.tabSeriesimgDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建商品图片
		 */
		addSeriesimg : function() {  
			if (Km.Seriesimg.View.Running.edit_window==null){   
				Km.Seriesimg.View.Running.edit_window=new Km.Seriesimg.View.EditWindow();   
			}     
			Km.Seriesimg.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Seriesimg.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Seriesimg.View.Running.edit_window.setTitle('添加商品图片');
			Km.Seriesimg.View.Running.edit_window.savetype=0;
			Km.Seriesimg.View.Running.edit_window.seriesimg_id.setValue("");
			
			Km.Seriesimg.View.Running.edit_window.show();   
			Km.Seriesimg.View.Running.edit_window.maximize();               
		},   
		/**
		 * 编辑商品图片时先获得选中的商品图片信息
		 */
		updateSeriesimg : function() {
			if (Km.Seriesimg.View.Running.edit_window==null){   
				Km.Seriesimg.View.Running.edit_window=new Km.Seriesimg.View.EditWindow();   
			}            
			Km.Seriesimg.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Seriesimg.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Seriesimg.View.Running.edit_window.setTitle('修改商品图片');
			Km.Seriesimg.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Seriesimg.View.Running.edit_window.savetype=1;
			Km.Seriesimg.View.Running.edit_window.imageLargeUpload.setValue(Km.Seriesimg.View.Running.edit_window.image_large.getValue());
			
			Km.Seriesimg.View.Running.edit_window.show();    
			Km.Seriesimg.View.Running.edit_window.maximize();                  
		},        
		/**
		 * 删除商品图片
		 */
		deleteSeriesimg : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的商品图片吗?', this.confirmDeleteSeriesimg,this);
		}, 
		/**
		 * 确认删除商品图片
		 */
		confirmDeleteSeriesimg : function(btn) {
			if (btn == 'yes') {  
				var del_seriesimg_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_seriesimg_ids=del_seriesimg_ids+selectedRows[flag].data.seriesimg_id+",";
				}
				ExtServiceSeriesimg.deleteByIds(del_seriesimg_ids);
				this.doSelectSeriesimg();
				Ext.Msg.alert("提示", "删除成功！");        
			}
		},
		/**
		 * 导出商品图片
		 */
		exportSeriesimg : function() {            
			ExtServiceSeriesimg.exportSeriesimg(this.filter,function(provider, response) {  
				if (response.result.data) {
					window.open(response.result.data);
				}
			});                        
		},
		/**
		 * 导入商品图片
		 */
		importSeriesimg : function() { 
			if (Km.Seriesimg.View.current_uploadWindow==null){   
				Km.Seriesimg.View.current_uploadWindow=new Km.Seriesimg.View.UploadWindow();   
			}     
			Km.Seriesimg.View.current_uploadWindow.show();
		}                
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Seriesimg.View.Running.seriesimgGrid=new Km.Seriesimg.View.Grid();           
			if (Km.Seriesimg.Config.View.IsFix==0){
				Km.Seriesimg.View.Running.seriesimgGrid.tvpView.menu.mBind.setChecked(false,true);  
			}
			config = Ext.apply({ 
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Seriesimg.View.Running.seriesimgGrid, 
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Seriesimg.View.Running.viewTabs]}, 
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
					]
				}
			}, config);   
			Km.Seriesimg.View.Panel.superclass.constructor.call(this, config);  
		}        
	}),
	/**
	 * 当前运行的可视化对象
	 */ 
	Running:{         
		/**
		 * 当前商品图片Grid对象
		 */
		seriesimgGrid:null,  
		/**
		 * 显示商品图片信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Seriesimg.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);     
	Km.Seriesimg.Init();
	/**
	 * 商品图片数据模型获取数据Direct调用
	 */        
	Km.Seriesimg.Store.seriesimgStore.proxy=new Ext.data.DirectProxy({ 
		api: {read:ExtServiceSeriesimg.queryPageSeriesimg}
	});   
	/**
	 * 商品图片页面布局
	 */
	Km.Seriesimg.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Seriesimg.View.Panel()]
	});
	Km.Seriesimg.Viewport.doLayout();    
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});  