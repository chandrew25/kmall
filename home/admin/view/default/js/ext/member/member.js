Ext.namespace("Kmall.Admin.Member");
Km = Kmall.Admin.Member;
Km.Member={
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
             * 显示会员的视图相对会员列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示会员信息页(或者打开新窗口)
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
        if (Km.Member.Cookie.get('View.Direction')){
            Km.Member.Config.View.Direction=Km.Member.Cookie.get('View.Direction');
        }
        if (Km.Member.Cookie.get('View.IsFix')!=null){
            Km.Member.Config.View.IsFix=Km.Member.Cookie.get('View.IsFix');
        }
    }
};
/**
 * Model:数据模型
 */
Km.Member.Store = {
    /**
     * 会员
     */
    memberStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'member_id',type: 'string'},
                {name: 'username',type: 'string'},
                {name: 'password',type: 'string'},
                {name: 'realname',type: 'string'},
                {name: 'mobile',type: 'string'},
                {name: 'address',type: 'string'},
                {name: 'cardno',type: 'string'},
                {name: 'email',type: 'string'},
                {name: 'usertype',type: 'string'},
                {name: 'usertypeShow',type: 'string'},
                {name: 'sex',type: 'string'},
                {name: 'sexShow',type: 'string'},
                {name: 'birthday',type: 'string'},
                {name: 'idCard',type: 'string'},
                {name: 'isCanEmail',type: 'string'},
                {name: 'isCanSms',type: 'string'},
                {name: 'isValSms',type: 'string'},
                {name: 'isValEmail',type: 'string'},
                {name: 'isValCard',type: 'string'},
                {name: 'isActive',type: 'string'},
                {name: 'jifen',type: 'int'},
                {name: 'rankjifen',type: 'int'},
                {name: 'rankshow',type: 'string'},
                {name: 'regip',type: 'string'},
                {name: 'sourceCompany',type: 'string'},
                {name: 'sourceDept',type: 'string'},
                {name: 'agent',type: 'string'},
                {name: 'sum_total_amount',type: 'string'},
                {name: 'sum_jifen',type: 'string'},
                {name: 'regtime',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    Ext.apply(options.params, Km.Member.View.Running.memberGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 会员收货人地址信息
     */
    addressStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'address_id',type: 'string'},
                {name: 'username',type: 'string'},
                {name: 'consignee',type: 'string'},
                {name: 'email',type: 'string'},
                {name: 'country',type: 'string'},
                {name: 'country_name',type: 'string'},
                {name: 'province',type: 'string'},
                {name: 'province_name',type: 'string'},
                {name: 'city',type: 'string'},
                {name: 'city_name',type: 'string'},
                {name: 'district',type: 'string'},
                {name: 'district_name',type: 'string'},
                {name: 'address',type: 'string'},
                {name: 'zipcode',type: 'string'},
                {name: 'tel',type: 'string'},
                {name: 'mobile',type: 'string'},
                {name: 'sign_building',type: 'string'},
                {name: 'best_time',type: 'string'},
                {name: 'area',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Member.Config.PageSize;
                    Ext.apply(options.params, Km.Member.View.Running.addressGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
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
                    if (!options.params.limit)options.params.limit=Km.Member.Config.PageSize;
                    Ext.apply(options.params, Km.Member.View.Running.companyGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 订单
     */
    orderStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'order_id',type: 'int'},
                {name: 'order_no',type: 'string'},
                {name: 'username',type: 'string'},
                {name: 'member_no',type: 'string'},
                {name: 'order_type',type: 'string'},
                {name: 'order_typeShow',type: 'string'},
                {name: 'status',type: 'string'},
                {name: 'statusShow',type: 'string'},
                {name: 'pay_status',type: 'string'},
                {name: 'pay_statusShow',type: 'string'},
                {name: 'ship_status',type: 'string'},
                {name: 'ship_statusShow',type: 'string'},
                {name: 'total_amount',type: 'float'},
                {name: 'final_amount',type: 'float'},
                {name: 'cost_item',type: 'float'},
                {name: 'cost_other',type: 'float'},
                {name: 'jifen',type: 'float'},
                {name: 'pmt_amount',type: 'float'},
                {name: 'pay_type',type: 'string'},
                {name: 'pay_typeShow',type: 'string'},
                {name: 'country',type: 'int'},
                {name: 'province',type: 'int'},
                {name: 'city',type: 'int'},
                {name: 'district',type: 'int'},
                {name: 'ship_addr',type: 'string'},
                {name: 'ship_name',type: 'string'},
                {name: 'ship_tel',type: 'string'},
                {name: 'ship_mobile',type: 'string'},
                {name: 'ship_time',type: 'date',dateFormat:'Y-m-d H:i:s'},
                {name: 'ship_type',type: 'string'},
                {name: 'name_ship_type',type: 'string'},
                {name: 'ship_sign_building',type: 'string'},
                {name: 'best_path',type: 'string'},
                {name: 'ship_zipcode',type: 'string'},
                {name: 'intro',type: 'string'},
                {name: 'ordertime',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Member.Config.PageSize;
                    Ext.apply(options.params, Km.Member.View.Running.orderGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 会员积分日志
     */
    jifenlogStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'jifenlog_id',type: 'int'},
                {name: 'member_id',type: 'int'},
                {name: 'jifenoriginal',type: 'int'},
                {name: 'jifenraise',type: 'int'},
                {name: 'jifenreduce',type: 'int'},
                {name: 'discribe',type: 'string'},
                {name: 'discribe_enum',type: 'int'},
                {name: 'commitTime',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Member.Config.PageSize;
                    Ext.apply(options.params, Km.Member.View.Running.jifenlogGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 会员等级积分日志
     */
    rankjifenlogStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'rankjifenlog_id',type: 'int'},
                {name: 'member_id',type: 'int'},
                {name: 'jifenoriginal',type: 'int'},
                {name: 'jifenraise',type: 'int'},
                {name: 'jifenreduce',type: 'int'},
                {name: 'discribe',type: 'string'},
                {name: 'discribe_enum',type: 'int'},
                {name: 'commitTime',type: 'date',dateFormat:'Y-m-d H:i:s'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Member.Config.PageSize;
                    Ext.apply(options.params, Km.Member.View.Running.rankjifenlogGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    })
};
/**
 * View:会员显示组件
 */
Km.Member.View={
    /**
     * 编辑窗口：新建或者修改会员
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
                width : 800,height : 450,minWidth : 650,minHeight : 450,
                layout : 'fit',plain : true,buttonAlign : 'center',
                defaults : {
                    autoScroll : true
                },
                listeners:{
                    beforehide:function(){
                        this.editForm.form.getEl().dom.reset();
                        this.editForm.form.findField('password').allowBlank=true;
                    }
                },
                items : [
                    new Ext.form.FormPanel({
                        ref:'editForm',layout:'form',
                        labelWidth : 120,labelAlign : "center",
                        bodyStyle : 'padding:5px 5px 0',align : "center",
                        api : {},
                        defaults : {
                            xtype : 'textfield',anchor:'100%'
                        },
                        items : [
                            {xtype: 'hidden',  name : 'member_id',ref:'../member_id'},
                            {
                                xtype: 'compositefield',
                                defaults : {
                                    xtype : 'textfield'
                                },
                                items: [
                                    {fieldLabel : '用户名称(<font color=red>*</font>)',name : 'username',allowBlank : false,flex:1},
                                    {xtype:'displayfield',value:'真实姓名:'},
                                    {name : 'realname',flex:1}
                                ]
                            },
                            {fieldLabel : '密码(<font color=red>*</font>)',name : 'password',inputType:'password',ref:'../password'},
                            {xtype: 'hidden',name : 'password_old',ref:'../password_old'},
                            {fieldLabel : '用户手机',name : 'mobile'},
                            {fieldLabel : '家庭地址',name : 'address'},
                            //{fieldLabel : '卡号',name : 'cardno'},
                            {fieldLabel : '用户Email',name : 'email'},
                            {fieldLabel : '生日',name : 'birthday',xtype : 'datefield',format : "Y-m-d"},
                            {fieldLabel : '身份证号',name : 'idCard'},
                            {fieldLabel : '券',name : 'jifen'},
                            {
                                xtype: 'compositefield',ref:'../emailvalidate',
                                defaults : {
                                    xtype : 'combo'
                                },
                                items: [
                                    {fieldLabel : '是否愿意接受邮件',hiddenName : 'isCanEmail',ref:'isCanEmail',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                        store : new Ext.data.SimpleStore({
                                                fields : ['value', 'text'],
                                                data : [['0', '否'], ['1', '是']]
                                        }),emptyText: '请选择是否愿意接受邮件',flex:1,
                                        valueField : 'value',// 值
                                        displayField : 'text'// 显示文本
                                    },{xtype:'displayfield',value:'邮箱验证:'},
                                    {hiddenName : 'isValEmail',xtype : 'combo',ref:'isValEmail',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                        store : new Ext.data.SimpleStore({
                                                fields : ['value', 'text'],
                                                data : [['0', '否'], ['1', '是']]
                                        }),emptyText: '请选择邮箱验证',flex:1,
                                        valueField : 'value',// 值
                                        displayField : 'text'// 显示文本
                                    }]
                            },
                            {
                                xtype: 'compositefield',ref:'../mobilevalidate',
                                defaults : {
                                    xtype : 'combo'
                                },
                                items: [

                                    {fieldLabel : '是否愿意接收短信',hiddenName : 'isCanSms',ref:'isCanSms',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                        store : new Ext.data.SimpleStore({
                                                fields : ['value', 'text'],
                                                data : [['0', '否'], ['1', '是']]
                                        }),emptyText: '请选择是否愿意接收短信',flex:1,
                                        valueField : 'value',// 值
                                        displayField : 'text'// 显示文本
                                    },{xtype:'displayfield',value:'手机验证:'},
                                    {hiddenName : 'isValSms',ref:'isValSms',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                        store : new Ext.data.SimpleStore({
                                                fields : ['value', 'text'],
                                                data : [['0', '否'], ['1', '是']]
                                        }),emptyText: '请选择手机验证',flex:1,
                                        valueField : 'value',// 值
                                        displayField : 'text'// 显示文本
                                    }]
                            },
                            {fieldLabel : '商户',name : 'sourceCompany'},
                            {fieldLabel : '门店',name : 'sourceDept'},
                            {fieldLabel : '代理商',name : 'agent'}
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
                            this.editForm.api.submit=ExtServiceMember.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    Km.Member.View.Running.memberGrid.store.reload();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', action.result.msg);
                                }
                            });
                        }else{
                            this.editForm.api.submit=ExtServiceMember.update;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "修改成功！");
                                    Km.Member.View.Running.memberGrid.store.reload();
                                    form.reset();
                                    editWindow.hide();
                                },
                                failure : function(form, action) {
                                    Ext.Msg.alert('提示', action.result.msg);
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
                        this.editForm.form.loadRecord(Km.Member.View.Running.memberGrid.getSelectionModel().getSelected());
                        this.editForm.form.findField('password').setValue('');
                    }
                }]
            }, config);
            Km.Member.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示会员详情
     */
    MemberView:{
        /**
         * Tab页：容器包含显示与会员所有相关的信息
         */
        Tabs:Ext.extend(Ext.TabPanel,{
            constructor : function(config) {
                config = Ext.apply({
                    region : 'south',
                    collapseMode : 'mini',split : true,
                    activeTab: 1, tabPosition:"bottom",resizeTabs : true,
                    header:false,enableTabScroll : true,tabWidth:'auto', margins : '0 3 3 0',
                    defaults : {
                        autoScroll : true,
                        layout:'fit'
                    },
                    listeners:{
                        beforetabchange:function(tabs,newtab,currentTab){
                            if (tabs.tabFix==newtab){
                                if (Km.Member.View.Running.memberGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择会员！');
                                    return false;
                                }
                                Km.Member.Config.View.IsShow=1;
                                Km.Member.View.Running.memberGrid.showMember();
                                Km.Member.View.Running.memberGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Member.View.MemberView.Tabs.superclass.constructor.call(this, config);
                Km.Member.View.Running.addressGrid=new Km.Member.View.AddressView.Grid();
                Km.Member.View.Running.companyGrid=new Km.Member.View.CompanyView.Grid();
                Km.Member.View.Running.orderGrid=new Km.Member.View.OrderView.Grid();
                // Km.Member.View.Running.jifenlogGrid=new Km.Member.View.JifenlogView.Grid();
                // Km.Member.View.Running.rankjifenlogGrid=new Km.Member.View.RankjifenlogView.Grid();
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Member.Config.View.Direction==1)||(Km.Member.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabMemberDetail',iconCls:'tabs',
                     tpl: [
                      '<table class="viewdoblock">',
                         '<tr class="entry"><td class="head">用户名称 :</td><td class="content">{username}</td></tr>',
                         '<tr class="entry"><td class="head">真实姓名 :</td><td class="content">{realname}</td></tr>',
                         '<tr class="entry"><td class="head">用户手机 :</td><td class="content">{mobile}</td></tr>',
                         '<tr class="entry"><td class="head">是否激活 :</td><td class="content"><tpl if="isActive == 1">是</tpl><tpl if="isActive == 0">否</tpl></td></tr>',
                         '<tr class="entry"><td class="head">家庭地址 :</td><td class="content">{address}</td></tr>',
                         //'<tr class="entry"><td class="head">卡号 :</td><td class="content">{cardno}</td></tr>',
                         '<tr class="entry"><td class="head">用户Email :</td><td class="content">{email}</td></tr>',
                         '<tr class="entry"><td class="head">用户类型 :</td><td class="content">{usertypeShow}</td></tr>',
                         '<tr class="entry"><td class="head">会员性别 :</td><td class="content">{sexShow}</td></tr>',
                         '<tr class="entry"><td class="head">生日 :</td><td class="content">{birthday}</td></tr>',
                         '<tr class="entry"><td class="head">身份证号 :</td><td class="content">{idCard}</td></tr>',
                         '<tr class="entry"><td class="head">券余额</td><td class="content">{jifen}</td></tr>',
                         '<tr class="entry"><td class="head">已用现金</td><td class="content">{sum_total_amount}</td></tr>',
                         '<tr class="entry"><td class="head">已用券</td><td class="content">{sum_jifen}</td></tr>',
                         // '<tr class="entry"><td class="head">等级券</td><td class="content">{rankjifen}</td></tr>',
                         // '<tr class="entry"><td class="head">等级名称</td><td class="content">{rankshow}</td></tr>',
                         '<tr class="entry"><td class="head">是否愿意接受邮件 :</td><td class="content"><tpl if="isCanEmail == true">是</tpl><tpl if="isCanEmail == false">否</tpl></td></tr>',
                         '<tr class="entry"><td class="head">是否愿意接收短信 :</td><td class="content"><tpl if="isCanSms == true">是</tpl><tpl if="isCanSms == false">否</tpl></td></tr>',
                         '<tr class="entry"><td class="head">手机验证 :</td><td class="content"><tpl if="isValSms == 1">是</tpl><tpl if="isValSms == 0">否</tpl></td></tr>',
                         '<tr class="entry"><td class="head">邮箱验证 :</td><td class="content"><tpl if="isValEmail == 1">是</tpl><tpl if="isValEmail == 0">否</tpl></td></tr>',
                         //'<tr class="entry"><td class="head">卡号激活 :</td><td class="content"><tpl if="isValCard == 1">是</tpl><tpl if="isValCard == 0">否</tpl></td></tr>',
                         '<tr class="entry"><td class="head">注册IP :</td><td class="content">{regip}</td></tr>',
                         '<tr class="entry"><td class="head">注册时间 :</td><td class="content">{regtime:date("Y-m-d")}</td></tr>',
                         '  <tr class="entry"><td class="head">商户</td><td class="content">{sourceCompany}</td></tr>',
                         '  <tr class="entry"><td class="head">门店</td><td class="content">{sourceDept}</td></tr>',,
                         '  <tr class="entry"><td class="head">代理商</td><td class="content">{agent}</td></tr>',
                     '</table>'
                     ]
                    }
                );
                this.add(
                    {title: '会员收货人地址信息',iconCls:'tabs',tabWidth:150,
                     items:[Km.Member.View.Running.addressGrid]
                    },
                    // {title: '企业信息',iconCls:'tabs',tabWidth:150,
                    //  items:[Km.Member.View.Running.companyGrid]
                    // },
                    {title: '订单',iconCls:'tabs',tabWidth:150,
                     items:[Km.Member.View.Running.orderGrid]
                    }//,
                    // {title: '消费券日志',iconCls:'tabs',tabWidth:150,
                    //  items:[Km.Member.View.Running.jifenlogGrid]
                    // },
                    // {title: '等级券日志',iconCls:'tabs',tabWidth:150,
                    //  items:[Km.Member.View.Running.rankjifenlogGrid]
                    // }
                );
            }
        }),
        /**
         * 窗口:显示会员信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看会员",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 700,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Member.View.MemberView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Member.Config.View.IsShow=0;
                            Km.Member.View.Running.memberGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Member.Config.View.IsShow=0;
                            Km.Member.View.Running.memberGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Member.View.Running.memberGrid.addMember();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Member.View.Running.memberGrid.updateMember();}
                    }]
                }, config);
                Km.Member.View.MemberView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 视图：会员收货人地址信息列表
     */
    AddressView:{
        /**
         *  当前创建的会员收货人地址信息编辑窗口
         */
        edit_window:null,
        /**
         * 编辑窗口：新建或者修改会员收货人地址信息
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
                        },
                        afterrender:function(){
                            /*
                            switch (Km.Member.Config.OnlineEditor)
                            {
                                case 2:
                                    Km.Member.View.AddressView.EditWindow.KindEditor_address = KindEditor.create('textarea[name="address"]',{width:'98%',minHeith:'350px', filterMode:true});
                                    break
                                case 3:
                                    pageInit_address();
                                    break
                                default:
                                    ckeditor_replace_address();
                            }
                            */
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
                                {xtype: 'hidden',  name : 'address_id',ref:'../address_id'},
                                {xtype: 'hidden',name : 'member_id',ref:'../member_id'},
                                {fieldLabel : '收货人姓名(<font color=red>*</font>)',name : 'consignee',allowBlank : false},
                                {fieldLabel : '邮件地址',name : 'email'},
                                {xtype: 'hidden',  name : 'country',ref:'../country'},
                                {xtype: 'hidden',  name : 'province',ref:'../province'},
                                {xtype: 'hidden',  name : 'city',ref:'../city'},
                                {xtype: 'hidden',  name : 'district',ref:'../district'},
                                {
                                    name:"district_name",xtype:'combotree', emptyText: '请选择地区',ref:'../district_name',
                                    fieldLabel: '配送区域',canFolderSelect:false,
                                    tree: new Ext.tree.TreePanel({
                                        root: {
                                            text: '全部地区',draggable: false,
                                            nodeType: 'async',id: '0'
                                        },
                                        preloadChildren:true,
                                        dataUrl: 'home/admin/src/httpdata/regionTree.php',border: false,rootVisible: false,
                                        listeners: {
                                            beforeload: function(n) {
                                                if (n) { this.getLoader().baseParams.id = n.attributes.id; }
                                            },
                                            load:function(n) {}
                                        }
                                    }),
                                    onSelect: function(cmb, node) {
                                        this.ownerCt.ownerCt.district_name.setValue(node.attributes.text);

                                        this.ownerCt.ownerCt.district.setValue(node.attributes.id);
                                        this.ownerCt.ownerCt.city.setValue(node.parentNode.attributes.id);
                                        this.ownerCt.ownerCt.province.setValue(node.parentNode.parentNode.attributes.id);
                                        this.ownerCt.ownerCt.country.setValue(node.parentNode.parentNode.parentNode.attributes.id);
                                    }
                                },
                                {fieldLabel : '详细地址(<font color=red>*</font>)',name : 'address'},
                                {fieldLabel : '邮政编码',name : 'zipcode'},
                                {fieldLabel : '电话',name : 'tel'},
                                {fieldLabel : '手机',name : 'mobile'},
                                {fieldLabel : '标志建筑',name : 'sign_building'}
                            ]
                        })
                    ],
                    buttons : [{
                        text: "",ref : "../saveBtn",scope:this,
                        handler : function() {
                            /*
                            switch (Km.Member.Config.OnlineEditor)
                            {
                                case 2:
                                    if (Km.Member.View.AddressView.EditWindow.KindEditor_address)this.editForm.address.setValue(Km.Member.View.AddressView.EditWindow.KindEditor_address.html());
                                    break
                                case 3:
                                    if (xhEditor_address)this.editForm.address.setValue(xhEditor_address.getSource());
                                    break
                                default:
                                    if (CKEDITOR.instances.address) this.editForm.address.setValue(CKEDITOR.instances.address.getData());
                            }
                            */
                            if (!this.editForm.getForm().isValid()) {
                                return;
                            }
                            editWindow=this;
                            if (this.savetype==0){
                                this.editForm.api.submit=ExtServiceAddress.save;
                                this.editForm.getForm().submit({
                                    success : function(form, action) {
                                        Ext.Msg.alert("提示", "保存成功！");
                                        Km.Member.View.Running.addressGrid.doSelectAddress();
                                        form.reset();
                                        editWindow.hide();
                                    },
                                    failure : function(form, action) {
                                        Ext.Msg.alert('提示', '失败');
                                    }
                                });
                            }else{
                                this.editForm.api.submit=ExtServiceAddress.update;
                                this.editForm.getForm().submit({
                                    success : function(form, action) {
                                        Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                            Km.Member.View.Running.addressGrid.bottomToolbar.doRefresh();
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
                            this.editForm.form.loadRecord(Km.Member.View.Running.addressGrid.getSelectionModel().getSelected());
                            /*
                            switch (Km.Member.Config.OnlineEditor)
                            {
                                case 2:
                                    if (Km.Member.View.AddressView.EditWindow.KindEditor_address) Km.Member.View.AddressView.EditWindow.KindEditor_address.html(Km.Member.View.Running.addressGrid.getSelectionModel().getSelected().data.address);
                                    break
                                case 3:
                                    break
                                default:
                                    if (CKEDITOR.instances.address) CKEDITOR.instances.address.setData(Km.Member.View.Running.addressGrid.getSelectionModel().getSelected().data.address);
                            }
                            */
                        }
                    }]
                }, config);
                Km.Member.View.AddressView.EditWindow.superclass.constructor.call(this, config);
            }
        }),
        /**
         * 查询条件
         */
        filter:null,
        /**
         * 视图：会员收货人地址信息列表
         */
        Grid:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Member.Store.addressStore,sm : this.sm,
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {autoScroll : true},
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                            width:120,sortable : true
                        },
                        columns : [
                            this.sm,
                            {header : '标识',dataIndex : 'address_id',hidden:true},
                            {header : '收货人姓名',dataIndex : 'consignee'},
                            {header : '邮件地址',dataIndex : 'email'},
                            {header:"配送区域",dataIndex:"area"},
                            /*
                            {header : '国家',dataIndex : 'country_name'},
                            {header : '省',dataIndex : 'province_name'},
                            {header : '市',dataIndex : 'city_name'},
                            {header : '区',dataIndex : 'district_name'},
                            */
                            {header : '详细地址',dataIndex : 'address'},
                            {header : '邮政编码',dataIndex : 'zipcode'},
                            {header : '电话',dataIndex : 'tel'},
                            {header : '手机',dataIndex : 'mobile'},
                            {header : '标志建筑',dataIndex : 'sign_building'}
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
                                        text : '添加会员收货人地址信息',iconCls : 'icon-add',ref: '../../btnSave',
                                        handler : function() {
                                            this.addAddress();
                                        }
                                    },'-',{
                                        text : '修改会员收货人地址信息',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                        handler : function() {
                                            this.updateAddress();
                                        }
                                    },'-',{
                                        text : '删除会员收货人地址信息', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                        handler : function() {
                                            this.deleteAddress();
                                        }
                                    },'-']}
                        )]
                    },
                    bbar: new Ext.PagingToolbar({
                        pageSize: Km.Member.Config.PageSize,
                        store: Km.Member.Store.addressStore,scope:this,autoShow:true,displayInfo: true,
                        displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',emptyMsg: "无显示数据",
                        items: [
                            {xtype:'label', text: '每页显示'},
                            {xtype:'numberfield', value:Km.Member.Config.PageSize,minValue:1,width:35,style:'text-align:center',allowBlank: false,
                                listeners:
                                {
                                    change:function(Field, newValue, oldValue){
                                        var num = parseInt(newValue);
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Member.Config.PageSize;
                                            Field.setValue(num);
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Member.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectAddress();
                                    },
                                    specialKey :function(field,e){
                                        if (e.getKey() == Ext.EventObject.ENTER){
                                            var num = parseInt(field.getValue());
                                            if (isNaN(num) || !num || num<1)num = Km.Member.Config.PageSize;
                                            this.ownerCt.pageSize= num;
                                            Km.Member.Config.PageSize = num;
                                            this.ownerCt.ownerCt.doSelectAddress();
                                        }
                                    }
                                }
                            },{xtype:'label', text: '个'}
                        ]
                    })
                }, config);
                /**
                 * 会员收货人地址信息数据模型获取数据Direct调用
                 */
                Km.Member.Store.addressStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceAddress.queryPageAddress}
                });
                Km.Member.View.AddressView.Grid.superclass.constructor.call(this, config);
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
             * 查询符合条件的会员收货人地址信息
             */
            doSelectAddress : function() {
                if (Km.Member.View.Running.memberGrid&&Km.Member.View.Running.memberGrid.getSelectionModel().getSelected()){
                    var member_id = Km.Member.View.Running.memberGrid.getSelectionModel().getSelected().data.member_id;
                    var condition = {'member_id':member_id,'start':0,'limit':Km.Member.Config.PageSize};
                    this.filter       ={'member_id':member_id};
                    ExtServiceAddress.queryPageAddress(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                result['totalCount'] =response.result.totalCount;
                                Km.Member.Store.addressStore.loadData(result);
                            } else {
                                Km.Member.Store.addressStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的会员收货人地址信息！');
                            }
                            if (Km.Member.Store.addressStore.getTotalCount()>Km.Member.Config.PageSize){
                                 Km.Member.View.Running.addressGrid.bottomToolbar.show();
                            }else{
                                 Km.Member.View.Running.addressGrid.bottomToolbar.hide();
                            }
                            Km.Member.View.Running.memberGrid.ownerCt.doLayout();
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
             * 新建会员收货人地址信息
             */
            addAddress : function(){
                if (Km.Member.View.AddressView.edit_window==null){
                    Km.Member.View.AddressView.edit_window=new Km.Member.View.AddressView.EditWindow();
                }
                Km.Member.View.AddressView.edit_window.resetBtn.setVisible(false);
                Km.Member.View.AddressView.edit_window.saveBtn.setText('保 存');
                Km.Member.View.AddressView.edit_window.setTitle('添加会员收货人地址信息');
                Km.Member.View.AddressView.edit_window.savetype=0;
                Km.Member.View.AddressView.edit_window.address_id.setValue("");
                var company_id = Km.Member.View.Running.memberGrid.getSelectionModel().getSelected().data.member_id;
                Km.Member.View.AddressView.edit_window.member_id.setValue(company_id);
                /*
                switch (Km.Member.Config.OnlineEditor)
                {
                    case 2:
                        if (Km.Member.View.AddressView.EditWindow.KindEditor_address) Km.Member.View.AddressView.EditWindow.KindEditor_address.html("");
                        break
                    case 3:
                        break
                    default:
                        if (CKEDITOR.instances.address) CKEDITOR.instances.address.setData("");
                }
                */
                Km.Member.View.AddressView.edit_window.show();
                Km.Member.View.AddressView.edit_window.maximize();
            },
            /**
             * 编辑会员收货人地址信息时先获得选中的会员收货人地址信息信息
             */
            updateAddress : function() {
                if (Km.Member.View.AddressView.edit_window==null){
                    Km.Member.View.AddressView.edit_window=new Km.Member.View.AddressView.EditWindow();
                }
                Km.Member.View.AddressView.edit_window.saveBtn.setText('修 改');
                Km.Member.View.AddressView.edit_window.resetBtn.setVisible(true);
                Km.Member.View.AddressView.edit_window.setTitle('修改会员收货人地址信息');
                Km.Member.View.AddressView.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
                Km.Member.View.AddressView.edit_window.savetype=1;
                /*
                switch (Km.Member.Config.OnlineEditor)
                {
                    case 2:
                        if (Km.Member.View.AddressView.EditWindow.KindEditor_address) Km.Member.View.AddressView.EditWindow.KindEditor_address.html(this.getSelectionModel().getSelected().data.address);
                        break
                    case 3:
                        if (xhEditor_address)xhEditor_address.setSource(this.getSelectionModel().getSelected().data.address);
                        break
                    default:
                        if (CKEDITOR.instances.address) CKEDITOR.instances.address.setData(this.getSelectionModel().getSelected().data.address);
                }
                */
                Km.Member.View.AddressView.edit_window.show();
                Km.Member.View.AddressView.edit_window.maximize();
            },
            /**
             * 删除会员收货人地址信息
             */
            deleteAddress : function() {
                Ext.Msg.confirm('提示', '确实要删除所选的会员收货人地址信息吗?', this.confirmDeleteAddress,this);
            },
            /**
             * 确认删除会员收货人地址信息
             */
            confirmDeleteAddress : function(btn) {
                if (btn == 'yes') {
                    var del_address_ids ="";
                    var selectedRows    = this.getSelectionModel().getSelections();
                    for ( var flag = 0; flag < selectedRows.length; flag++) {
                        del_address_ids=del_address_ids+selectedRows[flag].data.address_id+",";
                    }
                    ExtServiceAddress.deleteByIds(del_address_ids);
                    this.doSelectAddress();
                    Ext.Msg.alert("提示", "删除成功！");
                }
            }
        })
    },
    /**
     * 视图：企业信息列表
     */
    CompanyView:{
        /**
         * 查询条件
         */
        filter:null,
        /**
         * 视图：企业信息列表
         */
        Grid:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Member.Store.companyStore,
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {autoScroll : true},
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                            width:120,sortable : true
                        },
                        columns : [
                            {header : '标识',dataIndex : 'company_id',hidden:true},
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
                    bbar: new Ext.PagingToolbar({
                        pageSize: Km.Member.Config.PageSize,
                        store: Km.Member.Store.companyStore,scope:this,autoShow:true,displayInfo: true,
                        displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',emptyMsg: "无显示数据",
                        items: [
                            {xtype:'label', text: '每页显示'},
                            {xtype:'numberfield', value:Km.Member.Config.PageSize,minValue:1,width:35,style:'text-align:center',allowBlank: false,
                                listeners:
                                {
                                    change:function(Field, newValue, oldValue){
                                        var num = parseInt(newValue);
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Member.Config.PageSize;
                                            Field.setValue(num);
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Member.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectCompany();
                                    },
                                    specialKey :function(field,e){
                                        if (e.getKey() == Ext.EventObject.ENTER){
                                            var num = parseInt(field.getValue());
                                            if (isNaN(num) || !num || num<1)num = Km.Member.Config.PageSize;
                                            this.ownerCt.pageSize= num;
                                            Km.Member.Config.PageSize = num;
                                            this.ownerCt.ownerCt.doSelectCompany();
                                        }
                                    }
                                }
                            },{xtype:'label', text: '个'}
                        ]
                    })
                }, config);
                /**
                 * 企业信息数据模型获取数据Direct调用
                 */
                Km.Member.Store.companyStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceCompany.queryPageCompany}
                });
                Km.Member.View.CompanyView.Grid.superclass.constructor.call(this, config);
            },
            /**
             * 查询符合条件的企业信息
             */
            doSelectCompany : function() {
                if (Km.Member.View.Running.memberGrid&&Km.Member.View.Running.memberGrid.getSelectionModel().getSelected()){
                    var member_id = Km.Member.View.Running.memberGrid.getSelectionModel().getSelected().data.member_id;
                    var condition = {'member_id':member_id,'start':0,'limit':Km.Member.Config.PageSize};
                    this.filter       ={'member_id':member_id};
                    ExtServiceCompany.queryPageCompany(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                result['totalCount'] =response.result.totalCount;
                                Km.Member.Store.companyStore.loadData(result);
                            } else {
                                Km.Member.Store.companyStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的企业信息！');
                            }
                            if (Km.Member.Store.companyStore.getTotalCount()>Km.Member.Config.PageSize){
                                 Km.Member.View.Running.companyGrid.bottomToolbar.show();
                            }else{
                                 Km.Member.View.Running.companyGrid.bottomToolbar.hide();
                            }
                            Km.Member.View.Running.memberGrid.ownerCt.doLayout();
                        }
                    });
                }
            }
        })
    },
    /**
     * 视图：订单列表
     */
    OrderView:{
        /**
         * 查询条件
         */
        filter:null,
        /**
         * 视图：订单列表
         */
        Grid:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    store : Km.Member.Store.orderStore,
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {autoScroll : true},
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                            width:120,sortable : true
                        },
                        columns : [
                            {header : '标识',dataIndex : 'order_id',hidden:true},
                            {header : '订单号',dataIndex : 'order_no'},
                            {header : '订单状态',dataIndex : 'statusShow'},
                            {header : '支付状态',dataIndex : 'pay_statusShow'},
                            {header : '物流状态',dataIndex : 'ship_statusShow'},
                            {header : '现金',dataIndex : 'total_amount'},
                            {header : '券余额',dataIndex : 'jifen'},
                            {header : '支付方式',dataIndex : 'pay_typeShow'},
                            // {header : '送货时间',dataIndex : 'ship_time',renderer:Ext.util.Format.dateRenderer('Y-m-d')},
                            {header : '配送方式',dataIndex : 'name_ship_type'},
                            {header : '订购时间',dataIndex : 'ordertime',renderer:Ext.util.Format.dateRenderer('Y-m-d')}
                        ]
                    }),
                    bbar: new Ext.PagingToolbar({
                        pageSize: Km.Member.Config.PageSize,
                        store: Km.Member.Store.orderStore,scope:this,autoShow:true,displayInfo: true,
                        displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',emptyMsg: "无显示数据",
                        items: [
                            {xtype:'label', text: '每页显示'},
                            {xtype:'numberfield', value:Km.Member.Config.PageSize,minValue:1,width:35,style:'text-align:center',allowBlank: false,
                                listeners:
                                {
                                    change:function(Field, newValue, oldValue){
                                        var num = parseInt(newValue);
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Member.Config.PageSize;
                                            Field.setValue(num);
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Member.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectOrder();
                                    },
                                    specialKey :function(field,e){
                                        if (e.getKey() == Ext.EventObject.ENTER){
                                            var num = parseInt(field.getValue());
                                            if (isNaN(num) || !num || num<1)num = Km.Member.Config.PageSize;
                                            this.ownerCt.pageSize= num;
                                            Km.Member.Config.PageSize = num;
                                            this.ownerCt.ownerCt.doSelectOrder();
                                        }
                                    }
                                }
                            },{xtype:'label', text: '个'}
                        ]
                    })
                }, config);
                /**
                 * 订单数据模型获取数据Direct调用
                 */
                Km.Member.Store.orderStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceOrder.queryPageOrder}
                });
                Km.Member.View.OrderView.Grid.superclass.constructor.call(this, config);
            },
            /**
             * 查询符合条件的订单
             */
            doSelectOrder : function() {
                if (Km.Member.View.Running.memberGrid&&Km.Member.View.Running.memberGrid.getSelectionModel().getSelected()){
                    var member_id = Km.Member.View.Running.memberGrid.getSelectionModel().getSelected().data.member_id;
                    var condition = {'member_id':member_id,'start':0,'limit':Km.Member.Config.PageSize};
                    this.filter       ={'member_id':member_id};
                    ExtServiceOrder.queryPageOrder(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                result['totalCount'] =response.result.totalCount;
                                Km.Member.Store.orderStore.loadData(result);
                            } else {
                                Km.Member.Store.orderStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的订单！');
                            }
                            if (Km.Member.Store.orderStore.getTotalCount()>Km.Member.Config.PageSize){
                                 Km.Member.View.Running.orderGrid.bottomToolbar.show();
                            }else{
                                 Km.Member.View.Running.orderGrid.bottomToolbar.hide();
                            }
                            Km.Member.View.Running.memberGrid.ownerCt.doLayout();
                        }
                    });
                }
            }
        })
    },
    /**
     * 视图：会员积分日志列表
     */
    JifenlogView:{
        /**
         * 查询条件
         */
        filter:null,
        /**
         * 视图：会员积分日志列表
         */
        Grid:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    /**
                     * 查询条件
                     */
                    filter:null,
                    region : 'center',
                    store : Km.Member.Store.jifenlogStore,
                    sm : this.sm,
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {
                        autoScroll : true
                    },
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                            width:100,sortable : true
                        },
                        columns : [
                            this.sm,
                            {header : '标识',dataIndex : 'jifenlog_id',hidden:true},
                            {header : '会员',dataIndex : 'member_id',hidden:true},
                            {header : '券原值',dataIndex : 'jifenoriginal'},
                            {header : '券增加值',dataIndex : 'jifenraise'},
                            {header : '券减少值',dataIndex : 'jifenreduce'},
                            {header : '券变动描述',dataIndex : 'discribe',width:200},
                            {header : '描述的枚举值',dataIndex: 'discribe_enum',hidden:true},
                            {header : '修改时间',dataIndex : 'commitTime',width:150,
                                renderer : function(value) {
                                    return value.dateFormat('Y-m-d H:i');
                                }
                            }
                        ]
                    }),
                    bbar: new Ext.PagingToolbar({
                        pageSize: Km.Member.Config.PageSize,
                        store: Km.Member.Store.jifenlogStore,
                        scope:this,autoShow:true,displayInfo: true,
                        displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                        emptyMsg: "无显示数据",
                        listeners:{
                            change:function(thisbar,pagedata){
                                if (Km.Member.Viewport){
                                    if (Km.Member.Config.View.IsShow==1){
                                        Km.Member.View.IsSelectView=1;
                                    }
                                    this.ownerCt.hideMember();
                                    Km.Member.Config.View.IsShow=0;
                                }
                            }
                        },
                        items: [
                            {xtype:'label', text: '每页显示'},
                            {xtype:'numberfield', value:Km.Member.Config.PageSize,minValue:1,width:35,
                                style:'text-align:center',allowBlank: false,
                                listeners:
                                {
                                    change:function(Field, newValue, oldValue){
                                        var num = parseInt(newValue);
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Member.Config.PageSize;
                                            Field.setValue(num);
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Member.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectJifenlog();
                                    },
                                    specialKey :function(field,e){
                                        if (e.getKey() == Ext.EventObject.ENTER){
                                            var num = parseInt(field.getValue());
                                            if (isNaN(num) || !num || num<1)
                                            {
                                                num = Km.Member.Config.PageSize;
                                            }
                                            this.ownerCt.pageSize= num;
                                            Km.Member.Config.PageSize = num;
                                            this.ownerCt.ownerCt.doSelectJifenlog();
                                        }
                                    }
                                }
                            },
                            {xtype:'label', text: '个'}
                        ]
                    })
                }, config);
                /**
                 * 会员积分日志数据模型获取数据Direct调用
                 */
                Km.Member.Store.jifenlogStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceJifenlog.queryPageJifenlog}
                });
                Km.Member.View.JifenlogView.Grid.superclass.constructor.call(this, config);
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
                    }
                }
            }),
            /**
             * 查询符合条件的会员日志
             */
            doSelectJifenlog : function() {
                if (Km.Member.View.Running.memberGrid&&Km.Member.View.Running.memberGrid.getSelectionModel().getSelected()){
                    var member_id = Km.Member.View.Running.memberGrid.getSelectionModel().getSelected().data.member_id;
                    var condition = {'member_id':member_id,'start':0,'limit':Km.Member.Config.PageSize};
                    this.filter       ={'member_id':member_id};
                    ExtServiceJifenlog.queryPageJifenlog(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                result['totalCount'] =response.result.totalCount;
                                Km.Member.Store.jifenlogStore.loadData(result);
                            } else {
                                Km.Member.Store.jifenlogStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的券日志！');
                            }
                            if (Km.Member.Store.jifenlogStore.getTotalCount()>Km.Member.Config.PageSize){
                                 Km.Member.View.Running.jifenlogGrid.bottomToolbar.show();
                            }else{
                                 Km.Member.View.Running.jifenlogGrid.bottomToolbar.hide();
                            }
                            Km.Member.View.Running.memberGrid.ownerCt.doLayout();
                        }
                    });
                }
            }
        })
    },
     /**
     * 显示会员等级积分日志详情
     */
    RankjifenlogView:{
        /**
         * 查询条件
         */
        filter:null,
         /**
         * 视图：会员等级积分日志列表
         */
        Grid:Ext.extend(Ext.grid.GridPanel, {
            constructor : function(config) {
                config = Ext.apply({
                    /**
                     * 查询条件
                     */
                    filter:null,
                    region : 'center',
                    store : Km.Member.Store.rankjifenlogStore,
                    sm : this.sm,
                    frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                    loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {
                        autoScroll : true
                    },
                    cm : new Ext.grid.ColumnModel({
                        defaults:{
                            width:100,sortable : true
                        },
                        columns : [
                            this.sm,
                            {header : '标识',dataIndex : 'rankjifenlog_id',hidden:true},
                            {header : '会员',dataIndex : 'member_id',hidden:true},
                            {header : '券原值',dataIndex : 'jifenoriginal'},
                            {header : '券增加值',dataIndex : 'jifenraise'},
                            {header : '券减少值',dataIndex : 'jifenreduce'},
                            {header : '券变动描述',dataIndex : 'discribe',width:200},
                            {header : '描述的枚举值',dataIndex: 'discribe_enum',hidden:true},
                            {header : '修改时间',dataIndex : 'commitTime',width:150,
                                renderer : function(value) {
                                    return value.dateFormat('Y-m-d H:i');
                                }
                            }
                        ]
                    }),
                    bbar: new Ext.PagingToolbar({
                        pageSize: Km.Member.Config.PageSize,
                        store: Km.Member.Store.rankjifenlogStore,
                        scope:this,autoShow:true,displayInfo: true,
                        displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                        emptyMsg: "无显示数据",
                        listeners:{
                            change:function(thisbar,pagedata){
                                if (Km.Member.Viewport){
                                    if (Km.Member.Config.View.IsShow==1){
                                        Km.Member.View.IsSelectView=1;
                                    }
                                    this.ownerCt.hideMember();
                                    Km.Member.Config.View.IsShow=0;
                                }
                            }
                        },
                        items: [
                            {xtype:'label', text: '每页显示'},
                            {xtype:'numberfield', value:Km.Member.Config.PageSize,minValue:1,width:35,
                                style:'text-align:center',allowBlank: false,
                                listeners:
                                {
                                    change:function(Field, newValue, oldValue){
                                        var num = parseInt(newValue);
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Member.Config.PageSize;
                                            Field.setValue(num);
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Member.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectRankjifenlog();
                                    },
                                    specialKey :function(field,e){
                                        if (e.getKey() == Ext.EventObject.ENTER){
                                            var num = parseInt(field.getValue());
                                            if (isNaN(num) || !num || num<1)
                                            {
                                                num = Km.Member.Config.PageSize;
                                            }
                                            this.ownerCt.pageSize= num;
                                            Km.Member.Config.PageSize = num;
                                            this.ownerCt.ownerCt.doSelectRankjifenlog();
                                        }
                                    }
                                }
                            },
                            {xtype:'label', text: '个'}
                        ]
                    })
                }, config);
                /**
                 * 会员等级积分日志数据模型获取数据Direct调用
                 */
                Km.Member.Store.rankjifenlogStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServiceRankjifenlog.queryPageRankjifenlog}
                });
                Km.Member.View.RankjifenlogView.Grid.superclass.constructor.call(this, config);
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
                    }
                }
            }),
            /**
             * 查询符合条件的会员日志
             */
             doSelectRankjifenlog : function() {
                if (Km.Member.View.Running.memberGrid&&Km.Member.View.Running.memberGrid.getSelectionModel().getSelected()){
                    var member_id = Km.Member.View.Running.memberGrid.getSelectionModel().getSelected().data.member_id;
                    var condition = {'member_id':member_id,'start':0,'limit':Km.Member.Config.PageSize};
                    this.filter       ={'member_id':member_id};
                    ExtServiceRankjifenlog.queryPageRankjifenlog(condition,function(provider, response) {
                        if (response.result){
                            if (response.result.data) {
                                var result           = new Array();
                                result['data']       =response.result.data;
                                result['totalCount'] =response.result.totalCount;
                                Km.Member.Store.rankjifenlogStore.loadData(result);
                            } else {
                                Km.Member.Store.rankjifenlogStore.removeAll();
                                Ext.Msg.alert('提示', '无符合条件的等级券日志！');
                            }
                            if (Km.Member.Store.rankjifenlogStore.getTotalCount()>Km.Member.Config.PageSize){
                                 Km.Member.View.Running.rankjifenlogGrid.bottomToolbar.show();
                            }else{
                                 Km.Member.View.Running.rankjifenlogGrid.bottomToolbar.hide();
                            }
                            Km.Member.View.Running.memberGrid.ownerCt.doLayout();
                        }
                    });
                }
            }
        })
    },
    /**
     * 窗口：批量上传会员
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量会员上传',
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
                            emptyText: '请上传会员Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadMember',
                                    success : function(form, action) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Member.View.Running.memberGrid.doSelectMember();
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
            Km.Member.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 窗口：会员积分管理
     */
    JifenWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 自定义类型:保存类型
                 * 0:保存窗口,1:修改窗口
                 */
                savetype:1,
                closeAction : "hide",
                constrainHeader:true,maximizable: true,collapsible: true,
                width : 400,height : 300,minWidth : 400,minHeight : 300,
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
                        labelWidth : 120,labelAlign : "center",
                        bodyStyle : 'padding:5px 5px 0',align : "center",
                        api : {},
                        defaults : {
                            xtype : 'textfield',anchor:'100%'
                        },
                        items : [
                            {xtype: 'hidden',name : 'member_id',ref:'../member_id'},
                            {fieldLabel : '消费券原值',name : 'jifen',ref: '../jifen'},
                            {fieldLabel : '消费券修改（<font color=red>增加请输入正整数,输入负数则为减少</font>）',name : 'jifenrevise',ref : "../jifenrevise"},
                            {fieldLabel : '等级券原值',name : 'rankjifen',ref: '../rankjifen'},
                            {fieldLabel : '等级券修改（<font color=red>增加请输入正整数,输入负数则为减少</font>）',name : 'rankjifenrevise',ref : "../rankjifenrevise"}
                        ]
                    })
                ],
                buttons : [{
                    text: "保 存",ref : "../saveBtn",scope:this,
                    handler : function() {
                        if (!this.editForm.getForm().isValid()) {
                            return;
                        }
                        editWindow=this;
                        this.editForm.api.submit=ExtServiceMember.updatejifen;
                        this.editForm.getForm().submit({
                            success : function(form, action) {
                                Ext.Msg.alert("提示", action.result.msg);
                                Km.Member.View.Running.memberGrid.store.reload();
                                form.reset();
                                editWindow.hide();
                            },
                            failure : function(form, action) {
                                Ext.Msg.alert('提示', action.result.msg);
                            }
                        });
                    }
                }, {
                    text : "取 消",scope:this,
                    handler : function() {
                        this.hide();
                    }
                }, {
                    text : "重 置",ref:'../resetBtn',scope:this,
                    handler : function() {
                        this.editForm.form.loadRecord(Km.Member.View.Running.memberGrid.getSelectionModel().getSelected());
                        this.jifenrevise.setValue("0");
                        this.rankjifenrevise.setValue("0");
                    }
                }]
            }, config);
            Km.Member.View.JifenWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：会员列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Member.Store.memberStore,
                sm : this.sm,
                viewConfig: {
                    getRowClass: function(record, index, rowParams)
                    {
                        if (record.data.isActive=='0'){
                            return "unActiveMember";
                        }
                       // return (Math.floor(index / 5.0) % 2 == 0) ? 'rowClass1' : 'rowClass2';
                    }
                },
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
                        {header : '用户名称',dataIndex : 'username'},
                        {header : '真实姓名',dataIndex : 'realname'},
                        {header : '用户手机',dataIndex : 'mobile'},
                        {header : '激活',dataIndex : 'isActive',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '会员性别',dataIndex : 'sexShow'},
                        // {header : '券余额',dataIndex : 'jifen'},
                        // {header : '消费券',dataIndex : 'jifen'},
                        // {header : '等级券',dataIndex : 'rankjifen'},
                        {header : '是否愿意接受邮件',dataIndex : 'isCanEmail',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '是否愿意接收短信',dataIndex : 'isCanSms',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '手机验证',dataIndex : 'isValSms',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '邮箱验证',dataIndex : 'isValEmail',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '券余额',dataIndex : 'jifen'},
                        {header : '已用现金',dataIndex : 'sum_total_amount'},
                        {header : '已用券',dataIndex : 'sum_jifen'},
                        {header : '商户',dataIndex : 'sourceCompany'},
                        {header : '门店',dataIndex : 'sourceDept'},
                        {header : '代理商',dataIndex : 'agent'}
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
                                '用户名称　',{ref: '../musername'},'&nbsp;&nbsp;',
                                '真实姓名　',{ref: '../mrealname'},'&nbsp;&nbsp;',
                                '用户手机　',{ref: '../mmobile'},'&nbsp;&nbsp;',
                                '会员性别　',{ref: '../msex',xtype : 'combo',mode : 'local',
                                    triggerAction : 'all',lazyRender : true,editable: false,
                                    store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['0', '女'],['1', '男'],['-1', '待确认']]
                                    }),
                                    valueField : 'value',// 值
                                    displayField : 'text'// 显示文本
                                },'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectMember();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.musername.setValue("");
                                        this.topToolbar.mrealname.setValue("");
                                        this.topToolbar.mmobile.setValue("");
                                        this.topToolbar.msex.setValue("");
                                        this.filter={};
                                        this.doSelectMember();
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
                                    text : '添加会员',iconCls : 'icon-add',ref: '../../btnSave',
                                    handler : function() {
                                        this.addMember();
                                    }
                                },'-',{
                                    text : '修改会员',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateMember();
                                    }
                                },'-',{
                                    text : '删除会员',ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteMember();
                                    }
                                },'-',{
                                    text : '激活会员',iconCls : 'icon-edit',ref: '../../btnActive',disabled : true,
                                    handler : function() {
                                        this.activeMember();
                                    }
                                },'-',{
                                    text : '导入',iconCls : 'icon-import',ref: '../../btnImport',
                                    handler : function() {
                                        this.importMember();
                                    }
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',ref: '../../btnExport',
                                    handler : function() {
                                        this.exportMember();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看会员', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showMember()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideMember();Km.Member.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Member.Cookie.set('View.IsFix',Km.Member.Config.View.IsFix);}}
                                        ]}
                                },
                                // '-',{
                                //     text : '修改券',ref: '../../btnEdit',iconCls : 'icon-edit',disabled : true,
                                //     handler : function() {
                                //         this.updateJifen();
                                //     }
                                // },
                                '-']}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Member.Config.PageSize,
                    store: Km.Member.Store.memberStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Member.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Member.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Member.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectMember();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Member.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Member.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectMember();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示会员列表
            this.doSelectMember();
            Km.Member.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的会员信息Tab页
            Km.Member.View.Running.viewTabs=new Km.Member.View.MemberView.Tabs();
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
                    this.grid.btnActive.setDisabled(sm.getCount() < 1);
                    if (this.grid.getSelectionModel().getSelected() && sm.getCount()==1 && this.grid.getSelectionModel().getSelected().data.isActive=='1'){
                        this.grid.btnActive.setDisabled(true);
                    }
                    // this.grid.btnEdit.setDisabled(sm.getCount() != 1);
                },
                rowselect: function(sm, rowIndex, record) {
                    this.grid.updateViewMember();
                    if (sm.getCount() != 1){
                        this.grid.hideMember();
                        Km.Member.Config.View.IsShow=0;
                    }else{
                        if (Km.Member.View.IsSelectView==1){
                            Km.Member.View.IsSelectView=0;
                            this.grid.showMember();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Member.Config.View.IsShow==1){
                            Km.Member.View.IsSelectView=1;
                        }
                        this.grid.hideMember();
                        Km.Member.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Member.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showMember();
                this.tvpView.toggle(true);
            }else{
                this.hideMember();
                Km.Member.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Member.Config.View.IsFix=1;
            }else{
               Km.Member.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Member.Config.View.IsShow=0;
                return ;
            }
            if (Km.Member.Config.View.IsShow==1){
               this.hideMember();
               Km.Member.Config.View.IsShow=0;
            }
            this.showMember();
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
         * 查询符合条件的会员
         */
        doSelectMember : function() {
            if (this.topToolbar){
                var musername = this.topToolbar.musername.getValue();
                var mrealname = this.topToolbar.mrealname.getValue();
                var mmobile = this.topToolbar.mmobile.getValue();
                var msex = this.topToolbar.msex.getValue();
                this.filter       ={'username':musername,'realname':mrealname,'mobile':mmobile,'sex':msex};
            }
            var condition = {'start':0,'limit':Km.Member.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceMember.queryPageMember(condition,function(provider, response) {
                if (response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Member.Store.memberStore.loadData(result);
                } else {
                    Km.Member.Store.memberStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的会员！');
                }
            });
        },
        /**
         * 显示会员视图
         * 显示会员的视图相对会员列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Member.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Member.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Member.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Member.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Member.View.Running.viewTabs);
                    break;
            }
            Km.Member.Cookie.set('View.Direction',Km.Member.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Member.Config.View.IsFix==0)&&(Km.Member.Config.View.IsShow==1)){
                    this.showMember();
                }
                Km.Member.Config.View.IsFix=1;
                Km.Member.View.Running.memberGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Member.Config.View.IsShow=0;
                this.showMember();
            }
        },
        /**
         * 显示会员
         */
        showMember : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择会员！');
                Km.Member.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Member.Config.View.IsFix==0){
                if (Km.Member.View.Running.view_window==null){
                    Km.Member.View.Running.view_window=new Km.Member.View.MemberView.Window();
                }
                if (Km.Member.View.Running.view_window.hidden){
                    Km.Member.View.Running.view_window.show();
                    Km.Member.View.Running.view_window.winTabs.hideTabStripItem(Km.Member.View.Running.view_window.winTabs.tabFix);
                    this.updateViewMember();
                    this.tvpView.toggle(true);
                    Km.Member.Config.View.IsShow=1;
                }else{
                    this.hideMember();
                    Km.Member.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Member.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Member.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Member.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Member.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Member.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Member.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Member.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Member.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Member.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideMember();
            if (Km.Member.Config.View.IsShow==0){
                Km.Member.View.Running.viewTabs.enableCollapse();
                switch(Km.Member.Config.View.Direction){
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
                this.updateViewMember();
                this.tvpView.toggle(true);
                Km.Member.Config.View.IsShow=1;
            }else{
                Km.Member.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏会员
         */
        hideMember : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Member.View.Running.view_window!=null){
                Km.Member.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前会员显示信息
         */
        updateViewMember : function() {
            Km.Member.View.Running.addressGrid.doSelectAddress();
            Km.Member.View.Running.companyGrid.doSelectCompany();
            Km.Member.View.Running.orderGrid.doSelectOrder();
            // Km.Member.View.Running.rankjifenlogGrid.doSelectRankjifenlog();
            // Km.Member.View.Running.jifenlogGrid.doSelectJifenlog();
            if (Km.Member.View.Running.view_window!=null){
                Km.Member.View.Running.view_window.winTabs.tabMemberDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Member.View.Running.viewTabs.tabMemberDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建会员
         */
        addMember : function() {
            if (Km.Member.View.Running.edit_window==null){
                Km.Member.View.Running.edit_window=new Km.Member.View.EditWindow();
            }
            Km.Member.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Member.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Member.View.Running.edit_window.setTitle('添加会员');
            Km.Member.View.Running.edit_window.savetype=0;
            Km.Member.View.Running.edit_window.member_id.setValue("");
            Km.Member.View.Running.edit_window.emailvalidate.isCanEmail.setValue("1");
            Km.Member.View.Running.edit_window.emailvalidate.isValEmail.setValue("0");
            Km.Member.View.Running.edit_window.mobilevalidate.isCanSms.setValue("1");
            Km.Member.View.Running.edit_window.mobilevalidate.isValSms.setValue("0");

            var passwordObj=Km.Member.View.Running.edit_window.password;
            passwordObj.allowBlank=false;
            if (passwordObj.getEl()) passwordObj.getEl().dom.parentNode.previousSibling.innerHTML ="密码(<font color=red>*</font>)";

            Km.Member.View.Running.edit_window.show();
            //Km.Member.View.Running.edit_window.maximize();
        },
        /**
         * 编辑会员时先获得选中的会员信息
         */
        updateMember : function() {
            if (Km.Member.View.Running.edit_window==null){
                Km.Member.View.Running.edit_window=new Km.Member.View.EditWindow();
            }
            Km.Member.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Member.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Member.View.Running.edit_window.setTitle('修改会员');
            Km.Member.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Member.View.Running.edit_window.savetype=1;

            Km.Member.View.Running.edit_window.show();

            var passwordObj=Km.Member.View.Running.edit_window.password;
            passwordObj.allowBlank=true;
            if (passwordObj.getEl())passwordObj.getEl().dom.parentNode.previousSibling.innerHTML ="密码";
            Km.Member.View.Running.edit_window.password_old.setValue(Km.Member.View.Running.edit_window.password.getValue());
            Km.Member.View.Running.edit_window.password.setValue("");

            //Km.Member.View.Running.edit_window.maximize();
        },
        activeMember:function(){
            Ext.Msg.confirm('提示', '确实要激活所选的会员吗?', this.confirmActiveMember,this);
        },
        confirmActiveMember: function(btn) {
            if (btn == 'yes') {
                var active_member_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    active_member_ids=active_member_ids+selectedRows[flag].data.member_id+",";
                }
                ExtServiceMember.activeByIds(active_member_ids);
                this.doSelectMember();
                Ext.Msg.alert("提示", "激活成功！");
            }
        },
        /**
         * 删除会员
         */
        deleteMember : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的会员吗?', this.confirmDeleteMember,this);
        },
        /**
         * 确认删除会员
         */
        confirmDeleteMember : function(btn) {
            if (btn == 'yes') {
                var del_member_ids ="";
                var selectedRows    = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_member_ids=del_member_ids+selectedRows[flag].data.member_id+",";
                }
                ExtServiceMember.deleteByIds(del_member_ids);
                this.doSelectMember();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出会员
         */
        exportMember : function() {
            ExtServiceMember.exportMember(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入会员
         */
        importMember : function() {
            if (Km.Member.View.current_uploadWindow==null){
                Km.Member.View.current_uploadWindow=new Km.Member.View.UploadWindow();
            }
            Km.Member.View.current_uploadWindow.show();
        },
        /**
         * 编辑积分时先获得选中的会员积分信息
         */
        updateJifen : function() {
            if (Km.Member.View.Running.jifenWindow==null){
                Km.Member.View.Running.jifenWindow=new Km.Member.View.JifenWindow();
            }
            Km.Member.View.Running.jifenWindow.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Member.View.Running.jifenWindow.jifenrevise.setValue("0");
            Km.Member.View.Running.jifenWindow.rankjifenrevise.setValue("0");
            Km.Member.View.Running.jifenWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Member.View.Running.memberGrid=new Km.Member.View.Grid();
            if (Km.Member.Config.View.IsFix==0){
                Km.Member.View.Running.memberGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Member.View.Running.memberGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Member.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Member.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前会员Grid对象
         */
        memberGrid:null,
        /**
         * 当前会员收货人地址信息Grid对象
         */
        addressGrid:null,
        /**
         * 当前企业信息Grid对象
         */
        companyGrid:null,
        /**
         * 当前订单Grid对象
         */
        orderGrid:null,
        /**
         * 当前积分日志Grid对象
         */
        // jifenlogGrid:null,
        /**
         * 当前等级积分日志Grid对象
         */
        // rankjifenlogGrid:null,
        /**
         * 显示会员信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Member.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Member.Init();
    /**
     * 会员数据模型获取数据Direct调用
     */
    Km.Member.Store.memberStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceMember.queryPageMember}
    });
    /**
     * 会员页面布局
     */
    Km.Member.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Member.View.Panel()]
    });
    Km.Member.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
