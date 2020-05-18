Ext.namespace("Kmall.Admin.Invoice");
Km = Kmall.Admin;
Km.Invoice={
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
             * 显示订单发票的视图相对订单发票列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示订单发票信息页(或者打开新窗口)
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
        if (Km.Invoice.Cookie.get('View.Direction')){
            Km.Invoice.Config.View.Direction=Km.Invoice.Cookie.get('View.Direction');
        }
        if (Km.Invoice.Cookie.get('View.IsFix')!=null){
            Km.Invoice.Config.View.IsFix=Km.Invoice.Cookie.get('View.IsFix');
        }
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.Invoice.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }

    }
};
/**
 * Model:数据模型
 */
Km.Invoice.Store = {
    /**
     * 订单发票
     */
    invoiceStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'invoice_id',type: 'int'},
                {name: 'order_no',type: 'string'},
                {name: 'order_id',type: 'int'},
                {name: 'ship_name',type: 'string'},
                {name: 'member_id',type: 'int'},
                {name: 'username',type: 'string'},
                {name: 'invoice_code',type: 'int'},
                {name: 'invoice_stateShow',type: 'string'},
                {name: 'invoice_state',type: 'string'},
                {name: 'price',type: 'float'},
                {name: 'typeShow',type: 'string'},
                {name: 'type',type: 'string'},
                {name: 'type1_headerShow',type: 'string'},
                {name: 'type1_header',type: 'string'},
                {name: 'type1_name',type: 'string'},
                {name: 'company',type: 'string'},
                {name: 'content',type: 'string'},
                {name: 'taxpayer',type: 'string'},
                {name: 'reg_address',type: 'string'},
                {name: 'reg_tel',type: 'string'},
                {name: 'bank',type: 'string'},
                {name: 'bank_account',type: 'string'},
                {name: 'memo',type: 'string'},
                {name: 'fee',type: 'float'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Invoice.Config.PageSize;
                    Ext.apply(options.params, Km.Invoice.View.Running.invoiceGrid.filter);//保证分页也将查询条件带上
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
            {name: 'order_no', mapping: 'order_no'}
        ])
    })
};
/**
 * View:订单发票显示组件
 */
