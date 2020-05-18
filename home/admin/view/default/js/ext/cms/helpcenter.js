Ext.namespace("Kmall.Admin.Helpcenter");
Km = Kmall.Admin.Helpcenter;
Km.Helpcenter={
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
			 * 显示帮助中心的视图相对帮助中心列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示帮助中心信息页(或者打开新窗口)
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
		if (Km.Helpcenter.Cookie.get('View.Direction')){
			Km.Helpcenter.Config.View.Direction=Km.Helpcenter.Cookie.get('View.Direction');
		}
		if (Km.Helpcenter.Cookie.get('View.IsFix')!=null){
			Km.Helpcenter.Config.View.IsFix=Km.Helpcenter.Cookie.get('View.IsFix');
		}
		if (Ext.util.Cookies.get('OnlineEditor')!=null){
			Km.Helpcenter.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
		}
	}
};
/**
 * Model:数据模型
 */
Km.Helpcenter.Store = {
	/**
	 * 帮助中心
	 */
	helpcenterStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				{name: 'helpcenter_id',type: 'int'},
				{name: 'help_title',type: 'string'},
				{name: 'help_content',type: 'string'},
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
					Ext.apply(options.params, Km.Helpcenter.View.Running.helpcenterGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:帮助中心显示组件
 */
Km.Helpcenter.View={
	/**
	 * 编辑窗口：新建或者修改帮助中心
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
                        switch (Km.Helpcenter.Config.OnlineEditor)
                        {
                            case 1:
                                ckeditor_replace_help_content();
                                break
                            case 2:
                                Km.Helpcenter.View.EditWindow.KindEditor_help_content = KindEditor.create('textarea[name="help_content"]',{width:'98%',minHeith:'350px', filterMode:true});
                                break
                            case 3:
                                pageInit_help_content();
                                break
                            default:
                                this.editForm.help_content.setWidth("98%");
                                pageInit_ue_help_content();
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
							xtype : 'textfield',anchor:'100%'
						},
						items : [
							{xtype: 'hidden',  name : 'helpcenter_id',ref:'../helpcenter_id'},
							{fieldLabel : '标题',name : 'help_title'},
							{fieldLabel : '内容',name : 'help_content',xtype : 'textarea',id:'help_content',ref:'help_content'},
							{fieldLabel : '是否显示',hiddenName : 'isShow',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '否'], ['1', '是']]
								}),emptyText: '请选择是否显示',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							{fieldLabel : '排序顺序',name : 'sort_order'}
						]
					})
				],
				buttons : [ {
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {
                        switch (Km.Helpcenter.Config.OnlineEditor)
                        {
                            case 1:
                                if (CKEDITOR.instances.help_content) this.editForm.help_content.setValue(CKEDITOR.instances.help_content.getData());
                                break
                            case 2:
                                if (Km.Helpcenter.View.EditWindow.KindEditor_help_content)this.editForm.help_content.setValue(Km.Helpcenter.View.EditWindow.KindEditor_help_content.html());
                                break
                            case 3:
                                if (xhEditor_help_content)this.editForm.help_content.setValue(xhEditor_help_content.getSource());
                                break
                            default:
                                if (ue_help_content)this.editForm.help_content.setValue(ue_help_content.getContent());
                        }

						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;
						if (this.savetype==0){
							this.editForm.api.submit=ExtServiceHelpcenter.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Helpcenter.View.Running.helpcenterGrid.doSelectHelpcenter();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceHelpcenter.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Helpcenter.View.Running.helpcenterGrid.doSelectHelpcenter();
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
						this.editForm.form.loadRecord(Km.Helpcenter.View.Running.helpcenterGrid.getSelectionModel().getSelected());
						switch (Km.Helpcenter.Config.OnlineEditor)
                        {
                            case 1:
                                if (CKEDITOR.instances.help_content) CKEDITOR.instances.help_content.setData(Km.Helpcenter.View.Running.helpcenterGrid.getSelectionModel().getSelected().data.help_content);
                                break
                            case 2:
                                if (Km.Helpcenter.View.EditWindow.KindEditor_help_content) Km.Helpcenter.View.EditWindow.KindEditor_help_content.html(Km.Helpcenter.View.Running.helpcenterGrid.getSelectionModel().getSelected().data.help_content);
                                break
                            case 3:
                                if (xhEditor_help_content) xhEditor_help_content.setSource(Km.Helpcenter.View.Running.helpcenterGrid.getSelectionModel().getSelected().data.help_content);
                                break
                            default:
                                if (ue_help_content) ue_help_content.setContent(Km.Helpcenter.View.Running.helpcenterGrid.getSelectionModel().getSelected().data.help_content);
                        }
					}
				}]
			}, config);
			Km.Helpcenter.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示帮助中心详情
	 */
	HelpcenterView:{
		/**
		 * Tab页：容器包含显示与帮助中心所有相关的信息
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
								if (Km.Helpcenter.View.Running.helpcenterGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择帮助中心！');
									return false;
								}
								Km.Helpcenter.Config.View.IsShow=1;
								Km.Helpcenter.View.Running.helpcenterGrid.showHelpcenter();
								Km.Helpcenter.View.Running.helpcenterGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Helpcenter.View.HelpcenterView.Tabs.superclass.constructor.call(this, config);
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Helpcenter.Config.View.Direction==1)||(Km.Helpcenter.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabHelpcenterDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">',
						 '<tr class="entry"><td class="head">标题 :</td><td class="content">{help_title}</td></tr>',
						 '<tr class="entry"><td class="head">内容 :</td><td class="content">{help_content}</td></tr>',
						 '<tr class="entry"><td class="head">是否显示 :</td><td class="content"><tpl if="isShow == true">是</tpl><tpl if="isShow == false">否</tpl></td></tr>',
						 '<tr class="entry"><td class="head">排序顺序 :</td><td class="content">{sort_order}</td></tr>',
					 '</table>'
					 ]
					}
				);
			}
		}),
		/**
		 * 窗口:显示帮助中心信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看帮助中心",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Helpcenter.View.HelpcenterView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Helpcenter.Config.View.IsShow=0;
							Km.Helpcenter.View.Running.helpcenterGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Helpcenter.Config.View.IsShow=0;
							Km.Helpcenter.View.Running.helpcenterGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Helpcenter.View.Running.helpcenterGrid.addHelpcenter();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Helpcenter.View.Running.helpcenterGrid.updateHelpcenter();}
					}]
				}, config);
				Km.Helpcenter.View.HelpcenterView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传帮助中心
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量帮助中心上传',
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
							emptyText: '请上传帮助中心Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadHelpcenter',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Helpcenter.View.Running.helpcenterGrid.doSelectHelpcenter();
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
			Km.Helpcenter.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：帮助中心列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Helpcenter.Store.helpcenterStore,
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
						{header : '标题',dataIndex : 'help_title'},
						{header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
						{header : '排序顺序',dataIndex : 'sort_order'}
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
								'标题　',{ref: '../hhelp_title'},'&nbsp;&nbsp;',
								'内容　',{ref: '../hhelp_content'},'&nbsp;&nbsp;',
								'是否显示　',{ref: '../hisShow',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '否'], ['1', '是']]
									}),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectHelpcenter();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.hhelp_title.setValue("");
										this.topToolbar.hhelp_content.setValue("");
										this.topToolbar.hisShow.setValue("");
										this.filter={};
										this.doSelectHelpcenter();
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
									text : '添加帮助中心',iconCls : 'icon-add',
									handler : function() {
										this.addHelpcenter();
									}
								},'-',{
									text : '修改帮助中心',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateHelpcenter();
									}
								},'-',{
									text : '删除帮助中心', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteHelpcenter();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import',
									handler : function() {
										this.importHelpcenter();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportHelpcenter();
									}
								},'-',{
									xtype:'tbsplit',text: '查看帮助中心', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showHelpcenter()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideHelpcenter();Km.Helpcenter.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Helpcenter.Cookie.set('View.IsFix',Km.Helpcenter.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Helpcenter.Config.PageSize,
					store: Km.Helpcenter.Store.helpcenterStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Helpcenter.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Helpcenter.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Helpcenter.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectHelpcenter();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Helpcenter.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Helpcenter.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectHelpcenter();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示帮助中心列表
			this.doSelectHelpcenter();
			Km.Helpcenter.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的帮助中心信息Tab页
			Km.Helpcenter.View.Running.viewTabs=new Km.Helpcenter.View.HelpcenterView.Tabs();
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
					this.grid.updateViewHelpcenter();
					if (sm.getCount() != 1){
						this.grid.hideHelpcenter();
						Km.Helpcenter.Config.View.IsShow=0;
					}else{
						if (Km.Helpcenter.View.IsSelectView==1){
							Km.Helpcenter.View.IsSelectView=0;
							this.grid.showHelpcenter();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Helpcenter.Config.View.IsShow==1){
							Km.Helpcenter.View.IsSelectView=1;
						}
						this.grid.hideHelpcenter();
						Km.Helpcenter.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Helpcenter.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showHelpcenter();
				this.tvpView.toggle(true);
			}else{
				this.hideHelpcenter();
				Km.Helpcenter.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Helpcenter.Config.View.IsFix=1;
			}else{
			   Km.Helpcenter.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Helpcenter.Config.View.IsShow=0;
				return ;
			}
			if (Km.Helpcenter.Config.View.IsShow==1){
			   this.hideHelpcenter();
			   Km.Helpcenter.Config.View.IsShow=0;
			}
			this.showHelpcenter();
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
		 * 查询符合条件的帮助中心
		 */
		doSelectHelpcenter : function() {
			if (this.topToolbar){
				var hhelp_title = this.topToolbar.hhelp_title.getValue();
				var hhelp_content = this.topToolbar.hhelp_content.getValue();
				var hisShow = this.topToolbar.hisShow.getValue();
				this.filter       ={'help_title':hhelp_title,'help_content':hhelp_content,'isShow':hisShow};
			}
			var condition = {'start':0,'limit':Km.Helpcenter.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceHelpcenter.queryPageHelpcenter(condition,function(provider, response) {
				if (response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Helpcenter.Store.helpcenterStore.loadData(result);
				} else {
					Km.Helpcenter.Store.helpcenterStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的帮助中心！');
				}
			});
		},
		/**
		 * 显示帮助中心视图
		 * 显示帮助中心的视图相对帮助中心列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Helpcenter.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Helpcenter.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Helpcenter.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Helpcenter.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Helpcenter.View.Running.viewTabs);
					break;
			}
			Km.Helpcenter.Cookie.set('View.Direction',Km.Helpcenter.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Helpcenter.Config.View.IsFix==0)&&(Km.Helpcenter.Config.View.IsShow==1)){
					this.showHelpcenter();
				}
				Km.Helpcenter.Config.View.IsFix=1;
				Km.Helpcenter.View.Running.helpcenterGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Helpcenter.Config.View.IsShow=0;
				this.showHelpcenter();
			}
		},
		/**
		 * 显示帮助中心
		 */
		showHelpcenter : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择帮助中心！');
				Km.Helpcenter.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Helpcenter.Config.View.IsFix==0){
				if (Km.Helpcenter.View.Running.view_window==null){
					Km.Helpcenter.View.Running.view_window=new Km.Helpcenter.View.HelpcenterView.Window();
				}
				if (Km.Helpcenter.View.Running.view_window.hidden){
					Km.Helpcenter.View.Running.view_window.show();
					Km.Helpcenter.View.Running.view_window.winTabs.hideTabStripItem(Km.Helpcenter.View.Running.view_window.winTabs.tabFix);
					this.updateViewHelpcenter();
					this.tvpView.toggle(true);
					Km.Helpcenter.Config.View.IsShow=1;
				}else{
					this.hideHelpcenter();
					Km.Helpcenter.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Helpcenter.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Helpcenter.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Helpcenter.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Helpcenter.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Helpcenter.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Helpcenter.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Helpcenter.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Helpcenter.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Helpcenter.View.Running.viewTabs);
					}
					break;
			}
			this.hideHelpcenter();
			if (Km.Helpcenter.Config.View.IsShow==0){
				Km.Helpcenter.View.Running.viewTabs.enableCollapse();
				switch(Km.Helpcenter.Config.View.Direction){
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
				this.updateViewHelpcenter();
				this.tvpView.toggle(true);
				Km.Helpcenter.Config.View.IsShow=1;
			}else{
				Km.Helpcenter.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏帮助中心
		 */
		hideHelpcenter : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Helpcenter.View.Running.view_window!=null){
				Km.Helpcenter.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前帮助中心显示信息
		 */
		updateViewHelpcenter : function() {
			if (Km.Helpcenter.View.Running.view_window!=null){
				Km.Helpcenter.View.Running.view_window.winTabs.tabHelpcenterDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Helpcenter.View.Running.viewTabs.tabHelpcenterDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建帮助中心
		 */
		addHelpcenter : function() {
			if (Km.Helpcenter.View.Running.edit_window==null){
				Km.Helpcenter.View.Running.edit_window=new Km.Helpcenter.View.EditWindow();
			}
			Km.Helpcenter.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Helpcenter.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Helpcenter.View.Running.edit_window.setTitle('添加帮助中心');
			Km.Helpcenter.View.Running.edit_window.savetype=0;
			Km.Helpcenter.View.Running.edit_window.helpcenter_id.setValue("");
            switch (Km.Helpcenter.Config.OnlineEditor)
            {
                case 1:
                    if (CKEDITOR.instances.help_content) CKEDITOR.instances.help_content.setData("");
                    break
                case 2:
                    if (Km.Helpcenter.View.EditWindow.KindEditor_help_content) Km.Helpcenter.View.EditWindow.KindEditor_help_content.html("");
                    break
                case 3:
                    break
                default:
                    if (ue_help_content)ue_help_content.setContent("");
            }
			Km.Helpcenter.View.Running.edit_window.show();
			Km.Helpcenter.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑帮助中心时先获得选中的帮助中心信息
		 */
		updateHelpcenter : function() {
			if (Km.Helpcenter.View.Running.edit_window==null){
				Km.Helpcenter.View.Running.edit_window=new Km.Helpcenter.View.EditWindow();
			}
			Km.Helpcenter.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Helpcenter.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Helpcenter.View.Running.edit_window.setTitle('修改帮助中心');
			Km.Helpcenter.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Helpcenter.View.Running.edit_window.savetype=1;
            switch (Km.Helpcenter.Config.OnlineEditor)
            {
                case 1:
                    if (CKEDITOR.instances.help_content) CKEDITOR.instances.help_content.setData(this.getSelectionModel().getSelected().data.help_content);
                    break
                case 2:
                    if (Km.Helpcenter.View.EditWindow.KindEditor_help_content) Km.Helpcenter.View.EditWindow.KindEditor_help_content.html(this.getSelectionModel().getSelected().data.help_content);
                    break
                case 3:
                    if (xhEditor_help_content)xhEditor_help_content.setSource(this.getSelectionModel().getSelected().data.help_content);
                    break
                default:
                    if (ue_help_content)ue_help_content.setContent(this.getSelectionModel().getSelected().data.help_content);
            }
			Km.Helpcenter.View.Running.edit_window.show();
			Km.Helpcenter.View.Running.edit_window.maximize();
		},
		/**
		 * 删除帮助中心
		 */
		deleteHelpcenter : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的帮助中心吗?', this.confirmDeleteHelpcenter,this);
		},
		/**
		 * 确认删除帮助中心
		 */
		confirmDeleteHelpcenter : function(btn) {
			if (btn == 'yes') {
				var del_helpcenter_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_helpcenter_ids=del_helpcenter_ids+selectedRows[flag].data.helpcenter_id+",";
				}
				ExtServiceHelpcenter.deleteByIds(del_helpcenter_ids);
				this.doSelectHelpcenter();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出帮助中心
		 */
		exportHelpcenter : function() {
			ExtServiceHelpcenter.exportHelpcenter(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入帮助中心
		 */
		importHelpcenter : function() {
			if (Km.Helpcenter.View.current_uploadWindow==null){
				Km.Helpcenter.View.current_uploadWindow=new Km.Helpcenter.View.UploadWindow();
			}
			Km.Helpcenter.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Helpcenter.View.Running.helpcenterGrid=new Km.Helpcenter.View.Grid();
			if (Km.Helpcenter.Config.View.IsFix==0){
				Km.Helpcenter.View.Running.helpcenterGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Helpcenter.View.Running.helpcenterGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Helpcenter.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Helpcenter.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前帮助中心Grid对象
		 */
		helpcenterGrid:null,
		/**
		 * 显示帮助中心信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Helpcenter.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Helpcenter.Init();
	/**
	 * 帮助中心数据模型获取数据Direct调用
	 */
	Km.Helpcenter.Store.helpcenterStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceHelpcenter.queryPageHelpcenter}
	});
	/**
	 * 帮助中心页面布局
	 */
	Km.Helpcenter.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Helpcenter.View.Panel()]
	});
	Km.Helpcenter.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});