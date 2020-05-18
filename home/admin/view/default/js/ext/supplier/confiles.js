Ext.namespace("Kmall.Admin.Confiles");
Km = Kmall.Admin.Confiles;
Km.Confiles={
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
			 * 显示合同文件的视图相对合同文件列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示合同文件信息页(或者打开新窗口)
			 */
			IsFix:0          
		},
		/**
		 * 在线编辑器类型。
		 * 1:CkEditor,2:KindEditor,3:xhEditor 
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
		if (Km.Confiles.Cookie.get('View.Direction')){
			Km.Confiles.Config.View.Direction=Km.Confiles.Cookie.get('View.Direction');
		}
		if (Km.Confiles.Cookie.get('View.IsFix')!=null){
			Km.Confiles.Config.View.IsFix=Km.Confiles.Cookie.get('View.IsFix');
		}
		if (Ext.util.Cookies.get('OnlineEditor')!=null){
			Km.Confiles.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
		}
	}
}; 
/**
 * Model:数据模型   
 */
Km.Confiles.Store = { 
	/**
	 * 合同文件
	 */ 
	confilesStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',  
			root: 'data',remoteSort: true,                
			fields : [
				  {name: 'confiles_id',type: 'int'},
				  {name: 'contract_id',type: 'string'},
				  {name: 'contract_name',type: 'string'},
				  {name: 'origin_name',type: 'string'},
				  {name: 'file_name',type: 'string'},
				  {name: 'file_path',type: 'string'},
				  {name: 'file_size',type: 'string'},
				  {name: 'file_type',type: 'string'},
				  {name: 'intro',type: 'string'}
			]}         
		),
		writer: new Ext.data.JsonWriter({
			encode: false 
		}),
		listeners : {    
			beforeload : function(store, options) {   
				if (Ext.isReady) {  
					Ext.apply(options.params, Km.Confiles.View.Running.confilesGrid.filter);//保证分页也将查询条件带上  
				}
			}
		}    
	}),
	/**
	 * 合同
	 */
	contractStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/contract.php'
		  }),
		reader: new Ext.data.JsonReader({
			root: 'contracts',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'contract_id'
		  }, [
			  {name: 'contract_id', mapping: 'contract_id'}, 
			  {name: 'contract_name', mapping: 'contract_name'} 
		])
	})      
};
/**
 * View:合同文件显示组件   
 */
