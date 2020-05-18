Ext.namespace("Kmall.Admin.Paylog");
Km = Kmall.Admin.Paylog;
Km.Paylog={
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
			 * 显示收退款记录的视图相对收退款记录列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示收退款记录信息页(或者打开新窗口)
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
		if (Km.Paylog.Cookie.get('View.Direction')){
			Km.Paylog.Config.View.Direction=Km.Paylog.Cookie.get('View.Direction');
		}
		if (Km.Paylog.Cookie.get('View.IsFix')!=null){
			Km.Paylog.Config.View.IsFix=Km.Paylog.Cookie.get('View.IsFix');
		}
		if (Ext.util.Cookies.get('OnlineEditor')!=null){
			Km.Paylog.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
		}
	}
};
/**
 * Model:数据模型
 */
Km.Paylog.Store = {
	/**
	 * 收退款记录
	 */
	paylogStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				  {name: 'paylog_id',type: 'int'},
				  {name: 'order_id',type: 'int'},
				  {name: 'order_no',type: 'string'},
				  {name: 'operater',type: 'string'},
				  {name: 'pay_type',type: 'string'},
				  {name: 'amount',type: 'float'},
				  {name: 'payAction',type: 'string'},
                  {name: 'payActionShow',type: 'string'},
				  {name: 'result',type: 'string'},
                  {name: 'resultShow',type: 'string'},
				  {name: 'intro',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					Ext.apply(options.params, Km.Paylog.View.Running.paylogGrid.filter);//保证分页也将查询条件带上
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
	})
};
/**
 * View:收退款记录显示组件
 */
