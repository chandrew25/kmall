Ext.namespace("Kmall.Admin.Logintype");
Km = Kmall.Admin;
Km.Logintype={
	/**
	 * 全局配置
	 */
	Config:{
		/**
		 *分页:每页显示记录数
		 */
		PageSize:100,
		/**
		 *显示配置
		 */
		View:{
			/**
			 * 显示登录类型的视图相对登录类型列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示登录类型信息页(或者打开新窗口)
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
		if (Km.Logintype.Cookie.get('View.Direction')){
			Km.Logintype.Config.View.Direction=Km.Logintype.Cookie.get('View.Direction');
		}
		if (Km.Logintype.Cookie.get('View.IsFix')!=null){
			Km.Logintype.Config.View.IsFix=Km.Logintype.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Logintype.Store = {
	/**
	 * 登录类型
	 */
	logintypeStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
                {name: 'logintype_id',type: 'int'},
                {name: 'logintype_code',type: 'string'},
                {name: 'app_name',type: 'string'},
                {name: 'app_id',type: 'string'},
                {name: 'app_key',type: 'string'},
                {name: 'app_secret',type: 'string'},
                {name: 'app_url',type: 'string'},
                {name: 'ico',type: 'string'},
                {name: 'isShow',type: 'string'},
                {name: 'sort_order',type: 'int'},
                {name: 'callbackpath',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (!options.params.limit)options.params.limit=Km.Logintype.Config.PageSize;
					Ext.apply(options.params, Km.Logintype.View.Running.logintypeGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:登录类型显示组件
 */
Km.Logintype.View={
	/**
	 * 编辑窗口：新建或者修改登录类型
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
						ref:'editForm',layout:'form',fileUpload: true,
						labelWidth : 100,labelAlign : "center",
						bodyStyle : 'padding:5px 5px 0',align : "center",
						api : {},
						defaults : {
							xtype : 'textfield',anchor:'98%'
						},
						items : [
                            {xtype: 'hidden',name : 'logintype_id',ref:'../logintype_id'},
                            {fieldLabel : '应用名称',name : 'app_name'},
                            {xtype: 'hidden',  name : 'ico',ref:'../ico'},
                            {fieldLabel : '登录图标',name : 'icoUpload',ref:'../icoUpload',xtype:'fileuploadfield',
                              emptyText: '请上传登录图标文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {fieldLabel : '排序',name : 'sort_order',xtype : 'numberfield'}
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
							this.editForm.api.submit=ExtServiceLogintype.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Logintype.View.Running.logintypeGrid.doSelectLogintype();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
									Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceLogintype.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Km.Logintype.View.Running.logintypeGrid.store.reload();
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Logintype.View.Running.logintypeGrid.bottomToolbar.doRefresh();
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
						this.editForm.form.loadRecord(Km.Logintype.View.Running.logintypeGrid.getSelectionModel().getSelected());
                        this.icoUpload.setValue(this.ico.getValue());

					}
				}]
			}, config);
			Km.Logintype.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示登录类型详情
	 */
	LogintypeView:{
		/**
		 * Tab页：容器包含显示与登录类型所有相关的信息
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
								if (Km.Logintype.View.Running.logintypeGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择登录类型！');
									return false;
								}
								Km.Logintype.Config.View.IsShow=1;
								Km.Logintype.View.Running.logintypeGrid.showLogintype();
								Km.Logintype.View.Running.logintypeGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Logintype.View.LogintypeView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Logintype.Config.View.Direction==1)||(Km.Logintype.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabLogintypeDetail',iconCls:'tabs',
					 tpl: [
						 '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">应用名称</td><td class="content">{app_name}</td></tr>',
                         '    <tpl if="app_id"><tr class="entry"><td class="head">应用id</td><td class="content">{app_id}</td></tr></tpl>',
                         '    <tr class="entry"><td class="head">client_id</td><td class="content">{app_key}</td></tr>',
                         '    <tr class="entry"><td class="head">秘钥</td><td class="content">{app_secret}</td></tr>',
                         '    <tr class="entry"><td class="head">请求调用路径</td><td class="content">{app_url}</td></tr>',
                         '    <tr class="entry"><td class="head">回调路径</td><td class="content">{callbackpath}</td></tr>',
                         '    <tr class="entry"><td class="head">登录图标</td><td class="content"><tpl if="ico"><img src="upload/images/{ico}" /></tpl></td></tr>',
                         '    <tr class="entry"><td class="head">是否安装</td><td class="content"><tpl if="isShow == true">是</tpl><tpl if="isShow == false">否</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">排序</td><td class="content">{sort_order}</td></tr>',
						 '</table>'
					 ]}
				);
			}
		}),
		/**
		 * 窗口:显示登录类型信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看登录类型",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Logintype.View.LogintypeView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Logintype.Config.View.IsShow=0;
							Km.Logintype.View.Running.logintypeGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Logintype.Config.View.IsShow=0;
							Km.Logintype.View.Running.logintypeGrid.tvpView.toggle(false);
						}
					}
				}, config);
				Km.Logintype.View.LogintypeView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 视图：登录类型列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Logintype.Store.logintypeStore,
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
						//this.sm, 行前的勾选框
                        {header : '标识',dataIndex : 'logintype_id',hidden:true},
                        {header : '应用名称',dataIndex : 'app_name'},
                        {header : '是否安装',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "<font color=green>是</font>";}else{return "<font color=red>否</font>";}}},
                        {header : '排序',dataIndex : 'sort_order'}
					]
				}),
				tbar : {
					xtype : 'container',layout : 'anchor',height : 27,style:'font-size:14px',
					defaults : {
						height : 27,anchor : '100%'
					},
					items : [
						new Ext.Toolbar({
							defaults:{scope: this},
							items : [
                                {
									text : '安装',iconCls : 'icon-add',ref: '../../btnInstall',disabled : true,
									handler : function() {
										this.installLogintype();
									}
								},'-',{
									text : '编辑',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateLogintype();
									}
								},'-',{
									text : '卸载', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.unloadLogintype();
									}
								},'-',{
									xtype:'tbsplit',text: '查看登录类型', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showLogintype()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideLogintype();Km.Logintype.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Logintype.Cookie.set('View.IsFix',Km.Logintype.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Logintype.Config.PageSize,
					store: Km.Logintype.Store.logintypeStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
						change:function(thisbar,pagedata){
							if (Km.Logintype.Viewport){
								if (Km.Logintype.Config.View.IsShow==1){
									Km.Logintype.View.IsSelectView=1;
								}
								this.ownerCt.hideLogintype();
								Km.Logintype.Config.View.IsShow=0;
							}
						}
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Logintype.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Logintype.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Logintype.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectLogintype();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Logintype.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Logintype.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectLogintype();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示登录类型列表
			this.doSelectLogintype();
			Km.Logintype.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的登录类型信息Tab页
			Km.Logintype.View.Running.viewTabs=new Km.Logintype.View.LogintypeView.Tabs();
			this.addListener('rowdblclick', this.onRowDoubleClick);
		},
		/**
		 * 行选择器
		 */
		sm : new Ext.grid.CheckboxSelectionModel({
			//handleMouseDown : Ext.emptyFn,
			listeners : {
				selectionchange:function(sm) {
					// 判断编辑和详情按钮是否可以激活
					this.grid.btnUpdate.setDisabled(sm.getCount() != 1);
					this.grid.tvpView.setDisabled(sm.getCount() != 1);
				},
				rowselect: function(sm, rowIndex, record) {
					this.grid.updateViewLogintype();
					if (sm.getCount() > 1){
                        this.grid.btnUpdate.setDisabled(true);
                        this.grid.tvpView.setDisabled(true);
                        this.grid.btnInstall.setDisabled(false);
                        this.grid.btnRemove.setDisabled(false);
						this.grid.hideLogintype();
						Km.Logintype.Config.View.IsShow=0;
					}else if(sm.getCount() == 1){
                        this.grid.tvpView.setDisabled(false);
                        this.grid.btnUpdate.setDisabled(false);
                        var data=this.grid.getSelectionModel().getSelected().data;
                        if(data.isShow=="1"){
                            this.grid.btnInstall.setDisabled(true);
                            this.grid.btnRemove.setDisabled(false);
                        }else{
                            this.grid.btnInstall.setDisabled(false);
                            this.grid.btnRemove.setDisabled(true);
                        }
						if (Km.Logintype.View.IsSelectView==1){
							Km.Logintype.View.IsSelectView=0;
							this.grid.showLogintype();
						}
					}else{
                        this.grid.btnInstall.setDisabled(true);
                        this.grid.btnRemove.setDisabled(true);
                        this.grid.btnUpdate.setDisabled(true);
                        this.grid.tvpView.setDisabled(true);
                    }
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Logintype.Config.View.IsShow==1){
							Km.Logintype.View.IsSelectView=1;
						}
						this.grid.hideLogintype();
						Km.Logintype.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Logintype.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showLogintype();
				this.tvpView.toggle(true);
			}else{
				this.hideLogintype();
				Km.Logintype.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Logintype.Config.View.IsFix=1;
			}else{
			   Km.Logintype.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Logintype.Config.View.IsShow=0;
				return ;
			}
			if (Km.Logintype.Config.View.IsShow==1){
			   this.hideLogintype();
			   Km.Logintype.Config.View.IsShow=0;
			}
			this.showLogintype();
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
		 * 查询符合条件的登录类型
		 */
		doSelectLogintype : function() {
			if (this.topToolbar){

			}
			var condition = {'start':0,'limit':Km.Logintype.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceLogintype.queryPageLogintype(condition,function(provider, response) {
                window.xml=response.result.xml;//保存配置文件信息
				if (response.result&&response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Logintype.Store.logintypeStore.loadData(result);
				} else {
					Km.Logintype.Store.logintypeStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的登录类型！');
				}
			});
		},
		/**
		 * 显示登录类型视图
		 * 显示登录类型的视图相对登录类型列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Logintype.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Logintype.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Logintype.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Logintype.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Logintype.View.Running.viewTabs);
					break;
			}
			Km.Logintype.Cookie.set('View.Direction',Km.Logintype.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Logintype.Config.View.IsFix==0)&&(Km.Logintype.Config.View.IsShow==1)){
					this.showLogintype();
				}
				Km.Logintype.Config.View.IsFix=1;
				Km.Logintype.View.Running.logintypeGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Logintype.Config.View.IsShow=0;
				this.showLogintype();
			}
		},
		/**
		 * 显示登录类型
		 */
		showLogintype : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择登录类型！');
				Km.Logintype.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Logintype.Config.View.IsFix==0){
				if (Km.Logintype.View.Running.view_window==null){
					Km.Logintype.View.Running.view_window=new Km.Logintype.View.LogintypeView.Window();
				}
				if (Km.Logintype.View.Running.view_window.hidden){
					Km.Logintype.View.Running.view_window.show();
					Km.Logintype.View.Running.view_window.winTabs.hideTabStripItem(Km.Logintype.View.Running.view_window.winTabs.tabFix);
					this.updateViewLogintype();
					this.tvpView.toggle(true);
					Km.Logintype.Config.View.IsShow=1;
				}else{
					this.hideLogintype();
					Km.Logintype.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Logintype.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Logintype.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Logintype.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Logintype.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Logintype.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Logintype.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Logintype.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Logintype.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Logintype.View.Running.viewTabs);
					}
					break;
			}
			this.hideLogintype();
			if (Km.Logintype.Config.View.IsShow==0){
				Km.Logintype.View.Running.viewTabs.enableCollapse();
				switch(Km.Logintype.Config.View.Direction){
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
				this.updateViewLogintype();
				this.tvpView.toggle(true);
				Km.Logintype.Config.View.IsShow=1;
			}else{
				Km.Logintype.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏登录类型
		 */
		hideLogintype : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Logintype.View.Running.view_window!=null){
				Km.Logintype.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前登录类型显示信息
		 */
		updateViewLogintype : function() {

			if (Km.Logintype.View.Running.view_window!=null){
				Km.Logintype.View.Running.view_window.winTabs.tabLogintypeDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Logintype.View.Running.viewTabs.tabLogintypeDetail.update(this.getSelectionModel().getSelected().data);
            //调用路径
            var data=Km.Logintype.View.Running.logintypeGrid.getSelectionModel().getSelected().data;
            for(var i=0;i<xml.logintype.length;i++){
                if(xml.logintype[i].code==data.logintype_code){
                    data.callbackpath=xml.logintype[i].callbackpath;
                    break;
                }
            }
		},
		/**
		 * 编辑登录类型时先获得选中的登录类型信息
		 */
		updateLogintype : function() {
			if (Km.Logintype.View.Running.edit_window==null){
				Km.Logintype.View.Running.edit_window=new Km.Logintype.View.EditWindow();
			}

            //获取选中的登录方式
            var logintype={};
            var data=Km.Logintype.View.Running.logintypeGrid.getSelectionModel().getSelected().data;
            for(var i=0;i<xml.logintype.length;i++){
                if(xml.logintype[i].code==data.logintype_code){
                    logintype=xml.logintype[i];
                    break;
                }
            }

            var form=Km.Logintype.View.Running.edit_window.editForm;
            //删除之前添加的表单元素
            for(var i=0;i<100;i++){
                var com=form.get("com"+i);
                if(!com){//如果找不到元素则停止查找
                    break;
                }
                form.remove(com);
            }
            //根据配置信息添加表单元素
            if(logintype.attr){
                for(var i=0;i<logintype.attr.length;i++){
                    var attr=logintype.attr[i],com,ini=3;
                    if(attr.type=="input"){
                        com=new Ext.form.TextField({
                            id:"com"+i,
                            anchor:'98%',
                            allowBlank:false,
                            fieldLabel:attr.show+"(<font color=red>*</font>)",
                            name:attr.name
                        });
                    }
                    //赋值
                    if(attr.name=="app_key"){
                        com.setValue(data.app_key);
                    }else if(attr.name=="app_secret"){
                        com.setValue(data.app_secret);
                    }else if(attr.name=="app_id"){
                        com.setValue(data.app_id);
                    }
                    form.items.insert(ini+i,com);//按顺序插入指定位置
                }
            }
            Km.Logintype.View.Running.edit_window.doLayout();//重新布局

			Km.Logintype.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Logintype.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Logintype.View.Running.edit_window.setTitle('编辑');
			Km.Logintype.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Logintype.View.Running.edit_window.savetype=1;
            Km.Logintype.View.Running.edit_window.icoUpload.setValue(Km.Logintype.View.Running.edit_window.ico.getValue());

			Km.Logintype.View.Running.edit_window.show();
			Km.Logintype.View.Running.edit_window.maximize();
		},

        /**
         * 安装支付方式
         */
        installLogintype : function() {
            var somedata=Km.Logintype.View.Running.logintypeGrid.getSelectionModel().getSelections();
            var logintype_ids="";
            for (var flag = 0; flag < somedata.length; flag++) {
                logintype_ids=logintype_ids+somedata[flag].data.logintype_id+",";
            }
            ExtServiceLogintype.installLogintype(logintype_ids,function(provider, response) {
                var grid=Km.Logintype.View.Running.logintypeGrid;
                //批量改变store值
                for(i=0;i<somedata.length;i++){
                    somedata[i].data.isShow="1";
                }
                //grid刷新值
                grid.getView().refresh();
                grid.btnInstall.setDisabled(true);
                grid.btnRemove.setDisabled(false);
                grid.updateViewLogintype();
            });
        },
        /**
         * 卸载支付方式
         */
        unloadLogintype : function() {
            var somedata=Km.Logintype.View.Running.logintypeGrid.getSelectionModel().getSelections();
            var logintype_ids="";
            for (var flag = 0; flag < somedata.length; flag++) {
                logintype_ids=logintype_ids+somedata[flag].data.logintype_id+",";
            }
            ExtServiceLogintype.unloadLogintype(logintype_ids,function(provider, response) {
                var grid=Km.Logintype.View.Running.logintypeGrid;
                //批量改变store值
                for(i=0;i<somedata.length;i++){
                    somedata[i].data.isShow="0";
                }
                //grid刷新值
                grid.getView().refresh();
                grid.btnInstall.setDisabled(false);
                grid.btnRemove.setDisabled(true);
                grid.updateViewLogintype();
            });
        }
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Logintype.View.Running.logintypeGrid=new Km.Logintype.View.Grid();
			if (Km.Logintype.Config.View.IsFix==0){
				Km.Logintype.View.Running.logintypeGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Logintype.View.Running.logintypeGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Logintype.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Logintype.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前登录类型Grid对象
		 */
		logintypeGrid:null,

		/**
		 * 显示登录类型信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Logintype.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Logintype.Init();
	/**
	 * 登录类型数据模型获取数据Direct调用
	 */
	Km.Logintype.Store.logintypeStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceLogintype.queryPageLogintype}
	});
	/**
	 * 登录类型页面布局
	 */
	Km.Logintype.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Logintype.View.Panel()]
	});
	Km.Logintype.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});