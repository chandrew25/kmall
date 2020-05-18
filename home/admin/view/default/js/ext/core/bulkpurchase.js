Ext.namespace("Kmall.Admin.Bulkpurchase");
Km = Kmall.Admin;
Km.Bulkpurchase={
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
             * 显示大宗采购的视图相对大宗采购列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示大宗采购信息页(或者打开新窗口)
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
        if (Km.Bulkpurchase.Cookie.get('View.Direction')){
            Km.Bulkpurchase.Config.View.Direction=Km.Bulkpurchase.Cookie.get('View.Direction');
        }
        if (Km.Bulkpurchase.Cookie.get('View.IsFix')!=null){
            Km.Bulkpurchase.Config.View.IsFix=Km.Bulkpurchase.Cookie.get('View.IsFix');
        }
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.Bulkpurchase.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }

    }
};
/**
 * Model:数据模型
 */
Km.Bulkpurchase.Store = {
    /**
     * 大宗采购
     */
    bulkpurchaseStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'bulkpurchase_id',type: 'int'},
                {name: 'product_id',type: 'int'},
                {name: 'product_name',type: 'string'},
                {name: 'customername',type: 'string'},
                {name: 'requirement',type: 'string'},
                {name: 'telephone',type: 'string'},
                {name: 'company_name',type: 'string'},
                {name: 'email',type: 'string'},
                {name: 'isolve',type: 'string'},
                {name: 'suggestion',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Bulkpurchase.Config.PageSize;
                    Ext.apply(options.params, Km.Bulkpurchase.View.Running.bulkpurchaseGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 商品
     */
    productStoreForCombo:new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/product.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'products',
            autoLoad: true,
            totalProperty: 'totalCount',
            idProperty: 'product_id'
        }, [
            {name: 'product_id', mapping: 'product_id'},
            {name: 'product_name', mapping: 'product_name'}
        ])
    })
};
/**
 * View:大宗采购显示组件
 */
