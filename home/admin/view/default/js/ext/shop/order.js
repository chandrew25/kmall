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
        if (Km.Order.Cookie.get('View.Direction')){
            Km.Order.Config.View.Direction=Km.Order.Cookie.get('View.Direction');
        }
        if (Km.Order.Cookie.get('View.IsFix')!=null){
            Km.Order.Config.View.IsFix=Km.Order.Cookie.get('View.IsFix');
        }
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.Order.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }
        if (Ext.util.Cookies.get('operator')!=null){
            Km.Order.Config.operator=Ext.util.Cookies.get('operator');
        }
    },
    /**
     * 带条件打开本页
     */
    Filter:function(){
        var order_param=Ext.urlDecode(window.location.search.substring(1));
        if (order_param){
          if (order_param.status){
              Km.Order.View.Running.orderGrid.topToolbar.ostatus.setValue(order_param.status);
              Km.Order.View.Running.orderGrid.hiddenfilter();
          }
          if (order_param.pay_status){
              Km.Order.View.Running.orderGrid.topToolbar.opay_status.setValue(order_param.pay_status);
              Km.Order.View.Running.orderGrid.hiddenfilter();
          }
          if (order_param.ship_status){
              Km.Order.View.Running.orderGrid.topToolbar.oship_status.setValue(order_param.ship_status);
              Km.Order.View.Running.orderGrid.hiddenfilter();
          }
          //过滤无效的订单
          if (Km.Order.View.Running.orderGrid.filter==null){
            Km.Order.View.Running.orderGrid.filter={};
          }
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
                  {name: 'order_id',type: 'int'},
                  {name: 'order_no',type: 'string'},
                  {name: 'member_id',type: 'string'},
                  {name: 'username',type: 'string'},
                  {name: 'member_no',type: 'string'},
                  {name: 'realname',type: 'string'},
                  {name: 'email',type: 'string'},
                  {name: 'mobile',type: 'string'},
                  {name: 'status',type: 'string'},
                  {name: 'statusShow',type: 'string'},
                  {name: 'pay_status',type: 'string'},
                  {name: 'pay_statusShow',type: 'string'},
                  {name: 'ship_status',type: 'string'},
                  {name: 'ship_statusShow',type: 'string'},
                  {name: 'total_amount',type: 'float'},
                  {name: 'final_amount',type: 'float'},
                  {name: 'cost_item',type: 'float'},
                  {name: 'cost_other',type: 'float'},
                  {name: 'pmt_amount',type: 'float'},
                  {name: 'jifen',type: 'float'},
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
                  {name: 'ship_time',type: 'string'},
                  {name: 'ship_type',type: 'string'},
                  {name: 'ship_zipcode',type: 'string'},
                  {name: 'name_ship_type',type: 'string'},
                  {name: 'ship_sign_building',type: 'string'},
                  {name: 'url',type: 'string'},
                  {name: 'intro',type: 'string'},
                  {name: 'ordertime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                  {name: 'purchaser_man',type: 'string'},
                  {name: 'purchaser_memo',type: 'string'},
                  {name: 'purchasertime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                  {name: 'kefu_man',type: 'string'},
                  {name: 'kefu_memo',type: 'string'},
                  {name: 'kefutime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                  {name: 'send_man',type: 'string'},
                  {name: 'send_memo',type: 'string'},
                  {name: 'sendtime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                  {name: 'receive_man',type: 'string'},
                  {name: 'receive_memo',type: 'string'},
                  {name: 'receivetime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                  {name: 'account_man',type: 'string'},
                  {name: 'account_memo',type: 'string'},
                  {name: 'accounttime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                  {name: 'favourable',type: 'string'},
                  {name: 'remark',type: 'string'}
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
    }),
    /**
     * 菲生活的会员
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
              {name: 'username', mapping: 'username'}
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
     * 地区
     */
    regionStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/region.php'
          }),
        reader: new Ext.data.JsonReader({
            root: 'regions',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'region_id'
          }, [
              {name: 'region_id', mapping: 'region_id'},
              {name: 'region_name', mapping: 'region_name'}
        ])
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
     * 收货记录
     */
    deliveryInlogStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                  {name: 'deliverylog_id',type: 'int'},
                  {name: 'order_id',type: 'int'},
                  {name: 'order_no',type: 'string'},
                  {name: 'delivery_no',type: 'string'},
                  {name: 'operater',type: 'string'},
                  {name: 'deliveryAction',type: 'string'},
                  {name: 'result',type: 'string'},
                  {name: 'intro',type: 'string'},
                  {name: 'realname',type: 'string'},
                  {name: 'commitTime',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        )
    }),
    /**
     * 发货记录
     */
    deliveryOutlogStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                  {name: 'deliverylog_id',type: 'int'},
                  {name: 'order_id',type: 'int'},
                  {name: 'order_no',type: 'string'},
                  {name: 'delivery_no',type: 'string'},
                  {name: 'operater',type: 'string'},
                  {name: 'deliveryAction',type: 'string'},
                  {name: 'result',type: 'string'},
                  {name: 'intro',type: 'string'},
                  {name: 'realname',type: 'string'},
                  {name: 'commitTime',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        )
    }),
    /**
     * 订单日志
     */
    orderlogStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                  {name: 'orderlog_id',type: 'int'},
                  {name: 'order_id',type: 'int'},
                  {name: 'order_no',type: 'string'},
                  {name: 'delivery_no',type: 'string'},
                  {name: 'operater',type: 'string'},
                  {name: 'orderAction',type: 'string'},
                  {name: 'orderActionShow',type: 'string'},
                  {name: 'result',type: 'string'},
                  {name: 'resultShow',type: 'string'},
                  {name: 'commitTime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                  {name: 'intro',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        })
    }),
    /**
     * 收款记录
     */
    payInlogStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                  {name: 'paylog_id',type: 'int'},
                  {name: 'order_id',type: 'int'},
                  {name: 'order_no',type: 'string'},
                  {name: 'operater',type: 'string'},
                  {name: 'pay_type',type: 'string'},
                  {name: 'amount',type: 'float'},
                  {name: 'payAction',type: 'string'},
                  {name: 'result',type: 'string'},
                  {name: 'resultShow',type: 'string'},
                  {name: 'intro',type: 'string'},
                  {name: 'commitTime',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        })
    }),
    /**
     * 退款记录
     */
    payOutlogStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                  {name: 'paylog_id',type: 'int'},
                  {name: 'order_id',type: 'int'},
                  {name: 'order_no',type: 'string'},
                  {name: 'operater',type: 'string'},
                  {name: 'pay_type',type: 'string'},
                  {name: 'amount',type: 'float'},
                  {name: 'payAction',type: 'string'},
                  {name: 'result',type: 'string'},
                  {name: 'resultShow',type: 'string'},
                  {name: 'intro',type: 'string'},
                  {name: 'commitTime',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        })
    }),
    /**
     * 顾客留言
     */
    consultStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                  {name: 'consult_id',type: 'int'},
                  {name: 'order_id',type: 'int'},
                  {name: 'order_no',type: 'string'},
                  {name: 'username',type: 'string'},
                  {name: 'title',type: 'string'},
                  {name: 'comments',type: 'string'},
                  {name: 'reply',type: 'string'},
                  {name: 'commitTime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                  {name: 'updateTime',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    Ext.apply(options.params, Km.Order.View.Running.consultGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 订购商品
     */
    ordergoodsStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                  {name: 'ordergoods_id',type: 'int'},
                  {name: 'member_id',type: 'string'},
                  {name: 'order_id',type: 'int'},
                  {name: 'goods_id',type: 'string'},
                  {name: 'goods_name',type: 'string'},
                  {name: 'url',type: 'string'},
                  {name: 'amount',type: 'float'},
                  {name: 'price',type: 'float'},
                  {name: 'jifen',type: 'float'},
                  {name: 'nums',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        })
    }),
    /**
     * 发票
     */
    invoiceStore:new Ext.data.Store({
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
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        })
    })
};

/**
 * View:订单显示组件
 */
