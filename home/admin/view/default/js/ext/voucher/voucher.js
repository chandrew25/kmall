Ext.namespace("Kmall.Admin.Voucher");
Km = Kmall.Admin;
Km.Voucher={
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
			 * 显示票卡券的视图相对票卡券列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示票卡券信息页(或者打开新窗口)
			 */
			IsFix:0
		},
        /**
        * 当前选择卡券类型ID
        */
        Voucher_ID:null
	},
	/**
	 * Cookie设置
	 */
	Cookie:new Ext.state.CookieProvider(),
	/**
	 * 初始化
	 */
	Init:function(){
		if (Km.Voucher.Cookie.get('View.Direction')){
			Km.Voucher.Config.View.Direction=Km.Voucher.Cookie.get('View.Direction');
		}
		if (Km.Voucher.Cookie.get('View.IsFix')!=null){
			Km.Voucher.Config.View.IsFix=Km.Voucher.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Voucher.Store = {
	/**
	 * 票卡券
	 */
	voucherStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
                {name: 'voucher_id',type: 'int'},
                {name: 'voucher_name',type: 'string'},
                {name: 'voucher_num',type: 'int'},
                {name: 'begin_time',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'end_time',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'isValid',type: 'boolean'},
                {name: 'sort_order',type: 'string'},
                {name: 'goodstr',type: 'string'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					if (!options.params.limit)options.params.limit=Km.Voucher.Config.PageSize;
					Ext.apply(options.params, Km.Voucher.View.Running.voucherGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	}),
    /**
     * 货品
     */
    GoodsStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'goods_id',type: 'int'},
                {name: 'product_id',type: 'int'},
                {name: 'goods_name',type: 'string'},
                {name: 'goods_code',type: 'string'},
                {name: 'price',type: 'float'},
                {name: 'ptype_name',type: 'string'},
                {name: 'market_price',type: 'int'},
                {name: 'num',type: 'int'},
                {name: 'isUp',type: 'boolean'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    Ext.apply(options.params, Km.Voucher.View.Running.selectGoodsWindow.selectGoodsGrid.filter);//保证分页也将查询条件带上
                }
            },
            load : function(records,options){
                if (records&&records.data&&records.data.items) {
                    var selData = Km.Voucher.View.Running.selectGoodsWindow.selData;//选中的货品
                    var data    = records.data.items;
                    var sm      = Km.Voucher.View.Running.selectGoodsWindow.selectGoodsGrid.sm;
                    var rows    = Km.Voucher.View.Running.selectGoodsWindow.selectGoodsGrid.getView().getRows();
                    for(var i=0;i<rows.length;i++){
                        if(selData[data[i]['data'].goods_id]){
                            sm.selectRow(i, true);
                        }
                    }
                }
            }
        }
    }),
    /**
     * 票卡券表
     */
    VoucheritemsStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'voucheritems_id',type: 'int'},
                {name: 'voucher_id',type: 'int'},
                {name: 'vi_key',type: 'string'},
                {name: 'isExchange',type: 'boolean'},
                {name: 'sort_order',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Voucher.Config.PageSize;
                    Ext.apply(options.params, Km.Voucher.View.Running.voucheritemsGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 兑换券规则作用货品表
     */
    vouchergoodsStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'goods_id',type: 'int'},
                {name: 'product_id',type: 'int'},
                {name: 'goods_name',type: 'string'},
                {name: 'goods_code',type: 'string'},
                {name: 'price',type: 'float'},
                {name: 'ptype_name',type: 'string'},
                {name: 'market_price',type: 'int'},
                {name: 'num',type: 'int'},
                {name: 'isUp',type:'boolean'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Voucher.Config.PageSize;
                    Ext.apply(options.params, Km.Voucher.View.Running.vouchergoodsGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    })
};
/**
* View:票卡券显示组件
*/
Km.Voucher.View={
	/**
	* 编辑窗口：新建或者修改票卡券
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
						labelWidth : 120,labelAlign : "center",
						bodyStyle : 'padding:5px 5px 0',align : "center",
						api : {},
						defaults : {
							xtype : 'textfield',anchor:'98%'
						},
						items : [
                            {xtype: 'hidden',name : 'voucher_id',ref:'../voucher_id'},
                            {fieldLabel : '票卡券类型名称(<font color=red>*</font>)',name : 'voucher_name',allowBlank : false},
                            {fieldLabel : '开始时间(<font color=red>*</font>)',name : 'begin_time',xtype : 'datefield',format : "Y-m-d H:i:s",allowBlank : false},
                            {fieldLabel : '结束时间(<font color=red>*</font>)',name : 'end_time',xtype : 'datefield',format : "Y-m-d H:i:s",allowBlank : false},
                            {fieldLabel : '是否有效(<font color=red>*</font>)',hiddenName : 'isValid',allowBlank : false
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
						if (!this.editForm.getForm().isValid()) {
							return;
						}
						editWindow=this;
						if (this.savetype==0){
							this.editForm.api.submit=ExtServiceVoucher.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Voucher.View.Running.voucherGrid.doSelectVoucher();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
									Ext.Msg.alert("提示", response.result.msg);
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceVoucher.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
                                    Ext.Msg.alert("提示", "修改成功！");
                                    Km.Voucher.View.Running.voucherGrid.doSelectVoucher();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, response) {
                                    Ext.Msg.alert("提示", response.result.msg);
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
						this.editForm.form.loadRecord(Km.Voucher.View.Running.voucherGrid.getSelectionModel().getSelected());

					}
				}]
			}, config);
			Km.Voucher.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	* 显示票卡券详情
	*/
	VoucherView:{
		/**
		 * Tab页：容器包含显示与票卡券所有相关的信息
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
								if (Km.Voucher.View.Running.voucherGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择一种票卡券类型！');
									return false;
								}
								Km.Voucher.Config.View.IsShow=1;
								Km.Voucher.View.Running.voucherGrid.showVoucher();
								Km.Voucher.View.Running.voucherGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Voucher.View.VoucherView.Tabs.superclass.constructor.call(this, config);
                Km.Voucher.View.Running.voucheritemsGrid = new Km.Voucher.View.VoucheritemsView.Grid();
                Km.Voucher.View.Running.vouchergoodsGrid = new Km.Voucher.View.VouchergoodsView.Grid();
				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Voucher.Config.View.Direction==1)||(Km.Voucher.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabVoucherDetail',iconCls:'tabs',
					 tpl: [
						 '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">票卡券类型名称</td><td class="content">{voucher_name}</td></tr>',
                         '    <tr class="entry"><td class="head">票卡券总数</td><td class="content">{voucher_num}</td></tr>',
                         '    <tr class="entry"><td class="head">开始时间</td><td class="content">{begin_time:date("Y-m-d H:i:s")}</td></tr>',
                         '    <tr class="entry"><td class="head">结束时间</td><td class="content">{end_time:date("Y-m-d H:i:s")}</td></tr>',
                         '    <tr class="entry"><td class="head">是否有效</td><td class="content"><tpl if="isValid == true">是</tpl><tpl if="isValid == false">否</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">排序</td><td class="content">{sort_order}</td></tr>',
						 '</table>'
					 ]}
				);
                this.add(
                    {title: '票卡券一览',ref:'tabTransaction',iconCls:'tabs',tabWidth:150,
                       items:[Km.Voucher.View.Running.voucheritemsGrid]
                    }
                );
                this.add(
                    {title: '可兑换的货品',ref:'tabTransaction',iconCls:'tabs',tabWidth:150,
                       items:[Km.Voucher.View.Running.vouchergoodsGrid]
                    }
                );
			}
		}),
		/**
		 * 窗口:显示票卡券信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看票卡券类型",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Voucher.View.VoucherView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Voucher.Config.View.IsShow=0;
							Km.Voucher.View.Running.voucherGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
							Km.Voucher.Config.View.IsShow=0;
							Km.Voucher.View.Running.voucherGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增票卡券类型',scope:this,
						handler : function() {this.hide();Km.Voucher.View.Running.voucherGrid.addVoucher();}
					},{
						text: '修改票卡券类型',scope:this,
						handler : function() {this.hide();Km.Voucher.View.Running.voucherGrid.updateVoucher();}
					}]
				}, config);
				Km.Voucher.View.VoucherView.Window.superclass.constructor.call(this, config);
			}
		})
	},
    /**
    * 视图：关联货品
    */
    SelectGoodsView:{
        /**
        * 关联货品窗口
        */
        SelectGoodsWindow:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    selData:null,//选中的货品
                    oldData:null,//已关联的货品
                    closeAction:"hide",constrainHeader:true,maximizable:true,collapsible:true,
                    width:900,minWidth:900,height:560,minHeight:450,layout:'fit',plain:true,buttonAlign:'center',modal:true,
                    defaults : {autoScroll : true},
                    items : [new Km.Voucher.View.SelectGoodsView.SelectGoodsGrid({ref:"selectGoodsGrid"})],
                    listeners :{
                        beforehide:this.doHide
                    },
                    buttons : [ {
                        text: "确定",ref : "../saveBtn",scope:this,
                            handler : function() {
                                var selData = this.selData;
                                var oldData = this.oldData;
                                //卡券ID
                                var voucher_id=Km.Voucher.View.Running.voucherGrid.getSelectionModel().getSelected().data.voucher_id;
                                var condition = {'selData':selData,"oldData":oldData,"voucher_id":voucher_id};
                                Ext.Msg.show({
                                    title: '请等待', msg: '操作进行中，请稍后...',
                                    animEl: 'loading', icon: Ext.Msg.WARNING,
                                    closable: true, progress: true, progressText: '', width: 300
                                });
                                ExtServiceVouchergoods.updateLinkGoods(condition,function(provider, response) {
                                    if (response.result.success==true) {
                                        var msg = "操作成功！";
                                        if(response.result.del){
                                            msg += "<font color=red>取消</font>了<font color=red>"+response.result.del+"</font>件关联货品,";
                                        }
                                        if(response.result.add){
                                            msg += "<font color=green>添加</font>了<font color=green>"+response.result.add+"</font>件关联货品";
                                        }
                                        Ext.Msg.alert('提示', msg);
                                    } else {
                                        Km.Voucher.Store.GoodsStore.removeAll();
                                        Ext.Msg.alert('提示', '操作失败！');
                                    }
                                    Km.Voucher.View.Running.selectGoodsWindow.hideWindow();
                                    Km.Voucher.View.Running.voucherGrid.doSelectVoucher();
                                });
                            }
                        }, {
                            text : "取 消",scope:this,
                            handler : function() {
                                this.hide();
                            }
                        }
                    ]
                }, config);
                Km.Voucher.View.SelectGoodsView.SelectGoodsWindow.superclass.constructor.call(this, config);
            },
            /**
            * 根据选择的货品,改变标题
            */
            changeTitle: function(){
                var title   = "选择关联货品 ";
                var selData = this.selData;
                var count   = this.objElCount(selData);
                if(count){
                    title += "（已经选择了<font color=green>"+count+"</font>件货品）";
                }else{
                    title += "（尚未选择任何货品）";
                }
                this.setTitle(title);
            },
            /**
            * 判断自定义对象元素个数
            */
            objElCount: function(obj){
                var count = 0;
                for(var n in obj){count++}
                return count;
            },
            /**
             * 确认取消图片处理
             * con:选择窗口
             */
            doHide: function (con) {
                //window初始化时会调用,此时con为null
                if(con){
                    Ext.MessageBox.show({
                        title:'提示',msg:'确定要取消么?<br /><font color=red>(所做操作将不会保存!)</font>',buttons:Ext.MessageBox.YESNO,icon:Ext.MessageBox.QUESTION,
                        params:{con:con},
                        fn:function(btn,text,opt) {
                            if(btn=='yes') {
                                con.hideWindow();
                            }
                        }
                    });
                    return false;
                }
            },
            /**
             * 隐藏窗口
             */
            hideWindow: function () {
                //移除beforehide事件，为了防止hide时进入死循环
                this.un('beforehide',this.doHide);
                this.hide();
                this.addListener('beforehide',this.doHide);
            }
        }),
        /**
        * 关联货品Grid
        */
        SelectGoodsGrid:Ext.extend(Ext.grid.GridPanel,{
            constructor : function(config) {
                config = Ext.apply({
                    /**
                    * 查询条件
                    */
                    filter: null,voucher_id: null,
                    trackMouseOver: true,enableColumnMove: true,columnLines: true,stripeRows: true,headerAsText: false,
                    loadMask : {
                        msg : '加载数据中，请稍候...'
                    },
                    defaults:{
                        autoScroll : true
                    },
                    store : Km.Voucher.Store.GoodsStore,
                    sm : this.sm,
                    cm : new Ext.grid.ColumnModel({
                        defaults:{width:80,sortable : true},
                        columns : [
                            this.sm,
                            {header : '货品标识',dataIndex : 'goods_id',hidden:true},
                            {header : '货品名称',dataIndex : 'goods_name',width:260},
                            {header : '货品分类',dataIndex : 'ptype_name',width:120},
                            {header : '货品编号',dataIndex : 'goods_code',width:140},
                            {header : '市场价',dataIndex : 'market_price'},
                            {header : '销售价',dataIndex : 'price'},
                            {header : '库存',dataIndex : 'num'},
                            {header : '货品状态',dataIndex : 'isUp',renderer:function(value){if (value == true) {return "<font color=green>上架中</font>";}else{return "<font color=red>已下架</font>";}}}
                        ]
                    }),
                    tbar: {
                        xtype : 'container',layout : 'anchor',
                        height : 27,style:'font-size:14px',
                        defaults : {
                            height : 27,anchor : '100%'
                        },
                        items : [
                            new Ext.Toolbar({
                                enableOverflow: true,width : 80,ref:'menus',
                                    defaults : {
                                    xtype : 'textfield',
                                    listeners : {
                                        specialkey : function(field, e) {
                                            if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectGoods();
                                        }
                                    }
                                },
                                items : [
                                    {text: '全部',ref:'../../isSelect',xtype:'tbsplit',iconCls : 'icon-view',enableToggle: true,
                                        toggleHandler:function(item, checked){
                                            if (checked==true){
                                                Km.Voucher.View.Running.selectGoodsWindow.selectGoodsGrid.topToolbar.menus.select.setChecked(true);
                                            }else{
                                                Km.Voucher.View.Running.selectGoodsWindow.selectGoodsGrid.topToolbar.menus.all.setChecked(true);
                                            }
                                        },
                                        menu: {
                                            items: [
                                                {text: '全部',checked: true,group: 'isSelect',ref:'../../all',
                                                    checkHandler: function(item, checked){
                                                        var selGoodsGrid = Km.Voucher.View.Running.selectGoodsWindow.selectGoodsGrid;
                                                        if (checked){
                                                            selGoodsGrid.isSelect.setText(item.text);
                                                            selGoodsGrid.filter.selectType=0;
                                                        }
                                                        selGoodsGrid.doSelectGoods();
                                                    }
                                                },
                                                {text: '未选择',checked: false,group: 'isSelect',ref:'../../unselect',
                                                    checkHandler: function(item, checked){
                                                        var selGoodsGrid = Km.Voucher.View.Running.selectGoodsWindow.selectGoodsGrid;
                                                        if (checked){
                                                            selGoodsGrid.isSelect.setText(item.text);
                                                            selGoodsGrid.filter.selectType=2;
                                                        }
                                                        selGoodsGrid.doSelectGoods();
                                                    }
                                                },
                                                {text: '已选择',checked: false,group: 'isSelect',ref:'../../select',
                                                    checkHandler: function(item, checked){
                                                        var selGoodsGrid = Km.Voucher.View.Running.selectGoodsWindow.selectGoodsGrid;
                                                        if (checked){
                                                            selGoodsGrid.isSelect.setText(item.text);
                                                            selGoodsGrid.filter.selectType=1;
                                                        }
                                                        selGoodsGrid.doSelectGoods();
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    '货品名称','&nbsp;&nbsp;',{ref: '../goods_name'},'&nbsp;&nbsp;',
                                    {
                                        xtype : 'button',text : '查询',scope: this,
                                        handler : function() {
                                            this.doSelectGoods();
                                        }
                                    },
                                    {
                                        xtype : 'button',text : '重置',scope: this,
                                        handler : function() {
                                            this.topToolbar.goods_name.setValue("");
                                            this.doSelectGoods();
                                        }
                                    },
                                    {xtype:'displayfield',id:'selbuttontext',value:'',width:200}
                                ]
                            })
                        ]
                    },
                    bbar: new Ext.PagingToolbar({
                        pageSize: Km.Voucher.Config.PageSize,
                        store: Km.Voucher.Store.GoodsStore,
                        scope:this,autoShow:true,displayInfo: true,
                        displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                        emptyMsg: "无显示数据",
                        items: [
                            {xtype:'label', text: '每页显示'},
                            {xtype:'numberfield', value:Km.Voucher.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank:false,
                                listeners:{
                                    change:function(Field, newValue, oldValue){
                                        var num = parseInt(newValue);
                                        if (isNaN(num) || !num || num<1){
                                            num = Km.Voucher.Config.PageSize;
                                            Field.setValue(num);
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Voucher.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectGoods();
                                    },
                                    specialKey :function(field,e){
                                        if (e.getKey() == Ext.EventObject.ENTER){
                                            var num = parseInt(field.getValue());
                                            if (isNaN(num) || !num || num<1){
                                                num = Km.Voucher.Config.PageSize;
                                            }
                                            this.ownerCt.pageSize= num;
                                            Km.Voucher.Config.PageSize = num;
                                            this.ownerCt.ownerCt.doSelectGoods();
                                        }
                                    }
                                }
                            },
                            {xtype:'label', text: '个'}
                        ]
                    })
                }, config);
                Km.Voucher.Store.GoodsStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceVouchergoods.queryPageSelGoods}
                });
                Km.Voucher.View.SelectGoodsView.SelectGoodsGrid.superclass.constructor.call(this, config);
            },
            /**
            * SelectionModel
            */
            sm : new Ext.grid.CheckboxSelectionModel({
                listeners : {
                    selectionchange:function(sm) {
                        Km.Voucher.View.Running.selectGoodsWindow.changeTitle();
                        Km.Voucher.View.Running.selectGoodsWindow.selectGoodsGrid.changeFilter();
                    },
                    rowselect: function(sm, rowIndex, record) {
                        var selGoodsWin  = Km.Voucher.View.Running.selectGoodsWindow;
                        var selData      = selGoodsWin.selData;
                        var oldData      = selGoodsWin.oldData;
                        var goods_id     = record.data.goods_id;
                        //添加该货品ID
                        selData[goods_id] = true;
                        //判断是否是已关联的货品
                        if(oldData[goods_id]){
                            oldData[goods_id].active = true;
                        }
                    },
                    rowdeselect: function(sm, rowIndex, record) {
                        var selGoodsWin  = Km.Voucher.View.Running.selectGoodsWindow;
                        var selData      = selGoodsWin.selData;
                        var oldData      = selGoodsWin.oldData;
                        var goods_id     = record.data.goods_id;
                        //删除该货品ID
                        delete selData[goods_id];
                        //判断是否是已关联的货品
                        if(oldData[goods_id]){
                            oldData[goods_id].active = false;
                        }
                    }
                }
            }),
            /**
            * 查询
            */
            doSelectGoods : function() {
                if (this.topToolbar){
                    var voucher_id=this.voucher_id;//已经选中的货品
                    if (!this.filter.selectType)this.filter.selectType=0;
                    var goods_name = this.topToolbar.goods_name.getValue();
                    this.filter.goods_name = goods_name;
                }
                var condition = {'start':0,'limit':Km.Voucher.Config.PageSize};
                Ext.apply(condition,this.filter);
                ExtServiceVouchergoods.queryPageSelGoods(condition,function(provider, response) {
                    if (response.result&&response.result.data) {
                        var result       = new Array();
                        result['data']     =response.result.data;
                        result['totalCount'] =response.result.totalCount;
                        Km.Voucher.Store.GoodsStore.loadData(result);
                    } else {
                        Km.Voucher.Store.GoodsStore.removeAll();
                        Ext.Msg.alert('提示', '无符合条件的货品！');
                    }
                });
            },
            /**
            * 修改查询条件
            */
            changeFilter: function(){
                var selData = Km.Voucher.View.Running.selectGoodsWindow.selData;
                var selArr  = new Array();
                for(var x in selData){
                    selArr.push(x);
                }
                this.filter.selgoods = selArr.join(",");
            }
        })
    },
    /**
    * 窗口：批量上传票卡券
    */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量上传票卡券',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
							emptyText: '请上传票卡券Excel文件',buttonText: '',
							accept:'application/vnd.ms-excel',
							buttonCfg: {iconCls: 'upload-icon'}
						},{
                            name:'voucher_id',xtype:"hidden",ref:'voucher_id'
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
                            this.uploadForm.voucher_id.setValue(Km.Voucher.Config.Voucher_ID);
							if (this.uploadForm.getForm().isValid()) {
								this.uploadForm.getForm().submit({
                                    url:'index.php?go=admin.upload.importVoucheritems',
                                    waitTitle:"请稍候",
                                    waitMsg:"正在提交表单数据，请稍候",
									url : 'index.php?go=admin.upload.uploadVoucheritems',
									success : function(form, response) {
                                        var data = response.result.data;
                                        var succ = data.succcount;//上传succ计数
                                        var repeat = data.repeatcount;//key值重复
                                        var emptyc = data.emptycount;//字段为空
                                        var msg = "上传成功!共生成<font color=green>"+succ+"</font>条票卡券!<br />";
                                        if(repeat){
                                            var rstr = data.repeatstr;//重复的key
                                            msg += "<br />票卡券号码为:<font color=red style='word-wrap: break-word;'>"+rstr+"</font>的已经存在,总计<font color=red>"+repeat+"</font>条!<br />";
                                        }
                                        if(emptyc){
                                            msg += "<br />共有<font color=red>"+emptyc+"</font>条记录的卡号或者密码为空!";
                                        }
                                        Ext.Msg.show({
                                          title: '提示信息',
                                          msg: msg,
                                          width: 300,
                                          buttons: Ext.Msg.OK,
                                        });
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Voucher.View.Running.voucherGrid.doSelectVoucher();
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
					},{
                        text : '下载导入模板',
                        scope:this,
                        handler : function() {
                            ExtServiceVoucheritems.exportEx('voucheritems.xls',function(provider, response) {
                                 window.open(response.result.data);
                            });
                            this.hide();
                        }
                    }]
				}, config);
			Km.Voucher.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
    /**
    * View:票卡券表显示组件
    */
    VoucheritemsView:{
        /**
         * 视图：票卡券表列表
         */
        Grid:Ext.extend(Ext.grid.GridPanel, {
          constructor : function(config) {
            config = Ext.apply({
              /**
               * 查询条件
               */
              filter:null,
              store : Km.Voucher.Store.VoucheritemsStore,
              frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
              loadMask : {
                msg : '加载数据中，请稍候...'
              },
              stripeRows : true,headerAsText : false,
              defaults : {
                autoScroll : true
              },
              cm : new Ext.grid.ColumnModel({
                defaults:{
                  width:100,sortable : true
                },
                columns : [
                    {header : '标识',dataIndex : 'voucheritems_id',hidden:true},
                    {header : '票卡券类型',dataIndex : 'voucher_id',hidden:true},
                    {header : '票卡券号码',dataIndex : 'vi_key',width:200},
                    {header : '兑换状态',dataIndex : 'isExchange',renderer:function(value){if (value == true) {return "<font color=green>已兑换</font>";}else{return "<font>未兑换</font>";}}}
                ]
              }),
              tbar : {
                xtype : 'container',layout : 'anchor',height : 27,style:'font-size:14px',
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
                          if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectVoucheritems();
                        }
                      }
                    },
                    items : [
                      '票卡券号码:',"&nbsp;&nbsp;",{ref: '../vi_key',width:200},"&nbsp;&nbsp;",
                      //'手机号码:',"&nbsp;&nbsp;",{ref: '../Voucheritemsphone_name',width:200},"&nbsp;&nbsp;",
                      {
                        xtype : 'button',text : '查询',scope: this,
                        handler : function() {
                          this.doSelectVoucheritems();
                        }
                      },
                      {
                        xtype : 'button',text : '重置',scope: this,
                        handler : function() {
                          //this.topToolbar.Voucheritemsphone_name.setValue("");
                          this.topToolbar.vi_key.setValue("");
                          this.filter={};
                          this.doSelectVoucheritems();
                        }
                      }]
                  })
                ]
              },
              bbar: new Ext.PagingToolbar({
                pageSize: Km.Voucher.Config.PageSize,
                store: Km.Voucher.Store.VoucheritemsStore,
                scope:this,autoShow:true,displayInfo: true,
                displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                emptyMsg: "无显示数据",
                listeners:{
                  change:function(thisbar,pagedata){
						if (Km.Voucher.Viewport){
							if (Km.Voucher.Config.View.IsShow==1){
								Km.Voucher.View.IsSelectView=1;
							}
							this.ownerCt.hideVoucher();
							Km.Voucher.Config.View.IsShow=0;
						}
                  }
                },
                items: [
                  {xtype:'label', text: '每页显示'},
                  {xtype:'numberfield', value:Km.Voucher.Config.PageSize,minValue:1,width:35,
                    style:'text-align:center',allowBlank: false,
                    listeners:
                    {
                      change:function(Field, newValue, oldValue){
                        var num = parseInt(newValue);
                        if (isNaN(num) || !num || num<1)
                        {
                          num = Km.Voucher.Config.PageSize;
                          Field.setValue(num);
                        }
                        this.ownerCt.pageSize= num;
                        Km.Voucher.Config.PageSize = num;
                        this.ownerCt.ownerCt.doSelectVoucheritems();
                      },
                      specialKey :function(field,e){
                        if (e.getKey() == Ext.EventObject.ENTER){
                          var num = parseInt(field.getValue());
                          if (isNaN(num) || !num || num<1)
                          {
                            num = Km.Voucher.Config.PageSize;
                          }
                          this.ownerCt.pageSize= num;
                          Km.Voucher.Config.PageSize = num;
                          this.ownerCt.ownerCt.doSelectVoucheritems();
                        }
                      }
                    }
                  },
                  {xtype:'label', text: '个'}
                ]
              })
            }, config);
            Km.Voucher.Store.VoucheritemsStore.proxy=new Ext.data.DirectProxy({
                api: {read:ExtServiceVoucheritems.queryPageVoucheritems}
            });
            Km.Voucher.View.Grid.superclass.constructor.call(this, config);
          },
          /**
           * 是否绑定在本窗口上
           */
          onBindGrid:function(item, checked){
            if (checked){
               Km.Voucher.Config.View.IsFix=1;
            }else{
               Km.Voucher.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
              Km.Voucher.Config.View.IsShow=0;
              return ;
            }
            if (Km.Voucher.Config.View.IsShow==1){
               this.hideVoucheritems();
               Km.Voucher.Config.View.IsShow=0;
            }
            this.showVoucheritems();
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
           * 查询符合条件的票卡券表
           */
          doSelectVoucheritems : function() {
            if (this.topToolbar){
              var coupon_data = Km.Voucher.View.Running.voucherGrid.getSelectionModel().getSelected().data;
              var voucher_id = coupon_data.voucher_id;
              var vi_key = this.topToolbar.vi_key.getValue();
              this.filter   ={'voucher_id':voucher_id,'vi_key':vi_key};
            }
            var condition = {'start':0,'limit':Km.Voucher.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceVoucheritems.queryPageVoucheritems(condition,function(provider, response) {
              if (response.result&&response.result.data) {
                var result       = new Array();
                result['data']     =response.result.data;
                result['totalCount'] =response.result.totalCount;
                Km.Voucher.Store.VoucheritemsStore.loadData(result);
              } else {
                Km.Voucher.Store.VoucheritemsStore.removeAll();
                Ext.Msg.alert('提示', '无符合条件的票卡券记录！');
              }
            });
          },
          /**
           * 显示票卡券表视图
           * 显示票卡券表的视图相对票卡券表列表Grid的位置
           * 1:上方,2:下方,0:隐藏。
           */
          onUpDown:function(viewDirection){
            Km.Voucher.Config.View.Direction=viewDirection;
            switch(viewDirection){
              case 1:
                this.ownerCt.north.add(Km.Voucher.View.Running.viewTabs);
                break;
              case 2:
                this.ownerCt.south.add(Km.Voucher.View.Running.viewTabs);
                break;
              case 3:
                this.ownerCt.west.add(Km.Voucher.View.Running.viewTabs);
                break;
              case 4:
                this.ownerCt.east.add(Km.Voucher.View.Running.viewTabs);
                break;
            }
            Km.Voucher.Cookie.set('View.Direction',Km.Voucher.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
              if ((Km.Voucher.Config.View.IsFix==0)&&(Km.Voucher.Config.View.IsShow==1)){
                this.showVoucheritems();
              }
              Km.Voucher.Config.View.IsFix=1;
              Km.Voucher.View.Running.voucheritemsGrid.tvpView.menu.mBind.setChecked(true,true);
              Km.Voucher.Config.View.IsShow=0;
              this.showVoucheritems();
            }
          }
        })
  },
    /**
    * View:票卡券兑换货品表显示组件
    */
    VouchergoodsView:{
        /**
        * 视图：票卡券兑换商品表列表
        */
        Grid:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    /**
                    * 查询条件
                    */
                    filter:null,
                    store : Km.Voucher.Store.vouchergoodsStore,
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {
                        autoScroll : true
                    },
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                          width:100,sortable : true
                        },
                        columns : [
                            {header : '标识',dataIndex : 'vouchergoods_id',hidden:true},
                            {header : '货品名称',dataIndex : 'goods_name',width:300},
                            {header : '货品编号',dataIndex : 'goods_code',width:160},
                            {header : '货品状态',dataIndex : 'isUp',renderer:function(value){if (value == true) {return "<font color=green>上架中</font>";}else{return "<font color=red>已下架</font>";}}}
                        ]
                    })
                }, config);
                //初始化显示票卡券表列表
                Km.Voucher.Store.vouchergoodsStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceVouchergoods.queryPageVouchergoods}
                });
                Km.Voucher.View.Grid.superclass.constructor.call(this, config);
            },
            /**
            * 是否绑定在本窗口上
            */
            onBindGrid:function(item, checked){
                if (checked){
                   Km.Voucher.Config.View.IsFix=1;
                }else{
                   Km.Voucher.Config.View.IsFix=0;
                }
                if (this.getSelectionModel().getSelected()==null){
                  Km.Voucher.Config.View.IsShow=0;
                  return ;
                }
                if (Km.Voucher.Config.View.IsShow==1){
                   this.hideVouchergoods();
                   Km.Voucher.Config.View.IsShow=0;
                }
                this.showVouchergoods();
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
            * 查询符合条件的票卡券表
            * @param: bool flag //flag为true时,call selgoodshandler()
            */
            doSelectVouchergoods : function() {
                var coupon_data = Km.Voucher.View.Running.voucherGrid.getSelectionModel().getSelected().data;
                var voucher_id = coupon_data.voucher_id;
                this.filter   ={'voucher_id':voucher_id};
                var condition = {'start':0,'limit':Km.Voucher.Config.PageSize};
                Ext.apply(condition,this.filter);
                ExtServiceVouchergoods.queryPageVouchergoods(condition,function(provider, response) {
                    if (response.result&&response.result.data) {
                        var result       = new Array();
                        result['data']     =response.result.data;
                        result['totalCount'] =response.result.totalCount;
                        Km.Voucher.Store.vouchergoodsStore.loadData(result);
                    } else {
                        Km.Voucher.Store.vouchergoodsStore.removeAll();
                        Ext.Msg.alert('提示', '无符合条件的可兑换货品！');
                    }
                });
            },
            /**
            * 显示票卡券表视图
            * 显示票卡券表的视图相对票卡券表列表Grid的位置
            * 1:上方,2:下方,0:隐藏。
            */
            onUpDown:function(viewDirection){
                Km.Voucher.Config.View.Direction=viewDirection;
                switch(viewDirection){
                    case 1:
                    this.ownerCt.north.add(Km.Voucher.View.Running.viewTabs);
                    break;
                    case 2:
                    this.ownerCt.south.add(Km.Voucher.View.Running.viewTabs);
                    break;
                    case 3:
                    this.ownerCt.west.add(Km.Voucher.View.Running.viewTabs);
                    break;
                    case 4:
                    this.ownerCt.east.add(Km.Voucher.View.Running.viewTabs);
                    break;
                }
                Km.Voucher.Cookie.set('View.Direction',Km.Voucher.Config.View.Direction);
                if (this.getSelectionModel().getSelected()!=null){
                    if ((Km.Voucher.Config.View.IsFix==0)&&(Km.Voucher.Config.View.IsShow==1)){
                        this.showVouchergoods();
                    }
                    Km.Voucher.Config.View.IsFix=1;
                    Km.Voucher.View.Running.vouchergoodsGrid.tvpView.menu.mBind.setChecked(true,true);
                    Km.Voucher.Config.View.IsShow=0;
                    this.showVouchergoods();
                }
            }
        })
    },
	/**
	 * 视图：票卡券列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Voucher.Store.voucherStore,
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
                        {header : '标识',dataIndex : 'voucher_id',ref:'.../voucher_id',hidden:true},
                        {header : '票卡券类型名称',dataIndex : 'voucher_name'},
                        {header : '票卡券总数',dataIndex : 'voucher_num'},
                        {header : '开始时间',dataIndex : 'begin_time',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i:s'),width:150},
                        {header : '结束时间',dataIndex : 'end_time',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i:s'),width:150},
                        {header : '是否有效',dataIndex : 'isValid',renderer:function(value){if (value == true) {return "是";}else{return "否";}}}
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
										if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectVoucher();
									}
								}
							},
							items : [
                                '票卡券类型名称:',"&nbsp;&nbsp;",{ref: '../voucher_name',width:200},"&nbsp;&nbsp;",
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectVoucher();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
                                        this.topToolbar.voucher_name.setValue("");
										this.filter={};
										this.doSelectVoucher();
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
									text : '添加票卡券类型',iconCls : 'icon-add',
									handler : function() {
										this.addVoucher();
									}
								},'-',{
									text : '修改票卡券类型',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateVoucher();
									}
								},'-',{
									text : '删除票卡券类型', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteVoucher();
									}
								},'-',{
									xtype:'tbsplit',text: '导入', ref: '../../btnImport', iconCls : 'icon-import',disabled : true,
									handler : function() {
										this.importVoucher();
									},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'批量导入票卡券',iconCls : 'icon-import',scope:this,handler:function(){this.importVoucher()}}
										]}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportVoucher();
									}
								}
                                ,'-',{
									xtype:'tbsplit',text: '查看票卡券类型', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showVoucher()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideVoucher();Km.Voucher.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Voucher.Cookie.set('View.IsFix',Km.Voucher.Config.View.IsFix);}}
										]}
								},'-',{
                                    text : '关联兑换货品',ref:'../../voucher',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        if(Km.Voucher.View.Running.selectGoodsWindow==null || Km.Voucher.View.Running.selectGoodsWindow.hidden){
                                            this.showselGoods();
                                        }else{
                                            this.hideselGoods();
                                        }
                                    }
                                },'-'
                            ]
                        }
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Voucher.Config.PageSize,
					store: Km.Voucher.Store.voucherStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					listeners:{
						change:function(thisbar,pagedata){
							if (Km.Voucher.Viewport){
								if (Km.Voucher.Config.View.IsShow==1){
									Km.Voucher.View.IsSelectView=1;
								}
								this.ownerCt.hideVoucher();
								Km.Voucher.Config.View.IsShow=0;
							}
						}
					},
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Voucher.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Voucher.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Voucher.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectVoucher();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Voucher.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Voucher.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectVoucher();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示票卡券列表
			this.doSelectVoucher();
			Km.Voucher.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的票卡券信息Tab页
			Km.Voucher.View.Running.viewTabs=new Km.Voucher.View.VoucherView.Tabs();
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
                    this.grid.btnImport.setDisabled(sm.getCount() != 1);
					this.grid.voucher.setDisabled(sm.getCount() != 1);
				},
				rowselect: function(sm, rowIndex, record) {
                    Km.Voucher.Config.Voucher_ID=record.data.voucher_id;
					this.grid.updateViewVoucher();
					if (sm.getCount() != 1){
						this.grid.hideVoucher();
						Km.Voucher.Config.View.IsShow=0;
					}else{
						if (Km.Voucher.View.IsSelectView==1){
							Km.Voucher.View.IsSelectView=0;
							this.grid.showVoucher();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Voucher.Config.View.IsShow==1){
							Km.Voucher.View.IsSelectView=1;
						}
						this.grid.hideVoucher();
						Km.Voucher.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Voucher.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showVoucher();
				this.tvpView.toggle(true);
			}else{
				this.hideVoucher();
				Km.Voucher.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Voucher.Config.View.IsFix=1;
			}else{
			   Km.Voucher.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Voucher.Config.View.IsShow=0;
				return ;
			}
			if (Km.Voucher.Config.View.IsShow==1){
			   this.hideVoucher();
			   Km.Voucher.Config.View.IsShow=0;
			}
			this.showVoucher();
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
		 * 查询符合条件的票卡券
		 */
		doSelectVoucher : function() {
			if (this.topToolbar){
                var voucher_name = this.topToolbar.voucher_name.getValue();
                this.filter   ={'voucher_name':voucher_name};
			}
			var condition = {'start':0,'limit':Km.Voucher.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceVoucher.queryPageVoucher(condition,function(provider, response) {
				if (response.result&&response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Voucher.Store.voucherStore.loadData(result);
				} else {
					Km.Voucher.Store.voucherStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的票卡券类型！');
				}
			});
		},
		/**
		 * 显示票卡券视图
		 * 显示票卡券的视图相对票卡券列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Voucher.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Voucher.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Voucher.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Voucher.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Voucher.View.Running.viewTabs);
					break;
			}
			Km.Voucher.Cookie.set('View.Direction',Km.Voucher.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Voucher.Config.View.IsFix==0)&&(Km.Voucher.Config.View.IsShow==1)){
					this.showVoucher();
				}
				Km.Voucher.Config.View.IsFix=1;
				Km.Voucher.View.Running.voucherGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Voucher.Config.View.IsShow=0;
				this.showVoucher();
			}
		},
		/**
		 * 显示票卡券
		 */
		showVoucher : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择票卡券类型！');
				Km.Voucher.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Voucher.Config.View.IsFix==0){
				if (Km.Voucher.View.Running.view_window==null){
					Km.Voucher.View.Running.view_window=new Km.Voucher.View.VoucherView.Window();
				}
				if (Km.Voucher.View.Running.view_window.hidden){
					Km.Voucher.View.Running.view_window.show();
					Km.Voucher.View.Running.view_window.winTabs.hideTabStripItem(Km.Voucher.View.Running.view_window.winTabs.tabFix);
					Km.Voucher.View.Running.voucheritemsGrid.doSelectVoucheritems();
                    Km.Voucher.View.Running.vouchergoodsGrid.doSelectVouchergoods();
                    this.updateViewVoucher();
					this.tvpView.toggle(true);
					Km.Voucher.Config.View.IsShow=1;
				}else{
					this.hideVoucher();
					Km.Voucher.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Voucher.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Voucher.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Voucher.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Voucher.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Voucher.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Voucher.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Voucher.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Voucher.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Voucher.View.Running.viewTabs);
					}
					break;
			}
			this.hideVoucher();
			if (Km.Voucher.Config.View.IsShow==0){
				Km.Voucher.View.Running.viewTabs.enableCollapse();
				switch(Km.Voucher.Config.View.Direction){
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
                Km.Voucher.View.Running.voucheritemsGrid.doSelectVoucheritems();
                Km.Voucher.View.Running.vouchergoodsGrid.doSelectVouchergoods();
				this.updateViewVoucher();
				this.tvpView.toggle(true);
				Km.Voucher.Config.View.IsShow=1;
			}else{
				Km.Voucher.Config.View.IsShow=0;
			}
			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏票卡券
		 */
		hideVoucher : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Voucher.View.Running.view_window!=null){
				Km.Voucher.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前票卡券显示信息
		 */
		updateViewVoucher : function() {
			if (Km.Voucher.View.Running.view_window!=null){
				Km.Voucher.View.Running.view_window.winTabs.tabVoucherDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Voucher.View.Running.viewTabs.tabVoucherDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建票卡券
		 */
		addVoucher : function() {
			if (Km.Voucher.View.Running.edit_window==null){
				Km.Voucher.View.Running.edit_window=new Km.Voucher.View.EditWindow();
			}
			Km.Voucher.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Voucher.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Voucher.View.Running.edit_window.setTitle('添加票卡券类型');
			Km.Voucher.View.Running.edit_window.savetype=0;
			Km.Voucher.View.Running.edit_window.voucher_id.setValue("");

			Km.Voucher.View.Running.edit_window.show();
			Km.Voucher.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑票卡券时先获得选中的票卡券信息
		 */
		updateVoucher : function() {
			if (Km.Voucher.View.Running.edit_window==null){
				Km.Voucher.View.Running.edit_window=new Km.Voucher.View.EditWindow();
			}
			Km.Voucher.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Voucher.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Voucher.View.Running.edit_window.setTitle('修改票卡券类型');
			Km.Voucher.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
			Km.Voucher.View.Running.edit_window.savetype=1;

			Km.Voucher.View.Running.edit_window.show();
			Km.Voucher.View.Running.edit_window.maximize();
		},
		/**
		 * 删除票卡券
		 */
		deleteVoucher : function() {
			Ext.Msg.confirm('提示', '<font color=red>确实要删除所选的票卡券类型吗?</font>', this.confirmDeleteVoucher,this);
		},
		/**
		 * 确认删除票卡券
		 */
		confirmDeleteVoucher : function(btn) {
			if (btn == 'yes') {
                var idArr = new Array();//需删除的卡券的ID数组
				var idStr = "";//需删除的卡券的ID字符串
				var selectedRows = this.getSelectionModel().getSelections();
				for (var i=0;i<selectedRows.length;i++) {
					idArr[i] = selectedRows[i].data.voucher_id;
				}
                idStr = idArr.join(",");
				ExtServiceVoucher.deleteByIds(idStr,function(provider, response) {
                    if (response.result.success==true) {
                        Ext.Msg.alert("提示", "删除成功！");
                    } else {
                        Ext.Msg.alert('提示', '操作失败！');
                    }
                    Km.Voucher.View.Running.voucherGrid.doSelectVoucher();
                });
			}
		},
		/**
		 * 导出票卡券
		 */
		exportVoucher : function() {
			ExtServiceVoucher.exportVoucher(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入票卡券
		 */
		importVoucher : function() {
			if (Km.Voucher.View.current_uploadWindow==null){
				Km.Voucher.View.current_uploadWindow=new Km.Voucher.View.UploadWindow();
			}
			Km.Voucher.View.current_uploadWindow.show();
		},
        /**
         * 显示选择商品
         */
        showselGoods:function(){
            if (Km.Voucher.View.Running.selectGoodsWindow==null){
                Km.Voucher.View.Running.selectGoodsWindow=new Km.Voucher.View.SelectGoodsView.SelectGoodsWindow();
            }
            //选中的卡券ID
            var voucher_id = Km.Voucher.View.Running.voucherGrid.getSelectionModel().getSelected().data.voucher_id;
            //关联货品ID组成的字符串
            var goodstr    = Km.Voucher.View.Running.voucherGrid.getSelectionModel().getSelected().data.goodstr;
            var selData    = {};
            var oldData    = {};
            if(goodstr){
                var goodsarr = goodstr.split(",");
                for(var i=0;i<goodsarr.length;i++){
                    selData[goodsarr[i]] = true;//ture为已存在的关联货品
                    oldData[goodsarr[i]] = {};
                    oldData[goodsarr[i]].active = true;
                }
            }
            var selGoodsWin     = Km.Voucher.View.Running.selectGoodsWindow;
            var selGoodsGrid    = selGoodsWin.selectGoodsGrid;
            selGoodsWin.selData = selData;
            selGoodsWin.oldData = oldData;
            selGoodsWin.changeTitle();//根据选择的货品,修改标题

            selGoodsGrid.voucher_id = voucher_id;
            selGoodsGrid.filter     = {selgoods:goodstr};
            selGoodsGrid.topToolbar.menus.all.setChecked(true);
            selGoodsGrid.isSelect.toggle(false);
            selGoodsGrid.topToolbar.goods_name.setValue("");
            Km.Voucher.Store.GoodsStore.removeAll();
            selGoodsGrid.doSelectGoods();
            selGoodsWin.show();
        },
        /**
         * 隐藏选择商品
         */
        hideselGoods:function(){
            if (Km.Voucher.View.Running.selectGoodsWindow!=null){
                Km.Voucher.View.Running.selectGoodsWindow.hide();
            }
        }
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Voucher.View.Running.voucherGrid=new Km.Voucher.View.Grid();
			if (Km.Voucher.Config.View.IsFix==0){
				Km.Voucher.View.Running.voucherGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Voucher.View.Running.voucherGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Voucher.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Voucher.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前票卡券Grid对象
		 */
		voucherGrid:null,
		/**
		 * 显示票卡券信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Voucher.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Voucher.Init();
	/**
	 * 票卡券票卡券数据模型获取数据Direct调用
	 */
	Km.Voucher.Store.voucherStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceVoucher.queryPageVoucher}
	});
	/**
	 * 票卡券页面布局
	 */
	Km.Voucher.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Voucher.View.Panel()]
	});
	Km.Voucher.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});