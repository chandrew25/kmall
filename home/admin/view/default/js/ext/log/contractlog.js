Ext.namespace("Kmall.Admin.Contractlog");
Km = Kmall.Admin.Contractlog;
Km.Contractlog={
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
			 * 显示合同日志的视图相对合同日志列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示合同日志信息页(或者打开新窗口)
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
		if (Km.Contractlog.Cookie.get('View.Direction')){
			Km.Contractlog.Config.View.Direction=Km.Contractlog.Cookie.get('View.Direction');
		}
		if (Km.Contractlog.Cookie.get('View.IsFix')!=null){
			Km.Contractlog.Config.View.IsFix=Km.Contractlog.Cookie.get('View.IsFix');
		}
		if (Ext.util.Cookies.get('OnlineEditor')!=null){
			Km.Contractlog.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
		}
	}
};
/**
 * Model:数据模型
 */
Km.Contractlog.Store = {
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
				  {name: 'contract_name',type: 'string'},
				  {name: 'money',type: 'float'},
				  {name: 'operater',type: 'string'},
				  {name: 'actionType',type: 'string'},
                  {name: 'actionTypeShow',type: 'string'},
				  {name: 'intro',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					Ext.apply(options.params, Km.Contractlog.View.Running.contractlogGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	}),
	/**
	 * 合同
	 */
	contractStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/contract.php'
		  }),
		reader: new Ext.data.JsonReader({
			root: 'contracts',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'contract_id'
		  }, [
			  {name: 'contract_id', mapping: 'contract_id'},
			  {name: 'contract_name', mapping: 'contract_name'}
		])
	})
};
/**
 * View:合同日志显示组件
 */
