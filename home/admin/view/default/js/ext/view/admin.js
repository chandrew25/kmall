Ext.namespace("Km.Admin.View.Admin");
KmView = Km.Admin.View;
KmView.Admin={};
/**
 * View:系统管理人员显示组件   
 */
KmView.Admin.View={ 
	/**
	 * 视图：产品图片视图
	 */
	AdminView:Ext.extend(parent.Ext.Panel, {	
		constructor : function(config) {
			config = Ext.apply({
				headerAsText : false,autoScroll : true,ref:'dataview',
				defaults : {autoScroll : true},
//				tpl: [
//					  '<table class="viewdoblock">', 
//						 '<tr class="entry"><td class="head">用户名</td><td class="content">{username}</td></tr>',
//						 '<tr class="entry"><td class="head">真实姓名</td><td class="content">{realname}</td></tr>',
//						 '<tr class="entry"><td class="head">扮演角色</td><td class="content">{roletypeShow}</td></tr>',  
//						 '<tr class="entry"><td class="head">视野</td><td class="content">{seescope}</td></tr>',
//					 '</table>' 
//				],
                items:[
                    new parent.Ext.form.FormPanel({   
                        ref:'editForm',layout:'form',
                        labelWidth : 80,labelAlign : "center",
                        bodyStyle : 'padding:5px 5px 0',align : "center",
                        api : {},
                        defaults : {
                            xtype : 'displayfield',anchor:'50%'
                        },                       
                        items : [
                            {fieldLabel : '用户ID',name : 'admin_id',ref:'../admin_id',xtype:'hidden'},
                            {fieldLabel : '用户名',name : 'username',ref:'../username'},
                            {fieldLabel : '真实姓名',name : 'realname',ref:'../realname'},
                            {fieldLabel : '扮演角色',name : 'roletypeShow',ref:'../roletypeShow'},
                            {fieldLabel : '视野',name : 'seescope',ref:'../seescope'},
                            {fieldLabel : '密码',name : 'password',inputType: 'password',ref:'../realname',xtype:'textfield',allowBlank:false}
                        ]
                    })                
                ]
			}, config);
			KmView.Admin.View.AdminView.superclass.constructor.call(this, config); 
		}
	}),
	/**
	 * 窗口:显示系统管理人员信息
	 */
	Window:Ext.extend(parent.Ext.Window,{ 
		constructor : function(config) { 
			config = Ext.apply({
				title:"查看管理员信息",constrainHeader:true,maximizable: true,
				width : 605,height:350,minWidth:450,minHeight:300,
				layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
				collapsible: true,//closeAction : "hide",modal:true,
				items:[new KmView.Admin.View.AdminView()],
				listeners: {
					hide:function(w){if (parent.Km.Config){parent.Km.Config.ViewOnlyWindow=null;}/**parent.Ext.getBody().unmask();*/}   
				},
				buttons: [{
					text: '确认',scope:this,handler:function() {KmView.Admin.Function.confirm();}
				},{
					text: '关闭',scope:this,handler:function() {this.hide();}
				}]
			}, config);  
			KmView.Admin.View.Window.superclass.constructor.call(this, config);   
		}        
	})
};

KmView.Admin.Function={
	confirm:function(){
        //新建admin tab页
//		var targeturl="index.php?go=admin.member.admin";
//		if (parent.Km){
//			parent.Km.Navigation.addTabByUrl(parent.Ext.getCmp('centerPanel'),'系统管理人员',targeturl,"admin"); 
//		}else{
//			window.open(targeturl);
//		}
        var form=KmView.Admin.ViewAdminWindow.dataview.editForm;
        if (!form.getForm().isValid()) {
            return;
        }
        var editWindow=KmView.Admin.ViewAdminWindow;
        form.api.submit=ExtServiceAdmin.revisePwd;
        form.getForm().submit({
            success : function(form, action) {                                                  
                parent.Ext.Msg.alert("提示", "保存成功！");
                form.reset();
                editWindow.hide();
            },
            failure : function(form, action) {
                parent.Ext.Msg.alert('提示', '失败！');
            }
        });
	}
}

/**
 * Controller:主程序
 */
Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.Direct.addProvider(Ext.app.REMOTING_API);     
	var admin_param=Ext.urlDecode(window.location.search.substring(1));
	var ow=false;
	if (admin_param&&admin_param.admin_id) admin_id=admin_param.admin_id;
	if (admin_param&&admin_param.ow) ow=admin_param.ow.length==4?true:false;
	if(typeof(admin_id)=="undefined"){Ext.Msg.alert('提示', '无符合查询条件的系统管理人员！');return;}
	
	if ((ow==false)||(parent.Km.Config==null)||(parent.Km.Config.ViewOnlyWindow==null)){
		KmView.Admin.ViewAdminWindow = new KmView.Admin.View.Window();
		if ((ow==true)&&parent.Km.Config)parent.Km.Config.ViewOnlyWindow=KmView.Admin.ViewAdminWindow;
	} else {
		if (parent.Km.Config.ViewOnlyWindow.title=="查看管理员信息"){
			KmView.Admin.ViewAdminWindow=parent.Km.Config.ViewOnlyWindow; 
		}else{
			KmView.Admin.ViewAdminWindow = new KmView.Admin.View.Window();
			if ((ow==true)&&parent.Km.Config)parent.Km.Config.ViewOnlyWindow=KmView.Admin.ViewAdminWindow;
		}
	}
	if (KmView.Admin.ViewAdminWindow){
		KmView.Admin.ViewAdminWindow.show();
		//parent.Ext.getBody().mask();
		ExtServiceAdmin.viewAdmin(admin_id,function(provider, response) {   
			if (response.result.data){
                KmView.Admin.ViewAdminWindow.dataview.editForm.form.loadRecord(response.result);
            }else {
				KmView.Admin.ViewAdminWindow.dataview.editForm.form.loadRecord("");                        
				Ext.Msg.alert('提示', '无符合查询条件的系统管理人员！');
			}
		});
	}
});     