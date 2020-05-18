Ext.namespace("Kmall.Admin.Ads");
Km = Kmall.Admin.Ads;
Km.Ads={
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
			 * 显示广告的视图相对广告列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示广告信息页(或者打开新窗口)
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
		if (Km.Ads.Cookie.get('View.Direction')){
			Km.Ads.Config.View.Direction=Km.Ads.Cookie.get('View.Direction');
		}
		if (Km.Ads.Cookie.get('View.IsFix')!=null){
			Km.Ads.Config.View.IsFix=Km.Ads.Cookie.get('View.IsFix');
		}
	}
}; 
/**
 * Model:数据模型   
 */
Km.Ads.Store = { 
	/**
	 * 广告
	 */ 
	adsStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',  
			root: 'data',remoteSort: true,                
			fields : [
				{name: 'ads_id',type: 'int'},
				{name: 'name',type: 'string'},
				{name: 'adstype',type: 'string'},
                {name: 'adstypeShow',type: 'string'},
				{name: 'link',type: 'string'},
				{name: 'image',type: 'string'},
				{name: 'isShow',type: 'string'},
				{name: 'sort_order',type: 'int'},
				{name: 'link_man',type: 'string'},
				{name: 'link_email',type: 'string'},
				{name: 'link_phone',type: 'string'},
				{name: 'click_count',type: 'string'},
				{name: 'width',type: 'string'},
				{name: 'height',type: 'string'}
			]}         
		),
		writer: new Ext.data.JsonWriter({
			encode: false 
		}),
		listeners : {    
			beforeload : function(store, options) {   
				if (Ext.isReady) {  
					Ext.apply(options.params, Km.Ads.View.Running.adsGrid.filter);//保证分页也将查询条件带上  
				}
			}
		}    
	})      
};
/**
 * View:广告显示组件   
 */
