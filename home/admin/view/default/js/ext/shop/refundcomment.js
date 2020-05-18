Ext.namespace("Kmall.Admin.Refundcomment");
Km = Kmall.Admin.Refundcomment;
Km.Refundcomment={
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
             * 显示退款评论的视图相对退款评论列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示退款评论信息页(或者打开新窗口)
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
        if (Km.Refundcomment.Cookie.get('View.Direction')){
            Km.Refundcomment.Config.View.Direction=Km.Refundcomment.Cookie.get('View.Direction');
        }
        if (Km.Refundcomment.Cookie.get('View.IsFix')!=null){
            Km.Refundcomment.Config.View.IsFix=Km.Refundcomment.Cookie.get('View.IsFix');
        }
    }
}; 
/**
 * Model:数据模型   
 */
Km.Refundcomment.Store = { 
    /**
     * 退款评论
     */ 
    refundcommentStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',  
            root: 'data',remoteSort: true,                
            fields : [
                  {name: 'refundcomment_id',type: 'int'},
                  {name: 'member_id',type: 'int'},
                  {name: 'username',type: 'string'},
                  {name: 'order_code',type: 'string'},
                  {name: 'name',type: 'string'},
                  {name: 'comment',type: 'string'},
                  {name: 'remarks',type: 'string'}
            ]}         
        ),
        writer: new Ext.data.JsonWriter({
            encode: false 
        }),
        listeners : {    
            beforeload : function(store, options) {   
                if (Ext.isReady) {  
                    Ext.apply(options.params, Km.Refundcomment.View.Running.refundcommentGrid.filter);//保证分页也将查询条件带上  
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
    })      
};
/**
 * View:退款评论显示组件   
 */
