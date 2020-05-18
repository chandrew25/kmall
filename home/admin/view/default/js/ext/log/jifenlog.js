Ext.namespace("Kmall.Admin.Jifenlog");
Km = Kmall.Admin;
Km.Jifenlog={
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
             * 显示会员积分日志的视图相对会员积分日志列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示会员积分日志信息页(或者打开新窗口)
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
        if (Km.Jifenlog.Cookie.get('View.Direction')){
            Km.Jifenlog.Config.View.Direction=Km.Jifenlog.Cookie.get('View.Direction');
        }
        if (Km.Jifenlog.Cookie.get('View.IsFix')!=null){
            Km.Jifenlog.Config.View.IsFix=Km.Jifenlog.Cookie.get('View.IsFix');
        }
    }
};
/**
 * Model:数据模型
 */
Km.Jifenlog.Store = {
    /**
     * 会员积分日志
     */
    jifenlogStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'jifenlog_id',type: 'int'},
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
                    if (!options.params.limit)options.params.limit=Km.Jifenlog.Config.PageSize;
                    Ext.apply(options.params, Km.Jifenlog.View.Running.jifenlogGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    })
};
/**
 * View:会员积分日志显示组件
 */
Km.Jifenlog.View={
    /**
     * 编辑窗口：新建或者修改会员积分日志
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
                            {xtype: 'hidden',name : 'jifenlog_id',ref:'../jifenlog_id'},
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
                            this.editForm.api.submit=ExtServiceJifenlog.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Jifenlog.View.Running.jifenlogGrid.doSelectJifenlog();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceJifenlog.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.Jifenlog.View.Running.jifenlogGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Jifenlog.View.Running.jifenlogGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Jifenlog.View.Running.jifenlogGrid.getSelectionModel().getSelected());

                    }
                }]
            }, config);
            Km.Jifenlog.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示会员积分日志详情
     */
    JifenlogView:{
        /**
         * Tab页：容器包含显示与会员积分日志所有相关的信息
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
                                if (Km.Jifenlog.View.Running.jifenlogGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择会员券日志！');
                                    return false;
                                }
                                Km.Jifenlog.Config.View.IsShow=1;
                                Km.Jifenlog.View.Running.jifenlogGrid.showJifenlog();
                                Km.Jifenlog.View.Running.jifenlogGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Jifenlog.View.JifenlogView.Tabs.superclass.constructor.call(this, config);

                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Jifenlog.Config.View.Direction==1)||(Km.Jifenlog.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabJifenlogDetail',iconCls:'tabs',
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
         * 窗口:显示会员积分日志信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看会员券日志",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Jifenlog.View.JifenlogView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Jifenlog.Config.View.IsShow=0;
                            Km.Jifenlog.View.Running.jifenlogGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Jifenlog.Config.View.IsShow=0;
                            Km.Jifenlog.View.Running.jifenlogGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Jifenlog.View.Running.jifenlogGrid.addJifenlog();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Jifenlog.View.Running.jifenlogGrid.updateJifenlog();}
                    }]
                }, config);
                Km.Jifenlog.View.JifenlogView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 窗口：批量上传会员积分日志
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传会员券日志数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传会员券日志Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadJifenlog',
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Jifenlog.View.Running.jifenlogGrid.doSelectJifenlog();
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
            Km.Jifenlog.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：会员积分日志列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Jifenlog.Store.jifenlogStore,
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
                        {header : '标识',dataIndex : 'jifenlog_id',hidden:true},
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
                        height : 27,anchor : '100%',autoScroll : true,autoHeight : true
                    },
                    items : [
                        new Ext.Toolbar({
                          enableOverflow: true,width : 100,
                          defaults : {
                            xtype : 'textfield',
                            listeners : {
                              specialkey : function(field, e) {
                                if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectJifenlog();
                              }
                            }
                          },
                          items : [
                            '会员','&nbsp;&nbsp;',{ref: '../jmember_id',xtype: 'combo',
                               store:Km.Jifenlog.Store.memberStoreForCombo,hiddenName : 'member_id',
                               emptyText: '请选择会员',itemSelector: 'div.search-item',
                               loadingText: '查询中...',width:280,pageSize:Km.Jifenlog.Config.PageSize,
                               displayField:'username',valueField:'member_id',
                               mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                               forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                               tpl:new Ext.XTemplate(
                                 '<tpl for="."><div class="search-item">',
                                   '<h3>{username}</h3>',
                                 '</div></tpl>'
                               )
                            },'&nbsp;&nbsp;',
                            {
                              xtype : 'button',text : '查询',scope: this,
                              handler : function() {
                                this.doSelectJifenlog();
                              }
                            },
                            {
                              xtype : 'button',text : '重置',scope: this,
                              handler : function() {
                                this.topToolbar.jmember_id.setValue("");
                                this.filter={};
                                this.doSelectJifenlog();
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
                                // },'-',{
                                //     text : '添加会员积分日志',iconCls : 'icon-add',
                                //     handler : function() {
                                //         this.addJifenlog();
                                //     }
                                // },'-',{
                                //     text : '修改会员积分日志',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                //     handler : function() {
                                //         this.updateJifenlog();
                                //     }
                                // },'-',{
                                //     text : '删除会员积分日志', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                //     handler : function() {
                                //         this.deleteJifenlog();
                                //     }
                                // },'-',{
                                //     xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                //     handler : function() {
                                //         this.importJifenlog();
                                //     },
                                //     menu: {
                                //         xtype:'menu',plain:true,
                                //         items: [
                                //             {text:'批量导入会员积分日志',iconCls : 'icon-import',scope:this,handler:function(){this.importJifenlog()}}
                                //         ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportJifenlog();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看会员日志', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showJifenlog()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideJifenlog();Km.Jifenlog.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Jifenlog.Cookie.set('View.IsFix',Km.Jifenlog.Config.View.IsFix);}}
                                        ]}
                                },'-']}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Jifenlog.Config.PageSize,
                    store: Km.Jifenlog.Store.jifenlogStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Jifenlog.Viewport){
                                if (Km.Jifenlog.Config.View.IsShow==1){
                                    Km.Jifenlog.View.IsSelectView=1;
                                }
                                this.ownerCt.hideJifenlog();
                                Km.Jifenlog.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Jifenlog.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Jifenlog.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Jifenlog.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectJifenlog();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Jifenlog.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Jifenlog.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectJifenlog();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示会员积分日志列表
            this.doSelectJifenlog();
            Km.Jifenlog.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的会员积分日志信息Tab页
            Km.Jifenlog.View.Running.viewTabs=new Km.Jifenlog.View.JifenlogView.Tabs();
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
                    this.grid.updateViewJifenlog();
                    if (sm.getCount() != 1){
                        this.grid.hideJifenlog();
                        Km.Jifenlog.Config.View.IsShow=0;
                    }else{
                        if (Km.Jifenlog.View.IsSelectView==1){
                            Km.Jifenlog.View.IsSelectView=0;
                            this.grid.showJifenlog();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Jifenlog.Config.View.IsShow==1){
                            Km.Jifenlog.View.IsSelectView=1;
                        }
                        this.grid.hideJifenlog();
                        Km.Jifenlog.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Jifenlog.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showJifenlog();
                this.tvpView.toggle(true);
            }else{
                this.hideJifenlog();
                Km.Jifenlog.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Jifenlog.Config.View.IsFix=1;
            }else{
               Km.Jifenlog.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Jifenlog.Config.View.IsShow=0;
                return ;
            }
            if (Km.Jifenlog.Config.View.IsShow==1){
               this.hideJifenlog();
               Km.Jifenlog.Config.View.IsShow=0;
            }
            this.showJifenlog();
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
         * 查询符合条件的会员积分日志
         */
        doSelectJifenlog : function() {
            if (this.topToolbar){
      				var jmember_id = this.topToolbar.jmember_id.getValue();
      				this.filter	= {'member_id':jmember_id};
            }
            var condition = {'start':0,'limit':Km.Jifenlog.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceJifenlog.queryPageJifenlog(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Jifenlog.Store.jifenlogStore.loadData(result);
                } else {
                    Km.Jifenlog.Store.jifenlogStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的会员券日志！');
                }
            });
        },
        /**
         * 显示会员积分日志视图
         * 显示会员积分日志的视图相对会员积分日志列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Jifenlog.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Jifenlog.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Jifenlog.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Jifenlog.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Jifenlog.View.Running.viewTabs);
                    break;
            }
            Km.Jifenlog.Cookie.set('View.Direction',Km.Jifenlog.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Jifenlog.Config.View.IsFix==0)&&(Km.Jifenlog.Config.View.IsShow==1)){
                    this.showJifenlog();
                }
                Km.Jifenlog.Config.View.IsFix=1;
                Km.Jifenlog.View.Running.jifenlogGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Jifenlog.Config.View.IsShow=0;
                this.showJifenlog();
            }
        },
        /**
         * 显示会员积分日志
         */
        showJifenlog : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择会员券日志！');
                Km.Jifenlog.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Jifenlog.Config.View.IsFix==0){
                if (Km.Jifenlog.View.Running.view_window==null){
                    Km.Jifenlog.View.Running.view_window=new Km.Jifenlog.View.JifenlogView.Window();
                }
                if (Km.Jifenlog.View.Running.view_window.hidden){
                    Km.Jifenlog.View.Running.view_window.show();
                    Km.Jifenlog.View.Running.view_window.winTabs.hideTabStripItem(Km.Jifenlog.View.Running.view_window.winTabs.tabFix);
                    this.updateViewJifenlog();
                    this.tvpView.toggle(true);
                    Km.Jifenlog.Config.View.IsShow=1;
                }else{
                    this.hideJifenlog();
                    Km.Jifenlog.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Jifenlog.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Jifenlog.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Jifenlog.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Jifenlog.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Jifenlog.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Jifenlog.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Jifenlog.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Jifenlog.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Jifenlog.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideJifenlog();
            if (Km.Jifenlog.Config.View.IsShow==0){
                Km.Jifenlog.View.Running.viewTabs.enableCollapse();
                switch(Km.Jifenlog.Config.View.Direction){
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
                this.updateViewJifenlog();
                this.tvpView.toggle(true);
                Km.Jifenlog.Config.View.IsShow=1;
            }else{
                Km.Jifenlog.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏会员积分日志
         */
        hideJifenlog : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Jifenlog.View.Running.view_window!=null){
                Km.Jifenlog.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前会员积分日志显示信息
         */
        updateViewJifenlog : function() {

            if (Km.Jifenlog.View.Running.view_window!=null){
                Km.Jifenlog.View.Running.view_window.winTabs.tabJifenlogDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Jifenlog.View.Running.viewTabs.tabJifenlogDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建会员积分日志
         */
        addJifenlog : function() {
            if (Km.Jifenlog.View.Running.edit_window==null){
                Km.Jifenlog.View.Running.edit_window=new Km.Jifenlog.View.EditWindow();
            }
            Km.Jifenlog.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Jifenlog.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Jifenlog.View.Running.edit_window.setTitle('添加会员券日志');
            Km.Jifenlog.View.Running.edit_window.savetype=0;
            Km.Jifenlog.View.Running.edit_window.jifenlog_id.setValue("");

            Km.Jifenlog.View.Running.edit_window.show();
            Km.Jifenlog.View.Running.edit_window.maximize();
        },
        /**
         * 编辑会员积分日志时先获得选中的会员积分日志信息
         */
        updateJifenlog : function() {
            if (Km.Jifenlog.View.Running.edit_window==null){
                Km.Jifenlog.View.Running.edit_window=new Km.Jifenlog.View.EditWindow();
            }
            Km.Jifenlog.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Jifenlog.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Jifenlog.View.Running.edit_window.setTitle('修改会员券日志');
            Km.Jifenlog.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Jifenlog.View.Running.edit_window.savetype=1;

            Km.Jifenlog.View.Running.edit_window.show();
            Km.Jifenlog.View.Running.edit_window.maximize();
        },
        /**
         * 删除会员积分日志
         */
        deleteJifenlog : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的会员券日志吗?', this.confirmDeleteJifenlog,this);
        },
        /**
         * 确认删除会员积分日志
         */
        confirmDeleteJifenlog : function(btn) {
            if (btn == 'yes') {
                var del_jifenlog_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_jifenlog_ids=del_jifenlog_ids+selectedRows[flag].data.jifenlog_id+",";
                }
                ExtServiceJifenlog.deleteByIds(del_jifenlog_ids);
                this.doSelectJifenlog();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出会员积分日志
         */
        exportJifenlog : function() {
            ExtServiceJifenlog.exportJifenlog(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入会员积分日志
         */
        importJifenlog : function() {
            if (Km.Jifenlog.View.current_uploadWindow==null){
                Km.Jifenlog.View.current_uploadWindow=new Km.Jifenlog.View.UploadWindow();
            }
            Km.Jifenlog.View.current_uploadWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Jifenlog.View.Running.jifenlogGrid=new Km.Jifenlog.View.Grid();
            if (Km.Jifenlog.Config.View.IsFix==0){
                Km.Jifenlog.View.Running.jifenlogGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Jifenlog.View.Running.jifenlogGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Jifenlog.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Jifenlog.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前会员积分日志Grid对象
         */
        jifenlogGrid:null,

        /**
         * 显示会员积分日志信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Jifenlog.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Jifenlog.Init();
    /**
     * 会员积分日志数据模型获取数据Direct调用
     */
    Km.Jifenlog.Store.jifenlogStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceJifenlog.queryPageJifenlog}
    });
    /**
     * 会员积分日志页面布局
     */
    Km.Jifenlog.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Jifenlog.View.Panel()]
    });
    Km.Jifenlog.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
