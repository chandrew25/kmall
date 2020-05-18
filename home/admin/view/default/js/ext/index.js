Ext.namespace("Kmall.Admin"); 
Km = Kmall.Admin;
Km.Config={
	/**
	 * 访问历史记录的组件标识分割符
	 */
	TokenDelimiter:':',
	/**
	 * 操作者 
	 */
	Operator:'',
	/**
	 * 角色类型 
	 */
	Roletype:'',
    /**
     * 在线编辑器类型。
     * 1:CkEditor,2:KindEditor,3:xhEditor,4:UEditor
     * 配合Action的变量配置$online_editor
     */
    OnlineEditor:4, 
	/**
	 * 提供第三方公用使用的窗口，一个应用只有一个这样的窗口 
	 */
	ViewOnlyWindow:null,       
    /**
     * 头部可定制 
     */
    HeaderPanel:null,
	/**
	 * 初始化
	 */
	Init:function(){
		if (Ext.util.Cookies.get('OnlineEditor')!=null){
			Km.Config.OnlineEditor=Ext.util.Cookies.get('OnlineEditor');
		}
		if (Ext.util.Cookies.get('operator')!=null){
			Km.Config.Operator=Ext.util.Cookies.get('operator');
		}
		if (Ext.util.Cookies.get('roletype')!=null){
			Km.Config.Roletype=Ext.util.Cookies.get('roletype');
		}
		if (Ext.util.Cookies.get('admin_id')!=null){
			Km.Config.Admin_id=Ext.util.Cookies.get('admin_id');
		}
	}
}
Ext.onReady(function() {
	Ext.QuickTips.init();  
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());  
	Km.Config.Init();
	Km.Config.HeaderPanel=Km.Layout.HeaderPanel; 
	if ((Km.Config.Roletype=='6')){
		Km.Config.HeaderPanel=Km.Layout.HeaderPanelNormal;
	}
	Km.Viewport = new Ext.Viewport({
		layout : 'border',
		items : [Km.Config.HeaderPanel,Km.Layout.LeftPanel, Km.Layout.CenterPanel]
	});
	Km.Layout.Init();     
	Km.Viewport.doLayout();
	setTimeout(function() {
		Ext.get('loading').remove();
		Ext.get('loading-mask').fadeOut({
					remove : true
				});
	}, 250);
	
	// The only requirement for this to work is that you must have a hidden field and
	// an iframe available in the page with ids corresponding to Ext.History.fieldId
	// and Ext.History.iframeId.
	Ext.History.init();    
	
	// Handle this change event in order to restore the UI to the appropriate history state
	Ext.History.on('change', function(token){
		if(token){
			var parts = token.split(Km.Config.TokenDelimiter);
			var tabPanel = Ext.getCmp(parts[0]);
			var tabId = parts[1];
			tabPanel.show();
			tabPanel.setActiveTab(tabId);
		}
	});
});    