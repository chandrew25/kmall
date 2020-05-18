Ext.namespace("Kmall.Admin.Consult");
Km = Kmall.Admin;
Km.Consult={
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
             * 显示顾客留言的视图相对顾客留言列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示顾客留言信息页(或者打开新窗口)
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
        if (Km.Consult.Cookie.get('View.Direction')){
            Km.Consult.Config.View.Direction=Km.Consult.Cookie.get('View.Direction');
        }
        if (Km.Consult.Cookie.get('View.IsFix')!=null){
            Km.Consult.Config.View.IsFix=Km.Consult.Cookie.get('View.IsFix');
        }
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.Consult.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }

    }
};
/**
 * Model:数据模型
 */
Km.Consult.Store = {
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
                {name: 'ship_name',type: 'string'},
                {name: 'member_id',type: 'int'},
                {name: 'username',type: 'string'},
                {name: 'title',type: 'string'},
                {name: 'comments',type: 'string'},
                {name: 'reply',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Consult.Config.PageSize;
                    Ext.apply(options.params, Km.Consult.View.Running.consultGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 订单
     */
    orderStoreForCombo:new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/order.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'orders',
            autoLoad: true,
            totalProperty: 'totalCount',
            idProperty: 'order_id'
        }, [
            {name: 'order_id', mapping: 'order_id'},
            {name: 'ship_name', mapping: 'ship_name'}
        ])
    }),
    /**
     * 会员
     */
    memberStoreForCombo:new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/member.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'members',
            autoLoad: true,
            totalProperty: 'totalCount',
            idProperty: 'member_id'
        }, [
            {name: 'member_id', mapping: 'member_id'},
            {name: 'username', mapping: 'username'}
        ])
    })
};
/**
 * View:顾客留言显示组件
 */
