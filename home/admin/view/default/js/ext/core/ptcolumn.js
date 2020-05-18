Ext.namespace("Kmall.Admin.Ptcolumn");
Km = Kmall.Admin.Ptcolumn;
Km.Ptcolumn={
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
			 * 显示商品分类所属栏目的视图相对商品分类所属栏目列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示商品分类所属栏目信息页(或者打开新窗口)
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
		if (Km.Ptcolumn.Cookie.get('View.Direction')){
			Km.Ptcolumn.Config.View.Direction=Km.Ptcolumn.Cookie.get('View.Direction');
		}
		if (Km.Ptcolumn.Cookie.get('View.IsFix')!=null){
			Km.Ptcolumn.Config.View.IsFix=Km.Ptcolumn.Cookie.get('View.IsFix');
		}
	}
}; 
/**
 * Model:数据模型   
 */
Km.Ptcolumn.Store = { 
	/**
	 * 商品分类所属栏目
	 */ 
	ptcolumnStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',  
			root: 'data',remoteSort: true,                
			fields : [
				{name: 'ptcolumn_id',type: 'int'},
				{name: 'column_type',type: 'string'},
                {name: 'column_typeShow',type: 'string'},
				{name: 'ptype_id',type: 'int'},
				{name: 'name',type: 'string'},
				{name: 'ptype_name',type: 'string'},
				{name: 'sort_order',type: 'int'}
			]}         
		),
		writer: new Ext.data.JsonWriter({
			encode: false 
		}),
		listeners : {    
			beforeload : function(store, options) {   
				if (Ext.isReady) {  
					Ext.apply(options.params, Km.Ptcolumn.View.Running.ptcolumnGrid.filter);//保证分页也将查询条件带上  
				}
			}
		}    
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
 * View:商品分类所属栏目显示组件   
 */
