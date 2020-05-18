Ext.namespace("Kmall.Admin.Deliverylog");
Km = Kmall.Admin.Deliverylog;
Km.Deliverylog={
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
			 * 显示收发货记录的视图相对收发货记录列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示收发货记录信息页(或者打开新窗口)
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
		if (Km.Deliverylog.Cookie.get('View.Direction')){
			Km.Deliverylog.Config.View.Direction=Km.Deliverylog.Cookie.get('View.Direction');
		}
		if (Km.Deliverylog.Cookie.get('View.IsFix')!=null){
			Km.Deliverylog.Config.View.IsFix=Km.Deliverylog.Cookie.get('View.IsFix');
		}
		if (Ext.util.Cookies.get('OnlineEditor')!=null){
			Km.Deliverylog.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
		}
	}
};
/**
 * Model:数据模型
 */
Km.Deliverylog.Store = {
	/**
	 * 收发货记录
	 */
	deliverylogStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				  {name: 'deliverylog_id',type: 'int'},
				  {name: 'order_id',type: 'int'},
				  {name: 'order_no',type: 'string'},
				  {name: 'delivery_no',type: 'string'},
				  {name: 'operater',type: 'string'},
				  {name: 'deliveryAction',type: 'string'},
                  {name: 'deliveryActionShow',type: 'string'},
				  {name: 'result',type: 'string'},
				  {name: 'intro',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					Ext.apply(options.params, Km.Deliverylog.View.Running.deliverylogGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	}),
	/**
	 * 订单
	 */
	orderStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/order.php'
		  }),
		reader: new Ext.data.JsonReader({
			root: 'orders',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'order_id'
		  }, [
			  {name: 'order_id', mapping: 'order_id'},
			  {name: 'order_no', mapping: 'order_no'}
		])
	})
};
/**
 * View:收发货记录显示组件
 */
