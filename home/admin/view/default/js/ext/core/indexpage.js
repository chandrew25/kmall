Ext.namespace("Kmall.Admin.Indexpage");
Km = Kmall.Admin;
Km.Indexpage={
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
			 * 显示动态首页的视图相对动态首页列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示动态首页信息页(或者打开新窗口)
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
		if (Km.Indexpage.Cookie.get('View.Direction')){
			Km.Indexpage.Config.View.Direction=Km.Indexpage.Cookie.get('View.Direction');
		}
		if (Km.Indexpage.Cookie.get('View.IsFix')!=null){
			Km.Indexpage.Config.View.IsFix=Km.Indexpage.Cookie.get('View.IsFix');
		}
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.Indexpage.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }

	}
};
/**
 * Model:数据模型
 */
Km.Indexpage.Store = {
	/**
	 * 动态首页
	 */
	indexpageStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
                {name: 'indexpage_id',type: 'int'},
                {name: 'classify_id',type: 'int'},
                {name: 'parent_id',type: 'int'},
                {name: 'title',type: 'string'},
                {name: 'type_name',type: 'string'},
                {name: 'discribe',type: 'string'},
                {name: 'mouseover',type: 'string'},
                {name: 'link',type: 'string'},
                {name: 'sta_link',type: 'string'},
                {name: 'link_name',type: 'string'},
                {name: 'price',type: 'string'},
                {name: 'price_tag',type: 'string'},
                {name: 'image',type: 'string'},
                {name: 'width',type: 'int'},
                {name: 'height',type: 'int'},
                {name: 'intro',type: 'string'},
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
					if (!options.params.limit)options.params.limit=Km.Indexpage.Config.PageSize;
					Ext.apply(options.params, Km.Indexpage.View.Running.indexpageGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:动态首页显示组件
 */
Km.Indexpage.View={
	/**
	 * 编辑窗口：新建或者修改动态首页
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
                        switch (Km.Indexpage.Config.OnlineEditor)
                        {
                            case 2:
                                Km.Indexpage.View.EditWindow.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
                                break
                            case 3:
                                pageInit_intro();
                                break
                            default:
                                ckeditor_replace_intro();
                        }
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
                            {xtype: 'hidden',name : 'indexpage_id',ref:'../indexpage_id'},
                            {fieldLabel : '分类',name : 'classify_id',xtype : 'numberfield'},
                            {fieldLabel : 'parent_id',name : 'parent_id',xtype : 'numberfield'},
                            {fieldLabel : '标题',name : 'title'},
                            {fieldLabel : '系列名',name : 'type_name'},
                            {fieldLabel : '描述',name : 'discribe'},
                            {fieldLabel : '鼠标悬停显示',name : 'mouseover'},
                            {fieldLabel : '链接',name : 'link'},
                            {fieldLabel : '静态链接',name : 'sta_link'},
                            {fieldLabel : '链接名',name : 'link_name'},
                            {fieldLabel : '价格',name : 'price'},
                            {fieldLabel : '价格标签',name : 'price_tag'},
                            {xtype: 'hidden',  name : 'image',ref:'../image'},
                            {fieldLabel : '图片地址',name : 'imageUpload',ref:'../imageUpload',xtype:'fileuploadfield',
                              emptyText: '请上传图片地址文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {fieldLabel : '图片宽度',name : 'width',xtype : 'numberfield'},
                            {fieldLabel : '图片高度',name : 'height',xtype : 'numberfield'},
                            {fieldLabel : '说明',name : 'intro',xtype : 'textarea',id:'intro',ref:'intro'},
                            {fieldLabel : '是否显示',hiddenName : 'isShow'
                                 ,xtype:'combo',ref:'../isShow',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否显示',
                                 valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '排序',name : 'sort_order',xtype : 'numberfield'}
						]
					})
				],
				buttons : [{
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {
                        switch (Km.Indexpage.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Indexpage.View.EditWindow.KindEditor_intro)this.editForm.intro.setValue(Km.Indexpage.View.EditWindow.KindEditor_intro.html());
                                break
                            case 3:
                                if (xhEditor_intro)this.editForm.intro.setValue(xhEditor_intro.getSource());
                                break
                            default:
                                if (CKEDITOR.instances.intro) this.editForm.intro.setValue(CKEDITOR.instances.intro.getData());
                        }

						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;
						if (this.savetype==0){
							this.editForm.api.submit=ExtServiceIndexpage.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Indexpage.View.Running.indexpageGrid.doSelectIndexpage();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
									Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceIndexpage.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Km.Indexpage.View.Running.indexpageGrid.store.reload();
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Indexpage.View.Running.indexpageGrid.bottomToolbar.doRefresh();
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
						this.editForm.form.loadRecord(Km.Indexpage.View.Running.indexpageGrid.getSelectionModel().getSelected());
                        this.imageUpload.setValue(this.image.getValue());
                        switch (Km.Indexpage.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Indexpage.View.EditWindow.KindEditor_intro) Km.Indexpage.View.EditWindow.KindEditor_intro.html(Km.Indexpage.View.Running.indexpageGrid.getSelectionModel().getSelected().data.intro);
                                break
                            case 3:
                                break
                            default:
                                if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(Km.Indexpage.View.Running.indexpageGrid.getSelectionModel().getSelected().data.intro);
                        }

					}
				}]
			}, config);
			Km.Indexpage.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示动态首页详情
	 */
	IndexpageView:{
		/**
		 * Tab页：容器包含显示与动态首页所有相关的信息
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
								if (Km.Indexpage.View.Running.indexpageGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择动态首页！');
									return false;
								}
								Km.Indexpage.Config.View.IsShow=1;
								Km.Indexpage.View.Running.indexpageGrid.showIndexpage();
								Km.Indexpage.View.Running.indexpageGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Indexpage.View.IndexpageView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Indexpage.Config.View.Direction==1)||(Km.Indexpage.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabIndexpageDetail',iconCls:'tabs',
					 tpl: [
						 '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">分类</td><td class="content">{classify_id}</td></tr>',
                         '    <tr class="entry"><td class="head">parent_id</td><td class="content">{parent_id}</td></tr>',
                         '    <tr class="entry"><td class="head">标题</td><td class="content">{title}</td></tr>',
                         '    <tr class="entry"><td class="head">系列名</td><td class="content">{type_name}</td></tr>',
                         '    <tr class="entry"><td class="head">描述</td><td class="content">{discribe}</td></tr>',
                         '    <tr class="entry"><td class="head">鼠标悬停显示</td><td class="content">{mouseover}</td></tr>',
                         '    <tr class="entry"><td class="head">链接</td><td class="content">{link}</td></tr>',
                         '    <tr class="entry"><td class="head">静态链接</td><td class="content">{sta_link}</td></tr>',
                         '    <tr class="entry"><td class="head">链接名</td><td class="content">{link_name}</td></tr>',
                         '    <tr class="entry"><td class="head">价格</td><td class="content">{price}</td></tr>',
                         '    <tr class="entry"><td class="head">价格标签</td><td class="content">{price_tag}</td></tr>',
                         '    <tr class="entry"><td class="head">图片地址路径</td><td class="content">{image}</td></tr>',
                         '    <tr class="entry"><td class="head">图片地址</td><td class="content"><tpl if="image"><img src="upload/images/{image}" /></tpl></td></tr>',
                         '    <tr class="entry"><td class="head">图片宽度</td><td class="content">{width}</td></tr>',
                         '    <tr class="entry"><td class="head">图片高度</td><td class="content">{height}</td></tr>',
                         '    <tr class="entry"><td class="head">说明</td><td class="content">{intro}</td></tr>',
                         '    <tr class="entry"><td class="head">是否显示</td><td class="content"><tpl if="isShow == true">是</tpl><tpl if="isShow == false">否</tpl></td></tr>',
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
		 * 窗口:显示动态首页信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看动态首页",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Indexpage.View.IndexpageView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Indexpage.Config.View.IsShow=0;
							Km.Indexpage.View.Running.indexpageGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Indexpage.View.Running.indexpageGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增动态首页',scope:this,
						handler : function() {this.hide();Km.Indexpage.View.Running.indexpageGrid.addIndexpage();}
					},{
						text: '修改动态首页',scope:this,
						handler : function() {this.hide();Km.Indexpage.View.Running.indexpageGrid.updateIndexpage();}
					}]
				}, config);
				Km.Indexpage.View.IndexpageView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传动态首页
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量上传动态首页数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
							emptyText: '请上传动态首页Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadIndexpage',
									success : function(form, response) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Indexpage.View.Running.indexpageGrid.doSelectIndexpage();
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
			Km.Indexpage.View.UploadWindow.superclass.constructor.call(this, config);
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
							emptyText: '请批量上传更新时间文件(zip)',buttonText: '',
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
							uploadImagesWindow     =this;
							validationExpression   =/([\u4E00-\u9FA5]|\w)+(.zip|.ZIP)$/;
							var isValidExcelFormat = new RegExp(validationExpression);
							var result             = isValidExcelFormat.test(this.uploadForm.upload_file.getValue());
							if (!result){
								Ext.Msg.alert('提示', '请上传ZIP文件，后缀名为zip！');
								return;
							}
							var uploadImageUrl='index.php?go=admin.upload.uploadIndexpageImages';

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
										Km.Indexpage.View.Running.indexpageGrid.doSelectIndexpage();
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
			Km.Indexpage.View.BatchUploadImagesWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：动态首页列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Indexpage.Store.indexpageStore,
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
                        {header : '标识',dataIndex : 'indexpage_id',hidden:true},
                        {header : '分类',dataIndex : 'classify_id'},
                        {header : 'parent_id',dataIndex : 'parent_id'},
                        {header : '标题',dataIndex : 'title'},
                        {header : '系列名',dataIndex : 'type_name'},
                        {header : '描述',dataIndex : 'discribe'},
                        {header : '鼠标悬停显示',dataIndex : 'mouseover'},
                        {header : '链接',dataIndex : 'link'},
                        {header : '静态链接',dataIndex : 'sta_link'},
                        {header : '链接名',dataIndex : 'link_name'},
                        {header : '价格',dataIndex : 'price'},
                        {header : '价格标签',dataIndex : 'price_tag'},
                        {header : '图片宽度',dataIndex : 'width'},
                        {header : '图片高度',dataIndex : 'height'},
                        {header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
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
										if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectIndexpage();
									}
								}
							},
							items : [

								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectIndexpage();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {

										this.filter={};
										this.doSelectIndexpage();
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
									text : '添加动态首页',iconCls : 'icon-add',
									handler : function() {
										this.addIndexpage();
									}
								},'-',{
									text : '修改动态首页',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateIndexpage();
									}
								},'-',{
									text : '删除动态首页', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteIndexpage();
									}
								},'-',{
									xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
									handler : function() {
										this.importIndexpage();
									},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'批量导入动态首页',iconCls : 'icon-import',scope:this,handler:function(){this.importIndexpage()}},
                                            {text:'批量导入图片地址',iconCls : 'icon-import',scope:this,handler:function(){this.batchUploadImages("upload_image_files","图片地址")}}
										]}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportIndexpage();
									}
								},'-',{
									xtype:'tbsplit',text: '查看动态首页', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showIndexpage()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideIndexpage();Km.Indexpage.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Indexpage.Cookie.set('View.IsFix',Km.Indexpage.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Indexpage.Config.PageSize,
					store: Km.Indexpage.Store.indexpageStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
						change:function(thisbar,pagedata){
							if (Km.Indexpage.Config.View.IsShow==1){
								Km.Indexpage.View.IsSelectView=1;
							}
							this.ownerCt.hideIndexpage();
							Km.Indexpage.Config.View.IsShow=0;
						}
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Indexpage.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Indexpage.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Indexpage.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectIndexpage();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Indexpage.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Indexpage.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectIndexpage();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示动态首页列表
			this.doSelectIndexpage();
			Km.Indexpage.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的动态首页信息Tab页
			Km.Indexpage.View.Running.viewTabs=new Km.Indexpage.View.IndexpageView.Tabs();
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
					this.grid.updateViewIndexpage();
					if (sm.getCount() != 1){
						this.grid.hideIndexpage();
						Km.Indexpage.Config.View.IsShow=0;
					}else{
						if (Km.Indexpage.View.IsSelectView==1){
							Km.Indexpage.View.IsSelectView=0;
							this.grid.showIndexpage();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Indexpage.Config.View.IsShow==1){
							Km.Indexpage.View.IsSelectView=1;
						}
						this.grid.hideIndexpage();
						Km.Indexpage.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Indexpage.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showIndexpage();
				this.tvpView.toggle(true);
			}else{
				this.hideIndexpage();
				Km.Indexpage.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Indexpage.Config.View.IsFix=1;
			}else{
			   Km.Indexpage.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Indexpage.Config.View.IsShow=0;
				return ;
			}
			if (Km.Indexpage.Config.View.IsShow==1){
			   this.hideIndexpage();
			   Km.Indexpage.Config.View.IsShow=0;
			}
			this.showIndexpage();
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
		 * 查询符合条件的动态首页
		 */
		doSelectIndexpage : function() {
			if (this.topToolbar){


			}
			var condition = {'start':0,'limit':Km.Indexpage.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceIndexpage.queryPageIndexpage(condition,function(provider, response) {
				if (response.result&&response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Indexpage.Store.indexpageStore.loadData(result);
				} else {
					Km.Indexpage.Store.indexpageStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的动态首页！');
				}
			});
		},
		/**
		 * 显示动态首页视图
		 * 显示动态首页的视图相对动态首页列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Indexpage.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Indexpage.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Indexpage.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Indexpage.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Indexpage.View.Running.viewTabs);
					break;
			}
			Km.Indexpage.Cookie.set('View.Direction',Km.Indexpage.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Indexpage.Config.View.IsFix==0)&&(Km.Indexpage.Config.View.IsShow==1)){
					this.showIndexpage();
				}
				Km.Indexpage.Config.View.IsFix=1;
				Km.Indexpage.View.Running.indexpageGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Indexpage.Config.View.IsShow=0;
				this.showIndexpage();
			}
		},
		/**
		 * 显示动态首页
		 */
		showIndexpage : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择动态首页！');
				Km.Indexpage.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Indexpage.Config.View.IsFix==0){
				if (Km.Indexpage.View.Running.view_window==null){
					Km.Indexpage.View.Running.view_window=new Km.Indexpage.View.IndexpageView.Window();
				}
				if (Km.Indexpage.View.Running.view_window.hidden){
					Km.Indexpage.View.Running.view_window.show();
					Km.Indexpage.View.Running.view_window.winTabs.hideTabStripItem(Km.Indexpage.View.Running.view_window.winTabs.tabFix);
					this.updateViewIndexpage();
					this.tvpView.toggle(true);
					Km.Indexpage.Config.View.IsShow=1;
				}else{
					this.hideIndexpage();
					Km.Indexpage.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Indexpage.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Indexpage.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Indexpage.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Indexpage.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Indexpage.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Indexpage.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Indexpage.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Indexpage.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Indexpage.View.Running.viewTabs);
					}
					break;
			}
			this.hideIndexpage();
			if (Km.Indexpage.Config.View.IsShow==0){
				Km.Indexpage.View.Running.viewTabs.enableCollapse();
				switch(Km.Indexpage.Config.View.Direction){
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
				this.updateViewIndexpage();
				this.tvpView.toggle(true);
				Km.Indexpage.Config.View.IsShow=1;
			}else{
				Km.Indexpage.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏动态首页
		 */
		hideIndexpage : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Indexpage.View.Running.view_window!=null){
				Km.Indexpage.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前动态首页显示信息
		 */
		updateViewIndexpage : function() {

			if (Km.Indexpage.View.Running.view_window!=null){
				Km.Indexpage.View.Running.view_window.winTabs.tabIndexpageDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Indexpage.View.Running.viewTabs.tabIndexpageDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建动态首页
		 */
		addIndexpage : function() {
			if (Km.Indexpage.View.Running.edit_window==null){
				Km.Indexpage.View.Running.edit_window=new Km.Indexpage.View.EditWindow();
			}
			Km.Indexpage.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Indexpage.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Indexpage.View.Running.edit_window.setTitle('添加动态首页');
			Km.Indexpage.View.Running.edit_window.savetype=0;
			Km.Indexpage.View.Running.edit_window.indexpage_id.setValue("");
            Km.Indexpage.View.Running.edit_window.imageUpload.setValue("");
            switch (Km.Indexpage.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Indexpage.View.EditWindow.KindEditor_intro) Km.Indexpage.View.EditWindow.KindEditor_intro.html("");
                    break
                case 3:
                    break
                default:
                    if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData("");
            }

			Km.Indexpage.View.Running.edit_window.show();
			Km.Indexpage.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑动态首页时先获得选中的动态首页信息
		 */
		updateIndexpage : function() {
			if (Km.Indexpage.View.Running.edit_window==null){
				Km.Indexpage.View.Running.edit_window=new Km.Indexpage.View.EditWindow();
			}
			Km.Indexpage.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Indexpage.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Indexpage.View.Running.edit_window.setTitle('修改动态首页');
			Km.Indexpage.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Indexpage.View.Running.edit_window.savetype=1;
            Km.Indexpage.View.Running.edit_window.imageUpload.setValue(Km.Indexpage.View.Running.edit_window.image.getValue());
            switch (Km.Indexpage.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Indexpage.View.EditWindow.KindEditor_intro) Km.Indexpage.View.EditWindow.KindEditor_intro.html(this.getSelectionModel().getSelected().data.intro);
                    break
                case 3:
                    if (xhEditor_intro)xhEditor_intro.setSource(this.getSelectionModel().getSelected().data.intro);
                    break
                default:
                    if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(this.getSelectionModel().getSelected().data.intro);
            }

			Km.Indexpage.View.Running.edit_window.show();
			Km.Indexpage.View.Running.edit_window.maximize();
		},
		/**
		 * 删除动态首页
		 */
		deleteIndexpage : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的动态首页吗?', this.confirmDeleteIndexpage,this);
		},
		/**
		 * 确认删除动态首页
		 */
		confirmDeleteIndexpage : function(btn) {
			if (btn == 'yes') {
				var del_indexpage_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_indexpage_ids=del_indexpage_ids+selectedRows[flag].data.indexpage_id+",";
				}
				ExtServiceIndexpage.deleteByIds(del_indexpage_ids);
				this.doSelectIndexpage();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出动态首页
		 */
		exportIndexpage : function() {
			ExtServiceIndexpage.exportIndexpage(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入动态首页
		 */
		importIndexpage : function() {
			if (Km.Indexpage.View.current_uploadWindow==null){
				Km.Indexpage.View.current_uploadWindow=new Km.Indexpage.View.UploadWindow();
			}
			Km.Indexpage.View.current_uploadWindow.show();
		},
		/**
		 * 批量上传商品图片
		 */
		batchUploadImages:function(inputname,title){
			if (Km.Indexpage.View.Running.batchUploadImagesWindow==null){
                Km.Indexpage.View.Running.batchUploadImagesWindow=new Km.Indexpage.View.BatchUploadImagesWindow();
            }

			Km.Indexpage.View.Running.batchUploadImagesWindow.setTitle("批量上传"+title);
			Km.Indexpage.View.Running.batchUploadImagesWindow.uploadForm.upload_file.name=inputname;
			Km.Indexpage.View.Running.batchUploadImagesWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Indexpage.View.Running.indexpageGrid=new Km.Indexpage.View.Grid();
			if (Km.Indexpage.Config.View.IsFix==0){
				Km.Indexpage.View.Running.indexpageGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Indexpage.View.Running.indexpageGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Indexpage.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Indexpage.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前动态首页Grid对象
		 */
		indexpageGrid:null,

		/**
		 * 显示动态首页信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Indexpage.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Indexpage.Init();
	/**
	 * 动态首页数据模型获取数据Direct调用
	 */
	Km.Indexpage.Store.indexpageStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceIndexpage.queryPageIndexpage}
	});
	/**
	 * 动态首页页面布局
	 */
	Km.Indexpage.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Indexpage.View.Panel()]
	});
	Km.Indexpage.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});