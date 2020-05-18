Ext.namespace("Kmall.Admin.Country");
Km = Kmall.Admin;
Km.Country={
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
             * 显示国家的视图相对国家列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示国家信息页(或者打开新窗口)
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
        if (Km.Country.Cookie.get('View.Direction')){
            Km.Country.Config.View.Direction=Km.Country.Cookie.get('View.Direction');
        }
        if (Km.Country.Cookie.get('View.IsFix')!=null){
            Km.Country.Config.View.IsFix=Km.Country.Cookie.get('View.IsFix');
        }
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.Country.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }

    }
};
/**
 * Model:数据模型
 */
Km.Country.Store = {
    /**
     * 国家
     */
    countryStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'country_id',type: 'int'},
                {name: 'name',type: 'string'},
                {name: 'thumbnail',type: 'string'},
                {name: 'flagimage',type: 'string'},
                {name: 'images',type: 'string'},
                {name: 'url',type: 'string'},
                {name: 'isShow',type: 'string'},
                {name: 'sort_order',type: 'int'},
                {name: 'introduction',type: 'string'},
                {name: 'introductionShow',type:'string'}
            ]
        }),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Country.Config.PageSize;
                    Ext.apply(options.params, Km.Country.View.Running.countryGrid.filter);//保证分页也将查询条件带上
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
                    if (!options.params.limit)options.params.limit=Km.Country.Config.PageSize;
                    Ext.apply(options.params, Km.Country.View.Running.productGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 供应商
     */
    supplierStoreForCombo:new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/supplier.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'suppliers',
            autoLoad: true,
            totalProperty: 'totalCount',
            idProperty: 'supplier_id'
        }, [
            {name: 'supplier_id', mapping: 'supplier_id'},
            {name: 'sp_name', mapping: 'sp_name'}
        ])
    }),
    /**
     * 品牌
     */
    brandStoreForCombo:new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/brand.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'brands',
            autoLoad: true,
            totalProperty: 'totalCount',
            idProperty: 'brand_id'
        }, [
            {name: 'brand_id', mapping: 'brand_id'},
            {name: 'brand_name', mapping: 'brand_name'}
        ])
    })
};
/**
 * View:国家显示组件
 */
