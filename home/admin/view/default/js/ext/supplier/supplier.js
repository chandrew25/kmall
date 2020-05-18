Ext.namespace("Kmall.Admin.Supplier");
Km = Kmall.Admin.Supplier;
Km.Supplier={
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
			 * 显示供应商的视图相对供应商列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示供应商信息页(或者打开新窗口)
			 */
			IsFix:0
		},
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
		if (Km.Supplier.Cookie.get('View.Direction')){
			Km.Supplier.Config.View.Direction=Km.Supplier.Cookie.get('View.Direction');
		}
		if (Km.Supplier.Cookie.get('View.IsFix')!=null){
			Km.Supplier.Config.View.IsFix=Km.Supplier.Cookie.get('View.IsFix');
		}
		if (Ext.util.Cookies.get('OnlineEditor')!=null){
			Km.Supplier.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
		}
	}
};
/**
 * Model:数据模型
 */
Km.Supplier.Store = {
	/**
	 * 供应商
	 */
	supplierStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				{name: 'supplier_id',type: 'string'},
				{name: 'sp_name',type: 'string'},
				{name: 'comany_name',type: 'string'},
				{name: 'licence',type: 'string'},
				{name: 'tax_no',type: 'string'},
				{name: 'contactman',type: 'string'},
				{name: 'bank_account',type: 'string'},
				{name: 'bank_init',type: 'string'},
				{name: 'contactman',type: 'string'},
				{name: 'telphone',type: 'string'},
				{name: 'mobilephone',type: 'string'},
				{name: 'address',type: 'string'},
				{name: 'fax',type: 'string'},
				{name: 'memo',type: 'string'},
				{name: 'url',type: 'string'},
				{name: 'isOk',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					Ext.apply(options.params, Km.Supplier.View.Running.supplierGrid.filter);//保证分页也将查询条件带上
				}
			},
			/**
			 * 前台注册供应商未经过激活的以颜色标示出来 false-黄色：未激活 true-默认色：已激活
			 */
			load : function(store,records) {
				var girdcount=0;
				if (Km.Supplier.View.Running.supplierGrid){
					store.each(function(r){
					  if(r.data.isOk==false){
						Km.Supplier.View.Running.supplierGrid.getView().getRow(girdcount).style.backgroundColor='#FFF4A9';
					  }
					  girdcount=girdcount+1;
					});
				}
			}
		}
	}),
	/**
	 * 合同
	 */
	contractStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				  {name: 'contract_id',type: 'int'},
				  {name: 'contract_no',type: 'string'},
				  {name: 'sp_name',type: 'string'},
				  {name: 'contract_name',type: 'string'},
				  {name: 'supplier_id',type: 'int'},
				  {name: 'company',type: 'string'},
				  {name: 'contract_status',type: 'string'},
                  {name: 'contract_statusShow',type: 'string'},
				  {name: 'confirmTime',type: 'date',dateFormat:'Y-m-d H:i:s'},
				  {name: 'f_party',type: 'string'},
				  {name: 's_party',type: 'string'},
				  {name: 'operator',type: 'string'},
				  {name: 'amount',type: 'int'},
				  {name: 'terms',type: 'string'},
				  {name: 'effective_date',type: 'date',dateFormat:'Y-m-d H:i:s'},
				  {name: 'expire_date',type: 'date',dateFormat:'Y-m-d H:i:s'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		})
	}),
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
				  {name: 'warehouse_name',type: 'string'},
				  {name: 'contactman',type: 'string'},
				  {name: 'mobilephone',type: 'string'},
				  {name: 'isDefault',type: 'string'},
				  {name: 'address',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		})
	}),
	/**
	 * 商品入库
	 */
	productlogStorein:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				  {name: 'productlog_id',type: 'int'},
				  {name: 'fsp_id',type: 'int'},
				  {name: 'fsp_warehouse',type: 'string'},
				  {name: 'tsp_id',type: 'int'},
				  {name: 'tsp_warehouse',type: 'string'},
				  {name: 'goodsActionType',type: 'int'},
				  {name: 'product_id',type: 'int'},
				  {name: 'gname',type: 'string'},
				  {name: 'price',type: 'string'},
				  {name: 'num',type: 'int'},
				  {name: 'cmTime',type: 'date',dateFormat:'Y-m-d H:i:s'} //m1
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		})
	}),
	/**
	 * 商品出库
	 */
	productlogStoreout:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				  {name: 'productlog_id',type: 'int'},
				  {name: 'fsp_id',type: 'int'},
				  {name: 'fsp_warehouse',type: 'string'},
				  {name: 'tsp_id',type: 'int'},
				  {name: 'tsp_warehouse',type: 'string'},
				  {name: 'tsp_warehouse_name',type: 'string'},
				  {name: 'goodsActionType',type: 'string'},
				  {name: 'product_id',type: 'int'},
				  {name: 'gname',type: 'string'},
				  {name: 'price',type: 'string'},
				  {name: 'num',type: 'int'},
				  {name: 'cmTime',type: 'date',dateFormat:'Y-m-d H:i:s'} //m1
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		})
	}),
	/**
	 * 商品
	 */
	productStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				  {name: 'product_id',type: 'string'},
				  {name: 'product_code',type: 'string'},
				  {name: 'supplier_id',type: 'int'},
				  {name: 'ptype_id',type: 'int'},
				  {name: 'ptype_key',type: 'string'},
				  {name: 'ptype_name',type: 'string'},
				  {name: 'sp_name',type: 'string'},
				  {name: 'ptype_fullname',type: 'string'},
				  {name: 'product_name',type: 'string'},
				  {name: 'unit',type: 'string'},
				  {name: 'intro',type: 'string'},
				  {name: 'low_alarm',type: 'int'},
				  {name: 'in_price',type: 'float'},
				  {name: 'recommend_price',type: 'float'},
				  {name: 'good_price',type: 'float'},
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		})
	})
};
/**
 * View:供应商显示组件
 */