Km.Consult.View={
    /**
     * 编辑窗口：新建或者修改顾客留言
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
                        switch (Km.Consult.Config.OnlineEditor)
                        {
                            case 2:
                                Km.Consult.View.EditWindow.KindEditor_comments = KindEditor.create('textarea[name="comments"]',{width:'98%',minHeith:'350px', filterMode:true});
                                Km.Consult.View.EditWindow.KindEditor_reply = KindEditor.create('textarea[name="reply"]',{width:'98%',minHeith:'350px', filterMode:true});
                                break
                            case 3:
                                pageInit_comments();
                                pageInit_reply();
                                break
                            default:
                                ckeditor_replace_comments();
                                ckeditor_replace_reply();
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
                            {xtype: 'hidden',name : 'consult_id',ref:'../consult_id'},
                            {xtype: 'hidden',name : 'order_id',ref:'../order_id'},
                            {
                                 fieldLabel : '订单',xtype: 'combo',name : 'ship_name',ref : '../ship_name',
                                 store:Km.Consult.Store.orderStoreForCombo,emptyText: '请选择订单',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Consult.Config.PageSize,
                                 displayField:'ship_name',grid:this,
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                     '<tpl for="."><div class="search-item">',
                                         '<h3>{ship_name}</h3>',
                                     '</div></tpl>'
                                 ),
                                 listeners:{
                                     'beforequery': function(event){delete event.combo.lastQuery;}
                                 },
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        this.grid.order_id.setValue(record.data.order_id);
                                        this.grid.ship_name.setValue(record.data.ship_name);
                                        this.collapse();
                                     }
                                 }
                            },
                            {xtype: 'hidden',name : 'member_id',ref:'../member_id'},
                            {
                                 fieldLabel : '会员',xtype: 'combo',name : 'username',ref : '../username',
                                 store:Km.Consult.Store.memberStoreForCombo,emptyText: '请选择会员',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Consult.Config.PageSize,
                                 displayField:'username',grid:this,
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                     '<tpl for="."><div class="search-item">',
                                         '<h3>{username}</h3>',
                                     '</div></tpl>'
                                 ),
                                 listeners:{
                                     'beforequery': function(event){delete event.combo.lastQuery;}
                                 },
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        this.grid.member_id.setValue(record.data.member_id);
                                        this.grid.username.setValue(record.data.username);
                                        this.collapse();
                                     }
                                 }
                            },
                            {fieldLabel : '标题',name : 'title'},
                            {fieldLabel : '评论',name : 'comments',xtype : 'textarea',id:'comments',ref:'comments'},
                            {fieldLabel : '答复',name : 'reply',xtype : 'textarea',id:'reply',ref:'reply'}
                        ]
                    })
                ],
                buttons : [{
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {
                        switch (Km.Consult.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Consult.View.EditWindow.KindEditor_comments)this.editForm.comments.setValue(Km.Consult.View.EditWindow.KindEditor_comments.html());
                                if (Km.Consult.View.EditWindow.KindEditor_reply)this.editForm.reply.setValue(Km.Consult.View.EditWindow.KindEditor_reply.html());
                                break
                            case 3:
                                if (xhEditor_comments)this.editForm.comments.setValue(xhEditor_comments.getSource());
                                if (xhEditor_reply)this.editForm.reply.setValue(xhEditor_reply.getSource());
                                break
                            default:
                                if (CKEDITOR.instances.comments) this.editForm.comments.setValue(CKEDITOR.instances.comments.getData());
                                if (CKEDITOR.instances.reply) this.editForm.reply.setValue(CKEDITOR.instances.reply.getData());
                        }

                        if (!this.editForm.getForm().isValid()) {
                            return;
                        }
                        editWindow=this;
                        if (this.savetype==0){
                            this.editForm.api.submit=ExtServiceConsult.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Consult.View.Running.consultGrid.doSelectConsult();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceConsult.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.Consult.View.Running.consultGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Consult.View.Running.consultGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Consult.View.Running.consultGrid.getSelectionModel().getSelected());
                        switch (Km.Consult.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Consult.View.EditWindow.KindEditor_comments) Km.Consult.View.EditWindow.KindEditor_comments.html(Km.Consult.View.Running.consultGrid.getSelectionModel().getSelected().data.comments);
                                if (Km.Consult.View.EditWindow.KindEditor_reply) Km.Consult.View.EditWindow.KindEditor_reply.html(Km.Consult.View.Running.consultGrid.getSelectionModel().getSelected().data.reply);
                                break
                            case 3:
                                break
                            default:
                                if (CKEDITOR.instances.comments) CKEDITOR.instances.comments.setData(Km.Consult.View.Running.consultGrid.getSelectionModel().getSelected().data.comments);
                                if (CKEDITOR.instances.reply) CKEDITOR.instances.reply.setData(Km.Consult.View.Running.consultGrid.getSelectionModel().getSelected().data.reply);
                        }

                    }
                }]
            }, config);
            Km.Consult.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示顾客留言详情
     */
    ConsultView:{
        /**
         * Tab页：容器包含显示与顾客留言所有相关的信息
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
                                if (Km.Consult.View.Running.consultGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择顾客留言！');
                                    return false;
                                }
                                Km.Consult.Config.View.IsShow=1;
                                Km.Consult.View.Running.consultGrid.showConsult();
                                Km.Consult.View.Running.consultGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Consult.View.ConsultView.Tabs.superclass.constructor.call(this, config);

                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Consult.Config.View.Direction==1)||(Km.Consult.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabConsultDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">订单</td><td class="content">{ship_name}</td></tr>',
                         '    <tr class="entry"><td class="head">会员</td><td class="content">{username}</td></tr>',
                         '    <tr class="entry"><td class="head">标题</td><td class="content">{title}</td></tr>',
                         '    <tr class="entry"><td class="head">评论</td><td class="content">{comments}</td></tr>',
                         '    <tr class="entry"><td class="head">答复</td><td class="content">{reply}</td></tr>',
                         '</table>'
                     ]}
                );
                this.add(
                    {title: '其他',iconCls:'tabs'}
                );
            }
        }),
        /**
         * 窗口:显示顾客留言信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看顾客留言",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Consult.View.ConsultView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Consult.Config.View.IsShow=0;
                            Km.Consult.View.Running.consultGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Consult.View.Running.consultGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Consult.View.Running.consultGrid.addConsult();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Consult.View.Running.consultGrid.updateConsult();}
                    }]
                }, config);
                Km.Consult.View.ConsultView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 窗口：批量上传顾客留言
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传顾客留言数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传顾客留言Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadConsult',
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Consult.View.Running.consultGrid.doSelectConsult();
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
            Km.Consult.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：顾客留言列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Consult.Store.consultStore,
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
                        {header : '标识',dataIndex : 'consult_id',hidden:true},
                        {header : '订单',dataIndex : 'ship_name'},
                        {header : '会员',dataIndex : 'username'},
                        {header : '标题',dataIndex : 'title'}
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
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectConsult();
                                    }
                                }
                            },
                            items : [
                                '订单 ','&nbsp;&nbsp;',{ref: '../corder_id',xtype: 'combo',
                                     store:Km.Consult.Store.orderStoreForCombo,hiddenName : 'order_id',
                                     emptyText: '请选择订单',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width:280,pageSize:Km.Consult.Config.PageSize,
                                     displayField:'ship_name',valueField:'order_id',
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                         '<tpl for="."><div class="search-item">',
                                         '<h3>{ship_name}</h3>',
                                         '</div></tpl>'
                                     )
                                },'&nbsp;&nbsp;',
                                '会员 ','&nbsp;&nbsp;',{ref: '../cmember_id',xtype: 'combo',
                                     store:Km.Consult.Store.memberStoreForCombo,hiddenName : 'member_id',
                                     emptyText: '请选择会员',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width:280,pageSize:Km.Consult.Config.PageSize,
                                     displayField:'username',valueField:'member_id',
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                         '<tpl for="."><div class="search-item">',
                                         '<h3>{username}</h3>',
                                         '</div></tpl>'
                                     )
                                },'&nbsp;&nbsp;',
                                '标题 ','&nbsp;&nbsp;',{ref: '../ctitle'},'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectConsult();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.corder_id.setValue("");
                                        this.topToolbar.cmember_id.setValue("");
                                        this.topToolbar.ctitle.setValue("");
                                        this.filter={};
                                        this.doSelectConsult();
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
                                    text : '添加顾客留言',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addConsult();
                                    }
                                },'-',{
                                    text : '修改顾客留言',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateConsult();
                                    }
                                },'-',{
                                    text : '删除顾客留言', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteConsult();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importConsult();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入顾客留言',iconCls : 'icon-import',scope:this,handler:function(){this.importConsult()}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportConsult();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看顾客留言', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showConsult()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideConsult();Km.Consult.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Consult.Cookie.set('View.IsFix',Km.Consult.Config.View.IsFix);}}
                                        ]}
                                },'-']}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Consult.Config.PageSize,
                    store: Km.Consult.Store.consultStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Consult.Viewport){
                                if (Km.Consult.Config.View.IsShow==1){
                                    Km.Consult.View.IsSelectView=1;
                                }
                                this.ownerCt.hideConsult();
                                Km.Consult.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Consult.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Consult.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Consult.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectConsult();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Consult.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Consult.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectConsult();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示顾客留言列表
            this.doSelectConsult();
            Km.Consult.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的顾客留言信息Tab页
            Km.Consult.View.Running.viewTabs=new Km.Consult.View.ConsultView.Tabs();
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
                    this.grid.updateViewConsult();
                    if (sm.getCount() != 1){
                        this.grid.hideConsult();
                        Km.Consult.Config.View.IsShow=0;
                    }else{
                        if (Km.Consult.View.IsSelectView==1){
                            Km.Consult.View.IsSelectView=0;
                            this.grid.showConsult();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Consult.Config.View.IsShow==1){
                            Km.Consult.View.IsSelectView=1;
                        }
                        this.grid.hideConsult();
                        Km.Consult.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Consult.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showConsult();
                this.tvpView.toggle(true);
            }else{
                this.hideConsult();
                Km.Consult.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Consult.Config.View.IsFix=1;
            }else{
               Km.Consult.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Consult.Config.View.IsShow=0;
                return ;
            }
            if (Km.Consult.Config.View.IsShow==1){
               this.hideConsult();
               Km.Consult.Config.View.IsShow=0;
            }
            this.showConsult();
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
         * 查询符合条件的顾客留言
         */
        doSelectConsult : function() {
            if (this.topToolbar){
                var corder_id = this.topToolbar.corder_id.getValue();
                var cmember_id = this.topToolbar.cmember_id.getValue();
                var ctitle = this.topToolbar.ctitle.getValue();
                this.filter       ={'order_id':corder_id,'member_id':cmember_id,'title':ctitle};
            }
            var condition = {'start':0,'limit':Km.Consult.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceConsult.queryPageConsult(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Consult.Store.consultStore.loadData(result);
                } else {
                    Km.Consult.Store.consultStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的顾客留言！');
                }
            });
        },
        /**
         * 显示顾客留言视图
         * 显示顾客留言的视图相对顾客留言列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Consult.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Consult.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Consult.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Consult.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Consult.View.Running.viewTabs);
                    break;
            }
            Km.Consult.Cookie.set('View.Direction',Km.Consult.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Consult.Config.View.IsFix==0)&&(Km.Consult.Config.View.IsShow==1)){
                    this.showConsult();
                }
                Km.Consult.Config.View.IsFix=1;
                Km.Consult.View.Running.consultGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Consult.Config.View.IsShow=0;
                this.showConsult();
            }
        },
        /**
         * 显示顾客留言
         */
        showConsult : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择顾客留言！');
                Km.Consult.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Consult.Config.View.IsFix==0){
                if (Km.Consult.View.Running.view_window==null){
                    Km.Consult.View.Running.view_window=new Km.Consult.View.ConsultView.Window();
                }
                if (Km.Consult.View.Running.view_window.hidden){
                    Km.Consult.View.Running.view_window.show();
                    Km.Consult.View.Running.view_window.winTabs.hideTabStripItem(Km.Consult.View.Running.view_window.winTabs.tabFix);
                    this.updateViewConsult();
                    this.tvpView.toggle(true);
                    Km.Consult.Config.View.IsShow=1;
                }else{
                    this.hideConsult();
                    Km.Consult.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Consult.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Consult.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Consult.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Consult.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Consult.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Consult.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Consult.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Consult.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Consult.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideConsult();
            if (Km.Consult.Config.View.IsShow==0){
                Km.Consult.View.Running.viewTabs.enableCollapse();
                switch(Km.Consult.Config.View.Direction){
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
                this.updateViewConsult();
                this.tvpView.toggle(true);
                Km.Consult.Config.View.IsShow=1;
            }else{
                Km.Consult.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏顾客留言
         */
        hideConsult : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Consult.View.Running.view_window!=null){
                Km.Consult.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前顾客留言显示信息
         */
        updateViewConsult : function() {

            if (Km.Consult.View.Running.view_window!=null){
                Km.Consult.View.Running.view_window.winTabs.tabConsultDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Consult.View.Running.viewTabs.tabConsultDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建顾客留言
         */
        addConsult : function() {
            if (Km.Consult.View.Running.edit_window==null){
                Km.Consult.View.Running.edit_window=new Km.Consult.View.EditWindow();
            }
            Km.Consult.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Consult.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Consult.View.Running.edit_window.setTitle('添加顾客留言');
            Km.Consult.View.Running.edit_window.savetype=0;
            Km.Consult.View.Running.edit_window.consult_id.setValue("");
            switch (Km.Consult.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Consult.View.EditWindow.KindEditor_comments) Km.Consult.View.EditWindow.KindEditor_comments.html("");
                    if (Km.Consult.View.EditWindow.KindEditor_reply) Km.Consult.View.EditWindow.KindEditor_reply.html("");
                    break
                case 3:
                    break
                default:
                    if (CKEDITOR.instances.comments) CKEDITOR.instances.comments.setData("");
                    if (CKEDITOR.instances.reply) CKEDITOR.instances.reply.setData("");
            }

            Km.Consult.View.Running.edit_window.show();
            Km.Consult.View.Running.edit_window.maximize();
        },
        /**
         * 编辑顾客留言时先获得选中的顾客留言信息
         */
        updateConsult : function() {
            if (Km.Consult.View.Running.edit_window==null){
                Km.Consult.View.Running.edit_window=new Km.Consult.View.EditWindow();
            }
            Km.Consult.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Consult.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Consult.View.Running.edit_window.setTitle('修改顾客留言');
            Km.Consult.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Consult.View.Running.edit_window.savetype=1;
            switch (Km.Consult.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Consult.View.EditWindow.KindEditor_comments) Km.Consult.View.EditWindow.KindEditor_comments.html(this.getSelectionModel().getSelected().data.comments);
                    if (Km.Consult.View.EditWindow.KindEditor_reply) Km.Consult.View.EditWindow.KindEditor_reply.html(this.getSelectionModel().getSelected().data.reply);
                    break
                case 3:
                    if (xhEditor_comments)xhEditor_comments.setSource(this.getSelectionModel().getSelected().data.comments);
                    if (xhEditor_reply)xhEditor_reply.setSource(this.getSelectionModel().getSelected().data.reply);
                    break
                default:
                    if (CKEDITOR.instances.comments) CKEDITOR.instances.comments.setData(this.getSelectionModel().getSelected().data.comments);
                    if (CKEDITOR.instances.reply) CKEDITOR.instances.reply.setData(this.getSelectionModel().getSelected().data.reply);
            }

            Km.Consult.View.Running.edit_window.show();
            Km.Consult.View.Running.edit_window.maximize();
        },
        /**
         * 删除顾客留言
         */
        deleteConsult : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的顾客留言吗?', this.confirmDeleteConsult,this);
        },
        /**
         * 确认删除顾客留言
         */
        confirmDeleteConsult : function(btn) {
            if (btn == 'yes') {
                var del_consult_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_consult_ids=del_consult_ids+selectedRows[flag].data.consult_id+",";
                }
                ExtServiceConsult.deleteByIds(del_consult_ids);
                this.doSelectConsult();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出顾客留言
         */
        exportConsult : function() {
            ExtServiceConsult.exportConsult(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入顾客留言
         */
        importConsult : function() {
            if (Km.Consult.View.current_uploadWindow==null){
                Km.Consult.View.current_uploadWindow=new Km.Consult.View.UploadWindow();
            }
            Km.Consult.View.current_uploadWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Consult.View.Running.consultGrid=new Km.Consult.View.Grid();
            if (Km.Consult.Config.View.IsFix==0){
                Km.Consult.View.Running.consultGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Consult.View.Running.consultGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Consult.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Consult.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前顾客留言Grid对象
         */
        consultGrid:null,

        /**
         * 显示顾客留言信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Consult.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Consult.Init();
    /**
     * 顾客留言数据模型获取数据Direct调用
     */
    Km.Consult.Store.consultStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceConsult.queryPageConsult}
    });
    /**
     * 顾客留言页面布局
     */
    Km.Consult.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Consult.View.Panel()]
    });
    Km.Consult.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});