Km.Confiles.View={ 
	/**
	 * 编辑窗口：新建或者修改合同文件
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
						switch (Km.Confiles.Config.OnlineEditor)
						{
							case 2:
								Km.Confiles.View.EditWindow.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
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
						ref:'editForm',layout:'form', 
						labelWidth : 100,labelAlign : "center",
						bodyStyle : 'padding:5px 5px 0',align : "center",
						api : {},
						defaults : {
							xtype : 'textfield',anchor:'98%'
						},
						items : [ 
		 
						]
					})                
				],
				buttons : [ {         
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {   
						switch (Km.Confiles.Config.OnlineEditor)
						{
							case 2:
								if (Km.Confiles.View.EditWindow.KindEditor_intro)this.editForm.intro.setValue(Km.Confiles.View.EditWindow.KindEditor_intro.html());
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
							this.editForm.api.submit=ExtServiceConfiles.save;                   
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Confiles.View.Running.confilesGrid.doSelectConfiles();
									form.reset(); 
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败');
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceConfiles.update;
							this.editForm.getForm().submit({
								success : function(form, action) {                                                  
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){       
										Km.Confiles.View.Running.confilesGrid.bottomToolbar.doRefresh(); 
									}});                                       
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
						this.editForm.form.loadRecord(Km.Confiles.View.Running.confilesGrid.getSelectionModel().getSelected());
						switch (Km.Confiles.Config.OnlineEditor)
						{
							case 2:
								if (Km.Confiles.View.EditWindow.KindEditor_intro) Km.Confiles.View.EditWindow.KindEditor_intro.html(Km.Confiles.View.Running.confilesGrid.getSelectionModel().getSelected().data.intro);
								break
							case 3:
								break
							default:
								if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(Km.Confiles.View.Running.confilesGrid.getSelectionModel().getSelected().data.intro);
						}
 
					}                  
				}]    
			}, config);  
			Km.Confiles.View.EditWindow.superclass.constructor.call(this, config);     
		}
	}),
	/**
	 * 显示合同文件详情
	 */
	ConfilesView:{
		/**
		 * Tab页：容器包含显示与合同文件所有相关的信息
		 */  
		Tabs:Ext.extend(Ext.TabPanel,{ 
			constructor : function(config) { 
				config = Ext.apply({             
					region : 'south',collapseMode : 'mini',split : true,
					activeTab: 1, tabPosition:"bottom",resizeTabs : true,     
					header:false,enableTabScroll : true,tabWidth:'auto', margins : '0 3 3 0',
					defaults : {
						autoScroll : true
					},
					listeners:{
						beforetabchange:function(tabs,newtab,currentTab){  
							if (tabs.tabFix==newtab){            
								if (Km.Confiles.View.Running.confilesGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择合同文件！');
									return false;
								} 
								Km.Confiles.Config.View.IsShow=1;
								Km.Confiles.View.Running.confilesGrid.showConfiles();   
								Km.Confiles.View.Running.confilesGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Confiles.View.ConfilesView.Tabs.superclass.constructor.call(this, config); 
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Confiles.Config.View.Direction==1)||(Km.Confiles.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabConfilesDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">', 
						 '<tr class="entry"><td class="head">合同</td><td class="content">{contract_name}</td></tr>',
						 '<tr class="entry"><td class="head">原名称</td><td class="content">{origin_name}</td></tr>',
						 '<tr class="entry"><td class="head">文件显示名</td><td class="content">{file_name}</td></tr>',
						 '<tr class="entry"><td class="head">文件实际路径名称</td><td class="content">{file_path}</td></tr>',
						 '<tr class="entry"><td class="head">文件大小</td><td class="content">{file_size}</td></tr>',
						 '<tr class="entry"><td class="head">文件类型</td><td class="content">{file_type}</td></tr>',
						 '<tr class="entry"><td class="head">备注说明</td><td class="content">{intro}</td></tr>',                      
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
		 * 窗口:显示合同文件信息
		 */
		Window:Ext.extend(Ext.Window,{ 
			constructor : function(config) { 
				config = Ext.apply({
					title:"查看合同文件",constrainHeader:true,maximizable: true,minimizable : true, 
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Confiles.View.ConfilesView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: { 
						minimize:function(w){
							w.hide();
							Km.Confiles.Config.View.IsShow=0;
							Km.Confiles.View.Running.confilesGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Confiles.View.Running.confilesGrid.tvpView.toggle(false);
						}   
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Confiles.View.Running.confilesGrid.addConfiles();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Confiles.View.Running.confilesGrid.updateConfiles();}
					}]
				}, config);  
				Km.Confiles.View.ConfilesView.Window.superclass.constructor.call(this, config);   
			}        
		})
	},
	/**
	 * 窗口：批量上传合同文件
	 */        
	UploadWindow:Ext.extend(Ext.Window,{ 
		constructor : function(config) { 
			config = Ext.apply({     
				title : '批量合同文件上传',
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
							emptyText: '请上传合同文件Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadConfiles',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Confiles.View.Running.confilesGrid.doSelectConfiles();
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
			Km.Confiles.View.UploadWindow.superclass.constructor.call(this, config);     
		}        
	}),
	/**
	 * 视图：合同文件列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件  
				 */
				filter:null,
				region : 'center',
				store : Km.Confiles.Store.confilesStore,
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
						  {header : '合同',dataIndex : 'contract_name'},
						  {header : '原名称',dataIndex : 'origin_name'},
						  {header : '文件显示名',dataIndex : 'file_name'},
						  {header : '文件实际路径名称',dataIndex : 'file_path'},
						  {header : '文件大小',dataIndex : 'file_size'},
						  {header : '文件类型',dataIndex : 'file_type'},
						  {header : '备注说明',dataIndex : 'intro'}                                 
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
								'合同 ','&nbsp;&nbsp;',{ref: '../ccontract_id',xtype:'hidden',name : 'contract_id',id:'ccontract_id'},
								{
									 xtype: 'combo',name : 'contract_name',id : 'ccontract_name',
									 store:Km.Confiles.Store.contractStore,emptyText: '请选择合同',itemSelector: 'div.search-item',
									 loadingText: '查询中...',width:280,pageSize:Km.Confiles.Config.PageSize,
									 displayField:'contract_name',// 显示文本
									 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
									 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
									 tpl:new Ext.XTemplate(
												'<tpl for="."><div class="search-item">',
													'<h3>{contract_name}</h3>',
												'</div></tpl>'
									 ),
									 onSelect:function(record,index){
										 if(this.fireEvent('beforeselect', this, record, index) !== false){
											Ext.getCmp("ccontract_id").setValue(record.data.contract_id);
											Ext.getCmp("ccontract_name").setValue(record.data.contract_name);
											this.collapse();
										 }
									 }
								},'&nbsp;&nbsp;',
								'文件显示名 ','&nbsp;&nbsp;',{ref: '../cfile_name'},'&nbsp;&nbsp;',
								'备注说明 ','&nbsp;&nbsp;',{ref: '../cintro'},'&nbsp;&nbsp;',                                
								{
									xtype : 'button',text : '查询',scope: this, 
									handler : function() {
										this.doSelectConfiles();
									}
								}, 
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.ccontract_id.setValue("");
										this.topToolbar.cfile_name.setValue("");
										this.topToolbar.cintro.setValue("");                                        
										this.filter={};
										this.doSelectConfiles();
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
									text : '添加合同文件',iconCls : 'icon-add',
									handler : function() {
										this.addConfiles();
									}
								},'-',{
									text : '修改合同文件',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
									handler : function() {
										this.updateConfiles();
									}
								},'-',{
									text : '删除合同文件', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
									handler : function() {
										this.deleteConfiles();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import', 
									handler : function() {
										this.importConfiles();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export', 
									handler : function() { 
										this.exportConfiles();
									}
								},'-',{ 
									xtype:'tbsplit',text: '查看合同文件', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,  
									handler:function(){this.showConfiles()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideConfiles();Km.Confiles.Config.View.IsShow=0;}},'-', 
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Confiles.Cookie.set('View.IsFix',Km.Confiles.Config.View.IsFix);}} 
										]}
								},'-']}
					)]
				},                
				bbar: new Ext.PagingToolbar({          
					pageSize: Km.Confiles.Config.PageSize,
					store: Km.Confiles.Store.confilesStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Confiles.Config.PageSize,minValue:1,width:35, 
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Confiles.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Confiles.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectConfiles();
								}, 
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Confiles.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Confiles.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectConfiles();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示合同文件列表
			this.doSelectConfiles();
			Km.Confiles.View.Grid.superclass.constructor.call(this, config); 
			//创建在Grid里显示的合同文件信息Tab页
			Km.Confiles.View.Running.viewTabs=new Km.Confiles.View.ConfilesView.Tabs();
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
					this.grid.updateViewConfiles();                     
					if (sm.getCount() != 1){
						this.grid.hideConfiles();
						Km.Confiles.Config.View.IsShow=0;
					}else{
						if (Km.Confiles.View.IsSelectView==1){
							Km.Confiles.View.IsSelectView=0;  
							this.grid.showConfiles();   
						}     
					}    
				},
				rowdeselect: function(sm, rowIndex, record) {  
					if (sm.getCount() != 1){
						if (Km.Confiles.Config.View.IsShow==1){
							Km.Confiles.View.IsSelectView=1;    
						}             
						this.grid.hideConfiles();
						Km.Confiles.Config.View.IsShow=0;
					}    
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){  
			if (!Km.Confiles.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showConfiles();
				this.tvpView.toggle(true);
			}else{
				this.hideConfiles();
				Km.Confiles.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){ 
			if (checked){             
			   Km.Confiles.Config.View.IsFix=1; 
			}else{ 
			   Km.Confiles.Config.View.IsFix=0;   
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Confiles.Config.View.IsShow=0;
				return ;
			}
			if (Km.Confiles.Config.View.IsShow==1){
			   this.hideConfiles(); 
			   Km.Confiles.Config.View.IsShow=0;
			}
			this.showConfiles();   
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
		 * 查询符合条件的合同文件
		 */
		doSelectConfiles : function() {
			if (this.topToolbar){
				var ccontract_id = this.topToolbar.ccontract_id.getValue();
				var cfile_name = this.topToolbar.cfile_name.getValue();
				var cintro = this.topToolbar.cintro.getValue();
				this.filter       ={'contract_id':ccontract_id,'file_name':cfile_name,'intro':cintro};
			}
			var condition = {'start':0,'limit':Km.Confiles.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceConfiles.queryPageConfiles(condition,function(provider, response) {   
				if (response.result.data) {   
					var result           = new Array();
					result['data']       =response.result.data; 
					result['totalCount'] =response.result.totalCount;
					Km.Confiles.Store.confilesStore.loadData(result); 
				} else {
					Km.Confiles.Store.confilesStore.removeAll();                        
					Ext.Msg.alert('提示', '无符合条件的合同文件！');
				}
			});
		}, 
		/**
		 * 显示合同文件视图
		 * 显示合同文件的视图相对合同文件列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Confiles.Config.View.Direction=viewDirection; 
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Confiles.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Confiles.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Confiles.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Confiles.View.Running.viewTabs);
					break;    
			}  
			Km.Confiles.Cookie.set('View.Direction',Km.Confiles.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Confiles.Config.View.IsFix==0)&&(Km.Confiles.Config.View.IsShow==1)){
					this.showConfiles();     
				}
				Km.Confiles.Config.View.IsFix=1;
				Km.Confiles.View.Running.confilesGrid.tvpView.menu.mBind.setChecked(true,true);  
				Km.Confiles.Config.View.IsShow=0;
				this.showConfiles();     
			}
		}, 
		/**
		 * 显示合同文件
		 */
		showConfiles : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择合同文件！');
				Km.Confiles.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			} 
			if (Km.Confiles.Config.View.IsFix==0){
				if (Km.Confiles.View.Running.view_window==null){
					Km.Confiles.View.Running.view_window=new Km.Confiles.View.ConfilesView.Window();
				}
				if (Km.Confiles.View.Running.view_window.hidden){
					Km.Confiles.View.Running.view_window.show();
					Km.Confiles.View.Running.view_window.winTabs.hideTabStripItem(Km.Confiles.View.Running.view_window.winTabs.tabFix);   
					this.updateViewConfiles();
					this.tvpView.toggle(true);
					Km.Confiles.Config.View.IsShow=1;
				}else{
					this.hideConfiles();
					Km.Confiles.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Confiles.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Confiles.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Confiles.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Confiles.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Confiles.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Confiles.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Confiles.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Confiles.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Confiles.View.Running.viewTabs);
					}
					break;    
			}  
			this.hideConfiles();
			if (Km.Confiles.Config.View.IsShow==0){
				Km.Confiles.View.Running.viewTabs.enableCollapse();  
				switch(Km.Confiles.Config.View.Direction){
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
				this.updateViewConfiles();
				this.tvpView.toggle(true);
				Km.Confiles.Config.View.IsShow=1;
			}else{
				Km.Confiles.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏合同文件
		 */
		hideConfiles : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();   
			this.ownerCt.east.hide(); 
			if (Km.Confiles.View.Running.view_window!=null){
				Km.Confiles.View.Running.view_window.hide();
			}            
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前合同文件显示信息
		 */
		updateViewConfiles : function() {
			if (Km.Confiles.View.Running.view_window!=null){
				Km.Confiles.View.Running.view_window.winTabs.tabConfilesDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Confiles.View.Running.viewTabs.tabConfilesDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建合同文件
		 */
		addConfiles : function() {  
			if (Km.Confiles.View.Running.edit_window==null){   
				Km.Confiles.View.Running.edit_window=new Km.Confiles.View.EditWindow();   
			}     
			Km.Confiles.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Confiles.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Confiles.View.Running.edit_window.setTitle('添加合同文件');
			Km.Confiles.View.Running.edit_window.savetype=0;
			Km.Confiles.View.Running.edit_window.confiles_id.setValue("");
			switch (Km.Confiles.Config.OnlineEditor)
			{
				case 2:
					if (Km.Confiles.View.EditWindow.KindEditor_intro) Km.Confiles.View.EditWindow.KindEditor_intro.html("");
					break
				case 3:
					break
				default:
					if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData("");
			}
			
			Km.Confiles.View.Running.edit_window.show();   
			Km.Confiles.View.Running.edit_window.maximize();               
		},   
		/**
		 * 编辑合同文件时先获得选中的合同文件信息
		 */
		updateConfiles : function() {
			if (Km.Confiles.View.Running.edit_window==null){   
				Km.Confiles.View.Running.edit_window=new Km.Confiles.View.EditWindow();   
			}            
			Km.Confiles.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Confiles.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Confiles.View.Running.edit_window.setTitle('修改合同文件');
			Km.Confiles.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Confiles.View.Running.edit_window.savetype=1;
			switch (Km.Confiles.Config.OnlineEditor)
			{
				case 2:
					if (Km.Confiles.View.EditWindow.KindEditor_intro) Km.Confiles.View.EditWindow.KindEditor_intro.html(this.getSelectionModel().getSelected().data.intro);
					break
				case 3:
					if (xhEditor_intro)xhEditor_intro.setSource(this.getSelectionModel().getSelected().data.intro);
					break
				default:
					if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(this.getSelectionModel().getSelected().data.intro); 
			}
			
			Km.Confiles.View.Running.edit_window.show();    
			Km.Confiles.View.Running.edit_window.maximize();                  
		},        
		/**
		 * 删除合同文件
		 */
		deleteConfiles : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的合同文件吗?', this.confirmDeleteConfiles,this);
		}, 
		/**
		 * 确认删除合同文件
		 */
		confirmDeleteConfiles : function(btn) {
			if (btn == 'yes') {  
				var del_confiles_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_confiles_ids=del_confiles_ids+selectedRows[flag].data.confiles_id+",";
				}
				ExtServiceConfiles.deleteByIds(del_confiles_ids);
				this.doSelectConfiles();
				Ext.Msg.alert("提示", "删除成功！");        
			}
		},
		/**
		 * 导出合同文件
		 */
		exportConfiles : function() {            
			ExtServiceConfiles.exportConfiles(this.filter,function(provider, response) {  
				if (response.result.data) {
					window.open(response.result.data);
				}
			});                        
		},
		/**
		 * 导入合同文件
		 */
		importConfiles : function() { 
			if (Km.Confiles.View.current_uploadWindow==null){   
				Km.Confiles.View.current_uploadWindow=new Km.Confiles.View.UploadWindow();   
			}     
			Km.Confiles.View.current_uploadWindow.show();
		}                
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Confiles.View.Running.confilesGrid=new Km.Confiles.View.Grid();           
			if (Km.Confiles.Config.View.IsFix==0){
				Km.Confiles.View.Running.confilesGrid.tvpView.menu.mBind.setChecked(false,true);  
			}
			config = Ext.apply({ 
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Confiles.View.Running.confilesGrid, 
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Confiles.View.Running.viewTabs]}, 
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
					]
				}
			}, config);   
			Km.Confiles.View.Panel.superclass.constructor.call(this, config);  
		}        
	}),
	/**
	 * 当前运行的可视化对象
	 */ 
	Running:{         
		/**
		 * 当前合同文件Grid对象
		 */
		confilesGrid:null,  
		/**
		 * 显示合同文件信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Confiles.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);     
	Km.Confiles.Init();
	/**
	 * 合同文件数据模型获取数据Direct调用
	 */        
	Km.Confiles.Store.confilesStore.proxy=new Ext.data.DirectProxy({ 
		api: {read:ExtServiceConfiles.queryPageConfiles}
	});   
	/**
	 * 合同文件页面布局
	 */
	Km.Confiles.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Confiles.View.Panel()]
	});
	Km.Confiles.Viewport.doLayout();                                  
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});     
