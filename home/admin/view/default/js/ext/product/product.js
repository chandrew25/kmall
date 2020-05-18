Ext.namespace("Kmall.Admin.Product");
Km = Kmall.Admin.Product;
Km.Product={
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
             * 显示产品的视图相对商品列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示商品信息页(或者打开新窗口)
             */
            IsFix:1
        },
        /**
         * 在线编辑器类型。
         * 1:CkEditor,2:KindEditor,3:xhEditor
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
        if (Km.Product.Cookie.get('View.Direction')){
            Km.Product.Config.View.Direction=Km.Product.Cookie.get('View.Direction');
        }
        if (Km.Product.Cookie.get('View.IsFix')!=null){
            Km.Product.Config.View.IsFix=Km.Product.Cookie.get('View.IsFix');
        }
    }
};

/**
 * Model:数据模型
 */
Km.Product.Store = {
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
                    Ext.apply(options.params, Km.Product.View.Running.productGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 商品
     */
    selProductStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'goods_id',type: 'int'},
                {name: 'product_id',type: 'int'},
                {name: 'selproductitems',type: 'string'},
                {name: 'goods_name',type: 'string'},
                {name: 'goods_code',type: 'string'},
                {name: 'price',type: 'float'},
                {name: 'ptype_name',type: 'string'},
                {name: 'market_price',type: 'int'},
                {name: 'ptype_id',type: 'int'},
                {name: 'num',type: 'int'},
                {name: 'isShowProductCheck',type: 'string'},
                {name: 'uptime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'downtime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'changeTime',type: 'date',dateFormat:'Y-m-d H:i:s'},
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    Ext.apply(options.params, Km.Product.View.Running.selectProductWindow.selectProductGrid.filter);//保证分页也将查询条件带上
                }
            },
            load : function(records,options){
                if (records&&records.data&&records.data.items) {
                    var result           = new Array();
                    result['data']       =records.data.items;
                    //把已经推荐的课程选中
                    var sm=Km.Product.View.Running.selectProductWindow.selectProductGrid.sm;
                    var rows=Km.Product.View.Running.selectProductWindow.selectProductGrid.getView().getRows();
                    var updateData=[];//记录数据
                    var oldData=[];
                    for(var i=0;i<rows.length;i++){
                        if(result['data'][i]['data'].isShowProductCheck){
                            sm.selectRow(i, true);
                            oldData.push(result['data'][i]['data'].goods_id);
                        }
                        updateData[i]={product_id:result['data'][i]['data'].product_id,isShowProductCheck:false};
                    }
                    Km.Product.View.Running.selectProductWindow.updateData=updateData;
                    Km.Product.View.Running.selectProductWindow.oldData=oldData.join(',');
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
     * 商品图片
     */
    seriesimgStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'seriesimg_id',type: 'int'},
                {name: 'product_id',type: 'int'},
                {name: 'product_name',type: 'string'},
                {name: 'ico',type: 'string'},
                {name: 'img',type: 'string'},
                {name: 'image_large',type: 'string'},
                {name: 'isShow',type: 'string'},
                {name: 'sort_order',type: 'int'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    Ext.apply(options.params, Km.Product.View.Running.seriesimgGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 业务类型
     */
    btypeStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/btype.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'btypes',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'btype_id'
        }, [
            {name: 'btype_id', mapping: 'btype_id'},
            {name: 'name', mapping: 'name'}
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
     * 商品（无排序）
     */
    inputStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields: ['product_id','name']
        })
    }),
    /**
    * 用于 ‘首页-商品显示’ 插入数据
    */
    inputTo:new Ext.data.Store({
        fields: ['product_id','name']
    }),
    /**
     * 属性表
     */
    selectAttributeStore:new Ext.data.Store({
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
                    Ext.apply(options.params, Km.Product.View.Running.selectAttributeWindow.attributeGrid.filter);//保证分页也将查询条件带上
                }
            },
            load : function(records,options){
                if (records&&records.data&&records.data.items) {
                    var result           = new Array();
                    result['data']       =records.data.items;
                    //把已经推荐的属性表选中
                    var sm=Km.Product.View.Running.selectAttributeWindow.attributeGrid.sm;
                    var rows=Km.Product.View.Running.selectAttributeWindow.attributeGrid.getView().getRows();
                    for(var i=0;i<rows.length;i++){
                        if(result['data'][i]['data'].isShowAttributeCheck){
                            //sm.selectRow(i, true);
                            rows[i].style.backgroundColor='#FFF6B1';
                        }
                    }
                }
                Km.Product.View.Running.selectAttributeWindow.pattributeGrid.parent_id=null;
                Km.Product.Store.selectPAttributeStore.removeAll();
            }
        }
    }),
    selectPAttributeStore:new Ext.data.Store({
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
                    Ext.apply(options.params, Km.Product.View.Running.selectAttributeWindow.pattributeGrid.filter);//保证分页也将查询条件带上
                }
            },
            load : function(records,options){
                if (records&&records.data&&records.data.items) {
                    var result           = new Array();
                    result['data']       =records.data.items;
                    //把已经推荐的属性表选中
                    var sm=Km.Product.View.Running.selectAttributeWindow.pattributeGrid.sm;
                    var rows=Km.Product.View.Running.selectAttributeWindow.pattributeGrid.getView().getRows();
                    var updateData=[];//记录数据
                    for(var i=0;i<rows.length;i++){
                        if(result['data'][i]['data'].isShowAttributeCheck){
                            sm.selectRow(i, true);
                        }
                        updateData[i]={attribute_id:result['data'][i]['data'].attribute_id,isShowAttributeCheck:false};
                    }
                    Km.Product.View.Running.selectAttributeWindow.updateData=updateData;
                }
            }
        }
    })
};

/**
 * View:商品显示组件
 */
