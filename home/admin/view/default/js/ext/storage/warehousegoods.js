Ext.namespace("Kmall.Admin.Goods");
Km = Kmall.Admin.Goods;
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
             * 显示产品的视图相对产品列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示产品信息页(或者打开新窗口)
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
        if (Km.Goods.Cookie.get('View.Direction')){
            Km.Goods.Config.View.Direction=Km.Goods.Cookie.get('View.Direction');
        }
        if (Km.Goods.Cookie.get('View.IsFix')!=null){
            Km.Goods.Config.View.IsFix=Km.Goods.Cookie.get('View.IsFix');
        }
        if (Ext.util.Cookies.get('roletype')!=null){
            Km.Goods.Config.Roletype=Ext.util.Cookies.get('roletype');
        }
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.Goods.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }
        if (Ext.util.Cookies.get('roleid')!=null){
            Km.Goods.Config.Roleid=Ext.util.Cookies.get('roleid');
        }
        if (Ext.util.Cookies.get('operator')!=null){
            Km.Goods.Config.operator=Ext.util.Cookies.get('operator');
        }
        if (Ext.util.Cookies.get('admin_id')!=null){
            Km.Goods.Config.admin_id=Ext.util.Cookies.get('admin_id');
        }
    },
    /**
     * 带条件打开本页
     */
    Filter:function(){
        var goods_param=Ext.urlDecode(window.location.search.substring(1));
        if (goods_param){
          if (goods_param.alarm) Km.Goods.View.Running.goodsGrid.topToolbar.alarm.setValue(goods_param.alarm);
          if (Km.Goods.View.Running.goodsGrid.filter==null){
            Km.Goods.View.Running.goodsGrid.filter={};
          }
        }
    }
};
/**
 * Model:数据模型
 */
Km.Goods.Store = {
    /**
     * 产品
     */
    goodsStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'goods_id',type: 'string'},
                {name: 'goods_code',type: 'string'},
                {name: 'supplier_id',type: 'int'},
                {name: 'sp_name',type: 'string'},
                {name: 'ptype_id',type: 'int'},
                {name: 'ptype_key',type: 'string'},
                {name: 'ptype_fullname',type: 'string'},
                {name: 'goods_name',type: 'string'},
                {name: 'ptype_name',type: 'string'},
                {name: 'unit',type: 'string'},
                {name: 'markettable',type: 'string'},
                {name: 'store',type: 'int'},
                {name: 'intro',type: 'string'},
                {name: 'low_alarm',type: 'int'},
                {name: 'in_price',type: 'float'},
                {name: 'recommend_price',type: 'float'},
                {name: 'good_price',type: 'float'},
                {name: 'storeinfo',type: 'string'},
                {name: 'num',type: 'int'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    Ext.apply(options.params, Km.Goods.View.Running.goodsGrid.filter);//保证分页也将查询条件带上
                }
            },
            /**
             * 库存警报,黄色最低库存报警
             */
            load : function(store,records) {
                if (Km.Goods.View.Running.goodsGrid){
                    var girdcount=0;
                    store.each(function(r){
                        if(r.data.num<=r.data.low_alarm){
                            Km.Goods.View.Running.goodsGrid.getView().getRow(girdcount).style.backgroundColor='#FFF4A9';
                        }
                        girdcount=girdcount+1;
                    });
                }
            }
        }
    }),
    /**
     * 供应商
     */
    supplierStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/supplier.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'suppliers',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'supplier_id'
        }, [
            {name: 'supplier_id', mapping: 'supplier_id'},
            {name: 'sp_name', mapping: 'sp_name'}
        ])
    }),
    /**
     * 产品类型
     */
    ptypeStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/ptype.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'ptypes',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'ptype_id'
        }, [
            {name: 'ptype_id', mapping: 'ptype_id'},
            {name: 'name', mapping: 'name'}
        ])
    }),
    /**
     * 量词
     */
    quantifierStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/quantifier.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'quantifiers',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'unit'
        }, [
            {name: 'quantifier_name', mapping: 'quantifier_name'}
        ])
    }),
    /**
     * 产品入库
     */
    goodslogStorein:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                  {name: 'goodslog_id',type: 'int'},
                  {name: 'fsp_id',type: 'int'},
                  {name: 'sp_name_fsp',type: 'string'},
                  {name: 'fsp_warehouse',type: 'string'},
                  {name: 'tsp_id',type: 'int'},
                  {name: 'sp_name_tsp',type: 'string'},
                  {name: 'tsp_warehouse',type: 'string'},
                  {name: 'goodsActionType',type: 'int'},
                  {name: 'goods_id',type: 'int'},
                  {name: 'goods_name',type: 'string'},
                  {name: 'price',type: 'string'},
                  {name: 'num',type: 'int'},
                  {name: 'cmTime',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        })
    }),
    /**
     * 产品出库
     */
    goodslogStoreout:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                  {name: 'goodslog_id',type: 'int'},
                  {name: 'fsp_id',type: 'int'},
                  {name: 'sp_name_fsp',type: 'string'},
                  {name: 'fsp_warehouse',type: 'string'},
                  {name: 'tsp_id',type: 'int'},
                  {name: 'sp_name_tsp',type: 'string'},
                  {name: 'tsp_warehouse',type: 'string'},
                  {name: 'tsp_warehouse_name',type: 'string'},
                  {name: 'goodsActionType',type: 'string'},
                  {name: 'goods_id',type: 'int'},
                  {name: 'goods_name',type: 'string'},
                  {name: 'price',type: 'string'},
                  {name: 'num',type: 'int'},
                  {name: 'cmTime',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        })
    }),
    /**
     * 产品查询
     */
    goodsStoreSelect : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/goods.php'
          }),
        reader: new Ext.data.JsonReader({
            root: 'goods',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'goods_id'
          }, [
              {name: 'goods_id', mapping: 'goods_id'},
              {name: 'goods_name', mapping: 'goods_name'},
              {name: 'goods_code', mapping: 'goods_code'}
        ]),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