Km.Supplier.View={
	/**
	 * 编辑窗口：新建或者修改供应商
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
						switch (Km.Supplier.Config.OnlineEditor)
						{
							case 1:
								ckeditor_replace_memo();
								break
							case 2:
								Km.Supplier.View.EditWindow.KindEditor_memo = KindEditor.create('textarea[name="memo"]',{width:'98%',minHeith:'350px', filterMode:true});
								break
							case 3:
								pageInit_memo();
								break
							default:
								this.editForm.memo.setWidth("98%");
								pageInit_ue_memo();
						}
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
							{xtype: 'hidden',  name : 'supplier_id',ref:'../supplier_id'},
							{fieldLabel : '供货商名称',name : 'sp_name'},
							{fieldLabel : '联系人名称(<font color=red>*</font>)',name : 'contactman'},
							{fieldLabel : '公司名称',name : 'comany_name'},
							{fieldLabel : '三证合一代码',name : 'licence'},
							{fieldLabel : '税号',name : 'tax_no'},
							{fieldLabel : '联系人',name : 'contactman'},
							{fieldLabel : '银行账户',name : 'bank_account'},
							{fieldLabel : '开户银行',name : 'bank_init'},
							{fieldLabel : '电话',name : 'telphone'},
							{fieldLabel : '手机号码',name : 'mobilephone'},
							{fieldLabel : '地址',name : 'address',xtype : 'textarea',id:'address',ref:'address'},
							{fieldLabel : '传真',name : 'fax'},
							{fieldLabel : '备注',name : 'memo',xtype : 'textarea',id:'memo',ref:'memo'},
							{fieldLabel : '供应商网站',name : 'url',id:'url',ref:'url'}
						]
					})
				],
				buttons : [ {
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {
						switch (Km.Supplier.Config.OnlineEditor)
						{
							case 1:
								if (CKEDITOR.instances.memo)this.editForm.memo.setValue(CKEDITOR.instances.memo.getData());
								break
							case 2:
								if (Km.Supplier.View.EditWindow.KindEditor_memo)this.editForm.memo.setValue(Km.Supplier.View.EditWindow.KindEditor_memo.html());
								break
							case 3:
								if (xhEditor_memo)this.editForm.memo.setValue(xhEditor_memo.getSource());
								break
							default:
								if (ue_memo)this.editForm.memo.setValue(ue_memo.getContent());
						}
						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;
						if (this.savetype==0){
							this.editForm.api.submit=ExtServiceSupplier.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Supplier.View.Running.supplierGrid.doSelectSupplier();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceSupplier.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Supplier.View.Running.supplierGrid.bottomToolbar.doRefresh();
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
						this.editForm.form.loadRecord(Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected());
						switch (Km.Supplier.Config.OnlineEditor)
						{
							case 1:
								if (CKEDITOR.instances.memo)CKEDITOR.instances.memo.setData(Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected().data.memo);
								break
							case 2:
								if (Km.Supplier.View.EditWindow.KindEditor_memo)Km.Supplier.View.EditWindow.KindEditor_memo.html(Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected().data.memo);
								break
							case 3:
								if (xhEditor_memo)xhEditor_memo.setSource(Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected().data.memo);
								break
							default:
								if (ue_memo)ue_memo.setContent(Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected().data.memo);
						}
					}
				}]
			}, config);
			Km.Supplier.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示供应商详情
	 */
	SupplierView:{
		/**
		 * Tab页：容器包含显示与供应商所有相关的信息
		 */
		Tabs:Ext.extend(Ext.TabPanel,{
			constructor : function(config) {
				config = Ext.apply({
					region : 'south',
					collapseMode : 'mini',split : true,
					activeTab: 1, tabPosition:"bottom",resizeTabs : true,
					header:false,enableTabScroll : true,tabWidth:'auto', margins : '0 3 3 0',
					defaults : {
						autoScroll : true,
						layout:'fit'
					},
					listeners:{
						beforetabchange:function(tabs,newtab,currentTab){
							if (tabs.tabFix==newtab){
								if (Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择供应商！');
									return false;
								}
								Km.Supplier.Config.View.IsShow=1;
								Km.Supplier.View.Running.supplierGrid.showSupplier();
								Km.Supplier.View.Running.supplierGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Supplier.View.SupplierView.Tabs.superclass.constructor.call(this, config);
				Km.Supplier.View.SupplierView.Tabs.superclass.constructor.call(this, config);
				Km.Supplier.View.Running.contractGrid=new Km.Supplier.View.ContractView.Grid();
//				Km.Supplier.View.Running.warehouseGrid=new Km.Supplier.View.WarehouseView.Grid();
				Km.Supplier.View.Running.productGrid=new Km.Supplier.View.GoodsView.Grid();
				Km.Supplier.View.Running.productlogGrid=new Km.Supplier.View.ProductlogView.Grid();
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Supplier.Config.View.Direction==1)||(Km.Supplier.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabSupplierDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">',
						 '  <tr class="entry"><td class="head">供货商名称</td><td class="content">{sp_name}</td></tr>',
						 '  <tr class="entry"><td class="head">联系人名称</td><td class="content">{contactman}</td></tr>',
						 '	<tr class="entry"><td class="head">公司名称</td><td class="content">{comany_name}</td></tr>',
						 '	<tr class="entry"><td class="head">三证合一代码</td><td class="content">{licence}</td></tr>',
						 '	<tr class="entry"><td class="head">税号</td><td class="content">{tax_no}</td></tr>',
						 '	<tr class="entry"><td class="head">联系人</td><td class="content">{contactman}</td></tr>',
						 '	<tr class="entry"><td class="head">银行账户</td><td class="content">{bank_account}</td></tr>',
						 '	<tr class="entry"><td class="head">开户银行</td><td class="content">{bank_init}</td></tr>',
						 '  <tr class="entry"><td class="head">电话</td><td class="content">{telphone}</td></tr>',
						 '  <tr class="entry"><td class="head">手机号码</td><td class="content">{mobilephone}</td></tr>',
						 '  <tr class="entry"><td class="head">地址</td><td class="content">{address}</td></tr>',
						 '  <tr class="entry"><td class="head">传真</td><td class="content">{fax}</td></tr>',
						 '  <tr class="entry"><td class="head">备注</td><td class="content">{memo}</td></tr>',
						 '  <tr class="entry"><td class="head">供应商网站</td><td class="content">{url}</td></tr>',
						 '  <tr class="entry"><td class="head">是否已激活</td><td class="content"><tpl if="isOk == true">是</tpl><tpl if="isOk == false">否</tpl></td></tr>',
					 '</table>'
					 ]
					}
				);
				this.add(
					{title: '合同',iconCls:'tabs',tabWidth:150,
					 items:[Km.Supplier.View.Running.contractGrid]
					},
//					{title: '仓库',iconCls:'tabs',tabWidth:150,
//					 items:[Km.Supplier.View.Running.warehouseGrid]
//					},
					{title: '商品',iconCls:'tabs',tabWidth:150,
					 items:[Km.Supplier.View.Running.productGrid]
					},
					{title: '商品出入库记录',iconCls:'tabs',tabWidth:150,
					 items:[Km.Supplier.View.Running.productlogGrid]
					}
				);
			}
		}),
		/**
		 * 窗口:显示供应商信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看供应商",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Supplier.View.SupplierView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Supplier.Config.View.IsShow=0;
							Km.Supplier.View.Running.supplierGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Supplier.Config.View.IsShow=0;
							Km.Supplier.View.Running.supplierGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增供应商',scope:this,
						handler : function() {this.hide();Km.Supplier.View.Running.supplierGrid.addSupplier();}
					},{
						text: '修改供应商信息',scope:this,
						handler : function() {this.hide();Km.Supplier.View.Running.supplierGrid.updateSupplier();}
					}]
				}, config);
				Km.Supplier.View.SupplierView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 视图：合同列表
	 */
	ContractView:{
		/**
		 * 视图：合同列表
		 */
		Grid:Ext.extend(Ext.grid.GridPanel, {
			constructor : function(config) {
				config = Ext.apply({
					store : Km.Supplier.Store.contractStore,
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
						  {header : '合同号',dataIndex : 'contract_no'},
						  {header : '合同名称',dataIndex : 'contract_name'},
						  {header : '公司名',dataIndex : 'company'},
						  {header : '合同状态',dataIndex : 'contract_statusShow'},
						  {header : '合同签订时间',dataIndex : 'confirmTime',renderer:Ext.util.Format.dateRenderer('Y-m-d')},
						  {header : '合同甲方',dataIndex : 'f_party'},
						  {header : '合同乙方',dataIndex : 's_party'},
						  {header : '经办人',dataIndex : 'operator'},
						  {header : '签订合同的金额',dataIndex : 'amount'},
						  {header : '生效日期',dataIndex : 'effective_date',renderer:Ext.util.Format.dateRenderer('Y-m-d')},
						  {header : '到期日期',dataIndex : 'expire_date',renderer:Ext.util.Format.dateRenderer('Y-m-d')}
						]
					})
				}, config);
				Km.Supplier.View.ContractView.Grid.superclass.constructor.call(this, config);
			},
			/**
			 * 查询符合条件的合同订单
			 */
			doSelectContract : function() {
				if (Km.Supplier.View.Running.supplierGrid&&Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected()){
					var supplier_id = Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected().data.supplier_id;
					var condition = {'supplier_id':supplier_id};
					ExtServiceContract.queryPageContract(condition,function(provider, response) {
						if (response.result){
							if (response.result.data) {
								var result           = new Array();
								result['data']       =response.result.data;
								Km.Supplier.Store.contractStore.loadData(result);
							} else {
								Km.Supplier.Store.contractStore.removeAll();
								Ext.Msg.alert('提示', '无符合条件的合同订单！');
							}
						}
					});
				}
			}
		})
	},
	/**
	 * 视图：商品出入库
	 */
	ProductlogView:{
		/**
		 * 视图：商品出入库日志列表
		 */
		Grid:Ext.extend(Ext.Panel, {
			constructor : function(config) {
				config = Ext.apply({
					id:"gridInOut",
					baseCls:'x-plain',
					layout:{
						type:'hbox',
						align : 'stretch'
					},
					layoutConfig: {
					   padding:'10'
					},
					defaults:{
						margins:'5 5 5 0',
						frame:true},
					// applied to child components
					items:[new Km.Supplier.View.ProductlogView.GridIn({flex:1}),new Km.Supplier.View.ProductlogView.GridOut({flex:1})]
				}, config);
				Km.Supplier.View.ProductlogView.Grid.superclass.constructor.call(this, config);
			}
		}),
		/**
		 * 视图：商品入库
		 */
		GridIn:Ext.extend(Ext.grid.GridPanel, {
			constructor : function(config) {
				config = Ext.apply({
					store : Km.Supplier.Store.productlogStorein,ref:'gridin',
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
						  {header : '商品名称',dataIndex : 'gname'},
						  {header : '入库数量',dataIndex : 'num'},
              {header : '入库价',dataIndex : 'price'},
						  {header : '入库时间',dataIndex : 'cmTime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')}   //m2
						]
					})
				}, config);
				Km.Supplier.View.ProductlogView.GridIn.superclass.constructor.call(this, config);
			},
			/**
			 * 查询符合条件的出入库详情
			 */
			doSelectProductlog : function() {
				if (Km.Supplier.View.Running.supplierGrid&&Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected()){
					var supplier_id = Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected().data.supplier_id;
					var condition = {'goodsActionType':'in','tsp_id':supplier_id};
					ExtServiceProductlog.queryPageProductlog(condition,function(provider, response) {
						if (response.result){
							if (response.result.data) {
								var result           = new Array();
								result['data']       =response.result.data;
								Km.Supplier.Store.productlogStorein.loadData(result);
							} else {
								Km.Supplier.Store.productlogStorein.removeAll();
								Ext.Msg.alert('提示', '无符合条件的合同订单！');
							}
						}
					});
				}
			}
		}),


		/**
		 * 视图：商品出库
		 */
		GridOut:Ext.extend(Ext.grid.GridPanel, {
			constructor : function(config) {
				config = Ext.apply({
					store : Km.Supplier.Store.productlogStoreout,ref:'gridout',
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
						  {header : '商品名称',dataIndex : 'gname'},
						  {header : '出库数量',dataIndex : 'num'},
              {header : '出库价',dataIndex : 'price'},
						  {header : '出库时间',dataIndex : 'cmTime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')}   //m2
						]
					})
				}, config);
				Km.Supplier.View.ProductlogView.GridOut.superclass.constructor.call(this, config);
			},
			/**
			 * 查询符合条件的出入库详情
			 */
			doSelectProductlog : function() {
				if (Km.Supplier.View.Running.supplierGrid&&Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected()){
					var supplier_id = Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected().data.supplier_id;
					var condition = {'goodsActionType':'out','fsp_id':supplier_id};
					ExtServiceProductlog.queryPageProductlog(condition,function(provider, response) {
						if (response.result){
							if (response.result.data) {
								var result           = new Array();
								result['data']       =response.result.data;
								Km.Supplier.Store.productlogStoreout.loadData(result);
							} else {
								Km.Supplier.Store.productlogStoreout.removeAll();
								Ext.Msg.alert('提示', '无符合条件的合同订单！');
							}
						}
					});
				}
			}
		})
	},
	/**
	 * 视图：仓库列表
	 */
	WarehouseView:{
		/**
		 * 视图：仓库列表
		 */
		Grid:Ext.extend(Ext.grid.GridPanel, {
			constructor : function(config) {
				config = Ext.apply({
					store : Km.Supplier.Store.warehouseStore,
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
						  {header : '仓库名称',dataIndex : 'warehouse_name'},
						  {header : '联系人名称',dataIndex : 'contactman'},
						  {header : '联系电话',dataIndex : 'mobilephone'},
						  {header : '是否默认仓库',dataIndex : 'isDefault',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
						  {header : '仓库地址',dataIndex : 'address'}
						]
					})
				}, config);
				Km.Supplier.View.WarehouseView.Grid.superclass.constructor.call(this, config);
			},
			/**
			 * 查询符合条件的合同订单
			 */
			doSelectWarehouse : function() {
				if (Km.Supplier.View.Running.supplierGrid&&Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected()){
					var supplier_id = Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected().data.supplier_id;
					var condition = {'supplier_id':supplier_id};
					ExtServiceWarehouse.queryPageWarehouse(condition,function(provider, response) {
						if (response.result){
							if (response.result.data) {
								var result           = new Array();
								result['data']       =response.result.data;
								Km.Supplier.Store.warehouseStore.loadData(result);
							} else {
								Km.Supplier.Store.warehouseStore.removeAll();
								Ext.Msg.alert('提示', '无符合条件的合同订单！');
							}
						}
					});
				}
			}
		})
	},
	/**
	 * 视图：商品列表
	 */
	GoodsView:{
		/**
		 * 视图：商品列表
		 */
		Grid:Ext.extend(Ext.grid.GridPanel, {
			constructor : function(config) {
				config = Ext.apply({
					store : Km.Supplier.Store.productStore,
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
						  {header : '商品标识',dataIndex : 'product_code'},
                          {header : '商品名称',dataIndex : 'product_name',width:240},
						  {header : '商品类型',dataIndex : 'ptype_fullname',width:250},
						  {header : '量词',dataIndex : 'unit'},
						  {header : '最低库存警报',dataIndex : 'low_alarm'},
						  {header : '单价',dataIndex : 'in_price'},
						  {header : '批发价格',dataIndex : 'good_price'}
						]
					})
				}, config);
				Km.Supplier.View.GoodsView.Grid.superclass.constructor.call(this, config);
			},
			/**
			 * 查询符合条件的合同订单
			 */
			doSelectGoods : function() {
				if (Km.Supplier.View.Running.supplierGrid&&Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected()){
					var supplier_id = Km.Supplier.View.Running.supplierGrid.getSelectionModel().getSelected().data.supplier_id;
					var condition = {'supplier_id':supplier_id};
					ExtServiceWarehouseGoods.queryPageGoods(condition,function(provider, response) {
						if (response.result){
							if (response.result.data) {
								var result           = new Array();
								result['data']       =response.result.data;
								Km.Supplier.Store.productStore.loadData(result);
							} else {
								Km.Supplier.Store.productStore.removeAll();
								Ext.Msg.alert('提示', '无符合条件的合同订单！');
							}
						}
					});
				}
			}
		})
	},
	/**
	 * 窗口：批量上传供应商
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量供应商上传',
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
							emptyText: '请上传供应商Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadSupplier',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Supplier.View.Running.supplierGrid.doSelectSupplier();
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
			Km.Supplier.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：供应商列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Supplier.Store.supplierStore,
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
						{header : '供货商名称',dataIndex : 'sp_name'},
						{header : '已激活',dataIndex : 'isOk',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
						{header : '联系人名称',dataIndex : 'contactman'},
						{header : '手机号码',dataIndex : 'mobilephone'},
						{header : '供应商网站',dataIndex : 'url'} ,
						{header : '电话',dataIndex : 'telphone'},
						{header : '地址',dataIndex : 'address'},
						{header : '传真',dataIndex : 'fax'}
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
								'供货商名称　',{ref: '../ssp_name'},'&nbsp;&nbsp;',
								'电话　',{ref: '../stelphone'},'&nbsp;&nbsp;',
								'地址　',{ref: '../saddress'},'&nbsp;&nbsp;',
								'是否已激活　',{ref: '../sisOk',xtype : 'combo',mode : 'local',
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
										this.doSelectSupplier();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.ssp_name.setValue("");
										this.topToolbar.stelphone.setValue("");
										this.topToolbar.saddress.setValue("");
										this.topToolbar.sisOk.setValue("");
										this.filter={};
										this.doSelectSupplier();
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
									text : '添加供应商',iconCls : 'icon-add',
									handler : function() {
										this.addSupplier();
									}
								},'-',{
									text : '修改供应商',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateSupplier();
									}
								},'-',{
									text : '删除供应商', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteSupplier();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import',
									handler : function() {
										this.importSupplier();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportSupplier();
									}
								},'-',{
									xtype:'tbsplit',text: '查看供应商', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showSupplier()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideSupplier();Km.Supplier.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Supplier.Cookie.set('View.IsFix',Km.Supplier.Config.View.IsFix);}}
										]}
								},'-', {
									ref:'../../checkSupplier',
									text : '激活',disabled : true,
									iconCls : 'page_attach',
									handler : function() {
										this.checkSuppliers();
									}
								}, new Ext.Toolbar.Fill(), '黄色：未激活'
							]}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Supplier.Config.PageSize,
					store: Km.Supplier.Store.supplierStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
					  change:function(thisbar,pagedata){
						if (Km.Supplier.Viewport){
							if (Km.Supplier.Config.View.IsShow==1){
								Km.Supplier.View.IsSelectView=1;
							}
							this.ownerCt.hideSupplier();
							Km.Supplier.Config.View.IsShow=0;
						}
					  }
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Supplier.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Supplier.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Supplier.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectSupplier();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Supplier.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Supplier.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectSupplier();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示供应商列表
			this.doSelectSupplier();
			Km.Supplier.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的供应商信息Tab页
			Km.Supplier.View.Running.viewTabs=new Km.Supplier.View.SupplierView.Tabs();
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
					this.grid.checkSupplier.setDisabled(sm.getCount()< 1);
				},
				rowselect: function(sm, rowIndex, record) {
					this.grid.updateViewSupplier();
					if (sm.getCount() != 1){
						this.grid.hideSupplier();
						Km.Supplier.Config.View.IsShow=0;
					}else{
						if (Km.Supplier.View.IsSelectView==1){
							Km.Supplier.View.IsSelectView=0;
							this.grid.showSupplier();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Supplier.Config.View.IsShow==1){
							Km.Supplier.View.IsSelectView=1;
						}
						this.grid.hideSupplier();
						Km.Supplier.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Supplier.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showSupplier();
				this.tvpView.toggle(true);
			}else{
				this.hideSupplier();
				Km.Supplier.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Supplier.Config.View.IsFix=1;
			}else{
			   Km.Supplier.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Supplier.Config.View.IsShow=0;
				return ;
			}
			if (Km.Supplier.Config.View.IsShow==1){
			   this.hideSupplier();
			   Km.Supplier.Config.View.IsShow=0;
			}
			this.showSupplier();
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
		 * 查询符合条件的供应商
		 */
		doSelectSupplier : function() {
			if (this.topToolbar){
				var ssp_name = this.topToolbar.ssp_name.getValue();
				var stelphone = this.topToolbar.stelphone.getValue();
				var saddress = this.topToolbar.saddress.getValue();
				var sisOk = this.topToolbar.sisOk.getValue();
				this.filter       ={'sp_name':ssp_name,'telphone':stelphone,'address':saddress,'isOk':sisOk};
			}
			var condition = {'start':0,'limit':Km.Supplier.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceSupplier.queryPageSupplier(condition,function(provider, response) {
				if (response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Supplier.Store.supplierStore.loadData(result);
				} else {
					Km.Supplier.Store.supplierStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的供应商！');
				}
			});
		},
		/**
		 * 显示供应商视图
		 * 显示供应商的视图相对供应商列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Supplier.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Supplier.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Supplier.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Supplier.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Supplier.View.Running.viewTabs);
					break;
			}
			Km.Supplier.Cookie.set('View.Direction',Km.Supplier.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Supplier.Config.View.IsFix==0)&&(Km.Supplier.Config.View.IsShow==1)){
					this.showSupplier();
				}
				Km.Supplier.Config.View.IsFix=1;
				Km.Supplier.View.Running.supplierGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Supplier.Config.View.IsShow=0;
				this.showSupplier();
			}
		},
		/**
		 * 显示供应商
		 */
		showSupplier : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择供应商！');
				Km.Supplier.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Supplier.Config.View.IsFix==0){
				if (Km.Supplier.View.Running.view_window==null){
					Km.Supplier.View.Running.view_window=new Km.Supplier.View.SupplierView.Window();
				}
				if (Km.Supplier.View.Running.view_window.hidden){
					Km.Supplier.View.Running.view_window.show();
					Km.Supplier.View.Running.view_window.winTabs.hideTabStripItem(Km.Supplier.View.Running.view_window.winTabs.tabFix);
					this.updateViewSupplier();
					this.tvpView.toggle(true);
					Km.Supplier.Config.View.IsShow=1;
				}else{
					this.hideSupplier();
					Km.Supplier.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Supplier.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Supplier.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Supplier.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Supplier.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Supplier.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Supplier.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Supplier.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Supplier.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Supplier.View.Running.viewTabs);
					}
					break;
			}
			this.hideSupplier();
			if (Km.Supplier.Config.View.IsShow==0){
				Km.Supplier.View.Running.viewTabs.enableCollapse();
				switch(Km.Supplier.Config.View.Direction){
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
				this.updateViewSupplier();
				this.tvpView.toggle(true);
				Km.Supplier.Config.View.IsShow=1;
			}else{
				Km.Supplier.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏供应商
		 */
		hideSupplier : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Supplier.View.Running.view_window!=null){
				Km.Supplier.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前供应商显示信息
		 */
		updateViewSupplier : function() {
			Km.Supplier.View.Running.contractGrid.doSelectContract();
//            Km.Supplier.View.Running.warehouseGrid.doSelectWarehouse();
			Km.Supplier.View.Running.productGrid.doSelectGoods();
			Km.Supplier.View.Running.productlogGrid.gridin.doSelectProductlog();
			Km.Supplier.View.Running.productlogGrid.gridout.doSelectProductlog();
			if (Km.Supplier.View.Running.view_window!=null){
				Km.Supplier.View.Running.view_window.winTabs.tabSupplierDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Supplier.View.Running.viewTabs.tabSupplierDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建供应商
		 */
		addSupplier : function() {
			if (Km.Supplier.View.Running.edit_window==null){
				Km.Supplier.View.Running.edit_window=new Km.Supplier.View.EditWindow();
			}
			Km.Supplier.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Supplier.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Supplier.View.Running.edit_window.setTitle('添加供应商');
			Km.Supplier.View.Running.edit_window.savetype=0;
			Km.Supplier.View.Running.edit_window.supplier_id.setValue("");
			switch (Km.Supplier.Config.OnlineEditor)
			{
				case 1:
					if (CKEDITOR.instances.memo)CKEDITOR.instances.memo.setData("");
					break
				case 2:
					if (Km.Supplier.View.EditWindow.KindEditor_memo)Km.Supplier.View.EditWindow.KindEditor_memo.html("");
					break
				case 3:
					break
				default:
					if (ue_memo)ue_memo.setContent("");
			}

			Km.Supplier.View.Running.edit_window.show();
			Km.Supplier.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑供应商时先获得选中的供应商信息
		 */
		updateSupplier : function() {
			if (Km.Supplier.View.Running.edit_window==null){
				Km.Supplier.View.Running.edit_window=new Km.Supplier.View.EditWindow();
			}
			Km.Supplier.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Supplier.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Supplier.View.Running.edit_window.setTitle('修改供应商');
			Km.Supplier.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Supplier.View.Running.edit_window.savetype=1;
			var data = this.getSelectionModel().getSelected().data;
			switch (Km.Supplier.Config.OnlineEditor)
			{
				case 1:
					if (CKEDITOR.instances.memo)CKEDITOR.instances.memo.setData(data.memo);
					break
				case 2:
					if (Km.Supplier.View.EditWindow.KindEditor_memo)Km.Supplier.View.EditWindow.KindEditor_memo.html(data.memo);
					break
				case 3:
					if (xhEditor_memo)xhEditor_memo.setSource(data.memo);
					break
				default:
					if (ue_memo)ue_memo.ready(function(){ue_memo.setContent(data.memo);});
			}
			Km.Supplier.View.Running.edit_window.show();
			Km.Supplier.View.Running.edit_window.maximize();
		},
		/**
		 * 删除供应商
		 */
		deleteSupplier : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的供应商吗?', this.confirmDeleteSupplier,this);
		},
		/**
		 * 确认删除供应商
		 */
		confirmDeleteSupplier : function(btn) {
			if (btn == 'yes') {
				var del_supplier_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_supplier_ids=del_supplier_ids+selectedRows[flag].data.supplier_id+",";
				}
				ExtServiceSupplier.deleteByIds(del_supplier_ids);
				this.doSelectSupplier();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出供应商
		 */
		exportSupplier : function() {
			ExtServiceSupplier.exportSupplier(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入供应商
		 */
		importSupplier : function() {
			if (Km.Supplier.View.current_uploadWindow==null){
				Km.Supplier.View.current_uploadWindow=new Km.Supplier.View.UploadWindow();
			}
			Km.Supplier.View.current_uploadWindow.show();
		},
		/**
		 * 激活供应商
		 */
		checkSuppliers : function() {
			var check_sp_ids="";
			var selectedRows = this.getSelectionModel().getSelections();
			for ( var int = 0; int < selectedRows.length; int++) {
				check_sp_ids=check_sp_ids+selectedRows[int].data.supplier_id+",";
			}
			ExtServiceSupplier.checkSupplier(check_sp_ids, function(result, e) {
				Ext.MessageBox.alert("提示", "激活成功！");
				Km.Supplier.View.Running.supplierGrid.doSelectSupplier();
			},this);
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Supplier.View.Running.supplierGrid=new Km.Supplier.View.Grid();
			if (Km.Supplier.Config.View.IsFix==0){
				Km.Supplier.View.Running.supplierGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Supplier.View.Running.supplierGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Supplier.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Supplier.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前供应商Grid对象
		 */
		supplierGrid:null,
		/**
		 * 当前合同Grid对象
		 */
		contractGrid:null,
		/**
		 * 当前仓库Grid对象
		 */
//		warehouseGrid:null,
		/**
		 * 当前商品Grid对象
		 */
		productGrid:null,
		/**
		 * 显示供应商信息及关联信息列表的Tab页
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
		* 产品日志
		*/
		productlogGrid:null
	}
};
/**
 * Controller:主程序
 */
Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.state.Manager.setProvider(Km.Supplier.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Supplier.Init();
	/**
	 * 供应商数据模型获取数据Direct调用
	 */
	Km.Supplier.Store.supplierStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceSupplier.queryPageSupplier}
	});
	/**
	 * 供应商页面布局
	 */
	Km.Supplier.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Supplier.View.Panel()]
	});
	Km.Supplier.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});