Km.Product.View={
    /**
     * 视图：商品图片列表
     */
    PseriesimgView:{
        /**
         * 编辑窗口：新建或者修改商品图片
         */
        EditWindow:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    /**
                     * 自定义类型:保存类型
                     * 0:保存窗口,1:修改窗口
                     */
                    savetype:0,closeAction : "hide",
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
                            ref:'editForm',layout:'form',fileUpload: true,
                            labelWidth : 100,labelAlign : "center",
                            bodyStyle : 'padding:5px 5px 0',align : "center",
                            api : {},
                            defaults : {
                                xtype : 'textfield',anchor:'100%'
                            },
                            items : [
                                {xtype: 'hidden',  name : 'seriesimg_id',ref:'../seriesimg_id'},
                                {xtype: 'hidden',name : 'product_id',ref:'../product_id'},
                                {ref:'../productname',fieldLabel : '商品名称',hiddenName : 'product_name',xtype : 'displayfield'},
                                {xtype: 'hidden',  name : 'image_large',ref:'../image_large'},
                                {fieldLabel : '商品最大图片',name : 'imageLargeUpload',ref:'../imageLargeUpload',xtype:'fileuploadfield',
                                 emptyText: '请上传商品图片图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                                {fieldLabel : '是否显示',hiddenName : 'isShow',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                    store : new Ext.data.SimpleStore({
                                            fields : ['value', 'text'],
                                            data : [['0', '否'], ['1', '是']]
                                    }),emptyText: '请选择是否显示',
                                    valueField : 'value',// 值
                                    displayField : 'text'// 显示文本
                                },
                                {fieldLabel : '排序',name : 'sort_order',value:'50'}
                            ]
                        })
                    ],
                    buttons : [ {
                        text: "",ref : "../saveBtn",scope:this,
                        handler : function() {
                            if (!this.editForm.getForm().isValid()) {
                                return;
                            }
                            editWindow=this;

                            if (this.savetype==0){
                                this.editForm.api.submit=ExtServiceSeriesimg.save;
                                this.editForm.getForm().submit({
                                    success : function(form, action) {
                                        Ext.Msg.alert("提示", "保存成功！");
                                        Km.Product.View.Running.seriesimgGrid.doSelectSeriesimg();
                                        form.reset();
                                        editWindow.hide();
                                    },
                                    failure : function(form, action) {
                                        Ext.Msg.alert('提示', '失败');
                                    }
                                });
                            }else{
                                this.editForm.api.submit=ExtServiceSeriesimg.update;
                                this.editForm.getForm().submit({
                                    success : function(form, action) {
                                        Ext.Msg.alert("提示", "修改成功！");
                                        Km.Product.View.Running.seriesimgGrid.doSelectSeriesimg();
                                        form.reset();
                                        editWindow.hide();
                                    },
                                    failure : function(form, action) {
                                        Ext.Msg.alert('提示', '失败');
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
                            this.editForm.form.loadRecord(Km.Product.View.Running.seriesimgGrid.getSelectionModel().getSelected());
                            this.imageLargeUpload.setValue(this.image_large.getValue());

                        }
                    }]
                }, config);
                Km.Product.View.PseriesimgView.EditWindow.superclass.constructor.call(this, config);
            }
        }),
        /**
         * 视图：商品图片列表
         */
        Grid:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    /**
                     * 查询条件
                     */
                    filter:null,
                    region : 'center',
                    store : Km.Product.Store.seriesimgStore,
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
                            {header : '系列图标识',dataIndex: 'seriesimg_id',hidden:true},
                            {header : '商品标识',dataIndex: 'product_id',hidden:true},
                            {header : '商品名',dataIndex : 'product_name'},
                            {header : '缩略图',dataIndex : 'ico'},
                            {header : '图片',dataIndex : 'img'},
                            {header : '超大图',dataIndex : 'image_large'},
                            {header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                            {header : '排序',dataIndex : 'sort_order'}
                        ]
                    }),
                    tbar : {
                        xtype : 'container',layout : 'anchor',
                        height : 27 ,style:'font-size:14px',
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
                                        text: '反选',iconCls : 'icon-reverse',
                                        handler: function(){
                                            this.onReverseSelect();
                                        }
                                    },'-',{
                                        text : '添加商品图片',iconCls : 'icon-add',ref: '../../btnSave',
                                        handler : function() {
                                            this.addSeriesimg();
                                        }
                                    },'-',{
                                        text : '修改商品图片',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                        handler : function() {
                                            this.updateSeriesimg();
                                        }
                                    },'-',{
                                        text : '删除商品图片', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                        handler : function() {
                                            this.deleteSeriesimg();
                                        }
                                    }]}
                        )]
                    }
                }, config);
                //初始化显示商品图片列表
                this.doSelectSeriesimg();
                Km.Product.View.PseriesimgView.Grid.superclass.constructor.call(this, config);
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
                    }
                }
            }),
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
             * 查询符合条件的商品图片
             */
            doSelectSeriesimg : function() {
                if (Km.Product.View.Running.productGrid!=null){
                    var product_data = Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data;
                    var product_id = product_data.product_id;
                    this.filter       ={'product_id':product_id};
                    ExtServiceSeriesimg.queryPageSeriesimg(this.filter,function(provider, response) {
                        if (response.result.data) {
                            var result           = new Array();
                            result['data']       =response.result.data;
                            result['totalCount'] =response.result.totalCount;
                            Km.Product.Store.seriesimgStore.loadData(result);
                        } else {
                            Km.Product.Store.seriesimgStore.removeAll();
                            Ext.Msg.alert('提示', '无符合条件的商品图片！');
                        }
                    });
                }
            },
            /**
             * 新建商品图片
             */
            addSeriesimg : function() {
                if (Km.Product.View.Running.edit_window_seriesimg==null){
                    Km.Product.View.Running.edit_window_seriesimg=new Km.Product.View.PseriesimgView.EditWindow();
                }
                Km.Product.View.Running.edit_window_seriesimg.resetBtn.setVisible(false);
                Km.Product.View.Running.edit_window_seriesimg.saveBtn.setText('保 存');
                Km.Product.View.Running.edit_window_seriesimg.setTitle('添加商品图片');
                Km.Product.View.Running.edit_window_seriesimg.savetype=0;

                if (Km.Product.View.Running.productGrid!=null){
                    var product_data = Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data;
                    Km.Product.View.Running.edit_window_seriesimg.productname.setValue(product_data.product_name);
                    Km.Product.View.Running.edit_window_seriesimg.product_id.setValue(product_data.product_id);
                }
                Km.Product.View.Running.edit_window_seriesimg.seriesimg_id.setValue("");

                Km.Product.View.Running.edit_window_seriesimg.show();
                Km.Product.View.Running.edit_window_seriesimg.maximize();
            },
            /**
             * 编辑商品图片时先获得选中的商品图片信息
             */
            updateSeriesimg : function() {
                if (Km.Product.View.Running.edit_window_seriesimg==null){
                    Km.Product.View.Running.edit_window_seriesimg=new Km.Product.View.PseriesimgView.EditWindow();
                }
                Km.Product.View.Running.edit_window_seriesimg.saveBtn.setText('修 改');
                Km.Product.View.Running.edit_window_seriesimg.resetBtn.setVisible(true);
                Km.Product.View.Running.edit_window_seriesimg.setTitle('修改商品图片');
                Km.Product.View.Running.edit_window_seriesimg.editForm.form.loadRecord(this.getSelectionModel().getSelected());
                Km.Product.View.Running.edit_window_seriesimg.savetype=1;
                Km.Product.View.Running.edit_window_seriesimg.imageLargeUpload.setValue(Km.Product.View.Running.edit_window_seriesimg.image_large.getValue());

                if (Km.Product.View.Running.productGrid!=null){
                    var product_data = Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data;
                    Km.Product.View.Running.edit_window_seriesimg.productname.setValue(product_data.product_name);
                    Km.Product.View.Running.edit_window_seriesimg.product_id.setValue(product_data.product_id);
                }
                Km.Product.View.Running.edit_window_seriesimg.show();
            },
            /**
             * 删除商品图片
             */
            deleteSeriesimg : function() {
                Ext.Msg.confirm('提示', '确实要删除所选的商品图片吗?', this.confirmDeleteSeriesimg,this);
            },
            /**
             * 确认删除商品图片
             */
            confirmDeleteSeriesimg : function(btn) {
                if (btn == 'yes') {
                    var del_seriesimg_ids ="";
                    var selectedRows    = this.getSelectionModel().getSelections();
                    for ( var flag = 0; flag < selectedRows.length; flag++) {
                        del_seriesimg_ids=del_seriesimg_ids+selectedRows[flag].data.seriesimg_id+",";
                    }
                    ExtServiceSeriesimg.deleteByIds(del_seriesimg_ids);
                    this.doSelectSeriesimg();
                    Ext.Msg.alert("提示", "删除成功！");
                }
            }
        })
    },
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
                savetype:0,
                closeAction : "hide",
                constrainHeader:true,maximizable: true,collapsible: true,
                width : 640,height : 550,minWidth : 400,minHeight : 450,
                layout : 'fit',plain : true,buttonAlign : 'center',
                defaults : {
                    autoScroll : true
                },
                listeners:{
                    beforehide:function(){
                        this.editForm.form.getEl().dom.reset();
                    },
                    afterrender:function(){
                        switch (Km.Product.Config.OnlineEditor)
                        {
                            case 2:
                                Km.Product.View.EditWindow.KindEditor_specification = KindEditor.create('textarea[name="specification"]',{width:'98%',minHeith:'350px', filterMode:true});
                                Km.Product.View.EditWindow.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
                                break
                            case 3:
                                pageInit_specification();
                                pageInit_intro();
                                break
                            default:
                                ckeditor_replace_specification();
                                ckeditor_replace_intro();
                        }
                    }
                },
                items : [
                    new Ext.form.FormPanel({
                        ref:'editForm',layout:'form',fileUpload: true,
                        labelWidth : 150,labelAlign : "center",
                        bodyStyle : 'padding:5px 5px 0',align : "center",
                        api : {},
                        defaults : {
                            xtype : 'textfield',anchor:'98%'
                        },
                        items : [
                            {xtype: 'hidden',  name : 'product_id',ref:'../product_id'},
                            {
                                xtype: 'compositefield',
                                defaults : {
                                    xtype : 'textfield'
                                },
                                items: [
                                    {fieldLabel: '商品名称(<font color=red>*</font>)',allowBlank : false,name: 'product_name',flex:2},
                                    {xtype:'displayfield',value:'商品货号(<font color=red>*</font>):'},{name: 'product_code',allowBlank : false,flex:2},
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
                            {xtype: 'hidden',name : 'brand_id',ref:'../brand_id'},
                            {xtype: 'hidden',name : 'ptype_id',ref:'../ptype_id'},
                            {
                                xtype: 'compositefield',ref: '../ptypebrand',
                                defaults : {xtype : 'textfield'},
                                items: [
                                    {
                                         xtype: 'combo',name : 'brand_name',ref : 'brand_name',fieldLabel:"商品品牌(<font color=red>*</font>):",
                                         store:Km.Product.Store.brandStore,emptyText: '请选择商品品牌',itemSelector: 'div.search-item',
                                         loadingText: '查询中...',pageSize:Km.Product.Config.PageSize,
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
                                    {xtype:'displayfield',value:'所属商品分类:'},
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
                                    {xtype:"displayfield",value:"所选商品分类:",ref: 'ptypeShowLabel'},{xtype:"displayfield",name:"ptypeShowAll",flex:1,ref: 'ptypeShowValue'}]
                            },
                            {xtype: 'hidden',name : 'ptype_oid',ref:'../ptype_oid'},
                            {xtype: 'hidden',name : 'ptype_level',ref:'../ptype_level'},
                            {xtype: 'hidden',name : 'ptype1_id'},
                            {xtype: 'hidden',name : 'ptype2_id'},
                            {xtype: 'hidden',  name : 'image_large',ref:'../image_large'},
                            {fieldLabel : '商品图片(600*600)(<font color=red>*</font>)',name : 'image_largeUpload',ref:'../image_largeUpload',xtype:'fileuploadfield',allowBlank : false,
                             emptyText: '请上传商品图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {
                                xtype: 'compositefield',
                                defaults : {
                                    xtype : 'textfield'
                                },
                                items: [
                                    {xtype:"numberfield",fieldLabel: '市场价(<font color=red>*</font>)',allowBlank : false,name: 'market_price',flex:1},
                                    {xtype:'displayfield',value:'销售价(<font color=red>*</font>):'},{xtype:"numberfield",name: 'price',allowBlank : false,flex:1},
                                    {xtype:"numberfield",fieldLabel: '券',name: 'jifen',flex:1},
                                    {xtype:'displayfield',value:'价格标签:'},{name: 'price_tag',emptyText: '默认标签为商城价',flex:1},

                                    {xtype:'displayfield',value:'数量:'},{xtype:"numberfield",name : 'num',value:'1',flex:1},
                                    {xtype:'displayfield',value:'最少购买数量:'},{xtype:"numberfield",name : 'mustBuyNum',value:'1',flex:1}]
                            },
                            {
                                xtype: 'compositefield',ref: '../unitpackage',
                                defaults : {
                                    xtype : 'textfield'
                                },
                                items: [
                                    {
                                         fieldLabel : '商品量词',xtype: 'combo',name : 'unit',ref:'unit',
                                         store:Km.Product.Store.quantifierStore,emptyText: '请选择商品量词',itemSelector: 'div.search-item',
                                         loadingText: '查询中...',pageSize:Km.Product.Config.PageSize,
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
                                    {fieldLabel : '是否推荐(<font color=red>*</font>)',hiddenName : 'isRecommend',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
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
                            {fieldLabel : '商品介绍',xtype : 'textarea',name : 'intro',id:'intro',ref:'intro'},
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
                            {xtype: 'hidden',name : 'supplier_id',ref:'../supplier_id'},
                            {
                                 fieldLabel : '供应商',xtype: 'combo',name : 'sp_name',ref : '../sp_name',
                                 store:Km.Product.Store.supplierStore,emptyText: '请选择供应商',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Product.Config.PageSize,
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
                                        this.grid.s_party.setValue(record.data.sp_name);
                                        this.collapse();
                                     }
                                 }
                            },
              {xtype:"numberfield",fieldLabel: '成本价',name: 'cost',flex:1},
                            {fieldLabel : '商品规格',name : 'specification',xtype : 'textarea',id:'specification',ref:'specification'}
                        ]
                    })
                ],
                buttons : [ {
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {
                        switch (Km.Product.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Product.View.EditWindow.KindEditor_specification)this.editForm.specification.setValue(Km.Product.View.EditWindow.KindEditor_specification.html());
                                if (Km.Product.View.EditWindow.KindEditor_intro)this.editForm.intro.setValue(Km.Product.View.EditWindow.KindEditor_intro.html());
                                break
                            case 3:
                                if (xhEditor_specification)this.editForm.specification.setValue(xhEditor_specification.getSource());
                                if (xhEditor_intro)this.editForm.intro.setValue(xhEditor_intro.getSource());
                                break
                            default:
                                if (CKEDITOR.instances.specification) this.editForm.specification.setValue(CKEDITOR.instances.specification.getData());
                                if (CKEDITOR.instances.intro) this.editForm.intro.setValue(CKEDITOR.instances.intro.getData());
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
                                    Km.Product.View.Running.productGrid.doSelectProduct();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceProduct.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Product.View.Running.productGrid.bottomToolbar.doRefresh();
                                    }});
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
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
                        this.editForm.form.loadRecord(Km.Product.View.Running.productGrid.getSelectionModel().getSelected());
                        this.image_largeUpload.setValue(this.image_large.getValue());
                        switch (Km.Product.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Product.View.EditWindow.KindEditor_specification) Km.Product.View.EditWindow.KindEditor_specification.html(Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data.specification);
                                if (Km.Product.View.EditWindow.KindEditor_intro) Km.Product.View.EditWindow.KindEditor_intro.html(Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data.intro);
                                break
                            case 3:
                                break
                            default:
                                if (CKEDITOR.instances.specification) CKEDITOR.instances.specification.setData(Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data.specification);
                                if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data.intro);
                        }
                    }
                }]
            }, config);
            Km.Product.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示商品详情
     */
    ProductView:{
        /**
         * Tab页：容器包含显示与商品所有相关的信息
         */
        Tabs:Ext.extend(Ext.TabPanel,{
            constructor : function(config) {
                config = Ext.apply({
                    region : 'south',
                    collapseMode : 'mini',split : true,
                    activeTab: 1, tabPosition:"bottom",resizeTabs : true,
                    header:false,enableTabScroll : true,tabWidth:'auto', margins : '0 3 3 0',
                    defaults : {
                        autoScroll : true
                    },
                    listeners:{
                        beforetabchange:function(tabs,newtab,currentTab){
                            if (tabs.tabFix==newtab){
                                if (Km.Product.View.Running.productGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择商品！');
                                    return false;
                                }
                                Km.Product.Config.View.IsShow=1;
                                Km.Product.View.Running.productGrid.showProduct();
                                Km.Product.View.Running.productGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Product.View.ProductView.Tabs.superclass.constructor.call(this, config);
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Product.Config.View.Direction==1)||(Km.Product.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabProductDetail',iconCls:'tabs',
                     tpl: [
                     '<table class="viewdoblock">',
                         '<tr class="entry"><td class="head">商品名称</td><td class="content">{product_name}</td></tr>',
                         '<tr class="entry"><td class="head">商品品牌</td><td class="content">{brand_name}</td></tr>',
                         '<tr class="entry"><td class="head">商品分类</td><td class="content">{ptypeShowAll}</td></tr>',
                         '<tr class="entry"><td class="head">是否推荐</td><td class="content"><tpl if="isRecommend == true">是</tpl><tpl if="isRecommend == false">否</tpl></td></tr>',
                         '<tr class="entry"><td class="head">商品货号</td><td class="content">{product_code}</td></tr>',
                         '<tr class="entry"><td class="head">货品内部编号</td><td class="content">{goods_no}</td></tr>',
                         '<tr class="entry"><td class="head">是否大礼包</td><td class="content"><tpl if="isPackage == true">是</tpl><tpl if="isPackage == false">否</tpl></td></tr>',
                         '<tr class="entry"><td class="head">排序</td><td class="content">{sort_order}</td></tr>',
                         '<tr class="entry"><td class="head">商品图片路径</td><td class="content">{image}</td></tr>',
                         '<tr class="entry"><td class="head">商品图片</td><td class="content"><a href="upload/images/{image}" target="_blank"><img src="upload/images/{image}" /></a></td></tr>',
                         '<tr class="entry"><td class="head">超大图片路径</td><td class="content">{image_large}</td></tr>',
                         '<tr class="entry"><td class="head">超大图片</td><td class="content"><a href="upload/images/{image_large}" target="_blank"><img src="upload/images/{image_large}" /></a></td></tr>',
                         '<tr class="entry"><td class="head">商品规格</td><td class="content">{specification}</td></tr>',
                         '<tr class="entry"><td class="head">￥市场价</td><td class="content">{market_price}(元)</td></tr>',
                         '<tr class="entry"><td class="head">价格标签</td><td class="content">{price_tag}</td></tr>',
                         '<tr class="entry"><td class="head">￥销售价</td><td class="content">{price}(元)</td></tr>',
                         '<tr class="entry"><td class="head">商品量词</td><td class="content">{unit}</td></tr>',
                         '<tr class="entry"><td class="head">原价券</td><td class="content">{market_jifen}</td></tr>',
                         '<tr class="entry"><td class="head">券</td><td class="content">{jifen}</td></tr>',
                         '<tr class="entry"><td class="head">规格</td><td class="content">{scale}</td></tr>',
                         '<tr class="entry"><td class="head">数量</td><td class="content">{num}</td></tr>',
                         '<tr class="entry"><td class="head">最少购买数量</td><td class="content">{mustBuyNum}</td></tr>',
                         '<tr class="entry"><td class="head">重量</td><td class="content">{weight}</td></tr>',
                         '<tr class="entry"><td class="head">商品介绍</td><td class="content">{intro}</td></tr>',
                         '<tr class="entry"><td class="head">广告词</td><td class="content">{message}</td></tr>',
                         '<tr class="entry"><td class="head">左侧广告词</td><td class="content">{msgleft}</td></tr>',
                         '<tr class="entry"><td class="head">右侧广告词</td><td class="content">{msgright}</td></tr>',
                         '<tr class="entry"><td class="head">销售量</td><td class="content">{sales_count}</td></tr>',
                         '<tr class="entry"><td class="head">热度</td><td class="content">{click_count}</td></tr>',
                         '<tr class="entry"><td class="head">所属国家</td><td class="content">{country_name}</td></tr>',
                         '<tr class="entry"><td class="head">上架时间</td><td class="content">{uptime:date("Y-m-d")}</td></tr>',
                         '<tr class="entry"><td class="head">下架时间</td><td class="content">{downtime:date("Y-m-d")}</td></tr>',
                     '</table>'
                     ]
                    }
                );
                Km.Product.View.Running.seriesimgGrid = new Km.Product.View.PseriesimgView.Grid({title:'商品系列图',iconCls:'tabs'});
                this.add(
                    Km.Product.View.Running.seriesimgGrid
                );
            }
        }),

        /**
         * 窗口:显示商品信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看商品",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Product.View.ProductView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Product.Config.View.IsShow=0;
                            Km.Product.View.Running.productGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Product.Config.View.IsShow=0;
                            Km.Product.View.Running.productGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Product.View.Running.productGrid.addProduct();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Product.View.Running.productGrid.updateProduct();}
                    }]
                }, config);
                Km.Product.View.ProductView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 视图：赠品商品
     */
    SelectProductView:{
       SelectProductWindow:Ext.extend(Ext.Window,{
         constructor : function(config) {
           config = Ext.apply({
             title:"选择商品",updateData:null,closeAction:"hide",constrainHeader:true,maximizable:true,collapsible:true,
             width:900,minWidth:900,height:560,minHeight:450,layout:'fit',plain : true,buttonAlign : 'center',
             defaults : {autoScroll : true},
             listeners:{
                         hide:function(w){Km.Product.View.Running.productGrid.gift.toggle(false);}
                     },
             items : [new Km.Product.View.SelectProductView.SelectProductGrid({ref:"selectProductGrid"})],
             buttons : [ {
               text: "确定",ref : "../saveBtn",scope:this,
               handler : function() {
                 //获取选中的项
                 var selectedData=Km.Product.View.Running.selectProductWindow.selectProductGrid.getSelectionModel().getSelections();
                 var selids=[];
                 var idcount=selectedData.length;
                 //如果选中项个数不为零
                 if(idcount){
                   for(var i=0;i<selectedData.length;i++){
                     selids.push(selectedData[i].get("goods_id"));
                   }
                 }
                 if(!idcount){
                   idcount=0;
                 }
                 var gift_ids=selids.join(',');
                 var selmsg='<font color=green>(您总共选择了'+idcount+'件商品!)</font>';
                 // Ext.getCmp('selproductitems').setValue(selids);
                 // Ext.getCmp('selbutton').removeClass('x-form-invalid');
                 // Ext.getCmp('selbuttontext').setValue(selmsg);
                 var product_id=Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data.product_id;
                 var oldData=Km.Product.View.Running.selectProductWindow.oldData;
                 var condition = {'gift_ids':gift_ids,product_id:product_id,old_gift_ids:oldData};
                  ExtServiceProduct.updateProductGift(condition,function(provider, response) {
                    if (response.result.success==true) {
                       Ext.Msg.alert('提示', "更新成功！ 新增 "+response.result.add+"个，取消"+response.result.del+"个。");
                    } else {
                      Km.Product.Store.selProductStore.removeAll();
                      Ext.Msg.alert('提示', '更新失败！');
                    }
                  });
                  this.hide();
               }
             }, {
               text : "取 消",scope:this,
               handler : function() {
                 this.hide();
               }
             }]
           }, config);
           Km.Product.View.SelectProductView.SelectProductWindow.superclass.constructor.call(this, config);
         }
       }),
       SelectProductGrid:Ext.extend(Ext.grid.GridPanel,{
         constructor : function(config) {
           config = Ext.apply({
             /**
              * 查询条件
              */
             filter:null,product_id:null,region : 'center',store : Km.Product.Store.selProductStore,sm : this.sm,
             trackMouseOver : true,enableColumnMove : true,columnLines : true,loadMask : true,stripeRows : true,headerAsText : false,
             defaults : {autoScroll : true},
             cm : new Ext.grid.ColumnModel({
               defaults:{width:120,sortable : true},
               columns : [
                 this.sm,
                 {header : '商品名称',dataIndex : 'goods_name'},
                 {header : '商品分类',dataIndex : 'ptype_name'},
                 {header : '商品货号',dataIndex : 'goods_code'},
                 {header : '市场价',dataIndex : 'market_price'},
                 {header : '销售价',dataIndex : 'price'},
                 {header : '数量',dataIndex : 'num'}
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
                   enableOverflow: true,width : 80,ref:'menus',
                   defaults : {
                     xtype : 'textfield',
                     listeners : {
                        specialkey : function(field, e) {
                         if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectProduct();
                       }
                     }
                   },
                   items : [
                     {text: '全部',ref:'../../isSelect',xtype:'tbsplit',iconCls : 'icon-view',enableToggle: true,
                        toggleHandler:function(item, checked){
                         if (checked==true){
                           Km.Product.View.Running.selectProductWindow.selectProductGrid.topToolbar.menus.select.setChecked(true);
                         }else{
                           Km.Product.View.Running.selectProductWindow.selectProductGrid.topToolbar.menus.all.setChecked(true);
                         }
                       },
                       menu: {
                         items: [
                           {text: '全部',checked: true,group: 'isSelect',ref:'../../all',
                             checkHandler: function(item, checked){
                               if (checked){
                                 Km.Product.View.Running.selectProductWindow.selectProductGrid.isSelect.setText(item.text);
                                 Km.Product.View.Running.selectProductWindow.selectProductGrid.filter.selectType=0;
                               }
                               Km.Product.View.Running.selectProductWindow.selectProductGrid.doSelectProduct();
                             }
                           },
                           {text: '未选择',checked: false,group: 'isSelect',ref:'../../unselect',
                               checkHandler: function(item, checked){
                                 if (checked){
                                   Km.Product.View.Running.selectProductWindow.selectProductGrid.isSelect.setText(item.text);
                                   Km.Product.View.Running.selectProductWindow.selectProductGrid.filter.selectType=2;
                                 }
                                 Km.Product.View.Running.selectProductWindow.selectProductGrid.doSelectProduct();
                               }
                           },
                           {text: '已选择',checked: false,group: 'isSelect',ref:'../../select',
                               checkHandler: function(item, checked){
                                 if (checked){
                                   Km.Product.View.Running.selectProductWindow.selectProductGrid.isSelect.setText(item.text);
                                   Km.Product.View.Running.selectProductWindow.selectProductGrid.filter.selectType=1;
                                 }
                                 Km.Product.View.Running.selectProductWindow.selectProductGrid.doSelectProduct();
                             }
                           }
                          ]
                       }
                     },
                     '商品名称','&nbsp;&nbsp;',{ref: '../goods_name'},'&nbsp;&nbsp;',
                     {
                       xtype : 'button',text : '查询',scope: this,
                       handler : function() {
                         this.doSelectProduct();
                       }
                     },
                     {
                       xtype : 'button',text : '重置',scope: this,
                       handler : function() {
                         this.topToolbar.goods_name.setValue("");
                         this.filter={};
                         this.doSelectProduct();
                       }
                     },
                                    {xtype : 'hidden',id:'selproductitems',name:'selproductitems',value:''},
                                    {xtype:'displayfield',id:'selbuttontext',value:'',width:200}
                   ]
                 })
               ]
             },
             bbar: new Ext.PagingToolbar({
               pageSize: Km.Product.Config.PageSize,
               store: Km.Product.Store.selProductStore,
               scope:this,autoShow:true,displayInfo: true,
               displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
               emptyMsg: "无显示数据",
               items: [
                 {xtype:'label', text: '每页显示'},
                 {xtype:'numberfield', value:Km.Product.Config.PageSize,minValue:1,width:35,
                   style:'text-align:center',allowBlank:false,
                   listeners:
                   {
                     change:function(Field, newValue, oldValue){
                       var num = parseInt(newValue);
                       if (isNaN(num) || !num || num<1)
                       {
                         num = Km.Product.Config.PageSize;
                         Field.setValue(num);
                       }
                       this.ownerCt.pageSize= num;
                       Km.Product.Config.PageSize = num;
                       this.ownerCt.ownerCt.doSelectProduct();
                     },
                     specialKey :function(field,e){
                       if (e.getKey() == Ext.EventObject.ENTER){
                         var num = parseInt(field.getValue());
                         if (isNaN(num) || !num || num<1)
                         {
                           num = Km.Product.Config.PageSize;
                         }
                         this.ownerCt.pageSize= num;
                         Km.Product.Config.PageSize = num;
                         this.ownerCt.ownerCt.doSelectProduct();
                       }
                     }
                   }
                 },
                 {xtype:'label', text: '个'}
               ]
             })
           }, config);
           Km.Product.Store.selProductStore.proxy=new Ext.data.DirectProxy({
             api: {read:ExtServiceProduct.queryPageSelProduct}
           });
           Km.Product.View.SelectProductView.SelectProductGrid.superclass.constructor.call(this, config);
         },
         sm : new Ext.grid.CheckboxSelectionModel(),
         doSelectProduct : function() {
           if (this.topToolbar){
             var product_id=this.product_id;
             if (!this.filter.selectType)this.filter.selectType=0;
             var goods_name = this.topToolbar.goods_name.getValue();
             this.filter     ={'goods_name':goods_name,'product_id':product_id,'selectType':this.filter.selectType};
           }
           var condition = {'start':0,'limit':Km.Product.Config.PageSize};
           Ext.apply(condition,this.filter);
           ExtServiceProduct.queryPageSelProduct(condition,function(provider, response) {
             if (response.result&&response.result.data) {
               var result       = new Array();
               result['data']     =response.result.data;
               result['totalCount'] =response.result.totalCount;
               //选中的商品
               var ids=Ext.getCmp('selproductitems').getValue();
               if(ids){
                 var selectedData=ids.split(",");
                 for(var i=0;i<selectedData.length;i++){
                   for(var j=0;j<result['data'].length;j++){
                     if(result['data'][j].product_id==selectedData[i]){
                       result['data'][j].isShowProductCheck=true;
                     }
                   }
                 }
               }
               Km.Product.Store.selProductStore.loadData(result);
             } else {
               Km.Product.Store.selProductStore.removeAll();
               Ext.Msg.alert('提示', '无符合条件的课程！');
             }
           });
         }
       })
     },
    /**
     * 视图：属性表
     */
    AttributeView:{
        SelectAttributeWindow:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"选择属性",updateData:null,closeAction:"hide",constrainHeader:true,maximizable:true,collapsible:true,
                    width:500,minWidth:500,height:550,minHeight:550,layout:{type:"hbox",align:"stretch"},plain : true,buttonAlign : 'center',
                    defaults : {autoScroll : true},
                    listeners:{
                        hide:function(w){Km.Product.View.Running.productGrid.tattribute.toggle(false);}
                    },
                    items : [
                        new Km.Product.View.AttributeView.AttributeGrid({ref:"attributeGrid",flex:3}),
                        new Km.Product.View.AttributeView.PAttributeGrid({ref:"pattributeGrid",flex:7})
                    ],
                    buttons : [ {
                        text: "确定",ref : "../saveBtn",scope:this,
                        handler : function() {
                            var condition={product_id:this.product_id,attributes:null};
                            var updateData=Km.Product.View.Running.selectAttributeWindow.updateData;
                            var selectedData=Km.Product.View.Running.selectAttributeWindow.pattributeGrid.getSelectionModel().getSelections();
                            for(var i=0;i<selectedData.length;i++){
                                for(var j=0;j<updateData.length;j++){
                                    if(updateData[j].attribute_id==selectedData[i].get("attribute_id")){
                                        updateData[j].isShowAttributeCheck=true;
                                    }
                                }
                            }
                            condition.attributes=updateData;
                            ExtServiceProduct.updateProductAttribute(condition,function(provider, response) {
                                if(response.result.success==true) Ext.Msg.alert('提示','选择成功'); else Ext.Msg.alert('提示', '选择失败');
                                var sm=Km.Product.View.Running.selectAttributeWindow.attributeGrid.sm;
                                var rows=Km.Product.View.Running.selectAttributeWindow.attributeGrid.getView().getRows();
                                for (var i=0;i<rows.length;i++){
                                    if (sm.isSelected(i)) {
                                        break;
                                    }
                                }
                                Km.Product.View.Running.selectAttributeWindow.attributeGrid.doSelectAttribute(i);
                            });
                        }
                    }, {
                        text : "取 消",scope:this,
                        handler : function() {
                            this.hide();
                        }
                    }]
                }, config);
                Km.Product.View.AttributeView.SelectAttributeWindow.superclass.constructor.call(this, config);
            }
        }),
        AttributeGrid:Ext.extend(Ext.grid.GridPanel,{
            constructor : function(config) {
                config = Ext.apply({
                    /**
                     * 查询条件
                     */
                    filter:{},ptype_id:null,region : 'center',store : Km.Product.Store.selectAttributeStore,sm : this.sm,
                    trackMouseOver : true,enableColumnMove : true,columnLines : true,loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {autoScroll : true},
                    cm : new Ext.grid.ColumnModel({
                        defaults:{width:120,sortable : true},
                        columns : [
                            {header : '类型',dataIndex : 'attribute_name'}
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
                                enableOverflow: true,width : 80,ref:'menus',
                                items : [
                                    {text: '全部',ref:'../../isSelect',xtype:'tbsplit',iconCls : 'icon-view',enableToggle: false,
                                        menu: {
                                            items: [
                                                {text: '全部',checked: true,group: 'isSelect',ref:'../../all',
                                                    checkHandler: function(item, checked){
                                                        if (checked){
                                                            Km.Product.View.Running.selectAttributeWindow.attributeGrid.isSelect.setText(item.text);
                                                            Km.Product.View.Running.selectAttributeWindow.attributeGrid.filter.selectType=0;
                                                            Km.Product.View.Running.selectAttributeWindow.attributeGrid.doSelectAttribute();
                                                        }
                                                    }
                                                },
                                                {text: '未选择',checked: false,group: 'isSelect',ref:'../../unselect',
                                                      checkHandler: function(item, checked){
                                                          if (checked){
                                                              Km.Product.View.Running.selectAttributeWindow.attributeGrid.isSelect.setText(item.text);
                                                              Km.Product.View.Running.selectAttributeWindow.attributeGrid.filter.selectType=2;
                                                              Km.Product.View.Running.selectAttributeWindow.attributeGrid.doSelectAttribute();
                                                          }
                                                      }
                                                },
                                                {text: '已选择',checked: false,group: 'isSelect',ref:'../../select',
                                                      checkHandler: function(item, checked){
                                                          if (checked){
                                                              Km.Product.View.Running.selectAttributeWindow.attributeGrid.isSelect.setText(item.text);
                                                              Km.Product.View.Running.selectAttributeWindow.attributeGrid.filter.selectType=1;
                                                              Km.Product.View.Running.selectAttributeWindow.attributeGrid.doSelectAttribute();
                                                          }
                                                    }
                                                }
                                             ]
                                        }
                                    }
                                ]
                            })
                        ]
                    }
                }, config);
                //初始化显示属性表列表
                Km.Product.Store.selectAttributeStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceProduct.queryPageProductAttribute}
                });
                Km.Product.View.AttributeView.AttributeGrid.superclass.constructor.call(this, config);
            },
            sm : new Ext.grid.RowSelectionModel({
                singleSelect:true,
                listeners : {
                    rowselect: function(sm, rowIndex, record) {
                        if (sm.getCount() != 1){
                            Km.Product.View.Running.selectAttributeWindow.pattributeGrid.parent_id=null;
                            Km.Product.Store.selectPAttributeStore.removeAll();
                        }else{
                            var attribute_id=Km.Product.View.Running.selectAttributeWindow.attributeGrid.getSelectionModel().getSelected().data.attribute_id;
                            Km.Product.View.Running.selectAttributeWindow.pattributeGrid.parent_id=attribute_id;
                            Km.Product.View.Running.selectAttributeWindow.pattributeGrid.filter={};
                            Km.Product.View.Running.selectAttributeWindow.pattributeGrid.topToolbar.menus.all.setChecked(true);
                            Km.Product.View.Running.selectAttributeWindow.pattributeGrid.doSelectAttribute();
                        }
                    },
                    rowdeselect: function(sm, rowIndex, record) {
                        if (sm.getCount() != 1){
                            Km.Product.View.Running.selectAttributeWindow.pattributeGrid.parent_id=null;
                            Km.Product.Store.selectPAttributeStore.removeAll();
                        }
                    }
                }
            }),
            doSelectAttribute : function(index){
                if (this.topToolbar){
                    var product_id=Km.Product.View.Running.selectAttributeWindow.product_id;
                    if (!this.filter.selectType)this.filter.selectType=0;
                    this.filter       ={'product_id':product_id,'selectType':this.filter.selectType};
                }
                var condition = {'start':0,'limit':Km.Product.Config.PageSize};
                this.filter.all=1;
                Ext.apply(condition,this.filter);
                ExtServiceProduct.queryPageProductAttribute(condition,function(provider, response) {
                    if (response.result&&response.result.data) {
                        var result           = new Array();
                        result['data']       =response.result.data;
                        result['totalCount'] =response.result.totalCount;
                        Km.Product.Store.selectAttributeStore.loadData(result);
                        Km.Product.View.Running.selectAttributeWindow.attributeGrid.sm.selectRow(index, true);
                    } else {
                        Km.Product.Store.selectAttributeStore.removeAll();
                        Ext.Msg.alert('提示', '无符合条件的属性！');
                    }
                });
            }
        }),
        PAttributeGrid:Ext.extend(Ext.grid.GridPanel,{
            constructor : function(config) {
                config = Ext.apply({
                    /**
                     * 查询条件
                     */
                    filter:{},ptype_id:null,region : 'center',store : Km.Product.Store.selectPAttributeStore,sm : this.sm,
                    trackMouseOver : true,enableColumnMove : true,columnLines : true,loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {autoScroll : true},parent_id:null,
                    cm : new Ext.grid.ColumnModel({
                        defaults:{width:120,sortable : true},
                        columns : [
                            this.sm,
                            {header : '属性',dataIndex : 'attribute_name'}
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
                                enableOverflow: true,width : 80,ref:'menus',
                                defaults : {
                                    xtype : 'textfield',
                                    listeners : {
                                       specialkey : function(field, e) {
                                            if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectAttribute();
                                        }
                                    }
                                },
                                items : [
                                    {text: '全部',ref:'../../isSelect',xtype:'tbsplit',iconCls : 'icon-view',enableToggle: false,
                                        menu: {
                                            items: [
                                                {text: '全部',checked: true,group: 'isPSelect',ref:'../../all',
                                                    checkHandler: function(item, checked){
                                                        if(checked){
                                                            Km.Product.View.Running.selectAttributeWindow.pattributeGrid.isSelect.setText(item.text);
                                                            Km.Product.View.Running.selectAttributeWindow.pattributeGrid.filter.selectType=0;
                                                            Km.Product.View.Running.selectAttributeWindow.pattributeGrid.doSelectAttribute();
                                                        }
                                                    }
                                                },
                                                {text: '未选择',checked: false,group: 'isPSelect',ref:'../../unselect',
                                                      checkHandler: function(item, checked){
                                                          if(checked){
                                                              Km.Product.View.Running.selectAttributeWindow.pattributeGrid.isSelect.setText(item.text);
                                                              Km.Product.View.Running.selectAttributeWindow.pattributeGrid.filter.selectType=2;
                                                              Km.Product.View.Running.selectAttributeWindow.pattributeGrid.doSelectAttribute();
                                                          }
                                                      }
                                                },
                                                {text: '已选择',checked: false,group: 'isPSelect',ref:'../../select',
                                                      checkHandler: function(item, checked){
                                                          if(checked){
                                                              Km.Product.View.Running.selectAttributeWindow.pattributeGrid.isSelect.setText(item.text);
                                                              Km.Product.View.Running.selectAttributeWindow.pattributeGrid.filter.selectType=1;
                                                              Km.Product.View.Running.selectAttributeWindow.pattributeGrid.doSelectAttribute();
                                                          }
                                                    }
                                                }
                                             ]
                                        }
                                    },
                                    '属性','&nbsp;',{ref: '../aattribute_name'},'&nbsp;',
                                    {
                                        xtype : 'button',text : '查询',scope: this,
                                        handler : function() {
                                            this.doSelectAttribute();
                                        }
                                    },
                                    {
                                        xtype : 'button',text : '重置',scope: this,
                                        handler : function() {
                                            this.topToolbar.aattribute_name.setValue("");
                                            this.filter={};
                                            this.doSelectAttribute();
                                        }
                                    }
                                ]
                            })
                        ]
                    },
                    bbar: new Ext.PagingToolbar({
                        pageSize: Km.Product.Config.PageSize,
                        store: Km.Product.Store.selectPAttributeStore,
                        scope:this,autoShow:true
                    })
                }, config);
                Km.Product.Store.selectPAttributeStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceProduct.queryPageProductAttribute}
                });
                Km.Product.View.AttributeView.PAttributeGrid.superclass.constructor.call(this, config);
            },
            sm : new Ext.grid.CheckboxSelectionModel(),
            doSelectAttribute : function() {
                if(!this.parent_id)return;
                if (this.topToolbar){
                    var product_id=Km.Product.View.Running.selectAttributeWindow.product_id;
                    if (!this.filter.selectType)this.filter.selectType=0;
                    var aattribute_name = this.topToolbar.aattribute_name.getValue();
                    this.filter       ={'attribute_name':aattribute_name,'product_id':product_id,'selectType':this.filter.selectType};
                }
                var condition = {'start':0,'limit':Km.Product.Config.PageSize};
                this.filter.parent_id=this.parent_id;
                Ext.apply(condition,this.filter);
                ExtServiceProduct.queryPageProductAttribute(condition,function(provider, response) {
                    if (response.result&&response.result.data) {
                        var result           = new Array();
                        result['data']       =response.result.data;
                        result['totalCount'] =response.result.totalCount;
                        Km.Product.Store.selectPAttributeStore.loadData(result);
                    } else {
                        Km.Product.Store.selectPAttributeStore.removeAll();
                        Ext.Msg.alert('提示', '无符合条件的属性！');
                    }
                });
            }
        })
    },
    /**
     * 窗口：批量上传商品
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
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
                        /**
                         * 自定义类型:保存类型
                         * 0:上传商品,1:上传商品介绍
                         */
                        uploadtype:0,
                        handler : function() {
                            uploadWindow           =this;
                            validationExpression   =/\w+(.xlsx|.XLSX|.xls|.XLS)$/;
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
                                if(this.uploadtype==0){
                                    this.uploadForm.getForm().submit({
                                        url : 'index.php?go=admin.upload.uploadProduct',
                                        success : function(form, action) {
                                                Ext.Msg.alert('成功', '上传成功');
                                                uploadWindow.hide();
                                                uploadWindow.uploadForm.upload_file.setValue('');
                                                Km.Product.View.Running.productGrid.doSelectProduct();
                                            },
                                        failure : function(form, action) {
                                            //Ext.Msg.alert('错误', action.result.msg);
                                            Ext.Msg.alert('错误', action.response.responseText);
                                        }
                                    });
                                }else if(this.uploadtype==1){
                                    this.uploadForm.getForm().submit({
                                        url : 'index.php?go=admin.upload.uploadProductIntro',
                                        success : function(form, action) {
                                            Ext.Msg.alert('成功', '上传成功');
                                            uploadWindow.hide();
                                            uploadWindow.uploadForm.upload_file.setValue('');
                                            Km.Product.View.Running.productGrid.doSelectProduct();
                                        },
                                        failure : function(form, action) {
                                            //Ext.Msg.alert('错误', action.result.msg);
                                            Ext.Msg.alert('错误', action.response.responseText);
                                        }
                                    });
                                }
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
                        text : '导出模板',
                        scope:this,
                        handler : function() {
                        /**
                         * 导出模板
                         * param: '0' =  商品导入模板；
                         *        '1' =  商品介绍和规格导入模板;
                         */
                            if(this.uploadtype==0){
                                ExtServiceProduct.exportEx ('product.xls',function(provider, response) {
                                     window.open(response.result.data);
                                });
                                this.hide();
                            };
                            if(this.uploadtype==1){
                                ExtServiceProduct.exportEx ('productintro.xls',function(provider, response) {
                                     window.open(response.result.data);
                                });
                                this.hide();
                            }

                        }
                    }]
                }, config);
            Km.Product.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 窗口：批量上传商品图片
     */
    BatchUploadImagesWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title:"批量上传商品图片",width : 400,height : 180,minWidth : 300,minHeight : 100,closeAction : "hide",
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
                            emptyText: '请批量上传商品图片文件(zip)',buttonText: '',
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
                            uploadImagesWindow           =this;
                            validationExpression   =/([\u4E00-\u9FA5]|\w)+(.zip|.ZIP)$/;
                            var isValidExcelFormat = new RegExp(validationExpression);
                            var result             = isValidExcelFormat.test(this.uploadForm.upload_file.getValue());
                            if (!result){
                                Ext.Msg.alert('提示', '请上传ZIP文件，后缀名为zip！');
                                return;
                            }
                            var uploadImageUrl='index.php?go=admin.upload.uploadProductImages';
                            if (this.uploadForm.upload_file.name=="upload_image_large_files"){
                                uploadImageUrl='index.php?go=admin.upload.uploadProductImage_larges';
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
                                        Km.Product.View.Running.productGrid.doSelectProduct();
                                    },
                                    failure : function(form, response) {
                                        //Ext.Msg.alert('错误', response.result.data);
                                        var responseText = JSON.parse(response.response.responseText);
                                        responseText = responseText.data;
                                        responseText = responseText.replace(/    /gi,"<br/>");
                                        Ext.Msg.alert('错误', responseText);
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
            Km.Product.View.BatchUploadImagesWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：商品列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Product.Store.productStore,
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
                        {header : '商品标识',dataIndex : 'product_id',hidden:true},
                        {header : '商品名称',dataIndex : 'product_name'},
                        {header : '商品分类',dataIndex : 'ptypeShowAll'},
                        {header : '商品货号',dataIndex : 'product_code'},
                        {header : '市场价',dataIndex : 'market_price'},
                        {header : '销售价',dataIndex : 'price'},
                        {header : '券',dataIndex : 'jifen'},
                        {header : '价格标签',dataIndex : 'price_tag'},
                        {header : '数量',dataIndex : 'num'},
                        {header : '销售量',dataIndex : 'sales_count'},
                        {header : '热度',dataIndex : 'click_count'},
                        {header : '排序',dataIndex : 'sort_order'}
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
                               xtype : 'textfield',
                               listeners : {
                                   specialkey : function(field, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectProduct();
                                    }
                                }
                            },
                            items : [
                                '商品名称:　',{ref: '../pname'},"&nbsp;&nbsp;",
                                '商品货号:　',{ref: '../pproduct_code'},"&nbsp;&nbsp;",
                                '上架日期:　', {xtype : 'datefield',ref: '../puptime',format : "Y-m-d"},"&nbsp;&nbsp;",
                                '下架日期:　', {xtype : 'datefield',ref: '../pdowntime',format : "Y-m-d"},"&nbsp;&nbsp;",
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectProduct();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.pname.setValue("");
                                        this.topToolbar.pproduct_code.setValue("");
                                        this.topToolbar.puptime.setValue("");
                                        this.topToolbar.pdowntime.setValue("");
                                        this.filter={};
                                        this.doSelectProduct();
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
                                    text : '新增上架商品',iconCls : 'icon-add',ref: '../../btnSave',
                                    handler : function() {
                                        this.addProduct();
                                    }
                                },'-',{
                                    text : '修改商品信息',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateProduct();
                                    }
                                },'-',{
                                    text : '商品下架',ref: '../../btnDown',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.downProduct();
                                    }
                                },'-',{
                                    text : '删除商品', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteProduct();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importProduct();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入商品',iconCls : 'icon-import',scope:this,handler:function(){this.importProduct()}},
                                            {text:'批量导入商品介绍和规格',iconCls : 'icon-import',scope:this,handler:function(){this.importProductIntro()}},
                                            {text:'批量导入商品图片',iconCls : 'icon-import',scope:this,handler:function(){this.batchUploadImages("upload_image_files","商品图片")}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',ref: '../../btnExport',
                                    handler : function() {
                                        this.exportProduct();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看商品', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showProduct()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideProduct();Km.Product.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Product.Cookie.set('View.IsFix',Km.Product.Config.View.IsFix);}}
                                        ]}
                                },'-',{
                                    text : '预览',iconCls : 'icon-view', ref:'../../preview',disabled : true,
                                    handler : function() {
                                        window.open("index.php?go=kmall.product.view&product_id="+this.getSelectionModel().getSelected().data.product_id, "_blank");
                                    }
                                },'-',{
                                    text : '选择属性',ref:'../../tattribute',iconCls : 'icon-edit',
                                    enableToggle: true,disabled : true,
                                    handler : function() {
                                        if(Km.Product.View.Running.selectAttributeWindow==null || Km.Product.View.Running.selectAttributeWindow.hidden){
                                            this.showAttribute();
                                        }else{
                                            this.hideAttribute();
                                        }
                                    }
                                },'-',{
                                    text : '赠品',ref:'../../gift',iconCls : 'icon-edit',
                                    enableToggle: true,disabled : true,
                                    handler : function() {
                                        if(Km.Product.View.Running.selectProductWindow==null || Km.Product.View.Running.selectProductWindow.hidden){
                                            this.showselProduct();
                                        }else{
                                            this.hideselProduct();
                                        }
                                    }
                                },'-',
                            ]}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Product.Config.PageSize,
                    store: Km.Product.Store.productStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Product.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Product.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Product.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectProduct();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Product.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Product.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectProduct();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示商品列表
            this.doSelectProduct();
            Km.Product.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的商品信息Tab页
            Km.Product.View.Running.viewTabs=new Km.Product.View.ProductView.Tabs();
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
                    this.grid.preview.setDisabled(sm.getCount() != 1);
                    this.grid.gift.setDisabled(sm.getCount() != 1);
                    this.grid.tattribute.setDisabled(sm.getCount() != 1);
                    this.grid.btnDown.setDisabled(sm.getCount() < 1);
                },
                rowselect: function(sm, rowIndex, record) {
                    this.grid.updateViewProduct();
                    if (sm.getCount() != 1){
                        this.grid.hideProduct();
                        Km.Product.Config.View.IsShow=0;
                        this.grid.hideAttribute();
                        this.grid.hideselProduct();
                    }else{
                        if (Km.Product.View.IsSelectView==1){
                            Km.Product.View.IsSelectView=0;
                            this.grid.showProduct();
                        }
                        if(Km.Product.View.Running.selectAttributeWindow && !Km.Product.View.Running.selectAttributeWindow.hidden){
                            this.grid.showAttribute();
                        }
                        if(Km.Product.View.Running.selectProductWindow && !Km.Product.View.Running.selectProductWindow.hidden){
                            this.grid.showselProduct();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Product.Config.View.IsShow==1){
                            Km.Product.View.IsSelectView=1;
                        }
                        this.grid.hideProduct();
                        Km.Product.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Product.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showProduct();
                this.tvpView.toggle(true);
            }else{
                this.hideProduct();
                Km.Product.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Product.Config.View.IsFix=1;
            }else{
               Km.Product.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Product.Config.View.IsShow=0;
                return ;
            }
            if (Km.Product.Config.View.IsShow==1){
               this.hideProduct();
               Km.Product.Config.View.IsShow=0;
            }
            this.showProduct();
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
         * 查询符合条件的商品
         */
        doSelectProduct : function() {
            if (this.topToolbar){
                var pname         = this.topToolbar.pname.getValue();
                var pproduct_code = this.topToolbar.pproduct_code.getValue();
                var puptime       = this.topToolbar.puptime.getValue();
                var pdowntime     = this.topToolbar.pdowntime.getValue();
                this.filter       ={'product_name':pname,'product_code':pproduct_code,'uptime': puptime,'downtime':pdowntime};
            }
            var condition = {'start':0,'limit':Km.Product.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceProduct.queryPageProduct(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Product.Store.productStore.loadData(result);
                } else {
                    Km.Product.Store.selProductStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的商品！');
                }
            });
        },
        /**
         * 显示产品视图
         * 显示产品的视图相对商品列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Product.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Product.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Product.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Product.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Product.View.Running.viewTabs);
                    break;
            }
            Km.Product.Cookie.set('View.Direction',Km.Product.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Product.Config.View.IsFix==0)&&(Km.Product.Config.View.IsShow==1)){
                    this.showProduct();
                }
                Km.Product.Config.View.IsFix=1;
                Km.Product.View.Running.productGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Product.Config.View.IsShow=0;
                this.showProduct();
            }
        },
        /**
         * 显示商品
         */
        showProduct : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择商品！');
                Km.Product.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Product.Config.View.IsFix==0){
                if (Km.Product.View.Running.view_window==null){
                    Km.Product.View.Running.view_window=new Km.Product.View.ProductView.Window();
                }
                if (Km.Product.View.Running.view_window.hidden){
                    Km.Product.View.Running.view_window.show();
                    Km.Product.View.Running.view_window.winTabs.hideTabStripItem(Km.Product.View.Running.view_window.winTabs.tabFix);
                    this.updateViewProduct();
                    this.tvpView.toggle(true);
                    Km.Product.Config.View.IsShow=1;
                }else{
                    this.hideProduct();
                    Km.Product.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Product.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Product.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Product.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Product.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Product.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Product.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Product.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Product.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Product.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideProduct();
            if (Km.Product.Config.View.IsShow==0){
                Km.Product.View.Running.viewTabs.enableCollapse();
                switch(Km.Product.Config.View.Direction){
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
                this.updateViewProduct();
                if(!Km.Product.View.Running.seriesimgGrid){
                    Km.Product.View.Running.seriesimgGrid = new Km.Product.View.PseriesimgView.Grid({title:'商品系列图',iconCls:'tabs'});
                }

                this.tvpView.toggle(true);
                Km.Product.Config.View.IsShow=1;
            }else{
                Km.Product.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏商品
         */
        hideProduct : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Product.View.Running.view_window!=null){
                Km.Product.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前商品显示信息
         */
        updateViewProduct : function() {
            Km.Product.View.Running.seriesimgGrid.doSelectSeriesimg();
            if (Km.Product.View.Running.view_window!=null){
                Km.Product.View.Running.view_window.winTabs.tabProductDetail.update(this.getSelectionModel().getSelected().data);
            }
            var nowdata=this.getSelectionModel().getSelected().data
            Km.Product.View.Running.viewTabs.tabProductDetail.update(nowdata);
        },
        /**
         * 新建商品
         */
        addProduct : function() {
            var targeturl="index.php?go=admin.product.addproduct";
            if (parent.Km.Navigation){
                parent.Km.Navigation.addTabByUrl(parent.Ext.getCmp('centerPanel'),'新建商品',targeturl,"addproduct");
            }else{
                window.open(targeturl);
            }
        },
        /**
         * 编辑供应商时先获得选中的商品信息
         */
        updateProduct : function() {
            //选中商品ID
            var product_id=this.getSelectionModel().getSelected().data.product_id;
            var isMultiplespec=this.getSelectionModel().getSelected().data.isMultiplespec;
            var targeturl="index.php?go=admin.product.addproduct&product_id="+product_id+"&isMultiplespec="+isMultiplespec;
            if (parent.Km.Navigation){
                parent.Km.Navigation.addTabByUrl(parent.Ext.getCmp('centerPanel'),'修改商品',targeturl,"updateproduct");
            }else{
                window.open(targeturl);
            }
/*          if (Km.Product.View.Running.edit_window==null){
                Km.Product.View.Running.edit_window=new Km.Product.View.EditWindow();
            }
            Km.Product.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Product.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Product.View.Running.edit_window.setTitle('修改商品信息');
            Km.Product.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Product.View.Running.edit_window.ptype_oid.setValue(Km.Product.View.Running.edit_window.ptype_id.getValue());
            Km.Product.View.Running.edit_window.savetype=1;
            Km.Product.View.Running.edit_window.image_largeUpload.setValue( Km.Product.View.Running.edit_window.image_large.getValue());
            switch (Km.Product.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Product.View.EditWindow.KindEditor_specification) Km.Product.View.EditWindow.KindEditor_specification.html(this.getSelectionModel().getSelected().data.specification);
                    if (Km.Product.View.EditWindow.KindEditor_intro) Km.Product.View.EditWindow.KindEditor_intro.html(this.getSelectionModel().getSelected().data.intro);
                    break
                case 3:
                    if (xhEditor_specification)xhEditor_specification.setSource(this.getSelectionModel().getSelected().data.specification);
                    if (xhEditor_intro)xhEditor_intro.setSource(this.getSelectionModel().getSelected().data.intro);
                    break
                default:
                    if (CKEDITOR.instances.specification) CKEDITOR.instances.specification.setData(this.getSelectionModel().getSelected().data.specification);
                    if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(this.getSelectionModel().getSelected().data.intro);
            }
            if (this.getSelectionModel().getSelected().data.ptypeShowAll){
                Km.Product.View.Running.edit_window.ptypebrand.ptypeShowLabel.setVisible(true);
                Km.Product.View.Running.edit_window.ptypebrand.ptypeShowValue.setVisible(true);
            }else{
                Km.Product.View.Running.edit_window.ptypebrand.ptypeShowLabel.setVisible(false);
                Km.Product.View.Running.edit_window.ptypebrand.ptypeShowValue.setVisible(false);
            }
            Km.Product.View.Running.edit_window.show();
            Km.Product.View.Running.edit_window.maximize();*/
        },
        /**
         * 删除商品
         */
        deleteProduct : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的商品吗?', this.confirmDeleteProduct,this);
        },
        /**
         * 确认删除商品
         */
        confirmDeleteProduct : function(btn) {
            if (btn == 'yes') {
                var del_product_ids =new Array();
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_product_ids.push(selectedRows[flag].data.product_id);
                }
                ExtServiceProduct.deleteByIds(del_product_ids.join(','));
                this.doSelectProduct();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
        * 商品下架
        */
        downProduct:function(){
            Ext.Msg.confirm('提示', '确实要下架所选的商品吗?',function(btn){
                if(btn=="yes"){
                    var product_ids ="";
                    var selectedRows=Km.Product.View.Running.productGrid.getSelectionModel().getSelections();
                    for (var flag = 0; flag < selectedRows.length; flag++) {
                        product_ids=product_ids+selectedRows[flag].data.product_id+",";
                    }
                    ExtServiceProduct.productDown(product_ids,function(){
                        Ext.Msg.alert("提示", "下架成功！");
                        Km.Product.View.Running.productGrid.doSelectProduct();
                    });
                }
            });
        },
        /**
         * 显示属性表
         */
        showAttribute:function(){
            if (Km.Product.View.Running.selectAttributeWindow==null){
                Km.Product.View.Running.selectAttributeWindow=new Km.Product.View.AttributeView.SelectAttributeWindow();
            }
            var product_id=Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data.product_id;
            Km.Product.View.Running.selectAttributeWindow.product_id=product_id;
            Km.Product.View.Running.selectAttributeWindow.attributeGrid.topToolbar.menus.all.setChecked(true);
            Km.Product.View.Running.selectAttributeWindow.attributeGrid.doSelectAttribute();
            Km.Product.View.Running.selectAttributeWindow.show();
            Km.Product.View.Running.productGrid.tattribute.toggle(true);
        },
        /**
         * 隐藏属性表
         */
        hideAttribute:function(){
            if (Km.Product.View.Running.selectAttributeWindow!=null){
                Km.Product.View.Running.selectAttributeWindow.hide();
            }
            Km.Product.View.Running.productGrid.tattribute.toggle(false);
        },
        /**
         * 显示选择商品
         */
        showselProduct:function(){
          if (Km.Product.View.Running.selectProductWindow==null){
            Km.Product.View.Running.selectProductWindow=new Km.Product.View.SelectProductView.SelectProductWindow();
          }
          var product_id=Km.Product.View.Running.productGrid.getSelectionModel().getSelected().data.product_id;
          Km.Product.View.Running.selectProductWindow.selectProductGrid.product_id=product_id;
          if (Km.Product.View.Running.selectProductWindow.hidden){
            Km.Product.View.Running.selectProductWindow.selectProductGrid.topToolbar.goods_name.setValue("");
            Km.Product.View.Running.selectProductWindow.selectProductGrid.filter={};
            Km.Product.View.Running.selectProductWindow.selectProductGrid.topToolbar.menus.all.setChecked(true);
            Km.Product.View.Running.selectProductWindow.selectProductGrid.isSelect.toggle(false);
          }
          Km.Product.View.Running.selectProductWindow.selectProductGrid.doSelectProduct();
          Km.Product.View.Running.selectProductWindow.show();
        },
        /**
         * 隐藏选择商品
         */
        hideselProduct:function(){
            var aa=0;
          if (Km.Product.View.Running.selectProductWindow!=null){
            Km.Product.View.Running.selectProductWindow.hide();
            Km.Product.View.Running.selectProductWindow.selectProductGrid.product_id="";
          }
        },
        /**
         * 导入商品
         */
        importProduct : function() {
            if (Km.Product.View.Running.current_uploadWindow==null){
                Km.Product.View.Running.current_uploadWindow=new Km.Product.View.UploadWindow();
            }
            Km.Product.View.Running.current_uploadWindow.uploadtype=0;
            Km.Product.View.Running.current_uploadWindow.setTitle('批量商品上传');
            Km.Product.View.Running.current_uploadWindow.show();
        },
        /**
         * 导入商品介绍
         */
        importProductIntro : function(){
            if (Km.Product.View.Running.current_uploadWindow==null){
                Km.Product.View.Running.current_uploadWindow=new Km.Product.View.UploadWindow();
            }
            Km.Product.View.Running.current_uploadWindow.uploadtype=1;
            Km.Product.View.Running.current_uploadWindow.setTitle('批量导入商品介绍');
            Km.Product.View.Running.current_uploadWindow.show();
        },
        /**
         * 批量上传商品图片
         */
        batchUploadImages:function(inputname,title){
            if (Km.Product.View.Running.batchUploadImagesWindow==null){
                Km.Product.View.Running.batchUploadImagesWindow=new Km.Product.View.BatchUploadImagesWindow();
            }
            Km.Product.View.Running.batchUploadImagesWindow.setTitle(title);
            Km.Product.View.Running.batchUploadImagesWindow.uploadForm.upload_file.name=inputname;
            Km.Product.View.Running.batchUploadImagesWindow.show();
        },
        /**
         * 导出商品
         */
        exportProduct : function() {
            ExtServiceProduct.exportProduct(this.filter,function(provider, response) {
                 window.open(response.result.data);
            });
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Product.View.Running.productGrid=new Km.Product.View.Grid();
            if (Km.Product.Config.View.IsFix==0){
                Km.Product.View.Running.productGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Product.View.Running.productGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Product.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Product.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前创建的编辑窗口
         */
        edit_window_seriesimg:null,
        /**
         * 当前商品归属业务分类关系Grid对象
         */
        pbtypeGrid:null,
        /**
         * 推荐属性表
         */
        selectAttributeWindow:null,
        /**
         * 赠品表
         */
        selectProductWindow:null,
        /**
         * 当前商品图片Grid对象
         */
        seriesimgGrid:null,
        /**
         * 当前商品Grid对象
         */
        productGrid:null,
        /**
         * 显示商品信息及关联信息列表的Tab页
         */
        viewTabs:null,
        /**
         * 当前创建的编辑窗口
         */
        edit_window:null,
        /**
         * 当前的显示窗口
         */
        view_window:null,
        /**
        * 显示上传窗口
        */
        current_uploadWindow:null
    }
};

/**
 * Controller:主程序
 */
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.state.Manager.setProvider(Km.Product.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Product.Init();
    /**
     * 商品数据模型获取数据Direct调用
     */
    Km.Product.Store.productStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceProduct.queryPageProduct}
    });

    /**
     * 商品数据模型获取数据Direct调用
     */
    Km.Product.Store.inputStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceProduct.selectProduct}
    });

    /**
     * 商品页面布局
     */
        Km.Product.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Product.View.Panel()]
    });
    Km.Product.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
