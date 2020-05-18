Ext.namespace("Kmall.Admin.AddGoods");
Km = Kmall.Admin.AddGoods;
Km.AddGoods={
	/**
	 * 全局配置
	 */
	Config:{
		/**
		 *分页:每页显示记录数
		 */
		PageSize:9,
		/**
		 * 操作者
		 */
		Operator:'',
		/**
		 * 在线编辑器类型。
		 * 1:CkEditor,2:KindEditor,3:xhEditor,4:UEditor
		 * 配合Action的变量配置$online_editor
		 */
		OnlineEditor:4
	},
	/**
	 * Cookie设置
	 */
	Cookie:new Ext.state.CookieProvider(),
	/**
	 * 初始化
	 */
	Init:function(){
		if (Ext.util.Cookies.get('operator')!=null){
			Km.AddGoods.Config.Operator=Ext.util.Cookies.get('operator');
		}
		if (Ext.util.Cookies.get('roletype')!=null){
			Km.AddGoods.Config.Roletype=Ext.util.Cookies.get('roletype');
		}
		if (Ext.util.Cookies.get('OnlineEditor')!=null){
			Km.AddGoods.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
		}
		if (Ext.util.Cookies.get('roleid')!=null){
			Km.AddGoods.Config.Roleid=Ext.util.Cookies.get('roleid');
		}
	}
};

/**
 * Model:数据模型
 */
Km.AddGoods.Store = {
	/**
	 * 商品
	 */
	goodsStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				{name: 'goods_id',type: 'int'},
				{name: 'goods_name',type: 'string'},
				{name: 'goods_code',type: 'string'},
				{name: 'supplier_id',type: 'int'},
				{name: 'sp_name',type: 'string'},
				{name: 'warehouse_id_default',type: 'string'},
				{name: 'warehouse_name_default',type: 'string'},
				{name: 'ptype_id',type: 'int'},
				{name: 'ptype_name',type: 'string'},
				{name: 'ptype_key',type: 'string'},
				{name: 'ptype_fullname',type: 'string'},
				{name: 'unit',type: 'string'},
				{name: 'markettable',type: 'string'},
				{name: 'stock',type: 'int'},
				{name: 'intro',type: 'string'},
				{name: 'goodsnum',type: 'int'},
				{name: 'residenum',type: 'int'},
				{name: 'buynum',type: 'int'},
				{name: 'low_alarm',type: 'int'},
				{name: 'in_price',type: 'float'},
				{name: 'recommend_price',type: 'float'},
				{name: 'good_price',type: 'float'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (Km.AddGoods.View.Running.goodsGrid){
						Ext.apply(options.params, Km.AddGoods.View.Running.goodsGrid.filter);//保证分页也将查询条件带上
					}
				}
			}
		}
	}),
	/**
	 * 选择商品
	 */
	hadGoodsStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/goods.php'
		}),
		reader: new Ext.data.JsonReader({
			root: 'goods',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'goods_id'
		}, [
			{name: 'goods_id', mapping: 'goods_id'},
			{name: 'goods_name', mapping: 'goods_name'},
			{name: 'goods_code', mapping: 'goods_code'},
			{name: 'sales_price', mapping: 'sales_price'},
			{name: 'stock', mapping: 'stock'}
		]),
		listeners : {
			beforeload : function(store, options) {
			}
		}
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
			id: 'unit'
		}, [{name: 'quantifier_name', mapping: 'quantifier_name'}])
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
			{name: 'sp_name', mapping: 'sp_name'},
			{name: 'username', mapping: 'username'}
		])
	})
	/**
	 * 仓库
	warehouseStore:new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/warehouse.php'
		}),
		reader: new Ext.data.JsonReader({
			root: 'warehouses',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'warehouse_id'
		}, [
			{name: 'warehouse_id', mapping:'warehouse_id'},
			{name: 'warehouse_name', mapping: 'warehouse_name'}
		]),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (Ext.getCmp("supplier_id_has").getValue()){
						this.baseParams.supplier_id = Ext.getCmp("supplier_id_has").getValue();
					}else{
						this.baseParams.supplier_id = Ext.getCmp("supplier_id_new").getValue();
					}
				}
			}
		}
	})
	 */
};

