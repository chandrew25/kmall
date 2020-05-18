Ext.namespace("Kmall.Admin.Seckill");
Km = Kmall.Admin;
Km.Seckill={
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
             * 显示秒杀货品的视图相对秒杀货品列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示秒杀货品信息页(或者打开新窗口)
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
        if (Km.Seckill.Cookie.get('View.Direction')){
            Km.Seckill.Config.View.Direction=Km.Seckill.Cookie.get('View.Direction');
        }
        if (Km.Seckill.Cookie.get('View.IsFix')!=null){
            Km.Seckill.Config.View.IsFix=Km.Seckill.Cookie.get('View.IsFix');
        }
    }
};
/**
 * Model:数据模型
 */
Km.Seckill.Store = {
    /**
     * 秒杀货品
     */
    seckillStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'seckill_id',type: 'int'},
                {name: 'seckill_name',type: 'string'},
                {name: 'seckillproduct_id',type: 'int'},
                {name: 'product_id',type: 'int'},
                {name: 'product_name',type: 'string'},
                {name: 'product_code',type: 'string'},
                {name: 'goods_no',type: 'string'},
                {name: 'sec_num',type: 'int'},
                {name: 'limit_num',type: 'int'},
                {name: 'num',type: 'int'},
                {name: 'goods_id',type: 'int'},
                {name: 'isUp',type: 'string'},
                {name: 'goods_code',type: 'string'},
                {name: 'goods_name',type: 'string'},
                {name: 'price',type: 'float'},
                {name: 'jifen',type: 'int'},
                {name: 'bought_num',type: 'int'},
                {name: 'begin_datetime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'end_datetime',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Seckill.Config.PageSize;
                    Ext.apply(options.params, Km.Seckill.View.Running.seckillGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 秒杀拥有的商品
     */
    seckillproductStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'seckillproduct_id',type: 'int'},
                {name: 'seckill_id',type: 'int'},
                {name: 'seckill_name',type: 'string'},
                {name: 'product_id',type: 'string'},
                {name: 'sec_num',type: 'int'},
                {name: 'bought_num',type: 'int'},
                {name: 'limit_num',type: 'int'},
                {name: 'product_code',type: 'string'},
                {name: 'goods_no',type: 'string'},
                {name: 'isPackage',type: 'string'},
                {name: 'supplier_id',type: 'int'},
                {name: 'sp_name',type: 'string'},
                {name: 'sptype',type: 'string'},
                {name: 'sptypeShow',type: 'string'},
                {name: 'ptype_id',type: 'int'},
                {name: 'ptype_name',type: 'string'},
                {name: 'ptypeShowAll',type: 'string'},
                {name: 'ptype_key',type: 'string'},
                {name: 'product_name',type: 'string'},
                {name: 'brand_id',type: 'int'},
                {name: 'brand_name',type: 'string'},
                {name: 'msgleft',type: 'string'},
                {name: 'msgright',type: 'string'},
                {name: 'message',type: 'string'},
                {name: 'price',type: 'float'},
                {name: 'price_tag',type: 'string'},
                {name: 'market_price',type: 'float'},
                {name: 'cost',type: 'float'},
                {name: 'discount',type: 'string'},
                {name: 'specification',type: 'string'},
                {name: 'attr_key',type: 'string'},
                {name: 'image',type: 'string'},
                {name: 'image_large',type: 'string'},
                {name: 'unit',type: 'string'},
                {name: 'tag_types',type: 'string'},
                {name: 'market_jifen',type: 'int'},
                {name: 'jifen',type: 'int'},
                {name: 'scale',type: 'string'},
                {name: 'num',type: 'int'},
                {name: 'weight',type: 'float'},
                {name: 'low_alarm',type: 'int'},
                {name: 'in_price',type: 'float'},
                {name: 'recommend_price',type: 'float'},
                {name: 'good_price',type: 'float'},
                {name: 'intro',type: 'string'},
                {name: 'sales_count',type: 'int'},
                {name: 'click_count',type: 'int'},
                {name: 'sort_order',type: 'int'},
                {name: 'isShow',type: 'string'},
                {name: 'isUp',type: 'int'},
                {name: 'uptime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'downtime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'isRecommend',type: 'string'},
                {name: 'isMultiplespec',type: 'string'},
                {name: 'isGiveaway',type: 'string'},
                {name: 'country_id',type: 'int'},
                {name: 'country_name',type: 'string'}
            ]
        }),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Seckill.Config.PageSize;
                    Ext.apply(options.params, Km.Seckill.View.Running.seckillGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 商品
     */
    productStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'product_id',type: 'string'},
                {name: 'product_code',type: 'string'},
                {name: 'goods_no',type: 'string'},
                {name: 'isPackage',type: 'string'},
                {name: 'supplier_id',type: 'int'},
                {name: 'sp_name',type: 'string'},
                {name: 'sptype',type: 'string'},
                {name: 'sptypeShow',type: 'string'},
                {name: 'ptype_id',type: 'int'},
                {name: 'ptype_name',type: 'string'},
                {name: 'ptypeShowAll',type: 'string'},
                {name: 'ptype_key',type: 'string'},
                {name: 'product_name',type: 'string'},
                {name: 'brand_id',type: 'int'},
                {name: 'brand_name',type: 'string'},
                {name: 'msgleft',type: 'string'},
                {name: 'msgright',type: 'string'},
                {name: 'message',type: 'string'},
                {name: 'price',type: 'float'},
                {name: 'price_tag',type: 'string'},
                {name: 'market_price',type: 'float'},
                {name: 'cost',type: 'float'},
                {name: 'discount',type: 'string'},
                {name: 'specification',type: 'string'},
                {name: 'attr_key',type: 'string'},
                {name: 'image',type: 'string'},
                {name: 'image_large',type: 'string'},
                {name: 'unit',type: 'string'},
                {name: 'tag_types',type: 'string'},
                {name: 'market_jifen',type: 'int'},
                {name: 'jifen',type: 'int'},
                {name: 'scale',type: 'string'},
                {name: 'num',type: 'int'},
                {name: 'weight',type: 'float'},
                {name: 'low_alarm',type: 'int'},
                {name: 'in_price',type: 'float'},
                {name: 'recommend_price',type: 'float'},
                {name: 'good_price',type: 'float'},
                {name: 'intro',type: 'string'},
                {name: 'sales_count',type: 'int'},
                {name: 'click_count',type: 'int'},
                {name: 'sort_order',type: 'int'},
                {name: 'isShow',type: 'string'},
                {name: 'isUp',type: 'int'},
                {name: 'uptime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'downtime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'isRecommend',type: 'string'},
                {name: 'isMultiplespec',type: 'string'},
                {name: 'isGiveaway',type: 'string'},
                {name: 'country_id',type: 'int'},
                {name: 'country_name',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Seckill.Config.PageSize;
                    Ext.apply(options.params, Km.Seckill.View.Running.productGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 商品
     */
    productStoreForCombo:new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/product.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'products',
            autoLoad: true,
            totalProperty: 'totalCount',
            idProperty: 'product_id'
        }, [
            {name: 'product_id', mapping: 'product_id'},
            {name: 'product_name', mapping: 'product_name'},
            {name: 'product_code', mapping: 'product_code'},
            {name: 'price', mapping: 'price'},
            {name: 'jifen', mapping: 'jifen'},
            {name: 'num', mapping: 'num'}
        ])
    })
};
/**
 * View:秒杀货品显示组件
 */
