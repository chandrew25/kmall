Ext.namespace("Kmall.Admin.Activityproduct");
Km = Kmall.Admin;
Km.Activityproduct={
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
             * 显示活动拥有的商品的视图相对活动拥有的商品列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示活动拥有的商品信息页(或者打开新窗口)
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
        if (Km.Activityproduct.Cookie.get('View.Direction')){
            Km.Activityproduct.Config.View.Direction=Km.Activityproduct.Cookie.get('View.Direction');
        }
        if (Km.Activityproduct.Cookie.get('View.IsFix')!=null){
            Km.Activityproduct.Config.View.IsFix=Km.Activityproduct.Cookie.get('View.IsFix');
        }
    }
};
/**
 * Model:数据模型
 */
Km.Activityproduct.Store = {
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
                {name: 'product_id',type: 'string'}
            ]
        }),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Activityproduct.Config.PageSize;
                    Ext.apply(options.params, Km.Activityproduct.View.Running.activityproductGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    })
};
/**
 * View:活动拥有的商品显示组件
 */
Km.Activityproduct.View={
    /**
     * 编辑窗口：新建或者修改活动拥有的商品
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
                            {fieldLabel : '活动',name : 'activity_id',xtype : 'numberfield'},
                            {fieldLabel : '商品',name : 'product_id'}
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
                        if (this.savetype==0){
                            this.editForm.api.submit=ExtServiceActivityproduct.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Activityproduct.View.Running.activityproductGrid.doSelectActivityproduct();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, response) {
                                    Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceActivityproduct.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.Activityproduct.View.Running.activityproductGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Activityproduct.View.Running.activityproductGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Activityproduct.View.Running.activityproductGrid.getSelectionModel().getSelected());

                    }
                }]
            }, config);
            Km.Activityproduct.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示活动拥有的商品详情
     */
    ActivityproductView:{
        /**
         * Tab页：容器包含显示与活动拥有的商品所有相关的信息
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
                                if (Km.Activityproduct.View.Running.activityproductGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择活动拥有的商品！');
                                    return false;
                                }
                                Km.Activityproduct.Config.View.IsShow=1;
                                Km.Activityproduct.View.Running.activityproductGrid.showActivityproduct();
                                Km.Activityproduct.View.Running.activityproductGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Activityproduct.View.ActivityproductView.Tabs.superclass.constructor.call(this, config);

                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Activityproduct.Config.View.Direction==1)||(Km.Activityproduct.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabActivityproductDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">活动</td><td class="content">{activity_id}</td></tr>',
                         '    <tr class="entry"><td class="head">商品</td><td class="content">{product_id}</td></tr>',
                         '</table>'
                     ]}
                );
                this.add(
                    {title: '其他',iconCls:'tabs'}
                );
            }
        }),
        /**
         * 窗口:显示活动拥有的商品信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看活动拥有的商品",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Activityproduct.View.ActivityproductView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Activityproduct.Config.View.IsShow=0;
                            Km.Activityproduct.View.Running.activityproductGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Activityproduct.Config.View.IsShow=0;
                            Km.Activityproduct.View.Running.activityproductGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增活动拥有的商品',scope:this,
                        handler : function() {this.hide();Km.Activityproduct.View.Running.activityproductGrid.addActivityproduct();}
                    },{
                        text: '修改活动拥有的商品',scope:this,
                        handler : function() {this.hide();Km.Activityproduct.View.Running.activityproductGrid.updateActivityproduct();}
                    }]
                }, config);
                Km.Activityproduct.View.ActivityproductView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 窗口：批量上传活动拥有的商品
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传活动拥有的商品数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传活动拥有的商品Excel文件',buttonText: '',
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
                                url : 'index.php?go=admin.upload.uploadActivityproduct',
                                success : function(form, response) {
                                    Ext.Msg.alert('成功', '上传成功');
                                    uploadWindow.hide();
                                    uploadWindow.uploadForm.upload_file.setValue('');
                                    Km.Activityproduct.View.Running.activityproductGrid.doSelectActivityproduct();
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
            Km.Activityproduct.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：活动拥有的商品列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Activityproduct.Store.activityproductStore,
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
                        {header : '标识',dataIndex : 'activityproduct_id',hidden:true},
                        {header : '活动',dataIndex : 'activity_id'},
                        {header : '商品',dataIndex : 'product_id'}
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
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectActivityproduct();
                                    }
                                }
                            },
                            items : [

                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectActivityproduct();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {

                                        this.filter={};
                                        this.doSelectActivityproduct();
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
                                    text : '添加活动拥有的商品',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addActivityproduct();
                                    }
                                },'-',{
                                    text : '修改活动拥有的商品',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateActivityproduct();
                                    }
                                },'-',{
                                    text : '删除活动拥有的商品', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteActivityproduct();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importActivityproduct();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入活动拥有的商品',iconCls : 'icon-import',scope:this,handler:function(){this.importActivityproduct()}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportActivityproduct();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看活动拥有的商品', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showActivityproduct()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideActivityproduct();Km.Activityproduct.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Activityproduct.Cookie.set('View.IsFix',Km.Activityproduct.Config.View.IsFix);}}
                                        ]
                                    }
                                },'-'
                            ]
                        }
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Activityproduct.Config.PageSize,
                    store: Km.Activityproduct.Store.activityproductStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Activityproduct.Viewport){
                                if (Km.Activityproduct.Config.View.IsShow==1){
                                    Km.Activityproduct.View.IsSelectView=1;
                                }
                                this.ownerCt.hideActivityproduct();
                                Km.Activityproduct.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Activityproduct.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Activityproduct.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Activityproduct.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectActivityproduct();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Activityproduct.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Activityproduct.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectActivityproduct();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示活动拥有的商品列表
            this.doSelectActivityproduct();
            Km.Activityproduct.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的活动拥有的商品信息Tab页
            Km.Activityproduct.View.Running.viewTabs=new Km.Activityproduct.View.ActivityproductView.Tabs();
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
                        this.grid.hideActivityproduct();
                        Km.Activityproduct.Config.View.IsShow=0;
                    }else{
                        if (Km.Activityproduct.View.IsSelectView==1){
                            Km.Activityproduct.View.IsSelectView=0;
                            this.grid.showActivityproduct();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Activityproduct.Config.View.IsShow==1){
                            Km.Activityproduct.View.IsSelectView=1;
                        }
                        this.grid.hideActivityproduct();
                        Km.Activityproduct.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Activityproduct.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showActivityproduct();
                this.tvpView.toggle(true);
            }else{
                this.hideActivityproduct();
                Km.Activityproduct.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
                Km.Activityproduct.Config.View.IsFix=1;
            }else{
                Km.Activityproduct.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Activityproduct.Config.View.IsShow=0;
                return ;
            }
            if (Km.Activityproduct.Config.View.IsShow==1){
                this.hideActivityproduct();
                Km.Activityproduct.Config.View.IsShow=0;
            }
            this.showActivityproduct();
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
         * 查询符合条件的活动拥有的商品
         */
        doSelectActivityproduct : function() {
            if (this.topToolbar){


            }
            var condition = {'start':0,'limit':Km.Activityproduct.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceActivityproduct.queryPageActivityproduct(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result             = new Array();
                    result['data']         = response.result.data;
                    result['totalCount'] = response.result.totalCount;
                    Km.Activityproduct.Store.activityproductStore.loadData(result);
                } else {
                    Km.Activityproduct.Store.activityproductStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的活动拥有的商品！');
                }
            });
        },
        /**
         * 显示活动拥有的商品视图
         * 显示活动拥有的商品的视图相对活动拥有的商品列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Activityproduct.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Activityproduct.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Activityproduct.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Activityproduct.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Activityproduct.View.Running.viewTabs);
                    break;
            }
            Km.Activityproduct.Cookie.set('View.Direction',Km.Activityproduct.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Activityproduct.Config.View.IsFix==0)&&(Km.Activityproduct.Config.View.IsShow==1)){
                    this.showActivityproduct();
                }
                Km.Activityproduct.Config.View.IsFix=1;
                Km.Activityproduct.View.Running.activityproductGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Activityproduct.Config.View.IsShow=0;
                this.showActivityproduct();
            }
        },
        /**
         * 显示活动拥有的商品
         */
        showActivityproduct : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择活动拥有的商品！');
                Km.Activityproduct.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Activityproduct.Config.View.IsFix==0){
                if (Km.Activityproduct.View.Running.view_window==null){
                    Km.Activityproduct.View.Running.view_window=new Km.Activityproduct.View.ActivityproductView.Window();
                }
                if (Km.Activityproduct.View.Running.view_window.hidden){
                    Km.Activityproduct.View.Running.view_window.show();
                    Km.Activityproduct.View.Running.view_window.winTabs.hideTabStripItem(Km.Activityproduct.View.Running.view_window.winTabs.tabFix);
                    this.updateViewActivityproduct();
                    this.tvpView.toggle(true);
                    Km.Activityproduct.Config.View.IsShow=1;
                }else{
                    this.hideActivityproduct();
                    Km.Activityproduct.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Activityproduct.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Activityproduct.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Activityproduct.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Activityproduct.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Activityproduct.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Activityproduct.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Activityproduct.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Activityproduct.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Activityproduct.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideActivityproduct();
            if (Km.Activityproduct.Config.View.IsShow==0){
                Km.Activityproduct.View.Running.viewTabs.enableCollapse();
                switch(Km.Activityproduct.Config.View.Direction){
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
                this.updateViewActivityproduct();
                this.tvpView.toggle(true);
                Km.Activityproduct.Config.View.IsShow=1;
            }else{
                Km.Activityproduct.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏活动拥有的商品
         */
        hideActivityproduct : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Activityproduct.View.Running.view_window!=null){
                Km.Activityproduct.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前活动拥有的商品显示信息
         */
        updateViewActivityproduct : function() {

            if (Km.Activityproduct.View.Running.view_window!=null){
                Km.Activityproduct.View.Running.view_window.winTabs.tabActivityproductDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Activityproduct.View.Running.viewTabs.tabActivityproductDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建活动拥有的商品
         */
        addActivityproduct : function() {
            if (Km.Activityproduct.View.Running.edit_window==null){
                Km.Activityproduct.View.Running.edit_window=new Km.Activityproduct.View.EditWindow();
            }
            Km.Activityproduct.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Activityproduct.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Activityproduct.View.Running.edit_window.setTitle('添加活动拥有的商品');
            Km.Activityproduct.View.Running.edit_window.savetype=0;
            Km.Activityproduct.View.Running.edit_window.activityproduct_id.setValue("");

            Km.Activityproduct.View.Running.edit_window.show();
            Km.Activityproduct.View.Running.edit_window.maximize();
        },
        /**
         * 编辑活动拥有的商品时先获得选中的活动拥有的商品信息
         */
        updateActivityproduct : function() {
            if (Km.Activityproduct.View.Running.edit_window==null){
                Km.Activityproduct.View.Running.edit_window=new Km.Activityproduct.View.EditWindow();
            }
            Km.Activityproduct.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Activityproduct.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Activityproduct.View.Running.edit_window.setTitle('修改活动拥有的商品');
            Km.Activityproduct.View.Running.edit_window.savetype=1;

            Km.Activityproduct.View.Running.edit_window.show();
            Km.Activityproduct.View.Running.edit_window.maximize();

            Km.Activityproduct.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());

        },
        /**
         * 删除活动拥有的商品
         */
        deleteActivityproduct : function() {
            Ext.Msg.confirm('提示', '确认要删除所选的活动拥有的商品吗?', this.confirmDeleteActivityproduct,this);
        },
        /**
         * 确认删除活动拥有的商品
         */
        confirmDeleteActivityproduct : function(btn) {
            if (btn == 'yes') {
                var del_activityproduct_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_activityproduct_ids=del_activityproduct_ids+selectedRows[flag].data.activityproduct_id+",";
                }
                ExtServiceActivityproduct.deleteByIds(del_activityproduct_ids);
                this.doSelectActivityproduct();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出活动拥有的商品
         */
        exportActivityproduct : function() {
            ExtServiceActivityproduct.exportActivityproduct(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入活动拥有的商品
         */
        importActivityproduct : function() {
            if (Km.Activityproduct.View.current_uploadWindow==null){
                Km.Activityproduct.View.current_uploadWindow=new Km.Activityproduct.View.UploadWindow();
            }
            Km.Activityproduct.View.current_uploadWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Activityproduct.View.Running.activityproductGrid=new Km.Activityproduct.View.Grid();
            if (Km.Activityproduct.Config.View.IsFix==0){
                Km.Activityproduct.View.Running.activityproductGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Activityproduct.View.Running.activityproductGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Activityproduct.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Activityproduct.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前活动拥有的商品Grid对象
         */
        activityproductGrid:null,

        /**
         * 显示活动拥有的商品信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Activityproduct.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Activityproduct.Init();
    /**
     * 活动拥有的商品数据模型获取数据Direct调用
     */
    Km.Activityproduct.Store.activityproductStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceActivityproduct.queryPageActivityproduct}
    });
    /**
     * 活动拥有的商品页面布局
     */
    Km.Activityproduct.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Activityproduct.View.Panel()]
    });
    Km.Activityproduct.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
