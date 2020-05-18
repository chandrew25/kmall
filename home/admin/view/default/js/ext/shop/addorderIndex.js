Ext.namespace("Kmall.Admin.Order");
Km = Kmall.Admin;
Km.Order={
    /**
     * 全局配置
     */
    Config:{
        /**
         *分页:每页显示记录数
         */
        PageSize:10,
        /**
         * 在线编辑器类型。
         * 1:CkEditor,2:KindEditor,3:xhEditor
         * 配合Action的变量配置$online_editor
         */
        OnlineEditor:1
    },
    /**
     * 初始化
     */
    Init:function(){
        if (Ext.util.Cookies.get('operator')!=null){
            Km.Order.Config.Operator=Ext.util.Cookies.get('operator');
        }
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.Order.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }
    }
};

/**
 * Model:数据模型
 */
Km.Order.Store = {
    /**
     * 易乐的会员
     */
    memberStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/member.php'
          }),
        reader: new Ext.data.JsonReader({
            root: 'members',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'member_id'
          }, [
              {name: 'member_id', mapping: 'member_id'},
              {name: 'username', mapping: 'username'},
              {name: 'realname', mapping: 'realname'},
              {name: 'member_no', mapping: 'member_no'},
              {name: 'com_tel', mapping: 'com_tel'},
              {name: 'com_fax', mapping: 'com_fax'},
              {name: 'com_name', mapping: 'com_name'}
        ])
    }),
    /**
     * 商品信息
     */
    productStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/product.php'
          }),
        reader: new Ext.data.JsonReader({
            root: 'products',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'product_id'
          }, [
              {name: 'product_id', mapping: 'product_id'},
              {name: 'product_code', mapping: 'product_code'},
              {name: 'price', mapping: 'price'},
              {name: 'scale', mapping: 'scale'},
              {name: 'market_price', mapping: 'market_price'},
              {name: 'cost', mapping: 'cost'},
              {name: 'jifen', mapping: 'jifen'},
              {name: 'product_name', mapping: 'product_name'}
        ])
    }),
    /**
     * 商品信息
     */
    productbycodeStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/productbycode.php'
          }),
        reader: new Ext.data.JsonReader({
            root: 'products',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'product_id'
          }, [
              {name: 'product_id', mapping: 'product_id'},
              {name: 'product_code', mapping: 'product_code'},
              {name: 'price', mapping: 'price'},
              {name: 'scale', mapping: 'scale'},
              {name: 'market_price', mapping: 'market_price'},
              {name: 'cost', mapping: 'cost'},
              {name: 'jifen', mapping: 'jifen'},
              {name: 'product_name', mapping: 'product_name'}
        ])
    }),
    /**
     * 支付方式
     */
    paymenttypeStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/paymenttype.php'
          }),
        reader: new Ext.data.JsonReader({
            root: 'paymenttypes',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'paymenttype_id'
          }, [
              {name: 'paymenttype_id', mapping: 'paymenttype_id'},
              {name: 'name', mapping: 'name'}
        ])
    }),
    /**
     * 会员收货人地址信息
     */
    addressStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                  {name: 'address_id',type: 'string'},
                  {name: 'member_id',type: 'string'},
                  {name: 'consignee',type: 'string'},
                  {name: 'email',type: 'string'},
                  {name: 'country',type: 'string'},
                  {name: 'province',type: 'string'},
                  {name: 'city',type: 'string'},
                  {name: 'district',type: 'string'},
                  {name: 'address',type: 'string'},
                  {name: 'zipcode',type: 'string'},
                  {name: 'tel',type: 'string'},
                  {name: 'mobile',type: 'string'},
                  {name: 'sign_building',type: 'string'},
                  {name: 'best_time',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        })
    }),
    /**
     * 订单
     */
    orderStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                  {name: 'order_id',type: 'int'},
                  {name: 'order_no',type: 'string'},
                  {name: 'member_id',type: 'string'},
                  {name: 'username',type: 'string'},
                  {name: 'status',type: 'string'},
                  {name: 'pay_status',type: 'string'},
                  {name: 'ship_status',type: 'string'},
                  {name: 'total_amount',type: 'float'},
                  {name: 'final_amount',type: 'float'},
                  {name: 'cost_item',type: 'float'},
                  {name: 'cost_other',type: 'float'},
                  {name: 'pmt_amount',type: 'float'},
                  {name: 'pay_type',type: 'string'},
                  {name: 'name_pay_type',type: 'string'},
                  {name: 'country',type: 'int'},
                  {name: 'region_name_country',type: 'string'},
                  {name: 'province',type: 'int'},
                  {name: 'region_name_province',type: 'string'},
                  {name: 'city',type: 'int'},
                  {name: 'region_name_city',type: 'string'},
                  {name: 'district',type: 'int'},
                  {name: 'region_name_district',type: 'string'},
                  {name: 'ship_addr',type: 'string'},
                  {name: 'ship_name',type: 'string'},
                  {name: 'ship_mobile',type: 'string'},
                  {name: 'ship_time',type: 'date',dateFormat:'Y-m-d H:i:s'},
                  {name: 'ship_type',type: 'string'},
                  {name: 'name_ship_type',type: 'string'},
                  {name: 'ship_sign_building',type: 'string'},
                  {name: 'url',type: 'string'},
                  {name: 'intro',type: 'string'},
                  {name: 'ordertime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                  {name: 'isCusConfirm',type: 'string'},
                  {name: 'isAcountantClosing',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {}
        }
    }),

    /**
     * 配送方式
     */
    deliverytypeStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/deliverytype.php'
          }),
        reader: new Ext.data.JsonReader({
            root: 'deliverytypes',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'deliverytype_id'
          }, [
              {name: 'deliverytype_id', mapping: 'deliverytype_id'},
              {name: 'name', mapping: 'name'}
        ])
    }),
    /**
     * 采购人员
     */
    purchaserStore : new Ext.data.Store({
        baseParams: {roletypeSel: '6'},
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/admin.php'
        }),
        reader:new Ext.data.JsonReader({
              root:'admins',
              autoLoad:true,
              totalProperty : 'totalCount',
              id: 'admin_id'
        },[
              {name: 'admin_id', mapping: 'admin_id'},
              {name: 'username', mapping: 'username'},
              {name: 'realname', mapping: 'realname'}
        ])
    })
};

