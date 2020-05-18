Ext.namespace("Kmall.Admin.Voucheritemslog");
Km = Kmall.Admin;
Km.Voucheritemslog={
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
			 * 显示票卡券使用日志表的视图相对票卡券使用日志表列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示票卡券使用日志表信息页(或者打开新窗口)
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
		if (Km.Voucheritemslog.Cookie.get('View.Direction')){
			Km.Voucheritemslog.Config.View.Direction=Km.Voucheritemslog.Cookie.get('View.Direction');
		}
		if (Km.Voucheritemslog.Cookie.get('View.IsFix')!=null){
			Km.Voucheritemslog.Config.View.IsFix=Km.Voucheritemslog.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Voucheritemslog.Store = {
	/**
	 * 票卡券使用日志表
	 */
	voucheritemslogStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
                {name: 'voucheritemslog_id',type: 'int'},
                {name: 'voucher_id',type: 'int'},
                {name: 'voucher_name',type: 'string'},
                {name: 'voucheritems_id',type: 'int'},
                {name: 'vi_key',type: 'string'},
                {name: 'order_id',type: 'int'},
                {name: 'username',type: 'string'},
                {name: 'phone',type: 'string'},
                {name: 'sort_order',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (!options.params.limit)options.params.limit=Km.Voucheritemslog.Config.PageSize;
					Ext.apply(options.params, Km.Voucheritemslog.View.Running.voucheritemslogGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:票卡券使用日志表显示组件
 */
Km.Voucheritemslog.View={
	/**
	 * 编辑窗口：新建或者修改票卡券使用日志表
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
                            {xtype: 'hidden',name : 'voucheritemslog_id',ref:'../voucheritemslog_id'},
                            {fieldLabel : '票卡券',name : 'voucher_id',xtype : 'numberfield'},
                            {fieldLabel : '票卡券实体',name : 'voucheritems_id',xtype : 'numberfield'},
                            {fieldLabel : '姓名',name : 'username'},
                            {fieldLabel : '手机号码',name : 'phone'},
                            {fieldLabel : '排序',name : 'sort_order'}
						]
					})
				],
				buttons : [{
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {

						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;
						if (this.savetype==0){
							this.editForm.api.submit=ExtServiceVoucheritemslog.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Voucheritemslog.View.Running.voucheritemslogGrid.doSelectVoucheritemslog();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
									Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceVoucheritemslog.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Km.Voucheritemslog.View.Running.voucheritemslogGrid.store.reload();
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Voucheritemslog.View.Running.voucheritemslogGrid.bottomToolbar.doRefresh();
									}});
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
									Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
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
						this.editForm.form.loadRecord(Km.Voucheritemslog.View.Running.voucheritemslogGrid.getSelectionModel().getSelected());

					}
				}]
			}, config);
			Km.Voucheritemslog.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示票卡券使用日志表详情
	 */
	VoucheritemslogView:{
		/**
		 * Tab页：容器包含显示与票卡券使用日志表所有相关的信息
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
								if (Km.Voucheritemslog.View.Running.voucheritemslogGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择票卡券使用日志表！');
									return false;
								}
								Km.Voucheritemslog.Config.View.IsShow=1;
								Km.Voucheritemslog.View.Running.voucheritemslogGrid.showVoucheritemslog();
								Km.Voucheritemslog.View.Running.voucheritemslogGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Voucheritemslog.View.VoucheritemslogView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Voucheritemslog.Config.View.Direction==1)||(Km.Voucheritemslog.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabVoucheritemslogDetail',iconCls:'tabs',
					 tpl: [
						 '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">卡券类型</td><td class="content">{voucher_name}</td></tr>',
                         '    <tr class="entry"><td class="head">卡券</td><td class="content">{vi_key}</td></tr>',
                         //'    <tr class="entry"><td class="head">order_id</td><td class="content">{order_id}</td></tr>',
                         '    <tr class="entry"><td class="head">姓名</td><td class="content">{username}</td></tr>',
                         '    <tr class="entry"><td class="head">手机号码</td><td class="content">{phone}</td></tr>',
                         '    <tr class="entry"><td class="head">排序</td><td class="content">{sort_order}</td></tr>',
                         '</table>'
					 ]}
				);
                this.add(
                    {title: '其他',iconCls:'tabs'}
                );
			}
		}),
		/**
		 * 窗口:显示票卡券使用日志表信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看票卡券使用日志表",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Voucheritemslog.View.VoucheritemslogView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Voucheritemslog.Config.View.IsShow=0;
							Km.Voucheritemslog.View.Running.voucheritemslogGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Voucheritemslog.Config.View.IsShow=0;
							Km.Voucheritemslog.View.Running.voucheritemslogGrid.tvpView.toggle(false);
						}
					}//,
//					buttons: [{
//						text: '新增票卡券使用日志表',scope:this,
//						handler : function() {this.hide();Km.Voucheritemslog.View.Running.voucheritemslogGrid.addVoucheritemslog();}
//					},{
//						text: '修改票卡券使用日志表',scope:this,
//						handler : function() {this.hide();Km.Voucheritemslog.View.Running.voucheritemslogGrid.updateVoucheritemslog();}
//					}]
				}, config);
				Km.Voucheritemslog.View.VoucheritemslogView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传票卡券使用日志表
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量上传票卡券使用日志表数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
				layout : 'fit',plain : true,bodyStyle : 'padding:5px;',buttonAlign : 'center',closeAction : "hide",
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
							emptyText: '请上传票卡券使用日志表Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadVoucheritemslog',
									success : function(form, response) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Voucheritemslog.View.Running.voucheritemslogGrid.doSelectVoucheritemslog();
									},
									failure : function(form, response) {
										Ext.Msg.alert('错误', response.result.data);
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
			Km.Voucheritemslog.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：票卡券使用日志表列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Voucheritemslog.Store.voucheritemslogStore,
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
                        {header : '标识',dataIndex : 'voucheritemslog_id',hidden:true},
                        {header : '卡券类型',dataIndex : 'voucher_name'},
                        {header : '卡券',dataIndex : 'vi_key'},
                        //{header : 'order_id',dataIndex : 'order_id'},
                        {header : '姓名',dataIndex : 'username'},
                        {header : '手机号码',dataIndex : 'phone'},
                        {header : '排序',dataIndex : 'sort_order'}
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
										if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectVoucheritemslog();
									}
								}
							},
							items : [
                                '姓名:',"&nbsp;&nbsp;",{ref: '../username',width:200},"&nbsp;&nbsp;",'-',
                                '手机号:',"&nbsp;&nbsp;",{ref: '../phone',width:200},"&nbsp;&nbsp;",
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectVoucheritemslog();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
                                        this.topToolbar.username.setValue("");
                                        this.topToolbar.phone.setValue("");
										this.filter={};
										this.doSelectVoucheritemslog();
									}
								}]
						}),
						new Ext.Toolbar({
							defaults:{scope: this},
							items : [
								//{
//									text: '反选',iconCls : 'icon-reverse',
//									handler: function(){
//										this.onReverseSelect();
//									}
//								},'-',{
//									text : '添加票卡券使用日志表',iconCls : 'icon-add',
//									handler : function() {
//										this.addVoucheritemslog();
//									}
//								},'-',{
//									text : '修改票卡券使用日志表',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
//									handler : function() {
//										this.updateVoucheritemslog();
//									}
//								},'-',{
//									text : '删除票卡券使用日志表', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
//									handler : function() {
//										this.deleteVoucheritemslog();
//									}
//								},'-',{
//									xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
//									handler : function() {
//										this.importVoucheritemslog();
//									},
//									menu: {
//										xtype:'menu',plain:true,
//										items: [
//											{text:'批量导入票卡券使用日志表',iconCls : 'icon-import',scope:this,handler:function(){this.importVoucheritemslog()}}
//										]}
//								},'-',
                                {
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportVoucheritemslog();
									}
								},'-',{
									xtype:'tbsplit',text: '查看票卡券使用日志表', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showVoucheritemslog()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideVoucheritemslog();Km.Voucheritemslog.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Voucheritemslog.Cookie.set('View.IsFix',Km.Voucheritemslog.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Voucheritemslog.Config.PageSize,
					store: Km.Voucheritemslog.Store.voucheritemslogStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
						change:function(thisbar,pagedata){
							if (Km.Voucheritemslog.Viewport){
								if (Km.Voucheritemslog.Config.View.IsShow==1){
									Km.Voucheritemslog.View.IsSelectView=1;
								}
								this.ownerCt.hideVoucheritemslog();
								Km.Voucheritemslog.Config.View.IsShow=0;
							}
						}
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Voucheritemslog.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Voucheritemslog.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Voucheritemslog.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectVoucheritemslog();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Voucheritemslog.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Voucheritemslog.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectVoucheritemslog();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示票卡券使用日志表列表
			this.doSelectVoucheritemslog();
			Km.Voucheritemslog.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的票卡券使用日志表信息Tab页
			Km.Voucheritemslog.View.Running.viewTabs=new Km.Voucheritemslog.View.VoucheritemslogView.Tabs();
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
					//this.grid.btnRemove.setDisabled(sm.getCount() < 1);
					//this.grid.btnUpdate.setDisabled(sm.getCount() != 1);
					this.grid.tvpView.setDisabled(sm.getCount() != 1);
				},
				rowselect: function(sm, rowIndex, record) {
					this.grid.updateViewVoucheritemslog();
					if (sm.getCount() != 1){
						this.grid.hideVoucheritemslog();
						Km.Voucheritemslog.Config.View.IsShow=0;
					}else{
						if (Km.Voucheritemslog.View.IsSelectView==1){
							Km.Voucheritemslog.View.IsSelectView=0;
							this.grid.showVoucheritemslog();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Voucheritemslog.Config.View.IsShow==1){
							Km.Voucheritemslog.View.IsSelectView=1;
						}
						this.grid.hideVoucheritemslog();
						Km.Voucheritemslog.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Voucheritemslog.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showVoucheritemslog();
				this.tvpView.toggle(true);
			}else{
				this.hideVoucheritemslog();
				Km.Voucheritemslog.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Voucheritemslog.Config.View.IsFix=1;
			}else{
			   Km.Voucheritemslog.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Voucheritemslog.Config.View.IsShow=0;
				return ;
			}
			if (Km.Voucheritemslog.Config.View.IsShow==1){
			   this.hideVoucheritemslog();
			   Km.Voucheritemslog.Config.View.IsShow=0;
			}
			this.showVoucheritemslog();
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
		 * 查询符合条件的票卡券使用日志表
		 */
		doSelectVoucheritemslog : function() {
			if (this.topToolbar){
                var username = this.topToolbar.username.getValue();
                var phone = this.topToolbar.phone.getValue();
                this.filter   ={'username':username,'phone':phone};

			}
			var condition = {'start':0,'limit':Km.Voucheritemslog.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceVoucheritemslog.queryPageVoucheritemslog(condition,function(provider, response) {
				if (response.result&&response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Voucheritemslog.Store.voucheritemslogStore.loadData(result);
				} else {
					Km.Voucheritemslog.Store.voucheritemslogStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的票卡券使用日志表！');
				}
			});
		},
		/**
		 * 显示票卡券使用日志表视图
		 * 显示票卡券使用日志表的视图相对票卡券使用日志表列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Voucheritemslog.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Voucheritemslog.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Voucheritemslog.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Voucheritemslog.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Voucheritemslog.View.Running.viewTabs);
					break;
			}
			Km.Voucheritemslog.Cookie.set('View.Direction',Km.Voucheritemslog.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Voucheritemslog.Config.View.IsFix==0)&&(Km.Voucheritemslog.Config.View.IsShow==1)){
					this.showVoucheritemslog();
				}
				Km.Voucheritemslog.Config.View.IsFix=1;
				Km.Voucheritemslog.View.Running.voucheritemslogGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Voucheritemslog.Config.View.IsShow=0;
				this.showVoucheritemslog();
			}
		},
		/**
		 * 显示票卡券使用日志表
		 */
		showVoucheritemslog : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择票卡券使用日志表！');
				Km.Voucheritemslog.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Voucheritemslog.Config.View.IsFix==0){
				if (Km.Voucheritemslog.View.Running.view_window==null){
					Km.Voucheritemslog.View.Running.view_window=new Km.Voucheritemslog.View.VoucheritemslogView.Window();
				}
				if (Km.Voucheritemslog.View.Running.view_window.hidden){
					Km.Voucheritemslog.View.Running.view_window.show();
					Km.Voucheritemslog.View.Running.view_window.winTabs.hideTabStripItem(Km.Voucheritemslog.View.Running.view_window.winTabs.tabFix);
					this.updateViewVoucheritemslog();
					this.tvpView.toggle(true);
					Km.Voucheritemslog.Config.View.IsShow=1;
				}else{
					this.hideVoucheritemslog();
					Km.Voucheritemslog.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Voucheritemslog.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Voucheritemslog.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Voucheritemslog.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Voucheritemslog.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Voucheritemslog.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Voucheritemslog.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Voucheritemslog.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Voucheritemslog.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Voucheritemslog.View.Running.viewTabs);
					}
					break;
			}
			this.hideVoucheritemslog();
			if (Km.Voucheritemslog.Config.View.IsShow==0){
				Km.Voucheritemslog.View.Running.viewTabs.enableCollapse();
				switch(Km.Voucheritemslog.Config.View.Direction){
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
				this.updateViewVoucheritemslog();
				this.tvpView.toggle(true);
				Km.Voucheritemslog.Config.View.IsShow=1;
			}else{
				Km.Voucheritemslog.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏票卡券使用日志表
		 */
		hideVoucheritemslog : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Voucheritemslog.View.Running.view_window!=null){
				Km.Voucheritemslog.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前票卡券使用日志表显示信息
		 */
		updateViewVoucheritemslog : function() {

			if (Km.Voucheritemslog.View.Running.view_window!=null){
				Km.Voucheritemslog.View.Running.view_window.winTabs.tabVoucheritemslogDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Voucheritemslog.View.Running.viewTabs.tabVoucheritemslogDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建票卡券使用日志表
		 */
		addVoucheritemslog : function() {
			if (Km.Voucheritemslog.View.Running.edit_window==null){
				Km.Voucheritemslog.View.Running.edit_window=new Km.Voucheritemslog.View.EditWindow();
			}
			Km.Voucheritemslog.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Voucheritemslog.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Voucheritemslog.View.Running.edit_window.setTitle('添加票卡券使用日志表');
			Km.Voucheritemslog.View.Running.edit_window.savetype=0;
			Km.Voucheritemslog.View.Running.edit_window.voucheritemslog_id.setValue("");

			Km.Voucheritemslog.View.Running.edit_window.show();
			Km.Voucheritemslog.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑票卡券使用日志表时先获得选中的票卡券使用日志表信息
		 */
		updateVoucheritemslog : function() {
			if (Km.Voucheritemslog.View.Running.edit_window==null){
				Km.Voucheritemslog.View.Running.edit_window=new Km.Voucheritemslog.View.EditWindow();
			}
			Km.Voucheritemslog.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Voucheritemslog.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Voucheritemslog.View.Running.edit_window.setTitle('修改票卡券使用日志表');
			Km.Voucheritemslog.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Voucheritemslog.View.Running.edit_window.savetype=1;

			Km.Voucheritemslog.View.Running.edit_window.show();
			Km.Voucheritemslog.View.Running.edit_window.maximize();
		},
		/**
		 * 删除票卡券使用日志表
		 */
		deleteVoucheritemslog : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的票卡券使用日志表吗?', this.confirmDeleteVoucheritemslog,this);
		},
		/**
		 * 确认删除票卡券使用日志表
		 */
		confirmDeleteVoucheritemslog : function(btn) {
			if (btn == 'yes') {
				var del_voucheritemslog_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_voucheritemslog_ids=del_voucheritemslog_ids+selectedRows[flag].data.voucheritemslog_id+",";
				}
				ExtServiceVoucheritemslog.deleteByIds(del_voucheritemslog_ids);
				this.doSelectVoucheritemslog();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出票卡券使用日志表
		 */
		exportVoucheritemslog : function() {
			ExtServiceVoucheritemslog.exportVoucheritemslog(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入票卡券使用日志表
		 */
		importVoucheritemslog : function() {
			if (Km.Voucheritemslog.View.current_uploadWindow==null){
				Km.Voucheritemslog.View.current_uploadWindow=new Km.Voucheritemslog.View.UploadWindow();
			}
			Km.Voucheritemslog.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Voucheritemslog.View.Running.voucheritemslogGrid=new Km.Voucheritemslog.View.Grid();
			if (Km.Voucheritemslog.Config.View.IsFix==0){
				Km.Voucheritemslog.View.Running.voucheritemslogGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Voucheritemslog.View.Running.voucheritemslogGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Voucheritemslog.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Voucheritemslog.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前票卡券使用日志表Grid对象
		 */
		voucheritemslogGrid:null,

		/**
		 * 显示票卡券使用日志表信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Voucheritemslog.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Voucheritemslog.Init();
	/**
	 * 票卡券使用日志表数据模型获取数据Direct调用
	 */
	Km.Voucheritemslog.Store.voucheritemslogStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceVoucheritemslog.queryPageVoucheritemslog}
	});
	/**
	 * 票卡券使用日志表页面布局
	 */
	Km.Voucheritemslog.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Voucheritemslog.View.Panel()]
	});
	Km.Voucheritemslog.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});