Ext.namespace("Kmall.Admin.Payments");
Km = Kmall.Admin.Payments;
Km.Payments={
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
			 * 显示支付的视图相对支付列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示支付信息页(或者打开新窗口)
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
		if (Km.Payments.Cookie.get('View.Direction')){
			Km.Payments.Config.View.Direction=Km.Payments.Cookie.get('View.Direction');
		}
		if (Km.Payments.Cookie.get('View.IsFix')!=null){
			Km.Payments.Config.View.IsFix=Km.Payments.Cookie.get('View.IsFix');
		}
		if (Ext.util.Cookies.get('OnlineEditor')!=null){
			Km.Payments.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
		}
	}
}; 
/**
 * Model:数据模型   
 */
Km.Payments.Store = { 
	/**
	 * 支付
	 */ 
	paymentsStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',  
			root: 'data',remoteSort: true,                
			fields : [
				  {name: 'payments_id',type: 'int'},
				  {name: 'order_id',type: 'int'},
				  {name: 'order_no',type: 'string'},  
				  {name: 'member_id',type: 'string'},
				  {name: 'username',type: 'string'},        
				  {name: 'status',type: 'string'},
				  {name: 'pay_type',type: 'string'},
				  {name: 'name_pay_type',type: 'string'},
				  {name: 'account',type: 'string'},
				  {name: 'bank',type: 'string'},
				  {name: 'pay_account',type: 'string'},
				  {name: 'currency',type: 'string'},
				  {name: 'money',type: 'float'},
				  {name: 'ip',type: 'string'},
				  {name: 'intro',type: 'string'},
				  {name: 't_begin',type: 'date',dateFormat:'Y-m-d H:i:s'},
				  {name: 't_end',type: 'date',dateFormat:'Y-m-d H:i:s'}
			]}         
		),
		writer: new Ext.data.JsonWriter({
			encode: false 
		}),
		listeners : {    
			beforeload : function(store, options) {   
				if (Ext.isReady) {  
					Ext.apply(options.params, Km.Payments.View.Running.paymentsGrid.filter);//保证分页也将查询条件带上  
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
	}),
	/**
	 * 支付方式
	 */
	paymenttypeStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/paymenttype.php'
		  }),
		reader: new Ext.data.JsonReader({
			root: 'paymenttypes',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'paymenttype_id'
		  }, [
			  {name: 'paymenttype_id', mapping: 'paymenttype_id'}, 
			  {name: 'name', mapping: 'name'} 
		])
	})      
};
/**
 * View:支付显示组件   
 */
