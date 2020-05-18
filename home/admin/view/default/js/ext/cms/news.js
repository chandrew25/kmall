Ext.namespace("Kmall.Admin.News");
Km = Kmall.Admin;
Km.News={
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
             * 显示菲生活新闻的视图相对菲生活新闻列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示菲生活新闻信息页(或者打开新窗口)
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
        if (Km.News.Cookie.get('View.Direction')){
            Km.News.Config.View.Direction=Km.News.Cookie.get('View.Direction');
        }
        if (Km.News.Cookie.get('View.IsFix')!=null){
            Km.News.Config.View.IsFix=Km.News.Cookie.get('View.IsFix');
        }
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.News.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }

    }
};
/**
 * Model:数据模型
 */
Km.News.Store = {
    /**
     * 菲生活新闻
     */
    newsStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'news_id',type: 'int'},
                {name: 'news_title',type: 'string'},
                {name: 'news_content',type: 'string'},
                {name: 'news_image',type: 'string'},
                {name: 'news_typeShow',type: 'string'},
                {name: 'news_type',type: 'string'},
                {name: 'sendTime',type: 'date',dateFormat:'Y-m-d'},
                {name: 'sort_order',type: 'int'},
                {name: 'isShow',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.News.Config.PageSize;
                    Ext.apply(options.params, Km.News.View.Running.newsGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    })
};
/**
 * View:菲生活新闻显示组件
 */
