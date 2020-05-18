Ext.namespace("Kmall.Admin.Admin");
Km = Kmall.Admin.Admin;
Km.Admin={
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
			 * 显示系统管理人员的视图相对系统管理人员列表Grid的位置
			 * 1:上方,2:下方,3:左侧,4:右侧,
			 */
			Direction:2,
			/**
			 *是否显示。
			 */
			IsShow:0,
			/**
			 * 是否固定显示系统管理人员信息页(或者打开新窗口)
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
		if (Km.Admin.Cookie.get('View.Direction')){
			Km.Admin.Config.View.Direction=Km.Admin.Cookie.get('View.Direction');
		}
		if (Km.Admin.Cookie.get('View.IsFix')!=null){
			Km.Admin.Config.View.IsFix=Km.Admin.Cookie.get('View.IsFix');
		}
	}
};
/**
 * Model:数据模型
 */
Km.Admin.Store = {
	/**
	 * 系统管理人员
	 */
	adminStore:new Ext.data.Store({
		reader: new Ext.data.JsonReader({
			totalProperty: 'totalCount',
			successProperty: 'success',
			root: 'data',remoteSort: true,
			fields : [
                {name: 'admin_id',type: 'int'},
                {name: 'username',type: 'string'},
                {name: 'realname',type: 'string'},
                {name: 'password',type: 'string'},
                {name: 'department_id',type: 'int'},
                {name: 'department_name',type: 'string'},
                {name: 'authority',type: 'string'},
                {name: 'operation',type: 'string'},
                {name: 'roletypeShow',type: 'string'},
                {name: 'roletype',type: 'string'},
                {name: 'roleid',type: 'int'},
                {name: 'seescopeShow',type: 'string'},
                {name: 'seescope',type: 'string'},
                {name: 'operator_id',type: 'int'},
                {name: 'operator_name',type: 'string'},
                {name: 'nowroleplayer',type: 'int'}
			]}
		),
		writer: new Ext.data.JsonWriter({
			encode: false
		}),
		listeners : {
			beforeload : function(store, options) {
				if (Ext.isReady) {
					Ext.apply(options.params, Km.Admin.View.Running.adminGrid.filter);//保证分页也将查询条件带上
				}
			}
		}
	}),

    /**
     *角色部门
     */
    departmentStore : new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'home/admin/src/httpdata/department.php'
        }),
        reader: new Ext.data.JsonReader({
            root: 'departments',
            autoLoad: true,
            totalProperty: 'totalCount',
            id: 'department_id'
        }, [
            {name: 'department_id', mapping: 'department_id'},
            {name: 'department_name', mapping: 'department_name'}
        ])
    }),
	/**
	 * 供应商
	 */
	supplierStore : new Ext.data.Store({
		proxy: new Ext.data.HttpProxy({
			url: 'home/admin/src/httpdata/supplier.php'
		}),
		reader: new Ext.data.JsonReader({
			root: 'suppliers',
			autoLoad: true,
			totalProperty: 'totalCount',
			id: 'supplier_id'
		}, [
			{name: 'supplier_id', mapping: 'supplier_id'},
			{name: 'sp_name', mapping: 'sp_name'}
		])
	})
};
/**
 * View:系统管理人员显示组件
 */
