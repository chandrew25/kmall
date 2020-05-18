Ext.namespace("Kmall.Admin.Deliveryitem");
Km = Kmall.Admin.Deliveryitem;
Km.Deliveryitem={
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
             * 显示运送商品的视图相对运送商品列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示运送商品信息页(或者打开新窗口)
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
        if (Km.Deliveryitem.Cookie.get('View.Direction')){
            Km.Deliveryitem.Config.View.Direction=Km.Deliveryitem.Cookie.get('View.Direction');
        }
        if (Km.Deliveryitem.Cookie.get('View.IsFix')!=null){
            Km.Deliveryitem.Config.View.IsFix=Km.Deliveryitem.Cookie.get('View.IsFix');
        }
    }
}; 
/**
 * Model:数据模型   
 */
Km.Deliveryitem.Store = { 
    /**
     * 运送商品
     */ 
    deliveryitemStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',  
            root: 'data',remoteSort: true,                
            fields : [
                  {name: 'deliveryitem_id',type: 'int'},   
                  {name: 'delivery_id',type: 'int'},
                  {name: 'delivery_no',type: 'string'},
                  {name: 'product_id',type: 'string'},
                  {name: 'item_type',type: 'string'},
                  {name: 'product_name',type: 'string'},
                  {name: 'price',type: 'float'},
                  {name: 'number',type: 'int'}
            ]}         
        ),
        writer: new Ext.data.JsonWriter({
            encode: false 
        }),
        listeners : {    
            beforeload : function(store, options) {   
                if (Ext.isReady) {  
                    Ext.apply(options.params, Km.Deliveryitem.View.Running.deliveryitemGrid.filter);//保证分页也将查询条件带上  
                }
            }
        }    
    }),            
    /**
     * 易乐物流
     */
    deliveryStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/delivery.php'
          }),
        reader: new Ext.data.JsonReader({
            root: 'deliverys',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'delivery_id'
          }, [
              {name: 'delivery_id', mapping: 'delivery_id'}, 
              {name: 'delivery_no', mapping: 'delivery_no'} 
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
              {name: 'product_name', mapping: 'product_name'} 
        ])
    })      
};
/**
 * View:运送商品显示组件   
 */
