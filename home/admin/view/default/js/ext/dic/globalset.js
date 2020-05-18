Ext.namespace("Kmall.Admin.Globalset");
Km = Kmall.Admin;
Km.Globalset={
  /**
   * 全局配置
   */
  Config:{
  /**
   *分页:每页显示记录数
   */  
  PageSize:10,
  /**
   * 在线编辑器类型。
   * 1:CkEditor,2:KindEditor,3:xhEditor
   * 配合Action的变量配置$online_editor
   */
  OnlineEditor:1
  },
  /**
   * 初始化
   */
  Init:function(){
  if (Ext.util.Cookies.get('operator')!=null){
    Km.Globalset.Config.Operator=Ext.util.Cookies.get('operator');
  }
  if (Ext.util.Cookies.get('OnlineEditor')!=null){
    Km.Globalset.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
  }
  }
}; 

/**
 * Model:数据模型   
 */
Km.Globalset.Store = { 
  /**
   * 会员
   */
  configStore : new Ext.data.Store({
  reader: new Ext.data.JsonReader({
    successProperty: 'success',
    root: 'data',
    remoteSort: true,
    autoLoad: true,
    fields : [
    {name: 'title', type: 'string'}, 
    {name: 'logo', type: 'string'}, 
    {name: 'shopurl', type: 'string'}, 
    {name: 'ordercheck', type: 'string'}, 
    {name: 'orderconfirm', type: 'string'}, 
    {name: 'smsurl', type: 'string'}, 
    {name: 'smsuname', type: 'string'},  
    {name: 'smsupswd', type: 'string'} , 
    {name: 'emailhost', type: 'string'} , 
    {name: 'emailport', type: 'string'} , 
    {name: 'emailuname', type: 'string'} , 
    {name: 'emailpswd', type: 'string'}  ,
    {name: 'emailaddress', type: 'string'}  
    ]
  }),
  writer: new Ext.data.JsonWriter({
    encode: false
  })
  })
};

/**
 * View:全局配置列表   
 */
Km.Globalset.View={  
  /**
   * 编辑窗口：全局配置
   */  
  EditWindow:Ext.extend(Ext.Window,{
    constructor : function(config) { 
      config = Ext.apply({    
        title:'全局配置',constrainHeader:true,collapsible: true,closable:false,
        plain:true,buttonAlign:'center',width:'100%',minWidth:600,autoScroll : true,
        defaults : {autoScroll : true, width: '100%'},
        listeners:{
          beforehide:function(){},
          render:function(){}
        },
        items:[
          new Ext.form.FormPanel({
              ref:'editForm',layout:'form',fileUpload: true,
              labelWidth : 140,labelAlign : "center",
              bodyStyle : 'padding:5px 5px 0',align : "center",
              api : {},
              defaults : {
                xtype: 'fieldset',
                style: 'background:white;margin:20px 5px 20px 10px;',
                width: '97%'
            },
            items : [
              {
                ref:'baseset',title: '基本设置',height: 120,
                defaults : {anchor: '68%', width:'68%', xtype : 'textfield'},
                items: [
                  {fieldLabel: '网站标题',name: 'title'},
                  {fieldLabel : '网站logo',name:'logo',xtype:'fileuploadfield',emptyText: '请上传网站logo图片文件',buttonText: '',accept:'image/*',buttonCfg: {iconCls: 'upload-icon'}},
                  {fieldLabel: '网店网址',name: 'shopurl'}
                ]  
              },
              {
                ref:'orderset',title: '订单设置',height: 90,
                defaults : {xtype : 'radiogroup'},
                items: [
                  {
                    fieldLabel: '是否审核',
                    defaults : {width:100},
                    items: [
                      {items: [{boxLabel: '不需要审核', name: 'ordercheck', inputValue: 0,checked: true}] },
                      {items: [{boxLabel: '需要审核', name: 'ordercheck', inputValue: 1}] }
                    ]
                  },
                  {
                    fieldLabel: '是否确认',
                     defaults : {width:100},
                    items: [
                      {items: [{boxLabel: '不需要确认', name: 'orderconfirm', inputValue: 0,checked: true} ] },
                      {items: [{boxLabel: '需要确认', name: 'orderconfirm', inputValue: 1} ] }
                    ]
                  }
                ]
              },
              {
                ref:'smsset',title: '短信设置',height: 120,
                defaults : {anchor: '68%', width:'68%', xtype : 'textfield'},
                items: [
                  {fieldLabel: '短信服务器地址',name: 'smsurl'},
                  {fieldLabel: '短信服务器用户名',name: 'smsuname'},
                  {fieldLabel: '短信服务器用户密码',name: 'smsupswd'}
                ]
              },
              {
                ref:'emailset',title: '邮箱设置',height: 180,
                defaults : {anchor: '68%', width:'68%', xtype : 'textfield'},
                items: [
                  {fieldLabel: '电子邮箱服务器地址',name: 'emailhost'},
                  {fieldLabel: '电子邮箱服务器端口',name: 'emailport'},
                  {fieldLabel: '电子邮箱账户名',name: 'emailuname'},
                  {fieldLabel: '电子邮箱密码',name: 'emailpswd'},
                  {fieldLabel: '邮件发件人地址',name: 'emailaddress'}
                ]
              }
            ]
          })
        ],
        tbar:{},
        buttons : [
          { 
            text: "保存",ref : "../saveBtn",scope:this,
            handler : function() {
            if (!this.editForm.getForm().isValid()) {
              return;
            }
            editWindow=this;

            this.editForm.api.submit=ExtServiceGlobalSet.updateconfig;
            this.editForm.getForm().submit({
              success : function(form, action) {
                Ext.Msg.alert("提示", "保存成功！");
              },
              failure : function(form, action) {
                Ext.Msg.alert('提示', '保存失败');
              }
            });
            }
          }, 
          {
            text : "重 置",scope:this,
            handler : function() {  
              Km.Globalset.View.doLoadConfig();
            }
          }
        ]  
      }, config);
      Km.Globalset.View.doLoadConfig();
      Km.Globalset.View.EditWindow.superclass.constructor.call(this, config);
    }
  }
  ),
  doLoadConfig:function(){    
    //获取全局变量给form各项赋值
    ExtServiceGlobalSet.loadconfig('',function(provider, response) {
    if (response.result.success==true) { 
      var datas=response.result.data;
      var edit=Km.Globalset.View.Running.edit_window.editForm.getForm();
      for(var item in datas){
        edit.findField(item).setValue(datas[item]);
      }
    }
    });      
  },
  /**
   * 当前运行的可视化对象
   */ 
  Running:{   
  /**
   * 当前创建的编辑窗口
   */
  edit_window:null
  }  
};

/**
 * Controller:主程序
 */
Ext.onReady(function(){
  Ext.QuickTips.init();
  Ext.Direct.addProvider(Ext.app.REMOTING_API);   
  Km.Globalset.Init();  
  /**
   * 商品数据模型获取数据Direct调用
   */
  Km.Globalset.Store.configStore.proxy=new Ext.data.DirectProxy({
    api: {read:ExtServiceGlobalSet.loadconfig}
  });

  if (Km.Globalset.View.Running.edit_window==null){   
    Km.Globalset.View.Running.edit_window=new Km.Globalset.View.EditWindow(); 
  }   
  if (Km.Globalset.View.Running.edit_window){  
    Km.Globalset.View.Running.edit_window.show();   
    Km.Globalset.View.Running.edit_window.maximize();  
  }  
    
  setTimeout(function(){
    Ext.get('loading').remove();
    Ext.get('loading-mask').fadeOut({
     remove:true
    });
  }, 250);
});  
