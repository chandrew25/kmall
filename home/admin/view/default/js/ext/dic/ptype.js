Ext.namespace("Kmall.Admin.Ptype");
Km = Kmall.Admin;
Km.Ptype={
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
             * 显示商品类型的视图相对商品类型列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示商品类型信息页(或者打开新窗口)
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
        if (Km.Ptype.Cookie.get('View.Direction')){
            Km.Ptype.Config.View.Direction=Km.Ptype.Cookie.get('View.Direction');
        }
        if (Km.Ptype.Cookie.get('View.IsFix')!=null){
            Km.Ptype.Config.View.IsFix=Km.Ptype.Cookie.get('View.IsFix');
        }
    }
};
/**
 * Model:数据模型
 */
Km.Ptype.Store = {
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
                {name: 'image',type: 'string'},
                {name: 'show_in_nav',type: 'string'},
                {name: 'countChild',type: 'string'},
                {name: 'level',type: 'string'},
                {name: 'parent_id',type: 'int'},
                {name: 'ptypeShowAll',type: 'string'},
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
                    if (!options.params.limit)options.params.limit=Km.Ptype.Config.PageSize;
                    Ext.apply(options.params, Km.Ptype.View.Running.ptypeGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
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
                {name: 'attribute_name',type: 'string'},
                {name: 'attributeShowAll',type: 'string'},
                {name: 'attribute1_id',type: 'int'},
                {name: 'ptype_name',type: 'string'},
                {name: 'ptypeShowAll',type: 'string'},
                {name: 'ptype1_id',type: 'int'},
                {name: 'ptype2_id',type: 'int'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Ptype.Config.PageSize;
                    Ext.apply(options.params, Km.Ptype.View.Running.ptypeattrGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 属性表
     */
    selectAttributeStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'attribute_id',type: 'int'},
                {name: 'attribute_name',type: 'string'},
                {name: 'level',type: 'string'},
                {name: 'parent_id',type: 'int'},
                {name: 'attributeShowAll',type: 'string'},
                {name: 'isShow',type: 'string'},
                {name: 'sort_order',type: 'int'},
                {name: 'isShowAttributeCheck',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    Ext.apply(options.params, Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.filter);//保证分页也将查询条件带上
                }
            },
            load : function(records,options){
                if (records&&records.data&&records.data.items) {
                    var result           = new Array();
                    result['data']       =records.data.items;
                    //把已经推荐的属性表选中
                    var sm=Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.sm;
                    var rows=Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.getView().getRows();
                    for(var i=0;i<rows.length;i++){
                        if(result['data'][i]['data'].isShowAttributeCheck){
                            //sm.selectRow(i, true);
                            rows[i].style.backgroundColor='#FFF6B1';
                        }
                    }
                    Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.parent_id=null;
          Km.Ptype.Store.selectPAttributeStore.removeAll();
                }
            }
        }
    }),
    selectPAttributeStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
                {name: 'attribute_id',type: 'int'},
                {name: 'attribute_name',type: 'string'},
                {name: 'level',type: 'string'},
                {name: 'parent_id',type: 'int'},
                {name: 'attributeShowAll',type: 'string'},
                {name: 'isShow',type: 'string'},
                {name: 'sort_order',type: 'int'},
                {name: 'isShowAttributeCheck',type: 'string'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    Ext.apply(options.params, Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.filter);//保证分页也将查询条件带上
                }
            },
            load : function(records,options){
                if (records&&records.data&&records.data.items) {
                    var result           = new Array();
                    result['data']       =records.data.items;
                    //把已经推荐的属性表选中
                    var sm=Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.sm;
                    var rows=Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.getView().getRows();
                    var updateData=[];//记录数据
                    for(var i=0;i<rows.length;i++){
                        if(result['data'][i]['data'].isShowAttributeCheck){
                            sm.selectRow(i, true);
                        }
                        updateData[i]={attribute_id:result['data'][i]['data'].attribute_id,isShowAttributeCheck:false};
                    }
                    Km.Ptype.View.Running.selectAttributeWindow.updateData=updateData;
                }
            }
        }
    }),
    /**
     *
     */
    ptypeStoreForCombo:new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/ptype.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'ptypes',
            autoLoad: true,
            totalProperty: 'totalCount',
            idProperty: 'ptype_id'
        }, [
            {name: 'ptype_id', mapping: 'ptype_id'},
            {name: 'ptype_name', mapping: 'name'}
        ])
    })
};
/**
 * View:商品类型显示组件
 */