Km.Country.View={
    /**
     * 编辑窗口：新建或者修改国家
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
                        switch (Km.Country.Config.OnlineEditor)
                        {
                            case 1:
                                ckeditor_replace_introduction();
                                break
                            case 2:
                                Km.Country.View.EditWindow.KindEditor_introduction = KindEditor.create('textarea[name="introduction"]',{width:'98%',minHeith:'350px', filterMode:true});
                                break
                            case 3:
                                pageInit_introduction();
                                break
                            default:
                                this.editForm.introduction.setWidth("98%");
                                pageInit_ue_introduction();
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
                            {xtype: 'hidden',name : 'country_id',ref:'../country_id'},
                            {fieldLabel : '国家名称(<font color=red>*</font>)',name : 'name',allowBlank : false},
                            {xtype: 'hidden',name : 'thumbnail',ref:'../thumbnail'},
                            {fieldLabel : '缩略图',name : 'thumbnailUpload',ref:'../thumbnailUpload',xtype:'fileuploadfield',
                            emptyText: '请上传缩略图文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {xtype: 'hidden',name : 'flagimage',ref:'../flagimage'},
                            {fieldLabel : '国旗图片',name : 'flagimageUpload',ref:'../flagimageUpload',xtype:'fileuploadfield',
                            emptyText: '请上传国旗图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {xtype: 'hidden',name : 'images',ref:'../images'},
                            {fieldLabel : '风景图片',name : 'imagesUpload',ref:'../imagesUpload',xtype:'fileuploadfield',
                            emptyText: '请上传风景图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {fieldLabel : '链接地址',name : 'url'},
                            {fieldLabel : '是否显示',hiddenName : 'isShow'
                                 ,xtype:'combo',ref:'../isShow',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否显示',
                                 valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '排序',name : 'sort_order',xtype : 'numberfield'},
                            {fieldLabel : '介绍',name : 'introduction',xtype : 'textarea',id:'introduction',ref:'introduction'}
                        ]
                    })
                ],
                buttons : [{
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {
                        switch (Km.Country.Config.OnlineEditor)
                        {
                            case 1:
                                if (CKEDITOR.instances.introduction)this.editForm.introduction.setValue(CKEDITOR.instances.introduction.getData());
                                break
                            case 2:
                                if (Km.Country.View.EditWindow.KindEditor_introduction)this.editForm.introduction.setValue(Km.Country.View.EditWindow.KindEditor_introduction.html());
                                break
                            case 3:
                                if (xhEditor_introduction)this.editForm.introduction.setValue(xhEditor_introduction.getSource());
                                break
                            default:
                                if (ue_introduction)this.editForm.introduction.setValue(ue_introduction.getContent());
                        }

                        if (!this.editForm.getForm().isValid()) {
                            return;
                        }
                        editWindow=this;
                        if (this.savetype==0){
                            this.editForm.api.submit=ExtServiceCountry.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Country.View.Running.countryGrid.doSelectCountry();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, response) {
                                    Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceCountry.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.Country.View.Running.countryGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Country.View.Running.countryGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Country.View.Running.countryGrid.getSelectionModel().getSelected());
                        this.thumbnailUpload.setValue(this.thumbnail.getValue());
                        this.flagimageUpload.setValue(this.flagimage.getValue());
                        this.imagesUpload.setValue(this.images.getValue());
                        switch (Km.Country.Config.OnlineEditor)
                        {
                            case 1:
                                if (CKEDITOR.instances.introduction)CKEDITOR.instances.introduction.setData(Km.Country.View.Running.countryGrid.getSelectionModel().getSelected().data.introduction);
                                break
                            case 2:
                                if (Km.Country.View.EditWindow.KindEditor_introduction)Km.Country.View.EditWindow.KindEditor_introduction.html(Km.Country.View.Running.countryGrid.getSelectionModel().getSelected().data.introduction);
                                break
                            case 3:
                                if (xhEditor_introduction)xhEditor_introduction.setSource(Km.Country.View.Running.countryGrid.getSelectionModel().getSelected().data.introduction);
                                break
                            default:
                                if (ue_introduction)ue_introduction.setContent(Km.Country.View.Running.countryGrid.getSelectionModel().getSelected().data.introduction);
                        }

                    }
                }]
            }, config);
            Km.Country.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示国家详情
     */
    CountryView:{
        /**
         * Tab页：容器包含显示与国家所有相关的信息
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
                                if (Km.Country.View.Running.countryGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择国家！');
                                    return false;
                                }
                                Km.Country.Config.View.IsShow=1;
                                Km.Country.View.Running.countryGrid.showCountry();
                                Km.Country.View.Running.countryGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Country.View.CountryView.Tabs.superclass.constructor.call(this, config);
                Km.Country.View.Running.productGrid=new Km.Country.View.ProductView.Grid();
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Country.Config.View.Direction==1)||(Km.Country.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabCountryDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">国家名称</td><td class="content">{name}</td></tr>',
                         '    <tr class="entry"><td class="head">缩略图路径</td><td class="content">{thumbnail}</td></tr>',
                         '    <tr class="entry"><td class="head">缩略图</td><td class="content"><tpl if="thumbnail"><a href="upload/images/{thumbnail}" target="_blank"><img src="upload/images/{thumbnail}" /></a></tpl></td></tr>',
                         '    <tr class="entry"><td class="head">国旗图片路径</td><td class="content">{flagimage}</td></tr>',
                         '    <tr class="entry"><td class="head">国旗图片</td><td class="content"><tpl if="flagimage"><a href="upload/images/{flagimage}" target="_blank"><img src="upload/images/{flagimage}" /></a></tpl></td></tr>',
                         '    <tr class="entry"><td class="head">风景图片路径</td><td class="content">{images}</td></tr>',
                         '    <tr class="entry"><td class="head">风景图片</td><td class="content"><tpl if="images"><a href="upload/images/{images}" target="_blank"><img src="upload/images/{images}" /></a></tpl></td></tr>',
                         '    <tr class="entry"><td class="head">链接地址</td><td class="content">{url}</td></tr>',
                         '    <tr class="entry"><td class="head">是否显示</td><td class="content"><tpl if="isShow == true">是</tpl><tpl if="isShow == false">否</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">排序</td><td class="content">{sort_order}</td></tr>',
                         '    <tr class="entry"><td class="head">介绍</td><td class="content">{introductionShow}</td></tr>',
                         '</table>'
                     ]}
                );
                this.add(
                    {title: '商品',iconCls:'tabs',tabWidth:150,
                     items:[Km.Country.View.Running.productGrid]
                    }
                );
            }
        }),
        /**
         * 窗口:显示国家信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看国家",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Country.View.CountryView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Country.Config.View.IsShow=0;
                            Km.Country.View.Running.countryGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Country.Config.View.IsShow=0;
                            Km.Country.View.Running.countryGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增国家',scope:this,
                        handler : function() {this.hide();Km.Country.View.Running.countryGrid.addCountry();}
                    },{
                        text: '修改国家',scope:this,
                        handler : function() {this.hide();Km.Country.View.Running.countryGrid.updateCountry();}
                    }]
                }, config);
                Km.Country.View.CountryView.Window.superclass.constructor.call(this, config);
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
                            switch (Km.Country.Config.OnlineEditor)
                            {
                                case 1:
                                    ckeditor_replace_specification();
                                    ckeditor_replace_intro();
                                    break
                                case 2:
                                    Km.Country.View.ProductView.EditWindow.KindEditor_specification = KindEditor.create('textarea[name="specification"]',{width:'98%',minHeith:'350px', filterMode:true});
                                    Km.Country.View.ProductView.EditWindow.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
                                    break
                                case 3:
                                    pageInit_specification();
                                    pageInit_intro();
                                    break
                                default:
                                    this.editForm.specification.setWidth("98%");
                                    pageInit_ue_specification();
                                    this.editForm.intro.setWidth("98%");
                                    pageInit_ue_intro();
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
                                {xtype: 'hidden',name : 'product_id',ref:'../product_id'},
                                {fieldLabel : '商品',name : 'product_code'},
                                {fieldLabel : '货品内部',name : 'goods_no'},
                                {fieldLabel : '是否大礼包',hiddenName : 'isPackage'
                                     ,xtype:'combo',ref:'../isPackage',mode : 'local',triggerAction : 'all',
                                     lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                     store : new Ext.data.SimpleStore({
                                         fields : ['value', 'text'],
                                         data : [['0', '否'], ['1', '是']]
                                     }),emptyText: '请选择是否大礼包',
                                     valueField : 'value',displayField : 'text'
                                },
                                {xtype: 'hidden',name : 'supplier_id',ref:'../supplier_id'},
                                {
                                     fieldLabel : '供货商',xtype: 'combo',name : 'sp_name',ref : '../sp_name',
                                     store:Km.Country.Store.supplierStoreForCombo,emptyText: '请选择供货商',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width: 570, pageSize:Km.Country.Config.PageSize,
                                     displayField:'sp_name',grid:this,
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                         '<tpl for="."><div class="search-item">',
                                             '<h3>{sp_name}</h3>',
                                         '</div></tpl>'
                                     ),
                                     listeners:{
                                         'beforequery': function(event){delete event.combo.lastQuery;}
                                     },
                                     onSelect:function(record,index){
                                         if(this.fireEvent('beforeselect', this, record, index) !== false){
                                            this.grid.supplier_id.setValue(record.data.supplier_id);
                                            this.grid.sp_name.setValue(record.data.sp_name);
                                            this.collapse();
                                         }
                                     }
                                },
                                {fieldLabel : '供应商类型',hiddenName : 'sptype'    ,xtype:'combo',ref:'../sptype',
                                    mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                    store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['1', '渠道商'],[' 0', '普通供应商']]
                                    }),emptyText: '请选择供应商类型',
                                    valueField : 'value',displayField : 'text'
                                },
                                {xtype: 'hidden',name : 'ptype_id',ref:'../ptype_id'},
                                {
                                    xtype: 'compositefield',ref: '../ptypecomp',
                                    items: [
                                        {
                                            xtype:'combotree', fieldLabel:'商品类型',ref:'ptype_name',name: 'ptype_name',grid:this,
                                            emptyText: '请选择商品类型',canFolderSelect:true,flex:1,editable:false,
                                            tree: new Ext.tree.TreePanel({
                                                dataUrl: 'home/admin/src/httpdata/ptypeTree.php',
                                                root: {nodeType: 'async'},border: false,rootVisible: false,
                                                listeners: {
                                                    beforeload: function(n) {if (n) {this.getLoader().baseParams.id = n.attributes.id;}}
                                                }
                                            }),
                                            onSelect: function(cmb, node) {
                                                this.grid.ptype_id.setValue(node.attributes.id);
                                                this.setValue(node.attributes.text);
                                            }
                                        },
                                        {xtype:'button',text : '修改商品类型',ref: 'btnModify',iconCls : 'icon-edit',
                                         handler:function(){
                                             this.setVisible(false);
                                             this.ownerCt.ownerCt.ptype_name.setVisible(true);
                                             this.ownerCt.ownerCt.ptypeShowLabel.setVisible(true);
                                             this.ownerCt.ownerCt.ptypeShowValue.setVisible(true);
                                             this.ownerCt.ownerCt.doLayout();
                                        }},
                                        {xtype:'displayfield',value:'所选商品类型:',ref: 'ptypeShowLabel'},{xtype:'displayfield',name:'ptypeShowAll',flex:1,ref: 'ptypeShowValue'}]
                                },
                                {fieldLabel : '商品分类查询字',name : 'ptype_key'},
                                {fieldLabel : '商品名称',name : 'product_name'},
                                {xtype: 'hidden',name : 'brand_id',ref:'../brand_id'},
                                {
                                     fieldLabel : '商品品牌',xtype: 'combo',name : 'brand_name',ref : '../brand_name',
                                     store:Km.Country.Store.brandStoreForCombo,emptyText: '请选择商品品牌',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width: 570, pageSize:Km.Country.Config.PageSize,
                                     displayField:'brand_name',grid:this,
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                         '<tpl for="."><div class="search-item">',
                                             '<h3>{brand_name}</h3>',
                                         '</div></tpl>'
                                     ),
                                     listeners:{
                                         'beforequery': function(event){delete event.combo.lastQuery;}
                                     },
                                     onSelect:function(record,index){
                                         if(this.fireEvent('beforeselect', this, record, index) !== false){
                                            this.grid.brand_id.setValue(record.data.brand_id);
                                            this.grid.brand_name.setValue(record.data.brand_name);
                                            this.collapse();
                                         }
                                     }
                                },
                                {fieldLabel : '左侧广告词',name : 'msgleft'},
                                {fieldLabel : '右侧广告词',name : 'msgright'},
                                {fieldLabel : '广告词',name : 'message'},
                                {fieldLabel : '销售价',name : 'price',xtype : 'numberfield'},
                                {fieldLabel : '商品价格标签(如商城价、预售价等）',name : 'price_tag'},
                                {fieldLabel : '市场价',name : 'market_price',xtype : 'numberfield'},
                                {fieldLabel : '成本价',name : 'cost',xtype : 'numberfield'},
                                {fieldLabel : '折扣',name : 'discount'},
                                {fieldLabel : '商品规格',name : 'specification',xtype : 'textarea',id:'specification',ref:'specification'},
                                {fieldLabel : '商品属性',name : 'attr_key'},
                                {xtype: 'hidden',name : 'image',ref:'../image'},
                                {fieldLabel : '商品图片',name : 'imageUpload',ref:'../imageUpload',xtype:'fileuploadfield',
                                emptyText: '请上传商品图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                                {xtype: 'hidden',name : 'image_large',ref:'../image_large'},
                                {fieldLabel : '商品超大图片',name : 'image_largeUpload',ref:'../image_largeUpload',xtype:'fileuploadfield',
                                emptyText: '请上传商品超大图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                                {fieldLabel : '商品量词',name : 'unit'},
                                {fieldLabel : '标签如热卖标签，标签名之间以-隔开。',name : 'tag_types'},
                                {fieldLabel : '券',name : 'market_jifen',xtype : 'numberfield'},
                                {fieldLabel : '原券',name : 'jifen',xtype : 'numberfield'},
                                {fieldLabel : '规格',name : 'scale'},
                                {fieldLabel : '数量',name : 'num',xtype : 'numberfield'},
                                {fieldLabel : '重量',name : 'weight',xtype : 'numberfield'},
                                {fieldLabel : '最低库存警报',name : 'low_alarm',xtype : 'numberfield'},
                                {fieldLabel : '单价',name : 'in_price',xtype : 'numberfield'},
                                {fieldLabel : '平台价',name : 'recommend_price',xtype : 'numberfield'},
                                {fieldLabel : '批发价格',name : 'good_price',xtype : 'numberfield'},
                                {fieldLabel : '商品介绍',name : 'intro',xtype : 'textarea',id:'intro',ref:'intro'},
                                {fieldLabel : '销售量',name : 'sales_count',xtype : 'numberfield'},
                                {fieldLabel : '热度',name : 'click_count',xtype : 'numberfield'},
                                {fieldLabel : '排序权重越大，越靠前',name : 'sort_order',xtype : 'numberfield'},
                                {fieldLabel : '是否显示',hiddenName : 'isShow'
                                     ,xtype:'combo',ref:'../isShow',mode : 'local',triggerAction : 'all',
                                     lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                     store : new Ext.data.SimpleStore({
                                         fields : ['value', 'text'],
                                         data : [['0', '否'], ['1', '是']]
                                     }),emptyText: '请选择是否显示',
                                     valueField : 'value',displayField : 'text'
                                },
                                {fieldLabel : '是否上架',name : 'isUp',xtype : 'numberfield'},
                                {fieldLabel : '上架时间',name : 'uptime',xtype : 'datefield',format : "Y-m-d"},
                                {fieldLabel : '下架时间',name : 'downtime',xtype : 'datefield',format : "Y-m-d"},
                                {fieldLabel : '是否推荐',hiddenName : 'isRecommend'
                                     ,xtype:'combo',ref:'../isRecommend',mode : 'local',triggerAction : 'all',
                                     lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                     store : new Ext.data.SimpleStore({
                                         fields : ['value', 'text'],
                                         data : [['0', '否'], ['1', '是']]
                                     }),emptyText: '请选择是否推荐',
                                     valueField : 'value',displayField : 'text'
                                },
                                {fieldLabel : '是否多规格 (默认为否)',hiddenName : 'isMultiplespec'
                                     ,xtype:'combo',ref:'../isMultiplespec',mode : 'local',triggerAction : 'all',
                                     lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                     store : new Ext.data.SimpleStore({
                                         fields : ['value', 'text'],
                                         data : [['0', '否'], ['1', '是']]
                                     }),emptyText: '请选择是否多规格 (默认为否)',
                                     valueField : 'value',displayField : 'text'
                                },
                                {fieldLabel : '是否为赠品 (默认为否)',hiddenName : 'isGiveaway'
                                     ,xtype:'combo',ref:'../isGiveaway',mode : 'local',triggerAction : 'all',
                                     lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                     store : new Ext.data.SimpleStore({
                                         fields : ['value', 'text'],
                                         data : [['0', '否'], ['1', '是']]
                                     }),emptyText: '请选择是否为赠品 (默认为否)',
                                     valueField : 'value',displayField : 'text'
                                },
                                {xtype: 'hidden',name : 'country_id',ref:'../country_id'}
                            ]
                        })
                    ],
                    buttons : [{
                        text: "",ref : "../saveBtn",scope:this,
                        handler : function() {
                            switch (Km.Country.Config.OnlineEditor)
                            {
                                case 1:
                                    if (CKEDITOR.instances.specification)this.editForm.specification.setValue(CKEDITOR.instances.specification.getData());
                                    if (CKEDITOR.instances.intro)this.editForm.intro.setValue(CKEDITOR.instances.intro.getData());
                                    break
                                case 2:
                                    if (Km.Country.View.ProductView.EditWindow.KindEditor_specification)this.editForm.specification.setValue(Km.Country.View.ProductView.EditWindow.KindEditor_specification.html());
                                    if (Km.Country.View.ProductView.EditWindow.KindEditor_intro)this.editForm.intro.setValue(Km.Country.View.ProductView.EditWindow.KindEditor_intro.html());
                                    break
                                case 3:
                                    if (xhEditor_specification)this.editForm.specification.setValue(xhEditor_specification.getSource());
                                    if (xhEditor_intro)this.editForm.intro.setValue(xhEditor_intro.getSource());
                                    break
                                default:
                                    if (ue_specification)this.editForm.specification.setValue(ue_specification.getContent());
                                    if (ue_intro)this.editForm.intro.setValue(ue_intro.getContent());
                            }

                            if (!this.editForm.getForm().isValid()) {
                                return;
                            }
                            editWindow=this;
                            if (this.savetype==0){
                                this.editForm.api.submit=ExtServiceProduct.save;
                                this.editForm.getForm().submit({
                                    success : function(form, action) {
                                        Ext.Msg.alert("提示", "保存成功！");
                                        Km.Country.View.Running.productGrid.doSelectProduct();
                                        form.reset();
                                        editWindow.hide();
                                    },
                                    failure : function(form, response) {
                                        Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
                                    }
                                });
                            }else{
                                this.editForm.api.submit=ExtServiceProduct.update;
                                this.editForm.getForm().submit({
                                    success : function(form, action) {
                                        Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                            Km.Country.View.Running.productGrid.bottomToolbar.doRefresh();
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
                            this.editForm.form.loadRecord(Km.Country.View.Running.productGrid.getSelectionModel().getSelected());
                            this.imageUpload.setValue(this.image.getValue());
                            this.image_largeUpload.setValue(this.image_large.getValue());
                            switch (Km.Country.Config.OnlineEditor)
                            {
                                case 1:
                                    if (CKEDITOR.instances.specification)CKEDITOR.instances.specification.setData(Km.Country.View.Running.productGrid.getSelectionModel().getSelected().data.specification);
                                    if (CKEDITOR.instances.intro)CKEDITOR.instances.intro.setData(Km.Country.View.Running.productGrid.getSelectionModel().getSelected().data.intro);
                                    break
                                case 2:
                                    if (Km.Country.View.ProductView.EditWindow.KindEditor_specification)Km.Country.View.ProductView.EditWindow.KindEditor_specification.html(Km.Country.View.Running.productGrid.getSelectionModel().getSelected().data.specification);
                                    if (Km.Country.View.ProductView.EditWindow.KindEditor_intro)Km.Country.View.ProductView.EditWindow.KindEditor_intro.html(Km.Country.View.Running.productGrid.getSelectionModel().getSelected().data.intro);
                                    break
                                case 3:
                                    if (xhEditor_specification)xhEditor_specification.setSource(Km.Country.View.Running.productGrid.getSelectionModel().getSelected().data.specification);
                                    if (xhEditor_intro)xhEditor_intro.setSource(Km.Country.View.Running.productGrid.getSelectionModel().getSelected().data.intro);
                                    break
                                default:
                                    if (ue_specification)ue_specification.setContent(Km.Country.View.Running.productGrid.getSelectionModel().getSelected().data.specification);
                                    if (ue_intro)ue_intro.setContent(Km.Country.View.Running.productGrid.getSelectionModel().getSelected().data.intro);
                            }

                        }
                    }]
                }, config);
                Km.Country.View.ProductView.EditWindow.superclass.constructor.call(this, config);
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
                    store : Km.Country.Store.productStore,sm : this.sm,
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
                            {header : '商品',dataIndex : 'product_code'},
                            {header : '供货商',dataIndex : 'sp_name'},
                            {header : '商品类型',dataIndex : 'ptype_name'},
                            {header : '商品名称',dataIndex : 'product_name'},
                            {header : '商品品牌',dataIndex : 'brand_name'},
                            {header : '销售价',dataIndex : 'price'},
                            {header : '市场价',dataIndex : 'market_price'},
                            {header : '成本价',dataIndex : 'cost'},
                            {header : '券',dataIndex : 'jifen'},
                            {header : '排序',dataIndex : 'sort_order'},
                            {header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                            {header : '是否大礼包',dataIndex : 'isPackage',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                            {header : '是否上架',dataIndex : 'isUp'}
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
                                    // ,{
                                    //     text : '添加商品',iconCls : 'icon-add',
                                    //     handler : function() {
                                    //         this.addProduct();
                                    //     }
                                    // },'-',{
                                    //     text : '修改商品',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    //     handler : function() {
                                    //         this.updateProduct();
                                    //     }
                                    // },'-',{
                                    //     text : '删除商品', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    //     handler : function() {
                                    //         this.deleteProduct();
                                    //     }
                                    // },'-'
                                ]}
                            )
                        ]
                    },
                    bbar: new Ext.PagingToolbar({
                        pageSize: Km.Country.Config.PageSize,
                        store: Km.Country.Store.productStore,scope:this,autoShow:true,displayInfo: true,
                        displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',emptyMsg: "无显示数据",
                        items: [
                            {xtype:'label', text: '每页显示'},
                            {xtype:'numberfield', value:Km.Country.Config.PageSize,minValue:1,width:35,style:'text-align:center',allowBlank: false,
                                listeners:
                                {
                                    change:function(Field, newValue, oldValue){
                                        var num = parseInt(newValue);
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Country.Config.PageSize;
                                            Field.setValue(num);
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Country.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectProduct();
                                    },
                                    specialKey :function(field,e){
                                        if (e.getKey() == Ext.EventObject.ENTER){
                                            var num = parseInt(field.getValue());
                                            if (isNaN(num) || !num || num<1)num = Km.Country.Config.PageSize;
                                            this.ownerCt.pageSize= num;
                                            Km.Country.Config.PageSize = num;
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
                Km.Country.Store.productStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceProduct.queryPageProduct}
                });
                Km.Country.View.ProductView.Grid.superclass.constructor.call(this, config);
            },
            /**
             * 行选择器
             */
            sm : new Ext.grid.CheckboxSelectionModel({
                listeners : {
                    selectionchange:function(sm) {
                        // 判断删除和更新按钮是否可以激活
                        this.grid.btnRemove.setDisabled(sm.getCount() < 1);
                        this.grid.btnUpdate.setDisabled(sm.getCount() != 1);
                    }
                }
            }),
            /**
             * 查询符合条件的商品
             */
            doSelectProduct : function() {
                if (Km.Country.View.Running.countryGrid&&Km.Country.View.Running.countryGrid.getSelectionModel().getSelected()){
                    var country_id = Km.Country.View.Running.countryGrid.getSelectionModel().getSelected().data.country_id;
                    var condition = {'country_id':country_id,'start':0,'limit':Km.Country.Config.PageSize};
                    this.filter      = {'country_id':country_id};
                    ExtServiceProduct.queryPageProduct(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result             = new Array();
                                result['data']         =response.result.data;
                                result['totalCount'] =response.result.totalCount;
                                Km.Country.Store.productStore.loadData(result);
                            } else {
                                Km.Country.Store.productStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的商品！');
                            }

                            if (Km.Country.Store.productStore.getTotalCount()>Km.Country.Config.PageSize){
                                 Km.Country.View.Running.productGrid.bottomToolbar.show();
                            }else{
                                 Km.Country.View.Running.productGrid.bottomToolbar.hide();
                            }
                            Km.Country.View.Running.countryGrid.ownerCt.doLayout();
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
                if (Km.Country.View.ProductView.edit_window==null){
                    Km.Country.View.ProductView.edit_window=new Km.Country.View.ProductView.EditWindow();
                }
                Km.Country.View.ProductView.edit_window.resetBtn.setVisible(false);
                Km.Country.View.ProductView.edit_window.saveBtn.setText('保 存');
                Km.Country.View.ProductView.edit_window.setTitle('添加商品');
                Km.Country.View.ProductView.edit_window.savetype=0;
                Km.Country.View.ProductView.edit_window.product_id.setValue("");
                var country_id = Km.Country.View.Running.countryGrid.getSelectionModel().getSelected().data.country_id;
                Km.Country.View.ProductView.edit_window.country_id.setValue(country_id);
                Km.Country.View.Running.edit_window.imageUpload.setValue("");
                Km.Country.View.Running.edit_window.image_largeUpload.setValue("");
                switch (Km.Country.Config.OnlineEditor)
                {
                    case 1:
                        if (CKEDITOR.instances.specification)CKEDITOR.instances.specification.setData("");
                        if (CKEDITOR.instances.intro)CKEDITOR.instances.intro.setData("");
                        break
                    case 2:
                        if (Km.Country.View.ProductView.EditWindow.KindEditor_specification)Km.Country.View.ProductView.EditWindow.KindEditor_specification.html("");
                        if (Km.Country.View.ProductView.EditWindow.KindEditor_intro)Km.Country.View.ProductView.EditWindow.KindEditor_intro.html("");
                        break
                    case 3:
                        break
                    default:
                        if (ue_specification)ue_specification.setContent("");
                        if (ue_intro)ue_intro.setContent("");
                }

                Km.Country.View.Running.edit_window.ptypecomp.btnModify.setVisible(false);
                Km.Country.View.Running.edit_window.ptypecomp.ptype_name.setVisible(true);
                Km.Country.View.Running.edit_window.ptypecomp.ptypeShowLabel.setVisible(false);
                Km.Country.View.Running.edit_window.ptypecomp.ptypeShowValue.setVisible(false);

                Km.Country.View.ProductView.edit_window.show();
                Km.Country.View.ProductView.edit_window.maximize();
            },
            /**
             * 编辑商品时先获得选中的商品信息
             */
            updateProduct : function() {
                if (Km.Country.View.ProductView.edit_window==null){
                    Km.Country.View.ProductView.edit_window=new Km.Country.View.ProductView.EditWindow();
                }
                Km.Country.View.ProductView.edit_window.saveBtn.setText('修 改');
                Km.Country.View.ProductView.edit_window.resetBtn.setVisible(true);
                Km.Country.View.ProductView.edit_window.setTitle('修改商品');
                Km.Country.View.ProductView.edit_window.savetype=1;

                if (this.getSelectionModel().getSelected().data.ptypeShowAll){
                    Km.Country.View.Running.edit_window.ptypecomp.btnModify.setVisible(true);
                    Km.Country.View.Running.edit_window.ptypecomp.ptype_name.setVisible(false);
                    Km.Country.View.Running.edit_window.ptypecomp.ptypeShowLabel.setVisible(true);
                    Km.Country.View.Running.edit_window.ptypecomp.ptypeShowValue.setVisible(true);
                }else{
                    Km.Country.View.Running.edit_window.ptypecomp.btnModify.setVisible(false);
                    Km.Country.View.Running.edit_window.ptypecomp.ptype_name.setVisible(true);
                    Km.Country.View.Running.edit_window.ptypecomp.ptypeShowLabel.setVisible(false);
                    Km.Country.View.Running.edit_window.ptypecomp.ptypeShowValue.setVisible(false);
                }

                Km.Country.View.ProductView.edit_window.show();
                Km.Country.View.ProductView.edit_window.maximize();

                Km.Country.View.ProductView.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
                var country_id = Km.Country.View.Running.countryGrid.getSelectionModel().getSelected().data.country_id;
                Km.Country.View.ProductView.edit_window.country_id.setValue(country_id);
                Km.Country.View.Running.edit_window.imageUpload.setValue(Km.Country.View.Running.edit_window.image.getValue());
                Km.Country.View.Running.edit_window.image_largeUpload.setValue(Km.Country.View.Running.edit_window.image_large.getValue());
                var data = this.getSelectionModel().getSelected().data;
                switch (Km.Country.Config.OnlineEditor)
                {
                    case 1:
                        if (CKEDITOR.instances.specification)CKEDITOR.instances.specification.setData(data.specification);
                        if (CKEDITOR.instances.intro)CKEDITOR.instances.intro.setData(data.intro);
                        break
                    case 2:
                        if (Km.Country.View.ProductView.EditWindow.KindEditor_specification)Km.Country.View.ProductView.EditWindow.KindEditor_specification.html(data.specification);
                        if (Km.Country.View.ProductView.EditWindow.KindEditor_intro)Km.Country.View.ProductView.EditWindow.KindEditor_intro.html(data.intro);
                        break
                    case 3:
                        if (xhEditor_specification)xhEditor_specification.setSource(data.specification);
                        if (xhEditor_intro)xhEditor_intro.setSource(data.intro);
                        break
                    default:
                        if (ue_specification)ue_specification.ready(function(){ue_specification.setContent(data.specification);});
                        if (ue_intro)ue_intro.ready(function(){ue_intro.setContent(data.intro);});
                }

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
                        del_product_ids=del_product_ids+selectedRows[flag].data.product_id+",";
                    }
                    ExtServiceProduct.deleteByIds(del_product_ids);
                    this.doSelectProduct();
                    Ext.Msg.alert("提示", "删除成功！");
                }
            }
        })
    },
    /**
     * 窗口：批量上传国家
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传国家数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传国家Excel文件',buttonText: '',
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
                                url : 'index.php?go=admin.upload.uploadCountry',
                                success : function(form, response) {
                                    Ext.Msg.alert('成功', '上传成功');
                                    uploadWindow.hide();
                                    uploadWindow.uploadForm.upload_file.setValue('');
                                    Km.Country.View.Running.countryGrid.doSelectCountry();
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
            Km.Country.View.UploadWindow.superclass.constructor.call(this, config);
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
                            var uploadImageUrl='index.php?go=admin.upload.uploadCountryThumbnails';
                            if (this.uploadForm.upload_file.name=="upload_flagimage_files"){
                                uploadImageUrl='index.php?go=admin.upload.uploadCountryFlagimages';
                            }
                            if (this.uploadForm.upload_file.name=="upload_images_files"){
                                uploadImageUrl='index.php?go=admin.upload.uploadCountryImagess';
                            }

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
                                        Km.Country.View.Running.countryGrid.doSelectCountry();
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
            Km.Country.View.BatchUploadImagesWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：国家列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Country.Store.countryStore,
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
                        {header : '标识',dataIndex : 'country_id',hidden:true},
                        {header : '国家名称',dataIndex : 'name'},
                        {header : '链接地址',dataIndex : 'url'},
                        {header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '排序',dataIndex : 'sort_order'}
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
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectCountry();
                                    }
                                }
                            },
                            items : [
                                '国家名称','&nbsp;&nbsp;',{ref: '../cname'},'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectCountry();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.cname.setValue("");
                                        this.filter={};
                                        this.doSelectCountry();
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
                                    text : '添加国家',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addCountry();
                                    }
                                },'-',{
                                    text : '修改国家',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateCountry();
                                    }
                                },'-',{
                                    text : '删除国家', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteCountry();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importCountry();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入国家',iconCls : 'icon-import',scope:this,handler:function(){this.importCountry()}},
                                            {text:'批量导入缩略图',iconCls : 'icon-import',scope:this,handler:function(){this.batchUploadImages("upload_thumbnail_files","缩略图")}},
                                            {text:'批量导入国旗图片',iconCls : 'icon-import',scope:this,handler:function(){this.batchUploadImages("upload_flagimage_files","国旗图片")}},
                                            {text:'批量导入风景图片',iconCls : 'icon-import',scope:this,handler:function(){this.batchUploadImages("upload_images_files","风景图片")}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportCountry();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看国家', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showCountry()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideCountry();Km.Country.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Country.Cookie.set('View.IsFix',Km.Country.Config.View.IsFix);}}
                                        ]
                                    }
                                },'-'
                            ]
                        }
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Country.Config.PageSize,
                    store: Km.Country.Store.countryStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Country.Viewport){
                                if (Km.Country.Config.View.IsShow==1){
                                    Km.Country.View.IsSelectView=1;
                                }
                                this.ownerCt.hideCountry();
                                Km.Country.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Country.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Country.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Country.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectCountry();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Country.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Country.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectCountry();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示国家列表
            this.doSelectCountry();
            Km.Country.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的国家信息Tab页
            Km.Country.View.Running.viewTabs=new Km.Country.View.CountryView.Tabs();
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
                        this.grid.hideCountry();
                        Km.Country.Config.View.IsShow=0;
                    }else{
                        if (Km.Country.View.IsSelectView==1){
                            Km.Country.View.IsSelectView=0;
                            this.grid.showCountry();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Country.Config.View.IsShow==1){
                            Km.Country.View.IsSelectView=1;
                        }
                        this.grid.hideCountry();
                        Km.Country.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Country.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showCountry();
                this.tvpView.toggle(true);
            }else{
                this.hideCountry();
                Km.Country.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
                Km.Country.Config.View.IsFix=1;
            }else{
                Km.Country.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Country.Config.View.IsShow=0;
                return ;
            }
            if (Km.Country.Config.View.IsShow==1){
                this.hideCountry();
                Km.Country.Config.View.IsShow=0;
            }
            this.showCountry();
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
         * 查询符合条件的国家
         */
        doSelectCountry : function() {
            if (this.topToolbar){
                var cname = this.topToolbar.cname.getValue();
                this.filter    = {'name':cname};
            }
            var condition = {'start':0,'limit':Km.Country.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceCountry.queryPageCountry(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result             = new Array();
                    result['data']         = response.result.data;
                    result['totalCount'] = response.result.totalCount;
                    Km.Country.Store.countryStore.loadData(result);
                } else {
                    Km.Country.Store.countryStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的国家！');
                }
            });
        },
        /**
         * 显示国家视图
         * 显示国家的视图相对国家列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Country.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Country.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Country.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Country.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Country.View.Running.viewTabs);
                    break;
            }
            Km.Country.Cookie.set('View.Direction',Km.Country.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Country.Config.View.IsFix==0)&&(Km.Country.Config.View.IsShow==1)){
                    this.showCountry();
                }
                Km.Country.Config.View.IsFix=1;
                Km.Country.View.Running.countryGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Country.Config.View.IsShow=0;
                this.showCountry();
            }
        },
        /**
         * 显示国家
         */
        showCountry : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择国家！');
                Km.Country.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Country.Config.View.IsFix==0){
                if (Km.Country.View.Running.view_window==null){
                    Km.Country.View.Running.view_window=new Km.Country.View.CountryView.Window();
                }
                if (Km.Country.View.Running.view_window.hidden){
                    Km.Country.View.Running.view_window.show();
                    Km.Country.View.Running.view_window.winTabs.hideTabStripItem(Km.Country.View.Running.view_window.winTabs.tabFix);
                    this.updateViewCountry();
                    this.tvpView.toggle(true);
                    Km.Country.Config.View.IsShow=1;
                }else{
                    this.hideCountry();
                    Km.Country.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Country.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Country.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Country.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Country.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Country.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Country.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Country.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Country.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Country.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideCountry();
            if (Km.Country.Config.View.IsShow==0){
                Km.Country.View.Running.viewTabs.enableCollapse();
                switch(Km.Country.Config.View.Direction){
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
                this.updateViewCountry();
                this.tvpView.toggle(true);
                Km.Country.Config.View.IsShow=1;
            }else{
                Km.Country.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏国家
         */
        hideCountry : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Country.View.Running.view_window!=null){
                Km.Country.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前国家显示信息
         */
        updateViewCountry : function() {
            Km.Country.View.Running.productGrid.doSelectProduct();
            if (Km.Country.View.Running.view_window!=null){
                Km.Country.View.Running.view_window.winTabs.tabCountryDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Country.View.Running.viewTabs.tabCountryDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建国家
         */
        addCountry : function() {
            if (Km.Country.View.Running.edit_window==null){
                Km.Country.View.Running.edit_window=new Km.Country.View.EditWindow();
            }
            Km.Country.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Country.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Country.View.Running.edit_window.setTitle('添加国家');
            Km.Country.View.Running.edit_window.savetype=0;
            Km.Country.View.Running.edit_window.country_id.setValue("");
            Km.Country.View.Running.edit_window.thumbnailUpload.setValue("");
            Km.Country.View.Running.edit_window.flagimageUpload.setValue("");
            Km.Country.View.Running.edit_window.imagesUpload.setValue("");
            switch (Km.Country.Config.OnlineEditor)
            {
                case 1:
                    if (CKEDITOR.instances.introduction)CKEDITOR.instances.introduction.setData("");
                    break
                case 2:
                    if (Km.Country.View.EditWindow.KindEditor_introduction)Km.Country.View.EditWindow.KindEditor_introduction.html("");
                    break
                case 3:
                    break
                default:
                    if (ue_introduction)ue_introduction.setContent("");
            }

            Km.Country.View.Running.edit_window.show();
            Km.Country.View.Running.edit_window.maximize();
        },
        /**
         * 编辑国家时先获得选中的国家信息
         */
        updateCountry : function() {
            if (Km.Country.View.Running.edit_window==null){
                Km.Country.View.Running.edit_window=new Km.Country.View.EditWindow();
            }
            Km.Country.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Country.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Country.View.Running.edit_window.setTitle('修改国家');
            Km.Country.View.Running.edit_window.savetype=1;

            Km.Country.View.Running.edit_window.show();
            Km.Country.View.Running.edit_window.maximize();

            Km.Country.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Country.View.Running.edit_window.thumbnailUpload.setValue(Km.Country.View.Running.edit_window.thumbnail.getValue());
            Km.Country.View.Running.edit_window.flagimageUpload.setValue(Km.Country.View.Running.edit_window.flagimage.getValue());
            Km.Country.View.Running.edit_window.imagesUpload.setValue(Km.Country.View.Running.edit_window.images.getValue());
            var data = this.getSelectionModel().getSelected().data;
            switch (Km.Country.Config.OnlineEditor)
            {
                case 1:
                    if (CKEDITOR.instances.introduction)CKEDITOR.instances.introduction.setData(data.introduction);
                    break
                case 2:
                    if (Km.Country.View.EditWindow.KindEditor_introduction)Km.Country.View.EditWindow.KindEditor_introduction.html(data.introduction);
                    break
                case 3:
                    if (xhEditor_introduction)xhEditor_introduction.setSource(data.introduction);
                    break
                default:
                    if (ue_introduction)ue_introduction.ready(function(){ue_introduction.setContent(data.introduction);});
            }

        },
        /**
         * 删除国家
         */
        deleteCountry : function() {
            Ext.Msg.confirm('提示', '确认要删除所选的国家吗?', this.confirmDeleteCountry,this);
        },
        /**
         * 确认删除国家
         */
        confirmDeleteCountry : function(btn) {
            if (btn == 'yes') {
                var del_country_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_country_ids=del_country_ids+selectedRows[flag].data.country_id+",";
                }
                ExtServiceCountry.deleteByIds(del_country_ids);
                this.doSelectCountry();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出国家
         */
        exportCountry : function() {
            ExtServiceCountry.exportCountry(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入国家
         */
        importCountry : function() {
            if (Km.Country.View.current_uploadWindow==null){
                Km.Country.View.current_uploadWindow=new Km.Country.View.UploadWindow();
            }
            Km.Country.View.current_uploadWindow.show();
        },
        /**
         * 批量上传商品图片
         */
        batchUploadImages:function(inputname,title){
            if (Km.Country.View.Running.batchUploadImagesWindow!=null){
                Km.Country.View.Running.batchUploadImagesWindow.destroy();
                Km.Country.View.Running.batchUploadImagesWindow=null;
            }
            Km.Country.View.Running.batchUploadImagesWindow=new Km.Country.View.BatchUploadImagesWindow();

            Km.Country.View.Running.batchUploadImagesWindow.setTitle("批量上传"+title);
            Km.Country.View.Running.batchUploadImagesWindow.uploadForm.upload_file.name=inputname;
            Km.Country.View.Running.batchUploadImagesWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Country.View.Running.countryGrid=new Km.Country.View.Grid();
            if (Km.Country.Config.View.IsFix==0){
                Km.Country.View.Running.countryGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Country.View.Running.countryGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Country.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Country.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前国家Grid对象
         */
        countryGrid:null,
        /**
         * 当前商品Grid对象
         */
        productGrid:null,
        /**
         * 显示国家信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Country.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Country.Init();
    /**
     * 国家数据模型获取数据Direct调用
     */
    Km.Country.Store.countryStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceCountry.queryPageCountry}
    });
    /**
     * 国家页面布局
     */
    Km.Country.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Country.View.Panel()]
    });
    Km.Country.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
