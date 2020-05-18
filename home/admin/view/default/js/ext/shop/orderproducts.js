Ext.namespace("Kmall.Admin.Orderproducts");
Km = Kmall.Admin.Orderproducts;
Km.Orderproducts={
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
			 * 显示订购商品的视图相对订购商品列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示订购商品信息页(或者打开新窗口)
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
		if (Km.Orderproducts.Cookie.get('View.Direction')){
			Km.Orderproducts.Config.View.Direction=Km.Orderproducts.Cookie.get('View.Direction');
		}
		if (Km.Orderproducts.Cookie.get('View.IsFix')!=null){
			Km.Orderproducts.Config.View.IsFix=Km.Orderproducts.Cookie.get('View.IsFix');
		}
		if (Ext.util.Cookies.get('OnlineEditor')!=null){
			Km.Orderproducts.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
		}
	}
};
/**
 * Model:数据模型
 */
Km.Orderproducts.Store = {
	/**
	 * 订购商品
	 */
	orderproductsStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				  {name: 'orderproducts_id',type: 'int'},
				  {name: 'member_id',type: 'string'},
				  {name: 'username',type: 'string'},
				  {name: 'order_id',type: 'int'},
				  {name: 'order_no',type: 'string'},
				  {name: 'product_id',type: 'string'},
				  {name: 'product_name',type: 'string'},
				  {name: 'url',type: 'string'},
				  {name: 'amount',type: 'float'},
				  {name: 'price',type: 'float'},
				  {name: 'nums',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					Ext.apply(options.params, Km.Orderproducts.View.Running.orderproductsGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	}),
	/**
	 * 易乐的会员
	 */
	memberStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/member.php'
		  }),
		reader: new Ext.data.JsonReader({
			root: 'members',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'member_id'
		  }, [
			  {name: 'member_id', mapping: 'member_id'},
			  {name: 'username', mapping: 'username'}
		])
	}),
	/**
	 * 订单
	 */
	orderStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/order.php'
		  }),
		reader: new Ext.data.JsonReader({
			root: 'orders',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'order_id'
		  }, [
			  {name: 'order_id', mapping: 'order_id'},
			  {name: 'order_no', mapping: 'order_no'}
		])
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
 * View:订购商品显示组件
 */
