Ext.namespace("Kmall.Admin.Attribute");
Km = Kmall.Admin;
Km.Attribute={
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
             * 显示属性表的视图相对属性表列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示属性表信息页(或者打开新窗口)
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
        if (Km.Attribute.Cookie.get('View.Direction')){
            Km.Attribute.Config.View.Direction=Km.Attribute.Cookie.get('View.Direction');
        }
        if (Km.Attribute.Cookie.get('View.IsFix')!=null){
            Km.Attribute.Config.View.IsFix=Km.Attribute.Cookie.get('View.IsFix');
        }
    }
};
/**
 * Model:数据模型
 */
Km.Attribute.Store = {
    /**
     * 属性表类型
     */ 
    pattributeStore:new Ext.data.Store({
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
                {name: 'sort_order',type: 'int'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Attribute.Config.PageSize;
                    Ext.apply(options.params, Km.Attribute.View.Running.pattributeGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
    /**
     * 属性表属性
     */ 
    attributeStore:new Ext.data.Store({
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
                {name: 'sort_order',type: 'int'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
            	if(Km.Attribute.View.Running.attributeGrid.parent_id==null){
            		return false;
				}
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Attribute.Config.PageSize;
                    Ext.apply(options.params, Km.Attribute.View.Running.attributeGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    })
};
/**
 * View:属性表显示组件
 */
Km.Attribute.View={
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
                savetype:0,
                closeAction : "hide",  
                constrainHeader:true,maximizable: true,collapsible: true,
                width : 350,height : 250,minWidth : 350,minHeight : 250,
                layout : 'fit',plain : true,buttonAlign : 'center',
                defaults : {
                    autoScroll : true
                },
                listeners:{
                    beforehide:function(){
                    	this.reset();
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
                            {xtype: 'hidden',name : 'attribute_id',ref:'../attribute_id'},
                            {xtype: 'hidden',name : 'level',ref:'../level'},
                            {xtype: 'hidden',name : 'parent_id',ref:'../parent_id'},
                            {fieldLabel : '属性名称',name : 'attribute_name',ref:"../attribute_name"},
                            {fieldLabel : '是否显示',hiddenName : 'isShow',ref:"../isShow"
                                 ,xtype : 'combo',mode : 'local',triggerAction : 'all',value:"1",
                                 lazyRender : true,editable: false,allowBlank : false,
                                 store : new Ext.data.SimpleStore({
	                                 fields : ['value', 'text'],
	                                 data : [['0', '否'], ['1', '是']]
                                 }),emptyText: '请选择是否显示',valueField : 'value',displayField : 'text'
                            },
                            {fieldLabel : '排序',name : 'sort_order',xtype : 'numberfield',value:"50",ref:"../sort_order"}
                        ]
                    })
                ],
                buttons : [{
                    text: "",ref : "../saveBtn",scope:this,
                    handler : function() {
                        if (!this.editForm.getForm().isValid()) {
                            return;
                        }
                        var editWindow=this;
                        if (this.savetype==0){
                            this.editForm.api.submit=ExtServiceAttribute.save;
                            this.editForm.getForm().submit({
                                success : function(form, action) {
                                    Ext.Msg.alert("提示", "保存成功！");
                                    //是否是类型
                                    if(editWindow.showtype==0){
                                    	Km.Attribute.View.Running.pattributeGrid.doSelectAttribute();
									}else{
										Km.Attribute.View.Running.attributeGrid.doSelectAttribute();
									}
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
                                    Ext.Msg.alert("提示", "修改成功！");
                                    if(editWindow.showtype==0){
                                    	Km.Attribute.View.Running.pattributeGrid.store.reload();
									}else{
										Km.Attribute.View.Running.attributeGrid.store.reload();
									}
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
                }]
            }, config);
            Km.Attribute.View.EditWindow.superclass.constructor.call(this, config);
        },
        reset:function(){
        	Km.Attribute.View.Running.edit_window.attribute_id.setValue("");
        	Km.Attribute.View.Running.edit_window.attribute_name.setValue("");
            Km.Attribute.View.Running.edit_window.level.setValue("");
            Km.Attribute.View.Running.edit_window.parent_id.setValue("");
            Km.Attribute.View.Running.edit_window.isShow.setValue("1");
            Km.Attribute.View.Running.edit_window.sort_order.setValue("50");
		}
    }),
    /**
     * 视图：属性表类型
     */
    PAttributeGrid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                filter:{},region : 'center',store : Km.Attribute.Store.pattributeStore,sm : this.sm,
                frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                loadMask : true,stripeRows : true,headerAsText : false,flex:1,
                defaults : {autoScroll : true},width:400,
                cm : new Ext.grid.ColumnModel({
                    defaults:{width:120,sortable : true},
                    columns : [
                        {header : '属性名称',dataIndex : 'attribute_name',menuDisabled:true},
                        {header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}},menuDisabled:true},
                        {header : '排序',dataIndex : 'sort_order',menuDisabled:true}
                    ]
                }),
                tbar : {
                    xtype : 'container',layout : 'anchor',height : 27,style:'font-size:14px',
                    defaults : {height : 27,anchor : '100%'},
                    items : [
                        new Ext.Toolbar({
                            defaults:{scope: this},
                            items : [
                            	{
                                    text : '添加属性',iconCls : 'icon-add',
                                    handler : function() {
                                        this.addAttribute();
                                    }
                                },'-',{
                                    text : '修改属性',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
                                    handler : function() {
                                        this.updateAttribute();
                                    }
                                },'-',{
                                    text : '删除属性', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteAttribute();
                                    }
                                }
                            ]
                        }
                    )]
                }
            }, config);
            Km.Attribute.View.PAttributeGrid.superclass.constructor.call(this, config);
            this.doSelectAttribute();
        },
        /**
         * 行选择器
         */
        sm : new Ext.grid.RowSelectionModel({
        	singleSelect:true,
            listeners : {
                selectionchange:function(sm) {
                    // 判断删除和更新按钮是否可以激活
                    this.grid.btnRemove.setDisabled(sm.getCount() < 1);
                    this.grid.btnUpdate.setDisabled(sm.getCount() != 1);
                    Km.Attribute.View.Running.attributeGrid.btnAdd.setDisabled(sm.getCount() != 1);
                    Km.Attribute.View.Running.attributeGrid.bottomToolbar.setDisabled(sm.getCount() != 1);
                },
                rowselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                    	Km.Attribute.View.Running.attributeGrid.parent_id=null;
                        Km.Attribute.Store.attributeStore.removeAll();
                    }else{
                    	var attribute_id=Km.Attribute.View.Running.pattributeGrid.getSelectionModel().getSelected().data.attribute_id;
						Km.Attribute.View.Running.attributeGrid.parent_id=attribute_id;
						Km.Attribute.View.Running.attributeGrid.topToolbar.attribute_name.setValue("");
                        Km.Attribute.View.Running.attributeGrid.filter={};
                        Km.Attribute.View.Running.attributeGrid.doSelectAttribute();
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        Km.Attribute.View.Running.attributeGrid.parent_id=null;
                        Km.Attribute.Store.attributeStore.removeAll();
                    }
                }
            }
        }),
        /**
         * 查询符合条件的属性表
         */
        doSelectAttribute : function() {
        	this.filter.all=1;
            var condition = {'start':0,'limit':Km.Attribute.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceAttribute.queryPageAttribute(condition,function(provider, response) {
                if (response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Attribute.Store.pattributeStore.loadData(result);
                } else {
                    Km.Attribute.Store.pattributeStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的属性！');
                }
            });
        },
        /**
         * 新建属性表
         */
        addAttribute : function() {
            if (Km.Attribute.View.Running.edit_window==null){
                Km.Attribute.View.Running.edit_window=new Km.Attribute.View.EditWindow();
            }
            Km.Attribute.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Attribute.View.Running.edit_window.setTitle('添加属性');
            Km.Attribute.View.Running.edit_window.savetype=0;
            Km.Attribute.View.Running.edit_window.showtype=0;
            Km.Attribute.View.Running.edit_window.level.setValue("1");
            Km.Attribute.View.Running.edit_window.parent_id.setValue("0");
            Km.Attribute.View.Running.edit_window.show();
        },
        /**
         * 编辑属性表时先获得选中的属性表信息
         */
        updateAttribute : function() {
            if (Km.Attribute.View.Running.edit_window==null){
                Km.Attribute.View.Running.edit_window=new Km.Attribute.View.EditWindow();
            }
            Km.Attribute.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Attribute.View.Running.edit_window.setTitle('修改属性');
            Km.Attribute.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Attribute.View.Running.edit_window.savetype=1;
            Km.Attribute.View.Running.edit_window.showtype=0;
            Km.Attribute.View.Running.edit_window.show();
        },
        /**
         * 删除属性表
         */
        deleteAttribute : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的属性吗?', this.confirmDeleteAttribute,this);
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
                ExtServiceAttribute.deleteByIds(del_attribute_ids,function(provider, response) {
                	Km.Attribute.View.Running.pattributeGrid.doSelectAttribute();
                	Km.Attribute.View.Running.attributeGrid.doSelectAttribute(true);
				});
                Ext.Msg.alert("提示", "删除成功！");
            }
        }
    }),
    /**
     * 视图：属性表属性
     */
    AttributeGrid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                filter:{},region : 'center',store : Km.Attribute.Store.attributeStore,sm : this.sm,
                frame : true,trackMouseOver : true,enableColumnMove : true,columnLines : true,
                loadMask : true,stripeRows : true,headerAsText : false,flex:1,parent_id:null,
                defaults : {autoScroll : true},
                cm : new Ext.grid.ColumnModel({
                    defaults:{width:120,sortable : true},
                    columns : [
                        this.sm,
                        {header : '属性名称',dataIndex : 'attribute_name',menuDisabled:true},
                        {header : '是否显示',dataIndex : 'isShow',renderer:function(value){if (value == true) {return "是";}else{return "否";}},menuDisabled:true},
                        {header : '排序',dataIndex : 'sort_order',menuDisabled:true}
                    ]
                }),
                tbar : {
                    xtype : 'container',layout : 'anchor',height : 27*2,style:'font-size:14px',
                    defaults : {height : 27,anchor : '100%'},
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
                                '属性名称','&nbsp;',{ref: '../attribute_name'},'&nbsp;',
                                {
                                    xtype : 'button',text : '查询',scope: this, 
                                    handler : function() {
                                        this.doSelectAttribute();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                                        this.topToolbar.attribute_name.setValue("");
                                        this.filter={};
                                        this.doSelectAttribute();
                                    }
                                }
                            ]
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
                                    text : '添加属性',ref: '../../btnAdd',iconCls : 'icon-add',disabled : true,
                                    handler : function() {
                                        this.addAttribute();
                                    }
                                },'-',{
                                    text : '修改属性',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,  
                                    handler : function() {
                                        this.updateAttribute();
                                    }
                                },'-',{
                                    text : '删除属性', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteAttribute();
                                    }
                                }
                            ]
                        }
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Attribute.Config.PageSize,
                    store: Km.Attribute.Store.attributeStore,
                    scope:this,autoShow:true,displayInfo: true,disabled:true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Attribute.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Attribute.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Attribute.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectAttribute();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Attribute.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Attribute.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectAttribute();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            Km.Attribute.View.AttributeGrid.superclass.constructor.call(this, config);
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
         * 查询符合条件的属性表
         */
        doSelectAttribute : function(last) {
        	if(Km.Attribute.View.Running.attributeGrid.parent_id==null)return;
            this.filter.parent_id=this.parent_id;
            this.filter.attribute_name=this.topToolbar.attribute_name.getValue();
            var condition = {'start':0,'limit':Km.Attribute.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceAttribute.queryPageAttribute(condition,function(provider, response) {
                if (response.result.data) {
                    var result           = new Array();
                    result['data']       =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                    Km.Attribute.Store.attributeStore.loadData(result);
                } else {
                    Km.Attribute.Store.attributeStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的属性！');
                }
                if(last){
                	//Km.Attribute.Store.attributeStore.loadData(result);
            		Km.Attribute.View.Running.attributeGrid.parent_id=null;
                	Km.Attribute.View.Running.attributeGrid.btnAdd.setDisabled(true);
                    //Km.Attribute.View.Running.attributeGrid.bottomToolbar.setDisabled(true);
				}
            });
        },
        /**
         * 新建属性表
         */
        addAttribute : function() {
            if (Km.Attribute.View.Running.edit_window==null){
                Km.Attribute.View.Running.edit_window=new Km.Attribute.View.EditWindow();
            }
            Km.Attribute.View.Running.edit_window.saveBtn.setText('保 存');
            Km.Attribute.View.Running.edit_window.setTitle('添加属性');
            Km.Attribute.View.Running.edit_window.savetype=0;
            Km.Attribute.View.Running.edit_window.showtype=1;
            Km.Attribute.View.Running.edit_window.level.setValue("2");
            Km.Attribute.View.Running.edit_window.parent_id.setValue(Km.Attribute.View.Running.attributeGrid.parent_id);
            Km.Attribute.View.Running.edit_window.show();
        },
        /**
         * 编辑属性表时先获得选中的属性表信息
         */
        updateAttribute : function() {
            if (Km.Attribute.View.Running.edit_window==null){
                Km.Attribute.View.Running.edit_window=new Km.Attribute.View.EditWindow();
            }
            Km.Attribute.View.Running.edit_window.saveBtn.setText('修 改');
            Km.Attribute.View.Running.edit_window.setTitle('修改属性');
            Km.Attribute.View.Running.edit_window.editForm.form.loadRecord(this.getSelectionModel().getSelected());
            Km.Attribute.View.Running.edit_window.savetype=1;
            Km.Attribute.View.Running.edit_window.showtype=1;
            Km.Attribute.View.Running.edit_window.show();
        },
        /**
         * 删除属性表
         */
        deleteAttribute : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的属性表?', this.confirmDeleteAttribute,this);
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
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
        	Km.Attribute.View.Running.pattributeGrid=new Km.Attribute.View.PAttributeGrid();
        	Km.Attribute.View.Running.attributeGrid=new Km.Attribute.View.AttributeGrid();
            config = Ext.apply({
                region :"center",frame:true,layout:{type:"hbox",align:"stretch"},
                items:[
                    Km.Attribute.View.Running.pattributeGrid,
                    Km.Attribute.View.Running.attributeGrid
                ]
            }, config);
            Km.Attribute.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */ 
    Running:{
    	/**
    	* 属性表类型
    	*/
    	pattributeGrid:null,
    	/**
    	* 属性表属性
    	*/
    	attributeGrid:null,
        /**
         * 编辑属性
         */
        edit_window:null
    }    
};
/**
 * Controller:主程序
 */
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.state.Manager.setProvider(Km.Attribute.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Attribute.Init();
    /**
     * 属性表数据模型获取数据Direct调用
     */
    Km.Attribute.Store.pattributeStore.proxy=new Ext.data.DirectProxy({ 
        api: {read:ExtServiceAttribute.queryPageAttribute}
    });
    Km.Attribute.Store.attributeStore.proxy=new Ext.data.DirectProxy({ 
        api: {read:ExtServiceAttribute.queryPageAttribute}
    });
    /**
     * 属性表页面布局
     */
    Km.Attribute.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Attribute.View.Panel()]
    });
    Km.Attribute.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});