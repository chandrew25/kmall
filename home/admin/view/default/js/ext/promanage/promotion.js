Ext.namespace("Kmall.Admin.Promotion");
Km = Kmall.Admin;
Km.Promotion={
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
			 * 显示促销活动表的视图相对促销活动表列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示促销活动表信息页(或者打开新窗口)
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
		if (Km.Promotion.Cookie.get('View.Direction')){
			Km.Promotion.Config.View.Direction=Km.Promotion.Cookie.get('View.Direction');
		}
		if (Km.Promotion.Cookie.get('View.IsFix')!=null){
			Km.Promotion.Config.View.IsFix=Km.Promotion.Cookie.get('View.IsFix');
		}
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.Promotion.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }

	}
};
/**
 * Model:数据模型
 */
Km.Promotion.Store = {
	/**
	 * 促销活动表
	 */
	promotionStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
                {name: 'promotion_id',type: 'int'},
                {name: 'promotion_name',type: 'string'},
                {name: 'begin_time',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'end_time',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'promdescribe',type: 'string'},
                {name: 'isValid',type: 'string'},
                {name: 'sort_order',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (!options.params.limit)options.params.limit=Km.Promotion.Config.PageSize;
					Ext.apply(options.params, Km.Promotion.View.Running.promotionGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:促销活动表显示组件
 */
Km.Promotion.View={
	/**
	 * 编辑窗口：新建或者修改促销活动表
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
                        switch (Km.Promotion.Config.OnlineEditor)
                        {
                            case 2:
                                Km.Promotion.View.EditWindow.KindEditor_promdescribe = KindEditor.create('textarea[name="promdescribe"]',{width:'98%',minHeith:'350px', filterMode:true});
                                break
                            case 3:
                                pageInit_promdescribe();
                                break
                            default:
                                ckeditor_replace_promdescribe();
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
                            {xtype: 'hidden',name : 'promotion_id',ref:'../promotion_id'},
                            {fieldLabel : '促销活动名称',name : 'promotion_name'},
                            {fieldLabel : '开始时间',name : 'begin_time',xtype : 'datefield',format : "Y-m-d"},
                            {fieldLabel : '结束时间',name : 'end_time',xtype : 'datefield',format : "Y-m-d"},
                            {fieldLabel : '描述',name : 'promdescribe',xtype : 'textarea',id:'promdescribe',ref:'promdescribe'},
                            {fieldLabel : '是否有效',hiddenName : 'isValid'
                                 ,xtype:'combo',ref:'../isValid',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否有效',
                                 valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '排序',name : 'sort_order'}
						]
					})
				],
				buttons : [{
					text: "",ref : "../saveBtn",scope:this,
					handler : function() {
                        switch (Km.Promotion.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Promotion.View.EditWindow.KindEditor_promdescribe)this.editForm.promdescribe.setValue(Km.Promotion.View.EditWindow.KindEditor_promdescribe.html());
                                break
                            case 3:
                                if (xhEditor_promdescribe)this.editForm.promdescribe.setValue(xhEditor_promdescribe.getSource());
                                break
                            default:
                                if (CKEDITOR.instances.promdescribe) this.editForm.promdescribe.setValue(CKEDITOR.instances.promdescribe.getData());
                        }

						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;
						if (this.savetype==0){
							this.editForm.api.submit=ExtServicePromotion.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Promotion.View.Running.promotionGrid.doSelectPromotion();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
									Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
								}
							});
						}else{
							this.editForm.api.submit=ExtServicePromotion.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Km.Promotion.View.Running.promotionGrid.store.reload();
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Promotion.View.Running.promotionGrid.bottomToolbar.doRefresh();
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
						this.editForm.form.loadRecord(Km.Promotion.View.Running.promotionGrid.getSelectionModel().getSelected());
                        switch (Km.Promotion.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Promotion.View.EditWindow.KindEditor_promdescribe) Km.Promotion.View.EditWindow.KindEditor_promdescribe.html(Km.Promotion.View.Running.promotionGrid.getSelectionModel().getSelected().data.promdescribe);
                                break
                            case 3:
                                break
                            default:
                                if (CKEDITOR.instances.promdescribe) CKEDITOR.instances.promdescribe.setData(Km.Promotion.View.Running.promotionGrid.getSelectionModel().getSelected().data.promdescribe);
                        }

					}
				}]
			}, config);
			Km.Promotion.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示促销活动表详情
	 */
	PromotionView:{
		/**
		 * Tab页：容器包含显示与促销活动表所有相关的信息
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
								if (Km.Promotion.View.Running.promotionGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择促销活动表！');
									return false;
								}
								Km.Promotion.Config.View.IsShow=1;
								Km.Promotion.View.Running.promotionGrid.showPromotion();
								Km.Promotion.View.Running.promotionGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Promotion.View.PromotionView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Promotion.Config.View.Direction==1)||(Km.Promotion.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabPromotionDetail',iconCls:'tabs',
					 tpl: [
						 '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">促销活动名称</td><td class="content">{promotion_name}</td></tr>',
                         '    <tr class="entry"><td class="head">开始时间</td><td class="content">{begin_time:date("Y-m-d")}</td></tr>',
                         '    <tr class="entry"><td class="head">结束时间</td><td class="content">{end_time:date("Y-m-d")}</td></tr>',
                         '    <tr class="entry"><td class="head">描述</td><td class="content">{promdescribe}</td></tr>',
                         '    <tr class="entry"><td class="head">是否有效</td><td class="content"><tpl if="isValid == true">是</tpl><tpl if="isValid == false">否</tpl></td></tr>',
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
		 * 窗口:显示促销活动表信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看促销活动表",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Promotion.View.PromotionView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Promotion.Config.View.IsShow=0;
							Km.Promotion.View.Running.promotionGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Promotion.Config.View.IsShow=0;
							Km.Promotion.View.Running.promotionGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增促销活动表',scope:this,
						handler : function() {this.hide();Km.Promotion.View.Running.promotionGrid.addPromotion();}
					},{
						text: '修改促销活动表',scope:this,
						handler : function() {this.hide();Km.Promotion.View.Running.promotionGrid.updatePromotion();}
					}]
				}, config);
				Km.Promotion.View.PromotionView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传促销活动表
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量上传促销活动表数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
							emptyText: '请上传促销活动表Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadPromotion',
									success : function(form, response) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Promotion.View.Running.promotionGrid.doSelectPromotion();
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
			Km.Promotion.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：促销活动表列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Promotion.Store.promotionStore,
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
                        {header : '标识',dataIndex : 'promotion_id',hidden:true},
                        {header : '促销活动名称',dataIndex : 'promotion_name'},
                        {header : '开始时间',dataIndex : 'begin_time',renderer:Ext.util.Format.dateRenderer('Y-m-d')},
                        {header : '结束时间',dataIndex : 'end_time',renderer:Ext.util.Format.dateRenderer('Y-m-d')},
                        {header : '是否有效',dataIndex : 'isValid',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
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
										if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectPromotion();
									}
								}
							},
							items : [

								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectPromotion();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {

										this.filter={};
										this.doSelectPromotion();
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
									text : '添加促销活动表',iconCls : 'icon-add',
									handler : function() {
										this.addPromotion();
									}
								},'-',{
									text : '修改促销活动表',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updatePromotion();
									}
								},'-',{
									text : '删除促销活动表', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deletePromotion();
									}
								},'-',{
									xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
									handler : function() {
										this.importPromotion();
									},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'批量导入促销活动表',iconCls : 'icon-import',scope:this,handler:function(){this.importPromotion()}}
										]}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportPromotion();
									}
								},'-',{
									xtype:'tbsplit',text: '查看促销活动表', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showPromotion()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hidePromotion();Km.Promotion.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Promotion.Cookie.set('View.IsFix',Km.Promotion.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Promotion.Config.PageSize,
					store: Km.Promotion.Store.promotionStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
						change:function(thisbar,pagedata){
							if (Km.Promotion.Viewport){
								if (Km.Promotion.Config.View.IsShow==1){
									Km.Promotion.View.IsSelectView=1;
								}
								this.ownerCt.hidePromotion();
								Km.Promotion.Config.View.IsShow=0;
							}
						}
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Promotion.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Promotion.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Promotion.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectPromotion();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Promotion.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Promotion.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectPromotion();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示促销活动表列表
			this.doSelectPromotion();
			Km.Promotion.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的促销活动表信息Tab页
			Km.Promotion.View.Running.viewTabs=new Km.Promotion.View.PromotionView.Tabs();
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
					this.grid.updateViewPromotion();
					if (sm.getCount() != 1){
						this.grid.hidePromotion();
						Km.Promotion.Config.View.IsShow=0;
					}else{
						if (Km.Promotion.View.IsSelectView==1){
							Km.Promotion.View.IsSelectView=0;
							this.grid.showPromotion();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Promotion.Config.View.IsShow==1){
							Km.Promotion.View.IsSelectView=1;
						}
						this.grid.hidePromotion();
						Km.Promotion.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Promotion.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showPromotion();
				this.tvpView.toggle(true);
			}else{
				this.hidePromotion();
				Km.Promotion.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Promotion.Config.View.IsFix=1;
			}else{
			   Km.Promotion.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Promotion.Config.View.IsShow=0;
				return ;
			}
			if (Km.Promotion.Config.View.IsShow==1){
			   this.hidePromotion();
			   Km.Promotion.Config.View.IsShow=0;
			}
			this.showPromotion();
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
		 * 查询符合条件的促销活动表
		 */
		doSelectPromotion : function() {
			if (this.topToolbar){

			}
			var condition = {'start':0,'limit':Km.Promotion.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServicePromotion.queryPagePromotion(condition,function(provider, response) {
				if (response.result&&response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Promotion.Store.promotionStore.loadData(result);
				} else {
					Km.Promotion.Store.promotionStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的促销活动表！');
				}
			});
		},
		/**
		 * 显示促销活动表视图
		 * 显示促销活动表的视图相对促销活动表列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Promotion.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Promotion.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Promotion.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Promotion.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Promotion.View.Running.viewTabs);
					break;
			}
			Km.Promotion.Cookie.set('View.Direction',Km.Promotion.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Promotion.Config.View.IsFix==0)&&(Km.Promotion.Config.View.IsShow==1)){
					this.showPromotion();
				}
				Km.Promotion.Config.View.IsFix=1;
				Km.Promotion.View.Running.promotionGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Promotion.Config.View.IsShow=0;
				this.showPromotion();
			}
		},
		/**
		 * 显示促销活动表
		 */
		showPromotion : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择促销活动表！');
				Km.Promotion.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Promotion.Config.View.IsFix==0){
				if (Km.Promotion.View.Running.view_window==null){
					Km.Promotion.View.Running.view_window=new Km.Promotion.View.PromotionView.Window();
				}
				if (Km.Promotion.View.Running.view_window.hidden){
					Km.Promotion.View.Running.view_window.show();
					Km.Promotion.View.Running.view_window.winTabs.hideTabStripItem(Km.Promotion.View.Running.view_window.winTabs.tabFix);
					this.updateViewPromotion();
					this.tvpView.toggle(true);
					Km.Promotion.Config.View.IsShow=1;
				}else{
					this.hidePromotion();
					Km.Promotion.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Promotion.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Promotion.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Promotion.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Promotion.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Promotion.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Promotion.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Promotion.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Promotion.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Promotion.View.Running.viewTabs);
					}
					break;
			}
			this.hidePromotion();
			if (Km.Promotion.Config.View.IsShow==0){
				Km.Promotion.View.Running.viewTabs.enableCollapse();
				switch(Km.Promotion.Config.View.Direction){
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
				this.updateViewPromotion();
				this.tvpView.toggle(true);
				Km.Promotion.Config.View.IsShow=1;
			}else{
				Km.Promotion.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏促销活动表
		 */
		hidePromotion : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Promotion.View.Running.view_window!=null){
				Km.Promotion.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前促销活动表显示信息
		 */
		updateViewPromotion : function() {

			if (Km.Promotion.View.Running.view_window!=null){
				Km.Promotion.View.Running.view_window.winTabs.tabPromotionDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Promotion.View.Running.viewTabs.tabPromotionDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建促销活动表
		 */
		addPromotion : function() {
			if (Km.Promotion.View.Running.edit_window==null){
				Km.Promotion.View.Running.edit_window=new Km.Promotion.View.EditWindow();
			}
			Km.Promotion.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Promotion.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Promotion.View.Running.edit_window.setTitle('添加促销活动表');
			Km.Promotion.View.Running.edit_window.savetype=0;
			Km.Promotion.View.Running.edit_window.promotion_id.setValue("");
            switch (Km.Promotion.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Promotion.View.EditWindow.KindEditor_promdescribe) Km.Promotion.View.EditWindow.KindEditor_promdescribe.html("");
                    break
                case 3:
                    break
                default:
                    if (CKEDITOR.instances.promdescribe) CKEDITOR.instances.promdescribe.setData("");
            }

			Km.Promotion.View.Running.edit_window.show();
			Km.Promotion.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑促销活动表时先获得选中的促销活动表信息
		 */
		updatePromotion : function() {
			if (Km.Promotion.View.Running.edit_window==null){
				Km.Promotion.View.Running.edit_window=new Km.Promotion.View.EditWindow();
			}
			Km.Promotion.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Promotion.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Promotion.View.Running.edit_window.setTitle('修改促销活动表');
			Km.Promotion.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Promotion.View.Running.edit_window.savetype=1;
            switch (Km.Promotion.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Promotion.View.EditWindow.KindEditor_promdescribe) Km.Promotion.View.EditWindow.KindEditor_promdescribe.html(this.getSelectionModel().getSelected().data.promdescribe);
                    break
                case 3:
                    if (xhEditor_promdescribe)xhEditor_promdescribe.setSource(this.getSelectionModel().getSelected().data.promdescribe);
                    break
                default:
                    if (CKEDITOR.instances.promdescribe) CKEDITOR.instances.promdescribe.setData(this.getSelectionModel().getSelected().data.promdescribe);
            }

			Km.Promotion.View.Running.edit_window.show();
			Km.Promotion.View.Running.edit_window.maximize();
		},
		/**
		 * 删除促销活动表
		 */
		deletePromotion : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的促销活动表吗?', this.confirmDeletePromotion,this);
		},
		/**
		 * 确认删除促销活动表
		 */
		confirmDeletePromotion : function(btn) {
			if (btn == 'yes') {
				var del_promotion_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_promotion_ids=del_promotion_ids+selectedRows[flag].data.promotion_id+",";
				}
				ExtServicePromotion.deleteByIds(del_promotion_ids);
				this.doSelectPromotion();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出促销活动表
		 */
		exportPromotion : function() {
			ExtServicePromotion.exportPromotion(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入促销活动表
		 */
		importPromotion : function() {
			if (Km.Promotion.View.current_uploadWindow==null){
				Km.Promotion.View.current_uploadWindow=new Km.Promotion.View.UploadWindow();
			}
			Km.Promotion.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Promotion.View.Running.promotionGrid=new Km.Promotion.View.Grid();
			if (Km.Promotion.Config.View.IsFix==0){
				Km.Promotion.View.Running.promotionGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Promotion.View.Running.promotionGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Promotion.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Promotion.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前促销活动表Grid对象
		 */
		promotionGrid:null,

		/**
		 * 显示促销活动表信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Promotion.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Promotion.Init();
	/**
	 * 促销活动表数据模型获取数据Direct调用
	 */
	Km.Promotion.Store.promotionStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServicePromotion.queryPagePromotion}
	});
	/**
	 * 促销活动表页面布局
	 */
	Km.Promotion.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Promotion.View.Panel()]
	});
	Km.Promotion.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});