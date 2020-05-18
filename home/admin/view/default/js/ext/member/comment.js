Ext.namespace("Kmall.Admin.Comment");
Km = Kmall.Admin.Comment;
Km.Comment={
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
			 * 显示会员评论的视图相对会员评论列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示会员评论信息页(或者打开新窗口)
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
		if (Km.Comment.Cookie.get('View.Direction')){
			Km.Comment.Config.View.Direction=Km.Comment.Cookie.get('View.Direction');
		}
		if (Km.Comment.Cookie.get('View.IsFix')!=null){
			Km.Comment.Config.View.IsFix=Km.Comment.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Comment.Store = {
	/**
	 * 会员评论
	 */
	commentStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				{name: 'comment_id',type: 'int'},
				{name: 'member_id',type: 'int'},
				{name: 'username',type: 'string'},
				{name: 'memberName',type: 'string'},
				{name: 'product_id',type: 'string'},
				{name: 'product_name',type: 'string'},
				{name: 'email',type: 'string'},
				{name: 'content',type: 'string'},
				{name: 'comment_rank',type: 'string'},
                {name: 'comment_rankShow',type: 'string'},
				{name: 'ip_address',type: 'string'},
				{name: 'isShow',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					Ext.apply(options.params, Km.Comment.View.Running.commentGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	}),
	/**
	 * 会员
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
			{name: 'memberName', mapping: 'username'}
		])
	}),
	/**
	 * 商品
	 */
	productStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/product.php'
		}),
		reader: new Ext.data.JsonReader({
			root: 'products',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'product_id'
		}, [
			{name: 'product_id', mapping: 'product_id'},
			{name: 'product_name', mapping: 'product_name'}
		])
	})
}
/**
 * View:会员评论显示组件
 */
