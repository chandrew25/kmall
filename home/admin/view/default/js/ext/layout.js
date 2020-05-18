Ext.namespace("Kmall.Admin");
Km = Kmall.Admin;
/**
 * 页面布局格局
 */
Km.Layout=
{
    /**
     * 页面头部-普通角色
     */
    HeaderPanelNormal : new Ext.Panel({
        region : 'north',contentEl : 'header',id:'header-panel',
        header:false,collapsible : true,collapseMode : 'mini',
        split:true,layout : 'fit',height : 27*3,
        tbar:{
            xtype : 'container',layout : 'anchor',
            height : 27*3,style:'font-size:14px',
            items : [
                new Ext.Toolbar({
                    height : 27,
                    ref:'menus',
                    items:[
                        {text: '', ref:'../../file',iconCls : 'logo',
                            menu: {
                                xtype:'menu',items: [
                                  /*{text:'新建',handler:function(){}},
                                    {text:'导入',handler:function(){}},
                                    {text:'导出',handler:function(){}},*/
                                    {text:'关闭所有',handler:function(){
                                        Km.Layout.CenterPanel.tabCloseMenu.onCloseAll();
                                    }}, '-',
                                    {text: '退出',iconCls : 'icon-quit',ref:'exit',handler:function(){
                                        window.location.href="index.php?go=admin.index.logout";
                                    }}
                                ]
                            }
                        },{text: '显示', ref:'../../view',iconCls : 'page',handler:function(){
                                if(window.outerHeight==screen.height && window.outerWidth==screen.width){
                                    Km.Layout.HeaderPanelNormal.view.menu.full.setChecked(true);
                                }else{
                                    Km.Layout.HeaderPanelNormal.view.menu.full.setChecked(false);
                                }
                            },menu: {
                                xtype:'menu',items: [
                                    '-',
                                    {text:'工具栏',checked:true,ref:'toolbar',checkHandler:function(){
                                        if (Km.Layout.HeaderPanelNormal.view.menu.toolbar.checked){
                                            Km.Layout.HeaderPanelNormal.topToolbar.toolbar.show();
                                            Km.Layout.HeaderPanelNormal.topToolbar.setHeight(27*3);
                                            Km.Layout.HeaderPanelNormal.setHeight(27*3);
                                        }else{
                                            Km.Layout.HeaderPanelNormal.topToolbar.toolbar.hide();
                                            Km.Layout.HeaderPanelNormal.topToolbar.setHeight(27);
                                            Km.Layout.HeaderPanelNormal.setHeight(27);
                                        }
                                        Km.Layout.HeaderPanelNormal.syncHeight();
                                        Km.Viewport.doLayout();
                                    }},
                                    {text:'导航栏',checked:true,ref:'nav',checkHandler:function(){
                                        if (Km.Layout.HeaderPanelNormal.view.menu.nav.checked){
                                            Km.Layout.LeftPanel.expand();
                                        }else{
                                            Km.Layout.LeftPanel.collapse();
                                        }
                                    }},
                                    {text:'在线编辑器',ref:'onlineditor',menu:{
                                        items: [{
                                            text: '默认【UEditor】',
                                            checked: true,value:"4",
                                            group: 'onlineditor',
                                            checkHandler: function(item, checked){Km.Layout.Function.onOnlineditorCheck(item, checked);}
                                        },{
                                            text: 'ckEditor',
                                            checked: true,value:"1",
                                            group: 'onlineditor',
                                            checkHandler: function(item, checked){Km.Layout.Function.onOnlineditorCheck(item, checked);}
                                        },{
                                            text: 'KindEditor',
                                            checked: false,value:"2",
                                            group: 'onlineditor',
                                            checkHandler: function(item, checked){Km.Layout.Function.onOnlineditorCheck(item, checked);}
                                        }, {
                                            text: 'xHeditor',
                                            checked: false,value:"3",
                                            group: 'onlineditor',
                                            checkHandler: function(item, checked){Km.Layout.Function.onOnlineditorCheck(item, checked);}
                                        }]
                                    }},
                                    '-',
                                    {text: '全屏  [F11]',checked:false,ref:'full',checkHandler:function(){
                                        Km.Layout.Function.FullScreen();
                                    }}
                                ]
                            }
                        },{text: '产品', ref:'../../goods',iconCls : 'page',
                            menu: {
                                xtype:'menu',items: [
                                    {text:'入库',ref:'addGoods',handler:function(){
                                        Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"产品入库","index.php?go=admin.storage.addGoods","addGoods");
                                    }},
                                    {text:'出库',ref:'outGoods',handler:function(){
                                        Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"产品出库","index.php?go=admin.storage.outGoods","outGoods");
                                    }},
                                    {text:'管理',ref:'goods',handler:function(){
                                        Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"产品管理","index.php?go=admin.storage.warehousegoods","warehousegoods");
                                    }},
                                    {text:'明细',ref:'goodslog',handler:function(){
                                        Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"库存明细","index.php?go=admin.log.goodslog","goodslog");
                                    }}
                                ]
                            }
                        },{text: '日志', ref:'../../log',iconCls : 'page',
                            menu: {
                                xtype:'menu',items: [
                                    {text: '合同日志',ref:'contractlog',handler:function(){
                                        Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,Km.Layout.HeaderPanelNormal.log.menu.contractlog.text,"index.php?go=admin.log.contractlog","contractlog");
                                    }}
                                ]
                            }
                        },'-',{text: '退出', iconCls : 'icon-quit',ref:'../../exit',handler:function(){
                            window.location.href="index.php?go=admin.index.logout";
                        }},new Ext.Toolbar.Fill(),'-',{text: "",ref:'../../operator',handler:function(){
                            Km.Layout.Function.OpenWindow("index.php?go=admin.view.admin&admin_id="+Km.Config.Admin_id);
                        }}]
                }),
                new Ext.Toolbar({
                    height:54,ref:'toolbar',
                    items : [
                        {xtype: 'buttongroup',title: '产品管理',columns: 4,defaults: {scale: 'small'},
                         items: [{text: '入库',iconCls: 'page',ref:"../addGoods",handler:function(){
                                Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"产品入库","index.php?go=admin.storage.addGoods","addGoods");
                            }},
                            {text: '出库',iconCls: 'page',ref:"../outGoods",handler:function(){
                                Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"产品出库","index.php?go=admin.storage.outGoods","outGoods");
                            }},
                            {text: '管理',iconCls: 'page',ref:"../goods",handler:function(){
                                Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"产品管理","index.php?go=admin.storage.warehousegoods","warehousegoods");
                            }},
                            {text: '明细',iconCls: 'page',ref:"../goodsLog",handler:function(){
                                Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"库存明细","index.php?go=admin.log.goodsLog","goodsLog");
                            }}
                         ]}]
                })
          ]}
    }),
    /**
     * 页面头部
     */
    HeaderPanel : new Ext.Panel({
        region : 'north',contentEl : 'header',id:'header-panel',
        header:false,collapsible : true,collapseMode : 'mini',
        split:true,layout : 'fit',height : 27*3,
        tbar:{
            xtype : 'container',layout : 'anchor',
            height : 27*3,style:'font-size:14px',
            items : [
                new Ext.Toolbar({
                    height : 27,
                    ref:'menus',
                    items:[
                        {text: '', ref:'../../file',iconCls : 'logo',
                            menu: {
                                xtype:'menu',items: [
                                  /*{text:'新建',handler:function(){}},
                                    {text:'导入',handler:function(){}},
                                    {text:'导出',handler:function(){}},*/
                                    {text:'关闭所有',handler:function(){
                                        Km.Layout.CenterPanel.tabCloseMenu.onCloseAll();
                                    }}, '-',
                                    {text: '退出',iconCls : 'icon-quit',ref:'exit',handler:function(){
                                        window.location.href="index.php?go=admin.index.logout";
                                    }}
                                ]
                            }
                        },{text: '显示', ref:'../../view',iconCls : 'page',handler:function(){
                                if(window.outerHeight==screen.height && window.outerWidth==screen.width){
                                    Km.Layout.HeaderPanel.view.menu.full.setChecked(true);
                                }else{
                                    Km.Layout.HeaderPanel.view.menu.full.setChecked(false);
                                }
                            },menu: {
                                xtype:'menu',items: [
                                    '-',
                                    {text:'工具栏',checked:true,ref:'toolbar',checkHandler:function(){
                                        if (Km.Layout.HeaderPanel.view.menu.toolbar.checked){
                                            Km.Layout.HeaderPanel.topToolbar.toolbar.show();
                                            Km.Layout.HeaderPanel.topToolbar.setHeight(27*3);
                                            Km.Layout.HeaderPanel.setHeight(27*3);
                                        }else{
                                            Km.Layout.HeaderPanel.topToolbar.toolbar.hide();
                                            Km.Layout.HeaderPanel.topToolbar.setHeight(27);
                                            Km.Layout.HeaderPanel.setHeight(27);
                                        }
                                        Km.Layout.HeaderPanel.syncHeight();
                                        Km.Viewport.doLayout();
                                    }},
                                    {text:'导航栏',checked:true,ref:'nav',checkHandler:function(){
                                        if (Km.Layout.HeaderPanel.view.menu.nav.checked){
                                            Km.Layout.LeftPanel.expand();
                                        }else{
                                            Km.Layout.LeftPanel.collapse();
                                        }
                                    }},
                                    {text:'在线编辑器',ref:'onlineditor',menu:{
                                        items: [ {
                                            text: '默认【UEditor】',
                                            checked: true,value:"4",
                                            group: 'onlineditor',
                                            checkHandler: function(item, checked){Km.Layout.Function.onOnlineditorCheck(item, checked);}
                                        },{
                                            text: 'ckEditor',
                                            checked: true,value:"1",
                                            group: 'onlineditor',
                                            checkHandler: function(item, checked){Km.Layout.Function.onOnlineditorCheck(item, checked);}
                                        },{
                                            text: 'KindEditor',
                                            checked: false,value:"2",
                                            group: 'onlineditor',
                                            checkHandler: function(item, checked){Km.Layout.Function.onOnlineditorCheck(item, checked);}
                                        }, {
                                            text: 'xHeditor',
                                            checked: false,value:"3",
                                            group: 'onlineditor',
                                            checkHandler: function(item, checked){Km.Layout.Function.onOnlineditorCheck(item, checked);}
                                        }]
                                    }},
                                    '-',
                                    {text: '全屏  [F11]',checked:false,ref:'full',checkHandler:function(){
                                        Km.Layout.Function.FullScreen();
                                    }}
                                ]
                            }
                        },{text: '订单', ref:'../../order',iconCls : 'page',
                            menu: {
                                xtype:'menu',items: [
                                    {text:'创建',handler:function(){
                                        new Km.Order.View.EditWindow().show();
                                    }},
                                    {text:'确认',handler:function(){
                                        Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"订单确认","index.php?go=admin.shop.order&status=active","orderConfirm");
                                    }},
                                    {text:'发货',handler:function(){
                                        Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"订单发货","index.php?go=admin.shop.order&ship_status=0","orderSend"); }},
                                    {text:'付款',handler:function(){
                                        Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"订单收款","index.php?go=admin.shop.order&pay_status=0","orderMoney");
                                    }}
                                ]
                            }
                        },{text: '日志', ref:'../../log',iconCls : 'page',
                            menu: {
                                xtype:'menu',items: [
                                    {text:'收发货记录',ref:'deliverylog',handler:function(){
                                        Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,Km.Layout.HeaderPanel.log.menu.deliverylog.text,"index.php?go=admin.log.deliverylog","deliverylog");
                                    }},
                                    {text:'订单日志',ref:'orderlog',handler:function(){
                                        Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,Km.Layout.HeaderPanel.log.menu.orderlog.text,"index.php?go=admin.log.orderlog","orderlog");
                                    }},
                                    {text:'收退款记录',ref:'paylog',handler:function(){
                                        Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,Km.Layout.HeaderPanel.log.menu.paylog.text,"index.php?go=admin.log.paylog","paylog");
                                    }}
                                ]
                            }
                        },'-',{text: '退出', iconCls : 'icon-quit',ref:'../../exit',handler:function(){
                            window.location.href="index.php?go=admin.index.logout";
                        }},new Ext.Toolbar.Fill(),
                        {
                            text: "",name:'info',id:'number_show',ref:'../../info',xtype:'tbbutton',value:'',
                            handler:function(){
                                var flag=this.value;
                                Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,'库存警报',"index.php?go=admin.storage.warehousegoods&alarm="+flag,"warehousegoods");
                            },
                            listeners : {
                                afterrender : function(){
                                    var tip =this;
                                    var task = {
                                        run : function(){
                                            Ext.Ajax.request( {
                                                url : 'home/admin/src/httpdata/messagetip.php',
                                                method : 'post',
                                                params : {},
                                                success : function(response, options) {
                                                    var o = Ext.util.JSON.decode(response.responseText);
                                                    tip.setText(o.infos);
                                                    if(o.totalcount){
                                                        tip.value=1;
                                                    }else{
                                                        tip.value=0;
                                                    }
                                                },
                                                failure : function(){

                                                }
                                            });
                                        },
                                        interval : 60000
                                    };
                                    Ext.TaskMgr.start(task);
                                }
                            }
                        }
                        ,'-',{text: "",ref:'../../operator',handler:function(){
                            //Ext.get("frmview").dom.src="index.php?go=admin.view.admin&admin_id="+Km.Config.Admin_id;
                            Km.Layout.Function.OpenWindow("index.php?go=admin.view.admin&admin_id="+Km.Config.Admin_id);
                        }}]
                }),
                new Ext.Toolbar({
                    height:54,ref:'toolbar',
                    items : [
                        {xtype: 'buttongroup',title: '订单管理',columns: 4,defaults: {scale: 'small'},
                         items: [
                            {text: '创建',iconCls: 'page',handler:function(){
                                new Km.Order.View.EditWindow().show();
                            }},
                            {text: '确认',iconCls: 'page',handler:function(){
                                Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"订单确认","index.php?go=admin.shop.order&status=active","orderConfirm");
                            }},
                            {text: '发货',iconCls: 'page',handler:function(){
                                Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"订单发货","index.php?go=admin.shop.order&ship_status=0","orderAccept");
                            }},
                            {text: '收款',iconCls: 'page',handler:function(){
                                Km.Navigation.addTabByUrl(Km.Layout.CenterPanel,"订单收款","index.php?go=admin.shop.order&pay_status=0","orderMoney");
                            }}
                         ]}]
                })
          ]}
    }),
    /**
     * 页面左侧
     */
    LeftPanel : new Ext.Panel({
        region : 'west',
        id : 'west-panel',
        title : '功能区',
        collapseMode : 'mini',
        split : true,
        width : 150,
        minSize : 100,
        maxSize : 400,
        collapsible : true,
        margins : '0 0 0 5',
        layout : {
            type : 'accordion',
            animate : true//,
            //activeOnTop: true
        }
    }),
    /**
     * 页面内容区
     */
    CenterPanel : new Ext.TabPanel({
        region : 'center', // a center region is ALWAYS
        // required for border layout
        id : 'centerPanel',
        deferredRender : false,
        activeTab : 0, // first tab initially active
        resizeTabs : true, // turn on tab resizing
        minTabWidth : 115,
        tabWidth : 135,
        enableTabScroll : true,
        defaults : {
            autoScroll : true
        },
        listeners:{
            render: function() {
                Ext.getBody().on("contextmenu", Ext.emptyFn, null, {preventDefault: true});
            },
            tabchange: function(tabPanel, tab){
                if (tab){
                    //tabs切换时修改浏览器hash
                    Ext.History.add(tabPanel.id + Km.Config.TokenDelimiter + tab.id);
                }
            }
        },
        items : [{
                contentEl : 'centerArea',
                title : '首页',
                url   : 'index.php?go=admin.index.index',
                iconCls : 'tabs',
                autoScroll : true
            }],
        plugins : [new Ext.ux.TabCloseMenu(),// Tab标题头右键菜单选项生成
            new Ext.ux.TabScrollerMenu({maxText : 15,pageSize : 5})// Tab标题头右侧下拉选择指定页面
        ]
    }),

    /**
     * Layout初始化
     */
    Init : function() {
        Km.Layout.LeftPanel.add(Km.Layout.LeftMenuGroups);
        Km.Layout.LeftPanel.doLayout();
        if (Km.Viewport.layout.north){
            Km.Viewport.layout.north.split.el.dom.style.cursor="inherit";
            Km.Viewport.layout.north.split.dd.lock();
        }
        var navEs = Km.Layout.LeftPanel.el.select('a');
        navEs.on('click', Km.Navigation.HyperlinkClicked);
        navEs.on('contextmenu',Km.Navigation.OnContextMenu);

        if (Ext.util.Cookies.get('roletype')!=null){
            Km.Layout.Roletype=Ext.util.Cookies.get('roletype');
        }

        //供应商不显示:*.菜单-日志
        if (Km.Layout.Roletype=='4'){
            Km.Config.HeaderPanel.topToolbar.menus.remove(Km.Layout.HeaderPanel.log);
        }

        Km.Config.HeaderPanel.operator.setText(Km.Config.Operator);
        //设置当前在线编辑器的菜单选项
        var onlineditorItems=Km.Config.HeaderPanel.view.menu.onlineditor.menu.items.items;
        Ext.each(onlineditorItems, function(item) {
          //console.log(item.value);
          if (item.value==Km.Config.OnlineEditor){
              item.checked=true;
          }else{
              item.checked=false;
          }
        });

        Km.Config.HeaderPanel.view.menu.toolbar.setChecked(false);
    },
    Function:{
        onOnlineditorCheck:function(item, checked){
            if (checked){
                Ext.util.Cookies.set('OnlineEditor',item.value);
            }
        },
        /**
         * 在主界面打开窗口
         * 参数有两个，默认为可重复打开窗口，当第二个参数为true，始终只打开一个窗口
         */
        OpenWindow:function(url){
            var IsOnlyOneWindow=true;
            if (arguments[1]==false)IsOnlyOneWindow=false;
            if (IsOnlyOneWindow){
                url=url+"&ow=true";
            }
            Ext.get("frmview").dom.src=url;
        },
        /**
         * 全屏模式支持:
         * 支持HTML5,Firefor和Chrome高级版本支持
         * http://css.dzone.com/articles/pragmatic-introduction-html5
         * https://developer.mozilla.org/en/DOM/Using_full-screen_mode*/
        FullScreen:function(){
            var isIEPrompt=true;
            if (arguments[0]==false)isIEPrompt=false;
            if (Km.Layout.HeaderPanel.view.menu.full.checked){
                var docElm = document.documentElement;
                if (docElm.requestFullscreen) {
                   docElm.requestFullscreen();
                }
                else if (docElm.mozRequestFullScreen) {
                   docElm.mozRequestFullScreen();
                }
                else if (docElm.webkitRequestFullScreen) {
                   docElm.webkitRequestFullScreen();
                }
                else if (typeof window.ActiveXObject !== "undefined"){
                    try
                    {
                        var wscript = new ActiveXObject("WScript.Shell");
                        if (wscript !== null) {
                            wscript.SendKeys("{F11}");
                        }
                    }
                    catch(err)
                    {
                       if(!((window.outerHeight==screen.height && window.outerWidth==screen.width))){
                           if (isIEPrompt){
                                Ext.Msg.alert('提示', 'IE浏览器请使用快捷键:F11');
                           }
                           Km.Layout.HeaderPanel.view.menu.full.setChecked(false);
                           return;
                       }
                    }
                }
            }else{
                if (document.exitFullscreen) {
                   document.exitFullscreen();
                }
                else if (document.mozCancelFullScreen) {
                   document.mozCancelFullScreen();
                }
                else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }else{
                    try
                    {
                        var wscript = new ActiveXObject("WScript.Shell");
                        if (wscript !== null) {
                            wscript.SendKeys("{F11}");
                        }
                    }
                    catch(err)
                    {

                        if((window.outerHeight==screen.height && window.outerWidth==screen.width)){
                            if (isIEPrompt){
                                Ext.Msg.alert('提示', 'IE浏览器请使用快捷键:F11');
                            }
                        }
                        return;
                    }
                }
            }
        }
    }
};
