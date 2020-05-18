Ext.namespace("Kmall.Admin.Delivery");
Km = Kmall.Admin.Delivery;
Km.Delivery={
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
			 * 显示物流的视图相对物流列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示物流信息页(或者打开新窗口)
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
		if (Km.Delivery.Cookie.get('View.Direction')){
			Km.Delivery.Config.View.Direction=Km.Delivery.Cookie.get('View.Direction');
		}
		if (Km.Delivery.Cookie.get('View.IsFix')!=null){
			Km.Delivery.Config.View.IsFix=Km.Delivery.Cookie.get('View.IsFix');
		}
	}
}; 
/**
 * Model:数据模型   
 */
Km.Delivery.Store = { 
	/**
	 * 物流
	 */ 
	deliveryStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',  
			root: 'data',remoteSort: true,                
			fields : [
				  {name: 'delivery_id',type: 'int'},
				  {name: 'delivery_no',type: 'string'},
				  {name: 'order_id',type: 'int'},
				  {name: 'order_no',type: 'string'},
				  {name: 'member_id',type: 'int'},
				  {name: 'username',type: 'string'},  
				  {name: 'status',type: 'string'},
				  {name: 'type',type: 'string'},
				  {name: 'delivery',type: 'string'},
				  {name: 'ship_name',type: 'string'},
				  {name: 'ship_area',type: 'string'},
				  {name: 'ship_addr',type: 'string'},
				  {name: 'ship_zip',type: 'string'},
				  {name: 'ship_tel',type: 'string'},
				  {name: 'ship_mobile',type: 'string'},
				  {name: 'committime',type: 'date',dateFormat:'Y-m-d H:i:s'}
			]}         
		),
		writer: new Ext.data.JsonWriter({
			encode: false 
		}),
		listeners : {    
			beforeload : function(store, options) {   
				if (Ext.isReady) {  
					Ext.apply(options.params, Km.Delivery.View.Running.deliveryGrid.filter);//保证分页也将查询条件带上  
				}
			}
		}    
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
	})
};
/**
 * View:物流显示组件   
 */