Km.Comment.View={
	/**
	 * 编辑窗口：新建或者修改会员评论
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
						ckeditor_replace_content();
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
							{xtype: 'hidden',  name : 'comment_id',ref:'../comment_id'},
							{xtype: 'hidden',name : 'member_id',id:'member_id'},
							{
								 fieldLabel : '会员名(<font color=red>*</font>)',xtype: 'combo',name : 'memberName',id : 'memberName',
								 store:Km.Comment.Store.memberStore,emptyText: '请选择会员',itemSelector: 'div.search-item',allowBlank : true,
								 loadingText: '查询中...',width: 570, pageSize:Km.Comment.Config.PageSize,
								 displayField:'memberName',// 显示文本
								 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
								 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
								 tpl:new Ext.XTemplate(
											'<tpl for="."><div class="search-item">',
												'<h3>{memberName}</h3>',
											'</div></tpl>'
								 ),
								 onSelect:function(record,index){
									 if(this.fireEvent('beforeselect', this, record, index) !== false){
										Ext.getCmp("member_id").setValue(record.data.member_id);
										Ext.getCmp("memberName").setValue(record.data.memberName);
										this.collapse();
									 }
								 }
							},
							{xtype: 'hidden',name : 'product_id',id:'product_id'},
							{
								 fieldLabel : '商品名称',xtype: 'combo',name : 'product_name',id : 'product_name',
								 store:Km.Comment.Store.productStore,emptyText: '请选择商品',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Comment.Config.PageSize,
								 displayField:'product_name',// 显示文本
								 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
								 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
								 tpl:new Ext.XTemplate(
											'<tpl for="."><div class="search-item">',
												'<h3>{product_name}</h3>',
											'</div></tpl>'
								 ),
								 onSelect:function(record,index){
									 if(this.fireEvent('beforeselect', this, record, index) !== false){
										Ext.getCmp("product_id").setValue(record.data.product_id);
										Ext.getCmp("product_name").setValue(record.data.product_name);
										this.collapse();
									 }
								 }
							},
							{fieldLabel : '邮件地址(<font color=red>*</font>)',name : 'email',allowBlank : false},
							{fieldLabel : '评论内容(<font color=red>*</font>)',name : 'content',allowBlank : false,xtype : 'textarea',id:'content',ref:'content'},
							{fieldLabel : '评价的IP地址(<font color=red>*</font>)',name : 'ip_address',allowBlank : false},
							{fieldLabel : '状态(<font color=red>*</font>)',hiddenName : 'isShow',allowBlank : false,xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '否'], ['1', '是']]
								}),emptyText: '请选择状态',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							}
						]
					})
				],
				buttons : [ {
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {
						if (CKEDITOR.instances.content){
							this.editForm.content.setValue(CKEDITOR.instances.content.getData());
						}
						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;
						if (this.savetype==0){
							this.editForm.api.submit=ExtServiceComment.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Comment.View.Running.commentGrid.doSelectComment();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceComment.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Comment.View.Running.commentGrid.doSelectComment();
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
						this.editForm.form.loadRecord(Km.Comment.View.Running.commentGrid.getSelectionModel().getSelected());
						if (CKEDITOR.instances.content){
							CKEDITOR.instances.content.setData(Km.Comment.View.Running.commentGrid.getSelectionModel().getSelected().data.content);
						}
					}
				}]
			}, config);
			Km.Comment.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示会员评论详情
	 */
	CommentView:{
		/**
		 * Tab页：容器包含显示与会员评论所有相关的信息
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
								if (Km.Comment.View.Running.commentGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择会员评论！');
									return false;
								}
								Km.Comment.Config.View.IsShow=1;
								Km.Comment.View.Running.commentGrid.showComment();
								Km.Comment.View.Running.commentGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Comment.View.CommentView.Tabs.superclass.constructor.call(this, config);
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Comment.Config.View.Direction==1)||(Km.Comment.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabCommentDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">',
						 '    <tr class="entry"><td class="head">会员名 :</td><td class="content">{memberName}</td></tr>',
						 '    <tr class="entry"><td class="head">商品名 :</td><td class="content">{product_name}</td></tr>',
						 '    <tr class="entry"><td class="head">邮件地址 :</td><td class="content">{email}</td></tr>',
						 '    <tr class="entry"><td class="head">评论内容 :</td><td class="content">{content}</td></tr>',
                         '    <tr class="entry"><td class="head">评价的IP地址</td><td class="content">{ip_address}</td></tr>',
						 '    <tr class="entry"><td class="head">状态</td><td class="content"><tpl if="isShow == true">是</tpl><tpl if="isShow == false">否</tpl></td></tr>',
					 '</table>'
					 ]
					}
				);
			}
		}),
		/**
		 * 窗口:显示会员评论信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看会员评论",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Comment.View.CommentView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Comment.Config.View.IsShow=0;
							Km.Comment.View.Running.commentGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Comment.Config.View.IsShow=0;
							Km.Comment.View.Running.commentGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Comment.View.Running.commentGrid.addComment();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Comment.View.Running.commentGrid.updateComment();}
					}]
				}, config);
				Km.Comment.View.CommentView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传会员评论
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量会员评论上传',
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
							emptyText: '请上传会员评论Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadComment',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Comment.View.Running.commentGrid.doSelectComment();
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
			Km.Comment.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：会员评论列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Comment.Store.commentStore,
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
						{header : '会员名',dataIndex : 'memberName'},
						{header : '商品名',dataIndex : 'product_name'},
						{header : '评论内容',dataIndex : 'content',width:300},
						{header : '评价的IP地址',dataIndex : 'ip_address'},
						{header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}}
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
                                '会员名 ','&nbsp;&nbsp;',{ref: '../cmemberName',xtype: 'combo',
                                     store:Km.Comment.Store.memberStore,hiddenName : 'order_id',
                                     emptyText: '请选择会员',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width:260,pageSize:Km.Comment.Config.PageSize,
                                     displayField:'memberName',valueField:'member_id',
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                         '<tpl for="."><div class="search-item">',
                                         '<h3>{memberName}</h3>',
                                         '</div></tpl>'
                                     )
                                },'&nbsp;&nbsp;',
								'商品编号　',{ref: '../cproduct_id'},'&nbsp;&nbsp;',
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectComment();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.cmemberName.setValue("");
										this.topToolbar.cproduct_id.setValue("");
										this.filter={};
										this.doSelectComment();
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
								},
								//'-',{
//									text : '添加会员评论',iconCls : 'icon-add',ref: '../../btnSave',
//									handler : function() {
//										this.addComment();
//									}
//								},'-',{
//									text : '修改会员评论', ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
//									handler : function() {
//										this.updateComment();
//									}
//								},
								'-',{
									text : '删除会员评论', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteComment();
									}
								},
//								'-',{
//									text : '导入',iconCls : 'icon-import', ref: '../../btnImport',
//									handler : function() {
//										this.importComment();
//									}
//								},
								'-',{
									text : '导出',iconCls : 'icon-export', ref: '../../btnExport',
									handler : function() {
										this.exportComment();
									}
                                },'-',{
                                    text : '显示',iconCls : 'icon-export', ref: '../../btnShow',disabled : true,
                                    handler : function() {
                                        this.btnshowComment();
                                    }
                                },'-',{
                                    text : '隐藏',iconCls : 'icon-export', ref: '../../btnHide',disabled : true,
                                    handler : function() {
                                        this.btnhideComment();
                                    }
								},'-',{
									xtype:'tbsplit',text: '查看会员评论', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showComment()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideComment();Km.Comment.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Comment.Cookie.set('View.IsFix',Km.Comment.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Comment.Config.PageSize,
					store: Km.Comment.Store.commentStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Comment.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Comment.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Comment.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectComment();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Comment.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Comment.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectComment();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示会员评论列表
			this.doSelectComment();
			Km.Comment.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的会员评论信息Tab页
			Km.Comment.View.Running.viewTabs=new Km.Comment.View.CommentView.Tabs();
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
					//this.grid.btnUpdate.setDisabled(sm.getCount() != 1);
					this.grid.tvpView.setDisabled(sm.getCount() != 1);
                    this.grid.btnShow.setDisabled(sm.getCount() < 1);
                    this.grid.btnHide.setDisabled(sm.getCount() < 1);
				},
				rowselect: function(sm, rowIndex, record) {
					this.grid.updateViewComment();
					if (sm.getCount() != 1){
						this.grid.hideComment();
						Km.Comment.Config.View.IsShow=0;
					}else{
						if (Km.Comment.View.IsSelectView==1){
							Km.Comment.View.IsSelectView=0;
							this.grid.showComment();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Comment.Config.View.IsShow==1){
							Km.Comment.View.IsSelectView=1;
						}
						this.grid.hideComment();
						Km.Comment.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Comment.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showComment();
				this.tvpView.toggle(true);
			}else{
				this.hideComment();
				Km.Comment.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Comment.Config.View.IsFix=1;
			}else{
			   Km.Comment.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Comment.Config.View.IsShow=0;
				return ;
			}
			if (Km.Comment.Config.View.IsShow==1){
			   this.hideComment();
			   Km.Comment.Config.View.IsShow=0;
			}
			this.showComment();
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
		 * 查询符合条件的会员评论
		 */
		doSelectComment : function() {
			if (this.topToolbar){
				var cmemberName = this.topToolbar.cmemberName.getValue();
				var cproduct_id = this.topToolbar.cproduct_id.getValue();
				this.filter       ={'memberName':cmemberName,'product_id':cproduct_id};
			}
			var condition = {'start':0,'limit':Km.Comment.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceComment.queryPageComment(condition,function(provider, response) {
				if (response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Comment.Store.commentStore.loadData(result);
				} else {
					Km.Comment.Store.commentStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的会员评论！');
				}
			});
		},
		/**
		 * 显示会员评论视图
		 * 显示会员评论的视图相对会员评论列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Comment.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Comment.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Comment.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Comment.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Comment.View.Running.viewTabs);
					break;
			}
			Km.Comment.Cookie.set('View.Direction',Km.Comment.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Comment.Config.View.IsFix==0)&&(Km.Comment.Config.View.IsShow==1)){
					this.showComment();
				}
				Km.Comment.Config.View.IsFix=1;
				Km.Comment.View.Running.commentGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Comment.Config.View.IsShow=0;
				this.showComment();
			}
		},
		/**
		 * 显示会员评论
		 */
		showComment : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择会员评论！');
				Km.Comment.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Comment.Config.View.IsFix==0){
				if (Km.Comment.View.Running.view_window==null){
					Km.Comment.View.Running.view_window=new Km.Comment.View.CommentView.Window();
				}
				if (Km.Comment.View.Running.view_window.hidden){
					Km.Comment.View.Running.view_window.show();
					Km.Comment.View.Running.view_window.winTabs.hideTabStripItem(Km.Comment.View.Running.view_window.winTabs.tabFix);
					this.updateViewComment();
					this.tvpView.toggle(true);
					Km.Comment.Config.View.IsShow=1;
				}else{
					this.hideComment();
					Km.Comment.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Comment.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Comment.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Comment.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Comment.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Comment.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Comment.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Comment.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Comment.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Comment.View.Running.viewTabs);
					}
					break;
			}
			this.hideComment();
			if (Km.Comment.Config.View.IsShow==0){
				Km.Comment.View.Running.viewTabs.enableCollapse();
				switch(Km.Comment.Config.View.Direction){
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
				this.updateViewComment();
				this.tvpView.toggle(true);
				Km.Comment.Config.View.IsShow=1;
			}else{
				Km.Comment.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏会员评论
		 */
		hideComment : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Comment.View.Running.view_window!=null){
				Km.Comment.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前会员评论显示信息
		 */
		updateViewComment : function() {
			if (Km.Comment.View.Running.view_window!=null){
				Km.Comment.View.Running.view_window.winTabs.tabCommentDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Comment.View.Running.viewTabs.tabCommentDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建会员评论
		 */
		addComment : function() {
			if (Km.Comment.View.Running.edit_window==null){
				Km.Comment.View.Running.edit_window=new Km.Comment.View.EditWindow();
			}
			Km.Comment.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Comment.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Comment.View.Running.edit_window.setTitle('添加会员评论');
			Km.Comment.View.Running.edit_window.savetype=0;
			Km.Comment.View.Running.edit_window.comment_id.setValue("");
			if (CKEDITOR.instances.content){
				CKEDITOR.instances.content.setData("");
			}
			Km.Comment.View.Running.edit_window.show();
			Km.Comment.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑会员评论时先获得选中的会员评论信息
		 */
		updateComment : function() {
			if (Km.Comment.View.Running.edit_window==null){
				Km.Comment.View.Running.edit_window=new Km.Comment.View.EditWindow();
			}
			Km.Comment.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Comment.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Comment.View.Running.edit_window.setTitle('修改会员评论');
			Km.Comment.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Comment.View.Running.edit_window.savetype=1;
			if (CKEDITOR.instances.content){
				CKEDITOR.instances.content.setData(this.getSelectionModel().getSelected().data.content);
			}
			Km.Comment.View.Running.edit_window.show();
			Km.Comment.View.Running.edit_window.maximize();
		},
		/**
		 * 删除会员评论
		 */
		deleteComment : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的会员评论吗?', this.confirmDeleteComment,this);
		},
		/**
		 * 确认删除会员评论
		 */
		confirmDeleteComment : function(btn) {
			if (btn == 'yes') {
				var del_comment_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_comment_ids=del_comment_ids+selectedRows[flag].data.comment_id+",";
				}
				ExtServiceComment.deleteByIds(del_comment_ids);
				this.doSelectComment();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},

        /**
         * 显示评论
         */
        btnshowComment : function() {
            Ext.Msg.confirm('提示', '确实要显示所选的评论吗?', this.confirmBtnshowComment,this);
        },
        /**
         * 确认显示评论
         */
        confirmBtnshowComment : function(btn) {
            if (btn == 'yes') {
                var show_comment_ids = new Array();
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    show_comment_ids[flag]=selectedRows[flag].data.comment_id;
                }
                ExtServiceComment.showByIds(show_comment_ids);
                this.doSelectComment();
                Ext.Msg.alert("提示", "显示成功！");
            }
        },
        /**
         * 隐藏评论
         */
        btnhideComment : function() {
            Ext.Msg.confirm('提示', '确实要隐藏所选的评论吗?', this.confirmBtnhideComment,this);
        },
        /**
         * 确认隐藏评论
         */
        confirmBtnhideComment : function(btn) {
            if (btn == 'yes') {
                var hide_comment_ids = new Array();
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    hide_comment_ids[flag]=selectedRows[flag].data.comment_id;
                }
                ExtServiceComment.hideByIds(hide_comment_ids);
                this.doSelectComment();
                Ext.Msg.alert("提示", "隐藏成功！");
            }
        },


		/**
		 * 导出会员评论
		 */
		exportComment : function() {
			ExtServiceComment.exportComment(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入会员评论
		 */
		importComment : function() {
			if (Km.Comment.View.current_uploadWindow==null){
				Km.Comment.View.current_uploadWindow=new Km.Comment.View.UploadWindow();
			}
			Km.Comment.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Comment.View.Running.commentGrid=new Km.Comment.View.Grid();
			if (Km.Comment.Config.View.IsFix==0){
				Km.Comment.View.Running.commentGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Comment.View.Running.commentGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Comment.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Comment.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前会员评论Grid对象
		 */
		commentGrid:null,
		/**
		 * 显示会员评论信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Comment.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Comment.Init();
	/**
	 * 会员评论数据模型获取数据Direct调用
	 */
	Km.Comment.Store.commentStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceComment.queryPageComment}
	});
	/**
	 * 会员评论页面布局
	 */
	Km.Comment.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Comment.View.Panel()]
	});
	Km.Comment.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});