Km.Invoice.View={
    /**
     * 编辑窗口：新建或者修改订单发票
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
                        switch (Km.Invoice.Config.OnlineEditor)
                        {
                            case 2:
                                Km.Invoice.View.EditWindow.KindEditor_content = KindEditor.create('textarea[name="content"]',{width:'98%',minHeith:'350px', filterMode:true});
                                Km.Invoice.View.EditWindow.KindEditor_memo = KindEditor.create('textarea[name="memo"]',{width:'98%',minHeith:'350px', filterMode:true});
                                break
                            case 3:
                                pageInit_content();
                                pageInit_memo();
                                break
                            default:
                                ckeditor_replace_content();
                                ckeditor_replace_memo();
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
                            {xtype: 'hidden',name : 'invoice_id',ref:'../invoice_id'},
                            {xtype: 'hidden',name : 'order_id',ref:'../order_id'},
                            {
                                 fieldLabel : '订单',xtype: 'combo',name : 'order_no',ref : '../order_no',
                                 store:Km.Invoice.Store.orderStoreForCombo,emptyText: '请选择订单',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Invoice.Config.PageSize,
                                 displayField:'order_no',grid:this,
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                     '<tpl for="."><div class="search-item">',
                                         '<h3>{order_no}</h3>',
                                     '</div></tpl>'
                                 ),
                                 listeners:{
                                     'beforequery': function(event){delete event.combo.lastQuery;}
                                 },
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        this.grid.order_id.setValue(record.data.order_id);
                                        this.grid.order_no.setValue(record.data.order_no);
                                        this.collapse();
                                     }
                                 }
                            },
                            {fieldLabel : '会员',name : 'username',xtype : 'numberfield'},
                            {fieldLabel : '发票号',name : 'invoice_code',xtype : 'numberfield'},
                            {fieldLabel : '发票状态',hiddenName : 'invoice_state',xtype : 'combo',
                                mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                store : new Ext.data.SimpleStore({
                                    fields : ['value', 'text'],
                                    data : [['1', '待审核'],['2', '有效'],['3', '无效']]
                                }),emptyText: '请选择发票状态',
                                valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '开票金额',name : 'price',xtype : 'numberfield'},
                            {fieldLabel : '发票类型',hiddenName : 'type',xtype : 'combo',
                                mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                store : new Ext.data.SimpleStore({
                                    fields : ['value', 'text'],
                                    data : [['1', '普通发票'],['2', '增值税发票']]
                                }),emptyText: '请选择发票类型',
                                valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '发票抬头',hiddenName : 'type1_header',xtype : 'combo',
                                mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                store : new Ext.data.SimpleStore({
                                    fields : ['value', 'text'],
                                    data : [['1', '个人'],[' 2', '单位']]
                                }),emptyText: '请选择发票抬头',
                                valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '个人单位名称',name : 'type1_name'},
                            {fieldLabel : '单位名称',name : 'company'},
                            {fieldLabel : '发票内容',name : 'content',xtype : 'textarea',id:'content',ref:'content'},
                            {fieldLabel : '纳税人识别号',name : 'taxpayer'},
                            {fieldLabel : '注册地址',name : 'reg_address'},
                            {fieldLabel : '注册电话',name : 'reg_tel'},
                            {fieldLabel : '开户银行',name : 'bank'},
                            {fieldLabel : '银行账号',name : 'bank_account'},
                            {fieldLabel : '备注',name : 'memo',xtype : 'textarea',id:'memo',ref:'memo'},
                            {fieldLabel : '发票费用',name : 'fee',xtype : 'numberfield'}
                        ]
                    })
                ],
                buttons : [{
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {
                        switch (Km.Invoice.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Invoice.View.EditWindow.KindEditor_content)this.editForm.content.setValue(Km.Invoice.View.EditWindow.KindEditor_content.html());
                                if (Km.Invoice.View.EditWindow.KindEditor_memo)this.editForm.memo.setValue(Km.Invoice.View.EditWindow.KindEditor_memo.html());
                                break
                            case 3:
                                if (xhEditor_content)this.editForm.content.setValue(xhEditor_content.getSource());
                                if (xhEditor_memo)this.editForm.memo.setValue(xhEditor_memo.getSource());
                                break
                            default:
                                if (CKEDITOR.instances.content) this.editForm.content.setValue(CKEDITOR.instances.content.getData());
                                if (CKEDITOR.instances.memo) this.editForm.memo.setValue(CKEDITOR.instances.memo.getData());
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
                                    Km.Invoice.View.Running.invoiceGrid.doSelectInvoice();
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
                                    Km.Invoice.View.Running.invoiceGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Invoice.View.Running.invoiceGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Invoice.View.Running.invoiceGrid.getSelectionModel().getSelected());
                        switch (Km.Invoice.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Invoice.View.EditWindow.KindEditor_content) Km.Invoice.View.EditWindow.KindEditor_content.html(Km.Invoice.View.Running.invoiceGrid.getSelectionModel().getSelected().data.content);
                                if (Km.Invoice.View.EditWindow.KindEditor_memo) Km.Invoice.View.EditWindow.KindEditor_memo.html(Km.Invoice.View.Running.invoiceGrid.getSelectionModel().getSelected().data.memo);
                                break
                            case 3:
                                break
                            default:
                                if (CKEDITOR.instances.content) CKEDITOR.instances.content.setData(Km.Invoice.View.Running.invoiceGrid.getSelectionModel().getSelected().data.content);
                                if (CKEDITOR.instances.memo) CKEDITOR.instances.memo.setData(Km.Invoice.View.Running.invoiceGrid.getSelectionModel().getSelected().data.memo);
                        }

                    }
                }]
            }, config);
            Km.Invoice.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示订单发票详情
     */
    InvoiceView:{
        /**
         * Tab页：容器包含显示与订单发票所有相关的信息
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
                                if (Km.Invoice.View.Running.invoiceGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择订单发票！');
                                    return false;
                                }
                                Km.Invoice.Config.View.IsShow=1;
                                Km.Invoice.View.Running.invoiceGrid.showInvoice();
                                Km.Invoice.View.Running.invoiceGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Invoice.View.InvoiceView.Tabs.superclass.constructor.call(this, config);

                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Invoice.Config.View.Direction==1)||(Km.Invoice.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabInvoiceDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">订单号</td><td class="content">{order_no}</td></tr>',
                         '    <tr class="entry"><td class="head">真实姓名</td><td class="content">{ship_name}</td></tr>',
                         '    <tr class="entry"><td class="head">会员名称</td><td class="content">{username}</td></tr>',
                         '    <tr class="entry"><td class="head">发票号</td><td class="content">{invoice_code}</td></tr>',
                         '    <tr class="entry"><td class="head">发票状态</td><td class="content">{invoice_stateShow}</td></tr>',
                         '    <tr class="entry"><td class="head">开票金额</td><td class="content">{price}</td></tr>',
                         '    <tr class="entry"><td class="head">发票类型</td><td class="content">{typeShow}</td></tr>',
                         '    <tr class="entry"><td class="head">发票抬头</td><td class="content">{type1_headerShow}</td></tr>',
                         '    <tr class="entry"><td class="head">个人单位名称</td><td class="content">{type1_name}</td></tr>',
                         '    <tr class="entry"><td class="head">单位名称</td><td class="content">{company}</td></tr>',
                         '    <tr class="entry"><td class="head">发票内容</td><td class="content">{content}</td></tr>',
                         '    <tr class="entry"><td class="head">纳税人识别号</td><td class="content">{taxpayer}</td></tr>',
                         '    <tr class="entry"><td class="head">注册地址</td><td class="content">{reg_address}</td></tr>',
                         '    <tr class="entry"><td class="head">注册电话</td><td class="content">{reg_tel}</td></tr>',
                         '    <tr class="entry"><td class="head">开户银行</td><td class="content">{bank}</td></tr>',
                         '    <tr class="entry"><td class="head">银行账号</td><td class="content">{bank_account}</td></tr>',
                         '    <tr class="entry"><td class="head">备注</td><td class="content">{memo}</td></tr>',
                         '    <tr class="entry"><td class="head">发票费用</td><td class="content">{fee}</td></tr>',
                         '</table>'
                     ]}
                );
                this.add(
                    {title: '其他',iconCls:'tabs'}
                );
            }
        }),
        /**
         * 窗口:显示订单发票信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看订单发票",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Invoice.View.InvoiceView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Invoice.Config.View.IsShow=0;
                            Km.Invoice.View.Running.invoiceGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Invoice.Config.View.IsShow=0;
                            Km.Invoice.View.Running.invoiceGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Invoice.View.Running.invoiceGrid.addInvoice();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Invoice.View.Running.invoiceGrid.updateInvoice();}
                    }]
                }, config);
                Km.Invoice.View.InvoiceView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 窗口：批量上传订单发票
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传订单发票数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传订单发票Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadInvoice',
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Invoice.View.Running.invoiceGrid.doSelectInvoice();
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
            Km.Invoice.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：订单发票列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Invoice.Store.invoiceStore,
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
                        {header : '标识',dataIndex : 'invoice_id',hidden:true},
                        {header : '订单号',dataIndex : 'order_no'},
                        {header : '真实姓名',dataIndex : 'ship_name'},
                        {header : '会员',dataIndex : 'username'},
                        {header : '发票号',dataIndex : 'invoice_code'},
                        {header : '发票状态',dataIndex : 'invoice_stateShow'},
                        {header : '开票金额',dataIndex : 'price'},
                        {header : '发票类型',dataIndex : 'typeShow'},
                        {header : '发票抬头',dataIndex : 'type1_headerShow'},
                        {header : '个人单位名称',dataIndex : 'type1_name'},
                        {header : '单位名称',dataIndex : 'company'},
                        {header : '纳税人识别号',dataIndex : 'taxpayer'},
                        {header : '注册地址',dataIndex : 'reg_address'},
                        {header : '注册电话',dataIndex : 'reg_tel'},
                        {header : '开户银行',dataIndex : 'bank'},
                        {header : '银行账号',dataIndex : 'bank_account'},
                        {header : '发票费用',dataIndex : 'fee'}
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
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectInvoice();
                                    }
                                }
                            },
                            items : [
                                '订单 ','&nbsp;&nbsp;',{ref: '../iorder_id',xtype: 'combo',
                                     store:Km.Invoice.Store.orderStoreForCombo,hiddenName : 'order_id',
                                     emptyText: '请选择订单',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width:260,pageSize:Km.Invoice.Config.PageSize,
                                     displayField:'order_no',valueField:'order_id',
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                         '<tpl for="."><div class="search-item">',
                                         '<h3>{order_no}</h3>',
                                         '</div></tpl>'
                                     )
                                },'&nbsp;&nbsp;',
                                '发票号 ','&nbsp;&nbsp;',{ref: '../iinvoice_code'},'&nbsp;&nbsp;',
                                '个人单位名称 ','&nbsp;&nbsp;',{ref: '../itype1_name'},'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectInvoice();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.iorder_id.setValue("");
                                        this.topToolbar.iinvoice_code.setValue("");
                                        this.topToolbar.itype1_name.setValue("");
                                        this.filter={};
                                        this.doSelectInvoice();
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
                                    text : '添加订单发票',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addInvoice();
                                    }
                                },'-',{
                                    text : '修改订单发票',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateInvoice();
                                    }
                                },'-',{
                                    text : '删除订单发票', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteInvoice();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importInvoice();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入订单发票',iconCls : 'icon-import',scope:this,handler:function(){this.importInvoice()}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportInvoice();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看订单发票', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showInvoice()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideInvoice();Km.Invoice.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Invoice.Cookie.set('View.IsFix',Km.Invoice.Config.View.IsFix);}}
                                        ]}
                                },'-']}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Invoice.Config.PageSize,
                    store: Km.Invoice.Store.invoiceStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Invoice.Viewport){
                                if (Km.Invoice.Config.View.IsShow==1){
                                    Km.Invoice.View.IsSelectView=1;
                                }
                                this.ownerCt.hideInvoice();
                                Km.Invoice.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Invoice.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Invoice.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Invoice.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectInvoice();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Invoice.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Invoice.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectInvoice();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示订单发票列表
            this.doSelectInvoice();
            Km.Invoice.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的订单发票信息Tab页
            Km.Invoice.View.Running.viewTabs=new Km.Invoice.View.InvoiceView.Tabs();
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
                    this.grid.updateViewInvoice();
                    if (sm.getCount() != 1){
                        this.grid.hideInvoice();
                        Km.Invoice.Config.View.IsShow=0;
                    }else{
                        if (Km.Invoice.View.IsSelectView==1){
                            Km.Invoice.View.IsSelectView=0;
                            this.grid.showInvoice();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Invoice.Config.View.IsShow==1){
                            Km.Invoice.View.IsSelectView=1;
                        }
                        this.grid.hideInvoice();
                        Km.Invoice.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Invoice.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showInvoice();
                this.tvpView.toggle(true);
            }else{
                this.hideInvoice();
                Km.Invoice.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Invoice.Config.View.IsFix=1;
            }else{
               Km.Invoice.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Invoice.Config.View.IsShow=0;
                return ;
            }
            if (Km.Invoice.Config.View.IsShow==1){
               this.hideInvoice();
               Km.Invoice.Config.View.IsShow=0;
            }
            this.showInvoice();
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
         * 查询符合条件的订单发票
         */
        doSelectInvoice : function() {
            if (this.topToolbar){
                var iorder_id = this.topToolbar.iorder_id.getValue();
                var iinvoice_code = this.topToolbar.iinvoice_code.getValue();
                var itype1_name = this.topToolbar.itype1_name.getValue();
                this.filter       ={'order_id':iorder_id,'invoice_code':iinvoice_code,'type1_name':itype1_name};
            }
            var condition = {'start':0,'limit':Km.Invoice.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceInvoice.queryPageInvoice(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Invoice.Store.invoiceStore.loadData(result);
                } else {
                    Km.Invoice.Store.invoiceStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的订单发票！');
                }
            });
        },
        /**
         * 显示订单发票视图
         * 显示订单发票的视图相对订单发票列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Invoice.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Invoice.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Invoice.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Invoice.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Invoice.View.Running.viewTabs);
                    break;
            }
            Km.Invoice.Cookie.set('View.Direction',Km.Invoice.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Invoice.Config.View.IsFix==0)&&(Km.Invoice.Config.View.IsShow==1)){
                    this.showInvoice();
                }
                Km.Invoice.Config.View.IsFix=1;
                Km.Invoice.View.Running.invoiceGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Invoice.Config.View.IsShow=0;
                this.showInvoice();
            }
        },
        /**
         * 显示订单发票
         */
        showInvoice : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择订单发票！');
                Km.Invoice.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Invoice.Config.View.IsFix==0){
                if (Km.Invoice.View.Running.view_window==null){
                    Km.Invoice.View.Running.view_window=new Km.Invoice.View.InvoiceView.Window();
                }
                if (Km.Invoice.View.Running.view_window.hidden){
                    Km.Invoice.View.Running.view_window.show();
                    Km.Invoice.View.Running.view_window.winTabs.hideTabStripItem(Km.Invoice.View.Running.view_window.winTabs.tabFix);
                    this.updateViewInvoice();
                    this.tvpView.toggle(true);
                    Km.Invoice.Config.View.IsShow=1;
                }else{
                    this.hideInvoice();
                    Km.Invoice.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Invoice.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Invoice.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Invoice.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Invoice.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Invoice.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Invoice.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Invoice.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Invoice.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Invoice.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideInvoice();
            if (Km.Invoice.Config.View.IsShow==0){
                Km.Invoice.View.Running.viewTabs.enableCollapse();
                switch(Km.Invoice.Config.View.Direction){
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
                this.updateViewInvoice();
                this.tvpView.toggle(true);
                Km.Invoice.Config.View.IsShow=1;
            }else{
                Km.Invoice.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏订单发票
         */
        hideInvoice : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Invoice.View.Running.view_window!=null){
                Km.Invoice.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前订单发票显示信息
         */
        updateViewInvoice : function() {

            if (Km.Invoice.View.Running.view_window!=null){
                Km.Invoice.View.Running.view_window.winTabs.tabInvoiceDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Invoice.View.Running.viewTabs.tabInvoiceDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建订单发票
         */
        addInvoice : function() {
            if (Km.Invoice.View.Running.edit_window==null){
                Km.Invoice.View.Running.edit_window=new Km.Invoice.View.EditWindow();
            }
            Km.Invoice.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Invoice.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Invoice.View.Running.edit_window.setTitle('添加订单发票');
            Km.Invoice.View.Running.edit_window.savetype=0;
            Km.Invoice.View.Running.edit_window.invoice_id.setValue("");
            switch (Km.Invoice.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Invoice.View.EditWindow.KindEditor_content) Km.Invoice.View.EditWindow.KindEditor_content.html("");
                    if (Km.Invoice.View.EditWindow.KindEditor_memo) Km.Invoice.View.EditWindow.KindEditor_memo.html("");
                    break
                case 3:
                    break
                default:
                    if (CKEDITOR.instances.content) CKEDITOR.instances.content.setData("");
                    if (CKEDITOR.instances.memo) CKEDITOR.instances.memo.setData("");
            }

            Km.Invoice.View.Running.edit_window.show();
            Km.Invoice.View.Running.edit_window.maximize();
        },
        /**
         * 编辑订单发票时先获得选中的订单发票信息
         */
        updateInvoice : function() {
            if (Km.Invoice.View.Running.edit_window==null){
                Km.Invoice.View.Running.edit_window=new Km.Invoice.View.EditWindow();
            }
            Km.Invoice.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Invoice.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Invoice.View.Running.edit_window.setTitle('修改订单发票');
            Km.Invoice.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Invoice.View.Running.edit_window.savetype=1;
            switch (Km.Invoice.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Invoice.View.EditWindow.KindEditor_content) Km.Invoice.View.EditWindow.KindEditor_content.html(this.getSelectionModel().getSelected().data.content);
                    if (Km.Invoice.View.EditWindow.KindEditor_memo) Km.Invoice.View.EditWindow.KindEditor_memo.html(this.getSelectionModel().getSelected().data.memo);
                    break
                case 3:
                    if (xhEditor_content)xhEditor_content.setSource(this.getSelectionModel().getSelected().data.content);
                    if (xhEditor_memo)xhEditor_memo.setSource(this.getSelectionModel().getSelected().data.memo);
                    break
                default:
                    if (CKEDITOR.instances.content) CKEDITOR.instances.content.setData(this.getSelectionModel().getSelected().data.content);
                    if (CKEDITOR.instances.memo) CKEDITOR.instances.memo.setData(this.getSelectionModel().getSelected().data.memo);
            }

            Km.Invoice.View.Running.edit_window.show();
            Km.Invoice.View.Running.edit_window.maximize();
        },
        /**
         * 删除订单发票
         */
        deleteInvoice : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的订单发票吗?', this.confirmDeleteInvoice,this);
        },
        /**
         * 确认删除订单发票
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
        },
        /**
         * 导出订单发票
         */
        exportInvoice : function() {
            ExtServiceInvoice.exportInvoice(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入订单发票
         */
        importInvoice : function() {
            if (Km.Invoice.View.current_uploadWindow==null){
                Km.Invoice.View.current_uploadWindow=new Km.Invoice.View.UploadWindow();
            }
            Km.Invoice.View.current_uploadWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Invoice.View.Running.invoiceGrid=new Km.Invoice.View.Grid();
            if (Km.Invoice.Config.View.IsFix==0){
                Km.Invoice.View.Running.invoiceGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Invoice.View.Running.invoiceGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Invoice.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Invoice.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前订单发票Grid对象
         */
        invoiceGrid:null,

        /**
         * 显示订单发票信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Invoice.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Invoice.Init();
    /**
     * 订单发票数据模型获取数据Direct调用
     */
    Km.Invoice.Store.invoiceStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceInvoice.queryPageInvoice}
    });
    /**
     * 订单发票页面布局
     */
    Km.Invoice.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Invoice.View.Panel()]
    });
    Km.Invoice.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});