Km.Bulkpurchase.View={
    /**
     * 编辑窗口：新建或者修改大宗采购
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
                        switch (Km.Bulkpurchase.Config.OnlineEditor)
                        {
                            case 2:
                                Km.Bulkpurchase.View.EditWindow.KindEditor_requirement = KindEditor.create('textarea[name="requirement"]',{width:'98%',minHeith:'350px', filterMode:true});
                                Km.Bulkpurchase.View.EditWindow.KindEditor_suggestion = KindEditor.create('textarea[name="suggestion"]',{width:'98%',minHeith:'350px', filterMode:true});
                                break
                            case 3:
                                pageInit_requirement();
                                pageInit_suggestion();
                                break
                            default:
                                ckeditor_replace_requirement();
                                ckeditor_replace_suggestion();
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
                            {xtype: 'hidden',  name : 'bulkpurchase_id',ref:'../bulkpurchase_id'},
                            {xtype: 'hidden',name : 'product_id',ref:'../product_id'},
                            {
                                 fieldLabel : '商品',xtype: 'combo',name : 'product_name',ref : '../product_name',
                                 store:Km.Bulkpurchase.Store.productStoreForCombo,emptyText: '请选择商品',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Bulkpurchase.Config.PageSize,
                                 displayField:'product_name',grid:this,
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                     '<tpl for="."><div class="search-item">',
                                         '<h3>{product_name}</h3>',
                                     '</div></tpl>'
                                 ),
                                 listeners:{
                                     'beforequery': function(event){delete event.combo.lastQuery;}
                                 },
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        this.grid.product_id.setValue(record.data.product_id);
                                        this.grid.product_name.setValue(record.data.product_name);
                                        this.collapse();
                                     }
                                 }
                            },
                            {fieldLabel : '姓名',name : 'customername'},
                            {fieldLabel : '需求',name : 'requirement',xtype : 'textarea',id:'requirement',ref:'requirement'},
                            {fieldLabel : '联系电话',name : 'telephone'},
                            {fieldLabel : '公司名称',name : 'company_name'},
                            {fieldLabel : '邮箱地址',name : 'email'},
                            {fieldLabel : '是否已经处理',hiddenName : 'isolve'
                                 ,xtype : 'combo',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否已经处理',
                                 valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '处理意见',name : 'suggestion',xtype : 'textarea',id:'suggestion',ref:'suggestion'}
                        ]
                    })
                ],
                buttons : [{
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {
                        switch (Km.Bulkpurchase.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Bulkpurchase.View.EditWindow.KindEditor_requirement)this.editForm.requirement.setValue(Km.Bulkpurchase.View.EditWindow.KindEditor_requirement.html());
                                if (Km.Bulkpurchase.View.EditWindow.KindEditor_suggestion)this.editForm.suggestion.setValue(Km.Bulkpurchase.View.EditWindow.KindEditor_suggestion.html());
                                break
                            case 3:
                                if (xhEditor_requirement)this.editForm.requirement.setValue(xhEditor_requirement.getSource());
                                if (xhEditor_suggestion)this.editForm.suggestion.setValue(xhEditor_suggestion.getSource());
                                break
                            default:
                                if (CKEDITOR.instances.requirement) this.editForm.requirement.setValue(CKEDITOR.instances.requirement.getData());
                                if (CKEDITOR.instances.suggestion) this.editForm.suggestion.setValue(CKEDITOR.instances.suggestion.getData());
                        }

                        if (!this.editForm.getForm().isValid()) {
                            return;
                        }
                        editWindow=this;
                        if (this.savetype==0){
                            this.editForm.api.submit=ExtServiceBulkpurchase.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Bulkpurchase.View.Running.bulkpurchaseGrid.doSelectBulkpurchase();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceBulkpurchase.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.Bulkpurchase.View.Running.bulkpurchaseGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Bulkpurchase.View.Running.bulkpurchaseGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Bulkpurchase.View.Running.bulkpurchaseGrid.getSelectionModel().getSelected());
                        switch (Km.Bulkpurchase.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Bulkpurchase.View.EditWindow.KindEditor_requirement) Km.Bulkpurchase.View.EditWindow.KindEditor_requirement.html(Km.Bulkpurchase.View.Running.bulkpurchaseGrid.getSelectionModel().getSelected().data.requirement);
                                if (Km.Bulkpurchase.View.EditWindow.KindEditor_suggestion) Km.Bulkpurchase.View.EditWindow.KindEditor_suggestion.html(Km.Bulkpurchase.View.Running.bulkpurchaseGrid.getSelectionModel().getSelected().data.suggestion);
                                break
                            case 3:
                                break
                            default:
                                if (CKEDITOR.instances.requirement) CKEDITOR.instances.requirement.setData(Km.Bulkpurchase.View.Running.bulkpurchaseGrid.getSelectionModel().getSelected().data.requirement);
                                if (CKEDITOR.instances.suggestion) CKEDITOR.instances.suggestion.setData(Km.Bulkpurchase.View.Running.bulkpurchaseGrid.getSelectionModel().getSelected().data.suggestion);
                        }

                    }
                }]
            }, config);
            Km.Bulkpurchase.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示大宗采购详情
     */
    BulkpurchaseView:{
        /**
         * Tab页：容器包含显示与大宗采购所有相关的信息
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
                                if (Km.Bulkpurchase.View.Running.bulkpurchaseGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择大宗采购！');
                                    return false;
                                }
                                Km.Bulkpurchase.Config.View.IsShow=1;
                                Km.Bulkpurchase.View.Running.bulkpurchaseGrid.showBulkpurchase();
                                Km.Bulkpurchase.View.Running.bulkpurchaseGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Bulkpurchase.View.BulkpurchaseView.Tabs.superclass.constructor.call(this, config);

                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Bulkpurchase.Config.View.Direction==1)||(Km.Bulkpurchase.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabBulkpurchaseDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">商品</td><td class="content">{product_name}</td></tr>',
                         '    <tr class="entry"><td class="head">姓名</td><td class="content">{customername}</td></tr>',
                         '    <tr class="entry"><td class="head">需求</td><td class="content">{requirement}</td></tr>',
                         '    <tr class="entry"><td class="head">联系电话</td><td class="content">{telephone}</td></tr>',
                         '    <tr class="entry"><td class="head">公司名称</td><td class="content">{company_name}</td></tr>',
                         '    <tr class="entry"><td class="head">邮箱地址</td><td class="content">{email}</td></tr>',
                         '    <tr class="entry"><td class="head">是否已经处理</td><td class="content"><tpl if="isolve == true">是</tpl><tpl if="isolve == false">否</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">处理意见</td><td class="content">{suggestion}</td></tr>',
                         '</table>'
                     ]}
                );
                this.add(
                    {title: '其他',iconCls:'tabs'}
                );
            }
        }),
        /**
         * 窗口:显示大宗采购信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看大宗采购",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Bulkpurchase.View.BulkpurchaseView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Bulkpurchase.Config.View.IsShow=0;
                            Km.Bulkpurchase.View.Running.bulkpurchaseGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Bulkpurchase.View.Running.bulkpurchaseGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Bulkpurchase.View.Running.bulkpurchaseGrid.addBulkpurchase();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Bulkpurchase.View.Running.bulkpurchaseGrid.updateBulkpurchase();}
                    }]
                }, config);
                Km.Bulkpurchase.View.BulkpurchaseView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 窗口：批量上传大宗采购
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传大宗采购数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传大宗采购Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadBulkpurchase',
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Bulkpurchase.View.Running.bulkpurchaseGrid.doSelectBulkpurchase();
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
            Km.Bulkpurchase.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：大宗采购列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Bulkpurchase.Store.bulkpurchaseStore,
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
                        {header : '标识',dataIndex : 'bulkpurchase_id',hidden:true},
                        {header : '商品',dataIndex : 'product_name'},
                        {header : '姓名',dataIndex : 'customername'},
                        {header : '联系电话',dataIndex : 'telephone'},
                        {header : '公司名称',dataIndex : 'company_name'},
                        {header : '邮箱地址',dataIndex : 'email'},
                        {header : '是否已经处理',dataIndex : 'isolve',renderer:function(value){if (value == true) {return "是";}else{return "否";}}}
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
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectBulkpurchase();
                                    }
                                }
                            },
                            items : [
                                '商品 ','&nbsp;&nbsp;',{ref: '../bproduct_id',xtype: 'combo',
                                     store:Km.Bulkpurchase.Store.productStoreForCombo,hiddenName : 'product_id',
                                     emptyText: '请选择商品',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width:280,pageSize:Km.Bulkpurchase.Config.PageSize,
                                     displayField:'name',valueField:'product_id',
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                         '<tpl for="."><div class="search-item">',
                                         '<h3>{name}</h3>',
                                         '</div></tpl>'
                                     )
                                },'&nbsp;&nbsp;',
                                '公司名称 ','&nbsp;&nbsp;',{ref: '../bcompany_name'},'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectBulkpurchase();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.bproduct_id.setValue("");
                                        this.topToolbar.bcompany_name.setValue("");
                                        this.filter={};
                                        this.doSelectBulkpurchase();
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
                                    text : '添加大宗采购',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addBulkpurchase();
                                    }
                                },'-',{
                                    text : '修改大宗采购',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateBulkpurchase();
                                    }
                                },'-',{
                                    text : '删除大宗采购', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteBulkpurchase();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importBulkpurchase();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入大宗采购',iconCls : 'icon-import',scope:this,handler:function(){this.importBulkpurchase()}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportBulkpurchase();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看大宗采购', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showBulkpurchase()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideBulkpurchase();Km.Bulkpurchase.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Bulkpurchase.Cookie.set('View.IsFix',Km.Bulkpurchase.Config.View.IsFix);}}
                                        ]}
                                },'-']}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Bulkpurchase.Config.PageSize,
                    store: Km.Bulkpurchase.Store.bulkpurchaseStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Bulkpurchase.Viewport){
                                if (Km.Bulkpurchase.Config.View.IsShow==1){
                                    Km.Bulkpurchase.View.IsSelectView=1;
                                }
                                this.ownerCt.hideBulkpurchase();
                                Km.Bulkpurchase.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Bulkpurchase.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Bulkpurchase.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Bulkpurchase.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectBulkpurchase();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Bulkpurchase.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Bulkpurchase.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectBulkpurchase();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示大宗采购列表
            this.doSelectBulkpurchase();
            Km.Bulkpurchase.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的大宗采购信息Tab页
            Km.Bulkpurchase.View.Running.viewTabs=new Km.Bulkpurchase.View.BulkpurchaseView.Tabs();
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
                    this.grid.updateViewBulkpurchase();
                    if (sm.getCount() != 1){
                        this.grid.hideBulkpurchase();
                        Km.Bulkpurchase.Config.View.IsShow=0;
                    }else{
                        if (Km.Bulkpurchase.View.IsSelectView==1){
                            Km.Bulkpurchase.View.IsSelectView=0;
                            this.grid.showBulkpurchase();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Bulkpurchase.Config.View.IsShow==1){
                            Km.Bulkpurchase.View.IsSelectView=1;
                        }
                        this.grid.hideBulkpurchase();
                        Km.Bulkpurchase.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Bulkpurchase.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showBulkpurchase();
                this.tvpView.toggle(true);
            }else{
                this.hideBulkpurchase();
                Km.Bulkpurchase.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Bulkpurchase.Config.View.IsFix=1;
            }else{
               Km.Bulkpurchase.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Bulkpurchase.Config.View.IsShow=0;
                return ;
            }
            if (Km.Bulkpurchase.Config.View.IsShow==1){
               this.hideBulkpurchase();
               Km.Bulkpurchase.Config.View.IsShow=0;
            }
            this.showBulkpurchase();
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
         * 查询符合条件的大宗采购
         */
        doSelectBulkpurchase : function() {
            if (this.topToolbar){
                var bproduct_id = this.topToolbar.bproduct_id.getValue();
                var bcompany_name = this.topToolbar.bcompany_name.getValue();
                this.filter       ={'product_id':bproduct_id,'company_name':bcompany_name};
            }
            var condition = {'start':0,'limit':Km.Bulkpurchase.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceBulkpurchase.queryPageBulkpurchase(condition,function(provider, response) {
                if (response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Bulkpurchase.Store.bulkpurchaseStore.loadData(result);
                } else {
                    Km.Bulkpurchase.Store.bulkpurchaseStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的大宗采购！');
                }
            });
        },
        /**
         * 显示大宗采购视图
         * 显示大宗采购的视图相对大宗采购列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Bulkpurchase.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Bulkpurchase.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Bulkpurchase.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Bulkpurchase.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Bulkpurchase.View.Running.viewTabs);
                    break;
            }
            Km.Bulkpurchase.Cookie.set('View.Direction',Km.Bulkpurchase.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Bulkpurchase.Config.View.IsFix==0)&&(Km.Bulkpurchase.Config.View.IsShow==1)){
                    this.showBulkpurchase();
                }
                Km.Bulkpurchase.Config.View.IsFix=1;
                Km.Bulkpurchase.View.Running.bulkpurchaseGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Bulkpurchase.Config.View.IsShow=0;
                this.showBulkpurchase();
            }
        },
        /**
         * 显示大宗采购
         */
        showBulkpurchase : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择大宗采购！');
                Km.Bulkpurchase.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Bulkpurchase.Config.View.IsFix==0){
                if (Km.Bulkpurchase.View.Running.view_window==null){
                    Km.Bulkpurchase.View.Running.view_window=new Km.Bulkpurchase.View.BulkpurchaseView.Window();
                }
                if (Km.Bulkpurchase.View.Running.view_window.hidden){
                    Km.Bulkpurchase.View.Running.view_window.show();
                    Km.Bulkpurchase.View.Running.view_window.winTabs.hideTabStripItem(Km.Bulkpurchase.View.Running.view_window.winTabs.tabFix);
                    this.updateViewBulkpurchase();
                    this.tvpView.toggle(true);
                    Km.Bulkpurchase.Config.View.IsShow=1;
                }else{
                    this.hideBulkpurchase();
                    Km.Bulkpurchase.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Bulkpurchase.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Bulkpurchase.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Bulkpurchase.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Bulkpurchase.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Bulkpurchase.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Bulkpurchase.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Bulkpurchase.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Bulkpurchase.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Bulkpurchase.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideBulkpurchase();
            if (Km.Bulkpurchase.Config.View.IsShow==0){
                Km.Bulkpurchase.View.Running.viewTabs.enableCollapse();
                switch(Km.Bulkpurchase.Config.View.Direction){
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
                this.updateViewBulkpurchase();
                this.tvpView.toggle(true);
                Km.Bulkpurchase.Config.View.IsShow=1;
            }else{
                Km.Bulkpurchase.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏大宗采购
         */
        hideBulkpurchase : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Bulkpurchase.View.Running.view_window!=null){
                Km.Bulkpurchase.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前大宗采购显示信息
         */
        updateViewBulkpurchase : function() {

            if (Km.Bulkpurchase.View.Running.view_window!=null){
                Km.Bulkpurchase.View.Running.view_window.winTabs.tabBulkpurchaseDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Bulkpurchase.View.Running.viewTabs.tabBulkpurchaseDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建大宗采购
         */
        addBulkpurchase : function() {
            if (Km.Bulkpurchase.View.Running.edit_window==null){
                Km.Bulkpurchase.View.Running.edit_window=new Km.Bulkpurchase.View.EditWindow();
            }
            Km.Bulkpurchase.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Bulkpurchase.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Bulkpurchase.View.Running.edit_window.setTitle('添加大宗采购');
            Km.Bulkpurchase.View.Running.edit_window.savetype=0;
            Km.Bulkpurchase.View.Running.edit_window.bulkpurchase_id.setValue("");
            switch (Km.Bulkpurchase.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Bulkpurchase.View.EditWindow.KindEditor_requirement) Km.Bulkpurchase.View.EditWindow.KindEditor_requirement.html("");
                    if (Km.Bulkpurchase.View.EditWindow.KindEditor_suggestion) Km.Bulkpurchase.View.EditWindow.KindEditor_suggestion.html("");
                    break
                case 3:
                    break
                default:
                    if (CKEDITOR.instances.requirement) CKEDITOR.instances.requirement.setData("");
                    if (CKEDITOR.instances.suggestion) CKEDITOR.instances.suggestion.setData("");
            }

            Km.Bulkpurchase.View.Running.edit_window.show();
            Km.Bulkpurchase.View.Running.edit_window.maximize();
        },
        /**
         * 编辑大宗采购时先获得选中的大宗采购信息
         */
        updateBulkpurchase : function() {
            if (Km.Bulkpurchase.View.Running.edit_window==null){
                Km.Bulkpurchase.View.Running.edit_window=new Km.Bulkpurchase.View.EditWindow();
            }
            Km.Bulkpurchase.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Bulkpurchase.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Bulkpurchase.View.Running.edit_window.setTitle('修改大宗采购');
            Km.Bulkpurchase.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Bulkpurchase.View.Running.edit_window.savetype=1;
            switch (Km.Bulkpurchase.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Bulkpurchase.View.EditWindow.KindEditor_requirement) Km.Bulkpurchase.View.EditWindow.KindEditor_requirement.html(this.getSelectionModel().getSelected().data.requirement);
                    if (Km.Bulkpurchase.View.EditWindow.KindEditor_suggestion) Km.Bulkpurchase.View.EditWindow.KindEditor_suggestion.html(this.getSelectionModel().getSelected().data.suggestion);
                    break
                case 3:
                    if (xhEditor_requirement)xhEditor_requirement.setSource(this.getSelectionModel().getSelected().data.requirement);
                    if (xhEditor_suggestion)xhEditor_suggestion.setSource(this.getSelectionModel().getSelected().data.suggestion);
                    break
                default:
                    if (CKEDITOR.instances.requirement) CKEDITOR.instances.requirement.setData(this.getSelectionModel().getSelected().data.requirement);
                    if (CKEDITOR.instances.suggestion) CKEDITOR.instances.suggestion.setData(this.getSelectionModel().getSelected().data.suggestion);
            }

            Km.Bulkpurchase.View.Running.edit_window.show();
            Km.Bulkpurchase.View.Running.edit_window.maximize();
        },
        /**
         * 删除大宗采购
         */
        deleteBulkpurchase : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的大宗采购吗?', this.confirmDeleteBulkpurchase,this);
        },
        /**
         * 确认删除大宗采购
         */
        confirmDeleteBulkpurchase : function(btn) {
            if (btn == 'yes') {
                var del_bulkpurchase_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_bulkpurchase_ids=del_bulkpurchase_ids+selectedRows[flag].data.bulkpurchase_id+",";
                }
                ExtServiceBulkpurchase.deleteByIds(del_bulkpurchase_ids);
                this.doSelectBulkpurchase();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出大宗采购
         */
        exportBulkpurchase : function() {
            ExtServiceBulkpurchase.exportBulkpurchase(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入大宗采购
         */
        importBulkpurchase : function() {
            if (Km.Bulkpurchase.View.current_uploadWindow==null){
                Km.Bulkpurchase.View.current_uploadWindow=new Km.Bulkpurchase.View.UploadWindow();
            }
            Km.Bulkpurchase.View.current_uploadWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Bulkpurchase.View.Running.bulkpurchaseGrid=new Km.Bulkpurchase.View.Grid();
            if (Km.Bulkpurchase.Config.View.IsFix==0){
                Km.Bulkpurchase.View.Running.bulkpurchaseGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Bulkpurchase.View.Running.bulkpurchaseGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Bulkpurchase.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Bulkpurchase.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前大宗采购Grid对象
         */
        bulkpurchaseGrid:null,

        /**
         * 显示大宗采购信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Bulkpurchase.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Bulkpurchase.Init();
    /**
     * 大宗采购数据模型获取数据Direct调用
     */
    Km.Bulkpurchase.Store.bulkpurchaseStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceBulkpurchase.queryPageBulkpurchase}
    });
    /**
     * 大宗采购页面布局
     */
    Km.Bulkpurchase.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Bulkpurchase.View.Panel()]
    });
    Km.Bulkpurchase.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});