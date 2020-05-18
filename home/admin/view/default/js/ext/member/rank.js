Ext.namespace("Kmall.Admin.Rank");
Km = Kmall.Admin;
Km.Rank={
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
             * 显示会员等级表的视图相对会员等级表列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示会员等级表信息页(或者打开新窗口)
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
        if (Km.Rank.Cookie.get('View.Direction')){
            Km.Rank.Config.View.Direction=Km.Rank.Cookie.get('View.Direction');
        }
        if (Km.Rank.Cookie.get('View.IsFix')!=null){
            Km.Rank.Config.View.IsFix=Km.Rank.Cookie.get('View.IsFix');
        }
    }
};
/**
 * Model:数据模型
 */
Km.Rank.Store = {
    /**
     * 会员等级表
     */
    rankStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'rank_id',type: 'int'},
                {name: 'rank_name',type: 'string'},
                {name: 'lowerlimit',type: 'int'},
                {name: 'upperlimit',type: 'int'},
                {name: 'discount',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Rank.Config.PageSize;
                    Ext.apply(options.params, Km.Rank.View.Running.rankGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    })
};
/**
 * View:会员等级表显示组件
 */
Km.Rank.View={
    /**
     * 编辑窗口：新建或者修改会员等级表
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
                            {xtype: 'hidden',name : 'rank_id',ref:'../rank_id'},
                            {fieldLabel : '等级名称',name : 'rank_name'},
                            {fieldLabel : '券下限',name : 'lowerlimit',xtype : 'numberfield'},
                            {fieldLabel : '券上限',name : 'upperlimit',xtype : 'numberfield'},
                            {fieldLabel : '折扣率%',name : 'discount'}
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
                            this.editForm.api.submit=ExtServiceRank.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Rank.View.Running.rankGrid.doSelectRank();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceRank.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.Rank.View.Running.rankGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Rank.View.Running.rankGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Rank.View.Running.rankGrid.getSelectionModel().getSelected());

                    }
                }]
            }, config);
            Km.Rank.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示会员等级表详情
     */
    RankView:{
        /**
         * Tab页：容器包含显示与会员等级表所有相关的信息
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
                                if (Km.Rank.View.Running.rankGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择会员等级表！');
                                    return false;
                                }
                                Km.Rank.Config.View.IsShow=1;
                                Km.Rank.View.Running.rankGrid.showRank();
                                Km.Rank.View.Running.rankGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Rank.View.RankView.Tabs.superclass.constructor.call(this, config);

                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Rank.Config.View.Direction==1)||(Km.Rank.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabRankDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">等级名称</td><td class="content">{rank_name}</td></tr>',
                         '    <tr class="entry"><td class="head">券下限</td><td class="content">{lowerlimit}</td></tr>',
                         '    <tr class="entry"><td class="head">券上限</td><td class="content">{upperlimit}</td></tr>',
                         '    <tr class="entry"><td class="head">折扣率%</td><td class="content">{discount}</td></tr>',
                         '</table>'
                     ]}
                );
                this.add(
                    {title: '其他',iconCls:'tabs'}
                );
            }
        }),
        /**
         * 窗口:显示会员等级表信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看会员等级表",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Rank.View.RankView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Rank.Config.View.IsShow=0;
                            Km.Rank.View.Running.rankGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Rank.View.Running.rankGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Rank.View.Running.rankGrid.addRank();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Rank.View.Running.rankGrid.updateRank();}
                    }]
                }, config);
                Km.Rank.View.RankView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 窗口：批量上传会员等级表
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传会员等级表数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传会员等级表Excel文件',buttonText: '',
                            accept:'application/vnd.ms-excel',
                            buttonCfg: {iconCls: 'upload-icon'}
                        }]
                    })
                ],
                buttons : [{
                        text : '上 传',
                        scope:this,
                        handler : function() {
                            uploadWindow           =this;
                            validationExpression   =/([\u4E00-\u9FA5]|\w)+(.xlsx|.XLSX|.xls|.XLS)$/;/**允许中文名*/
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
                                    url : 'index.php?go=admin.upload.uploadRank',
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Rank.View.Running.rankGrid.doSelectRank();
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
            Km.Rank.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：会员等级表列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Rank.Store.rankStore,
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
                        {header : '标识',dataIndex : 'rank_id',hidden:true},
                        {header : '等级名称',dataIndex : 'rank_name'},
                        {header : '券下限',dataIndex : 'lowerlimit'},
                        {header : '券上限',dataIndex : 'upperlimit'},
                        {header : '折扣率%',dataIndex : 'discount'}
                    ]
                }),
                tbar : {
                    xtype : 'container',layout : 'anchor',height : 27,style:'font-size:14px',
                    defaults : {
                        height : 27,anchor : '100%'
                    },
                    items : [
                        new Ext.Toolbar({
                            defaults:{scope: this},
                            items : [
                                {
                                    text: '反选',iconCls : 'icon-reverse',
                                    handler: function(){
                                        this.onReverseSelect();
                                    }
                                },'-',{
                                    text : '添加会员等级表',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addRank();
                                    }
                                },'-',{
                                    text : '修改会员等级表',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateRank();
                                    }
                                },'-',{
                                    text : '删除会员等级表', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteRank();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importRank();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入会员等级表',iconCls : 'icon-import',scope:this,handler:function(){this.importRank()}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportRank();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看会员等级表', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showRank()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideRank();Km.Rank.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Rank.Cookie.set('View.IsFix',Km.Rank.Config.View.IsFix);}}
                                        ]}
                                },'-']}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Rank.Config.PageSize,
                    store: Km.Rank.Store.rankStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Rank.Viewport){
                                if (Km.Rank.Config.View.IsShow==1){
                                    Km.Rank.View.IsSelectView=1;
                                }
                                this.ownerCt.hideRank();
                                Km.Rank.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Rank.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Rank.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Rank.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectRank();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Rank.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Rank.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectRank();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示会员等级表列表
            this.doSelectRank();
            Km.Rank.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的会员等级表信息Tab页
            Km.Rank.View.Running.viewTabs=new Km.Rank.View.RankView.Tabs();
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
                    this.grid.updateViewRank();
                    if (sm.getCount() != 1){
                        this.grid.hideRank();
                        Km.Rank.Config.View.IsShow=0;
                    }else{
                        if (Km.Rank.View.IsSelectView==1){
                            Km.Rank.View.IsSelectView=0;
                            this.grid.showRank();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Rank.Config.View.IsShow==1){
                            Km.Rank.View.IsSelectView=1;
                        }
                        this.grid.hideRank();
                        Km.Rank.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Rank.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showRank();
                this.tvpView.toggle(true);
            }else{
                this.hideRank();
                Km.Rank.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Rank.Config.View.IsFix=1;
            }else{
               Km.Rank.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Rank.Config.View.IsShow=0;
                return ;
            }
            if (Km.Rank.Config.View.IsShow==1){
               this.hideRank();
               Km.Rank.Config.View.IsShow=0;
            }
            this.showRank();
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
         * 查询符合条件的会员等级表
         */
        doSelectRank : function() {
            if (this.topToolbar){


            }
            var condition = {'start':0,'limit':Km.Rank.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceRank.queryPageRank(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Rank.Store.rankStore.loadData(result);
                } else {
                    Km.Rank.Store.rankStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的会员等级表！');
                }
            });
        },
        /**
         * 显示会员等级表视图
         * 显示会员等级表的视图相对会员等级表列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Rank.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Rank.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Rank.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Rank.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Rank.View.Running.viewTabs);
                    break;
            }
            Km.Rank.Cookie.set('View.Direction',Km.Rank.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Rank.Config.View.IsFix==0)&&(Km.Rank.Config.View.IsShow==1)){
                    this.showRank();
                }
                Km.Rank.Config.View.IsFix=1;
                Km.Rank.View.Running.rankGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Rank.Config.View.IsShow=0;
                this.showRank();
            }
        },
        /**
         * 显示会员等级表
         */
        showRank : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择会员等级表！');
                Km.Rank.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Rank.Config.View.IsFix==0){
                if (Km.Rank.View.Running.view_window==null){
                    Km.Rank.View.Running.view_window=new Km.Rank.View.RankView.Window();
                }
                if (Km.Rank.View.Running.view_window.hidden){
                    Km.Rank.View.Running.view_window.show();
                    Km.Rank.View.Running.view_window.winTabs.hideTabStripItem(Km.Rank.View.Running.view_window.winTabs.tabFix);
                    this.updateViewRank();
                    this.tvpView.toggle(true);
                    Km.Rank.Config.View.IsShow=1;
                }else{
                    this.hideRank();
                    Km.Rank.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Rank.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Rank.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Rank.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Rank.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Rank.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Rank.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Rank.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Rank.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Rank.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideRank();
            if (Km.Rank.Config.View.IsShow==0){
                Km.Rank.View.Running.viewTabs.enableCollapse();
                switch(Km.Rank.Config.View.Direction){
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
                this.updateViewRank();
                this.tvpView.toggle(true);
                Km.Rank.Config.View.IsShow=1;
            }else{
                Km.Rank.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏会员等级表
         */
        hideRank : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Rank.View.Running.view_window!=null){
                Km.Rank.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前会员等级表显示信息
         */
        updateViewRank : function() {

            if (Km.Rank.View.Running.view_window!=null){
                Km.Rank.View.Running.view_window.winTabs.tabRankDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Rank.View.Running.viewTabs.tabRankDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建会员等级表
         */
        addRank : function() {
            if (Km.Rank.View.Running.edit_window==null){
                Km.Rank.View.Running.edit_window=new Km.Rank.View.EditWindow();
            }
            Km.Rank.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Rank.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Rank.View.Running.edit_window.setTitle('添加会员等级表');
            Km.Rank.View.Running.edit_window.savetype=0;
            Km.Rank.View.Running.edit_window.rank_id.setValue("");

            Km.Rank.View.Running.edit_window.show();
            Km.Rank.View.Running.edit_window.maximize();
        },
        /**
         * 编辑会员等级表时先获得选中的会员等级表信息
         */
        updateRank : function() {
            if (Km.Rank.View.Running.edit_window==null){
                Km.Rank.View.Running.edit_window=new Km.Rank.View.EditWindow();
            }
            Km.Rank.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Rank.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Rank.View.Running.edit_window.setTitle('修改会员等级表');
            Km.Rank.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Rank.View.Running.edit_window.savetype=1;

            Km.Rank.View.Running.edit_window.show();
            Km.Rank.View.Running.edit_window.maximize();
        },
        /**
         * 删除会员等级表
         */
        deleteRank : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的会员等级表吗?', this.confirmDeleteRank,this);
        },
        /**
         * 确认删除会员等级表
         */
        confirmDeleteRank : function(btn) {
            if (btn == 'yes') {
                var del_rank_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_rank_ids=del_rank_ids+selectedRows[flag].data.rank_id+",";
                }
                ExtServiceRank.deleteByIds(del_rank_ids);
                this.doSelectRank();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出会员等级表
         */
        exportRank : function() {
            ExtServiceRank.exportRank(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入会员等级表
         */
        importRank : function() {
            if (Km.Rank.View.current_uploadWindow==null){
                Km.Rank.View.current_uploadWindow=new Km.Rank.View.UploadWindow();
            }
            Km.Rank.View.current_uploadWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Rank.View.Running.rankGrid=new Km.Rank.View.Grid();
            if (Km.Rank.Config.View.IsFix==0){
                Km.Rank.View.Running.rankGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Rank.View.Running.rankGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Rank.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Rank.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前会员等级表Grid对象
         */
        rankGrid:null,

        /**
         * 显示会员等级表信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Rank.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Rank.Init();
    /**
     * 会员等级表数据模型获取数据Direct调用
     */
    Km.Rank.Store.rankStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceRank.queryPageRank}
    });
    /**
     * 会员等级表页面布局
     */
    Km.Rank.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Rank.View.Panel()]
    });
    Km.Rank.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
