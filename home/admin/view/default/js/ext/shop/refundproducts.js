Ext.namespace("Kmall.Admin.Refundproducts");
Km = Kmall.Admin.Refundproducts;
Km.Refundproducts={
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
             * 显示退款商品的视图相对退款商品列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示退款商品信息页(或者打开新窗口)
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
        if (Km.Refundproducts.Cookie.get('View.Direction')){
            Km.Refundproducts.Config.View.Direction=Km.Refundproducts.Cookie.get('View.Direction');
        }
        if (Km.Refundproducts.Cookie.get('View.IsFix')!=null){
            Km.Refundproducts.Config.View.IsFix=Km.Refundproducts.Cookie.get('View.IsFix');
        }
    }
}; 
/**
 * Model:数据模型   
 */
Km.Refundproducts.Store = { 
    /**
     * 退款商品
     */ 
    refundproductsStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',  
            root: 'data',remoteSort: true,                
            fields : [
                  {name: 'refundproducts_id',type: 'int'},
                  {name: 'member_id',type: 'int'},
                  {name: 'username',type: 'string'},
                  {name: 'status',type: 'string'},
                  {name: 'statusShow',type: 'string'},
                  {name: 'order_code',type: 'string'},
                  {name: 'product_id',type: 'int'},
                  {name: 'name',type: 'string'},
                  {name: 'product_num',type: 'int'},
                  {name: 'pay',type: 'float'},
                  {name: 'refund',type: 'float'},
                  {name: 'refundTime',type: 'date',dateFormat:'Y-m-d H:i:s'},
                  {name: 'intro',type: 'string'}
            ]}         
        ),
        writer: new Ext.data.JsonWriter({
            encode: false 
        }),
        listeners : {    
            beforeload : function(store, options) {   
                if (Ext.isReady) {  
                    Ext.apply(options.params, Km.Refundproducts.View.Running.refundproductsGrid.filter);//保证分页也将查询条件带上  
                }
            }
        }    
    }),
    /**
     * 会员
     */
    memberStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/member.php'
          }),
        reader: new Ext.data.JsonReader({
            root: 'members',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'member_id'
          }, [
              {name: 'member_id', mapping: 'member_id'}, 
              {name: 'username', mapping: 'username'} 
        ])
    }),
    /**
     * 商品
     */
    productStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/product.php'
          }),
        reader: new Ext.data.JsonReader({
            root: 'products',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'product_id'
          }, [
              {name: 'product_id', mapping: 'product_id'}, 
              {name: 'name', mapping: 'name'} 
        ])
    })      
};
/**
 * View:退款商品显示组件   
 */
