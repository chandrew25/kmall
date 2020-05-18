Ext.namespace("Kmall.Admin.Couponitems");
Km = Kmall.Admin;
Km.Couponitems={
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
			 * 显示优惠券实体表的视图相对优惠券实体表列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示优惠券实体表信息页(或者打开新窗口)
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
		if (Km.Couponitems.Cookie.get('View.Direction')){
			Km.Couponitems.Config.View.Direction=Km.Couponitems.Cookie.get('View.Direction');
		}
		if (Km.Couponitems.Cookie.get('View.IsFix')!=null){
			Km.Couponitems.Config.View.IsFix=Km.Couponitems.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Couponitems.Store = {
	/**
	 * 优惠券实体表
	 */
	couponitemsStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
                {name: 'couponitems_id',type: 'int'},
                {name: 'member_id',type: 'int'},
                {name: 'couponitems_key',type: 'string'},
                {name: 'coupon_id',type: 'int'},
                {name: 'coupon_name',type: 'string'},
                {name: 'coupon_value',type: 'float'},
                {name: 'phonenumber',type: 'string'},
                {name: 'isExchange',type: 'string'},
                {name: 'create_fromShow',type: 'string'},
                {name: 'create_from',type: 'string'},
                {name: 'sort_order',type: 'string'},
                {name: 'exchange_info',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (!options.params.limit)options.params.limit=Km.Couponitems.Config.PageSize;
					Ext.apply(options.params, Km.Couponitems.View.Running.couponitemsGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	}),
    /**
     * 优惠券
     */
    couponStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/coupon.php'
          }),
        reader: new Ext.data.JsonReader({
            root: 'coupons',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'coupon_id'
          }, [
              {name: 'coupon_id', mapping: 'coupon_id'},
              {name: 'coupon_name', mapping: 'coupon_name'}
        ])
    })
};
/**
 * View:优惠券实体表显示组件
 */
