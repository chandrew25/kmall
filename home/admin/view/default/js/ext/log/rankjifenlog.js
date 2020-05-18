Ext.namespace("Kmall.Admin.Rankjifenlog");
Km = Kmall.Admin;
Km.Rankjifenlog={
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
             * 显示会员等级积分日志的视图相对会员等级积分日志列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示会员等级积分日志信息页(或者打开新窗口)
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
        if (Km.Rankjifenlog.Cookie.get('View.Direction')){
            Km.Rankjifenlog.Config.View.Direction=Km.Rankjifenlog.Cookie.get('View.Direction');
        }
        if (Km.Rankjifenlog.Cookie.get('View.IsFix')!=null){
            Km.Rankjifenlog.Config.View.IsFix=Km.Rankjifenlog.Cookie.get('View.IsFix');
        }
    }
};
/**
 * Model:数据模型
 */
Km.Rankjifenlog.Store = {
    /**
     * 会员等级积分日志
     */
    rankjifenlogStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'rankjifenlog_id',type: 'int'},
                {name: 'member_id',type: 'int'},
                {name: 'jifenoriginal',type: 'int'},
                {name: 'jifenraise',type: 'int'},
                {name: 'jifenreduce',type: 'int'},
                {name: 'discribe',type: 'string'},
                {name: 'discribe_enum',type: 'int'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Rankjifenlog.Config.PageSize;
                    Ext.apply(options.params, Km.Rankjifenlog.View.Running.rankjifenlogGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    })
};
/**
 * View:会员等级积分日志显示组件
 */