Km.Deliveryitem.View={ 
    /**
     * 编辑窗口：新建或者修改运送商品
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
                              {xtype: 'hidden',  name : 'deliveryitem_id',ref:'../deliveryitem_id'},        
                              {xtype: 'hidden',name : 'delivery_id',id:'delivery_id'},
                              {
                                 fieldLabel : '快递单号',xtype: 'combo',name : 'delivery_no',id : 'delivery_no',
                                 store:Km.Deliveryitem.Store.deliveryStore,emptyText: '请选择快递单号',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Deliveryitem.Config.PageSize,
                                 displayField:'delivery_no',// 显示文本
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                            '<tpl for="."><div class="search-item">',
                                                '<h3>{delivery_no}</h3>',
                                            '</div></tpl>'
                                 ),
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        Ext.getCmp("delivery_id").setValue(record.data.delivery_id);
                                        Ext.getCmp("delivery_no").setValue(record.data.delivery_no);
                                        this.collapse();
                                       }
                                   }
                              },
                              {xtype: 'hidden',name : 'product_id',id:'product_id'},
                              {
                                 fieldLabel : '商品名称',xtype: 'combo',name : 'product_name',id : 'product_name',
                                 store:Km.Deliveryitem.Store.productStore,emptyText: '请选择商品名称',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Deliveryitem.Config.PageSize,
                                 displayField:'product_name',// 显示文本
                                 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                 tpl:new Ext.XTemplate(
                                            '<tpl for="."><div class="search-item">',
                                                '<h3>{product_name}</h3>',
                                            '</div></tpl>'
                                 ),
                                 onSelect:function(record,index){
                                     if(this.fireEvent('beforeselect', this, record, index) !== false){
                                        Ext.getCmp("product_id").setValue(record.data.product_id);
                                        Ext.getCmp("product_name").setValue(record.data.product_name);
                                        this.collapse();
                                       }
                                   }
                              },
                              {fieldLabel : '商品类型',hiddenName : 'item_type',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['1', '产品'],['2', '礼物'],['3', '包裹']]
                                  }),emptyText: '请选择商品类型',
                                valueField : 'value',// 值
                                displayField : 'text'// 显示文本
                            },
                              {fieldLabel : '商品价格',name : 'price',xtype : 'numberfield'},
                              {fieldLabel : '数量',name : 'number',xtype : 'numberfield'}        
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
                            this.editForm.api.submit=ExtServiceDeliveryitem.save;                   
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Deliveryitem.View.Running.deliveryitemGrid.doSelectDeliveryitem();
                                    form.reset(); 
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceDeliveryitem.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {                                                  
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){       
                                        Km.Deliveryitem.View.Running.deliveryitemGrid.bottomToolbar.doRefresh(); 
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
                        this.editForm.form.loadRecord(Km.Deliveryitem.View.Running.deliveryitemGrid.getSelectionModel().getSelected());
 
                    }                  
                }]    
            }, config);  
            Km.Deliveryitem.View.EditWindow.superclass.constructor.call(this, config);     
        }
    }),
    /**
     * 显示运送商品详情
     */
    DeliveryitemView:{
        /**
         * Tab页：容器包含显示与运送商品所有相关的信息
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
                                if (Km.Deliveryitem.View.Running.deliveryitemGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择运送商品！');
                                    return false;
                                } 
                                Km.Deliveryitem.Config.View.IsShow=1;
                                Km.Deliveryitem.View.Running.deliveryitemGrid.showDeliveryitem();   
                                Km.Deliveryitem.View.Running.deliveryitemGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Deliveryitem.View.DeliveryitemView.Tabs.superclass.constructor.call(this, config);
 
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Deliveryitem.Config.View.Direction==1)||(Km.Deliveryitem.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabDeliveryitemDetail',iconCls:'tabs',
                     tpl: [
                      '<table class="viewdoblock">',                                                                            
                         '<tr class="entry"><td class="head">快递单号</td><td class="content">{delivery_no}</td></tr>',
                         '<tr class="entry"><td class="head">商品类型</td><td class="content">{item_type}</td></tr>',
                         '<tr class="entry"><td class="head">商品名称</td><td class="content">{product_name}</td></tr>',
                         '<tr class="entry"><td class="head">商品价格</td><td class="content">{price}</td></tr>',
                         '<tr class="entry"><td class="head">数量</td><td class="content">{number}</td></tr>',                      
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
         * 窗口:显示运送商品信息
         */
        Window:Ext.extend(Ext.Window,{ 
            constructor : function(config) { 
                config = Ext.apply({
                    title:"查看运送商品",constrainHeader:true,maximizable: true,minimizable : true, 
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Deliveryitem.View.DeliveryitemView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: { 
                        minimize:function(w){
                            w.hide();
                            Km.Deliveryitem.Config.View.IsShow=0;
                            Km.Deliveryitem.View.Running.deliveryitemGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Deliveryitem.View.Running.deliveryitemGrid.tvpView.toggle(false);
                        }   
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Deliveryitem.View.Running.deliveryitemGrid.addDeliveryitem();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Deliveryitem.View.Running.deliveryitemGrid.updateDeliveryitem();}
                    }]
                }, config);  
                Km.Deliveryitem.View.DeliveryitemView.Window.superclass.constructor.call(this, config);   
            }        
        })
    },
    /**
     * 窗口：批量上传运送商品
     */        
    UploadWindow:Ext.extend(Ext.Window,{ 
        constructor : function(config) { 
            config = Ext.apply({     
                title : '批量运送商品上传',
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
                            emptyText: '请上传运送商品Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadDeliveryitem',
                                    success : function(form, action) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Deliveryitem.View.Running.deliveryitemGrid.doSelectDeliveryitem();
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
            Km.Deliveryitem.View.UploadWindow.superclass.constructor.call(this, config);     
        }        
    }),
    /**
     * 视图：运送商品列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件  
                 */
                filter:null,
                region : 'center',
                store : Km.Deliveryitem.Store.deliveryitemStore,
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
                          {header : '快递单号',dataIndex : 'delivery_no'},
                          {header : '商品类型',dataIndex : 'item_type'},
                          {header : '商品名称',dataIndex : 'product_name'},
                          {header : '商品价格',dataIndex : 'price'},
                          {header : '数量',dataIndex : 'number'}                                 
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
                                '快递单号 ','&nbsp;&nbsp;',{ref: '../ddelivery_id',xtype:'hidden',name : 'delivery_id',id:'ddelivery_id'},
                                {
                                     xtype: 'combo',name : 'delivery_no',id : 'ddelivery_no',
                                     store:Km.Deliveryitem.Store.deliveryStore,emptyText: '请选择快递单号',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width:280,pageSize:Km.Deliveryitem.Config.PageSize,
                                     displayField:'delivery_no',// 显示文本
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                                '<tpl for="."><div class="search-item">',
                                                    '<h3>{delivery_no}</h3>',
                                                '</div></tpl>'
                                     ),
                                     onSelect:function(record,index){
                                         if(this.fireEvent('beforeselect', this, record, index) !== false){
                                            Ext.getCmp("ddelivery_id").setValue(record.data.delivery_id);
                                            Ext.getCmp("ddelivery_no").setValue(record.data.delivery_no);
                                            this.collapse();
                                         }
                                     }
                                },'&nbsp;&nbsp;',
                                '商品 ','&nbsp;&nbsp;',{ref: '../dproduct_id',xtype:'hidden',name : 'product_id',id:'dproduct_id'},
                                {
                                     xtype: 'combo',name : 'product_name',id : 'dproduct_name',
                                     store:Km.Deliveryitem.Store.productStore,emptyText: '请选择商品',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width:280,pageSize:Km.Deliveryitem.Config.PageSize,
                                     displayField:'product_name',// 显示文本
                                     mode: 'remote',editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:true,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                                '<tpl for="."><div class="search-item">',
                                                    '<h3>{product_name}</h3>',
                                                '</div></tpl>'
                                     ),
                                     onSelect:function(record,index){
                                         if(this.fireEvent('beforeselect', this, record, index) !== false){
                                            Ext.getCmp("dproduct_id").setValue(record.data.product_id);
                                            Ext.getCmp("dproduct_name").setValue(record.data.product_name);
                                            this.collapse();
                                         }
                                     }
                                },'&nbsp;&nbsp;',                                
                                {
                                    xtype : 'button',text : '查询',scope: this, 
                                    handler : function() {
                                        this.doSelectDeliveryitem();
                                    }
                                }, 
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {         
                                        this.topToolbar.ddelivery_id.setValue("");
                                        this.topToolbar.dproduct_id.setValue("");                                        
                                        this.filter={};
                                        this.doSelectDeliveryitem();
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
                                    text : '添加运送商品',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addDeliveryitem();
                                    }
                                },'-',{
                                    text : '修改运送商品',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
                                    handler : function() {
                                        this.updateDeliveryitem();
                                    }
                                },'-',{
                                    text : '删除运送商品', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
                                    handler : function() {
                                        this.deleteDeliveryitem();
                                    }
                                },'-',{
                                    text : '导入',iconCls : 'icon-import', 
                                    handler : function() {
                                        this.importDeliveryitem();
                                    }
                                },'-',{
                                    text : '导出',iconCls : 'icon-export', 
                                    handler : function() { 
                                        this.exportDeliveryitem();
                                    }
                                },'-',{ 
                                    xtype:'tbsplit',text: '查看运送商品', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,  
                                    handler:function(){this.showDeliveryitem()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideDeliveryitem();Km.Deliveryitem.Config.View.IsShow=0;}},'-', 
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Deliveryitem.Cookie.set('View.IsFix',Km.Deliveryitem.Config.View.IsFix);}} 
                                        ]}
                                },'-']}
                    )]
                },                
                bbar: new Ext.PagingToolbar({          
                    pageSize: Km.Deliveryitem.Config.PageSize,
                    store: Km.Deliveryitem.Store.deliveryitemStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Deliveryitem.Config.PageSize,minValue:1,width:35, 
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Deliveryitem.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Deliveryitem.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectDeliveryitem();
                                }, 
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Deliveryitem.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Deliveryitem.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectDeliveryitem();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示运送商品列表
            this.doSelectDeliveryitem();
            Km.Deliveryitem.View.Grid.superclass.constructor.call(this, config); 
            //创建在Grid里显示的运送商品信息Tab页
            Km.Deliveryitem.View.Running.viewTabs=new Km.Deliveryitem.View.DeliveryitemView.Tabs();
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
                    this.grid.updateViewDeliveryitem();                     
                    if (sm.getCount() != 1){
                        this.grid.hideDeliveryitem();
                        Km.Deliveryitem.Config.View.IsShow=0;
                    }else{
                        if (Km.Deliveryitem.View.IsSelectView==1){
                            Km.Deliveryitem.View.IsSelectView=0;  
                            this.grid.showDeliveryitem();   
                        }     
                    }    
                },
                rowdeselect: function(sm, rowIndex, record) {  
                    if (sm.getCount() != 1){
                        if (Km.Deliveryitem.Config.View.IsShow==1){
                            Km.Deliveryitem.View.IsSelectView=1;    
                        }             
                        this.grid.hideDeliveryitem();
                        Km.Deliveryitem.Config.View.IsShow=0;
                    }    
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){  
            if (!Km.Deliveryitem.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showDeliveryitem();
                this.tvpView.toggle(true);
            }else{
                this.hideDeliveryitem();
                Km.Deliveryitem.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){ 
            if (checked){             
               Km.Deliveryitem.Config.View.IsFix=1; 
            }else{ 
               Km.Deliveryitem.Config.View.IsFix=0;   
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Deliveryitem.Config.View.IsShow=0;
                return ;
            }
            if (Km.Deliveryitem.Config.View.IsShow==1){
               this.hideDeliveryitem(); 
               Km.Deliveryitem.Config.View.IsShow=0;
            }
            this.showDeliveryitem();   
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
         * 查询符合条件的运送商品
         */
        doSelectDeliveryitem : function() {
            if (this.topToolbar){                                
                var ddelivery_id = this.topToolbar.ddelivery_id.getValue();
                var dproduct_id = this.topToolbar.dproduct_id.getValue();
                this.filter       ={'delivery_id':ddelivery_id,'product_id':dproduct_id};
            }
            var condition = {'start':0,'limit':Km.Deliveryitem.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceDeliveryitem.queryPageDeliveryitem(condition,function(provider, response) {   
                if (response.result.data) {   
                    var result           = new Array();
                    result['data']       =response.result.data; 
                    result['totalCount'] =response.result.totalCount;
                    Km.Deliveryitem.Store.deliveryitemStore.loadData(result); 
                } else {
                    Km.Deliveryitem.Store.deliveryitemStore.removeAll();                        
                    Ext.Msg.alert('提示', '无符合条件的运送商品！');
                }
            });
        }, 
        /**
         * 显示运送商品视图
         * 显示运送商品的视图相对运送商品列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Deliveryitem.Config.View.Direction=viewDirection; 
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Deliveryitem.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Deliveryitem.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Deliveryitem.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Deliveryitem.View.Running.viewTabs);
                    break;    
            }  
            Km.Deliveryitem.Cookie.set('View.Direction',Km.Deliveryitem.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Deliveryitem.Config.View.IsFix==0)&&(Km.Deliveryitem.Config.View.IsShow==1)){
                    this.showDeliveryitem();     
                }
                Km.Deliveryitem.Config.View.IsFix=1;
                Km.Deliveryitem.View.Running.deliveryitemGrid.tvpView.menu.mBind.setChecked(true,true);  
                Km.Deliveryitem.Config.View.IsShow=0;
                this.showDeliveryitem();     
            }
        }, 
        /**
         * 显示运送商品
         */
        showDeliveryitem : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择运送商品！');
                Km.Deliveryitem.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            } 
            if (Km.Deliveryitem.Config.View.IsFix==0){
                if (Km.Deliveryitem.View.Running.view_window==null){
                    Km.Deliveryitem.View.Running.view_window=new Km.Deliveryitem.View.DeliveryitemView.Window();
                }
                if (Km.Deliveryitem.View.Running.view_window.hidden){
                    Km.Deliveryitem.View.Running.view_window.show();
                    Km.Deliveryitem.View.Running.view_window.winTabs.hideTabStripItem(Km.Deliveryitem.View.Running.view_window.winTabs.tabFix);   
                    this.updateViewDeliveryitem();
                    this.tvpView.toggle(true);
                    Km.Deliveryitem.Config.View.IsShow=1;
                }else{
                    this.hideDeliveryitem();
                    Km.Deliveryitem.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Deliveryitem.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Deliveryitem.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Deliveryitem.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Deliveryitem.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Deliveryitem.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Deliveryitem.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Deliveryitem.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Deliveryitem.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Deliveryitem.View.Running.viewTabs);
                    }
                    break;    
            }  
            this.hideDeliveryitem();
            if (Km.Deliveryitem.Config.View.IsShow==0){
                Km.Deliveryitem.View.Running.viewTabs.enableCollapse();  
                switch(Km.Deliveryitem.Config.View.Direction){
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
                this.updateViewDeliveryitem();
                this.tvpView.toggle(true);
                Km.Deliveryitem.Config.View.IsShow=1;
            }else{
                Km.Deliveryitem.Config.View.IsShow=0;
            }

            this.ownerCt.doLayout();
        },
        /**
         * 隐藏运送商品
         */
        hideDeliveryitem : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();   
            this.ownerCt.east.hide(); 
            if (Km.Deliveryitem.View.Running.view_window!=null){
                Km.Deliveryitem.View.Running.view_window.hide();
            }            
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前运送商品显示信息
         */
        updateViewDeliveryitem : function() {
            if (Km.Deliveryitem.View.Running.view_window!=null){
                Km.Deliveryitem.View.Running.view_window.winTabs.tabDeliveryitemDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Deliveryitem.View.Running.viewTabs.tabDeliveryitemDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建运送商品
         */
        addDeliveryitem : function() {  
            if (Km.Deliveryitem.View.Running.edit_window==null){   
                Km.Deliveryitem.View.Running.edit_window=new Km.Deliveryitem.View.EditWindow();   
            }     
            Km.Deliveryitem.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Deliveryitem.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Deliveryitem.View.Running.edit_window.setTitle('添加运送商品');
            Km.Deliveryitem.View.Running.edit_window.savetype=0;
            Km.Deliveryitem.View.Running.edit_window.deliveryitem_id.setValue("");
            
            Km.Deliveryitem.View.Running.edit_window.show();   
            Km.Deliveryitem.View.Running.edit_window.maximize();               
        },   
        /**
         * 编辑运送商品时先获得选中的运送商品信息
         */
        updateDeliveryitem : function() {
            if (Km.Deliveryitem.View.Running.edit_window==null){   
                Km.Deliveryitem.View.Running.edit_window=new Km.Deliveryitem.View.EditWindow();   
            }            
            Km.Deliveryitem.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Deliveryitem.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Deliveryitem.View.Running.edit_window.setTitle('修改运送商品');
            Km.Deliveryitem.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Deliveryitem.View.Running.edit_window.savetype=1;
            
            Km.Deliveryitem.View.Running.edit_window.show();    
            Km.Deliveryitem.View.Running.edit_window.maximize();                  
        },        
        /**
         * 删除运送商品
         */
        deleteDeliveryitem : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的运送商品吗?', this.confirmDeleteDeliveryitem,this);
        }, 
        /**
         * 确认删除运送商品
         */
        confirmDeleteDeliveryitem : function(btn) {
            if (btn == 'yes') {  
                var del_deliveryitem_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_deliveryitem_ids=del_deliveryitem_ids+selectedRows[flag].data.deliveryitem_id+",";
                }
                ExtServiceDeliveryitem.deleteByIds(del_deliveryitem_ids);
                this.doSelectDeliveryitem();
                Ext.Msg.alert("提示", "删除成功！");        
            }
        },
        /**
         * 导出运送商品
         */
        exportDeliveryitem : function() {            
            ExtServiceDeliveryitem.exportDeliveryitem(this.filter,function(provider, response) {  
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });                        
        },
        /**
         * 导入运送商品
         */
        importDeliveryitem : function() { 
            if (Km.Deliveryitem.View.current_uploadWindow==null){   
                Km.Deliveryitem.View.current_uploadWindow=new Km.Deliveryitem.View.UploadWindow();   
            }     
            Km.Deliveryitem.View.current_uploadWindow.show();
        }                
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Deliveryitem.View.Running.deliveryitemGrid=new Km.Deliveryitem.View.Grid();           
            if (Km.Deliveryitem.Config.View.IsFix==0){
                Km.Deliveryitem.View.Running.deliveryitemGrid.tvpView.menu.mBind.setChecked(false,true);  
            }
            config = Ext.apply({ 
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Deliveryitem.View.Running.deliveryitemGrid, 
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Deliveryitem.View.Running.viewTabs]}, 
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
                    ]
                }
            }, config);   
            Km.Deliveryitem.View.Panel.superclass.constructor.call(this, config);  
        }        
    }),
    /**
     * 当前运行的可视化对象
     */ 
    Running:{         
        /**
         * 当前运送商品Grid对象
         */
        deliveryitemGrid:null,
  
        /**
         * 显示运送商品信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Deliveryitem.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);     
    Km.Deliveryitem.Init();
    /**
     * 运送商品数据模型获取数据Direct调用
     */        
    Km.Deliveryitem.Store.deliveryitemStore.proxy=new Ext.data.DirectProxy({ 
        api: {read:ExtServiceDeliveryitem.queryPageDeliveryitem}
    });   
    /**
     * 运送商品页面布局
     */
    Km.Deliveryitem.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Deliveryitem.View.Panel()]
    });
    Km.Deliveryitem.Viewport.doLayout();                                  
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});     
