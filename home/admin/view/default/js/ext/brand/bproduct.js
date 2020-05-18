Ext.namespace("Kmall.Admin.Bproduct");
Km = Kmall.Admin.Bproduct;
Km.Bproduct={
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
			 * 显示品牌推荐商品的视图相对品牌推荐商品列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示品牌推荐商品信息页(或者打开新窗口)
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
		if (Km.Bproduct.Cookie.get('View.Direction')){
			Km.Bproduct.Config.View.Direction=Km.Bproduct.Cookie.get('View.Direction');
		}
		if (Km.Bproduct.Cookie.get('View.IsFix')!=null){
			Km.Bproduct.Config.View.IsFix=Km.Bproduct.Cookie.get('View.IsFix');
		}
	}
}; 
/**
 * Model:数据模型   
 */
Km.Bproduct.Store = { 
	/**
	 * 品牌推荐商品
	 */ 
	bproductStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',  
			root: 'data',remoteSort: true,                
			fields : [
				{name: 'bproduct_id',type: 'int'},  
                {name: 'ptype_name',type: 'string'},       
                {name: 'ptype_id',type: 'string'},       
				{name: 'brand_name',type: 'string'},
				{name: 'product_id',type: 'int'}, 
				{name: 'product_name',type: 'string'},
				{name: 'product_price',type: 'float'},
				{name: 'ico',type: 'string'}
			]}         
		),
		writer: new Ext.data.JsonWriter({
			encode: false 
		}),
		listeners : {    
			beforeload : function(store, options) {   
				if (Ext.isReady) {  
					Ext.apply(options.params, Km.Bproduct.View.Running.bproductGrid.filter);//保证分页也将查询条件带上  
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
			{name: 'product_name', mapping: 'name'} 
		])
	}),
    
    /**
     * 商品分类
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
            {name: 'ptype_name', mapping: 'name'} 
        ])
    })      
};
/**
 * View:品牌推荐商品显示组件   
 */
