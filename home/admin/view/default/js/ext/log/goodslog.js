Ext.namespace("Kmall.Admin.Goodslog");
Km = Kmall.Admin.Goodslog;
Km.Goodslog={
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
             * 显示产品出入库日志的视图相对产品出入库日志列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示产品出入库日志信息页(或者打开新窗口)
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
        if (Km.Goodslog.Cookie.get('View.Direction')){
            Km.Goodslog.Config.View.Direction=Km.Goodslog.Cookie.get('View.Direction');
        }
        if (Km.Goodslog.Cookie.get('View.IsFix')!=null){
            Km.Goodslog.Config.View.IsFix=Km.Goodslog.Cookie.get('View.IsFix');
        }
    }
};
/**
 * Model:数据模型
 */
Km.Goodslog.Store = {
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
                  {name: 'fsp_warehouse',type: 'int'},
                  {name: 'fsp_warehouse_name',type: 'string'},
                  {name: 'tsp_id',type: 'int'},
                  {name: 'sp_name_tsp',type: 'string'},
                  {name: 'tsp_warehouse',type: 'int'},
                  {name: 'tsp_warehouse_name',type: 'string'},
                  {name: 'goodsActionType',type: 'string'},
                  {name: 'goodsActionTypeShow',type: 'string'},
                  {name: 'goods_id',type: 'int'},
                  {name: 'goods_name',type: 'string'},
                  {name: 'price',type: 'float'},
                  {name: 'num',type: 'int'},
                  {name: 'admin_id',type: 'string'},
                  {name: 'operator',type: 'string'},
                  {name: 'cmTime',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    Ext.apply(options.params, Km.Goodslog.View.Running.goodslogGrid.filter);//保证分页也将查询条件带上
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
     * 产品
     */
    goodsStore : new Ext.data.Store({
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
              {name: 'goods_name', mapping: 'goods_name'}
        ])
    })
};
/**
 * View:产品出入库日志显示组件
 */