Km.Seckill.View={
    /**
     * 编辑窗口：新建或者修改秒杀货品
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
                            {xtype: 'hidden',name : 'seckill_id',ref:'../seckill_id'},
                            {xtype: 'hidden',name : 'seckillproduct_id',ref:'../seckillproduct_id'},
                            {xtype: 'hidden',name : 'product_id',ref:'../product_id'},
                            {fieldLabel : '秒杀名称(<font color=red>*</font>)', xtype: 'textfield',name : 'seckill_name',ref:'../seckill_name',allowBlank: false},
                            {
                                 fieldLabel : '秒杀商品(<font color=red>*</font>)',xtype: 'combo',name : 'product_name',ref : '../product_name',
                                 store:Km.Seckill.Store.productStoreForCombo,emptyText: '请选择商杀货品',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Seckill.Config.PageSize,
                                 displayField:'product_name',grid:this,
                                 mode: 'remote',  allowBlank: false,editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                     '<tpl for="."><div class="search-item">',
                                         '<h3>{product_name} {product_code}</h3>',
                                     '</div></tpl>'
                                 ),
                                 listeners:{
                                     'beforequery': function(event){delete event.combo.lastQuery;}
                                 },
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        this.grid.product_id.setValue(record.data.product_id);
                                        this.grid.product_name.setValue(record.data.product_name);
                                        this.grid.price.setValue(record.data.price);
                                        this.grid.jifen.setValue(record.data.jifen);
                                        this.grid.sec_num.setValue(record.data.num);
                                        this.grid.limit_num.setValue(1);
                                        this.collapse();
                                     }
                                 }
                            },
                            {fieldLabel : '秒杀价(<font color=red>*</font>)',name : 'price',ref:'../price',xtype : 'numberfield',allowBlank: false},
                            {fieldLabel : '秒杀券',name : 'jifen',ref:'../jifen',xtype : 'numberfield'},
                            {fieldLabel : '秒杀库存',name : 'sec_num',ref:'../sec_num',xtype : 'numberfield'},
                            {fieldLabel : '秒杀限买数量', name : 'limit_num',ref:'../limit_num',xtype : 'numberfield'},
                            {fieldLabel : '开始时间(<font color=red>*</font>)',name : 'begin_datetime',allowBlank: false,xtype : 'datefield',format : "Y-m-d H:i:s"},
                            {fieldLabel : '结束时间(<font color=red>*</font>)',name : 'end_datetime',allowBlank: false,xtype : 'datefield',format : "Y-m-d H:i:s"}
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
                            this.editForm.api.submit=ExtServiceSeckill.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Seckill.View.Running.seckillGrid.doSelectSeckill();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, response) {
                                    Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceSeckill.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.Seckill.View.Running.seckillGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Seckill.View.Running.seckillGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Seckill.View.Running.seckillGrid.getSelectionModel().getSelected());

                    }
                }]
            }, config);
            Km.Seckill.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示秒杀货品详情
     */
    SeckillView:{
        /**
         * Tab页：容器包含显示与秒杀货品所有相关的信息
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
                                if (Km.Seckill.View.Running.seckillGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择秒杀货品！');
                                    return false;
                                }
                                Km.Seckill.Config.View.IsShow=1;
                                Km.Seckill.View.Running.seckillGrid.showSeckill();
                                Km.Seckill.View.Running.seckillGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Seckill.View.SeckillView.Tabs.superclass.constructor.call(this, config);
                Km.Seckill.View.Running.productGrid=new Km.Seckill.View.ProductView.Grid();
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Seckill.Config.View.Direction==1)||(Km.Seckill.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabSeckillDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">秒杀名称</td><td class="content">{seckill_name}</td></tr>',
                         '    <tr class="entry"><td class="head">开始时间</td><td class="content">{begin_datetime:date("Y-m-d H:i:s")}</td></tr>',
                         '    <tr class="entry"><td class="head">结束时间</td><td class="content">{end_datetime:date("Y-m-d H:i:s")}</td></tr>',
                         '</table>'
                     ]}
                );
                this.add(
                    {title: '商品',iconCls:'tabs',tabWidth:150,
                     items:[Km.Seckill.View.Running.productGrid]
                    }
                );
            }
        }),
        /**
         * 窗口:显示秒杀货品信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看秒杀货品",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Seckill.View.SeckillView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Seckill.Config.View.IsShow=0;
                            Km.Seckill.View.Running.seckillGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Seckill.View.Running.seckillGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增秒杀',scope:this,
                        handler : function() {Km.Seckill.View.Running.seckillGrid.addSeckill();}
                    },{
                        text: '修改秒杀',scope:this,
                        handler : function() {Km.Seckill.View.Running.seckillGrid.updateSeckill();}
                    }]
                }, config);
                Km.Seckill.View.SeckillView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 视图：商品列表
     */
    ProductView:{
        /**
         * 当前创建的商品编辑窗口
         */
        edit_window:null,
        /**
         * 编辑窗口：新建或者修改商品
         */
        EditWindow:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    /**
                     * 自定义类型:保存类型
                     * 0:保存窗口,1:修改窗口
                     */
                    savetype:0,closeAction : "hide",constrainHeader:true,maximizable: true,collapsible: true,
                    width : 450,height : 550,minWidth : 400,minHeight : 450,
                    layout : 'fit',plain : true,buttonAlign : 'center',
                    defaults : {autoScroll : true},
                    listeners:{
                        beforehide:function(){
                            this.editForm.getForm().reset();
                        },
                        afterrender:function(){
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
                                {xtype: 'hidden',name : 'seckillproduct_id',ref:'../seckillproduct_id'},
                                {xtype: 'hidden',name : 'product_id',ref:'../product_id'},
                                {fieldLabel : '秒杀名称', xtype: 'displayfield',name : 'seckill_name',ref:'../seckill_name'},
                                {
                                     fieldLabel : '秒杀商品(<font color=red>*</font>)',xtype: 'combo',name : 'product_name',ref : '../product_name',
                                     store:Km.Seckill.Store.productStoreForCombo,emptyText: '请选择秒杀货品',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width: 570, pageSize:Km.Seckill.Config.PageSize,
                                     displayField:'product_name',grid:this,
                                     mode: 'remote',  allowBlank: false,editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                         '<tpl for="."><div class="search-item">',
                                             '<h3>{product_name} {product_code}</h3>',
                                         '</div></tpl>'
                                     ),
                                     listeners:{
                                         'beforequery': function(event){delete event.combo.lastQuery;}
                                     },
                                     onSelect:function(record,index){
                                         if(this.fireEvent('beforeselect', this, record, index) !== false){
                                            this.grid.product_id.setValue(record.data.product_id);
                                            this.grid.product_name.setValue(record.data.product_name);
                                            this.grid.price.setValue(record.data.price);
                                            this.grid.jifen.setValue(record.data.jifen);
                                            this.grid.sec_num.setValue(record.data.num);
                                            this.grid.limit_num.setValue(1);
                                            this.collapse();
                                         }
                                     }
                                },
                                {fieldLabel : '秒杀库存', name : 'sec_num',ref:'../sec_num',xtype : 'numberfield'},
                                {fieldLabel : '秒杀限买数量', name : 'limit_num',ref:'../limit_num',xtype : 'numberfield'},
                                {fieldLabel : '秒杀价(<font color=red>*</font>)',name : 'price',ref:'../price',xtype : 'numberfield',allowBlank: false},
                                {fieldLabel : '秒杀券',name : 'jifen',ref:'../jifen',xtype : 'numberfield'},
                                {fieldLabel : '购买人数', xtype: 'numberfield',name : 'bought_num',ref:'../bought_num'},
                                {xtype: 'hidden',name : 'seckill_id',ref:'../seckill_id'}
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
                              this.editForm.api.submit=ExtServiceSeckillproduct.save;
                              this.editForm.getForm().submit({
                                  success : function(form, action) {
                                      Ext.Msg.alert("提示", "保存成功！");
                                      Km.Seckill.View.Running.productGrid.doSelectProduct();
                                      form.reset();
                                      editWindow.hide();
                                  },
                                  failure : function(form, response) {
                                      Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
                                  }
                              });

                            }else{
                              this.editForm.api.submit=ExtServiceSeckillproduct.update;
                              this.editForm.getForm().submit({
                                  success : function(form, action) {
                                      Ext.Msg.alert("提示", "修改成功！");
                                      Km.Seckill.View.Running.productGrid.doSelectProduct();
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
                            this.editForm.form.loadRecord(Km.Seckill.View.Running.productGrid.getSelectionModel().getSelected());
                        }
                    }]
                }, config);
                Km.Seckill.View.ProductView.EditWindow.superclass.constructor.call(this, config);
            }
        }),
        /**
         * 查询条件
         */
        filter:null,
        /**
         * 视图：商品列表
         */
        Grid:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Seckill.Store.seckillproductStore,sm : this.sm,
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {autoScroll : true},
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                            width:120,sortable : true
                        },
                        columns : [
                            this.sm,
                            {header : '标识',dataIndex : 'product_id',hidden:true},
                            {header : '商品名称',dataIndex : 'product_name'},
                            {header : '商品货号',dataIndex : 'product_code'},
                            {header : '货品内部编号',dataIndex : 'goods_no'},
                            {header : '秒杀价格',dataIndex : 'price'},
                            {header : '秒杀券',dataIndex : 'jifen'},
                            {header : '秒杀库存',dataIndex : 'sec_num'},
                            {header : '秒杀限买数量',dataIndex : 'limit_num'},
                            {header : '购买人数',dataIndex : 'bought_num'},
                            {header : '排序',dataIndex : 'sort_order'},
                            {header : '商品品牌',dataIndex : 'brand_name'}
                        ]
                    }),
                    tbar : {
                        xtype : 'container',layout : 'anchor',autoScroll : true,
                        height : 27,style:'font-size:14px',
                        defaults : {
                            height : 27,anchor : '100%',autoScroll : true,autoHeight : true
                        },
                        items : [
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
                                    },'-'
                                    ,{
                                        text : '添加秒杀商品',iconCls : 'icon-add',
                                        handler : function() {
                                            this.addProduct();
                                        }
                                    },'-'
                                    ,{
                                        text : '修改秒杀商品',iconCls : 'icon-add',
                                        handler : function() {
                                            this.updateProduct();
                                        }
                                    },'-',{
                                        text : '删除秒杀商品', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                        handler : function() {
                                            this.deleteProduct();
                                        }
                                    },'-'
                                ]}
                            )
                        ]
                    },
                    bbar: new Ext.PagingToolbar({
                        pageSize: Km.Seckill.Config.PageSize,
                        store: Km.Seckill.Store.seckillproductStore,scope:this,autoShow:true,displayInfo: true,
                        displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',emptyMsg: "无显示数据",
                        items: [
                            {xtype:'label', text: '每页显示'},
                            {xtype:'numberfield', value:Km.Seckill.Config.PageSize,minValue:1,width:35,style:'text-align:center',allowBlank: false,
                                listeners:
                                {
                                    change:function(Field, newValue, oldValue){
                                        var num = parseInt(newValue);
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Seckill.Config.PageSize;
                                            Field.setValue(num);
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Seckill.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectProduct();
                                    },
                                    specialKey :function(field,e){
                                        if (e.getKey() == Ext.EventObject.ENTER){
                                            var num = parseInt(field.getValue());
                                            if (isNaN(num) || !num || num<1)num = Km.Seckill.Config.PageSize;
                                            this.ownerCt.pageSize= num;
                                            Km.Seckill.Config.PageSize = num;
                                            this.ownerCt.ownerCt.doSelectProduct();
                                        }
                                    }
                                }
                            },{xtype:'label', text: '个'}
                        ]
                    })
                }, config);
                /**
                 * 商品数据模型获取数据Direct调用
                 */
                Km.Seckill.Store.seckillproductStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceSeckillproduct.queryPageSeckillproduct}
                });
                Km.Seckill.View.ProductView.Grid.superclass.constructor.call(this, config);
            },
            /**
             * 行选择器
             */
            sm : new Ext.grid.CheckboxSelectionModel({
                listeners : {
                    selectionchange:function(sm) {
                        // 判断删除和更新按钮是否可以激活
                        this.grid.btnRemove.setDisabled(sm.getCount() < 1);
                    }
                }
            }),
            /**
             * 查询符合条件的商品
             */
            doSelectProduct : function() {
                if (Km.Seckill.View.Running.seckillGrid&&Km.Seckill.View.Running.seckillGrid.getSelectionModel().getSelected()){
                    var seckill_id = Km.Seckill.View.Running.seckillGrid.getSelectionModel().getSelected().data.seckill_id;
                    var condition = {'seckill_id':seckill_id,'start':0,'limit':Km.Seckill.Config.PageSize};
                    this.filter      = {'seckill_id':seckill_id};
                    ExtServiceSeckillproduct.queryPageSeckillproduct(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       = response.result.data;
                                result['totalCount'] = response.result.totalCount;
                                Km.Seckill.Store.seckillproductStore.loadData(result);
                            } else {
                                Km.Seckill.Store.seckillproductStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的商品！');
                            }

                            if (Km.Seckill.Store.seckillproductStore.getTotalCount()>Km.Seckill.Config.PageSize){
                                 Km.Seckill.View.Running.productGrid.bottomToolbar.show();
                            }else{
                                 Km.Seckill.View.Running.productGrid.bottomToolbar.hide();
                            }
                            Km.Seckill.View.Running.seckillGrid.ownerCt.doLayout();
                        }
                    });
                }
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
             * 新建商品
             */
            addProduct : function(){
                if (Km.Seckill.View.ProductView.edit_window==null){
                    Km.Seckill.View.ProductView.edit_window=new Km.Seckill.View.ProductView.EditWindow();
                }
                Km.Seckill.View.ProductView.edit_window.resetBtn.setVisible(false);
                Km.Seckill.View.ProductView.edit_window.saveBtn.setText('保 存');
                Km.Seckill.View.ProductView.edit_window.setTitle('添加商品');
                Km.Seckill.View.ProductView.edit_window.savetype=0;
                Km.Seckill.View.ProductView.edit_window.product_id.setValue("");
                var seckill = Km.Seckill.View.Running.seckillGrid.getSelectionModel().getSelected().data;
                var seckill_id = seckill.seckill_id;
                Km.Seckill.View.ProductView.edit_window.seckill_id.setValue(seckill_id);
                var seckill_name = seckill.seckill_name;
                Km.Seckill.View.ProductView.edit_window.seckill_name.setValue(seckill_name);

                Km.Seckill.View.ProductView.edit_window.show();
                Km.Seckill.View.ProductView.edit_window.maximize();
            },
            /**
             * 编辑秒杀商品时先获得选中的秒杀商品信息
             */
            updateProduct : function() {
              if (Km.Seckill.View.ProductView.edit_window==null){
                Km.Seckill.View.ProductView.edit_window=new Km.Seckill.View.ProductView.EditWindow();
              }
              Km.Seckill.View.ProductView.edit_window.saveBtn.setText('修 改');
              Km.Seckill.View.ProductView.edit_window.resetBtn.setVisible(true);
              Km.Seckill.View.ProductView.edit_window.setTitle('修改秒杀商品');
              Km.Seckill.View.ProductView.edit_window.savetype=1;

              Km.Seckill.View.ProductView.edit_window.show();
              Km.Seckill.View.ProductView.edit_window.maximize();

              Km.Seckill.View.ProductView.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());

            },
            /**
             * 删除商品
             */
            deleteProduct : function() {
                Ext.Msg.confirm('提示', '确认要删除所选的商品吗?', this.confirmDeleteProduct,this);
            },
            /**
             * 确认删除商品
             */
            confirmDeleteProduct : function(btn) {
                if (btn == 'yes') {
                    var del_product_ids ="";
                    var selectedRows    = this.getSelectionModel().getSelections();
                    for ( var flag = 0; flag < selectedRows.length; flag++) {
                        del_product_ids=del_product_ids+selectedRows[flag].data.seckillproduct_id+",";
                    }
                    ExtServiceSeckillproduct.deleteByIds(del_product_ids);
                    this.doSelectProduct();
                    Ext.Msg.alert("提示", "删除成功！");
                }
            }
        })
    },
    /**
     * 窗口：批量上传秒杀货品
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传秒杀货品数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传秒杀货品Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadSeckill',
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Seckill.View.Running.seckillGrid.doSelectSeckill();
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
            Km.Seckill.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：秒杀货品列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Seckill.Store.seckillStore,
                sm : this.sm,
                frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                loadMask : true,stripeRows : true,headerAsText : false,
                defaults : {
                    autoScroll : true
                },
                cm : new Ext.grid.ColumnModel({
                    defaults:{
                        width:140,sortable : true
                    },
                    columns : [
                        this.sm,
                        {header : '标识',dataIndex : 'seckill_id',hidden:true},
                        {header : '秒杀名称',dataIndex : 'seckill_name'},
                        {header : '开始时间',dataIndex : 'begin_datetime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i:s')},
                        {header : '结束时间',dataIndex : 'end_datetime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i:s')}
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
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectSeckill();
                                    }
                                }
                            },
                            items : [
                                '秒杀商品','&nbsp;&nbsp;',{ref: '../sproduct_id',xtype: 'combo',
                                     store:Km.Seckill.Store.productStoreForCombo,hiddenName : 'product_id',
                                     emptyText: '请选择秒杀货品',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width:280,pageSize:Km.Seckill.Config.PageSize,
                                     displayField:'product_name',valueField:'product_id',
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                         '<tpl for="."><div class="search-item">',
                                         '<h3>{product_name} {product_code}</h3>',
                                         '</div></tpl>'
                                     )
                                },'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectSeckill();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.sproduct_id.setValue("");
                                        this.filter={};
                                        this.doSelectSeckill();
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
                                    text : '添加秒杀',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addSeckill();
                                    }
                                },'-',{
                                    text : '修改秒杀',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateSeckill();
                                    }
                                },'-',{
                                    text : '删除秒杀', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteSeckill();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importSeckill();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入秒杀货品',iconCls : 'icon-import',scope:this,handler:function(){this.importSeckill()}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportSeckill();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看秒杀货品', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showSeckill()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideSeckill();Km.Seckill.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Seckill.Cookie.set('View.IsFix',Km.Seckill.Config.View.IsFix);}}
                                        ]}
                                },'-']}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Seckill.Config.PageSize,
                    store: Km.Seckill.Store.seckillStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Seckill.Viewport){
                                if (Km.Seckill.Config.View.IsShow==1){
                                    Km.Seckill.View.IsSelectView=1;
                                }
                                this.ownerCt.hideSeckill();
                                Km.Seckill.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Seckill.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Seckill.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Seckill.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectSeckill();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Seckill.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Seckill.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectSeckill();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示秒杀货品列表
            this.doSelectSeckill();
            Km.Seckill.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的秒杀货品信息Tab页
            Km.Seckill.View.Running.viewTabs=new Km.Seckill.View.SeckillView.Tabs();
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
                    if (sm.getCount() != 1){
                        this.grid.hideSeckill();
                        Km.Seckill.Config.View.IsShow=0;
                    }else{
                        if (Km.Seckill.View.IsSelectView==1){
                            Km.Seckill.View.IsSelectView=0;
                            this.grid.showSeckill();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Seckill.Config.View.IsShow==1){
                            Km.Seckill.View.IsSelectView=1;
                        }
                        this.grid.hideSeckill();
                        Km.Seckill.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Seckill.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showSeckill();
                this.tvpView.toggle(true);
            }else{
                this.hideSeckill();
                Km.Seckill.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Seckill.Config.View.IsFix=1;
            }else{
               Km.Seckill.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Seckill.Config.View.IsShow=0;
                return ;
            }
            if (Km.Seckill.Config.View.IsShow==1){
               this.hideSeckill();
               Km.Seckill.Config.View.IsShow=0;
            }
            this.showSeckill();
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
         * 查询符合条件的秒杀货品
         */
        doSelectSeckill : function() {
            if (this.topToolbar){
                var sproduct_id = this.topToolbar.sproduct_id.getValue();
                this.filter       ={'product_id':sproduct_id};
            }
            var condition = {'start':0,'limit':Km.Seckill.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceSeckill.queryPageSeckill(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Seckill.Store.seckillStore.loadData(result);
                } else {
                    Km.Seckill.Store.seckillStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的秒杀货品！');
                }
            });
        },
        /**
         * 显示秒杀货品视图
         * 显示秒杀货品的视图相对秒杀货品列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Seckill.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Seckill.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Seckill.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Seckill.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Seckill.View.Running.viewTabs);
                    break;
            }
            Km.Seckill.Cookie.set('View.Direction',Km.Seckill.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Seckill.Config.View.IsFix==0)&&(Km.Seckill.Config.View.IsShow==1)){
                    this.showSeckill();
                }
                Km.Seckill.Config.View.IsFix=1;
                Km.Seckill.View.Running.seckillGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Seckill.Config.View.IsShow=0;
                this.showSeckill();
            }
        },
        /**
         * 显示秒杀货品
         */
        showSeckill : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择秒杀货品！');
                Km.Seckill.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Seckill.Config.View.IsFix==0){
                if (Km.Seckill.View.Running.view_window==null){
                    Km.Seckill.View.Running.view_window=new Km.Seckill.View.SeckillView.Window();
                }
                if (Km.Seckill.View.Running.view_window.hidden){
                    Km.Seckill.View.Running.view_window.show();
                    Km.Seckill.View.Running.view_window.winTabs.hideTabStripItem(Km.Seckill.View.Running.view_window.winTabs.tabFix);
                    this.updateViewSeckill();
                    this.tvpView.toggle(true);
                    Km.Seckill.Config.View.IsShow=1;
                }else{
                    this.hideSeckill();
                    Km.Seckill.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Seckill.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Seckill.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Seckill.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Seckill.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Seckill.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Seckill.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Seckill.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Seckill.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Seckill.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideSeckill();
            if (Km.Seckill.Config.View.IsShow==0){
                Km.Seckill.View.Running.viewTabs.enableCollapse();
                switch(Km.Seckill.Config.View.Direction){
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
                this.updateViewSeckill();
                this.tvpView.toggle(true);
                Km.Seckill.Config.View.IsShow=1;
            }else{
                Km.Seckill.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏秒杀货品
         */
        hideSeckill : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Seckill.View.Running.view_window!=null){
                Km.Seckill.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前秒杀货品显示信息
         */
        updateViewSeckill : function() {
            Km.Seckill.View.Running.productGrid.doSelectProduct();
            if (Km.Seckill.View.Running.view_window!=null){
                Km.Seckill.View.Running.view_window.winTabs.tabSeckillDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Seckill.View.Running.viewTabs.tabSeckillDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建秒杀货品
         */
        addSeckill : function() {
            if (Km.Seckill.View.Running.edit_window==null){
                Km.Seckill.View.Running.edit_window=new Km.Seckill.View.EditWindow();
            }
            Km.Seckill.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Seckill.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Seckill.View.Running.edit_window.setTitle('添加秒杀商品');
            Km.Seckill.View.Running.edit_window.savetype=0;
            Km.Seckill.View.Running.edit_window.seckill_id.setValue("");

            Km.Seckill.View.Running.edit_window.show();
            Km.Seckill.View.Running.edit_window.maximize();
        },
        /**
         * 编辑秒杀货品时先获得选中的秒杀货品信息
         */
        updateSeckill : function() {
            if (Km.Seckill.View.Running.edit_window==null){
                Km.Seckill.View.Running.edit_window=new Km.Seckill.View.EditWindow();
            }
            Km.Seckill.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Seckill.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Seckill.View.Running.edit_window.setTitle('修改秒杀');
            Km.Seckill.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Seckill.View.Running.edit_window.savetype=1;

            Km.Seckill.View.Running.edit_window.show();
            Km.Seckill.View.Running.edit_window.maximize();
        },
        /**
         * 删除秒杀货品
         */
        deleteSeckill : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的秒杀货品吗?', this.confirmDeleteSeckill,this);
        },
        /**
         * 确认删除秒杀货品
         */
        confirmDeleteSeckill : function(btn) {
            if (btn == 'yes') {
                var del_seckill_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_seckill_ids=del_seckill_ids+selectedRows[flag].data.seckill_id+",";
                }
                ExtServiceSeckill.deleteByIds(del_seckill_ids);
                this.doSelectSeckill();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出秒杀货品
         */
        exportSeckill : function() {
            ExtServiceSeckill.exportSeckill(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入秒杀货品
         */
        importSeckill : function() {
            if (Km.Seckill.View.current_uploadWindow==null){
                Km.Seckill.View.current_uploadWindow=new Km.Seckill.View.UploadWindow();
            }
            Km.Seckill.View.current_uploadWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Seckill.View.Running.seckillGrid=new Km.Seckill.View.Grid();
            if (Km.Seckill.Config.View.IsFix==0){
                Km.Seckill.View.Running.seckillGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Seckill.View.Running.seckillGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Seckill.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Seckill.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前秒杀货品Grid对象
         */
        seckillGrid:null,
        /**
         * 当前商品Grid对象
         */
        productGrid:null,
        /**
         * 显示秒杀货品信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Seckill.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Seckill.Init();
    /**
     * 秒杀货品数据模型获取数据Direct调用
     */
    Km.Seckill.Store.seckillStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceSeckill.queryPageSeckill}
    });
    /**
     * 秒杀货品页面布局
     */
    Km.Seckill.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Seckill.View.Panel()]
    });
    Km.Seckill.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