Km.Deliverylog.View={
	/**
	 * 显示收发货记录详情
	 */
	DeliverylogView:{
		/**
		 * Tab页：容器包含显示与收发货记录所有相关的信息
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
								if (Km.Deliverylog.View.Running.deliverylogGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择收发货记录！');
									return false;
								}
								Km.Deliverylog.Config.View.IsShow=1;
								Km.Deliverylog.View.Running.deliverylogGrid.showDeliverylog();
								Km.Deliverylog.View.Running.deliverylogGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Deliverylog.View.DeliverylogView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Deliverylog.Config.View.Direction==1)||(Km.Deliverylog.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabDeliverylogDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">',
						 '<tr class="entry"><td class="head">订单号</td><td class="content">{order_no}</td></tr>',
						 '<tr class="entry"><td class="head">物流单号</td><td class="content">{delivery_no}</td></tr>',
						 '<tr class="entry"><td class="head">操作人员</td><td class="content">{operater}</td></tr>',
						 '<tr class="entry"><td class="head">收发货行为</td><td class="content">{deliveryActionShow}</td></tr>',
						 '<tr class="entry"><td class="head">结果</td><td class="content">{result}</td></tr>',
						 '<tr class="entry"><td class="head">备注说明</td><td class="content">{intro}</td></tr>',
					 '</table>'
					 ]
					}
				);
			}
		}),
		/**
		 * 窗口:显示收发货记录信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看收发货记录",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Deliverylog.View.DeliverylogView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Deliverylog.Config.View.IsShow=0;
							Km.Deliverylog.View.Running.deliverylogGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Deliverylog.Config.View.IsShow=0;
							Km.Deliverylog.View.Running.deliverylogGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Deliverylog.View.Running.deliverylogGrid.addDeliverylog();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Deliverylog.View.Running.deliverylogGrid.updateDeliverylog();}
					}]
				}, config);
				Km.Deliverylog.View.DeliverylogView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 视图：收发货记录列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Deliverylog.Store.deliverylogStore,
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
						  {header : '订单号',dataIndex : 'order_no'},
						  {header : '物流单号',dataIndex : 'delivery_no'},
						  {header : '操作人员',dataIndex : 'operater'},
						  {header : '收发货行为',dataIndex : 'deliveryActionShow'},
						  {header : '结果',dataIndex : 'result'},
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
							enableOverflow: true,width : 100,
							defaults : {
							   xtype : 'textfield'
							},
							items : [
								'订单号 ','&nbsp;&nbsp;',{ref: '../dorder_no'},'&nbsp;&nbsp;',
								'物流单号 ','&nbsp;&nbsp;',{ref: '../ddelivery_no'},'&nbsp;&nbsp;',
								'收发货行为 ','&nbsp;&nbsp;',{ref: '../ddeliveryAction',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['1', '发货'],['2', '收货'],['3', '退货']]
									  }),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',
								'结果 ','&nbsp;&nbsp;',{ref: '../dresult',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['succ', '成功'],['proc', '处理中'],['fail', '失败']]
									  }),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectDeliverylog();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.dorder_no.setValue("");
										this.topToolbar.ddelivery_no.setValue("");
										this.topToolbar.ddeliveryAction.setValue("");
										this.topToolbar.dresult.setValue("");
										this.filter={};
										this.doSelectDeliverylog();
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
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportDeliverylog();
									}
								},'-',{
									xtype:'tbsplit',text: '查看收发货记录', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showDeliverylog()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideDeliverylog();Km.Deliverylog.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Deliverylog.Cookie.set('View.IsFix',Km.Deliverylog.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Deliverylog.Config.PageSize,
					store: Km.Deliverylog.Store.deliverylogStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Deliverylog.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Deliverylog.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Deliverylog.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectDeliverylog();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Deliverylog.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Deliverylog.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectDeliverylog();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示收发货记录列表
			this.doSelectDeliverylog();
			Km.Deliverylog.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的收发货记录信息Tab页
			Km.Deliverylog.View.Running.viewTabs=new Km.Deliverylog.View.DeliverylogView.Tabs();
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
					this.grid.tvpView.setDisabled(sm.getCount() != 1);
				},
				rowselect: function(sm, rowIndex, record) {
					this.grid.updateViewDeliverylog();
					if (sm.getCount() != 1){
						this.grid.hideDeliverylog();
						Km.Deliverylog.Config.View.IsShow=0;
					}else{
						if (Km.Deliverylog.View.IsSelectView==1){
							Km.Deliverylog.View.IsSelectView=0;
							this.grid.showDeliverylog();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Deliverylog.Config.View.IsShow==1){
							Km.Deliverylog.View.IsSelectView=1;
						}
						this.grid.hideDeliverylog();
						Km.Deliverylog.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Deliverylog.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showDeliverylog();
				this.tvpView.toggle(true);
			}else{
				this.hideDeliverylog();
				Km.Deliverylog.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Deliverylog.Config.View.IsFix=1;
			}else{
			   Km.Deliverylog.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Deliverylog.Config.View.IsShow=0;
				return ;
			}
			if (Km.Deliverylog.Config.View.IsShow==1){
			   this.hideDeliverylog();
			   Km.Deliverylog.Config.View.IsShow=0;
			}
			this.showDeliverylog();
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
		 * 查询符合条件的收发货记录
		 */
		doSelectDeliverylog : function() {
			if (this.topToolbar){
				var dorder_no = this.topToolbar.dorder_no.getValue();
				var ddelivery_no = this.topToolbar.ddelivery_no.getValue();
				var ddeliveryAction = this.topToolbar.ddeliveryAction.getValue();
				var dresult = this.topToolbar.dresult.getValue();
				this.filter       ={'order_no':dorder_no,'delivery_no':ddelivery_no,'deliveryAction':ddeliveryAction,'result':dresult};
			}
			var condition = {'start':0,'limit':Km.Deliverylog.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceDeliverylog.queryPageDeliverylog(condition,function(provider, response) {
				if (response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Deliverylog.Store.deliverylogStore.loadData(result);
				} else {
					Km.Deliverylog.Store.deliverylogStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的收发货记录！');
				}
			});
		},
		/**
		 * 显示收发货记录视图
		 * 显示收发货记录的视图相对收发货记录列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Deliverylog.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Deliverylog.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Deliverylog.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Deliverylog.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Deliverylog.View.Running.viewTabs);
					break;
			}
			Km.Deliverylog.Cookie.set('View.Direction',Km.Deliverylog.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Deliverylog.Config.View.IsFix==0)&&(Km.Deliverylog.Config.View.IsShow==1)){
					this.showDeliverylog();
				}
				Km.Deliverylog.Config.View.IsFix=1;
				Km.Deliverylog.View.Running.deliverylogGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Deliverylog.Config.View.IsShow=0;
				this.showDeliverylog();
			}
		},
		/**
		 * 显示收发货记录
		 */
		showDeliverylog : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择收发货记录！');
				Km.Deliverylog.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Deliverylog.Config.View.IsFix==0){
				if (Km.Deliverylog.View.Running.view_window==null){
					Km.Deliverylog.View.Running.view_window=new Km.Deliverylog.View.DeliverylogView.Window();
				}
				if (Km.Deliverylog.View.Running.view_window.hidden){
					Km.Deliverylog.View.Running.view_window.show();
					Km.Deliverylog.View.Running.view_window.winTabs.hideTabStripItem(Km.Deliverylog.View.Running.view_window.winTabs.tabFix);
					this.updateViewDeliverylog();
					this.tvpView.toggle(true);
					Km.Deliverylog.Config.View.IsShow=1;
				}else{
					this.hideDeliverylog();
					Km.Deliverylog.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Deliverylog.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Deliverylog.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Deliverylog.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Deliverylog.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Deliverylog.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Deliverylog.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Deliverylog.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Deliverylog.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Deliverylog.View.Running.viewTabs);
					}
					break;
			}
			this.hideDeliverylog();
			if (Km.Deliverylog.Config.View.IsShow==0){
				Km.Deliverylog.View.Running.viewTabs.enableCollapse();
				switch(Km.Deliverylog.Config.View.Direction){
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
				this.updateViewDeliverylog();
				this.tvpView.toggle(true);
				Km.Deliverylog.Config.View.IsShow=1;
			}else{
				Km.Deliverylog.Config.View.IsShow=0;
			}

			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏收发货记录
		 */
		hideDeliverylog : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Deliverylog.View.Running.view_window!=null){
				Km.Deliverylog.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前收发货记录显示信息
		 */
		updateViewDeliverylog : function() {
			if (Km.Deliverylog.View.Running.view_window!=null){
				Km.Deliverylog.View.Running.view_window.winTabs.tabDeliverylogDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Deliverylog.View.Running.viewTabs.tabDeliverylogDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建收发货记录
		 */
		addDeliverylog : function() {
			if (Km.Deliverylog.View.Running.edit_window==null){
				Km.Deliverylog.View.Running.edit_window=new Km.Deliverylog.View.EditWindow();
			}
			Km.Deliverylog.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Deliverylog.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Deliverylog.View.Running.edit_window.setTitle('添加收发货记录');
			Km.Deliverylog.View.Running.edit_window.savetype=0;
			Km.Deliverylog.View.Running.edit_window.deliverylog_id.setValue("");
			switch (Km.Deliverylog.Config.OnlineEditor)
			{
				case 2:
					if (Km.Deliverylog.View.EditWindow.KindEditor_intro) Km.Deliverylog.View.EditWindow.KindEditor_intro.html("");
					break
				case 3:
					break
				default:
					if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData("");
			}

			Km.Deliverylog.View.Running.edit_window.show();
			Km.Deliverylog.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑收发货记录时先获得选中的收发货记录信息
		 */
		updateDeliverylog : function() {
			if (Km.Deliverylog.View.Running.edit_window==null){
				Km.Deliverylog.View.Running.edit_window=new Km.Deliverylog.View.EditWindow();
			}
			Km.Deliverylog.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Deliverylog.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Deliverylog.View.Running.edit_window.setTitle('修改收发货记录');
			Km.Deliverylog.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Deliverylog.View.Running.edit_window.savetype=1;
			switch (Km.Deliverylog.Config.OnlineEditor)
			{
				case 2:
					if (Km.Deliverylog.View.EditWindow.KindEditor_intro) Km.Deliverylog.View.EditWindow.KindEditor_intro.html(this.getSelectionModel().getSelected().data.intro);
					break
				case 3:
					if (xhEditor_intro)xhEditor_intro.setSource(this.getSelectionModel().getSelected().data.intro);
					break
				default:
					if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(this.getSelectionModel().getSelected().data.intro);
			}

			Km.Deliverylog.View.Running.edit_window.show();
			Km.Deliverylog.View.Running.edit_window.maximize();
		},
		/**
		 * 删除收发货记录
		 */
		deleteDeliverylog : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的收发货记录吗?', this.confirmDeleteDeliverylog,this);
		},
		/**
		 * 确认删除收发货记录
		 */
		confirmDeleteDeliverylog : function(btn) {
			if (btn == 'yes') {
				var del_deliverylog_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_deliverylog_ids=del_deliverylog_ids+selectedRows[flag].data.deliverylog_id+",";
				}
				ExtServiceDeliverylog.deleteByIds(del_deliverylog_ids);
				this.doSelectDeliverylog();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出收发货记录
		 */
		exportDeliverylog : function() {
			ExtServiceDeliverylog.exportDeliverylog(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入收发货记录
		 */
		importDeliverylog : function() {
			if (Km.Deliverylog.View.current_uploadWindow==null){
				Km.Deliverylog.View.current_uploadWindow=new Km.Deliverylog.View.UploadWindow();
			}
			Km.Deliverylog.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Deliverylog.View.Running.deliverylogGrid=new Km.Deliverylog.View.Grid();
			if (Km.Deliverylog.Config.View.IsFix==0){
				Km.Deliverylog.View.Running.deliverylogGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Deliverylog.View.Running.deliverylogGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Deliverylog.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Deliverylog.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前收发货记录Grid对象
		 */
		deliverylogGrid:null,

		/**
		 * 显示收发货记录信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Deliverylog.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Deliverylog.Init();
	/**
	 * 收发货记录数据模型获取数据Direct调用
	 */
	Km.Deliverylog.Store.deliverylogStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceDeliverylog.queryPageDeliverylog}
	});
	/**
	 * 收发货记录页面布局
	 */
	Km.Deliverylog.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Deliverylog.View.Panel()]
	});
	Km.Deliverylog.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});
