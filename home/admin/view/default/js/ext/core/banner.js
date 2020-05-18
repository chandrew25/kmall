Ext.namespace("Kmall.Admin.Banner");
Km = Kmall.Admin;
Km.Banner={
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
			 * 显示广告栏目的视图相对广告栏目列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示广告栏目信息页(或者打开新窗口)
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
		if (Km.Banner.Cookie.get('View.Direction')){
			Km.Banner.Config.View.Direction=Km.Banner.Cookie.get('View.Direction');
		}
		if (Km.Banner.Cookie.get('View.IsFix')!=null){
			Km.Banner.Config.View.IsFix=Km.Banner.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Banner.Store = {
	/**
	 * 广告栏目
	 */
	bannerStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				{name: 'banner_id',type: 'int'},
				{name: 'typeShow',type: 'string'},
				{name: 'type',type: 'string'},
				{name: 'url',type: 'string'},
				{name: 'size',type: 'string'},
				{name: 'sort',type: 'int'},
				{name: 'links',type: 'string'},
				{name: 'isShow',type: 'string'},
				{name: 'description',type: 'string'}
			]
		}),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (!options.params.limit)options.params.limit=Km.Banner.Config.PageSize;
					Ext.apply(options.params, Km.Banner.View.Running.bannerGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:广告栏目显示组件
 */
Km.Banner.View={
	/**
	 * 编辑窗口：新建或者修改广告栏目
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
						this.editForm.getForm().reset();
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
							{xtype: 'hidden',name : 'banner_id',ref:'../banner_id'},
							{fieldLabel : '广告栏目类型(<font color=red>*</font>)',hiddenName : 'type',allowBlank : false,xtype:'combo',ref:'../type',
								mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
									fields : ['value', 'text'],
									data : [['1', '首页banner'],['2', '首页排行'],['3', '首页精品推荐'],['4', '首页礼包左'],['5', '首页礼包右'],['6', '首页楼层广告'],['7', '首页家纺天地'],['8', '首页家电世界'],['9', '首页家居生活'],['10', '首页食品饮料'],['11', '首页母婴精品'],['12', '首页珠宝配饰'],['13', '首页衣包鞋帽'],['14', '首页轻奢美妆'],['15', '首页旅游户外'],['16', '商品列表banner'],['17', '大牌馆banner'],['18', '国家馆banner'],['19', '国家馆广告'],['20', '活动馆banner'],['21', '活动馆排行'],['22', '活动馆清单banner'],['23', '活动馆清单广告'],['24', '礼包馆banner'],['25', '礼包馆广告'],['26', '私宠馆banner'],['27', '财富-理财banner'],['28', '财富-众筹banner'],['29', '财富-保险banner'],['30', '财富-房产banner'],['31', '财富-汽车banner'],['32', '拍卖馆banner'],['33', '商品详情广告'],['34', '秒杀页面banner'],['35', '手机端首页banner'],['36', '手机端首页广告']]
								}),emptyText: '请选择广告栏目类型',
								valueField : 'value',displayField : 'text'
							},
							{xtype: 'hidden',name : 'url',ref:'../url'},
							{fieldLabel : '图片地址',name : 'urlUpload',ref:'../urlUpload',xtype:'fileuploadfield',
							emptyText: '请上传图片地址文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
							{fieldLabel : '图片大小(<font color=red>*</font>)',name : 'size',allowBlank : false},
							{fieldLabel : '排序',name : 'sort',xtype : 'numberfield'},
							{fieldLabel : '链接地址',name : 'links'},
							{fieldLabel : '是否显示(<font color=red>*</font>)',hiddenName : 'isShow',allowBlank : false
								 ,xtype:'combo',ref:'../isShow',mode : 'local',triggerAction : 'all',
								 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
								 store : new Ext.data.SimpleStore({
									 fields : ['value', 'text'],
									 data : [['0', '否'], ['1', '是']]
								 }),emptyText: '请选择是否显示',
								 valueField : 'value',displayField : 'text'
							},
							{fieldLabel : '说明',name : 'description'}
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
							this.editForm.api.submit=ExtServiceBanner.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Banner.View.Running.bannerGrid.doSelectBanner();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
									Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceBanner.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Km.Banner.View.Running.bannerGrid.store.reload();
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Banner.View.Running.bannerGrid.bottomToolbar.doRefresh();
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
						this.editForm.form.loadRecord(Km.Banner.View.Running.bannerGrid.getSelectionModel().getSelected());
						this.urlUpload.setValue(this.url.getValue());

					}
				}]
			}, config);
			Km.Banner.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示广告栏目详情
	 */
	BannerView:{
		/**
		 * Tab页：容器包含显示与广告栏目所有相关的信息
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
								if (Km.Banner.View.Running.bannerGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择广告栏目！');
									return false;
								}
								Km.Banner.Config.View.IsShow=1;
								Km.Banner.View.Running.bannerGrid.showBanner();
								Km.Banner.View.Running.bannerGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Banner.View.BannerView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Banner.Config.View.Direction==1)||(Km.Banner.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabBannerDetail',iconCls:'tabs',
					 tpl: [
						 '<table class="viewdoblock">',
						 '	<tr class="entry"><td class="head">广告栏目类型</td><td class="content">{typeShow}</td></tr>',
						 '	<tr class="entry"><td class="head">图片地址路径</td><td class="content">{url}</td></tr>',
						 '	<tr class="entry"><td class="head">图片地址</td><td class="content"><tpl if="url"><a href="upload/images/{url}" target="_blank"><img src="upload/images/{url}" /></a></tpl></td></tr>',
						 '	<tr class="entry"><td class="head">图片大小</td><td class="content">{size}</td></tr>',
						 '	<tr class="entry"><td class="head">排序</td><td class="content">{sort}</td></tr>',
						 '	<tr class="entry"><td class="head">链接地址</td><td class="content">{links}</td></tr>',
						 '	<tr class="entry"><td class="head">是否显示</td><td class="content"><tpl if="isShow == true">是</tpl><tpl if="isShow == false">否</tpl></td></tr>',
						 '	<tr class="entry"><td class="head">说明</td><td class="content">{description}</td></tr>',
						 '</table>'
					 ]}
				);
				this.add(
					{title: '其他',iconCls:'tabs'}
				);
			}
		}),
		/**
		 * 窗口:显示广告栏目信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看广告栏目",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Banner.View.BannerView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Banner.Config.View.IsShow=0;
							Km.Banner.View.Running.bannerGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Banner.Config.View.IsShow=0;
							Km.Banner.View.Running.bannerGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增广告栏目',scope:this,
						handler : function() {this.hide();Km.Banner.View.Running.bannerGrid.addBanner();}
					},{
						text: '修改广告栏目',scope:this,
						handler : function() {this.hide();Km.Banner.View.Running.bannerGrid.updateBanner();}
					}]
				}, config);
				Km.Banner.View.BannerView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传广告栏目
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量上传广告栏目数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
							emptyText: '请上传广告栏目Excel文件',buttonText: '',
							accept:'application/vnd.ms-excel',
							buttonCfg: {iconCls: 'upload-icon'}
						}]
					})
				],
				buttons : [{
					text : '上 传',
					scope:this,
					handler : function() {
						uploadWindow			=this;
						validationExpression	=/([\u4E00-\u9FA5]|\w)+(.xlsx|.XLSX|.xls|.XLS)$/;/**允许中文名*/
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
								url : 'index.php?go=admin.upload.uploadBanner',
								success : function(form, response) {
									Ext.Msg.alert('成功', '上传成功');
									uploadWindow.hide();
									uploadWindow.uploadForm.upload_file.setValue('');
									Km.Banner.View.Running.bannerGrid.doSelectBanner();
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
			Km.Banner.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 窗口：批量上传商品图片
	 */
	BatchUploadImagesWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				width : 400,height : 180,minWidth : 300,minHeight : 100,closeAction : "hide",
				layout : 'fit',plain : true,bodyStYle : 'padding:5px;',buttonAlign : 'center',
				items : [
					new Ext.form.FormPanel({
						ref:'uploadForm',fileUpload: true,
						width: 500,labelWidth: 50,autoHeight: true,baseCls: 'x-plain',
						frame:true,bodyStyle: 'padding: 10px 10px 10px 10px;',
						defaults: {
							anchor: '95%',allowBlank: false,msgTarget: 'side'
						},
						items : [{
							xtype : 'fileuploadfield',fieldLabel : '文 件',ref:'upload_file',
							emptyText: '请批量上传说明文件(zip)',buttonText: '',
							accept:'application/zip,application/x-zip-compressed',
							buttonCfg: {iconCls: 'upload-icon'}
						},
						{xtype : 'displayfield',value:'*.图片名不能重名<br/>*.压缩文件最大不要超过50M'}]
					})
				],
				buttons : [{
						text : '上 传',
						scope:this,
						handler : function() {
							uploadImagesWindow	 =this;
							validationExpression =/([\u4E00-\u9FA5]|\w)+(.zip|.ZIP)$/;
							var isValidExcelFormat = new RegExp(validationExpression);
							var result			 = isValidExcelFormat.test(this.uploadForm.upload_file.getValue());
							if (!result){
								Ext.Msg.alert('提示', '请上传ZIP文件，后缀名为zip！');
								return;
							}
							var uploadImageUrl='index.php?go=admin.upload.uploadBannerUrls';

							if (this.uploadForm.getForm().isValid()) {
								Ext.Msg.show({
									title : '请等待',msg : '文件正在上传中，请稍后...',
									animEl : 'loading',icon : Ext.Msg.WARNING,
									closable : true,progress : true,progressText : '',width : 300
								});
								this.uploadForm.getForm().submit({
									url : uploadImageUrl,
									success : function(form, response) {
										Ext.Msg.alert('成功', '上传成功');
										uploadImagesWindow.hide();
										uploadImagesWindow.uploadForm.upload_file.setValue('');
										Km.Banner.View.Running.bannerGrid.doSelectBanner();
									},
									failure : function(form, response) {
										if (response.result&&response.result.data){
											Ext.Msg.alert('错误', response.result.data);
										}
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
			Km.Banner.View.BatchUploadImagesWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：广告栏目列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Banner.Store.bannerStore,
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
						{header : '标识',dataIndex : 'banner_id',hidden:true},
						{header : '广告栏目类型',dataIndex : 'typeShow'},
						{header : '图片大小',dataIndex : 'size'},
						{header : '排序',dataIndex : 'sort'},
						{header : '链接地址',dataIndex : 'links'},
						{header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
						{header : '说明',dataIndex : 'description'}
					]
				}),
				tbar : {
					xtype : 'container',layout : 'anchor',autoScroll : true,height : 27 * 2,style:'font-size:14px',
					defaults : {
						height : 27,anchor : '100%',autoScroll : true,autoHeight : true
					},
					items : [
						new Ext.Toolbar({
							enableOverflow: true,width : 100,
							defaults : {
								xtype : 'textfield',
								listeners : {
									specialkey : function(field, e) {
										if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectBanner();
									}
								}
							},
							items : [

								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectBanner();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {

										this.filter={};
										this.doSelectBanner();
									}
								}
							]
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
									text : '添加广告栏目',iconCls : 'icon-add',
									handler : function() {
										this.addBanner();
									}
								},'-',{
									text : '修改广告栏目',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateBanner();
									}
								},'-',{
									text : '删除广告栏目', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteBanner();
									}
								},'-',{
									xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
									handler : function() {
										this.importBanner();
									},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'批量导入广告栏目',iconCls : 'icon-import',scope:this,handler:function(){this.importBanner()}},
											{text:'批量导入图片地址',iconCls : 'icon-import',scope:this,handler:function(){this.batchUploadImages("upload_url_files","图片地址")}}
										]}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportBanner();
									}
								},'-',{
									xtype:'tbsplit',text: '查看广告栏目', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showBanner()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideBanner();Km.Banner.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Banner.Cookie.set('View.IsFix',Km.Banner.Config.View.IsFix);}}
										]
									}
								},'-'
							]
						}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Banner.Config.PageSize,
					store: Km.Banner.Store.bannerStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
						change:function(thisbar,pagedata){
							if (Km.Banner.Viewport){
								if (Km.Banner.Config.View.IsShow==1){
									Km.Banner.View.IsSelectView=1;
								}
								this.ownerCt.hideBanner();
								Km.Banner.Config.View.IsShow=0;
							}
						}
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Banner.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Banner.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Banner.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectBanner();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Banner.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Banner.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectBanner();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示广告栏目列表
			this.doSelectBanner();
			Km.Banner.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的广告栏目信息Tab页
			Km.Banner.View.Running.viewTabs=new Km.Banner.View.BannerView.Tabs();
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
					if (sm.getCount() != 1){
						this.grid.hideBanner();
						Km.Banner.Config.View.IsShow=0;
					}else{
						if (Km.Banner.View.IsSelectView==1){
							Km.Banner.View.IsSelectView=0;
							this.grid.showBanner();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Banner.Config.View.IsShow==1){
							Km.Banner.View.IsSelectView=1;
						}
						this.grid.hideBanner();
						Km.Banner.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Banner.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showBanner();
				this.tvpView.toggle(true);
			}else{
				this.hideBanner();
				Km.Banner.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
				Km.Banner.Config.View.IsFix=1;
			}else{
				Km.Banner.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Banner.Config.View.IsShow=0;
				return ;
			}
			if (Km.Banner.Config.View.IsShow==1){
				this.hideBanner();
				Km.Banner.Config.View.IsShow=0;
			}
			this.showBanner();
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
		 * 查询符合条件的广告栏目
		 */
		doSelectBanner : function() {
			if (this.topToolbar){


			}
			var condition = {'start':0,'limit':Km.Banner.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceBanner.queryPageBanner(condition,function(provider, response) {
				if (response.result&&response.result.data) {
					var result			 = new Array();
					result['data']		 = response.result.data;
					result['totalCount'] = response.result.totalCount;
					Km.Banner.Store.bannerStore.loadData(result);
				} else {
					Km.Banner.Store.bannerStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的广告栏目！');
				}
			});
		},
		/**
		 * 显示广告栏目视图
		 * 显示广告栏目的视图相对广告栏目列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Banner.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Banner.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Banner.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Banner.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Banner.View.Running.viewTabs);
					break;
			}
			Km.Banner.Cookie.set('View.Direction',Km.Banner.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Banner.Config.View.IsFix==0)&&(Km.Banner.Config.View.IsShow==1)){
					this.showBanner();
				}
				Km.Banner.Config.View.IsFix=1;
				Km.Banner.View.Running.bannerGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Banner.Config.View.IsShow=0;
				this.showBanner();
			}
		},
		/**
		 * 显示广告栏目
		 */
		showBanner : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择广告栏目！');
				Km.Banner.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Banner.Config.View.IsFix==0){
				if (Km.Banner.View.Running.view_window==null){
					Km.Banner.View.Running.view_window=new Km.Banner.View.BannerView.Window();
				}
				if (Km.Banner.View.Running.view_window.hidden){
					Km.Banner.View.Running.view_window.show();
					Km.Banner.View.Running.view_window.winTabs.hideTabStripItem(Km.Banner.View.Running.view_window.winTabs.tabFix);
					this.updateViewBanner();
					this.tvpView.toggle(true);
					Km.Banner.Config.View.IsShow=1;
				}else{
					this.hideBanner();
					Km.Banner.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Banner.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Banner.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Banner.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Banner.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Banner.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Banner.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Banner.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Banner.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Banner.View.Running.viewTabs);
					}
					break;
			}
			this.hideBanner();
			if (Km.Banner.Config.View.IsShow==0){
				Km.Banner.View.Running.viewTabs.enableCollapse();
				switch(Km.Banner.Config.View.Direction){
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
				this.updateViewBanner();
				this.tvpView.toggle(true);
				Km.Banner.Config.View.IsShow=1;
			}else{
				Km.Banner.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏广告栏目
		 */
		hideBanner : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Banner.View.Running.view_window!=null){
				Km.Banner.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前广告栏目显示信息
		 */
		updateViewBanner : function() {

			if (Km.Banner.View.Running.view_window!=null){
				Km.Banner.View.Running.view_window.winTabs.tabBannerDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Banner.View.Running.viewTabs.tabBannerDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建广告栏目
		 */
		addBanner : function() {
			if (Km.Banner.View.Running.edit_window==null){
				Km.Banner.View.Running.edit_window=new Km.Banner.View.EditWindow();
			}
			Km.Banner.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Banner.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Banner.View.Running.edit_window.setTitle('添加广告栏目');
			Km.Banner.View.Running.edit_window.savetype=0;
			Km.Banner.View.Running.edit_window.banner_id.setValue("");
			Km.Banner.View.Running.edit_window.urlUpload.setValue("");

			Km.Banner.View.Running.edit_window.show();
			Km.Banner.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑广告栏目时先获得选中的广告栏目信息
		 */
		updateBanner : function() {
			if (Km.Banner.View.Running.edit_window==null){
				Km.Banner.View.Running.edit_window=new Km.Banner.View.EditWindow();
			}
			Km.Banner.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Banner.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Banner.View.Running.edit_window.setTitle('修改广告栏目');
			Km.Banner.View.Running.edit_window.savetype=1;

			Km.Banner.View.Running.edit_window.show();
			Km.Banner.View.Running.edit_window.maximize();

			Km.Banner.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Banner.View.Running.edit_window.urlUpload.setValue(Km.Banner.View.Running.edit_window.url.getValue());

		},
		/**
		 * 删除广告栏目
		 */
		deleteBanner : function() {
			Ext.Msg.confirm('提示', '确认要删除所选的广告栏目吗?', this.confirmDeleteBanner,this);
		},
		/**
		 * 确认删除广告栏目
		 */
		confirmDeleteBanner : function(btn) {
			if (btn == 'yes') {
				var del_banner_ids ="";
				var selectedRows	= this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_banner_ids=del_banner_ids+selectedRows[flag].data.banner_id+",";
				}
				ExtServiceBanner.deleteByIds(del_banner_ids);
				this.doSelectBanner();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出广告栏目
		 */
		exportBanner : function() {
			ExtServiceBanner.exportBanner(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入广告栏目
		 */
		importBanner : function() {
			if (Km.Banner.View.current_uploadWindow==null){
				Km.Banner.View.current_uploadWindow=new Km.Banner.View.UploadWindow();
			}
			Km.Banner.View.current_uploadWindow.show();
		},
		/**
		 * 批量上传商品图片
		 */
		batchUploadImages:function(inputname,title){
			if (Km.Banner.View.Running.batchUploadImagesWindow==null){
				Km.Banner.View.Running.batchUploadImagesWindow=new Km.Banner.View.BatchUploadImagesWindow();
			}

			Km.Banner.View.Running.batchUploadImagesWindow.setTitle("批量上传"+title);
			Km.Banner.View.Running.batchUploadImagesWindow.uploadForm.upload_file.name=inputname;
			Km.Banner.View.Running.batchUploadImagesWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Banner.View.Running.bannerGrid=new Km.Banner.View.Grid();
			if (Km.Banner.Config.View.IsFix==0){
				Km.Banner.View.Running.bannerGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Banner.View.Running.bannerGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Banner.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Banner.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前广告栏目Grid对象
		 */
		bannerGrid:null,

		/**
		 * 显示广告栏目信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Banner.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Banner.Init();
	/**
	 * 广告栏目数据模型获取数据Direct调用
	 */
	Km.Banner.Store.bannerStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceBanner.queryPageBanner}
	});
	/**
	 * 广告栏目页面布局
	 */
	Km.Banner.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Banner.View.Panel()]
	});
	Km.Banner.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});