Km.Rankjifenlog.View={
    /**
     * 编辑窗口：新建或者修改会员等级积分日志
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
                            {xtype: 'hidden',name : 'rankjifenlog_id',ref:'../rankjifenlog_id'},
                            {fieldLabel : '会员',name : 'member_id',xtype : 'numberfield'},
                            {fieldLabel : '券原值',name : 'jifenoriginal',xtype : 'numberfield'},
                            {fieldLabel : '券增加值',name : 'jifenraise',xtype : 'numberfield'},
                            {fieldLabel : '券减少值',name : 'jifenreduce',xtype : 'numberfield'},
                            {fieldLabel : '券变动描述',name : 'discribe'},
                            {fieldLabel : '操作描述的枚举值',name : 'discribe_enum',xtype : 'numberfield'}
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
                            this.editForm.api.submit=ExtServiceRankjifenlog.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Rankjifenlog.View.Running.rankjifenlogGrid.doSelectRankjifenlog();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceRankjifenlog.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.Rankjifenlog.View.Running.rankjifenlogGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Rankjifenlog.View.Running.rankjifenlogGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Rankjifenlog.View.Running.rankjifenlogGrid.getSelectionModel().getSelected());

                    }
                }]
            }, config);
            Km.Rankjifenlog.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示会员等级积分日志详情
     */
    RankjifenlogView:{
        /**
         * Tab页：容器包含显示与会员等级积分日志所有相关的信息
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
                                if (Km.Rankjifenlog.View.Running.rankjifenlogGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择会员等级券日志！');
                                    return false;
                                }
                                Km.Rankjifenlog.Config.View.IsShow=1;
                                Km.Rankjifenlog.View.Running.rankjifenlogGrid.showRankjifenlog();
                                Km.Rankjifenlog.View.Running.rankjifenlogGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Rankjifenlog.View.RankjifenlogView.Tabs.superclass.constructor.call(this, config);

                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Rankjifenlog.Config.View.Direction==1)||(Km.Rankjifenlog.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabRankjifenlogDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">会员</td><td class="content">{member_id}</td></tr>',
                         '    <tr class="entry"><td class="head">券原值</td><td class="content">{jifenoriginal}</td></tr>',
                         '    <tr class="entry"><td class="head">券增加值</td><td class="content">{jifenraise}</td></tr>',
                         '    <tr class="entry"><td class="head">券减少值</td><td class="content">{jifenreduce}</td></tr>',
                         '    <tr class="entry"><td class="head">券变动描述</td><td class="content">{discribe}</td></tr>',
                         '    <tr class="entry"><td class="head">操作描述的枚举值</td><td class="content">{discribe_enum}</td></tr>',
                         '</table>'
                     ]}
                );
                this.add(
                    {title: '其他',iconCls:'tabs'}
                );
            }
        }),
        /**
         * 窗口:显示会员等级积分日志信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看会员等级券日志",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Rankjifenlog.View.RankjifenlogView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Rankjifenlog.Config.View.IsShow=0;
                            Km.Rankjifenlog.View.Running.rankjifenlogGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Rankjifenlog.Config.View.IsShow=0;
                            Km.Rankjifenlog.View.Running.rankjifenlogGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Rankjifenlog.View.Running.rankjifenlogGrid.addRankjifenlog();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Rankjifenlog.View.Running.rankjifenlogGrid.updateRankjifenlog();}
                    }]
                }, config);
                Km.Rankjifenlog.View.RankjifenlogView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 窗口：批量上传会员等级积分日志
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传会员等级券日志数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传会员等级券日志Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadRankjifenlog',
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Rankjifenlog.View.Running.rankjifenlogGrid.doSelectRankjifenlog();
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
            Km.Rankjifenlog.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：会员等级积分日志列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Rankjifenlog.Store.rankjifenlogStore,
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
                        {header : '标识',dataIndex : 'rankjifenlog_id',hidden:true},
                        {header : '会员',dataIndex : 'member_id'},
                        {header : '券原值',dataIndex : 'jifenoriginal'},
                        {header : '券增加值',dataIndex : 'jifenraise'},
                        {header : '券减少值',dataIndex : 'jifenreduce'},
                        {header : '券变动描述',dataIndex : 'discribe'},
                        {header : '操作描述的枚举值',dataIndex : 'discribe_enum'}
                    ]
                }),
                tbar : {
                    xtype : 'container',layout : 'anchor',height : 27 * 2,style:'font-size:14px',
                    defaults : {
                        height : 27,anchor : '100%'
                    },
                    items : [
                        new Ext.Toolbar({
                            enableOverflow: true,width : 100,
                            defaults : {
                                xtype : 'textfield',
                                listeners : {
                                   specialkey : function(field, e) {
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectRankjifenlog();
                                    }
                                }
                            },
                            items : [

                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectRankjifenlog();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {

                                        this.filter={};
                                        this.doSelectRankjifenlog();
                                    }
                                }]
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
                                    text : '添加会员等级券日志',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addRankjifenlog();
                                    }
                                },'-',{
                                    text : '修改会员等级券日志',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateRankjifenlog();
                                    }
                                },'-',{
                                    text : '删除会员等级券日志', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteRankjifenlog();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importRankjifenlog();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入会员等级券日志',iconCls : 'icon-import',scope:this,handler:function(){this.importRankjifenlog()}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportRankjifenlog();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看会员等级券日志', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showRankjifenlog()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideRankjifenlog();Km.Rankjifenlog.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Rankjifenlog.Cookie.set('View.IsFix',Km.Rankjifenlog.Config.View.IsFix);}}
                                        ]}
                                },'-']}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Rankjifenlog.Config.PageSize,
                    store: Km.Rankjifenlog.Store.rankjifenlogStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Rankjifenlog.Config.View.IsShow==1){
                                Km.Rankjifenlog.View.IsSelectView=1;
                            }
                            this.ownerCt.hideRankjifenlog();
                            Km.Rankjifenlog.Config.View.IsShow=0;
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Rankjifenlog.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Rankjifenlog.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Rankjifenlog.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectRankjifenlog();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Rankjifenlog.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Rankjifenlog.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectRankjifenlog();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示会员等级积分日志列表
            this.doSelectRankjifenlog();
            Km.Rankjifenlog.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的会员等级积分日志信息Tab页
            Km.Rankjifenlog.View.Running.viewTabs=new Km.Rankjifenlog.View.RankjifenlogView.Tabs();
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
                    this.grid.updateViewRankjifenlog();
                    if (sm.getCount() != 1){
                        this.grid.hideRankjifenlog();
                        Km.Rankjifenlog.Config.View.IsShow=0;
                    }else{
                        if (Km.Rankjifenlog.View.IsSelectView==1){
                            Km.Rankjifenlog.View.IsSelectView=0;
                            this.grid.showRankjifenlog();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Rankjifenlog.Config.View.IsShow==1){
                            Km.Rankjifenlog.View.IsSelectView=1;
                        }
                        this.grid.hideRankjifenlog();
                        Km.Rankjifenlog.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Rankjifenlog.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showRankjifenlog();
                this.tvpView.toggle(true);
            }else{
                this.hideRankjifenlog();
                Km.Rankjifenlog.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Rankjifenlog.Config.View.IsFix=1;
            }else{
               Km.Rankjifenlog.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Rankjifenlog.Config.View.IsShow=0;
                return ;
            }
            if (Km.Rankjifenlog.Config.View.IsShow==1){
               this.hideRankjifenlog();
               Km.Rankjifenlog.Config.View.IsShow=0;
            }
            this.showRankjifenlog();
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
         * 查询符合条件的会员等级积分日志
         */
        doSelectRankjifenlog : function() {
            if (this.topToolbar){


            }
            var condition = {'start':0,'limit':Km.Rankjifenlog.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceRankjifenlog.queryPageRankjifenlog(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Rankjifenlog.Store.rankjifenlogStore.loadData(result);
                } else {
                    Km.Rankjifenlog.Store.rankjifenlogStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的会员等级券日志！');
                }
            });
        },
        /**
         * 显示会员等级积分日志视图
         * 显示会员等级积分日志的视图相对会员等级积分日志列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Rankjifenlog.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Rankjifenlog.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Rankjifenlog.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Rankjifenlog.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Rankjifenlog.View.Running.viewTabs);
                    break;
            }
            Km.Rankjifenlog.Cookie.set('View.Direction',Km.Rankjifenlog.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Rankjifenlog.Config.View.IsFix==0)&&(Km.Rankjifenlog.Config.View.IsShow==1)){
                    this.showRankjifenlog();
                }
                Km.Rankjifenlog.Config.View.IsFix=1;
                Km.Rankjifenlog.View.Running.rankjifenlogGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Rankjifenlog.Config.View.IsShow=0;
                this.showRankjifenlog();
            }
        },
        /**
         * 显示会员等级积分日志
         */
        showRankjifenlog : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择会员等级券日志！');
                Km.Rankjifenlog.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Rankjifenlog.Config.View.IsFix==0){
                if (Km.Rankjifenlog.View.Running.view_window==null){
                    Km.Rankjifenlog.View.Running.view_window=new Km.Rankjifenlog.View.RankjifenlogView.Window();
                }
                if (Km.Rankjifenlog.View.Running.view_window.hidden){
                    Km.Rankjifenlog.View.Running.view_window.show();
                    Km.Rankjifenlog.View.Running.view_window.winTabs.hideTabStripItem(Km.Rankjifenlog.View.Running.view_window.winTabs.tabFix);
                    this.updateViewRankjifenlog();
                    this.tvpView.toggle(true);
                    Km.Rankjifenlog.Config.View.IsShow=1;
                }else{
                    this.hideRankjifenlog();
                    Km.Rankjifenlog.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Rankjifenlog.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Rankjifenlog.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Rankjifenlog.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Rankjifenlog.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Rankjifenlog.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Rankjifenlog.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Rankjifenlog.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Rankjifenlog.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Rankjifenlog.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideRankjifenlog();
            if (Km.Rankjifenlog.Config.View.IsShow==0){
                Km.Rankjifenlog.View.Running.viewTabs.enableCollapse();
                switch(Km.Rankjifenlog.Config.View.Direction){
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
                this.updateViewRankjifenlog();
                this.tvpView.toggle(true);
                Km.Rankjifenlog.Config.View.IsShow=1;
            }else{
                Km.Rankjifenlog.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏会员等级积分日志
         */
        hideRankjifenlog : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Rankjifenlog.View.Running.view_window!=null){
                Km.Rankjifenlog.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前会员等级积分日志显示信息
         */
        updateViewRankjifenlog : function() {

            if (Km.Rankjifenlog.View.Running.view_window!=null){
                Km.Rankjifenlog.View.Running.view_window.winTabs.tabRankjifenlogDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Rankjifenlog.View.Running.viewTabs.tabRankjifenlogDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建会员等级积分日志
         */
        addRankjifenlog : function() {
            if (Km.Rankjifenlog.View.Running.edit_window==null){
                Km.Rankjifenlog.View.Running.edit_window=new Km.Rankjifenlog.View.EditWindow();
            }
            Km.Rankjifenlog.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Rankjifenlog.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Rankjifenlog.View.Running.edit_window.setTitle('添加会员等级券日志');
            Km.Rankjifenlog.View.Running.edit_window.savetype=0;
            Km.Rankjifenlog.View.Running.edit_window.rankjifenlog_id.setValue("");

            Km.Rankjifenlog.View.Running.edit_window.show();
            Km.Rankjifenlog.View.Running.edit_window.maximize();
        },
        /**
         * 编辑会员等级积分日志时先获得选中的会员等级积分日志信息
         */
        updateRankjifenlog : function() {
            if (Km.Rankjifenlog.View.Running.edit_window==null){
                Km.Rankjifenlog.View.Running.edit_window=new Km.Rankjifenlog.View.EditWindow();
            }
            Km.Rankjifenlog.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Rankjifenlog.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Rankjifenlog.View.Running.edit_window.setTitle('修改会员等级券日志');
            Km.Rankjifenlog.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Rankjifenlog.View.Running.edit_window.savetype=1;

            Km.Rankjifenlog.View.Running.edit_window.show();
            Km.Rankjifenlog.View.Running.edit_window.maximize();
        },
        /**
         * 删除会员等级积分日志
         */
        deleteRankjifenlog : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的会员等级券日志吗?', this.confirmDeleteRankjifenlog,this);
        },
        /**
         * 确认删除会员等级积分日志
         */
        confirmDeleteRankjifenlog : function(btn) {
            if (btn == 'yes') {
                var del_rankjifenlog_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_rankjifenlog_ids=del_rankjifenlog_ids+selectedRows[flag].data.rankjifenlog_id+",";
                }
                ExtServiceRankjifenlog.deleteByIds(del_rankjifenlog_ids);
                this.doSelectRankjifenlog();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出会员等级积分日志
         */
        exportRankjifenlog : function() {
            ExtServiceRankjifenlog.exportRankjifenlog(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入会员等级积分日志
         */
        importRankjifenlog : function() {
            if (Km.Rankjifenlog.View.current_uploadWindow==null){
                Km.Rankjifenlog.View.current_uploadWindow=new Km.Rankjifenlog.View.UploadWindow();
            }
            Km.Rankjifenlog.View.current_uploadWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Rankjifenlog.View.Running.rankjifenlogGrid=new Km.Rankjifenlog.View.Grid();
            if (Km.Rankjifenlog.Config.View.IsFix==0){
                Km.Rankjifenlog.View.Running.rankjifenlogGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Rankjifenlog.View.Running.rankjifenlogGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Rankjifenlog.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Rankjifenlog.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前会员等级积分日志Grid对象
         */
        rankjifenlogGrid:null,

        /**
         * 显示会员等级积分日志信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Rankjifenlog.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Rankjifenlog.Init();
    /**
     * 会员等级积分日志数据模型获取数据Direct调用
     */
    Km.Rankjifenlog.Store.rankjifenlogStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceRankjifenlog.queryPageRankjifenlog}
    });
    /**
     * 会员等级积分日志页面布局
     */
    Km.Rankjifenlog.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Rankjifenlog.View.Panel()]
    });
    Km.Rankjifenlog.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