/*
                    if (Ext.getCmp("gname_has").getValue()){
                        this.baseParams.goods_name = Ext.getCmp("gname_has").getValue();
                        this.baseParams.query = "";
                    }else{
                        this.baseParams.goods_name = Ext.getCmp("gname_has").getValue();
                    }
                    if (Ext.getCmp("goods_no_has").getValue()){
                        this.baseParams.goods_code = Ext.getCmp("goods_no_has").getValue();
                        this.baseParams.query = "";
                    }else{
                        this.baseParams.goods_code = Ext.getCmp("goods_no_has").getValue();
                    }
*/
                    //供应商  ：可以查到自己
                    if (Km.Goods.Config.Roletype==4){
                        Ext.apply(options.params, {"supplier_id":Km.Goods.Config.Roleid});//保证分页也将查询条件带上
                    }
                    //渠道商 ：可以查到自己的以及所有的供应商
                    if (Km.Goods.Config.Roletype==5){
                        Ext.apply(options.params, {"supplier_id":Km.Goods.Config.Roleid},{"sptype":1});//保证分页也将查询条件带上
                    }
                }
            }
        }
    })
};
/**
 * View:产品显示组件
 */
Km.Goods.View={
    /**
     * 编辑窗口：新建或者修改产品
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
                        switch (Km.Goods.Config.OnlineEditor)
                        {
                            case 2:
                                Km.Goods.View.EditWindow.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
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
                            {xtype: 'hidden',  name : 'goods_id',ref:'../goods_id'},
                            {fieldLabel : '商品名称',name : 'goods_name'},
                            {fieldLabel : '商品标识(<font color=red>*</font>)',name : 'goods_code',allowBlank : false},
                            {xtype: 'hidden',name : 'supplier_id',id:'supplier_id',ref : '../supplier_id'},
                            {
                                 fieldLabel : '供货商',xtype: 'combo',name : 'sp_name',id : 'sp_name',
                                 store:Km.Goods.Store.supplierStore,emptyText: '请选择供货商',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Goods.Config.PageSize,
                                 displayField:'sp_name',// 显示文本
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                            '<tpl for="."><div class="search-item">',
                                                '<h3>{sp_name}</h3>',
                                            '</div></tpl>'
                                 ),
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        Ext.getCmp("supplier_id").setValue(record.data.supplier_id);
                                        Ext.getCmp("sp_name").setValue(record.data.sp_name);
                                        this.collapse();
                                     }
                                 }
                            },
                            {xtype: 'hidden',name : 'ptype_id',id:'ptype_id'},
                            {
                                 fieldLabel : '商品类型',xtype: 'combo',name : 'ptype_name',id : 'ptype_name',
                                 store:Km.Goods.Store.ptypeStore,emptyText: '请选择商品类型',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Goods.Config.PageSize,
                                 displayField:'name',// 显示文本
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                            '<tpl for="."><div class="search-item">',
                                                '<h3>{name}</h3>',
                                            '</div></tpl>'
                                 ),
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        Ext.getCmp("ptype_id").setValue(record.data.ptype_id);
                                        Ext.getCmp("ptype_name").setValue(record.data.name);
                                        this.collapse();
                                     }
                                 }
                            },
                            {fieldLabel : '商品数量',name : 'num',xtype:'numberfield',ref:'../num'},
                            {
                                 fieldLabel : '单位',xtype: 'combo',name : 'unit',id : 'unit',
                                 store:Km.Goods.Store.quantifierStore,emptyText: '请选择单位',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Goods.Config.PageSize,
                                 displayField:'quantifier_name',// 显示文本
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                            '<tpl for="."><div class="search-item">',
                                                '<h3>{quantifier_name}</h3>',
                                            '</div></tpl>'
                                 ),
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        Ext.getCmp("unit").setValue(record.data.quantifier_name);
                                        this.collapse();
                                     }
                                 }
                            },
                            {fieldLabel : '最低库存警报',name : 'low_alarm',xtype:'numberfield'},
                            {fieldLabel : '商品简介',name : 'intro',xtype : 'textarea',id:'intro',ref:'intro'},
                            {fieldLabel : '商品单价',name : 'in_price',xtype:'numberfield'},
                            {fieldLabel : '销售价',name : 'recommend_price',xtype:'numberfield'},
                            {fieldLabel : '批发价格',name : 'good_price',xtype:'numberfield'}
                        ]
                    })
                ],
                buttons : [ {
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {
                        switch (Km.Goods.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Goods.View.EditWindow.KindEditor_intro)this.editForm.intro.setValue(Km.Goods.View.EditWindow.KindEditor_intro.html());
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
                            this.editForm.api.submit=ExtServiceWarehouseGoods.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Goods.View.Running.goodsGrid.doSelectGoods();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', action.result.msg);
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceWarehouseGoods.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Goods.View.Running.goodsGrid.bottomToolbar.doRefresh();
                                    }});
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', "商品信息更新失败！");
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
                        switch (Km.Goods.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Goods.View.EditWindow.KindEditor_intro) Km.Goods.View.EditWindow.KindEditor_intro.html(Km.Goods.View.Running.goodsGrid.getSelectionModel().getSelected().data.intro);
                                break
                            case 3:
                                break
                            default:
                                if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(Km.Goods.View.Running.goodsGrid.getSelectionModel().getSelected().data.intro);
                        }
                    }
                }]
            }, config);
            Km.Goods.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示产品详情
     */
    GoodsView:{
        /**
         * Tab页：容器包含显示与产品所有相关的信息
         */
        Tabs:Ext.extend(Ext.TabPanel,{
            constructor : function(config) {
                config = Ext.apply({
                    region : 'south',collapseMode : 'mini',split : true,deferredRender:false,
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
                                    Ext.Msg.alert('提示', '请先选择商品！');
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
                Km.Goods.View.Running.goodslogInOutGrid=new Km.Goods.View.GoodslogInOutView.Grid();
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Goods.Config.View.Direction== 1)||(Km.Goods.Config.View.Direction==2)){
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
                         '<tr class="entry"><td class="head">商品名称</td><td class="content">{goods_name}</td></tr>',
                         '<tr class="entry"><td class="head">商品标识</td><td class="content">{goods_code}</td></tr>',
                         '<tr class="entry"><td class="head">供货商</td><td class="content">{sp_name}</td></tr>',
                         '<tr class="entry"><td class="head">商品类型</td><td class="content">{ptype_fullname}</td></tr>',
                         '<tr class="entry"><td class="head">库存信息</td><td class="content">{storeinfo}</td></tr>',
                         '<tr class="entry"><td class="head">库存</td><td class="content">{num}</td></tr>',
                         '<tr class="entry"><td class="head">最低库存警报</td><td class="content">{low_alarm}</td></tr>',
                         '<tr class="entry"><td class="head">商品简介</td><td class="content">{intro}</td></tr>',
                         '<tr class="entry"><td class="head">单价</td><td class="content">{in_price}</td></tr>',
                         '<tr class="entry"><td class="head">销售价</td><td class="content">{recommend_price}</td></tr>',
                         '<tr class="entry"><td class="head">批发价格</td><td class="content">{good_price}</td></tr>',
                     '</table>'
                     ]
                    }
                );
                this.add(
                    {title: '商品出入库记录',ref:'tabGoodslog',iconCls:'tabs',tabWidth:150,
                     items:[Km.Goods.View.Running.goodslogInOutGrid]
                    }
                );
            }
        }),
        /**
         * 窗口:显示产品信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                if (Km.Goods.View.Running.viewWindowTabs==null){
                    Km.Goods.View.Running.viewWindowTabs=new Km.Goods.View.GoodsView.Tabs({ref:'winTabs',tabPosition:'top'});
                }
                config = Ext.apply({
                    title:"查看商品",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
                    closeAction : "hide",
                    items:[Km.Goods.View.Running.viewWindowTabs],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Goods.Config.View.IsShow=0;
                            Km.Goods.View.Running.goodsGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Goods.Config.View.IsShow=0;
                            Km.Goods.View.Running.goodsGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Goods.View.Running.goodsGrid.addGoods();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Goods.View.Running.goodsGrid.updateGoods();}
                    }]
                }, config);
                Km.Goods.View.GoodsView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 视图：产品出入库日志列表
     */
    GoodslogInOutView:{
        /**
         * 视图：产品出入库日志列表
         */
        Grid:Ext.extend(Ext.Panel, {
            constructor : function(config) {
                config = Ext.apply({
                    id:"gridInOut",
                    baseCls:'x-plain',
                    layout:{
                        type:'hbox',
                        align : 'stretch'
                    },
                    layoutConfig: {
                       padding:'10'
                    },
                    defaults:{
                        margins:'5 5 5 0',
                        frame:true},
                    items:[new Km.Goods.View.GoodslogInOutView.GridIn({flex:1}),new Km.Goods.View.GoodslogInOutView.GridOut({flex:1})]
                }, config);
                Km.Goods.View.GoodslogInOutView.Grid.superclass.constructor.call(this, config);
            }
        }),
        /**
         * 视图：产品入库
         */
        GridIn:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Goods.Store.goodslogStorein,ref:'gridIn',
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
                          {header : '入库数量',dataIndex : 'num'},
                          {header : '入库时间',dataIndex : 'cmTime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')},
                          {header : '来自供应商',dataIndex : 'sp_name_fsp'},
                          {header : '目的供应商',dataIndex : 'sp_name_tsp'},
                          {header : '商品价格',dataIndex : 'price'}
                        ]
                    })
                }, config);
                Km.Goods.View.GoodslogInOutView.GridIn.superclass.constructor.call(this, config);
                if (Km.Goods.Config.Roletype=='4'){
                    this.getColumnModel().setHidden(2,true);
                    this.getColumnModel().setHidden(3,true);
                }
            },
            /**
             * 查询符合条件的出入库详情
             */
            doSelectGoodslog : function() {
                if (Km.Goods.View.Running.goodsGrid&&Km.Goods.View.Running.goodsGrid.getSelectionModel().getSelected()){
                    var goods_id = Km.Goods.View.Running.goodsGrid.getSelectionModel().getSelected().data.goods_id;
                    var condition = {'goodsActionType':'in','goods_id':goods_id};
                    ExtServiceGoodslog.queryPageGoodslog(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                Km.Goods.Store.goodslogStorein.loadData(result);
                            } else {
                                Km.Goods.Store.goodslogStorein.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的合同订单！');
                            }
                        }
                    });
                }
            }
        }),
        /**
         * 视图：产品出库
         */
        GridOut:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Goods.Store.goodslogStoreout,ref:'gridOut',
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
                          {header : '出库数量',dataIndex : 'num'},
                          {header : '出库时间',dataIndex : 'cmTime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')},
                          {header : '来自供应商',dataIndex : 'sp_name_fsp'},
                          {header : '目的方',dataIndex : 'sp_name_tsp'},
                          {header : '商品价格',dataIndex : 'price'}
                        ]
                    })
                }, config);
                Km.Goods.View.GoodslogInOutView.GridOut.superclass.constructor.call(this, config);
                if (Km.Goods.Config.Roletype=='4'){
                    this.getColumnModel().setHidden(2,true);
                }
            },
            /**
             * 查询符合条件的出入库详情
             */
            doSelectGoodslog : function() {
                if (Km.Goods.View.Running.goodsGrid&&Km.Goods.View.Running.goodsGrid.getSelectionModel().getSelected()){
                    var goods_id = Km.Goods.View.Running.goodsGrid.getSelectionModel().getSelected().data.goods_id;
                    var condition = {'goodsActionType':'out','goods_id':goods_id};
                    ExtServiceGoodslog.queryPageGoodslog(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                Km.Goods.Store.goodslogStoreout.loadData(result);
                            } else {
                                Km.Goods.Store.goodslogStoreout.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的合同订单！');
                            }
                        }
                    });
                }
            }
        })
    },
    /**
     * 窗口：批量上传产品
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量商品上传',
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
                            emptyText: '请上传商品Excel文件',buttonText: '',
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
                                    success : function(form, action) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Goods.View.Running.goodsGrid.doSelectGoods();
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
            Km.Goods.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：产品列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,region : 'center',store : Km.Goods.Store.goodsStore,sm : this.sm,
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
                        {header : '商品标识',dataIndex : 'goods_code'},
                        {header : '供货商',dataIndex : 'sp_name'},
                        {header : '商品类型',dataIndex : 'ptype_fullname',width:250},
                        {header : '商品名称',dataIndex : 'goods_name',width:280},
                        {header : '库存',dataIndex : 'num'},
                        {header : '最低库存警报',dataIndex : 'low_alarm'},
                        {header : '单价',dataIndex : 'in_price'},
                        {header : '销售价',dataIndex : 'recommend_price'},
                        {header : '批发价格',dataIndex : 'good_price'}
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
                                '商品条码','&nbsp;&nbsp;',{ref: '../ggoods_id',xtype:'hidden',name : 'goods_id',id:'ggoods_id'},
                                {
                                     xtype: 'combo',name : 'goods_no_has',id : 'goods_no_has',ref: '../goods_no_has',
                                     store:Km.Goods.Store.goodsStoreSelect,emptyText: '请选择商品',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width:240,pageSize:Km.Goods.Config.PageSize,
                                     displayField:'goods_code',// 显示文本
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                                '<tpl for="."><div class="search-item">',
                                                    '<h3>{goods_code}</h3>',
                                                '</div></tpl>'
                                     ),
                                     onSelect:function(record,index){
                                         if(this.fireEvent('beforeselect', this, record, index) !== false){
                                            Ext.getCmp("ggoods_id").setValue(record.data.goods_id);
                                            Ext.getCmp("ggoods_no").setValue(record.data.goods_code);
                                            Ext.getCmp("goods_no_has").setValue(record.data.goods_code);
                                            Ext.getCmp("gname_has").setValue(record.data.goods_name);
                                            this.collapse();
                                         }
                                     }
                                },'&nbsp;&nbsp;',
                                '商品名称','&nbsp;&nbsp;',{ref: '../ggoods_no',xtype:'hidden',name : 'goods_code',id:'ggoods_no'},
                                {
                                     xtype: 'combo',name : 'gname_has',id : 'gname_has',ref: '../gname_has',
                                     store:Km.Goods.Store.goodsStoreSelect,emptyText: '请选择商品',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width:300,pageSize:Km.Goods.Config.PageSize,
                                     displayField:'goods_name',// 显示文本
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                                '<tpl for="."><div class="search-item">',
                                                    '<h3>{goods_name}</h3>',
                                                '</div></tpl>'
                                     ),
                                     onSelect:function(record,index){
                                         if(this.fireEvent('beforeselect', this, record, index) !== false){
                                            Ext.getCmp("ggoods_id").setValue(record.data.goods_id);
                                            Ext.getCmp("goods_no_has").setValue(record.data.goods_code);
                                            Ext.getCmp("ggoods_no").setValue(record.data.goods_code);
                                            Ext.getCmp("gname_has").setValue(record.data.goods_name);
                                            this.collapse();
                                         }
                                     }
                                },'&nbsp;&nbsp;',
                                '商品录入开始','&nbsp;&nbsp;',{ref: '../commitFrom',name : 'commitFrom',id:'commitFrom',xtype : 'datefield',format : "Y-m-d"},
                                '结束','&nbsp;&nbsp;',{ref: '../commitTo',name : 'commitTo',id:'commitTo',xtype : 'datefield',format : "Y-m-d"},
                                {xtype:'hidden',ref: '../alarm',name : 'alarm'},
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.topToolbar.alarm.setValue("");
                                        this.doSelectGoods();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.ggoods_id.setValue("");
                                        this.topToolbar.goods_no_has.setValue("");
                                        this.topToolbar.ggoods_no.setValue("");
                                        this.topToolbar.gname_has.setValue("");
                                        this.topToolbar.commitFrom.setValue("");
                                        this.topToolbar.commitTo.setValue("");
                                        this.topToolbar.alarm.setValue("");
                                        this.filter={};
                                        this.doSelectGoods();
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
                                    text : '添加商品',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addGoods();
                                    }
                                },'-',{
                                    text : '修改商品信息',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateGoods();
                                    }
                                },'-',{
                                    text : '删除商品', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteGoods();
                                    }
                                },'-',{
                                    text : '导入',iconCls : 'icon-import',
                                    handler : function() {
                                        this.importGoods();
                                    }
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportGoods();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看商品', ref:'../../tvpView',iconCls : 'icon-updown',
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
                                },'-',new Ext.Toolbar.Fill(),'黄色:库存警报']}
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
/*            //初始化显示产品列表
            this.doSelectGoods();*/
            Km.Goods.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的产品信息Tab页
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
         * 查询符合条件的产品
         */
        doSelectGoods : function() {
            if (this.topToolbar){
                var ggoods_no = this.topToolbar.ggoods_no.getValue();
                var ggoods_id = this.topToolbar.ggoods_id.getValue();
                var commitFrom = this.topToolbar.commitFrom.getValue();
                var commitTo = this.topToolbar.commitTo.getValue();
                var alarm = this.topToolbar.alarm.getValue();
                this.filter       ={'alarm':alarm,'goods_id':ggoods_id,'goods_code':ggoods_no,'commitFrom':commitFrom,'commitTo':commitTo};
            }
            var condition = {'start':0,'limit':Km.Goods.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceWarehouseGoods.queryPageGoods(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Goods.Store.goodsStore.loadData(result);
                } else {
                    Km.Goods.Store.goodsStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的商品！');
                }
            });
        },
        /**
         * 显示产品视图
         * 显示产品的视图相对产品列表Grid的位置
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
         * 显示产品
         */
        showGoods : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择商品！');
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
         * 隐藏产品
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
         * 更新当前产品显示信息
         */
        updateViewGoods : function() {
            Km.Goods.View.Running.goodslogInOutGrid.gridIn.doSelectGoodslog();
            Km.Goods.View.Running.goodslogInOutGrid.gridOut.doSelectGoodslog();
            if (Km.Goods.View.Running.view_window!=null){
                Km.Goods.View.Running.view_window.winTabs.tabGoodsDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Goods.View.Running.viewTabs.tabGoodsDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建产品
         */
        addGoods : function() {
            if (Km.Goods.View.Running.edit_window==null){
                Km.Goods.View.Running.edit_window=new Km.Goods.View.EditWindow();
            }
            Km.Goods.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Goods.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Goods.View.Running.edit_window.setTitle('添加商品');
            Km.Goods.View.Running.edit_window.savetype=0;
            Km.Goods.View.Running.edit_window.goods_id.setValue("");
            Km.Goods.View.Running.edit_window.num.show();
            switch (Km.Goods.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Goods.View.EditWindow.KindEditor_intro) Km.Goods.View.EditWindow.KindEditor_intro.html("");
                    break
                case 3:
                    break
                default:
                    if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData("");
            }

            Km.Goods.View.Running.edit_window.show();
            Km.Goods.View.Running.edit_window.maximize();
        },
        /**
         * 编辑产品时先获得选中的产品信息
         */
        updateGoods : function() {
            if (Km.Goods.View.Running.edit_window==null){
                Km.Goods.View.Running.edit_window=new Km.Goods.View.EditWindow();
            }
            Km.Goods.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Goods.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Goods.View.Running.edit_window.setTitle('修改商品');
            Km.Goods.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Goods.View.Running.edit_window.savetype=1;
            Km.Goods.View.Running.edit_window.num.hide();
            switch (Km.Goods.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Goods.View.EditWindow.KindEditor_intro) Km.Goods.View.EditWindow.KindEditor_intro.html(this.getSelectionModel().getSelected().data.intro);
                    break
                case 3:
                    if (xhEditor_intro)xhEditor_intro.setSource(this.getSelectionModel().getSelected().data.intro);
                    break
                default:
                    if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(this.getSelectionModel().getSelected().data.intro);
            }

            Km.Goods.View.Running.edit_window.show();
            Km.Goods.View.Running.edit_window.maximize();
        },
        /**
         * 删除产品
         */
        deleteGoods : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的商品吗?', this.confirmDeleteGoods,this);
        },
        /**
         * 确认删除产品
         */
        confirmDeleteGoods : function(btn) {
            if (btn == 'yes') {
                var del_goods_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_goods_ids=del_goods_ids+selectedRows[flag].data.goods_id+",";
                }
                ExtServiceWarehouseGoods.deleteByIds(del_goods_ids);
                this.doSelectGoods();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出产品
         */
        exportGoods : function() {
            ExtServiceWarehouseGoods.exportGoods(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入产品
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
            Km.Goods.Filter();
            Km.Goods.View.Running.goodsGrid.doSelectGoods();
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
         * 当前产品Grid对象
         */
        goodsGrid:null,
        /**
         * 当前产品出入库记录Grid对象
         */
        goodslogInOutGrid:null,
        /**
         * 显示产品信息及关联信息列表的Tab页
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
     * 产品数据模型获取数据Direct调用
     */
    Km.Goods.Store.goodsStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceWarehouseGoods.queryPageGoods}
    });
    /**
     * 产品页面布局
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