Km.Refundproducts.View={ 
    /**
     * 编辑窗口：新建或者修改退款商品
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
                        switch (Km.Refundproducts.Config.OnlineEditor)
                        {
                            case 2:
                                Km.Refundproducts.View.EditWindow.KindEditor_intro = KindEditor.create('textarea[name="intro"]',{width:'98%',minHeith:'350px', filterMode:true});
                                break
                            case 3:
                                pageInit_intro();
                                break
                            default:
                                //ckeditor_replace_intro(); 
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
                              {xtype: 'hidden',  name : 'refundproducts_id',ref:'../refundproducts_id'},
                              {xtype: 'hidden',name : 'member_id',id:'member_id'},
                              {
                                 fieldLabel : '会员号',xtype: 'combo',name : 'username',id : 'username',
                                 store:Km.Refundproducts.Store.memberStore,emptyText: '请选择会员号',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Refundproducts.Config.PageSize,
                                 displayField:'username',// 显示文本
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                            '<tpl for="."><div class="search-item">',
                                                '<h3>{username}</h3>',
                                            '</div></tpl>'
                                 ),
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        Ext.getCmp("member_id").setValue(record.data.member_id);
                                        Ext.getCmp("username").setValue(record.data.username);
                                        this.collapse();
                                       }
                                   }
                              },
                              {fieldLabel : '退款状态',hiddenName : 'status',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['0', '进行中'],['1', '退款完成'],['2', '取消退款']]
                                  }),emptyText: '请选择退款状态',
                                valueField : 'value',// 值
                                displayField : 'text'// 显示文本
                            },
                              {fieldLabel : '订单号',name : 'order_code'},
                              {xtype: 'hidden',name : 'product_id',id:'product_id'},
                              {
                                 fieldLabel : '产品',xtype: 'combo',name : 'name',id : 'name',
                                 store:Km.Refundproducts.Store.productStore,emptyText: '请选择产品',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Refundproducts.Config.PageSize,
                                 displayField:'name',// 显示文本
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                            '<tpl for="."><div class="search-item">',
                                                '<h3>{name}</h3>',
                                            '</div></tpl>'
                                 ),
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        Ext.getCmp("product_id").setValue(record.data.product_id);
                                        Ext.getCmp("name").setValue(record.data.name);
                                        this.collapse();
                                       }
                                   }
                              },
                              {fieldLabel : '产品数量',name : 'product_num',xtype : 'numberfield'},
                              {fieldLabel : '支付金额',name : 'pay',xtype : 'numberfield'},
                              {fieldLabel : '退款金额',name : 'refund',xtype : 'numberfield'},
                              {fieldLabel : '申请时间',name : 'refundTime',xtype : 'datefield',format : "Y-m-d"},
                              {fieldLabel : '退款原因',name : 'intro',xtype : 'textarea',id:'intro',ref:'intro'}        
                        ]
                    })                
                ],
                buttons : [ {         
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {   
                        switch (Km.Refundproducts.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Refundproducts.View.EditWindow.KindEditor_intro)this.editForm.intro.setValue(Km.Refundproducts.View.EditWindow.KindEditor_intro.html());
                                break
                            case 3:
                                if (xhEditor_intro)this.editForm.intro.setValue(xhEditor_intro.getSource());
                                break
                            default:
                                //if (CKEDITOR.instances.intro) this.editForm.intro.setValue(CKEDITOR.instances.intro.getData());
                        }
         
                        if (!this.editForm.getForm().isValid()) {
                            return;
                        }
                        editWindow=this;                   
                        if (this.savetype==0){    
                            this.editForm.api.submit=ExtServiceRefundproducts.save;                   
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Refundproducts.View.Running.refundproductsGrid.doSelectRefundproducts();
                                    form.reset(); 
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceRefundproducts.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {                                                  
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){       
                                        Km.Refundproducts.View.Running.refundproductsGrid.bottomToolbar.doRefresh(); 
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
                        this.editForm.form.loadRecord(Km.Refundproducts.View.Running.refundproductsGrid.getSelectionModel().getSelected());
                        switch (Km.Refundproducts.Config.OnlineEditor)
                        {
                            case 2:
                                if (Km.Refundproducts.View.EditWindow.KindEditor_intro) Km.Refundproducts.View.EditWindow.KindEditor_intro.html(Km.Refundproducts.View.Running.refundproductsGrid.getSelectionModel().getSelected().data.intro);
                                break
                            case 3:
                                break
                            default:
                                //if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(Km.Refundproducts.View.Running.refundproductsGrid.getSelectionModel().getSelected().data.intro);
                        }
 
                    }                  
                }]    
            }, config);  
            Km.Refundproducts.View.EditWindow.superclass.constructor.call(this, config);     
        }
    }),
    /**
     * 显示退款商品详情
     */
    RefundproductsView:{
        /**
         * Tab页：容器包含显示与退款商品所有相关的信息
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
                                if (Km.Refundproducts.View.Running.refundproductsGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择退款商品！');
                                    return false;
                                } 
                                Km.Refundproducts.Config.View.IsShow=1;
                                Km.Refundproducts.View.Running.refundproductsGrid.showRefundproducts();   
                                Km.Refundproducts.View.Running.refundproductsGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Refundproducts.View.RefundproductsView.Tabs.superclass.constructor.call(this, config);
 
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Refundproducts.Config.View.Direction==1)||(Km.Refundproducts.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabRefundproductsDetail',iconCls:'tabs',
                     tpl: [
                      '<table class="viewdoblock">', 
                         '<tr class="entry"><td class="head">会员号</td><td class="content">{username}</td></tr>',
                         '<tr class="entry"><td class="head">退款状态</td><td class="content">{statusShow}</td></tr>',
                         '<tr class="entry"><td class="head">订单号</td><td class="content">{order_code}</td></tr>',
                         '<tr class="entry"><td class="head">产品</td><td class="content">{name}</td></tr>',
                         '<tr class="entry"><td class="head">产品数量</td><td class="content">{product_num}</td></tr>',
                         '<tr class="entry"><td class="head">支付金额</td><td class="content">{pay}</td></tr>',
                         '<tr class="entry"><td class="head">退款金额</td><td class="content">{refund}</td></tr>',
                         '<tr class="entry"><td class="head">申请时间</td><td class="content">{refundTime:date("Y-m-d")}</td></tr>',
                         '<tr class="entry"><td class="head">退款原因</td><td class="content">{intro}</td></tr>',                      
                     '</table>' 
                     ]
                    }
                );
                this.add(
                    {title: '其他',iconCls:'tabs'}
                );         
            }       
        }),
        /**
         * 窗口:显示退款商品信息
         */
        Window:Ext.extend(Ext.Window,{ 
            constructor : function(config) { 
                config = Ext.apply({
                    title:"查看退款商品",constrainHeader:true,maximizable: true,minimizable : true, 
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Refundproducts.View.RefundproductsView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: { 
                        minimize:function(w){
                            w.hide();
                            Km.Refundproducts.Config.View.IsShow=0;
                            Km.Refundproducts.View.Running.refundproductsGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Refundproducts.View.Running.refundproductsGrid.tvpView.toggle(false);
                        }   
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Refundproducts.View.Running.refundproductsGrid.addRefundproducts();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Refundproducts.View.Running.refundproductsGrid.updateRefundproducts();}
                    }]
                }, config);  
                Km.Refundproducts.View.RefundproductsView.Window.superclass.constructor.call(this, config);   
            }        
        })
    },
    /**
     * 窗口：批量上传退款商品
     */        
    UploadWindow:Ext.extend(Ext.Window,{ 
        constructor : function(config) { 
            config = Ext.apply({     
                title : '批量退款商品上传',
                width : 400,height : 110,minWidth : 300,minHeight : 100,
                layout : 'fit',plain : true,bodyStYle : 'padding:5px;',buttonAlign : 'center',
                closeAction : "hide",
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
                            emptyText: '请上传退款商品Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadRefundproducts',
                                    success : function(form, action) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Refundproducts.View.Running.refundproductsGrid.doSelectRefundproducts();
                                    },
                                    failure : function(form, action) {
                                        Ext.Msg.alert('错误', action.result.msg);
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
            Km.Refundproducts.View.UploadWindow.superclass.constructor.call(this, config);     
        }        
    }),
    /**
     * 视图：退款商品列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件  
                 */
                filter:null,
                region : 'center',
                store : Km.Refundproducts.Store.refundproductsStore,
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
                          {header : '会员号',dataIndex : 'username'},
                          {header : '退款状态',dataIndex : 'statusShow'},
                          {header : '订单号',dataIndex : 'order_code'},
                          {header : '产品',dataIndex : 'name'},
                          {header : '产品数量',dataIndex : 'product_num'},
                          {header : '支付金额',dataIndex : 'pay'},
                          {header : '退款金额',dataIndex : 'refund'},
                          {header : '申请时间',dataIndex : 'refundTime',renderer:Ext.util.Format.dateRenderer('Y-m-d')},
                          {header : '退款原因',dataIndex : 'intro'}                                 
                    ]
                }),                       
                tbar : {
                    xtype : 'container',layout : 'anchor',
                    height : 27 * 2,style:'font-size:14px',
                    defaults : {
                        height : 27,anchor : '100%'
                    },
                    items : [                        
                        new Ext.Toolbar({
                            enableOverflow: true,width : 100,
                            defaults : {
                               xtype : 'textfield'
                            },
                            items : [
                                '退款状态 ','&nbsp;&nbsp;',{ref: '../rstatus',xtype : 'combo',mode : 'local',
                                    triggerAction : 'all',lazyRender : true,editable: false,
                                    store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['0', '进行中'],['1', '退款完成'],['2', '取消退款']]
                                      }),
                                    valueField : 'value',// 值
                                    displayField : 'text'// 显示文本
                                },'&nbsp;&nbsp;',
                                '订单号 ','&nbsp;&nbsp;',{ref: '../rorder_code'},'&nbsp;&nbsp;',                                
                                {
                                    xtype : 'button',text : '查询',scope: this, 
                                    handler : function() {
                                        this.doSelectRefundproducts();
                                    }
                                }, 
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.rstatus.setValue("");
                                        this.topToolbar.rorder_code.setValue("");                                        
                                        this.filter={};
                                        this.doSelectRefundproducts();
                                    }
                                }]
                        }), 
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
                                    text : '添加退款商品',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addRefundproducts();
                                    }
                                },'-',{
                                    text : '修改退款商品',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
                                    handler : function() {
                                        this.updateRefundproducts();
                                    }
                                },'-',{
                                    text : '删除退款商品', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
                                    handler : function() {
                                        this.deleteRefundproducts();
                                    }
                                },'-',{
                                    text : '导入',iconCls : 'icon-import', 
                                    handler : function() {
                                        this.importRefundproducts();
                                    }
                                },'-',{
                                    text : '导出',iconCls : 'icon-export', 
                                    handler : function() { 
                                        this.exportRefundproducts();
                                    }
                                },'-',{ 
                                    xtype:'tbsplit',text: '查看退款商品', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,  
                                    handler:function(){this.showRefundproducts()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideRefundproducts();Km.Refundproducts.Config.View.IsShow=0;}},'-', 
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Refundproducts.Cookie.set('View.IsFix',Km.Refundproducts.Config.View.IsFix);}} 
                                        ]}
                                },'-']}
                    )]
                },                
                bbar: new Ext.PagingToolbar({          
                    pageSize: Km.Refundproducts.Config.PageSize,
                    store: Km.Refundproducts.Store.refundproductsStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Refundproducts.Config.PageSize,minValue:1,width:35, 
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Refundproducts.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Refundproducts.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectRefundproducts();
                                }, 
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Refundproducts.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Refundproducts.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectRefundproducts();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示退款商品列表
            this.doSelectRefundproducts();
            Km.Refundproducts.View.Grid.superclass.constructor.call(this, config); 
            //创建在Grid里显示的退款商品信息Tab页
            Km.Refundproducts.View.Running.viewTabs=new Km.Refundproducts.View.RefundproductsView.Tabs();
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
                    this.grid.updateViewRefundproducts();                     
                    if (sm.getCount() != 1){
                        this.grid.hideRefundproducts();
                        Km.Refundproducts.Config.View.IsShow=0;
                    }else{
                        if (Km.Refundproducts.View.IsSelectView==1){
                            Km.Refundproducts.View.IsSelectView=0;  
                            this.grid.showRefundproducts();   
                        }     
                    }    
                },
                rowdeselect: function(sm, rowIndex, record) {  
                    if (sm.getCount() != 1){
                        if (Km.Refundproducts.Config.View.IsShow==1){
                            Km.Refundproducts.View.IsSelectView=1;    
                        }             
                        this.grid.hideRefundproducts();
                        Km.Refundproducts.Config.View.IsShow=0;
                    }    
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){  
            if (!Km.Refundproducts.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showRefundproducts();
                this.tvpView.toggle(true);
            }else{
                this.hideRefundproducts();
                Km.Refundproducts.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){ 
            if (checked){             
               Km.Refundproducts.Config.View.IsFix=1; 
            }else{ 
               Km.Refundproducts.Config.View.IsFix=0;   
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Refundproducts.Config.View.IsShow=0;
                return ;
            }
            if (Km.Refundproducts.Config.View.IsShow==1){
               this.hideRefundproducts(); 
               Km.Refundproducts.Config.View.IsShow=0;
            }
            this.showRefundproducts();   
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
         * 查询符合条件的退款商品
         */
        doSelectRefundproducts : function() {
            if (this.topToolbar){
                var rstatus = this.topToolbar.rstatus.getValue();
                var rorder_code = this.topToolbar.rorder_code.getValue();
                this.filter       ={'status':rstatus,'order_code':rorder_code};
            }
            var condition = {'start':0,'limit':Km.Refundproducts.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceRefundproducts.queryPageRefundproducts(condition,function(provider, response) {   
                if (response.result.data) {   
                    var result           = new Array();
                    result['data']       =response.result.data; 
                    result['totalCount'] =response.result.totalCount;
                    Km.Refundproducts.Store.refundproductsStore.loadData(result); 
                } else {
                    Km.Refundproducts.Store.refundproductsStore.removeAll();                        
                    Ext.Msg.alert('提示', '无符合条件的退款商品！');
                }
            });
        }, 
        /**
         * 显示退款商品视图
         * 显示退款商品的视图相对退款商品列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Refundproducts.Config.View.Direction=viewDirection; 
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Refundproducts.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Refundproducts.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Refundproducts.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Refundproducts.View.Running.viewTabs);
                    break;    
            }  
            Km.Refundproducts.Cookie.set('View.Direction',Km.Refundproducts.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Refundproducts.Config.View.IsFix==0)&&(Km.Refundproducts.Config.View.IsShow==1)){
                    this.showRefundproducts();     
                }
                Km.Refundproducts.Config.View.IsFix=1;
                Km.Refundproducts.View.Running.refundproductsGrid.tvpView.menu.mBind.setChecked(true,true);  
                Km.Refundproducts.Config.View.IsShow=0;
                this.showRefundproducts();     
            }
        }, 
        /**
         * 显示退款商品
         */
        showRefundproducts : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择退款商品！');
                Km.Refundproducts.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            } 
            if (Km.Refundproducts.Config.View.IsFix==0){
                if (Km.Refundproducts.View.Running.view_window==null){
                    Km.Refundproducts.View.Running.view_window=new Km.Refundproducts.View.RefundproductsView.Window();
                }
                if (Km.Refundproducts.View.Running.view_window.hidden){
                    Km.Refundproducts.View.Running.view_window.show();
                    Km.Refundproducts.View.Running.view_window.winTabs.hideTabStripItem(Km.Refundproducts.View.Running.view_window.winTabs.tabFix);   
                    this.updateViewRefundproducts();
                    this.tvpView.toggle(true);
                    Km.Refundproducts.Config.View.IsShow=1;
                }else{
                    this.hideRefundproducts();
                    Km.Refundproducts.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Refundproducts.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Refundproducts.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Refundproducts.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Refundproducts.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Refundproducts.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Refundproducts.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Refundproducts.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Refundproducts.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Refundproducts.View.Running.viewTabs);
                    }
                    break;    
            }  
            this.hideRefundproducts();
            if (Km.Refundproducts.Config.View.IsShow==0){
                Km.Refundproducts.View.Running.viewTabs.enableCollapse();  
                switch(Km.Refundproducts.Config.View.Direction){
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
                this.updateViewRefundproducts();
                this.tvpView.toggle(true);
                Km.Refundproducts.Config.View.IsShow=1;
            }else{
                Km.Refundproducts.Config.View.IsShow=0;
            }

            this.ownerCt.doLayout();
        },
        /**
         * 隐藏退款商品
         */
        hideRefundproducts : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();   
            this.ownerCt.east.hide(); 
            if (Km.Refundproducts.View.Running.view_window!=null){
                Km.Refundproducts.View.Running.view_window.hide();
            }            
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前退款商品显示信息
         */
        updateViewRefundproducts : function() {
            if (Km.Refundproducts.View.Running.view_window!=null){
                Km.Refundproducts.View.Running.view_window.winTabs.tabRefundproductsDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Refundproducts.View.Running.viewTabs.tabRefundproductsDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建退款商品
         */
        addRefundproducts : function() {  
            if (Km.Refundproducts.View.Running.edit_window==null){   
                Km.Refundproducts.View.Running.edit_window=new Km.Refundproducts.View.EditWindow();   
            }     
            Km.Refundproducts.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Refundproducts.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Refundproducts.View.Running.edit_window.setTitle('添加退款商品');
            Km.Refundproducts.View.Running.edit_window.savetype=0;
            Km.Refundproducts.View.Running.edit_window.refundproducts_id.setValue("");
            switch (Km.Refundproducts.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Refundproducts.View.EditWindow.KindEditor_intro) Km.Refundproducts.View.EditWindow.KindEditor_intro.html("");
                    break
                case 3:
                    break
                default:                
                    //if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData("");
            }
            
            Km.Refundproducts.View.Running.edit_window.show();   
            Km.Refundproducts.View.Running.edit_window.maximize();               
        },   
        /**
         * 编辑退款商品时先获得选中的退款商品信息
         */
        updateRefundproducts : function() {
            if (Km.Refundproducts.View.Running.edit_window==null){   
                Km.Refundproducts.View.Running.edit_window=new Km.Refundproducts.View.EditWindow();   
            }            
            Km.Refundproducts.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Refundproducts.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Refundproducts.View.Running.edit_window.setTitle('修改退款商品');
            Km.Refundproducts.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Refundproducts.View.Running.edit_window.savetype=1;
            switch (Km.Refundproducts.Config.OnlineEditor)
            {
                case 2:
                    if (Km.Refundproducts.View.EditWindow.KindEditor_intro) Km.Refundproducts.View.EditWindow.KindEditor_intro.html(this.getSelectionModel().getSelected().data.intro);
                    break
                case 3:
                    if (xhEditor_intro)xhEditor_intro.setSource(this.getSelectionModel().getSelected().data.intro);
                    break
                default:
                    //if (CKEDITOR.instances.intro) CKEDITOR.instances.intro.setData(this.getSelectionModel().getSelected().data.intro); 
            }
            
            Km.Refundproducts.View.Running.edit_window.show();    
            Km.Refundproducts.View.Running.edit_window.maximize();                  
        },        
        /**
         * 删除退款商品
         */
        deleteRefundproducts : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的退款商品吗?', this.confirmDeleteRefundproducts,this);
        }, 
        /**
         * 确认删除退款商品
         */
        confirmDeleteRefundproducts : function(btn) {
            if (btn == 'yes') {  
                var del_refundproducts_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_refundproducts_ids=del_refundproducts_ids+selectedRows[flag].data.refundproducts_id+",";
                }
                ExtServiceRefundproducts.deleteByIds(del_refundproducts_ids);
                this.doSelectRefundproducts();
                Ext.Msg.alert("提示", "删除成功！");        
            }
        },
        /**
         * 导出退款商品
         */
        exportRefundproducts : function() {            
            ExtServiceRefundproducts.exportRefundproducts(this.filter,function(provider, response) {  
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });                        
        },
        /**
         * 导入退款商品
         */
        importRefundproducts : function() { 
            if (Km.Refundproducts.View.current_uploadWindow==null){   
                Km.Refundproducts.View.current_uploadWindow=new Km.Refundproducts.View.UploadWindow();   
            }     
            Km.Refundproducts.View.current_uploadWindow.show();
        }                
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Refundproducts.View.Running.refundproductsGrid=new Km.Refundproducts.View.Grid();           
            if (Km.Refundproducts.Config.View.IsFix==0){
                Km.Refundproducts.View.Running.refundproductsGrid.tvpView.menu.mBind.setChecked(false,true);  
            }
            config = Ext.apply({ 
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Refundproducts.View.Running.refundproductsGrid, 
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Refundproducts.View.Running.viewTabs]}, 
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
                    ]
                }
            }, config);   
            Km.Refundproducts.View.Panel.superclass.constructor.call(this, config);  
        }        
    }),
    /**
     * 当前运行的可视化对象
     */ 
    Running:{         
        /**
         * 当前退款商品Grid对象
         */
        refundproductsGrid:null,
  
        /**
         * 显示退款商品信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Refundproducts.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);     
    Km.Refundproducts.Init();
    /**
     * 退款商品数据模型获取数据Direct调用
     */        
    Km.Refundproducts.Store.refundproductsStore.proxy=new Ext.data.DirectProxy({ 
        api: {read:ExtServiceRefundproducts.queryPageRefundproducts}
    });   
    /**
     * 退款商品页面布局
     */
    Km.Refundproducts.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Refundproducts.View.Panel()]
    });
    Km.Refundproducts.Viewport.doLayout();                                  
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});     