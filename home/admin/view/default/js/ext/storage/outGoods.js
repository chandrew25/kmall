Ext.namespace("Kmall.Admin.OutGoods");
Km = Kmall.Admin.OutGoods;
Km.OutGoods={
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
             * 显示仓库的视图相对仓库列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示仓库信息页(或者打开新窗口)
             */
            IsFix:0
        },
        /**
         * 操作者
         */
        Operator:''
    },
    /**
     * Cookie设置
     */
    Cookie:new Ext.state.CookieProvider(),
    /**
     * 初始化
     */
    Init:function(){
        if (Km.OutGoods.Cookie.get('View.Direction')){
            Km.OutGoods.Config.View.Direction=Km.OutGoods.Cookie.get('View.Direction');
        }
        if (Km.OutGoods.Cookie.get('View.IsFix')!=null){
            Km.OutGoods.Config.View.IsFix=Km.OutGoods.Cookie.get('View.IsFix');
        }
        if (Ext.util.Cookies.get('operator')!=null){
            Km.OutGoods.Config.View.Operator=Ext.util.Cookies.get('operator');
        }
        if (Ext.util.Cookies.get('roletype')!=null){
            Km.OutGoods.Config.Roletype=Ext.util.Cookies.get('roletype');
        }
        if (Ext.util.Cookies.get('roleid')!=null){
            Km.OutGoods.Config.Roleid=Ext.util.Cookies.get('roleid');
        }
    }
};

/**
 * Model:数据模型
 */
Km.OutGoods.Store = {
    /**
     * 产品出入库日志
     */
    goodslogStore:new Ext.data.Store({
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
                  {name: 'goodsActionType',type: 'string'},
                  {name: 'goods_id',type: 'int'},
                  {name: 'goods_name',type: 'string'},
                  {name: 'price',type: 'float'},
                  {name: 'num',type: 'int'},
                  {name: 'operator',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        })
    }),
    /**
     * 产品
     */
    goodsStore : new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            root:"goods",
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'goods_id'
          }, [
              {name: 'goods_id', mapping: 'goods_id'},
              {name: 'goods_name', mapping: 'goods_name'},
              {name: 'goods_code',type: 'string'},
              {name: 'sales_price',type: 'float'}
        ]),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if ((Km.OutGoods.Config.Roletype==4)||(Km.OutGoods.Config.Roletype==5)){
                        Ext.apply(options.params, {"supplier_id":Km.OutGoods.Config.Roleid});//保证分页也将查询条件带上
                    }
                    if (Ext.getCmp("goods_code").getValue()){
                        this.baseParams.goods_code = Ext.getCmp("goods_code").getValue();
                        this.baseParams.query = "";
                    }else{
                        this.baseParams.goods_code = Ext.getCmp("goods_code").getValue();
                    }
                }
            }
        }
    })
};
/**
 * View:产品入库显示组件
 */
