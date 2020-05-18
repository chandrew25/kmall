Ext.namespace("Kmall.Admin.Orderlog");
Km = Kmall.Admin.Orderlog;
Km.Orderlog={
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
             * 显示订单日志的视图相对订单日志列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示订单日志信息页(或者打开新窗口)
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
        if (Km.Orderlog.Cookie.get('View.Direction')){
            Km.Orderlog.Config.View.Direction=Km.Orderlog.Cookie.get('View.Direction');
        }
        if (Km.Orderlog.Cookie.get('View.IsFix')!=null){
            Km.Orderlog.Config.View.IsFix=Km.Orderlog.Cookie.get('View.IsFix');
        }
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.Orderlog.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }
    }
};
/**
 * Model:数据模型
 */
Km.Orderlog.Store = {
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
                  {name: 'intro',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    Ext.apply(options.params, Km.Orderlog.View.Running.orderlogGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 订单
     */
    orderStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/order.php'
          }),
        reader: new Ext.data.JsonReader({
            root: 'orders',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'order_id'
          }, [
              {name: 'order_id', mapping: 'order_id'},
              {name: 'order_no', mapping: 'order_no'}
        ])
    })
};
/**
 * View:订单日志显示组件
 */
Km.Orderlog.View={
    /**
     * 编辑窗口：新建或者修改订单日志
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
                        switch (Km.Orderlog.Config.OnlineEditor)
                        {
                            case 2:
                                Km.Orderlog.View.EditWindow.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
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
                            xtype : 'displayfield',anchor:'98%'
                        },
                        items : [
                              {xtype: 'hidden',  name : 'orderlog_id',ref:'../orderlog_id'},
                              {fieldLabel : '订单号',name : 'order_no',ref : '../order_no'},
                              {fieldLabel : '备注说明',name : 'intro',xtype : 'textarea',id:'intro',ref:'intro'}
                        ]
                    })
                ],
                buttons : [ {
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {
                        switch (Km.Orderlog.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Orderlog.View.EditWindow.KindEditor_intro)this.editForm.intro.setValue(Km.Orderlog.View.EditWindow.KindEditor_intro.html());
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
                            this.editForm.api.submit=ExtServiceOrderlog.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Orderlog.View.Running.orderlogGrid.doSelectOrderlog();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceOrderlog.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Orderlog.View.Running.orderlogGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Orderlog.View.Running.orderlogGrid.getSelectionModel().getSelected());
                        switch (Km.Orderlog.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Orderlog.View.EditWindow.KindEditor_intro) Km.Orderlog.View.EditWindow.KindEditor_intro.html(Km.Orderlog.View.Running.orderlogGrid.getSelectionModel().getSelected().data.intro);
                                break
                            case 3:
                                break
                            default:
                                if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(Km.Orderlog.View.Running.orderlogGrid.getSelectionModel().getSelected().data.intro);
                        }

                    }
                }]
            }, config);
            Km.Orderlog.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示订单日志详情
     */
    OrderlogView:{
        /**
         * Tab页：容器包含显示与订单日志所有相关的信息
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
                                if (Km.Orderlog.View.Running.orderlogGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择订单日志！');
                                    return false;
                                }
                                Km.Orderlog.Config.View.IsShow=1;
                                Km.Orderlog.View.Running.orderlogGrid.showOrderlog();
                                Km.Orderlog.View.Running.orderlogGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Orderlog.View.OrderlogView.Tabs.superclass.constructor.call(this, config);

                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Orderlog.Config.View.Direction==1)||(Km.Orderlog.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabOrderlogDetail',iconCls:'tabs',
                     tpl: [
                      '<table class="viewdoblock">',
                         '<tr class="entry"><td class="head">订单号</td><td class="content">{order_no}</td></tr>',
                         '<tr class="entry"><td class="head">物流单号</td><td class="content">{delivery_no}</td></tr>',
                         '<tr class="entry"><td class="head">操作人员</td><td class="content">{operater}</td></tr>',
                         '<tr class="entry"><td class="head">订单行为</td><td class="content">{orderActionShow}</td></tr>',
                         '<tr class="entry"><td class="head">结果</td><td class="content">{resultShow}</td></tr>',
                         '<tr class="entry"><td class="head">备注说明</td><td class="content">{intro}</td></tr>',
                     '</table>'
                     ]
                    }
                );
            }
        }),
        /**
         * 窗口:显示订单日志信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看订单日志",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Orderlog.View.OrderlogView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Orderlog.Config.View.IsShow=0;
                            Km.Orderlog.View.Running.orderlogGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Orderlog.Config.View.IsShow=0;
                            Km.Orderlog.View.Running.orderlogGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Orderlog.View.Running.orderlogGrid.addOrderlog();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Orderlog.View.Running.orderlogGrid.updateOrderlog();}
                    }]
                }, config);
                Km.Orderlog.View.OrderlogView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 视图：订单日志列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Orderlog.Store.orderlogStore,
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
                          {header : '订单号',dataIndex : 'order_no'},
                          {header : '物流单号',dataIndex : 'delivery_no'},
                          {header : '操作人员',dataIndex : 'operater'},
                          {header : '订单行为',dataIndex : 'orderActionShow'},
                          {header : '结果',dataIndex : 'resultShow'},
                          {header : '备注说明',dataIndex : 'intro',width:300}
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
                                '订单号 ','&nbsp;&nbsp;',{ref: '../oorder_no'},'&nbsp;&nbsp;',
                                '订单行为 ','&nbsp;&nbsp;',{ref: '../oorderAction',xtype : 'combo',mode : 'local',
                                    triggerAction : 'all',lazyRender : true,editable: false,
                                    store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['1', '生效'],['2', '确认'],['3', '完成'],['4', '无效'],['5', '发货'],['6', '收款']]
                                      }),
                                    valueField : 'value',// 值
                                    displayField : 'text'// 显示文本
                                },'&nbsp;&nbsp;',
                                '结果 ','&nbsp;&nbsp;',{ref: '../oresult',xtype : 'combo',mode : 'local',
                                    triggerAction : 'all',lazyRender : true,editable: false,
                                    store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['succ', '成功'],['proc', '处理中'],['fail', '失败']]
                                      }),
                                    valueField : 'value',// 值
                                    displayField : 'text'// 显示文本
                                },'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectOrderlog();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.oorder_no.setValue("");
                                        this.topToolbar.oorderAction.setValue("");
                                        this.topToolbar.oresult.setValue("");
                                        this.filter={};
                                        this.doSelectOrderlog();
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
									text : '添加备注',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateOrderlog();
									}
								},'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportOrderlog();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看订单日志', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showOrderlog()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideOrderlog();Km.Orderlog.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Orderlog.Cookie.set('View.IsFix',Km.Orderlog.Config.View.IsFix);}}
                                        ]}
                                },'-']}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Orderlog.Config.PageSize,
                    store: Km.Orderlog.Store.orderlogStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Orderlog.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Orderlog.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Orderlog.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectOrderlog();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Orderlog.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Orderlog.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectOrderlog();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示订单日志列表
            this.doSelectOrderlog();
            Km.Orderlog.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的订单日志信息Tab页
            Km.Orderlog.View.Running.viewTabs=new Km.Orderlog.View.OrderlogView.Tabs();
            this.addListener('rowdblclick', this.onRowDoubleClick);
        },
        /**
         * 行选择器
         */
        sm : new Ext.grid.CheckboxSelectionModel({
            //handleMouseDown : Ext.emptyFn,
            listeners : {
                selectionchange:function(sm) {
					this.grid.btnUpdate.setDisabled(sm.getCount() != 1);
                    this.grid.tvpView.setDisabled(sm.getCount() != 1);
                },
                rowselect: function(sm, rowIndex, record) {
                    this.grid.updateViewOrderlog();
                    if (sm.getCount() != 1){
                        this.grid.hideOrderlog();
                        Km.Orderlog.Config.View.IsShow=0;
                    }else{
                        if (Km.Orderlog.View.IsSelectView==1){
                            Km.Orderlog.View.IsSelectView=0;
                            this.grid.showOrderlog();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Orderlog.Config.View.IsShow==1){
                            Km.Orderlog.View.IsSelectView=1;
                        }
                        this.grid.hideOrderlog();
                        Km.Orderlog.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Orderlog.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showOrderlog();
                this.tvpView.toggle(true);
            }else{
                this.hideOrderlog();
                Km.Orderlog.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Orderlog.Config.View.IsFix=1;
            }else{
               Km.Orderlog.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Orderlog.Config.View.IsShow=0;
                return ;
            }
            if (Km.Orderlog.Config.View.IsShow==1){
               this.hideOrderlog();
               Km.Orderlog.Config.View.IsShow=0;
            }
            this.showOrderlog();
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
         * 查询符合条件的订单日志
         */
        doSelectOrderlog : function() {
            if (this.topToolbar){
                var oorder_no = this.topToolbar.oorder_no.getValue();
                var oorderAction = this.topToolbar.oorderAction.getValue();
                var oresult = this.topToolbar.oresult.getValue();
                this.filter       ={'order_no':oorder_no,'orderAction':oorderAction,'result':oresult};
            }
            var condition = {'start':0,'limit':Km.Orderlog.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceOrderlog.queryPageOrderlog(condition,function(provider, response) {
                if (response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Orderlog.Store.orderlogStore.loadData(result);
                } else {
                    Km.Orderlog.Store.orderlogStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的订单日志！');
                }
            });
        },
        /**
         * 显示订单日志视图
         * 显示订单日志的视图相对订单日志列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Orderlog.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Orderlog.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Orderlog.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Orderlog.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Orderlog.View.Running.viewTabs);
                    break;
            }
            Km.Orderlog.Cookie.set('View.Direction',Km.Orderlog.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Orderlog.Config.View.IsFix==0)&&(Km.Orderlog.Config.View.IsShow==1)){
                    this.showOrderlog();
                }
                Km.Orderlog.Config.View.IsFix=1;
                Km.Orderlog.View.Running.orderlogGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Orderlog.Config.View.IsShow=0;
                this.showOrderlog();
            }
        },
        /**
         * 显示订单日志
         */
        showOrderlog : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择订单日志！');
                Km.Orderlog.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Orderlog.Config.View.IsFix==0){
                if (Km.Orderlog.View.Running.view_window==null){
                    Km.Orderlog.View.Running.view_window=new Km.Orderlog.View.OrderlogView.Window();
                }
                if (Km.Orderlog.View.Running.view_window.hidden){
                    Km.Orderlog.View.Running.view_window.show();
                    Km.Orderlog.View.Running.view_window.winTabs.hideTabStripItem(Km.Orderlog.View.Running.view_window.winTabs.tabFix);
                    this.updateViewOrderlog();
                    this.tvpView.toggle(true);
                    Km.Orderlog.Config.View.IsShow=1;
                }else{
                    this.hideOrderlog();
                    Km.Orderlog.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Orderlog.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Orderlog.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Orderlog.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Orderlog.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Orderlog.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Orderlog.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Orderlog.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Orderlog.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Orderlog.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideOrderlog();
            if (Km.Orderlog.Config.View.IsShow==0){
                Km.Orderlog.View.Running.viewTabs.enableCollapse();
                switch(Km.Orderlog.Config.View.Direction){
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
                this.updateViewOrderlog();
                this.tvpView.toggle(true);
                Km.Orderlog.Config.View.IsShow=1;
            }else{
                Km.Orderlog.Config.View.IsShow=0;
            }

            this.ownerCt.doLayout();
        },
        /**
         * 隐藏订单日志
         */
        hideOrderlog : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Orderlog.View.Running.view_window!=null){
                Km.Orderlog.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前订单日志显示信息
         */
        updateViewOrderlog : function() {
            if (Km.Orderlog.View.Running.view_window!=null){
                Km.Orderlog.View.Running.view_window.winTabs.tabOrderlogDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Orderlog.View.Running.viewTabs.tabOrderlogDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 编辑订单日志时先获得选中的订单日志信息
         */
        updateOrderlog : function() {
            if (Km.Orderlog.View.Running.edit_window==null){
                Km.Orderlog.View.Running.edit_window=new Km.Orderlog.View.EditWindow();
            }
            Km.Orderlog.View.Running.edit_window.saveBtn.setText('确 定');
            Km.Orderlog.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Orderlog.View.Running.edit_window.setTitle('日志备注');
            Km.Orderlog.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Orderlog.View.Running.edit_window.savetype=1;
            switch (Km.Orderlog.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Orderlog.View.EditWindow.KindEditor_intro) Km.Orderlog.View.EditWindow.KindEditor_intro.html(this.getSelectionModel().getSelected().data.intro);
                    break
                case 3:
                    if (xhEditor_intro)xhEditor_intro.setSource(this.getSelectionModel().getSelected().data.intro);
                    break
                default:
                    if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(this.getSelectionModel().getSelected().data.intro);
            }

            Km.Orderlog.View.Running.edit_window.show();
            Km.Orderlog.View.Running.edit_window.maximize();
        },
        /**
         * 导出订单日志
         */
        exportOrderlog : function() {
            ExtServiceOrderlog.exportOrderlog(this.filter,function(provider, response) {
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
            Km.Orderlog.View.Running.orderlogGrid=new Km.Orderlog.View.Grid();
            if (Km.Orderlog.Config.View.IsFix==0){
                Km.Orderlog.View.Running.orderlogGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Orderlog.View.Running.orderlogGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Orderlog.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Orderlog.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前订单日志Grid对象
         */
        orderlogGrid:null,

        /**
         * 显示订单日志信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Orderlog.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Orderlog.Init();
    /**
     * 订单日志数据模型获取数据Direct调用
     */
    Km.Orderlog.Store.orderlogStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceOrderlog.queryPageOrderlog}
    });
    /**
     * 订单日志页面布局
     */
    Km.Orderlog.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Orderlog.View.Panel()]
    });
    Km.Orderlog.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});