Km.Refundcomment.View={ 
    /**
     * 编辑窗口：新建或者修改退款评论
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
                              {xtype: 'hidden',  name : 'refundcomment_id',ref:'../refundcomment_id'},
                              {xtype: 'hidden',name : 'member_id',id:'member_id'},
                              {
                                 fieldLabel : '会员',xtype: 'combo',name : 'username',id : 'username',
                                 store:Km.Refundcomment.Store.memberStore,emptyText: '请选择会员',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Refundcomment.Config.PageSize,
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
                              {fieldLabel : '订单号',name : 'order_code'},
                              {fieldLabel : '申请人姓名',name : 'name'},
                              {fieldLabel : '申请原因',name : 'comment'},
                              {fieldLabel : '备注',name : 'remarks'}        
                        ]
                    })                
                ],
                buttons : [ {         
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {   
         
                        if (!this.editForm.getForm().isValid()) {
                            return;
                        }
                        editWindow=this;                   
                        if (this.savetype==0){    
                            this.editForm.api.submit=ExtServiceRefundcomment.save;                   
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Refundcomment.View.Running.refundcommentGrid.doSelectRefundcomment();
                                    form.reset(); 
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceRefundcomment.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {                                                  
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){       
                                        Km.Refundcomment.View.Running.refundcommentGrid.bottomToolbar.doRefresh(); 
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
                        this.editForm.form.loadRecord(Km.Refundcomment.View.Running.refundcommentGrid.getSelectionModel().getSelected());
 
                    }                  
                }]    
            }, config);  
            Km.Refundcomment.View.EditWindow.superclass.constructor.call(this, config);     
        }
    }),
    /**
     * 显示退款评论详情
     */
    RefundcommentView:{
        /**
         * Tab页：容器包含显示与退款评论所有相关的信息
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
                                if (Km.Refundcomment.View.Running.refundcommentGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择退款评论！');
                                    return false;
                                } 
                                Km.Refundcomment.Config.View.IsShow=1;
                                Km.Refundcomment.View.Running.refundcommentGrid.showRefundcomment();   
                                Km.Refundcomment.View.Running.refundcommentGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Refundcomment.View.RefundcommentView.Tabs.superclass.constructor.call(this, config);
 
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Refundcomment.Config.View.Direction==1)||(Km.Refundcomment.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabRefundcommentDetail',iconCls:'tabs',
                     tpl: [
                      '<table class="viewdoblock">', 
                         '<tr class="entry"><td class="head">会员</td><td class="content">{username}</td></tr>',
                         '<tr class="entry"><td class="head">订单号</td><td class="content">{order_code}</td></tr>',
                         '<tr class="entry"><td class="head">申请人姓名</td><td class="content">{name}</td></tr>',
                         '<tr class="entry"><td class="head">申请原因</td><td class="content">{comment}</td></tr>',
                         '<tr class="entry"><td class="head">备注</td><td class="content">{remarks}</td></tr>',                      
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
         * 窗口:显示退款评论信息
         */
        Window:Ext.extend(Ext.Window,{ 
            constructor : function(config) { 
                config = Ext.apply({
                    title:"查看退款评论",constrainHeader:true,maximizable: true,minimizable : true, 
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Refundcomment.View.RefundcommentView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: { 
                        minimize:function(w){
                            w.hide();
                            Km.Refundcomment.Config.View.IsShow=0;
                            Km.Refundcomment.View.Running.refundcommentGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Refundcomment.View.Running.refundcommentGrid.tvpView.toggle(false);
                        }   
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Refundcomment.View.Running.refundcommentGrid.addRefundcomment();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Refundcomment.View.Running.refundcommentGrid.updateRefundcomment();}
                    }]
                }, config);  
                Km.Refundcomment.View.RefundcommentView.Window.superclass.constructor.call(this, config);   
            }        
        })
    },
    /**
     * 窗口：批量上传退款评论
     */        
    UploadWindow:Ext.extend(Ext.Window,{ 
        constructor : function(config) { 
            config = Ext.apply({     
                title : '批量退款评论上传',
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
                            emptyText: '请上传退款评论Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadRefundcomment',
                                    success : function(form, action) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Refundcomment.View.Running.refundcommentGrid.doSelectRefundcomment();
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
            Km.Refundcomment.View.UploadWindow.superclass.constructor.call(this, config);     
        }        
    }),
    /**
     * 视图：退款评论列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件  
                 */
                filter:null,
                region : 'center',
                store : Km.Refundcomment.Store.refundcommentStore,
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
                          {header : '会员',dataIndex : 'username'},
                          {header : '订单号',dataIndex : 'order_code'},
                          {header : '申请人姓名',dataIndex : 'name'},
                          {header : '申请原因',dataIndex : 'comment'},
                          {header : '备注',dataIndex : 'remarks'}                                 
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
                                '订单号 ','&nbsp;&nbsp;',{ref: '../rorder_code'},'&nbsp;&nbsp;',
                                '申请人姓名 ','&nbsp;&nbsp;',{ref: '../rname'},'&nbsp;&nbsp;',
                                '申请原因 ','&nbsp;&nbsp;',{ref: '../rcomment'},'&nbsp;&nbsp;',                                
                                {
                                    xtype : 'button',text : '查询',scope: this, 
                                    handler : function() {
                                        this.doSelectRefundcomment();
                                    }
                                }, 
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.rorder_code.setValue("");
                                        this.topToolbar.rname.setValue("");
                                        this.topToolbar.rcomment.setValue("");                                        
                                        this.filter={};
                                        this.doSelectRefundcomment();
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
                                    text : '添加退款评论',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addRefundcomment();
                                    }
                                },'-',{
                                    text : '修改退款评论',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
                                    handler : function() {
                                        this.updateRefundcomment();
                                    }
                                },'-',{
                                    text : '删除退款评论', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
                                    handler : function() {
                                        this.deleteRefundcomment();
                                    }
                                },'-',{
                                    text : '导入',iconCls : 'icon-import', 
                                    handler : function() {
                                        this.importRefundcomment();
                                    }
                                },'-',{
                                    text : '导出',iconCls : 'icon-export', 
                                    handler : function() { 
                                        this.exportRefundcomment();
                                    }
                                },'-',{ 
                                    xtype:'tbsplit',text: '查看退款评论', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,  
                                    handler:function(){this.showRefundcomment()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideRefundcomment();Km.Refundcomment.Config.View.IsShow=0;}},'-', 
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Refundcomment.Cookie.set('View.IsFix',Km.Refundcomment.Config.View.IsFix);}} 
                                        ]}
                                },'-']}
                    )]
                },                
                bbar: new Ext.PagingToolbar({          
                    pageSize: Km.Refundcomment.Config.PageSize,
                    store: Km.Refundcomment.Store.refundcommentStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Refundcomment.Config.PageSize,minValue:1,width:35, 
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Refundcomment.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Refundcomment.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectRefundcomment();
                                }, 
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Refundcomment.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Refundcomment.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectRefundcomment();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示退款评论列表
            this.doSelectRefundcomment();
            Km.Refundcomment.View.Grid.superclass.constructor.call(this, config); 
            //创建在Grid里显示的退款评论信息Tab页
            Km.Refundcomment.View.Running.viewTabs=new Km.Refundcomment.View.RefundcommentView.Tabs();
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
                    this.grid.updateViewRefundcomment();                     
                    if (sm.getCount() != 1){
                        this.grid.hideRefundcomment();
                        Km.Refundcomment.Config.View.IsShow=0;
                    }else{
                        if (Km.Refundcomment.View.IsSelectView==1){
                            Km.Refundcomment.View.IsSelectView=0;  
                            this.grid.showRefundcomment();   
                        }     
                    }    
                },
                rowdeselect: function(sm, rowIndex, record) {  
                    if (sm.getCount() != 1){
                        if (Km.Refundcomment.Config.View.IsShow==1){
                            Km.Refundcomment.View.IsSelectView=1;    
                        }             
                        this.grid.hideRefundcomment();
                        Km.Refundcomment.Config.View.IsShow=0;
                    }    
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){  
            if (!Km.Refundcomment.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showRefundcomment();
                this.tvpView.toggle(true);
            }else{
                this.hideRefundcomment();
                Km.Refundcomment.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){ 
            if (checked){             
               Km.Refundcomment.Config.View.IsFix=1; 
            }else{ 
               Km.Refundcomment.Config.View.IsFix=0;   
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Refundcomment.Config.View.IsShow=0;
                return ;
            }
            if (Km.Refundcomment.Config.View.IsShow==1){
               this.hideRefundcomment(); 
               Km.Refundcomment.Config.View.IsShow=0;
            }
            this.showRefundcomment();   
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
         * 查询符合条件的退款评论
         */
        doSelectRefundcomment : function() {
            if (this.topToolbar){
                var rorder_code = this.topToolbar.rorder_code.getValue();
                var rname = this.topToolbar.rname.getValue();
                var rcomment = this.topToolbar.rcomment.getValue();
                this.filter       ={'order_code':rorder_code,'name':rname,'comment':rcomment};
            }
            var condition = {'start':0,'limit':Km.Refundcomment.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceRefundcomment.queryPageRefundcomment(condition,function(provider, response) {   
                if (response.result.data) {   
                    var result           = new Array();
                    result['data']       =response.result.data; 
                    result['totalCount'] =response.result.totalCount;
                    Km.Refundcomment.Store.refundcommentStore.loadData(result); 
                } else {
                    Km.Refundcomment.Store.refundcommentStore.removeAll();                        
                    Ext.Msg.alert('提示', '无符合条件的退款评论！');
                }
            });
        }, 
        /**
         * 显示退款评论视图
         * 显示退款评论的视图相对退款评论列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Refundcomment.Config.View.Direction=viewDirection; 
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Refundcomment.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Refundcomment.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Refundcomment.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Refundcomment.View.Running.viewTabs);
                    break;    
            }  
            Km.Refundcomment.Cookie.set('View.Direction',Km.Refundcomment.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Refundcomment.Config.View.IsFix==0)&&(Km.Refundcomment.Config.View.IsShow==1)){
                    this.showRefundcomment();     
                }
                Km.Refundcomment.Config.View.IsFix=1;
                Km.Refundcomment.View.Running.refundcommentGrid.tvpView.menu.mBind.setChecked(true,true);  
                Km.Refundcomment.Config.View.IsShow=0;
                this.showRefundcomment();     
            }
        }, 
        /**
         * 显示退款评论
         */
        showRefundcomment : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择退款评论！');
                Km.Refundcomment.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            } 
            if (Km.Refundcomment.Config.View.IsFix==0){
                if (Km.Refundcomment.View.Running.view_window==null){
                    Km.Refundcomment.View.Running.view_window=new Km.Refundcomment.View.RefundcommentView.Window();
                }
                if (Km.Refundcomment.View.Running.view_window.hidden){
                    Km.Refundcomment.View.Running.view_window.show();
                    Km.Refundcomment.View.Running.view_window.winTabs.hideTabStripItem(Km.Refundcomment.View.Running.view_window.winTabs.tabFix);   
                    this.updateViewRefundcomment();
                    this.tvpView.toggle(true);
                    Km.Refundcomment.Config.View.IsShow=1;
                }else{
                    this.hideRefundcomment();
                    Km.Refundcomment.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Refundcomment.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Refundcomment.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Refundcomment.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Refundcomment.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Refundcomment.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Refundcomment.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Refundcomment.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Refundcomment.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Refundcomment.View.Running.viewTabs);
                    }
                    break;    
            }  
            this.hideRefundcomment();
            if (Km.Refundcomment.Config.View.IsShow==0){
                Km.Refundcomment.View.Running.viewTabs.enableCollapse();  
                switch(Km.Refundcomment.Config.View.Direction){
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
                this.updateViewRefundcomment();
                this.tvpView.toggle(true);
                Km.Refundcomment.Config.View.IsShow=1;
            }else{
                Km.Refundcomment.Config.View.IsShow=0;
            }

            this.ownerCt.doLayout();
        },
        /**
         * 隐藏退款评论
         */
        hideRefundcomment : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();   
            this.ownerCt.east.hide(); 
            if (Km.Refundcomment.View.Running.view_window!=null){
                Km.Refundcomment.View.Running.view_window.hide();
            }            
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前退款评论显示信息
         */
        updateViewRefundcomment : function() {
            if (Km.Refundcomment.View.Running.view_window!=null){
                Km.Refundcomment.View.Running.view_window.winTabs.tabRefundcommentDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Refundcomment.View.Running.viewTabs.tabRefundcommentDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建退款评论
         */
        addRefundcomment : function() {  
            if (Km.Refundcomment.View.Running.edit_window==null){   
                Km.Refundcomment.View.Running.edit_window=new Km.Refundcomment.View.EditWindow();   
            }     
            Km.Refundcomment.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Refundcomment.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Refundcomment.View.Running.edit_window.setTitle('添加退款评论');
            Km.Refundcomment.View.Running.edit_window.savetype=0;
            Km.Refundcomment.View.Running.edit_window.refundcomment_id.setValue("");
            
            Km.Refundcomment.View.Running.edit_window.show();   
            Km.Refundcomment.View.Running.edit_window.maximize();               
        },   
        /**
         * 编辑退款评论时先获得选中的退款评论信息
         */
        updateRefundcomment : function() {
            if (Km.Refundcomment.View.Running.edit_window==null){   
                Km.Refundcomment.View.Running.edit_window=new Km.Refundcomment.View.EditWindow();   
            }            
            Km.Refundcomment.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Refundcomment.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Refundcomment.View.Running.edit_window.setTitle('修改退款评论');
            Km.Refundcomment.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Refundcomment.View.Running.edit_window.savetype=1;
            
            Km.Refundcomment.View.Running.edit_window.show();    
            Km.Refundcomment.View.Running.edit_window.maximize();                  
        },        
        /**
         * 删除退款评论
         */
        deleteRefundcomment : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的退款评论吗?', this.confirmDeleteRefundcomment,this);
        }, 
        /**
         * 确认删除退款评论
         */
        confirmDeleteRefundcomment : function(btn) {
            if (btn == 'yes') {  
                var del_refundcomment_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_refundcomment_ids=del_refundcomment_ids+selectedRows[flag].data.refundcomment_id+",";
                }
                ExtServiceRefundcomment.deleteByIds(del_refundcomment_ids);
                this.doSelectRefundcomment();
                Ext.Msg.alert("提示", "删除成功！");        
            }
        },
        /**
         * 导出退款评论
         */
        exportRefundcomment : function() {            
            ExtServiceRefundcomment.exportRefundcomment(this.filter,function(provider, response) {  
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });                        
        },
        /**
         * 导入退款评论
         */
        importRefundcomment : function() { 
            if (Km.Refundcomment.View.current_uploadWindow==null){   
                Km.Refundcomment.View.current_uploadWindow=new Km.Refundcomment.View.UploadWindow();   
            }     
            Km.Refundcomment.View.current_uploadWindow.show();
        }                
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Refundcomment.View.Running.refundcommentGrid=new Km.Refundcomment.View.Grid();           
            if (Km.Refundcomment.Config.View.IsFix==0){
                Km.Refundcomment.View.Running.refundcommentGrid.tvpView.menu.mBind.setChecked(false,true);  
            }
            config = Ext.apply({ 
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Refundcomment.View.Running.refundcommentGrid, 
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Refundcomment.View.Running.viewTabs]}, 
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
                    ]
                }
            }, config);   
            Km.Refundcomment.View.Panel.superclass.constructor.call(this, config);  
        }        
    }),
    /**
     * 当前运行的可视化对象
     */ 
    Running:{         
        /**
         * 当前退款评论Grid对象
         */
        refundcommentGrid:null,
  
        /**
         * 显示退款评论信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Refundcomment.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);     
    Km.Refundcomment.Init();
    /**
     * 退款评论数据模型获取数据Direct调用
     */        
    Km.Refundcomment.Store.refundcommentStore.proxy=new Ext.data.DirectProxy({ 
        api: {read:ExtServiceRefundcomment.queryPageRefundcomment}
    });   
    /**
     * 退款评论页面布局
     */
    Km.Refundcomment.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Refundcomment.View.Panel()]
    });
    Km.Refundcomment.Viewport.doLayout();                                  
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});     