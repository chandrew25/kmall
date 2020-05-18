Ext.namespace("Kmall.Admin.Appdown");
Km = Kmall.Admin;
Km.Appdown={
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
             * 显示应用下载的视图相对应用下载列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示应用下载信息页(或者打开新窗口)
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
        if (Km.Appdown.Cookie.get('View.Direction')){
            Km.Appdown.Config.View.Direction=Km.Appdown.Cookie.get('View.Direction');
        }
        if (Km.Appdown.Cookie.get('View.IsFix')!=null){
            Km.Appdown.Config.View.IsFix=Km.Appdown.Cookie.get('View.IsFix');
        }
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.Appdown.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }

    }
};
/**
 * Model:数据模型
 */
Km.Appdown.Store = {
    /**
     * 应用下载
     */
    appdownStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'appdown_id',type: 'int'},
                {name: 'appdown_name',type: 'string'},
                {name: 'filepath',type: 'string'},
                {name: 'image',type: 'string'},
                {name: 'ico',type: 'string'},
                {name: 'introduction',type: 'string'},
                {name: 'introduce',type: 'string'},
                {name: 'suitabletype',type: 'string'},
                {name: 'developer',type: 'string'},
                {name: 'publishtime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'tag',type: 'string'},
                {name: 'recommendlevelShow',type: 'string'},
                {name: 'recommendlevel',type: 'string'},
                {name: 'typeShow',type: 'string'},
                {name: 'type',type: 'string'},
                {name: 'isFree',type: 'string'},
                {name: 'price',type: 'float'},
                {name: 'docsize',type: 'string'},
                {name: 'edition',type: 'string'},
                {name: 'downloadcount',type: 'int'},
                {name: 'buycount',type: 'int'},
                {name: 'sort_order',type: 'int'},
                {name: 'isShow',type: 'string'},
                {name: 'isHotrecommend',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Appdown.Config.PageSize;
                    Ext.apply(options.params, Km.Appdown.View.Running.appdownGrid.filter);//保证分页也将查询条件带上
                }
                if (Km.Appdown.View.Running.uploadappWindow!=null){
	                Km.Appdown.View.Running.uploadappWindow.hide();
	            }
            }
        }
    })
};
/**
 * View:应用下载显示组件
 */
