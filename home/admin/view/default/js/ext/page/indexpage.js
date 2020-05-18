Ext.namespace("Kmall.Admin.Indexpage");
Km = Kmall.Admin.Indexpage;
Km.Indexpage={
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
             * 显示视图相对记录列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示收退款记录信息页(或者打开新窗口)
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
        if (Km.Indexpage.Cookie.get('View.Direction')){
            Km.Indexpage.Config.View.Direction=Km.Indexpage.Cookie.get('View.Direction');
        }
        if (Km.Indexpage.Cookie.get('View.IsFix')!=null){
            Km.Indexpage.Config.View.IsFix=Km.Indexpage.Cookie.get('View.IsFix');
        }
    }
};
/**
 * Model:数据模型
 */
Km.Indexpage.Store = {
};
/**
 * View:显示组件
 */
Km.Indexpage.View={
    /**
     * 视图
     */
    Grid:Ext.extend(Ext.Panel, {
        constructor : function(config) {
            config = Ext.apply({
                tbar:[
                    {
                        text:"预览",iconCls : 'icon-view',
                        handler:function(){
                            window.open("index.php?go=kmall.index.index","_blank");
                        }
                    },
                    {
                        id:"createindex",
                        text:"生成首页静态页面",iconCls : 'icon-view',
                        handler:function(){
                            //删除购物车cookie
                            Km.Indexpage.View.Running.indexpageGrid.eraseCart("cart");
                            var createindex=Ext.getCmp("createindex");
                            createindex.setText("生成首页静态页面<img src='home/admin/view/default/resources/images/loading.gif' align='absbottom'/>");
                            ExtServicePagebuild.index(null,function(provider, response) {
                                createindex.setText("生成首页静态页面");
                                Ext.Msg.alert("提示","首页静态页面生成完毕",function(){
                                    window.open("index.html","_blank");
                                });
                            });
                        }
                    },
                    {
                        id:"createallsite",
                        text:"生成全站静态页面",iconCls : 'icon-view',
                        handler:function(){
                            //删除购物车cookie
                            Km.Indexpage.View.Running.indexpageGrid.eraseCart("cart");
                            var createallsite=Ext.getCmp("createallsite");
                            createallsite.setText("生成全站静态页面<img src='home/admin/view/default/resources/images/loading.gif' align='absbottom'/>");
                            ExtServicePagebuild.allstations(null,function(provider, response) {
                                createallsite.setText("生成全站静态页面");
                                Ext.Msg.alert("提示","全站静态页面生成完毕");
                            });
                        }
                    }
                ],
                html:'<iframe width="100%" height="100%" frameborder=0 src="index.php?go=kmall.pageindex.index"></iframe>'
            });
            Km.Indexpage.View.Grid.superclass.constructor.call(this, config);
        },
        //清除购物车cookie
        eraseCart:function(name){
            var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
            if(arr != null){
                cval= unescape(arr[2]);
            }else{
                cval=null;
            }
            if(cval!=null) document.cookie= name + "="+cval+";expires="+(new Date(0)).toGMTString()+";path=/";
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 首页设置Grid对象
         */
        indexpageGrid:null
    }
};
/**
 * Controller:主程序
 */
Ext.onReady(function(){
    Ext.QuickTips.init();
    Ext.state.Manager.setProvider(Km.Indexpage.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Indexpage.Init();

    Km.Indexpage.View.Running.indexpageGrid=new Km.Indexpage.View.Grid();
    /**
     * 页面布局
     */
    Km.Indexpage.Viewport = new Ext.Viewport({
        layout : 'fit',
        items : [Km.Indexpage.View.Running.indexpageGrid]
    });
    Km.Indexpage.Viewport.doLayout();

    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});
