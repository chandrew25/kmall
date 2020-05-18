Ext.namespace("Kmall.Admin.Address");
Km = Kmall.Admin.Address;
Km.Address={
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
			 * 显示会员收货人地址信息的视图相对会员收货人地址信息列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示会员收货人地址信息信息页(或者打开新窗口)
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
		if (Km.Address.Cookie.get('View.Direction')){
			Km.Address.Config.View.Direction=Km.Address.Cookie.get('View.Direction');
		}
		if (Km.Address.Cookie.get('View.IsFix')!=null){
			Km.Address.Config.View.IsFix=Km.Address.Cookie.get('View.IsFix');
		}
	}
}; 
/**
 * Model:数据模型   
 */
Km.Address.Store = { 
	/**
	 * 会员收货人地址信息
	 */ 
	addressStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',  
			root: 'data',remoteSort: true,                
			fields : [
				{name: 'address_id',type: 'string'},
				{name: 'member_id',type: 'string'},
				{name: 'username',type: 'string'},
				{name: 'consignee',type: 'string'},
				{name: 'email',type: 'string'},
				{name: 'country',type: 'string'},
				{name: 'province',type: 'string'},
				{name: 'city',type: 'string'},
				{name: 'district',type: 'string'},
				{name: 'country_name',type: 'string'},
				{name: 'province_name',type: 'string'},
				{name: 'city_name',type: 'string'},
				{name: 'district_name',type: 'string'},
				{name: 'address',type: 'string'},
				{name: 'zipcode',type: 'string'},
				{name: 'tel',type: 'string'},
				{name: 'mobile',type: 'string'},
				{name: 'sign_building',type: 'string'},
				{name: 'best_time',type: 'string'}
			]}         
		),
		writer: new Ext.data.JsonWriter({
			encode: false 
		}),
		listeners : {    
			beforeload : function(store, options) {   
				if (Ext.isReady) {  
					Ext.apply(options.params, Km.Address.View.Running.addressGrid.filter);//保证分页也将查询条件带上  
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
			{name: 'username', mapping: 'username'} 
		])
	})      
};
/**
 * View:会员收货人地址信息显示组件   
 */