/**
 * View:商品入库显示组件
 */
Km.AddGoods.View={
	/**
	 * 商品分类导航树
	 */
	TreeGoodsType:Ext.extend(Ext.tree.TreePanel,{
		constructor : function(config){
			config = Ext.apply({
				xtype: 'treepanel',//collapsible:true,
				useArrows: true,autoScroll: true,height: 290,border:false,
				animate: true,enableDD: true,containerScroll: true,
				dataUrl:'home/admin/src/httpdata/ptypeTree.php',
				cValue:'',cParent_id:'',cLevel:'',
				root: {
					id: 'source',nodeType: 'async',text: '全部类别',draggable: false
				},
				listeners:{
					'click':function(node){
						Km.AddGoods.View.Running.treeGoodsType.cValue=node.text;
						Km.AddGoods.View.Running.treeGoodsType.cParent_id=node.attributes.id;
						Km.AddGoods.View.Running.treeGoodsType.cLevel=node.attributes.level;
					}
				}
			}, config);
			Km.AddGoods.View.TreeGoodsType.superclass.constructor.call(this, config);
		},
		listeners: {
			'render': function(tp){
				tp.getSelectionModel().on('selectionchange', function(tree, node){
					if (node.attributes.id!='source'){
						Km.AddGoods.View.Running.goodsGrid.filter={'ptype_id':node.attributes.id};
					}else{
						Km.AddGoods.View.Running.goodsGrid.filter={};
					}
					Km.AddGoods.View.Running.goodsGrid.doSelectGoods();
				});
			}
		}
	}),
	/**
	 * 商品列表
	 */
	GoodsGrid:Ext.extend(Ext.grid.GridPanel,{
		constructor : function(config){
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				xtype: 'grid',region : 'center',store : Km.AddGoods.Store.goodsStore,
				stripeRows : true,flex:1,headerAsText : false,
				defaults:{
					sortable : true,width : 80,autoScroll : true
				},
				sm : this.sm,
				columns : [
					{header : '商品名称',dataIndex : 'goods_name',width : 280},
					{header : '商品条码',dataIndex : 'goods_code'},
					{header : '供应商',dataIndex : 'sp_name',width : 140},
					{header : '商品类型',dataIndex : 'ptype_fullname',width : 200},
					{header : '均价',dataIndex : 'in_price'},
					{header : '库存',dataIndex : 'stock'},
					{header : '单位',dataIndex : 'unit'},
					{header : '最低库存警报',dataIndex : 'low_alarm'}
				],
				bbar: new Ext.PagingToolbar({
				  pageSize: Km.AddGoods.Config.PageSize,
				  store: Km.AddGoods.Store.goodsStore,scope:this,autoShow:true,displayInfo: true,
				  displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。  ',emptyMsg: "无显示数据。  ",
				  items: [
					{xtype:'label', text: '每页显示'},
					{xtype:'numberfield',value:Km.AddGoods.Config.PageSize,minValue:1,width:35,
					  style:'text-align:center',allowBlank: false,
					  listeners:
					  {
						change:function(Field, newValue, oldValue){
						  var num = parseInt(newValue);
						  if (isNaN(num) || !num || num<1)
						  {
							num = Km.AddGoods.Config.PageSize;
							Field.setValue(num);
						  }
						  this.ownerCt.pageSize= num;
						  Km.AddGoods.Config.PageSize = num;
						  this.ownerCt.ownerCt.doSelectGoods();
						},
						specialKey :function(field,e){
						  if (e.getKey() == Ext.EventObject.ENTER){
							var num = parseInt(field.getValue());
							if (isNaN(num) || !num || num<1)
							{
							  num = Km.AddGoods.Config.PageSize;
							}
							this.ownerCt.pageSize= num;
							Km.AddGoods.Config.PageSize = num;
							this.ownerCt.ownerCt.doSelectGoods();
						  }
						}
					  }
					},
					{xtype:'label', text: '个'}
				  ]
				})
			}, config);
			Km.AddGoods.View.GoodsGrid.superclass.constructor.call(this, config);
		},
		/**
		 * 行选择器
		 */
		sm : new Ext.grid.CheckboxSelectionModel({
		  //handleMouseDown : Ext.emptyFn,
		  listeners : {
			rowselect: function(sm, rowIndex, record) {
			  var goodsdata=this.grid.getSelectionModel().getSelected().data;
			  this.grid.ownerCt.ownerCt.updateGoodsForm.goods_id.setValue(goodsdata.goods_id);
			  this.grid.ownerCt.ownerCt.updateGoodsForm.goods_name.setValue(goodsdata.goods_name);
			  this.grid.ownerCt.ownerCt.updateGoodsForm.goods_code.setValue(goodsdata.goods_code);
			  this.grid.ownerCt.ownerCt.updateGoodsForm.supplier_id.setValue(goodsdata.supplier_id);
			  Ext.getCmp("sales_price_has").setValue(goodsdata.in_price);
			}
		  }
		}),
		/**
		 * 查询符合条件的商品
		 */
		doSelectGoods : function() {
			var condition = {'start':0,'limit':Km.AddGoods.Config.PageSize};//,'query_warehouse_house': 'true'
			Ext.apply(condition,this.filter);
			ExtServiceWarehouseGoods.queryPageGoods(condition,function(provider, response) {
				if (response.result.data) {
					var result		   = new Array();
					result['data']	   =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.AddGoods.Store.goodsStore.loadData(result);
				} else {
					Km.AddGoods.Store.goodsStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的商品！');
				}
			});
		}
	}),
	/**
	 * Tab页面：已有商品入库
	 */
	TabUpdateGoods:Ext.extend(Ext.Panel,{
		constructor : function(config){
			Km.AddGoods.View.Running.treeGoodsType=new Km.AddGoods.View.TreeGoodsType();
			Km.AddGoods.View.Running.goodsGrid=new Km.AddGoods.View.GoodsGrid({flex:8});
			config = Ext.apply({
				ref:'updateGoodsPanel',title:'已有货品入库',xtype:"panel",layout:'vbox',
				items: [{
					 ref:'updateGoodsForm',xtype: 'form',layout:'form',border :false,
					 defaultType: 'textfield',defaults: {anchor:'98%'},api : {},width:'80%',
					 items: [
					 {
						xtype: 'compositefield',
						items: [
						  {xtype: 'hidden',name : 'goods_id',id:'goods_id_has',ref:'../goods_id'},
						  {xtype: 'hidden',name : 'supplier_id',id:'supplier_id_has',ref:'../supplier_id'},
						  {
							 flex:1,fieldLabel : '选择商品(<font color=red>*</font>)',xtype: 'combo',name : 'goods_name',ref:'../goods_name',id : 'goods_name_has',
							 store:Km.AddGoods.Store.hadGoodsStore,emptyText: '请选择商品',itemSelector: 'div.search-item',
							 loadingText: '查询中...', pageSize:Km.AddGoods.Config.PageSize,displayField:'goods_name',// 显示文本
							 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
							 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
							 tpl:new Ext.XTemplate(
								'<tpl for="."><div class="search-item">',
									'<h3>{goods_name}</h3>',
								'</div></tpl>'
							 ),
							 listeners:{
								 'beforequery': function(event){
									 delete event.combo.lastQuery;
								 }
							 },
							 onSelect:function(record,index){
								 if(this.fireEvent('beforeselect', this, record, index) !== false){
									Ext.getCmp("goods_id_has").setValue(record.data.goods_id);
									Ext.getCmp("goods_name_has").setValue(record.data.goods_name);
									Ext.getCmp("goods_code_has").setValue(record.data.goods_code);
									Ext.getCmp("sales_price_has").setValue(record.data.sales_price);
									this.collapse();
								 }
							 }
						  },
						  {xtype:'displayfield',value:'商品条码:'},
						  {
							 flex:1,xtype: 'combo',name : 'goods_code',ref:'../goods_code',id : 'goods_code_has',
							 store:Km.AddGoods.Store.hadGoodsStore,emptyText: '请选择商品条码',itemSelector: 'div.search-item',
							 loadingText: '查询中...', pageSize:Km.AddGoods.Config.PageSize,displayField:'goods_code',
							 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
							 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
							 tpl:new Ext.XTemplate(
								'<tpl for="."><div class="search-item">',
									'<h3>{goods_code}</h3>',
								'</div></tpl>'
							 ),
							 listeners:{
								 'beforequery': function(event){
									 delete event.combo.lastQuery;
								 }
							 },
							 onSelect:function(record,index){
								 if(this.fireEvent('beforeselect', this, record, index) !== false){
									Ext.getCmp("goods_id_has").setValue(record.data.goods_id);
									Ext.getCmp("goods_name_has").setValue(record.data.goods_name);
									Ext.getCmp("goods_code_has").setValue(record.data.goods_code);
									Ext.getCmp("sales_price_has").setValue(record.data.sales_price);
									this.collapse();
								 }
							 }
						  }
						]
					  },
					  {
						xtype: 'compositefield',
						items: [
						  {fieldLabel: '数量',name: 'num',xtype:'numberfield',id:'old_num',flex: 1},
						  {xtype:'displayfield',value:'商品单价:'},
						  {name: 'sales_price',xtype:'textfield',id:"sales_price_has",flex: 1}
						]
					  },
					  {xtype: 'hidden',name : 'operate_type',value:'update'},
					  {fieldLabel: '经办人',name: 'operator',value:Km.AddGoods.Config.Operator,id:"operator_name_pre"}
					 ]
					},
					{
					 xtype:"panel",width:'100%',layout : {type:'hbox',pack:'start',align: 'stretch'},height: 310,
					 items:[
						{xtype:"panel",region:"west",width:180,autoScroll: true,buttonAlign : 'center',
						  items:[Km.AddGoods.View.Running.treeGoodsType],
						  buttons:[{
							text: '新增类别',name: 'category',width:160,height:32,
							handler : function() {
								if (Km.AddGoods.View.Running.createGoodsTypeWindow==null){
									Km.AddGoods.View.Running.createGoodsTypeWindow=new Km.AddGoods.View.CreateGoodsTypeWindow();
								}
								Ext.getCmp("ptype_create").setValue(Km.AddGoods.View.Running.treeGoodsType.cValue);
								Ext.getCmp("parent_id").setValue(Km.AddGoods.View.Running.treeGoodsType.cParent_id);
								Ext.getCmp("level").setValue(Km.AddGoods.View.Running.treeGoodsType.cLevel);
								if (Km.AddGoods.View.Running.createGoodsTypeWindow==null){
									Km.AddGoods.View.Running.createGoodsTypeWindow=new Km.AddGoods.View.CreateGoodsTypeWindow();
								}
								Km.AddGoods.View.Running.createGoodsTypeWindow.show();
							}
						  }]
						},
						Km.AddGoods.View.Running.goodsGrid
					 ]
				}]
			}, config);
			Km.AddGoods.View.TabUpdateGoods.superclass.constructor.call(this, config);
			if (Km.AddGoods.Config.Roletype=='5'){
				Km.AddGoods.View.Running.goodsGrid.getColumnModel().setHidden(5,true);
			}
		}
	}),
	/**
	 * Tab页面：新商品入库
	 */
	TabNewGoods:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config){
			config = Ext.apply({
				ref:'newGoodsForm',title:'新商品入库',xtype: 'form',layout:'form',api : {},defaults: {anchor:'80%'},
				items: [
					{xtype: 'hidden',name : 'operate_type',value:'new'},
					{
						xtype: 'compositefield',
						items: [
							{fieldLabel: '商品名称(<font color=red>*</font>)',xtype:'textfield',allowBlank : false,name: 'goods_name',flex:2},
							{xtype:'displayfield',value:'商品条码(<font color=red>*</font>):'},{name: 'goods_code',xtype:'textfield',id:'goods_code',allowBlank : false,flex:2}]
					},
					{xtype: 'hidden',name : 'level',ref:'ptype_level',value:''},
					{xtype: 'hidden',name : 'ptype_id',ref:'ptype_id'},
					{xtype:'combotree',ref:'ptype_combotree',name: 'ptype_name',fieldLabel: '商品类型',width:570,emptyText: '请选择商品类型',
					 tree: new Ext.tree.TreePanel({
						root: {nodeType: 'async',text: '全部类别',draggable: false,id: '0'},
						rootVisible: true,border: false,dataUrl: 'home/admin/src/httpdata/ptypeTree.php',pLevel:'',gPtype_id:'',
						listeners: {
							beforeload: function(n) { if (n) { this.getLoader().baseParams.id = n.attributes.id; } },
							click:function(n){
								this.pLevel=n.attributes.level;
								this.gPtype_id=n.attributes.id;
							}
						}
					 })
					},
					{xtype: 'hidden',name : 'supplier_id',id:'supplier_id_new'},
					{
						fieldLabel : '供应商',xtype: 'combo',name : 'sp_name',id : 'sp_name_new',
						store:Km.AddGoods.Store.supplierStore,emptyText: '请选择供应商',itemSelector: 'div.search-item',
						loadingText: '查询中...',width: 330, pageSize:Km.AddGoods.Config.PageSize,
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
							Ext.getCmp("supplier_id_new").setValue(record.data.supplier_id);
							Ext.getCmp("sp_name_new").setValue(record.data.sp_name);
							this.collapse();
						 }
						}
					  },
					  {
						xtype: 'compositefield',
						items: [
							{fieldLabel: '入库数量',name: 'num',xtype:'numberfield',id:'new_num',flex: 1},
							{xtype:'displayfield',value:'最低库存报警数量:'},
							{xtype:'numberfield',name: 'low_alarm',flex: 1},
							{xtype:'displayfield',value:'单位:'},
							{
								 xtype: 'combo',name : 'unit',id : 'unit_new',flex: 2,
								 store:Km.AddGoods.Store.quantifierStore,emptyText: '请选择单位',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 330, pageSize:15,
								 displayField:'quantifier_name',//显示文本
								 mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
								 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
								 tpl:new Ext.XTemplate(
									'<tpl for="."><div class="search-item">',
										'<h3>{quantifier_name}</h3>',
									'</div></tpl>'
								 ),
								 onSelect:function(record,index){
									 if(this.fireEvent('beforeselect', this, record, index) !== false){
										Ext.getCmp("unit_new").setValue(record.data.quantifier_name);
										this.collapse();
									 }
								 }
							 }]
					  },
					{
						xtype: 'compositefield',
						items: [
							{fieldLabel: '商品价格',xtype:'numberfield',name: 'sales_price',flex: 2},
							{xtype:'displayfield',value:'经办人:'},
							{name: 'operator',xtype:'textfield',value:Km.AddGoods.Config.Operator,flex: 2,id:'operator_name'}]
					},
					{fieldLabel: '商品备注',xtype : 'textarea',name: 'intro',id:'intro',ref:'intro'}
				]
			}, config);
			Km.AddGoods.View.TabNewGoods.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 商品入库管理
	 */
	MainPanel:Ext.extend(Ext.Panel,{
		constructor : function(config){
			Km.AddGoods.View.Running.tabUpdateGoods=new Km.AddGoods.View.TabUpdateGoods();
			Km.AddGoods.View.Running.tabNewGoods=new Km.AddGoods.View.TabNewGoods();
			config = Ext.apply({
				ref:'editForm',labelAlign: 'left',title: '商品入库',header:false,buttonAlign:'center',
				bodyStyle:'padding:5px;',border:false,height: 490,//layout:'fit',
				items: [{
					ref:'agtabs',xtype:'tabpanel',scope:this,plain:true,activeTab:0,height:440,deferredRender: false,
					defaults:{bodyStyle:'padding:8px;'},
					listeners:{
						beforetabchange:function(tabpanel,newtab,currentTab){
							Km.AddGoods.View.Running.currentTab=newtab;
							if (this.tabImport==newtab){
							   Km.AddGoods.View.Running.currentTab=currentTab;
							   this.ownerCt.importGoods();
							   return false;
							}
						}
					},
					items:[
						Km.AddGoods.View.Running.tabUpdateGoods,
						Km.AddGoods.View.Running.tabNewGoods,
						{title:'批量导入',iconCls : 'icon-import',ref:'tabImport'}
					]
				}],
				buttons: [
					{text: '确认添加',iconCls : 'icon-add',scope:this,
					 handler : function() {
						this.addGoods();
					 }},
					{text: '重新填写',ref:'../resetBtn',scope:this,
						handler : function() {
							if (Km.AddGoods.View.Running.currentTab==this.agtabs.newGoodsForm){
								this.agtabs.newGoodsForm.form.reset();
								switch (Km.AddGoods.Config.OnlineEditor)
								{
									case 1:
										if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData("");
										break
									case 2:
										if (Km.AddGoods.View.KindEditor_intro) Km.Goods.View.EditWindow.KindEditor_intro.html("");
										break
									case 3:
										if (xhEditor_intro) xhEditor_intro.setSource("");
										break
									default:
										if (ue_intro) ue_intro.setContent("");
								}
							}else if (Km.AddGoods.View.Running.currentTab==this.agtabs.updateGoodsPanel){
								this.agtabs.updateGoodsPanel.updateGoodsForm.form.reset();
							}
						}
					}
				]
			}, config);
			Km.AddGoods.View.MainPanel.superclass.constructor.call(this, config);
			Km.AddGoods.View.Running.treeGoodsType.getRootNode().expand();
		},
		/**
		 * 新建商品
		 */
		addGoods : function() {
			var editForm=null;
			if (Km.AddGoods.View.Running.currentTab==this.agtabs.newGoodsForm){
				if(Ext.getCmp("goods_code").getValue() == "" || Ext.getCmp("goods_code").getValue() == null){
					Ext.Msg.alert("提示", "请输入商品条码！");
					return;
				}
				if(Ext.getCmp("operator_name").getValue() == "" || Ext.getCmp("operator_name").getValue() == null)
				{
					Ext.Msg.alert("提示", "请填写经办人名称！");
					return;
				}
				if(Ext.getCmp("new_num").getValue() == "" || Ext.getCmp("new_num").getValue() == null)
				{
					Ext.Msg.alert("提示", "请填写数量！");
					return;
				}
				editForm=this.agtabs.newGoodsForm;
				switch (Km.AddGoods.Config.OnlineEditor)
				{
					case 1:
						if (CKEDITOR.instances.intro) editForm.intro.setValue(CKEDITOR.instances.intro.getData());
						break
					case 2:
						if (Km.AddGoods.View.KindEditor_intro)editForm.intro.setValue(Km.AddGoods.View.EditWindow.KindEditor_intro.html());
						break
					case 3:
						if (xhEditor_intro)editForm.intro.setValue(xhEditor_intro.getSource());
						break
					default:
						if (ue_intro) editForm.intro.setValue(ue_intro.getContent());
				}
				this.agtabs.newGoodsForm.ptype_level.setValue(this.agtabs.newGoodsForm.ptype_combotree.tree.pLevel);
				this.agtabs.newGoodsForm.ptype_id.setValue(this.agtabs.newGoodsForm.ptype_combotree.tree.gPtype_id);
			}else if (Km.AddGoods.View.Running.currentTab==this.agtabs.updateGoodsPanel){
				if(Ext.getCmp("goods_code_has").getValue() == "" || Ext.getCmp("goods_code_has").getValue() == null){
					Ext.Msg.alert("提示", "请选择一个商品！");
					return;
				}
				if(Ext.getCmp("old_num").getValue() == "" || Ext.getCmp("old_num").getValue() == null)
				{
					Ext.Msg.alert("提示", "请填写数量！");
					return;
				}
				if(Ext.getCmp("operator_name_pre").getValue() == "" || Ext.getCmp("operator_name_pre").getValue() == null)
				{
					Ext.Msg.alert("提示", "请填写经办人名称！");
					return;
				}
				editForm=this.agtabs.updateGoodsPanel.updateGoodsForm;
			}
			if (!editForm.getForm().isValid()) {
				return;
			}
			editForm.api.submit=ExtServiceWarehouseGoods.goodsInWarehouse;
			editForm.getForm().submit({
				success : function(form, action) {
					Ext.Msg.alert("提示", "商品入库成功！");
					Km.AddGoods.View.Running.goodsGrid.store.reload();
					form.reset();
					switch (Km.AddGoods.Config.OnlineEditor)
					{
						case 1:
							if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData("");
							break
						case 2:
							if (Km.AddGoods.View.KindEditor_intro) Km.Goods.View.EditWindow.KindEditor_intro.html("");
							break
						case 3:
							if (xhEditor_intro) xhEditor_intro.setSource("");
							break
						default:
							if (ue_intro) ue_intro.setContent("");

					}
				},
				failure : function(form, action) {
					if (action.result.msg){
						Ext.Msg.alert('提示', action.result.msg);
					}else{
						Ext.Msg.alert('提示', '商品入库失败');
					}
				}
			});
		},
		/**
		 * 导入商品
		 */
		importGoods : function() {
			if (Km.AddGoods.View.current_uploadWindow==null){
				Km.AddGoods.View.current_uploadWindow=new Km.AddGoods.View.UploadWindow();
			}
			Km.AddGoods.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 创建商品类别表单
	 */
	CreateGoodsTypeForm:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config){
			config = Ext.apply({
				labelWidth : 100,width : 465,height : 300,bodyStYle : 'padding:5px 5px 0',labelAlign : "center",align :"center",
				api : {
					submit : ExtServicePtype.addPtype// 表单数据提交，config.php中要加'formHandler'=>true
				},
				defaults : {xtype : 'textfield',width : 300,allowBlank : false},
				items : [
					new Ext.form.ComboBoxTree({
						id:"ptype_create",value:'全部类别',fieldLabel: '所属分类',
						tree: new Ext.tree.TreePanel({
							root: {
								nodeType: 'async',text: '全部类别',draggable: false,id: '0'
							},
							rootVisible: true,border: false,
							dataUrl: 'home/admin/src/httpdata/ptypeTree.php',
							listeners: {
								beforeload: function(n) {
									  if(n){ this.getLoader().baseParams.id =n.attributes.id;}
								},
								click:function(n){
									  Ext.getCmp("parent_id").setValue(n.attributes.id);
									  Ext.getCmp("level").setValue(n.attributes.level);
								}
							},
							handler: function () {
								console.log(tree.getLoader());
								tree.getLoader().load(root);
							}
						  })
					  }),
					  {fieldLabel : '类别名称',name : 'name'},
					  {xtype : 'hidden',name : 'parent_id',value:'0',id : 'parent_id'},
					  {xtype : 'hidden',name : 'level',value:'0',id : 'level'}
				  ]
			}, config);
			Km.AddGoods.View.CreateGoodsTypeForm.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 创建商品类别窗口
	 */
	CreateGoodsTypeWindow:Ext.extend(Ext.Window,{
		constructor : function(config){
			Km.AddGoods.View.Running.createGoodsTypeForm=new Km.AddGoods.View.CreateGoodsTypeForm();
			config = Ext.apply({
				id:'cgtw',closeAction : "hide",title : '添加商品分类',
				width : 450,height : 120,minWidth : 400,minHeight : 100,
				plain : true,buttonAlign : 'center',
				items : [ Km.AddGoods.View.Running.createGoodsTypeForm ],
				buttons : [
					{text : "保 存",
					 handler : function() {
						Km.AddGoods.View.Running.createGoodsTypeForm.getForm().submit({
							success : function(form, action) {// 表单提交成功后,调用的函数.参数分为两个,一个是提交的表单对象,另一个是PHP返回的参数值对象
								Ext.MessageBox.alert("提示",action.result.msg);
								Km.AddGoods.View.Running.createGoodsTypeForm.getForm().reset();
								Km.AddGoods.View.Running.createGoodsTypeWindow.hide();
								Km.AddGoods.View.Running.treeGoodsType.root.reload();
							},
							failure : function(form, action) {
								Ext.Msg.alert('提示', action.result.msg);
							}
						});
					 }
					},
					{text : "取 消",
					 handler : function() {
						Km.AddGoods.View.Running.createGoodsTypeWindow.hide();
					}}]
			}, config);
			Km.AddGoods.View.CreateGoodsTypeWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 窗口：批量上传商品
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量商品上传',width : 400,height : 110,minWidth : 300,minHeight : 100,
				layout : 'fit',plain : true,bodyStYle : 'padding:5px;',buttonAlign : 'center',closeAction : "hide",
				items : [
					new Ext.form.FormPanel({
						ref:'uploadForm',fileUpload: true,
						width:500,labelWidth: 50,autoHeight: true,baseCls: 'x-plain',
						frame:true,bodyStyle: 'padding: 10px 10px 10px 10px;',
						defaults: {
							anchor: '95%',allowBlank: false,msgTarget: 'side'
						},
						items : [{
							xtype : 'fileuploadfield',
							fieldLabel : '文 件',name : 'upload_file',ref:'upload_file',
							emptyText: '请上传商品Excel文件',buttonText: '',
							accept:'application/vnd.ms-excel',
							buttonCfg: {iconCls: 'upload-icon'}
						}]
					})
				],
				buttons : [{
						text : '上 传',
						scope:this,
						handler : function() {
							uploadWindow		   =this;
							validationExpression   =/([\u4E00-\u9FA5]|\w)+(.xlsx|.XLSX|.xls|.XLS)$/;/**允许中文名*/
							var isValidExcelFormat = new RegExp(validationExpression);
							var result			 = isValidExcelFormat.test(this.uploadForm.upload_file.getValue());
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
									url : 'index.php?go=admin.upload.uploadGoods',
									success : function(form, action) {
											Ext.Msg.alert('成功', '上传成功');
											uploadWindow.hide();
											uploadWindow.uploadForm.upload_file.setValue('');
											Km.AddGoods.View.Running.goodsGrid.doSelectGoods();
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
			Km.AddGoods.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前商品列表
		 */
		goodsGrid:null,
		/**
		 * 当前商品分类导航树
		 */
		treeGoodsType:null,
		/**
		 * 当前Tab页面：新商品入库
		 */
		tabNewGoods:null,
		/**
		 * 当前Tab页面：已有商品入库
		 */
		tabUpdateGoods:null,
		/**
		 * 当前商品入库整个页面(全屏)
		 */
		mainPanel:null,
		/**
		 * 创建商品类别表单
		 */
		createGoodsTypeForm:null,
		/**
		 * 当前创建商品类别窗口
		 */
		createGoodsTypeWindow:null,
		/**
		 * 用户当前选择的Tab
		 */
		currentTab:null
	}
};

/**
 * Controller:主程序
 */
Ext.onReady(function()
{
	Ext.QuickTips.init();
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.AddGoods.Init();
	Ext.getBody().setStyle('margin','5px');
	/**
	 * 商品数据模型获取数据Direct调用
	 */
	Km.AddGoods.Store.goodsStore.proxy=new Ext.data.DirectProxy({
		  api: {read:ExtServiceWarehouseGoods.queryPageGoods}
	});
	Km.AddGoods.Store.goodsStore.load();
	new Km.AddGoods.View.MainPanel({renderTo:Ext.getBody()});
	switch (Km.AddGoods.Config.OnlineEditor)
	{
		case 1:
			ckeditor_replace_intro();
			break
		case 2:
			Km.AddGoods.View.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'78%',minHeith:'350px', filterMode:true});
			break
		case 3:
			pageInit_intro();
			break
		default:
			Km.AddGoods.View.Running.tabNewGoods.intro.setWidth("78%");
			pageInit_ue_intro();
	}
	setTimeout(function() {
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove : true
		});
	}, 250);
});
