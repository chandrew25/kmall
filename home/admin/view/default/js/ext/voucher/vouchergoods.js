Ext.namespace("Kmall.Admin.Vouchergoods");
Km = Kmall.Admin;
Km.Vouchergoods={
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
			 * 显示兑换券规则作用商品表的视图相对兑换券规则作用商品表列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示兑换券规则作用商品表信息页(或者打开新窗口)
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
		if (Km.Vouchergoods.Cookie.get('View.Direction')){
			Km.Vouchergoods.Config.View.Direction=Km.Vouchergoods.Cookie.get('View.Direction');
		}
		if (Km.Vouchergoods.Cookie.get('View.IsFix')!=null){
			Km.Vouchergoods.Config.View.IsFix=Km.Vouchergoods.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Vouchergoods.Store = {
	/**
	 * 兑换券规则作用商品表
	 */
	vouchergoodsStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
                {name: 'vouchergoods_id',type: 'int'},
                {name: 'voucher_id',type: 'int'},
                {name: 'goods_id',type: 'int'},
                {name: 'isValid',type: 'string'},
                {name: 'sort_order',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (!options.params.limit)options.params.limit=Km.Vouchergoods.Config.PageSize;
					Ext.apply(options.params, Km.Vouchergoods.View.Running.vouchergoodsGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:兑换券规则作用商品表显示组件
 */
Km.Vouchergoods.View={
	/**
	 * 编辑窗口：新建或者修改兑换券规则作用商品表
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
                            {xtype: 'hidden',name : 'vouchergoods_id',ref:'../vouchergoods_id'},
                            {fieldLabel : '兑换券',name : 'voucher_id',xtype : 'numberfield'},
                            {fieldLabel : '货品',name : 'goods_id',xtype : 'numberfield'},
                            {fieldLabel : '是否有效(<font color=red>*</font>)',hiddenName : 'isValid',allowBlank : false
                                 ,xtype:'combo',ref:'../isValid',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否有效',
                                 valueField : 'value',displayField : 'text'
                            },
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
							this.editForm.api.submit=ExtServiceVouchergoods.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Vouchergoods.View.Running.vouchergoodsGrid.doSelectVouchergoods();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
									Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceVouchergoods.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Km.Vouchergoods.View.Running.vouchergoodsGrid.store.reload();
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Vouchergoods.View.Running.vouchergoodsGrid.bottomToolbar.doRefresh();
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
						this.editForm.form.loadRecord(Km.Vouchergoods.View.Running.vouchergoodsGrid.getSelectionModel().getSelected());

					}
				}]
			}, config);
			Km.Vouchergoods.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示兑换券规则作用商品表详情
	 */
	VouchergoodsView:{
		/**
		 * Tab页：容器包含显示与兑换券规则作用商品表所有相关的信息
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
								if (Km.Vouchergoods.View.Running.vouchergoodsGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择兑换券规则作用商品表！');
									return false;
								}
								Km.Vouchergoods.Config.View.IsShow=1;
								Km.Vouchergoods.View.Running.vouchergoodsGrid.showVouchergoods();
								Km.Vouchergoods.View.Running.vouchergoodsGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Vouchergoods.View.VouchergoodsView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Vouchergoods.Config.View.Direction==1)||(Km.Vouchergoods.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabVouchergoodsDetail',iconCls:'tabs',
					 tpl: [
						 '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">兑换券</td><td class="content">{voucher_id}</td></tr>',
                         '    <tr class="entry"><td class="head">货品</td><td class="content">{goods_id}</td></tr>',
                         '    <tr class="entry"><td class="head">是否有效</td><td class="content"><tpl if="isValid == true">是</tpl><tpl if="isValid == false">否</tpl></td></tr>',
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
		 * 窗口:显示兑换券规则作用商品表信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看兑换券规则作用商品表",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Vouchergoods.View.VouchergoodsView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Vouchergoods.Config.View.IsShow=0;
							Km.Vouchergoods.View.Running.vouchergoodsGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Vouchergoods.View.Running.vouchergoodsGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增兑换券规则作用商品表',scope:this,
						handler : function() {this.hide();Km.Vouchergoods.View.Running.vouchergoodsGrid.addVouchergoods();}
					},{
						text: '修改兑换券规则作用商品表',scope:this,
						handler : function() {this.hide();Km.Vouchergoods.View.Running.vouchergoodsGrid.updateVouchergoods();}
					}]
				}, config);
				Km.Vouchergoods.View.VouchergoodsView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传兑换券规则作用商品表
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量上传兑换券规则作用商品表数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
							emptyText: '请上传兑换券规则作用商品表Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadVouchergoods',
									success : function(form, response) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Vouchergoods.View.Running.vouchergoodsGrid.doSelectVouchergoods();
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
			Km.Vouchergoods.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：兑换券规则作用商品表列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Vouchergoods.Store.vouchergoodsStore,
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
                        {header : '标识',dataIndex : 'vouchergoods_id',hidden:true},
                        {header : '兑换券',dataIndex : 'voucher_id'},
                        {header : '货品',dataIndex : 'goods_id'},
                        {header : '是否有效',dataIndex : 'isValid',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
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
										if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectVouchergoods();
									}
								}
							},
							items : [

								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectVouchergoods();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {

										this.filter={};
										this.doSelectVouchergoods();
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
									text : '添加兑换券规则作用商品表',iconCls : 'icon-add',
									handler : function() {
										this.addVouchergoods();
									}
								},'-',{
									text : '修改兑换券规则作用商品表',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateVouchergoods();
									}
								},'-',{
									text : '删除兑换券规则作用商品表', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteVouchergoods();
									}
								},'-',{
									xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
									handler : function() {
										this.importVouchergoods();
									},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'批量导入兑换券规则作用商品表',iconCls : 'icon-import',scope:this,handler:function(){this.importVouchergoods()}}
										]}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportVouchergoods();
									}
								},'-',{
									xtype:'tbsplit',text: '查看兑换券规则作用商品表', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showVouchergoods()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideVouchergoods();Km.Vouchergoods.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Vouchergoods.Cookie.set('View.IsFix',Km.Vouchergoods.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Vouchergoods.Config.PageSize,
					store: Km.Vouchergoods.Store.vouchergoodsStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
						change:function(thisbar,pagedata){
							if (Km.Vouchergoods.Viewport){
								if (Km.Vouchergoods.Config.View.IsShow==1){
									Km.Vouchergoods.View.IsSelectView=1;
								}
								this.ownerCt.hideVouchergoods();
								Km.Vouchergoods.Config.View.IsShow=0;
							}
						}
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Vouchergoods.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Vouchergoods.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Vouchergoods.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectVouchergoods();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Vouchergoods.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Vouchergoods.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectVouchergoods();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示兑换券规则作用商品表列表
			this.doSelectVouchergoods();
			Km.Vouchergoods.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的兑换券规则作用商品表信息Tab页
			Km.Vouchergoods.View.Running.viewTabs=new Km.Vouchergoods.View.VouchergoodsView.Tabs();
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
					this.grid.updateViewVouchergoods();
					if (sm.getCount() != 1){
						this.grid.hideVouchergoods();
						Km.Vouchergoods.Config.View.IsShow=0;
					}else{
						if (Km.Vouchergoods.View.IsSelectView==1){
							Km.Vouchergoods.View.IsSelectView=0;
							this.grid.showVouchergoods();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Vouchergoods.Config.View.IsShow==1){
							Km.Vouchergoods.View.IsSelectView=1;
						}
						this.grid.hideVouchergoods();
						Km.Vouchergoods.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Vouchergoods.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showVouchergoods();
				this.tvpView.toggle(true);
			}else{
				this.hideVouchergoods();
				Km.Vouchergoods.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Vouchergoods.Config.View.IsFix=1;
			}else{
			   Km.Vouchergoods.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Vouchergoods.Config.View.IsShow=0;
				return ;
			}
			if (Km.Vouchergoods.Config.View.IsShow==1){
			   this.hideVouchergoods();
			   Km.Vouchergoods.Config.View.IsShow=0;
			}
			this.showVouchergoods();
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
		 * 查询符合条件的兑换券规则作用商品表
		 */
		doSelectVouchergoods : function() {
			if (this.topToolbar){


			}
			var condition = {'start':0,'limit':Km.Vouchergoods.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceVouchergoods.queryPageVouchergoods(condition,function(provider, response) {
				if (response.result&&response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Vouchergoods.Store.vouchergoodsStore.loadData(result);
				} else {
					Km.Vouchergoods.Store.vouchergoodsStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的兑换券规则作用商品表！');
				}
			});
		},
		/**
		 * 显示兑换券规则作用商品表视图
		 * 显示兑换券规则作用商品表的视图相对兑换券规则作用商品表列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Vouchergoods.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Vouchergoods.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Vouchergoods.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Vouchergoods.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Vouchergoods.View.Running.viewTabs);
					break;
			}
			Km.Vouchergoods.Cookie.set('View.Direction',Km.Vouchergoods.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Vouchergoods.Config.View.IsFix==0)&&(Km.Vouchergoods.Config.View.IsShow==1)){
					this.showVouchergoods();
				}
				Km.Vouchergoods.Config.View.IsFix=1;
				Km.Vouchergoods.View.Running.vouchergoodsGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Vouchergoods.Config.View.IsShow=0;
				this.showVouchergoods();
			}
		},
		/**
		 * 显示兑换券规则作用商品表
		 */
		showVouchergoods : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择兑换券规则作用商品表！');
				Km.Vouchergoods.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Vouchergoods.Config.View.IsFix==0){
				if (Km.Vouchergoods.View.Running.view_window==null){
					Km.Vouchergoods.View.Running.view_window=new Km.Vouchergoods.View.VouchergoodsView.Window();
				}
				if (Km.Vouchergoods.View.Running.view_window.hidden){
					Km.Vouchergoods.View.Running.view_window.show();
					Km.Vouchergoods.View.Running.view_window.winTabs.hideTabStripItem(Km.Vouchergoods.View.Running.view_window.winTabs.tabFix);
					this.updateViewVouchergoods();
					this.tvpView.toggle(true);
					Km.Vouchergoods.Config.View.IsShow=1;
				}else{
					this.hideVouchergoods();
					Km.Vouchergoods.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Vouchergoods.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Vouchergoods.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Vouchergoods.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Vouchergoods.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Vouchergoods.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Vouchergoods.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Vouchergoods.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Vouchergoods.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Vouchergoods.View.Running.viewTabs);
					}
					break;
			}
			this.hideVouchergoods();
			if (Km.Vouchergoods.Config.View.IsShow==0){
				Km.Vouchergoods.View.Running.viewTabs.enableCollapse();
				switch(Km.Vouchergoods.Config.View.Direction){
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
				this.updateViewVouchergoods();
				this.tvpView.toggle(true);
				Km.Vouchergoods.Config.View.IsShow=1;
			}else{
				Km.Vouchergoods.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏兑换券规则作用商品表
		 */
		hideVouchergoods : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Vouchergoods.View.Running.view_window!=null){
				Km.Vouchergoods.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前兑换券规则作用商品表显示信息
		 */
		updateViewVouchergoods : function() {

			if (Km.Vouchergoods.View.Running.view_window!=null){
				Km.Vouchergoods.View.Running.view_window.winTabs.tabVouchergoodsDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Vouchergoods.View.Running.viewTabs.tabVouchergoodsDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建兑换券规则作用商品表
		 */
		addVouchergoods : function() {
			if (Km.Vouchergoods.View.Running.edit_window==null){
				Km.Vouchergoods.View.Running.edit_window=new Km.Vouchergoods.View.EditWindow();
			}
			Km.Vouchergoods.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Vouchergoods.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Vouchergoods.View.Running.edit_window.setTitle('添加兑换券规则作用商品表');
			Km.Vouchergoods.View.Running.edit_window.savetype=0;
			Km.Vouchergoods.View.Running.edit_window.vouchergoods_id.setValue("");

			Km.Vouchergoods.View.Running.edit_window.show();
			Km.Vouchergoods.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑兑换券规则作用商品表时先获得选中的兑换券规则作用商品表信息
		 */
		updateVouchergoods : function() {
			if (Km.Vouchergoods.View.Running.edit_window==null){
				Km.Vouchergoods.View.Running.edit_window=new Km.Vouchergoods.View.EditWindow();
			}
			Km.Vouchergoods.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Vouchergoods.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Vouchergoods.View.Running.edit_window.setTitle('修改兑换券规则作用商品表');
			Km.Vouchergoods.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Vouchergoods.View.Running.edit_window.savetype=1;

			Km.Vouchergoods.View.Running.edit_window.show();
			Km.Vouchergoods.View.Running.edit_window.maximize();
		},
		/**
		 * 删除兑换券规则作用商品表
		 */
		deleteVouchergoods : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的兑换券规则作用商品表吗?', this.confirmDeleteVouchergoods,this);
		},
		/**
		 * 确认删除兑换券规则作用商品表
		 */
		confirmDeleteVouchergoods : function(btn) {
			if (btn == 'yes') {
				var del_vouchergoods_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_vouchergoods_ids=del_vouchergoods_ids+selectedRows[flag].data.vouchergoods_id+",";
				}
				ExtServiceVouchergoods.deleteByIds(del_vouchergoods_ids);
				this.doSelectVouchergoods();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出兑换券规则作用商品表
		 */
		exportVouchergoods : function() {
			ExtServiceVouchergoods.exportVouchergoods(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入兑换券规则作用商品表
		 */
		importVouchergoods : function() {
			if (Km.Vouchergoods.View.current_uploadWindow==null){
				Km.Vouchergoods.View.current_uploadWindow=new Km.Vouchergoods.View.UploadWindow();
			}
			Km.Vouchergoods.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Vouchergoods.View.Running.vouchergoodsGrid=new Km.Vouchergoods.View.Grid();
			if (Km.Vouchergoods.Config.View.IsFix==0){
				Km.Vouchergoods.View.Running.vouchergoodsGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Vouchergoods.View.Running.vouchergoodsGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Vouchergoods.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Vouchergoods.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前兑换券规则作用商品表Grid对象
		 */
		vouchergoodsGrid:null,

		/**
		 * 显示兑换券规则作用商品表信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Vouchergoods.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Vouchergoods.Init();
	/**
	 * 兑换券规则作用商品表数据模型获取数据Direct调用
	 */
	Km.Vouchergoods.Store.vouchergoodsStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceVouchergoods.queryPageVouchergoods}
	});
	/**
	 * 兑换券规则作用商品表页面布局
	 */
	Km.Vouchergoods.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Vouchergoods.View.Panel()]
	});
	Km.Vouchergoods.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});