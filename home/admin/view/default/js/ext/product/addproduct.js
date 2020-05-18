Ext.namespace("Kmall.Admin.AddProduct");
Km = Kmall.Admin.AddProduct;
Km.AddProduct={
    /**
     * 全局配置
     */
    Config:{
        /**
         *分页:每页显示记录数
         */
        PageSize:15,
        /**
         * 保存类型
         */
        Savetype:0,
        /**
         * 在线编辑器类型。
         * 1:CkEditor,2:KindEditor,3:xhEditor,4:UEditor
         * 配合Action的变量配置$online_editor
         */
        OnlineEditor:4,
        /**
         * 空对象(用于保存所选规格类型)
         */
        UpdateData:{},
        /**
         * 用于保存所有可选规格值
         */
        Cansel:{},
         /**
         * 空数组(用于保存所有规格值)
         */
        SpecLists:{},
         /**
         * 空数组(用于保存可能的规格组合)
         */
        Combination:new Array(),
         /**
         * 规格组合的筛选数据集
         */
        FilterCb:null,
         /**
         * 当前规格值组合
         */
        SpecKey:null,
        /**
         * 空对象(需删除的图片--DB)
         */
        Delimages:{},
        /**
         * 商品主图
         */
        MainImage: null,
            /**
         * 空对象(需删除的货品--DB)
         */
        Delgoods:{},
         /**
         * 商品标识
         */
        Product_id:null,
        /**
         * 货品信息
         */
        Goods:null,
        /**
         * 网络路径
         */
        URLPATH:null,
         /**
         * 多规格开启标志
         */
        IsMultiplespec:null,
        /**
         * 多规格暂存标识
         */
        IsSaveSpec:false,
        /**
         * 多规格初始化标识
         */
        IsInit:false
    },
    /**
     * Cookie设置
     */
    Cookie:new Ext.state.CookieProvider(),
    /**
     * 初始化
     */
    Init:function(){
        if (Ext.util.Cookies.get('operator')!=null){
            Km.AddProduct.Config.Operator=Ext.util.Cookies.get('operator');
        }
        if (Ext.util.Cookies.get('roletype')!=null){
            Km.AddProduct.Config.Roletype=Ext.util.Cookies.get('roletype');
        }
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.AddProduct.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }
        if (Ext.util.Cookies.get('roleid')!=null){
            Km.AddProduct.Config.Roleid=Ext.util.Cookies.get('roleid');
        }
        if (Ext.util.Cookies.get('URLPATH')!=null){
            Km.AddProduct.Config.URLPATH=Ext.util.Cookies.get('URLPATH');
        }
    },
    /**
     * 带条件打开本页
     */
    Filter:function(){
        var param=Ext.urlDecode(window.location.search.substring(1));
        //如果存在product_id
        if (param.product_id&&param.isMultiplespec){
            //定义保存类型为修改
            Km.AddProduct.Config.Savetype=1;
            Km.AddProduct.Config.Product_id=param.product_id;
            var flag=false;
            if(param.isMultiplespec=="1"){
                flag=true;
            }
            Km.AddProduct.Config.IsMultiplespec=flag;
        }
    }
};

/**
 * Model:数据模型
 */
Km.AddProduct.Store = {
    /**
     * 商品
     */
    productStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'message',type: 'string'},
                {name: 'msgleft',type: 'string'},
                {name: 'msgright',type: 'string'},
                {name: 'product_id',type: 'int'},
                {name: 'product_name',type: 'string'},
                {name: 'brand_id',type: 'int'},
                {name: 'brand_name',type: 'string'},
                {name: 'ptype_id',type: 'int'},
                {name: 'ptypeShowAll',type: 'string'},
                {name: 'ptype_name',type: 'string'},
                {name: 'ptype_level',type: 'int'},
                {name: 'ptype1_id',type: 'int'},
                {name: 'ptype2_id',type: 'int'},
                {name: 'isRecommend',type: 'bit'},
                {name: 'product_code',type: 'string'},
                {name: 'goods_no',type: 'string'},
                {name: 'isPackage',type: 'string'},
                {name: 'supplier_id',type: 'int'},
                {name: 'sp_name',type: 'string'},
                {name: 'sort_order',type: 'int'},
                {name: 'image',type: 'string'},
                {name: 'image_large',type: 'string'},
                {name: 'specification',type: 'string'},
                {name: 'market_price',type: 'float'},
                {name: 'price',type: 'float'},
                {name: 'cost',type: 'float'},
                {name: 'price_tag',type: 'string'},
                {name: 'unit',type: 'string'},
                {name: 'market_jifen',type: 'int'},
                {name: 'jifen',type: 'int'},
                {name: 'scale',type: 'string'},
                {name: 'num',type: 'int'},
                {name: 'mustBuyNum',type: 'int'},
                {name: 'weight',type: 'float'},
                {name: 'intro',type: 'string'},
                {name: 'sales_count',type: 'int'},
                {name: 'click_count',type: 'int'},
                {name: 'isUp',type: 'string'},
                {name: 'country_id',type: 'int'},
                {name: 'country_name',type: 'string'},
                {name: 'uptime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'downtime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'changeTime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'isMultiplespec',type: 'bit'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    Ext.apply(options.params, Km.AddProduct.View.Running.GoodsGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     *品牌
     */
    brandStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/brand.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'brands',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'brand_id'
        }, [
            {name: 'brand_id', mapping: 'brand_id'},
            {name: 'brand_name', mapping: 'brand_name'}
        ])
    }),
    /**
     *国家
     */
    countryStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/country.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'countrys',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'country_id'
        }, [
            {name: 'country_id', mapping: 'country_id'},
            {name: 'country_name', mapping: 'name'}
        ])
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
            {name: 'sp_name', mapping: 'sp_name'},
            {name: 'contactman', mapping: 'contactman'}
        ])
    }),
    /**
     * 商品类型
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
            {name: 'ptype_level', mapping: 'level'},
            {name: 'ptype_name', mapping: 'name'}
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
            id: 'quantifier_id'
        }, [
            {name: 'quantifier_name', mapping: 'quantifier_name'}
        ])
    }),
    /**
     * 规格项
     */
    specItemStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'attribute_id',type: 'int'},
                {name: 'attribute_name',type: 'string'},
                {name: 'level',type: 'string'},
                {name: 'parent_id',type: 'int'},
                {name: 'attributeShowAll',type: 'string'},
                {name: 'isShow',type: 'string'},
                {name: 'sort_order',type: 'int'},
                {name: 'isShowAttributeCheck',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    Ext.apply(options.params, Km.AddProduct.View.Running.selPanel.filter);//保证分页也将查询条件带上
                }
            },
            load : function(records,options){

            }
        }
    }),
    /**
     * 规格值
     */
    specValueStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'attribute_id',type: 'int'},
                {name: 'attribute_name',type: 'string'},
                {name: 'level',type: 'string'},
                {name: 'parent_id',type: 'int'},
                {name: 'attributeShowAll',type: 'string'},
                {name: 'isShow',type: 'string'},
                {name: 'sort_order',type: 'int'},
                {name: 'isShowAttributeCheck',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    //Ext.apply(options.params,Km.AddProduct.View.Running.selPanel.filter);//保证分页也将查询条件带上
                }
            },
            load : function(records,options){

            }
        }
    }),
    /**
     * 货品
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
                {name: 'stock',type: 'int'},
                {name: 'sales_count',type: 'int'},
                {name: 'click_count',type: 'int'},
                {name: 'sort_order',type: 'int'},
                {name: 'isShow',type: 'string'},
                {name: 'isGiveaway',type: 'string'},
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
                    if (!options.params.limit)options.params.limit=Km.AddProduct.Config.PageSize;
                    Ext.apply(options.params, Km.AddProduct.View.Running.goodsGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    })
};

/**
 * View:商品入库显示组件
 */