Km.Contractlog.View={
	/**
	 * 显示合同日志详情
	 */
	ContractlogView:{
		/**
		 * Tab页：容器包含显示与合同日志所有相关的信息
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
								if (Km.Contractlog.View.Running.contractlogGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择合同日志！');
									return false;
								}
								Km.Contractlog.Config.View.IsShow=1;
								Km.Contractlog.View.Running.contractlogGrid.showContractlog();
								Km.Contractlog.View.Running.contractlogGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Contractlog.View.ContractlogView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Contractlog.Config.View.Direction==1)||(Km.Contractlog.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabContractlogDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">',
						 '<tr class="entry"><td class="head">合同</td><td class="content">{contract_name}</td></tr>',
						 '<tr class="entry"><td class="head">合同金额</td><td class="content">{money}</td></tr>',
						 '<tr class="entry"><td class="head">操作人员</td><td class="content">{operater}</td></tr>',
						 '<tr class="entry"><td class="head">行为</td><td class="content">{actionTypeShow}</td></tr>',
						 '<tr class="entry"><td class="head">备注说明</td><td class="content">{intro}</td></tr>',
					 '</table>'
					 ]
					}
				);
			}
		}),
		/**
		 * 窗口:显示合同日志信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看合同日志",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Contractlog.View.ContractlogView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Contractlog.Config.View.IsShow=0;
							Km.Contractlog.View.Running.contractlogGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Contractlog.Config.View.IsShow=0;
							Km.Contractlog.View.Running.contractlogGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Contractlog.View.Running.contractlogGrid.addContractlog();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Contractlog.View.Running.contractlogGrid.updateContractlog();}
					}]
				}, config);
				Km.Contractlog.View.ContractlogView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传合同日志
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量合同日志上传',
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
							emptyText: '请上传合同日志Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadContractlog',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Contractlog.View.Running.contractlogGrid.doSelectContractlog();
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
			Km.Contractlog.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：合同日志列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Contractlog.Store.contractlogStore,
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
						  {header : '合同',dataIndex : 'contract_name'},
						  {header : '合同金额',dataIndex : 'money'},
						  {header : '操作人员',dataIndex : 'operater'},
						  {header : '行为',dataIndex : 'actionTypeShow'},
						  {header : '备注说明',dataIndex : 'intro',width:200}
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
								'合同','&nbsp;&nbsp;',{ref: '../ccontract_id',xtype:'hidden',name : 'contract_id',id:'ccontract_id'},
								{
									 xtype: 'combo',name : 'contract_name',id : 'ccontract_name',
									 store:Km.Contractlog.Store.contractStore,emptyText: '请选择合同',itemSelector: 'div.search-item',
									 loadingText: '查询中...',width:280,pageSize:Km.Contractlog.Config.PageSize,
									 displayField:'contract_name',// 显示文本
									 mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
									 forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
									 tpl:new Ext.XTemplate(
												'<tpl for="."><div class="search-item">',
													'<h3>{contract_name}</h3>',
												'</div></tpl>'
									 ),
									 onSelect:function(record,index){
										 if(this.fireEvent('beforeselect', this, record, index) !== false){
											Ext.getCmp("ccontract_id").setValue(record.data.contract_id);
											Ext.getCmp("ccontract_name").setValue(record.data.contract_name);
											this.collapse();
										 }
									 }
								},'&nbsp;&nbsp;',
								'行为','&nbsp;&nbsp;',{ref: '../cactionType',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '新建合同'],['1', '合同生效'],['2', '合同终止']]
									  }),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectContractlog();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.ccontract_id.setValue("");
										this.topToolbar.cactionType.setValue("");
										this.filter={};
										this.doSelectContractlog();
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
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportContractlog();
									}
								},'-',{
									xtype:'tbsplit',text: '查看合同日志', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showContractlog()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideContractlog();Km.Contractlog.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Contractlog.Cookie.set('View.IsFix',Km.Contractlog.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Contractlog.Config.PageSize,
					store: Km.Contractlog.Store.contractlogStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Contractlog.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Contractlog.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Contractlog.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectContractlog();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Contractlog.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Contractlog.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectContractlog();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示合同日志列表
			this.doSelectContractlog();
			Km.Contractlog.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的合同日志信息Tab页
			Km.Contractlog.View.Running.viewTabs=new Km.Contractlog.View.ContractlogView.Tabs();
			this.addListener('rowdblclick', this.onRowDoubleClick);
		},
		/**
		 * 行选择器
		 */
		sm : new Ext.grid.CheckboxSelectionModel({
			//handleMouseDown : Ext.emptyFn,
			listeners : {
				selectionchange:function(sm) {
					// 判断更新按钮是否可以激活
					this.grid.tvpView.setDisabled(sm.getCount() != 1);
				},
				rowselect: function(sm, rowIndex, record) {
					this.grid.updateViewContractlog();
					if (sm.getCount() != 1){
						this.grid.hideContractlog();
						Km.Contractlog.Config.View.IsShow=0;
					}else{
						if (Km.Contractlog.View.IsSelectView==1){
							Km.Contractlog.View.IsSelectView=0;
							this.grid.showContractlog();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Contractlog.Config.View.IsShow==1){
							Km.Contractlog.View.IsSelectView=1;
						}
						this.grid.hideContractlog();
						Km.Contractlog.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Contractlog.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showContractlog();
				this.tvpView.toggle(true);
			}else{
				this.hideContractlog();
				Km.Contractlog.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Contractlog.Config.View.IsFix=1;
			}else{
			   Km.Contractlog.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Contractlog.Config.View.IsShow=0;
				return ;
			}
			if (Km.Contractlog.Config.View.IsShow==1){
			   this.hideContractlog();
			   Km.Contractlog.Config.View.IsShow=0;
			}
			this.showContractlog();
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
		 * 查询符合条件的合同日志
		 */
		doSelectContractlog : function() {
			if (this.topToolbar){
				var ccontract_id = this.topToolbar.ccontract_id.getValue();
				var cactionType = this.topToolbar.cactionType.getValue();
				this.filter       ={'contract_id':ccontract_id,'actionType':cactionType};
			}
			var condition = {'start':0,'limit':Km.Contractlog.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceContractlog.queryPageContractlog(condition,function(provider, response) {
				if (response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Contractlog.Store.contractlogStore.loadData(result);
				} else {
					Km.Contractlog.Store.contractlogStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的合同日志！');
				}
			});
		},
		/**
		 * 显示合同日志视图
		 * 显示合同日志的视图相对合同日志列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Contractlog.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Contractlog.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Contractlog.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Contractlog.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Contractlog.View.Running.viewTabs);
					break;
			}
			Km.Contractlog.Cookie.set('View.Direction',Km.Contractlog.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Contractlog.Config.View.IsFix==0)&&(Km.Contractlog.Config.View.IsShow==1)){
					this.showContractlog();
				}
				Km.Contractlog.Config.View.IsFix=1;
				Km.Contractlog.View.Running.contractlogGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Contractlog.Config.View.IsShow=0;
				this.showContractlog();
			}
		},
		/**
		 * 显示合同日志
		 */
		showContractlog : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择合同日志！');
				Km.Contractlog.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Contractlog.Config.View.IsFix==0){
				if (Km.Contractlog.View.Running.view_window==null){
					Km.Contractlog.View.Running.view_window=new Km.Contractlog.View.ContractlogView.Window();
				}
				if (Km.Contractlog.View.Running.view_window.hidden){
					Km.Contractlog.View.Running.view_window.show();
					Km.Contractlog.View.Running.view_window.winTabs.hideTabStripItem(Km.Contractlog.View.Running.view_window.winTabs.tabFix);
					this.updateViewContractlog();
					this.tvpView.toggle(true);
					Km.Contractlog.Config.View.IsShow=1;
				}else{
					this.hideContractlog();
					Km.Contractlog.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Contractlog.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Contractlog.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Contractlog.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Contractlog.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Contractlog.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Contractlog.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Contractlog.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Contractlog.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Contractlog.View.Running.viewTabs);
					}
					break;
			}
			this.hideContractlog();
			if (Km.Contractlog.Config.View.IsShow==0){
				Km.Contractlog.View.Running.viewTabs.enableCollapse();
				switch(Km.Contractlog.Config.View.Direction){
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
				this.updateViewContractlog();
				this.tvpView.toggle(true);
				Km.Contractlog.Config.View.IsShow=1;
			}else{
				Km.Contractlog.Config.View.IsShow=0;
			}

			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏合同日志
		 */
		hideContractlog : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Contractlog.View.Running.view_window!=null){
				Km.Contractlog.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前合同日志显示信息
		 */
		updateViewContractlog : function() {
			if (Km.Contractlog.View.Running.view_window!=null){
				Km.Contractlog.View.Running.view_window.winTabs.tabContractlogDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Contractlog.View.Running.viewTabs.tabContractlogDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建合同日志
		 */
		addContractlog : function() {
			if (Km.Contractlog.View.Running.edit_window==null){
				Km.Contractlog.View.Running.edit_window=new Km.Contractlog.View.EditWindow();
			}
			Km.Contractlog.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Contractlog.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Contractlog.View.Running.edit_window.setTitle('添加合同日志');
			Km.Contractlog.View.Running.edit_window.savetype=0;
			Km.Contractlog.View.Running.edit_window.contractlog_id.setValue("");
			switch (Km.Contractlog.Config.OnlineEditor)
			{
				case 2:
					if (Km.Contractlog.View.EditWindow.KindEditor_intro) Km.Contractlog.View.EditWindow.KindEditor_intro.html("");
					break
				case 3:
					break
				default:
					if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData("");
			}

			Km.Contractlog.View.Running.edit_window.show();
			Km.Contractlog.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑合同日志时先获得选中的合同日志信息
		 */
		updateContractlog : function() {
			if (Km.Contractlog.View.Running.edit_window==null){
				Km.Contractlog.View.Running.edit_window=new Km.Contractlog.View.EditWindow();
			}
			Km.Contractlog.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Contractlog.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Contractlog.View.Running.edit_window.setTitle('修改合同日志');
			Km.Contractlog.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Contractlog.View.Running.edit_window.savetype=1;
			switch (Km.Contractlog.Config.OnlineEditor)
			{
				case 2:
					if (Km.Contractlog.View.EditWindow.KindEditor_intro) Km.Contractlog.View.EditWindow.KindEditor_intro.html(this.getSelectionModel().getSelected().data.intro);
					break
				case 3:
					if (xhEditor_intro)xhEditor_intro.setSource(this.getSelectionModel().getSelected().data.intro);
					break
				default:
					if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(this.getSelectionModel().getSelected().data.intro);
			}

			Km.Contractlog.View.Running.edit_window.show();
			Km.Contractlog.View.Running.edit_window.maximize();
		},
		/**
		 * 删除合同日志
		 */
		deleteContractlog : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的合同日志吗?', this.confirmDeleteContractlog,this);
		},
		/**
		 * 确认删除合同日志
		 */
		confirmDeleteContractlog : function(btn) {
			if (btn == 'yes') {
				var del_contractlog_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_contractlog_ids=del_contractlog_ids+selectedRows[flag].data.contractlog_id+",";
				}
				ExtServiceContractlog.deleteByIds(del_contractlog_ids);
				this.doSelectContractlog();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出合同日志
		 */
		exportContractlog : function() {
			ExtServiceContractlog.exportContractlog(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入合同日志
		 */
		importContractlog : function() {
			if (Km.Contractlog.View.current_uploadWindow==null){
				Km.Contractlog.View.current_uploadWindow=new Km.Contractlog.View.UploadWindow();
			}
			Km.Contractlog.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Contractlog.View.Running.contractlogGrid=new Km.Contractlog.View.Grid();
			if (Km.Contractlog.Config.View.IsFix==0){
				Km.Contractlog.View.Running.contractlogGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Contractlog.View.Running.contractlogGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Contractlog.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Contractlog.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前合同日志Grid对象
		 */
		contractlogGrid:null,

		/**
		 * 显示合同日志信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Contractlog.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Contractlog.Init();
	/**
	 * 合同日志数据模型获取数据Direct调用
	 */
	Km.Contractlog.Store.contractlogStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceContractlog.queryPageContractlog}
	});
	/**
	 * 合同日志页面布局
	 */
	Km.Contractlog.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Contractlog.View.Panel()]
	});
	Km.Contractlog.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});