/**
 * View:订单显示组件
 */
Km.Order.View={
    /**
     * 选择商品列表
     */
    ProductGrid:Ext.extend(Ext.grid.EditorGridPanel, {
        constructor : function(config) {
            var productStore=new Ext.data.ArrayStore({
                    autoDestroy: true,
                    idIndex: 0,
                    fields : [
                          {name: 'member_id',type: 'string'},
                          {name: 'order_id',type: 'int'},
                          {name: 'product_id',type: 'string'},
                          {name: 'product_code',type: 'string'},
                          {name: 'product_name',type: 'string'},
                          {name: 'url',type: 'string'},
                          {name: 'amount',type: 'float'},
                          {name: 'price',type: 'float'},
                          {name: 'real_price',type: 'float'},
                          {name: 'jifen',type: 'int'},
                          {name: 'nums',type: 'int'}
                    ]
                });
            /**
             * 编辑器
             */
            var productEditor=new Ext.ux.grid.RowEditor({
                saveText : '修改',
                // 保证选择左侧的选择框时，不影响启动显示RowEdior
                onRowClick : function(g, rowIndex, e) {
                    if (!e.getTarget('.x-grid3-row-checker'))this.constructor.prototype.onRowClick.apply(this, arguments);
                },
                listeners:{
                    afteredit:function(roweditor, changes, record, rowIndex){
                        var orderProductStore=this.ownerCt.store;
                        var sum_price=0,sum_jifen=0;
                        record.data.product_id=this.grid.product_id;
                        for (var i = 0; i < orderProductStore.getCount(); i++) {
                           orderProductStore.getAt(i).data.amount=orderProductStore.getAt(i).get('real_price')*orderProductStore.getAt(i).get('nums');
                           sum_price=sum_price+orderProductStore.getAt(i).data.amount;
                           sum_jifen=sum_jifen+orderProductStore.getAt(i).get('jifen')*orderProductStore.getAt(i).get('nums');
                        }
                        this.ownerCt.toolbarSumPrice.sum_price.setValue(sum_price);
                        this.ownerCt.toolbarSumJifen.sum_jifen.setValue(sum_jifen);
                    }
                }
            });
            this.editor=productEditor;
            /**
             * 行选择器
             */
            var productSm = new Ext.grid.CheckboxSelectionModel({
                handleMouseDown : Ext.emptyFn,
                listeners : {
                    'rowselect' : function(sm, rowIndex, record) {},
                    'rowdeselect' : function(sm, rowIndex, record) {},
                    'selectionchange' : function(sm) {
                        // 判断删除按钮是否可以激活
                        this.grid.topToolbar.productRemoveBtn.setDisabled(sm.getCount() < 1);
                    }
                }
            });
            Ext.applyIf(productSm, {
                getEditor : function() {return false;}
            });
            var toolbarSumPrice=new Ext.Toolbar({
                ref:'toolbarSumPrice',defaults:{xtype : 'displayfield'},
                items : [
                    "合计总价: ¥",{ref: 'sum_price',value:'0'},new Ext.Toolbar.Fill()]
            });
            this.toolbarSumPrice=toolbarSumPrice;
            var toolbarSumJifen=new Ext.Toolbar({
                ref:'toolbarSumJifen',defaults:{xtype : 'displayfield'},
                items : [
                    "总券:",{ref: 'sum_jifen',value:'0'},new Ext.Toolbar.Fill()]
            });
            this.toolbarSumJifen=toolbarSumJifen;
            config = Ext.apply({
                ref:'productsGrid',collapsible:true,title:'订购商品清单',height:300,width:'99.8%',
                store : productStore,defaults:{align:'center'},constrainHeader:true,
                plugins : [this.editor],
                sm : productSm,
                cm : new Ext.grid.ColumnModel({
                    columns: [
                    productSm,
                    {
                        header   :'商品编号',
                        dataIndex:'product_code',width:280,
                        editor: new Ext.form.ComboBox({
                             fieldLabel : '商品编号',name : 'product_code',ref:'product_code',
                             store:Km.Order.Store.productbycodeStore,emptyText: '请选择商品',itemSelector: 'div.search-item',
                             loadingText: '查询中...',displayField:'product_name',width:570, pageSize:Km.Order.Config.PageSize,
                             mode: 'remote', editable:true,minChars: 1,autoSelect :true,typeAhead: true,grid:this,
                             forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                             tpl:[
                                '<tpl for="."><div class="search-item">',
                                    '<h3>{product_code}</h3>',
                                '</div></tpl>'
                             ],
                             onSelect:function(record,index){
                                 if(this.fireEvent('beforeselect', this, record, index) !== false){
                                    this.setValue(record.data.product_code);
                                    this.ownerCt.product_name.setValue(record.data.product_name);
                                    this.ownerCt.price.setValue(record.data.price);
                                    this.ownerCt.real_price.setValue(record.data.price);
                                    this.ownerCt.cost.setValue(record.data.cost);
                                    this.grid.product_id=record.data.product_id;
                                    if (record.data.scale){
                                        this.ownerCt.scale.setValue(record.data.scale);
                                    }
                                    this.ownerCt.jifen.setValue(record.data.jifen);
                                    this.collapse();
                                 }
                              }
                        })
                    },{
                        header   :'品名/型号',
                        dataIndex:'product_name',width:300,editor: new Ext.form.ComboBox({
                             fieldLabel : '品名/型号',name : 'product_name',ref:'product_name',
                             store:Km.Order.Store.productStore,emptyText: '请选择商品',itemSelector: 'div.search-item',
                             loadingText: '查询中...',width: 570, pageSize:Km.Order.Config.PageSize,grid:this,
                             displayField:'product_name',
                             mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                             forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                             tpl:new Ext.XTemplate(
                                        '<tpl for="."><div class="search-item">',
                                            '<h3>{product_name}</h3>',
                                        '</div></tpl>'
                             ),
                             onSelect:function(record,index){
                                 if(this.fireEvent('beforeselect', this, record, index) !== false){
                                    this.ownerCt.product_code.setValue(record.data.product_code);
                                    this.ownerCt.product_name.setValue(record.data.product_name);
                                    this.ownerCt.price.setValue(record.data.price);
                                    this.ownerCt.real_price.setValue(record.data.price);
                                    this.ownerCt.cost.setValue(record.data.cost);
                                    this.grid.product_id=record.data.product_id;
                                    if (record.data.scale){
                                        this.ownerCt.scale.setValue(record.data.scale);
                                    }
                                    this.ownerCt.jifen.setValue(record.data.jifen);
                                    this.collapse();
                                 }
                              }
                        })
                    },{
                        header   :'规格',
                        dataIndex:'scale',width:180,editor:new Ext.form.TextField({ref:'scale'})
                    },{
                        header   :'供货单价',
                        dataIndex:'cost',editor:new Ext.form.TextField({ref:'cost',readOnly:true})
                    },{
                        header   :'销售单价',
                        dataIndex:'price',editor:new Ext.form.TextField({ref:'price',readOnly:true})
                    },{
                        header   :'购买数量',
                        dataIndex:'nums',editor:new Ext.form.NumberField({ref:'nums'})
                    },{
                        header   :'价格',
                        dataIndex:'real_price',editor:new Ext.form.NumberField({ref:'real_price'})
                    },{
                        header   :'券', 
                        dataIndex:'jifen',editor:new Ext.form.NumberField({ref:'jifen'})
                    }]
                }),
                tbar:new Ext.Toolbar({
                    ref:'/btnToolbar',defaults:{scope: this},
                    items : [
                        {
                            text: '添加商品',iconCls : 'icon-add',
                            handler: this.onAdd
                        },'-',{
                            text : '删除商品',iconCls : 'icon-delete',ref : 'productRemoveBtn',disabled : true,
                            handler : this.onDelete
                        },new Ext.Toolbar.Fill()]
                }),
                bbar:{},
                listeners : {
                    render:function(){
                        this.toolbarSumPrice.render(this.bbar);
                        this.toolbarSumJifen.render(this.bbar);
                    }
                }
            },config);
            Km.Order.View.ProductGrid.superclass.constructor.call(this, config);
        },
        /**
         * 新增
         */
        onAdd : function(btn, ev) {
            var u = new this.store.recordType({
                product_code : '',
                product_name : '',
                real_price  : '0.0',
                jifen  : '0',
                nums  : '1'
            });
            this.editor.stopEditing();
            this.store.insert(0, u);
            this.getView().refresh();
            this.editor.startEditing(0, 0);
        },
        /**
         * 删除
         */
        onDelete : function() {
            Ext.MessageBox.confirm('提示', '确实要删除所选的记录吗?', this.showResult,this);
        },
        /**
         * 批量删除
         */
        showResult : function showResult(btn) {
            // 确定要删除你选定项的信息
            if (btn == 'yes') {
                this.editor.stopEditing();
                var selectedRows = this.getSelectionModel().getSelections();
                for (var i = 0, r; r = selectedRows[i]; i++) {
                    if (!selectedRows[i]) {
                        continue;
                    }
                    this.store.remove(r);
                }
            }
        }
    }),

    /**
     * 会员填写表单
     */
    MemberForm:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            var memberForm=this;
            config = Ext.apply({
                  /**
                   * 当前运行的可视化对象
                   */
                  Running:{
                      /**
                       * 查询会员窗口
                       */
                      memberQueryWindow:null,
                      /**
                       * 收货地址窗口
                       */
                      addressQueryWindow:null
                  },
                  width:'99.8%',frame:true,collapsible: true,
                  layout:'table',layoutConfig: {columns: 3},title:'客户信息',
                  defaults:{width: '100%',layout:'form',border:1,frame:false,columnLines:true,labelAlign:'right',labelWidth:100,bodyStyle:'padding:0 15px 0 0;'},
                  items: [
                        {items:[{fieldLabel:'会员ID',width:300,xtype:'textfield',name:'member_id',ref:'../member_id'}]},
                        {items:[{fieldLabel:'会员号&nbsp;&nbsp;',width:300,xtype:'textfield',name:'member_no',ref:'../member_no'}]},
                        {items:[{fieldLabel:'联系电话',width:300,xtype:'textfield',name:'ship_mobile',ref:'../com_tel'}]},
                        {items:[{fieldLabel:'联系人',width:300,xtype:'textfield',name:'ship_name',ref:'../realname'}]},
                        {items:[{fieldLabel:'单位名称',width:300,xtype:'textfield',name:'com_name',ref:'../com_name'}]},
                        {items:[{fieldLabel:'传真&nbsp;&nbsp;&nbsp;&nbsp;',width:300,xtype:'textfield',name:'com_fax',ref:'../com_fax'}]},
                        {rowspan:2,items:[{fieldLabel:'收货人',allowBlank:false,width:300,xtype:'textfield',name:'consignee',ref:'../consignee'}]},
                        {rowspan:2,items:[
                         {fieldLabel:'送货时间',xtype : 'datefield',width:300,name:'delivery_date',ref: '../delivery_date',format : "Y-m-d"},{xtype : 'timefield',name:'delivery_time',ref: '../delivery_time',width:300,format:'G:i'}
                        ]},
                        {items:[{fieldLabel:'送货地址',allowBlank:false,width:300,xtype:'textfield',name:'ship_addr',ref:'../address'}]},
                        {items:[{fieldLabel:'最佳路径',width:300,xtype:'textfield',name:'ship_sign_building',ref:'../best_path'}]},
                        {colspan:3,items:[{fieldLabel:'是否首次订购',xtype:'checkbox',name:'isFirstOrder',ref:'../isFirstOrder'}]},
                        {
                            xtype: 'compositefield',colspan:3,
                            items: [
                                {text:'查找用户',width:160,height:32,xtype:'button',handler:function(){
                                    if (memberForm.Running.memberQueryWindow==null){
                                        memberForm.Running.memberQueryWindow=new Km.Order.View.MemberQueryWindow();
                                    }
                                    memberForm.Running.memberQueryWindow.memberForm=memberForm;
                                    memberForm.Running.memberQueryWindow.queryGrid.doSelectMember();
                                    memberForm.Running.memberQueryWindow.show();
                                }
                            },{text:'收货地址',width:160,height:32,xtype:'button',handler:function(){
                                    if (memberForm.Running.addressQueryWindow==null){
                                        memberForm.Running.addressQueryWindow=new Km.Order.View.AddressQueryWindow();
                                    }
                                    memberForm.Running.addressQueryWindow.memberForm=memberForm;
                                    memberForm.Running.addressQueryWindow.addressGrid.doSelectAddress();
                                    memberForm.Running.addressQueryWindow.show();
                                }
                            }]
                        },
                        {colspan:3,items:[{xtype: 'displayfield',value : ''}]},
                        {items:[{
                             fieldLabel : '付款方式',xtype: 'combo',hiddenName : 'pay_type',ref : '../pay_type',grid:this,
                             store:Km.Order.Store.paymenttypeStore,emptyText: '请选择付款方式',itemSelector:'div.search-item',
                             loadingText: '查询中...',width: 300,pageSize:Km.Order.Config.PageSize,valueField : 'paymenttype_id',
                             displayField:'name',// 显示文本
                             mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                             forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                             tpl:new Ext.XTemplate(
                                        '<tpl for="."><div class="search-item">',
                                            '<h3>{name}</h3>',
                                        '</div></tpl>'
                             )
                        }]},
                        {items:[{
                             fieldLabel : '配送方式',xtype: 'combo',hiddenName : 'ship_type',ref : '../ship_type',
                             store:Km.Order.Store.deliverytypeStore,emptyText: '请选择配送方式',itemSelector: 'div.search-item',
                             loadingText: '查询中...',width: 300, pageSize:Km.Order.Config.PageSize,
                             displayField:'name',valueField : 'deliverytype_id',
                             mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                             forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                             tpl:new Ext.XTemplate(
                                        '<tpl for="."><div class="search-item">',
                                            '<h3>{name}</h3>',
                                        '</div></tpl>'
                             )
                        }]},
                        {items:[{
                            fieldLabel : '发票类型',hiddenName : 'invoiceType',xtype : 'combo',mode : 'local',ref:'../invoiceType',
                            triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,width: 300,align:'center',
                            store : new Ext.data.SimpleStore({
                                    fields : ['value', 'text'],
                                    data : [['0', '普通发票'], ['1', '企业发票']]
                              }),emptyText: '请选择发票类型',
                            valueField : 'value',// 值
                            displayField : 'text'// 显示文本
                        }]}
                     ]
            }, config);
            Km.Order.View.MemberForm.superclass.constructor.call(this, config);
        }
    }),

    /**
     * 会员查询列表
     */
    MemberQueryGrid:Ext.extend(Ext.grid.GridPanel,{
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,store : Km.Order.Store.memberStore,sm : this.sm,
                frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                loadMask : true,stripeRows : true,headerAsText : false,
                defaults : {
                    autoScroll : true
                },
                cm : new Ext.grid.ColumnModel({
                    defaults:{width:120,sortable : true},
                    columns : [
                       this.sm,
                      {header : '姓名',dataIndex : 'username',width:200},
                      {header : '会员号',dataIndex : 'member_no',width:200},
                      {header : '单位',dataIndex : 'com_name',width:300}
                    ]
                }),
                tbar:new Ext.Toolbar({
                    defaults : {xtype : 'textfield',anchor:'98%',align:'center'},
                    items : [
                          '姓名',{name : 'pusername',ref : 'pusername'},
                          '会员号',{name : 'pmember_no',ref : 'pmember_no'},
                          {
                                xtype : 'button',text : '查询',scope: this,
                                handler : function() {
                                    this.doSelectMember();
                                }
                            },
                            {
                                xtype : 'button',text : '重置',scope: this,
                                handler : function() {
                                    this.topToolbar.pusername.setValue("");
                                    this.topToolbar.pmember_no.setValue("");
                                    this.filter={};
                                    this.doSelectMember();
                                }
                            }
                    ]
                }),
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Order.Config.PageSize,
                    store: Km.Order.Store.memberStore,
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
                                    this.ownerCt.ownerCt.doSelectMember();
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
                                        this.ownerCt.ownerCt.doSelectMember();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            Km.Order.View.MemberQueryGrid.superclass.constructor.call(this, config);
        },
        sm : new Ext.grid.CheckboxSelectionModel({
            singleSelect:true,
            listeners : {
                selectionchange:function(sm) {
                },
                rowselect: function(sm, rowIndex, record) {
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                    }
                }
            }
        }),
        /**
         * 查询符合条件的易乐的会员
         */
        doSelectMember : function() {
            if (this.topToolbar){
                var pusername = this.topToolbar.pusername.getValue();
                var pmember_no = this.topToolbar.pmember_no.getValue();
                this.filter       ={'username':pusername,'member_no':pmember_no};
            }
            var condition = {'start':0,'limit':Km.Order.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceMember.queryPageMember(condition,function(provider, response) {
                if (response.result.data) {
                    var result           = new Array();
                    result['members']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Order.Store.memberStore.loadData(result);
                } else {
                    Km.Order.Store.memberStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的易乐的会员！');
                }
            });
        }
    }),

    /**
     * 查询会员
     */
    MemberQueryWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                closeAction : "hide",
                constrainHeader:true,maximizable: true,collapsible: true,
                width : 700,height : 450,minWidth : 400,minHeight : 450,
                layout : 'fit',plain : true,buttonAlign : 'center',
                defaults : {
                    autoScroll : true
                },
                listeners:{
                    beforehide:function(){}
                },
                items : [
                    new Km.Order.View.MemberQueryGrid({ref:'queryGrid'})
                ],
                buttons : [ {
                    text: "确定",ref : "../saveBtn",scope:this,
                    handler : function() {
                        editWindow=this;
                        if (this.queryGrid.getSelectionModel().getSelected()){
                            var data=this.queryGrid.getSelectionModel().getSelected().data;
                            var memberForm=this.memberForm;
                            memberForm.member_no.setValue(data.member_no);
                            memberForm.member_id.setValue(data.member_id);
                            memberForm.com_name.setValue(data.com_name);
                            memberForm.realname.setValue(data.realname);
                            memberForm.com_tel.setValue(data.com_tel);
                            memberForm.com_fax.setValue(data.com_fax);
                        }
                        this.hide();
                    }
                }, {
                    text : "取 消",scope:this,
                    handler : function() {this.hide();}
                }]
            }, config);
            Km.Order.View.MemberQueryWindow.superclass.constructor.call(this, config);
        }
    }),

    /**
     * 收货地址查询列表
     */
    AddressQueryGrid:Ext.extend(Ext.grid.GridPanel,{
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,store : Km.Order.Store.addressStore,sm : this.sm,
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
                      {header : '收货人',dataIndex : 'consignee',width:150},
                      {header : '送货地址',dataIndex : 'address',width:250},
                      {header : '送货时间',dataIndex : 'best_time',width:100},
                      {header : '最佳路径',dataIndex : 'best_path',width:100}
                    ]
                }),
                tbar:new Ext.Toolbar({
                    defaults : {
                        xtype : 'textfield',anchor:'98%',align:'center'
                    },
                    items : [
                          '收货人',{name : 'pconsignee',ref : 'pconsignee'},
                          '送货地址',{name : 'paddress',ref : 'paddress'},
                          {
                                xtype : 'button',text : '查询',scope: this,
                                handler : function() {
                                    this.doSelectAddress();
                                }
                            },
                            {
                                xtype : 'button',text : '重置',scope: this,
                                handler : function() {
                                    this.topToolbar.pusername.setValue("");
                                    this.topToolbar.pmember_no.setValue("");
                                    this.filter={};
                                    this.doSelectAddress();
                                }
                            }
                    ]
                }),
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Order.Config.PageSize,
                    store: Km.Order.Store.addressStore,
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
                                    this.ownerCt.ownerCt.doSelectAddress();
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
                                        this.ownerCt.ownerCt.doSelectAddress();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            Km.Order.View.AddressQueryGrid.superclass.constructor.call(this, config);
        },
        sm : new Ext.grid.CheckboxSelectionModel({
            singleSelect:true,
            listeners : {
                selectionchange:function(sm) {
                },
                rowselect: function(sm, rowIndex, record) {
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                    }
                }
            }
        }),
        /**
         * 查询符合条件的易乐的会员
         */
        doSelectAddress : function() {
            if (this.topToolbar){
                var pconsignee = this.topToolbar.pconsignee.getValue();
                var paddress = this.topToolbar.paddress.getValue();
                var memberForm=this.ownerCt.memberForm;
                var member_id=memberForm.member_id.getValue();
                this.filter       ={'consignee':pconsignee,'address':paddress,'member_id':member_id};
            }
            var condition = {'start':0,'limit':Km.Order.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceAddress.queryPageAddress(condition,function(provider, response) {
                if (response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Order.Store.addressStore.loadData(result);
                } else {
                    Km.Order.Store.addressStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的收货地址！');
                }
            });
        }
    }),

    /**
     * 查询会员
     */
    AddressQueryWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                closeAction : "hide",
                constrainHeader:true,maximizable: true,collapsible: true,
                width : 700,height : 450,minWidth : 400,minHeight : 450,
                layout : 'fit',plain : true,buttonAlign : 'center',
                defaults : {
                    autoScroll : true
                },
                items : [
                    new Km.Order.View.AddressQueryGrid({ref:'addressGrid'})
                ],
                buttons : [ {
                    text: "确定",ref : "../saveBtn",scope:this,
                    handler : function() {
                        editWindow=this;
                        if (this.addressGrid.getSelectionModel().getSelected()){
                            var data=this.addressGrid.getSelectionModel().getSelected().data;
                            var memberForm=this.memberForm;
                            memberForm.consignee.setValue(data.consignee);
                            memberForm.address.setValue(data.address);
                            //memberForm.best_time.setValue(data.best_time);
                            memberForm.best_path.setValue(data.best_path);
                        }
                        this.hide();
                    }
                }, {
                    text : "取 消",scope:this,
                    handler : function() {
                        this.hide();
                    }
                }]
            }, config);
            Km.Order.View.AddressQueryWindow.superclass.constructor.call(this, config);
        }
    }),

    /**
     * 填写发票列表
     */
    InvoiceGrid:Ext.extend(Ext.grid.EditorGridPanel, {
        constructor : function(config) {
            /**
             * 编辑器
             */
            var invoiceEditor = new Ext.ux.grid.RowEditor({
                saveText : '修改',
                // 保证选择左侧的选择框时，不影响启动显示RowEdior
                onRowClick : function(g, rowIndex, e) {
                    if (!e.getTarget('.x-grid3-row-checker'))this.constructor.prototype.onRowClick.apply(this, arguments);
                }
            });
            this.editor=invoiceEditor;
            /**
             * 行选择器
             */
            invoiceSm = new Ext.grid.CheckboxSelectionModel({
                handleMouseDown : Ext.emptyFn,
                listeners : {
                    'rowselect' : function(sm, rowIndex, record) {},
                    'rowdeselect' : function(sm, rowIndex, record) {},
                    'selectionchange' : function(sm) {
                        // 判断删除按钮是否可以激活
                        this.grid.topToolbar.invoiceRemoveBtn.setDisabled(sm.getCount() < 1);
                    }
                }
            });
            Ext.applyIf(invoiceSm, {
                getEditor : function() {
                    return false;
                }
            });
            /**
             * 自动行号
             */
            var invoiceRm = new Ext.grid.RowNumberer({
                header : '序号',width : 40,
                renderer : function(value, metadata, record, rowIndex) {
                    if (this.rowspan) {
                        p.cellAttr = 'rowspan="' + this.rowspan + '"';
                    }
                    return rowIndex + 1;
                }
            });
            var invoiceStore=  new Ext.data.Store({
                  proxy: new Ext.data.HttpProxy({
                      url: 'home/admin/src/httpdata/invoice.php'
                  }),
                  reader: new Ext.data.JsonReader({
                      totalProperty: 'totalCount',
                      successProperty: 'success',
                      root: 'data',remoteSort: true,
                      fields : [
                            {name: 'invoice_id',type: 'int'},
                            {name: 'order_id',type: 'int'},
                            {name: 'invoice_code',type: 'string'},
                            {name: 'header',type: 'string'},
                            {name: 'content',type: 'string'},
                            {name: 'price',type: 'float'},
                            {name: 'invoice_party',type: 'string'},
                            {name: 'memo',type: 'string'},
                            {name: 'fee',type: 'float'}
                      ]}
                    )
                });
            config = Ext.apply({
                collapsible:true,title:'开票信息',height:250,width:'99.8%',
                store : invoiceStore,
                defaults:{align:'center'},constrainHeader:true,
                plugins : [this.editor],
                sm : invoiceSm,
                cm : new Ext.grid.ColumnModel({
                    columns: [
                        invoiceRm,
                        invoiceSm, {
                            header   :'发票号',
                            dataIndex:'invoice_code',width:120,editor:new Ext.form.TextField({ref:'invoice_code'})
                        },
                        {
                            header   :'发票抬头',
                            dataIndex:'header',width:180,editor:new Ext.form.TextField({ref:'header'})
                        },{
                            header   :'发票内容',
                            dataIndex:'content',width:200,editor:new Ext.form.TextField({ref:'content'})
                        },{
                            header   :'发票金额',
                            dataIndex:'price',width:80,editor:new Ext.form.NumberField({ref:'price'})
                        },{
                            header   :'备注',width:250,
                            dataIndex:'memo',editor:new Ext.form.TextField({ref:'memo'})
                        },{
                            header   :'开票方',
                            dataIndex:'invoice_party',editor:new Ext.form.TextField({ref:'invoice_party'})
                        },{
                            header   :'发票费用',
                            dataIndex:'fee',editor:new Ext.form.NumberField({ref:'fee'})
                        }]
                }),
                tbar:new Ext.Toolbar({
                    defaults:{scope: this},
                    items : [
                        {
                            text: '添加发票',iconCls : 'icon-add',
                            handler: this.onAdd
                        },'-',{
                            text : '删除发票',iconCls : 'icon-delete',ref : 'invoiceRemoveBtn',disabled : true,
                            handler : this.onDelete
                        },new Ext.Toolbar.Fill()]
                })
            },config);
            Km.Order.View.InvoiceGrid.superclass.constructor.call(this, config);
        },
        /**
         * 新增
         */
        onAdd : function(btn, ev) {
            var u = new this.store.recordType({
                header : '',
                content : '',
                price : '',
                sp_name : '',
                fee : '',
                memo  : ''
            });
            this.editor.stopEditing();
            this.store.insert(0, u);
            this.getView().refresh();
            this.editor.startEditing(0, 0);
        },
        /**
         * 删除
         */
        onDelete : function() {
            Ext.MessageBox.confirm('提示', '确实要删除所选的记录吗?', this.showResult,this);
        },
        /**
         * 批量删除
         */
        showResult : function showResult(btn) {
            // 确定要删除你选定项的信息
            if (btn == 'yes') {
                this.editor.stopEditing();
                var selectedRows = this.getSelectionModel().getSelections();
                for (var i = 0, r; r = selectedRows[i]; i++) {
                    if (!selectedRows[i]) {
                        continue;
                    }
                    this.store.remove(r);
                }
            }
        }
    }),

    /**
     * 编辑窗口：新建或者修改订单
     */
    EditWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            /**
             * 订单关键的信息
             */
            var toolbarOrderKeyInfo=new Ext.Toolbar({
                defaults:{xtype : 'displayfield'},
                items : [
                    "订单编号:",
                    {ref: 'order_no',value:''},{xtype: 'tbseparator'},
                    "订单类型:",{ref: 'order_type',xtype : 'combo',mode : 'local',
                        triggerAction : 'all',lazyRender : true,editable: false,
                        store : new Ext.data.SimpleStore({
                            fields : ['value', 'text'],
                            data : [['0', '电话订单'], ['1', '网上订单']]
                        }),
                        valueField : 'value',displayField : 'text'
                    },{xtype: 'tbseparator'},"接单人:",{ref: 'operator',value:Km.Order.Config.Operator},{xtype: 'tbseparator'},
                    "下订时间:",{xtype : 'datefield',ref: 'order_date',format : "Y-m-d"},'&nbsp;&nbsp;',
                    {xtype : 'timefield',ref: 'order_time',format:'G:i'},
                    new Ext.Toolbar.Fill()
                ]
            });
            this.toolbarOrderKeyInfo=toolbarOrderKeyInfo;
            config = Ext.apply({
                title:'添加订单',constrainHeader:true,maximizable: true,collapsible: true,
                layout:'fit',plain:true,buttonAlign:'center',width:'100%',height:'480',minWidth:400,minHeight:300,
                defaults : {autoScroll : true},
                listeners:{
                    beforehide:function(){},
                    collapse  :function(p){this.setWidth("160");},
                    expand    :function(p){this.setWidth(screen.width);this.center();}
                },
                items:[{
                    xtype: 'panel',ref:'editpanel',autoScroll: true,width:'100%',
                    items: [
                        new Km.Order.View.ProductGrid({ref:'../productsGrid'}),
                        new Km.Order.View.MemberForm({ref:'../memberForm'}),
                        new Km.Order.View.InvoiceGrid({ref:'../invoiceGrid'})
                    ]
                }],
                tbar:this.toolbarOrderKeyInfo,
                buttons : [{
                    xtype:'combo',store:Km.Order.Store.purchaserStore,allowBlank:false,
                    emptyText: '请选择办理人',ref : "../purchaser_id",scope:this,hiddenName:'purchaser_id',
                    itemSelector:'div.search-item',loadingText: '查询中...',width: 220,pageSize:Km.Order.Config.PageSize,
                    displayField:'realname',valueField : 'admin_id',
                    mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                    forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                    tpl:new Ext.XTemplate(
                                '<tpl for="."><div class="search-item">',
                                    '<h3>{realname}/{username}</h3>',
                                '</div></tpl>'
                    )
                },{
                    text: "提交审核",ref : "../saveBtn",scope:this,
                    handler : function() {
                        this.saveOrder();
                    }
                }, {
                    text : "重 置",scope:this,
                    handler : function() {
                        this.initOrder();
                    }
                }, {
                    text : "关 闭",scope:this,
                    handler : function() {
                        this.hide();
                    }
                }]
            }, config);
            Km.Order.View.EditWindow.superclass.constructor.call(this, config);
            this.initOrder();
        },
        /**
         * 保存订单
         */
        saveOrder:function(){
            //预检查
            var purchaser_id=this.purchaser_id.getValue();
            if (purchaser_id==""){
                Ext.Msg.alert('提示', "请选择办理人！");
                return;
            }

            var orderData={};
            //获取选择商品列表数据
            orderData.products={};
            var orderProductStore=this.productsGrid.store;
            if (orderProductStore.getCount()<=0){
                Ext.Msg.alert('提示', "请选择至少一个商品");
                return;
            }
            var sum_price=0;
            for (var i = 0; i < orderProductStore.getCount(); i++) {
               var product_code=orderProductStore.getAt(i).get('product_code');
               orderData.products[product_code]=orderProductStore.getAt(i).data;
               sum_price=sum_price+orderProductStore.getAt(i).data.amount;
            }
            //获取发票列表数据
            orderData.invoices={};
            var invoiceStore=this.invoiceGrid.store;
            for (var i = 0; i < invoiceStore.getCount(); i++) {
               var invoice_code=invoiceStore.getAt(i).get('invoice_code');
               orderData.invoices[invoice_code]=invoiceStore.getAt(i).data;
            }
            //获取订购用户信息
            orderData.memberinfo=this.memberForm.form.getValues();
            if (orderData.memberinfo.consignee==""){
                Ext.Msg.alert('提示', "请填写收货人！");
                return;
            }

            if (orderData.memberinfo.address==""){
                Ext.Msg.alert('提示', "请填写送货地址！");
                return;
            }
            //获取订单信息
            var order_no=this.toolbarOrderKeyInfo.order_no.getValue();
            var order_datetime=this.toolbarOrderKeyInfo.order_date.value+" "+this.toolbarOrderKeyInfo.order_time.value;
            var order_type=this.toolbarOrderKeyInfo.order_type.getValue();
            orderData.orderinfo={"order_no":order_no,"ordertime":order_datetime,"order_type":order_type,
            "total_amount":sum_price,"final_amount":sum_price,"cost_item":sum_price,"operator_id":purchaser_id};

            var editwindow=this;
            ExtServiceOrder.saveOrder(orderData,function(provider, response) {
                if (response.result.msg) {
                    Ext.Msg.alert('提示', response.result.msg);
                    return;
                }else{
                    Ext.Msg.alert('提示', '保存订单成功！');
                    editwindow.initOrder();
                }
            },this);
        },
        /**
         * 初始化订单
         */
        initOrder:function(){
            //订单关键的信息设置默认值
            this.toolbarOrderKeyInfo.operator.setValue(Km.Order.Config.Operator);
            this.toolbarOrderKeyInfo.order_type.setValue('0');
            var now=new Date();
            this.toolbarOrderKeyInfo.order_no.setValue(now.format('SYmdHis'));
            this.toolbarOrderKeyInfo.order_date.setValue(now);
            this.toolbarOrderKeyInfo.order_time.setValue(now);
            //初始化填写用户信息表单
            if (this.memberForm.form.el){
              this.memberForm.form.el.dom.reset();
              this.memberForm.isFirstOrder.setValue(false);
            }
            now.setDate(now.getDate()+1);
            this.memberForm.delivery_date.setValue(now);
            this.memberForm.delivery_time.setValue(now);
            //初始化选择商品列表
            this.productsGrid.store.removeAll();
            //初始化发票列表
            this.invoiceGrid.store.removeAll();
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前创建的编辑窗口
         */
        edit_window:null
    }
};

/**
 * Controller:主程序
 */
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Order.Init();
});
