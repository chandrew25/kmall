Ext.namespace("Kmall.Admin.Brand");
Km = Kmall.Admin.Brand;
Km.Brand={
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
			 * 显示品牌的视图相对品牌列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示品牌信息页(或者打开新窗口)
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
		if (Km.Brand.Cookie.get('View.Direction')){
			Km.Brand.Config.View.Direction=Km.Brand.Cookie.get('View.Direction');
		}
		if (Km.Brand.Cookie.get('View.IsFix')!=null){
			Km.Brand.Config.View.IsFix=Km.Brand.Cookie.get('View.IsFix');
		}
	}
};
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
Km.Brand.Store = {
	/**
	 * 品牌
	 */
	brandStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				{name: 'brand_id',type: 'string'},
				{name: 'brand_name',type: 'string'},
				{name: 'brand_logo',type: 'string'},
				{name: 'images',type: 'string'},
				{name: 'brand_desc',type: 'string'},
				{name: 'site_url',type: 'string'},
				{name: 'isShow',type: 'string'},
				{name: 'sort_order',type: 'string'},
				{name: 'seq_no',type: 'string'},
				{name: 'initials',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					Ext.apply(options.params, Km.Brand.View.Running.brandGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
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
					Ext.apply(options.params, Km.Brand.View.Running.view_brandptype.filter);//保证分页也将查询条件带上
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
 * View:品牌显示组件
 */
Km.Brand.View={
	/**
	 * 编辑窗口：新建或者修改品牌
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
					},
					afterrender:function(){
						ckeditor_replace_brand_desc();
					}
				},
				items : [
					new Ext.form.FormPanel({
						ref:'editForm',layout:'form',fileUpload: true,
						labelWidth : 100,labelAlign : "center",
						bodyStyle : 'padding:5px 5px 0',align : "center",
						api : {},
						defaults : {
							xtype : 'textfield',anchor:'98%'
						},
						items : [
							{xtype: 'hidden',  name : 'brand_id',ref:'../brand_id'},
							{fieldLabel : '品牌名称(<font color=red>*</font>)',name : 'brand_name',allowBlank : false},
							{fieldLabel : '品牌首字母',name : 'initials'},
							{xtype: 'hidden',  name : 'brand_logo',ref:'../brand_logo'},
							{fieldLabel : '品牌缩略图',name : 'brand_logoUpload',ref:'../brand_logoUpload',xtype:'fileuploadfield',
							 emptyText: '请上传品牌缩略图',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
							{xtype: 'hidden',  name : 'images',ref:'../images'},
							{fieldLabel : '品牌图片',name : 'imageUpload',ref:'../imageUpload',xtype:'fileuploadfield',
							 emptyText: '请上传品牌图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
							{fieldLabel : '品牌描述(<font color=red>*</font>)',name : 'brand_desc',allowBlank : false,xtype : 'textarea',id:'brand_desc',ref:'brand_desc'},
							{fieldLabel : '品牌网站链接',name : 'site_url'},
							{fieldLabel : '是否显示(<font color=red>*</font>)',hiddenName : 'isShow',allowBlank : false,xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '否'], ['1', '是']]
								}),emptyText: '请选择是否显示',value:"1",
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							{fieldLabel : '排序(<font color=red>*</font>)',name : 'sort_order',allowBlank : false,value:"50"},
							{fieldLabel : '品牌馆排序(<font color=red>*</font>)',name : 'seq_no',allowBlank : false,value:"50"}
						]
					})
				],
				buttons : [ {
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {
						if (CKEDITOR.instances.brand_desc){
							this.editForm.brand_desc.setValue(CKEDITOR.instances.brand_desc.getData());
						}
						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;
						if (this.savetype==0){
							this.editForm.api.submit=ExtServiceBrand.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Brand.View.Running.brandGrid.doSelectBrand();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceBrand.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Brand.View.Running.brandGrid.doSelectBrand();
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
						this.editForm.form.loadRecord(Km.Brand.View.Running.brandGrid.getSelectionModel().getSelected());
						this.brand_logoUpload.setValue(this.brand_logo.getValue());
						this.imageUpload.setValue(this.images.getValue());
						if (CKEDITOR.instances.brand_desc){
							CKEDITOR.instances.brand_desc.setData(Km.Brand.View.Running.brandGrid.getSelectionModel().getSelected().data.brand_desc);
						}
					}
				}]
			}, config);
			Km.Brand.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示品牌详情
	 */
	BrandView:{
		/**
		 * Tab页：容器包含显示与品牌所有相关的信息
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
								if (Km.Brand.View.Running.brandGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择品牌！');
									return false;
								}
								Km.Brand.Config.View.IsShow=1;
								Km.Brand.View.Running.brandGrid.showBrand();
								Km.Brand.View.Running.brandGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Brand.View.BrandView.Tabs.superclass.constructor.call(this, config);
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Brand.Config.View.Direction==1)||(Km.Brand.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabBrandDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">',
						 '<tr class="entry"><td class="head">名称 :</td><td class="content">{brand_name}</td></tr>',
						 '<tr class="entry"><td class="head">首字母 :</td><td class="content">{initials}</td></tr>',
						 '<tr class="entry"><td class="head">缩略图路径 :</td><td class="content">{brand_logo}</td></tr>',
						 '<tr class="entry"><td class="head">缩略图 :</td><td class="content"><img src="upload/images/{brand_logo}" /></td></tr>',
						 '<tr class="entry"><td class="head">品牌图片路径 :</td><td class="content">{images}</td></tr>',
						 '<tr class="entry"><td class="head">品牌图片 :</td><td class="content"><img src="upload/images/{images}" /></td></tr>',
						 '<tr class="entry"><td class="head">品牌描述 :</td><td class="content">{brand_desc}</td></tr>',
						 '<tr class="entry"><td class="head">品牌网站链接 :</td><td class="content">{site_url}</td></tr>',
						 '<tr class="entry"><td class="head">是否显示 :</td><td class="content">{isShow}</td></tr>',
						 '<tr class="entry"><td class="head">排序 :</td><td class="content">{sort_order}</td></tr>',
						 '<tr class="entry"><td class="head">品牌馆排序 :</td><td class="content">{seq_no}</td></tr>',
					 '</table>'
					 ]
					}
				);
				// Km.Brand.View.Running.view_brandptype = new Km.Brandptype.View.Grid({title:'品牌归属业务',iconCls:'tabs'});
				// this.add(
				// 	Km.Brand.View.Running.view_brandptype
				// );
			}
		}),
		/**
		 * 窗口:显示品牌信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看品牌",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Brand.View.BrandView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Brand.Config.View.IsShow=0;
							Km.Brand.View.Running.brandGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Brand.Config.View.IsShow=0;
							Km.Brand.View.Running.brandGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Brand.View.Running.brandGrid.addBrand();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Brand.View.Running.brandGrid.updateBrand();}
					}]
				}, config);
				Km.Brand.View.BrandView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传品牌
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量品牌上传',
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
							emptyText: '请上传品牌Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadBrand',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
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
			Km.Brand.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：品牌列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Brand.Store.brandStore,
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
						{header : '名称',dataIndex : 'brand_name'},
						{header : '首字母',dataIndex : 'initials'},
						{header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
						{header : '排序',dataIndex : 'sort_order'},
						{header : '品牌馆排序',dataIndex : 'seq_no'}
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
								'名称　',{ref: '../bbrand_name'},'&nbsp;&nbsp;',
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectBrand();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.bbrand_name.setValue("");
										this.filter={};
										this.doSelectBrand();
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
									text : '添加品牌',iconCls : 'icon-add',
									handler : function() {
										this.addBrand();
									}
								},'-',{
									text : '修改品牌',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateBrand();
									}
								},'-',{
									text : '删除品牌', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteBrand();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import',
									handler : function() {
										this.importBrand();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportBrand();
									}
								},'-',{
									xtype:'tbsplit',text: '查看品牌', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showBrand()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideBrand();Km.Brand.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Brand.Cookie.set('View.IsFix',Km.Brand.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Brand.Config.PageSize,
					store: Km.Brand.Store.brandStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Brand.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Brand.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Brand.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectBrand();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Brand.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Brand.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectBrand();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示品牌列表
			this.doSelectBrand();
			Km.Brand.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的品牌信息Tab页
			Km.Brand.View.Running.viewTabs=new Km.Brand.View.BrandView.Tabs();
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
					this.grid.updateViewBrand();
					if (sm.getCount() != 1){
						this.grid.hideBrand();
						Km.Brand.Config.View.IsShow=0;
					}else{
						if (Km.Brand.View.IsSelectView==1){
							Km.Brand.View.IsSelectView=0;
							this.grid.showBrand();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Brand.Config.View.IsShow==1){
							Km.Brand.View.IsSelectView=1;
						}
						this.grid.hideBrand();
						Km.Brand.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Brand.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showBrand();
				this.tvpView.toggle(true);
			}else{
				this.hideBrand();
				Km.Brand.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Brand.Config.View.IsFix=1;
			}else{
			   Km.Brand.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Brand.Config.View.IsShow=0;
				return ;
			}
			if (Km.Brand.Config.View.IsShow==1){
			   this.hideBrand();
			   Km.Brand.Config.View.IsShow=0;
			}
			this.showBrand();
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
		 * 查询符合条件的品牌
		 */
		doSelectBrand : function() {
			if (this.topToolbar){
				var bbrand_name = this.topToolbar.bbrand_name.getValue();
				this.filter       ={'brand_name':bbrand_name};
			}
			var condition = {'start':0,'limit':Km.Brand.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceBrand.queryPageBrand(condition,function(provider, response) {
				if (response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Brand.Store.brandStore.loadData(result);
				} else {
					Km.Brand.Store.brandStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的品牌！');
				}
			});
		},
		/**
		 * 显示品牌视图
		 * 显示品牌的视图相对品牌列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Brand.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Brand.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Brand.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Brand.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Brand.View.Running.viewTabs);
					break;
			}
			Km.Brand.Cookie.set('View.Direction',Km.Brand.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Brand.Config.View.IsFix==0)&&(Km.Brand.Config.View.IsShow==1)){
					this.showBrand();
				}
				Km.Brand.Config.View.IsFix=1;
				Km.Brand.View.Running.brandGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Brand.Config.View.IsShow=0;
				this.showBrand();
			}
		},
		/**
		 * 显示品牌
		 */
		showBrand : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择品牌！');
				Km.Brand.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Brand.Config.View.IsFix==0){
				if (Km.Brand.View.Running.view_window==null){
					Km.Brand.View.Running.view_window=new Km.Brand.View.BrandView.Window();
				}
				if (Km.Brand.View.Running.view_window.hidden){
					Km.Brand.View.Running.view_window.show();
					Km.Brand.View.Running.view_window.winTabs.hideTabStripItem(Km.Brand.View.Running.view_window.winTabs.tabFix);
					this.updateViewBrand();
					this.tvpView.toggle(true);
					Km.Brand.Config.View.IsShow=1;
				}else{
					this.hideBrand();
					Km.Brand.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Brand.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Brand.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Brand.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Brand.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Brand.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Brand.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Brand.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Brand.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Brand.View.Running.viewTabs);
					}
					break;
			}
			this.hideBrand();
			if (Km.Brand.Config.View.IsShow==0){
				Km.Brand.View.Running.viewTabs.enableCollapse();
				switch(Km.Brand.Config.View.Direction){
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
				this.updateViewBrand();


				var nowdata=this.getSelectionModel().getSelected().data;
				// Ext.getCmp('hid_brand_name').setValue(nowdata.brand_name);
				// Ext.getCmp('hid_brand_id').setValue(nowdata.brand_id);

				// if(!Km.Brand.View.Running.view_brandptype){
				// 	Km.Brand.View.Running.view_brandptype = new Km.Brandptype.View.Grid({title:'品牌归属业务',iconCls:'tabs'});
				// }
				// Km.Brand.View.Running.view_brandptype.doSelectBrandptype();

				this.tvpView.toggle(true);
				Km.Brand.Config.View.IsShow=1;
			}else{
				Km.Brand.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏品牌
		 */
		hideBrand : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Brand.View.Running.view_window!=null){
				Km.Brand.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前品牌显示信息
		 */
		updateViewBrand : function() {
			if (Km.Brand.View.Running.view_window!=null){
				Km.Brand.View.Running.view_window.winTabs.tabBrandDetail.update(this.getSelectionModel().getSelected().data);
			}

			var nowdata=this.getSelectionModel().getSelected().data;
			Km.Brand.View.Running.viewTabs.tabBrandDetail.update(nowdata);
			// Ext.getCmp('hid_brand_name').value=nowdata.brand_name;
			// Ext.getCmp('hid_brand_id').value=nowdata.brand_id;
			// Km.Brand.View.Running.view_brandptype.doSelectBrandptype();
		},
		/**
		 * 新建品牌
		 */
		addBrand : function() {
			if (Km.Brand.View.Running.edit_window==null){
				Km.Brand.View.Running.edit_window=new Km.Brand.View.EditWindow();
			}
			Km.Brand.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Brand.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Brand.View.Running.edit_window.setTitle('添加品牌');
			Km.Brand.View.Running.edit_window.savetype=0;
			Km.Brand.View.Running.edit_window.images.setValue("");
			if (CKEDITOR.instances.brand_desc){
				CKEDITOR.instances.brand_desc.setData("");
			}
			Km.Brand.View.Running.edit_window.show();
			Km.Brand.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑品牌时先获得选中的品牌信息
		 */
		updateBrand : function() {
			if (Km.Brand.View.Running.edit_window==null){
				Km.Brand.View.Running.edit_window=new Km.Brand.View.EditWindow();
			}
			Km.Brand.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Brand.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Brand.View.Running.edit_window.setTitle('修改品牌');
			Km.Brand.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Brand.View.Running.edit_window.savetype=1;
			Km.Brand.View.Running.edit_window.brand_logoUpload.setValue(Km.Brand.View.Running.edit_window.brand_logo.getValue());
			Km.Brand.View.Running.edit_window.imageUpload.setValue(Km.Brand.View.Running.edit_window.images.getValue());
			if (CKEDITOR.instances.brand_desc){
				CKEDITOR.instances.brand_desc.setData(this.getSelectionModel().getSelected().data.brand_desc);
			}
			Km.Brand.View.Running.edit_window.show();
			Km.Brand.View.Running.edit_window.maximize();
		},
		/**
		 * 删除品牌
		 */
		deleteBrand : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的品牌吗?', this.confirmDeleteBrand,this);
		},
		/**
		 * 确认删除品牌
		 */
		confirmDeleteBrand : function(btn) {
			if (btn == 'yes') {
				var del_brand_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_brand_ids=del_brand_ids+selectedRows[flag].data.brand_id+",";
				}
				ExtServiceBrand.deleteByIds(del_brand_ids);
				this.doSelectBrand();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出品牌
		 */
		exportBrand : function() {
			ExtServiceBrand.exportBrand(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入品牌
		 */
		importBrand : function() {
			if (Km.Brand.View.current_uploadWindow==null){
				Km.Brand.View.current_uploadWindow=new Km.Brand.View.UploadWindow();
			}
			Km.Brand.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Brand.View.Running.brandGrid=new Km.Brand.View.Grid();
			if (Km.Brand.Config.View.IsFix==0){
				Km.Brand.View.Running.brandGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Brand.View.Running.brandGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Brand.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Brand.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前品牌Grid对象
		 */
		brandGrid:null,
		/**
		 * 显示品牌信息及关联信息列表的Tab页
		 */
		viewTabs:null,
		/**
		 * 当前创建的编辑窗口
		 */
		edit_window:null,
		/**
		 * 当前的显示窗口
		 */
		view_window:null,
		/**
		*  当前的品牌商品分类窗口
		*/
		view_brandptype:null
	}
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
							{id:'brandptype_editview_brandname',fieldLabel : '品牌',hiddenName : 'brand_name',xtype : 'displayfield'},
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
									Km.Brand.View.Running.view_brandptype.doSelectBrandptype();
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
									Km.Brand.View.Running.view_brandptype.doSelectBrandptype();
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
						this.editForm.form.loadRecord(Km.Brand.View.Running.view_brandptype.getSelectionModel().getSelected());

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
								if (Km.Brand.View.Running.view_brandptype.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择品牌商品分类关系！');
									return false;
								}
								Km.Brandptype.Config.View.IsShow=1;
								Km.Brand.View.Running.view_brandptype.showBrandptype();
								Km.Brand.View.Running.view_brandptype.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title: '+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Brandptype.View.BrandptypeView.Tabs.superclass.constructor.call(this, config);
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
						},
						hide:function(w){
							Km.Brand.View.Running.view_brandptype.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Brand.View.Running.view_brandptype.addBrandptype();}
						//a1
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Brand.View.Running.view_brandptype.updateBrandptype();}
					}]
				}, config);
				Km.Brandptype.View.BrandptypeView.Window.superclass.constructor.call(this, config);
			}
		})
	},

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
						{header : '品牌标识',dataIndex : 'brand_name'},
						{header : '商品类型编号',dataIndex : 'name'},
						{header : '商品分类[一级]',dataIndex : 'ptype1_name'},
						{header : '商品分类[二级]',dataIndex : 'ptype2_name'},
						{header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
						{header : '是否推荐',dataIndex : 'isRecommend',renderer:function(value){if (value == true) {return "是";}else{return "否";}}}
					]
				}),
				tbar : {
					xtype : 'container',layout : 'anchor',
					height : 27 ,style:'font-size:14px',
					defaults : {
						height : 27,anchor : '100%'
					},
					items : [
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
								},{
									xtype: "hidden",
									id:'hid_brand_name',
									value:''
								},{
									xtype: "hidden",
									id:'hid_brand_id',
									value:''
								}]}
					)]
				}
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
				},
				rowselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						Km.Brandptype.Config.View.IsShow=0;
					}else{
						if (Km.Brandptype.View.IsSelectView==1){
							Km.Brandptype.View.IsSelectView=0;
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Brandptype.Config.View.IsShow==1){
							Km.Brandptype.View.IsSelectView=1;
						}
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
			}else{
				Km.Brandptype.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
			}
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

			var bbrand_name = Ext.getCmp('hid_brand_name').getValue();
			this.filter       ={'brand_id':bbrand_name};
			var condition = {'start':0,'limit':50};
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

			Ext.getCmp("brandptype_editview_brandname").setValue(Ext.getCmp('hid_brand_name').getValue());
            Ext.getCmp("brand_id").setValue(Ext.getCmp('hid_brand_id').getValue());

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

            Ext.getCmp("brandptype_editview_brandname").setValue(Ext.getCmp('hid_brand_name').getValue());
            Ext.getCmp("brand_id").setValue(Ext.getCmp('hid_brand_id').getValue());

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
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Brand.View.Running.view_brandptype=new Km.Brandptype.View.Grid();
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Brand.View.Running.view_brandptype,
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
	Ext.state.Manager.setProvider(Km.Brand.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Brand.Init();
	/**
	 * 品牌数据模型获取数据Direct调用
	 */
	Km.Brand.Store.brandStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceBrand.queryPageBrand}
	});
	/**
	 * 品牌页面布局
	 */
	Km.Brand.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Brand.View.Panel()]
	});
	Km.Brand.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});
