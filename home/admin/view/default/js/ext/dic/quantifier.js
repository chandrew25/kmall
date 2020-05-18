Ext.namespace("Kmall.Admin.Quantifier");
Km = Kmall.Admin.Quantifier;
Km.Quantifier={
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
			 * 显示量词的视图相对量词列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示量词信息页(或者打开新窗口)
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
		if (Km.Quantifier.Cookie.get('View.Direction')){
			Km.Quantifier.Config.View.Direction=Km.Quantifier.Cookie.get('View.Direction');
		}
		if (Km.Quantifier.Cookie.get('View.IsFix')!=null){
			Km.Quantifier.Config.View.IsFix=Km.Quantifier.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Quantifier.Store = {
	/**
	 * 量词
	 */
	quantifierStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				{name: 'quantifier_id',type: 'int'},
				{name: 'quantifier_name',type: 'string'},
				{name: 'sort_order',type: 'int'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					Ext.apply(options.params, Km.Quantifier.View.Running.quantifierGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:量词显示组件
 */
Km.Quantifier.View={
	/**
	 * 编辑窗口：新建或者修改量词
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
							{xtype: 'hidden',  name : 'quantifier_id',ref:'../quantifier_id'},
							{fieldLabel : '名称',name : 'quantifier_name'},
							{fieldLabel : '排序',name : 'sort_order'}
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
							this.editForm.api.submit=ExtServiceQuantifier.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Quantifier.View.Running.quantifierGrid.doSelectQuantifier();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceQuantifier.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Quantifier.View.Running.quantifierGrid.doSelectQuantifier();
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
						this.editForm.form.loadRecord(Km.Quantifier.View.Running.quantifierGrid.getSelectionModel().getSelected());

					}
				}]
			}, config);
			Km.Quantifier.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示量词详情
	 */
	QuantifierView:{
		/**
		 * Tab页：容器包含显示与量词所有相关的信息
		 */
		Tabs:Ext.extend(Ext.TabPanel,{
			constructor : function(config) {
				config = Ext.apply({
					region : 'south',
					collapseMode : 'mini',split : true,
					activeTab: 1, tabPosition:"bottom",resizeTabs : true,
					header:false,enableTabScroll : true,tabWidth:'auto', margins : '0 3 3 0',
					defaults : {
						autoScroll : true
					},
					listeners:{
						beforetabchange:function(tabs,newtab,currentTab){
							if (tabs.tabFix==newtab){
								if (Km.Quantifier.View.Running.quantifierGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择量词！');
									return false;
								}
								Km.Quantifier.Config.View.IsShow=1;
								Km.Quantifier.View.Running.quantifierGrid.showQuantifier();
								Km.Quantifier.View.Running.quantifierGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Quantifier.View.QuantifierView.Tabs.superclass.constructor.call(this, config);
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Quantifier.Config.View.Direction==1)||(Km.Quantifier.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabQuantifierDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">',
						 '<tr class="entry"><td class="head">名称 :</td><td class="content">{quantifier_name}</td></tr>',
						 '<tr class="entry"><td class="head">排序 :</td><td class="content">{sort_order}</td></tr>',
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
		 * 窗口:显示量词信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看量词",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Quantifier.View.QuantifierView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Quantifier.Config.View.IsShow=0;
							Km.Quantifier.View.Running.quantifierGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Quantifier.Config.View.IsShow=0;
							Km.Quantifier.View.Running.quantifierGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Quantifier.View.Running.quantifierGrid.addQuantifier();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Quantifier.View.Running.quantifierGrid.updateQuantifier();}
					}]
				}, config);
				Km.Quantifier.View.QuantifierView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传量词
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量量词上传',
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
							emptyText: '请上传量词Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadQuantifier',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Quantifier.View.Running.quantifierGrid.doSelectQuantifier();
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
			Km.Quantifier.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：量词列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Quantifier.Store.quantifierStore,
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
						{header : '名称',dataIndex : 'quantifier_name'},
						{header : '排序',dataIndex : 'sort_order'}
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
								'名称　',{ref: '../qquantifier_name'},'&nbsp;&nbsp;',
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectQuantifier();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.qquantifier_name.setValue("");
										this.filter={};
										this.doSelectQuantifier();
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
									text : '添加量词',iconCls : 'icon-add',
									handler : function() {
										this.addQuantifier();
									}
								},'-',{
									text : '修改量词',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateQuantifier();
									}
								},'-',{
									text : '删除量词', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteQuantifier();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import',
									handler : function() {
										this.importQuantifier();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportQuantifier();
									}
								},'-',{
									xtype:'tbsplit',text: '查看量词', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showQuantifier()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideQuantifier();Km.Quantifier.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Quantifier.Cookie.set('View.IsFix',Km.Quantifier.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Quantifier.Config.PageSize,
					store: Km.Quantifier.Store.quantifierStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Quantifier.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Quantifier.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Quantifier.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectQuantifier();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Quantifier.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Quantifier.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectQuantifier();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示量词列表
			this.doSelectQuantifier();
			Km.Quantifier.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的量词信息Tab页
			Km.Quantifier.View.Running.viewTabs=new Km.Quantifier.View.QuantifierView.Tabs();
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
					this.grid.updateViewQuantifier();
					if (sm.getCount() != 1){
						this.grid.hideQuantifier();
						Km.Quantifier.Config.View.IsShow=0;
					}else{
						if (Km.Quantifier.View.IsSelectView==1){
							Km.Quantifier.View.IsSelectView=0;
							this.grid.showQuantifier();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Quantifier.Config.View.IsShow==1){
							Km.Quantifier.View.IsSelectView=1;
						}
						this.grid.hideQuantifier();
						Km.Quantifier.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Quantifier.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showQuantifier();
				this.tvpView.toggle(true);
			}else{
				this.hideQuantifier();
				Km.Quantifier.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Quantifier.Config.View.IsFix=1;
			}else{
			   Km.Quantifier.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Quantifier.Config.View.IsShow=0;
				return ;
			}
			if (Km.Quantifier.Config.View.IsShow==1){
			   this.hideQuantifier();
			   Km.Quantifier.Config.View.IsShow=0;
			}
			this.showQuantifier();
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
		 * 查询符合条件的量词
		 */
		doSelectQuantifier : function() {
			if (this.topToolbar){
				var qquantifier_name = this.topToolbar.qquantifier_name.getValue();
				this.filter       ={'quantifier_name':qquantifier_name};
			}
			var condition = {'start':0,'limit':Km.Quantifier.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceQuantifier.queryPageQuantifier(condition,function(provider, response) {
				if (response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Quantifier.Store.quantifierStore.loadData(result);
				} else {
					Km.Quantifier.Store.quantifierStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的量词！');
				}
			});
		},
		/**
		 * 显示量词视图
		 * 显示量词的视图相对量词列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Quantifier.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Quantifier.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Quantifier.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Quantifier.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Quantifier.View.Running.viewTabs);
					break;
			}
			Km.Quantifier.Cookie.set('View.Direction',Km.Quantifier.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Quantifier.Config.View.IsFix==0)&&(Km.Quantifier.Config.View.IsShow==1)){
					this.showQuantifier();
				}
				Km.Quantifier.Config.View.IsFix=1;
				Km.Quantifier.View.Running.quantifierGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Quantifier.Config.View.IsShow=0;
				this.showQuantifier();
			}
		},
		/**
		 * 显示量词
		 */
		showQuantifier : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择量词！');
				Km.Quantifier.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Quantifier.Config.View.IsFix==0){
				if (Km.Quantifier.View.Running.view_window==null){
					Km.Quantifier.View.Running.view_window=new Km.Quantifier.View.QuantifierView.Window();
				}
				if (Km.Quantifier.View.Running.view_window.hidden){
					Km.Quantifier.View.Running.view_window.show();
					Km.Quantifier.View.Running.view_window.winTabs.hideTabStripItem(Km.Quantifier.View.Running.view_window.winTabs.tabFix);
					this.updateViewQuantifier();
					this.tvpView.toggle(true);
					Km.Quantifier.Config.View.IsShow=1;
				}else{
					this.hideQuantifier();
					Km.Quantifier.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Quantifier.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Quantifier.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Quantifier.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Quantifier.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Quantifier.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Quantifier.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Quantifier.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Quantifier.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Quantifier.View.Running.viewTabs);
					}
					break;
			}
			this.hideQuantifier();
			if (Km.Quantifier.Config.View.IsShow==0){
				Km.Quantifier.View.Running.viewTabs.enableCollapse();
				switch(Km.Quantifier.Config.View.Direction){
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
				this.updateViewQuantifier();
				this.tvpView.toggle(true);
				Km.Quantifier.Config.View.IsShow=1;
			}else{
				Km.Quantifier.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏量词
		 */
		hideQuantifier : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Quantifier.View.Running.view_window!=null){
				Km.Quantifier.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前量词显示信息
		 */
		updateViewQuantifier : function() {
			if (Km.Quantifier.View.Running.view_window!=null){
				Km.Quantifier.View.Running.view_window.winTabs.tabQuantifierDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Quantifier.View.Running.viewTabs.tabQuantifierDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建量词
		 */
		addQuantifier : function() {
			if (Km.Quantifier.View.Running.edit_window==null){
				Km.Quantifier.View.Running.edit_window=new Km.Quantifier.View.EditWindow();
			}
			Km.Quantifier.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Quantifier.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Quantifier.View.Running.edit_window.setTitle('添加量词');
			Km.Quantifier.View.Running.edit_window.savetype=0;
			Km.Quantifier.View.Running.edit_window.quantifier_id.setValue("");

			Km.Quantifier.View.Running.edit_window.show();
			Km.Quantifier.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑量词时先获得选中的量词信息
		 */
		updateQuantifier : function() {
			if (Km.Quantifier.View.Running.edit_window==null){
				Km.Quantifier.View.Running.edit_window=new Km.Quantifier.View.EditWindow();
			}
			Km.Quantifier.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Quantifier.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Quantifier.View.Running.edit_window.setTitle('修改量词');
			Km.Quantifier.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Quantifier.View.Running.edit_window.savetype=1;

			Km.Quantifier.View.Running.edit_window.show();
			Km.Quantifier.View.Running.edit_window.maximize();
		},
		/**
		 * 删除量词
		 */
		deleteQuantifier : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的量词吗?', this.confirmDeleteQuantifier,this);
		},
		/**
		 * 确认删除量词
		 */
		confirmDeleteQuantifier : function(btn) {
			if (btn == 'yes') {
				var del_quantifier_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_quantifier_ids=del_quantifier_ids+selectedRows[flag].data.quantifier_id+",";
				}
				ExtServiceQuantifier.deleteByIds(del_quantifier_ids);
				this.doSelectQuantifier();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出量词
		 */
		exportQuantifier : function() {
			ExtServiceQuantifier.exportQuantifier(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入量词
		 */
		importQuantifier : function() {
			if (Km.Quantifier.View.current_uploadWindow==null){
				Km.Quantifier.View.current_uploadWindow=new Km.Quantifier.View.UploadWindow();
			}
			Km.Quantifier.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Quantifier.View.Running.quantifierGrid=new Km.Quantifier.View.Grid();
			if (Km.Quantifier.Config.View.IsFix==0){
				Km.Quantifier.View.Running.quantifierGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Quantifier.View.Running.quantifierGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Quantifier.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Quantifier.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前量词Grid对象
		 */
		quantifierGrid:null,
		/**
		 * 显示量词信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Quantifier.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Quantifier.Init();
	/**
	 * 量词数据模型获取数据Direct调用
	 */
	Km.Quantifier.Store.quantifierStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceQuantifier.queryPageQuantifier}
	});
	/**
	 * 量词页面布局
	 */
	Km.Quantifier.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Quantifier.View.Panel()]
	});
	Km.Quantifier.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});