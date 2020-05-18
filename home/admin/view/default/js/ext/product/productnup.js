Ext.namespace("Kmall.Admin.Product");
Km = Kmall.Admin;
Km.Product={
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
			 * 显示商品的视图相对商品列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示商品信息页(或者打开新窗口)
			 */
			IsFix:0
		},
		/**
		 * 在线编辑器类型。
		 * 1:CkEditor,2:KindEditor,3:xhEditor
		 * 配合Action的变量配置$online_editor
		 */
		OnlineEditor:1
	},
	/**
	 * Cookie设置
	 */
	Cookie:new Ext.state.CookieProvider(),
	/**
	 * 初始化
	 */
	Init:function(){
		if (Km.Product.Cookie.get('View.Direction')){
			Km.Product.Config.View.Direction=Km.Product.Cookie.get('View.Direction');
		}
		if (Km.Product.Cookie.get('View.IsFix')!=null){
			Km.Product.Config.View.IsFix=Km.Product.Cookie.get('View.IsFix');
		}
		if (Ext.util.Cookies.get('OnlineEditor')!=null){
			Km.Product.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
		}

	}
};
/**
 * Model:数据模型
 */
Km.Product.Store = {
	/**
	 * 商品
	 */
	productStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				{name: 'message',type: 'string'},
				{name: 'msgleft',type: 'string'},
				{name: 'msgright',type: 'string'},
				{name: 'product_id',type: 'string'},
				{name: 'product_code',type: 'string'},
				{name: 'supplier_id',type: 'int'},
				{name: 'sp_name',type: 'string'},
				{name: 'sptypeShow',type: 'string'},
				{name: 'sptype',type: 'string'},
				{name: 'ptype_id',type: 'int'},
				{name: 'ptype_name',type: 'string'},
				{name: 'ptype_key',type: 'string'},
				{name: 'product_name',type: 'string'},
        {name: 'brand_id',type: 'int'},
				{name: 'brand_name',type: 'string'},
				{name: 'price',type: 'float'},
				{name: 'price_tag',type: 'string'},
				{name: 'market_price',type: 'float'},
				{name: 'cost',type: 'float'},
				{name: 'discount',type: 'string'},
				{name: 'specification',type: 'string'},
				{name: 'attr_key',type: 'string'},
				{name: 'image',type: 'string'},
				{name: 'image_large',type: 'string'},
				{name: 'unit',type: 'string'},
				{name: 'tag_types',type: 'string'},
				{name: 'market_jifen',type: 'int'},
				{name: 'jifen',type: 'int'},
				{name: 'scale',type: 'string'},
				{name: 'num',type: 'int'},
				{name: 'weight',type: 'float'},
				{name: 'low_alarm',type: 'int'},
				{name: 'in_price',type: 'float'},
				{name: 'recommend_price',type: 'float'},
				{name: 'good_price',type: 'float'},
				{name: 'intro',type: 'string'},
				{name: 'sales_count',type: 'int'},
				{name: 'click_count',type: 'int'},
				{name: 'sort_order',type: 'int'},
				{name: 'uptime',type: 'date',dateFormat:'Y-m-d H:i:s'},
				{name: 'downtime',type: 'date',dateFormat:'Y-m-d H:i:s'},
				{name: 'isRecommend',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (!options.params.limit)options.params.limit=Km.Product.Config.PageSize;
					Ext.apply(options.params, Km.Product.View.Running.productGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	}),
	/**
	 * 供应商
	 */
	supplierStoreForCombo:new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/supplier.php'
		}),
		reader: new Ext.data.JsonReader({
			root: 'suppliers',
			autoLoad: true,
			totalProperty: 'totalCount',
			idProperty: 'supplier_id'
		}, [
			{name: 'supplier_id', mapping: 'supplier_id'},
			{name: 'sp_name', mapping: 'sp_name'}
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
	}),
	/**
	 *品牌
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
			{name: 'ptype_level', mapping: 'level'},
			{name: 'ptype_name', mapping: 'name'}
		])
	})
};
/**
 * View:商品显示组件
 */