Km.Ptype.View={
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
                        ref:'editForm',layout:'form',fileUpload: true,
                        labelWidth : 100,labelAlign : "center",
                        bodyStyle : 'padding:5px 5px 0',align : "center",
                        api : {},
                        defaults : {
                            xtype : 'textfield',anchor:'98%'
                        },
                        items : [
                            {xtype: 'hidden',name : 'ptype_id',ref:'../ptype_id'},
                            {name:"ptypeShowAll",xtype : 'displayfield',fieldLabel:'上级分类',ref: '../ptypeShow'},
                            {fieldLabel : '名称',name : 'name'},
                            {xtype: 'hidden',  name : 'ico',ref:'../ico'},
                            {fieldLabel : '缩略图',xtype:"imageUpload",name : 'icoUpload',ref:'../icoUpload',xtype:'fileuploadfield',
                           emptyText: '请上传缩略图文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {xtype: 'hidden',name : 'image',ref:'../image'},
                            {fieldLabel : '图片',name : 'imageUpload',ref:'../imageUpload',xtype:'fileuploadfield',
                           emptyText: '请上传一级分类展示图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                            {xtype: 'hidden',name : 'parent_id',ref:'../parent_id'},
                            {fieldLabel : '是否显示',hiddenName : 'isShow',ref:'../isShow',
                                 xtype : 'combo',mode : 'local',triggerAction : 'all',
                                 lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                                 store : new Ext.data.SimpleStore({
                                     fields : ['value', 'text'],
                                     data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否显示',
                                 valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '排序',name : 'sort_order',ref:'../sort_order',xtype : 'numberfield',value:'50'}
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
                                    Km.Ptype.View.Running.ptypeGrid.doSelectPtype();
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
                                    Km.Ptype.View.Running.ptypeGrid.store.reload();
                                    Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
                                        Km.Ptype.View.Running.ptypeGrid.bottomToolbar.doRefresh();
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
                        this.editForm.form.loadRecord(Km.Ptype.View.Running.ptypeGrid.getSelectionModel().getSelected());
                        this.icoUpload.setValue(this.ico.getValue());

                    }
                }]
            }, config);
            Km.Ptype.View.EditWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 显示商品类型详情
     */
    PtypeView:{
        /**
         * Tab页：容器包含显示与商品类型所有相关的信息
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
                                if (Km.Ptype.View.Running.ptypeGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择商品类型！');
                                    return false;
                                }
                                Km.Ptype.Config.View.IsShow=1;
                                Km.Ptype.View.Running.ptypeGrid.showPtype();
                                Km.Ptype.View.Running.ptypeGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Ptype.View.PtypeView.Tabs.superclass.constructor.call(this, config);
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Ptype.Config.View.Direction==1)||(Km.Ptype.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabPtypeDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
                         '    <tr class="entry"><td class="head">名称</td><td class="content">{name}</td></tr>',
                         '    <tr class="entry"><td class="head">缩略图路径</td><td class="content">{ico}</td></tr>',
                         '    <tr class="entry"><td class="head">缩略图</td><td class="content"><tpl if="ico"><a href="upload/images/{ico}" target="_blank"><img src="upload/images/{ico}" /></a></tpl></td></tr>',
                         '    <tr class="entry"><td class="head">一级分类展示图片路径</td><td class="content">{image}</td></tr>',
                         '    <tr class="entry"><td class="head">一级分类展示图片</td><td class="content"><tpl if="image"><a href="upload/images/{image}" target="_blank"><img src="upload/images/{image}" /></a></tpl></td></tr>',
                         '    <tr class="entry"><td class="head">目录层级</td><td class="content">{level}</td></tr>',
                         '    <tr class="entry"><td class="head">上级分类</td><td class="content">{ptypeShowAll}</td></tr>',
                         '    <tr class="entry"><td class="head">子数量</td><td class="content">{countChild}</td></tr>',
                         '    <tr class="entry"><td class="head">是否显示</td><td class="content"><tpl if="isShow == true">是</tpl><tpl if="isShow == false">否</tpl></td></tr>',
                         '    <tr class="entry"><td class="head">排序</td><td class="content">{sort_order}</td></tr>',
                         '</table>'
                     ]}
                );
            }
        }),
        /**
         * 窗口:显示商品类型信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看商品类型",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Ptype.View.PtypeView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Ptype.Config.View.IsShow=0;
                            Km.Ptype.View.Running.ptypeGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Ptype.Config.View.IsShow=0;
                            Km.Ptype.View.Running.ptypeGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增',scope:this,
                        handler : function() {this.hide();Km.Ptype.View.Running.ptypeGrid.addPtype();}
                    },{
                        text: '修改',scope:this,
                        handler : function() {this.hide();Km.Ptype.View.Running.ptypeGrid.updatePtype();}
                    }]
                }, config);
                Km.Ptype.View.PtypeView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 视图：属性表
     */
    AttributeView:{
        SelectAttributeWindow:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"选择类型",updateData:null,closeAction:"hide",constrainHeader:true,maximizable:true,collapsible:true,
                    width:500,minWidth:500,height:550,minHeight:550,layout:{type:"hbox",align:"stretch"},plain : true,buttonAlign : 'center',
                    defaults : {autoScroll : true},
                    listeners:{
                        hide:function(w){Km.Ptype.View.Running.ptypeGrid.tattribute.toggle(false);}
                    },
                    items : [
                      new Km.Ptype.View.AttributeView.AttributeGrid({ref:"attributeGrid",flex:3}),
                      new Km.Ptype.View.AttributeView.PAttributeGrid({ref:"pattributeGrid",flex:7})
                  ],
                    buttons : [ {
                        text: "确定",ref : "../saveBtn",scope:this,
                        handler : function() {
                            var condition={ptype_id:this.ptype_id,attributes:null};
                            var updateData=Km.Ptype.View.Running.selectAttributeWindow.updateData;
                            var selectedData=Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.getSelectionModel().getSelections();
                            for(var i=0;i<selectedData.length;i++){
                                for(var j=0;j<updateData.length;j++){
                                    if(updateData[j].attribute_id==selectedData[i].get("attribute_id")){
                                        updateData[j].isShowAttributeCheck=true;
                                    }
                                }
                            }
                            condition.attributes=updateData;
                            ExtServicePtype.updatePtypeAttribute(condition,function(provider, response) {
                                if(response.result.success==true) Ext.Msg.alert('提示','选择成功'); else Ext.Msg.alert('提示', '选择失败');
                                var sm=Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.sm;
                          var rows=Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.getView().getRows();
                                for (var i=0;i<rows.length;i++){
                  if (sm.isSelected(i)) {
                    break;
                  }
                }
                                Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.doSelectAttribute(i);
                            });
                        }
                    }, {
                        text : "取 消",scope:this,
                        handler : function() {
                            this.hide();
                        }
                    }]
                }, config);
                Km.Ptype.View.AttributeView.SelectAttributeWindow.superclass.constructor.call(this, config);
            }
        }),
        AttributeGrid:Ext.extend(Ext.grid.GridPanel,{
            constructor : function(config) {
                config = Ext.apply({
                    /**
                     * 查询条件
                     */
                    filter:{},ptype_id:null,region : 'center',store : Km.Ptype.Store.selectAttributeStore,sm : this.sm,
                    trackMouseOver : true,enableColumnMove : true,columnLines : true,loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {autoScroll : true},
                    cm : new Ext.grid.ColumnModel({
                        defaults:{width:120,sortable : true},
                        columns : [
                            {header : '类型',dataIndex : 'attribute_name'}
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
                                enableOverflow: true,width : 80,ref:'menus',
                                defaults : {
                                    xtype : 'textfield',
                                    listeners : {
                                       specialkey : function(field, e) {
                                            if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectAttribute();
                                        }
                                    }
                                },
                                items : [
                                    {text: '全部',ref:'../../isSelect',xtype:'tbsplit',iconCls : 'icon-view',enableToggle: false,
                                        menu: {
                                            items: [
                                                {text: '全部',checked: true,group: 'isSelect',ref:'../../all',
                                                    checkHandler: function(item, checked){
                                                        if (checked){
                                                            Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.isSelect.setText(item.text);
                                                            Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.filter.selectType=0;
                                                            Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.doSelectAttribute();
                                                        }
                                                    }
                                                },
                                                {text: '未选择',checked: false,group: 'isSelect',ref:'../../unselect',
                                                      checkHandler: function(item, checked){
                                                          if (checked){
                                                              Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.isSelect.setText(item.text);
                                                              Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.filter.selectType=2;
                                                              Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.doSelectAttribute();
                                                          }
                                                      }
                                                },
                                                {text: '已选择',checked: false,group: 'isSelect',ref:'../../select',
                                                      checkHandler: function(item, checked){
                                                          if (checked){
                                                              Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.isSelect.setText(item.text);
                                                              Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.filter.selectType=1;
                                                              Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.doSelectAttribute();
                                                          }
                                                    }
                                                }
                                             ]
                                        }
                                    }
                                ]
                            })
                        ]
                    }
                }, config);
                //初始化显示属性表列表
                Km.Ptype.Store.selectAttributeStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServicePtype.queryPagePtypeAttribute}
                });
                Km.Ptype.View.AttributeView.AttributeGrid.superclass.constructor.call(this, config);
            },
            sm : new Ext.grid.RowSelectionModel({
              singleSelect:true,
              listeners : {
          rowselect: function(sm, rowIndex, record) {
            if (sm.getCount() != 1){
              Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.parent_id=null;
              Km.Ptype.Store.selectPAttributeStore.removeAll();
            }else{
              var attribute_id=Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.getSelectionModel().getSelected().data.attribute_id;
              Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.parent_id=attribute_id;
              Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.filter={};
              Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.topToolbar.menus.all.setChecked(true);
              Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.doSelectAttribute();
            }
          },
          rowdeselect: function(sm, rowIndex, record) {
            if (sm.getCount() != 1){
              Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.parent_id=null;
              Km.Ptype.Store.selectPAttributeStore.removeAll();
            }
          }
        }
      }),
            doSelectAttribute : function(index){
                if (this.topToolbar){
                    var ptype_id=Km.Ptype.View.Running.selectAttributeWindow.ptype_id;
                    if (!this.filter.selectType)this.filter.selectType=0;
                    this.filter       ={'ptype_id':ptype_id,'selectType':this.filter.selectType};
                }
                var condition = {'start':0,'limit':Km.Ptype.Config.PageSize};
                this.filter.all=1;
                Ext.apply(condition,this.filter);
                ExtServicePtype.queryPagePtypeAttribute(condition,function(provider, response) {
                    if (response.result&&response.result.data) {
                        var result           = new Array();
                        result['data']       =response.result.data;
                        result['totalCount'] =response.result.totalCount;
                        Km.Ptype.Store.selectAttributeStore.loadData(result);
                        Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.sm.selectRow(index, true);
                    } else {
                        Km.Ptype.Store.selectAttributeStore.removeAll();
                        Ext.Msg.alert('提示', '无符合条件的类型！');
                    }
                });
            }
        }),
        PAttributeGrid:Ext.extend(Ext.grid.GridPanel,{
            constructor : function(config) {
                config = Ext.apply({
                    /**
                     * 查询条件
                     */
                    filter:{},ptype_id:null,region : 'center',store : Km.Ptype.Store.selectPAttributeStore,sm : this.sm,
                    trackMouseOver : true,enableColumnMove : true,columnLines : true,loadMask : true,stripeRows : true,headerAsText : false,
                    defaults : {autoScroll : true},parent_id:null,
                    cm : new Ext.grid.ColumnModel({
                        defaults:{width:120,sortable : true},
                        columns : [
                            this.sm,
                            {header : '类型',dataIndex : 'attribute_name'}
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
                                enableOverflow: true,width : 80,ref:'menus',
                                defaults : {
                                    xtype : 'textfield',
                                    listeners : {
                                       specialkey : function(field, e) {
                                            if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectAttribute();
                                        }
                                    }
                                },
                                items : [
                                    {text: '全部',ref:'../../isSelect',xtype:'tbsplit',iconCls : 'icon-view',enableToggle: false,
                                        menu: {
                                            items: [
                                                {text: '全部',checked: true,group: 'isPSelect',ref:'../../all',
                                                    checkHandler: function(item, checked){
                                                      if(checked){
                                                        Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.isSelect.setText(item.text);
                                                          Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.filter.selectType=0;
                                                          Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.doSelectAttribute();
                            }
                                                    }
                                                },
                                                {text: '未选择',checked: false,group: 'isPSelect',ref:'../../unselect',
                                                      checkHandler: function(item, checked){
                                                          if(checked){
                                                            Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.isSelect.setText(item.text);
                                                            Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.filter.selectType=2;
                                                            Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.doSelectAttribute();
                              }
                                                      }
                                                },
                                                {text: '已选择',checked: false,group: 'isPSelect',ref:'../../select',
                                                      checkHandler: function(item, checked){
                                                          if(checked){
                                                            Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.isSelect.setText(item.text);
                                                            Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.filter.selectType=1;
                                                            Km.Ptype.View.Running.selectAttributeWindow.pattributeGrid.doSelectAttribute();
                              }
                                                    }
                                                }
                                             ]
                                        }
                                    },
                                    '属性','&nbsp;',{ref: '../aattribute_name'},'&nbsp;',
                                    {
                                        xtype : 'button',text : '查询',scope: this,
                                        handler : function() {
                                            this.doSelectAttribute();
                                        }
                                    },
                                    {
                                        xtype : 'button',text : '重置',scope: this,
                                        handler : function() {
                                            this.topToolbar.aattribute_name.setValue("");
                                            this.filter={};
                                            this.doSelectAttribute();
                                        }
                                    }
                                ]
                            })
                        ]
                    },
                    bbar: new Ext.PagingToolbar({
                        pageSize: Km.Ptype.Config.PageSize,
                        store: Km.Ptype.Store.selectPAttributeStore,
                        scope:this,autoShow:true
                    })
                }, config);
                Km.Ptype.Store.selectPAttributeStore.proxy=new Ext.data.DirectProxy({
                    api: {read:ExtServicePtype.queryPagePtypeAttribute}
                });
                Km.Ptype.View.AttributeView.PAttributeGrid.superclass.constructor.call(this, config);
            },
            sm : new Ext.grid.CheckboxSelectionModel(),
            doSelectAttribute : function() {
              if(!this.parent_id)return;
                if (this.topToolbar){
                    var ptype_id=Km.Ptype.View.Running.selectAttributeWindow.ptype_id;
                    if (!this.filter.selectType)this.filter.selectType=0;
                    var aattribute_name = this.topToolbar.aattribute_name.getValue();
                    this.filter       ={'attribute_name':aattribute_name,'ptype_id':ptype_id,'selectType':this.filter.selectType};
                }
                var condition = {'start':0,'limit':Km.Ptype.Config.PageSize};
                this.filter.parent_id=this.parent_id;
                Ext.apply(condition,this.filter);
                ExtServicePtype.queryPagePtypeAttribute(condition,function(provider, response) {
                    if (response.result&&response.result.data) {
                        var result           = new Array();
                        result['data']       =response.result.data;
                        result['totalCount'] =response.result.totalCount;
                        Km.Ptype.Store.selectPAttributeStore.loadData(result);
                    } else {
                        Km.Ptype.Store.selectPAttributeStore.removeAll();
                        Ext.Msg.alert('提示', '无符合条件的类型！');
                    }
                });
            }
        })
    },
    /**
     * 窗口：批量上传商品类型
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传商品类型数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传商品类型Excel文件',buttonText: '',
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
                                    url : 'index.php?go=admin.upload.uploadPtype',
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Ptype.View.Running.ptypeGrid.doSelectPtype();
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
            Km.Ptype.View.UploadWindow.superclass.constructor.call(this, config);
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
                            var uploadImageUrl='index.php?go=admin.upload.uploadPtypeIcos';

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
                                        Km.Ptype.View.Running.ptypeGrid.doSelectPtype();
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
            Km.Ptype.View.BatchUploadImagesWindow.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 视图：商品类型列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Ptype.Store.ptypeStore,
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
                        {header : '标识',dataIndex : 'ptype_id',hidden:true},
                        {header : '名称',dataIndex : 'name'},
                        {header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
                        {header : '排序',dataIndex : 'sort_order'}
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
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectPtype();
                                    }
                                }
                            },
                            items : [
                                '名称 ','&nbsp;&nbsp;',{ref: '../pname'},'&nbsp;&nbsp;',
                                '目录层级 ','&nbsp;&nbsp;',{ref: '../plevel'},'&nbsp;&nbsp;',
                                '是否显示 ','&nbsp;&nbsp;',{ref: '../pisShow',xtype : 'combo',mode : 'local',
                                    triggerAction : 'all',lazyRender : true,editable: false,
                                    store : new Ext.data.SimpleStore({
                                        fields : ['value', 'text'],
                                        data : [['0', '否'], ['1', '是']]
                                    }),
                                    valueField : 'value',displayField : 'text'
                                },'&nbsp;&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectPtype();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.pname.setValue("");
                                        this.topToolbar.plevel.setValue("");
                                        this.topToolbar.pisShow.setValue("");
                                        this.filter={};
                                        this.doSelectPtype();
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
                                },'-',{
                                    xtype:'tbsplit',text: '导入', iconCls : 'icon-import',
                                    handler : function() {
                                        this.importPtype();
                                    },
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'批量导入商品类型',iconCls : 'icon-import',scope:this,handler:function(){this.importPtype()}},
                                            {text:'批量导入缩略图',iconCls : 'icon-import',scope:this,handler:function(){this.batchUploadImages("upload_ico_files","缩略图")}}
                                        ]}
                                },'-',{
                                    text : '导出',iconCls : 'icon-export',
                                    handler : function() {
                                        this.exportPtype();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看商品类型', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showPtype()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hidePtype();Km.Ptype.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Ptype.Cookie.set('View.IsFix',Km.Ptype.Config.View.IsFix);}}
                                        ]}
                                },'-',{
                                    xtype:'tbsplit',text : '选择类型',ref:'../../tattribute',iconCls : 'icon-edit',
                                    enableToggle: true,disabled : true,
                                    handler : function() {
                                        if(Km.Ptype.View.Running.selectAttributeWindow==null || Km.Ptype.View.Running.selectAttributeWindow.hidden){
                                            this.showAttribute();
                                        }else{
                                            this.hideAttribute();
                                        }
                                    }
                                },'-'
                            ]
                        }
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Ptype.Config.PageSize,
                    store: Km.Ptype.Store.ptypeStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Ptype.Viewport){
                                if (Km.Ptype.Config.View.IsShow==1){
                                    Km.Ptype.View.IsSelectView=1;
                                }
                                this.ownerCt.hidePtype();
                                Km.Ptype.Config.View.IsShow=0;
                            }
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Ptype.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Ptype.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Ptype.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectPtype();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Ptype.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Ptype.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectPtype();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示商品类型列表
            this.doSelectPtype();
            Km.Ptype.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的商品类型信息Tab页
            Km.Ptype.View.Running.viewTabs=new Km.Ptype.View.PtypeView.Tabs();
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
                    this.grid.tattribute.setDisabled(sm.getCount() != 1);
                },
                rowselect: function(sm, rowIndex, record) {
                    this.grid.updateViewPtype();
                    if (sm.getCount() != 1){
                        this.grid.hidePtype();
                        Km.Ptype.Config.View.IsShow=0;
                        this.grid.hideAttribute();
                    }else{
                        if (Km.Ptype.View.IsSelectView==1){
                            Km.Ptype.View.IsSelectView=0;
                            this.grid.showPtype();
                        }
                        if(Km.Ptype.View.Running.selectAttributeWindow && !Km.Ptype.View.Running.selectAttributeWindow.hidden){
                            this.grid.showAttribute();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Ptype.Config.View.IsShow==1){
                            Km.Ptype.View.IsSelectView=1;
                        }
                        this.grid.hidePtype();
                        Km.Ptype.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Ptype.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showPtype();
                this.tvpView.toggle(true);
            }else{
                this.hidePtype();
                Km.Ptype.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Ptype.Config.View.IsFix=1;
            }else{
               Km.Ptype.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Ptype.Config.View.IsShow=0;
                return ;
            }
            if (Km.Ptype.Config.View.IsShow==1){
               this.hidePtype();
               Km.Ptype.Config.View.IsShow=0;
            }
            this.showPtype();
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
         * 查询符合条件的商品类型
         */
        doSelectPtype : function() {
            if (this.topToolbar){
                var pname = this.topToolbar.pname.getValue();
                var plevel = this.topToolbar.plevel.getValue();
                var pisShow = this.topToolbar.pisShow.getValue();
                this.filter       ={'name':pname,'level':plevel,'isShow':pisShow};
            }
            var condition = {'start':0,'limit':Km.Ptype.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServicePtype.queryPagePtype(condition,function(provider, response) {
                if (response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Ptype.Store.ptypeStore.loadData(result);
                } else {
                    Km.Ptype.Store.ptypeStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的商品类型！');
                }
            });
        },
        /**
         * 显示商品类型视图
         * 显示商品类型的视图相对商品类型列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Ptype.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Ptype.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Ptype.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Ptype.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Ptype.View.Running.viewTabs);
                    break;
            }
            Km.Ptype.Cookie.set('View.Direction',Km.Ptype.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Ptype.Config.View.IsFix==0)&&(Km.Ptype.Config.View.IsShow==1)){
                    this.showPtype();
                }
                Km.Ptype.Config.View.IsFix=1;
                Km.Ptype.View.Running.ptypeGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Ptype.Config.View.IsShow=0;
                this.showPtype();
            }
        },
        /**
         * 显示商品类型
         */
        showPtype : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择商品类型！');
                Km.Ptype.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Ptype.Config.View.IsFix==0){
                if (Km.Ptype.View.Running.view_window==null){
                    Km.Ptype.View.Running.view_window=new Km.Ptype.View.PtypeView.Window();
                }
                if (Km.Ptype.View.Running.view_window.hidden){
                    Km.Ptype.View.Running.view_window.show();
                    Km.Ptype.View.Running.view_window.winTabs.hideTabStripItem(Km.Ptype.View.Running.view_window.winTabs.tabFix);
                    this.updateViewPtype();
                    this.tvpView.toggle(true);
                    Km.Ptype.Config.View.IsShow=1;
                }else{
                    this.hidePtype();
                    Km.Ptype.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Ptype.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Ptype.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Ptype.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Ptype.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Ptype.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Ptype.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Ptype.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Ptype.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Ptype.View.Running.viewTabs);
                    }
                    break;
            }
            this.hidePtype();
            if (Km.Ptype.Config.View.IsShow==0){
                Km.Ptype.View.Running.viewTabs.enableCollapse();
                switch(Km.Ptype.Config.View.Direction){
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
                this.updateViewPtype();
                this.tvpView.toggle(true);
                Km.Ptype.Config.View.IsShow=1;
            }else{
                Km.Ptype.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏商品类型
         */
        hidePtype : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Ptype.View.Running.view_window!=null){
                Km.Ptype.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前商品类型显示信息
         */
        updateViewPtype : function() {
            if (Km.Ptype.View.Running.view_window!=null){
                Km.Ptype.View.Running.view_window.winTabs.tabPtypeDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Ptype.View.Running.viewTabs.tabPtypeDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建商品类型
         */
        addPtype : function() {
            if (Km.Ptype.View.Running.edit_window==null){
                Km.Ptype.View.Running.edit_window=new Km.Ptype.View.EditWindow();
            }
            Km.Ptype.View.Running.edit_window.resetBtn.setVisible(false);
            Km.Ptype.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Ptype.View.Running.edit_window.setTitle('添加商品类型');
            Km.Ptype.View.Running.edit_window.savetype=0;
            Km.Ptype.View.Running.edit_window.ptype_id.setValue("");
            Km.Ptype.View.Running.edit_window.icoUpload.setValue("");
            var selectdPtype=this.getSelectionModel().getSelected();
            if (selectdPtype){
               var ptypeShowAll=selectdPtype.data.ptypeShowAll;
               if (ptypeShowAll=='无') {
                   ptypeShowAll=selectdPtype.data.name;
               }else{
                   ptypeShowAll=ptypeShowAll+"->"+selectdPtype.data.name;
               }
               Km.Ptype.View.Running.edit_window.ptypeShow.setValue(ptypeShowAll);
               Km.Ptype.View.Running.edit_window.parent_id.setValue(selectdPtype.data.ptype_id);
               Km.Ptype.View.Running.edit_window.ptypeShow.setVisible(true);
            }else{
               Km.Ptype.View.Running.edit_window.ptypeShow.setVisible(false);
            }
            Km.Ptype.View.Running.edit_window.sort_order.setValue('50');
            Km.Ptype.View.Running.edit_window.isShow.setValue('1');
            Km.Ptype.View.Running.edit_window.show();
            Km.Ptype.View.Running.edit_window.maximize();
        },
        /**
         * 编辑商品类型时先获得选中的商品类型信息
         */
        updatePtype : function() {
            if (Km.Ptype.View.Running.edit_window==null){
                Km.Ptype.View.Running.edit_window=new Km.Ptype.View.EditWindow();
            }
            Km.Ptype.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Ptype.View.Running.edit_window.resetBtn.setVisible(true);
            Km.Ptype.View.Running.edit_window.setTitle('修改商品类型');
            Km.Ptype.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Ptype.View.Running.edit_window.savetype=1;
            Km.Ptype.View.Running.edit_window.icoUpload.setValue(Km.Ptype.View.Running.edit_window.ico.getValue());
            Km.Ptype.View.Running.edit_window.ptypeShow.setVisible(true);
            Km.Ptype.View.Running.edit_window.show();
            Km.Ptype.View.Running.edit_window.maximize();
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
        },
        /**
         * 显示属性表
         */
        showAttribute:function(){
            if (Km.Ptype.View.Running.selectAttributeWindow==null){
                Km.Ptype.View.Running.selectAttributeWindow=new Km.Ptype.View.AttributeView.SelectAttributeWindow();
            }
            var ptype_id=Km.Ptype.View.Running.ptypeGrid.getSelectionModel().getSelected().data.ptype_id;
            Km.Ptype.View.Running.selectAttributeWindow.ptype_id=ptype_id;
            Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.filter={};
            Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.topToolbar.menus.all.setChecked(true);
            Km.Ptype.View.Running.selectAttributeWindow.attributeGrid.doSelectAttribute();
            Km.Ptype.View.Running.selectAttributeWindow.show();
            Km.Ptype.View.Running.ptypeGrid.tattribute.toggle(true);
        },
        /**
         * 隐藏属性表
         */
        hideAttribute:function(){
            if (Km.Ptype.View.Running.selectAttributeWindow!=null){
                Km.Ptype.View.Running.selectAttributeWindow.hide();
            }
            Km.Ptype.View.Running.ptypeGrid.tattribute.toggle(false);
        },
        /**
         * 导出商品类型
         */
        exportPtype : function() {
            ExtServicePtype.exportPtype(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入商品类型
         */
        importPtype : function() {
            if (Km.Ptype.View.current_uploadWindow==null){
                Km.Ptype.View.current_uploadWindow=new Km.Ptype.View.UploadWindow();
            }
            Km.Ptype.View.current_uploadWindow.show();
        },
        /**
         * 批量上传商品图片
         */
        batchUploadImages:function(inputname,title){
            if (Km.Ptype.View.Running.batchUploadImagesWindow==null){
                Km.Ptype.View.Running.batchUploadImagesWindow=new Km.Ptype.View.BatchUploadImagesWindow();
            }

            Km.Ptype.View.Running.batchUploadImagesWindow.setTitle("批量上传"+title);
            Km.Ptype.View.Running.batchUploadImagesWindow.uploadForm.upload_file.name=inputname;
            Km.Ptype.View.Running.batchUploadImagesWindow.show();
        }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Ptype.View.Running.ptypeGrid=new Km.Ptype.View.Grid();
            if (Km.Ptype.Config.View.IsFix==0){
                Km.Ptype.View.Running.ptypeGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Ptype.View.Running.ptypeGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Ptype.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Ptype.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前商品类型Grid对象
         */
        ptypeGrid:null,
        /**
         * 推荐属性表
         */
        selectAttributeWindow:null,
        /**
         * 显示商品类型信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Ptype.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Ptype.Init();
    /**
     * 商品类型数据模型获取数据Direct调用
     */
    Km.Ptype.Store.ptypeStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServicePtype.queryPagePtype}
    });
    /**
     * 商品类型页面布局
     */
    Km.Ptype.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Ptype.View.Panel()]
    });
    Km.Ptype.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
