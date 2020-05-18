Ext.namespace("Kmall.Admin.Department");
Km = Kmall.Admin;
Km.Department={
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
			 * 显示部门的视图相对部门列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示部门信息页(或者打开新窗口)
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
		if (Km.Department.Cookie.get('View.Direction')){
			Km.Department.Config.View.Direction=Km.Department.Cookie.get('View.Direction');
		}
		if (Km.Department.Cookie.get('View.IsFix')!=null){
			Km.Department.Config.View.IsFix=Km.Department.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Department.Store = {
	/**
	 * 部门
	 */
	departmentStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
                {name: 'department_id',type: 'int'},
                {name: 'department_name',type: 'string'},
                {name: 'isShow',type: 'string'},
                {name: 'sort_order',type: 'int'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (!options.params.limit)options.params.limit=Km.Department.Config.PageSize;
					Ext.apply(options.params, Km.Department.View.Running.departmentGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:部门显示组件
 */
Km.Department.View={
	/**
	 * 编辑窗口：新建或者修改部门
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
                            {xtype: 'hidden',name : 'department_id',ref:'../department_id'},
                            {fieldLabel : '部门名称',name : 'department_name',allowBlank : false},
                            {fieldLabel : '否是显示',hiddenName : 'isShow'
                                 ,xtype:'combo',ref:'../isShow',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择否是显示',
                                 valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '部门排序',name : 'sort_order',xtype : 'numberfield'}
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
							this.editForm.api.submit=ExtServiceDepartment.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Department.View.Running.departmentGrid.doSelectDepartment();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
									Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceDepartment.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Km.Department.View.Running.departmentGrid.store.reload();
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Department.View.Running.departmentGrid.bottomToolbar.doRefresh();
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
						this.editForm.form.loadRecord(Km.Department.View.Running.departmentGrid.getSelectionModel().getSelected());

					}
				}]
			}, config);
			Km.Department.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示部门详情
	 */
	DepartmentView:{
		/**
		 * Tab页：容器包含显示与部门所有相关的信息
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
								if (Km.Department.View.Running.departmentGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择部门！');
									return false;
								}
								Km.Department.Config.View.IsShow=1;
								Km.Department.View.Running.departmentGrid.showDepartment();
								Km.Department.View.Running.departmentGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Department.View.DepartmentView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Department.Config.View.Direction==1)||(Km.Department.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabDepartmentDetail',iconCls:'tabs',
					 tpl: [
						 '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">部门名称</td><td class="content">{department_name}</td></tr>',
                         '    <tr class="entry"><td class="head">否是显示</td><td class="content"><tpl if="isShow == true">是</tpl><tpl if="isShow == false">否</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">部门排序</td><td class="content">{sort_order}</td></tr>',
						 '</table>'
					 ]}
				);
                this.add(
                    {title: '其他',iconCls:'tabs'}
                );
			}
		}),
		/**
		 * 窗口:显示部门信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看部门",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Department.View.DepartmentView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Department.Config.View.IsShow=0;
							Km.Department.View.Running.departmentGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Department.Config.View.IsShow=0;
							Km.Department.View.Running.departmentGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增部门',scope:this,
						handler : function() {this.hide();Km.Department.View.Running.departmentGrid.addDepartment();}
					},{
						text: '修改部门',scope:this,
						handler : function() {this.hide();Km.Department.View.Running.departmentGrid.updateDepartment();}
					}]
				}, config);
				Km.Department.View.DepartmentView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传部门
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量上传部门数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
							emptyText: '请上传部门Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadDepartment',
									success : function(form, response) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Department.View.Running.departmentGrid.doSelectDepartment();
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
			Km.Department.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),

	/**
	 * 视图：部门列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Department.Store.departmentStore,
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
                        {header : '标识',dataIndex : 'department_id',hidden:true},
                        {header : '部门名称',dataIndex : 'department_name'},
                        {header : '否是显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '部门排序',dataIndex : 'sort_order'}
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
										if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectDepartment();
									}
								}
							},
							items : [
                                '部门名称:　',{ref: '../departmentname'},"&nbsp;&nbsp;",
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectDepartment();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
                                        this.topToolbar.departmentname.setValue("");
										this.filter={};
										this.doSelectDepartment();
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
									text : '添加部门',iconCls : 'icon-add',
									handler : function() {
										this.addDepartment();
									}
								},'-',{
									text : '修改部门',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateDepartment();
									}
								},'-',{
									text : '删除部门', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteDepartment();
									}
								},'-',{
									xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
									handler : function() {
										this.importDepartment();
									},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'批量导入部门',iconCls : 'icon-import',scope:this,handler:function(){this.importDepartment()}}
										]}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportDepartment();
									}
								},'-',{
									xtype:'tbsplit',text: '查看部门', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showDepartment()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideDepartment();Km.Department.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Department.Cookie.set('View.IsFix',Km.Department.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Department.Config.PageSize,
					store: Km.Department.Store.departmentStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
						change:function(thisbar,pagedata){
							if (Km.Department.Config.View.IsShow==1){
								Km.Department.View.IsSelectView=1;
							}
							this.ownerCt.hideDepartment();
							Km.Department.Config.View.IsShow=0;
						}
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Department.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Department.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Department.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectDepartment();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Department.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Department.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectDepartment();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示部门列表
			this.doSelectDepartment();
			Km.Department.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的部门信息Tab页
			Km.Department.View.Running.viewTabs=new Km.Department.View.DepartmentView.Tabs();
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
					this.grid.updateViewDepartment();
					if (sm.getCount() != 1){
						this.grid.hideDepartment();
						Km.Department.Config.View.IsShow=0;
					}else{
						if (Km.Department.View.IsSelectView==1){
							Km.Department.View.IsSelectView=0;
							this.grid.showDepartment();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Department.Config.View.IsShow==1){
							Km.Department.View.IsSelectView=1;
						}
						this.grid.hideDepartment();
						Km.Department.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Department.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showDepartment();
				this.tvpView.toggle(true);
			}else{
				this.hideDepartment();
				Km.Department.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Department.Config.View.IsFix=1;
			}else{
			   Km.Department.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Department.Config.View.IsShow=0;
				return ;
			}
			if (Km.Department.Config.View.IsShow==1){
			   this.hideDepartment();
			   Km.Department.Config.View.IsShow=0;
			}
			this.showDepartment();
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
		 * 查询符合条件的部门
		 */
		doSelectDepartment : function() {
			if (this.topToolbar){
                var departmentname = this.topToolbar.departmentname.getValue();
                this.filter ={'department_name':departmentname};
			}
			var condition = {'start':0,'limit':Km.Department.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceDepartment.queryPageDepartment(condition,function(provider, response) {
				if (response.result&&response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Department.Store.departmentStore.loadData(result);
				} else {
					Km.Department.Store.departmentStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的部门！');
				}
			});
		},
		/**
		 * 显示部门视图
		 * 显示部门的视图相对部门列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Department.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Department.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Department.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Department.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Department.View.Running.viewTabs);
					break;
			}
			Km.Department.Cookie.set('View.Direction',Km.Department.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Department.Config.View.IsFix==0)&&(Km.Department.Config.View.IsShow==1)){
					this.showDepartment();
				}
				Km.Department.Config.View.IsFix=1;
				Km.Department.View.Running.departmentGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Department.Config.View.IsShow=0;
				this.showDepartment();
			}
		},
		/**
		 * 显示部门
		 */
		showDepartment : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择部门！');
				Km.Department.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Department.Config.View.IsFix==0){
				if (Km.Department.View.Running.view_window==null){
					Km.Department.View.Running.view_window=new Km.Department.View.DepartmentView.Window();
				}
				if (Km.Department.View.Running.view_window.hidden){
					Km.Department.View.Running.view_window.show();
					Km.Department.View.Running.view_window.winTabs.hideTabStripItem(Km.Department.View.Running.view_window.winTabs.tabFix);
					this.updateViewDepartment();
					this.tvpView.toggle(true);
					Km.Department.Config.View.IsShow=1;
				}else{
					this.hideDepartment();
					Km.Department.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Department.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Department.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Department.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Department.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Department.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Department.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Department.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Department.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Department.View.Running.viewTabs);
					}
					break;
			}
			this.hideDepartment();
			if (Km.Department.Config.View.IsShow==0){
				Km.Department.View.Running.viewTabs.enableCollapse();
				switch(Km.Department.Config.View.Direction){
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
				this.updateViewDepartment();
				this.tvpView.toggle(true);
				Km.Department.Config.View.IsShow=1;
			}else{
				Km.Department.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏部门
		 */
		hideDepartment : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Department.View.Running.view_window!=null){
				Km.Department.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前部门显示信息
		 */
		updateViewDepartment : function() {

			if (Km.Department.View.Running.view_window!=null){
				Km.Department.View.Running.view_window.winTabs.tabDepartmentDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Department.View.Running.viewTabs.tabDepartmentDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建部门
		 */
		addDepartment : function() {
			if (Km.Department.View.Running.edit_window==null){
				Km.Department.View.Running.edit_window=new Km.Department.View.EditWindow();
			}
			Km.Department.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Department.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Department.View.Running.edit_window.setTitle('添加部门');
			Km.Department.View.Running.edit_window.savetype=0;
			Km.Department.View.Running.edit_window.department_id.setValue("");

			Km.Department.View.Running.edit_window.show();
			Km.Department.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑部门时先获得选中的部门信息
		 */
		updateDepartment : function() {
			if (Km.Department.View.Running.edit_window==null){
				Km.Department.View.Running.edit_window=new Km.Department.View.EditWindow();
			}
			Km.Department.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Department.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Department.View.Running.edit_window.setTitle('修改部门');
			Km.Department.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Department.View.Running.edit_window.savetype=1;

			Km.Department.View.Running.edit_window.show();
			Km.Department.View.Running.edit_window.maximize();
		},
		/**
		 * 删除部门
		 */
		deleteDepartment : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的部门吗?', this.confirmDeleteDepartment,this);
		},
		/**
		 * 确认删除部门
		 */
		confirmDeleteDepartment : function(btn) {
			if (btn == 'yes') {
				var del_department_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_department_ids=del_department_ids+selectedRows[flag].data.department_id+",";
				}
				ExtServiceDepartment.deleteByIds(del_department_ids);
				this.doSelectDepartment();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出部门
		 */
		exportDepartment : function() {
			ExtServiceDepartment.exportDepartment(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入部门
		 */
		importDepartment : function() {
			if (Km.Department.View.current_uploadWindow==null){
				Km.Department.View.current_uploadWindow=new Km.Department.View.UploadWindow();
			}
			Km.Department.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Department.View.Running.departmentGrid=new Km.Department.View.Grid();
			if (Km.Department.Config.View.IsFix==0){
				Km.Department.View.Running.departmentGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Department.View.Running.departmentGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Department.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Department.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前部门Grid对象
		 */
		departmentGrid:null,

		/**
		 * 显示部门信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Department.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Department.Init();
	/**
	 * 部门数据模型获取数据Direct调用
	 */
	Km.Department.Store.departmentStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceDepartment.queryPageDepartment}
	});
	/**
	 * 部门页面布局
	 */
	Km.Department.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Department.View.Panel()]
	});
	Km.Department.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});