Km.Address.View={ 
	/**
	 * 编辑窗口：新建或者修改会员收货人地址信息
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
						ckeditor_replace_address(); 
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
							{xtype: 'hidden',  name : 'address_id',ref:'../address_id'},
							{xtype: 'hidden',name : 'member_id',id:'member_id'},
							{
								 fieldLabel : '会员名',xtype: 'combo',name : 'username',id : 'username',
								 store:Km.Address.Store.memberStore,emptyText: '请选择会员名',itemSelector: 'div.search-item',
								 loadingText: '查询中...',width: 570, pageSize:Km.Address.Config.PageSize,
								 displayField:'username',// 显示文本
								 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
								 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
								 tpl:new Ext.XTemplate(
											'<tpl for="."><div class="search-item">',
												'<h3>{username}</h3>',
											'</div></tpl>'
								 ),
								 onSelect:function(record,index){
									 if(this.fireEvent('beforeselect', this, record, index) !== false){
										Ext.getCmp("member_id").setValue(record.data.member_id);
										Ext.getCmp("username").setValue(record.data.username);
										this.collapse();
									 }
								 }
							},
							{fieldLabel : '收货人姓名(<font color=red>*</font>)',name : 'consignee',allowBlank : false},
							{fieldLabel : '邮件地址',name : 'email'},
							{xtype: 'hidden',  name : 'region_id',ref:'../region_id'},
							{    
								name: 'region_name',ref:'../region_name',
								xtype:'combotree', emptyText: '请选择地区',
								fieldLabel: '所属地区',canFolderSelect:false,                           
								tree: new Ext.tree.TreePanel({
									root: {  
										text: '全部地区',draggable: false,
										nodeType: 'async',id: '0'
									},  
									preloadChildren:true,
									dataUrl: 'home/admin/src/httpdata/regionTree.php',border: false,rootVisible: false,     
									listeners: {
										beforeload: function(n) { 
											if (n) { this.getLoader().baseParams.id = n.attributes.id; } 
										},
										load:function(n) {}
									}
								}),
								onSelect: function(cmb, node) {
									this.ownerCt.ownerCt.region_id.setValue(node.attributes.id);
									this.ownerCt.ownerCt.region_name.setValue(node.attributes.text);
								}
							},
							{fieldLabel : '详细地址(<font color=red>*</font>)',name : 'address',allowBlank : false,xtype : 'textarea',id:'address',ref:'address'},
							{fieldLabel : '邮政编码',name : 'zipcode'},
							{fieldLabel : '电话',name : 'tel'},
							{fieldLabel : '手机',name : 'mobile'},
							{fieldLabel : '标志建筑',name : 'sign_building'},
							{fieldLabel : '最佳送货时间',name : 'best_time'}        
						]
					})                
				],
				buttons : [ {         
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {
						if (CKEDITOR.instances.address){
							this.editForm.address.setValue(CKEDITOR.instances.address.getData());
						}                              
						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;  
						if (this.savetype==0){    
							this.editForm.api.submit=ExtServiceAddress.save;                   
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Address.View.Running.addressGrid.doSelectAddress();
									form.reset(); 
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceAddress.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "修改成功！");
									Km.Address.View.Running.addressGrid.doSelectAddress();
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
						this.editForm.form.loadRecord(Km.Address.View.Running.addressGrid.getSelectionModel().getSelected());
						if (CKEDITOR.instances.address){
							CKEDITOR.instances.address.setData(Km.Address.View.Running.addressGrid.getSelectionModel().getSelected().data.address);
						} 
					}                  
				}]    
			}, config);  
			Km.Address.View.EditWindow.superclass.constructor.call(this, config);     
		}
	}),
	/**
	 * 显示会员收货人地址信息详情
	 */
	AddressView:{
		/**
		 * Tab页：容器包含显示与会员收货人地址信息所有相关的信息
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
								if (Km.Address.View.Running.addressGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择会员收货人地址信息！');
									return false;
								} 
								Km.Address.Config.View.IsShow=1;
								Km.Address.View.Running.addressGrid.showAddress();   
								Km.Address.View.Running.addressGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Address.View.AddressView.Tabs.superclass.constructor.call(this, config); 
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Address.Config.View.Direction==1)||(Km.Address.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabAddressDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">', 
						 '<tr class="entry"><td class="head">会员标识 :</td><td class="content">{username}</td></tr>',
						 '<tr class="entry"><td class="head">收货人姓名 :</td><td class="content">{consignee}</td></tr>',
						 '<tr class="entry"><td class="head">邮件地址 :</td><td class="content">{email}</td></tr>',
						 '<tr class="entry"><td class="head">国家标识 :</td><td class="content">{country_name}</td></tr>',
						 '<tr class="entry"><td class="head">省标识 :</td><td class="content">{province_name}</td></tr>',
						 '<tr class="entry"><td class="head">市标识 :</td><td class="content">{city_name}</td></tr>',
						 '<tr class="entry"><td class="head">区标识 :</td><td class="content">{district_name}</td></tr>',
						 '<tr class="entry"><td class="head">详细地址 :</td><td class="content">{address}</td></tr>',
						 '<tr class="entry"><td class="head">邮政编码 :</td><td class="content">{zipcode}</td></tr>',
						 '<tr class="entry"><td class="head">电话 :</td><td class="content">{tel}</td></tr>',
						 '<tr class="entry"><td class="head">手机 :</td><td class="content">{mobile}</td></tr>',
						 '<tr class="entry"><td class="head">标志建筑 :</td><td class="content">{sign_building}</td></tr>',
						 '<tr class="entry"><td class="head">最佳送货时间 :</td><td class="content">{best_time}</td></tr>',                      
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
		 * 窗口:显示会员收货人地址信息信息
		 */
		Window:Ext.extend(Ext.Window,{ 
			constructor : function(config) { 
				config = Ext.apply({
					title:"查看会员收货人地址信息",constrainHeader:true,maximizable: true,minimizable : true, 
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Address.View.AddressView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: { 
						minimize:function(w){
							w.hide();
							Km.Address.Config.View.IsShow=0;
							Km.Address.View.Running.addressGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Address.View.Running.addressGrid.tvpView.toggle(false);
						}   
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Address.View.Running.addressGrid.addAddress();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Address.View.Running.addressGrid.updateAddress();}
					}]
				}, config);  
				Km.Address.View.AddressView.Window.superclass.constructor.call(this, config);   
			}        
		})
	},
	/**
	 * 窗口：批量上传会员收货人地址信息
	 */        
	UploadWindow:Ext.extend(Ext.Window,{ 
		constructor : function(config) { 
			config = Ext.apply({     
				title : '批量会员收货人地址信息上传',
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
							emptyText: '请上传会员收货人地址信息Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadAddress',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Address.View.Running.addressGrid.doSelectAddress();
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
			Km.Address.View.UploadWindow.superclass.constructor.call(this, config);     
		}        
	}),
	/**
	 * 视图：会员收货人地址信息列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件  
				 */
				filter:null,
				region : 'center',
				store : Km.Address.Store.addressStore,
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
						{header : '会员名',dataIndex : 'username'},
						{header : '收货人姓名',dataIndex : 'consignee'},
						{header : '邮件地址',dataIndex : 'email'},
						{header : '国家',dataIndex : 'country_name'},
						{header : '省',dataIndex : 'province_name'},
						{header : '市',dataIndex : 'city_name'},
						{header : '区',dataIndex : 'district_name'},
						{header : '详细地址',dataIndex : 'address'},
						{header : '邮政编码',dataIndex : 'zipcode'},
						{header : '电话',dataIndex : 'tel'},
						{header : '手机',dataIndex : 'mobile'},
						{header : '标志建筑',dataIndex : 'sign_building'},
						{header : '最佳送货时间',dataIndex : 'best_time'}                                 
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
								'收货人姓名　',{ref: '../aconsignee'},'&nbsp;&nbsp;',                                
								{
									xtype : 'button',text : '查询',scope: this, 
									handler : function() {
										this.doSelectAddress();
									}
								}, 
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.aconsignee.setValue("");                                        
										this.filter={};
										this.doSelectAddress();
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
									text : '添加会员收货人地址信息',iconCls : 'icon-add',
									handler : function() {
										this.addAddress();
									}
								},'-',{
									text : '修改会员收货人地址信息',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
									handler : function() {
										this.updateAddress();
									}
								},'-',{
									text : '删除会员收货人地址信息', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
									handler : function() {
										this.deleteAddress();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import', 
									handler : function() {
										this.importAddress();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export', 
									handler : function() { 
										this.exportAddress();
									}
								},'-',{ 
									xtype:'tbsplit',text: '查看会员收货人地址信息', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,  
									handler:function(){this.showAddress()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideAddress();Km.Address.Config.View.IsShow=0;}},'-', 
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Address.Cookie.set('View.IsFix',Km.Address.Config.View.IsFix);}} 
										]}
								},'-']}
					)]
				},                
				bbar: new Ext.PagingToolbar({          
					pageSize: Km.Address.Config.PageSize,
					store: Km.Address.Store.addressStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Address.Config.PageSize,minValue:1,width:35, 
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Address.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Address.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectAddress();
								}, 
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Address.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Address.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectAddress();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示会员收货人地址信息列表
			this.doSelectAddress();
			Km.Address.View.Grid.superclass.constructor.call(this, config); 
			//创建在Grid里显示的会员收货人地址信息信息Tab页
			Km.Address.View.Running.viewTabs=new Km.Address.View.AddressView.Tabs();
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
					this.grid.updateViewAddress();                     
					if (sm.getCount() != 1){
						this.grid.hideAddress();
						Km.Address.Config.View.IsShow=0;
					}else{
						if (Km.Address.View.IsSelectView==1){
							Km.Address.View.IsSelectView=0;  
							this.grid.showAddress();   
						}     
					}    
				},
				rowdeselect: function(sm, rowIndex, record) {  
					if (sm.getCount() != 1){
						if (Km.Address.Config.View.IsShow==1){
							Km.Address.View.IsSelectView=1;    
						}             
						this.grid.hideAddress();
						Km.Address.Config.View.IsShow=0;
					}    
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){  
			if (!Km.Address.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showAddress();
				this.tvpView.toggle(true);
			}else{
				this.hideAddress();
				Km.Address.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){ 
			if (checked){             
			   Km.Address.Config.View.IsFix=1; 
			}else{ 
			   Km.Address.Config.View.IsFix=0;   
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Address.Config.View.IsShow=0;
				return ;
			}
			if (Km.Address.Config.View.IsShow==1){
			   this.hideAddress(); 
			   Km.Address.Config.View.IsShow=0;
			}
			this.showAddress();   
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
		 * 查询符合条件的会员收货人地址信息
		 */
		doSelectAddress : function() {
			if (this.topToolbar){
				var aconsignee = this.topToolbar.aconsignee.getValue();
				this.filter       ={'consignee':aconsignee};
			}
			var condition = {'start':0,'limit':Km.Address.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceAddress.queryPageAddress(condition,function(provider, response) {   
				if (response.result.data) {   
					var result           = new Array();
					result['data']       =response.result.data; 
					result['totalCount'] =response.result.totalCount;
					Km.Address.Store.addressStore.loadData(result); 
				} else {
					Km.Address.Store.addressStore.removeAll();                        
					Ext.Msg.alert('提示', '无符合条件的会员收货人地址信息！');
				}
			});
		}, 
		/**
		 * 显示会员收货人地址信息视图
		 * 显示会员收货人地址信息的视图相对会员收货人地址信息列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Address.Config.View.Direction=viewDirection; 
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Address.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Address.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Address.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Address.View.Running.viewTabs);
					break;    
			}  
			Km.Address.Cookie.set('View.Direction',Km.Address.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Address.Config.View.IsFix==0)&&(Km.Address.Config.View.IsShow==1)){
					this.showAddress();     
				}
				Km.Address.Config.View.IsFix=1;
				Km.Address.View.Running.addressGrid.tvpView.menu.mBind.setChecked(true,true);  
				Km.Address.Config.View.IsShow=0;
				this.showAddress();     
			}
		}, 
		/**
		 * 显示会员收货人地址信息
		 */
		showAddress : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择会员收货人地址信息！');
				Km.Address.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			} 
			if (Km.Address.Config.View.IsFix==0){
				if (Km.Address.View.Running.view_window==null){
					Km.Address.View.Running.view_window=new Km.Address.View.AddressView.Window();
				}
				if (Km.Address.View.Running.view_window.hidden){
					Km.Address.View.Running.view_window.show();
					Km.Address.View.Running.view_window.winTabs.hideTabStripItem(Km.Address.View.Running.view_window.winTabs.tabFix);   
					this.updateViewAddress();
					this.tvpView.toggle(true);
					Km.Address.Config.View.IsShow=1;
				}else{
					this.hideAddress();
					Km.Address.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Address.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Address.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Address.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Address.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Address.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Address.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Address.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Address.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Address.View.Running.viewTabs);
					}
					break;    
			}  
			this.hideAddress();
			if (Km.Address.Config.View.IsShow==0){
				Km.Address.View.Running.viewTabs.enableCollapse();  
				switch(Km.Address.Config.View.Direction){
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
				this.updateViewAddress();
				this.tvpView.toggle(true);
				Km.Address.Config.View.IsShow=1;
			}else{
				Km.Address.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏会员收货人地址信息
		 */
		hideAddress : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();   
			this.ownerCt.east.hide(); 
			if (Km.Address.View.Running.view_window!=null){
				Km.Address.View.Running.view_window.hide();
			}            
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前会员收货人地址信息显示信息
		 */
		updateViewAddress : function() {
			if (Km.Address.View.Running.view_window!=null){
				Km.Address.View.Running.view_window.winTabs.tabAddressDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Address.View.Running.viewTabs.tabAddressDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建会员收货人地址信息
		 */
		addAddress : function() {  
			if (Km.Address.View.Running.edit_window==null){   
				Km.Address.View.Running.edit_window=new Km.Address.View.EditWindow();   
			}     
			Km.Address.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Address.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Address.View.Running.edit_window.setTitle('添加会员收货人地址信息');
			Km.Address.View.Running.edit_window.savetype=0;
			Km.Address.View.Running.edit_window.address_id.setValue("");
			if (CKEDITOR.instances.address){
				CKEDITOR.instances.address.setData("");
			}            
			Km.Address.View.Running.edit_window.show();   
			Km.Address.View.Running.edit_window.maximize();               
		},   
		/**
		 * 编辑会员收货人地址信息时先获得选中的会员收货人地址信息信息
		 */
		updateAddress : function() {
			if (Km.Address.View.Running.edit_window==null){   
				Km.Address.View.Running.edit_window=new Km.Address.View.EditWindow();   
			}            
			Km.Address.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Address.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Address.View.Running.edit_window.setTitle('修改会员收货人地址信息');
			var selectedAddress=this.getSelectionModel().getSelected();
			Km.Address.View.Running.edit_window.editForm.form.loadRecord(selectedAddress);  
			Km.Address.View.Running.edit_window.region_name.setValue(selectedAddress.data.district_name);
			Km.Address.View.Running.edit_window.region_id.setValue(selectedAddress.data.district);   
			Km.Address.View.Running.edit_window.savetype=1;
			if (CKEDITOR.instances.address){
				CKEDITOR.instances.address.setData(this.getSelectionModel().getSelected().data.address); 
			}            
			Km.Address.View.Running.edit_window.show();    
			Km.Address.View.Running.edit_window.maximize();                  
		},        
		/**
		 * 删除会员收货人地址信息
		 */
		deleteAddress : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的会员收货人地址信息吗?', this.confirmDeleteAddress,this);
		}, 
		/**
		 * 确认删除会员收货人地址信息
		 */
		confirmDeleteAddress : function(btn) {
			if (btn == 'yes') {  
				var del_address_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_address_ids=del_address_ids+selectedRows[flag].data.address_id+",";
				}
				ExtServiceAddress.deleteByIds(del_address_ids);
				this.doSelectAddress();
				Ext.Msg.alert("提示", "删除成功！");        
			}
		},
		/**
		 * 导出会员收货人地址信息
		 */
		exportAddress : function() {            
			ExtServiceAddress.exportAddress(this.filter,function(provider, response) {  
				if (response.result.data) {
					window.open(response.result.data);
				}
			});                        
		},
		/**
		 * 导入会员收货人地址信息
		 */
		importAddress : function() { 
			if (Km.Address.View.current_uploadWindow==null){   
				Km.Address.View.current_uploadWindow=new Km.Address.View.UploadWindow();   
			}     
			Km.Address.View.current_uploadWindow.show();
		}                
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Address.View.Running.addressGrid=new Km.Address.View.Grid();           
			if (Km.Address.Config.View.IsFix==0){
				Km.Address.View.Running.addressGrid.tvpView.menu.mBind.setChecked(false,true);  
			}
			config = Ext.apply({ 
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Address.View.Running.addressGrid, 
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Address.View.Running.viewTabs]}, 
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
					]
				}
			}, config);   
			Km.Address.View.Panel.superclass.constructor.call(this, config);  
		}        
	}),
	/**
	 * 当前运行的可视化对象
	 */ 
	Running:{         
		/**
		 * 当前会员收货人地址信息Grid对象
		 */
		addressGrid:null,  
		/**
		 * 显示会员收货人地址信息信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Address.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);     
	Km.Address.Init();
	/**
	 * 会员收货人地址信息数据模型获取数据Direct调用
	 */        
	Km.Address.Store.addressStore.proxy=new Ext.data.DirectProxy({ 
		api: {read:ExtServiceAddress.queryPageAddress}
	});   
	/**
	 * 会员收货人地址信息页面布局
	 */
	Km.Address.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Address.View.Panel()]
	});
	Km.Address.Viewport.doLayout();    
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});  