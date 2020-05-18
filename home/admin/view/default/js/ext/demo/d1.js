Ext.namespace("Kmall.Admin.Tree");
Km = Kmall.Admin;
Km.Tree={
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
             * 显示的视图相对列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示信息页(或者打开新窗口)
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
        if (Km.Tree.Cookie.get('View.Direction')){
            Km.Tree.Config.View.Direction=Km.Tree.Cookie.get('View.Direction');
        }
        if (Km.Tree.Cookie.get('View.IsFix')!=null){
            Km.Tree.Config.View.IsFix=Km.Tree.Cookie.get('View.IsFix');
        }
        if (Ext.util.Cookies.get('OnlineEditor')!=null){
            Km.Tree.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
        }

    }
};
/**
 * Model:数据模型
 */
Km.Tree.Store = {};
/**
 * View:显示组件
 */
Km.Tree.View={
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
                constrainHeader:true,maximizable: false,collapsible: false,
                width : 400,height : 190,minWidth : 400,minHeight : 190,
                layout : 'fit',plain : true,buttonAlign : 'center',
                defaults : {
                    autoScroll : true
                },
                listeners:{
                    beforehide:function(){
                        this.editForm.getForm().reset();
                    },
                    beforeshow:function(){}
                },
                items : [
                    new Ext.form.FormPanel({
                        ref:'editForm',layout:'form',fileUpload: true,
                        labelWidth : 80,labelAlign : "center",
                        bodyStyle : 'padding:5px 5px 0',align : "center",
                        api : {},
                        defaults : {
                            xtype : 'textfield',anchor:'98%'
                        },
                        items : [
                            {xtype: 'hidden',name : 'demo_id',ref:'../demo_id'},
                            {xtype: 'hidden',name : 'parent_id',ref:'../parent_id'},
                            {xtype: 'hidden',name : 'countChild',ref:'../countChild',value:0},
                            {xtype: 'hidden',name : 'level',ref:'../level'},
                            {xtype: 'hidden',name : 'commitTime',ref:'../commitTime'},
                            {xtype: 'hidden',name : 'updateTime',ref:'../updateTime'},
                            {fieldLabel : '分类名称',name : 'ptype_name',ref:'../ptype_name',value:'',allowBlank : false},
                            {xtype: 'hidden',  name : 'ptype_image',ref:'../ptype_image'},
                            {fieldLabel : '分类图标',name : 'ptype_imageUpload',ref:'../ptype_imageUpload',xtype:'fileuploadfield',
                              emptyText: '请上传图片图片',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {fieldLabel : '排序',name : 'sort_order',xtype : 'numberfield',ref:'../sort_order',value:50},
                            {fieldLabel : '是否显示',hiddenName : 'isShow'
                                 ,xtype : 'combo',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否显示',value:1,
                                 valueField : 'value',displayField : 'text',ref:'../isShow'
                            }
                        ]
                    })
                ],
                buttons : [{
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {
                        if (!this.editForm.getForm().isValid()) {
                            return;
                        }
                        this.saveBtn.setDisabled(true);
                        editWindow=this;
                        if (this.savetype==0){
                            this.editForm.api.submit=ExtServiceDemo.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.Tree.View.Running.currentApp.STATUS_OK="成功";
                                    Km.Tree.View.Running.currentApp.setAlert(true,"新增成功");
                                    // Km.Tree.View.Running.treeGrid.root.reload();
                                    var selNode = Km.Tree.View.Running.currentNode;
                                    attr = form.getFieldValues();
                                    var icoShow="";
                                    if(action.result.ico){
                                        icoShow="<img width=16 height=16 style='margin:2px;' src="+action.result.icoShow+">";
                                    }
                                    var data = {
                                        ptype_name  : attr.ptype_name,
                                        demo_id     : action.result.data,
                                        icoShow     : icoShow,
                                        ico         : action.result.ico,
                                        isShow      : parseInt(attr.isShow),
                                        isShowText  : attr.isShow?"是":"否",
                                        countChild  : 0,
                                        parent_id   : parseInt(attr.parent_id),
                                        level       : parseInt(attr.level),
                                        sort_order  : parseInt(attr.sort_order),
                                        commitTime  : "",
                                        updateTime  : "",
                                        leaf        : 1,
                                        iconCls     : "task"
                                    };

                                    var node = new Ext.tree.TreeNode(data);
                                    switch(Km.Tree.View.Running.currentAction){
                                        case 1:
                                            selNode.appendChild(node);
                                            break;
                                        case 2:
                                            selNode.parentNode.appendChild(node,selNode);
                                            break;
                                        case 3:
                                            selNode.leaf=false;
                                            selNode.getUI().getIconEl().src ="common/js/ajax/ext/resources/images/default/tree/folder.gif";
                                            selNode.appendChild(node);
                                            break;
                                        default:
                                            break;
                                    }

                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Km.Tree.View.Running.currentApp.STATUS_OK="失败";
                                    Km.Tree.View.Running.currentApp.setAlert(true,"新增失败");
                                },
                                scope : this
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceDemo.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Km.Tree.View.Running.currentApp.STATUS_OK="成功";
                                    Km.Tree.View.Running.currentApp.setAlert(true,"修改成功");
                                    var selNode = Km.Tree.View.Running.currentNode;
                                    var attr  = form.getValues();
                                    var icoShow="";
                                    if(action.result.ico){
                                        icoShow="<img width=16 height=16 style='margin:2px;' src="+action.result.icoShow+">";
                                    }
                                    //修改显示值
                                    selNode.setText(attr.ptype_name);
                                    selNode.ui.elNode.childNodes[2].childNodes[0].innerHTML=action.result.ico;
                                    selNode.ui.elNode.childNodes[3].childNodes[0].innerHTML=icoShow;
                                    selNode.ui.elNode.childNodes[5].childNodes[0].innerHTML=parseInt(attr.isShow)?"是":"否";
                                    selNode.ui.elNode.childNodes[9].childNodes[0].innerHTML=parseInt(attr.sort_order);

                                    //修改属性值
                                    selNode.attributes.ptype_name=attr.ptype_name;
                                    selNode.attributes.sort_order=parseInt(attr.sort_order);
                                    selNode.attributes.isShow=parseInt(attr.isShow);
                                    selNode.attributes.ico=action.result.ico;
                                    selNode.attributes.icoShow=icoShow;

                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Km.Tree.View.Running.currentApp.STATUS_OK="失败";
                                    Km.Tree.View.Running.currentApp.setAlert(true,"修改失败");
                                },
                                scope : this
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
                        this.treeDataLoad();
                    }
                }]
            }, config);
            Km.Tree.View.EditWindow.superclass.constructor.call(this, config);
        },
        /**
         * 载入当前节点数据
         */
        treeDataLoad:function(){
            var attr = Km.Tree.View.Running.currentNode.attributes;
            this.demo_id.setValue(attr.demo_id);
            this.ptype_name.setValue(attr.ptype_name);
            this.ptype_imageUpload.setValue(attr.ico);
            this.sort_order.setValue(attr.sort_order);
            this.isShow.setValue(attr.isShow);
            this.parent_id.setValue(attr.parent_id);
            this.countChild.setValue(attr.countChild);
            this.level.setValue(attr.level);
            this.commitTime.setValue(attr.commitTime);
        },
        /**
         * 数据初始化
         */
        initData:function(){
            this.demo_id.setValue("");
            this.ptype_name.setValue("");
            this.ptype_image.setValue("");
            this.ptype_imageUpload.setValue("");
            this.sort_order.setValue(50);
            this.isShow.setValue(1);
            this.countChild.setValue(0);
            this.commitTime.setValue("");

            if(!Km.Tree.View.Running.currentNode){
                var rootNode = Km.Tree.View.Running.treeGrid.getRootNode();
                Km.Tree.View.Running.currentNode = rootNode;
                this.parent_id.setValue(0);
                this.level.setValue(1);
            }else{
                var parent_id="";
                var level="";
                var currentNodeAttr=Km.Tree.View.Running.currentNode.attributes;
                switch(Km.Tree.View.Running.currentAction){
                    case 2:
                        parent_id=currentNodeAttr.parent_id;
                        level=currentNodeAttr.level;
                        break;
                    case 3:
                        parent_id=currentNodeAttr.demo_id;
                        level=parseInt(currentNodeAttr.level)+1;
                        break;
                    default:
                        break;
                }
                this.parent_id.setValue(parent_id);
                this.level.setValue(level);
            }
        }
    }),
    /**
     * 视图：列表
     */
    Grid:Ext.extend(Ext.ux.tree.TreeGrid, {
        constructor : function(config) {
            config = Ext.apply({
                enableDD: false, //节点是否可移动
                width: "100%",region: 'center',plain: true,
                frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                loadMask : true,headerAsText : false,
                columns:[
                    {
                        header: '分类名称',
                        dataIndex: 'ptype_name',
                        width: 360
                    },{
                        header: '分类标识',
                        dataIndex: 'demo_id',
                        hidden: true
                    },{
                        header: '分类图标',
                        dataIndex: 'ico',
                        hidden: true
                    },{
                        header: '分类图标展示',
                        dataIndex: 'icoShow',
                        width: 100,align: "center"
                    },{
                        header: '是否显示(value)',
                        dataIndex: 'isShow',
                        hidden: true
                    },{
                        header: '是否显示',
                        dataIndex: 'isShowText',
                        width: 100
                    },{
                        header: '父级标识',
                        dataIndex: 'parent_id',
                        hidden: true
                    },{
                        header: '子元素计数',
                        dataIndex: 'countChild',
                        hidden: true
                    },{
                        header: '分类层级',
                        dataIndex: 'level',
                        hidden: true
                    },{
                        header: '排序',
                        width: 150,
                        dataIndex: 'sort_order'
                    },{
                        header: '提交时间',
                        dataIndex: 'commitTime',
                        hidden: true
                    },{
                        header: '更新时间',
                        dataIndex: 'updateTime',
                        hidden: true
                    }
                ],
                contextMenu: new Ext.menu.Menu({
                    items: [
                    {
                        iconCls: 'edit',
                        text: '编辑分类',
                        handler: this.updateNode
                    }
                    ,{
                        iconCls: 'add-siblings',
                        text: '新建同级分类',
                        handler: this.addSiblingsNode
                    }
                    ,{
                        iconCls: 'add-child',
                        text: '新建子分类',
                        handler: this.addChildNode
                    },{
                        iconCls: 'delete',
                        text: '删除分类',
                        handler: this.deleteNode
                    }],
                    listeners: {
                        beforeshow:function(){
                            //保存当前操作节点信息,并展开该节点
                            Km.Tree.View.Running.currentNode = Km.Tree.View.Running.treeGrid.getSelectionModel().getSelectedNode();
                            Km.Tree.View.Running.currentNode.expand(true);
                        }
                        // ,itemclick: function(item){
                        //     var nodeDataDel = item.parentMenu.contextNode.attributes;
                        //     var parentNodeData = item.parentMenu.contextNode.parentNode;
                        //     //var nodeData = orgPanel.getSelectionModel().getSelectedNode();
                        //     switch (item.iconCls) {
                        //         case 'add':
                        //             createOrganizationFun(parentNodeData);
                        //             break;
                        //         case 'edit':
                        //             updateOrganizationFun(nodeDataDel,parentNodeData);
                        //             break;
                        //         case 'delete':
                        //             deleteOrganizationFun(nodeDataDel.id,nodeDataDel.children.length==0?true:false);
                        //             break;
                        //     }
                        //     item.parentMenu.hide();
                        // }
                    }
                }),
                requestUrl: "home/admin/src/httpdata/demoTree.php",
                //监听事件
                listeners: {
                    'beforeload': function (node) {//节点加载前
                        if (node.isRoot) {   //首次加载
                            this.loader.dataUrl = this.requestUrl;
                        }else {
                            var nodeID= node.attributes["demo_id"]; //取得点击节点名称
                            var rqtUrl = this.requestUrl + "?id=" + nodeID; //得到新的URL地址
                            if (node.attributes.loader.dataUrl) {
                                this.loader.dataUrl = rqtUrl //点击节点,后台请求数据
                            }
                        }
                        this.root.attributes.loader = null; //防止节点的重复加载
                    },
                    contextmenu: function(node, e){
                        appContextmenu = false;
                        node.select();
                        var tree = node.getOwnerTree();
                        var c = tree.contextMenu;
                        c.contextNode = node;
                        c.showAt(e.getXY());
                    }
                },
                tbar : {
                    xtype : 'container',layout : 'anchor',height : 27 ,style:'font-size:14px',
                    defaults : {
                        height : 27,anchor : '100%'
                    },
                    items : [
                        new Ext.Toolbar({
                            defaults:{scope: this},
                            items : [
                                {
                                    text : '新增一级分类',iconCls : 'icon-edit',
                                    handler : function() {
                                        Km.Tree.View.Running.currentNode=null;
                                        this.addFirstStageNode();
                                    }
                                },
                                {
                                    text : '分类重载',iconCls : 'icon-edit',
                                    handler : function() {
                                        this.reloadNode();
                                    }
                                }
                                // ,{
                                //     xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                //     handler : function() {
                                //         this.importNews();
                                //     },
                                //     menu: {
                                //         xtype:'menu',plain:true,
                                //         items: [
                                //             {text:'批量导入',iconCls : 'icon-import',scope:this,handler:function(){this.importNews()}},
                                //             {text:'批量导入图片',iconCls : 'icon-import',scope:this,handler:function(){this.batchUploadImages("upload_tree_image_files","图片")}}
                                //         ]}
                                // },'-',{
                                //     text : '导出',iconCls : 'icon-export',
                                //     handler : function() {
                                //         this.exportNews();
                                //     }
                                // }
                            ]
                        })
                    ]
                }
                // ,bbar: new Ext.PagingToolbar({})
            }, config);

            Km.Tree.View.Grid.superclass.constructor.call(this, config);
        },
        /**
         * 添加节点
         */
        addNode : function(action){
            if (Km.Tree.View.Running.edit_window==null){
                Km.Tree.View.Running.edit_window=new Km.Tree.View.EditWindow();
            }
            //当前操作
            Km.Tree.View.Running.currentAction=action;
            var win=Km.Tree.View.Running.edit_window;
            win.savetype=0;
            win.resetBtn.setVisible(false);
            win.saveBtn.setText('新 增');

            switch(action){
                case 1:
                    win.setTitle('新增一级分类');
                    break;
                case 2:
                    win.setTitle('新增同级分类');
                    break;
                case 3:
                    win.setTitle('新增子分类');
                default:
                    break;
            }

            //form初始化
            win.initData();
            //保存按钮恢复
            win.saveBtn.setDisabled(false);
            //显示编辑窗口
            win.show();
        },
        /**
         * 添加一级节点
         */
        addFirstStageNode : function() {
            Km.Tree.View.Running.treeGrid.addNode(1);
        },
        /**
         * 添加同级节点
         */
        addSiblingsNode : function() {
            Km.Tree.View.Running.treeGrid.addNode(2);
        },
        /**
         * 添加子结点
         */
        addChildNode : function() {
            Km.Tree.View.Running.treeGrid.addNode(3);
        },
        /**
         * 修改节点
         */
        updateNode : function() {
            if (Km.Tree.View.Running.edit_window==null){
                Km.Tree.View.Running.edit_window=new Km.Tree.View.EditWindow();
            }
            var win  = Km.Tree.View.Running.edit_window;

            win.resetBtn.setVisible(true);
            win.saveBtn.setText('修 改');
            win.setTitle('修改分类');
            win.savetype=1;

            //form获取选中节点数据
            win.treeDataLoad();
            //修改按钮恢复
            win.saveBtn.setDisabled(false);
            win.show();
        },
        /**
         * 添加一级节点
         */
        reloadNode : function() {
            Km.Tree.View.Running.treeGrid.root.reload();
        },
        /**
         * 删除节点
         */
        deleteNode : function() {
            var currentNode=Km.Tree.View.Running.currentNode;
            if(currentNode.childNodes.length){
                Ext.Msg.alert("提示", "<font color=red>请先删除子分类！</font>");
                return;
            }
            Ext.Msg.confirm('提示', '&nbsp;确定要删除所选?', Km.Tree.View.Running.treeGrid.confirmDeleteNode,this);
        },
        /**
         * 确认删除
         */
        confirmDeleteNode : function(btn) {
            if (btn == 'yes') {
                var currentNode=Km.Tree.View.Running.currentNode;
                var del_id=currentNode.attributes.demo_id;
                ExtServiceDemo.deleteByIds(del_id,function(provider, response) {
                    if (response.result.success) {
                        var parentNode=currentNode.parentNode;
                        currentNode.remove();//删除操作节点
                        //如果当前节点有父节点，且父节点此时已不包含子结点
                        if(currentNode.attributes.parent_id&&!parentNode.childNodes.length){
                            parentNode.leaf=true;
                            parentNode.getUI().getIconEl().src ="common/js/ajax/ext/resources/images/default/tree/leaf.gif";
                        }
                        Ext.Msg.alert("提示", "删除成功！");
                    }
                });
            }
        },
        /**
         * 导出
         */
        exportNews : function() {
            ExtServiceDemo.exportNews(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入
         */
        importNews : function() {
            if (Km.Tree.View.current_uploadWindow==null){
                Km.Tree.View.current_uploadWindow=new Km.Tree.View.UploadWindow();
            }
            Km.Tree.View.current_uploadWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Tree.View.Running.treeGrid=new Km.Tree.View.Grid();
            var rootnode = new Ext.tree.AsyncTreeNode({
                id : '0',
                text : '根',
                draggable : false,// 根节点不容许拖动
                expanded : true
            });
            //设置节点属性
            rootnode.attributes = {};
            // 为tree设置根节点
            Km.Tree.View.Running.treeGrid.setRootNode(rootnode);
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Tree.View.Running.treeGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Tree.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前Grid对象
         */
        treeGrid:null,
        /**
         * 当前操作节点
         */
        currentNode:null,
        /**
         * 当前操作
         * 1:添加一级分类 2:添加同级分类 3:添加子分类
         */
        currentAction:null
    }
};
/**
 * Controller:主程序
 */
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.state.Manager.setProvider(Km.Tree.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Tree.View.Running.currentApp = new Ext.App({});
    Km.Tree.Init();
    /**
     * 页面布局
     */
    Km.Tree.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Tree.View.Panel()]
    });
    Km.Tree.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
