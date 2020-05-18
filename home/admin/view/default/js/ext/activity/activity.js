Ext.namespace("Kmall.Admin.Activity");
Km = Kmall.Admin;
Km.Activity={
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
             * 显示活动的视图相对活动列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示活动信息页(或者打开新窗口)
             */
            IsFix:0
        },
        /**
         * 在线编辑器类型。
         * 1:CkEditor,2:KindEditor,3:xhEditor,4:UEditor
         * 配合Action的变量配置$online_editor
         */
        OnlineEditor:4
    },
    /**
     * Cookie设置
     */
    Cookie:new Ext.state.CookieProvider(),
    /**
     * 初始化
     */
    Init:function(){
        if (Km.Activity.Cookie.get('View.Direction')){
            Km.Activity.Config.View.Direction=Km.Activity.Cookie.get('View.Direction');
        }
        if (Km.Activity.Cookie.get('View.IsFix')!=null){
            Km.Activity.Config.View.IsFix=Km.Activity.Cookie.get('View.IsFix');
        }
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.Activity.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }

    }
};
/**
 * Model:数据模型
 */
Km.Activity.Store = {
    /**
     * 活动
     */
    activityStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'activity_id',type: 'int'},
                {name: 'name',type: 'string'},
                {name: 'images',type: 'string'},
                {name: 'start_time',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'end_time',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'intro',type: 'string'},
                {name: 'introShow',type:'string'}
            ]
        }),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Activity.Config.PageSize;
                    Ext.apply(options.params, Km.Activity.View.Running.activityGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 活动拥有的商品
     */
    activityproductStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'activityproduct_id',type: 'int'},
                {name: 'activity_id',type: 'int'},
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
            ]
        }),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Activity.Config.PageSize;
                    Ext.apply(options.params, Km.Activity.View.Running.activitypGrid.filter);//保证分页也将查询条件带上
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
                    if (!options.params.limit)options.params.limit=Km.Activity.Config.PageSize;
                    Ext.apply(options.params, Km.Activity.View.Running.productGrid.filter);//保证分页也将查询条件带上
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
            {name: 'product_code', mapping: 'product_code'}
        ])
    })
};
/**
 * View:活动显示组件
 */
