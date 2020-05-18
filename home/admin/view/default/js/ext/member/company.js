Ext.namespace("Kmall.Admin.Company");
Km = Kmall.Admin.Company;
Km.Company={
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
             * 显示企业信息的视图相对企业信息列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示企业信息信息页(或者打开新窗口)
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
        if (Km.Company.Cookie.get('View.Direction')){
            Km.Company.Config.View.Direction=Km.Company.Cookie.get('View.Direction');
        }
        if (Km.Company.Cookie.get('View.IsFix')!=null){
            Km.Company.Config.View.IsFix=Km.Company.Cookie.get('View.IsFix');
        }
    }
}; 
/**
 * Model:数据模型   
 */
Km.Company.Store = { 
    /**
     * 企业信息
     */ 
    companyStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',  
            root: 'data',remoteSort: true,                
            fields : [
                {name: 'company_id',type: 'int'},
                {name: 'member_id',type: 'int'},
                {name: 'username',type: 'string'},
                {name: 'com_name',type: 'string'},
                {name: 'com_kind',type: 'string'},
                {name: 'com_kindShow',type: 'string'},
                {name: 'com_address',type: 'string'},
                {name: 'com_mcode',type: 'string'},
                {name: 'com_membernum',type: 'int'},
                {name: 'com_contractor',type: 'string'},
                {name: 'com_contractorShow',type: 'string'},
                {name: 'com_position',type: 'string'},
                {name: 'com_positionShow',type: 'string'},
                {name: 'com_tel',type: 'string'},
                {name: 'com_fax',type: 'string'},
                {name: 'com_welfare',type: 'string'}
            ]}         
        ),
        writer: new Ext.data.JsonWriter({
            encode: false 
        }),
        listeners : {    
            beforeload : function(store, options) {   
                if (Ext.isReady) {  
                    Ext.apply(options.params, Km.Company.View.Running.companyGrid.filter);//保证分页也将查询条件带上  
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
 * View:企业信息显示组件   
 */
Km.Company.View={ 
    /**
     * 编辑窗口：新建或者修改企业信息
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
                            xtype : 'textfield',anchor:'100%'
                        },
                        items : [ 
                            {xtype: 'hidden',  name : 'company_id',ref:'../company_id'},
                            {xtype: 'hidden',name : 'member_id',id:'member_id'},
                            {
                                 fieldLabel : '会员名',xtype: 'combo',name : 'username',id : 'username',
                                 store:Km.Company.Store.memberStore,emptyText: '请选择会员',itemSelector: 'div.search-item',
                                 loadingText: '查询中...',width: 570, pageSize:Km.Company.Config.PageSize,
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
                            {fieldLabel : '公司名称',name : 'com_name'},
                            {fieldLabel : '公司性质',hiddenName : 'com_kind',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                store : new Ext.data.SimpleStore({
                    fields : ['value', 'text'],
                    data : [['1', '政府机关/事业单'],['2', '国营'],['3', '私营'],['4', '中外合资'],['5', '外资'],['6', '其他']]
                }),emptyText: '请选择公司性质',
                valueField : 'value',// 值
                displayField : 'text'// 显示文本
              },
                            {fieldLabel : '公司地址',name : 'com_address'},
                            {fieldLabel : '邮编',name : 'com_mcode'},
                            {fieldLabel : '员工数量',name : 'com_membernum'},
                            {fieldLabel : '职务',hiddenName : 'com_position',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['1', '专员'],['2', '经理'],['3', '总监'],['4', '工会主席'],['5', '办公主任'],['100', '其他']]
                                }),emptyText: '请选择职务',
                                valueField : 'value',// 值
                                displayField : 'text'// 显示文本
                            },
                            {fieldLabel : '联系电话',name : 'com_tel'},
                            {fieldLabel : '传真',name : 'com_fax'},
                            {fieldLabel : '福利',name : 'com_welfare'}        
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
                            this.editForm.api.submit=ExtServiceCompany.save;                   
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Company.View.Running.companyGrid.doSelectCompany();
                                    form.reset(); 
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', '失败');
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceCompany.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "修改成功！");
                                    Km.Company.View.Running.companyGrid.doSelectCompany();
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
                        this.editForm.form.loadRecord(Km.Company.View.Running.companyGrid.getSelectionModel().getSelected());
 
                    }                  
                }]    
            }, config);  
            Km.Company.View.EditWindow.superclass.constructor.call(this, config);     
        }
    }),
    /**
     * 显示企业信息详情
     */
    CompanyView:{
        /**
         * Tab页：容器包含显示与企业信息所有相关的信息
         */  
        Tabs:Ext.extend(Ext.TabPanel,{ 
            constructor : function(config) { 
                config = Ext.apply({             
                    region : 'south',
                    collapseMode : 'mini',split : true,
                    activeTab: 1, tabPosition:"bottom",resizeTabs : true,     
                    header:false,enableTabScroll : true,tabWidth:'auto', margins : '0 3 3 0',
                    defaults : {
                        autoScroll : true
                    },
                    listeners:{
                        beforetabchange:function(tabs,newtab,currentTab){  
                            if (tabs.tabFix==newtab){            
                                if (Km.Company.View.Running.companyGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择企业信息！');
                                    return false;
                                } 
                                Km.Company.Config.View.IsShow=1;
                                Km.Company.View.Running.companyGrid.showCompany();   
                                Km.Company.View.Running.companyGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Company.View.CompanyView.Tabs.superclass.constructor.call(this, config); 
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Company.Config.View.Direction==1)||(Km.Company.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabCompanyDetail',iconCls:'tabs',
                     tpl: [
                      '<table class="viewdoblock">', 
                         '<tr class="entry"><td class="head">会员名 :</td><td class="content">{username}</td></tr>',
                         '<tr class="entry"><td class="head">公司名称 :</td><td class="content">{com_name}</td></tr>',
                         '<tr class="entry"><td class="head">公司性质 :</td><td class="content">{com_kindShow}</td></tr>',
                         '<tr class="entry"><td class="head">公司地址 :</td><td class="content">{com_address}</td></tr>',
                         '<tr class="entry"><td class="head">邮编 :</td><td class="content">{com_mcode}</td></tr>',
                         '<tr class="entry"><td class="head">员工数量 :</td><td class="content">{com_membernum}</td></tr>',
                         '<tr class="entry"><td class="head">联系人 :</td><td class="content">{com_contractorShow}</td></tr>',
                         '<tr class="entry"><td class="head">职务 :</td><td class="content">{com_positionShow}</td></tr>',
                         '<tr class="entry"><td class="head">联系电话 :</td><td class="content">{com_tel}</td></tr>',
                         '<tr class="entry"><td class="head">传真 :</td><td class="content">{com_fax}</td></tr>',
                         '<tr class="entry"><td class="head">福利 :</td><td class="content">{com_welfare}</td></tr>',                      
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
         * 窗口:显示企业信息信息
         */
        Window:Ext.extend(Ext.Window,{ 
            constructor : function(config) { 
                config = Ext.apply({
                    title:"查看企业信息",constrainHeader:true,maximizable: true,minimizable : true, 
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Company.View.CompanyView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: { 
                        minimize:function(w){
                            w.hide();
                            Km.Company.Config.View.IsShow=0;
                            Km.Company.View.Running.companyGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Company.View.Running.companyGrid.tvpView.toggle(false);
                        }   
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Company.View.Running.companyGrid.addCompany();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Company.View.Running.companyGrid.updateCompany();}
                    }]
                }, config);  
                Km.Company.View.CompanyView.Window.superclass.constructor.call(this, config);   
            }        
        })
    },
    /**
     * 窗口：批量上传企业信息
     */        
    UploadWindow:Ext.extend(Ext.Window,{ 
        constructor : function(config) { 
            config = Ext.apply({     
                title : '批量企业信息上传',
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
                            emptyText: '请上传企业信息Excel文件',buttonText: '',
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
                            validationExpression   =/\w+(.xlsx|.XLSX|.xls|.XLS)$/;
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
                                    url : 'index.php?go=admin.upload.uploadCompany',
                                    success : function(form, action) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Company.View.Running.companyGrid.doSelectCompany();
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
            Km.Company.View.UploadWindow.superclass.constructor.call(this, config);     
        }        
    }),
    /**
     * 视图：企业信息列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件  
                 */
                filter:null,
                region : 'center',
                store : Km.Company.Store.companyStore,
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
                        {header : '会员名',dataIndex : 'username'},
                        {header : '公司名称',dataIndex : 'com_name'},
                        {header : '公司性质',dataIndex : 'com_kindShow'},
                        {header : '公司地址',dataIndex : 'com_address'},
                        {header : '邮编',dataIndex : 'com_mcode'},
                        {header : '员工数量',dataIndex : 'com_membernum'},
                        {header : '联系人',dataIndex : 'com_contractorShow'},
                        {header : '职务',dataIndex : 'com_positionShow'},
                        {header : '联系电话',dataIndex : 'com_tel'},
                        {header : '传真',dataIndex : 'com_fax'},
                        {header : '福利',dataIndex : 'com_welfare'}                                 
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
                            width : 100,
                            defaults : {
                               xtype : 'textfield'
                            },
                            items : [
                                '公司名称　',{ref: '../ccom_name'},'&nbsp;&nbsp;',                                
                                {
                                    xtype : 'button',text : '查询',scope: this, 
                                    handler : function() {
                                        this.doSelectCompany();
                                    }
                                }, 
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.ccom_name.setValue("");                                        
                                        this.filter={};
                                        this.doSelectCompany();
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
                                    text : '添加企业信息',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addCompany();
                                    }
                                },'-',{
                                    text : '修改企业信息',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
                                    handler : function() {
                                        this.updateCompany();
                                    }
                                },'-',{
                                    text : '删除企业信息', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,                                    
                                    handler : function() {
                                        this.deleteCompany();
                                    }
                                },'-',{
                                    text : '导入',iconCls : 'icon-import', 
                                    handler : function() {
                                        this.importCompany();
                                    }
                                },'-',{
                                    text : '导出',iconCls : 'icon-export', 
                                    handler : function() { 
                                        this.exportCompany();
                                    }
                                },'-',{ 
                                    xtype:'tbsplit',text: '查看企业信息', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,  
                                    handler:function(){this.showCompany()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}}, 
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}}, 
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideCompany();Km.Company.Config.View.IsShow=0;}},'-', 
                                            {text:'固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Company.Cookie.set('View.IsFix',Km.Company.Config.View.IsFix);}} 
                                        ]}
                                },'-']}
                    )]
                },                
                bbar: new Ext.PagingToolbar({          
                    pageSize: Km.Company.Config.PageSize,
                    store: Km.Company.Store.companyStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Company.Config.PageSize,minValue:1,width:35, 
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Company.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Company.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectCompany();
                                }, 
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Company.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Company.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectCompany();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示企业信息列表
            this.doSelectCompany();
            Km.Company.View.Grid.superclass.constructor.call(this, config); 
            //创建在Grid里显示的企业信息信息Tab页
            Km.Company.View.Running.viewTabs=new Km.Company.View.CompanyView.Tabs();
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
                    this.grid.updateViewCompany();                     
                    if (sm.getCount() != 1){
                        this.grid.hideCompany();
                        Km.Company.Config.View.IsShow=0;
                    }else{
                        if (Km.Company.View.IsSelectView==1){
                            Km.Company.View.IsSelectView=0;  
                            this.grid.showCompany();   
                        }     
                    }    
                },
                rowdeselect: function(sm, rowIndex, record) {  
                    if (sm.getCount() != 1){
                        if (Km.Company.Config.View.IsShow==1){
                            Km.Company.View.IsSelectView=1;    
                        }             
                        this.grid.hideCompany();
                        Km.Company.Config.View.IsShow=0;
                    }    
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){  
            if (!Km.Company.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showCompany();
                this.tvpView.toggle(true);
            }else{
                this.hideCompany();
                Km.Company.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){ 
            if (checked){             
               Km.Company.Config.View.IsFix=1; 
            }else{ 
               Km.Company.Config.View.IsFix=0;   
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Company.Config.View.IsShow=0;
                return ;
            }
            if (Km.Company.Config.View.IsShow==1){
               this.hideCompany(); 
               Km.Company.Config.View.IsShow=0;
            }
            this.showCompany();   
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
         * 查询符合条件的企业信息
         */
        doSelectCompany : function() {
            if (this.topToolbar){
                var ccom_name = this.topToolbar.ccom_name.getValue();
                this.filter       ={'com_name':ccom_name};
            }
            var condition = {'start':0,'limit':Km.Company.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceCompany.queryPageCompany(condition,function(provider, response) {   
                if (response.result.data) {   
                    var result           = new Array();
                    result['data']       =response.result.data; 
                    result['totalCount'] =response.result.totalCount;
                    Km.Company.Store.companyStore.loadData(result); 
                } else {
                    Km.Company.Store.companyStore.removeAll();                        
                    Ext.Msg.alert('提示', '无符合条件的企业信息！');
                }
            });
        }, 
        /**
         * 显示企业信息视图
         * 显示企业信息的视图相对企业信息列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Company.Config.View.Direction=viewDirection; 
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Company.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Company.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Company.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Company.View.Running.viewTabs);
                    break;    
            }  
            Km.Company.Cookie.set('View.Direction',Km.Company.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Company.Config.View.IsFix==0)&&(Km.Company.Config.View.IsShow==1)){
                    this.showCompany();     
                }
                Km.Company.Config.View.IsFix=1;
                Km.Company.View.Running.companyGrid.tvpView.menu.mBind.setChecked(true,true);  
                Km.Company.Config.View.IsShow=0;
                this.showCompany();     
            }
        }, 
        /**
         * 显示企业信息
         */
        showCompany : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择企业信息！');
                Km.Company.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            } 
            if (Km.Company.Config.View.IsFix==0){
                if (Km.Company.View.Running.view_window==null){
                    Km.Company.View.Running.view_window=new Km.Company.View.CompanyView.Window();
                }
                if (Km.Company.View.Running.view_window.hidden){
                    Km.Company.View.Running.view_window.show();
                    Km.Company.View.Running.view_window.winTabs.hideTabStripItem(Km.Company.View.Running.view_window.winTabs.tabFix);   
                    this.updateViewCompany();
                    this.tvpView.toggle(true);
                    Km.Company.Config.View.IsShow=1;
                }else{
                    this.hideCompany();
                    Km.Company.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Company.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Company.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Company.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Company.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Company.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Company.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Company.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Company.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Company.View.Running.viewTabs);
                    }
                    break;    
            }  
            this.hideCompany();
            if (Km.Company.Config.View.IsShow==0){
                Km.Company.View.Running.viewTabs.enableCollapse();  
                switch(Km.Company.Config.View.Direction){
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
                this.updateViewCompany();
                this.tvpView.toggle(true);
                Km.Company.Config.View.IsShow=1;
            }else{
                Km.Company.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏企业信息
         */
        hideCompany : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();   
            this.ownerCt.east.hide(); 
            if (Km.Company.View.Running.view_window!=null){
                Km.Company.View.Running.view_window.hide();
            }            
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前企业信息显示信息
         */
        updateViewCompany : function() {
            if (Km.Company.View.Running.view_window!=null){
                Km.Company.View.Running.view_window.winTabs.tabCompanyDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Company.View.Running.viewTabs.tabCompanyDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建企业信息
         */
        addCompany : function() {  
            if (Km.Company.View.Running.edit_window==null){   
                Km.Company.View.Running.edit_window=new Km.Company.View.EditWindow();   
            }     
            Km.Company.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Company.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Company.View.Running.edit_window.setTitle('添加企业信息');
            Km.Company.View.Running.edit_window.savetype=0;
            Km.Company.View.Running.edit_window.company_id.setValue("");
            
            Km.Company.View.Running.edit_window.show();   
            Km.Company.View.Running.edit_window.maximize();               
        },   
        /**
         * 编辑企业信息时先获得选中的企业信息信息
         */
        updateCompany : function() {
            if (Km.Company.View.Running.edit_window==null){   
                Km.Company.View.Running.edit_window=new Km.Company.View.EditWindow();   
            }            
            Km.Company.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Company.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Company.View.Running.edit_window.setTitle('修改企业信息');
            Km.Company.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Company.View.Running.edit_window.savetype=1;
            
            Km.Company.View.Running.edit_window.show();    
            Km.Company.View.Running.edit_window.maximize();                  
        },        
        /**
         * 删除企业信息
         */
        deleteCompany : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的企业信息吗?', this.confirmDeleteCompany,this);
        }, 
        /**
         * 确认删除企业信息
         */
        confirmDeleteCompany : function(btn) {
            if (btn == 'yes') {  
                var del_company_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_company_ids=del_company_ids+selectedRows[flag].data.company_id+",";
                }
                ExtServiceCompany.deleteByIds(del_company_ids);
                this.doSelectCompany();
                Ext.Msg.alert("提示", "删除成功！");        
            }
        },
        /**
         * 导出企业信息
         */
        exportCompany : function() {            
            ExtServiceCompany.exportCompany(this.filter,function(provider, response) {  
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });                        
        },
        /**
         * 导入企业信息
         */
        importCompany : function() { 
            if (Km.Company.View.current_uploadWindow==null){   
                Km.Company.View.current_uploadWindow=new Km.Company.View.UploadWindow();   
            }     
            Km.Company.View.current_uploadWindow.show();
        }                
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Company.View.Running.companyGrid=new Km.Company.View.Grid();           
            if (Km.Company.Config.View.IsFix==0){
                Km.Company.View.Running.companyGrid.tvpView.menu.mBind.setChecked(false,true);  
            }
            config = Ext.apply({ 
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Company.View.Running.companyGrid, 
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Company.View.Running.viewTabs]}, 
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}, 
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true} 
                    ]
                }
            }, config);   
            Km.Company.View.Panel.superclass.constructor.call(this, config);  
        }        
    }),
    /**
     * 当前运行的可视化对象
     */ 
    Running:{         
        /**
         * 当前企业信息Grid对象
         */
        companyGrid:null,  
        /**
         * 显示企业信息信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Company.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);     
    Km.Company.Init();
    /**
     * 企业信息数据模型获取数据Direct调用
     */        
    Km.Company.Store.companyStore.proxy=new Ext.data.DirectProxy({ 
        api: {read:ExtServiceCompany.queryPageCompany}
    });   
    /**
     * 企业信息页面布局
     */
    Km.Company.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Company.View.Panel()]
    });
    Km.Company.Viewport.doLayout();    
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});    