Km.Payments.View={ 
	/**
	 * 编辑窗口：新建或者修改支付
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
						switch (Km.Payments.Config.OnlineEditor)
						{
							case 2:
								Km.Payments.View.EditWindow.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
								break
							case 3:
								pageInit_intro();
								break
							default:
								ckeditor_replace_intro(); 
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
							  {xtype: 'hidden',  name : 'payments_id',ref:'../payments_id'},
							  {xtype: 'hidden',name : 'order_id',id:'order_id'},
							  {
								 fieldLabel : '订单号',xtype: 'combo',name : 'order_no',id : 'order_no',
								 store:Km.Payments.Store.orderStore,emptyText: '请选择订单号',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Payments.Config.PageSize,
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
								 store:Km.Payments.Store.memberStore,emptyText: '请选择会员',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Payments.Config.PageSize,
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
							  {fieldLabel : '支付状态',hiddenName : 'status',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['ready', '准备支付'],['progress', '支付中'],['return', '退款'],['succ', '支付成功'],['failed', '支付失败'],['cancel', '取消支付'],['error', '支付错误'],['invalid', '非法支付'],['timeout', '支付超时']]
								  }),emptyText: '请选择支付状态',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							  {xtype: 'hidden',name : 'pay_type',id:'pay_type'},
							  {
								 fieldLabel : '支付方式',xtype: 'combo',name : 'name_pay_type',id : 'name_pay_type',
								 store:Km.Payments.Store.paymenttypeStore,emptyText: '请选择支付方式',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Payments.Config.PageSize,
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
										Ext.getCmp("pay_type").setValue(record.data.paymenttype_id);
										Ext.getCmp("name_pay_type").setValue(record.data.name);
										this.collapse();
									   }
								   }
							  },
							  {fieldLabel : '收款账号',name : 'account'},
							  {fieldLabel : '收款银行',name : 'bank'},
							  {fieldLabel : '支付账号',name : 'pay_account'},
							  {fieldLabel : '货币',name : 'currency'},
							  {fieldLabel : '支付金额',name : 'money',xtype : 'numberfield'},
							  {fieldLabel : '支付的IP地址',name : 'ip'},
							  {fieldLabel : '支付留言',name : 'intro',xtype : 'textarea',id:'intro',ref:'intro'},
							  {fieldLabel : '生成时间',name : 't_begin',xtype : 'datefield',format : "Y-m-d"},
							  {fieldLabel : '支付完成时间',name : 't_end',xtype : 'datefield',format : "Y-m-d"}        
						]
					})                
				],
				buttons : [ {         
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {   
						switch (Km.Payments.Config.OnlineEditor)
						{
							case 2:
								if (Km.Payments.View.EditWindow.KindEditor_intro)this.editForm.intro.setValue(Km.Payments.View.EditWindow.KindEditor_intro.html());
								break
							case 3:
								if (xhEditor_intro)this.editForm.intro.setValue(xhEditor_intro.getSource());
								break
							default:
								if (CKEDITOR.instances.intro) this.editForm.intro.setValue(CKEDITOR.instances.intro.getData());
						}
		 
						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;                   
						if (this.savetype==0){    
							this.editForm.api.submit=ExtServicePayments.save;                   
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Payments.View.Running.paymentsGrid.doSelectPayments();
									form.reset(); 
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServicePayments.update;
							this.editForm.getForm().submit({
								success : function(form, action) {                                                  
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){       
										Km.Payments.View.Running.paymentsGrid.bottomToolbar.doRefresh(); 
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
						this.editForm.form.loadRecord(Km.Payments.View.Running.paymentsGrid.getSelectionModel().getSelected());
						switch (Km.Payments.Config.OnlineEditor)
						{
							case 2:
								if (Km.Payments.View.EditWindow.KindEditor_intro) Km.Payments.View.EditWindow.KindEditor_intro.html(Km.Payments.View.Running.paymentsGrid.getSelectionModel().getSelected().data.intro);
								break
							case 3:
								break
							default:
								if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(Km.Payments.View.Running.paymentsGrid.getSelectionModel().getSelected().data.intro);
						}
 
					}                  
				}]    
			}, config);  
			Km.Payments.View.EditWindow.superclass.constructor.call(this, config);     
		}
	}),
	/**
	 * 显示支付详情
	 */
	PaymentsView:{
		/**
		 * Tab页：容器包含显示与支付所有相关的信息
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
								if (Km.Payments.View.Running.paymentsGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择支付！');
									return false;
								} 
								Km.Payments.Config.View.IsShow=1;
								Km.Payments.View.Running.paymentsGrid.showPayments();   
								Km.Payments.View.Running.paymentsGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Payments.View.PaymentsView.Tabs.superclass.constructor.call(this, config);
 
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Payments.Config.View.Direction==1)||(Km.Payments.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabPaymentsDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">', 
						 '<tr class="entry"><td class="head">订单号</td><td class="content">{order_no}</td></tr>',
						 '<tr class="entry"><td class="head">会员</td><td class="content">{username}</td></tr>',
						 '<tr class="entry"><td class="head">支付状态</td><td class="content">{status}</td></tr>',
						 '<tr class="entry"><td class="head">支付方式</td><td class="content">{name_pay_type}</td></tr>',
						 '<tr class="entry"><td class="head">收款账号</td><td class="content">{account}</td></tr>',
						 '<tr class="entry"><td class="head">收款银行</td><td class="content">{bank}</td></tr>',
						 '<tr class="entry"><td class="head">支付账号</td><td class="content">{pay_account}</td></tr>',
						 '<tr class="entry"><td class="head">货币</td><td class="content">{currency}</td></tr>',
						 '<tr class="entry"><td class="head">支付金额</td><td class="content">{money}</td></tr>',
						 '<tr class="entry"><td class="head">支付的IP地址</td><td class="content">{ip}</td></tr>',
						 '<tr class="entry"><td class="head">支付留言</td><td class="content">{intro}</td></tr>',
						 '<tr class="entry"><td class="head">生成时间</td><td class="content">{t_begin:date("Y-m-d")}</td></tr>',
						 '<tr class="entry"><td class="head">支付完成时间</td><td class="content">{t_end:date("Y-m-d")}</td></tr>',                      
					 '</table>' 
					 ]
					}
				);
			}       
		}),
		/**
		 * 窗口:显示支付信息
		 */
		Window:Ext.extend(Ext.Window,{ 
			constructor : function(config) { 
				config = Ext.apply({
					title:"查看支付",constrainHeader:true,maximizable: true,minimizable : true, 
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Payments.View.PaymentsView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: { 
						minimize:function(w){
							w.hide();
							Km.Payments.Config.View.IsShow=0;
							Km.Payments.View.Running.paymentsGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Payments.View.Running.paymentsGrid.tvpView.toggle(false);
						}   
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Payments.View.Running.paymentsGrid.addPayments();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Payments.View.Running.paymentsGrid.updatePayments();}
					}]
				}, config);  
				Km.Payments.View.PaymentsView.Window.superclass.constructor.call(this, config);   
			}        
		})
	},
	/**
	 * 窗口：批量上传支付
	 */        
	UploadWindow:Ext.extend(Ext.Window,{ 
		constructor : function(config) { 
			config = Ext.apply({     
				title : '批量支付上传',
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
							emptyText: '请上传支付Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadPayments',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Payments.View.Running.paymentsGrid.doSelectPayments();
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
			Km.Payments.View.UploadWindow.superclass.constructor.call(this, config);     
		}        
	}),
	/**
	 * 视图：支付列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件  
				 */
				filter:null,
				region : 'center',
				store : Km.Payments.Store.paymentsStore,
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
						  {header : '订单号',dataIndex : 'order_no'},
						  {header : '会员',dataIndex : 'username'},
						  {header : '支付状态',dataIndex : 'status'},
						  {header : '支付方式',dataIndex : 'name_pay_type'},
						  {header : '收款账号',dataIndex : 'account'},
						  {header : '收款银行',dataIndex : 'bank'},
						  {header : '支付账号',dataIndex : 'pay_account'},
						  {header : '货币',dataIndex : 'currency'},
						  {header : '支付金额',dataIndex : 'money'},
						  {header : '支付的IP地址',dataIndex : 'ip'},
						  {header : '支付留言',dataIndex : 'intro'},
						  {header : '生成时间',dataIndex : 't_begin',renderer:Ext.util.Format.dateRenderer('Y-m-d')},
						  {header : '支付完成时间',dataIndex : 't_end',renderer:Ext.util.Format.dateRenderer('Y-m-d')}                                 
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
								'订单号 ','&nbsp;&nbsp;',{ref: '../porder_id',xtype:'hidden',name : 'order_id',id:'porder_id'},
								{
									 xtype: 'combo',name : 'order_no',id : 'porder_no',
									 store:Km.Payments.Store.orderStore,emptyText: '请选择订单号',itemSelector: 'div.search-item',
									 loadingText: '查询中...',width:280,pageSize:Km.Payments.Config.PageSize,
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
											Ext.getCmp("porder_id").setValue(record.data.order_id);
											Ext.getCmp("porder_no").setValue(record.data.order_no);
											this.collapse();
										 }
									 }
								},'&nbsp;&nbsp;',
								'会员 ','&nbsp;&nbsp;',{ref: '../pmember_id',xtype:'hidden',name : 'member_id',id:'pmember_id'},
								{
									 xtype: 'combo',name : 'username',id : 'pusername',
									 store:Km.Payments.Store.memberStore,emptyText: '请选择会员',itemSelector: 'div.search-item',
									 loadingText: '查询中...',width:280,pageSize:Km.Payments.Config.PageSize,
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
											Ext.getCmp("pmember_id").setValue(record.data.member_id);
											Ext.getCmp("pusername").setValue(record.data.username);
											this.collapse();
										 }
									 }
								},'&nbsp;&nbsp;',
								'支付状态 ','&nbsp;&nbsp;',{ref: '../pstatus',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['ready', '准备支付'],['progress', '支付中'],['return', '退款'],['succ', '支付成功'],['failed', '支付失败'],['cancel', '取消支付'],['error', '支付错误'],['invalid', '非法支付'],['timeout', '支付超时']]
									  }),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',                                
								{
									xtype : 'button',text : '查询',scope: this, 
									handler : function() {
										this.doSelectPayments();
									}
								}, 
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.porder_id.setValue("");   
										this.topToolbar.pmember_id.setValue("");
										this.topToolbar.pstatus.setValue("");                                        
										this.filter={};
										this.doSelectPayments();
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
									text : '添加支付',iconCls : 'icon-add',
									handler : function() {
										this.addPayments();
									}
								},'-',{
									text : '修改支付',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
									handler : function() {
										this.updatePayments();
									}
								},'-',{
									text : '删除支付', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
									handler : function() {
										this.deletePayments();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import', 
									handler : function() {
										this.importPayments();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export', 
									handler : function() { 
										this.exportPayments();
									}
								},'-',{ 
									xtype:'tbsplit',text: '查看支付', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,  
									handler:function(){this.showPayments()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hidePayments();Km.Payments.Config.View.IsShow=0;}},'-', 
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Payments.Cookie.set('View.IsFix',Km.Payments.Config.View.IsFix);}} 
										]}
								},'-']}
					)]
				},                
				bbar: new Ext.PagingToolbar({          
					pageSize: Km.Payments.Config.PageSize,
					store: Km.Payments.Store.paymentsStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Payments.Config.PageSize,minValue:1,width:35, 
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Payments.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Payments.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectPayments();
								}, 
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Payments.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Payments.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectPayments();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示支付列表
			this.doSelectPayments();
			Km.Payments.View.Grid.superclass.constructor.call(this, config); 
			//创建在Grid里显示的支付信息Tab页
			Km.Payments.View.Running.viewTabs=new Km.Payments.View.PaymentsView.Tabs();
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
					this.grid.updateViewPayments();                     
					if (sm.getCount() != 1){
						this.grid.hidePayments();
						Km.Payments.Config.View.IsShow=0;
					}else{
						if (Km.Payments.View.IsSelectView==1){
							Km.Payments.View.IsSelectView=0;  
							this.grid.showPayments();   
						}     
					}    
				},
				rowdeselect: function(sm, rowIndex, record) {  
					if (sm.getCount() != 1){
						if (Km.Payments.Config.View.IsShow==1){
							Km.Payments.View.IsSelectView=1;    
						}             
						this.grid.hidePayments();
						Km.Payments.Config.View.IsShow=0;
					}    
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){  
			if (!Km.Payments.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showPayments();
				this.tvpView.toggle(true);
			}else{
				this.hidePayments();
				Km.Payments.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){ 
			if (checked){             
			   Km.Payments.Config.View.IsFix=1; 
			}else{ 
			   Km.Payments.Config.View.IsFix=0;   
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Payments.Config.View.IsShow=0;
				return ;
			}
			if (Km.Payments.Config.View.IsShow==1){
			   this.hidePayments(); 
			   Km.Payments.Config.View.IsShow=0;
			}
			this.showPayments();   
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
		 * 查询符合条件的支付
		 */
		doSelectPayments : function() {
			if (this.topToolbar){
				var porder_id = this.topToolbar.porder_id.getValue();        
				var pmember_id = this.topToolbar.pmember_id.getValue();
				var pstatus = this.topToolbar.pstatus.getValue();
				this.filter       ={'order_id':porder_id,'member_id':pmember_id,'status':pstatus};
			}
			var condition = {'start':0,'limit':Km.Payments.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServicePayments.queryPagePayments(condition,function(provider, response) {   
				if (response.result.data) {   
					var result           = new Array();
					result['data']       =response.result.data; 
					result['totalCount'] =response.result.totalCount;
					Km.Payments.Store.paymentsStore.loadData(result); 
				} else {
					Km.Payments.Store.paymentsStore.removeAll();                        
					Ext.Msg.alert('提示', '无符合条件的支付！');
				}
			});
		}, 
		/**
		 * 显示支付视图
		 * 显示支付的视图相对支付列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Payments.Config.View.Direction=viewDirection; 
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Payments.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Payments.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Payments.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Payments.View.Running.viewTabs);
					break;    
			}  
			Km.Payments.Cookie.set('View.Direction',Km.Payments.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Payments.Config.View.IsFix==0)&&(Km.Payments.Config.View.IsShow==1)){
					this.showPayments();     
				}
				Km.Payments.Config.View.IsFix=1;
				Km.Payments.View.Running.paymentsGrid.tvpView.menu.mBind.setChecked(true,true);  
				Km.Payments.Config.View.IsShow=0;
				this.showPayments();     
			}
		}, 
		/**
		 * 显示支付
		 */
		showPayments : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择支付！');
				Km.Payments.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			} 
			if (Km.Payments.Config.View.IsFix==0){
				if (Km.Payments.View.Running.view_window==null){
					Km.Payments.View.Running.view_window=new Km.Payments.View.PaymentsView.Window();
				}
				if (Km.Payments.View.Running.view_window.hidden){
					Km.Payments.View.Running.view_window.show();
					Km.Payments.View.Running.view_window.winTabs.hideTabStripItem(Km.Payments.View.Running.view_window.winTabs.tabFix);   
					this.updateViewPayments();
					this.tvpView.toggle(true);
					Km.Payments.Config.View.IsShow=1;
				}else{
					this.hidePayments();
					Km.Payments.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Payments.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Payments.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Payments.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Payments.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Payments.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Payments.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Payments.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Payments.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Payments.View.Running.viewTabs);
					}
					break;    
			}  
			this.hidePayments();
			if (Km.Payments.Config.View.IsShow==0){
				Km.Payments.View.Running.viewTabs.enableCollapse();  
				switch(Km.Payments.Config.View.Direction){
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
				this.updateViewPayments();
				this.tvpView.toggle(true);
				Km.Payments.Config.View.IsShow=1;
			}else{
				Km.Payments.Config.View.IsShow=0;
			}

			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏支付
		 */
		hidePayments : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();   
			this.ownerCt.east.hide(); 
			if (Km.Payments.View.Running.view_window!=null){
				Km.Payments.View.Running.view_window.hide();
			}            
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前支付显示信息
		 */
		updateViewPayments : function() {
			if (Km.Payments.View.Running.view_window!=null){
				Km.Payments.View.Running.view_window.winTabs.tabPaymentsDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Payments.View.Running.viewTabs.tabPaymentsDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建支付
		 */
		addPayments : function() {  
			if (Km.Payments.View.Running.edit_window==null){   
				Km.Payments.View.Running.edit_window=new Km.Payments.View.EditWindow();   
			}     
			Km.Payments.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Payments.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Payments.View.Running.edit_window.setTitle('添加支付');
			Km.Payments.View.Running.edit_window.savetype=0;
			Km.Payments.View.Running.edit_window.payments_id.setValue("");
			switch (Km.Payments.Config.OnlineEditor)
			{
				case 2:
					if (Km.Payments.View.EditWindow.KindEditor_intro) Km.Payments.View.EditWindow.KindEditor_intro.html("");
					break
				case 3:
					break
				default:
					if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData("");
			}
			
			Km.Payments.View.Running.edit_window.show();   
			Km.Payments.View.Running.edit_window.maximize();               
		},   
		/**
		 * 编辑支付时先获得选中的支付信息
		 */
		updatePayments : function() {
			if (Km.Payments.View.Running.edit_window==null){   
				Km.Payments.View.Running.edit_window=new Km.Payments.View.EditWindow();   
			}            
			Km.Payments.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Payments.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Payments.View.Running.edit_window.setTitle('修改支付');
			Km.Payments.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Payments.View.Running.edit_window.savetype=1;
			switch (Km.Payments.Config.OnlineEditor)
			{
				case 2:
					if (Km.Payments.View.EditWindow.KindEditor_intro) Km.Payments.View.EditWindow.KindEditor_intro.html(this.getSelectionModel().getSelected().data.intro);
					break
				case 3:
					if (xhEditor_intro)xhEditor_intro.setSource(this.getSelectionModel().getSelected().data.intro);
					break
				default:
					if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(this.getSelectionModel().getSelected().data.intro); 
			}
			
			Km.Payments.View.Running.edit_window.show();    
			Km.Payments.View.Running.edit_window.maximize();                  
		},        
		/**
		 * 删除支付
		 */
		deletePayments : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的支付吗?', this.confirmDeletePayments,this);
		}, 
		/**
		 * 确认删除支付
		 */
		confirmDeletePayments : function(btn) {
			if (btn == 'yes') {  
				var del_payments_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_payments_ids=del_payments_ids+selectedRows[flag].data.payments_id+",";
				}
				ExtServicePayments.deleteByIds(del_payments_ids);
				this.doSelectPayments();
				Ext.Msg.alert("提示", "删除成功！");        
			}
		},
		/**
		 * 导出支付
		 */
		exportPayments : function() {            
			ExtServicePayments.exportPayments(this.filter,function(provider, response) {  
				if (response.result.data) {
					window.open(response.result.data);
				}
			});                        
		},
		/**
		 * 导入支付
		 */
		importPayments : function() { 
			if (Km.Payments.View.current_uploadWindow==null){   
				Km.Payments.View.current_uploadWindow=new Km.Payments.View.UploadWindow();   
			}     
			Km.Payments.View.current_uploadWindow.show();
		}                
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Payments.View.Running.paymentsGrid=new Km.Payments.View.Grid();           
			if (Km.Payments.Config.View.IsFix==0){
				Km.Payments.View.Running.paymentsGrid.tvpView.menu.mBind.setChecked(false,true);  
			}
			config = Ext.apply({ 
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Payments.View.Running.paymentsGrid, 
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Payments.View.Running.viewTabs]}, 
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
					]
				}
			}, config);   
			Km.Payments.View.Panel.superclass.constructor.call(this, config);  
		}        
	}),
	/**
	 * 当前运行的可视化对象
	 */ 
	Running:{         
		/**
		 * 当前支付Grid对象
		 */
		paymentsGrid:null,
  
		/**
		 * 显示支付信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Payments.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);     
	Km.Payments.Init();
	/**
	 * 支付数据模型获取数据Direct调用
	 */        
	Km.Payments.Store.paymentsStore.proxy=new Ext.data.DirectProxy({ 
		api: {read:ExtServicePayments.queryPagePayments}
	});   
	/**
	 * 支付页面布局
	 */
	Km.Payments.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Payments.View.Panel()]
	});
	Km.Payments.Viewport.doLayout();                                  
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});     