Ext.namespace("Kmall.Admin.Contract");
Km = Kmall.Admin.Contract;
Km.Contract={
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
			 * 显示合同的视图相对合同列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示合同信息页(或者打开新窗口)
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
		if (Km.Contract.Cookie.get('View.Direction')){
			Km.Contract.Config.View.Direction=Km.Contract.Cookie.get('View.Direction');
		}
		if (Km.Contract.Cookie.get('View.IsFix')!=null){
			Km.Contract.Config.View.IsFix=Km.Contract.Cookie.get('View.IsFix');
		}
		if (Ext.util.Cookies.get('OnlineEditor')!=null){
			Km.Contract.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
		}
	}
};

/**
 * Model:数据模型
 */
Km.Contract.Store = {
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
				{name: 'contract_name',type: 'string'},
				{name: 'supplier_id',type: 'int'},
				{name: 'sp_name',type: 'string'},
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
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					Ext.apply(options.params, Km.Contract.View.Running.contractGrid.filter);//保证分页也将查询条件带上
				}
			},
			/**
			 * 合同的状态以颜色标示出来 0-黄色：未确认 1-默认色：处理中 2-灰色：合同终止
			 */
			load : function(store,records) {
				if (Km.Contract.View.Running.contractGrid){
					var girdcount=0;
					store.each(function(r){
					if(r.data.contract_status=="0"){
						Km.Contract.View.Running.contractGrid.getView().getRow(girdcount).style.backgroundColor='#FFF4A9';
					}else if(r.data.contract_status=="1"){
						// Km.Contract.View.Running.contractGrid.getView().getRow(girdcount).style.backgroundColor='#FFF4A9';
					}else if(r.data.contract_status=="2"){
						Km.Contract.View.Running.contractGrid.getView().getRow(girdcount).style.backgroundColor='#AAAAAA';
					}
					girdcount=girdcount+1;
					});
				}
			}
		}
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
			{name: 'contactman', mapping: 'contactman'}
		])
	}),
	/**
	 * 合同订单
	 */
	contractorderStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				{name: 'contractorder_id',type: 'int'},
				{name: 'co_no',type: 'string'},
				{name: 'supplier_id',type: 'int'},
				{name: 'supplier_name',type: 'string'},
				{name: 'contract_id',type: 'int'},
				{name: 'contract_name',type: 'string'},
				{name: 'goods_name',type: 'string'},
				{name: 'amount',type: 'int'},
				{name: 'price',type: 'int'},
				{name: 'money',type: 'int'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		})
	}),
	/**
	 * 合同附件
	 */
	confilesStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				{name: 'confiles_id',type: 'int'},
				{name: 'contract_id',type: 'string'},
				{name: 'contract_name',type: 'string'},
				{name: 'origin_name',type: 'string'},
				{name: 'file_name',type: 'string'},
				{name: 'file_path',type: 'string'},
				{name: 'file_size',type: 'string'},
				{name: 'file_type',type: 'string'},
				{name: 'intro',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		})
	}),
	/**
	 * 合同日志
	 */
	contractlogStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				{name: 'contractlog_id',type: 'int'},
				{name: 'contract_id',type: 'int'},
				{name: 'money',type: 'float'},
				{name: 'operater',type: 'string'},
				{name: 'actionType',type: 'string'},
				{name: 'actionTypeShow',type: 'string'},
				{name: 'intro',type: 'string'},
				{name: 'commitTimeShow',type: 'date',dateFormat:'Y-m-d H:i:s'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		})
	})
};

/**
 * View:合同显示组件
 */
