Ext.namespace("Kmall.Admin.Goods");
Km = Kmall.Admin;
Km.Goods={
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
			 * 显示货品表的视图相对货品表列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示货品表信息页(或者打开新窗口)
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
		if (Km.Goods.Cookie.get('View.Direction')){
			Km.Goods.Config.View.Direction=Km.Goods.Cookie.get('View.Direction');
		}
		if (Km.Goods.Cookie.get('View.IsFix')!=null){
			Km.Goods.Config.View.IsFix=Km.Goods.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Goods.Store = {
	/**
	 * 货品表
	 */
	goodsStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
                {name: 'goods_id',type: 'int'},
                {name: 'goods_code',type: 'string'},
                {name: 'goods_name',type: 'string'},
                {name: 'product_id',type: 'int'},
                {name: 'pspec_key',type: 'string'},
                {name: 'attr_key',type: 'string'},
                {name: 'ptype_id',type: 'int'},
                {name: 'ptype_key',type: 'string'},
                {name: 'brand_id',type: 'int'},
                {name: 'cost_price',type: 'float'},
                {name: 'sales_price',type: 'float'},
                {name: 'market_price',type: 'float'},
                {name: 'jifen',type: 'float'},
                {name: 'isUp',type: 'string'},
                {name: 'isGiveaway',type: 'string'},
                {name: 'stock',type: 'int'},
                {name: 'sales_count',type: 'int'},
                {name: 'click_count',type: 'int'},
                {name: 'sort_order',type: 'int'},
                {name: 'isShow',type: 'string'},
                {name: 'uptime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'downtime',type: 'date',dateFormat:'Y-m-d H:i:s'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (!options.params.limit)options.params.limit=Km.Goods.Config.PageSize;
					Ext.apply(options.params, Km.Goods.View.Running.goodsGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	})
};
/**
 * View:货品表显示组件
 */
Km.Goods.View={
	/**
	 * 编辑窗口：新建或者修改货品表
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
						ref:'editForm',layout:'form',
						labelWidth : 100,labelAlign : "center",
						bodyStyle : 'padding:5px 5px 0',align : "center",
						api : {},
						defaults : {
							xtype : 'textfield',anchor:'98%'
						},
						items : [
                            {xtype: 'hidden',name : 'goods_id',ref:'../goods_id'},
                            {fieldLabel : '货号',name : 'goods_code'},
                            {fieldLabel : '货品名称',name : 'goods_name'},
                            {fieldLabel : '商品',name : 'product_id',xtype : 'numberfield'},
                            {fieldLabel : '货品规格值',name : 'pspec_key'},
                            {fieldLabel : '商品属性',name : 'attr_key'},
                            {fieldLabel : '商品类型',name : 'ptype_id',xtype : 'numberfield'},
                            {fieldLabel : '商品分类查询字',name : 'ptype_key'},
                            {fieldLabel : '商品品牌',name : 'brand_id',xtype : 'numberfield'},
                            {fieldLabel : '成本价',name : 'cost_price',xtype : 'numberfield'},
                            {fieldLabel : '销售价(<font color=red>*</font>)',name : 'sales_price',allowBlank : false,xtype : 'numberfield'},
                            {fieldLabel : '市场价',name : 'market_price',xtype : 'numberfield'},
                            {fieldLabel : '券',name : 'jifen',xtype : 'numberfield'},
                            {fieldLabel : '是否上架',hiddenName : 'isUp'
                                 ,xtype:'combo',ref:'../isUp',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否上架',
                                 valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '是否为赠品',hiddenName : 'isGiveaway'
                                 ,xtype:'combo',ref:'../isGiveaway',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否为赠品',
                                 valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '库存',name : 'stock',xtype : 'numberfield'},
                            {fieldLabel : '销售量',name : 'sales_count',xtype : 'numberfield'},
                            {fieldLabel : '热度',name : 'click_count',xtype : 'numberfield'},
                            {fieldLabel : '排序',name : 'sort_order',xtype : 'numberfield'},
                            {fieldLabel : '是否显示',hiddenName : 'isShow'
                                 ,xtype:'combo',ref:'../isShow',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否显示',
                                 valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '上架时间',name : 'uptime',xtype : 'datefield',format : "Y-m-d"},
                            {fieldLabel : '下架时间',name : 'downtime',xtype : 'datefield',format : "Y-m-d"}
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
							this.editForm.api.submit=ExtServiceGoods.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Goods.View.Running.goodsGrid.doSelectGoods();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
									Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceGoods.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Km.Goods.View.Running.goodsGrid.store.reload();
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Goods.View.Running.goodsGrid.bottomToolbar.doRefresh();
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
						this.editForm.form.loadRecord(Km.Goods.View.Running.goodsGrid.getSelectionModel().getSelected());

					}
				}]
			}, config);
			Km.Goods.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示货品表详情
	 */
	GoodsView:{
		/**
		 * Tab页：容器包含显示与货品表所有相关的信息
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
								if (Km.Goods.View.Running.goodsGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择货品表！');
									return false;
								}
								Km.Goods.Config.View.IsShow=1;
								Km.Goods.View.Running.goodsGrid.showGoods();
								Km.Goods.View.Running.goodsGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Goods.View.GoodsView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Goods.Config.View.Direction==1)||(Km.Goods.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabGoodsDetail',iconCls:'tabs',
					 tpl: [
						 '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">货号</td><td class="content">{goods_code}</td></tr>',
                         '    <tr class="entry"><td class="head">货品名称</td><td class="content">{goods_name}</td></tr>',
                         '    <tr class="entry"><td class="head">商品</td><td class="content">{product_id}</td></tr>',
                         '    <tr class="entry"><td class="head">货品规格值</td><td class="content">{pspec_key}</td></tr>',
                         '    <tr class="entry"><td class="head">商品属性</td><td class="content">{attr_key}</td></tr>',
                         '    <tr class="entry"><td class="head">商品类型</td><td class="content">{ptype_id}</td></tr>',
                         '    <tr class="entry"><td class="head">商品分类查询字</td><td class="content">{ptype_key}</td></tr>',
                         '    <tr class="entry"><td class="head">商品品牌</td><td class="content">{brand_id}</td></tr>',
                         '    <tr class="entry"><td class="head">成本价</td><td class="content">{cost_price}</td></tr>',
                         '    <tr class="entry"><td class="head">销售价</td><td class="content">{sales_price}</td></tr>',
                         '    <tr class="entry"><td class="head">市场价</td><td class="content">{market_price}</td></tr>',
                         '    <tr class="entry"><td class="head">券</td><td class="content">{jifen}</td></tr>',
                         '    <tr class="entry"><td class="head">是否上架</td><td class="content"><tpl if="isUp == true">是</tpl><tpl if="isUp == false">否</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">是否为赠品</td><td class="content"><tpl if="isGiveaway == true">是</tpl><tpl if="isGiveaway == false">否</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">库存</td><td class="content">{stock}</td></tr>',
                         '    <tr class="entry"><td class="head">销售量</td><td class="content">{sales_count}</td></tr>',
                         '    <tr class="entry"><td class="head">热度</td><td class="content">{click_count}</td></tr>',
                         '    <tr class="entry"><td class="head">排序</td><td class="content">{sort_order}</td></tr>',
                         '    <tr class="entry"><td class="head">是否显示</td><td class="content"><tpl if="isShow == true">是</tpl><tpl if="isShow == false">否</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">上架时间</td><td class="content">{uptime:date("Y-m-d")}</td></tr>',
                         '    <tr class="entry"><td class="head">下架时间</td><td class="content">{downtime:date("Y-m-d")}</td></tr>',
						 '</table>'
					 ]}
				);
                this.add(
                    {title: '其他',iconCls:'tabs'}
                );
			}
		}),
		/**
		 * 窗口:显示货品表信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看货品表",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Goods.View.GoodsView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Goods.Config.View.IsShow=0;
							Km.Goods.View.Running.goodsGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Goods.View.Running.goodsGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增货品表',scope:this,
						handler : function() {this.hide();Km.Goods.View.Running.goodsGrid.addGoods();}
					},{
						text: '修改货品表',scope:this,
						handler : function() {this.hide();Km.Goods.View.Running.goodsGrid.updateGoods();}
					}]
				}, config);
				Km.Goods.View.GoodsView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传货品表
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量上传货品表数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
							emptyText: '请上传货品表Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadGoods',
									success : function(form, response) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Goods.View.Running.goodsGrid.doSelectGoods();
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
			Km.Goods.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：货品表列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Goods.Store.goodsStore,
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
                        {header : '标识',dataIndex : 'goods_id',hidden:true},
                        {header : '货号',dataIndex : 'goods_code'},
                        {header : '货品名称',dataIndex : 'goods_name'},
                        {header : '商品',dataIndex : 'product_id'},
                        {header : '货品规格值',dataIndex : 'pspec_key'},
                        {header : '商品属性',dataIndex : 'attr_key'},
                        {header : '商品类型',dataIndex : 'ptype_id'},
                        {header : '商品分类查询字',dataIndex : 'ptype_key'},
                        {header : '商品品牌',dataIndex : 'brand_id'},
                        {header : '成本价',dataIndex : 'cost_price'},
                        {header : '销售价',dataIndex : 'sales_price'},
                        {header : '市场价',dataIndex : 'market_price'},
                        {header : '券',dataIndex : 'jifen'},
                        {header : '是否上架',dataIndex : 'isUp',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '是否为赠品',dataIndex : 'isGiveaway',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '库存',dataIndex : 'stock'},
                        {header : '销售量',dataIndex : 'sales_count'},
                        {header : '热度',dataIndex : 'click_count'},
                        {header : '排序',dataIndex : 'sort_order'},
                        {header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '上架时间',dataIndex : 'uptime',renderer:Ext.util.Format.dateRenderer('Y-m-d')},
                        {header : '下架时间',dataIndex : 'downtime',renderer:Ext.util.Format.dateRenderer('Y-m-d')}
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
										if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectGoods();
									}
								}
							},
							items : [

								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectGoods();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {

										this.filter={};
										this.doSelectGoods();
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
									text : '添加货品表',iconCls : 'icon-add',
									handler : function() {
										this.addGoods();
									}
								},'-',{
									text : '修改货品表',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateGoods();
									}
								},'-',{
									text : '删除货品表', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteGoods();
									}
								},'-',{
									xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
									handler : function() {
										this.importGoods();
									},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'批量导入货品表',iconCls : 'icon-import',scope:this,handler:function(){this.importGoods()}}
										]}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportGoods();
									}
								},'-',{
									xtype:'tbsplit',text: '查看货品表', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showGoods()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideGoods();Km.Goods.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Goods.Cookie.set('View.IsFix',Km.Goods.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Goods.Config.PageSize,
					store: Km.Goods.Store.goodsStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
						change:function(thisbar,pagedata){
							if (Km.Goods.Viewport){
								if (Km.Goods.Config.View.IsShow==1){
									Km.Goods.View.IsSelectView=1;
								}
								this.ownerCt.hideGoods();
								Km.Goods.Config.View.IsShow=0;
							}
						}
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Goods.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Goods.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Goods.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectGoods();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Goods.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Goods.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectGoods();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示货品表列表
			this.doSelectGoods();
			Km.Goods.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的货品表信息Tab页
			Km.Goods.View.Running.viewTabs=new Km.Goods.View.GoodsView.Tabs();
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
					this.grid.updateViewGoods();
					if (sm.getCount() != 1){
						this.grid.hideGoods();
						Km.Goods.Config.View.IsShow=0;
					}else{
						if (Km.Goods.View.IsSelectView==1){
							Km.Goods.View.IsSelectView=0;
							this.grid.showGoods();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Goods.Config.View.IsShow==1){
							Km.Goods.View.IsSelectView=1;
						}
						this.grid.hideGoods();
						Km.Goods.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Goods.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showGoods();
				this.tvpView.toggle(true);
			}else{
				this.hideGoods();
				Km.Goods.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Goods.Config.View.IsFix=1;
			}else{
			   Km.Goods.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Goods.Config.View.IsShow=0;
				return ;
			}
			if (Km.Goods.Config.View.IsShow==1){
			   this.hideGoods();
			   Km.Goods.Config.View.IsShow=0;
			}
			this.showGoods();
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
		 * 查询符合条件的货品表
		 */
		doSelectGoods : function() {
			if (this.topToolbar){


			}
			var condition = {'start':0,'limit':Km.Goods.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceGoods.queryPageGoods(condition,function(provider, response) {
				if (response.result&&response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Goods.Store.goodsStore.loadData(result);
				} else {
					Km.Goods.Store.goodsStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的货品表！');
				}
			});
		},
		/**
		 * 显示货品表视图
		 * 显示货品表的视图相对货品表列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Goods.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Goods.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Goods.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Goods.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Goods.View.Running.viewTabs);
					break;
			}
			Km.Goods.Cookie.set('View.Direction',Km.Goods.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Goods.Config.View.IsFix==0)&&(Km.Goods.Config.View.IsShow==1)){
					this.showGoods();
				}
				Km.Goods.Config.View.IsFix=1;
				Km.Goods.View.Running.goodsGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Goods.Config.View.IsShow=0;
				this.showGoods();
			}
		},
		/**
		 * 显示货品表
		 */
		showGoods : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择货品表！');
				Km.Goods.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Goods.Config.View.IsFix==0){
				if (Km.Goods.View.Running.view_window==null){
					Km.Goods.View.Running.view_window=new Km.Goods.View.GoodsView.Window();
				}
				if (Km.Goods.View.Running.view_window.hidden){
					Km.Goods.View.Running.view_window.show();
					Km.Goods.View.Running.view_window.winTabs.hideTabStripItem(Km.Goods.View.Running.view_window.winTabs.tabFix);
					this.updateViewGoods();
					this.tvpView.toggle(true);
					Km.Goods.Config.View.IsShow=1;
				}else{
					this.hideGoods();
					Km.Goods.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Goods.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Goods.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Goods.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Goods.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Goods.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Goods.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Goods.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Goods.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Goods.View.Running.viewTabs);
					}
					break;
			}
			this.hideGoods();
			if (Km.Goods.Config.View.IsShow==0){
				Km.Goods.View.Running.viewTabs.enableCollapse();
				switch(Km.Goods.Config.View.Direction){
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
				this.updateViewGoods();
				this.tvpView.toggle(true);
				Km.Goods.Config.View.IsShow=1;
			}else{
				Km.Goods.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏货品表
		 */
		hideGoods : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Goods.View.Running.view_window!=null){
				Km.Goods.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前货品表显示信息
		 */
		updateViewGoods : function() {

			if (Km.Goods.View.Running.view_window!=null){
				Km.Goods.View.Running.view_window.winTabs.tabGoodsDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Goods.View.Running.viewTabs.tabGoodsDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建货品表
		 */
		addGoods : function() {
			if (Km.Goods.View.Running.edit_window==null){
				Km.Goods.View.Running.edit_window=new Km.Goods.View.EditWindow();
			}
			Km.Goods.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Goods.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Goods.View.Running.edit_window.setTitle('添加货品表');
			Km.Goods.View.Running.edit_window.savetype=0;
			Km.Goods.View.Running.edit_window.goods_id.setValue("");

			Km.Goods.View.Running.edit_window.show();
			Km.Goods.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑货品表时先获得选中的货品表信息
		 */
		updateGoods : function() {
			if (Km.Goods.View.Running.edit_window==null){
				Km.Goods.View.Running.edit_window=new Km.Goods.View.EditWindow();
			}
			Km.Goods.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Goods.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Goods.View.Running.edit_window.setTitle('修改货品表');
			Km.Goods.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Goods.View.Running.edit_window.savetype=1;

			Km.Goods.View.Running.edit_window.show();
			Km.Goods.View.Running.edit_window.maximize();
		},
		/**
		 * 删除货品表
		 */
		deleteGoods : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的货品表吗?', this.confirmDeleteGoods,this);
		},
		/**
		 * 确认删除货品表
		 */
		confirmDeleteGoods : function(btn) {
			if (btn == 'yes') {
				var del_goods_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_goods_ids=del_goods_ids+selectedRows[flag].data.goods_id+",";
				}
				ExtServiceGoods.deleteByIds(del_goods_ids);
				this.doSelectGoods();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出货品表
		 */
		exportGoods : function() {
			ExtServiceGoods.exportGoods(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入货品表
		 */
		importGoods : function() {
			if (Km.Goods.View.current_uploadWindow==null){
				Km.Goods.View.current_uploadWindow=new Km.Goods.View.UploadWindow();
			}
			Km.Goods.View.current_uploadWindow.show();
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Goods.View.Running.goodsGrid=new Km.Goods.View.Grid();
			if (Km.Goods.Config.View.IsFix==0){
				Km.Goods.View.Running.goodsGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Goods.View.Running.goodsGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Goods.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Goods.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前货品表Grid对象
		 */
		goodsGrid:null,

		/**
		 * 显示货品表信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Goods.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Goods.Init();
	/**
	 * 货品表数据模型获取数据Direct调用
	 */
	Km.Goods.Store.goodsStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceGoods.queryPageGoods}
	});
	/**
	 * 货品表页面布局
	 */
	Km.Goods.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Goods.View.Panel()]
	});
	Km.Goods.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});
