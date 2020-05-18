Ext.namespace("Kmall.Admin.Jingdongorder");
Km = Kmall.Admin;
Km.Order={
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
			 * 显示订单的视图相对订单列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示订单信息页(或者打开新窗口)
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
		if (Km.Order.Cookie.get('View.Direction')){
			Km.Order.Config.View.Direction=Km.Order.Cookie.get('View.Direction');
		}
		if (Km.Order.Cookie.get('View.IsFix')!=null){
			Km.Order.Config.View.IsFix=Km.Order.Cookie.get('View.IsFix');
		}
	}
}; 
/**
 * Model:数据模型   
 */
Km.Order.Store = {
	/**
	 * 订单
	 */ 
	orderStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
				  {name: 'order_no',type: 'string'},
				  {name: 'username',type: 'string'},
				  {name: 'order_status',type: 'string'},
				  {name: 'pay_status',type: 'string'},
				  {name: 'ship_status',type: 'string'},
				  {name: 'total_amount',type: 'string'},
				  {name: 'ordertime',type: 'string'},
				  {name: 'pay_type',type: 'string'},
				  {name: 'ship_addr',type: 'string'},
				  {name: 'ship_name',type: 'string'},
				  {name: 'ship_mobile',type: 'string'},
				  {name: 'ship_type',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false 
		}),
		listeners : {    
			beforeload : function(store, options) {
				if (Ext.isReady) {  
					Ext.apply(options.params, Km.Order.View.Running.orderGrid.filter);//保证分页也将查询条件带上  
				}
			}
		}    
	})
};
/**
 * View:订单显示组件  
 */
Km.Order.View = {
	/**
	 * 视图：订单列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件  
				 */
				filter:null,region : 'center',store : Km.Order.Store.orderStore,sm : this.sm,
				frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
				loadMask : true,stripeRows : true,headerAsText : false,
				defaults : {autoScroll : true},
				cm : new Ext.grid.ColumnModel({
					defaults:{width:120,sortable:true},
					columns : [
						  this.sm,
						  {header : '订单号',dataIndex : 'order_no'},
						  {header : '会员',dataIndex : 'username'},
						  {header : '订单状态',dataIndex : 'order_status'},
						  {header : '支付状态',dataIndex : 'pay_status'},
						  {header : '物流状态',dataIndex : 'ship_status'},
						  {header : '订单总额',dataIndex : 'total_amount'},
						  {header : '下单时间',dataIndex : 'ordertime'},
						  {header : '支付方式',dataIndex : 'pay_type'},
						  {header : '收货地址',dataIndex : 'ship_addr'},
						  {header : '收货人',dataIndex : 'ship_name'},
						  {header : '收货手机',dataIndex : 'ship_mobile'},
						  {header : '配送方式',dataIndex : 'ship_type'}
					]
				}),
				tbar : {
					xtype : 'container',layout : 'anchor',
					height : 27,style:'font-size:14px',
					defaults : {
						height : 27,anchor : '100%'
					},
					items : [
						new Ext.Toolbar({
							defaults:{
							  scope: this  
							},
							items : [
								{
									text: '从京东商城导入',iconCls : 'icon-add',                                             
									handler: function(){
										this.doSelectOrder();
									}
								},'-'
							]
						}
					)]
				},                
				bbar: new Ext.PagingToolbar({          
					pageSize: Km.Order.Config.PageSize,
					store: Km.Order.Store.orderStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Order.Config.PageSize,minValue:1,width:35, 
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Order.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Order.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectOrder();
								}, 
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Order.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Order.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectOrder();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			Km.Order.View.Grid.superclass.constructor.call(this, config);
		},
		/**
		 * 查询符合条件的订单
		 */
		doSelectOrder : function() {
			var condition = {'start':0,'limit':Km.Order.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceJingdongorder.queryPageOrder(condition,function(provider, response) {   
				if (response.result.data) {   
					var result           = new Array();
					result['data']       =response.result.data; 
					result['totalCount'] =response.result.totalCount;
					Km.Order.Store.orderStore.loadData(result); 
				} else {
					Km.Order.Store.orderStore.removeAll();                        
					Ext.Msg.alert('提示', '无符合条件的订单！');
				}
			});
		},
		/**
		 * 行选择器
		 */
		sm : new Ext.grid.CheckboxSelectionModel({
			listeners : {
				selectionchange:function(sm) {
				},
				rowselect: function(sm, rowIndex, record) {
				},
				rowdeselect: function(sm, rowIndex, record) {
				}
			}
		})
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Order.View.Running.orderGrid=new Km.Order.View.Grid();
			config = Ext.apply({ 
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Order.View.Running.orderGrid, 
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
					]
				}
			}, config);   
			Km.Order.View.Panel.superclass.constructor.call(this, config);  
		}        
	}),
	/**
	 * 当前运行的可视化对象
	 */ 
	Running:{
		/**
		 * 当前订单Grid对象
		 */
		orderGrid:null
	}    
};
/**
 * Controller:主程序
 */
Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.state.Manager.setProvider(Km.Order.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);     
	Km.Order.Init();
	/**
	 * 订单数据模型获取数据Direct调用
	 */
	Km.Order.Store.orderStore.proxy=new Ext.data.DirectProxy({ 
		api: {read:ExtServiceJingdongorder.queryPageOrder}
	});
	   
	/**
	 * 订单页面布局
	 */
	Km.Order.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Order.View.Panel()]
	});
	Km.Order.Viewport.doLayout();                             
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});     