Km.Contract.View={
	/**
	 * 编辑窗口：新建或者修改合同
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
						switch (Km.Contract.Config.OnlineEditor)
						{
							case 1:
								ckeditor_replace_terms();
								break
							case 2:
								Km.Contract.View.EditWindow.KindEditor_terms = KindEditor.create('textarea[name="terms"]',{width:'98%',minHeith:'350px', filterMode:true});
								break
							case 3:
								pageInit_terms();
								break
							default:
								this.editForm.terms.setWidth("98%");
								pageInit_ue_terms();
						}
					}
				},
				items : [
					new Ext.form.FormPanel({
						ref:'editForm',layout:'form',
						labelWidth : 100,labelAlign : "center",
						bodyStyle : 'padding:5px 5px 0',align : "center",grid:this,
						api : {},
						defaults : {
							xtype : 'textfield',anchor:'98%'
						},
						items : [
							{xtype: 'hidden',  name : 'contract_id',ref:'../contract_id'},
							{fieldLabel : '合同号',name : 'contract_no'},
							{fieldLabel : '合同名称',name : 'contract_name'},
							{xtype: 'hidden',name : 'supplier_id',ref:'../supplier_id'},
							{
								 fieldLabel : '供应商',xtype: 'combo',name : 'sp_name',ref : '../sp_name',
								 store:Km.Contract.Store.supplierStore,emptyText: '请选择供应商',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Contract.Config.PageSize,
								 displayField:'sp_name',grid:this,
								 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
								 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
								 tpl:new Ext.XTemplate(
									 '<tpl for="."><div class="search-item">',
										 '<h3>{sp_name}</h3>',
									 '</div></tpl>'
								 ),
								 onSelect:function(record,index){
									 if(this.fireEvent('beforeselect', this, record, index) !== false){
										this.grid.supplier_id.setValue(record.data.supplier_id);
										this.grid.sp_name.setValue(record.data.sp_name);
										this.grid.s_party.setValue(record.data.sp_name);
										this.collapse();
									 }
								 }
							},
							{fieldLabel : '公司名',name : 'company'},
							{fieldLabel : '合同签订时间',name : 'confirmTime',xtype : 'datefield',format : "Y-m-d"},
							{fieldLabel : '合同甲方',name : 'f_party', value : 'Kmall'},
							{fieldLabel : '合同乙方',name : 's_party',ref : '../s_party'},
							{fieldLabel : '经办人',name : 'operator'},
							{fieldLabel : '签订合同的金额',name : 'amount'},
							{fieldLabel : '备注',name : 'terms',xtype : 'textarea',id:'terms',ref:'terms'},
							{fieldLabel : '生效日期',name : 'effective_date',xtype : 'datefield',format : "Y-m-d"},
							{fieldLabel : '到期日期',name : 'expire_date',xtype : 'datefield',format : "Y-m-d"}
						]
					})
				],
				buttons : [ {
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {
						switch (Km.Contract.Config.OnlineEditor)
						{
							case 1:
								if (CKEDITOR.instances.terms)this.editForm.terms.setValue(CKEDITOR.instances.terms.getData());
								break
							case 2:
								if (Km.Contract.View.EditWindow.KindEditor_terms)this.editForm.terms.setValue(Km.Contract.View.EditWindow.KindEditor_terms.html());
								break
							case 3:
								if (xhEditor_terms)this.editForm.terms.setValue(xhEditor_terms.getSource());
								break
							default:
								if (ue_terms)this.editForm.terms.setValue(ue_terms.getContent());
						}
						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;
						if (this.savetype==0){
							this.editForm.api.submit=ExtServiceContract.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Contract.View.Running.contractGrid.doSelectContract();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceContract.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Contract.View.Running.contractGrid.bottomToolbar.doRefresh();
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
						this.editForm.form.loadRecord(Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected());
						switch (Km.Contract.Config.OnlineEditor)
						{
							case 1:
								if (CKEDITOR.instances.terms)CKEDITOR.instances.terms.setData(Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data.terms);
								break
							case 2:
								if (Km.Contract.View.EditWindow.KindEditor_terms)Km.Contract.View.EditWindow.KindEditor_terms.html(Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data.terms);
								break
							case 3:
								if (xhEditor_terms)xhEditor_terms.setSource(Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data.terms);
								break
							default:
								if (ue_terms)ue_terms.setContent(Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data.terms);
						}

					}
				}]
			}, config);
			Km.Contract.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示合同详情
	 */
	ContractView:{
		/**
		 * Tab页：容器包含显示与合同所有相关的信息
		 */
		Tabs:Ext.extend(Ext.TabPanel,{
			constructor : function(config) {
				config = Ext.apply({
					region : 'south',collapseMode : 'mini',header:false,
					split : true,activeTab: 1, tabPosition:"top",resizeTabs : true,
					enableTabScroll : true,margins : '0 3 3 0',tabWidth:"auto",
					defaults : {
						autoScroll : true,
						layout:'fit'
					},
					listeners:{
						beforetabchange:function(tabs,newtab,currentTab){
							if (tabs.tabFix==newtab){
								if (Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择合同！');
									return false;
								}
								Km.Contract.Config.View.IsShow=1;
								Km.Contract.View.Running.contractGrid.showContract();
								Km.Contract.View.Running.contractGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Contract.View.ContractView.Tabs.superclass.constructor.call(this, config);
				Km.Contract.View.Running.contractlogGrid=new Km.Contract.View.ContractlogView.Grid();
				Km.Contract.View.Running.contractorderGrid=new Km.Contract.View.ContractorderView.Grid();
				Km.Contract.View.Running.confilesGrid=new Km.Contract.View.ConfilesView.Grid();
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Contract.Config.View.Direction==1)||(Km.Contract.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabContractDetail',iconCls:'tabs',tabWidth:100,
					 tpl: [
					  '<table class="viewdoblock">',
						 '<tr class="entry"><td class="head">合同号</td><td class="content">{contract_no}</td></tr>',
						 '<tr class="entry"><td class="head">合同名称</td><td class="content">{contract_name}</td></tr>',
						 '<tr class="entry"><td class="head">供应商</td><td class="content">{sp_name}</td></tr>',
						 '<tr class="entry"><td class="head">公司名</td><td class="content">{company}</td></tr>',
						 '<tr class="entry"><td class="head">合同状态</td><td class="content">{contract_statusShow}</td></tr>',
						 '<tr class="entry"><td class="head">合同签订时间</td><td class="content">{confirmTime:date("Y-m-d")}</td></tr>',
						 '<tr class="entry"><td class="head">合同甲方</td><td class="content">{f_party}</td></tr>',
						 '<tr class="entry"><td class="head">合同乙方</td><td class="content">{s_party}</td></tr>',
						 '<tr class="entry"><td class="head">经办人</td><td class="content">{operator}</td></tr>',
						 '<tr class="entry"><td class="head">签订合同的金额</td><td class="content">{amount}</td></tr>',
						 '<tr class="entry"><td class="head">备注</td><td class="content">{terms}</td></tr>',
						 '<tr class="entry"><td class="head">生效日期</td><td class="content">{effective_date:date("Y-m-d")}</td></tr>',
						 '<tr class="entry"><td class="head">到期日期</td><td class="content">{expire_date:date("Y-m-d")}</td></tr>',
					 '</table>'
					 ]
					}
				);
				this.add(
				/*
					{title: '合同订单',iconCls:'tabs',tabWidth:150,
					 items:[Km.Contract.View.Running.contractorderGrid]
					},
				*/
					{title: '合同附件',iconCls:'tabs',tabWidth:150,
					 items:[Km.Contract.View.Running.confilesGrid]},
					{title: '合同日志',iconCls:'tabs',tabWidth:150,
					 items:[Km.Contract.View.Running.contractlogGrid]
					}
				);
			}
		}),
		/**
		 * 窗口:显示合同信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看合同",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Contract.View.ContractView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Contract.Config.View.IsShow=0;
							Km.Contract.View.Running.contractGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Contract.Config.View.IsShow=0;
							Km.Contract.View.Running.contractGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Contract.View.Running.contractGrid.addContract();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Contract.View.Running.contractGrid.updateContract();}
					}]
				}, config);
				Km.Contract.View.ContractView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 视图：合同订单列表
	 */
	ContractorderView:{
		/**
		 * 编辑窗口：新建或者修改合同订单
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
							ckeditor_replace_goods_name();

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
								{xtype: 'hidden',  name : 'contractorder_id',ref:'../contractorder_id'},
								{xtype: 'hidden',  name : 'contract_id',ref:'../co_contract_id'},
								{fieldLabel : '合同订单号(<font color=red>*</font>)',name : 'co_no',allowBlank : false},
								{xtype: 'hidden',name : 'supplier_id',ref:'../co_supplier_id'},
								{fieldLabel : '供应商',cls : 'labelfield',ref:'../co_supplier_name',readOnly : true},
								{xtype: 'hidden',name : 'contract_id',ref:'../co_contract_id'},
								{fieldLabel : '合同',cls : 'labelfield',ref:'../co_contract_name',readOnly : true},
								{fieldLabel : '产品名称',name : 'goods_name',xtype : 'textarea',id:'goods_name',ref:'goods_name'},
								{fieldLabel : '计划入库数量',name : 'amount',id : 'amount',xtype:'numberfield',
								 listeners : {
								 'change' : function() {
									 if (Ext.getCmp('price').getValue()&&Ext.getCmp('amount').getValue()){
										Ext.getCmp('money').setValue(Ext.getCmp('price').getValue()* Ext.getCmp('amount').getValue());
									 }
								 }
								 }},
								{fieldLabel : '单价',name : 'price',id : 'price',xtype:'numberfield',
								 listeners : {
								 'change' : function() {
									 if (Ext.getCmp('price').getValue()&&Ext.getCmp('amount').getValue()){
										Ext.getCmp('money').setValue(Ext.getCmp('price').getValue()* Ext.getCmp('amount').getValue());
									 }
								 }
								 }},
								{fieldLabel : '合同金额',name : 'money',id:'money',xtype:'numberfield'}
							]
						})
					],
					buttons : [ {
						text: "",ref : "../saveBtn",scope:this,
						handler : function() {
							if (CKEDITOR.instances.goods_name){
								this.editForm.goods_name.setValue(CKEDITOR.instances.goods_name.getData());
							}

							if (!this.editForm.getForm().isValid()) {
								return;
							}
							editWindow=this;
							if (this.savetype==0){
								this.editForm.api.submit=ExtServiceContractorder.save;
								this.editForm.getForm().submit({
									success : function(form, action) {
										Ext.Msg.alert("提示", "保存成功！");
										Km.Contract.View.Running.contractorderGrid.doSelectContractorder();
										form.reset();
										editWindow.hide();
									},
									failure : function(form, action) {
										Ext.Msg.alert('提示', '失败');
									}
								});
							}else{
								this.editForm.api.submit=ExtServiceContractorder.update;
								this.editForm.getForm().submit({
									success : function(form, action) {
										Ext.Msg.alert("提示", "修改成功！");
										Km.Contract.View.Running.contractorderGrid.doSelectContractorder();
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
							this.editForm.form.loadRecord(Km.Contract.View.Running.contractorderGrid.getSelectionModel().getSelected());
							if (CKEDITOR.instances.goods_name){
								CKEDITOR.instances.goods_name.setData(Km.Contract.View.Running.contractorderGrid.getSelectionModel().getSelected().data.goods_name);
							}

						}
					}]
				}, config);
				Km.Contract.View.EditWindow.superclass.constructor.call(this, config);
			}
		}),
		/**
		 * 视图：合同订单列表
		 */
		Grid:Ext.extend(Ext.grid.GridPanel, {
			constructor : function(config) {
				config = Ext.apply({
					store : Km.Contract.Store.contractorderStore,sm : this.sm,
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
							{header : '合同订单号',dataIndex : 'co_no'},
							{header : '供应商',dataIndex : 'supplier_name'},
							{header : '合同名称',dataIndex : 'contract_name'},
							{header : '产品名称',dataIndex : 'goods_name'},
							{header : '产品数量',dataIndex : 'amount'},
							{header : '单价',dataIndex : 'price'},
							{header : '合同金额',dataIndex : 'money'}
						]
					}),
					tbar : {
						xtype : 'container',layout : 'anchor',
						height : 27,style:'font-size:14px',
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
										text : '添加',iconCls : 'icon-add',
										handler : function() {
											this.addContractorder();
										}
									},'-',{
										text : '修改',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
										handler : function() {
											this.updateContractorder();
										}
									},'-',{
										text : '删除', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
										handler : function() {
											this.deleteContractorder();
										}
									},'-']}
						)]
					}
				}, config);
				Km.Contract.View.ContractorderView.Grid.superclass.constructor.call(this, config);
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
					}
				}
			}),
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
			 * 查询符合条件的合同订单
			 */
			doSelectContractorder : function() {
				if (Km.Contract.View.Running.contractGrid&&Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected()){
					var contract_id = Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data.contract_id;
					ExtServiceContractorder.queryByContractID(contract_id,function(provider, response) {
						if (response.result){
							if (response.result.data) {
								var result		   = new Array();
								result['data']	   =response.result.data;
								Km.Contract.Store.contractorderStore.loadData(result);
							} else {
								Km.Contract.Store.contractorderStore.removeAll();
								Ext.Msg.alert('提示', '无符合条件的合同订单！');
							}
						}
					});
				}
			},
			/**
			 * 新建合同订单
			 */
			addContractorder : function() {
				if (Km.Contract.View.Running.contractGrid&&Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected()){
					var contractData=Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data;
					if(contractData.contract_status=="2"){
						Ext.Msg.alert("提示", "已结束的合同不能再添加合同订单！");
						return;
					}
				}
				if (Km.Contract.View.Running.edit_contractorder_window==null){
					Km.Contract.View.Running.edit_contractorder_window=new Km.Contract.View.ContractorderView.EditWindow();
				}
				Km.Contract.View.Running.edit_contractorder_window.resetBtn.setVisible(false);
				Km.Contract.View.Running.edit_contractorder_window.saveBtn.setText('保 存');
				Km.Contract.View.Running.edit_contractorder_window.setTitle('添加合同订单');
				Km.Contract.View.Running.edit_contractorder_window.savetype=0;
				Km.Contract.View.Running.edit_contractorder_window.contractorder_id.setValue("");
				if (CKEDITOR.instances.goods_name){
					CKEDITOR.instances.goods_name.setData("");
				}
				if (Km.Contract.View.Running.contractGrid&&Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected()){
					var contractData=Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data;
					Km.Contract.View.Running.edit_contractorder_window.co_contract_id.setValue(contractData.contract_id);
					Km.Contract.View.Running.edit_contractorder_window.co_contract_name.setValue(contractData.contract_name);
					Km.Contract.View.Running.edit_contractorder_window.co_supplier_id.setValue(contractData.supplier_id);
					Km.Contract.View.Running.edit_contractorder_window.co_supplier_name.setValue(contractData.sp_name);
				}
				Km.Contract.View.Running.edit_contractorder_window.show();
				Km.Contract.View.Running.edit_contractorder_window.maximize();
			},
			/**
			 * 编辑合同订单时先获得选中的合同订单信息
			 */
			updateContractorder : function() {
				if (Km.Contract.View.Running.contractGrid&&Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected()){
					var contractData=Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data;
					if(contractData.contract_status=="2"){
						Ext.Msg.alert("提示", "已结束的合同不能再修改合同订单！");
						return;
					}
				}
				if (Km.Contract.View.Running.edit_contractorder_window==null){
					Km.Contract.View.Running.edit_contractorder_window=new Km.Contract.View.ContractorderView.EditWindow();
				}
				Km.Contract.View.Running.edit_contractorder_window.saveBtn.setText('修 改');
				Km.Contract.View.Running.edit_contractorder_window.resetBtn.setVisible(true);
				Km.Contract.View.Running.edit_contractorder_window.setTitle('修改合同订单');
				Km.Contract.View.Running.edit_contractorder_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
				Km.Contract.View.Running.edit_contractorder_window.savetype=1;
				if (CKEDITOR.instances.goods_name){
					CKEDITOR.instances.goods_name.setData(this.getSelectionModel().getSelected().data.goods_name);
				}
				if (Km.Contract.View.Running.contractGrid&&Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected()){
					var contractData=Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data;
					Km.Contract.View.Running.edit_contractorder_window.co_contract_id.setValue(contractData.contract_id);
					Km.Contract.View.Running.edit_contractorder_window.co_contract_name.setValue(contractData.contract_name);
					Km.Contract.View.Running.edit_contractorder_window.co_supplier_id.setValue(contractData.supplier_id);
					Km.Contract.View.Running.edit_contractorder_window.co_supplier_name.setValue(contractData.sp_name);
				}

				Km.Contract.View.Running.edit_contractorder_window.show();
				Km.Contract.View.Running.edit_contractorder_window.maximize();
			},
			/**
			 * 删除合同订单
			 */
			deleteContractorder : function() {
				if (Km.Contract.View.Running.contractGrid&&Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected()){
					var contractData=Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data;
					if(contractData.contract_status=="2"){
						Ext.Msg.alert("提示", "已结束的合同不能再删除合同订单！");
						return;
					}
				}
				Ext.Msg.confirm('提示', '确实要删除所选的合同订单吗?', this.confirmDeleteContractorder,this);
			},
			/**
			 * 确认删除合同订单
			 */
			confirmDeleteContractorder : function(btn) {
				if (btn == 'yes') {
					var del_contractorder_ids ="";
					var selectedRows	= this.getSelectionModel().getSelections();
					for ( var flag = 0; flag < selectedRows.length; flag++) {
						del_contractorder_ids=del_contractorder_ids+selectedRows[flag].data.contractorder_id+",";
					}
					ExtServiceContractorder.deleteByIds(del_contractorder_ids);
					this.doSelectContractorder();
					Ext.Msg.alert("提示", "删除成功！");
				}
			}
		})
	},
	/**
	 * 视图：合同附件列表
	 */
	ConfilesView:{
		/**
		 * 编辑窗口：修改合同附件信息
		 */
		EditWindow:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					closeAction : "hide",title:"修改合同附件信息",
					constrainHeader:true,maximizable: true,collapsible: true,
					width : 680,height : 550,minWidth : 400,minHeight : 450,
					layout : 'fit',plain : true,buttonAlign : 'center',
					defaults : {
						autoScroll : true
					},
					listeners:{
						beforehide:function(){
							this.editForm.form.getEl().dom.reset();
						},
						afterrender:function(){
                            switch (Km.Contract.Config.OnlineEditor)
                            {
                                case 1:
                                    ckeditor_replace_intro();
                                    break
                                case 2:
                                    Km.Contract.View.ConfilesView.EditWindow.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
                                    break
                                case 3:
                                    pageInit_intro();
                                    break
                                default:
                                    this.editForm.intro.setWidth("98%");
                                    pageInit_ue_intro();
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
								{xtype: 'hidden',  name : 'confiles_id',ref:'../confiles_id'},
								{fieldLabel : '合同',xtype : 'displayfield',ref:'../cf_contract_name'},
								{fieldLabel : '原名称',xtype : 'displayfield',ref:'../cf_origin_name'},
								{fieldLabel : '文件实际名称',xtype : 'displayfield',ref:'../cf_file_path'},
								{fieldLabel : '文件大小',xtype : 'displayfield',ref:'../cf_file_size'},
								{fieldLabel : '文件类型',xtype : 'displayfield',ref:'../cf_file_type'},
								{fieldLabel : '文件显示名',name : 'file_name'},
								{fieldLabel : '备注说明',name : 'intro',xtype : 'textarea',id:'intro',ref:'intro'}
							]
						})
					],
					buttons : [ {
						text: "修 改",ref : "../saveBtn",scope:this,
						handler : function() {
                            switch (Km.Contract.Config.OnlineEditor)
                            {
                                case 1:
                                    if (CKEDITOR.instances.intro)this.editForm.intro.setValue(CKEDITOR.instances.intro.getData());
                                    break
                                case 2:
                                    if (Km.Contract.View.ConfilesView.EditWindow.KindEditor_intro)this.editForm.intro.setValue(Km.Contract.View.ConfilesView.EditWindow.KindEditor_intro.html());
                                    break
                                case 3:
                                    if (xhEditor_intro)this.editForm.intro.setValue(xhEditor_intro.getSource());
                                    break
                                default:
                                    if (ue_intro)this.editForm.intro.setValue(ue_intro.getContent());
                            }

							if (!this.editForm.getForm().isValid()) {
								return;
							}
							editWindow=this;
							this.editForm.api.submit=ExtServiceConfiles.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Contract.View.Running.confilesGrid.doSelectConfiles();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});

						}
					}, {
						text : "取 消",scope:this,
						handler : function() {
							this.hide();
						}
					}, {
						text : "重 置",ref:'../resetBtn',scope:this,
						handler : function() {
                            this.editForm.form.loadRecord(Km.Contract.View.Running.confilesGrid.getSelectionModel().getSelected());
                            switch (Km.Contract.Config.OnlineEditor)
                            {
                                case 1:
                                    if (CKEDITOR.instances.intro)CKEDITOR.instances.intro.setData(Km.Contract.View.Running.confilesGrid.getSelectionModel().getSelected().data.intro);
                                    break
                                case 2:
                                    if (Km.Contract.View.ConfilesView.EditWindow.KindEditor_intro)Km.Contract.View.ConfilesView.EditWindow.KindEditor_intro.html(Km.Contract.View.Running.confilesGrid.getSelectionModel().getSelected().data.intro);
                                    break
                                case 3:
                                    if (xhEditor_intro)xhEditor_intro.setSource(Km.Contract.View.Running.confilesGrid.getSelectionModel().getSelected().data.intro);
                                    break
                                default:
                                    if (ue_intro)ue_intro.setContent(Km.Contract.View.Running.confilesGrid.getSelectionModel().getSelected().data.intro);
                            }

						}
					}]
				}, config);
				Km.Contract.View.ConfilesView.EditWindow.superclass.constructor.call(this, config);
			}
		}),
		/**
		 * 窗口：上传文件
		 */
		UploadWindow : Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title : '合同附件上传',
					width : 400,height : 150,minWidth : 300,minHeight : 150,
					layout : 'fit',plain : true,closeAction : "hide",
					bodyStYle : 'padding:5px;',buttonAlign : 'center',
					items : [
						new Ext.form.FormPanel({
							ref:'uploadFileForm',fileUpload : true,layout:'form',
							width:500,labelWidth: 50,autoHeight: true,
							bodyStyle: 'padding: 10px 10px 10px 10px;',
							defaults: {
								anchor: '95%',allowBlank: false,msgTarget: 'side'
							},
							items : [
								{xtype : 'hidden',name : 'contract_id',ref:"contractid"},
								{fieldLabel : '合同',xtype : 'displayfield',ref:'contract_name',readOnly : true},
								{xtype : 'fileuploadfield',fieldLabel : '附 件',
								 id:'upload_Contractfile',name : 'upload_Contractfile',ref:'upload_Contractfile',emptyText: '请上传合同附件',
								 buttonText: '',buttonCfg: {
									iconCls: 'upload-icon'
								 }
							}]
						})
					],
					buttons : [{
						text : '上 传',scope:this,
						handler : function() {
							uploadWindow=this;
							validationExpression   =/([\u4E00-\u9FA5]|\w)+(.pdf|.PDF|.txt|.TXT|.doc|.DOC|.docx|.DOCX|.xlsx|.XLSX|.xls|.XLS)$/;
							var isValidExcelFormat = new RegExp(validationExpression);
							var result			 = isValidExcelFormat.test(this.uploadFileForm.upload_Contractfile.getValue());
							if (!result){
								Ext.Msg.alert('提示', '请上传合法的合同附件，后缀名为pdf,doc,docx,txt,xls或者xlsx！');
								return;
							}
							if (this.uploadFileForm.getForm().isValid()) {
								Ext.MessageBox.show({
									title : '请等待',msg : '文件正在上传中，请稍后...',progressText : '',
									width : 300,progress : true,closable : true,
									icon : Ext.MessageBox.WARNING,
									animEl : 'loading'
								});
								this.uploadFileForm.getForm().submit({
									url : 'index.php?go=admin.upload.uploadContractFiles',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadFileForm.upload_Contractfile.setValue('');
										Km.Contract.View.Running.confilesGrid.doSelectConfiles();
									},
									failure : function(form, action) {
										Ext.Msg.alert('错误', action.result.msg);
									}
								});
							}
						}
					}, {
						text : '取 消',scope:this,
						handler : function() {
							Ext.getCmp('upload_Contractfile').setValue('');
							this.hide();
						}
					}]
				}, config);
				Km.Contract.View.ConfilesView.UploadWindow.superclass.constructor.call(this, config);
			}
		}),
		/**
		 * 视图：合同文件列表
		 */
		Grid:Ext.extend(Ext.grid.GridPanel, {
			constructor : function(config) {
				config = Ext.apply({
					/**
					 * 查询条件
					 */
					filter:null,
					store : Km.Contract.Store.confilesStore,
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
							{header : '合同',dataIndex : 'contract_name'},
							{header : '原名称',dataIndex : 'origin_name'},
							{header : '文件显示名',dataIndex : 'file_name'},
							{header : '文件实际路径',dataIndex : 'file_path'},
							{header : '文件大小',dataIndex : 'file_size'},
							{header : '文件类型',dataIndex : 'file_type'},
							{header : '备注说明',dataIndex : 'intro'}
						]
					}),
					tbar : {
						xtype : 'container',layout : 'anchor',
						height : 27,style:'font-size:14px',
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
										text : '上传附件',iconCls : 'icon-add',
										handler : function() {
											this.addConfiles();
										}
									},'-',{
										text : '下载附件',iconCls : 'page_edit',ref: '../../btnDownload',disabled : true,
										handler : function(){
											this.downloadConfiles();
										}
									},{
										text : '修改附件信息',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
										handler : function() {
											this.updateConfiles();
										}
									},'-',{
										text : '删除附件', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
										handler : function() {
											this.deleteConfiles();
										}
									},'-']}
						)]
					}
				}, config);
				//初始化显示合同文件列表
				this.doSelectConfiles();
				Km.Contract.View.Grid.superclass.constructor.call(this, config);
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
						this.grid.btnDownload.setDisabled(sm.getCount() != 1);
					}
				}
			}),
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
			 * 查询符合条件的合同文件
			 */
			doSelectConfiles : function() {
				if (Km.Contract.View.Running.contractGrid&&Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected()){
					var contract_id = Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data.contract_id;
					ExtServiceConfiles.queryConfiles(contract_id,function(provider, response) {
						if (response.result.data) {
							var result		   = new Array();
							result['data']	   =response.result.data;
							Km.Contract.Store.confilesStore.loadData(result);
						} else {
							Km.Contract.Store.confilesStore.removeAll();
							Ext.Msg.alert('提示', '无符合条件的合同文件！');
						}
					});
				}
			},
			/**
			 * 新建合同文件
			 */
			addConfiles : function() {
				if (Km.Contract.View.Running.contractGrid&&Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected()){
					var contract_id  = Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data.contract_id;
					var contract_name= Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data.contract_name;
					if (Km.Contract.View.Running.upload_window==null){
						Km.Contract.View.Running.upload_window=new Km.Contract.View.ConfilesView.UploadWindow();
					}
					Km.Contract.View.Running.upload_window.uploadFileForm.contractid.setValue(contract_id);
					Km.Contract.View.Running.upload_window.uploadFileForm.contract_name.setValue(contract_name);
					Km.Contract.View.Running.upload_window.show();
				}else{
					Ext.Msg.alert('提示', '请先选择合同！');
				}
			},
			/**
			 * 编辑合同文件时先获得选中的合同文件信息
			 */
			updateConfiles : function() {
				if (Km.Contract.View.Running.edit_confiles_window==null){
					Km.Contract.View.Running.edit_confiles_window=new Km.Contract.View.ConfilesView.EditWindow();
				}
				Km.Contract.View.Running.edit_confiles_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());

				var data = this.getSelectionModel().getSelected().data;
				switch (Km.Contract.Config.OnlineEditor)
				{
					case 1:
						if (CKEDITOR.instances.intro)CKEDITOR.instances.intro.setData(data.intro);
						break
					case 2:
						if (Km.Contract.View.ContractlogView.EditWindow.KindEditor_intro)Km.Contract.View.ContractlogView.EditWindow.KindEditor_intro.html(data.intro);
						break
					case 3:
						if (xhEditor_intro)xhEditor_intro.setSource(data.intro);
						break
					default:
						if (ue_intro)ue_intro.ready(function(){ue_intro.setContent(data.intro);});
				}

				if (Km.Contract.View.Running.confilesGrid&&Km.Contract.View.Running.confilesGrid.getSelectionModel().getSelected()){
					var confile_data=Km.Contract.View.Running.confilesGrid.getSelectionModel().getSelected().data;

					Km.Contract.View.Running.edit_confiles_window.cf_contract_name.setValue(confile_data.contract_name);
					Km.Contract.View.Running.edit_confiles_window.cf_origin_name.setValue(confile_data.origin_name);
					Km.Contract.View.Running.edit_confiles_window.cf_file_path.setValue(confile_data.file_path);
					Km.Contract.View.Running.edit_confiles_window.cf_file_size.setValue(confile_data.file_size);
					Km.Contract.View.Running.edit_confiles_window.cf_file_type.setValue(confile_data.file_type);

					Km.Contract.View.Running.edit_confiles_window.show();
					//Km.Contract.View.Running.edit_confiles_window.maximize();
				}else{
					Ext.Msg.alert('提示', '请先选择合同！');
				}
			},
			/**
			 * 下载合同附件
			 */
			downloadConfiles:function() {
				if (Km.Contract.View.Running.confilesGrid&&Km.Contract.View.Running.confilesGrid.getSelectionModel().getSelected()){
					var confile_file_path=Km.Contract.View.Running.confilesGrid.getSelectionModel().getSelected().data.file_path;
					window.open("upload/contract/files/" + confile_file_path);
				}else{
					Ext.Msg.alert('提示', '没有可以下载的合同附件！');
				}
			},
			/**
			 * 删除合同文件
			 */
			deleteConfiles : function() {
				Ext.Msg.confirm('提示', '确实要删除所选的合同附件吗?', this.confirmDeleteConfiles,this);
			},
			/**
			 * 确认删除合同文件
			 */
			confirmDeleteConfiles : function(btn) {
				if (btn == 'yes') {
					var del_confiles_ids ="";
					var selectedRows	= this.getSelectionModel().getSelections();
					for ( var flag = 0; flag < selectedRows.length; flag++) {
						del_confiles_ids=del_confiles_ids+selectedRows[flag].data.confiles_id+",";
					}
					ExtServiceConfiles.deleteByIds(del_confiles_ids);
					this.doSelectConfiles();
					Ext.Msg.alert("提示", "删除成功！");
				}
			}
		})
	},
	/**
	 * 视图：合同日志列表
	 */
	ContractlogView:{
		/**
		 * 视图：合同日志列表
		 */
		Grid:Ext.extend(Ext.grid.GridPanel, {
			constructor : function(config) {
				config = Ext.apply({
					store : Km.Contract.Store.contractlogStore,
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
						  {header : '合同金额',dataIndex : 'money'},
						  {header : '操作人员',dataIndex : 'operater'},
						  {header : '行为',dataIndex : 'actionTypeShow'},
						  {header : '操作时间',dataIndex : 'commitTimeShow',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')}

						]
					})
				}, config);
				Km.Contract.View.ContractlogView.Grid.superclass.constructor.call(this, config);
			},
			/**
			 * 查询符合条件的合同订单
			 */
			doSelectContractlog : function() {
				if (Km.Contract.View.Running.contractGrid&&Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected()){
					var contract_id = Km.Contract.View.Running.contractGrid.getSelectionModel().getSelected().data.contract_id;
					var condition = {'contract_id':contract_id};
					ExtServiceContractlog.queryPageContractlog(condition,function(provider, response) {
						if (response.result){
							if (response.result.data) {
								var result		   = new Array();
								result['data']	   =response.result.data;
								Km.Contract.Store.contractlogStore.loadData(result);
							} else {
								Km.Contract.Store.contractlogStore.removeAll();
								Ext.Msg.alert('提示', '无符合条件的合同订单！');
							}
						}
					});
				}
			}
		})
	},
	/**
	 * 窗口：批量上传合同
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量合同上传',
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
							emptyText: '请上传合同Excel文件',buttonText: '',
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
							validationExpression   =/\w+(.xlsx|.XLSX|.xls|.XLS)$/;
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
									url : 'index.php?go=admin.upload.uploadContract',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Contract.View.Running.contractGrid.doSelectContract();
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
			Km.Contract.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：合同列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Contract.Store.contractStore,
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
						{header : '合同号(<font color=red>*</font>)',allowBlank : false,dataIndex : 'contract_no'},
						{header : '合同名称(<font color=red>*</font>)',allowBlank : false,dataIndex : 'contract_name'},
						{header : '供应商',dataIndex : 'sp_name'},
						{header : '公司名',dataIndex : 'company'},
						{header : '合同状态',dataIndex : 'contract_statusShow'},
						{header : '合同签订时间',dataIndex : 'confirmTime',renderer:Ext.util.Format.dateRenderer('Y-m-d')},
						{header : '合同甲方(<font color=red>*</font>)',allowBlank : false,dataIndex : 'f_party'},
						{header : '合同乙方(<font color=red>*</font>)',allowBlank : false,dataIndex : 's_party'},
						{header : '经办人(<font color=red>*</font>)',dataIndex : 'operator'},
						{header : '签订合同的金额',dataIndex : 'amount'},
						{header : '备注',dataIndex : 'terms'},
						{header : '生效日期',dataIndex : 'effective_date',renderer:Ext.util.Format.dateRenderer('Y-m-d')},
						{header : '到期日期',dataIndex : 'expire_date',renderer:Ext.util.Format.dateRenderer('Y-m-d')}
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
								'供应商 ','&nbsp;&nbsp;',{ref: '../csupplier_id',xtype: 'combo',
									 store:Km.Contract.Store.supplierStore,hiddenName : 'supplier_id',
									 emptyText: '请选择供应商',itemSelector: 'div.search-item',
									 loadingText: '查询中...',width:280,pageSize:Km.Contract.Config.PageSize,
									 displayField:'sp_name',valueField:'supplier_id',
									 mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
									 forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
									 tpl:new Ext.XTemplate(
												'<tpl for="."><div class="search-item">',
													'<h3>{sp_name}</h3>',
												'</div></tpl>'
									 )
								},'&nbsp;&nbsp;',
								'合同号　',{ref: '../ccontract_no'},'&nbsp;&nbsp;',
								'合同名称　',{ref: '../ccontract_name'},'&nbsp;&nbsp;',
								'合同状态　',{ref: '../ccontract_status',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '未确认'],['1', '执行中'],['2', '结束']]
									}),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectContract();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.ccontract_no.setValue("");
										this.topToolbar.ccontract_name.setValue("");
										this.topToolbar.ccontract_status.setValue("");
										this.topToolbar.csupplier_id.setValue("");
										this.filter={};
										this.doSelectContract();
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
									text : '添加合同',iconCls : 'icon-add',
									handler : function() {
										this.addContract();
									}
								},'-',{
									text : '修改合同',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateContract();
									}
								},'-',{
									text : '删除合同', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteContract();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import',
									handler : function() {
										this.importContract();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportContract();
									}
								},'-',{
									xtype:'tbsplit',text: '查看合同', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showContract()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideContract();Km.Contract.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Contract.Cookie.set('View.IsFix',Km.Contract.Config.View.IsFix);}}
										]}
								},'-',{
									text : '合同生效',ref:"../../btnValidateContract",
									iconCls : 'page_edit',disabled : true,
									handler : function() {
										this.updateContractStatus(1);
									}
								},'-',{
									text : '合同终止',ref:"../../btnEndContract",
									iconCls : 'page_edit',disabled : true,
									handler : function() {
										this.updateContractStatus(2);
									}
								},new Ext.Toolbar.Fill(),'黄色:未确认,灰色:合同终止'
						]}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Contract.Config.PageSize,
					store: Km.Contract.Store.contractStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Contract.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Contract.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Contract.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectContract();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Contract.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Contract.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectContract();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示合同列表
			this.doSelectContract();
			Km.Contract.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的合同信息Tab页
			Km.Contract.View.Running.viewTabs=new Km.Contract.View.ContractView.Tabs();
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
					this.grid.btnValidateContract.setDisabled(sm.getCount() != 1);
					this.grid.btnEndContract.setDisabled(sm.getCount() != 1);
				},
				rowselect: function(sm, rowIndex, record) {
					this.grid.updateViewContract();
					if (sm.getCount() != 1){
						this.grid.hideContract();
						Km.Contract.Config.View.IsShow=0;
					}else{
						if (Km.Contract.View.IsSelectView==1){
							Km.Contract.View.IsSelectView=0;
							this.grid.showContract();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Contract.Config.View.IsShow==1){
							Km.Contract.View.IsSelectView=1;
						}
						this.grid.hideContract();
						Km.Contract.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Contract.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showContract();
				this.tvpView.toggle(true);
			}else{
				this.hideContract();
				Km.Contract.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Contract.Config.View.IsFix=1;
			}else{
			   Km.Contract.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Contract.Config.View.IsShow=0;
				return ;
			}
			if (Km.Contract.Config.View.IsShow==1){
			   this.hideContract();
			   Km.Contract.Config.View.IsShow=0;
			}
			this.showContract();
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
		 * 查询符合条件的合同
		 */
		doSelectContract : function() {
			if (this.topToolbar){
				var ccontract_no = this.topToolbar.ccontract_no.getValue();
				var ccontract_name = this.topToolbar.ccontract_name.getValue();
				var ccontract_status = this.topToolbar.ccontract_status.getValue();
				var csupplier_id = this.topToolbar.csupplier_id.getValue();
				this.filter	   ={'contract_no':ccontract_no,'contract_name':ccontract_name,'supplier_id':csupplier_id,'contract_status':ccontract_status};
			}
			var condition = {'start':0,'limit':Km.Contract.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceContract.queryPageContract(condition,function(provider, response) {
				if (response.result.data) {
					var result		   = new Array();
					result['data']	   =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Contract.Store.contractStore.loadData(result);
				} else {
					Km.Contract.Store.contractStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的合同！');
				}
			});
		},
		/**
		 * 显示合同视图
		 * 显示合同的视图相对合同列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Contract.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Contract.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Contract.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Contract.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Contract.View.Running.viewTabs);
					break;
			}
			Km.Contract.Cookie.set('View.Direction',Km.Contract.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Contract.Config.View.IsFix==0)&&(Km.Contract.Config.View.IsShow==1)){
					this.showContract();
				}
				Km.Contract.Config.View.IsFix=1;
				Km.Contract.View.Running.contractGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Contract.Config.View.IsShow=0;
				this.showContract();
			}
		},
		/**
		 * 显示合同
		 */
		showContract : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择合同！');
				Km.Contract.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Contract.Config.View.IsFix==0){
				if (Km.Contract.View.Running.view_window==null){
					Km.Contract.View.Running.view_window=new Km.Contract.View.ContractView.Window();
				}
				if (Km.Contract.View.Running.view_window.hidden){
					Km.Contract.View.Running.view_window.show();
					Km.Contract.View.Running.view_window.winTabs.hideTabStripItem(Km.Contract.View.Running.view_window.winTabs.tabFix);
					this.updateViewContract();
					this.tvpView.toggle(true);
					Km.Contract.Config.View.IsShow=1;
				}else{
					this.hideContract();
					Km.Contract.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Contract.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Contract.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Contract.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Contract.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Contract.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Contract.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Contract.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Contract.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Contract.View.Running.viewTabs);
					}
					break;
			}
			this.hideContract();
			if (Km.Contract.Config.View.IsShow==0){
				Km.Contract.View.Running.viewTabs.enableCollapse();
				switch(Km.Contract.Config.View.Direction){
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
				this.updateViewContract();
				this.tvpView.toggle(true);
				Km.Contract.Config.View.IsShow=1;
			}else{
				Km.Contract.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏合同
		 */
		hideContract : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Contract.View.Running.view_window!=null){
				Km.Contract.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前合同显示信息
		 */
		updateViewContract : function() {
			Km.Contract.View.Running.contractlogGrid.doSelectContractlog();
			Km.Contract.View.Running.contractorderGrid.doSelectContractorder();
			Km.Contract.View.Running.confilesGrid.doSelectConfiles();
			if (Km.Contract.View.Running.view_window!=null){
				Km.Contract.View.Running.view_window.winTabs.tabContractDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Contract.View.Running.viewTabs.tabContractDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建合同
		 */
		addContract : function() {
			if (Km.Contract.View.Running.edit_window==null){
				Km.Contract.View.Running.edit_window=new Km.Contract.View.EditWindow();
			}
			Km.Contract.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Contract.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Contract.View.Running.edit_window.setTitle('添加合同');
			Km.Contract.View.Running.edit_window.savetype=0;
			Km.Contract.View.Running.edit_window.contract_id.setValue("");
            switch (Km.Contract.Config.OnlineEditor)
            {
                case 1:
                    if (CKEDITOR.instances.terms)CKEDITOR.instances.terms.setData("");
                    break
                case 2:
                    if (Km.Contract.View.EditWindow.KindEditor_terms)Km.Contract.View.EditWindow.KindEditor_terms.html("");
                    break
                case 3:
                    break
                default:
                    if (ue_terms)ue_terms.setContent("");
            }

			Km.Contract.View.Running.edit_window.show();
			Km.Contract.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑合同时先获得选中的合同信息
		 */
		updateContract : function() {
			if (Km.Contract.View.Running.edit_window==null){
				Km.Contract.View.Running.edit_window=new Km.Contract.View.EditWindow();
			}
			Km.Contract.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Contract.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Contract.View.Running.edit_window.setTitle('修改合同');
			Km.Contract.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Contract.View.Running.edit_window.savetype=1;
			var data = this.getSelectionModel().getSelected().data;
            switch (Km.Contract.Config.OnlineEditor)
            {
                case 1:
                    if (CKEDITOR.instances.terms)CKEDITOR.instances.terms.setData(data.terms);
                    break
                case 2:
                    if (Km.Contract.View.EditWindow.KindEditor_terms)Km.Contract.View.EditWindow.KindEditor_terms.html(data.terms);
                    break
                case 3:
                    if (xhEditor_terms)xhEditor_terms.setSource(data.terms);
                    break
                default:
                    if (ue_terms)ue_terms.ready(function(){ue_terms.setContent(data.terms);});
            }

			Km.Contract.View.Running.edit_window.show();
			Km.Contract.View.Running.edit_window.maximize();
		},
		/**
		 * 修改合同状态
		 * @param {} contract_id
		 * @param {} status
		 */
		updateContractStatus : function(status) {
			var contract_id = this.getSelectionModel().getSelected().data.contract_id;
			ExtServiceContract.updateContractStatus(contract_id, status,
			function(result, e) {
				if (result.data) {
					Ext.Msg.alert('提示', '修改合同状态成功！');
				}
			});
			Km.Contract.View.Running.contractlogGrid.doSelectContractlog();
		},
		/**
		 * 删除合同
		 */
		deleteContract : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的合同吗?', this.confirmDeleteContract,this);
		},
		/**
		 * 确认删除合同
		 */
		confirmDeleteContract : function(btn) {
			if (btn == 'yes') {
				var del_contract_ids ="";
				var selectedRows	= this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_contract_ids=del_contract_ids+selectedRows[flag].data.contract_id+",";
				}
				ExtServiceContract.deleteByIds(del_contract_ids);
				this.doSelectContract();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出合同
		 */
		exportContract : function() {
			ExtServiceContract.exportContract(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入合同
		 */
		importContract : function() {
			if (Km.Contract.View.current_uploadWindow==null){
				Km.Contract.View.current_uploadWindow=new Km.Contract.View.UploadWindow();
			}
			Km.Contract.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Contract.View.Running.contractGrid=new Km.Contract.View.Grid();
			if (Km.Contract.Config.View.IsFix==0){
				Km.Contract.View.Running.contractGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Contract.View.Running.contractGrid,
						{region:'north',ref:'north',layout:'fit',border:false,collapseMode : 'mini',hidden:true,split: true},
						{region:'south',ref:'south',layout:'fit',border:false,collapseMode : 'mini',hidden:true,split: true,items:[Km.Contract.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',border:false,collapseMode : 'mini',hidden:true,split: true},
						{region:'east',ref:'east',layout:'fit',border:false,collapseMode : 'mini',hidden:true,split: true}
					]
				}
			}, config);
			Km.Contract.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前合同Grid对象
		 */
		contractGrid:null,
		/**
		 * 显示合同信息及关联信息列表的Tab页
		 */
		viewTabs:null,
		/**
		 * 当前创建的合同编辑窗口
		 */
		edit_window:null,
		/**
		 * 当前的显示合同窗口
		 */
		view_window:null,
		/**
		 * 当前合同订单Grid对象
		 */
		contractorderGrid:null,
		/**
		 * 当前创建的合同订单编辑窗口
		 */
		edit_contractorder_window:null,
		/**
		 * 当前合同附件Grid对象
		 */
		confilesGrid:null,
		/**
		 * 当前创建的合同附件信息编辑窗口
		 */
		edit_confiles_window:null,
		/**
		 * 当前合同日志Grid对象
		 */
		contractlogGrid:null,
		/**
		 * 上传合同附件的编辑窗口
		 */
		upload_window:null
	}
};

/**
 * Controller:主程序
 */
Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.state.Manager.setProvider(Km.Contract.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Contract.Init();
	/**
	 * 合同数据模型获取数据Direct调用
	 */
	Km.Contract.Store.contractStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceContract.queryPageContract}
	});
	/**
	 * 合同页面布局
	 */
	Km.Contract.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Contract.View.Panel()]
	});
	Km.Contract.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});