Km.News.View={
    /**
     * 编辑窗口：新建或者修改菲生活新闻
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
                        switch (Km.News.Config.OnlineEditor)
                        {
                            case 2:
                                Km.News.View.EditWindow.KindEditor_news_content = KindEditor.create('textarea[name="news_content"]',{width:'98%',minHeith:'350px', filterMode:true});
                                break
                            case 3:
                                pageInit_news_content();
                                break
                            default:
                                ckeditor_replace_news_content();
                        }
                    }
                },
                items : [
                    new Ext.form.FormPanel({
                        ref:'editForm',layout:'form',fileUpload: true,
                        labelWidth : 100,labelAlign : "center",
                        bodyStyle : 'padding:5px 5px 0',align : "center",
                        api : {},
                        defaults : {
                            xtype : 'textfield',anchor:'98%'
                        },
                        items : [
                            {xtype: 'hidden',name : 'news_id',ref:'../news_id'},
                            {fieldLabel : '标题',name : 'news_title'},
                            {fieldLabel : '内容',name : 'news_content',xtype : 'textarea',id:'news_content',ref:'news_content'},
                            {xtype: 'hidden',  name : 'news_image',ref:'../news_image'},
                            {fieldLabel : '图片路径',name : 'news_imageUpload',ref:'../news_imageUpload',xtype:'fileuploadfield',
                              emptyText: '请上传图片路径文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {fieldLabel : '新闻种类',hiddenName : 'news_type',xtype : 'combo',
                                mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                store : new Ext.data.SimpleStore({
                                    fields : ['value', 'text'],
                                    data : [['1', '商城公告'],['2', '关于我们'],['3', '导购信息']]
                                }),emptyText: '请选择新闻种类',
                                valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '发布时间',name : 'sendTime',xtype : 'datefield',format : "Y-m-d"},
                            {fieldLabel : '排序',name : 'sort_order',xtype : 'numberfield'},
                            {fieldLabel : '是否显示',hiddenName : 'isShow'
                                 ,xtype : 'combo',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否显示',
                                 valueField : 'value',displayField : 'text'
                            }
                        ]
                    })
                ],
                buttons : [{
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {
                        switch (Km.News.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.News.View.EditWindow.KindEditor_news_content)this.editForm.news_content.setValue(Km.News.View.EditWindow.KindEditor_news_content.html());
                                break
                            case 3:
                                if (xhEditor_news_content)this.editForm.news_content.setValue(xhEditor_news_content.getSource());
                                break
                            default:
                                if (CKEDITOR.instances.news_content) this.editForm.news_content.setValue(CKEDITOR.instances.news_content.getData());
                        }

                        if (!this.editForm.getForm().isValid()) {
                            return;
                        }
                        editWindow=this;
                        if (this.savetype==0){
                            this.editForm.api.submit=ExtServiceNews.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.News.View.Running.newsGrid.doSelectNews();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceNews.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.News.View.Running.newsGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.News.View.Running.newsGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.News.View.Running.newsGrid.getSelectionModel().getSelected());
                        this.news_imageUpload.setValue(this.news_image.getValue());
                        switch (Km.News.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.News.View.EditWindow.KindEditor_news_content) Km.News.View.EditWindow.KindEditor_news_content.html(Km.News.View.Running.newsGrid.getSelectionModel().getSelected().data.news_content);
                                break
                            case 3:
                                break
                            default:
                                if (CKEDITOR.instances.news_content) CKEDITOR.instances.news_content.setData(Km.News.View.Running.newsGrid.getSelectionModel().getSelected().data.news_content);
                        }

                    }
                }]
            }, config);
            Km.News.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示菲生活新闻详情
     */
    NewsView:{
        /**
         * Tab页：容器包含显示与菲生活新闻所有相关的信息
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
                                if (Km.News.View.Running.newsGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择菲生活新闻！');
                                    return false;
                                }
                                Km.News.Config.View.IsShow=1;
                                Km.News.View.Running.newsGrid.showNews();
                                Km.News.View.Running.newsGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.News.View.NewsView.Tabs.superclass.constructor.call(this, config);

                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.News.Config.View.Direction==1)||(Km.News.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabNewsDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">标题</td><td class="content">{news_title}</td></tr>',
                         '    <tr class="entry"><td class="head">内容</td><td class="content">{news_content}</td></tr>',
                         '    <tr class="entry"><td class="head">图片路径</td><td class="content">{news_image}</td></tr>',
                         '    <tr class="entry"><td class="head">图片</td><td class="content"><tpl if="news_image"><img src="upload/images/{news_image}" /></tpl></td></tr>',
                         '    <tr class="entry"><td class="head">新闻种类</td><td class="content">{news_typeShow}</td></tr>',
                         '    <tr class="entry"><td class="head">发布时间</td><td class="content">{sendTime:date("Y-m-d")}</td></tr>',
                         '    <tr class="entry"><td class="head">排序</td><td class="content">{sort_order}</td></tr>',
                         '    <tr class="entry"><td class="head">是否显示</td><td class="content"><tpl if="isShow == true">是</tpl><tpl if="isShow == false">否</tpl></td></tr>',
                         '</table>'
                     ]}
                );
                this.add(
                    {title: '其他',iconCls:'tabs'}
                );
            }
        }),
        /**
         * 窗口:显示菲生活新闻信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看菲生活新闻",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.News.View.NewsView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.News.Config.View.IsShow=0;
                            Km.News.View.Running.newsGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.News.Config.View.IsShow=0;
                            Km.News.View.Running.newsGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.News.View.Running.newsGrid.addNews();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.News.View.Running.newsGrid.updateNews();}
                    }]
                }, config);
                Km.News.View.NewsView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 窗口：批量上传菲生活新闻
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传菲生活新闻数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传菲生活新闻Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadNews',
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.News.View.Running.newsGrid.doSelectNews();
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
            Km.News.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 窗口：批量上传商品图片
     */
    BatchUploadImagesWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                width : 400,height : 180,minWidth : 300,minHeight : 100,closeAction : "hide",
                layout : 'fit',plain : true,bodyStYle : 'padding:5px;',buttonAlign : 'center',
                items : [
                    new Ext.form.FormPanel({
                        ref:'uploadForm',fileUpload: true,
                        width: 500,labelWidth: 50,autoHeight: true,baseCls: 'x-plain',
                        frame:true,bodyStyle: 'padding: 10px 10px 10px 10px;',
                        defaults: {
                            anchor: '95%',allowBlank: false,msgTarget: 'side'
                        },
                        items : [{
                            xtype : 'fileuploadfield',fieldLabel : '文 件',ref:'upload_file',
                            emptyText: '请批量上传更新时间文件(zip)',buttonText: '',
                            accept:'application/zip,application/x-zip-compressed',
                            buttonCfg: {iconCls: 'upload-icon'}
                        },
                        {xtype : 'displayfield',value:'*.图片名不能重名<br/>*.压缩文件最大不要超过50M'}]
                    })
                ],
                buttons : [{
                        text : '上 传',
                        scope:this,
                        handler : function() {
                            uploadImagesWindow     =this;
                            validationExpression   =/([\u4E00-\u9FA5]|\w)+(.zip|.ZIP)$/;
                            var isValidExcelFormat = new RegExp(validationExpression);
                            var result             = isValidExcelFormat.test(this.uploadForm.upload_file.getValue());
                            if (!result){
                                Ext.Msg.alert('提示', '请上传ZIP文件，后缀名为zip！');
                                return;
                            }
                            var uploadImageUrl='index.php?go=admin.upload.uploadNewsNews_images';

                            if (this.uploadForm.getForm().isValid()) {
                                Ext.Msg.show({
                                    title : '请等待',msg : '文件正在上传中，请稍后...',
                                    animEl : 'loading',icon : Ext.Msg.WARNING,
                                    closable : true,progress : true,progressText : '',width : 300
                                });
                                this.uploadForm.getForm().submit({
                                    url : uploadImageUrl,
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadImagesWindow.hide();
                                        uploadImagesWindow.uploadForm.upload_file.setValue('');
                                        Km.News.View.Running.newsGrid.doSelectNews();
                                    },
                                    failure : function(form, response) {
                                        if (response.result&&response.result.data){
                                            Ext.Msg.alert('错误', response.result.data);
                                        }
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
            Km.News.View.BatchUploadImagesWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：菲生活新闻列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.News.Store.newsStore,
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
                        {header : '标识',dataIndex : 'news_id',hidden:true},
                        {header : '标题',dataIndex : 'news_title'},
                        {header : '新闻种类',dataIndex : 'news_typeShow'},
                        {header : '发布时间',dataIndex : 'sendTime',renderer:Ext.util.Format.dateRenderer('Y-m-d')},
                        {header : '排序',dataIndex : 'sort_order'},
                        {header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}}
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
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectNews();
                                    }
                                }
                            },
                            items : [
                                '标题 ','&nbsp;&nbsp;',{ref: '../nnews_title'},'&nbsp;&nbsp;',
                                '新闻种类 ','&nbsp;&nbsp;',{ref: '../nnews_type',xtype : 'combo',mode : 'local',
                                    triggerAction : 'all',lazyRender : true,editable: false,
                                    store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['1', '商城公告'],['2', '关于我们'],['3', '导购信息']]
                                    }),
                                    valueField : 'value',displayField : 'text'
                                },'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectNews();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.nnews_title.setValue("");
                                        this.topToolbar.nnews_type.setValue("");
                                        this.filter={};
                                        this.doSelectNews();
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
                                    text : '添加菲生活新闻',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addNews();
                                    }
                                },'-',{
                                    text : '修改菲生活新闻',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateNews();
                                    }
                                },'-',{
                                    text : '删除菲生活新闻', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteNews();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importNews();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入菲生活新闻',iconCls : 'icon-import',scope:this,handler:function(){this.importNews()}},
                                            {text:'批量导入图片',iconCls : 'icon-import',scope:this,handler:function(){this.batchUploadImages("upload_news_image_files","图片")}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportNews();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看菲生活新闻', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showNews()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideNews();Km.News.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.News.Cookie.set('View.IsFix',Km.News.Config.View.IsFix);}}
                                        ]}
                                },'-']}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.News.Config.PageSize,
                    store: Km.News.Store.newsStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.News.Viewport){
                                if (Km.News.Config.View.IsShow==1){
                                    Km.News.View.IsSelectView=1;
                                }
                                this.ownerCt.hideNews();
                                Km.News.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.News.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.News.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.News.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectNews();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.News.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.News.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectNews();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示菲生活新闻列表
            this.doSelectNews();
            Km.News.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的菲生活新闻信息Tab页
            Km.News.View.Running.viewTabs=new Km.News.View.NewsView.Tabs();
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
                    this.grid.updateViewNews();
                    if (sm.getCount() != 1){
                        this.grid.hideNews();
                        Km.News.Config.View.IsShow=0;
                    }else{
                        if (Km.News.View.IsSelectView==1){
                            Km.News.View.IsSelectView=0;
                            this.grid.showNews();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.News.Config.View.IsShow==1){
                            Km.News.View.IsSelectView=1;
                        }
                        this.grid.hideNews();
                        Km.News.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.News.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showNews();
                this.tvpView.toggle(true);
            }else{
                this.hideNews();
                Km.News.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.News.Config.View.IsFix=1;
            }else{
               Km.News.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.News.Config.View.IsShow=0;
                return ;
            }
            if (Km.News.Config.View.IsShow==1){
               this.hideNews();
               Km.News.Config.View.IsShow=0;
            }
            this.showNews();
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
         * 查询符合条件的菲生活新闻
         */
        doSelectNews : function() {
            if (this.topToolbar){
                var nnews_title = this.topToolbar.nnews_title.getValue();
                var nnews_type = this.topToolbar.nnews_type.getValue();
                this.filter       ={'news_title':nnews_title,'news_type':nnews_type};
            }
            var condition = {'start':0,'limit':Km.News.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceNews.queryPageNews(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.News.Store.newsStore.loadData(result);
                } else {
                    Km.News.Store.newsStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的菲生活新闻！');
                }
            });
        },
        /**
         * 显示菲生活新闻视图
         * 显示菲生活新闻的视图相对菲生活新闻列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.News.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.News.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.News.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.News.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.News.View.Running.viewTabs);
                    break;
            }
            Km.News.Cookie.set('View.Direction',Km.News.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.News.Config.View.IsFix==0)&&(Km.News.Config.View.IsShow==1)){
                    this.showNews();
                }
                Km.News.Config.View.IsFix=1;
                Km.News.View.Running.newsGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.News.Config.View.IsShow=0;
                this.showNews();
            }
        },
        /**
         * 显示菲生活新闻
         */
        showNews : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择菲生活新闻！');
                Km.News.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.News.Config.View.IsFix==0){
                if (Km.News.View.Running.view_window==null){
                    Km.News.View.Running.view_window=new Km.News.View.NewsView.Window();
                }
                if (Km.News.View.Running.view_window.hidden){
                    Km.News.View.Running.view_window.show();
                    Km.News.View.Running.view_window.winTabs.hideTabStripItem(Km.News.View.Running.view_window.winTabs.tabFix);
                    this.updateViewNews();
                    this.tvpView.toggle(true);
                    Km.News.Config.View.IsShow=1;
                }else{
                    this.hideNews();
                    Km.News.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.News.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.News.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.News.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.News.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.News.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.News.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.News.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.News.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.News.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideNews();
            if (Km.News.Config.View.IsShow==0){
                Km.News.View.Running.viewTabs.enableCollapse();
                switch(Km.News.Config.View.Direction){
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
                this.updateViewNews();
                this.tvpView.toggle(true);
                Km.News.Config.View.IsShow=1;
            }else{
                Km.News.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏菲生活新闻
         */
        hideNews : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.News.View.Running.view_window!=null){
                Km.News.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前菲生活新闻显示信息
         */
        updateViewNews : function() {

            if (Km.News.View.Running.view_window!=null){
                Km.News.View.Running.view_window.winTabs.tabNewsDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.News.View.Running.viewTabs.tabNewsDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建菲生活新闻
         */
        addNews : function() {
            if (Km.News.View.Running.edit_window==null){
                Km.News.View.Running.edit_window=new Km.News.View.EditWindow();
            }
            Km.News.View.Running.edit_window.resetBtn.setVisible(false);
            Km.News.View.Running.edit_window.saveBtn.setText('保 存');
            Km.News.View.Running.edit_window.setTitle('添加菲生活新闻');
            Km.News.View.Running.edit_window.savetype=0;
            Km.News.View.Running.edit_window.news_id.setValue("");
            Km.News.View.Running.edit_window.news_imageUpload.setValue("");
            switch (Km.News.Config.OnlineEditor)
            {
                case 2:
                    if (Km.News.View.EditWindow.KindEditor_news_content) Km.News.View.EditWindow.KindEditor_news_content.html("");
                    break
                case 3:
                    break
                default:
                    if (CKEDITOR.instances.news_content) CKEDITOR.instances.news_content.setData("");
            }

            Km.News.View.Running.edit_window.show();
            Km.News.View.Running.edit_window.maximize();
        },
        /**
         * 编辑菲生活新闻时先获得选中的菲生活新闻信息
         */
        updateNews : function() {
            if (Km.News.View.Running.edit_window==null){
                Km.News.View.Running.edit_window=new Km.News.View.EditWindow();
            }
            Km.News.View.Running.edit_window.saveBtn.setText('修 改');
            Km.News.View.Running.edit_window.resetBtn.setVisible(true);
            Km.News.View.Running.edit_window.setTitle('修改菲生活新闻');
            Km.News.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.News.View.Running.edit_window.savetype=1;
            Km.News.View.Running.edit_window.news_imageUpload.setValue(Km.News.View.Running.edit_window.news_image.getValue());
            switch (Km.News.Config.OnlineEditor)
            {
                case 2:
                    if (Km.News.View.EditWindow.KindEditor_news_content) Km.News.View.EditWindow.KindEditor_news_content.html(this.getSelectionModel().getSelected().data.news_content);
                    break
                case 3:
                    if (xhEditor_news_content)xhEditor_news_content.setSource(this.getSelectionModel().getSelected().data.news_content);
                    break
                default:
                    if (CKEDITOR.instances.news_content) CKEDITOR.instances.news_content.setData(this.getSelectionModel().getSelected().data.news_content);
            }

            Km.News.View.Running.edit_window.show();
            Km.News.View.Running.edit_window.maximize();
        },
        /**
         * 删除菲生活新闻
         */
        deleteNews : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的菲生活新闻吗?', this.confirmDeleteNews,this);
        },
        /**
         * 确认删除菲生活新闻
         */
        confirmDeleteNews : function(btn) {
            if (btn == 'yes') {
                var del_news_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_news_ids=del_news_ids+selectedRows[flag].data.news_id+",";
                }
                ExtServiceNews.deleteByIds(del_news_ids);
                this.doSelectNews();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出菲生活新闻
         */
        exportNews : function() {
            ExtServiceNews.exportNews(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入菲生活新闻
         */
        importNews : function() {
            if (Km.News.View.current_uploadWindow==null){
                Km.News.View.current_uploadWindow=new Km.News.View.UploadWindow();
            }
            Km.News.View.current_uploadWindow.show();
        },
        /**
         * 批量上传商品图片
         */
        batchUploadImages:function(inputname,title){
            if (Km.News.View.Running.batchUploadImagesWindow==null){
                Km.News.View.Running.batchUploadImagesWindow=new Km.News.View.BatchUploadImagesWindow();
            }

            Km.News.View.Running.batchUploadImagesWindow.setTitle("批量上传"+title);
            Km.News.View.Running.batchUploadImagesWindow.uploadForm.upload_file.name=inputname;
            Km.News.View.Running.batchUploadImagesWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.News.View.Running.newsGrid=new Km.News.View.Grid();
            if (Km.News.Config.View.IsFix==0){
                Km.News.View.Running.newsGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.News.View.Running.newsGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.News.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.News.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前菲生活新闻Grid对象
         */
        newsGrid:null,

        /**
         * 显示菲生活新闻信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.News.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.News.Init();
    /**
     * 菲生活新闻数据模型获取数据Direct调用
     */
    Km.News.Store.newsStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceNews.queryPageNews}
    });
    /**
     * 菲生活新闻页面布局
     */
    Km.News.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.News.View.Panel()]
    });
    Km.News.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