Km.Order.View = {
    /**
     * 编辑窗口：新建或者修改订单
     */
    EditWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                closeAction : "hide",title:'修改订单信息',
                constrainHeader:true,maximizable: true,collapsible: true,
                width : 450,height : 450,minWidth : 400,minHeight : 450,
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
                              {xtype: 'hidden',  name : 'order_id',ref:'../order_id'},
                              {fieldLabel : '订单号',xtype: 'displayfield',name : 'order_no'},
                              {fieldLabel : '会员',xtype: 'displayfield',name : 'username',ref : '../username'},
                              {fieldLabel : '会员号',name : 'cardno'},
                              {fieldLabel : '收货地址',name : 'ship_addr'},
                              {fieldLabel : '收货人',name : 'ship_name'},
                              {fieldLabel : '收货手机',name : 'ship_mobile'}
                        ]
                    })
                ],
                buttons : [ {
                    text: "修 改",ref : "../saveBtn",scope:this,
                    handler : function() {
                        if (!this.editForm.getForm().isValid()) {
                            return;
                        }
                        editWindow=this;

                        this.editForm.api.submit=ExtServiceOrder.update;
                        this.editForm.getForm().submit({
                            success : function(form, action) {
                                Ext.Msg.alert('提示','修改成功！');
                                Km.Order.Config.View.IsShow=1;
                                Km.Order.View.Running.orderGrid.showOrder();
                                Km.Order.View.Running.orderGrid.doSelectOrder();
                                form.reset();
                                editWindow.hide();
                            },
                            failure : function(form, action) {
                                Ext.Msg.alert('提示', '修改失败！');
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
                        this.editForm.form.loadRecord(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected());
                        switch (Km.Order.Config.OnlineEditor)
                        {
                            case 1:
                                if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro);
                                break
                            case 2:
                                if (Km.Order.View.EditWindow.KindEditor_intro) Km.Order.View.EditWindow.KindEditor_intro.html(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro);
                                break
                            case 3:
                                if (xhEditor_intro) xhEditor_intro.setSource(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro);
                                break
                            default:
                                if (ue_intro) ue_intro.setContent(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro);
                        }
                    }
                }]
            }, config);
            Km.Order.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 订单备注
     */
    OrderIntroPanel:Ext.extend(Ext.Panel,{
        constructor:function(config){
            config = Ext.apply({
              /**
               * 是否在线编辑器已经生成
               */
              isOnlineEditorRendered:false,buttonAlign: 'center',border:false,ref:'editForm',
              labelWidth : 100,autoHeight:true,labelAlign : "center",
              bodyStyle : 'padding:5px 5px 0',align : "center",
              items : [
                    {name : 'order_id',xtype: 'hidden',ref:'order_id'},
                    {fieldLabel : '订单附言',name :'intro',xtype : 'textarea',id:'intro',ref:'intro'}
              ],
              listeners:{
                  afterlayout:function(){
                      if (!this.isOnlineEditorRendered){
                        if (this.intro.getId()=="intro"){
                            switch (Km.Order.Config.OnlineEditor)
                            {
                                case 1:
                                    ckeditor_replace_intro();
                                    if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro);
                                    break
                                case 2:
                                    Km.Order.View.OrderIntroPanel.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
                                    if (Km.Order.View.OrderIntroPanel.KindEditor_intro) Km.Order.View.OrderIntroPanel.KindEditor_intro.html(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro);
                                    break
                                case 3:
                                    pageInit_intro();
                                    if (xhEditor_intro)xhEditor_intro.setSource(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro);
                                    break
                                default:
                                    this.intro.setWidth("98%");
                                    pageInit_ue_intro();
                                    if (ue_intro)this.intro.setValue(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro);

                            }
                        }
                        if (this.intro.getId()=="introWindow"){
                            switch (Km.Order.Config.OnlineEditor)
                            {
                                case 1:
                                    ckeditor_replace_introWindow();
                                    if (CKEDITOR.instances.introWindow) CKEDITOR.instances.introWindow.setData(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro);
                                    CKEDITOR.config.height="170";
                                    break
                                case 2:
                                    Km.Order.View.OrderIntroPanel.KindEditor_introWindow = KindEditor.create('textarea[name="introWindow"]',{width:'98%',minHeith:'350px', filterMode:true});
                                    if (Km.Order.View.OrderIntroPanel.KindEditor_introWindow) Km.Order.View.OrderIntroPanel.KindEditor_introWindow.html(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro);
                                    break
                                case 3:
                                    pageInit_introWindow();
                                    if (xhEditor_introWindow)xhEditor_introWindow.setSource(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro);
                                    break
                                default:
                                    this.intro.setWidth("98%");
                                    pageInit_ue_introWindow();
                                    if (ue_introWindow) ue_introWindow.ready(function(){ ue_introWindow.setContent(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro); });
                            }
                        }
                        this.isOnlineEditorRendered=true;
                      }
                  }
              },
              tbar:[{
                text: "修改",ref : "../saveIntroBtn",scope:this,
                handler : function() {
                    if (!Km.Order.Config.View.IsFix){
                        switch (Km.Order.Config.OnlineEditor)
                        {
                            case 1:
                                if (CKEDITOR.instances.introWindow) this.intro.setValue(CKEDITOR.instances.introWindow.getData());
                                break
                            case 2:
                                if (Km.Order.View.OrderIntroPanel.KindEditor_introWindow)this.intro.setValue(Km.Order.View.OrderIntroPanel.KindEditor_intro.html());
                                break
                            case 3:
                                if (xhEditor_introWindow)this.intro.setValue(xhEditor_intro.getSource());
                                break
                            default:
                                if (ue_introWindow)this.intro.setValue(ue_introWindow.getContent());

                        }
                    }else{
                        switch (Km.Order.Config.OnlineEditor)
                        {
                            case 1:
                                if (CKEDITOR.instances.intro) this.intro.setValue(CKEDITOR.instances.intro.getData());
                                break
                            case 2:
                                if (Km.Order.View.OrderIntroPanel.KindEditor_intro)this.intro.setValue(Km.Order.View.OrderIntroPanel.KindEditor_intro.html());
                                break
                            case 3:
                                if (xhEditor_intro)this.intro.setValue(xhEditor_intro.getSource());
                                break
                            default:
                                if (ue_intro)this.intro.setValue(ue_intro.getContent());

                        }
                    }
                    var editFormThis=this;
                    var values={"order_id":this.order_id.getValue(),"intro":this.intro.getValue()};
                    ExtServiceOrder.updateIntro(values,function(provider, response){
                        if (response.result.data) {
                            Ext.Msg.alert('提示', '修改成功！');
                            switch (Km.Order.Config.OnlineEditor)
                            {
                                case 1:
                                    if (!Km.Order.Config.View.IsFix){
                                        if (CKEDITOR.instances.introWindow) Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro = editFormThis.intro.getValue();
                                    }else{
                                        if (CKEDITOR.instances.intro) Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro = editFormThis.intro.getValue();
                                    }
                                    break
                                case 2:
                                    Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro = editFormThis.intro.getValue();
                                    break
                                case 3:
                                    if (xhEditor_intro)Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro = editFormThis.intro.getValue();
                                    break
                                default:
                                    if (!Km.Order.Config.View.IsFix){
                                        if (ue_introWindow) Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro = editFormThis.intro.getValue();
                                    }else{
                                        if (ue_intro) Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.intro = editFormThis.intro.getValue();
                                    }
                            }
                        }else{
                            Ext.Msg.alert('提示', '修改失败,请重试！');
                        }
                    });
                }
              }]
            },config);
            Km.Order.View.OrderIntroPanel.superclass.constructor.call(this,config);
        }
    }),
    /**
     * 顾客留言
     */
    KstmSayView:{
        /**
         * 编辑窗口：新建顾客留言
         */
        EditWindow:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    closeAction : "hide", title: "添加顾客留言",
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
                            switch (Km.Order.Config.OnlineEditor)
                            {
                                case 1:
                                    ckeditor_replace_comments();
                                    break
                                case 2:
                                    Km.Order.View.KstmSayView.EditWindow.KindEditor_comments = KindEditor.create('textarea[name="comments"]',{width:'98%',minHeith:'350px', filterMode:true});
                                    break
                                case 3:
                                    pageInit_comments();
                                    break
                                default:
                                    this.editForm.comments.setWidth("98%");
                                    pageInit_ue_comments();
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
                                  {xtype: 'hidden',  name : 'consult_id',ref:'../consult_id'},
                                  {xtype: 'hidden',name : 'order_id',ref:'../order_id'},
                                  {fieldLabel : '订单',xtype: 'displayfield',name : 'order_no',ref : '../order_no'},
                                  {xtype: 'hidden',name : 'member_id',ref:'../member_id'},
                                  {fieldLabel : '会员',xtype: 'displayfield',name : 'username',ref : '../username'},
                                  {fieldLabel : '标题',name : 'title'},
                                  {fieldLabel : '评论',name : 'comments',xtype : 'textarea',id:'comments',ref:'comments'}
                            ]
                        })
                    ],
                    buttons : [ {
                        text: "保 存",ref : "../saveBtn",scope:this,
                        handler : function() {
                            switch (Km.Order.Config.OnlineEditor)
                            {
                                case 1:
                                    if (CKEDITOR.instances.comments) this.editForm.comments.setValue(CKEDITOR.instances.comments.getData());
                                    break
                                case 2:
                                    if (Km.Order.View.EditWindow.KindEditor_comments)this.editForm.comments.setValue(Km.Order.View.EditWindow.KindEditor_comments.html());
                                    break
                                case 3:
                                    if (xhEditor_comments)this.editForm.comments.setValue(xhEditor_comments.getSource());
                                    break
                                default:
                                    if (ue_comments)this.editForm.comments.setValue(ue_comments.getContent());
                            }

                            if (!this.editForm.getForm().isValid()) {
                                return;
                            }
                            editWindow=this;
                            this.editForm.api.submit=ExtServiceConsult.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "顾客留言成功！");
                                    Km.Order.View.Running.kstmSayGrid.doSelectConsult();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }
                    }, {
                        text : "取 消",scope:this,
                        handler : function() {
                            this.hide();
                        }
                    }]
                }, config);
                Km.Order.View.KstmSayView.EditWindow.superclass.constructor.call(this, config);
            }
        }),
        /**
         * 编辑窗口：新建或者修改顾客留言
         */
        ReplyWindow:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    closeAction : "hide", title:"答复顾客",
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
                            switch (Km.Order.Config.OnlineEditor)
                            {
                                case 1:
                                    ckeditor_replace_reply();
                                    break;
                                case 2:
                                    Km.Order.View.KstmSayView.ReplyWindow.KindEditor_reply = KindEditor.create('textarea[name="reply"]',{width:'98%',minHeith:'350px', filterMode:true});
                                    break
                                case 3:
                                    pageInit_reply();
                                    break
                                default:
                                    this.editForm.reply.setWidth("98%");
                                    pageInit_ue_reply();
                                    break
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
                                xtype : 'displayfield',anchor:'98%'
                            },
                            items : [
                                  {xtype: 'hidden',  name : 'consult_id',ref:'../consult_id'},
                                  {fieldLabel : '订单',name : 'order_no'},
                                  {fieldLabel : '会员',name : 'username',ref : '../username'},
                                  {fieldLabel : '标题',name : 'title'},
                                  {fieldLabel : '评论',name : 'comments',ref:'comments'},
                                  {fieldLabel : '答复',name : 'reply',xtype : 'textarea',id:'reply',ref:'reply'}
                            ]
                        })
                    ],
                    buttons : [ {
                        text: "确 定",ref : "../saveBtn",scope:this,
                        handler : function() {
                            switch (Km.Order.Config.OnlineEditor)
                            {
                                case 1:
                                    if (CKEDITOR.instances.reply) this.editForm.reply.setValue(CKEDITOR.instances.reply.getData());
                                    break
                                case 2:
                                    if (Km.Order.View.KstmSayView.ReplyWindow.KindEditor_reply)this.editForm.reply.setValue(Km.Order.View.KstmSayView.ReplyWindow.KindEditor_reply.html());
                                    break
                                case 3:
                                    if (xhEditor_reply)this.editForm.reply.setValue(xhEditor_reply.getSource());
                                    break
                                default:
                                    if (ue_reply)this.editForm.reply.setValue(ue_reply.getContent());
                            }

                            if (!this.editForm.getForm().isValid()) {
                                return;
                            }
                            editWindow=this;
                            this.editForm.api.submit=ExtServiceConsult.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "答复顾客留言成功！");
                                    Km.Order.View.Running.kstmSayGrid.doSelectConsult();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
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
                            this.editForm.form.loadRecord(Km.Order.View.Running.consultGrid.getSelectionModel().getSelected());
                            switch (Km.Order.Config.OnlineEditor)
                            {
                                case 1:
                                    if (CKEDITOR.instances.reply) CKEDITOR.instances.reply.setData(Km.Order.View.Running.consultGrid.getSelectionModel().getSelected().data.reply);
                                    break
                                case 2:
                                    if (Km.Order.View.KstmSayView.ReplyWindow.KindEditor_reply) Km.Order.View.KstmSayView.ReplyWindow.KindEditor_reply.html(Km.Order.View.Running.consultGrid.getSelectionModel().getSelected().data.reply);
                                    break
                                case 3:
                                    break
                                default:
                                    if (ue_reply) ue_reply.setContent(Km.Order.View.Running.consultGrid.getSelectionModel().getSelected().data.reply);
                            }
                        }
                    }]
                }, config);
                Km.Order.View.KstmSayView.ReplyWindow.superclass.constructor.call(this, config);
            }
        }),
        /**
         * 显示留言列表
         */
        KstmSayGrid:Ext.extend(Ext.grid.GridPanel, {
            constructor:function(config){
                config = Ext.apply({
                    store : Km.Order.Store.consultStore,
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
                              {header : '会员名',dataIndex : 'username'},
                              {header : '标题',dataIndex : 'title'},
                              {header : '评论',dataIndex : 'comments',width:280},
                              {header : '答复',dataIndex : 'reply',width:350},
                              {header : '留言时间',dataIndex : 'commitTime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')},
                              {header : '答复时间',dataIndex : 'updateTime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')}
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
                                        text: '反选',iconCls : 'icon-reverse',
                                        handler: function(){
                                            this.onReverseSelect();
                                        }
                                    },'-',{
                                        text : '添加顾客留言',iconCls : 'icon-add',ref: '../../btnSave',
                                        handler : function() {
                                            this.addConsult();
                                        }
                                    },'-',{
                                        text : '答复顾客',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                        handler : function() {
                                            this.updateConsult();
                                        }
                                    },'-']}
                        )]
                    }
                },config);
                Km.Order.View.KstmSayView.KstmSayGrid.superclass.constructor.call(this,config);
            },
            /**
             * 行选择器
             */
            sm : new Ext.grid.CheckboxSelectionModel({
                //handleMouseDown : Ext.emptyFn,
                listeners : {
                    selectionchange:function(sm) {
                        this.grid.btnUpdate.setDisabled(sm.getCount() != 1);
                    }
                }
            }),
            /**
             * 查询符合条件的顾客留言
             */
            doSelectConsult : function() {
                var corder_id = Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.order_id;
                var condition = {'order_id':corder_id};
                Ext.apply(condition,this.filter);
                ExtServiceConsult.queryPageConsult(condition,function(provider, response) {
                    if (response.result.data) {
                        var result           = new Array();
                        result['data']       =response.result.data;
                        result['totalCount'] =response.result.totalCount;
                        Km.Order.Store.consultStore.loadData(result);
                    } else {
                        Km.Order.Store.consultStore.removeAll();
                    }
                });
            },
            /**
             * 新建顾客留言
             */
            addConsult : function() {
                if (Km.Order.View.Running.consult_window==null){
                    Km.Order.View.Running.consult_window=new Km.Order.View.KstmSayView.EditWindow();
                }
                Km.Order.View.Running.consult_window.consult_id.setValue("");
                switch (Km.Order.Config.OnlineEditor)
                {
                    case 1:
                        if (CKEDITOR.instances.comments) CKEDITOR.instances.comments.setData("");
                        break
                    case 2:
                        if (Km.Order.View.KstmSayView.EditWindow.KindEditor_comments) Km.Order.View.KstmSayView.EditWindow.KindEditor_comments.html("");
                        break
                    case 3:
                        break
                    default:
                        if (ue_reply)ue_reply.setContent("");
                }

                var order_id = Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.order_id;
                var order_no = Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.order_no;
                var member_id = Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.member_id;
                var username = Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.username;
                Km.Order.View.Running.consult_window.order_id.setValue(order_id);
                Km.Order.View.Running.consult_window.order_no.setValue(order_no);
                Km.Order.View.Running.consult_window.member_id.setValue(member_id);
                Km.Order.View.Running.consult_window.username.setValue(username);

                Km.Order.View.Running.consult_window.show();
                Km.Order.View.Running.consult_window.maximize();
            },
            /**
             * 编辑顾客留言时先获得选中的顾客留言信息
             */
            updateConsult : function() {
                if (Km.Order.View.Running.reply_window==null){
                    Km.Order.View.Running.reply_window=new Km.Order.View.KstmSayView.ReplyWindow();
                }
                Km.Order.View.Running.reply_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
                switch (Km.Order.Config.OnlineEditor)
                {
                    case 1:
                        if (CKEDITOR.instances.reply) CKEDITOR.instances.reply.setData(this.getSelectionModel().getSelected().data.reply);
                        break
                    case 2:
                        if (Km.Order.View.ReplyWindow.KindEditor_reply) Km.Order.View.KstmSayView.ReplyWindow.KindEditor_reply.html(this.getSelectionModel().getSelected().data.reply);
                        break
                    case 3:
                        if (xhEditor_reply)xhEditor_reply.setSource(this.getSelectionModel().getSelected().data.reply);
                        break
                    default:
                        if (ue_reply)ue_reply.ready(function(){ue_reply.setContent(data.reply);});
                }

                Km.Order.View.Running.reply_window.show();
                Km.Order.View.Running.reply_window.maximize();
            }
        })
    },
    /**
     * 发票列表
     */
    InvoiceView:{
        /**
         * 编辑窗口：新建或者修改发票
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
                            switch (Km.Order.Config.OnlineEditor)
                            {
                                case 1:
                                    ckeditor_replace_memo();
                                    break
                                case 2:
                                    Km.Order.View.InvoiceView.EditWindow.KindEditor_memo = KindEditor.create('textarea[name="memo"]',{width:'98%',minHeith:'350px', filterMode:true});
                                    break
                                case 3:
                                    pageInit_memo();
                                    break
                                default:
                                    this.editForm.memo.setWidth("98%");
                                    pageInit_ue_memo();
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
                                  {xtype: 'hidden',  name : 'invoice_id',ref:'../invoice_id'},
                                  {name : 'order_id',name : 'order_id',xtype : 'hidden',ref:'../order_id'},
                                  {fieldLabel : '发票号',name : 'invoice_code'},
                                  {fieldLabel : '发票抬头',name : 'header'},
                                  {fieldLabel : '发票内容',name : 'content'},
                                  {fieldLabel : '开票金额',name : 'price',xtype : 'numberfield'},
                                  {fieldLabel : '开票方',name : 'invoice_party'},
                                  //{fieldLabel : '发票费用',name : 'fee',xtype : 'numberfield'},
                                  {fieldLabel : '备注',name : 'memo',xtype : 'textarea',id:'memo',ref:'memo'}
                            ]
                        })
                    ],
                    buttons : [ {
                        text: "",ref : "../saveBtn",scope:this,
                        handler : function() {
                            switch (Km.Order.Config.OnlineEditor)
                            {
                                case 1:
                                    if (CKEDITOR.instances.memo) this.editForm.memo.setValue(CKEDITOR.instances.memo.getData());
                                    break
                                case 2:
                                    if (Km.Order.View.InvoiceView.EditWindow.KindEditor_memo)this.editForm.memo.setValue(Km.Order.View.InvoiceView.EditWindow.KindEditor_memo.html());
                                    break
                                case 3:
                                    if (xhEditor_memo)this.editForm.memo.setValue(xhEditor_memo.getSource());
                                    break
                                default:
                                    if (ue_memo)this.editForm.memo.setValue(ue_memo.getContent());
                            }

                            if (!this.editForm.getForm().isValid()) {
                                return;
                            }
                            editWindow=this;
                            if (this.savetype==0){
                                this.editForm.api.submit=ExtServiceInvoice.save;
                                this.editForm.getForm().submit({
                                    success : function(form, action) {
                                        Ext.Msg.alert("提示", "保存成功！");
                                        Km.Order.View.Running.invoiceGrid.doSelectInvoice();
                                        form.reset();
                                        editWindow.hide();
                                    },
                                    failure : function(form, action) {
                                        Ext.Msg.alert('提示', '失败');
                                    }
                                });
                            }else{
                                this.editForm.api.submit=ExtServiceInvoice.update;
                                this.editForm.getForm().submit({
                                    success : function(form, action) {
                                        Ext.Msg.alert('提示', '修改成功！');
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
                            this.editForm.form.loadRecord(Km.Order.View.Running.invoiceGrid.getSelectionModel().getSelected());
                            switch (Km.Order.Config.OnlineEditor)
                            {
                                case 1:
                                    if (CKEDITOR.instances.memo) CKEDITOR.instances.memo.setData(Km.Order.View.Running.invoiceGrid.getSelectionModel().getSelected().data.memo);
                                    break
                                case 2:
                                    if (Km.Order.View.InvoiceView.EditWindow.KindEditor_memo) Km.Order.View.InvoiceView.EditWindow.KindEditor_memo.html(Km.Order.View.Running.invoiceGrid.getSelectionModel().getSelected().data.memo);
                                    break
                                case 3:
                                    break
                                default:
                                    if (ue_memo) ue_memo.setContent(Km.Order.View.Running.deliveryGrid.getSelectionModel().getSelected().data.memo);
                            }

                        }
                    }]
                }, config);
                Km.Order.View.InvoiceView.EditWindow.superclass.constructor.call(this, config);
            }
        }),
        /**
         * 视图：发票列表
         */
        Grid:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    /**
                     * 查询条件
                     */
                    filter:null,
                    region : 'center',
                    store : Km.Order.Store.invoiceStore,
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
                              {header : '发票号',dataIndex : 'invoice_code'},
                              {header : '发票抬头',dataIndex : 'header'},
                              {header : '发票内容',dataIndex : 'content'},
                              {header : '开票金额',dataIndex : 'price'},
                              {header : '开票方',dataIndex : 'invoice_party'},
                              //{header : '发票费用',dataIndex : 'fee'},
                              {header : '备注',dataIndex : 'memo',width:'300'}
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
                                        text: '反选',iconCls : 'icon-reverse',
                                        handler: function(){
                                            this.onReverseSelect();
                                        }
                                    },'-',{
                                        text : '添加发票',iconCls : 'icon-add',ref: '../../btnSave',
                                        handler : function() {
                                            this.addInvoice();
                                        }
                                    },'-',{
                                        text : '修改发票',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                        handler : function() {
                                            this.updateInvoice();
                                        }
                                    },'-',{
                                        text : '删除发票', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                        handler : function() {
                                            this.deleteInvoice();
                                        }
                                    },'-']}
                        )]
                    }
                }, config);
                Km.Order.View.InvoiceView.Grid.superclass.constructor.call(this, config);
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
             * 查询符合条件的发票
             */
            doSelectInvoice : function() {
                var order_id=Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.order_id;
                var condition = {"order_id":order_id};
                ExtServiceInvoice.queryPageInvoice(condition,function(provider, response) {
                    if (response.result.data) {
                        var result           = new Array();
                        result['data']       =response.result.data;
                        result['totalCount'] =response.result.totalCount;
                        Km.Order.Store.invoiceStore.loadData(result);
                    } else {
                        Km.Order.Store.invoiceStore.removeAll();
                        Ext.Msg.alert('提示', '无符合条件的发票！');
                    }
                });
            },
            /**
             * 新建发票
             */
            addInvoice : function() {
                if (Km.Order.View.Running.editInvoice_window==null){
                    Km.Order.View.Running.editInvoice_window=new Km.Order.View.InvoiceView.EditWindow();
                }
                Km.Order.View.Running.editInvoice_window.resetBtn.setVisible(false);
                Km.Order.View.Running.editInvoice_window.saveBtn.setText('保 存');
                Km.Order.View.Running.editInvoice_window.setTitle('添加发票');
                Km.Order.View.Running.editInvoice_window.savetype=0;
                Km.Order.View.Running.editInvoice_window.invoice_id.setValue("");
                switch (Km.Order.Config.OnlineEditor)
                {
                    case 1:
                        if (CKEDITOR.instances.memo) CKEDITOR.instances.memo.setData("");
                        break
                    case 2:
                        if (Km.Order.View.InvoiceView.EditWindow.KindEditor_memo) Km.Order.View.InvoiceView.EditWindow.KindEditor_memo.html("");
                        break
                    case 3:
                        break
                    default:
                        if (ue_memo)ue_memo.setContent("");
                }

                var order_id=Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.order_id;
                Km.Order.View.Running.editInvoice_window.order_id.setValue(order_id);
                Km.Order.View.Running.editInvoice_window.show();
                Km.Order.View.Running.editInvoice_window.maximize();
            },
            /**
             * 编辑发票时先获得选中的发票信息
             */
            updateInvoice : function() {
                if (Km.Order.View.Running.editInvoice_window==null){
                    Km.Order.View.Running.editInvoice_window=new Km.Order.View.InvoiceView.EditWindow();
                }
                Km.Order.View.Running.editInvoice_window.saveBtn.setText('修 改');
                Km.Order.View.Running.editInvoice_window.resetBtn.setVisible(true);
                Km.Order.View.Running.editInvoice_window.setTitle('修改发票');
                Km.Order.View.Running.editInvoice_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
                Km.Order.View.Running.editInvoice_window.savetype=1;
                switch (Km.Order.Config.OnlineEditor)
                {
                    case 1:
                        if (CKEDITOR.instances.memo) CKEDITOR.instances.memo.setData(this.getSelectionModel().getSelected().data.memo);
                        break;
                    case 2:
                        if (Km.Order.View.InvoiceView.EditWindow.KindEditor_memo) Km.Order.View.InvoiceView.EditWindow.KindEditor_memo.html(this.getSelectionModel().getSelected().data.memo);
                        break;
                    case 3:
                        if (xhEditor_memo)xhEditor_memo.setSource(this.getSelectionModel().getSelected().data.memo);
                        break;
                    default:
                        if (ue_memo)ue_memo.ready(function(){ue_memo.setContent(this.getSelectionModel().getSelected().data.memo);});
                }

                Km.Order.View.Running.editInvoice_window.show();
                Km.Order.View.Running.editInvoice_window.maximize();
            },
            /**
             * 删除发票
             */
            deleteInvoice : function() {
                Ext.Msg.confirm('提示', '确实要删除所选的发票吗?', this.confirmDeleteInvoice,this);
            },
            /**
             * 确认删除发票
             */
            confirmDeleteInvoice : function(btn) {
                if (btn == 'yes') {
                    var del_invoice_ids ="";
                    var selectedRows    = this.getSelectionModel().getSelections();
                    for ( var flag = 0; flag < selectedRows.length; flag++) {
                        del_invoice_ids=del_invoice_ids+selectedRows[flag].data.invoice_id+",";
                    }
                    ExtServiceInvoice.deleteByIds(del_invoice_ids);
                    this.doSelectInvoice();
                    Ext.Msg.alert("提示", "删除成功！");
                }
            }
        })
    },
    /**
     * 显示订单详情
     */
    OrderView:{
        /**
         * Tab页：容器包含显示与订单所有相关的信息
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
                                if (Km.Order.View.Running.orderGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择订单！');
                                    return false;
                                }
                                Km.Order.Config.View.IsShow=1;
                                Km.Order.View.Running.orderGrid.showOrder();
                                Km.Order.View.Running.orderGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Order.View.OrderView.Tabs.superclass.constructor.call(this, config);
                Km.Order.View.Running.orderInfoView     = new Km.Order.View.OrderView.OrderInfoView();
                Km.Order.View.Running.deliverylogGrid   = new Km.Order.View.DeliverylogView.Grid();
                Km.Order.View.Running.orderlogGrid      = new Km.Order.View.OrderlogView.Grid();
                Km.Order.View.Running.paylogGrid        = new Km.Order.View.PaylogView.Grid();
                Km.Order.View.Running.orderproductsGrid = new Km.Order.View.OrderproductsView.Grid();
                Km.Order.View.Running.orderIntroPanel   = new Km.Order.View.OrderIntroPanel();
                Km.Order.View.Running.kstmSayGrid       = new Km.Order.View.KstmSayView.KstmSayGrid();
                Km.Order.View.Running.invoiceGrid       = new Km.Order.View.InvoiceView.Grid();
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Order.Config.View.Direction==1)||(Km.Order.Config.View.Direction==2)){
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
                    {title: '基本信息 ',ref:'tabOrderInfo',iconCls:'tabs',tabWidth:150,
                     items:[Km.Order.View.Running.orderInfoView]
                    },
                    {title: '订购商品',iconCls:'tabs',tabWidth:150,
                     items:[Km.Order.View.Running.orderproductsGrid]
                    },
                    {title: '发票',iconCls:'tabs',tabWidth:150,
                     items:[Km.Order.View.Running.invoiceGrid]
                    },
                    {title: '订单备注',ref:'tabOrderIntro',iconCls:'tabs',tabWidth:150,
                     items:[Km.Order.View.Running.orderIntroPanel]
                    },
                    {title: '收退货记录',iconCls:'tabs',tabWidth:150,
                     items:[Km.Order.View.Running.deliverylogGrid]
                    },
                    {title: '收退款记录',iconCls:'tabs',tabWidth:150,
                     items:[Km.Order.View.Running.paylogGrid]
                    },
                    {title: '订单日志',iconCls:'tabs',tabWidth:150,
                     items:[Km.Order.View.Running.orderlogGrid]
                    },
                    {title: '顾客留言',iconCls:'tabs',tabWidth:150,
                     items:[Km.Order.View.Running.kstmSayGrid]
                    }
                );
            }
        }),
        /**
         * 窗口:显示订单信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看订单",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Order.View.OrderView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Order.Config.View.IsShow=0;
                            Km.Order.View.Running.orderGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Order.Config.View.IsShow=0;
                            Km.Order.View.Running.orderGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Order.View.Running.orderGrid.addOrder();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Order.View.Running.orderGrid.updateOrder();}
                    }]
                }, config);
                Km.Order.View.OrderView.Window.superclass.constructor.call(this, config);
            }
        }),
        /**
         * 订单信息
         */
        OrderInfoView:Ext.extend(Ext.Panel,{
            constructor : function(config) {
                config = Ext.apply({
                    layout:{type:'border'},ref:'infoPanel',autoScroll:true,defaults:{autoScroll:true},bodyStyle:'background-color:#FFFFFF',
                    items:[{
                        title:'处理信息',ref:'../basic',region: 'north',collapsible: true,height:100,margins:'0px 0px 0 2px',
                        tpl:[
                              '<table class="viewdoblock" style="width:99%;margin:10px 6px 6px 6px;text-align:center">',
                                 '<tr class="entry">',
                                 '<td class="headms" height="30px">订单号</td><td class="contentm">{order_no}</td>',
                                 '<td class="headms">订单状态</td><td class="contentm">{statusShow}</td>',
                                 '<td class="headms">支付状态</td><td class="contentm">{pay_statusShow}</td>',
                                 '<td class="headms">物流状态</td><td class="contentm">{ship_statusShow}</td>',
                                 '</tr>',
                                 '<tr class="entry">',
                                 '<td class="headms" height="30px">订购时间</td><td class="contentm">{ordertime:date("Y-m-d H:i")}</td><td class="headm" colspan="6"></td>',
                                 '</tr>',
                             '</table>',
                             '<table class="viewdoblock" style="width:99%;margin:10px 6px 6px 6px;">',
                                 '<tr class="entry" style="text-align:center;font-weight:bold;">',
                                 '<td>操作记录</td><td class="contentm" width="100px">操作人员</td><td class="contentm" width="130px">操作时间</td><td class="contentm" colspan="5" height="40px">备注</td>',
                                 '</tr>',
/*                                 '<tr class="entry">',
                                 '<td class="headms">采购审核情况记录</td><td class="contentms" width="100px">{purchaser_man}</td><td class="contentms" width="130px">{purchasertime:date("Y-m-d H:i")}</td><td class="contentm" colspan="5" height="30px" style="text-indent:2em;">{purchaser_memo}</td>',
                                 '</tr>',
                                 '<tr class="entry">',
                                 '<td class="headms">客服确认情况记录</td><td class="contentms">{kefu_man}</td><td class="contentms">{kefutime:date("Y-m-d H:i")}</td><td class="contentm" colspan="5" height="30px" style="text-indent:2em;">{kefu_memo}</td>',
                                 '</tr>',*/
                                 '<tr class="entry">',
                                 '<td class="headms">发货确认情况记录</td><td class="contentms">{send_man}</td><td class="contentms">{sendtime:date("Y-m-d H:i")}</td><td class="contentm" colspan="5" height="30px" style="text-indent:2em;">{send_memo}</td>',
                                 '</tr>',
                                 '<tr class="entry">',
                                 '<td class="headms">签收确认情况记录</td><td class="contentms">{receive_man}</td><td class="contentms">{receivetime:date("Y-m-d H:i")}</td><td class="contentm" colspan="5" height="30px" style="text-indent:2em;">{receive_memo}</td>',
                                 '</tr>',
                                 '<tr class="entry">',
                                 '<td class="headms">结算情况记录</td><td class="contentms">{account_man}</td><td class="contentms">{accounttime:date("Y-m-d H:i")}</td><td class="contentm" colspan="5" height="30px" style="text-indent:2em;">{account_memo}</td>',
                                 '</tr>',
                             '</table>'
                         ],
                        listeners:{
                            afterrender:function(){this.ownerCt.onOverwrite(this);}
                        }
                    },{
                        ref:'../order',title:'订单信息',region: 'west',width:'33%',margins:'0px 2px 0 2px',height:300,
                        tpl: [
                          '<table class="viewdoblock" style="margin:2px 10px 10px 5px;">',
                             '<tr class="entry"><td class="head">支付方式</td><td class="content">{name_pay_type}</td></tr>',
                             '<tr class="entry"><td class="head">配送方式</td><td class="content">{name_ship_type}</td></tr>',
                             '<tr class="entry"><td class="head">商品总额</td><td class="content">{cost_item}</td></tr>',
                             '<tr class="entry"><td class="head">优惠金额</td><td class="content">{pmt_amount}</td></tr>',
                             '<tr class="entry"><td class="head">现金总额</td><td class="content">{total_amount}</td></tr>',
                             '<tr class="entry"><td class="head">券总额</td><td class="content">{jifen}</td></tr>',
                             '<tr class="entry"><td class="head">成交总额</td><td class="content">{final_amount}</td></tr>',
                         '</table>'
                         ],
                        listeners:{
                            afterrender:function(){this.ownerCt.onOverwrite(this);}
                        }
                    },{
                        ref:'../delivery',title:'其他信息',region: 'center',width:'33%',margins:'0px 2px 0 0',height:300,
                        tpl: [
                          '<table class="viewdoblock" style="margin:2px 10px 10px 5px;">',
                             '<tr class="entry"><td class="head">收货地址</td><td class="content">{ship_addr}</td></tr>',
                             '<tr class="entry"><td class="head">收货人</td><td class="content">{ship_name}</td></tr>',
                             '<tr class="entry"><td class="head">收货手机</td><td class="content">{ship_mobile}</td></tr>',
                             '<tr class="entry"><td class="head">最佳送货时间</td><td class="content">{ship_time}</td></tr>',
                             '<tr class="entry"><td class="head">标志建筑</td><td class="content">{ship_sign_building}</td></tr>',
                         '</table>',
                         '<table class="viewdoblock" style="margin:10px 10px 10px 5px;">',
                             '<tr class="entry"><td class="head">卡券号码</td><td class="content">{favourable}</td></tr>',
                         '</table>',
                         '<table class="viewdoblock" style="margin:10px 10px 10px 5px;">',
                             '<tr class="entry"><td class="head">会员卡号</td><td class="content">{member_no}</td></tr>',
                         '</table>',
                         '<table class="viewdoblock" style="margin:10px 10px 10px 5px;">',
                             '<tr class="entry"><td class="head">备注信息</td><td class="content">{remark}</td></tr>',
                         '</table>'
                         ],
                        listeners:{
                            afterrender:function(){this.ownerCt.onOverwrite(this);}
                        }
                    },{
                        ref:'../buyer',title:'购买人信息',region: 'east',width:'33%',margins:'0 2px 0 0',height:300,
                        tpl: [
                          '<table class="viewdoblock" style="margin:2px 10px 10px 5px;">',
                             '<tr class="entry"><td class="head">会员号</td><td class="content">{member_no}</td></tr>',
                             '<tr class="entry"><td class="head">用户名</td><td class="content">{username}</td></tr>',
                             '<tr class="entry"><td class="head">真实姓名</td><td class="content">{realname}</td></tr>',
                             '<tr class="entry"><td class="head">Email</td><td class="content">{email}</td></tr>',
                             '<tr class="entry"><td class="head">手机</td><td class="content">{mobile}</td></tr>',
                         '</table>'
                         ],
                        listeners:{
                            afterrender:function(){
                            	this.ownerCt.onOverwrite(this);
                            }
                        }
                    }]
                }, config);
                Km.Order.View.OrderView.OrderInfoView.superclass.constructor.call(this, config);
            },
            onOverwrite : function(panel){
            	if (Km.Order.View.Running.orderGrid.getSelectionModel().getSelected()){
                	var panelHtml=panel.tpl.apply(Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data);
                	panel.update(panelHtml);
                }
            },
            onUpdate    :function(tabOrderInfo){
                tabOrderInfo.infoPanel.onOverwrite(tabOrderInfo.basic);
                tabOrderInfo.infoPanel.onOverwrite(tabOrderInfo.order);
                tabOrderInfo.infoPanel.onOverwrite(tabOrderInfo.delivery);
                tabOrderInfo.infoPanel.onOverwrite(tabOrderInfo.buyer);
            }
        })
    },
    /**
     * 显示物流信息详情
     */
    DeliveryView:{
        /**
         * 编辑窗口：新建或者修改物流
         */
        EditWindow:Ext.extend(Ext.Window,{
          constructor : function(config) {
            config = Ext.apply({
              closeAction : "hide",title:"发货确认",
              constrainHeader:true,maximizable: true,collapsible: true,
              width : 450,height : 450,minWidth : 400,minHeight : 450,
              layout : 'fit',plain : true,buttonAlign : 'center',
              defaults : {autoScroll : true},
              listeners:{
                beforehide:function(){
                  this.editForm.form.getEl().dom.reset();
                }
              },
              items : [
                new Ext.form.FormPanel({
                  ref:'editForm',layout:'form',title:'',
                  labelWidth : 100,labelAlign : "center",
                  bodyStyle : 'padding:5px 5px 0',align : "center",
                  api : {},defaults : {xtype : 'textfield',anchor:'98%'},
                  items : [
                      {xtype: 'hidden',  name : 'delivery_id',ref:'../delivery_id'},
                      {xtype: 'hidden',name : 'order_id',id:'order_id',ref:'../order_id'},
                      {xtype: 'hidden',name : 'order_no',id:'order_no',ref:'../order_no'},
                      {xtype: 'hidden',name : 'member_id',id:'member_id',ref:'../member_id'},
                      {
                        xtype: 'fieldset',collapsible: true,title:'收货地址信息',defaults : {xtype : 'textfield',anchor:'98%'},
                        items: [
                          {fieldLabel : '姓名',name : 'ship_name',ref:"../../ship_name"},
                          {fieldLabel : '地区',name : 'ship_area',ref:"../../ship_area"},
                          {fieldLabel : '地址',name : 'ship_addr',ref:"../../ship_addr"},
                          {fieldLabel : '邮编',name : 'ship_zip',ref:"../../ship_zip"},
                          {fieldLabel : '电话',name : 'ship_tel',ref:"../../ship_tel"},
                          {fieldLabel : '手机',name : 'ship_mobile',ref:"../../ship_mobile"},
                          {fieldLabel : '送货时间',name : 'ship_time',ref:"../../ship_time"}
                          ]
                      },
                      {
                        xtype: 'fieldset',collapsible: true,title:'发货地址信息',defaults : {xtype : 'textfield',anchor:'98%'},
                        items: [
                          {
                               xtype: 'combo',name : 'deliverytype_name',ref : '../../deliverytype_name',fieldLabel:"快递方式(<font color=red>*</font>)",
                               store:Km.Order.Store.deliverytypeStore,emptyText: '请选择快递方式',itemSelector: 'div.search-item',
                               loadingText: '查询中...',pageSize:Km.Order.Config.PageSize,
                               displayField:'name',grid:this,flex:1,
                               mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                               forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                               tpl:new Ext.XTemplate(
                                          '<tpl for="."><div class="search-item">',
                                              '<h3>{name}</h3>',
                                          '</div></tpl>'
                               ),
                               onSelect:function(record,index){
                                   if(this.fireEvent('beforeselect', this, record, index) !== false){
                                      this.grid.deliverytype_id.setValue(record.data.deliverytype_id);
                                      this.grid.deliverytype_name.setValue(record.data.name);
                                      this.grid.delivery.setValue(record.data.name);
                                      this.collapse();
                                   }
                               }
                          },
                          {xtype: 'hidden', name : 'deliverytype_id',ref:'../../deliverytype_id'},
                          {xtype: 'hidden', fieldLabel : '快递公司',name : 'delivery',ref:"../../delivery",value:''},
                          {fieldLabel : '快递单号',name : 'delivery_no',ref:'../../delivery_no'},
                          {fieldLabel : '地区',name : 'ship_area_from',ref:"../../ship_area_from",value:""},
                          {fieldLabel : '地址',name : 'ship_addr_from',ref:"../../ship_addr_from",value:""},
                          {fieldLabel : '邮编',name : 'ship_zip_from',ref:"../../ship_zip_from",value:""},
                          {fieldLabel : '订购热线',name : 'ship_tel_from',ref:"../../ship_tel_from",value:""},
                          {fieldLabel : '售后热线',name : 'ship_mobile_from',ref:"../../ship_mobile_from",value:"200233"}]
                      },
                      {fieldLabel : '备注',name : 'memo',xtype:"textarea",ref:"../memo"}
                  ]
                })
              ],
              buttons : [ {
                text: "确 定",ref : "../saveBtn",scope:this,
                handler : function() {
                  if (!this.editForm.getForm().isValid()) {
                    return;
                  }
                  editWindow=this;
                  this.editForm.api.submit=ExtServiceOrder.send;
                  this.editForm.getForm().submit({
                    success : function(form, action) {
                        Km.Order.View.Running.orderGrid.doSelectOrder();
                        form.reset();
                        editWindow.hide();
                        Ext.Msg.alert('提示', '确认发货成功！');
                    },
                    failure : function(form, action) {
                      Ext.Msg.alert('提示', '请确认填写是否正确！');
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
                    var selectOrder=Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data;
                    var openwindow=Km.Order.View.Running.edit_window_delivery;
                    var now=new Date();
                    // openwindow.delivery_no.setValue(now.format('YmdHis'));
                    openwindow.ship_name.setValue(selectOrder.ship_name);
                    openwindow.ship_addr.setValue(selectOrder.ship_addr);
                    openwindow.ship_mobile.setValue(selectOrder.ship_mobile);
                    openwindow.ship_tel.setValue(selectOrder.ship_mobile);
                    openwindow.ship_zip.setValue(selectOrder.ship_zipcode);
                    openwindow.ship_time.setValue(selectOrder.ship_time);
                    openwindow.memo.setValue("");
                    var ship_area="";
                    if (selectOrder.region_name_country)ship_area=selectOrder.region_name_country+"-";
                    if (selectOrder.region_name_province)ship_area=selectOrder.region_name_province+"-";
                    if (selectOrder.region_name_city)ship_area=ship_area+selectOrder.region_name_city+"-";
                    if (selectOrder.region_name_district)ship_area=ship_area+selectOrder.region_name_district;
                    openwindow.ship_area.setValue(ship_area);
                    this.init();
                }
              }]
            }, config);
            Km.Order.View.EditWindow.superclass.constructor.call(this, config);
          },
          init:function(){
              // this.delivery.setValue('上海赢滨电子商务有限公司');
              // this.ship_area_from.setValue("上海 浦东新区");
              // this.ship_addr_from.setValue("上海市浦东新区川沙路1098号8幢");
              // this.ship_zip_from.setValue("200136");
              // this.ship_tel_from.setValue("18916520993");
              // this.ship_mobile_from.setValue("400");
          }
        })
    },
    DeliverytmpView:{
        /**
         * 编辑窗口：选择模板
         */
        EditWindow:Ext.extend(Ext.Window,{
          constructor : function(config) {
            config = Ext.apply({
              closeAction : "hide",title:"选择打印模板",
              constrainHeader:true,maximizable: true,collapsible: true,
              width : 300,height : 150,minWidth : 400,minHeight : 150,
              layout : 'fit',plain : true,buttonAlign : 'center',
              defaults : {autoScroll : true},
              listeners:{
                beforehide:function(){
                  this.editForm.form.getEl().dom.reset();
                }
              },
              items : [
                new Ext.form.FormPanel({
                  ref:'editForm',layout:'form',title:'快递单打印',
                  labelWidth : 100,labelAlign : "center",
                  bodyStyle : 'padding:5px 5px 0',align : "center",
                  api : {},defaults : {xtype : 'textfield',anchor:'98%'},
                  items : [
                      {fieldLabel : '快递单模板',hiddenName : 'deliveryTemplate',xtype: 'combo',ref:'../deliveryTemplate',
                        mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                        store : new Ext.data.SimpleStore({
                            fields : ['value', 'text'],
                            data : [['2', '圆通速递'],['5', '申通快递']]
                          }),emptyText: '请选择快递单模板',
                        valueField : 'value',// 值
                        displayField : 'text'// 显示文本
                      }
                  ]
                })
              ],
              buttons : [ {
                text: "确 定",ref : "../saveBtn",scope:this,
                handler : function() {
                    var tmptype = this.deliveryTemplate.getValue();
                    if(!tmptype){
                        Ext.Msg.alert('提示','请先选择一个快递模板！');
                        return;
                    }
                    var order_id=Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.order_id;
                    window.open("index.php?go=admin.print.express&order_id="+order_id+"&dtype="+tmptype);
                }
              }, {
                text : "取 消",scope:this,
                handler : function() {
                  this.hide();
                }
              }]
            }, config);
            Km.Order.View.EditWindow.superclass.constructor.call(this, config);
          }
        })
    },
    /**
     * 视图：收退货记录列表
     */
    DeliverylogView:{
        /**
         * 视图：收退货记录列表
         */
        Grid:Ext.extend(Ext.Panel, {
          constructor : function(config) {
            config = Ext.apply({
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
              items:[new Km.Order.View.DeliverylogView.GridIn({flex:1}),new Km.Order.View.DeliverylogView.GridOut({flex:1})]
            }, config);
            Km.Order.View.DeliverylogView.Grid.superclass.constructor.call(this, config);
          }
        }),
        /**
         * 视图：收货记录列表
         */
        GridIn:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Order.Store.deliveryInlogStore,ref:'gridIn',title:'发货记录',
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,//headerAsText : false,
                    defaults : {
                        autoScroll : true
                    },
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                            width:120,sortable : true
                        },
                        columns : [
                          {header : '物流单号',dataIndex : 'delivery_no'},
                          {header : '发货单号',dataIndex : 'order_no'},
                          {header : '收件人',dataIndex : 'realname'},
                          {header : '结果',dataIndex : 'result'},
                          {header : '发货时间',dataIndex : 'commitTime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')}
                        ]
                    })
                }, config);
                Km.Order.View.DeliverylogView.GridIn.superclass.constructor.call(this, config);
            },
            /**
             * 查询符合条件的合同订单
             */
            doSelectDeliverylog : function() {
                if (Km.Order.View.Running.orderGrid&&Km.Order.View.Running.orderGrid.getSelectionModel().getSelected()){
                    var order_id = Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.order_id;
                    var condition = {'order_id':order_id,'deliveryAction':'1'};
                    ExtServiceDeliverylog.queryPageDeliverylog(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                Km.Order.Store.deliveryInlogStore.loadData(result);
                            } else {
                                Km.Order.Store.deliveryInlogStore.removeAll();
                            }
                        }
                    });
                }
            }
        }),
        /**
         * 视图：退货记录列表
         */
        GridOut:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Order.Store.deliveryOutlogStore,ref:'gridOut',title:'退货记录',
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,//headerAsText : false,
                    defaults : {
                        autoScroll : true
                    },
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                            width:120,sortable : true
                        },
                        columns : [
                          {header : '物流单号',dataIndex : 'delivery_no'},
                          {header : '退货单号',dataIndex : 'order_no'},
                          {header : '退货人',dataIndex : 'realname'},
                          {header : '结果',dataIndex : 'result'},
                          {header : '退货时间',dataIndex : 'commitTime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')}
                        ]
                    })
                }, config);
                Km.Order.View.DeliverylogView.GridOut.superclass.constructor.call(this, config);
            },
            /**
             * 查询符合条件的合同订单
             */
            doSelectDeliverylog : function() {
                if (Km.Order.View.Running.orderGrid&&Km.Order.View.Running.orderGrid.getSelectionModel().getSelected()){
                    var order_id = Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.order_id;
                    var condition = {'order_id':order_id,'deliveryAction':'3'};
                    ExtServiceDeliverylog.queryPageDeliverylog(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                Km.Order.Store.deliveryOutlogStore.loadData(result);
                            } else {
                                Km.Order.Store.deliveryOutlogStore.removeAll();
                            }
                        }
                    });
                }
            }
        })
    },
    /**
     * 视图：订单日志列表
     */
    OrderlogView:{
        /**
         * 视图：订单日志列表
         */
        Grid:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Order.Store.orderlogStore,
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
                          {header : '时间',dataIndex : 'commitTime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')},
                          {header : '操作人',dataIndex : 'operater'},
                          {header : '行为',dataIndex : 'orderActionShow'},
                          {header : '结果',dataIndex : 'resultShow'},
                          {header : '备注',dataIndex : 'intro',width:600}
                        ]
                    })
                }, config);
                Km.Order.View.OrderlogView.Grid.superclass.constructor.call(this, config);
            },
            /**
             * 查询符合条件的合同订单
             */
            doSelectOrderlog : function() {
                if (Km.Order.View.Running.orderGrid&&Km.Order.View.Running.orderGrid.getSelectionModel().getSelected()){
                    var order_id = Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.order_id;
                    var condition = {'order_id':order_id};
                    ExtServiceOrderlog.queryPageOrderlog(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                Km.Order.Store.orderlogStore.loadData(result);
                            } else {
                                Km.Order.Store.orderlogStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的合同订单！');
                            }
                        }
                    });
                }
            }
        })
    },
    /**
     * 视图：收退款记录列表
     */
    PaylogView:{
        /**
         * 视图：收退货记录列表
         */
        Grid:Ext.extend(Ext.Panel, {
          constructor : function(config) {
            config = Ext.apply({
              baseCls:'x-plain',
              layout:{type:'hbox',align : 'stretch'},
              layoutConfig: {padding:'10'},
              defaults:{margins:'5 5 5 0',frame:true},
              items:[new Km.Order.View.PaylogView.GridIn({flex:1}),new Km.Order.View.PaylogView.GridOut({flex:1})]
            }, config);
            Km.Order.View.PaylogView.Grid.superclass.constructor.call(this, config);
          }
        }),
        /**
         * 视图：收款记录列表
         */
        GridIn:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Order.Store.payInlogStore,ref:'gridIn',title:'收款记录',
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,//headerAsText : false,
                    defaults : {
                        autoScroll : true
                    },
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                            width:120,sortable : true
                        },
                        columns : [
                          {header : '单据单号',dataIndex : 'paylog_id'},
                          {header : '支付金额',dataIndex : 'amount'},
                          {header : '支付方式',dataIndex : 'pay_type'},
                          {header : '状态',dataIndex : 'resultShow'},
                          {header : '支付时间',dataIndex : 'commitTime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')}
                        ]
                    })
                }, config);
                Km.Order.View.PaylogView.GridIn.superclass.constructor.call(this, config);
            },
            /**
             * 查询符合条件的收款记录清单
             */
            doSelectPaylog : function() {
                if (Km.Order.View.Running.orderGrid&&Km.Order.View.Running.orderGrid.getSelectionModel().getSelected()){
                    var order_id = Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.order_id;
                    var condition = {'order_id':order_id,'payAction':'1'};
                    ExtServicePaylog.queryPagePaylog(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                Km.Order.Store.payInlogStore.loadData(result);
                            } else {
                                Km.Order.Store.payInlogStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的合同订单！');
                            }
                        }
                    });
                }
            }
        }),
        /**
         * 视图：退款记录列表
         */
        GridOut:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Order.Store.payOutlogStore,ref:'gridOut',title:'退款记录',
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,//headerAsText : false,
                    defaults : {
                        autoScroll : true
                    },
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                            width:120,sortable : true
                        },
                        columns : [
                          {header : '单据单号',dataIndex : 'paylog_id'},
                          {header : '退款金额',dataIndex : 'amount'},
                          {header : '退款方式',dataIndex : 'pay_type'},
                          {header : '状态',dataIndex : 'resultShow'},
                          {header : '退款时间',dataIndex : 'commitTime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')}
                        ]
                    })
                }, config);
                Km.Order.View.PaylogView.GridOut.superclass.constructor.call(this, config);
            },
            /**
             * 查询符合条件的退款记录清单
             */
            doSelectPaylog : function() {
                if (Km.Order.View.Running.orderGrid&&Km.Order.View.Running.orderGrid.getSelectionModel().getSelected()){
                    var order_id = Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.order_id;
                    var condition = {'order_id':order_id,'payAction':'2'};
                    ExtServicePaylog.queryPagePaylog(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       = response.result.data;
                                Km.Order.Store.payOutlogStore.loadData(result);
                            } else {
                                Km.Order.Store.payOutlogStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的合同订单！');
                            }
                        }
                    });
                }
            }
        })
    },
    /**
     * 视图：订购商品列表
     */
    OrderproductsView:{
        /**
         * 视图：订购商品列表
         */
        Grid:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Order.Store.ordergoodsStore,
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {
                        autoScroll : true,align : 'stretch'
                    },
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                            width:120,sortable : true
                        },
                        columns : [
                          {header : '商品名称',dataIndex : 'goods_name',width:300},
                          {header : '现金价',dataIndex : 'price'},
                          {header : '券',dataIndex : 'jifen'},
                          {header : '数量',dataIndex : 'nums'},
                          {header : '市场价',dataIndex : 'amount'}
                        ]
                    })
                }, config);
                Km.Order.View.OrderproductsView.Grid.superclass.constructor.call(this, config);
            },
            /**
             * 查询符合条件的合同订单
             */
            doSelectOrdergoods : function() {
                if (Km.Order.View.Running.orderGrid&&Km.Order.View.Running.orderGrid.getSelectionModel().getSelected()){
                    var order_id = Km.Order.View.Running.orderGrid.getSelectionModel().getSelected().data.order_id;
                    var condition = {'order_id':order_id};
                    ExtServiceOrdergoods.queryPageOrdergoods(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                Km.Order.Store.ordergoodsStore.loadData(result);
                            } else {
                                Km.Order.Store.ordergoodsStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的合同订单！');
                            }
                        }
                    });
                }
            }
        })
    },
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
                loadMask : true,stripeRows : true,headerAsText : false,printDelivery:null,
                printInvoice:null,printExpress:null,printOrder:null,
                defaults : {autoScroll : true},
                cm : new Ext.grid.ColumnModel({
                    defaults:{width:120,sortable:true},
                    columns : [
                        this.sm,
                          {header : '订单号',dataIndex : 'order_no'},
                          {header : '会员',dataIndex : 'username'},
                          {header : '订单状态',dataIndex : 'statusShow'},
                          {header : '支付状态',dataIndex : 'pay_statusShow'},
                          {header : '物流状态',dataIndex : 'ship_statusShow'},
                          {header : '现金总额',dataIndex : 'total_amount'},
                          {header : '券总额',dataIndex : 'jifen'},
                          {header : '下单时间',dataIndex : 'ordertime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')},
                          {header : '支付方式',dataIndex : 'name_pay_type'},
                          {header : '收货地址',dataIndex : 'ship_addr'},
                          {header : '收货人',dataIndex : 'ship_name'},
                          {header : '收货手机',dataIndex : 'ship_mobile'},
                          {header : '配送方式',dataIndex : 'name_ship_type'},
                          {header : '最佳送货时间',dataIndex : 'ship_time'}
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
                            enableOverflow: true,width : 100,
                            defaults : {
                               xtype : 'textfield'
                            },
                            items : [
                                '会员 ','&nbsp;&nbsp;',
                                {
                                     xtype: 'combo',name : 'username',hiddenName : 'member_id',ref:'../omember_id',width : 260,
                                     store:Km.Order.Store.memberStore,emptyText: '请选择会员',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',pageSize:Km.Order.Config.PageSize,
                                     displayField:'username',/*显示文本*/valueField:'member_id',/*getValue获得的参数*/
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                                '<tpl for="."><div class="search-item">',
                                                    '<h3>{username}</h3>',
                                                '</div></tpl>'
                                     )
                                },'&nbsp;&nbsp;',
                                '订单号 ','&nbsp;&nbsp;',
                                {ref: '../order_no',xtype : 'textfield',value:''},
                                {ref: '../ostatus_title',xtype : 'displayfield',value:'&nbsp;&nbsp;订单状态&nbsp;&nbsp;'},
                                {ref: '../ostatus',xtype : 'combo',mode : 'local',width : 80,
                                    triggerAction : 'all',lazyRender : true,editable: false,
                                    store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['audit', '待审核'],['confirm', '待确认'],['active', '有效'],['finish', '完成'],['dead', '无效']]
                                      }),
                                    valueField : 'value',// 值
                                    displayField : 'text'// 显示文本
                                },
                                {ref: '../opay_status_title',xtype : 'displayfield',value:'&nbsp;&nbsp;支付状态&nbsp;&nbsp;'},
                                {ref: '../opay_status',xtype : 'combo',mode : 'local',width : 100,
                                    triggerAction : 'all',lazyRender : true,editable: false,
                                    store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['0', '准备支付'],['1', '支付成功'],['10', '已收款'],['2', '支付中'],['3', '支付失败'],['4', '取消支付'],['5','全额退款'],['9', '部分退款'],['6', '支付错误'],['7', '非法支付'],['8', '支付超时']]
                                      }),
                                    valueField : 'value',// 值
                                    displayField : 'text'// 显示文本
                                },
                                {ref: '../oship_status_title',xtype : 'displayfield',value:'&nbsp;&nbsp;物流状态&nbsp;&nbsp;'},
                                {ref: '../oship_status',xtype : 'combo',mode : 'local',width : 100,
                                    triggerAction : 'all',lazyRender : true,editable: false,
                                    store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['0', '未发货'],['1', '已发货'],['2', '部分发货'],['3', '部分退货'],['4', '已退货'],['5', '已签收']]
                                      }),
                                    valueField : 'value',// 值
                                    displayField : 'text'// 显示文本
                                },
                                {ref: '../oorder_time',xtype : 'displayfield',value:'&nbsp;&nbsp;下单时间&nbsp;&nbsp;'},
                                {ref: '../order_starttime',xtype : 'datefield',value:''},
                                '&nbsp;到&nbsp;',
                                {ref: '../order_endtime',xtype : 'datefield',value:''},
                                '&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectOrder();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.omember_id.setValue("");
                                        this.topToolbar.ostatus.setValue("");
                                        this.topToolbar.opay_status.setValue("");
                                        this.topToolbar.oship_status.setValue("");
                                        this.topToolbar.order_no.setValue("");
                                        Km.Order.Filter();
                                        this.filter={};
                                        this.doSelectOrder();
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
                                },{
                                    text : '添加订单',iconCls : 'icon-add',ref: '../../btnSave',
                                    handler : function() {
                                        this.addOrder();
                                    }
                                },{
                                    text : '修改订单',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateOrder();
                                    }
                                },{
                                    text : '采购审核',hidden:true, ref: '../../btnCheck',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.purchaserCheck();
                                    }
                                },{
                                    text : '客服确认',hidden:true ,ref: '../../btnKefuConfirm',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.kefuConfirm();
                                    }
                                },{
                                    text : '确认发货',ref: '../../btnSend',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.send();
                                    }
                                },{
                                    text : '确认签收',ref: '../../btnSign',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.sign();
                                    }
                                },{
                                    text : '确认支付',ref: '../../btnSettle',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.settle();
                                    }
                                // },{
                                //     text : '确认退货',ref: '../../btnReturn',iconCls : 'icon-edit',disabled : true,
                                //     handler : function() {
                                //         this.returnGood();
                                //     }
                                // },{
                                //     text : '确认退款',ref: '../../btnRefund',iconCls : 'icon-edit',disabled : true,
                                //     handler : function() {
                                //         this.Refund();
                                //     }
                                },{
                                    text : '订单无效',ref: '../../btnUneffect',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.orderInvalid();
                                    }
                                },{
                                    xtype:'tbsplit',text: '打印',ref:'../../tabPrint',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                        {
                                            text : '打印预览',iconCls : 'icon-edit',scope:this,ref: '../printOrder',
                                            handler : function() {
                                                this.toprintOrder();
                                            }
                                        },
                                        {
                                            text : '打印配送单',iconCls : 'icon-edit',scope:this,ref: '../printDelivery',
                                            handler : function() {
                                                this.toprintDelivery();
                                            }
                                        },
                                        {
                                            text : '打印发票',iconCls : 'icon-edit',scope:this,ref: '../printInvoice',
                                            handler : function() {
                                                this.toprintInvoice();
                                            }
                                        },{
                                            text : '打印快递单',iconCls : 'icon-edit',scope:this,ref: '../printExpress',
                                            handler : function() {
                                                this.toprintExpress();
                                            }
                                        }
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',ref: '../../btnExport',
                                    handler : function() {
                                        this.exportOrder();
                                    }
                                },{
                                    xtype:'tbsplit',text: '查看订单', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showOrder()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideOrder();Km.Order.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Order.Cookie.set('View.IsFix',Km.Order.Config.View.IsFix);}}
                                        ]}
                                }]}
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
            //引用打印下面的menu
            this.printOrder =this.tabPrint.printOrder;
            this.printDelivery =this.tabPrint.printDelivery;
            this.printInvoice =this.tabPrint.printInvoice;
            this.printExpress =this.tabPrint.printExpress;
            //创建在Grid里显示的订单信息Tab页
            Km.Order.View.Running.viewTabs=new Km.Order.View.OrderView.Tabs();
            this.addListener('rowdblclick', this.onRowDoubleClick);
        },
        /**
         * 行选择器
         */
        sm : new Ext.grid.CheckboxSelectionModel({
            //handleMouseDown : Ext.emptyFn,
            listeners : {
                selectionchange:function(sm) {
                    // 判断更新按钮是否可以激活
                    this.grid.btnUpdate.setDisabled(sm.getCount() != 1);
                    this.grid.btnCheck.setDisabled(sm.getCount() != 1);
                    this.grid.btnKefuConfirm.setDisabled(sm.getCount() != 1);
                    this.grid.btnSign.setDisabled(sm.getCount() != 1);
                    this.grid.btnSend.setDisabled(sm.getCount() != 1);
                    this.grid.btnSettle.setDisabled(sm.getCount() != 1);
                    // this.grid.btnReturn.setDisabled(sm.getCount() != 1);
                    // this.grid.btnRefund.setDisabled(sm.getCount() != 1);
                    this.grid.btnUneffect.setDisabled(sm.getCount() != 1);
                    this.grid.tvpView.setDisabled(sm.getCount() != 1);
                    this.grid.tabPrint.setDisabled(sm.getCount() != 1);
                },
                rowselect: function(sm, rowIndex, record) {
                    this.grid.updateViewOrder();
                    if (sm.getCount() != 1){
                        this.grid.hideOrder();
                        Km.Order.Config.View.IsShow=0;
                    }else{
                        if (Km.Order.View.IsSelectView==1){
                            Km.Order.View.IsSelectView=0;
                            this.grid.showOrder();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Order.Config.View.IsShow==1){
                            Km.Order.View.IsSelectView=1;
                        }
                        this.grid.hideOrder();
                        Km.Order.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Order.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showOrder();
                this.tvpView.toggle(true);
            }else{
                this.hideOrder();
                Km.Order.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Order.Config.View.IsFix=1;
            }else{
               Km.Order.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Order.Config.View.IsShow=0;
                return ;
            }
            if (Km.Order.Config.View.IsShow==1){
               this.hideOrder();
               Km.Order.Config.View.IsShow=0;
            }
            this.showOrder();
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
         * 查询符合条件的订单
         */
        doSelectOrder : function() {
            if (this.topToolbar){
                var omember_id   = this.topToolbar.omember_id.getValue();
                var order_no     = this.topToolbar.order_no.getValue();
                var ostatus      = this.topToolbar.ostatus.getValue();
                var opay_status  = this.topToolbar.opay_status.getValue();
                var oship_status = this.topToolbar.oship_status.getValue();
                var order_starttime = this.topToolbar.order_starttime.getValue();
                var order_endtime   = this.topToolbar.order_endtime.getValue();
                var filter = {'member_id':omember_id,'order_no':order_no,'status':ostatus,'pay_status':opay_status,
                              'ship_status':oship_status,'order_starttime':order_starttime,'order_endtime':order_endtime};
                Ext.apply(this.filter,filter);
            }
            var condition = {'start':0,'limit':Km.Order.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceOrder.queryPageOrder(condition,function(provider, response) {
                if (response.result&&response.result.data) {
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
         * 显示订单视图
         * 显示订单的视图相对订单列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Order.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Order.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Order.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Order.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Order.View.Running.viewTabs);
                    break;
            }
            Km.Order.Cookie.set('View.Direction',Km.Order.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Order.Config.View.IsFix==0)&&(Km.Order.Config.View.IsShow==1)){
                    this.showOrder();
                }
                Km.Order.Config.View.IsFix=1;
                Km.Order.View.Running.orderGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Order.Config.View.IsShow=0;
                this.showOrder();
            }
        },
        /**
         * 显示订单
         */
        showOrder : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择订单！');
                Km.Order.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Order.Config.View.IsFix==0){
                if (Km.Order.View.Running.view_window==null){
                    Km.Order.View.Running.view_window=new Km.Order.View.OrderView.Window();
                    Km.Order.Config.FirstShowWindow=true;
                }
                if (Km.Order.View.Running.view_window.hidden){
                    Km.Order.View.Running.view_window.show();
                    Km.Order.View.Running.view_window.winTabs.hideTabStripItem(Km.Order.View.Running.view_window.winTabs.tabFix);
                    this.updateViewOrder();
                    this.tvpView.toggle(true);
                    if (Km.Order.Config.FirstShowWindow){
                      Km.Order.View.Running.view_window.maximize();
                      Km.Order.Config.FirstShowWindow=false;
                    }
                    Km.Order.Config.View.IsShow=1;
                }else{
                    this.hideOrder();
                    Km.Order.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Order.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Order.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Order.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Order.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Order.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Order.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Order.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Order.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Order.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideOrder();
            if (Km.Order.Config.View.IsShow==0){
                Km.Order.View.Running.viewTabs.enableCollapse();
                switch(Km.Order.Config.View.Direction){
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
                this.updateViewOrder();
                this.tvpView.toggle(true);
                Km.Order.Config.View.IsShow=1;
            }else{
                Km.Order.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏订单
         */
        hideOrder : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Order.View.Running.view_window!=null){
                Km.Order.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前订单显示信息
         */
        updateViewOrder : function() {
            Km.Order.View.Running.deliverylogGrid.gridIn.doSelectDeliverylog();
            Km.Order.View.Running.deliverylogGrid.gridOut.doSelectDeliverylog();
            Km.Order.View.Running.orderlogGrid.doSelectOrderlog();
            Km.Order.View.Running.paylogGrid.gridIn.doSelectPaylog();
            Km.Order.View.Running.paylogGrid.gridOut.doSelectPaylog();
            Km.Order.View.Running.orderproductsGrid.doSelectOrdergoods();
            Km.Order.View.Running.kstmSayGrid.doSelectConsult();
            Km.Order.View.Running.invoiceGrid.doSelectInvoice();
            if (Km.Order.View.Running.view_window!=null){
                var tabOrderInfo=Km.Order.View.Running.view_window.winTabs.tabOrderInfo;
                var tabOrderIntro=Km.Order.View.Running.view_window.winTabs.tabOrderIntro;
                if (tabOrderInfo.basic.rendered){
                    tabOrderInfo.infoPanel.onUpdate(tabOrderInfo);
                    //tab页弹出后布局
                    tabOrderInfo.basic.setHeight(330);
                }
                tabOrderIntro.editForm.order_id.setValue(this.getSelectionModel().getSelected().data.order_id);
                tabOrderIntro.editForm.intro.id   = "introWindow";
                tabOrderIntro.editForm.intro.name = "introWindow";
                switch (Km.Order.Config.OnlineEditor)
                {
                    case 1:
                        if (CKEDITOR.instances.introWindow) CKEDITOR.instances.introWindow.setData(this.getSelectionModel().getSelected().data.intro);
                        break;
                    case 2:
                        if (Km.Order.View.OrderIntroPanel.KindEditor_introWindow) Km.Order.View.OrderIntroPanel.KindEditor_introWindow.html(this.getSelectionModel().getSelected().data.intro);
                        break
                    case 3:
                        if (xhEditor_introWindow)xhEditor_introWindow.setSource(this.getSelectionModel().getSelected().data.intro);
                        break
                    default:
                        var ctrl = this;
                        if (ue_introWindow) {
                          ue_introWindow.ready(function(){
                            var intro = ctrl.getSelectionModel().getSelected().data.intro;
                            ue_introWindow.setContent(intro);
                          });
                        }
                }
            }

            var tabOrderInfo=Km.Order.View.Running.viewTabs.tabOrderInfo;
            var tabOrderIntro=Km.Order.View.Running.viewTabs.tabOrderIntro;
            if (tabOrderInfo.basic.rendered){
                tabOrderInfo.infoPanel.onUpdate(tabOrderInfo);
            }
            tabOrderIntro.editForm.order_id.setValue(this.getSelectionModel().getSelected().data.order_id);
            switch (Km.Order.Config.OnlineEditor)
            {
                case 1:
                    if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(this.getSelectionModel().getSelected().data.intro);
                    break
                case 2:
                    if (Km.Order.View.OrderIntroPanel.KindEditor_intro) Km.Order.View.OrderIntroPanel.KindEditor_intro.html(this.getSelectionModel().getSelected().data.intro);
                    break
                case 3:
                    if (xhEditor_intro)xhEditor_intro.setSource(this.getSelectionModel().getSelected().data.intro);
                    break
                default:
                    if (ue_intro)ue_intro.setContent(this.getSelectionModel().getSelected().data.intro);
            }
        },
        /**
         * 新建订单
         */
        addOrder : function() {
            var targeturl="index.php?go=admin.shop.addorder";
            if (parent.Km.Navigation){
                parent.Km.Navigation.addTabByUrl(parent.Ext.getCmp('centerPanel'),'新建订单',targeturl,"addorder");
            }else{
                window.open(targeturl);
            }
        },
        /**
         * 编辑订单时先获得选中的订单信息
         */
        updateOrder : function() {
            if (Km.Order.View.Running.edit_window==null){
                Km.Order.View.Running.edit_window=new Km.Order.View.EditWindow();
            }
            Km.Order.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Order.View.Running.edit_window.show();
        },
        /**
         * 实时在客户端更新订单信息面板
         */
        updateOrderInfo:function(){
            if (Km.Order.View.Running.view_window!=null){
                var tabOrderInfo=Km.Order.View.Running.view_window.winTabs.tabOrderInfo;
                if (tabOrderInfo.basic.rendered){
                    tabOrderInfo.infoPanel.onUpdate(tabOrderInfo);
                }
            }
            var tabOrderInfo=Km.Order.View.Running.viewTabs.tabOrderInfo;
            if (tabOrderInfo.basic.rendered){
                tabOrderInfo.infoPanel.onUpdate(tabOrderInfo);
            }
        },
        /**
         * 提示:确认操作采购审核
         */
        purchaserCheck : function() {
          Ext.MessageBox.show({
               title: '审核订单',
               msg: '备注:',
               width:450,
               buttons: Ext.MessageBox.OKCANCEL,
               multiline: true,
               fn: this.purchaserCheckConfirm,
               animEl: 'mb3',
               scope:this
           });
        },
        /**
         * 采购审核
         */
        purchaserCheckConfirm:function(btn,text){
            if (btn == 'ok') {
                var orders = new Array();
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    orders[flag]=selectedRows[flag].data;
                }
                var checks={"orders":orders,"text":text};
                editorGrid=this;
                ExtServiceOrder.purchaserCheck(checks,function(provider, response) {
                    if (response.result.data) {
                        Ext.Msg.alert('提示', '审核操作成功！');
/*                        for ( var flag = 0; flag < selectedRows.length; flag++) {
                            selectedRows[flag].data.purchaser_man=Km.Order.Config.operator;
                            selectedRows[flag].data.purchaser_memo=text;
                            selectedRows[flag].data.purchasertime=new Date();
                            selectedRows[flag].data.statusShow="待确认";
                        }
                        editorGrid.getView().refresh();
                        editorGrid.updateOrderInfo();*/
                        Km.Order.View.Running.orderGrid.doSelectOrder();
                    } else {
                        Ext.Msg.alert('提示', '审核操作失败，请重试！');
                    }
                });
            }
        },
        /**
         * 提示:客服确认
         */
        kefuConfirm:function(){
          Ext.MessageBox.show({
               title: '客服确认',
               msg: '备注:',
               width:450,
               buttons: Ext.MessageBox.OKCANCEL,
               multiline: true,
               fn: this.kefuConfirmSubmit,
               animEl: 'mb3',
               scope:this
           });
        },
        /**
         * 客服确认
         */
        kefuConfirmSubmit:function(btn,text){
            if (btn == 'ok') {
                var selectedRows    = this.getSelectionModel().getSelections();
                var orders = new Array();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    orders[flag]=selectedRows[flag].data;
                }
                var checks={"orders":orders,"text":text};
                editorGrid=this;
                ExtServiceOrder.kefuConfirm(checks,function(provider, response) {
                    if (response.result.data) {
                        Ext.Msg.alert('提示', '客服确认成功！');
/*                        for ( var flag = 0; flag < selectedRows.length; flag++) {
                            selectedRows[flag].data.kefu_man=Km.Order.Config.operator;
                            selectedRows[flag].data.kefu_memo=text;
                            selectedRows[flag].data.kefutime=new Date();
                            selectedRows[flag].data.statusShow="有效";
                        }
                        editorGrid.getView().refresh();
                        editorGrid.updateOrderInfo();*/
                        Km.Order.View.Running.orderGrid.doSelectOrder();
                    } else {
                        Ext.Msg.alert('提示', '审核操作失败，请重试！');
                    }
                });
            }
        },
        /**
         * 提示:订单无效
         */
        orderInvalid:function(){
            Ext.Msg.confirm('提示', '是否确认将订单设置为无效?', this.confirmOrderInvalid,this);
        },
        /**
         * 订单无效
         */
        confirmOrderInvalid:function(btn){
            if (btn == 'yes') {
                var check_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    check_ids=check_ids+selectedRows[flag].data.order_id+",";
                }
                ExtServiceOrder.orderInvalid(check_ids);
/*                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    selectedRows[flag].data.statusShow="无效";
                }
                this.getView().refresh();
                this.updateOrderInfo();*/
                Km.Order.View.Running.orderGrid.doSelectOrder();
                Ext.Msg.alert("提示", "操作成功,选择的订单已设置成无效！");
            }
        },
        /**
         * 提示:签收
         */
        sign:function(){
            Ext.MessageBox.show({
               title: '签收确认',
               msg: '备注:',
               width:450,
               buttons: Ext.MessageBox.OKCANCEL,
               multiline: true,
               fn: this.signConfirmSubmit,
               animEl: 'mb3',
               scope:this
            });
        },
        /**
         * 签收
         */
        signConfirmSubmit:function(btn,text){
            if (btn == 'ok') {
                var selectedRows = this.getSelectionModel().getSelections();
                var orders = new Array();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    orders[flag]=selectedRows[flag].data;
                }
                var checks={"orders":orders,"text":text};
                editorGrid=this;
                ExtServiceOrder.sign(checks,function(provider, response) {
                    if (response.result.data) {
                        Ext.Msg.alert('提示', '操作成功,已签收选择的订单！');
/*                        for ( var flag = 0; flag < selectedRows.length; flag++) {
                            selectedRows[flag].data.receive_man=Km.Order.Config.operator;
                            selectedRows[flag].data.receive_memo=text;
                            selectedRows[flag].data.receivetime=new Date();
                            selectedRows[flag].data.ship_statusShow="已签收";
                            if(selectedRows[flag].data.pay_statusShow=="已收款"){
                                selectedRows[flag].data.statusShow="完成";
                            }
                        }
                        editorGrid.getView().refresh();
                        editorGrid.updateOrderInfo();*/
                        Km.Order.View.Running.orderGrid.doSelectOrder();
                    } else {
                        Ext.Msg.alert('提示', '签收确认操作失败，请重试！');
                    }
                });
            }
        },
         /**
         * 提示:退货
         */
        returnGood:function(){
            Ext.Msg.confirm('提示', '是否确认选择的订单已退货?', this.returnGoodConfirm,this);
        },
        /**
         * 退货
         */
        returnGoodConfirm:function(btn){
            if (btn == 'yes') {
                var check_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    check_ids=check_ids+selectedRows[flag].data.order_id+",";
                }
                ExtServiceOrder.returnGood(check_ids);
/*                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    selectedRows[flag].data.ship_statusShow="已退货";
                }
                this.getView().refresh();
                this.updateOrderInfo();*/
                Km.Order.View.Running.orderGrid.doSelectOrder();
                Ext.Msg.alert("提示", "操作成功,选择的订单已确认退货！");
            }
        },
        /**
         * 提示:确认支付
         */
        settle:function(){
          Ext.MessageBox.show({
               title: '确认支付',
               msg: '备注:',
               width:450,
               buttons: Ext.MessageBox.OKCANCEL,
               multiline: true,
               fn: this.settleConfrimSubmit,
               animEl: 'mb3',
               scope:this
           });
        },
        /**
         * 确认支付
         */
        settleConfrimSubmit:function(btn,text){
            if (btn == 'ok') {
                var selectedRows = this.getSelectionModel().getSelections();
                var orders = new Array();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    orders[flag]=selectedRows[flag].data;
                }
                var checks={"orders":orders,"text":text};
                editorGrid=this;
                ExtServiceOrder.settle(checks,function(provider, response) {
                    if (response.result.data) {
                        Ext.Msg.alert('提示', '操作成功,选择的订单已确认支付！');
/*                        for ( var flag = 0; flag < selectedRows.length; flag++) {
                            selectedRows[flag].data.account_man=Km.Order.Config.operator;
                            selectedRows[flag].data.account_memo=text;
                            selectedRows[flag].data.accounttime=new Date();
                            selectedRows[flag].data.pay_statusShow="已收款";
                            if(selectedRows[flag].data.ship_statusShow=="已签收"){
                                selectedRows[flag].data.statusShow="完成";
                            }
                        }
                        editorGrid.getView().refresh();
                        editorGrid.updateOrderInfo();*/
                        Km.Order.View.Running.orderGrid.doSelectOrder();
                    } else {
                        Ext.Msg.alert('提示', '确认支付操作失败，请重试！');
                    }
                });
            }
        },
         /**
         * 提示:退款
         */
        Refund:function(){
            Ext.Msg.confirm('提示', '是否确认选择的订单已退款?', this.refundConfirm,this);
        },
        /**
         * 退款
         */
        refundConfirm:function(btn){
            if (btn == 'yes') {
                var check_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    check_ids=check_ids+selectedRows[flag].data.order_id+",";
                }
                ExtServiceOrder.refund(check_ids);
/*                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    selectedRows[flag].data.pay_statusShow="退款";
                }
                this.getView().refresh();
                this.updateOrderInfo();*/
                Km.Order.View.Running.orderGrid.doSelectOrder();
                Ext.Msg.alert("提示", "操作成功,选择的订单已确认退款！");
            }
        },
        /**
         * 打印订单详情
         */
        toprintOrder:function(){
            var order_id=this.getSelectionModel().getSelected().data.order_id;
            var url="index.php?go=kmall.member.order_detail&order_id="+order_id;
            var name="打印预览";
            var data="print_order";
            openPostWindow(url,data,name);
            function openPostWindow(url, data, name){
                 var tempForm = document.createElement("form");
                 tempForm.id="tempForm1";
                 tempForm.method="post";
                 tempForm.action=url;
                 tempForm.target=name;
                 var hideInput = document.createElement("input");
                 hideInput.type="hidden";
                 hideInput.name= "print_order"
                 hideInput.value= data;
                 tempForm.appendChild(hideInput);
                 tempForm.addEventListener("onsubmit",function(){ openWindow(name); });
                 document.body.appendChild(tempForm);
                 tempForm.submit();
                 document.body.removeChild(tempForm);
            }
            function openWindow(name){
                 window.open('about:blank',name,'height=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes');
            }
        },
        /**
         * 打印配送单
         */
        toprintDelivery:function(){
            var order_id=this.getSelectionModel().getSelected().data.order_id;
            window.open("index.php?go=admin.print.delivery&order_id="+order_id);
        },
        /**
         * 打印发票
         */
        toprintInvoice:function(){
            var order_id=this.getSelectionModel().getSelected().data.order_id;
            window.open("index.php?go=admin.print.invoice&order_id="+order_id);
        },
        /**
         * 确认发货
         */
        send:function(){
            var selectOrder=this.getSelectionModel().getSelected().data;
            if (Km.Order.View.Running.edit_window_delivery==null){
              Km.Order.View.Running.edit_window_delivery=new Km.Order.View.DeliveryView.EditWindow();
            }
            var openwindow=Km.Order.View.Running.edit_window_delivery;
            openwindow.order_id.setValue(selectOrder.order_id);
            openwindow.order_no.setValue(selectOrder.order_no);
            openwindow.member_id.setValue(selectOrder.member_id);
            openwindow.deliverytype_id.setValue(selectOrder.ship_type);
            openwindow.deliverytype_name.setValue(selectOrder.name_ship_type);
            ExtServiceDelivery.getDelivery(selectOrder.order_id,function(provider, response) {
                if (response.result.data) {
                    var deliveryInfo       =response.result.data;
                    openwindow.delivery_id.setValue(deliveryInfo.delivery_id);
                    openwindow.delivery_no.setValue(deliveryInfo.delivery_no);
                    openwindow.ship_name.setValue(deliveryInfo.ship_name);
                    openwindow.ship_addr.setValue(deliveryInfo.ship_addr);
                    openwindow.ship_mobile.setValue(deliveryInfo.ship_mobile);
                    openwindow.ship_tel.setValue(deliveryInfo.ship_tel);
                    openwindow.ship_zip.setValue(deliveryInfo.ship_zipcode);
                    openwindow.ship_area.setValue(deliveryInfo.ship_area);
                    openwindow.ship_time.setValue(deliveryInfo.ship_time);
                    openwindow.memo.setValue(deliveryInfo.memo);
                } else {
                    var now=new Date();
                    openwindow.delivery_no.setValue(now.format('YmdHis'));
                    openwindow.ship_name.setValue(selectOrder.ship_name);
                    openwindow.ship_addr.setValue(selectOrder.ship_addr);
                    openwindow.ship_mobile.setValue(selectOrder.ship_mobile);
                    openwindow.ship_tel.setValue(selectOrder.ship_mobile);
                    openwindow.ship_zip.setValue(selectOrder.ship_zipcode);
                    openwindow.ship_time.setValue(selectOrder.ship_time);
                    var ship_area="";
                    if (selectOrder.region_name_country)ship_area=selectOrder.region_name_country+"-";
                    if (selectOrder.region_name_province)ship_area=selectOrder.region_name_province+"-";
                    if (selectOrder.region_name_city)ship_area=ship_area+selectOrder.region_name_city+"-";
                    if (selectOrder.region_name_district)ship_area=ship_area+selectOrder.region_name_district;
                    openwindow.ship_area.setValue(ship_area);
                }
            });
            openwindow.init();
            openwindow.show();
        },
        /**
         * 选择快递单模板
         */
        toprintExpress:function(){
            var selectOrder=this.getSelectionModel().getSelected().data;
            if (Km.Order.View.Running.edit_window_deliverytmp==null){
              Km.Order.View.Running.edit_window_deliverytmp=new Km.Order.View.DeliverytmpView.EditWindow();
            }
            var openwindow=Km.Order.View.Running.edit_window_deliverytmp;
            openwindow.show();
        },
        exportOrder:function(){
            ExtServiceOrder.exportOrder(this.filter,function(provider, response) {
                 window.open(response.result.data);
            });
        },
        /**
         * 隐藏搜索条件
         */
        hiddenfilter:function(){
            //隐藏搜索条件
            Km.Order.View.Running.orderGrid.topToolbar.ostatus.hide();
            Km.Order.View.Running.orderGrid.topToolbar.ostatus_title.hide();
            Km.Order.View.Running.orderGrid.topToolbar.opay_status.hide();
            Km.Order.View.Running.orderGrid.topToolbar.opay_status_title.hide();
            Km.Order.View.Running.orderGrid.topToolbar.oship_status.hide();
            Km.Order.View.Running.orderGrid.topToolbar.oship_status_title.hide();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Order.View.Running.orderGrid=new Km.Order.View.Grid();
            Km.Order.Filter();
            //初始化显示订单列表
            Km.Order.View.Running.orderGrid.doSelectOrder();
            if (Km.Order.Config.View.IsFix==0){
                Km.Order.View.Running.orderGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Order.View.Running.orderGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Order.View.Running.viewTabs]},
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
        orderGrid:null,
        /**
         * 当前收货记录Grid对象
         */
        deliverylogGrid:null,
        /**
         * 当前订单日志Grid对象
         */
        orderlogGrid:null,
        /**
         * 当前收退款记录Grid对象
         */
        paylogGrid:null,
        /**
         * 当前订购商品Grid对象
         */
        orderproductsGrid:null,
        /**
         * 显示订单信息及关联信息列表的Tab页
         */
        viewTabs:null,
        /**
         * 当前的显示窗口
         */
        view_window:null,
        /**
         * 显示订单基本信息
         */
        orderInfoView:null,
        /**
         * 订单备注
         */
        orderIntroPanel:null,
        /**
         * 顾客留言窗口
         */
        kstmSayGrid:null,
        /**
         * 当前创建的顾客留言辑窗口
         */
        consult_window:null,
        /**
         * 当前创建的答复顾客窗口
         */
        reply_window:null,
        /**
         * 发票列表
         */
        invoiceGrid:null,
        /**
         * 当前创建的发票编辑窗口
         */
        editInvoice_window:null,
        /**
         * 快递单编辑窗口
         */
        edit_window_delivery:null
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
        api: {read:ExtServiceOrder.queryPageOrder}
    });
    /**
     * 订单页面布局
     */
    Km.Order.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Order.View.Panel()]
    });
    Ext.Ajax.request({
        url: 'home/admin/src/httpdata/admin_operation.php',
        params:{
            namespace:'order'
        },
        method : 'POST',
        success : function(response) {
            var respText = Ext.util.JSON.decode(response.responseText);
            if(!respText.limit){
                var operation=respText.operation;
                for(name in operation){
                    if(operation[name].length){
                        for(i=0;i<operation[name].length;i++){
                            eval("Km.Order.View.Running."+name+"."+operation[name][i]+".hide()");
                        }
                    }
                }
            }
        },
        failure : function() {

        }
    });
    Km.Order.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
