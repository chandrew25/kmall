Ext.namespace("Kmall.Admin.Ptypeattr");
Km = Kmall.Admin;
Km.Ptypeattr={
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
             * 显示分类属性的视图相对分类属性列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示分类属性信息页(或者打开新窗口)
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
        if (Km.Ptypeattr.Cookie.get('View.Direction')){
            Km.Ptypeattr.Config.View.Direction=Km.Ptypeattr.Cookie.get('View.Direction');
        }
        if (Km.Ptypeattr.Cookie.get('View.IsFix')!=null){
            Km.Ptypeattr.Config.View.IsFix=Km.Ptypeattr.Cookie.get('View.IsFix');
        }
    }
};
/**
 * Model:数据模型
 */
Km.Ptypeattr.Store = {
    /**
     * 分类属性
     */
    ptypeattrStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'ptypeattr_id',type: 'int'},
                {name: 'attribute_id',type: 'int'},
                {name: 'attribute_name',type: 'string'},
                {name: 'attributeShowAll',type: 'string'},
                {name: 'ptype_id',type: 'int'},
                {name: 'ptype_name',type: 'string'},
                {name: 'ptype1_id',type: 'int'},
                {name: 'ptype2_id',type: 'int'},
                {name: 'attribute1_id',type: 'int'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Ptypeattr.Config.PageSize;
                    Ext.apply(options.params, Km.Ptypeattr.View.Running.ptypeattrGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 商品类型
     */
    ptypeStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'ptype_id',type: 'int'},
                {name: 'name',type: 'string'},
                {name: 'ico',type: 'string'},
                {name: 'show_in_nav',type: 'string'},
                {name: 'countChild',type: 'string'},
                {name: 'level',type: 'string'},
                {name: 'parent_id',type: 'int'},
                {name: 'isShow',type: 'string'},
                {name: 'sort_order',type: 'int'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Ptypeattr.Config.PageSize;
                    Ext.apply(options.params, Km.Ptypeattr.View.Running.ptypeGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 属性表
     */
    attributeStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'attribute_id',type: 'int'},
                {name: 'name',type: 'string'},
                {name: 'level',type: 'string'},
                {name: 'parent_id',type: 'int'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Ptypeattr.Config.PageSize;
                    Ext.apply(options.params, Km.Ptypeattr.View.Running.attributeGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    })
};
/**
 * View:分类属性显示组件
 */
Km.Ptypeattr.View={
    /**
     * 编辑窗口：新建或者修改分类属性
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
                            {xtype: 'hidden',  name : 'ptypeattr_id',ref:'../ptypeattr_id'},
                            {xtype: 'hidden',name : 'attribute_id',ref:'../attribute_id'},
                            {
                                  xtype: 'compositefield',ref: '../attributecomp',
                                  items: [
                                      {
                                          xtype:'combotree', fieldLabel:'属性',ref:'attribute_name',name: 'attribute_name',grid:this,
                                          emptyText: '请选择属性',canFolderSelect:true,flex:1,editable:false,
                                          tree: new Ext.tree.TreePanel({
                                              dataUrl: 'home/admin/src/httpdata/attributeTree.php',
                                              root: {nodeType: 'async'},border: false,rootVisible: false,
                                              listeners: {
                                                  beforeload: function(n) {if (n) {this.getLoader().baseParams.id = n.attributes.id;}}
                                              }
                                          }),
                                          onSelect: function(cmb, node) {
                                              this.grid.attribute_id.setValue(node.attributes.id);
                                              this.setValue(node.attributes.text);
                                          }
                                      },
                                      {xtype:'displayfield',value:'所选属性:',ref: 'attributeShowLabel'},{xtype:'displayfield',ref:'attributeShowAll',name:'attributeShowAll',flex:1,ref: 'attributeShowValue'}]
                            },
                            {xtype: 'hidden',name : 'ptype_id',ref:'../ptype_id'},
                            {
                                  xtype: 'compositefield',ref: '../ptypecomp',
                                  items: [
                                      {
                                          xtype:'combotree', fieldLabel:'分类',ref:'ptype_name',name: 'ptype_name',grid:this,
                                          emptyText: '请选择分类',canFolderSelect:false,flex:1,editable:false,
                                          tree: new Ext.tree.TreePanel({
                                              dataUrl: 'home/admin/src/httpdata/ptypeTree.php',
                                              root: {nodeType: 'async'},border: false,rootVisible: false,
                                              listeners: {
                                                  beforeload: function(n) {if (n) {this.getLoader().baseParams.id = n.attributes.id;}}
                                              }
                                          }),
                                          onSelect: function(cmb, node) {
                                              this.grid.ptype_id.setValue(node.attributes.id);
                                              this.setValue(node.attributes.text);
                                          }
                                      },
                                      {xtype:'displayfield',value:'所选分类:',ref: 'ptypeShowLabel'},{xtype:'displayfield',ref:'ptypeShowAll',name:'ptypeShowAll',flex:1,ref: 'ptypeShowValue'}]
                            },
                            {fieldLabel : '分类[一级]',name : 'ptype1_id',xtype : 'numberfield'},
                            {fieldLabel : '分类[二级]',name : 'ptype2_id',xtype : 'numberfield'},
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
                            this.editForm.api.submit=ExtServicePtypeattr.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Ptypeattr.View.Running.ptypeattrGrid.doSelectPtypeattr();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServicePtypeattr.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.Ptypeattr.View.Running.ptypeattrGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Ptypeattr.View.Running.ptypeattrGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Ptypeattr.View.Running.ptypeattrGrid.getSelectionModel().getSelected());

                    }
                }]
            }, config);
            Km.Ptypeattr.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示分类属性详情
     */
    PtypeattrView:{
        /**
         * Tab页：容器包含显示与分类属性所有相关的信息
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
                                if (Km.Ptypeattr.View.Running.ptypeattrGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择分类属性！');
                                    return false;
                                }
                                Km.Ptypeattr.Config.View.IsShow=1;
                                Km.Ptypeattr.View.Running.ptypeattrGrid.showPtypeattr();
                                Km.Ptypeattr.View.Running.ptypeattrGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Ptypeattr.View.PtypeattrView.Tabs.superclass.constructor.call(this, config);
                Km.Ptypeattr.View.Running.ptypeGrid=new Km.Ptypeattr.View.PtypeView.Grid();
                Km.Ptypeattr.View.Running.attributeGrid=new Km.Ptypeattr.View.AttributeView.Grid();
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Ptypeattr.Config.View.Direction==1)||(Km.Ptypeattr.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabPtypeattrDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">属性</td><td class="content">{attribute_name}<tpl if="attribute_name">({attributeShowAll})</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">分类</td><td class="content">{ptype_name}</td></tr>',
                         '    <tr class="entry"><td class="head">分类[一级]</td><td class="content">{ptype1_id}</td></tr>',
                         '    <tr class="entry"><td class="head">分类[二级]</td><td class="content">{ptype2_id}</td></tr>',
                         '    <tr class="entry"><td class="head">属性分类[一级]</td><td class="content">{attribute1_id}</td></tr>',
                         '</table>'
                     ]}
                );
                this.add(
                    {title: '商品类型',iconCls:'tabs',tabWidth:150,
                     items:[Km.Ptypeattr.View.Running.ptypeGrid]
                    },
                    {title: '属性表',iconCls:'tabs',tabWidth:150,
                     items:[Km.Ptypeattr.View.Running.attributeGrid]
                    }
                );
            }
        }),
        /**
         * 窗口:显示分类属性信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看分类属性",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Ptypeattr.View.PtypeattrView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Ptypeattr.Config.View.IsShow=0;
                            Km.Ptypeattr.View.Running.ptypeattrGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Ptypeattr.View.Running.ptypeattrGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Ptypeattr.View.Running.ptypeattrGrid.addPtypeattr();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Ptypeattr.View.Running.ptypeattrGrid.updatePtypeattr();}
                    }]
                }, config);
                Km.Ptypeattr.View.PtypeattrView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 视图：商品类型列表
     */
    PtypeView:{
        /**
         *  当前创建的商品类型编辑窗口
         */
        edit_window:null,
        /**
         * 编辑窗口：新建或者修改商品类型
         */
        EditWindow:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    /**
                     * 自定义类型:保存类型
                     * 0:保存窗口,1:修改窗口
                     */
                    savetype:0,closeAction : "hide",constrainHeader:true,maximizable: true,collapsible: true,
                    width : 450,height : 550,minWidth : 400,minHeight : 450,
                    layout : 'fit',plain : true,buttonAlign : 'center',
                    defaults : {autoScroll : true},
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
                                {xtype: 'hidden',  name : 'ptype_id',ref:'../ptype_id'},
                                {fieldLabel : '名称',name : 'name'},
                                {xtype: 'hidden',  name : 'ico',ref:'../ico'},
                                {fieldLabel : '缩略图',name : 'icoUpload',ref:'../icoUpload',xtype:'fileuploadfield',
                               emptyText: '请上传缩略图文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                                {fieldLabel : '是否显示在导航栏',hiddenName : 'show_in_nav'
                                     ,xtype : 'combo',mode : 'local',triggerAction : 'all',
                                     lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                     store : new Ext.data.SimpleStore({
                                         fields : ['value', 'text'],
                                         data : [['0', '否'], ['1', '是']]
                                     }),emptyText: '请选择是否显示在导航栏',
                                     valueField : 'value',displayField : 'text'
                                },
                                {fieldLabel : '子数量',name : 'countChild'},
                                {fieldLabel : '目录层级',name : 'level'},
                            {xtype: 'hidden',name : 'parent_id',ref:'../parent_id'},
                            {
                                  xtype: 'compositefield',ref: '../ptypecomp',
                                  items: [
                                      {
                                          xtype:'combotree', fieldLabel:'上级分类',ref:'ptype_name',name: 'ptype_name',grid:this,
                                          emptyText: '请选择上级分类',canFolderSelect:false,flex:1,editable:false,
                                          tree: new Ext.tree.TreePanel({
                                              dataUrl: 'home/admin/src/httpdata/ptypeTree.php',
                                              root: {nodeType: 'async'},border: false,rootVisible: false,
                                              listeners: {
                                                  beforeload: function(n) {if (n) {this.getLoader().baseParams.id = n.attributes.id;}}
                                              }
                                          }),
                                          onSelect: function(cmb, node) {
                                              this.grid.parent_id.setValue(node.attributes.id);
                                              this.setValue(node.attributes.text);
                                          }
                                      },
                                      {xtype:'displayfield',value:'所选上级分类:',ref: 'ptypeShowLabel'},{xtype:'displayfield',ref:'ptypeShowAll',name:'ptypeShowAll',flex:1,ref: 'ptypeShowValue'}]
                            },
                                {fieldLabel : '是否显示',hiddenName : 'isShow'
                                     ,xtype : 'combo',mode : 'local',triggerAction : 'all',
                                     lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                     store : new Ext.data.SimpleStore({
                                         fields : ['value', 'text'],
                                         data : [['0', '否'], ['1', '是']]
                                     }),emptyText: '请选择是否显示',
                                     valueField : 'value',displayField : 'text'
                                },
                                {fieldLabel : '排序',name : 'sort_order',xtype : 'numberfield'}
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
                                this.editForm.api.submit=ExtServicePtype.save;
                                this.editForm.getForm().submit({
                                    success : function(form, action) {
                                        Ext.Msg.alert("提示", "保存成功！");
                                        Km.Ptypeattrattr.View.Running.ptypeGrid.doSelectPtype();
                                        form.reset();
                                        editWindow.hide();
                                    },
                                    failure : function(form, action) {
                                        Ext.Msg.alert('提示', '失败');
                                    }
                                });
                            }else{
                                this.editForm.api.submit=ExtServicePtype.update;
                                this.editForm.getForm().submit({
                                    success : function(form, action) {
                                        Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                            Km.Ptypeattrattr.View.Running.ptypeGrid.bottomToolbar.doRefresh();
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
                            this.editForm.form.loadRecord(Km.Ptypeattrattr.View.Running.ptypeGrid.getSelectionModel().getSelected());
                        }
                    }]
                }, config);
                Km.Ptypeattrattr.View.EditWindow.superclass.constructor.call(this, config);
            }
        }),
        /**
         * 查询条件
         */
        filter:null,
        /**
         * 视图：商品类型列表
         */
        Grid:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Ptypeattr.Store.ptypeStore,sm : this.sm,
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {autoScroll : true},
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                            width:120,sortable : true
                        },
                        columns : [
                            this.sm,
                            {header : '标识',dataIndex : 'ptype_id',hidden:true},
                            {header : '名称',dataIndex : 'name'},
                            {header : '缩略图',dataIndex : 'ico'},
                            {header : '是否显示在导航栏',dataIndex : 'show_in_nav',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                            {header : '子数量',dataIndex : 'countChild'},
                            {header : '目录层级',dataIndex : 'level'},
                            {header : '上级分类',dataIndex : 'parent_id'},
                            {header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                            {header : '排序',dataIndex : 'sort_order'}
                        ]
                    }),
                    tbar : {
                        xtype : 'container',layout : 'anchor',
                        height : 27,style:'font-size:14px',
                        defaults : {
                            height : 27,anchor : '100%'
                        },
                        items : [
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
                                        text : '添加商品类型',iconCls : 'icon-add',
                                        handler : function() {
                                            this.addPtype();
                                        }
                                    },'-',{
                                        text : '修改商品类型',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                        handler : function() {
                                            this.updatePtype();
                                        }
                                    },'-',{
                                        text : '删除商品类型', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                        handler : function() {
                                            this.deletePtype();
                                        }
                                    },'-']}
                        )]
                    },
                    bbar: new Ext.PagingToolbar({
                        pageSize: Km.Ptypeattr.Config.PageSize,
                        store: Km.Ptypeattr.Store.ptypeStore,scope:this,autoShow:true,displayInfo: true,
                        displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',emptyMsg: "无显示数据",
                        items: [
                            {xtype:'label', text: '每页显示'},
                            {xtype:'numberfield', value:Km.Ptypeattr.Config.PageSize,minValue:1,width:35,style:'text-align:center',allowBlank: false,
                                listeners:
                                {
                                    change:function(Field, newValue, oldValue){
                                        var num = parseInt(newValue);
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Ptypeattr.Config.PageSize;
                                            Field.setValue(num);
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Ptypeattr.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectPtype();
                                    },
                                    specialKey :function(field,e){
                                        if (e.getKey() == Ext.EventObject.ENTER){
                                            var num = parseInt(field.getValue());
                                            if (isNaN(num) || !num || num<1)num = Km.Ptypeattr.Config.PageSize;
                                            this.ownerCt.pageSize= num;
                                            Km.Ptypeattr.Config.PageSize = num;
                                            this.ownerCt.ownerCt.doSelectPtype();
                                        }
                                    }
                                }
                            },{xtype:'label', text: '个'}
                        ]
                    })
                }, config);
                /**
                 * 商品类型数据模型获取数据Direct调用
                 */
                Km.Ptypeattr.Store.ptypeStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServicePtype.queryPagePtype}
                });
                Km.Ptypeattr.View.PtypeView.Grid.superclass.constructor.call(this, config);
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
                    }
                }
            }),
            /**
             * 查询符合条件的商品类型
             */
            doSelectPtype : function() {
                if (Km.Ptypeattr.View.Running.ptypeattrGrid&&Km.Ptypeattr.View.Running.ptypeattrGrid.getSelectionModel().getSelected()){
                    var ptypeattr_id = Km.Ptypeattr.View.Running.ptypeattrGrid.getSelectionModel().getSelected().data.ptypeattr_id;
                    var condition = {'ptypeattr_id':ptypeattr_id,'start':0,'limit':Km.Ptypeattr.Config.PageSize};
                    this.filter       ={'ptypeattr_id':ptypeattr_id};
                    ExtServicePtype.queryPagePtype(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                result['totalCount'] =response.result.totalCount;
                                Km.Ptypeattr.Store.ptypeStore.loadData(result);
                            } else {
                                Km.Ptypeattr.Store.ptypeStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的商品类型！');
                            }
                            if (Km.Ptypeattr.Store.ptypeStore.getTotalCount()>Km.Ptypeattr.Config.PageSize){
                                 Km.Ptypeattr.View.Running.ptypeGrid.bottomToolbar.show();
                            }else{
                                 Km.Ptypeattr.View.Running.ptypeGrid.bottomToolbar.hide();
                            }
                            Km.Ptypeattr.View.Running.ptypeattrGrid.ownerCt.doLayout();
                        }
                    });
                }
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
             * 新建商品类型
             */
            addPtype : function(){
                if (Km.Ptypeattr.View.PtypeView.edit_window==null){
                    Km.Ptypeattr.View.PtypeView.edit_window=new Km.Ptypeattr.View.PtypeView.EditWindow();
                }
                Km.Ptypeattr.View.PtypeView.edit_window.resetBtn.setVisible(false);
                Km.Ptypeattr.View.PtypeView.edit_window.saveBtn.setText('保 存');
                Km.Ptypeattr.View.PtypeView.edit_window.setTitle('添加商品类型');
                Km.Ptypeattr.View.PtypeView.edit_window.savetype=0;
                Km.Ptypeattr.View.PtypeView.edit_window.ptype_id.setValue("");
                var company_id = Km.Ptypeattr.View.Running.ptypeattrGrid.getSelectionModel().getSelected().data.ptypeattr_id;
                Km.Ptypeattr.View.PtypeView.edit_window.ptypeattr_id.setValue(company_id);
                Km.Ptype.View.Running.edit_window.icoUpload.setValue("");

            Km.Ptype.View.Running.edit_window.ptypecomp.ptypeShowLabel.setVisible(false);
            Km.Ptype.View.Running.edit_window.ptypecomp.ptypeShowValue.setVisible(false);

                Km.Ptypeattr.View.PtypeView.edit_window.show();
                Km.Ptypeattr.View.PtypeView.edit_window.maximize();
            },
            /**
             * 编辑商品类型时先获得选中的商品类型信息
             */
            updatePtype : function() {
                if (Km.Ptypeattr.View.PtypeView.edit_window==null){
                    Km.Ptypeattr.View.PtypeView.edit_window=new Km.Ptypeattr.View.PtypeView.EditWindow();
                }
                Km.Ptypeattr.View.PtypeView.edit_window.saveBtn.setText('修 改');
                Km.Ptypeattr.View.PtypeView.edit_window.resetBtn.setVisible(true);
                Km.Ptypeattr.View.PtypeView.edit_window.setTitle('修改商品类型');
                Km.Ptypeattr.View.PtypeView.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
                Km.Ptypeattr.View.PtypeView.edit_window.savetype=1;
                Km.Ptype.View.Running.edit_window.icoUpload.setValue(Km.Ptype.View.Running.edit_window.ico.getValue());

            if (this.getSelectionModel().getSelected().data.ptypeShowAll){
                Km.Ptype.View.Running.edit_window.ptypecomp.ptypeShowLabel.setVisible(true);
                Km.Ptype.View.Running.edit_window.ptypecomp.ptypeShowValue.setVisible(true);
            }else{
                Km.Ptype.View.Running.edit_window.ptypecomp.ptypeShowLabel.setVisible(false);
                Km.Ptype.View.Running.edit_window.ptypecomp.ptypeShowValue.setVisible(false);
            }

                Km.Ptypeattr.View.PtypeView.edit_window.show();
                Km.Ptypeattr.View.PtypeView.edit_window.maximize();
            },
            /**
             * 删除商品类型
             */
            deletePtype : function() {
                Ext.Msg.confirm('提示', '确实要删除所选的商品类型吗?', this.confirmDeletePtype,this);
            },
            /**
             * 确认删除商品类型
             */
            confirmDeletePtype : function(btn) {
                if (btn == 'yes') {
                    var del_ptype_ids ="";
                    var selectedRows    = this.getSelectionModel().getSelections();
                    for ( var flag = 0; flag < selectedRows.length; flag++) {
                        del_ptype_ids=del_ptype_ids+selectedRows[flag].data.ptype_id+",";
                    }
                    ExtServicePtype.deleteByIds(del_ptype_ids);
                    this.doSelectPtype();
                    Ext.Msg.alert("提示", "删除成功！");
                }
            }
        })
    },
    /**
     * 视图：属性表列表
     */
    AttributeView:{
        /**
         *  当前创建的属性表编辑窗口
         */
        edit_window:null,
        /**
         * 编辑窗口：新建或者修改属性表
         */
        EditWindow:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    /**
                     * 自定义类型:保存类型
                     * 0:保存窗口,1:修改窗口
                     */
                    savetype:0,closeAction : "hide",constrainHeader:true,maximizable: true,collapsible: true,
                    width : 450,height : 550,minWidth : 400,minHeight : 450,
                    layout : 'fit',plain : true,buttonAlign : 'center',
                    defaults : {autoScroll : true},
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
                                {xtype: 'hidden',  name : 'attribute_id',ref:'../attribute_id'},
                                {fieldLabel : '属性名',name : 'name'},
                                {fieldLabel : '属性层级',name : 'level'},
                                {fieldLabel : '上级分类',name : 'parent_id',xtype : 'numberfield'}
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
                                this.editForm.api.submit=ExtServiceAttribute.save;
                                this.editForm.getForm().submit({
                                    success : function(form, action) {
                                        Ext.Msg.alert("提示", "保存成功！");
                                        Km.Ptypeattr.View.Running.attributeGrid.doSelectAttribute();
                                        form.reset();
                                        editWindow.hide();
                                    },
                                    failure : function(form, action) {
                                        Ext.Msg.alert('提示', '失败');
                                    }
                                });
                            }else{
                                this.editForm.api.submit=ExtServiceAttribute.update;
                                this.editForm.getForm().submit({
                                    success : function(form, action) {
                                        Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                            Km.Ptypeattr.View.Running.attributeGrid.bottomToolbar.doRefresh();
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
                            this.editForm.form.loadRecord(Km.Ptypeattr.View.Running.attributeGrid.getSelectionModel().getSelected());
                        }
                    }]
                }, config);
                Km.Ptypeattr.View.EditWindow.superclass.constructor.call(this, config);
            }
        }),
        /**
         * 查询条件
         */
        filter:null,
        /**
         * 视图：属性表列表
         */
        Grid:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Ptypeattr.Store.attributeStore,sm : this.sm,
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {autoScroll : true},
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                            width:120,sortable : true
                        },
                        columns : [
                            this.sm,
                            {header : '标识',dataIndex : 'attribute_id',hidden:true},
                            {header : '属性名',dataIndex : 'name'},
                            {header : '属性层级',dataIndex : 'level'},
                            {header : '上级分类',dataIndex : 'parent_id'}
                        ]
                    }),
                    tbar : {
                        xtype : 'container',layout : 'anchor',
                        height : 27,style:'font-size:14px',
                        defaults : {
                            height : 27,anchor : '100%'
                        },
                        items : [
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
                                        text : '添加属性表',iconCls : 'icon-add',
                                        handler : function() {
                                            this.addAttribute();
                                        }
                                    },'-',{
                                        text : '修改属性表',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                        handler : function() {
                                            this.updateAttribute();
                                        }
                                    },'-',{
                                        text : '删除属性表', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                        handler : function() {
                                            this.deleteAttribute();
                                        }
                                    },'-']}
                        )]
                    },
                    bbar: new Ext.PagingToolbar({
                        pageSize: Km.Ptypeattr.Config.PageSize,
                        store: Km.Ptypeattr.Store.attributeStore,scope:this,autoShow:true,displayInfo: true,
                        displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',emptyMsg: "无显示数据",
                        items: [
                            {xtype:'label', text: '每页显示'},
                            {xtype:'numberfield', value:Km.Ptypeattr.Config.PageSize,minValue:1,width:35,style:'text-align:center',allowBlank: false,
                                listeners:
                                {
                                    change:function(Field, newValue, oldValue){
                                        var num = parseInt(newValue);
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Ptypeattr.Config.PageSize;
                                            Field.setValue(num);
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Ptypeattr.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectAttribute();
                                    },
                                    specialKey :function(field,e){
                                        if (e.getKey() == Ext.EventObject.ENTER){
                                            var num = parseInt(field.getValue());
                                            if (isNaN(num) || !num || num<1)num = Km.Ptypeattr.Config.PageSize;
                                            this.ownerCt.pageSize= num;
                                            Km.Ptypeattr.Config.PageSize = num;
                                            this.ownerCt.ownerCt.doSelectAttribute();
                                        }
                                    }
                                }
                            },{xtype:'label', text: '个'}
                        ]
                    })
                }, config);
                /**
                 * 属性表数据模型获取数据Direct调用
                 */
                Km.Ptypeattr.Store.attributeStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceAttribute.queryPageAttribute}
                });
                Km.Ptypeattr.View.AttributeView.Grid.superclass.constructor.call(this, config);
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
                    }
                }
            }),
            /**
             * 查询符合条件的属性表
             */
            doSelectAttribute : function() {
                if (Km.Ptypeattr.View.Running.ptypeattrGrid&&Km.Ptypeattr.View.Running.ptypeattrGrid.getSelectionModel().getSelected()){
                    var ptypeattr_id = Km.Ptypeattr.View.Running.ptypeattrGrid.getSelectionModel().getSelected().data.ptypeattr_id;
                    var condition = {'ptypeattr_id':ptypeattr_id,'start':0,'limit':Km.Ptypeattr.Config.PageSize};
                    this.filter       ={'ptypeattr_id':ptypeattr_id};
                    ExtServiceAttribute.queryPageAttribute(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                result['totalCount'] =response.result.totalCount;
                                Km.Ptypeattr.Store.attributeStore.loadData(result);
                            } else {
                                Km.Ptypeattr.Store.attributeStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的属性表！');
                            }
                            if (Km.Ptypeattr.Store.attributeStore.getTotalCount()>Km.Ptypeattr.Config.PageSize){
                                 Km.Ptypeattr.View.Running.attributeGrid.bottomToolbar.show();
                            }else{
                                 Km.Ptypeattr.View.Running.attributeGrid.bottomToolbar.hide();
                            }
                            Km.Ptypeattr.View.Running.ptypeattrGrid.ownerCt.doLayout();
                        }
                    });
                }
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
             * 新建属性表
             */
            addAttribute : function(){
                if (Km.Ptypeattr.View.AttributeView.edit_window==null){
                    Km.Ptypeattr.View.AttributeView.edit_window=new Km.Ptypeattr.View.AttributeView.EditWindow();
                }
                Km.Ptypeattr.View.AttributeView.edit_window.resetBtn.setVisible(false);
                Km.Ptypeattr.View.AttributeView.edit_window.saveBtn.setText('保 存');
                Km.Ptypeattr.View.AttributeView.edit_window.setTitle('添加属性表');
                Km.Ptypeattr.View.AttributeView.edit_window.savetype=0;
                Km.Ptypeattr.View.AttributeView.edit_window.attribute_id.setValue("");
                var company_id = Km.Ptypeattr.View.Running.ptypeattrGrid.getSelectionModel().getSelected().data.ptypeattr_id;
                Km.Ptypeattr.View.AttributeView.edit_window.ptypeattr_id.setValue(company_id);

                Km.Ptypeattr.View.AttributeView.edit_window.show();
                Km.Ptypeattr.View.AttributeView.edit_window.maximize();
            },
            /**
             * 编辑属性表时先获得选中的属性表信息
             */
            updateAttribute : function() {
                if (Km.Ptypeattr.View.AttributeView.edit_window==null){
                    Km.Ptypeattr.View.AttributeView.edit_window=new Km.Ptypeattr.View.AttributeView.EditWindow();
                }
                Km.Ptypeattr.View.AttributeView.edit_window.saveBtn.setText('修 改');
                Km.Ptypeattr.View.AttributeView.edit_window.resetBtn.setVisible(true);
                Km.Ptypeattr.View.AttributeView.edit_window.setTitle('修改属性表');
                Km.Ptypeattr.View.AttributeView.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
                Km.Ptypeattr.View.AttributeView.edit_window.savetype=1;

                Km.Ptypeattr.View.AttributeView.edit_window.show();
                Km.Ptypeattr.View.AttributeView.edit_window.maximize();
            },
            /**
             * 删除属性表
             */
            deleteAttribute : function() {
                Ext.Msg.confirm('提示', '确实要删除所选的属性表吗?', this.confirmDeleteAttribute,this);
            },
            /**
             * 确认删除属性表
             */
            confirmDeleteAttribute : function(btn) {
                if (btn == 'yes') {
                    var del_attribute_ids ="";
                    var selectedRows    = this.getSelectionModel().getSelections();
                    for ( var flag = 0; flag < selectedRows.length; flag++) {
                        del_attribute_ids=del_attribute_ids+selectedRows[flag].data.attribute_id+",";
                    }
                    ExtServiceAttribute.deleteByIds(del_attribute_ids);
                    this.doSelectAttribute();
                    Ext.Msg.alert("提示", "删除成功！");
                }
            }
        })
    },
    /**
     * 窗口：批量上传分类属性
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传分类属性数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传分类属性Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadPtypeattr',
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Ptypeattr.View.Running.ptypeattrGrid.doSelectPtypeattr();
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
            Km.Ptypeattr.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：分类属性列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Ptypeattr.Store.ptypeattrStore,
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
                        {header : '标识',dataIndex : 'ptypeattr_id',hidden:true},
                        {header : '属性',dataIndex : 'attribute_name'},
                        {header : '分类',dataIndex : 'ptype_name'},
                        {header : '分类[一级]',dataIndex : 'ptype1_id'},
                        {header : '分类[二级]',dataIndex : 'ptype2_id'},
                        {header : '属性分类[一级]',dataIndex : 'attribute1_id'}
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
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectPtypeattr();
                                    }
                                }
                            },
                            items : [
                                '分类 ','&nbsp;&nbsp;',{ref: '../pptype_id', xtype:'hidden'},{
                                      xtype:'combotree', ref:'../pname',grid:this,
                                      emptyText: '请选择分类',canFolderSelect:false,flex:1,editable:false,
                                      tree: new Ext.tree.TreePanel({
                                          dataUrl: 'home/admin/src/httpdata/ptypeTree.php',
                                          root: {nodeType: 'async'},border: false,rootVisible: false,
                                          listeners: {
                                              beforeload: function(n) {if (n) {this.getLoader().baseParams.id = n.attributes.id;}}
                                          }
                                      }),
                                      onSelect: function(cmb, node) {
                                          this.grid.topToolbar.pptype_id.setValue(node.attributes.id);
                                          this.setValue(node.attributes.text);
                                      }
                                },'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectPtypeattr();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.pptype_id.setValue("");
                                        this.filter={};
                                        this.doSelectPtypeattr();
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
                                    text : '添加分类属性',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addPtypeattr();
                                    }
                                },'-',{
                                    text : '修改分类属性',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updatePtypeattr();
                                    }
                                },'-',{
                                    text : '删除分类属性', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deletePtypeattr();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importPtypeattr();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入分类属性',iconCls : 'icon-import',scope:this,handler:function(){this.importPtypeattr()}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportPtypeattr();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看分类属性', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showPtypeattr()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hidePtypeattr();Km.Ptypeattr.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Ptypeattr.Cookie.set('View.IsFix',Km.Ptypeattr.Config.View.IsFix);}}
                                        ]}
                                },'-']}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Ptypeattr.Config.PageSize,
                    store: Km.Ptypeattr.Store.ptypeattrStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Ptypeattr.Viewport){
                              if (Km.Ptypeattr.Config.View.IsShow==1){
                                Km.Ptypeattr.View.IsSelectView=1;
                              }
                              this.ownerCt.hidePtypeattr();
                              Km.Ptypeattr.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Ptypeattr.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Ptypeattr.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Ptypeattr.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectPtypeattr();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Ptypeattr.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Ptypeattr.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectPtypeattr();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示分类属性列表
            this.doSelectPtypeattr();
            Km.Ptypeattr.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的分类属性信息Tab页
            Km.Ptypeattr.View.Running.viewTabs=new Km.Ptypeattr.View.PtypeattrView.Tabs();
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
                    this.grid.updateViewPtypeattr();
                    if (sm.getCount() != 1){
                        this.grid.hidePtypeattr();
                        Km.Ptypeattr.Config.View.IsShow=0;
                    }else{
                        if (Km.Ptypeattr.View.IsSelectView==1){
                            Km.Ptypeattr.View.IsSelectView=0;
                            this.grid.showPtypeattr();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Ptypeattr.Config.View.IsShow==1){
                            Km.Ptypeattr.View.IsSelectView=1;
                        }
                        this.grid.hidePtypeattr();
                        Km.Ptypeattr.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Ptypeattr.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showPtypeattr();
                this.tvpView.toggle(true);
            }else{
                this.hidePtypeattr();
                Km.Ptypeattr.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Ptypeattr.Config.View.IsFix=1;
            }else{
               Km.Ptypeattr.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Ptypeattr.Config.View.IsShow=0;
                return ;
            }
            if (Km.Ptypeattr.Config.View.IsShow==1){
               this.hidePtypeattr();
               Km.Ptypeattr.Config.View.IsShow=0;
            }
            this.showPtypeattr();
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
         * 查询符合条件的分类属性
         */
        doSelectPtypeattr : function() {
            if (this.topToolbar){
                var pptype_id = this.topToolbar.pptype_id.getValue();
                this.filter       ={'name':pptype_id};
            }
            var condition = {'start':0,'limit':Km.Ptypeattr.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServicePtypeattr.queryPagePtypeattr(condition,function(provider, response) {
                if (response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Ptypeattr.Store.ptypeattrStore.loadData(result);
                } else {
                    Km.Ptypeattr.Store.ptypeattrStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的分类属性！');
                }
            });
        },
        /**
         * 显示分类属性视图
         * 显示分类属性的视图相对分类属性列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Ptypeattr.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Ptypeattr.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Ptypeattr.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Ptypeattr.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Ptypeattr.View.Running.viewTabs);
                    break;
            }
            Km.Ptypeattr.Cookie.set('View.Direction',Km.Ptypeattr.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Ptypeattr.Config.View.IsFix==0)&&(Km.Ptypeattr.Config.View.IsShow==1)){
                    this.showPtypeattr();
                }
                Km.Ptypeattr.Config.View.IsFix=1;
                Km.Ptypeattr.View.Running.ptypeattrGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Ptypeattr.Config.View.IsShow=0;
                this.showPtypeattr();
            }
        },
        /**
         * 显示分类属性
         */
        showPtypeattr : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择分类属性！');
                Km.Ptypeattr.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Ptypeattr.Config.View.IsFix==0){
                if (Km.Ptypeattr.View.Running.view_window==null){
                    Km.Ptypeattr.View.Running.view_window=new Km.Ptypeattr.View.PtypeattrView.Window();
                }
                if (Km.Ptypeattr.View.Running.view_window.hidden){
                    Km.Ptypeattr.View.Running.view_window.show();
                    Km.Ptypeattr.View.Running.view_window.winTabs.hideTabStripItem(Km.Ptypeattr.View.Running.view_window.winTabs.tabFix);
                    this.updateViewPtypeattr();
                    this.tvpView.toggle(true);
                    Km.Ptypeattr.Config.View.IsShow=1;
                }else{
                    this.hidePtypeattr();
                    Km.Ptypeattr.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Ptypeattr.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Ptypeattr.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Ptypeattr.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Ptypeattr.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Ptypeattr.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Ptypeattr.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Ptypeattr.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Ptypeattr.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Ptypeattr.View.Running.viewTabs);
                    }
                    break;
            }
            this.hidePtypeattr();
            if (Km.Ptypeattr.Config.View.IsShow==0){
                Km.Ptypeattr.View.Running.viewTabs.enableCollapse();
                switch(Km.Ptypeattr.Config.View.Direction){
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
                this.updateViewPtypeattr();
                this.tvpView.toggle(true);
                Km.Ptypeattr.Config.View.IsShow=1;
            }else{
                Km.Ptypeattr.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏分类属性
         */
        hidePtypeattr : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Ptypeattr.View.Running.view_window!=null){
                Km.Ptypeattr.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前分类属性显示信息
         */
        updateViewPtypeattr : function() {
            Km.Ptypeattr.View.Running.ptypeGrid.doSelectPtype();
            Km.Ptypeattr.View.Running.attributeGrid.doSelectAttribute();
            if (Km.Ptypeattr.View.Running.view_window!=null){
                Km.Ptypeattr.View.Running.view_window.winTabs.tabPtypeattrDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Ptypeattr.View.Running.viewTabs.tabPtypeattrDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建分类属性
         */
        addPtypeattr : function() {
            if (Km.Ptypeattr.View.Running.edit_window==null){
                Km.Ptypeattr.View.Running.edit_window=new Km.Ptypeattr.View.EditWindow();
            }
            Km.Ptypeattr.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Ptypeattr.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Ptypeattr.View.Running.edit_window.setTitle('添加分类属性');
            Km.Ptypeattr.View.Running.edit_window.savetype=0;
            Km.Ptypeattr.View.Running.edit_window.ptypeattr_id.setValue("");

            Km.Ptypeattr.View.Running.edit_window.ptypecomp.ptypeShowLabel.setVisible(false);
            Km.Ptypeattr.View.Running.edit_window.ptypecomp.ptypeShowValue.setVisible(false);

            Km.Ptypeattr.View.Running.edit_window.show();
            Km.Ptypeattr.View.Running.edit_window.maximize();
        },
        /**
         * 编辑分类属性时先获得选中的分类属性信息
         */
        updatePtypeattr : function() {
            if (Km.Ptypeattr.View.Running.edit_window==null){
                Km.Ptypeattr.View.Running.edit_window=new Km.Ptypeattr.View.EditWindow();
            }
            Km.Ptypeattr.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Ptypeattr.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Ptypeattr.View.Running.edit_window.setTitle('修改分类属性');
            Km.Ptypeattr.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Ptypeattr.View.Running.edit_window.savetype=1;

            if (this.getSelectionModel().getSelected().data.ptypeShowAll){
                Km.Ptypeattr.View.Running.edit_window.ptypecomp.ptypeShowLabel.setVisible(true);
                Km.Ptypeattr.View.Running.edit_window.ptypecomp.ptypeShowValue.setVisible(true);
            }else{
                Km.Ptypeattr.View.Running.edit_window.ptypecomp.ptypeShowLabel.setVisible(false);
                Km.Ptypeattr.View.Running.edit_window.ptypecomp.ptypeShowValue.setVisible(false);
            }

            Km.Ptypeattr.View.Running.edit_window.show();
            Km.Ptypeattr.View.Running.edit_window.maximize();
        },
        /**
         * 删除分类属性
         */
        deletePtypeattr : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的分类属性吗?', this.confirmDeletePtypeattr,this);
        },
        /**
         * 确认删除分类属性
         */
        confirmDeletePtypeattr : function(btn) {
            if (btn == 'yes') {
                var del_ptypeattr_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_ptypeattr_ids=del_ptypeattr_ids+selectedRows[flag].data.ptypeattr_id+",";
                }
                ExtServicePtypeattr.deleteByIds(del_ptypeattr_ids);
                this.doSelectPtypeattr();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出分类属性
         */
        exportPtypeattr : function() {
            ExtServicePtypeattr.exportPtypeattr(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入分类属性
         */
        importPtypeattr : function() {
            if (Km.Ptypeattr.View.current_uploadWindow==null){
                Km.Ptypeattr.View.current_uploadWindow=new Km.Ptypeattr.View.UploadWindow();
            }
            Km.Ptypeattr.View.current_uploadWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Ptypeattr.View.Running.ptypeattrGrid=new Km.Ptypeattr.View.Grid();
            if (Km.Ptypeattr.Config.View.IsFix==0){
                Km.Ptypeattr.View.Running.ptypeattrGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Ptypeattr.View.Running.ptypeattrGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Ptypeattr.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Ptypeattr.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前分类属性Grid对象
         */
        ptypeattrGrid:null,
        /**
         * 当前商品类型Grid对象
         */
        ptypeGrid:null,
        /**
         * 当前属性表Grid对象
         */
        attributeGrid:null,
        /**
         * 显示分类属性信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Ptypeattr.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Ptypeattr.Init();
    /**
     * 分类属性数据模型获取数据Direct调用
     */
    Km.Ptypeattr.Store.ptypeattrStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServicePtypeattr.queryPagePtypeattr}
    });
    /**
     * 分类属性页面布局
     */
    Km.Ptypeattr.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Ptypeattr.View.Panel()]
    });
    Km.Ptypeattr.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});