Km.Paylog.View={
	/**
	 * 编辑窗口：新建或者修改收退款记录
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
						switch (Km.Paylog.Config.OnlineEditor)
						{
							case 2:
								Km.Paylog.View.EditWindow.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
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
							  {xtype: 'hidden',  name : 'paylog_id',ref:'../paylog_id'},
							  {xtype: 'hidden',name : 'order_id',id:'order_id'},
							  {
								 fieldLabel : '订单号',xtype: 'combo',name : 'order_no',id : 'order_no',
								 store:Km.Paylog.Store.orderStore,emptyText: '请选择订单号',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Paylog.Config.PageSize,
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
							  {fieldLabel : '操作人员',name : 'operater'},
							  {fieldLabel : '支付方式',name : 'pay_type'},
							  {fieldLabel : '支付金额',name : 'amount',xtype : 'numberfield'},
							  {fieldLabel : '收退款行为',hiddenName : 'payAction',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '未收款'],['1', '已收款'],['2', '已退款']]
								  }),emptyText: '请选择收退款行为',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							  {fieldLabel : '结果',hiddenName : 'result',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['succ', '成功'],['proc', '处理中'],['fail', '失败']]
								  }),emptyText: '请选择结果',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							  {fieldLabel : '备注说明',name : 'intro',xtype : 'textarea',id:'intro',ref:'intro'}
						]
					})
				],
				buttons : [ {
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {
						switch (Km.Paylog.Config.OnlineEditor)
						{
							case 2:
								if (Km.Paylog.View.EditWindow.KindEditor_intro)this.editForm.intro.setValue(Km.Paylog.View.EditWindow.KindEditor_intro.html());
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
							this.editForm.api.submit=ExtServicePaylog.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Paylog.View.Running.paylogGrid.doSelectPaylog();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServicePaylog.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Paylog.View.Running.paylogGrid.bottomToolbar.doRefresh();
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
						this.editForm.form.loadRecord(Km.Paylog.View.Running.paylogGrid.getSelectionModel().getSelected());
						switch (Km.Paylog.Config.OnlineEditor)
						{
							case 2:
								if (Km.Paylog.View.EditWindow.KindEditor_intro) Km.Paylog.View.EditWindow.KindEditor_intro.html(Km.Paylog.View.Running.paylogGrid.getSelectionModel().getSelected().data.intro);
								break
							case 3:
								break
							default:
								if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(Km.Paylog.View.Running.paylogGrid.getSelectionModel().getSelected().data.intro);
						}

					}
				}]
			}, config);
			Km.Paylog.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示收退款记录详情
	 */
	PaylogView:{
		/**
		 * Tab页：容器包含显示与收退款记录所有相关的信息
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
								if (Km.Paylog.View.Running.paylogGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择收退款记录！');
									return false;
								}
								Km.Paylog.Config.View.IsShow=1;
								Km.Paylog.View.Running.paylogGrid.showPaylog();
								Km.Paylog.View.Running.paylogGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Paylog.View.PaylogView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Paylog.Config.View.Direction==1)||(Km.Paylog.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabPaylogDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">',
						 '<tr class="entry"><td class="head">订单号</td><td class="content">{order_no}</td></tr>',
						 '<tr class="entry"><td class="head">操作人员</td><td class="content">{operater}</td></tr>',
						 '<tr class="entry"><td class="head">支付方式</td><td class="content">{pay_type}</td></tr>',
						 '<tr class="entry"><td class="head">支付金额</td><td class="content">{amount}</td></tr>',
						 '<tr class="entry"><td class="head">收退款行为</td><td class="content">{payActionShow}</td></tr>',
						 '<tr class="entry"><td class="head">结果</td><td class="content">{resultShow}</td></tr>',
						 '<tr class="entry"><td class="head">备注说明</td><td class="content">{intro}</td></tr>',
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
		 * 窗口:显示收退款记录信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看收退款记录",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Paylog.View.PaylogView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Paylog.Config.View.IsShow=0;
							Km.Paylog.View.Running.paylogGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Paylog.Config.View.IsShow=0;
							Km.Paylog.View.Running.paylogGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Paylog.View.Running.paylogGrid.addPaylog();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Paylog.View.Running.paylogGrid.updatePaylog();}
					}]
				}, config);
				Km.Paylog.View.PaylogView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传收退款记录
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量收退款记录上传',
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
							emptyText: '请上传收退款记录Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadPaylog',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Paylog.View.Running.paylogGrid.doSelectPaylog();
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
			Km.Paylog.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：收退款记录列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Paylog.Store.paylogStore,
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
						  {header : '操作人员',dataIndex : 'operater'},
						  {header : '支付方式',dataIndex : 'pay_type'},
						  {header : '支付金额',dataIndex : 'amount'},
						  {header : '收退款行为',dataIndex : 'payActionShow'},
						  {header : '结果',dataIndex : 'resultShow'},
						  {header : '备注说明',dataIndex : 'intro'}
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
								'订单号 ','&nbsp;&nbsp;',{ref: '../porder_no'},'&nbsp;&nbsp;',
								'支付方式 ','&nbsp;&nbsp;',{ref: '../ppay_type'},'&nbsp;&nbsp;',
								'收退款行为 ','&nbsp;&nbsp;',{ref: '../ppayAction',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '未收款'],['1', '已收款'],['2', '已退款']]
									  }),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',
								'结果 ','&nbsp;&nbsp;',{ref: '../presult',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['succ', '成功'],['proc', '处理中'],['fail', '失败']]
									  }),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectPaylog();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.porder_no.setValue("");
										this.topToolbar.ppay_type.setValue("");
										this.topToolbar.ppayAction.setValue("");
										this.topToolbar.presult.setValue("");
										this.filter={};
										this.doSelectPaylog();
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
									text : '添加收退款记录',iconCls : 'icon-add',
									handler : function() {
										this.addPaylog();
									}
								},'-',{
									text : '修改收退款记录',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updatePaylog();
									}
								},'-',{
									text : '删除收退款记录', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deletePaylog();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import',
									handler : function() {
										this.importPaylog();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportPaylog();
									}
								},'-',{
									xtype:'tbsplit',text: '查看收退款记录', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showPaylog()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hidePaylog();Km.Paylog.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Paylog.Cookie.set('View.IsFix',Km.Paylog.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Paylog.Config.PageSize,
					store: Km.Paylog.Store.paylogStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Paylog.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Paylog.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Paylog.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectPaylog();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Paylog.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Paylog.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectPaylog();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示收退款记录列表
			this.doSelectPaylog();
			Km.Paylog.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的收退款记录信息Tab页
			Km.Paylog.View.Running.viewTabs=new Km.Paylog.View.PaylogView.Tabs();
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
					this.grid.updateViewPaylog();
					if (sm.getCount() != 1){
						this.grid.hidePaylog();
						Km.Paylog.Config.View.IsShow=0;
					}else{
						if (Km.Paylog.View.IsSelectView==1){
							Km.Paylog.View.IsSelectView=0;
							this.grid.showPaylog();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Paylog.Config.View.IsShow==1){
							Km.Paylog.View.IsSelectView=1;
						}
						this.grid.hidePaylog();
						Km.Paylog.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Paylog.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showPaylog();
				this.tvpView.toggle(true);
			}else{
				this.hidePaylog();
				Km.Paylog.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Paylog.Config.View.IsFix=1;
			}else{
			   Km.Paylog.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Paylog.Config.View.IsShow=0;
				return ;
			}
			if (Km.Paylog.Config.View.IsShow==1){
			   this.hidePaylog();
			   Km.Paylog.Config.View.IsShow=0;
			}
			this.showPaylog();
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
		 * 查询符合条件的收退款记录
		 */
		doSelectPaylog : function() {
			if (this.topToolbar){
				var porder_no = this.topToolbar.porder_no.getValue();
				var ppay_type = this.topToolbar.ppay_type.getValue();
				var ppayAction = this.topToolbar.ppayAction.getValue();
				var presult = this.topToolbar.presult.getValue();
				this.filter       ={'order_no':porder_no,'pay_type':ppay_type,'payAction':ppayAction,'result':presult};
			}
			var condition = {'start':0,'limit':Km.Paylog.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServicePaylog.queryPagePaylog(condition,function(provider, response) {
				if (response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Paylog.Store.paylogStore.loadData(result);
				} else {
					Km.Paylog.Store.paylogStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的收退款记录！');
				}
			});
		},
		/**
		 * 显示收退款记录视图
		 * 显示收退款记录的视图相对收退款记录列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Paylog.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Paylog.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Paylog.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Paylog.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Paylog.View.Running.viewTabs);
					break;
			}
			Km.Paylog.Cookie.set('View.Direction',Km.Paylog.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Paylog.Config.View.IsFix==0)&&(Km.Paylog.Config.View.IsShow==1)){
					this.showPaylog();
				}
				Km.Paylog.Config.View.IsFix=1;
				Km.Paylog.View.Running.paylogGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Paylog.Config.View.IsShow=0;
				this.showPaylog();
			}
		},
		/**
		 * 显示收退款记录
		 */
		showPaylog : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择收退款记录！');
				Km.Paylog.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Paylog.Config.View.IsFix==0){
				if (Km.Paylog.View.Running.view_window==null){
					Km.Paylog.View.Running.view_window=new Km.Paylog.View.PaylogView.Window();
				}
				if (Km.Paylog.View.Running.view_window.hidden){
					Km.Paylog.View.Running.view_window.show();
					Km.Paylog.View.Running.view_window.winTabs.hideTabStripItem(Km.Paylog.View.Running.view_window.winTabs.tabFix);
					this.updateViewPaylog();
					this.tvpView.toggle(true);
					Km.Paylog.Config.View.IsShow=1;
				}else{
					this.hidePaylog();
					Km.Paylog.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Paylog.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Paylog.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Paylog.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Paylog.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Paylog.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Paylog.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Paylog.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Paylog.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Paylog.View.Running.viewTabs);
					}
					break;
			}
			this.hidePaylog();
			if (Km.Paylog.Config.View.IsShow==0){
				Km.Paylog.View.Running.viewTabs.enableCollapse();
				switch(Km.Paylog.Config.View.Direction){
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
				this.updateViewPaylog();
				this.tvpView.toggle(true);
				Km.Paylog.Config.View.IsShow=1;
			}else{
				Km.Paylog.Config.View.IsShow=0;
			}

			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏收退款记录
		 */
		hidePaylog : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Paylog.View.Running.view_window!=null){
				Km.Paylog.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前收退款记录显示信息
		 */
		updateViewPaylog : function() {
			if (Km.Paylog.View.Running.view_window!=null){
				Km.Paylog.View.Running.view_window.winTabs.tabPaylogDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Paylog.View.Running.viewTabs.tabPaylogDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建收退款记录
		 */
		addPaylog : function() {
			if (Km.Paylog.View.Running.edit_window==null){
				Km.Paylog.View.Running.edit_window=new Km.Paylog.View.EditWindow();
			}
			Km.Paylog.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Paylog.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Paylog.View.Running.edit_window.setTitle('添加收退款记录');
			Km.Paylog.View.Running.edit_window.savetype=0;
			Km.Paylog.View.Running.edit_window.paylog_id.setValue("");
			switch (Km.Paylog.Config.OnlineEditor)
			{
				case 2:
					if (Km.Paylog.View.EditWindow.KindEditor_intro) Km.Paylog.View.EditWindow.KindEditor_intro.html("");
					break
				case 3:
					break
				default:
					if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData("");
			}

			Km.Paylog.View.Running.edit_window.show();
			Km.Paylog.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑收退款记录时先获得选中的收退款记录信息
		 */
		updatePaylog : function() {
			if (Km.Paylog.View.Running.edit_window==null){
				Km.Paylog.View.Running.edit_window=new Km.Paylog.View.EditWindow();
			}
			Km.Paylog.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Paylog.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Paylog.View.Running.edit_window.setTitle('修改收退款记录');
			Km.Paylog.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Paylog.View.Running.edit_window.savetype=1;
			switch (Km.Paylog.Config.OnlineEditor)
			{
				case 2:
					if (Km.Paylog.View.EditWindow.KindEditor_intro) Km.Paylog.View.EditWindow.KindEditor_intro.html(this.getSelectionModel().getSelected().data.intro);
					break
				case 3:
					if (xhEditor_intro)xhEditor_intro.setSource(this.getSelectionModel().getSelected().data.intro);
					break
				default:
					if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(this.getSelectionModel().getSelected().data.intro);
			}

			Km.Paylog.View.Running.edit_window.show();
			Km.Paylog.View.Running.edit_window.maximize();
		},
		/**
		 * 删除收退款记录
		 */
		deletePaylog : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的收退款记录吗?', this.confirmDeletePaylog,this);
		},
		/**
		 * 确认删除收退款记录
		 */
		confirmDeletePaylog : function(btn) {
			if (btn == 'yes') {
				var del_paylog_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_paylog_ids=del_paylog_ids+selectedRows[flag].data.paylog_id+",";
				}
				ExtServicePaylog.deleteByIds(del_paylog_ids);
				this.doSelectPaylog();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出收退款记录
		 */
		exportPaylog : function() {
			ExtServicePaylog.exportPaylog(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入收退款记录
		 */
		importPaylog : function() {
			if (Km.Paylog.View.current_uploadWindow==null){
				Km.Paylog.View.current_uploadWindow=new Km.Paylog.View.UploadWindow();
			}
			Km.Paylog.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Paylog.View.Running.paylogGrid=new Km.Paylog.View.Grid();
			if (Km.Paylog.Config.View.IsFix==0){
				Km.Paylog.View.Running.paylogGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Paylog.View.Running.paylogGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Paylog.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Paylog.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前收退款记录Grid对象
		 */
		paylogGrid:null,

		/**
		 * 显示收退款记录信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Paylog.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Paylog.Init();
	/**
	 * 收退款记录数据模型获取数据Direct调用
	 */
	Km.Paylog.Store.paylogStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServicePaylog.queryPagePaylog}
	});
	/**
	 * 收退款记录页面布局
	 */
	Km.Paylog.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Paylog.View.Panel()]
	});
	Km.Paylog.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});