Km.Product.View={
	/**
	 * 编辑窗口：新建或者修改商品
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
				width : 640,height : 550,minWidth : 400,minHeight : 450,
				layout : 'fit',plain : true,buttonAlign : 'center',
				defaults : {
						autoScroll : true
					},
				listeners:{
					beforehide:function(){
						this.editForm.form.getEl().dom.reset();
					},
					afterrender:function(){
						switch (Km.Product.Config.OnlineEditor)
						{
							case 2:
								Km.Product.View.EditWindow.KindEditor_specification = KindEditor.create('textarea[name="specification"]',{width:'98%',minHeith:'350px', filterMode:true});
								Km.Product.View.EditWindow.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
								break
							case 3:
								pageInit_specification();
								pageInit_intro();
								break
							default:
								ckeditor_replace_specification();
								ckeditor_replace_intro();
						}
					}
				},
				items : [
					new Ext.form.FormPanel({
						ref:'editForm',layout:'form',fileUpload: true,
						labelWidth : 150,labelAlign : "center",
						bodyStyle : 'padding:5px 5px 0',align : "center",
						api : {},
						defaults : {
							xtype : 'textfield',anchor:'98%'
						},
						items : [
							{xtype: 'hidden',  name : 'product_id',ref:'../product_id'},
							{
								xtype: 'compositefield',
								defaults : {
									xtype : 'textfield'
								},
								items: [
									{fieldLabel: '商品名称(<font color=red>*</font>)',allowBlank : false,name: 'product_name',flex:2},
									{xtype:'displayfield',value:'商品货号(<font color=red>*</font>):'},{name: 'product_code',allowBlank : false,flex:2}]
							},
							{xtype: 'hidden',name : 'brand_id',ref:'../brand_id'},
							{xtype: 'hidden',name : 'ptype_id',ref:'../ptype_id'},
							{
								xtype: 'compositefield',ref: '../ptypebrand',
								defaults : {xtype : 'textfield'},
								items: [
									{
										fieldLabel:"商品分类(<font color=red>*</font>):",xtype:'combotree', ref:'ptype_name',name: 'ptype_name',grid:this,
										emptyText: '请选择商品分类',canFolderSelect:false,flex:1,editable:false,
										tree: new Ext.tree.TreePanel({
											dataUrl: 'home/admin/src/httpdata/ptypeTree.php',
											root: {nodeType: 'async'},
											border: false,rootVisible: false,
											listeners: {
												beforeload: function(n) {if (n) {this.getLoader().baseParams.id = n.attributes.id;}}
											}
										}),
										onSelect: function(cmb, node) {
											this.grid.ptype_id.setValue(node.attributes.id);
											this.setValue(node.attributes.text);
										}
									},
									{xtype:'displayfield',value:'商品品牌(<font color=red>*</font>):'},
									{
										 xtype: 'combo',name : 'brand_name',ref : '../brand_name',
										 store:Km.Product.Store.brandStore,emptyText: '请选择商品品牌',itemSelector: 'div.search-item',
										 loadingText: '查询中...',pageSize:Km.Product.Config.PageSize,
										 displayField:'brand_name',grid:this,flex:1,
										 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
										 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
										 tpl:new Ext.XTemplate(
													'<tpl for="."><div class="search-item">',
														'<h3>{brand_name}</h3>',
													'</div></tpl>'
										 ),
                                         listeners:{
                                           'beforequery': function(event){delete event.combo.lastQuery;},
                                         },
										 onSelect:function(record,index){
											 if(this.fireEvent('beforeselect', this, record, index) !== false){
												this.grid.brand_id.setValue(record.data.brand_id);
												this.grid.ptypebrand.brand_name.setValue(record.data.brand_name);
												this.collapse();
											 }
										 }
									}]
							},
							{xtype: 'hidden',name : 'ptype_oid',ref:'../ptype_oid'},
							{xtype: 'hidden',name : 'ptype_level',ref:'../ptype_level'},
							{xtype: 'hidden',name : 'ptype1_id'},
							{xtype: 'hidden',name : 'ptype2_id'},
							{xtype: 'hidden',  name : 'image',ref:'../image'},
							{fieldLabel : '商品图片(600*600)(<font color=red>*</font>)',name : 'image_largeUpload',ref:'../image_largeUpload',xtype:'fileuploadfield',allowBlank : false,
							 emptyText: '请上传商品图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
							{
								xtype: 'compositefield',
								defaults : {
									xtype : 'textfield'
								},
								items: [
									{fieldLabel: '市场价(<font color=red>*</font>)',allowBlank : false,name: 'market_price',flex:1},
									{xtype:'displayfield',value:'销售价(<font color=red>*</font>):'},{xtype:"numberfield",name: 'price',allowBlank : false,flex:1},
									{xtype:'displayfield',value:'价格标签:'},{name: 'price_tag',emptyText: '默认标签为商城价',flex:1},
									{xtype:'displayfield',value:'数量:'},{xtype:"numberfield",name : 'num',value:'1',flex:1},
									{xtype:'displayfield',value:'最少购买数量:'},{xtype:"numberfield",name : 'mustBuyNum',value:'1',flex:1}]
							},
							{
								xtype: 'compositefield',ref: '../unitpackage',
								defaults : {
									xtype : 'textfield'
								},
								items: [
									{
										 fieldLabel : '商品量词',xtype: 'combo',name : 'unit',ref:'unit',
										 store:Km.Product.Store.quantifierStore,emptyText: '请选择商品量词',itemSelector: 'div.search-item',
										 loadingText: '查询中...',pageSize:Km.Product.Config.PageSize,
										 displayField:'quantifier_name',flex:1,grid:this,
										 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
										 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
										 tpl:new Ext.XTemplate(
													'<tpl for="."><div class="search-item">',
														'<h3>{quantifier_name}</h3>',
													'</div></tpl>'
										 ),
										 onSelect:function(record,index){
											 if(this.fireEvent('beforeselect', this, record, index) !== false){
												this.grid.unitpackage.unit.setValue(record.data.quantifier_name);
												this.collapse();
											 }
										 }
									},
									{xtype:'displayfield',value:'规格简述:'},{name : 'scale',flex:1},
									{xtype:'displayfield',value:'重量:'},{xtype:"numberfield",name : 'weight',flex:1}
								]
							},
							{
								xtype: 'compositefield',
								defaults : {xtype : 'textfield'},
								items: [
									{fieldLabel : '是否推荐(<font color=red>*</font>)',hiddenName : 'isRecommend',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
										store : new Ext.data.SimpleStore({
												fields : ['value', 'text'],
												data : [['0', '否'], ['1', '是']]
										}),emptyText: '请选择是否推荐',flex:1,value:'0',
										valueField : 'value',displayField : 'text'
									},
									{xtype:'displayfield',value:'销售量:'},{xtype:"numberfield",name : 'sales_count',flex:1},
									{xtype:'displayfield',value:'热度:'},{xtype:"numberfield",name : 'click_count',flex:1},
									{xtype:'displayfield',value:'排序:'},{xtype:"numberfield",name : 'sort_order',flex:1}
								]
							},
							{fieldLabel : '商品介绍',xtype : 'textarea',name : 'intro',id:'intro',ref:'intro'},
							{
								xtype: 'compositefield',
								defaults : {
									xtype : 'textfield'
								},
								items: [
									{fieldLabel: '广告词',name: 'message',flex:1},
									{xtype:'displayfield',value:'左侧广告词:'},{name: 'msgleft',flex:1},
									{xtype:'displayfield',value:'右侧广告词:'},{name : 'msgright',flex:1}
								]
							},
							{fieldLabel : '商品规格',name : 'specification',xtype : 'textarea',id:'specification',ref:'specification'}
						]
					})
				],
				buttons : [ {
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {
						switch (Km.Product.Config.OnlineEditor)
						{
							case 2:
								if (Km.Product.View.EditWindow.KindEditor_specification)this.editForm.specification.setValue(Km.Product.View.EditWindow.KindEditor_specification.html());
								if (Km.Product.View.EditWindow.KindEditor_intro)this.editForm.intro.setValue(Km.Product.View.EditWindow.KindEditor_intro.html());
								break
							case 3:
								if (xhEditor_specification)this.editForm.specification.setValue(xhEditor_specification.getSource());
								if (xhEditor_intro)this.editForm.intro.setValue(xhEditor_intro.getSource());
								break
							default:
								if (CKEDITOR.instances.specification) this.editForm.specification.setValue(CKEDITOR.instances.specification.getData());
								if (CKEDITOR.instances.intro) this.editForm.intro.setValue(CKEDITOR.instances.intro.getData());
						}

						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;
						if (this.savetype==0){
							this.editForm.api.submit=ExtServiceProduct.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Product.View.Running.productGrid.doSelectProduct();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceProduct.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Product.View.Running.productGrid.bottomToolbar.doRefresh();
									}});
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
						this.editForm.form.loadRecord(Km.Product.View.Running.productGrid.getSelectionModel().getSelected());
						this.image_largeUpload.setValue(this.image.getValue());
						switch (Km.Product.Config.OnlineEditor)
						{
							case 2:
								if (Km.Product.View.EditWindow.KindEditor_specification) Km.Product.View.EditWindow.KindEditor_specification.html(Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data.specification);
								if (Km.Product.View.EditWindow.KindEditor_intro) Km.Product.View.EditWindow.KindEditor_intro.html(Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data.intro);
								break
							case 3:
								break
							default:
								if (CKEDITOR.instances.specification) CKEDITOR.instances.specification.setData(Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data.specification);
								if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data.intro);
						}
					}
				}]
			}, config);
			Km.Product.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示商品详情
	 */
	ProductView:{
		/**
		 * Tab页：容器包含显示与商品所有相关的信息
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
								if (Km.Product.View.Running.productGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择商品！');
									return false;
								}
								Km.Product.Config.View.IsShow=1;
								Km.Product.View.Running.productGrid.showProduct();
								Km.Product.View.Running.productGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Product.View.ProductView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Product.Config.View.Direction==1)||(Km.Product.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabProductDetail',iconCls:'tabs',
					 tpl: [
						 '<table class="viewdoblock">',
						 '<tr class="entry"><td class="head">商品名称</td><td class="content">{product_name}</td></tr>',
						 '<tr class="entry"><td class="head">商品类型</td><td class="content">{ptype_name}</td></tr>',
						 '<tr class="entry"><td class="head">商品条码</td><td class="content">{product_code}</td></tr>',
						 '<tr class="entry"><td class="head">价格</td><td class="content">{price}</td></tr>',
						 '<tr class="entry"><td class="head">价格标签</td><td class="content">{price_tag}</td></tr>',
						 '<tr class="entry"><td class="head">数量</td><td class="content">{num}</td></tr>',
						 '<tr class="entry"><td class="head">供货商</td><td class="content">{sp_name}</td></tr>',
						 '<tr class="entry"><td class="head">最低库存警报</td><td class="content">{low_alarm}</td></tr>',
						 '<tr class="entry"><td class="head">单位</td><td class="content">{unit}</td></tr>',
						 '<tr class="entry"><td class="head">广告词</td><td class="content">{message}</td></tr>',
						 '<tr class="entry"><td class="head">左侧广告词</td><td class="content">{msgleft}</td></tr>',
						 '<tr class="entry"><td class="head">右侧广告词</td><td class="content">{msgright}</td></tr>',
						 '</table>'
					 ]}
				);
			}
		}),
		/**
		 * 窗口:显示商品信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看商品",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Product.View.ProductView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Product.Config.View.IsShow=0;
							Km.Product.View.Running.productGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Product.Config.View.IsShow=0;
							Km.Product.View.Running.productGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Product.View.Running.productGrid.addProduct();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Product.View.Running.productGrid.updateProduct();}
					}]
				}, config);
				Km.Product.View.ProductView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 视图：商品列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Product.Store.productStore,
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
						{header : '商品类型',dataIndex : 'ptypeShowAll'},
						{header : '商品条码',dataIndex : 'product_code'},
						{header : '价格',dataIndex : 'price'},
						{header : '价格标签',dataIndex : 'price_tag'},
						{header : '数量',dataIndex : 'num'},
						{header : '供货商',dataIndex : 'sp_name'},
						{header : '最低库存警报',dataIndex : 'low_alarm'},
						{header : '单位',dataIndex : 'unit'}
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
										if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectProduct();
									}
								}
							},
							items : [
								'商品条码','&nbsp;&nbsp;',{ref: '../pproduct_code'},'&nbsp;&nbsp;',
								'商品名称 ','&nbsp;&nbsp;',{ref: '../pproduct_name'},'&nbsp;&nbsp;',
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectProduct();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.pproduct_code.setValue("");
										this.topToolbar.pproduct_name.setValue("");
										this.filter={};
										this.doSelectProduct();
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
									text : '商品上架',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateProduct();
									}
								},'-',{
									text : '删除商品', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteProduct();
									}
								},'-',{
									xtype:'tbsplit',text: '查看商品', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showProduct()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideProduct();Km.Product.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Product.Cookie.set('View.IsFix',Km.Product.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Product.Config.PageSize,
					store: Km.Product.Store.productStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
						change:function(thisbar,pagedata){
                            if (Km.Product.Viewport){
								if (Km.Product.Config.View.IsShow==1){
									Km.Product.View.IsSelectView=1;
								}
								this.ownerCt.hideProduct();
								Km.Product.Config.View.IsShow=0;
							}
						}
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Product.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Product.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Product.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectProduct();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Product.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Product.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectProduct();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示商品列表
			this.doSelectProduct();
			Km.Product.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的商品信息Tab页
			Km.Product.View.Running.viewTabs=new Km.Product.View.ProductView.Tabs();
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
					this.grid.updateViewProduct();
					if (sm.getCount() != 1){
						this.grid.hideProduct();
						Km.Product.Config.View.IsShow=0;
					}else{
						if (Km.Product.View.IsSelectView==1){
							Km.Product.View.IsSelectView=0;
							this.grid.showProduct();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Product.Config.View.IsShow==1){
							Km.Product.View.IsSelectView=1;
						}
						this.grid.hideProduct();
						Km.Product.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Product.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showProduct();
				this.tvpView.toggle(true);
			}else{
				this.hideProduct();
				Km.Product.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Product.Config.View.IsFix=1;
			}else{
			   Km.Product.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Product.Config.View.IsShow=0;
				return ;
			}
			if (Km.Product.Config.View.IsShow==1){
			   this.hideProduct();
			   Km.Product.Config.View.IsShow=0;
			}
			this.showProduct();
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
		 * 查询符合条件的商品
		 */
		doSelectProduct : function() {
			if (this.topToolbar){
				var pproduct_code = this.topToolbar.pproduct_code.getValue();
				var pproduct_name = this.topToolbar.pproduct_name.getValue();
				this.filter       ={'product_code':pproduct_code,'product_name':pproduct_name};
			}
			var condition = {'start':0,'limit':Km.Product.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceProduct.queryPageProductNup(condition,function(provider, response) {
				if (response.result&&response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Product.Store.productStore.loadData(result);
				} else {
					Km.Product.Store.productStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的商品！');
				}
			});
		},
		/**
		 * 显示商品视图
		 * 显示商品的视图相对商品列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Product.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Product.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Product.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Product.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Product.View.Running.viewTabs);
					break;
			}
			Km.Product.Cookie.set('View.Direction',Km.Product.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Product.Config.View.IsFix==0)&&(Km.Product.Config.View.IsShow==1)){
					this.showProduct();
				}
				Km.Product.Config.View.IsFix=1;
				Km.Product.View.Running.productGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Product.Config.View.IsShow=0;
				this.showProduct();
			}
		},
		/**
		 * 显示商品
		 */
		showProduct : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择商品！');
				Km.Product.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Product.Config.View.IsFix==0){
				if (Km.Product.View.Running.view_window==null){
					Km.Product.View.Running.view_window=new Km.Product.View.ProductView.Window();
				}
				if (Km.Product.View.Running.view_window.hidden){
					Km.Product.View.Running.view_window.show();
					Km.Product.View.Running.view_window.winTabs.hideTabStripItem(Km.Product.View.Running.view_window.winTabs.tabFix);
					this.updateViewProduct();
					this.tvpView.toggle(true);
					Km.Product.Config.View.IsShow=1;
				}else{
					this.hideProduct();
					Km.Product.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Product.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Product.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Product.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Product.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Product.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Product.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Product.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Product.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Product.View.Running.viewTabs);
					}
					break;
			}
			this.hideProduct();
			if (Km.Product.Config.View.IsShow==0){
				Km.Product.View.Running.viewTabs.enableCollapse();
				switch(Km.Product.Config.View.Direction){
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
				this.updateViewProduct();
				this.tvpView.toggle(true);
				Km.Product.Config.View.IsShow=1;
			}else{
				Km.Product.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏商品
		 */
		hideProduct : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Product.View.Running.view_window!=null){
				Km.Product.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前商品显示信息
		 */
		updateViewProduct : function() {

			if (Km.Product.View.Running.view_window!=null){
				Km.Product.View.Running.view_window.winTabs.tabProductDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Product.View.Running.viewTabs.tabProductDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建商品
		 */
		addProduct : function() {
			if (Km.Product.View.Running.edit_window==null){
				Km.Product.View.Running.edit_window=new Km.Product.View.EditWindow();
			}
			Km.Product.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Product.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Product.View.Running.edit_window.setTitle('新增上架商品');
			Km.Product.View.Running.edit_window.savetype=0;
			Km.Product.View.Running.edit_window.product_id.setValue("");
			switch (Km.Product.Config.OnlineEditor)
			{
				case 2:
					if (Km.Product.View.EditWindow.KindEditor_specification) Km.Product.View.EditWindow.KindEditor_specification.html("");
					if (Km.Product.View.EditWindow.KindEditor_intro) Km.Product.View.EditWindow.KindEditor_intro.html("");
					break
				case 3:
					break
				default:
					if (CKEDITOR.instances.specification) CKEDITOR.instances.specification.setData("");
					if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData("");
			}

			Km.Product.View.Running.edit_window.show();
			Km.Product.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑商品时先获得选中的商品信息
		 */
		updateProduct : function() {
			if (Km.Product.View.Running.edit_window==null){
				Km.Product.View.Running.edit_window=new Km.Product.View.EditWindow();
			}
			Km.Product.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Product.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Product.View.Running.edit_window.setTitle('商品上架');
			Km.Product.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Product.View.Running.edit_window.ptype_oid.setValue(Km.Product.View.Running.edit_window.ptype_id.getValue());
			Km.Product.View.Running.edit_window.savetype=1;
			switch (Km.Product.Config.OnlineEditor)
			{
				case 2:
					if (Km.Product.View.EditWindow.KindEditor_specification) Km.Product.View.EditWindow.KindEditor_specification.html(this.getSelectionModel().getSelected().data.specification);
					if (Km.Product.View.EditWindow.KindEditor_intro) Km.Product.View.EditWindow.KindEditor_intro.html(this.getSelectionModel().getSelected().data.intro);
					break
				case 3:
					if (xhEditor_specification)xhEditor_specification.setSource(this.getSelectionModel().getSelected().data.specification);
					if (xhEditor_intro)xhEditor_intro.setSource(this.getSelectionModel().getSelected().data.intro);
					break
				default:
					if (CKEDITOR.instances.specification) CKEDITOR.instances.specification.setData(this.getSelectionModel().getSelected().data.specification);
					if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(this.getSelectionModel().getSelected().data.intro);
			}
            Km.Product.View.Running.edit_window.image_largeUpload.setValue(Km.Product.View.Running.edit_window.image.getValue());
            Km.Product.View.Running.edit_window.brand_id.setValue(Km.Product.View.Running.edit_window.brand_id.getValue());
			Km.Product.View.Running.edit_window.show();
			Km.Product.View.Running.edit_window.maximize();
		},
		/**
		 * 删除商品
		 */
		deleteProduct : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的商品吗?', this.confirmDeleteProduct,this);
		},
		/**
		 * 确认删除商品
		 */
		confirmDeleteProduct : function(btn) {
			if (btn == 'yes') {
				var del_product_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_product_ids=del_product_ids+selectedRows[flag].data.product_id+",";
				}
				ExtServiceProduct.deleteByIds(del_product_ids);
				this.doSelectProduct();
				Ext.Msg.alert("提示", "删除成功！");
			}
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Product.View.Running.productGrid=new Km.Product.View.Grid();
			if (Km.Product.Config.View.IsFix==0){
				Km.Product.View.Running.productGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Product.View.Running.productGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Product.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Product.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前商品Grid对象
		 */
		productGrid:null,

		/**
		 * 显示商品信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Product.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Product.Init();
	/**
	 * 商品数据模型获取数据Direct调用
	 */
	Km.Product.Store.productStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceProduct.queryPageProductNup}
	});
	/**
	 * 商品页面布局
	 */
	Km.Product.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Product.View.Panel()]
	});
	Km.Product.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});