Km.Bproduct.View={ 
	/**
	 * 编辑窗口：新建或者修改品牌推荐商品
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
							{xtype: 'hidden',name : 'bproduct_id',ref:'../bproduct_id'},             
							{xtype: 'hidden',name : 'product_id',id:'product_id',ref:'../product_id'},
                            {xtype: 'hidden',name : 'ptype_id',id:'ptype_id',ref:'../ptype_id'}, 
                            {
                                 fieldLabel : '品牌商品分类',xtype: 'combo',name : 'ptype_name',id : 'ptype_name',
                                 store:Km.Bproduct.Store.ptypeStore,emptyText: '请选择品牌商品分类',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Bproduct.Config.PageSize,
                                 displayField:'ptype_name',// 显示文本
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                            '<tpl for="."><div class="search-item">',
                                                '<h3>{ptype_name}</h3>',
                                            '</div></tpl>'
                                 ),
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        Ext.getCmp("ptype_id").setValue(record.data.ptype_id);
                                        Ext.getCmp("ptype_name").setValue(record.data.ptype_name);
                                        this.collapse();
                                     }
                                 }
                            },
							{
								 fieldLabel : '商品名称',xtype: 'combo',name : 'product_name',id : 'product_name',
								 store:Km.Bproduct.Store.productStore,emptyText: '请选择商品',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Bproduct.Config.PageSize,
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
							}                                                                       
                            //{xtype: 'hidden',  name : 'ico',ref:'../ico'},
                            //{fieldLabel : '图片',name : 'icoUpload',ref:'../icoUpload',xtype:'fileuploadfield',
                            // emptyText: '请上传图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}}                      
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
							this.editForm.api.submit=ExtServiceBproduct.save;                   
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Bproduct.View.Running.bproductGrid.doSelectBproduct();
									form.reset(); 
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceBproduct.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Bproduct.View.Running.bproductGrid.doSelectBproduct();
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
						this.editForm.form.loadRecord(Km.Bproduct.View.Running.bproductGrid.getSelectionModel().getSelected());
						//this.icoUpload.setValue(this.ico.getValue());
 
					}                  
				}]    
			}, config);  
			Km.Bproduct.View.EditWindow.superclass.constructor.call(this, config);     
		}
	}),
	/**
	 * 显示品牌推荐商品详情
	 */
	BproductView:{
		/**
		 * Tab页：容器包含显示与品牌推荐商品所有相关的信息
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
								if (Km.Bproduct.View.Running.bproductGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择品牌推荐商品！');
									return false;
								} 
								Km.Bproduct.Config.View.IsShow=1;
								Km.Bproduct.View.Running.bproductGrid.showBproduct();   
								Km.Bproduct.View.Running.bproductGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Bproduct.View.BproductView.Tabs.superclass.constructor.call(this, config); 
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Bproduct.Config.View.Direction==1)||(Km.Bproduct.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabBproductDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">', 
						 '<tr class="entry"><td class="head">品牌名称 :</td><td class="content">{brand_name}</td></tr>',
						 '<tr class="entry"><td class="head">商品标识</td><td class="content">{name}</td></tr>',
						 '<tr class="entry"><td class="head">商品价格 :</td><td class="content">{product_price}</td></tr>',
						 '<tr class="entry"><td class="head">商品图标路径 :</td><td class="content">{ico}</td></tr>',
						 '<tr class="entry"><td class="head">商品图标 :</td><td class="content"><img src="upload/images/{ico}" /></td></tr>',                      
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
		 * 窗口:显示品牌推荐商品信息
		 */
		Window:Ext.extend(Ext.Window,{ 
			constructor : function(config) { 
				config = Ext.apply({
					title:"查看品牌推荐商品",constrainHeader:true,maximizable: true,minimizable : true, 
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Bproduct.View.BproductView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: { 
						minimize:function(w){
							w.hide();
							Km.Bproduct.Config.View.IsShow=0;
							Km.Bproduct.View.Running.bproductGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Bproduct.View.Running.bproductGrid.tvpView.toggle(false);
						}   
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Bproduct.View.Running.bproductGrid.addBproduct();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Bproduct.View.Running.bproductGrid.updateBproduct();}
					}]
				}, config);  
				Km.Bproduct.View.BproductView.Window.superclass.constructor.call(this, config);   
			}        
		})
	},
	/**
	 * 窗口：批量上传品牌推荐商品
	 */        
	UploadWindow:Ext.extend(Ext.Window,{ 
		constructor : function(config) { 
			config = Ext.apply({     
				title : '批量品牌推荐商品上传',
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
							emptyText: '请上传品牌推荐商品Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadBproduct',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Bproduct.View.Running.bproductGrid.doSelectBproduct();
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
			Km.Bproduct.View.UploadWindow.superclass.constructor.call(this, config);     
		}        
	}),
	/**
	 * 视图：品牌推荐商品列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件  
				 */
				filter:null,
				region : 'center',
				store : Km.Bproduct.Store.bproductStore,
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
						{header : '品牌商品分类关系标识',dataIndex : 'ptype_name'},        
						{header : '品牌名称',dataIndex : 'brand_name'},   
						{header : '商品名称',dataIndex : 'product_name'},
						{header : '商品价格',dataIndex : 'product_price'},
						{header : '商品图标',dataIndex : 'ico'}                                 
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
								'商品名称　',{ref: '../bproduct_name'},'&nbsp;&nbsp;',                                
								{
									xtype : 'button',text : '查询',scope: this, 
									handler : function() {
										this.doSelectBproduct();
									}
								}, 
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {                         
										this.topToolbar.bproduct_name.setValue("");                                        
										this.filter={};
										this.doSelectBproduct();
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
									text : '添加品牌推荐商品',iconCls : 'icon-add',
									handler : function() {
										this.addBproduct();
									}
								},'-',{
									text : '修改品牌推荐商品',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
									handler : function() {
										this.updateBproduct();
									}
								},'-',{
									text : '删除品牌推荐商品', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
									handler : function() {
										this.deleteBproduct();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import', 
									handler : function() {
										this.importBproduct();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export', 
									handler : function() { 
										this.exportBproduct();
									}
								},'-',{ 
									xtype:'tbsplit',text: '查看品牌推荐商品', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,  
									handler:function(){this.showBproduct()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideBproduct();Km.Bproduct.Config.View.IsShow=0;}},'-', 
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Bproduct.Cookie.set('View.IsFix',Km.Bproduct.Config.View.IsFix);}} 
										]}
								},'-']}
					)]
				},                
				bbar: new Ext.PagingToolbar({          
					pageSize: Km.Bproduct.Config.PageSize,
					store: Km.Bproduct.Store.bproductStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Bproduct.Config.PageSize,minValue:1,width:35, 
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Bproduct.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Bproduct.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectBproduct();
								}, 
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Bproduct.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Bproduct.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectBproduct();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示品牌推荐商品列表
			this.doSelectBproduct();
			Km.Bproduct.View.Grid.superclass.constructor.call(this, config); 
			//创建在Grid里显示的品牌推荐商品信息Tab页
			Km.Bproduct.View.Running.viewTabs=new Km.Bproduct.View.BproductView.Tabs();
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
					this.grid.updateViewBproduct();                     
					if (sm.getCount() != 1){
						this.grid.hideBproduct();
						Km.Bproduct.Config.View.IsShow=0;
					}else{
						if (Km.Bproduct.View.IsSelectView==1){
							Km.Bproduct.View.IsSelectView=0;  
							this.grid.showBproduct();   
						}     
					}    
				},
				rowdeselect: function(sm, rowIndex, record) {  
					if (sm.getCount() != 1){
						if (Km.Bproduct.Config.View.IsShow==1){
							Km.Bproduct.View.IsSelectView=1;    
						}             
						this.grid.hideBproduct();
						Km.Bproduct.Config.View.IsShow=0;
					}    
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){  
			if (!Km.Bproduct.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showBproduct();
				this.tvpView.toggle(true);
			}else{
				this.hideBproduct();
				Km.Bproduct.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){ 
			if (checked){             
			   Km.Bproduct.Config.View.IsFix=1; 
			}else{ 
			   Km.Bproduct.Config.View.IsFix=0;   
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Bproduct.Config.View.IsShow=0;
				return ;
			}
			if (Km.Bproduct.Config.View.IsShow==1){
			   this.hideBproduct(); 
			   Km.Bproduct.Config.View.IsShow=0;
			}
			this.showBproduct();   
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
		 * 查询符合条件的品牌推荐商品
		 */
		doSelectBproduct : function() {
			if (this.topToolbar){
				//var bbrand_id = this.topToolbar.bbrand_id.getValue();
				var bproduct_name = this.topToolbar.bproduct_name.getValue();
                //'brand_id':bbrand_id,
				this.filter       ={'product_name':bproduct_name};
			}
			var condition = {'start':0,'limit':Km.Bproduct.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceBproduct.queryPageBproduct(condition,function(provider, response) {   
				if (response.result.data) {   
					var result           = new Array();
					result['data']       =response.result.data; 
					result['totalCount'] =response.result.totalCount;
					Km.Bproduct.Store.bproductStore.loadData(result); 
				} else {
					Km.Bproduct.Store.bproductStore.removeAll();                        
					Ext.Msg.alert('提示', '无符合条件的品牌推荐商品！');
				}
			});
		}, 
		/**
		 * 显示品牌推荐商品视图
		 * 显示品牌推荐商品的视图相对品牌推荐商品列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Bproduct.Config.View.Direction=viewDirection; 
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Bproduct.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Bproduct.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Bproduct.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Bproduct.View.Running.viewTabs);
					break;    
			}  
			Km.Bproduct.Cookie.set('View.Direction',Km.Bproduct.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Bproduct.Config.View.IsFix==0)&&(Km.Bproduct.Config.View.IsShow==1)){
					this.showBproduct();     
				}
				Km.Bproduct.Config.View.IsFix=1;
				Km.Bproduct.View.Running.bproductGrid.tvpView.menu.mBind.setChecked(true,true);  
				Km.Bproduct.Config.View.IsShow=0;
				this.showBproduct();     
			}
		}, 
		/**
		 * 显示品牌推荐商品
		 */
		showBproduct : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择品牌推荐商品！');
				Km.Bproduct.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			} 
			if (Km.Bproduct.Config.View.IsFix==0){
				if (Km.Bproduct.View.Running.view_window==null){
					Km.Bproduct.View.Running.view_window=new Km.Bproduct.View.BproductView.Window();
				}
				if (Km.Bproduct.View.Running.view_window.hidden){
					Km.Bproduct.View.Running.view_window.show();
					Km.Bproduct.View.Running.view_window.winTabs.hideTabStripItem(Km.Bproduct.View.Running.view_window.winTabs.tabFix);   
					this.updateViewBproduct();
					this.tvpView.toggle(true);
					Km.Bproduct.Config.View.IsShow=1;
				}else{
					this.hideBproduct();
					Km.Bproduct.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Bproduct.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Bproduct.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Bproduct.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Bproduct.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Bproduct.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Bproduct.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Bproduct.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Bproduct.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Bproduct.View.Running.viewTabs);
					}
					break;    
			}  
			this.hideBproduct();
			if (Km.Bproduct.Config.View.IsShow==0){
				Km.Bproduct.View.Running.viewTabs.enableCollapse();  
				switch(Km.Bproduct.Config.View.Direction){
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
				this.updateViewBproduct();
				this.tvpView.toggle(true);
				Km.Bproduct.Config.View.IsShow=1;
			}else{
				Km.Bproduct.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏品牌推荐商品
		 */
		hideBproduct : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();   
			this.ownerCt.east.hide(); 
			if (Km.Bproduct.View.Running.view_window!=null){
				Km.Bproduct.View.Running.view_window.hide();
			}            
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前品牌推荐商品显示信息
		 */
		updateViewBproduct : function() {
			if (Km.Bproduct.View.Running.view_window!=null){
				Km.Bproduct.View.Running.view_window.winTabs.tabBproductDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Bproduct.View.Running.viewTabs.tabBproductDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建品牌推荐商品
		 */
		addBproduct : function() {  
			if (Km.Bproduct.View.Running.edit_window==null){   
				Km.Bproduct.View.Running.edit_window=new Km.Bproduct.View.EditWindow();   
			}     
			Km.Bproduct.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Bproduct.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Bproduct.View.Running.edit_window.setTitle('添加品牌推荐商品');
			Km.Bproduct.View.Running.edit_window.savetype=0;
			//Km.Bproduct.View.Running.edit_window.ico.setValue("");
			
			Km.Bproduct.View.Running.edit_window.show();   
			Km.Bproduct.View.Running.edit_window.maximize();               
		},   
		/**
		 * 编辑品牌推荐商品时先获得选中的品牌推荐商品信息
		 */
		updateBproduct : function() {
			if (Km.Bproduct.View.Running.edit_window==null){   
				Km.Bproduct.View.Running.edit_window=new Km.Bproduct.View.EditWindow();   
			}            
			Km.Bproduct.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Bproduct.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Bproduct.View.Running.edit_window.setTitle('修改品牌推荐商品');
			Km.Bproduct.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Bproduct.View.Running.edit_window.savetype=1;
			//Km.Bproduct.View.Running.edit_window.icoUpload.setValue(Km.Bproduct.View.Running.edit_window.ico.getValue());
			
			Km.Bproduct.View.Running.edit_window.show();    
			Km.Bproduct.View.Running.edit_window.maximize();                  
		},        
		/**
		 * 删除品牌推荐商品
		 */
		deleteBproduct : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的品牌推荐商品吗?', this.confirmDeleteBproduct,this);
		}, 
		/**
		 * 确认删除品牌推荐商品
		 */
		confirmDeleteBproduct : function(btn) {
			if (btn == 'yes') {  
				var del_bproduct_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_bproduct_ids=del_bproduct_ids+selectedRows[flag].data.bproduct_id+",";
				}
				ExtServiceBproduct.deleteByIds(del_bproduct_ids);
				this.doSelectBproduct();
				Ext.Msg.alert("提示", "删除成功！");        
			}
		},
		/**
		 * 导出品牌推荐商品
		 */
		exportBproduct : function() {            
			ExtServiceBproduct.exportBproduct(this.filter,function(provider, response) {  
				if (response.result.data) {
					window.open(response.result.data);
				}
			});                        
		},
		/**
		 * 导入品牌推荐商品
		 */
		importBproduct : function() { 
			if (Km.Bproduct.View.current_uploadWindow==null){   
				Km.Bproduct.View.current_uploadWindow=new Km.Bproduct.View.UploadWindow();   
			}     
			Km.Bproduct.View.current_uploadWindow.show();
		}                
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Bproduct.View.Running.bproductGrid=new Km.Bproduct.View.Grid();           
			if (Km.Bproduct.Config.View.IsFix==0){
				Km.Bproduct.View.Running.bproductGrid.tvpView.menu.mBind.setChecked(false,true);  
			}
			config = Ext.apply({ 
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Bproduct.View.Running.bproductGrid, 
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Bproduct.View.Running.viewTabs]}, 
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
					]
				}
			}, config);   
			Km.Bproduct.View.Panel.superclass.constructor.call(this, config);  
		}        
	}),
	/**
	 * 当前运行的可视化对象
	 */ 
	Running:{         
		/**
		 * 当前品牌推荐商品Grid对象
		 */
		bproductGrid:null,  
		/**
		 * 显示品牌推荐商品信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Bproduct.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);     
	Km.Bproduct.Init();
	/**
	 * 品牌推荐商品数据模型获取数据Direct调用
	 */        
	Km.Bproduct.Store.bproductStore.proxy=new Ext.data.DirectProxy({ 
		api: {read:ExtServiceBproduct.queryPageBproduct}
	});   
	/**
	 * 品牌推荐商品页面布局
	 */
	Km.Bproduct.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Bproduct.View.Panel()]
	});
	Km.Bproduct.Viewport.doLayout();    
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});  