Km.Ads.View={ 
	/**
	 * 编辑窗口：新建或者修改广告
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
							xtype : 'textfield',anchor:'100%'
						},
						items : [ 
							{xtype: 'hidden',  name : 'ads_id',ref:'../ads_id'},
							{fieldLabel : '广告名',name : 'name'},
							{fieldLabel : '广告类型',hiddenName : 'adstype',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['1', '首页中央'],['2', '首页右侧'],['3', '首页右下'],['4', '首页下方'],['5','首页中上']]
								}),emptyText: '请选择广告类型',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							{fieldLabel : '广告链接',name : 'link'},
							{xtype: 'hidden',  name : 'image',ref:'../image'},
							{fieldLabel : '广告图片',name : 'imageUpload',ref:'../imageUpload',xtype:'fileuploadfield',
							 emptyText: '请上传广告图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
							{fieldLabel : '是否显示',hiddenName : 'isShow',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '否'], ['1', '是']]
								}),emptyText: '请选择是否显示',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							},
							{fieldLabel : '排序',name : 'sort_order'},
							{fieldLabel : '联系人',name : 'link_man'},
							{fieldLabel : '联系邮件',name : 'link_email'},
							{fieldLabel : '联系电话',name : 'link_phone'},
							{fieldLabel : '点击次数',name : 'click_count'},
							{fieldLabel : '显示宽度',name : 'width'},
							{fieldLabel : '显示高度',name : 'height'}        
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
							this.editForm.api.submit=ExtServiceAds.save;                   
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Ads.View.Running.adsGrid.doSelectAds();
									form.reset(); 
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceAds.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Ads.View.Running.adsGrid.doSelectAds();
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
						this.editForm.form.loadRecord(Km.Ads.View.Running.adsGrid.getSelectionModel().getSelected());
						this.imageUpload.setValue(this.image.getValue());
 
					}                  
				}]    
			}, config);  
			Km.Ads.View.EditWindow.superclass.constructor.call(this, config);     
		}
	}),
	/**
	 * 显示广告详情
	 */
	AdsView:{
		/**
		 * Tab页：容器包含显示与广告所有相关的信息
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
								if (Km.Ads.View.Running.adsGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择广告！');
									return false;
								} 
								Km.Ads.Config.View.IsShow=1;
								Km.Ads.View.Running.adsGrid.showAds();   
								Km.Ads.View.Running.adsGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Ads.View.AdsView.Tabs.superclass.constructor.call(this, config); 
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Ads.Config.View.Direction==1)||(Km.Ads.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabAdsDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">', 
						 '<tr class="entry"><td class="head">广告名 :</td><td class="content">{name}</td></tr>',
						 '<tr class="entry"><td class="head">广告类型 :</td><td class="content">{adstypeShow}</td></tr>',
						 '<tr class="entry"><td class="head">广告链接 :</td><td class="content">{link}</td></tr>',
						 '<tr class="entry"><td class="head">图片地址路径 :</td><td class="content">{image}</td></tr>',
						 '<tr class="entry"><td class="head">图片地址 :</td><td class="content"><img src="upload/images/{image}" /></td></tr>',
						 '<tr class="entry"><td class="head">是否显示 :</td><td class="content">{isShow}</td></tr>',
						 '<tr class="entry"><td class="head">排序 :</td><td class="content">{sort_order}</td></tr>',
						 '<tr class="entry"><td class="head">联系人 :</td><td class="content">{link_man}</td></tr>',
						 '<tr class="entry"><td class="head">联系邮件 :</td><td class="content">{link_email}</td></tr>',
						 '<tr class="entry"><td class="head">联系电话 :</td><td class="content">{link_phone}</td></tr>',
						 '<tr class="entry"><td class="head">点击次数 :</td><td class="content">{click_count}</td></tr>',
						 '<tr class="entry"><td class="head">显示宽度 :</td><td class="content">{width}</td></tr>',
						 '<tr class="entry"><td class="head">显示高度 :</td><td class="content">{height}</td></tr>',                      
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
		 * 窗口:显示广告信息
		 */
		Window:Ext.extend(Ext.Window,{ 
			constructor : function(config) { 
				config = Ext.apply({
					title:"查看广告",constrainHeader:true,maximizable: true,minimizable : true, 
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Ads.View.AdsView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: { 
						minimize:function(w){
							w.hide();
							Km.Ads.Config.View.IsShow=0;
							Km.Ads.View.Running.adsGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Ads.View.Running.adsGrid.tvpView.toggle(false);
						}   
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Ads.View.Running.adsGrid.addAds();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Ads.View.Running.adsGrid.updateAds();}
					}]
				}, config);  
				Km.Ads.View.AdsView.Window.superclass.constructor.call(this, config);   
			}        
		})
	},
	/**
	 * 窗口：批量上传广告
	 */        
	UploadWindow:Ext.extend(Ext.Window,{ 
		constructor : function(config) { 
			config = Ext.apply({     
				title : '批量广告上传',
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
							emptyText: '请上传广告Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadAds',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Ads.View.Running.adsGrid.doSelectAds();
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
			Km.Ads.View.UploadWindow.superclass.constructor.call(this, config);     
		}        
	}),
	/**
	 * 视图：广告列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件  
				 */
				filter:null,
				region : 'center',
				store : Km.Ads.Store.adsStore,
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
						{header : '广告名',dataIndex : 'name'},
						{header : '广告类型',dataIndex : 'adstypeShow'},
						{header : '广告链接',dataIndex : 'link'},
						{header : '图片地址',dataIndex : 'image'},
						{header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
						{header : '排序',dataIndex : 'sort_order'},
						{header : '联系人',dataIndex : 'link_man'},
						{header : '联系邮件',dataIndex : 'link_email'},
						{header : '联系电话',dataIndex : 'link_phone'},
						{header : '点击次数',dataIndex : 'click_count'},
						{header : '显示宽度',dataIndex : 'width'},
						{header : '显示高度',dataIndex : 'height'}                                 
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
								'广告名　',{ref: '../aname'},'&nbsp;&nbsp;',
								'广告类型　',{ref: '../aadstype',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['1', '首页中央'],['2', '首页右侧'],['3', '首页右下'],['4', '首页下方'],['5','首页中上']]
									}),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',
								'是否显示　',{ref: '../aisShow',xtype : 'combo',mode : 'local',
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
										this.doSelectAds();
									}
								}, 
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.aname.setValue("");
										this.topToolbar.aadstype.setValue("");
										this.topToolbar.aisShow.setValue("");                                        
										this.filter={};
										this.doSelectAds();
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
									text : '添加广告',iconCls : 'icon-add',
									handler : function() {
										this.addAds();
									}
								},'-',{
									text : '修改广告',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
									handler : function() {
										this.updateAds();
									}
								},'-',{
									text : '删除广告', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
									handler : function() {
										this.deleteAds();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import', 
									handler : function() {
										this.importAds();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export', 
									handler : function() { 
										this.exportAds();
									}
								},'-',{ 
									xtype:'tbsplit',text: '查看广告', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,  
									handler:function(){this.showAds()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideAds();Km.Ads.Config.View.IsShow=0;}},'-', 
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Ads.Cookie.set('View.IsFix',Km.Ads.Config.View.IsFix);}} 
										]}
								},'-']}
					)]
				},                
				bbar: new Ext.PagingToolbar({          
					pageSize: Km.Ads.Config.PageSize,
					store: Km.Ads.Store.adsStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Ads.Config.PageSize,minValue:1,width:35, 
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Ads.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Ads.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectAds();
								}, 
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Ads.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Ads.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectAds();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示广告列表
			this.doSelectAds();
			Km.Ads.View.Grid.superclass.constructor.call(this, config); 
			//创建在Grid里显示的广告信息Tab页
			Km.Ads.View.Running.viewTabs=new Km.Ads.View.AdsView.Tabs();
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
					this.grid.updateViewAds();                     
					if (sm.getCount() != 1){
						this.grid.hideAds();
						Km.Ads.Config.View.IsShow=0;
					}else{
						if (Km.Ads.View.IsSelectView==1){
							Km.Ads.View.IsSelectView=0;  
							this.grid.showAds();   
						}     
					}    
				},
				rowdeselect: function(sm, rowIndex, record) {  
					if (sm.getCount() != 1){
						if (Km.Ads.Config.View.IsShow==1){
							Km.Ads.View.IsSelectView=1;    
						}             
						this.grid.hideAds();
						Km.Ads.Config.View.IsShow=0;
					}    
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){  
			if (!Km.Ads.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showAds();
				this.tvpView.toggle(true);
			}else{
				this.hideAds();
				Km.Ads.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){ 
			if (checked){             
			   Km.Ads.Config.View.IsFix=1; 
			}else{ 
			   Km.Ads.Config.View.IsFix=0;   
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Ads.Config.View.IsShow=0;
				return ;
			}
			if (Km.Ads.Config.View.IsShow==1){
			   this.hideAds(); 
			   Km.Ads.Config.View.IsShow=0;
			}
			this.showAds();   
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
		 * 查询符合条件的广告
		 */
		doSelectAds : function() {
			if (this.topToolbar){
				var aname = this.topToolbar.aname.getValue();
				var aadstype = this.topToolbar.aadstype.getValue();
				var aisShow = this.topToolbar.aisShow.getValue();
				this.filter       ={'name':aname,'adstype':aadstype,'isShow':aisShow};
			}
			var condition = {'start':0,'limit':Km.Ads.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceAds.queryPageAds(condition,function(provider, response) {   
				if (response.result.data) {   
					var result           = new Array();
					result['data']       =response.result.data; 
					result['totalCount'] =response.result.totalCount;
					Km.Ads.Store.adsStore.loadData(result); 
				} else {
					Km.Ads.Store.adsStore.removeAll();                        
					Ext.Msg.alert('提示', '无符合条件的广告！');
				}
			});
		}, 
		/**
		 * 显示广告视图
		 * 显示广告的视图相对广告列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Ads.Config.View.Direction=viewDirection; 
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Ads.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Ads.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Ads.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Ads.View.Running.viewTabs);
					break;    
			}  
			Km.Ads.Cookie.set('View.Direction',Km.Ads.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Ads.Config.View.IsFix==0)&&(Km.Ads.Config.View.IsShow==1)){
					this.showAds();     
				}
				Km.Ads.Config.View.IsFix=1;
				Km.Ads.View.Running.adsGrid.tvpView.menu.mBind.setChecked(true,true);  
				Km.Ads.Config.View.IsShow=0;
				this.showAds();     
			}
		}, 
		/**
		 * 显示广告
		 */
		showAds : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择广告！');
				Km.Ads.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			} 
			if (Km.Ads.Config.View.IsFix==0){
				if (Km.Ads.View.Running.view_window==null){
					Km.Ads.View.Running.view_window=new Km.Ads.View.AdsView.Window();
				}
				if (Km.Ads.View.Running.view_window.hidden){
					Km.Ads.View.Running.view_window.show();
					Km.Ads.View.Running.view_window.winTabs.hideTabStripItem(Km.Ads.View.Running.view_window.winTabs.tabFix);   
					this.updateViewAds();
					this.tvpView.toggle(true);
					Km.Ads.Config.View.IsShow=1;
				}else{
					this.hideAds();
					Km.Ads.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Ads.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Ads.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Ads.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Ads.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Ads.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Ads.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Ads.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Ads.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Ads.View.Running.viewTabs);
					}
					break;    
			}  
			this.hideAds();
			if (Km.Ads.Config.View.IsShow==0){
				Km.Ads.View.Running.viewTabs.enableCollapse();  
				switch(Km.Ads.Config.View.Direction){
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
				this.updateViewAds();
				this.tvpView.toggle(true);
				Km.Ads.Config.View.IsShow=1;
			}else{
				Km.Ads.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏广告
		 */
		hideAds : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();   
			this.ownerCt.east.hide(); 
			if (Km.Ads.View.Running.view_window!=null){
				Km.Ads.View.Running.view_window.hide();
			}            
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前广告显示信息
		 */
		updateViewAds : function() {
			if (Km.Ads.View.Running.view_window!=null){
				Km.Ads.View.Running.view_window.winTabs.tabAdsDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Ads.View.Running.viewTabs.tabAdsDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建广告
		 */
		addAds : function() {  
			if (Km.Ads.View.Running.edit_window==null){   
				Km.Ads.View.Running.edit_window=new Km.Ads.View.EditWindow();   
			}     
			Km.Ads.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Ads.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Ads.View.Running.edit_window.setTitle('添加广告');
			Km.Ads.View.Running.edit_window.savetype=0;
			Km.Ads.View.Running.edit_window.image.setValue("");
			
			Km.Ads.View.Running.edit_window.show();   
			Km.Ads.View.Running.edit_window.maximize();               
		},   
		/**
		 * 编辑广告时先获得选中的广告信息
		 */
		updateAds : function() {
			if (Km.Ads.View.Running.edit_window==null){   
				Km.Ads.View.Running.edit_window=new Km.Ads.View.EditWindow();   
			}            
			Km.Ads.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Ads.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Ads.View.Running.edit_window.setTitle('修改广告');
			Km.Ads.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Ads.View.Running.edit_window.savetype=1;
			Km.Ads.View.Running.edit_window.imageUpload.setValue(Km.Ads.View.Running.edit_window.image.getValue());
			
			Km.Ads.View.Running.edit_window.show();    
			Km.Ads.View.Running.edit_window.maximize();                  
		},        
		/**
		 * 删除广告
		 */
		deleteAds : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的广告吗?', this.confirmDeleteAds,this);
		}, 
		/**
		 * 确认删除广告
		 */
		confirmDeleteAds : function(btn) {
			if (btn == 'yes') {  
				var del_ads_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_ads_ids=del_ads_ids+selectedRows[flag].data.ads_id+",";
				}
				ExtServiceAds.deleteByIds(del_ads_ids);
				this.doSelectAds();
				Ext.Msg.alert("提示", "删除成功！");        
			}
		},
		/**
		 * 导出广告
		 */
		exportAds : function() {            
			ExtServiceAds.exportAds(this.filter,function(provider, response) {  
				if (response.result.data) {
					window.open(response.result.data);
				}
			});                        
		},
		/**
		 * 导入广告
		 */
		importAds : function() { 
			if (Km.Ads.View.current_uploadWindow==null){   
				Km.Ads.View.current_uploadWindow=new Km.Ads.View.UploadWindow();   
			}     
			Km.Ads.View.current_uploadWindow.show();
		}                
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Ads.View.Running.adsGrid=new Km.Ads.View.Grid();           
			if (Km.Ads.Config.View.IsFix==0){
				Km.Ads.View.Running.adsGrid.tvpView.menu.mBind.setChecked(false,true);  
			}
			config = Ext.apply({ 
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Ads.View.Running.adsGrid, 
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Ads.View.Running.viewTabs]}, 
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
					]
				}
			}, config);   
			Km.Ads.View.Panel.superclass.constructor.call(this, config);  
		}        
	}),
	/**
	 * 当前运行的可视化对象
	 */ 
	Running:{         
		/**
		 * 当前广告Grid对象
		 */
		adsGrid:null,  
		/**
		 * 显示广告信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Ads.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);     
	Km.Ads.Init();
	/**
	 * 广告数据模型获取数据Direct调用
	 */        
	Km.Ads.Store.adsStore.proxy=new Ext.data.DirectProxy({ 
		api: {read:ExtServiceAds.queryPageAds}
	});   
	/**
	 * 广告页面布局
	 */
	Km.Ads.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Ads.View.Panel()]
	});
	Km.Ads.Viewport.doLayout();    
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});  