Km.Activity.View={
    /**
     * 编辑窗口：新建或者修改活动
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
                        this.editForm.getForm().reset();
                    },
                    afterrender:function(){
                        switch (Km.Activity.Config.OnlineEditor)
                        {
                            case 1:
                                ckeditor_replace_intro();
                                break
                            case 2:
                                Km.Activity.View.EditWindow.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
                                break
                            case 3:
                                pageInit_intro();
                                break
                            default:
                                this.editForm.intro.setWidth("98%");
                                pageInit_ue_intro();
                        }
                    }
                },
                items : [
                    new Ext.form.FormPanel({
                        ref:'editForm',layout:'form',fileUpload: true,
                        labelWidth : 100,labelAlign : "center",
                        bodyStyle : 'padding:5px 5px 0',align : "center",
                        api : {},
                        defaults : {
                            xtype : 'textfield',anchor:'98%'
                        },
                        items : [
                            {xtype: 'hidden',name : 'activity_id',ref:'../activity_id'},
                            {fieldLabel : '活动名称(<font color=red>*</font>)',name : 'name',allowBlank : false},
                            {xtype: 'hidden',name : 'images',ref:'../images'},
                            {fieldLabel : '活动图片',name : 'imagesUpload',ref:'../imagesUpload',xtype:'fileuploadfield',
                            emptyText: '请上传活动图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {fieldLabel : '开始时间',name : 'start_time',xtype : 'datefield',format : "Y-m-d"},
                            {fieldLabel : '结束时间',name : 'end_time',xtype : 'datefield',format : "Y-m-d"},
                            {fieldLabel : '活动说明',name : 'intro',xtype : 'textarea',id:'intro',ref:'intro'}
                        ]
                    })
                ],
                buttons : [{
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {
                        switch (Km.Activity.Config.OnlineEditor)
                        {
                            case 1:
                                if (CKEDITOR.instances.intro)this.editForm.intro.setValue(CKEDITOR.instances.intro.getData());
                                break
                            case 2:
                                if (Km.Activity.View.EditWindow.KindEditor_intro)this.editForm.intro.setValue(Km.Activity.View.EditWindow.KindEditor_intro.html());
                                break
                            case 3:
                                if (xhEditor_intro)this.editForm.intro.setValue(xhEditor_intro.getSource());
                                break
                            default:
                                if (ue_intro)this.editForm.intro.setValue(ue_intro.getContent());
                        }

                        if (!this.editForm.getForm().isValid()) {
                            return;
                        }
                        editWindow=this;
                        if (this.savetype==0){
                            this.editForm.api.submit=ExtServiceActivity.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Activity.View.Running.activityGrid.doSelectActivity();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, response) {
                                    Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceActivity.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.Activity.View.Running.activityGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Activity.View.Running.activityGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Activity.View.Running.activityGrid.getSelectionModel().getSelected());
                        this.imagesUpload.setValue(this.images.getValue());
                        switch (Km.Activity.Config.OnlineEditor)
                        {
                            case 1:
                                if (CKEDITOR.instances.intro)CKEDITOR.instances.intro.setData(Km.Activity.View.Running.activityGrid.getSelectionModel().getSelected().data.intro);
                                break
                            case 2:
                                if (Km.Activity.View.EditWindow.KindEditor_intro)Km.Activity.View.EditWindow.KindEditor_intro.html(Km.Activity.View.Running.activityGrid.getSelectionModel().getSelected().data.intro);
                                break
                            case 3:
                                if (xhEditor_intro)xhEditor_intro.setSource(Km.Activity.View.Running.activityGrid.getSelectionModel().getSelected().data.intro);
                                break
                            default:
                                if (ue_intro)ue_intro.setContent(Km.Activity.View.Running.activityGrid.getSelectionModel().getSelected().data.intro);
                        }

                    }
                }]
            }, config);
            Km.Activity.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示活动详情
     */
    ActivityView:{
        /**
         * Tab页：容器包含显示与活动所有相关的信息
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
                                if (Km.Activity.View.Running.activityGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择活动！');
                                    return false;
                                }
                                Km.Activity.Config.View.IsShow=1;
                                Km.Activity.View.Running.activityGrid.showActivity();
                                Km.Activity.View.Running.activityGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Activity.View.ActivityView.Tabs.superclass.constructor.call(this, config);
                Km.Activity.View.Running.productGrid=new Km.Activity.View.ProductView.Grid();
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Activity.Config.View.Direction==1)||(Km.Activity.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabActivityDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">活动名称</td><td class="content">{name}</td></tr>',
                         '    <tr class="entry"><td class="head">活动图片路径</td><td class="content">{images}</td></tr>',
                         '    <tr class="entry"><td class="head">活动图片</td><td class="content"><tpl if="images"><a href="upload/images/{images}" target="_blank"><img src="upload/images/{images}" /></a></tpl></td></tr>',
                         '    <tr class="entry"><td class="head">开始时间</td><td class="content">{start_time:date("Y-m-d")}</td></tr>',
                         '    <tr class="entry"><td class="head">结束时间</td><td class="content">{end_time:date("Y-m-d")}</td></tr>',
                         '    <tr class="entry"><td class="head">活动说明</td><td class="content">{introShow}</td></tr>',
                         '</table>'
                     ]}
                );
                this.add(
                    {title: '商品',iconCls:'tabs',tabWidth:150,
                     items:[Km.Activity.View.Running.productGrid]
                    }
                );
            }
        }),
        /**
         * 窗口:显示活动信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看活动",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Activity.View.ActivityView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Activity.Config.View.IsShow=0;
                            Km.Activity.View.Running.activityGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Activity.Config.View.IsShow=0;
                            Km.Activity.View.Running.activityGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增活动',scope:this,
                        handler : function() {this.hide();Km.Activity.View.Running.activityGrid.addActivity();}
                    },{
                        text: '修改活动',scope:this,
                        handler : function() {this.hide();Km.Activity.View.Running.activityGrid.updateActivity();}
                    }]
                }, config);
                Km.Activity.View.ActivityView.Window.superclass.constructor.call(this, config);
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
                                {xtype: 'hidden',name : 'activityproduct_id',ref:'../activityproduct_id'},
                                {xtype: 'hidden',name : 'product_id',ref:'../product_id'},
                                {
                                     fieldLabel : '活动商品(<font color=red>*</font>)',xtype: 'combo',name : 'product_name',ref : '../product_name',
                                     store:Km.Activity.Store.productStoreForCombo,emptyText: '请选择活动货品',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width: 570, pageSize:Km.Activity.Config.PageSize,
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
                                            this.collapse();
                                         }
                                     }
                                },
                                {xtype: 'hidden',name : 'activity_id',ref:'../activity_id'}
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
                            this.editForm.api.submit=ExtServiceActivityproduct.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Activity.View.Running.productGrid.doSelectProduct();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, response) {
                                    Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
                                }
                            });
                        }
                    }, {
                        text : "取 消",scope:this,
                        handler : function() {
                            this.hide();
                        }
                    }, {
                        text : "重 置",ref:'../resetBtn',scope:this,
                        handler : function() {
                            this.editForm.form.loadRecord(Km.Activity.View.Running.productGrid.getSelectionModel().getSelected());
                        }
                    }]
                }, config);
                Km.Activity.View.ProductView.EditWindow.superclass.constructor.call(this, config);
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
                    store : Km.Activity.Store.activityproductStore,sm : this.sm,
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
                            {header : '价格',dataIndex : 'price'},
                            {header : '券',dataIndex : 'jifen'},
                            {header : '库存',dataIndex : 'num'},
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
                                        text : '添加活动商品',iconCls : 'icon-add',
                                        handler : function() {
                                            this.addProduct();
                                        }
                                    },'-',{
                                        text : '删除活动商品', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                        handler : function() {
                                            this.deleteProduct();
                                        }
                                    },'-'
                                ]}
                            )
                        ]
                    },
                    bbar: new Ext.PagingToolbar({
                        pageSize: Km.Activity.Config.PageSize,
                        store: Km.Activity.Store.activityproductStore,scope:this,autoShow:true,displayInfo: true,
                        displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',emptyMsg: "无显示数据",
                        items: [
                            {xtype:'label', text: '每页显示'},
                            {xtype:'numberfield', value:Km.Activity.Config.PageSize,minValue:1,width:35,style:'text-align:center',allowBlank: false,
                                listeners:
                                {
                                    change:function(Field, newValue, oldValue){
                                        var num = parseInt(newValue);
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Activity.Config.PageSize;
                                            Field.setValue(num);
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Activity.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectProduct();
                                    },
                                    specialKey :function(field,e){
                                        if (e.getKey() == Ext.EventObject.ENTER){
                                            var num = parseInt(field.getValue());
                                            if (isNaN(num) || !num || num<1)num = Km.Activity.Config.PageSize;
                                            this.ownerCt.pageSize= num;
                                            Km.Activity.Config.PageSize = num;
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
                Km.Activity.Store.activityproductStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceActivityproduct.queryPageActivityproduct}
                });
                Km.Activity.View.ProductView.Grid.superclass.constructor.call(this, config);
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
                if (Km.Activity.View.Running.activityGrid&&Km.Activity.View.Running.activityGrid.getSelectionModel().getSelected()){
                    var activity_id = Km.Activity.View.Running.activityGrid.getSelectionModel().getSelected().data.activity_id;
                    var condition = {'activity_id':activity_id,'start':0,'limit':Km.Activity.Config.PageSize};
                    this.filter      = {'activity_id':activity_id};
                    ExtServiceActivityproduct.queryPageActivityproduct(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       = response.result.data;
                                result['totalCount'] = response.result.totalCount;
                                Km.Activity.Store.activityproductStore.loadData(result);
                            } else {
                                Km.Activity.Store.activityproductStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的商品！');
                            }

                            if (Km.Activity.Store.activityproductStore.getTotalCount()>Km.Activity.Config.PageSize){
                                 Km.Activity.View.Running.productGrid.bottomToolbar.show();
                            }else{
                                 Km.Activity.View.Running.productGrid.bottomToolbar.hide();
                            }
                            Km.Activity.View.Running.activityGrid.ownerCt.doLayout();
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
                if (Km.Activity.View.ProductView.edit_window==null){
                    Km.Activity.View.ProductView.edit_window=new Km.Activity.View.ProductView.EditWindow();
                }
                Km.Activity.View.ProductView.edit_window.resetBtn.setVisible(false);
                Km.Activity.View.ProductView.edit_window.saveBtn.setText('保 存');
                Km.Activity.View.ProductView.edit_window.setTitle('添加商品');
                Km.Activity.View.ProductView.edit_window.savetype=0;
                Km.Activity.View.ProductView.edit_window.product_id.setValue("");
                var activity_id = Km.Activity.View.Running.activityGrid.getSelectionModel().getSelected().data.activity_id;
                Km.Activity.View.ProductView.edit_window.activity_id.setValue(activity_id);

                Km.Activity.View.ProductView.edit_window.show();
                Km.Activity.View.ProductView.edit_window.maximize();
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
                        del_product_ids=del_product_ids+selectedRows[flag].data.activityproduct_id+",";
                    }
                    ExtServiceActivityproduct.deleteByIds(del_product_ids);
                    this.doSelectProduct();
                    Ext.Msg.alert("提示", "删除成功！");
                }
            }
        })
    },
    /**
     * 窗口：批量上传活动
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传活动数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传活动Excel文件',buttonText: '',
                            accept:'application/vnd.ms-excel',
                            buttonCfg: {iconCls: 'upload-icon'}
                        }]
                    })
                ],
                buttons : [{
                    text : '上 传',
                    scope:this,
                    handler : function() {
                        uploadWindow            =this;
                        validationExpression    =/([\u4E00-\u9FA5]|\w)+(.xlsx|.XLSX|.xls|.XLS)$/;/**允许中文名*/
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
                                url : 'index.php?go=admin.upload.uploadActivity',
                                success : function(form, response) {
                                    Ext.Msg.alert('成功', '上传成功');
                                    uploadWindow.hide();
                                    uploadWindow.uploadForm.upload_file.setValue('');
                                    Km.Activity.View.Running.activityGrid.doSelectActivity();
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
            Km.Activity.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 窗口：批量上传商品图片
     */
    BatchUploadImagesWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                width : 400,height : 180,minWidth : 300,minHeight : 100,closeAction : "hide",
                layout : 'fit',plain : true,bodyStYle : 'padding:5px;',buttonAlign : 'center',
                items : [
                    new Ext.form.FormPanel({
                        ref:'uploadForm',fileUpload: true,
                        width: 500,labelWidth: 50,autoHeight: true,baseCls: 'x-plain',
                        frame:true,bodyStyle: 'padding: 10px 10px 10px 10px;',
                        defaults: {
                            anchor: '95%',allowBlank: false,msgTarget: 'side'
                        },
                        items : [{
                            xtype : 'fileuploadfield',fieldLabel : '文 件',ref:'upload_file',
                            emptyText: '请批量上传更新时间文件(zip)',buttonText: '',
                            accept:'application/zip,application/x-zip-compressed',
                            buttonCfg: {iconCls: 'upload-icon'}
                        },
                        {xtype : 'displayfield',value:'*.图片名不能重名<br/>*.压缩文件最大不要超过50M'}]
                    })
                ],
                buttons : [{
                        text : '上 传',
                        scope:this,
                        handler : function() {
                            uploadImagesWindow     =this;
                            validationExpression =/([\u4E00-\u9FA5]|\w)+(.zip|.ZIP)$/;
                            var isValidExcelFormat = new RegExp(validationExpression);
                            var result             = isValidExcelFormat.test(this.uploadForm.upload_file.getValue());
                            if (!result){
                                Ext.Msg.alert('提示', '请上传ZIP文件，后缀名为zip！');
                                return;
                            }
                            var uploadImageUrl='index.php?go=admin.upload.uploadActivityImagess';

                            if (this.uploadForm.getForm().isValid()) {
                                Ext.Msg.show({
                                    title : '请等待',msg : '文件正在上传中，请稍后...',
                                    animEl : 'loading',icon : Ext.Msg.WARNING,
                                    closable : true,progress : true,progressText : '',width : 300
                                });
                                this.uploadForm.getForm().submit({
                                    url : uploadImageUrl,
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadImagesWindow.hide();
                                        uploadImagesWindow.uploadForm.upload_file.setValue('');
                                        Km.Activity.View.Running.activityGrid.doSelectActivity();
                                    },
                                    failure : function(form, response) {
                                        if (response.result&&response.result.data){
                                            Ext.Msg.alert('错误', response.result.data);
                                        }
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
            Km.Activity.View.BatchUploadImagesWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：活动列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Activity.Store.activityStore,
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
                        {header : '标识',dataIndex : 'activity_id',hidden:true},
                        {header : '活动名称',dataIndex : 'name'},
                        {header : '开始时间',dataIndex : 'start_time',renderer:Ext.util.Format.dateRenderer('Y-m-d')},
                        {header : '结束时间',dataIndex : 'end_time',renderer:Ext.util.Format.dateRenderer('Y-m-d')}
                    ]
                }),
                tbar : {
                    xtype : 'container',layout : 'anchor',autoScroll : true,height : 27 * 2,style:'font-size:14px',
                    defaults : {
                        height : 27,anchor : '100%',autoScroll : true,autoHeight : true
                    },
                    items : [
                        new Ext.Toolbar({
                            enableOverflow: true,width : 100,
                            defaults : {
                                xtype : 'textfield',
                                listeners : {
                                    specialkey : function(field, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectActivity();
                                    }
                                }
                            },
                            items : [
                                '活动名称','&nbsp;&nbsp;',{ref: '../aname'},'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectActivity();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.aname.setValue("");
                                        this.filter={};
                                        this.doSelectActivity();
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
                                    text : '添加活动',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addActivity();
                                    }
                                },'-',{
                                    text : '修改活动',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateActivity();
                                    }
                                },'-',{
                                    text : '删除活动', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteActivity();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importActivity();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入活动',iconCls : 'icon-import',scope:this,handler:function(){this.importActivity()}},
                                            {text:'批量导入活动图片',iconCls : 'icon-import',scope:this,handler:function(){this.batchUploadImages("upload_images_files","活动图片")}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportActivity();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看活动', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showActivity()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideActivity();Km.Activity.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Activity.Cookie.set('View.IsFix',Km.Activity.Config.View.IsFix);}}
                                        ]
                                    }
                                },'-'
                            ]
                        }
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Activity.Config.PageSize,
                    store: Km.Activity.Store.activityStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Activity.Viewport){
                                if (Km.Activity.Config.View.IsShow==1){
                                    Km.Activity.View.IsSelectView=1;
                                }
                                this.ownerCt.hideActivity();
                                Km.Activity.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Activity.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Activity.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Activity.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectActivity();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Activity.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Activity.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectActivity();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示活动列表
            this.doSelectActivity();
            Km.Activity.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的活动信息Tab页
            Km.Activity.View.Running.viewTabs=new Km.Activity.View.ActivityView.Tabs();
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
                        this.grid.hideActivity();
                        Km.Activity.Config.View.IsShow=0;
                    }else{
                        if (Km.Activity.View.IsSelectView==1){
                            Km.Activity.View.IsSelectView=0;
                            this.grid.showActivity();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Activity.Config.View.IsShow==1){
                            Km.Activity.View.IsSelectView=1;
                        }
                        this.grid.hideActivity();
                        Km.Activity.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Activity.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showActivity();
                this.tvpView.toggle(true);
            }else{
                this.hideActivity();
                Km.Activity.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
                Km.Activity.Config.View.IsFix=1;
            }else{
                Km.Activity.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Activity.Config.View.IsShow=0;
                return ;
            }
            if (Km.Activity.Config.View.IsShow==1){
                this.hideActivity();
                Km.Activity.Config.View.IsShow=0;
            }
            this.showActivity();
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
         * 查询符合条件的活动
         */
        doSelectActivity : function() {
            if (this.topToolbar){
                var aname = this.topToolbar.aname.getValue();
                this.filter    = {'name':aname};
            }
            var condition = {'start':0,'limit':Km.Activity.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceActivity.queryPageActivity(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result             = new Array();
                    result['data']         = response.result.data;
                    result['totalCount'] = response.result.totalCount;
                    Km.Activity.Store.activityStore.loadData(result);
                } else {
                    Km.Activity.Store.activityStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的活动！');
                }
            });
        },
        /**
         * 显示活动视图
         * 显示活动的视图相对活动列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Activity.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Activity.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Activity.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Activity.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Activity.View.Running.viewTabs);
                    break;
            }
            Km.Activity.Cookie.set('View.Direction',Km.Activity.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Activity.Config.View.IsFix==0)&&(Km.Activity.Config.View.IsShow==1)){
                    this.showActivity();
                }
                Km.Activity.Config.View.IsFix=1;
                Km.Activity.View.Running.activityGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Activity.Config.View.IsShow=0;
                this.showActivity();
            }
        },
        /**
         * 显示活动
         */
        showActivity : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择活动！');
                Km.Activity.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Activity.Config.View.IsFix==0){
                if (Km.Activity.View.Running.view_window==null){
                    Km.Activity.View.Running.view_window=new Km.Activity.View.ActivityView.Window();
                }
                if (Km.Activity.View.Running.view_window.hidden){
                    Km.Activity.View.Running.view_window.show();
                    Km.Activity.View.Running.view_window.winTabs.hideTabStripItem(Km.Activity.View.Running.view_window.winTabs.tabFix);
                    this.updateViewActivity();
                    this.tvpView.toggle(true);
                    Km.Activity.Config.View.IsShow=1;
                }else{
                    this.hideActivity();
                    Km.Activity.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Activity.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Activity.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Activity.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Activity.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Activity.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Activity.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Activity.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Activity.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Activity.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideActivity();
            if (Km.Activity.Config.View.IsShow==0){
                Km.Activity.View.Running.viewTabs.enableCollapse();
                switch(Km.Activity.Config.View.Direction){
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
                this.updateViewActivity();
                this.tvpView.toggle(true);
                Km.Activity.Config.View.IsShow=1;
            }else{
                Km.Activity.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏活动
         */
        hideActivity : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Activity.View.Running.view_window!=null){
                Km.Activity.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前活动显示信息
         */
        updateViewActivity : function() {
            Km.Activity.View.Running.productGrid.doSelectProduct();
            if (Km.Activity.View.Running.view_window!=null){
                Km.Activity.View.Running.view_window.winTabs.tabActivityDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Activity.View.Running.viewTabs.tabActivityDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建活动
         */
        addActivity : function() {
            if (Km.Activity.View.Running.edit_window==null){
                Km.Activity.View.Running.edit_window=new Km.Activity.View.EditWindow();
            }
            Km.Activity.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Activity.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Activity.View.Running.edit_window.setTitle('添加活动');
            Km.Activity.View.Running.edit_window.savetype=0;
            Km.Activity.View.Running.edit_window.activity_id.setValue("");
            Km.Activity.View.Running.edit_window.imagesUpload.setValue("");
            switch (Km.Activity.Config.OnlineEditor)
            {
                case 1:
                    if (CKEDITOR.instances.intro)CKEDITOR.instances.intro.setData("");
                    break
                case 2:
                    if (Km.Activity.View.EditWindow.KindEditor_intro)Km.Activity.View.EditWindow.KindEditor_intro.html("");
                    break
                case 3:
                    break
                default:
                    if (ue_intro)ue_intro.setContent("");
            }

            Km.Activity.View.Running.edit_window.show();
            Km.Activity.View.Running.edit_window.maximize();
        },
        /**
         * 编辑活动时先获得选中的活动信息
         */
        updateActivity : function() {
            if (Km.Activity.View.Running.edit_window==null){
                Km.Activity.View.Running.edit_window=new Km.Activity.View.EditWindow();
            }
            Km.Activity.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Activity.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Activity.View.Running.edit_window.setTitle('修改活动');
            Km.Activity.View.Running.edit_window.savetype=1;

            Km.Activity.View.Running.edit_window.show();
            Km.Activity.View.Running.edit_window.maximize();

            Km.Activity.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Activity.View.Running.edit_window.imagesUpload.setValue(Km.Activity.View.Running.edit_window.images.getValue());
            var data = this.getSelectionModel().getSelected().data;
            switch (Km.Activity.Config.OnlineEditor)
            {
                case 1:
                    if (CKEDITOR.instances.intro)CKEDITOR.instances.intro.setData(data.intro);
                    break
                case 2:
                    if (Km.Activity.View.EditWindow.KindEditor_intro)Km.Activity.View.EditWindow.KindEditor_intro.html(data.intro);
                    break
                case 3:
                    if (xhEditor_intro)xhEditor_intro.setSource(data.intro);
                    break
                default:
                    if (ue_intro)ue_intro.ready(function(){ue_intro.setContent(data.intro);});
            }

        },
        /**
         * 删除活动
         */
        deleteActivity : function() {
            Ext.Msg.confirm('提示', '确认要删除所选的活动吗?', this.confirmDeleteActivity,this);
        },
        /**
         * 确认删除活动
         */
        confirmDeleteActivity : function(btn) {
            if (btn == 'yes') {
                var del_activity_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_activity_ids=del_activity_ids+selectedRows[flag].data.activity_id+",";
                }
                ExtServiceActivity.deleteByIds(del_activity_ids);
                this.doSelectActivity();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出活动
         */
        exportActivity : function() {
            ExtServiceActivity.exportActivity(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入活动
         */
        importActivity : function() {
            if (Km.Activity.View.current_uploadWindow==null){
                Km.Activity.View.current_uploadWindow=new Km.Activity.View.UploadWindow();
            }
            Km.Activity.View.current_uploadWindow.show();
        },
        /**
         * 批量上传商品图片
         */
        batchUploadImages:function(inputname,title){
            if (Km.Activity.View.Running.batchUploadImagesWindow==null){
                Km.Activity.View.Running.batchUploadImagesWindow=new Km.Activity.View.BatchUploadImagesWindow();
            }

            Km.Activity.View.Running.batchUploadImagesWindow.setTitle("批量上传"+title);
            Km.Activity.View.Running.batchUploadImagesWindow.uploadForm.upload_file.name=inputname;
            Km.Activity.View.Running.batchUploadImagesWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Activity.View.Running.activityGrid=new Km.Activity.View.Grid();
            if (Km.Activity.Config.View.IsFix==0){
                Km.Activity.View.Running.activityGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Activity.View.Running.activityGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Activity.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Activity.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前活动Grid对象
         */
        activityGrid:null,
        /**
         * 当前商品Grid对象
         */
        productGrid:null,
        /**
         * 显示活动信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Activity.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Activity.Init();
    /**
     * 活动数据模型获取数据Direct调用
     */
    Km.Activity.Store.activityStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceActivity.queryPageActivity}
    });
    /**
     * 活动页面布局
     */
    Km.Activity.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Activity.View.Panel()]
    });
    Km.Activity.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