Km.AddProduct.View={
    /**
     * Tab页面：商品基本信息
     */
    TabProduct:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config){
            config = Ext.apply({
                ref:'editForm',title:'商品基本信息',layout:'form',defaults:{anchor:'95%'},xtype: 'panel',autoScroll: true,
                items : [
                    {xtype: 'hidden',  name : 'product_id',ref:'product_id'},
                    {
                        xtype: 'compositefield',
                        defaults : {
                            xtype : 'textfield'
                        },
                        items: [
                            {fieldLabel: '商品名称(<font color=red>*</font>)',allowBlank : false,name: 'product_name',flex:1},
                            {xtype:'displayfield',value:'商品货号(<font color=red>*</font>):'},{name: 'product_code',allowBlank : false,flex:1},
                            {xtype:'displayfield',value:'货品内部编号:'},{name : 'goods_no',flex:1},
                            {xtype:'displayfield',value:'是否大礼包:'},{hiddenName : 'isPackage',flex:1
                               ,xtype:'combo',ref:'../isPackage',mode : 'local',triggerAction : 'all',
                               lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                               store : new Ext.data.SimpleStore({
                                 fields : ['value', 'text'],
                                 data : [['0', '否'], ['1', '是']]
                               }),emptyText: '请选择是否大礼包',
                               valueField : 'value',displayField : 'text'
                            }
                        ]
                    },
                    {xtype: 'hidden',name : 'brand_id',ref:'brand_id'},
                    {xtype: 'hidden',name : 'ptype_id',ref:'ptype_id'},
                    {xtype: 'hidden',name : 'image',ref:'image'},
                    {xtype: 'hidden',name : 'image_large',ref:'image_large'},
                    {
                        xtype: 'compositefield',ref: 'ptypebrand',
                        defaults : {xtype : 'textfield'},
                        items: [
                            {
                                 xtype: 'combo',name : 'brand_name',ref : 'brand_name',fieldLabel:"商品品牌(<font color=red>*</font>)",
                                 store:Km.AddProduct.Store.brandStore,emptyText: '请选择商品品牌',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',pageSize:Km.AddProduct.Config.PageSize,
                                 displayField:'brand_name',grid:this,flex:1,
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                            '<tpl for="."><div class="search-item">',
                                                '<h3>{brand_name}</h3>',
                                            '</div></tpl>'
                                 ),
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        this.grid.brand_id.setValue(record.data.brand_id);
                                        this.grid.ptypebrand.brand_name.setValue(record.data.brand_name);
                                        this.collapse();
                                     }
                                 }
                            },
                            {xtype:'displayfield',value:'所属商品分类(<font color=red>*</font>):'},
                            {
                                xtype:'combotree', ref:'ptype_name',name: 'ptype_name',grid:this,
                                emptyText: '请选择商品分类',canFolderSelect:false,flex:1,editable:false,
                                tree: new Ext.tree.TreePanel({
                                    dataUrl: 'home/admin/src/httpdata/ptypeTree.php',
                                    root: {nodeType: 'async'},
                                    border: false,rootVisible: false,
                                    listeners: {
                                        beforeload: function(n) {if (n) {this.getLoader().baseParams.id = n.attributes.id;}}
                                    }
                                }),
                                onSelect: function(cmb, node) {
                                    this.grid.ptype_id.setValue(node.attributes.id);
                                    this.setValue(node.attributes.text);
                                }
                            },
                            {xtype:"displayfield",value:"所选商品分类:",ref: 'ptypeShowLabel'},
                            {xtype:"displayfield",name:"ptypeShowAll",flex:1,ref: 'ptypeShowValue'}
                        ]
                    },
                    {xtype: 'hidden',name : 'ptype_oid',ref:'ptype_oid'},
                    {xtype: 'hidden',name : 'ptype_level',ref:'ptype_level'},
                    {xtype: 'hidden',name : 'ptype1_id',ref:'ptype1_id'},
                    {xtype: 'hidden',name : 'ptype2_id',ref:'ptype2_id'},
                    {
                        xtype: 'compositefield',
                        defaults : {
                            xtype : 'textfield'
                        },
                        items: [
                            {xtype:"numberfield",fieldLabel: '市场价(<font color=red>*</font>)',allowBlank : false,name: 'market_price',flex:1},
                            {xtype:'displayfield',value:'销售价(<font color=red>*</font>):'},{xtype:"numberfield",name: 'price',allowBlank : false,flex:1},
                            {xtype:"displayfield",value: '券:'},{xtype:"numberfield",name: 'jifen',flex:1},
                            {xtype:'displayfield',value:'价格标签:'},{name: 'price_tag',emptyText: '默认标签为商城价',flex:1},

                            {xtype:'displayfield',value:'库存:'},{xtype:"numberfield",name : 'num',value:'0',flex:1}
                            //{xtype:'displayfield',value:'最少购买数量:'},{xtype:"numberfield",name : 'mustBuyNum',value:'1',flex:1}
                            ]
                    },
                    {
                        xtype: 'compositefield',ref: 'unitpackage',
                        defaults : {
                            xtype : 'textfield'
                        },
                        items: [
                            {
                                 fieldLabel : '商品量词',xtype: 'combo',name : 'unit',ref:'unit',
                                 store:Km.AddProduct.Store.quantifierStore,emptyText: '请选择商品量词',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',pageSize:Km.AddProduct.Config.PageSize,
                                 displayField:'quantifier_name',flex:1,grid:this,
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                            '<tpl for="."><div class="search-item">',
                                                '<h3>{quantifier_name}</h3>',
                                            '</div></tpl>'
                                 ),
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        this.grid.unitpackage.unit.setValue(record.data.quantifier_name);
                                        this.collapse();
                                     }
                                 }
                            },
                            {xtype:'displayfield',value:'规格简述:'},{name : 'scale',flex:1},
                            {xtype:'displayfield',value:'重量:'},{xtype:"numberfield",name : 'weight',flex:1}
                        ]
                    },
                    {
                        xtype: 'compositefield',
                        defaults : {xtype : 'textfield'},
                        items: [
                            {fieldLabel : '是否推荐',hiddenName:'isRecommend',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,
                                store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['0', '否'], ['1', '是']]
                                }),emptyText: '请选择是否推荐',flex:1,value:'0',
                                valueField : 'value',displayField : 'text'
                            },
                            {xtype:'displayfield',value:'销售量:'},{xtype:"numberfield",name : 'sales_count',flex:1},
                            {xtype:'displayfield',value:'热度:'},{xtype:"numberfield",name : 'click_count',flex:1},
                            {xtype:'displayfield',value:'排序:'},{xtype:"numberfield",name : 'sort_order',flex:1}
                        ]
                    },
                    {
                        xtype: 'compositefield',
                        defaults : {
                            xtype : 'textfield'
                        },
                        items: [
                            {fieldLabel: '广告词',name: 'message',flex:1},
                            {xtype:'displayfield',value:'左侧广告词:'},{name: 'msgleft',flex:1},
                            {xtype:'displayfield',value:'右侧广告词:'},{name : 'msgright',flex:1}
                        ]
                    },
                    {xtype: 'hidden',name : 'country_id',ref:'country_id'},
                    {
                       fieldLabel : '所属国家',xtype: 'combo',name : 'country_name',ref : 'country_name',
                       store:Km.AddProduct.Store.countryStore,emptyText: '请选择所属国家',itemSelector: 'div.search-item',
                       loadingText: '查询中...',width: 570, pageSize:Km.AddProduct.Config.PageSize,
                       displayField:'country_name',grid:this,
                       mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                       forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                       tpl:new Ext.XTemplate(
                         '<tpl for="."><div class="search-item">',
                           '<h3>{country_name}</h3>',
                         '</div></tpl>'
                       ),
                       listeners:{
                         'beforequery': function(event){delete event.combo.lastQuery;}
                       },
                       onSelect:function(record,index){
                         if(this.fireEvent('beforeselect', this, record, index) !== false){
                          this.grid.country_id.setValue(record.data.country_id);
                          this.grid.country_name.setValue(record.data.country_name);
                          this.collapse();
                         }
                       }
                    },
                    {xtype: 'hidden',name : 'supplier_id',ref:'supplier_id'},
                    {
                         fieldLabel : '供应商',xtype: 'combo',name : 'sp_name',ref : 'sp_name',
                         store:Km.AddProduct.Store.supplierStore,emptyText: '请选择供应商',itemSelector: 'div.search-item',
                         loadingText: '查询中...',width: 570, pageSize:Km.AddProduct.Config.PageSize,
                         displayField:'sp_name',grid:this,
                         mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                         forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                         tpl:new Ext.XTemplate(
                             '<tpl for="."><div class="search-item">',
                                 '<h3>{sp_name}</h3>',
                             '</div></tpl>'
                         ),
                         onSelect:function(record,index){
                             if(this.fireEvent('beforeselect', this, record, index) !== false){
                                this.grid.supplier_id.setValue(record.data.supplier_id);
                                this.grid.sp_name.setValue(record.data.sp_name);
                                this.collapse();
                             }
                         }
                    },
                    {xtype:"numberfield",fieldLabel: '成本价',name: 'cost',flex:1},
                    {fieldLabel : '商品介绍',xtype : 'textarea',name : 'intro',id:'intro',ref:'intro'},
                    {fieldLabel : '规格参数',name : 'specification',xtype : 'textarea',id:'specification',ref:'specification'},
                    {xtype:'hidden',name:'isMultiplespec',value:0,id:'openMultiplespec'}//开启多规格标志位
                ]
            }, config);
            Km.AddProduct.View.TabProduct.superclass.constructor.call(this, config);
        },
        /*
        * Load修改商品数据
        */
        doLoad:function(){
            var tabProduct=this;
            var product_id = Km.AddProduct.Config.Product_id;
            this.filter = {'product_id':product_id};
            var condition = {'start':0,'limit':Km.AddProduct.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceProduct.queryPageProductById(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result = new Array();
                    result['data'] = response.result.data;
                    result['totalCount'] = response.result.totalCount;
                    Km.AddProduct.Store.productStore.loadData(result);
                    tabProduct.doRetrieve();
                }else{
                    Km.AddProduct.Store.productStore.removeAll();
                }
            });
        },
        /*
        * 重置(修改)
        */
        doRetrieve : function(){
            var pdata = Km.AddProduct.Store.productStore.data.items[0];
            this.form.loadRecord(pdata);
            this.ptype_oid.setValue(pdata.data.ptype_id);
            if (!pdata || !pdata.data) return;
            switch (Km.AddProduct.Config.OnlineEditor)
            {
                case 1:
                    if (CKEDITOR.instances.specification) CKEDITOR.instances.specification.setData(pdata.data.specification);
                    if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(pdata.data.intro);
                    break
                case 2:
                    if (Km.Product.View.EditWindow.KindEditor_specification) Km.AddProduct.View.EditWindow.KindEditor_specification.html(pdata.data.specification);
                    if (Km.Product.View.EditWindow.KindEditor_intro) Km.AddProduct.View.EditWindow.KindEditor_intro.html(pdata.data.intro);
                    break
                case 3:
                    if (xhEditor_specification) xhEditor_specification.setSource(pdata.data.specification);
                    if (xhEditor_intro) xhEditor_intro.setSource(pdata.data.intro);
                    break
                default:
                    if (ue_specification&&ue_specification.body) ue_specification.setContent(pdata.data.specification);
                    if (ue_intro&&ue_intro.body) ue_intro.setContent(pdata.data.intro);
                    break
            }
        },
        /*
        * 重置
        */
        doReset : function(){
            this.form.reset();
            switch (Km.AddProduct.Config.OnlineEditor)
            {
                case 1:
                    if (CKEDITOR.instances.specification) CKEDITOR.instances.specification.setData("");
                    if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData("");
                    break
                case 2:
                    if (Km.AddProduct.View.EditWindow.KindEditor_specification) Km.AddProduct.View.EditWindow.KindEditor_specification.html("");
                    if (Km.AddProduct.View.EditWindow.KindEditor_intro) Km.Product.View.EditWindow.KindEditor_intro.html("");
                    break
                case 3:
                    if (xhEditor_specification)xhEditor_specification.setSource("");
                    if (xhEditor_intro)xhEditor_intro.setSource("");
                    break
                default:
                    if (ue_specification) ue_specification.setContent("");
                    if (ue_intro) ue_intro.setContent("");
            }
        }
    }),
    /**
     * Tab页面：添加规格
     */
    TabSpec:Ext.extend(Ext.Panel,{
        constructor : function(config){
            config = Ext.apply({
                ref:'addSpec',title:'商品多规格',layout:'column',xtype: 'panel',width:'100%',autoScroll : true,
                items: [
                    new Km.AddProduct.View.OpenSpec({ref:'openSpec'}),
                    new Km.AddProduct.View.CloseSpec({ref:'closeSpec'})
                ],
                listeners : {
                    render:function(){
                        //默认隐藏
                        this.closeSpec.hide();
                    }
                }
            }, config);
            Km.AddProduct.View.TabSpec.superclass.constructor.call(this, config);
        }
    }),
    /**
     * Tab页面：商品图片
     */
    TabImages:Ext.extend(Ext.Panel,{
        constructor : function(config){
            config = Ext.apply({
                ref:'addImages',title:'商品图片',width:'100%',autoScroll : true,
                items: [
                    {
                        xtype: 'compositefield',
                        items: [
                            new Km.AddProduct.View.ImagesLeftCon({ref:'../imagesLeftCon',flex:1}),
                            new Km.AddProduct.View.ImageShow({ref:'../imageShow',flex:1})
                        ]
                    }
                ],
                listeners : {
                    render:function(){
                    }
                }
            }, config);
            Km.AddProduct.View.TabImages.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 图片上传container
     */
    ImagesLeftCon:Ext.extend(Ext.Panel,{
        constructor : function(config){
            config = Ext.apply({
                width:650,border:false,
                items: [
                    new Km.AddProduct.View.ImagesViewCon({ref:'imagesViewCon'})
                    //new Km.AddProduct.View.ImageUploadCon({ref:'imageUploadCon'})
                ]
            }, config);
            Km.AddProduct.View.ImagesLeftCon.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 图片上传container
     */
    ImagesViewCon:Ext.extend(Ext.Panel,{
        constructor : function(config){
            config = Ext.apply({
                uploadUrl:Km.AddProduct.Config.URLPATH,
                flashUrl:'common/js/ajax/ext/shared/upload/swfupload.swf',
                postParams:{"PHPSESSID" : "<?php echo session_id(); ?>"},
                layout: 'fit',width:650,height:470,autoScroll : true,theimagesViewCon:this,
                listeners :{
                    render : {
                        fn : function() {
                            var em = this.getTopToolbar().get(0).el.child('em');
                            var placeHolderId = Ext.id();
                            em.setStyle({
                                position : 'relative',
                                display : 'block'
                            });
                            em.createChild({
                                tag : 'div',
                                id : placeHolderId
                            });
                            var settings = {
                                upload_url : this.uploadUrl,
                                flash_url : this.flashUrl,
                                post_params: this.postParams,
                                file_size_limit : "100 MB",
                                file_types : "*.jpg;*.jpeg;*.gif;*.png;*.bmp",
                                file_types_description : "Images",
                                file_upload_limit : 0,
                                file_queue_limit : 0,
                                debug: false,

                                button_width : '78',
                                button_height : '22',
                                button_placeholder_id : placeHolderId,
                                button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,

                                file_queued_handler : fileQueued,
                                file_queue_error_handler : fileQueueError,
                                file_dialog_complete_handler : fileDialogComplete,
                                upload_start_handler : this.uploadStart,
                                upload_progress_handler : uploadProgress,
                                upload_error_handler : uploadError,
                                upload_success_handler : this.uploadSuccess,
                                upload_complete_handler : this.uploadComplete,
                                queue_complete_handler : queueComplete,

                                custom_settings : {
                                    progressTarget : "fsUploadProgress",
                                    cancelButtonId : "btnCancel"
                                }
                            };
                            this.swfupload = new SWFUpload(settings);
                            Ext.get(this.swfupload.movieName).setStyle({
                                position : 'absolute',
                                top : -2,
                                left : -2
                            });
                        },
                        scope : this,
                        delay : 100
                    }
                },
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
                                {text: '上传图片',ref: '../../btnUpload',iconCls: 'icon-add'},'-',
                                {id: 'btnCancel',hidden: true},
                                {id: 'fsUploadProgress',hidden: true},
                                {id: 'divStatus',hidden: true},
                                {
                                    text: '删除图片',ref: '../../btnRemove',iconCls: 'icon-delete',disabled: true,
                                    handler: function() {
                                        Ext.MessageBox.confirm('提示','确定要删除所选的图片吗?',this.Removeimage,this);
                                    }
                              },'-',
                              {
                                text: '图片设置',ref: '../../btnUpdate',iconCls: 'icon-edit',disabled: true,
                                handler:this.ImageSet
                              }, '-',
                              {
                                  text: '设为商品主图', ref: '../../btnMain', iconCls: 'icon-edit', disabled: true,
                                  handler: this.MainImgSet
                              }
                            ]
                        })
                    ]
                },
                items: [
                    new Km.AddProduct.View.ImagesView({ref:'imagesView'})
                ]
            }, config);
            Km.AddProduct.View.ImagesViewCon.superclass.constructor.call(this, config);
        },
        /**
         * 删除图片
         */
        Removeimage:function(btn){
            if (btn == 'yes') {
                //需要删除的商品图片
                var delimages = Km.AddProduct.Config.Delimages;
                //图片dataview
                var imgview = Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon.imagesView;
                var imgstore = imgview.store;
                //选中的图片
                var selimgs = imgview.getSelectedRecords();
                //删除选中记录
                for(var i=0;i<selimgs.length;i++){
                    //选中的记录
                    var rec=selimgs[i];
                    //选中记录的data的id字段的值
                    var fid=rec.data.id;
                    if (rec.data.ismain == true) {
                        Ext.Msg.alert("提示", "不能删除商品主图！");
                        break;
                    };
                    if(!Ext.isEmpty(fid)){
                        //存入数据对象
                        delimages[fid]=true;
                    }
                    imgstore.remove(rec);
                }
            }
        },
        /**
         * 图片设置(单选)
         */
        ImageSet:function(){
            //创建或显示编辑框
            this.ShowImgEditor();
            //当前选中图片数据
            var imgdata = Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon.imagesView.getSelectedRecords()[0].data;
            //图片信息编辑窗口
            var editForm = Km.AddProduct.View.Running.imgEditor.editForm;
            editForm.normal_img.setValue(imgdata.norpath);
            editForm.large_img.setValue(imgdata.larpath);
            editForm.Thumb_img.setValue(imgdata.icopath);
            editForm.original_img.setValue(imgdata.fullpath);
            editForm.isShow.setValue(imgdata.isShow);
            editForm.sort_order.setValue(imgdata.sort_order);
            Km.AddProduct.View.Running.tabProduct.image.setValue(imgdata.norpath);
            Km.AddProduct.View.Running.tabProduct.image_large.setValue(imgdata.larpath);
        },
        /**
         * 编辑框
         */
        ShowImgEditor:function(){
            if(Km.AddProduct.View.Running.imgEditor==null){
                Km.AddProduct.View.Running.imgEditor=new Km.AddProduct.View.ImgEditWindow();
            }
            Km.AddProduct.View.Running.imgEditor.show();
        },
        /**
         * 隐藏编辑框
         */
        HideImgEditor:function(){
            if (Km.AddProduct.View.Running.imgEditor!=null){
                Km.AddProduct.View.Running.imgEditor.hide();
            }
        },
        /**
         * 设置商品主图
         */
        MainImgSet: function() {
            var recid = Km.AddProduct.Config.MainImage; //判断是否已经设置商品主图
            var store = Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon.imagesView.store; //图片store
            if (recid) {
                var orec = store.getById(recid);
                if (orec) {
                    orec.set("ismain", false);
                }
            }
            //当前选中图片数据
            var nrec = Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon.imagesView.getSelectedRecords()[0]
            nrec.set("ismain", true);
            Km.AddProduct.Config.MainImage = nrec.id; //保存该记录
        },
        //开始图片上传
        uploadStart:function(file){
            try {
                var progress = new FileProgress(file, this.customSettings.progressTarget);
                progress.setStatus("正在上传...");
                progress.toggleCancel(true, this);
            }
            catch (ex) {}
            return true;
        },
        //上传完成时的操作
        uploadComplete: function(file) {
            //如果上传队列为空
            if (this.getStats().files_queued === 0) {
                //document.getElementById(this.customSettings.cancelButtonId).disabled = true;
                //商品图片
                var imageView=Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon.imagesView;
            }
        },
        uploadSuccess: function(file, serverData){
            //插入数据
            var path=serverData;
            var prepath="tempimages/"+path;
            var fullpath="upload/"+prepath;
            // var path=file.name;
            // var prepath="tempimages/"+path;
            // var fullpath="upload/"+prepath;
            var imageUpload=Ext.getCmp('imagesview');
            var u = new imageUpload.store.recordType({'id':"",'path':path,'prepath':prepath,'fullpath':fullpath,'icopath':'','norpath':'','larpath':'','isShow':true,'sort_order':50, 'ismain': false});
            imageUpload.store.insert(0, u);
        }
    }),
    /**
     * 图片编辑窗口
     */
    ImgEditWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title:'图片信息',closeAction: "hide",constrainHeader:true,maximizable: true,collapsible: true,
                width: 700,height: 400,minWidth: 700,minHeight: 300,
                layout: 'fit',plain: true,buttonAlign: 'center',
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
                        ref:'editForm',layout:'form',fileUpload: true,
                        labelWidth : 100,labelAlign : "center",
                        bodyStyle : 'padding:5px 5px 0',align : "center",
                        api : {},
                        defaults : {
                            xtype : 'textfield',anchor:'100%'
                        },
                        items : [
                            {ref:'original_img',fieldLabel:'原图',hiddenName:'original_img',xtype:'displayfield'},
                            {ref:'normal_img',fieldLabel:'商品相册图',hiddenName:'normal_img',xtype:'displayfield'},
                            {ref:'large_img',fieldLabel:'商品详细图',hiddenName:'large_img',xtype:'displayfield'},
                            {ref:'Thumb_img',fieldLabel:'商品缩略图',hiddenName:'Thumb_img',xtype:'displayfield'},
                            {ref:'isShow',fieldLabel : '是否显示',hiddenName : 'isShow',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['0', '否'], ['1', '是']]
                                }),emptyText: '请选择是否显示',
                                valueField : 'value',// 值
                                displayField : 'text'// 显示文本
                            },
                            {ref:'sort_order',fieldLabel: '排序',name: 'sort_order',value:'50',xtype: 'numberfield'}
                        ]
                    })
                ],
                buttons : [
                {
                    text: "确定",ref : "../saveBtn",scope:this,
                    handler : function() {
                        //form引用
                        var form=this.editForm.getForm();
                        if (!form.isValid()) {
                            return;
                        }
                        //当前选中图片record
                        var imgrec = Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon.imagesView.getSelectedRecords()[0];
                        //图片信息
                        var fdata=form.getValues();
                        //修改record值
                        imgrec.set("isShow",fdata.isShow);
                        imgrec.set("sort_order",fdata.sort_order);
                        //隐藏编辑窗口
                        Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon.HideImgEditor();
                        Ext.Msg.alert("提示","设置成功！");
                    }
                },{
                    text : "取 消",scope:this,
                    handler : function() {
                        this.hide();
                    }
                }]
            }, config);
            Km.AddProduct.View.ImgEditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 图片一览
     */
    ImagesView:Ext.extend(Ext.DataView,{
        constructor : function(config){
            config = Ext.apply({
                id:'imagesview',itemSelector: 'div.thumb-wrap',selectedClass:'x-view-selected',autoHeight:true,
                multiSelect: true,overClass:'x-view-over',emptyText: '<div style="width:100%;height:40px;margin-top:140px;text-align:center;font-size:14px;font-weight:bold;font-family:"Microsoft Yahei";">此处显示商品页默认图片<br />[您还未上传商品图片！]</div>',
                plugins: [
                    new Ext.DataView.DragSelector()
                    //new Ext.DataView.LabelEditor({dataIndex: 'path'})
                ],
                store: new Ext.data.JsonStore({
                    url: 'home/admin/src/httpdata/Loadimages.php',
                    autoLoad: false,
                    root: 'images',
                    totalProperty: 'totalCount',
                    id:'path',
                    fields:[
                        'id',
                        'path',
                        'prepath',
                        'fullpath',
                        'icopath',
                        'norpath',
                        'larpath',
                        'isShow',
                        'sort_order',
                        'ismain'
                    ],
                    listeners: {
                        load: function(store, options) {
                            var rcount = options.length;
                            if (rcount) {
                                for (var i = 0; i < rcount; i++) {
                                    var rec = options[i];
                                    var data = rec.data;
                                    if (data.ismain) {
                                        Km.AddProduct.Config.MainImage = rec.id;
                                    }
                                }
                                ;
                            }
                        }
                    }
                }),
                tpl: new Ext.XTemplate(
                    '<tpl for=".">',
                    '<div class="thumb-wrap" attrid="{id}" attrpath="{path}">',
                    '<div class="thumb">',
                    '<img class="thumb-img" src="upload/{prepath}">',
                    '<tpl if="ismain==true"><img class="main-img" src="common/js/ajax/ext/resources/images/new/commit.gif" /></tpl>',
                    '</div>',
                    '</div>',
                    '</tpl>',
                    '<div class="x-clear"></div>'
                ),
                listeners:{
                    click:function(dataview,index,node,e){
                        var record = dataview.getStore().getAt(index);
                        html="<img width='466px' height='466px' src='upload/"+record.data.prepath+"' />";

                        Ext.getCmp('imageshow').body.update(html);
                    },
                    selectionchange: {
                        fn: function(dv,nodes){
                            //隐藏编辑窗口
                            Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon.HideImgEditor();
                            //选中图片个数
                            var sel = nodes.length;
                            //图片上传容器
                            var imgcon=Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon;
                            //删除图片按钮
                            var btnRemove=imgcon.btnRemove;
                            //修改图片按钮
                            var btnUpdate=imgcon.btnUpdate;
                            //设置主图按钮
                            var btnMain = imgcon.btnMain;
                            //默认删除和设置按钮沉默
                            btnRemove.setDisabled(true);
                            btnMain.setDisabled(true);
                            btnUpdate.setDisabled(true);
                            //如果有图片选中
                            if(sel&&sel==1){
                                //删除按钮激活
                                btnRemove.setDisabled(false);
                                //设置按钮激活
                                btnUpdate.setDisabled(false);
                                btnMain.setDisabled(false); //允许设置主图
                            }else if(sel){
                                btnRemove.setDisabled(false);
                            }else{
                                Ext.getCmp('imageshow').body.update("<div style='width:100%;height:40px;margin-top:150px;text-align:center;font-size:14px;font-weight:bold;font-family:'Microsoft Yahei';'>此处预览商品图片<br />[请先选择一张商品缩略图！]</div>");
                            }
                        }
                    },scope:this
                }
            }, config);
            Km.AddProduct.View.ImagesView.superclass.constructor.call(this, config);
        },
        /*
        * 刷新
        */
        doRefresh:function(){
            //store 重载(重新发送远程请求),当前商品图片
            this.store.reload();
        }
    }),
    /**
     * 图片预览
     */
    ImageShow:Ext.extend(Ext.Panel,{
        constructor : function(config){
            config = Ext.apply({
                title:'图片预览',layout: 'fit',width:472,style:'border:2px solid #DDD;margin-left:10px;margin-bottom:14px',
                items : [{
                    xtype:'panel',id:'imageshow',height:466,border: false,
                    html:"<div style='width:100%;height:40px;margin-top:150px;text-align:center;font-size:14px;font-weight:bold;font-family:'Microsoft Yahei';'>此处预览商品图片<br />[请先选择一张商品缩略图！]</div>"
                }]
            },config);
            Km.AddProduct.View.ImageShow.superclass.constructor.call(this,config);
        }
    }),
    /**
     * 容器:开启规格
     */
    OpenSpec:Ext.extend(Ext.Panel,{
        constructor : function(config){
            config = Ext.apply({
                xtype:'panel',width:'100%',height:40,
                items:[{
                    xtype: 'compositefield',height:30,style:"margin:5px;",
                    defaults : {
                        height:25
                    },
                    items: [
                        {fieldLabel: '规格',xtype:'button',text:'开启规格',width:100,style:'margin-left:60px;',
                            handler : function(){
                                //创建规格设置窗口
                                Km.AddProduct.View.SpecView.showSpecPanel();
                            }
                        },
                        {width:300,xtype:'displayfield',value:'点击开启多规格',style:'margin-left:60px;line-height:25px;'}
                    ]
                }]
            },config);
            Km.AddProduct.View.OpenSpec.superclass.constructor.call(this,config);
        }
    }),
    /**
     * 容器:关闭规格
     */
    CloseSpec:Ext.extend(Ext.Panel,{
        constructor : function(config){
            config = Ext.apply({
                xtype:'panel',width:'100%',height:50,
                items:[
                    {
                        xtype: 'compositefield',height:30,style:"margin:5px;",
                        defaults : {
                            height:25
                        },
                        items: [
                            {xtype:'button',text:'关闭规格',width:100,style:'margin-left:60px;',
                                handler : function() {
                                    //终止编辑
                                    Km.AddProduct.View.Running.goodsGrid.stopEdit();
                                    //关闭规格处理函数
                                    Ext.MessageBox.confirm('提示','确定要删除所选规格么(<font color=red>货品清单将会清空!</font>)?',Km.AddProduct.View.FnCloseSpec,this);
                                }
                            },
                            {xtype:'button',text:'修改规格',width:100,style:'margin-left:60px;',
                                handler : function(){
                                    //终止编辑
                                    Km.AddProduct.View.Running.goodsGrid.stopEdit();
                                    Km.AddProduct.View.Running.specPanel.saveBtn.setText("保存");
                                    Km.AddProduct.View.Running.specPanel.savetype=1;
                                    //显示规格编辑窗口
                                    Km.AddProduct.View.SpecView.showSpecPanel();
                                }
                            }
                        ]
                    }
                ]
            },config);
            Km.AddProduct.View.OpenSpec.superclass.constructor.call(this,config);
        }
    }),
    /**
     * 视图：选择规格规格
     */
    SpecView:{
        /*
         *规格设置panel
         */
        SpecPanel:Ext.extend(Ext.Window,{
            constructor : function(config){
                config = Ext.apply({
                    //savetype:0 :新生成规格; savetype:1 :修改规格;
                    savetype:0,title:"规格",closeAction:"hide",constrainHeader:true,maximizable:true,collapsible:true,plain: true,
                    width:750,minWidth:750,height:550,minHeight:550,buttonAlign : 'center',layout:'anchor',modal: true,manager:mywindows,
                    items:[
                        {
                            xtype: 'compositefield',anchor:"99%",height:40,
                            style:"margin:4px auto;background:white;text-align:center;line-height:40px;border:1px solid #ccc;",
                            items: [
                                {xtype:'displayfield',width:600,height:40,value:'1、增加规格项或选择规格标签 » 2、添加需要的规格值 » 3、自定义规格值或关联相册 » 保存'},
                                {xtype:'button',text:'增加规格项',height:22,width:80,iconCls : 'icon-add',style:"margin-top:8px;",
                                    handler : function(){
                                        if(!Km.AddProduct.Config.IsMultiplespec){
                                            Km.AddProduct.View.SpecView.showSelPanel();
                                        }else{
                                            Ext.Msg.alert('提示','请关闭规格后重新选择规格标签');
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            xtype:'tabpanel',ref:'attrtab',xtype:'tabpanel',scope:this,plain:true,activeTab:0,anchor:'99%',height:428,deferredRender: false,
                            style:"margin:4px auto;",
                            defaults:{bodyStyle:'padding:8px;'},
                            html:"<div style='width:100%;height:40px;margin-top:150px;text-align:center;font-size:14px;font-weight:bold;font-family:'Microsoft Yahei';'>此处编辑商品规格<br />[请先选择规格项！]</div>",
                            listeners: {
                                //关闭tab页handler
                                beforeremove: this.removeTab
                            }
                        }
                    ],
                    listeners:{
                        beforehide:function(){
                            if(Km.AddProduct.Config.IsSaveSpec){
                                this.doRefresh();
                            }
                        }
                    },
                    buttons : [
                    {
                        text: "生成商品规格",ref : "../saveBtn",scope:this,
                        handler : function(){
                            //选中的规格
                            selData={};
                            //已保存的选择
                            var updateData=Km.AddProduct.Config.UpdateData;
                            //可以生成标志位
                            var CANGEN=true;
                            //循环tab
                            this.attrtab.items.each(function(item){
                                //规格项ID
                                var pid=item.attrid.value;
                                selData[pid]={};
                                selData[pid]['pname']=item.title;
                                selData[pid]['data']=new Array();
                                //规格值store
                                var attrstore=item.attrgrid.getStore();
                                var attrC=attrstore.getCount();
                                //如果没有选择规格值,不予生成规格
                                if(!attrC){
                                    CANGEN=false;
                                    return false;
                                }
                                for (var i=0;i<attrC;i++){
                                    var attrdata=attrstore.getAt(i).data;
                                    selData[pid]['data'][i]={};
                                    selData[pid]['data'][i]['id']=attrdata.id;
                                    selData[pid]['data'][i]['name']=attrdata.name;
                                }
                            })
                            //规格种类计数
                            var datacount=Object.keys(selData).length;
                            //已选择规格项以及至少一个规格值
                            if(!datacount||!CANGEN){
                                 Ext.Msg.alert("提示","请至少选择一种<font color=red>规格</font>,且选定<font color=red>规格值</font>!");
                                 return false;
                            }
                            //保存handler
                            if(this.savetype==0){
                                //存储选中规格
                                Km.AddProduct.Config.UpdateData=selData;
                                //根据所选规格，生成货品
                                Km.AddProduct.View.Gengoods();
                            }else{
                                //更新combo的store
                                for(var key in selData){
                                    sdata=selData[key].data
                                    var datarr=new Array();
                                    for(var i=0;i<sdata.length;i++){
                                        datarr[i]=new Array();
                                        datarr[i][0]=sdata[i].id;
                                        datarr[i][1]=sdata[i].name;
                                    }
                                    cstore=Ext.getCmp(key).store;
                                    cstore.loadData(datarr);
                                }
                                //存储选中规格
                                Km.AddProduct.Config.UpdateData=selData;
                                //重新生成规格相关数据
                                Km.AddProduct.View.Running.goodsGrid.genSpec();
                                //所有可选规格
                                var combtion=Km.AddProduct.Config.Combination;
                                //goodgrid store
                                var goodsStore=Km.AddProduct.View.Running.tabSpec.goodsGrid.store;
                                for (var i=0;i<goodsStore.getCount();i++){
                                    var goodsrec=goodsStore.getAt(i);
                                    var goodsdata=goodsrec.data;
                                    var pspec_key = goodsdata.pspec_key;
                                    for(var j=0;j<combtion.length;j++){
                                        var record=combtion[j];
                                        //如果该组合已被使用
                                        if(record.pspec_key==pspec_key){
                                            //设置标识位为已使用
                                            record["isValid"]=true;
                                            //更新cbindex,cbold(*combtion已重新生成)
                                            goodsrec.set("cbindex",j);
                                            goodsrec.set("cbold",j);
                                        }
                                    }
                                }
                            }
                            //隐藏窗口
                            this.hide();
                            //更新多规格暂存标志位
                            Km.AddProduct.Config.IsSaveSpec=true;
                        }
                    },{
                        text : "取 消",scope:this,
                        handler : function(){
                            this.hide();
                        }
                    }]
                },config);
                Km.AddProduct.View.SpecView.SpecPanel.superclass.constructor.call(this,config);
            },
            /*
             *还原回未保存的状态
             */
            doRefresh :function(){
                this.removeAllTab();
                var updateData=Km.AddProduct.Config.UpdateData;
                var cansel=Km.AddProduct.Config.Cansel;
                for(var key in cansel){
                    var selspec = cansel[key];
                    Km.AddProduct.View.Running.specPanel.genAttrtab(selspec.name,selspec.id,selspec.data,selspec.count);
                }
                for(var key in updateData){
                    var updata = updateData[key];
                    for (var k=0;k<updata.data.length;k++) {
                        var btnid = updata.data[k].id;
                        var btn = Ext.getCmp("btn"+btnid);
                        btn.fireEvent('click',btn);
                    };
                }
            },
            /*
             *生成规格项tab页 name:规格项标题 规格项ID
             */
            genAttrtab : function(name,id,specarr,spcount){
                //规格值对象数组
                var sparr=new Array();
                for (var i=0;i<spcount;i++){
                    var sp={};
                    var spdata=specarr[i];
                    sp['text']=spdata.name;
                    sp['value']=spdata.id;
                    sp['id']="btn"+spdata.id;
                    sp['listeners']={
                        //con: trigger; e：event
                        click: function(con,e){
                            //选中则设置无效
                            con.setDisabled(true);
                            //对应的gridpanel的store
                            var gstore=this.ownerCt.ownerCt.nextSibling().store;
                            //新建该store的一条record
                            var rec=new gstore.recordType({name:con.text,id:con.value,refer:con.id});
                            //数据插入store
                            gstore.insert(0,rec);
                        }
                    }
                    sparr[i]=sp;
                }
                //新建规格项操作面板
                var tab=new Ext.Panel({
                    title:name,closable:true,
                    items:[
                        {xtype:'hidden',ref:'attrid',value:id},
                        {xtype:'panel',ref:'attrpanel',height:100,layout:'column',
                            items:[
                            {xtype:'panel',columnWidth:.2,style:'padding:4px;',border:false,html:"<div style='width:100%;height:40px;margin-top:25px;text-align:center;font-size:12px;font-family:'Microsoft Yahei';'>请点击右侧<br />添加本商品需要的"+name+"</div>"},
                            {xtype:'panel',columnWidth:.8,height:98,autoScroll:true,style:'padding:4px;',layout:{type:'column'},defaults: {xtype:'button',columnWidth:.15,width:60,height:20,style:'margin:2px;'},
                                items:sparr}
                            ]
                        },
                        {
                            xtype:'editorgrid',ref:'attrgrid',height:280,autoScroll:true,
                            store : new Ext.data.ArrayStore({
                                autoDestroy: true,
                                idIndex: 0,
                                fields :  [
                                    {name: 'name',type: 'string'},
                                    {name: 'id',type: 'int'},
                                    {name: 'customval',type: 'string'},
                                    {name: 'link',type: 'string'}
                                ]
                            }),
                            cm : new Ext.grid.ColumnModel({
                                defaults:{
                                    width:120,sortable : true
                                },
                                columns : [
                                    {header : '系统规格',dataIndex : 'name',width:160},
                                    {header : '操作',dataIndex : 'operation',
                                        renderer : function(value, cellmeta, record, rowIndex, columnIndex,store){
                                            return "<button type='button'>删除</button>";
                                        }
                                    }
                                ]
                            }),
                            frame: true,
                            clicksToEdit: 1,
                            listeners: {
                                afterrender:function(){
                                    //绑定事件
                                    this.on('cellclick', this.onCellClick, this);
                                }
                            },
                            onCellClick: function (grid, rowIndex, columnIndex, e){
                                if (e.getTarget().innerHTML === '删除' ) {
                                    if(Km.AddProduct.Config.IsMultiplespec){
                                        Ext.Msg.alert("提示","请关闭规格后重新生成!");
                                        return false;
                                    }else{
                                        Ext.MessageBox.show({
                                            title:'提示',
                                            msg:'删除后将不能恢复,确认删除本行吗?',
                                            buttons:Ext.MessageBox.YESNO,
                                            icon:Ext.MessageBox.QUESTION,
                                            fn:function(btn,text,opt) {
                                                if(btn=='yes') {
                                                    //对应按钮id
                                                    var id=grid.getStore().getAt(rowIndex).data.refer;
                                                    //按钮激活
                                                    Ext.getCmp(id).setDisabled(false);
                                                    grid.getStore().removeAt(rowIndex);
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    ],
                    listeners: {
                       beforeclose:function(){
                            //this 当前关闭tab页面
                            Km.AddProduct.View.Running.specPanel.removeTab(this.ownerCt,this);
                        }
                    }
                });
                this.attrtab.add(tab);
                this.attrtab.setActiveTab(0);
            },
            /*
             *删除tab页
             */
            removeTab: function(tabpanel,tab){
                if(!Km.AddProduct.Config.IsMultiplespec){
                    Ext.MessageBox.show({
                        title:'提示',
                        msg:'确定要删除所选规格项吗？',
                        buttons:Ext.MessageBox.YESNO,
                        icon:Ext.MessageBox.QUESTION,
                        fn:function(btn,text,opt) {
                            if(btn=='yes') {
                                //移除beforeremove事件，为了防止tabpanel.remove(tab)时进入死循环
                                tabpanel.un('beforeremove',tabpanel.ownerCt.removeTab);
                                //规格数据对象
                                var updateData=Km.AddProduct.Config.UpdateData;
                                //全部可选规格数据对象
                                var cansel=Km.AddProduct.Config.Cansel;
                                //删除该tab页对应的规格对象元素
                                delete updateData[tab.attrid.value];
                                delete cansel[tab.attrid.value];
            　　　　　　　　　　//移除tab
                                tabpanel.remove(tab);
            　　　　　　　　　　//增加beforeremove事件
                                tabpanel.addListener('beforeremove',tabpanel.ownerCt.removeTab);
                            }
                        }
                    });
                }else{
                    Ext.Msg.alert('提示','请关闭规格后重新生成规格项');
                }
                return false;
            },
            /*
             *删除tab页
             */
            removeAllTab: function(){
                this.attrtab.un('beforeremove',this.removeTab);
                this.attrtab.removeAll();
                this.attrtab.addListener('beforeremove',this.removeTab);
            }
        }),
        /*
         *规格选择panel
         */
        SelPanel:Ext.extend(Ext.Window,{
            constructor : function(config){
                config = Ext.apply({
                    title:"选择规格",closeAction:"hide",constrainHeader:true,maximizable:true,collapsible:true,plain: false,
                    width:750,minWidth:750,height:550,minHeight:550,buttonAlign : 'center',layout:'column',filter:{},modal: true,
                    defaults:{xtype:'fieldset'},bodyStyle:{"background-color":"white"},
                    items:[
                        {
                            ref:'specsel',title:'请选择规格',layout:'form',columnWidth: .3,height:470,style:'margin:4px;padding:10px 8px 8px;',
                        },
                        {
                            ref:'specview',title:'规格预览区',columnWidth: .68,height:470,style:'margin:4px 0px 4px 10px;padding:10px 8px 8px;',
                            items:[
                                {xtype:'panel',html:"<div style='width:100%;height:30px;margin-top:10px;text-align:center;font-size:14px;font-weight:bold;font-family:'Microsoft Yahei';'>请在左侧列表选择规格！</div>"}
                            ]
                        }
                    ],
                    buttons : [ {
                        text: "确定",ref : "../saveBtn",scope:this,
                        handler : function(){
                            //获取选中radio
                            var seldata=this.specsel.specgroup.getValue();
                            if(!seldata){
                                Ext.Msg.alert('提示','请先选择规格！');
                                return false;
                            }
                            //选择规格项
                            this.confirmSpec(seldata);
                        }
                    }, {
                        text : "取 消",scope:this,
                        handler : function(){
                            this.hide();
                        }
                    }]
                },config);
                //初始化显示属性表列表
                Km.AddProduct.Store.specItemStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceAttribute.queryPageAttribute}
                });
                Km.AddProduct.View.SpecView.SelPanel.superclass.constructor.call(this,config);
            },
            /*
             *请求规格数据 attr:规格项id
             */
            querySpec : function(attr){
                //规格项选择面板
                var selpanel = Km.AddProduct.View.Running.selPanel;
                var filter = {};
                var condition = {'start':0,'limit':Km.AddProduct.Config.PageSize};
                if(attr){
                    filter['parent_id']=attr;
                }else{
                    filter['attr']=true;
                    filter['all']=true;
                }
                Ext.apply(condition,filter);
                ExtServiceAttribute.queryPageAttribute(condition,function(provider, response) {
                    if (response.result&&response.result.data) {
                        var result = new Array();
                        result['data'] =response.result.data;
                        result['totalCount'] =response.result.totalCount;
                        //attr:0 请求规格项 ;attr:1 请求规格值
                        if(attr){
                            selpanel.genSpecvalue(result['data'],result['totalCount']);
                            //store load
                            Km.AddProduct.Store.specValueStore.loadData(result);
                            //设置确定按钮激活
                            selpanel.saveBtn.setDisabled(false);
                        }else{
                            //根据返回的数据，生成规格项
                            selpanel.genRadiogroup(result['data'],result['totalCount']);
                            //store load
                            Km.AddProduct.Store.specItemStore.loadData(result);
                        }
                    } else {
                        Km.AddProduct.Store.specItemStore.removeAll();
                        Ext.Msg.alert('提示', '无符合条件的规格！');
                    }
                });
            },
            /*
             *生成规格项 data:规格项data数组 len:长度
             */
            genRadiogroup : function(data,len){
                var items = new Array();
                for(var i=0;i<len;i++){
                    var item = {};
                    var specdata=data[i];
                    item['boxLabel']=specdata.attribute_name;
                    item['name']='specitem';
                    item['inputValue']=specdata.attribute_id;
                    //已选标识
                    item['isSet']=false;
                    if(i%2==0){
                        item['ctCls']='cus_radio_style_white';
                    }else{
                        item['ctCls']='cus_radio_style_gray';
                    }
                    items[i]=item;
                }
                var radiogroup = new Ext.form.RadioGroup({
                    hideLabel: true,ref:'specgroup',columns: 1,autoScroll:true,
                    defaults:{style:'margin-left:25px;margin-top:5px;'},
                    items:items,
                    listeners:{
                        change:function(group,radio){
                            //选中规格项ID
                            var attribute_id = radio.inputValue;
                            //规格项选择面板
                            var selpanel = Km.AddProduct.View.Running.selPanel;
                            //设置确定按钮无效
                            selpanel.saveBtn.setDisabled(true);
                            //请求规格值数据
                            selpanel.querySpec(attribute_id);
                        }
                    }
                });
                this.specsel.add(radiogroup);
                this.specsel.doLayout();
            },
            /*
             *生成规格值 data:规格值data数组 len:长度
             */
            genSpecvalue : function(data,len){
                var items = new Array();
                for(var i=0;i<len;i++){
                    var item = {};
                    var specdata=data[i];
                    item['html']=specdata.attribute_name;
                    items[i]=item;
                }
                var table = new Ext.Panel({
                    ref:'attrtable',layout: {type: 'table',columns: 5},
                    defaults: {frame: true,autoWidth:true, height: 30,style:'margin:5px'},
                    items:items
                });
                this.specview.removeAll();
                this.specview.add(table);
                this.specview.doLayout();
            },
            /*1
             *确认选择规格项 data:选择的规格项
             */
            confirmSpec : function(data){
                //规格数据对象
                var cansel=Km.AddProduct.Config.Cansel;
                //规格项名称 规格项ID
                var name=data.boxLabel;
                var id=data.inputValue;
                if(!cansel[id]){
                    //规格值store
                    var spvalstore=Km.AddProduct.Store.specValueStore;
                    //规格值总数
                    var spcount=spvalstore.getCount();
                    //规格值数组
                    var specarr=new Array();
                    for (var i=0;i<spcount;i++){
                        var spdata=spvalstore.getAt(i).data;
                        specarr[i]={};
                        specarr[i].id=spdata.attribute_id;
                        specarr[i].name=spdata.attribute_name;
                    }
                    //可供选择规格对象
                    cansel[id]={};
                    cansel[id]['name']=name;
                    cansel[id]['id']=id;
                    cansel[id]['data']=specarr;
                    cansel[id]['count']=spcount;

                    //生成规格项tab页
                    Km.AddProduct.View.Running.specPanel.genAttrtab(name,id,specarr,spcount);
                }
                this.hide();
            }
        }),
        /*
         *显示规格设置panel的处理函数
         */
        showSpecPanel: function(){
            if(Km.AddProduct.View.Running.specPanel==null){
                Km.AddProduct.View.Running.specPanel=new Km.AddProduct.View.SpecView.SpecPanel();
            }
            Km.AddProduct.View.Running.specPanel.show();
        },
        /*
         *隐藏规格设置panel的处理函数
         */
        hideSpecPanel: function(){
            if (Km.AddProduct.View.Running.specPanel!=null){
                Km.AddProduct.View.Running.specPanel.hide();
            }
        },
        /*
         *显示规格选择panel的处理函数
         */
        showSelPanel: function(){
            if(Km.AddProduct.View.Running.selPanel==null){
                Km.AddProduct.View.Running.selPanel=new Km.AddProduct.View.SpecView.SelPanel();
                Km.AddProduct.View.Running.selPanel.querySpec(0);
            }
            Km.AddProduct.View.Running.selPanel.show();
        },
        /*
         *隐藏规格选择panel的处理函数
         */
        hideSelPanel: function(){
            if (Km.AddProduct.View.Running.selPanel!=null){
                Km.AddProduct.View.Running.selPanel.hide();
            }
        },
        /*
         *多规格开启后修改
         */
        doSpecRetrieve: function(){
        }
    },
    /**
     * 选择货品列表
     */
    GoodsGrid:Ext.extend(Ext.grid.GridPanel,{
        constructor : function(config) {
            Ext.applyIf(this.sm, {
                getEditor : function() {return false;}
            });
            config = Ext.apply({
                collapsible:true,title:'货品清单',height:510,
                store : new Ext.data.ArrayStore({
                    autoDestroy: true,
                    idIndex: 0,
                    fields :  this.Dyfields()
                }),
                //constrainHeader:true,
                plugins : [this.editor],
                sm : this.sm,
                columns : this.Dycolumns(),
                tbar:new Ext.Toolbar({
                    defaults:{scope: this},
                    items : [
                        {
                            text: '添加货品',iconCls : 'icon-add',
                            handler: this.onAdd
                        },'-',
                        {
                            text : '删除货品',iconCls : 'icon-delete',ref : 'productRemoveBtn',disabled : true,
                            handler : this.onDelete
                        },new Ext.Toolbar.Fill()]
                }),
                bbar:{},
                listeners : {
                    //动态生成规格组合
                    render:function(){
                        //是否生成多规格标识
                        var isMulti=Km.AddProduct.Config.IsMultiplespec;
                        //更新store
                        if(isMulti){
                            //修改商品多规格信息
                            this.doRetrieve();
                        }else{
                            //生成所有可能组合的货品
                            this.genData();
                        }
                    }
                }
            },config);
            Km.AddProduct.View.GoodsGrid.superclass.constructor.call(this, config);
        },
        /**
         * 行选择器
         */
        sm : new Ext.grid.CheckboxSelectionModel({
            handleMouseDown : Ext.emptyFn,
            listeners : {
                'rowselect' : function(sm, rowIndex, record) {},
                'rowdeselect' : function(sm, rowIndex, record) {},
                'selectionchange' : function(sm) {
                    // 判断删除按钮是否可以激活
                    this.grid.topToolbar.productRemoveBtn.setDisabled(sm.getCount() < 1);
                }
            }
        }),
        /**
         * 编辑器
         */
        editor : new Ext.ux.grid.RowEditor({
            saveText : '确认',
            // 保证选择左侧的选择框时，不影响启动显示RowEdior
            onRowClick : function(g, rowIndex, e) {
                //点击复选框时不触发
                if (!e.getTarget('.x-grid3-row-checker'))this.constructor.prototype.onRowClick.apply(this, arguments);
            },
            listeners:{
                //com:editor;
                beforeedit : function(com, rowIndex){
                    //规格序列
                    var speckey = Km.AddProduct.Config.SpecKey;
                    //筛选数据集
                    var filterCb = new Array();
                    //可能的组合
                    var combtion = Km.AddProduct.Config.Combination;
                    //计数
                    var fcount = 0;
                    //goodsgrid
                    var g=Km.AddProduct.View.Running.tabSpec.goodsGrid;
                    //当前record数据
                    var gdata = g.store.getAt(rowIndex).data;
                    var cbindex = gdata.cbindex;
                    var pspec_key = gdata.pspec_key;
                    //筛选当前有效选中组合以及未使用的组合
                    for(var i=0;i<combtion.length;i++){
                        //保存选中组合以及未使用的组合
                        if((!Ext.isEmpty(cbindex)&&i==cbindex)||!combtion[i].isValid){
                            filterCb[fcount++] = Km.AddProduct.View.CloneObject(combtion[i]);
                        }
                    }
                    //规格字符串转为数组
                    var pk_val = pspec_key.split("-");
                    var pk_count = 1;
                    //规格值存入全局变量
                    for(var key in speckey.data){
                        speckey.data[key]=parseInt(pk_val[pk_count++]);
                    }
                    //保存到全局变量
                    Km.AddProduct.Config.FilterCb = filterCb;
                },
                //con editor容器;bool ???
                canceledit : function(con,bool){
                    //init
                    Km.AddProduct.Config.FilterCb=null;
                },
                //con editor容器,field 修改过的字段,data 选中行数据记录,index 选中行索引
                afteredit : function(con,field,data,index){
                    //规格信息
                    var speclists = Km.AddProduct.Config.SpecLists;
                    //处理combo选择元素显示问题
                    for(var key in field){
                        //value of this field
                        var fvalue=field[key]
                        //info of this specification
                        var specinfo=speclists[fvalue];
                        //if specinfo exist
                        if(specinfo){
                            //name value of this field
                            var fname=specinfo.name;
                            //assign
                            data.set(key,fname);
                        }
                    }
                    //当前行规格序列信息
                    var speckey = Km.AddProduct.Config.SpecKey;
                    //可能的规格组合
                    var combtion = Km.AddProduct.Config.Combination;
                    //规格排列
                    var specdata = speckey.data;
                    var spec_key = "-";
                    //保存有值的属性
                    var hasv = {};
                    //是否选中所有属性
                    var isAll = true;
                    for(var key in specdata){
                        var specvalue = specdata[key];
                        //只要有为0的项,isValid置false
                        if(!specvalue){
                            isAll = false;
                        }else{
                            hasv[key]=specdata[key];
                        }
                        //生成规格序列
                        spec_key = spec_key+specdata[key]+"-";
                    }
                    //更新可能规格组合状态
                    for(var i=0;i<combtion.length;i++){
                        var cbinfo = combtion[i];
                        //是否匹配
                        var isMatch=true;
                        //筛选未使用的组合
                        if(!cbinfo.isValid){
                            for(var key in hasv){
                                if(cbinfo.data[key]!=hasv[key]){
                                    isMatch=false;
                                }
                            }
                            //如果匹配且选中所有
                            if(isMatch&&isAll){
                                //锁定该组合
                                cbinfo.isValid=true;
                                //更新cbindex值
                                data.set("cbindex",i);
                                //cbindex的修改记录
                                var modif = data.data.cbold
                                //如果cbindex有过修改(新建时cbold为null)
                                if(!Ext.isEmpty(modif)){
                                    //释放锁定的combtion
                                    combtion[modif].isValid=false;
                                }
                                //更新修改的值
                                data.set("cbold",i);
                            }
                        }
                    }
                    //设置规格序列
                    data.set("pspec_key",spec_key);
                    data.set("isValid",isAll);
                }
            }
        }),
        /**
         * 新增
         */
        onAdd : function(btn, ev) {
            //规格序列
            var speckey = Km.AddProduct.Config.SpecKey;
            var spec_key = "-";
            for(var key in speckey.data){
                speckey.data[key]=0;
                spec_key = spec_key+"0-";
            }
            var u = new this.store.recordType({pspec_key:spec_key,isValid:false,isUp:'是',cbold:null});
            this.editor.stopEditing();
            this.store.insert(0, u);
            this.getView().refresh();
            this.editor.startEditing(0, 0);
        },
        /**
         * 删除
         */
        onDelete : function(){
            this.stopEdit();
            Ext.MessageBox.confirm('提示', '删除后货品数据将不能恢复,确认删除本行?', this.showResult,this);
        },
        /**
         * 批量删除
         */
        showResult : function(btn) {
            // 确定要删除你选定项的信息
            if (btn == 'yes') {
                //所选中的数据集
                var selectedRows = this.getSelectionModel().getSelections();
                //当前数据组合情况
                var combtion = Km.AddProduct.Config.Combination;
                for (var i = 0, r; r = selectedRows[i]; i++) {
                    if (!selectedRows[i]) {
                        continue;
                    }
                    var seldata = selectedRows[i].data;
                    //如果该行为有效行
                    if(seldata.isValid){
                    //该record对应的组合
                        var cbindex=seldata.cbindex;
                        //更新标识位
                        combtion[cbindex].isValid=false;
                    }
                    //如果存在goods_id
                    if(!Ext.isEmpty(seldata.goods_id)){
                        //保存删除的已有货品
                           Km.AddProduct.Config.Delgoods[seldata.goods_id]=true;
                    }
                    this.store.remove(r);
                }
            }
        },
        /**
         * 动态生成fields
         */
        Dyfields : function(){
            //规格数据对象
            var updateData=Km.AddProduct.Config.UpdateData;
            /*----动态生成fields(待优化)----*/
            var dyfields=new Array();
            //规格序列
            var speckey={};
            speckey['data']={};
            speckey['complete']=true;
            //for in 计数
            var i=0;
            for(var field in updateData){
                //生成规格序列
                speckey['data'][field]=null;
                var name="attr"+field;
                dyfields[i++]={name: name,type: 'int'};
            }
            //存储规格序列
            Km.AddProduct.Config.SpecKey = speckey;
            //default fields
            var fields=[
                {name: 'pspec_key',type: 'string',hidden:true},
                {name: 'goods_id',type: 'int'},
                {name: 'goods_name',type: 'string'},
                {name: 'goods_code',type: 'int'},
                {name: 'sales_price',type: 'float'},
                {name: 'market_price',type: 'float'},
                {name: 'stock',type: 'string'},
                {name: 'isUp',type: 'string'}
            ];
            //组合数组
            return fields.concat(dyfields);
        },
        /**
         * 动态生成columns
         */
        Dycolumns : function(){
            //规格数据对象
            var updateData=Km.AddProduct.Config.UpdateData;
            /*----动态生成columns(待优化)----*/
            var centerc=new Array();
            //for in 计数
            var i=0;
            for(var field in updateData){
                var name=updateData[field].pname;
                var sdata=updateData[field].data;
                var datarr=new Array();
                for(var j=0;j<sdata.length;j++){
                    datarr[j]=new Array();
                    datarr[j][0]=sdata[j].id;
                    datarr[j][1]=sdata[j].name;
                }
                var refer='attr'+field;
                centerc[i++]={header:name,dataIndex:refer,width:120,editor:{
                        hiddenName:name,xtype: 'combo',mode: 'local',triggerAction: 'all',lazyRender: true,
                        editable: false,valueField: 'id',displayField: 'name',lastQuery: '',id: field,
                        store : new Ext.data.SimpleStore({
                                fields : ['id', 'name'],
                                data : datarr
                        }),emptyText: '请选择规格值',flex:1,
                        listeners : {
                            //obj:object contain combobox
                            beforequery :function(obj){
                                obj.combo.store.clearFilter();
                                //scope为combo
                                obj.combo.store.filterBy(function(record){
                                    //goodsGrid
                                    var g=Km.AddProduct.View.Running.tabSpec.goodsGrid;
                                    //筛选数据集
                                    var filterCb = Km.AddProduct.Config.FilterCb;
                                    //规格序列
                                    var speckey = Km.AddProduct.Config.SpecKey;
                                    //复制对象
                                    var specdata = Km.AddProduct.View.CloneObject(speckey.data);
                                    //字段标识
                                    var fid = this.id;
                                    //本次循环record值
                                    var rvalue=record.data.id
                                    //更新规格序列
                                    specdata[fid]=rvalue;
                                    //遍历筛选数据集,判断序列是否有效
                                    for(var i=0;i<filterCb.length;i++){
                                        //标识
                                        var isexist = true;
                                        //规格组合
                                        var spec=filterCb[i].data;
                                        for(var key in spec){
                                            //specdata[key]不为0
                                            if(specdata[key]&&specdata[key]!=spec[key]){
                                                isexist=false;
                                                break;
                                            }
                                        }
                                        //如果存在该组合
                                        if(isexist){
                                            return true;
                                        }
                                    }
                                    return false;
                                },this);
                            },
                            //com:this combo;this record;index:record index
                            beforeselect :function(com,rec,index){
                                //规格序列
                                var speckey = Km.AddProduct.Config.SpecKey;
                                //字段标识
                                var fid = this.id;
                                //选中的值
                                var svalue=rec.data.id;
                                //更新规格序列
                                speckey.data[fid]=svalue;
                            }
                        }
                    }
                };
            }
            var leftc=[
                this.sm,
                {
                    header:'货品名称',dataIndex:'goods_name',width:180,editor:{xtype:'textfield'}
                },{
                    header:'货号',dataIndex:'goods_code',width:180,editor:{xtype:'textfield'}
                }
            ];
            var rightc=[
                {
                    header:'市场价',dataIndex:'market_price',editor:{xtype:'numberfield'}
                },{
                    header:'销售价',dataIndex:'sales_price',editor:{xtype:'numberfield'}
                },{
                    header:'库存',dataIndex:'stock',editor:{xtype:'numberfield'}
                },{
                    header:'是否上架',dataIndex:'isUp',width:120,
                    editor:{
                        hiddenName:'isUp',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,
                        editable: false,valueField : 'text',displayField : 'value',textAlign:'center',
                        store : new Ext.data.SimpleStore({
                                fields : ['value', 'text'],
                                data : [['否', '否'], ['是', '是']]
                        }),emptyText: '请选择是否上架',flex:1,value:'是'
                    }
                }
            ];
            columns=leftc.concat(centerc.concat(rightc));
            return columns;
        },
        /**
         * 生成store记录,所有可能组合数组Combination,所有规格值列表Speclists
         * updateData : 规格数据对象
         */
        genSpec: function(){
            //默认数据对象
            var ospec={
                goods_code : '',
                goods_name : '',
                sales_price  : '',
                market_price  : '',
                stock  : '',
                isUp  : '是',
                isValid : true
            }
            //组合规格数组
            var comspec=new Array();
            //store record array
            var us=new Array();
            //规格值对象
            var speclists={};
            //规格对象
            var specarr={};
            //所有可能组合
            var combtion=new Array();
            //当前选择规格数据对象
            var updateData=Km.AddProduct.Config.UpdateData;

            //dynamic spec
            for(var key in updateData){
                //字段name
                var fieldname="attr"+key;
                //获取保存的data数组
                var specdata=updateData[key].data;
                specarr[key]=specdata;
                //保存规格枚举
                for(var i=0;i<specdata.length;i++){
                    var skey = specdata[i].id;
                    speclists[skey]={};
                    speclists[skey]['pid']=key;
                    speclists[skey]['name']=specdata[i].name;
                    speclists[skey]['pname']=updateData[key].pname;
                }
            }
            //组合规格
            for(spec in specarr){
                //一组规格值
                var specdata=specarr[spec];
                //规格值计数
                var scout=specdata.length;
                //组合规格副本
                var ducomspec=new Array();
                for(var f=0;f<comspec.length;f++){
                    //对象copy
                    ducomspec[f]=Km.AddProduct.View.CloneObject(comspec[f]);
                }
                //组合规格计数
                var ducount=comspec.length;
                //判断是否开始规格组合
                if(ducount){
                    //组合规格副本 loop
                    for(var j=0;j<ducount;j++){
                        //规格值 loop
                        for(var k=0;k<scout;k++){
                            //当前索引
                            var index=j*scout+k;
                            //object copy
                            comspec[index]=Km.AddProduct.View.CloneObject(ducomspec[j]);
                            //create object
                            comspec[index][spec]={};
                            comspec[index][spec].id=specdata[k].id;
                            comspec[index][spec].name=specdata[k].name;
                        }
                    }
                }else{
                    //规格值 loop
                    for(var j=0;j<specdata.length;j++){
                        //create object
                        comspec[j]={};
                        comspec[j][spec]={};
                        comspec[j][spec].id=specdata[j].id;
                        comspec[j][spec].name=specdata[j].name;
                    }
                }
            }

            //generate goods records
            for(var i=0;i<comspec.length;i++){
                combtion[i]={};
                //设置有效状态位
                combtion[i]["isValid"]=false;
                combtion[i]["data"]={};
                //new store record object
                var retype={};
                //copy default data object
                retype=Km.AddProduct.View.CloneObject(ospec);
                var speckey='-';
                //规格计数
                var comcount=0;
                //assign
                for(var key in updateData){
                    //当前组合规格的key
                    var cspec=comspec[i][key];
                    //属性值名称
                    retype['attr'+key]=cspec.name;
                    //规格字符串(eg:-x-x-)
                    speckey=speckey+cspec.id+'-';
                    combtion[i]["data"][key]=cspec.id;
                    comcount++;
                }
                combtion[i]["pspec_key"]=speckey;
                //规格key
                retype['pspec_key']=speckey;
                //匹配combtion
                retype['cbindex']=i;
                retype['cbold']=i;
                var u = new this.store.recordType(retype);
                us[i]=u;
            }
            Km.AddProduct.Config.Combination=combtion;
            Km.AddProduct.Config.SpecLists=speclists;
            return us;
        },
        /**
         * store插入record
         */
        genData : function(){
            /*----生成所选规格相关数据----*/
            var us=this.genSpec();

            //所有可能的组合
            var combtion=Km.AddProduct.Config.Combination;
            for(var i=0;i<combtion.length;i++){
                //设置标识位为已使用
                combtion[i].isValid=true;
            }
            //store插入
            this.store.insert(0,us);
        },
        /*
        * Load修改多规格信息
        */
        doRetrieve:function(){
            //已存货品data,选中规格data，所有可选规格值data
            var goods=Km.AddProduct.Config.Goods;
            Km.AddProduct.View.Running.specPanel.doRefresh();

            /*----生成所有多规格相关数据----*/
            var allus=this.genSpec();

            //可能的组合
            var combtion=Km.AddProduct.Config.Combination;
            var us=new Array();
            for(var i=0;i<goods.length;i++){
                //找出已使用的组合
                var pspec_key = goods[i].pspec_key;
                for(var j=0;j<allus.length;j++){
                    var record=allus[j].data;
                    //如果该组合已被使用
                    if(record.pspec_key==pspec_key){
                        //在combtion中的索引
                        var cbindex=record.cbindex;
                        //设置标识位为已使用
                        combtion[cbindex]["isValid"]=true;
                        //模拟生成数据属性
                        goods[i]['isValid']=true;
                        goods[i]['cbindex']=cbindex;
                        goods[i]['cbold']=cbindex;
                    }
                }
                var u = new this.store.recordType(goods[i]);
                us[i]=u;
            }
            //store插入
            this.store.insert(0,us);
        },
        /**
         * 停止编辑
         */
        stopEdit:function(){
            this.editor.stopEditing();
         }
    }),
    /**
     * 主面板管理
     */
    MainPanel:Ext.extend(Ext.Panel,{
        constructor : function(config){
            //设置处理类型(create or retrieve)
            Km.AddProduct.Filter();
            //实例化(商品基本信息)
            Km.AddProduct.View.Running.tabProduct=new Km.AddProduct.View.TabProduct();
            //实例化TabSpec(添加规格form)
            Km.AddProduct.View.Running.tabSpec=new Km.AddProduct.View.TabSpec();
            //实例化TabImages
            Km.AddProduct.View.Running.tabImages=new Km.AddProduct.View.TabImages();
            //MainPanel配置信息
            config = Ext.apply({
                labelAlign: 'left',title: '新增商品',header:false,buttonAlign:'center',
                bodyStyle:'padding:5px;',border:false,height:600,
                listeners:{
                    afterrender:function(){
                        //商品基本信息form
                        var tabProduct=Km.AddProduct.View.Running.tabProduct;
                        //商品分类
                        var ptypebrand=tabProduct.ptypebrand;
                        //商品图片
                        var imageView=Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon.imagesView;
                        //新建商品处理
                        if(Km.AddProduct.Config.Savetype==0){
                            //隐藏商品分类相关字段信息
                            ptypebrand.ptypeShowLabel.setVisible(false);
                            ptypebrand.ptypeShowValue.setVisible(false);
                            tabProduct.ptype_oid.setDisabled(true);
                            tabProduct.ptype_level.setDisabled(true);
                            tabProduct.ptype1_id.setDisabled(true);
                            tabProduct.ptype2_id.setDisabled(true);

                            //读取临时图片文件
                            imageView.store.load();
                        }else{
                        //修改商品处理
                            var product_id=Km.AddProduct.Config.Product_id;
                            var isMulti=Km.AddProduct.Config.IsMultiplespec;

                            //改变按钮显示文字
                            this.mainconfirm.setText("确认修改");
                            this.mainreset.setText("重置");

                            //显示商品分类层级关系
                            ptypebrand.ptypeShowLabel.setVisible(true);
                            ptypebrand.ptypeShowLabel.setVisible(true);
                            //获取当前修改商品信息
                            tabProduct.doLoad();

                            //获取商品图片
                            imageView.store.setBaseParam('product_id',product_id);
                            imageView.store.load();

                            //商品多规格信息
                            if(isMulti=="1"){
                                //请求多规格信息
                                this.MultiSpec(product_id);
                            }
                            // if (!pdata || !pdata.data) return;
                            // var pdata = Km.AddProduct.Store.productStore.data.items[0];
                            // switch (Km.AddProduct.Config.OnlineEditor)
                            // {
                            //     case 1:
                            //         if (CKEDITOR.instances.specification) CKEDITOR.instances.specification.setData(pdata.data.specification);
                            //         if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(pdata.data.intro);
                            //         break
                            //     case 2:
                            //         if (Km.Product.View.EditWindow.KindEditor_specification) Km.AddProduct.View.EditWindow.KindEditor_specification.html(pdata.data.specification);
                            //         if (Km.Product.View.EditWindow.KindEditor_intro) Km.AddProduct.View.EditWindow.KindEditor_intro.html(pdata.data.intro);
                            //         break
                            //     case 3:
                            //         if (xhEditor_specification) xhEditor_specification.setSource(pdata.data.specification);
                            //         if (xhEditor_intro) xhEditor_intro.setSource(pdata.data.intro);
                            //         break
                            //     default:
                            //         if (ue_specification) ue_specification.setContent(pdata.data.specification);
                            //         if (ue_intro) ue_intro.setContent(pdata.data.intro);
                            //         break
                            // }
                        }
                    }
                },
                items : [
                    new Ext.TabPanel({
                        ref:'mainpanel',xtype:'tabpanel',id:'TabPanel',scope:this,plain:true,activeTab:0,height:550,deferredRender: false,
                        defaults:{bodyStyle:'padding:8px;'},
                        listeners:{
                            beforetabchange:function(tabpanel,newtab,currentTab){
                                //若不在商品基本信息tab页,隐藏重置按钮
                                if(tabpanel.editForm==newtab){
                                    this.ownerCt.mainreset.show();
                                }else{
                                    this.ownerCt.mainreset.hide();
                                }
                                //如果不在图片tab页面,隐藏图片编辑框
                                if(tabpanel.addImages!=newtab){
                                    Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon.HideImgEditor();
                                }
                            }
                        },
                        items:[
                            Km.AddProduct.View.Running.tabProduct,
                            Km.AddProduct.View.Running.tabImages,
                            Km.AddProduct.View.Running.tabSpec
                        ]
                    })
                ],
                buttons: [
                    {text: '确认添加',ref: '../mainconfirm',iconCls : 'icon-add',scope:this,
                        handler:function(){
                            var ctrl = this;
                            this.mainconfirm.disabled = true;
                            if(Km.AddProduct.View.Running.goodsGrid!=null){
                                //终止编辑
                                Km.AddProduct.View.Running.goodsGrid.stopEdit();
                            }
                            //商品基本信息
                            var theproduct=Km.AddProduct.View.Running.tabProduct;
                            switch (Km.AddProduct.Config.OnlineEditor)
                            {
                                case 1:
                                    if (CKEDITOR.instances.specification) theproduct.specification.setValue(CKEDITOR.instances.specification.getData());
                                    if (CKEDITOR.instances.intro) theproduct.intro.setValue(CKEDITOR.instances.intro.getData());
                                    break
                                case 2:
                                    if (theproduct.KindEditor_specification)theproduct.specification.setValue(theproduct.KindEditor_specification.html());
                                    if (theproduct.KindEditor_intro)theproduct.intro.setValue(theproduct.KindEditor_intro.html());
                                    break
                                case 3:
                                    if (xhEditor_specification)theproduct.specification.setValue(xhEditor_specification.getSource());
                                    if (xhEditor_intro)theproduct.intro.setValue(xhEditor_intro.getSource());
                                    break
                                default:
                                    if (ue_specification)theproduct.specification.setValue(ue_specification.getContent());
                                    if (ue_intro)theproduct.intro.setValue(ue_intro.getContent());
                            }
                            //商品基本信息
                            var product=theproduct.form.getValues();
                            //是否有商品主图
                            // if (!Km.AddProduct.Config.MainImage) {
                            //     Ext.Msg.alert('提示', '请添加商品主图');
                            //     ctrl.mainconfirm.disabled = false;
                            //     return;
                            // }
                            //验证
                            var result=this.Verification(product);
                            if(!result.success){
                                Ext.Msg.alert('提示','请确认<font color=red>'+result.name+'</font>');
                                var tab=Ext.getCmp('TabPanel');
                                tab.setActiveTab(0);
                                ctrl.mainconfirm.disabled = false;
                                return;
                            }
                            //初始化数据对象
                            var dataobj={};
                            //处理数据对象
                            dataobj=this.HandleData(product,dataobj);
                            //保存商品
                            if (Km.AddProduct.Config.Savetype==0){
                                ExtServiceProduct.addProduct(dataobj,function(provider, response){
                                    if (!response.result.success) {
                                        Ext.Msg.alert('提示', response.result.msg);
                                        return;
                                    }else{
                                        Ext.Msg.alert('提示', '添加商品成功！');
                                        //基本信息初始化
                                           Km.AddProduct.View.Running.tabProduct.form.reset();
                                        //图片列表刷新
                                        Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon.imagesView.doRefresh();
                                        if(Km.AddProduct.Config.IsMultiplespec){
                                            //初始化多规格
                                            Km.AddProduct.View.FnCloseSpec('yes');
                                        }
                                    }
                                    ctrl.mainconfirm.disabled = false;
                                },this);
                            }else{
                                //需要删除的商品图片
                                var delimages = Km.AddProduct.Config.Delimages;
                                if(delimages){
                                    dataobj["delimage"]=delimages;
                                }
                                   //要删除的货品
                                var delgoods = Km.AddProduct.Config.Delgoods;
                                if(delgoods){
                                    dataobj["delgoods"]=delgoods;
                                }
                                ExtServiceProduct.updateProduct(dataobj,function(provider, response){
                                    if (!response.result.success) {
                                        Ext.Msg.alert('提示', response.result.msg);
                                        return;
                                    }else{
                                        Ext.Msg.alert('提示', '商品修改成功！');
                                        Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon.imagesView.doRefresh();
                                        //初始化
                                        Km.AddProduct.Config.Delimages={};
                                    }
                                    ctrl.mainconfirm.disabled = false;
                                },this);
                            }
                        }
                    },
                    {text: '重新填写',ref:'../mainreset',scope:this,
                        handler:function(){
                            var theproduct=Km.AddProduct.View.Running.tabProduct;
                            if(Km.AddProduct.Config.Savetype==0){
                                theproduct.doReset();
                            }else{
                                theproduct.doRetrieve();
                            }

                        }
                    }
                ]
            }, config);
            Km.AddProduct.View.MainPanel.superclass.constructor.call(this, config);
        },
        /*
        *验证商品信息
        */
        Verification : function(product){
            //商品基本信息
            var proarr={'product_name':'商品名称','product_code':'商品货号','brand_id':'商品品牌','ptype_id':'所属商品分类',
                        'market_price':'市场价','price':'销售价'};
            var result={'success':true};
            //取出product值
            for(key in proarr){
                //判断是否存在该值
                if(!product[key]){
                    result['success']=false;
                    result['name']=proarr[key];
                    break;
                }
            }
            return result;
        },
        /*
        *处理商品相关数据
        */
        HandleData : function(product,dataobj){
            //处理product对象
            with(product){
                delete ptype_name;
                delete brand_name;
                if(unit=='请选择商品量词'){
                    unit='';
                }
                if(price_tag=='默认标签为商城价'){
                    price_tag='商城价';
                }
            }
            //商品基本信息
            dataobj['product'] = product;
            //商品图片信息
            var imagestore=Km.AddProduct.View.Running.tabImages.imagesLeftCon.imagesViewCon.imagesView.store;
            //上传图片个数
            var imagescount=imagestore.getCount();
            //如果存在上传图片
            if(imagescount){
                //新建图片信息数组
                var imagesarr=new Array();
                for (var i=0;i<imagescount;i++){
                    //存入store中的图片信息
                    imagesarr[i]=imagestore.getAt(i).data;
                }
                ///商品图片信息
                dataobj['images'] = imagesarr;
            }
            //多规格
            var specarr=new Array();
            //判断是否开启多规格
            if(product.isMultiplespec=='1'){
                //规格值枚举
                var speclists=Km.AddProduct.Config.SpecLists;
                var isInit=Km.AddProduct.Config.IsInit;
                dataobj['spec']   = speclists;
                dataobj['isInit'] = isInit;
                //多规格store
                var goodsStore=Km.AddProduct.View.Running.tabSpec.goodsGrid.store;
                for (var i=0;i<goodsStore.getCount();i++){
                    var goodsdata=goodsStore.getAt(i).data;
                    //判断是否是有效的记录行
                    if(goodsdata.isValid){
                        //删除临时属性
                        delete goodsdata["isValid"];
                        delete goodsdata["cbindex"];
                        delete goodsdata["cbold"];
                        for(var attr in goodsdata){
                            //取出包含attr字符串的属性
                            if(attr.indexOf("attr")==0){
                                delete goodsdata[attr];
                            }
                        }
                        goodsdata["isUp"]=goodsdata["isUp"]=="是"?true:false;
                        specarr[i]=goodsdata;
                    }
                }
                //商品多规格信息
                dataobj['goods'] = specarr;
            }
            //返回数据对象
            return dataobj;
        },
        /*
        * 请求多规格信息
        */
        MultiSpec : function(product){
            Ext.Ajax.request({
                url: 'home/admin/src/httpdata/Loadspec.php',
                params:{
                    product : product
                },
                method : 'POST',
                success : function(response) {
                    var respText = Ext.util.JSON.decode(response.responseText);
                    if(respText.success){
                        Km.AddProduct.Config.UpdateData=respText.spec;
                        Km.AddProduct.Config.Goods=respText.goods;
                        Km.AddProduct.Config.Cansel=respText.cansel;
                        //创建设置规格panel
                        Km.AddProduct.View.Running.specPanel=new Km.AddProduct.View.SpecView.SpecPanel();
                        //生成货品
                        Km.AddProduct.View.Gengoods();
                        //多规格暂存标志位
                        Km.AddProduct.Config.IsSaveSpec=true;
                    }
                },
                failure : function(){

                }
            });
        }
    }),
    /**
     * 根据所选规格值生成goods gird
     */
    Gengoods:function(){
        //商品规格tab页主容器
        main=Km.AddProduct.View.Running.tabSpec;
        if(!Km.AddProduct.View.Running.goodsGrid){
            Km.AddProduct.View.Running.goodsGrid=new Km.AddProduct.View.GoodsGrid({ref:'goodsGrid'});
            main.add(Km.AddProduct.View.Running.goodsGrid);
        }else{
            //多规格Editorgird
            var goodsGrid=Km.AddProduct.View.Running.goodsGrid;
            var fields=goodsGrid.Dyfields();
            var columns=goodsGrid.Dycolumns();
            var store=new Ext.data.ArrayStore({
                    autoDestroy: true,
                    idIndex: 0,
                    fields : fields
            })
            var colModel=new Ext.grid.ColumnModel({
                    columns: columns
            })
            //store and column reconfigure
            goodsGrid.reconfigure(store,colModel);
            goodsGrid.genData();
            goodsGrid.show();
        }
        main.openSpec.hide();
        main.closeSpec.show();
        main.doLayout();
        //改变是否多规格标识位
        Ext.getCmp('openMultiplespec').setValue(1);
        Km.AddProduct.Config.IsMultiplespec=true;
    },
    /**
     * 关闭规格
     */
    FnCloseSpec:function(btn){
        if (btn == 'yes') {
            Ext.getCmp('openMultiplespec').setValue(0);
            Km.AddProduct.Config.IsMultiplespec=false;
            //商品规格tab页主容器
            main=Km.AddProduct.View.Running.tabSpec;
            //initialize
            Km.AddProduct.Config.Cansel={};
            Km.AddProduct.Config.UpdateData={};
            Km.AddProduct.Config.SpecLists={};
            Km.AddProduct.Config.Combination=new Array();
            Km.AddProduct.Config.IsSaveSpec=false;
            Km.AddProduct.Config.IsInit=true;
            //显示开启规格
            main.openSpec.show();
            //隐藏goodsGrid
            main.goodsGrid.hide();
            //隐藏关闭规格
            main.closeSpec.hide();
            var specPanel=Km.AddProduct.View.Running.specPanel;
            specPanel.saveBtn.setText("生成商品规格");
            specPanel.savetype=0;
            //删除规格编辑窗口所有tab页
            specPanel.removeAllTab();
            main.doLayout();
        }
    },
    /**
     * 对象复制
     */
    CloneObject : function(obj){
        var o = obj.constructor === Array ? [] : {};
        for(var i in obj){
            if(obj.hasOwnProperty(i)){
                o[i] = typeof obj[i] === "object" ? this.CloneObject(obj[i]) : obj[i];
            }
        }
        return o;
    },
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前Tab页面：商品基本信息
         */
        tabProduct:null,
        /**
         * Tab页面：商品图片
         */
        tabImages:null,
        /**
         * Tab页面：商品多规格
         */
        tabSpec:null,
        /**
         * 用户当前选择的Tab
         */
        currentTab:null,
        /**
         * 多规格EditorGrid
         */
        goodsGrid:null,
           /**
         * 编辑图片window
         */
        imgEditor:null,
        /**
         * 规格设置panel
         */
        specPanel:null,
        /**
         * 规格选择panel
         */
        selPanel:null
    }
};

/**
 * Controller:主程序
 */
Ext.onReady(function()
{
    Ext.QuickTips.init();
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.AddProduct.Init();
    Ext.getBody().setStyle('margin','5px');
    //商品数据模型获取数据Direct调用
    Km.AddProduct.Store.productStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceProduct.queryPageProductById}
    });
    new Km.AddProduct.View.MainPanel({renderTo:Ext.getBody()});
    mywindows = new Ext.WindowGroup();
    mywindows.zseed = 7000;
    switch (Km.AddProduct.Config.OnlineEditor)
    {
        case 1:
            ckeditor_replace_specification();
            ckeditor_replace_intro();
            break
        case 2:
            Km.AddProduct.View.EditWindow.KindEditor_specification = KindEditor.create('textarea[name="specification"]',{width:'98%',minHeith:'350px', filterMode:true});
            Km.AddProduct.View.EditWindow.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
            break
        case 3:
            pageInit_specification();
            pageInit_intro();
            break
        default:
            Km.AddProduct.View.Running.tabProduct.specification.setWidth("98%");
            pageInit_ue_specification();
            Km.AddProduct.View.Running.tabProduct.intro.setWidth("98%");
            pageInit_ue_intro();
            break
    }
    setTimeout(function() {
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove : true
        });
        if (Km.AddProduct.Config.Savetype>0){
          //商品基本信息form
          var tabProduct=Km.AddProduct.View.Running.tabProduct;
          //获取当前修改商品信息
          tabProduct.doLoad();
        }
    }, 1000);

});