Km.Appdown.View={
    /**
     * 编辑窗口：新建或者修改应用下载
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
                        switch (Km.Appdown.Config.OnlineEditor)
                        {
                            case 2:
                                Km.Appdown.View.EditWindow.KindEditor_introduction = KindEditor.create('textarea[name="introduction"]',{width:'98%',minHeith:'350px', filterMode:true});
                                Km.Appdown.View.EditWindow.KindEditor_introduce = KindEditor.create('textarea[name="introduce"]',{width:'98%',minHeith:'350px', filterMode:true});
                                Km.Appdown.View.EditWindow.KindEditor_suitabletype = KindEditor.create('textarea[name="suitabletype"]',{width:'98%',minHeith:'350px', filterMode:true});
                                break
                            case 3:
                                pageInit_introduction();
                                pageInit_introduce();
                                pageInit_suitabletype();
                                break
                            default:
                                ckeditor_replace_introduction();
                                ckeditor_replace_introduce();
                                ckeditor_replace_suitabletype();
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
                            {xtype: 'hidden',name : 'appdown_id',ref:'../appdown_id'},
                            {fieldLabel : '应用名称',name : 'appdown_name'},
                            {xtype: 'hidden',  name : 'image',ref:'../image'},
                            {fieldLabel : '图片',name : 'imageUpload',ref:'../imageUpload',xtype:'fileuploadfield',
                              emptyText: '请上传图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {xtype: 'hidden',  name : 'ico',ref:'../ico'},
                            {fieldLabel : '缩略图',name : 'icoUpload',ref:'../icoUpload',xtype:'fileuploadfield',
                              emptyText: '请上传缩略图文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {fieldLabel : '简介',name : 'introduction',xtype : 'textarea',id:'introduction',ref:'introduction'},
                            {fieldLabel : '详情',name : 'introduce',xtype : 'textarea',id:'introduce',ref:'introduce'},
                            {fieldLabel : '适配机型',name : 'suitabletype',xtype : 'textarea',id:'suitabletype',ref:'suitabletype'},
                            {fieldLabel : '开发者',name : 'developer'},
                            {fieldLabel : '发布时间',name : 'publishtime',xtype : 'datefield',format : "Y-m-d"},
                            {fieldLabel : '标签',name : 'tag'},
                            {fieldLabel : '推荐等级',hiddenName : 'recommendlevel',xtype : 'combo',
                                mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                store : new Ext.data.SimpleStore({
                                    fields : ['value', 'text'],
                                    data : [['1', '等级1'],['2', '等级2'],['3', '等级3'],['4', '等级4'],['5', '等级5']]
                                }),emptyText: '请选择推荐等级',
                                valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '应用分类',hiddenName : 'type',xtype : 'combo',
                                mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                store : new Ext.data.SimpleStore({
                                    fields : ['value', 'text'],
                                    data : [['1', '游戏天地'],['2', '影音娱乐'],['3', '教育阅读'],['4', '旅行购物'],['5', '生活休闲']]
                                }),emptyText: '请选择应用分类',
                                valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '是否免费',hiddenName : 'isFree'
                                 ,xtype:'combo',ref:'../isFree',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否免费',
                                 valueField : 'value',displayField : 'text',
                                 listeners : {
                                    select:function(combo, record,index){
                                         if(index==0){
                                             Km.Appdown.View.Running.edit_window.price.setVisible(true);
                                         }else{
                                             Km.Appdown.View.Running.edit_window.price.setVisible(false);
                                         }
                                     }
                                }
                            },
                            {fieldLabel : '价格',name : 'price',xtype : 'numberfield',ref:'../price'},
                            {fieldLabel : '版本',name : 'edition'},
                            {fieldLabel : '排序',name : 'sort_order',xtype : 'numberfield'},
                            {fieldLabel : '是否显示',hiddenName : 'isShow'
                                 ,xtype : 'combo',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否显示',
                                 valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '是否热门推荐',hiddenName : 'isHotrecommend'
                                 ,xtype:'combo',ref:'../isHotrecommend',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否热门推荐',
                                 valueField : 'value',displayField : 'text'
                            }
                        ]
                    })
                ],
                buttons : [{
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {
                        switch (Km.Appdown.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Appdown.View.EditWindow.KindEditor_introduction)this.editForm.introduction.setValue(Km.Appdown.View.EditWindow.KindEditor_introduction.html());
                                if (Km.Appdown.View.EditWindow.KindEditor_introduce)this.editForm.introduce.setValue(Km.Appdown.View.EditWindow.KindEditor_introduce.html());
                                if (Km.Appdown.View.EditWindow.KindEditor_suitabletype)this.editForm.suitabletype.setValue(Km.Appdown.View.EditWindow.KindEditor_suitabletype.html());
                                break
                            case 3:
                                if (xhEditor_introduction)this.editForm.introduction.setValue(xhEditor_introduction.getSource());
                                if (xhEditor_introduce)this.editForm.introduce.setValue(xhEditor_introduce.getSource());
                                if (xhEditor_suitabletype)this.editForm.suitabletype.setValue(xhEditor_suitabletype.getSource());
                                break
                            default:
                                if (CKEDITOR.instances.introduction) this.editForm.introduction.setValue(CKEDITOR.instances.introduction.getData());
                                if (CKEDITOR.instances.introduce) this.editForm.introduce.setValue(CKEDITOR.instances.introduce.getData());
                                if (CKEDITOR.instances.suitabletype) this.editForm.suitabletype.setValue(CKEDITOR.instances.suitabletype.getData());
                        }

                        if (!this.editForm.getForm().isValid()) {
                            return;
                        }
                        editWindow=this;
                        if (this.savetype==0){
                            this.editForm.api.submit=ExtServiceAppdown.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Appdown.View.Running.appdownGrid.doSelectAppdown();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, response) {
                                	Ext.Msg.show({title:'提示',width:350,buttons: {yes: '确定'},msg:response.result.msg});
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceAppdown.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.Appdown.View.Running.appdownGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Appdown.View.Running.appdownGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Appdown.View.Running.appdownGrid.getSelectionModel().getSelected());
                        this.imageUpload.setValue(this.image.getValue());
                        this.icoUpload.setValue(this.ico.getValue());
                        switch (Km.Appdown.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Appdown.View.EditWindow.KindEditor_introduction) Km.Appdown.View.EditWindow.KindEditor_introduction.html(Km.Appdown.View.Running.appdownGrid.getSelectionModel().getSelected().data.introduction);
                                if (Km.Appdown.View.EditWindow.KindEditor_introduce) Km.Appdown.View.EditWindow.KindEditor_introduce.html(Km.Appdown.View.Running.appdownGrid.getSelectionModel().getSelected().data.introduce);
                                if (Km.Appdown.View.EditWindow.KindEditor_suitabletype) Km.Appdown.View.EditWindow.KindEditor_suitabletype.html(Km.Appdown.View.Running.appdownGrid.getSelectionModel().getSelected().data.suitabletype);
                                break
                            case 3:
                                break
                            default:
                                if (CKEDITOR.instances.introduction) CKEDITOR.instances.introduction.setData(Km.Appdown.View.Running.appdownGrid.getSelectionModel().getSelected().data.introduction);
                                if (CKEDITOR.instances.introduce) CKEDITOR.instances.introduce.setData(Km.Appdown.View.Running.appdownGrid.getSelectionModel().getSelected().data.introduce);
                                if (CKEDITOR.instances.suitabletype) CKEDITOR.instances.suitabletype.setData(Km.Appdown.View.Running.appdownGrid.getSelectionModel().getSelected().data.suitabletype);
                        }

                    }
                }]
            }, config);
            Km.Appdown.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示应用下载详情
     */
    AppdownView:{
        /**
         * Tab页：容器包含显示与应用下载所有相关的信息
         */
        Tabs:Ext.extend(Ext.TabPanel,{
            constructor : function(config){
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
                                if (Km.Appdown.View.Running.appdownGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择应用下载！');
                                    return false;
                                }
                                Km.Appdown.Config.View.IsShow=1;
                                Km.Appdown.View.Running.appdownGrid.showAppdown();
                                Km.Appdown.View.Running.appdownGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Appdown.View.AppdownView.Tabs.superclass.constructor.call(this, config);

                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Appdown.Config.View.Direction==1)||(Km.Appdown.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabAppdownDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">应用名称</td><td class="content">{appdown_name}</td></tr>',
                         '    <tr class="entry"><td class="head">文件路径</td><td class="content">{filepath}</td></tr>',
                         '    <tr class="entry"><td class="head">图片路径</td><td class="content">{image}</td></tr>',
                         '    <tr class="entry"><td class="head">图片</td><td class="content"><img src="upload/images/{image}" /></td></tr>',
                         '    <tr class="entry"><td class="head">缩略图路径</td><td class="content">{ico}</td></tr>',
                         '    <tr class="entry"><td class="head">缩略图</td><td class="content"><img src="upload/images/{ico}" /></td></tr>',
                         '    <tr class="entry"><td class="head">简介</td><td class="content">{introduction}</td></tr>',
                         '    <tr class="entry"><td class="head">详情</td><td class="content">{introduce}</td></tr>',
                         '    <tr class="entry"><td class="head">开发者</td><td class="content">{developer}</td></tr>',
                         '    <tr class="entry"><td class="head">发布时间</td><td class="content">{publishtime:date("Y-m-d")}</td></tr>',
                         '    <tr class="entry"><td class="head">标签</td><td class="content">{tag}</td></tr>',
                         '    <tr class="entry"><td class="head">推荐等级</td><td class="content">{recommendlevelShow}</td></tr>',
                         '    <tr class="entry"><td class="head">应用分类</td><td class="content">{typeShow}</td></tr>',
                         '    <tr class="entry"><td class="head">价格</td><td class="content">{price}</td></tr>',
                         '    <tr class="entry"><td class="head">文件大小</td><td class="content">{docsize}</td></tr>',
                         '    <tr class="entry"><td class="head">版本</td><td class="content">{edition}</td></tr>',
                         '    <tr class="entry"><td class="head">下载次数</td><td class="content">{downloadcount}</td></tr>',
                         '    <tr class="entry"><td class="head">购买次数</td><td class="content">{buycount}</td></tr>',
                         '    <tr class="entry"><td class="head">排序</td><td class="content">{sort_order}</td></tr>',
                         '    <tr class="entry"><td class="head">是否显示</td><td class="content"><tpl if="isShow == true">是</tpl><tpl if="isShow == false">否</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">是否热门推荐</td><td class="content"><tpl if="isHotrecommend == true">是</tpl><tpl if="isHotrecommend == false">否</tpl></td></tr>',
                         '</table>'
                     ]}
                );
            }
        }),
        /**
         * 窗口:显示应用下载信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看应用下载",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Appdown.View.AppdownView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Appdown.Config.View.IsShow=0;
                            Km.Appdown.View.Running.appdownGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Appdown.View.Running.appdownGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Appdown.View.Running.appdownGrid.addAppdown();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Appdown.View.Running.appdownGrid.updateAppdown();}
                    }]
                }, config);
                Km.Appdown.View.AppdownView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 窗口：批量上传应用下载
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传应用下载数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传应用下载Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadAppdown',
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Appdown.View.Running.appdownGrid.doSelectAppdown();
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
            Km.Appdown.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 窗口：上传应用
     */
    UploadappWindow:Ext.extend(Ext.Window,{
        constructor : function(config){
            config = Ext.apply({
                title : '上传应用',width : 400,height : 110,minWidth : 400,minHeight : 110,
                layout : 'fit',plain : true,bodyStyle : 'padding:5px;',buttonAlign : 'center',closeAction : "hide",
                listeners:{
                    beforehide:function(){
                        this.uploadForm.upload_file.setValue("");
                        this.uploadForm.appdown_id.setValue("");
                    }
				},
                items : [
                    new Ext.form.FormPanel({
                        ref:'uploadForm',fileUpload: true,
                        width: 500,labelWidth: 50,autoHeight: true,baseCls: 'x-plain',
                        frame:true,bodyStyle: 'padding: 10px 10px 10px 10px;',
                        defaults: {
                            anchor: '95%',allowBlank: false,msgTarget: 'side'
                        },
                        items : [
                        	{xtype:"hidden",name:"appdown_id",ref:"appdown_id"},
	                        {
	                            xtype : 'fileuploadfield',
	                            fieldLabel : '应用',name : 'upload_file',ref:'upload_file',
	                            emptyText: '请上传应用文件',buttonText: '',
	                            buttonCfg: {iconCls: 'upload-icon'}
	                        }
                        ]
                    })
                ],
                buttons : [{
                        text : '上 传',
                        scope:this,
                        handler : function() {
                            var uploadWindow=this;
                            /*
                            validationExpression   =/([\u4E00-\u9FA5]|\w)+(.xlsx|.XLSX|.xls|.XLS)$/;
                            var isValidExcelFormat = new RegExp(validationExpression);
                            var result             = isValidExcelFormat.test(this.uploadForm.upload_file.getValue());
                            if (!result){
                                Ext.Msg.alert('提示', '请上传Excel文件，后缀名为xls或者xlsx！');
                                return;
                            }
                            */
                            if (this.uploadForm.getForm().isValid()) {
                                Ext.Msg.show({
                                    title : '请等待',msg : '文件正在上传中，请稍后...',
                                    animEl : 'loading',icon : Ext.Msg.WARNING,
                                    closable : true,progress : true,progressText : '',width : 300
                                });
                                this.uploadForm.getForm().submit({
                                    url : 'index.php?go=admin.upload.uploadAppfile',
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功',function(){
                                        	uploadWindow.hide();
                                        	Km.Appdown.View.Running.appdownGrid.store.reload();
										});
                                    },
                                    failure : function(form, response) {
                                        Ext.Msg.alert('错误', response.result.msg);
                                    }
                                });
                            }
                        }
                    },{
                        text : '取 消',
                        scope:this,
                        handler : function() {
                            this.hide();
                        }
                    }]
                }, config);
            Km.Appdown.View.UploadappWindow.superclass.constructor.call(this, config);
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
                            var uploadImageUrl='index.php?go=admin.upload.uploadAppdownImages';
                            if (this.uploadForm.upload_file.name=="upload_ico_files"){
                                uploadImageUrl='index.php?go=admin.upload.uploadAppdownIcos';
                            }

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
                                        Km.Appdown.View.Running.appdownGrid.doSelectAppdown();
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
            Km.Appdown.View.BatchUploadImagesWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：应用下载列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Appdown.Store.appdownStore,
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
                        {header : '应用名称',dataIndex : 'appdown_name'},
                        {header : '开发者',dataIndex : 'developer'},
                        {header : '发布时间',dataIndex : 'publishtime',renderer:Ext.util.Format.dateRenderer('Y-m-d')},
                        {header : '推荐等级',dataIndex : 'recommendlevelShow'},
                        {header : '应用分类',dataIndex : 'typeShow'},
                        {header : '价格',dataIndex : 'price'},
                        {header : '排序',dataIndex : 'sort_order'},
                        {header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '是否热门推荐',dataIndex : 'isHotrecommend',renderer:function(value){if (value == true) {return "是";}else{return "否";}}}
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
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectAppdown();
                                    }
                                }
                            },
                            items : [
                                '应用分类 ','&nbsp;&nbsp;',{ref: '../atype',xtype : 'combo',mode : 'local',
                                    triggerAction : 'all',lazyRender : true,editable: false,
                                    store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['1', '游戏天地'],['2', '影音娱乐'],['3', '教育阅读'],['4', '旅行购物'],['5', '生活休闲']]
                                    }),
                                    valueField : 'value',displayField : 'text'
                                },'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectAppdown();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.atype.setValue("");
                                        this.filter={};
                                        this.doSelectAppdown();
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
                                    text : '添加应用下载',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addAppdown();
                                    }
                                },'-',{
                                    text : '修改应用下载',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateAppdown();
                                    }
                                },'-',{
                                    text : '删除应用下载', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteAppdown();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importAppdown();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入应用下载',iconCls : 'icon-import',scope:this,handler:function(){this.importAppdown()}},
                                            {text:'批量导入图片',iconCls : 'icon-import',scope:this,handler:function(){this.batchUploadImages("upload_image_files","图片")}},
                                            {text:'批量导入缩略图',iconCls : 'icon-import',scope:this,handler:function(){this.batchUploadImages("upload_ico_files","缩略图")}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportAppdown();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看应用下载', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showAppdown()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideAppdown();Km.Appdown.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Appdown.Cookie.set('View.IsFix',Km.Appdown.Config.View.IsFix);}}
                                        ]}
                                },'-',{
                                    text : '上传应用',iconCls : 'icon-import',ref:"../../btnUploadapp",disabled : true,
                                    handler : function() {
                                        this.showUploadapp();
                                    }
                                }
                            ]
                        }
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Appdown.Config.PageSize,
                    store: Km.Appdown.Store.appdownStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Appdown.Viewport){
                                if (Km.Appdown.Config.View.IsShow==1){
                                    Km.Appdown.View.IsSelectView=1;
                                }
                                this.ownerCt.hideAppdown();
                                Km.Appdown.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Appdown.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Appdown.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Appdown.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectAppdown();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Appdown.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Appdown.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectAppdown();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示应用下载列表
            this.doSelectAppdown();
            Km.Appdown.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的应用下载信息Tab页
            Km.Appdown.View.Running.viewTabs=new Km.Appdown.View.AppdownView.Tabs();
            this.addListener('rowdblclick', this.onRowDoubleClick);
        },
        /**
         * 行选择器
         */
        sm : new Ext.grid.CheckboxSelectionModel({
            listeners : {
                selectionchange:function(sm) {
                    // 判断删除和更新按钮是否可以激活
                    this.grid.btnRemove.setDisabled(sm.getCount() < 1);
                    this.grid.btnUpdate.setDisabled(sm.getCount() != 1);
                    this.grid.tvpView.setDisabled(sm.getCount() != 1);
                    this.grid.btnUploadapp.setDisabled(sm.getCount() != 1);
                },
                rowselect: function(sm, rowIndex, record) {
                    this.grid.updateViewAppdown();
                    if (sm.getCount() != 1){
                        this.grid.hideAppdown();
                        Km.Appdown.Config.View.IsShow=0;
                        this.grid.hideUploadapp();
                    }else{
                        if (Km.Appdown.View.IsSelectView==1){
                            Km.Appdown.View.IsSelectView=0;
                            this.grid.showAppdown();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Appdown.Config.View.IsShow==1){
                            Km.Appdown.View.IsSelectView=1;
                        }
                        this.grid.hideAppdown();
                        Km.Appdown.Config.View.IsShow=0;
                        this.grid.hideUploadapp();
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Appdown.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showAppdown();
                this.tvpView.toggle(true);
            }else{
                this.hideAppdown();
                Km.Appdown.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Appdown.Config.View.IsFix=1;
            }else{
               Km.Appdown.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Appdown.Config.View.IsShow=0;
                return ;
            }
            if (Km.Appdown.Config.View.IsShow==1){
               this.hideAppdown();
               Km.Appdown.Config.View.IsShow=0;
            }
            this.showAppdown();
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
         * 查询符合条件的应用下载
         */
        doSelectAppdown : function() {
            if (this.topToolbar){
                var atype = this.topToolbar.atype.getValue();
                this.filter       ={'type':atype};
            }
            var condition = {'start':0,'limit':Km.Appdown.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceAppdown.queryPageAppdown(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Appdown.Store.appdownStore.loadData(result);
                } else {
                    Km.Appdown.Store.appdownStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的应用下载！');
                }
            });
            if (Km.Appdown.View.Running.uploadappWindow!=null){
                Km.Appdown.View.Running.uploadappWindow.hide();
            }
        },
        /**
         * 显示应用下载视图
         * 显示应用下载的视图相对应用下载列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Appdown.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Appdown.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Appdown.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Appdown.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Appdown.View.Running.viewTabs);
                    break;
            }
            Km.Appdown.Cookie.set('View.Direction',Km.Appdown.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Appdown.Config.View.IsFix==0)&&(Km.Appdown.Config.View.IsShow==1)){
                    this.showAppdown();
                }
                Km.Appdown.Config.View.IsFix=1;
                Km.Appdown.View.Running.appdownGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Appdown.Config.View.IsShow=0;
                this.showAppdown();
            }
        },
        /**
         * 显示应用下载
         */
        showAppdown : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择应用下载！');
                Km.Appdown.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Appdown.Config.View.IsFix==0){
                if (Km.Appdown.View.Running.view_window==null){
                    Km.Appdown.View.Running.view_window=new Km.Appdown.View.AppdownView.Window();
                }
                if (Km.Appdown.View.Running.view_window.hidden){
                    Km.Appdown.View.Running.view_window.show();
                    Km.Appdown.View.Running.view_window.winTabs.hideTabStripItem(Km.Appdown.View.Running.view_window.winTabs.tabFix);
                    this.updateViewAppdown();
                    this.tvpView.toggle(true);
                    Km.Appdown.Config.View.IsShow=1;
                }else{
                    this.hideAppdown();
                    Km.Appdown.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Appdown.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Appdown.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Appdown.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Appdown.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Appdown.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Appdown.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Appdown.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Appdown.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Appdown.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideAppdown();
            if (Km.Appdown.Config.View.IsShow==0){
                Km.Appdown.View.Running.viewTabs.enableCollapse();
                switch(Km.Appdown.Config.View.Direction){
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
                this.updateViewAppdown();
                this.tvpView.toggle(true);
                Km.Appdown.Config.View.IsShow=1;
            }else{
                Km.Appdown.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏应用下载
         */
        hideAppdown : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Appdown.View.Running.view_window!=null){
                Km.Appdown.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前应用下载显示信息
         */
        updateViewAppdown : function() {
            if (Km.Appdown.View.Running.view_window!=null){
                Km.Appdown.View.Running.view_window.winTabs.tabAppdownDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Appdown.View.Running.viewTabs.tabAppdownDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建应用下载
         */
        addAppdown : function() {
            if (Km.Appdown.View.Running.edit_window==null){
                Km.Appdown.View.Running.edit_window=new Km.Appdown.View.EditWindow();
            }
            Km.Appdown.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Appdown.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Appdown.View.Running.edit_window.setTitle('添加应用下载');
            Km.Appdown.View.Running.edit_window.savetype=0;
            Km.Appdown.View.Running.edit_window.appdown_id.setValue("");
            Km.Appdown.View.Running.edit_window.imageUpload.setValue("");
            Km.Appdown.View.Running.edit_window.icoUpload.setValue("");
            Km.Appdown.View.Running.edit_window.isFree.setValue("1");
            Km.Appdown.View.Running.edit_window.price.setVisible(false);
            Km.Appdown.View.Running.edit_window.isHotrecommend.setValue("0");
            switch (Km.Appdown.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Appdown.View.EditWindow.KindEditor_introduction) Km.Appdown.View.EditWindow.KindEditor_introduction.html("");
                    if (Km.Appdown.View.EditWindow.KindEditor_introduce) Km.Appdown.View.EditWindow.KindEditor_introduce.html("");
                    if (Km.Appdown.View.EditWindow.KindEditor_suitabletype) Km.Appdown.View.EditWindow.KindEditor_suitabletype.html("");
                    break
                case 3:
                    break
                default:
                    if (CKEDITOR.instances.introduction) CKEDITOR.instances.introduction.setData("");
                    if (CKEDITOR.instances.introduce) CKEDITOR.instances.introduce.setData("");
                    if (CKEDITOR.instances.suitabletype) CKEDITOR.instances.suitabletype.setData("");
            }

            Km.Appdown.View.Running.edit_window.show();
            Km.Appdown.View.Running.edit_window.maximize();
        },
        /**
         * 编辑应用下载时先获得选中的应用下载信息
         */
        updateAppdown : function() {
            if (Km.Appdown.View.Running.edit_window==null){
                Km.Appdown.View.Running.edit_window=new Km.Appdown.View.EditWindow();
            }
            Km.Appdown.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Appdown.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Appdown.View.Running.edit_window.setTitle('修改应用下载');
            Km.Appdown.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Appdown.View.Running.edit_window.savetype=1;
            Km.Appdown.View.Running.edit_window.imageUpload.setValue(Km.Appdown.View.Running.edit_window.image.getValue());
            Km.Appdown.View.Running.edit_window.icoUpload.setValue(Km.Appdown.View.Running.edit_window.ico.getValue());
            if (this.getSelectionModel().getSelected().data.isFree==1){
                Km.Appdown.View.Running.edit_window.price.setVisible(false);
            }else{
                Km.Appdown.View.Running.edit_window.price.setVisible(true);
            }
            switch (Km.Appdown.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Appdown.View.EditWindow.KindEditor_introduction) Km.Appdown.View.EditWindow.KindEditor_introduction.html(this.getSelectionModel().getSelected().data.introduction);
                    if (Km.Appdown.View.EditWindow.KindEditor_introduce) Km.Appdown.View.EditWindow.KindEditor_introduce.html(this.getSelectionModel().getSelected().data.introduce);
                    if (Km.Appdown.View.EditWindow.KindEditor_suitabletype) Km.Appdown.View.EditWindow.KindEditor_suitabletype.html(this.getSelectionModel().getSelected().data.suitabletype);
                    break
                case 3:
                    if (xhEditor_introduction)xhEditor_introduction.setSource(this.getSelectionModel().getSelected().data.introduction);
                    if (xhEditor_introduce)xhEditor_introduce.setSource(this.getSelectionModel().getSelected().data.introduce);
                    if (xhEditor_suitabletype)xhEditor_suitabletype.setSource(this.getSelectionModel().getSelected().data.suitabletype);
                    break
                default:
                    if (CKEDITOR.instances.introduction) CKEDITOR.instances.introduction.setData(this.getSelectionModel().getSelected().data.introduction);
                    if (CKEDITOR.instances.introduce) CKEDITOR.instances.introduce.setData(this.getSelectionModel().getSelected().data.introduce);
                    if (CKEDITOR.instances.suitabletype) CKEDITOR.instances.suitabletype.setData(this.getSelectionModel().getSelected().data.suitabletype);
            }

            Km.Appdown.View.Running.edit_window.show();
            Km.Appdown.View.Running.edit_window.maximize();
        },
        /**
         * 删除应用下载
         */
        deleteAppdown : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的应用下载吗?', this.confirmDeleteAppdown,this);
        },
        /**
         * 确认删除应用下载
         */
        confirmDeleteAppdown : function(btn) {
            if (btn == 'yes') {
                var del_appdown_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_appdown_ids=del_appdown_ids+selectedRows[flag].data.appdown_id+",";
                }
                ExtServiceAppdown.deleteByIds(del_appdown_ids);
                this.doSelectAppdown();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出应用下载
         */
        exportAppdown : function() {
            ExtServiceAppdown.exportAppdown(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入应用下载
         */
        importAppdown : function() {
            if (Km.Appdown.View.current_uploadWindow==null){
                Km.Appdown.View.current_uploadWindow=new Km.Appdown.View.UploadWindow();
            }
            Km.Appdown.View.current_uploadWindow.show();
        },
        /**
         * 批量上传商品图片
         */
        batchUploadImages:function(inputname,title){
            if (Km.Appdown.View.Running.batchUploadImagesWindow!=null){
                Km.Appdown.View.Running.batchUploadImagesWindow.destroy();
                Km.Appdown.View.Running.batchUploadImagesWindow=null;
            }
            Km.Appdown.View.Running.batchUploadImagesWindow=new Km.Appdown.View.BatchUploadImagesWindow();

            Km.Appdown.View.Running.batchUploadImagesWindow.setTitle("批量上传"+title);
            Km.Appdown.View.Running.batchUploadImagesWindow.uploadForm.upload_file.name=inputname;
            Km.Appdown.View.Running.batchUploadImagesWindow.show();
        },
        /**
         * 显示上传应用
         */
        showUploadapp : function() {
            if (Km.Appdown.View.Running.uploadappWindow==null){
                Km.Appdown.View.Running.uploadappWindow=new Km.Appdown.View.UploadappWindow();
            }
            var appdown_id=Km.Appdown.View.Running.appdownGrid.getSelectionModel().getSelected().data.appdown_id;
            Km.Appdown.View.Running.uploadappWindow.uploadForm.appdown_id.setValue(appdown_id);
            Km.Appdown.View.Running.uploadappWindow.show();
        },
        hideUploadapp:function(){
        	if (Km.Appdown.View.Running.uploadappWindow!=null){
                Km.Appdown.View.Running.uploadappWindow.hide();
            }
            this.btnUploadapp.toggle(false);
		}
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Appdown.View.Running.appdownGrid=new Km.Appdown.View.Grid();
            if (Km.Appdown.Config.View.IsFix==0){
                Km.Appdown.View.Running.appdownGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Appdown.View.Running.appdownGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Appdown.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Appdown.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前应用下载Grid对象
         */
        appdownGrid:null,
        /**
         * 上传应用
         */
        uploadappWindow:null,
        /**
         * 显示应用下载信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Appdown.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Appdown.Init();
    /**
     * 应用下载数据模型获取数据Direct调用
     */
    Km.Appdown.Store.appdownStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceAppdown.queryPageAppdown}
    });
    /**
     * 应用下载页面布局
     */
    Km.Appdown.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Appdown.View.Panel()]
    });
    Km.Appdown.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});