Km.OutGoods.View={
    /**
     * Tab页面:产品出库
     */
    TabUpdateGoods:Ext.extend(Ext.Panel,{
        constructor : function(config){
            config = Ext.apply({
                ref:'updateGoodsLogPanel',title:'商品出库',xtype:"panel",
                items: [
                    {
                     ref:'updateGoodsLogForm',xtype: 'form',layout:'form',border : false,width:556,
                     defaultType: 'textfield',defaults: {anchor:'98%'},api : {},
                     items: [
                        {xtype: 'hidden',name : 'operate_type',value:'update'},
                        {xtype: 'hidden',name : 'goods_id',id:'goods_id',ref:'goods_id'},
                        {
                         fieldLabel : '选择商品',xtype: 'combo',name : 'goods_name',ref:'goods_name',id : 'goods_name',
                         store:Km.OutGoods.Store.goodsStore,emptyText: '请选择商品',itemSelector: 'div.search-item',
                         loadingText: '查询中...',width: 570, pageSize:Km.OutGoods.Config.PageSize,displayField:'goods_name',// 显示文本
                         mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                         forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                         tpl:new Ext.XTemplate(
                            '<tpl for="."><div class="search-item">',
                                '<h3>{goods_name}</h3>',
                            '</div></tpl>'
                         ),
                         onSelect:function(record,index){
                             if(this.fireEvent('beforeselect', this, record, index) !== false){
                                Ext.getCmp("goods_id").setValue(record.data.goods_id);
                                Ext.getCmp("goods_name").setValue(record.data.goods_name);
                                Ext.getCmp("goods_code").setValue(record.data.goods_code);
                                Ext.getCmp("price").setValue(record.data.sales_price);
                                this.collapse();
                             }
                         }
                        },
                        {
                         fieldLabel : '商品条码(<font color=red>*</font>)',xtype: 'combo',name : 'goods_code',ref:'goods_code',id : 'goods_code',
                         store:Km.OutGoods.Store.goodsStore,emptyText: '请选择商品条码',itemSelector: 'div.search-item',
                         loadingText: '查询中...',width: 570, pageSize:Km.OutGoods.Config.PageSize,displayField:'goods_code',// 显示文本
                         mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                         forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                         tpl:new Ext.XTemplate(
                            '<tpl for="."><div class="search-item">',
                                '<h3>{goods_code}</h3>',
                            '</div></tpl>'
                         ),
                         onSelect:function(record,index){
                             if(this.fireEvent('beforeselect', this, record, index) !== false){
                                Ext.getCmp("goods_id").setValue(record.data.goods_id);
                                Ext.getCmp("goods_name").setValue(record.data.goods_name);
                                Ext.getCmp("goods_code").setValue(record.data.goods_code);
                                Ext.getCmp("price").setValue(record.data.sales_price);
                                this.collapse();
                             }
                         }
                        },
                        {fieldLabel: '数量',name: 'num',xtype:'numberfield',id: 'out_num'},
                        {fieldLabel: '商品单价',name: 'price',xtype:'numberfield',id:"price",ref:'price'},
                        {fieldLabel: '经办人',name: 'operator',value:Km.OutGoods.Config.View.Operator,id: 'operator_name'}
                        ]
                    }
                ]
            }, config);
            Km.OutGoods.View.TabUpdateGoods.superclass.constructor.call(this, config);
            if (Km.OutGoods.Config.Roletype=='5'){
                this.updateGoodsLogForm.sp_name.hide();
            }
            if (Km.OutGoods.Config.Roletype=='4'){
                this.updateGoodsLogForm.sp_name.setValue('菲生活');
                this.updateGoodsLogForm.supplier_id.setValue('1');
            }
        }
    }),
    /**
     * 产品出库管理
     */
    MainPanel:Ext.extend(Ext.Panel,{
        constructor : function(config){
            Km.OutGoods.View.Running.tabUpdateGoods=new Km.OutGoods.View.TabUpdateGoods();
            config = Ext.apply({
                ref:'editForm',labelAlign: 'left',title: '商品入库',header:false,bodyStyle:'padding:5px;',buttonAlign:'center',border:false,layout:'hbox', layoutConfig: { padding:'5', pack:'center', align:'middle'},//layout:'fit',
                items: [{
                    ref:'agtabs',xtype:'tabpanel',scope:this,plain:true,activeTab: 0,width:600,height:316,deferredRender: false,
                    defaults:{bodyStyle:'padding:8px;'},
                    items:[
                        Km.OutGoods.View.Running.tabUpdateGoods
                    ]
                }],
                buttons: [
                    {text: '确认出库',iconCls : 'icon-add',scope:this,
                     handler : function() {
                        this.addGoods();
                     }},
                    {text: '重新填写',ref:'../resetBtn',scope:this,
                        handler : function() {
                            this.agtabs.updateGoodsLogPanel.updateGoodsLogForm.form.reset();
                        }
                    }
                ]
            }, config);
            Km.OutGoods.View.MainPanel.superclass.constructor.call(this, config);
        },
        /**
         * 新建产品
         */
        addGoods : function() {
            var editForm=this.agtabs.updateGoodsLogPanel.updateGoodsLogForm;
            if (!editForm.getForm().isValid()) {
                return;
            }
            if(Ext.getCmp("goods_code").getValue() == "" || Ext.getCmp("goods_code").getValue() == null){
                Ext.Msg.alert("提示", "请选择一个商品！");
                return;
            }
            if(Ext.getCmp("out_num").getValue() == "" || Ext.getCmp("out_num").getValue() == null)
            {
                Ext.Msg.alert("提示", "请填写数量！");
                return;
            }
            if(Ext.getCmp("price").getValue() == "" || Ext.getCmp("price").getValue() == null)
            {
                Ext.Msg.alert("提示", "商品单价不能为空！");
                return;
            }
            if(Ext.getCmp("operator_name").getValue() == "" || Ext.getCmp("operator_name").getValue() == null)
            {
                Ext.Msg.alert("提示", "经办人名称不能为空！");
                return;
            }
            editForm.api.submit=ExtServiceWarehouseGoods.outGoodsFromWarehouse;
            editForm.getForm().submit({
                success : function(form, action) {
                    Ext.Msg.alert("提示", "商品出库成功！");
                    form.reset();
                },
                failure : function(form, action) {
                    if (action.result.msg){
                        Ext.Msg.alert('提示', action.result.msg);
                    }else{
                        Ext.Msg.alert('提示', '商品入库失败');
                    }
                }
            });
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前Tab页面：新产品入库
         */
        tabUpdateGoods:null,
        /**
         * 当前产品出库整个页面(全屏)
         */
        MainPanel:null
    }
};


/**
 * Controller:主程序
 */
Ext.onReady(function() {
    Ext.QuickTips.init();
    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.OutGoods.Init();
    Ext.getBody().setStyle('margin','5px');
    Km.OutGoods.Store.goodsStore.proxy=new Ext.data.HttpProxy({
        url: 'home/admin/src/httpdata/goods.php'
    });
    delete Km.OutGoods.Store.goodsStore.reader.extractorFunctions;
    Km.OutGoods.Store.goodsStore.reader.buildExtractors();

    new Km.OutGoods.View.MainPanel({renderTo:Ext.getBody()});
    setTimeout(function() {
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove : true
        });
    }, 250);
});