Km.Couponitems.View={
	/**
	 * 显示优惠券实体表详情
	 */
	CouponitemsView:{
		/**
		 * Tab页：容器包含显示与优惠券实体表所有相关的信息
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
								if (Km.Couponitems.View.Running.couponitemsGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择优惠券实体表！');
									return false;
								}
								Km.Couponitems.Config.View.IsShow=1;
								Km.Couponitems.View.Running.couponitemsGrid.showCouponitems();
								Km.Couponitems.View.Running.couponitemsGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Couponitems.View.CouponitemsView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Couponitems.Config.View.Direction==1)||(Km.Couponitems.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabCouponitemsDetail',iconCls:'tabs',
					 tpl: [
						 '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">优惠券号码</td><td class="content">{couponitems_key}</td></tr>',
                         '    <tr class="entry"><td class="head">所属优惠券</td><td class="content">{coupon_name}</td></tr>',
                         '    <tr class="entry"><td class="head">优惠券价值</td><td class="content">{coupon_value}</td></tr>',
                         '    <tr class="entry"><td class="head">手机号码</td><td class="content">{phonenumber}</td></tr>',
                         '    <tr class="entry"><td class="head">是否兑换</td><td class="content"><tpl if="isExchange == true">是</tpl><tpl if="isExchange == false">否</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">生成类型</td><td class="content">{create_fromShow}</td></tr>',
                         '    <tr class="entry"><td class="head">兑换信息</td><td class="content">{exchange_info}</td></tr>',
						 '</table>'
					 ]}
				);
			}
		}),
		/**
		 * 窗口:显示优惠券实体表信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看优惠券实体表",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Couponitems.View.CouponitemsView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Couponitems.Config.View.IsShow=0;
							Km.Couponitems.View.Running.couponitemsGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Couponitems.Config.View.IsShow=0;
							Km.Couponitems.View.Running.couponitemsGrid.tvpView.toggle(false);
						}
					}
				}, config);
				Km.Couponitems.View.CouponitemsView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 视图：优惠券实体表列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Couponitems.Store.couponitemsStore,
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
                        {header : '标识',dataIndex : 'couponitems_id',hidden:true},
                        {header : '优惠券号码',dataIndex : 'couponitems_key',width:200},
                        {header : '所属优惠券',dataIndex : 'coupon_name'},
                        {header : '优惠券价值',dataIndex : 'coupon_value'},
                        {header : '手机号码',dataIndex : 'phonenumber'},
                        {header : '是否兑换',dataIndex : 'isExchange',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '生成类型',dataIndex : 'create_fromShow'},
                        {header : '兑换信息',dataIndex : 'exchange_info',width:500}
					]
				}),
				tbar : {
					xtype : 'container',layout : 'anchor',height : 27 ,style:'font-size:14px',
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
										if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectCouponitems();
									}
								}
							},
							items : [
                                '优惠券名称:','&nbsp;&nbsp;',
                                {
                                     xtype: 'combo',name : 'coupon_name',hiddenName : 'coupon_id',ref:'../coupon_id',
                                     store:Km.Couponitems.Store.couponStore,emptyText: '请选择优惠券',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width:200,pageSize:Km.Couponitems.Config.PageSize,
                                     displayField:'coupon_name',/*显示文本*/valueField:'coupon_id',/*getValue获得的参数*/
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                                '<tpl for="."><div class="search-item">',
                                                    '<h3>{coupon_name}</h3>',
                                                '</div></tpl>'
                                     )
                                },
                                '优惠券号码:',"&nbsp;&nbsp;",{ref: '../couponitems_key',width:160},"&nbsp;&nbsp;",
                                '手机号码:',"&nbsp;&nbsp;",{ref: '../couponitemsphone_name',width:160},"&nbsp;&nbsp;",
                                '是否兑换','&nbsp;&nbsp;',{hiddenName : 'isExchange'
                                        ,xtype:'combo',ref:'../isExchange',mode : 'local',triggerAction : 'all',width:120,
                                        lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                        store : new Ext.data.SimpleStore({
                                            fields : ['value', 'text'],
                                            data : [['0', '否'], ['1', '是']]
                                        }),emptyText: '请选择是否兑换',
                                        valueField : 'value',displayField :'text'
                                },'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectCouponitems();
                                    }
                                },
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
                                        this.topToolbar.coupon_id.setValue("");
                                        this.topToolbar.couponitemsphone_name.setValue("");
                                        this.topToolbar.couponitems_key.setValue("");
                                        this.topToolbar.isExchange.setValue("");
										this.filter={};
										this.doSelectCouponitems();
									}
								}]
						})
					]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Couponitems.Config.PageSize,
					store: Km.Couponitems.Store.couponitemsStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
						change:function(thisbar,pagedata){
							if (Km.Couponitems.Viewport){
								if (Km.Couponitems.Config.View.IsShow==1){
									Km.Couponitems.View.IsSelectView=1;
								}
								this.ownerCt.hideCouponitems();
								Km.Couponitems.Config.View.IsShow=0;
							}
						}
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Couponitems.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Couponitems.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Couponitems.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectCouponitems();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Couponitems.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Couponitems.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectCouponitems();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示优惠券实体表列表
			this.doSelectCouponitems();
			Km.Couponitems.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的优惠券实体表信息Tab页
			Km.Couponitems.View.Running.viewTabs=new Km.Couponitems.View.CouponitemsView.Tabs();
		},
		/**
		 * 行选择器
		 */
		sm : new Ext.grid.CheckboxSelectionModel({
			//handleMouseDown : Ext.emptyFn,
			listeners : {
				selectionchange:function(sm) {

				},
				rowselect: function(sm, rowIndex, record) {
					this.grid.updateViewCouponitems();
					if (sm.getCount() != 1){
						Km.Couponitems.Config.View.IsShow=0;
					}else{
						if (Km.Couponitems.View.IsSelectView==1){
							Km.Couponitems.View.IsSelectView=0;
							this.grid.showCouponitems();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Couponitems.Config.View.IsShow==1){
							Km.Couponitems.View.IsSelectView=1;
						}
						Km.Couponitems.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Couponitems.Config.View.IsFix=1;
			}else{
			   Km.Couponitems.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Couponitems.Config.View.IsShow=0;
				return ;
			}
			if (Km.Couponitems.Config.View.IsShow==1){
			   Km.Couponitems.Config.View.IsShow=0;
			}
			this.showCouponitems();
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
		 * 查询符合条件的优惠券实体表
		 */
		doSelectCouponitems : function() {
			if (this.topToolbar){
                    var coupon_id               = this.topToolbar.coupon_id.getValue();
                    var couponitemsphone_name   = this.topToolbar.couponitemsphone_name.getValue();
                    var couponitems_key         = this.topToolbar.couponitems_key.getValue();
                    var isExchange              = this.topToolbar.isExchange.getValue();
                    this.filter     ={'coupon_id':coupon_id,'phonenumber':couponitemsphone_name,'couponitems_key':couponitems_key,'isExchange':isExchange};
			}
			var condition = {'start':0,'limit':Km.Couponitems.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceCouponitems.queryPageCouponitems(condition,function(provider, response) {
				if (response.result&&response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Couponitems.Store.couponitemsStore.loadData(result);
				} else {
					Km.Couponitems.Store.couponitemsStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的优惠券实体表！');
				}
			});
		},
		/**
		 * 显示优惠券实体表视图
		 * 显示优惠券实体表的视图相对优惠券实体表列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Couponitems.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Couponitems.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Couponitems.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Couponitems.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Couponitems.View.Running.viewTabs);
					break;
			}
			Km.Couponitems.Cookie.set('View.Direction',Km.Couponitems.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Couponitems.Config.View.IsFix==0)&&(Km.Couponitems.Config.View.IsShow==1)){
					this.showCouponitems();
				}
				Km.Couponitems.Config.View.IsFix=1;
				Km.Couponitems.View.Running.couponitemsGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Couponitems.Config.View.IsShow=0;
				this.showCouponitems();
			}
		},
		/**
		 * 更新当前优惠券实体表显示信息
		 */
		updateViewCouponitems : function() {

			if (Km.Couponitems.View.Running.view_window!=null){
				Km.Couponitems.View.Running.view_window.winTabs.tabCouponitemsDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Couponitems.View.Running.viewTabs.tabCouponitemsDetail.update(this.getSelectionModel().getSelected().data);
		}
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Couponitems.View.Running.couponitemsGrid=new Km.Couponitems.View.Grid();
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Couponitems.View.Running.couponitemsGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Couponitems.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Couponitems.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前优惠券实体表Grid对象
		 */
		couponitemsGrid:null,

		/**
		 * 显示优惠券实体表信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Couponitems.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Couponitems.Init();
	/**
	 * 优惠券实体表数据模型获取数据Direct调用
	 */
	Km.Couponitems.Store.couponitemsStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceCouponitems.queryPageCouponitems}
	});
	/**
	 * 优惠券实体表页面布局
	 */
	Km.Couponitems.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Couponitems.View.Panel()]
	});
	Km.Couponitems.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});