Km.Ptcolumn.View={ 
	/**
	 * 编辑窗口：新建或者修改商品分类所属栏目
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
							{xtype: 'hidden',  name : 'ptcolumn_id',ref:'../ptcolumn_id'},
							{fieldLabel : '商品分类所属栏目',hiddenName : 'column_type',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['1', '品牌特惠'],['2', '特色专场'],['3', '销售排行']]
								}),emptyText: '请选择商品分类所属栏目',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							{xtype: 'hidden',name : 'ptype_id',id:'ptype_id'},
							{
								 fieldLabel : '商品分类',xtype: 'combo',name : 'name',id : 'name',
								 store:Km.Ptcolumn.Store.ptypeStore,emptyText: '请选择商品分类',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Ptcolumn.Config.PageSize,
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
							{fieldLabel : '商品分类名称',name : 'ptype_name'},
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
							this.editForm.api.submit=ExtServicePtcolumn.save;                   
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Ptcolumn.View.Running.ptcolumnGrid.doSelectPtcolumn();
									form.reset(); 
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServicePtcolumn.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Ptcolumn.View.Running.ptcolumnGrid.doSelectPtcolumn();
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
						this.editForm.form.loadRecord(Km.Ptcolumn.View.Running.ptcolumnGrid.getSelectionModel().getSelected());
 
					}                  
				}]    
			}, config);  
			Km.Ptcolumn.View.EditWindow.superclass.constructor.call(this, config);     
		}
	}),
	/**
	 * 显示商品分类所属栏目详情
	 */
	PtcolumnView:{
		/**
		 * Tab页：容器包含显示与商品分类所属栏目所有相关的信息
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
								if (Km.Ptcolumn.View.Running.ptcolumnGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择商品分类所属栏目！');
									return false;
								} 
								Km.Ptcolumn.Config.View.IsShow=1;
								Km.Ptcolumn.View.Running.ptcolumnGrid.showPtcolumn();   
								Km.Ptcolumn.View.Running.ptcolumnGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Ptcolumn.View.PtcolumnView.Tabs.superclass.constructor.call(this, config); 
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Ptcolumn.Config.View.Direction==1)||(Km.Ptcolumn.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabPtcolumnDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">', 
						 '<tr class="entry"><td class="head">商品分类所属栏目 :</td><td class="content">{column_typeShow}</td></tr>',
						 '<tr class="entry"><td class="head">商品分类 :</td><td class="content">{name}</td></tr>',
						 '<tr class="entry"><td class="head">商品分类名称 :</td><td class="content">{ptype_name}</td></tr>',
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
		 * 窗口:显示商品分类所属栏目信息
		 */
		Window:Ext.extend(Ext.Window,{ 
			constructor : function(config) { 
				config = Ext.apply({
					title:"查看商品分类所属栏目",constrainHeader:true,maximizable: true,minimizable : true, 
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Ptcolumn.View.PtcolumnView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: { 
						minimize:function(w){
							w.hide();
							Km.Ptcolumn.Config.View.IsShow=0;
							Km.Ptcolumn.View.Running.ptcolumnGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Ptcolumn.View.Running.ptcolumnGrid.tvpView.toggle(false);
						}   
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Ptcolumn.View.Running.ptcolumnGrid.addPtcolumn();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Ptcolumn.View.Running.ptcolumnGrid.updatePtcolumn();}
					}]
				}, config);  
				Km.Ptcolumn.View.PtcolumnView.Window.superclass.constructor.call(this, config);   
			}        
		})
	},
	/**
	 * 窗口：批量上传商品分类所属栏目
	 */        
	UploadWindow:Ext.extend(Ext.Window,{ 
		constructor : function(config) { 
			config = Ext.apply({     
				title : '批量商品分类所属栏目上传',
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
							emptyText: '请上传商品分类所属栏目Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadPtcolumn',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Ptcolumn.View.Running.ptcolumnGrid.doSelectPtcolumn();
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
			Km.Ptcolumn.View.UploadWindow.superclass.constructor.call(this, config);     
		}        
	}),
	/**
	 * 视图：商品分类所属栏目列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件  
				 */
				filter:null,
				region : 'center',
				store : Km.Ptcolumn.Store.ptcolumnStore,
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
						{header : '商品分类所属栏目',dataIndex : 'column_typeShow'},
						{header : '商品分类',dataIndex : 'name'},
						{header : '商品分类名称',dataIndex : 'ptype_name'},
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
								'商品分类所属栏目　',{ref: '../pcolumn_type',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['1', '品牌特惠'],['2', '特色专场'],['3', '销售排行']]
									}),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',
								'商品分类名称　',{ref: '../pptype_name'},'&nbsp;&nbsp;',                                
								{
									xtype : 'button',text : '查询',scope: this, 
									handler : function() {
										this.doSelectPtcolumn();
									}
								}, 
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.pcolumn_type.setValue("");
										this.topToolbar.pptype_name.setValue("");                                        
										this.filter={};
										this.doSelectPtcolumn();
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
									text : '添加商品分类所属栏目',iconCls : 'icon-add',
									handler : function() {
										this.addPtcolumn();
									}
								},'-',{
									text : '修改商品分类所属栏目',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
									handler : function() {
										this.updatePtcolumn();
									}
								},'-',{
									text : '删除商品分类所属栏目', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
									handler : function() {
										this.deletePtcolumn();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import', 
									handler : function() {
										this.importPtcolumn();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export', 
									handler : function() { 
										this.exportPtcolumn();
									}
								},'-',{ 
									xtype:'tbsplit',text: '查看商品分类所属栏目', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,  
									handler:function(){this.showPtcolumn()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hidePtcolumn();Km.Ptcolumn.Config.View.IsShow=0;}},'-', 
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Ptcolumn.Cookie.set('View.IsFix',Km.Ptcolumn.Config.View.IsFix);}} 
										]}
								},'-']}
					)]
				},                
				bbar: new Ext.PagingToolbar({          
					pageSize: Km.Ptcolumn.Config.PageSize,
					store: Km.Ptcolumn.Store.ptcolumnStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Ptcolumn.Config.PageSize,minValue:1,width:35, 
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Ptcolumn.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Ptcolumn.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectPtcolumn();
								}, 
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Ptcolumn.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Ptcolumn.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectPtcolumn();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示商品分类所属栏目列表
			this.doSelectPtcolumn();
			Km.Ptcolumn.View.Grid.superclass.constructor.call(this, config); 
			//创建在Grid里显示的商品分类所属栏目信息Tab页
			Km.Ptcolumn.View.Running.viewTabs=new Km.Ptcolumn.View.PtcolumnView.Tabs();
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
					this.grid.updateViewPtcolumn();                     
					if (sm.getCount() != 1){
						this.grid.hidePtcolumn();
						Km.Ptcolumn.Config.View.IsShow=0;
					}else{
						if (Km.Ptcolumn.View.IsSelectView==1){
							Km.Ptcolumn.View.IsSelectView=0;  
							this.grid.showPtcolumn();   
						}     
					}    
				},
				rowdeselect: function(sm, rowIndex, record) {  
					if (sm.getCount() != 1){
						if (Km.Ptcolumn.Config.View.IsShow==1){
							Km.Ptcolumn.View.IsSelectView=1;    
						}             
						this.grid.hidePtcolumn();
						Km.Ptcolumn.Config.View.IsShow=0;
					}    
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){  
			if (!Km.Ptcolumn.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showPtcolumn();
				this.tvpView.toggle(true);
			}else{
				this.hidePtcolumn();
				Km.Ptcolumn.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){ 
			if (checked){             
			   Km.Ptcolumn.Config.View.IsFix=1; 
			}else{ 
			   Km.Ptcolumn.Config.View.IsFix=0;   
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Ptcolumn.Config.View.IsShow=0;
				return ;
			}
			if (Km.Ptcolumn.Config.View.IsShow==1){
			   this.hidePtcolumn(); 
			   Km.Ptcolumn.Config.View.IsShow=0;
			}
			this.showPtcolumn();   
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
		 * 查询符合条件的商品分类所属栏目
		 */
		doSelectPtcolumn : function() {
			if (this.topToolbar){
				var pcolumn_type = this.topToolbar.pcolumn_type.getValue();
				var pptype_name = this.topToolbar.pptype_name.getValue();
				this.filter       ={'column_type':pcolumn_type,'ptype_name':pptype_name};
			}
			var condition = {'start':0,'limit':Km.Ptcolumn.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServicePtcolumn.queryPagePtcolumn(condition,function(provider, response) {   
				if (response.result.data) {   
					var result           = new Array();
					result['data']       =response.result.data; 
					result['totalCount'] =response.result.totalCount;
					Km.Ptcolumn.Store.ptcolumnStore.loadData(result); 
				} else {
					Km.Ptcolumn.Store.ptcolumnStore.removeAll();                        
					Ext.Msg.alert('提示', '无符合条件的商品分类所属栏目！');
				}
			});
		}, 
		/**
		 * 显示商品分类所属栏目视图
		 * 显示商品分类所属栏目的视图相对商品分类所属栏目列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Ptcolumn.Config.View.Direction=viewDirection; 
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Ptcolumn.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Ptcolumn.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Ptcolumn.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Ptcolumn.View.Running.viewTabs);
					break;    
			}  
			Km.Ptcolumn.Cookie.set('View.Direction',Km.Ptcolumn.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Ptcolumn.Config.View.IsFix==0)&&(Km.Ptcolumn.Config.View.IsShow==1)){
					this.showPtcolumn();     
				}
				Km.Ptcolumn.Config.View.IsFix=1;
				Km.Ptcolumn.View.Running.ptcolumnGrid.tvpView.menu.mBind.setChecked(true,true);  
				Km.Ptcolumn.Config.View.IsShow=0;
				this.showPtcolumn();     
			}
		}, 
		/**
		 * 显示商品分类所属栏目
		 */
		showPtcolumn : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择商品分类所属栏目！');
				Km.Ptcolumn.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			} 
			if (Km.Ptcolumn.Config.View.IsFix==0){
				if (Km.Ptcolumn.View.Running.view_window==null){
					Km.Ptcolumn.View.Running.view_window=new Km.Ptcolumn.View.PtcolumnView.Window();
				}
				if (Km.Ptcolumn.View.Running.view_window.hidden){
					Km.Ptcolumn.View.Running.view_window.show();
					Km.Ptcolumn.View.Running.view_window.winTabs.hideTabStripItem(Km.Ptcolumn.View.Running.view_window.winTabs.tabFix);   
					this.updateViewPtcolumn();
					this.tvpView.toggle(true);
					Km.Ptcolumn.Config.View.IsShow=1;
				}else{
					this.hidePtcolumn();
					Km.Ptcolumn.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Ptcolumn.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Ptcolumn.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Ptcolumn.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Ptcolumn.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Ptcolumn.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Ptcolumn.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Ptcolumn.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Ptcolumn.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Ptcolumn.View.Running.viewTabs);
					}
					break;    
			}  
			this.hidePtcolumn();
			if (Km.Ptcolumn.Config.View.IsShow==0){
				Km.Ptcolumn.View.Running.viewTabs.enableCollapse();  
				switch(Km.Ptcolumn.Config.View.Direction){
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
				this.updateViewPtcolumn();
				this.tvpView.toggle(true);
				Km.Ptcolumn.Config.View.IsShow=1;
			}else{
				Km.Ptcolumn.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏商品分类所属栏目
		 */
		hidePtcolumn : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();   
			this.ownerCt.east.hide(); 
			if (Km.Ptcolumn.View.Running.view_window!=null){
				Km.Ptcolumn.View.Running.view_window.hide();
			}            
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前商品分类所属栏目显示信息
		 */
		updateViewPtcolumn : function() {
			if (Km.Ptcolumn.View.Running.view_window!=null){
				Km.Ptcolumn.View.Running.view_window.winTabs.tabPtcolumnDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Ptcolumn.View.Running.viewTabs.tabPtcolumnDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建商品分类所属栏目
		 */
		addPtcolumn : function() {  
			if (Km.Ptcolumn.View.Running.edit_window==null){   
				Km.Ptcolumn.View.Running.edit_window=new Km.Ptcolumn.View.EditWindow();   
			}     
			Km.Ptcolumn.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Ptcolumn.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Ptcolumn.View.Running.edit_window.setTitle('添加商品分类所属栏目');
			Km.Ptcolumn.View.Running.edit_window.savetype=0;
			Km.Ptcolumn.View.Running.edit_window.ptcolumn_id.setValue("");
			
			Km.Ptcolumn.View.Running.edit_window.show();   
			Km.Ptcolumn.View.Running.edit_window.maximize();               
		},   
		/**
		 * 编辑商品分类所属栏目时先获得选中的商品分类所属栏目信息
		 */
		updatePtcolumn : function() {
			if (Km.Ptcolumn.View.Running.edit_window==null){   
				Km.Ptcolumn.View.Running.edit_window=new Km.Ptcolumn.View.EditWindow();   
			}            
			Km.Ptcolumn.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Ptcolumn.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Ptcolumn.View.Running.edit_window.setTitle('修改商品分类所属栏目');
			Km.Ptcolumn.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Ptcolumn.View.Running.edit_window.savetype=1;
			
			Km.Ptcolumn.View.Running.edit_window.show();    
			Km.Ptcolumn.View.Running.edit_window.maximize();                  
		},        
		/**
		 * 删除商品分类所属栏目
		 */
		deletePtcolumn : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的商品分类所属栏目吗?', this.confirmDeletePtcolumn,this);
		}, 
		/**
		 * 确认删除商品分类所属栏目
		 */
		confirmDeletePtcolumn : function(btn) {
			if (btn == 'yes') {  
				var del_ptcolumn_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_ptcolumn_ids=del_ptcolumn_ids+selectedRows[flag].data.ptcolumn_id+",";
				}
				ExtServicePtcolumn.deleteByIds(del_ptcolumn_ids);
				this.doSelectPtcolumn();
				Ext.Msg.alert("提示", "删除成功！");        
			}
		},
		/**
		 * 导出商品分类所属栏目
		 */
		exportPtcolumn : function() {            
			ExtServicePtcolumn.exportPtcolumn(this.filter,function(provider, response) {  
				if (response.result.data) {
					window.open(response.result.data);
				}
			});                        
		},
		/**
		 * 导入商品分类所属栏目
		 */
		importPtcolumn : function() { 
			if (Km.Ptcolumn.View.current_uploadWindow==null){   
				Km.Ptcolumn.View.current_uploadWindow=new Km.Ptcolumn.View.UploadWindow();   
			}     
			Km.Ptcolumn.View.current_uploadWindow.show();
		}                
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Ptcolumn.View.Running.ptcolumnGrid=new Km.Ptcolumn.View.Grid();           
			if (Km.Ptcolumn.Config.View.IsFix==0){
				Km.Ptcolumn.View.Running.ptcolumnGrid.tvpView.menu.mBind.setChecked(false,true);  
			}
			config = Ext.apply({ 
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Ptcolumn.View.Running.ptcolumnGrid, 
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Ptcolumn.View.Running.viewTabs]}, 
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
					]
				}
			}, config);   
			Km.Ptcolumn.View.Panel.superclass.constructor.call(this, config);  
		}        
	}),
	/**
	 * 当前运行的可视化对象
	 */ 
	Running:{         
		/**
		 * 当前商品分类所属栏目Grid对象
		 */
		ptcolumnGrid:null,  
		/**
		 * 显示商品分类所属栏目信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Ptcolumn.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);     
	Km.Ptcolumn.Init();
	/**
	 * 商品分类所属栏目数据模型获取数据Direct调用
	 */        
	Km.Ptcolumn.Store.ptcolumnStore.proxy=new Ext.data.DirectProxy({ 
		api: {read:ExtServicePtcolumn.queryPagePtcolumn}
	});   
	/**
	 * 商品分类所属栏目页面布局
	 */
	Km.Ptcolumn.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Ptcolumn.View.Panel()]
	});
	Km.Ptcolumn.Viewport.doLayout();    
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});    