Km.Admin.View={
    //用户选择权限角色视图
    UserRoleView:{
        //定义用户权限容器
        userRoleFieldset:null,
        //创建权限选择容器以容纳权限角色Checkboxes
        createuserRoleContainer : function() {
            var userRoleFieldset = new Ext.form.FieldSet({
                id:'_fieldset',
                ref:'../_fieldset',
                layout:'column',
                xtype:'checkboxgroup',
                title:'权限选择',
                autoHeight: true,
                style:'padding-left:10px;',
                labelWidth: 25,
                width:'100%',
                items: [
                    {
                        style:'padding-left:20px;padding-top:10px;margin-right:10px;font-size:12px;',
                        width:120,
                        xtype: 'fieldset',
                        title: '全选列表',
                        autoHeight: true,
                        layout:'column',
                        defaultType: 'checkbox',
                        id: 'leftcheck',
                        autoHeight: true,
                    },
                    {
                        style:'font-size:12px;',
                        width:Ext.getBody().getWidth()-200,
                        xtype: 'fieldset',
                        title: '菜单列表',
                        autoHeight: true,
                        defaultType: 'checkbox',
                        id: 'rightcheck'
                    }
                ]
            });
            this.userRoleFieldset=userRoleFieldset;
            //创建左侧全选列表
            this.createselectAllContainer("leftcheck");
            //创建右侧菜单列表
            this.createauthorityContainer("rightcheck");
        },
        //根据配置信息添加左侧全选菜单
        createselectAllContainer : function(id) {
            for(var i=0;i<xml.length;i++){
                var potence=xml[i];
                var _checkbox=new Ext.form.Checkbox({
                    height:30,
                    id:potence.id,
                    name:potence.id,
                    boxLabel : potence.name,
                    //监听器,checkbox点击事件
                    listeners: {
                        afterrender:function(obj){
                            obj.getEl().dom.onclick = function(){
                                //获取对象ID
                                var pId=obj.getId();
                                for(var i=0;i<xml.length;i++){
                                    if(xml[i].id==pId){
                                        var menus=xml[i].menus;
                                        break;
                                    }
                                }
                                var check = Ext.getCmp(pId).getValue();
                                if(check){
                                    for(var i=0;i<menus.length;i++){
                                        //选中对应的菜单项
                                        var menuid=menus[i].id;
                                        Ext.getCmp(menuid).setValue(true);
                                        //fieldset内部的checkbox全部选中
                                        for(var j=0;j<authorityxml.length;j++){
                                            if(authorityxml[j].id==menuid){
                                                var operations=authorityxml[j].operations;
                                                for(var k=0;k<operations.length;k++){
                                                    var operation=operations[k];
                                                    var operation_id=operation.gridname+'_'+operation.id;
                                                    Ext.getCmp(operation_id).setValue(true);
                                                }
                                            }
                                        }
                                    }
                                }else{
                                    for(var i=0;i<menus.length;i++){
                                        //fieldset头部的checkbox选中
                                        var menuid=menus[i].id;
                                        Ext.getCmp(menuid).setValue(false);
                                        //fieldset内部的checkbox全部选中
                                        for(var j=0;j<authorityxml.length;j++){
                                            if(authorityxml[j].id==menuid){
                                                var operations=authorityxml[j].operations;
                                                for(var k=0;k<operations.length;k++){
                                                    var operation=operations[k];
                                                    var operation_id=operation.gridname+'_'+operation.id;
                                                    Ext.getCmp(operation_id).setValue(false);
                                                }
                                            }
                                        }
                                    }
                                }
                            };
                        }
                    }
                });
                Ext.getCmp(id).add(_checkbox);
            }
        },
        //根据配置信息添加右侧容器
        createauthorityContainer : function(id) {
            for(var i=0;i<xml.length;i++){
                var potence=xml[i];
                var menus=xml[i].menus;
                var r_checkbox = new Ext.form.FieldSet({
                    style:'margin:10px;padding:10px;',
                    id:potence.id+"_container",
                    title:potence.name,
                    labelWidth: 25,
                    autoHeight: true,
                    collapsible:true,
                    width:'96%',
                    items: [
                        {
                            style: 'padding-left:13px;',
                            xtype: 'container',
                            autoHeight: true,
                            id: potence.id+'nonecheck',
                            layout:'column',
                        },
                        {
                            style: 'padding-left:13px;',
                            xtype: 'container',
                            autoHeight: true,
                            id: potence.id+'hascheck'
                        }
                    ]
                });
                for(var j=0;j<menus.length;j++){
                    var menu=menus[j];
                    var hasoperation=false;
                    //判断操作数组个数
                    for(var x=0;x<authorityxml.length;x++){
                        if(authorityxml[x].id==menu.id){
                            //交换名称
                            menu.name=authorityxml[x].name;
                            //判断是否包含操作
                            if(!authorityxml[x].operations.length){
                                hasoperation=false;
                            }else{
                                hasoperation=true;
                            }
                            break;
                        }
                    }
                    if(!hasoperation){
                        var _checkbox=new Ext.form.Checkbox({
                            height:30,
                            id:menu.id,
                            name:menu.id,
                            boxLabel : menu.name,
                            checked : false
                        });
                        Ext.getCmp(potence.id+'nonecheck').add(_checkbox);
                    }else{
                        var _checkbox=new Ext.form.FieldSet({
                            style:'padding:10px;float:left;',
                            id:menu.id+"_fieldset",
                            layout:'column',
                            title:menu.name,
                            autoHeight: true,
                            checkboxToggle:true,
                            checkboxName:menu.id+"checkall",
                            onCheckClick:function(){
                                var fieldsetid=this.id;
                                if(this.checkbox.dom.checked){
                                    //遍历操作的xml
                                    for(var m=0;m<authorityxml.length;m++){
                                        if(authorityxml[m].id+'_fieldset'==fieldsetid){
                                            //改变隐藏checkbox值
                                            Ext.getCmp(authorityxml[m].id).setValue(true);
                                            //改变checkbox状态
                                            var operations=authorityxml[m].operations;
                                            for(var n=0;n<operations.length;n++){
                                                var operation=operations[n];
                                                var operation_id=operation.gridname+'_'+operation.id;
                                                Ext.getCmp(operation_id).setValue(true);
                                            }
                                            break;
                                        }
                                    }
                                }else{
                                    //遍历操作的xml
                                    for(var m=0;m<authorityxml.length;m++){
                                        if(authorityxml[m].id+'_fieldset'==fieldsetid){
                                            //改变隐藏checkbox值
                                            Ext.getCmp(authorityxml[m].id).setValue(false);
                                            //改变checkbox状态
                                            var operations=authorityxml[m].operations;
                                            for(var n=0;n<operations.length;n++){
                                                var operation=operations[n];
                                                var operation_id=operation.gridname+'_'+operation.id;
                                                Ext.getCmp(operation_id).setValue(false);
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                        //遍历相应的操作
                        for(var k=0;k<authorityxml.length;k++){
                            if(authorityxml[k].id==menu.id){
                                //添加隐藏checkbox
                                var _checkboxhidden=new Ext.form.Checkbox({
                                    id:menu.id,
                                    hidden : true,
                                    name:menu.id,
                                    checked : false
                                });
                                Ext.getCmp(menu.id+"_fieldset").add(_checkboxhidden);
                                //添加checkbox
                                var operations=authorityxml[k].operations;
                                for(var m=0;m<operations.length;m++){
                                    var operation=operations[m];
                                    var _checkboxin=new Ext.form.Checkbox({
                                        height:30,
                                        id:operation.gridname+'_'+operation.id,
                                        name:operation.gridname+'_'+operation.id,
                                        boxLabel : operation.name,
                                        checked : false,
                                        listeners : {
                                            "check" : function() {
                                                var checked=true;
                                                var hiddenid=this.ownerCt.items.items[0].id;
                                                for(var n=1;n<this.ownerCt.items.items.length;n++){
                                                    if(!this.ownerCt.items.items[n].checked){
                                                        checked=false;
                                                        break;
                                                    }
                                                }
                                                //判断是否选中fieldset的checkbox
                                                if(checked){
                                                    this.ownerCt.checkbox.dom.checked=true;
                                                }else{
                                                    this.ownerCt.checkbox.dom.checked=false;
                                                    Ext.getCmp(hiddenid).setValue(false);
                                                }
                                                //只要选中一个操作，隐藏checkbox被选中
                                                for(var n=1;n<this.ownerCt.items.items.length;n++){
                                                    if(this.ownerCt.items.items[n].checked){
                                                        Ext.getCmp(hiddenid).setValue(true);
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    Ext.getCmp(menu.id+"_fieldset").add(_checkboxin);
                                }
                                break;
                            }
                        }
                        Ext.getCmp(potence.id+'hascheck').add(_checkbox);
                    }
                }
                Ext.getCmp(id).add(r_checkbox);
            }
        }
    },
	/**
	 * 编辑窗口：新建或者修改系统管理人员
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
                    show:function(){
                        //清空checkbox
                        Km.Admin.View.Running.adminGrid.clearcheckbox();
                        //如果是修改
                        if(this.savetype==1){
                            Km.Admin.View.Running.adminGrid.selectcheckbox();
                        }
                    },
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
							  {xtype: 'hidden',  name : 'admin_id',ref:'../admin_id'},
							  {fieldLabel : '用户名(<font color=red>*</font>)',name : 'username',ref:'../username',allowBlank : false,
                                  regex: /^\S+$//*不允许空格*/
                              },
                              {fieldLabel : '密码(<font color=red>*</font>)',name : 'password',inputType:'password',ref:'../password'},
                              {xtype: 'hidden',name : 'password_old',ref:'../password_old'},
                              {fieldLabel : '真实姓名',name : 'realname'},
                              {xtype: 'hidden',name : 'department_id',ref:'../department_id',id : 'department_id'},
                              {
                                     fieldLabel : '部门',xtype: 'combo',name : 'departmentunit',ref : '../departmentunit',id : 'departmentunit',
                                     store:Km.Admin.Store.departmentStore,emptyText: '请选择部门',itemSelector: 'div.search-item',
                                     loadingText: '查询中...',width: 570, pageSize:Km.Admin.Config.PageSize,
                                     displayField:'department_name',// 显示文本
                                     mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
                                     forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
                                     tpl:new Ext.XTemplate(
                                                '<tpl for="."><div class="search-item">',
                                                    '<h3>{department_name}</h3>',
                                                '</div></tpl>'
                                     ),
                                     onSelect:function(record,index){
                                         if(this.fireEvent('beforeselect', this, record, index) !== false){
                                            Ext.getCmp("departmentunit").setValue(record.data.department_name);
                                            Ext.getCmp("department_id").setValue(record.data.department_id);
                                            this.collapse();
                                         }
                                     }
                                },
							  {fieldLabel : '扮演角色',hiddenName : 'roletype',id:"roletype",ref:'../roletype',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
                                store : new Ext.data.SimpleStore({
                                    fields : ['value','name', 'text'],
                                    data : [['1','MANAGER','管理员'],['2','NORMAL','客服'],['3','BUYER','采购人员'],['4','FINANCE','财务'],['5','WAREHOUSEKEEPER','库管']],
                                    listeners: {
                                        'load' :  function(store,records,options) {
                                            var admin=Ext.util.Cookies.get('roletype');
                                            //如果不是超级管理员,无权新建管理员
                                            if(admin!=0){
                                                store.remove(records[0]);
                                            }
                                        }
                                    }
                                }),
                                emptyText: '请选择扮演角色',
								valueField : 'value',displayField : 'text',
								onSelect:function(combo,index){
                                    //清空checkbox
                                    Km.Admin.View.Running.adminGrid.clearcheckbox();
                                    //筛选相应角色的菜单和操作
                                    var roleplayer=rolexml[combo.data["name"]];
                                    var roleoperation=roleauthorityxml[combo.data["name"]];
                                    //勾选菜单checkbox
                                    for(var i=0;i<roleplayer.length;i++){
                                        var potence=roleplayer[i];
                                        for(var j=0;j<potence.menus.length;j++){
                                            var menuid=potence.menus[j].id;
                                            Ext.getCmp(menuid).setValue(true);
                                        }
                                    }
                                    //勾选操作checkbox
                                    for(var i=0;i<roleoperation.length;i++){
                                        var operationlist=roleoperation[i];
                                        for(var j=0;j<operationlist.operations.length;j++){
                                            var operation=operationlist.operations[j];
                                            var operation_id=operation.gridname+'_'+operation.id;
                                            Ext.getCmp(operation_id).setValue(true);
                                        }
                                    }
/*供货商	                         if ((combo.data["value"]=="4")||(combo.data["value"]=="5"))
									{
										Km.Admin.View.Running.edit_window.sp_name.show();
									}else{
										Km.Admin.View.Running.edit_window.sp_name.hide();
									}*/
									Ext.getCmp("roletype").setValue(combo.data["value"]);
									this.collapse();
								}
							  },
							  {xtype: 'hidden',name : 'roleid',id:'roleid',ref : '../roleid'},
/*供货商							  {
									 fieldLabel : '供货商',xtype: 'hidden',name : 'sp_name',id : 'sp_name',ref : '../sp_name',
									 store:Km.Admin.Store.supplierStore,emptyText: '请选择供货商',itemSelector: 'div.search-item',
									 loadingText: '查询中...',width: 570, pageSize:Km.Admin.Config.PageSize,
									 displayField:'sp_name',// 显示文本
									 mode: 'remote',  editable:true,minChars: 1,autoSelect :true,typeAhead: false,
									 forceSelection: true,triggerAction: 'all',resizable:false,selectOnFocus:true,
									 tpl:new Ext.XTemplate(
												'<tpl for="."><div class="search-item">',
													'<h3>{sp_name}</h3>',
												'</div></tpl>'
									 ),
									 onSelect:function(record,index){
										 if(this.fireEvent('beforeselect', this, record, index) !== false){
											Ext.getCmp("roleid").setValue(record.data.supplier_id);
											Ext.getCmp("sp_name").setValue(record.data.sp_name);
											this.collapse();
										 }
									 }
								},*/
							  {fieldLabel : '视野',hiddenName : 'seescope',xtype : 'combo',mode : 'local',triggerAction : 'all',lazyRender : true,editable: false,allowBlank : false,
								store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '只能查看自己的信息'],['1', '查看所有的信息']]
								  }),emptyText: '请选择视野',
								valueField : 'value',// 值
								displayField : 'text'// 显示文本
							  }
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
							this.editForm.api.submit=ExtServiceAdmin.save;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.alert("提示", "保存成功！");
									Km.Admin.View.Running.adminGrid.doSelectAdmin();
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', action.result.msg);
								}
							});
						}else{
							this.editForm.api.submit=ExtServiceAdmin.update;
							this.editForm.getForm().submit({
								success : function(form, action) {
									Ext.Msg.show({title:'提示',msg: '修改成功！',buttons: {yes: '确定'},fn: function(){
										Km.Admin.View.Running.adminGrid.bottomToolbar.doRefresh();
									}});
									form.reset();
									editWindow.hide();
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '失败！');
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
                        //清空checkbox
                        Km.Admin.View.Running.adminGrid.clearcheckbox();
                        //选中checkbox
                        Km.Admin.View.Running.adminGrid.selectcheckbox();
						this.editForm.form.loadRecord(Km.Admin.View.Running.adminGrid.getSelectionModel().getSelected());
					}
				}]
			}, config);
			Km.Admin.View.EditWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 显示系统管理人员详情
	 */
	AdminView:{
		/**
		 * Tab页：容器包含显示与系统管理人员所有相关的信息
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
								if (Km.Admin.View.Running.adminGrid.getSelectionModel().getSelected()==null){
									Ext.Msg.alert('提示', '请先选择系统管理人员！');
									return false;
								}
								Km.Admin.Config.View.IsShow=1;
								Km.Admin.View.Running.adminGrid.showAdmin();
								Km.Admin.View.Running.adminGrid.tvpView.menu.mBind.setChecked(false);
								return false;
							}
						}
					},
					items: [
						{title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
					]
				}, config);
				Km.Admin.View.AdminView.Tabs.superclass.constructor.call(this, config);

				this.onAddItems();
			},
			/**
			 * 根据布局调整Tabs的宽度或者高度以及折叠
			 */
			enableCollapse:function(){
				if ((Km.Admin.Config.View.Direction==1)||(Km.Admin.Config.View.Direction==2)){
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
					{title: '基本信息',ref:'tabAdminDetail',iconCls:'tabs',
					 tpl: [
					  '<table class="viewdoblock">',
						 '<tr class="entry"><td class="head">用户名</td><td class="content">{username}</td></tr>',
                         '<tr class="entry"><td class="head">真实姓名</td><td class="content">{realname}</td></tr>',
                         '<tr class="entry"><td class="head">所在部门</td><td class="content">{department_name}</td></tr>',
						 '<tr class="entry"><td class="head">扮演角色</td><td class="content">{roletypeShow}</td></tr>',
						 '<tr class="entry"><td class="head">视野</td><td class="content">{seescopeShow}</td></tr>',
                         '<tpl if="nowroleplayer==0"><tr class="entry"><td class="head">角色创建者</td><td class="content">{operator_name}</td></tr></tpl>',
					 '</table>'
					 ]
					}
				);
			}
		}),
		/**
		 * 窗口:显示系统管理人员信息
		 */
		Window:Ext.extend(Ext.Window,{
			constructor : function(config) {
				config = Ext.apply({
					title:"查看系统管理人员",constrainHeader:true,maximizable: true,minimizable : true,
					width : 705,height : 500,minWidth : 450,minHeight : 400,
					layout : 'fit',resizable:true,plain : true,bodyStYle : 'padding:5px;',
					closeAction : "hide",
					items:[new Km.Admin.View.AdminView.Tabs({ref:'winTabs',tabPosition:'top'})],
					listeners: {
						minimize:function(w){
							w.hide();
							Km.Admin.Config.View.IsShow=0;
							Km.Admin.View.Running.adminGrid.tvpView.menu.mBind.setChecked(true);
						},
						hide:function(w){
                            Km.Admin.Config.View.IsShow=0;
							Km.Admin.View.Running.adminGrid.tvpView.toggle(false);
						}
					},
					buttons: [{
						text: '新增',scope:this,
						handler : function() {this.hide();Km.Admin.View.Running.adminGrid.addAdmin();}
					},{
						text: '修改',scope:this,
						handler : function() {this.hide();Km.Admin.View.Running.adminGrid.updateAdmin();}
					}]
				}, config);
				Km.Admin.View.AdminView.Window.superclass.constructor.call(this, config);
			}
		})
	},
	/**
	 * 窗口：批量上传系统管理人员
	 */
	UploadWindow:Ext.extend(Ext.Window,{
		constructor : function(config) {
			config = Ext.apply({
				title : '批量系统管理人员上传',
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
							emptyText: '请上传系统管理人员Excel文件',buttonText: '',
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
									url : 'index.php?go=admin.upload.uploadAdmin',
									success : function(form, action) {
										Ext.Msg.alert('成功', '上传成功');
										uploadWindow.hide();
										uploadWindow.uploadForm.upload_file.setValue('');
										Km.Admin.View.Running.adminGrid.doSelectAdmin();
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
			Km.Admin.View.UploadWindow.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 视图：系统管理人员列表
	 */
	Grid:Ext.extend(Ext.grid.GridPanel, {
		constructor : function(config) {
			config = Ext.apply({
				/**
				 * 查询条件
				 */
				filter:null,
				region : 'center',
				store : Km.Admin.Store.adminStore,
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
						  {header : '用户名',dataIndex : 'username'},
                          {header : '真实姓名',dataIndex : 'realname'},
                          {header : '所在部门',dataIndex : 'department_name'},
						  {header : '扮演角色',dataIndex : 'roletypeShow'},
						  {header : '视野',dataIndex : 'seescopeShow'}
//						  {header : 'openid号',dataIndex : 'open_id'}
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
								'用户名 ','&nbsp;&nbsp;',{ref: '../ausername'},'&nbsp;&nbsp;',
								'扮演角色','&nbsp;&nbsp;',{ref: '../aroletype',xtype : 'combo',mode : 'local',
									triggerAction : 'all',lazyRender : true,editable: false,
									store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['1', '管理员'],['2', '客服'],['3', '采购'],['4', '财务'],['5', '库管']],
                                        listeners: {
                                        'load' :  function(store,records,options) {
                                            var admin=Ext.util.Cookies.get('roletype');
                                            //如果不是超级管理员,无权新建管理员
                                            if(admin!=0){
                                                store.remove(records[0]);
                                            }
                                        }
                                    }
									  }),
									valueField : 'value',// 值
									displayField : 'text'// 显示文本
								},'&nbsp;&nbsp;',
								{
									xtype : 'button',text : '查询',scope: this,
									handler : function() {
										this.doSelectAdmin();
									}
								},
								{
									xtype : 'button',text : '重置',scope: this,
									handler : function() {
										this.topToolbar.ausername.setValue("");
										this.topToolbar.aroletype.setValue("");
										this.filter={};
										this.doSelectAdmin();
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
									text : '添加系统管理人员',iconCls : 'icon-add',
									handler : function() {
										this.addAdmin();
									}
								},'-',{
									text : '修改系统管理人员',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
									handler : function() {
										this.updateAdmin();
									}
								},'-',{
									text : '删除系统管理人员', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
									handler : function() {
										this.deleteAdmin();
									}
								},'-',{
									text : '导入',iconCls : 'icon-import',
									handler : function() {
										this.importAdmin();
									}
								},'-',{
									text : '导出',iconCls : 'icon-export',
									handler : function() {
										this.exportAdmin();
									}
								},'-',{
									xtype:'tbsplit',text: '查看系统管理人员', ref:'../../tvpView',iconCls : 'icon-updown',
									enableToggle: true, disabled : true,
									handler:function(){this.showAdmin()},
									menu: {
										xtype:'menu',plain:true,
										items: [
											{text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
											{text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
											{text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
											{text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
											{text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideAdmin();Km.Admin.Config.View.IsShow=0;}},'-',
											{text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Admin.Cookie.set('View.IsFix',Km.Admin.Config.View.IsFix);}}
										]}
								},'-']}
					)]
				},
				bbar: new Ext.PagingToolbar({
					pageSize: Km.Admin.Config.PageSize,
					store: Km.Admin.Store.adminStore,
					scope:this,autoShow:true,displayInfo: true,
					displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
					emptyMsg: "无显示数据",
					items: [
						{xtype:'label', text: '每页显示'},
						{xtype:'numberfield', value:Km.Admin.Config.PageSize,minValue:1,width:35,
							style:'text-align:center',allowBlank: false,
							listeners:
							{
								change:function(Field, newValue, oldValue){
									var num = parseInt(newValue);
									if (isNaN(num) || !num || num<1)
									{
										num = Km.Admin.Config.PageSize;
										Field.setValue(num);
									}
									this.ownerCt.pageSize= num;
									Km.Admin.Config.PageSize = num;
									this.ownerCt.ownerCt.doSelectAdmin();
								},
								specialKey :function(field,e){
									if (e.getKey() == Ext.EventObject.ENTER){
										var num = parseInt(field.getValue());
										if (isNaN(num) || !num || num<1)
										{
											num = Km.Admin.Config.PageSize;
										}
										this.ownerCt.pageSize= num;
										Km.Admin.Config.PageSize = num;
										this.ownerCt.ownerCt.doSelectAdmin();
									}
								}
							}
						},
						{xtype:'label', text: '个'}
					]
				})
			}, config);
			//初始化显示系统管理人员列表
			this.doSelectAdmin();
			Km.Admin.View.Grid.superclass.constructor.call(this, config);
			//创建在Grid里显示的系统管理人员信息Tab页
			Km.Admin.View.Running.viewTabs=new Km.Admin.View.AdminView.Tabs();
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
					this.grid.updateViewAdmin();
					if (sm.getCount() != 1){
						this.grid.hideAdmin();
						Km.Admin.Config.View.IsShow=0;
					}else{
						if (Km.Admin.View.IsSelectView==1){
							Km.Admin.View.IsSelectView=0;
							this.grid.showAdmin();
						}
					}
				},
				rowdeselect: function(sm, rowIndex, record) {
					if (sm.getCount() != 1){
						if (Km.Admin.Config.View.IsShow==1){
							Km.Admin.View.IsSelectView=1;
						}
						this.grid.hideAdmin();
						Km.Admin.Config.View.IsShow=0;
					}
				}
			}
		}),
		/**
		 * 双击选行
		 */
		onRowDoubleClick:function(grid, rowIndex, e){
			if (!Km.Admin.Config.View.IsShow){
				this.sm.selectRow(rowIndex);
				this.showAdmin();
				this.tvpView.toggle(true);
			}else{
				this.hideAdmin();
				Km.Admin.Config.View.IsShow=0;
				this.sm.deselectRow(rowIndex);
				this.tvpView.toggle(false);
			}
		},
		/**
		 * 是否绑定在本窗口上
		 */
		onBindGrid:function(item, checked){
			if (checked){
			   Km.Admin.Config.View.IsFix=1;
			}else{
			   Km.Admin.Config.View.IsFix=0;
			}
			if (this.getSelectionModel().getSelected()==null){
				Km.Admin.Config.View.IsShow=0;
				return ;
			}
			if (Km.Admin.Config.View.IsShow==1){
			   this.hideAdmin();
			   Km.Admin.Config.View.IsShow=0;
			}
			this.showAdmin();
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
		 * 查询符合条件的系统管理人员
		 */
		doSelectAdmin : function() {
			if (this.topToolbar){
				var ausername = this.topToolbar.ausername.getValue();
				var aroletype = this.topToolbar.aroletype.getValue();
				this.filter       ={'username':ausername,'roletype':aroletype};
			}
			var condition = {'start':0,'limit':Km.Admin.Config.PageSize};
			Ext.apply(condition,this.filter);
			ExtServiceAdmin.queryPageAdmin(condition,function(provider, response) {
                window.xml=response.result.xml;//保存菜单配置文件信息
                window.rolexml=response.result.rolexml;//保存角色菜单配置文件信息
                window.authorityxml=response.result.authorityxml;//保存操作菜单配置文件信息
                window.roleauthorityxml=response.result.roleauthorityxml;//保存角色操作菜单配置文件信息
				if (response.result.data) {
					var result           = new Array();
					result['data']       =response.result.data;
					result['totalCount'] =response.result.totalCount;
					Km.Admin.Store.adminStore.loadData(result);
				} else {
					Km.Admin.Store.adminStore.removeAll();
					Ext.Msg.alert('提示', '无符合条件的系统管理人员！');
				}
			});
		},
		/**
		 * 显示系统管理人员视图
		 * 显示系统管理人员的视图相对系统管理人员列表Grid的位置
		 * 1:上方,2:下方,0:隐藏。
		 */
		onUpDown:function(viewDirection){
			Km.Admin.Config.View.Direction=viewDirection;
			switch(viewDirection){
				case 1:
					this.ownerCt.north.add(Km.Admin.View.Running.viewTabs);
					break;
				case 2:
					this.ownerCt.south.add(Km.Admin.View.Running.viewTabs);
					break;
				case 3:
					this.ownerCt.west.add(Km.Admin.View.Running.viewTabs);
					break;
				case 4:
					this.ownerCt.east.add(Km.Admin.View.Running.viewTabs);
					break;
			}
			Km.Admin.Cookie.set('View.Direction',Km.Admin.Config.View.Direction);
			if (this.getSelectionModel().getSelected()!=null){
				if ((Km.Admin.Config.View.IsFix==0)&&(Km.Admin.Config.View.IsShow==1)){
					this.showAdmin();
				}
				Km.Admin.Config.View.IsFix=1;
				Km.Admin.View.Running.adminGrid.tvpView.menu.mBind.setChecked(true,true);
				Km.Admin.Config.View.IsShow=0;
				this.showAdmin();
			}
		},
		/**
		 * 显示系统管理人员
		 */
		showAdmin : function(){
			if (this.getSelectionModel().getSelected()==null){
				Ext.Msg.alert('提示', '请先选择系统管理人员！');
				Km.Admin.Config.View.IsShow=0;
				this.tvpView.toggle(false);
				return ;
			}
			if (Km.Admin.Config.View.IsFix==0){
				if (Km.Admin.View.Running.view_window==null){
					Km.Admin.View.Running.view_window=new Km.Admin.View.AdminView.Window();
				}
				if (Km.Admin.View.Running.view_window.hidden){
					Km.Admin.View.Running.view_window.show();
					Km.Admin.View.Running.view_window.winTabs.hideTabStripItem(Km.Admin.View.Running.view_window.winTabs.tabFix);
					this.updateViewAdmin();
					this.tvpView.toggle(true);
					Km.Admin.Config.View.IsShow=1;
				}else{
					this.hideAdmin();
					Km.Admin.Config.View.IsShow=0;
				}
				return;
			}
			switch(Km.Admin.Config.View.Direction){
				case 1:
					if (!this.ownerCt.north.items.contains(Km.Admin.View.Running.viewTabs)){
						this.ownerCt.north.add(Km.Admin.View.Running.viewTabs);
					}
					break;
				case 2:
					if (!this.ownerCt.south.items.contains(Km.Admin.View.Running.viewTabs)){
						this.ownerCt.south.add(Km.Admin.View.Running.viewTabs);
					}
					break;
				case 3:
					if (!this.ownerCt.west.items.contains(Km.Admin.View.Running.viewTabs)){
						this.ownerCt.west.add(Km.Admin.View.Running.viewTabs);
					}
					break;
				case 4:
					if (!this.ownerCt.east.items.contains(Km.Admin.View.Running.viewTabs)){
						this.ownerCt.east.add(Km.Admin.View.Running.viewTabs);
					}
					break;
			}
			this.hideAdmin();
			if (Km.Admin.Config.View.IsShow==0){
				Km.Admin.View.Running.viewTabs.enableCollapse();
				switch(Km.Admin.Config.View.Direction){
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
				this.updateViewAdmin();
				this.tvpView.toggle(true);
				Km.Admin.Config.View.IsShow=1;
			}else{
				Km.Admin.Config.View.IsShow=0;
			}

			this.ownerCt.doLayout();
		},
		/**
		 * 隐藏系统管理人员
		 */
		hideAdmin : function(){
			this.ownerCt.north.hide();
			this.ownerCt.south.hide();
			this.ownerCt.west.hide();
			this.ownerCt.east.hide();
			if (Km.Admin.View.Running.view_window!=null){
				Km.Admin.View.Running.view_window.hide();
			}
			this.tvpView.toggle(false);
			this.ownerCt.doLayout();
		},
		/**
		 * 更新当前系统管理人员显示信息
		 */
		updateViewAdmin : function() {
			if (Km.Admin.View.Running.view_window!=null){
				Km.Admin.View.Running.view_window.winTabs.tabAdminDetail.update(this.getSelectionModel().getSelected().data);
			}
			Km.Admin.View.Running.viewTabs.tabAdminDetail.update(this.getSelectionModel().getSelected().data);
		},
		/**
		 * 新建系统管理人员
		 */
		addAdmin : function() {
			if (Km.Admin.View.Running.edit_window==null){
				Km.Admin.View.Running.edit_window=new Km.Admin.View.EditWindow();
			}
            //创建权限选择容器以容纳权限角色Checkboxes
            if (!Km.Admin.View.UserRoleView.userRoleFieldset){
                Km.Admin.View.UserRoleView.createuserRoleContainer();
            }
            //添加进edit_window.editForm
            var form=Km.Admin.View.Running.edit_window.editForm;
            var fieldset = Km.Admin.View.UserRoleView.userRoleFieldset;
            form.add(fieldset);
            //重新布局
            Km.Admin.View.Running.edit_window.doLayout();

            Km.Admin.View.Running.edit_window.roletype.show();
            Km.Admin.View.Running.edit_window.resetBtn.setVisible(false);
			Km.Admin.View.Running.edit_window.saveBtn.setText('保 存');
			Km.Admin.View.Running.edit_window.setTitle('添加系统管理人员');
			Km.Admin.View.Running.edit_window.savetype=0;
			Km.Admin.View.Running.edit_window.admin_id.setValue("");
            var passwordObj=Km.Admin.View.Running.edit_window.password;
            passwordObj.allowBlank=false;
            if (passwordObj.getEl()) passwordObj.getEl().dom.parentNode.previousSibling.innerHTML ="密码(<font color=red>*</font>)";

			//Km.Admin.View.Running.edit_window.sp_name.hide();供货商
			Km.Admin.View.Running.edit_window.show();
			Km.Admin.View.Running.edit_window.maximize();
		},
		/**
		 * 编辑系统管理人员时先获得选中的系统管理人员信息
		 */
		updateAdmin : function() {
			if (Km.Admin.View.Running.edit_window==null){
				Km.Admin.View.Running.edit_window=new Km.Admin.View.EditWindow();
			}
            //创建权限选择容器以容纳权限角色Checkboxes
            if (!Km.Admin.View.UserRoleView.userRoleFieldset){
                Km.Admin.View.UserRoleView.createuserRoleContainer();
            }
            //添加进edit_window.editForm
            var form=Km.Admin.View.Running.edit_window.editForm;
            var fieldset = Km.Admin.View.UserRoleView.userRoleFieldset;
            form.add(fieldset);
            //重新布局
            Km.Admin.View.Running.edit_window.doLayout();

            var admin=Km.Admin.View.Running.adminGrid.getSelectionModel().getSelected().data;
            if(admin.roletype==0){
                Km.Admin.View.Running.edit_window.roletype.hide();
            }else{
                Km.Admin.View.Running.edit_window.roletype.show();
            }
            Km.Admin.View.Running.edit_window.savetype=1;
			Km.Admin.View.Running.edit_window.saveBtn.setText('修 改');
			Km.Admin.View.Running.edit_window.resetBtn.setVisible(true);
			Km.Admin.View.Running.edit_window.setTitle('修改系统管理人员');
            var record=this.getSelectionModel().getSelected();
			var record=this.getSelectionModel().getSelected();
            /*供货商    if (!record.data.roleid){
				Km.Admin.View.Running.edit_window.sp_name.hide();
			}else{
				Km.Admin.View.Running.edit_window.sp_name.show();
			}*/
			Km.Admin.View.Running.edit_window.editForm.form.loadRecord(record);
            Km.Admin.View.Running.edit_window.departmentunit.setValue(admin.department_name);
			Km.Admin.View.Running.edit_window.savetype=1;

			Km.Admin.View.Running.edit_window.show();

            var passwordObj=Km.Admin.View.Running.edit_window.password;
            passwordObj.allowBlank=true;
            if (passwordObj.getEl())passwordObj.getEl().dom.parentNode.previousSibling.innerHTML ="密码";
            Km.Admin.View.Running.edit_window.password_old.setValue(Km.Admin.View.Running.edit_window.password.getValue());
            Km.Admin.View.Running.edit_window.password.setValue("");

			Km.Admin.View.Running.edit_window.maximize();
		},
		/**
		 * 删除系统管理人员
		 */
		deleteAdmin : function() {
			Ext.Msg.confirm('提示', '确实要删除所选的系统管理人员吗?', this.confirmDeleteAdmin,this);
		},
		/**
		 * 确认删除系统管理人员
		 */
		confirmDeleteAdmin : function(btn) {
			if (btn == 'yes') {
				var del_admin_ids ="";
				var selectedRows    = this.getSelectionModel().getSelections();
				for ( var flag = 0; flag < selectedRows.length; flag++) {
					del_admin_ids=del_admin_ids+selectedRows[flag].data.admin_id+",";
				}
				ExtServiceAdmin.deleteByIds(del_admin_ids);
				this.doSelectAdmin();
				Ext.Msg.alert("提示", "删除成功！");
			}
		},
		/**
		 * 导出系统管理人员
		 */
		exportAdmin : function() {
			ExtServiceAdmin.exportAdmin(this.filter,function(provider, response) {
				if (response.result.data) {
					window.open(response.result.data);
				}
			});
		},
		/**
		 * 导入系统管理人员
		 */
		importAdmin : function() {
			if (Km.Admin.View.current_uploadWindow==null){
				Km.Admin.View.current_uploadWindow=new Km.Admin.View.UploadWindow();
			}
			Km.Admin.View.current_uploadWindow.show();
		},
        /**
         * 清空checkbox
         */
        clearcheckbox : function() {
            //清空fieldset头部checkbox和内部checkbox
            for(var i=0;i<authorityxml.length;i++){
                var operation=authorityxml[i];
                var menuid=operation.id+"checkall";
                var fieldsetid=operation.id+"_fieldset";
                var inputid=Ext.get(fieldsetid).child("input[name="+menuid+"]");
                Ext.get(inputid.id).dom.checked=false;
                for(var j=0;j<operation.operations.length;j++){
                    var operationid=operation.operations[j].gridname+"_"+operation.operations[j].id;
                    Ext.getCmp(operationid).setValue(false);
                }
            }
            //清空左侧全选菜单checkbox和右侧菜单checkbox
            for(var i=0;i<xml.length;i++){
                var authority=xml[i];
                Ext.getCmp(authority.id).setValue(false);
                for(var j=0;j<authority.menus.length;j++){
                    var authorityid=authority.menus[j].id;
                    Ext.getCmp(authorityid).setValue(false);
                }
            }
        },
        /**
         * 根据选中数据行勾选checkbox
         */
        selectcheckbox : function() {
            //勾选菜单checkbox
            var seldata=Km.Admin.View.Running.adminGrid.getSelectionModel().getSelected().data;
            //权限字符串
            var authority=seldata.authority;
            //操作字符串
            var operation=seldata.operation;
            var menus=authority.split("-");
            var operations=operation.split("-");
            for(var i=0;i<menus.length;i++){
                var menuid=menus[i];
                if(menuid){
                    Ext.getCmp(menuid).setValue(true);
                }
            }
            for(var i=0;i<operations.length;i++){
                var operationid=operations[i];
                if(operationid){
                    Ext.getCmp(operationid).setValue(true);
                }
            }
        }
	}),
	/**
	 * 核心内容区
	 */
	Panel:Ext.extend(Ext.form.FormPanel,{
		constructor : function(config) {
			Km.Admin.View.Running.adminGrid=new Km.Admin.View.Grid();
			if (Km.Admin.Config.View.IsFix==0){
				Km.Admin.View.Running.adminGrid.tvpView.menu.mBind.setChecked(false,true);
			}
			config = Ext.apply({
				region : 'center',layout : 'fit', frame:true,
				items: {
					layout:'border',
					items:[
						Km.Admin.View.Running.adminGrid,
						{region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Admin.View.Running.viewTabs]},
						{region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
						{region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
					]
				}
			}, config);
			Km.Admin.View.Panel.superclass.constructor.call(this, config);
		}
	}),
	/**
	 * 当前运行的可视化对象
	 */
	Running:{
		/**
		 * 当前系统管理人员Grid对象
		 */
		adminGrid:null,

		/**
		 * 显示系统管理人员信息及关联信息列表的Tab页
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
	Ext.state.Manager.setProvider(Km.Admin.Cookie);
	Ext.Direct.addProvider(Ext.app.REMOTING_API);
	Km.Admin.Init();
	/**
	 * 系统管理人员数据模型获取数据Direct调用
	 */
	Km.Admin.Store.adminStore.proxy=new Ext.data.DirectProxy({
		api: {read:ExtServiceAdmin.queryPageAdmin}
	});
	/**
	 * 系统管理人员页面布局
	 */
	Km.Admin.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [new Km.Admin.View.Panel()]
	});
	Km.Admin.Viewport.doLayout();
	setTimeout(function(){
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
			remove:true
		});
	}, 250);
});