Km.Orderproducts.View={
	/**
	 * 编辑窗口：新建或者修改订购商品
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
						switch (Km.Orderproducts.Config.OnlineEditor)
						{
							case 2:
								Km.Orderproducts.View.EditWindow.KindEditor_url = KindEditor.create('textarea[name="url"]',{width:'98%',minHeith:'350px', filterMode:true});
								break
							case 3:
								pageInit_url();
								break
							default:
								ckeditor_replace_url();
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
							  {xtype: 'hidden',  name : 'orderproducts_id',ref:'../orderproducts_id'},
							  {xtype: 'hidden',name : 'member_id',id:'member_id'},
							  {
								 fieldLabel : '会员',xtype: 'combo',name : 'username',id : 'username',
								 store:Km.Orderproducts.Store.memberStore,emptyText: '请选择会员',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Orderproducts.Config.PageSize,
								 displayField:'username',// 显示文本
								 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
								 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
								 tpl:new Ext.XTemplate(
											'<tpl for="."><div class="search-item">',
												'<h3>{username}</h3>',
											'</div></tpl>'
								 ),
								 onSelect:function(record,index){
									 if(this.fireEvent('beforeselect', this, record, index) !== false){
										Ext.getCmp("member_id").setValue(record.data.member_id);
										Ext.getCmp("username").setValue(record.data.username);
										this.collapse();
									   }
								   }
							  },
							  {xtype: 'hidden',name : 'order_id',id:'order_id'},
							  {
								 fieldLabel : '订单',xtype: 'combo',name : 'order_no',id : 'order_no',
								 store:Km.Orderproducts.Store.orderStore,emptyText: '请选择订单',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Orderproducts.Config.PageSize,
								 displayField:'order_no',// 显示文本
								 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
								 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
								 tpl:new Ext.XTemplate(
											'<tpl for="."><div class="search-item">',
												'<h3>{order_no}</h3>',
											'</div></tpl>'
								 ),
								 onSelect:function(record,index){
									 if(this.fireEvent('beforeselect', this, record, index) !== false){
										Ext.getCmp("order_id").setValue(record.data.order_id);
										Ext.getCmp("order_no").setValue(record.data.order_no);
										this.collapse();
									   }
								   }
							  },
							  {xtype: 'hidden',name : 'product_id',id:'product_id'},
							  {
								 fieldLabel : '商品名称',xtype: 'combo',name : 'product_name',id : 'product_name',
								 store:Km.Orderproducts.Store.productStore,emptyText: '请选择商品名称',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Orderproducts.Config.PageSize,
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
							  {fieldLabel : '订购商品的链接',name : 'url',xtype : 'textarea',id:'url',ref:'url'},
							  {fieldLabel : '总价',name : 'amount',xtype : 'numberfield'},
							  {fieldLabel : '单价',name : 'price',xtype : 'numberfield'},
							  {fieldLabel : '数量',name : 'nums'}
						]
					})
				],
				buttons : [ {
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {
						switch (Km.Orderproducts.Config.OnlineEditor)
						{
							case 2:
								if (Km.Orderproducts.View.EditWindow.KindEditor_url)this.editForm.url.setValue(Km.Orderproducts.View.EditWindow.KindEditor_url.html());
								break
							case 3:
								if (xhEditor_url)this.editForm.url.setValue(xhEditor_url.getSource());
								break
							default:
								if (CKEDITOR.instances.url) this.editForm.url.setValue(CKEDITOR.instances.url.getData());
						}

						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;
						if (this.savetype==0){
							this.editForm.api.submit=ExtServiceOrderproducts.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Orderproducts.View.Running.orderproductsGrid.doSelectOrderproducts();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceOrderproducts.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Orderproducts.View.Running.orderproductsGrid.bottomToolbar.doRefresh();
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
						this.editForm.form.loadRecord(Km.Orderproducts.View.Running.orderproductsGrid.getSelectionModel().getSelected());
						switch (Km.Orderproducts.Config.OnlineEditor)
						{
							case 2:
								if (Km.Orderproducts.View.EditWindow.KindEditor_url) Km.Orderproducts.View.EditWindow.KindEditor_url.html(Km.Orderproducts.View.Running.orderproductsGrid.getSelectionModel().getSelected().data.url);
								break
							case 3:
								break
							default:
								if (CKEDITOR.instances.url) CKEDITOR.instances.url.setData(Km.Orderproducts.View.Running.orderproductsGrid.getSelectionModel().getSelected().data.url);
						}

					}
				}]
			}, config);
			Km.Orderproducts.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示订购商品详情
	 */
	OrderproductsView:{
		/**
		 * Tab页：容器包含显示与订购商品所有相关的信息
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
								if (Km.Orderproducts.View.Running.orderproductsGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择订购商品！');
									return false;
								}
								Km.Orderproducts.Config.View.IsShow=1;
								Km.Orderproducts.View.Running.orderproductsGrid.showOrderproducts();
								Km.Orderproducts.View.Running.orderproductsGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Orderproducts.View.OrderproductsView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Orderproducts.Config.View.Direction==1)||(Km.Orderproducts.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabOrderproductsDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">',
						 '<tr class="entry"><td class="head">会员</td><td class="content">{username}</td></tr>',
						 '<tr class="entry"><td class="head">订单</td><td class="content">{order_no}</td></tr>',
						 '<tr class="entry"><td class="head">商品名称</td><td class="content">{product_name}</td></tr>',
						 '<tr class="entry"><td class="head">订购商品的链接</td><td class="content">{url}</td></tr>',
						 '<tr class="entry"><td class="head">总价</td><td class="content">{amount}</td></tr>',
						 '<tr class="entry"><td class="head">单价</td><td class="content">{price}</td></tr>',
						 '<tr class="entry"><td class="head">数量</td><td class="content">{nums}</td></tr>',
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
		 * 窗口:显示订购商品信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看订购商品",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Orderproducts.View.OrderproductsView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Orderproducts.Config.View.IsShow=0;
							Km.Orderproducts.View.Running.orderproductsGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Orderproducts.Config.View.IsShow=0;
							Km.Orderproducts.View.Running.orderproductsGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Orderproducts.View.Running.orderproductsGrid.addOrderproducts();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Orderproducts.View.Running.orderproductsGrid.updateOrderproducts();}
					}]
				}, config);
				Km.Orderproducts.View.OrderproductsView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传订购商品
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量订购商品上传',
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
							emptyText: '请上传订购商品Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadOrderproducts',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Orderproducts.View.Running.orderproductsGrid.doSelectOrderproducts();
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
			Km.Orderproducts.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：订购商品列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Orderproducts.Store.orderproductsStore,
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
						  {header : '会员',dataIndex : 'username'},
						  {header : '订单',dataIndex : 'order_no'},
						  {header : '商品名称',dataIndex : 'product_name'},
						  {header : '订购商品的链接',dataIndex : 'url'},
						  {header : '总价',dataIndex : 'amount'},
						  {header : '单价',dataIndex : 'price'},
						  {header : '数量',dataIndex : 'nums'}
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
							enableOverflow: true,width : 100,
							defaults : {
							   xtype : 'textfield'
							},
							items : [
								'会员 ','&nbsp;&nbsp;',{ref: '../omember_id',xtype:'hidden',name : 'member_id',id:'omember_id'},
								{
									 xtype: 'combo',name : 'username',id : 'ousername',
									 store:Km.Orderproducts.Store.memberStore,emptyText: '请选择会员',itemSelector: 'div.search-item',
									 loadingText: '查询中...',width:280,pageSize:Km.Orderproducts.Config.PageSize,
									 displayField:'username',// 显示文本
									 mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
									 forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
									 tpl:new Ext.XTemplate(
												'<tpl for="."><div class="search-item">',
													'<h3>{username}</h3>',
												'</div></tpl>'
									 ),
									 onSelect:function(record,index){
										 if(this.fireEvent('beforeselect', this, record, index) !== false){
											Ext.getCmp("omember_id").setValue(record.data.member_id);
											Ext.getCmp("ousername").setValue(record.data.username);
											this.collapse();
										 }
									 }
								},'&nbsp;&nbsp;',
								'订单 ','&nbsp;&nbsp;',{ref: '../oorder_id',xtype:'hidden',name : 'order_id',id:'oorder_id'},
								{
									 xtype: 'combo',name : 'order_no',id : 'oorder_no',
									 store:Km.Orderproducts.Store.orderStore,emptyText: '请选择订单',itemSelector: 'div.search-item',
									 loadingText: '查询中...',width:280,pageSize:Km.Orderproducts.Config.PageSize,
									 displayField:'order_no',// 显示文本
									 mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
									 forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
									 tpl:new Ext.XTemplate(
												'<tpl for="."><div class="search-item">',
													'<h3>{order_no}</h3>',
												'</div></tpl>'
									 ),
									 onSelect:function(record,index){
										 if(this.fireEvent('beforeselect', this, record, index) !== false){
											Ext.getCmp("oorder_id").setValue(record.data.order_id);
											Ext.getCmp("oorder_no").setValue(record.data.order_no);
											this.collapse();
										 }
									 }
								},'&nbsp;&nbsp;',
								'商品名称 ','&nbsp;&nbsp;',{ref: '../oproduct_name'},'&nbsp;&nbsp;',
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectOrderproducts();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.omember_id.setValue("");
										this.topToolbar.oorder_id.setValue("");
										this.topToolbar.oproduct_name.setValue("");
										this.filter={};
										this.doSelectOrderproducts();
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
									text : '添加订购商品',iconCls : 'icon-add',
									handler : function() {
										this.addOrderproducts();
									}
								},'-',{
									text : '修改订购商品',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateOrderproducts();
									}
								},'-',{
									text : '删除订购商品', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteOrderproducts();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import',
									handler : function() {
										this.importOrderproducts();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportOrderproducts();
									}
								},'-',{
									xtype:'tbsplit',text: '查看订购商品', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showOrderproducts()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideOrderproducts();Km.Orderproducts.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Orderproducts.Cookie.set('View.IsFix',Km.Orderproducts.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Orderproducts.Config.PageSize,
					store: Km.Orderproducts.Store.orderproductsStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Orderproducts.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Orderproducts.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Orderproducts.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectOrderproducts();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Orderproducts.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Orderproducts.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectOrderproducts();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示订购商品列表
			this.doSelectOrderproducts();
			Km.Orderproducts.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的订购商品信息Tab页
			Km.Orderproducts.View.Running.viewTabs=new Km.Orderproducts.View.OrderproductsView.Tabs();
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
					this.grid.updateViewOrderproducts();
					if (sm.getCount() != 1){
						this.grid.hideOrderproducts();
						Km.Orderproducts.Config.View.IsShow=0;
					}else{
						if (Km.Orderproducts.View.IsSelectView==1){
							Km.Orderproducts.View.IsSelectView=0;
							this.grid.showOrderproducts();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Orderproducts.Config.View.IsShow==1){
							Km.Orderproducts.View.IsSelectView=1;
						}
						this.grid.hideOrderproducts();
						Km.Orderproducts.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Orderproducts.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showOrderproducts();
				this.tvpView.toggle(true);
			}else{
				this.hideOrderproducts();
				Km.Orderproducts.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Orderproducts.Config.View.IsFix=1;
			}else{
			   Km.Orderproducts.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Orderproducts.Config.View.IsShow=0;
				return ;
			}
			if (Km.Orderproducts.Config.View.IsShow==1){
			   this.hideOrderproducts();
			   Km.Orderproducts.Config.View.IsShow=0;
			}
			this.showOrderproducts();
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
		 * 查询符合条件的订购商品
		 */
		doSelectOrderproducts : function() {
			if (this.topToolbar){
				var omember_id = this.topToolbar.omember_id.getValue();
				var oorder_id = this.topToolbar.oorder_id.getValue();
				var oproduct_name = this.topToolbar.oproduct_name.getValue();
				this.filter       ={'member_id':omember_id,'order_id':oorder_id,'product_name':oproduct_name};
			}
			var condition = {'start':0,'limit':Km.Orderproducts.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceOrderproducts.queryPageOrderproducts(condition,function(provider, response) {
				if (response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Orderproducts.Store.orderproductsStore.loadData(result);
				} else {
					Km.Orderproducts.Store.orderproductsStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的订购商品！');
				}
			});
		},
		/**
		 * 显示订购商品视图
		 * 显示订购商品的视图相对订购商品列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Orderproducts.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Orderproducts.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Orderproducts.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Orderproducts.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Orderproducts.View.Running.viewTabs);
					break;
			}
			Km.Orderproducts.Cookie.set('View.Direction',Km.Orderproducts.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Orderproducts.Config.View.IsFix==0)&&(Km.Orderproducts.Config.View.IsShow==1)){
					this.showOrderproducts();
				}
				Km.Orderproducts.Config.View.IsFix=1;
				Km.Orderproducts.View.Running.orderproductsGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Orderproducts.Config.View.IsShow=0;
				this.showOrderproducts();
			}
		},
		/**
		 * 显示订购商品
		 */
		showOrderproducts : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择订购商品！');
				Km.Orderproducts.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Orderproducts.Config.View.IsFix==0){
				if (Km.Orderproducts.View.Running.view_window==null){
					Km.Orderproducts.View.Running.view_window=new Km.Orderproducts.View.OrderproductsView.Window();
				}
				if (Km.Orderproducts.View.Running.view_window.hidden){
					Km.Orderproducts.View.Running.view_window.show();
					Km.Orderproducts.View.Running.view_window.winTabs.hideTabStripItem(Km.Orderproducts.View.Running.view_window.winTabs.tabFix);
					this.updateViewOrderproducts();
					this.tvpView.toggle(true);
					Km.Orderproducts.Config.View.IsShow=1;
				}else{
					this.hideOrderproducts();
					Km.Orderproducts.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Orderproducts.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Orderproducts.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Orderproducts.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Orderproducts.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Orderproducts.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Orderproducts.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Orderproducts.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Orderproducts.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Orderproducts.View.Running.viewTabs);
					}
					break;
			}
			this.hideOrderproducts();
			if (Km.Orderproducts.Config.View.IsShow==0){
				Km.Orderproducts.View.Running.viewTabs.enableCollapse();
				switch(Km.Orderproducts.Config.View.Direction){
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
				this.updateViewOrderproducts();
				this.tvpView.toggle(true);
				Km.Orderproducts.Config.View.IsShow=1;
			}else{
				Km.Orderproducts.Config.View.IsShow=0;
			}

			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏订购商品
		 */
		hideOrderproducts : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Orderproducts.View.Running.view_window!=null){
				Km.Orderproducts.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前订购商品显示信息
		 */
		updateViewOrderproducts : function() {
			if (Km.Orderproducts.View.Running.view_window!=null){
				Km.Orderproducts.View.Running.view_window.winTabs.tabOrderproductsDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Orderproducts.View.Running.viewTabs.tabOrderproductsDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建订购商品
		 */
		addOrderproducts : function() {
			if (Km.Orderproducts.View.Running.edit_window==null){
				Km.Orderproducts.View.Running.edit_window=new Km.Orderproducts.View.EditWindow();
			}
			Km.Orderproducts.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Orderproducts.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Orderproducts.View.Running.edit_window.setTitle('添加订购商品');
			Km.Orderproducts.View.Running.edit_window.savetype=0;
			Km.Orderproducts.View.Running.edit_window.orderproducts_id.setValue("");
			switch (Km.Orderproducts.Config.OnlineEditor)
			{
				case 2:
					if (Km.Orderproducts.View.EditWindow.KindEditor_url) Km.Orderproducts.View.EditWindow.KindEditor_url.html("");
					break
				case 3:
					break
				default:
					if (CKEDITOR.instances.url) CKEDITOR.instances.url.setData("");
			}

			Km.Orderproducts.View.Running.edit_window.show();
			Km.Orderproducts.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑订购商品时先获得选中的订购商品信息
		 */
		updateOrderproducts : function() {
			if (Km.Orderproducts.View.Running.edit_window==null){
				Km.Orderproducts.View.Running.edit_window=new Km.Orderproducts.View.EditWindow();
			}
			Km.Orderproducts.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Orderproducts.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Orderproducts.View.Running.edit_window.setTitle('修改订购商品');
			Km.Orderproducts.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Orderproducts.View.Running.edit_window.savetype=1;
			switch (Km.Orderproducts.Config.OnlineEditor)
			{
				case 2:
					if (Km.Orderproducts.View.EditWindow.KindEditor_url) Km.Orderproducts.View.EditWindow.KindEditor_url.html(this.getSelectionModel().getSelected().data.url);
					break
				case 3:
					if (xhEditor_url)xhEditor_url.setSource(this.getSelectionModel().getSelected().data.url);
					break
				default:
					if (CKEDITOR.instances.url) CKEDITOR.instances.url.setData(this.getSelectionModel().getSelected().data.url);
			}

			Km.Orderproducts.View.Running.edit_window.show();
			Km.Orderproducts.View.Running.edit_window.maximize();
		},
		/**
		 * 删除订购商品
		 */
		deleteOrderproducts : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的订购商品吗?', this.confirmDeleteOrderproducts,this);
		},
		/**
		 * 确认删除订购商品
		 */
		confirmDeleteOrderproducts : function(btn) {
			if (btn == 'yes') {
				var del_orderproducts_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_orderproducts_ids=del_orderproducts_ids+selectedRows[flag].data.orderproducts_id+",";
				}
				ExtServiceOrderproducts.deleteByIds(del_orderproducts_ids);
				this.doSelectOrderproducts();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出订购商品
		 */
		exportOrderproducts : function() {
			ExtServiceOrderproducts.exportOrderproducts(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入订购商品
		 */
		importOrderproducts : function() {
			if (Km.Orderproducts.View.current_uploadWindow==null){
				Km.Orderproducts.View.current_uploadWindow=new Km.Orderproducts.View.UploadWindow();
			}
			Km.Orderproducts.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Orderproducts.View.Running.orderproductsGrid=new Km.Orderproducts.View.Grid();
			if (Km.Orderproducts.Config.View.IsFix==0){
				Km.Orderproducts.View.Running.orderproductsGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Orderproducts.View.Running.orderproductsGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Orderproducts.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Orderproducts.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前订购商品Grid对象
		 */
		orderproductsGrid:null,

		/**
		 * 显示订购商品信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Orderproducts.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Orderproducts.Init();
	/**
	 * 订购商品数据模型获取数据Direct调用
	 */
	Km.Orderproducts.Store.orderproductsStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceOrderproducts.queryPageOrderproducts}
	});
	/**
	 * 订购商品页面布局
	 */
	Km.Orderproducts.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Orderproducts.View.Panel()]
	});
	Km.Orderproducts.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});