Km.Goodslog.View={
    /**
     * 显示产品出入库日志详情
     */
    GoodslogView:{
        /**
         * Tab页：容器包含显示与产品出入库日志所有相关的信息
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
                                if (Km.Goodslog.View.Running.goodslogGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择商品出入库日志！');
                                    return false;
                                }
                                Km.Goodslog.Config.View.IsShow=1;
                                Km.Goodslog.View.Running.goodslogGrid.showGoodslog();
                                Km.Goodslog.View.Running.goodslogGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Goodslog.View.GoodslogView.Tabs.superclass.constructor.call(this, config);

                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Goodslog.Config.View.Direction==1)||(Km.Goodslog.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabGoodslogDetail',iconCls:'tabs',
                     tpl: [
                      '<table class="viewdoblock">',
/*                         '<tr class="entry"><td class="head">源供应商</td><td class="content">{sp_name_fsp}</td></tr>',
                         '<tr class="entry"><td class="head">目标供应商</td><td class="content">{sp_name_tsp}</td></tr>',*/
                         '<tr class="entry"><td class="head">行为</td><td class="content">{goodsActionTypeShow}</td></tr>',
                         '<tr class="entry"><td class="head">商品</td><td class="content">{goods_name}</td></tr>',
                         '<tr class="entry"><td class="head">价格</td><td class="content">{price}</td></tr>',
                         '<tr class="entry"><td class="head">数量</td><td class="content">{num}</td></tr>',
                         '<tr class="entry"><td class="head">操作时间</td><td class="content">{cmTime:date("Y-m-d")}</td></tr>',
                         '<tr class="entry"><td class="head">经办人</td><td class="content"><a style="cursor:pointer;" onclick="Km.Goodslog.Function.openLinkAdmin({admin_id});">{operator}</a></td></tr>',
                     '</table>'
                     ]
                    }
                );
            }
        }),
        /**
         * 窗口:显示产品出入库日志信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看商品出入库日志",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Goodslog.View.GoodslogView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Goodslog.Config.View.IsShow=0;
                            Km.Goodslog.View.Running.goodslogGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Goodslog.Config.View.IsShow=0;
                            Km.Goodslog.View.Running.goodslogGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: []
                }, config);
                Km.Goodslog.View.GoodslogView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 视图：产品出入库日志列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Goodslog.Store.goodslogStore,
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
                          /*{header : '源供应商',dataIndex : 'sp_name_fsp'},
                          {header : '目标供应商',dataIndex : 'sp_name_tsp'},*/
                          {header : '行为',dataIndex : 'goodsActionTypeShow'},
                          {header : '商品',dataIndex : 'goods_name', width:450},
                          {header : '价格',dataIndex : 'price'},
                          {header : '数量',dataIndex : 'num'},
                          {header : '操作时间',dataIndex : 'cmTime',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i')},
                          {header : '经办人',dataIndex : 'operator'}
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
/*                                '供应商 ','&nbsp;&nbsp;',{ref: '../gfsp_id',xtype:'hidden',name : 'fsp_id',id:'gfsp_id'},
                                {
                                     xtype: 'combo',name : 'sp_name_fsp_id',id : 'gsp_name_fsp_id',
                                     store:Km.Goodslog.Store.supplierStore,emptyText: '请选择供应商',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width:262,pageSize:Km.Goodslog.Config.PageSize,
                                     displayField:'sp_name',// 显示文本
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                                '<tpl for="."><div class="search-item">',
                                                    '<h3>{sp_name}</h3>',
                                                '</div></tpl>'
                                     ),
                                     onSelect:function(record,index){
                                         if(this.fireEvent('beforeselect', this, record, index) !== false){
                                            Ext.getCmp("gfsp_id").setValue(record.data.supplier_id);
                                            Ext.getCmp("gsp_name_fsp_id").setValue(record.data.sp_name);
                                            this.collapse();
                                         }
                                     }
                                },'&nbsp;&nbsp;',*/
                                '行为 ','&nbsp;',{ref: '../ggoodsActionType',xtype : 'combo',mode : 'local',
                                    triggerAction : 'all',lazyRender : true,editable: false,width:140,
                                    store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['0', '新商品入库'],['1', '已有商品入库'],['2', '出库']]
                                      }),
                                    valueField : 'value',// 值
                                    displayField : 'text'// 显示文本
                                },'&nbsp;&nbsp;',
                                '商品 ','&nbsp;',{ref: '../ggoods_id',xtype:'hidden',name : 'goods_id',id:'ggoods_id'},
                                {
                                     xtype: 'combo',name : 'goods_name',id : 'ggname',
                                     store:Km.Goodslog.Store.goodsStore,emptyText: '请选择商品',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width:262,pageSize:Km.Goodslog.Config.PageSize,
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
                                            Ext.getCmp("ggname").setValue(record.data.goods_name);
                                            this.collapse();
                                         }
                                     }
                                },'&nbsp;',
                                '经办人 ','&nbsp;',{ref: '../goperator'},'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectGoodslog();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        //this.topToolbar.gfsp_id.setValue("");
                                        this.topToolbar.ggoodsActionType.setValue("");
                                        this.topToolbar.ggoods_id.setValue("");
                                        this.topToolbar.goperator.setValue("");
                                        this.filter={};
                                        this.doSelectGoodslog();
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
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportGoodslog();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看商品出入库日志', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showGoodslog()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideGoodslog();Km.Goodslog.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Goodslog.Cookie.set('View.IsFix',Km.Goodslog.Config.View.IsFix);}}
                                        ]}
                                },'-']}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Goodslog.Config.PageSize,
                    store: Km.Goodslog.Store.goodslogStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:
                    {
                        change:function(thisbar,pagedata){
                            if (Km.Goodslog.Viewport){
                                if (Km.Goodslog.Config.View.IsShow==1){
                                    Km.Goodslog.View.IsSelectView=1;
                                }
                                this.ownerCt.hideGoodslog();
                                Km.Goodslog.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Goodslog.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Goodslog.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Goodslog.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectGoodslog();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Goodslog.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Goodslog.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectGoodslog();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示产品出入库日志列表
            this.doSelectGoodslog();
            Km.Goodslog.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的产品出入库日志信息Tab页
            Km.Goodslog.View.Running.viewTabs=new Km.Goodslog.View.GoodslogView.Tabs();
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
                    this.grid.tvpView.setDisabled(sm.getCount() != 1);
                },
                rowselect: function(sm, rowIndex, record) {
                    this.grid.updateViewGoodslog();
                    if (sm.getCount() != 1){
                        this.grid.hideGoodslog();
                        Km.Goodslog.Config.View.IsShow=0;
                    }else{
                        if (Km.Goodslog.View.IsSelectView==1){
                            Km.Goodslog.View.IsSelectView=0;
                            this.grid.showGoodslog();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Goodslog.Config.View.IsShow==1){
                            Km.Goodslog.View.IsSelectView=1;
                        }
                        this.grid.hideGoodslog();
                        Km.Goodslog.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Goodslog.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showGoodslog();
                this.tvpView.toggle(true);
            }else{
                this.hideGoodslog();
                Km.Goodslog.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Goodslog.Config.View.IsFix=1;
            }else{
               Km.Goodslog.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Goodslog.Config.View.IsShow=0;
                return ;
            }
            if (Km.Goodslog.Config.View.IsShow==1){
               this.hideGoodslog();
               Km.Goodslog.Config.View.IsShow=0;
            }
            this.showGoodslog();
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
         * 查询符合条件的产品出入库日志
         */
        doSelectGoodslog : function() {
            if (this.topToolbar){
                //var gfsp_id = this.topToolbar.gfsp_id.getValue();
                var ggoodsActionType = this.topToolbar.ggoodsActionType.getValue();
                var ggoods_id = this.topToolbar.ggoods_id.getValue();
                var goperator = this.topToolbar.goperator.getValue();
                this.filter       ={/*'fsp_id':gfsp_id,*/'goodsActionType':ggoodsActionType,'goods_id':ggoods_id,'operator':goperator};
            }
            var condition = {'start':0,'limit':Km.Goodslog.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceGoodslog.queryPageGoodslog(condition,function(provider, response) {
                if (response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Goodslog.Store.goodslogStore.loadData(result);
                } else {
                    Km.Goodslog.Store.goodslogStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的商品出入库日志！');
                }
            });
        },
        /**
         * 显示产品出入库日志视图
         * 显示产品出入库日志的视图相对产品出入库日志列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Goodslog.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Goodslog.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Goodslog.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Goodslog.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Goodslog.View.Running.viewTabs);
                    break;
            }
            Km.Goodslog.Cookie.set('View.Direction',Km.Goodslog.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Goodslog.Config.View.IsFix==0)&&(Km.Goodslog.Config.View.IsShow==1)){
                    this.showGoodslog();
                }
                Km.Goodslog.Config.View.IsFix=1;
                Km.Goodslog.View.Running.goodslogGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Goodslog.Config.View.IsShow=0;
                this.showGoodslog();
            }
        },
        /**
         * 显示产品出入库日志
         */
        showGoodslog : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择商品出入库日志！');
                Km.Goodslog.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Goodslog.Config.View.IsFix==0){
                if (Km.Goodslog.View.Running.view_window==null){
                    Km.Goodslog.View.Running.view_window=new Km.Goodslog.View.GoodslogView.Window();
                }
                if (Km.Goodslog.View.Running.view_window.hidden){
                    Km.Goodslog.View.Running.view_window.show();
                    Km.Goodslog.View.Running.view_window.winTabs.hideTabStripItem(Km.Goodslog.View.Running.view_window.winTabs.tabFix);
                    this.updateViewGoodslog();
                    this.tvpView.toggle(true);
                    Km.Goodslog.Config.View.IsShow=1;
                }else{
                    this.hideGoodslog();
                    Km.Goodslog.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Goodslog.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Goodslog.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Goodslog.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Goodslog.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Goodslog.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Goodslog.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Goodslog.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Goodslog.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Goodslog.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideProductlog();
            if (Km.Goodslog.Config.View.IsShow==0){
                Km.Goodslog.View.Running.viewTabs.enableCollapse();
                switch(Km.Goodslog.Config.View.Direction){
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
                this.updateViewGoodslog();
                this.tvpView.toggle(true);
                Km.Goodslog.Config.View.IsShow=1;
            }else{
                Km.Goodslog.Config.View.IsShow=0;
            }

            this.ownerCt.doLayout();
        },
        /**
         * 隐藏产品出入库日志
         */
        hideGoodslog : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Goodslog.View.Running.view_window!=null){
                Km.Goodslog.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前产品出入库日志显示信息
         */
        updateViewGoodslog : function() {
            if (Km.Goodslog.View.Running.view_window!=null){
                Km.Goodslog.View.Running.view_window.winTabs.tabGoodslogDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Goodslog.View.Running.viewTabs.tabGoodslogDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 导出产品出入库日志
         */
        exportGoodslog : function() {
            ExtServiceGoodslog.exportGoodslog(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Goodslog.View.Running.goodslogGrid=new Km.Goodslog.View.Grid();
            if (Km.Goodslog.Config.View.IsFix==0){
                Km.Goodslog.View.Running.goodslogGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Goodslog.View.Running.goodslogGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Goodslog.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Goodslog.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前产品出入库日志Grid对象
         */
        goodslogGrid:null,
        /**
         * 显示产品出入库日志信息及关联信息列表的Tab页
         */
        viewTabs:null,
        /**
         * 当前的显示窗口
         */
        view_window:null
    }
};

Km.Goodslog.Function={
    openLinkAdmin:function(admin_id){
        var targeturl="index.php?go=admin.view.admin&admin_id="+admin_id;
        if (parent.Km.Navigation){
            parent.Km.Layout.Function.OpenWindow(targeturl);
        }else{
            window.open(targeturl);
        }
    }
}

/**
 * Controller:主程序
 */
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.state.Manager.setProvider(Km.Goodslog.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Goodslog.Init();
    /**
     * 产品出入库日志数据模型获取数据Direct调用
     */
    Km.Goodslog.Store.goodslogStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceGoodslog.queryPageGoodslog}
    });
    /**
     * 产品出入库日志页面布局
     */
    Km.Goodslog.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Goodslog.View.Panel()]
    });
    Km.Goodslog.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});