Km.Delivery.View={ 
	/**
	 * 编辑窗口：新建或者修改物流
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
							xtype : 'textfield',anchor:'98%'
						},
						items : [ 
							  {xtype: 'hidden',  name : 'delivery_id',ref:'../delivery_id'},
							  {fieldLabel : '物流单号',name : 'delivery_no'},
							  {xtype: 'hidden',name : 'order_id',id:'order_id'},
							  {
								 fieldLabel : '订单',xtype: 'combo',name : 'order_no',id : 'order_no',
								 store:Km.Delivery.Store.orderStore,emptyText: '请选择订单',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Delivery.Config.PageSize,
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
							  {xtype: 'hidden',name : 'member_id',id:'member_id'},
							  {
								 fieldLabel : '会员',xtype: 'combo',name : 'username',id : 'username',
								 store:Km.Delivery.Store.memberStore,emptyText: '请选择会员',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Delivery.Config.PageSize,
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
							  {fieldLabel : '发送状态',hiddenName : 'status',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['ready', '准备发送'],['progress', '发送中'],['returns', '退货'],['succ', '发送成功'],['failed', '发送失败'],['cancel', '取消发送'],['lost', '丢失'],['timeout', '发送超时']]
								  }),emptyText: '请选择发送状态',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							  {fieldLabel : '快递类型',hiddenName : 'type',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['returns', '返送'],['delivery', '发送']]
								  }),emptyText: '请选择快递类型',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							  {fieldLabel : '快递公司',name : 'delivery'},
							  {fieldLabel : '收货人',name : 'ship_name'},
							  {fieldLabel : '收货地区',name : 'ship_area'},
							  {fieldLabel : '收货地址',name : 'ship_addr'},
							  {fieldLabel : '邮编',name : 'ship_zip'},
							  {fieldLabel : '收货人电话',name : 'ship_tel'},
							  {fieldLabel : '收货人手机',name : 'ship_mobile'},
							  {fieldLabel : '生成时间',name : 'committime',xtype : 'datefield',format : "Y-m-d"}        
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
							this.editForm.api.submit=ExtServiceDelivery.save;                   
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Delivery.View.Running.deliveryGrid.doSelectDelivery();
									form.reset(); 
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceDelivery.update;
							this.editForm.getForm().submit({
								success : function(form, action) {                                                  
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){       
										Km.Delivery.View.Running.deliveryGrid.bottomToolbar.doRefresh(); 
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
						this.editForm.form.loadRecord(Km.Delivery.View.Running.deliveryGrid.getSelectionModel().getSelected());
 
					}                  
				}]    
			}, config);  
			Km.Delivery.View.EditWindow.superclass.constructor.call(this, config);     
		}
	}),
	/**
	 * 显示物流详情
	 */
	DeliveryView:{
		/**
		 * Tab页：容器包含显示与物流所有相关的信息
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
								if (Km.Delivery.View.Running.deliveryGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择物流！');
									return false;
								} 
								Km.Delivery.Config.View.IsShow=1;
								Km.Delivery.View.Running.deliveryGrid.showDelivery();   
								Km.Delivery.View.Running.deliveryGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Delivery.View.DeliveryView.Tabs.superclass.constructor.call(this, config);
 
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Delivery.Config.View.Direction==1)||(Km.Delivery.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabDeliveryDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">', 
						 '<tr class="entry"><td class="head">物流单号</td><td class="content">{delivery_no}</td></tr>',
						 '<tr class="entry"><td class="head">订单</td><td class="content">{order_no}</td></tr>',
						 '<tr class="entry"><td class="head">会员</td><td class="content">{username}</td></tr>',
						 '<tr class="entry"><td class="head">发送状态</td><td class="content">{status}</td></tr>',
						 '<tr class="entry"><td class="head">快递类型</td><td class="content">{type}</td></tr>',
						 '<tr class="entry"><td class="head">快递公司</td><td class="content">{delivery}</td></tr>',
						 '<tr class="entry"><td class="head">收货人</td><td class="content">{ship_name}</td></tr>',
						 '<tr class="entry"><td class="head">收货地区</td><td class="content">{ship_area}</td></tr>',
						 '<tr class="entry"><td class="head">收货地址</td><td class="content">{ship_addr}</td></tr>',
						 '<tr class="entry"><td class="head">邮编</td><td class="content">{ship_zip}</td></tr>',
						 '<tr class="entry"><td class="head">收货人电话</td><td class="content">{ship_tel}</td></tr>',
						 '<tr class="entry"><td class="head">收货人手机</td><td class="content">{ship_mobile}</td></tr>',
						 '<tr class="entry"><td class="head">生成时间</td><td class="content">{committime:date("Y-m-d")}</td></tr>',                      
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
		 * 窗口:显示物流信息
		 */
		Window:Ext.extend(Ext.Window,{ 
			constructor : function(config) { 
				config = Ext.apply({
					title:"查看物流",constrainHeader:true,maximizable: true,minimizable : true, 
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Delivery.View.DeliveryView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: { 
						minimize:function(w){
							w.hide();
							Km.Delivery.Config.View.IsShow=0;
							Km.Delivery.View.Running.deliveryGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Delivery.View.Running.deliveryGrid.tvpView.toggle(false);
						}   
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Delivery.View.Running.deliveryGrid.addDelivery();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Delivery.View.Running.deliveryGrid.updateDelivery();}
					}]
				}, config);  
				Km.Delivery.View.DeliveryView.Window.superclass.constructor.call(this, config);   
			}        
		})
	},
	/**
	 * 窗口：批量上传物流
	 */        
	UploadWindow:Ext.extend(Ext.Window,{ 
		constructor : function(config) { 
			config = Ext.apply({     
				title : '批量物流上传',
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
							emptyText: '请上传物流Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadDelivery',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Delivery.View.Running.deliveryGrid.doSelectDelivery();
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
			Km.Delivery.View.UploadWindow.superclass.constructor.call(this, config);     
		}        
	}),
	/**
	 * 视图：物流列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件  
				 */
				filter:null,
				region : 'center',
				store : Km.Delivery.Store.deliveryStore,
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
						  {header : '物流单号',dataIndex : 'delivery_no'},
						  {header : '订单',dataIndex : 'order_no'},
						  {header : '会员',dataIndex : 'username'},
						  {header : '发送状态',dataIndex : 'status'},
						  {header : '快递类型',dataIndex : 'type'},
						  {header : '快递公司',dataIndex : 'delivery'},
						  {header : '收货人',dataIndex : 'ship_name'},
						  {header : '收货地区',dataIndex : 'ship_area'},
						  {header : '收货地址',dataIndex : 'ship_addr'},
						  {header : '邮编',dataIndex : 'ship_zip'},
						  {header : '收货人电话',dataIndex : 'ship_tel'},
						  {header : '收货人手机',dataIndex : 'ship_mobile'},
						  {header : '生成时间',dataIndex : 'committime',renderer:Ext.util.Format.dateRenderer('Y-m-d')}                                 
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
								'物流单号 ','&nbsp;&nbsp;',{ref: '../ddelivery_no'},'&nbsp;&nbsp;',
								'订单 ','&nbsp;&nbsp;',{ref: '../dorder_id',xtype:'hidden',name : 'order_id',id:'dorder_id'},
								{
									 xtype: 'combo',name : 'order_no',id : 'dorder_no',
									 store:Km.Delivery.Store.orderStore,emptyText: '请选择订单',itemSelector: 'div.search-item',
									 loadingText: '查询中...',width:280,pageSize:Km.Delivery.Config.PageSize,
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
											Ext.getCmp("dorder_id").setValue(record.data.order_id);
											Ext.getCmp("dorder_no").setValue(record.data.order_no);
											this.collapse();
										 }
									 }
								},'&nbsp;&nbsp;',
								'会员 ','&nbsp;&nbsp;',{ref: '../dmember_id',xtype:'hidden',name : 'member_id',id:'dmember_id'},
								{
									 xtype: 'combo',name : 'username',id : 'dusername',
									 store:Km.Delivery.Store.memberStore,emptyText: '请选择会员',itemSelector: 'div.search-item',
									 loadingText: '查询中...',width:280,pageSize:Km.Delivery.Config.PageSize,
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
											Ext.getCmp("dmember_id").setValue(record.data.member_id);
											Ext.getCmp("dusername").setValue(record.data.username);
											this.collapse();
										 }
									 }
								},'&nbsp;&nbsp;',
								'发送状态 ','&nbsp;&nbsp;',{ref: '../dstatus',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['ready', '准备发送'],['progress', '发送中'],['returns', '退货'],['succ', '发送成功'],['failed', '发送失败'],['cancel', '取消发送'],['lost', '丢失'],['timeout', '发送超时']]
									  }),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',
								'收货人 ','&nbsp;&nbsp;',{ref: '../dship_name'},'&nbsp;&nbsp;',                                
								{
									xtype : 'button',text : '查询',scope: this, 
									handler : function() {
										this.doSelectDelivery();
									}
								}, 
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.ddelivery_no.setValue("");
										this.topToolbar.dorder_id.setValue("");
										this.topToolbar.dmember_id.setValue("");  
										this.topToolbar.dstatus.setValue("");
										this.topToolbar.dship_name.setValue("");                                        
										this.filter={};
										this.doSelectDelivery();
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
									text : '添加物流',iconCls : 'icon-add',
									handler : function() {
										this.addDelivery();
									}
								},'-',{
									text : '修改物流',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
									handler : function() {
										this.updateDelivery();
									}
								},'-',{
									text : '删除物流', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
									handler : function() {
										this.deleteDelivery();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import', 
									handler : function() {
										this.importDelivery();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export', 
									handler : function() { 
										this.exportDelivery();
									}
								},'-',{ 
									xtype:'tbsplit',text: '查看物流', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,  
									handler:function(){this.showDelivery()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideDelivery();Km.Delivery.Config.View.IsShow=0;}},'-', 
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Delivery.Cookie.set('View.IsFix',Km.Delivery.Config.View.IsFix);}} 
										]}
								},'-']}
					)]
				},                
				bbar: new Ext.PagingToolbar({          
					pageSize: Km.Delivery.Config.PageSize,
					store: Km.Delivery.Store.deliveryStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Delivery.Config.PageSize,minValue:1,width:35, 
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Delivery.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Delivery.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectDelivery();
								}, 
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Delivery.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Delivery.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectDelivery();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示物流列表
			this.doSelectDelivery();
			Km.Delivery.View.Grid.superclass.constructor.call(this, config); 
			//创建在Grid里显示的物流信息Tab页
			Km.Delivery.View.Running.viewTabs=new Km.Delivery.View.DeliveryView.Tabs();
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
					this.grid.updateViewDelivery();                     
					if (sm.getCount() != 1){
						this.grid.hideDelivery();
						Km.Delivery.Config.View.IsShow=0;
					}else{
						if (Km.Delivery.View.IsSelectView==1){
							Km.Delivery.View.IsSelectView=0;  
							this.grid.showDelivery();   
						}     
					}    
				},
				rowdeselect: function(sm, rowIndex, record) {  
					if (sm.getCount() != 1){
						if (Km.Delivery.Config.View.IsShow==1){
							Km.Delivery.View.IsSelectView=1;    
						}             
						this.grid.hideDelivery();
						Km.Delivery.Config.View.IsShow=0;
					}    
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){  
			if (!Km.Delivery.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showDelivery();
				this.tvpView.toggle(true);
			}else{
				this.hideDelivery();
				Km.Delivery.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){ 
			if (checked){             
			   Km.Delivery.Config.View.IsFix=1; 
			}else{ 
			   Km.Delivery.Config.View.IsFix=0;   
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Delivery.Config.View.IsShow=0;
				return ;
			}
			if (Km.Delivery.Config.View.IsShow==1){
			   this.hideDelivery(); 
			   Km.Delivery.Config.View.IsShow=0;
			}
			this.showDelivery();   
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
		 * 查询符合条件的物流
		 */
		doSelectDelivery : function() {
			if (this.topToolbar){
				var ddelivery_no = this.topToolbar.ddelivery_no.getValue();
				var dorder_id = this.topToolbar.dorder_id.getValue();
				var dmember_id = this.topToolbar.dmember_id.getValue();
				var dstatus = this.topToolbar.dstatus.getValue();
				var dship_name = this.topToolbar.dship_name.getValue();
				this.filter       ={'delivery_no':ddelivery_no,'order_id':dorder_id,'member_id':dmember_id,'status':dstatus,'ship_name':dship_name};
			}
			var condition = {'start':0,'limit':Km.Delivery.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceDelivery.queryPageDelivery(condition,function(provider, response) {   
				if (response.result.data) {   
					var result           = new Array();
					result['data']       =response.result.data; 
					result['totalCount'] =response.result.totalCount;
					Km.Delivery.Store.deliveryStore.loadData(result); 
				} else {
					Km.Delivery.Store.deliveryStore.removeAll();                        
					Ext.Msg.alert('提示', '无符合条件的物流！');
				}
			});
		}, 
		/**
		 * 显示物流视图
		 * 显示物流的视图相对物流列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Delivery.Config.View.Direction=viewDirection; 
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Delivery.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Delivery.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Delivery.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Delivery.View.Running.viewTabs);
					break;    
			}  
			Km.Delivery.Cookie.set('View.Direction',Km.Delivery.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Delivery.Config.View.IsFix==0)&&(Km.Delivery.Config.View.IsShow==1)){
					this.showDelivery();     
				}
				Km.Delivery.Config.View.IsFix=1;
				Km.Delivery.View.Running.deliveryGrid.tvpView.menu.mBind.setChecked(true,true);  
				Km.Delivery.Config.View.IsShow=0;
				this.showDelivery();     
			}
		}, 
		/**
		 * 显示物流
		 */
		showDelivery : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择物流！');
				Km.Delivery.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			} 
			if (Km.Delivery.Config.View.IsFix==0){
				if (Km.Delivery.View.Running.view_window==null){
					Km.Delivery.View.Running.view_window=new Km.Delivery.View.DeliveryView.Window();
				}
				if (Km.Delivery.View.Running.view_window.hidden){
					Km.Delivery.View.Running.view_window.show();
					Km.Delivery.View.Running.view_window.winTabs.hideTabStripItem(Km.Delivery.View.Running.view_window.winTabs.tabFix);   
					this.updateViewDelivery();
					this.tvpView.toggle(true);
					Km.Delivery.Config.View.IsShow=1;
				}else{
					this.hideDelivery();
					Km.Delivery.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Delivery.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Delivery.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Delivery.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Delivery.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Delivery.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Delivery.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Delivery.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Delivery.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Delivery.View.Running.viewTabs);
					}
					break;    
			}  
			this.hideDelivery();
			if (Km.Delivery.Config.View.IsShow==0){
				Km.Delivery.View.Running.viewTabs.enableCollapse();  
				switch(Km.Delivery.Config.View.Direction){
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
				this.updateViewDelivery();
				this.tvpView.toggle(true);
				Km.Delivery.Config.View.IsShow=1;
			}else{
				Km.Delivery.Config.View.IsShow=0;
			}

			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏物流
		 */
		hideDelivery : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();   
			this.ownerCt.east.hide(); 
			if (Km.Delivery.View.Running.view_window!=null){
				Km.Delivery.View.Running.view_window.hide();
			}            
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前物流显示信息
		 */
		updateViewDelivery : function() {
			if (Km.Delivery.View.Running.view_window!=null){
				Km.Delivery.View.Running.view_window.winTabs.tabDeliveryDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Delivery.View.Running.viewTabs.tabDeliveryDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建物流
		 */
		addDelivery : function() {  
			if (Km.Delivery.View.Running.edit_window==null){   
				Km.Delivery.View.Running.edit_window=new Km.Delivery.View.EditWindow();   
			}     
			Km.Delivery.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Delivery.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Delivery.View.Running.edit_window.setTitle('添加物流');
			Km.Delivery.View.Running.edit_window.savetype=0;
			Km.Delivery.View.Running.edit_window.delivery_id.setValue("");
			
			Km.Delivery.View.Running.edit_window.show();   
			Km.Delivery.View.Running.edit_window.maximize();               
		},   
		/**
		 * 编辑物流时先获得选中的物流信息
		 */
		updateDelivery : function() {
			if (Km.Delivery.View.Running.edit_window==null){   
				Km.Delivery.View.Running.edit_window=new Km.Delivery.View.EditWindow();   
			}            
			Km.Delivery.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Delivery.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Delivery.View.Running.edit_window.setTitle('修改物流');
			Km.Delivery.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Delivery.View.Running.edit_window.savetype=1;
			
			Km.Delivery.View.Running.edit_window.show();    
			Km.Delivery.View.Running.edit_window.maximize();                  
		},        
		/**
		 * 删除物流
		 */
		deleteDelivery : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的物流吗?', this.confirmDeleteDelivery,this);
		}, 
		/**
		 * 确认删除物流
		 */
		confirmDeleteDelivery : function(btn) {
			if (btn == 'yes') {  
				var del_delivery_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_delivery_ids=del_delivery_ids+selectedRows[flag].data.delivery_id+",";
				}
				ExtServiceDelivery.deleteByIds(del_delivery_ids);
				this.doSelectDelivery();
				Ext.Msg.alert("提示", "删除成功！");        
			}
		},
		/**
		 * 导出物流
		 */
		exportDelivery : function() {            
			ExtServiceDelivery.exportDelivery(this.filter,function(provider, response) {  
				if (response.result.data) {
					window.open(response.result.data);
				}
			});                        
		},
		/**
		 * 导入物流
		 */
		importDelivery : function() { 
			if (Km.Delivery.View.current_uploadWindow==null){   
				Km.Delivery.View.current_uploadWindow=new Km.Delivery.View.UploadWindow();   
			}     
			Km.Delivery.View.current_uploadWindow.show();
		}                
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Delivery.View.Running.deliveryGrid=new Km.Delivery.View.Grid();           
			if (Km.Delivery.Config.View.IsFix==0){
				Km.Delivery.View.Running.deliveryGrid.tvpView.menu.mBind.setChecked(false,true);  
			}
			config = Ext.apply({ 
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Delivery.View.Running.deliveryGrid, 
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Delivery.View.Running.viewTabs]}, 
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
					]
				}
			}, config);   
			Km.Delivery.View.Panel.superclass.constructor.call(this, config);  
		}        
	}),
	/**
	 * 当前运行的可视化对象
	 */ 
	Running:{         
		/**
		 * 当前物流Grid对象
		 */
		deliveryGrid:null,
  
		/**
		 * 显示物流信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Delivery.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);     
	Km.Delivery.Init();
	/**
	 * 物流数据模型获取数据Direct调用
	 */        
	Km.Delivery.Store.deliveryStore.proxy=new Ext.data.DirectProxy({ 
		api: {read:ExtServiceDelivery.queryPageDelivery}
	});   
	/**
	 * 物流页面布局
	 */
	Km.Delivery.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Delivery.View.Panel()]
	});
	Km.Delivery.Viewport.doLayout();                                  
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});     