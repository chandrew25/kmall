Ext.namespace("Kmall.Admin.Coupon");
Km = Kmall.Admin;
Km.Coupon={
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
             * 显示优惠券的视图相对优惠券列表Grid的位置
             * 1:上方,2:下方,3:左侧,4:右侧,
             */
            Direction:2,
            /**
             *是否显示。
             */
            IsShow:0,
            /**
             * 是否固定显示优惠券信息页(或者打开新窗口)
             */
            IsFix:0
        },
    /**
     * 在线编辑器类型。
     * 1:CkEditor,2:KindEditor,3:xhEditor
     */
    OnlineEditor:1
    },

  Data:{
    couponparam:new Array()
  },

    /**
     * Cookie设置
     */
    Cookie:new Ext.state.CookieProvider(),
    /**
     * 初始化
     */
    Init:function(){
        if (Km.Coupon.Cookie.get('View.Direction')){
            Km.Coupon.Config.View.Direction=Km.Coupon.Cookie.get('View.Direction');
        }
        if (Km.Coupon.Cookie.get('View.IsFix')!=null){
            Km.Coupon.Config.View.IsFix=Km.Coupon.Cookie.get('View.IsFix');
        }
    if (Ext.util.Cookies.get('OnlineEditor')!=null){
      Km.Coupon.Config.OnlineEditor=parseInt(Ext.util.Cookies.get('OnlineEditor'));
    }
    }
};
/**
 * Model:数据模型
 */
Km.Coupon.Store = {
    /**
     * 优惠券
     */
    couponStore:new Ext.data.Store({
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            successProperty: 'success',
            root: 'data',remoteSort: true,
            fields : [
        {name: 'coupon_id',type: 'int'},
        {name: 'coupon_name',type: 'string'},
        {name: 'coupon_key',type: 'string'},
        {name: 'coupon_typeShow',type: 'string'},
        {name: 'coupon_type',type: 'string'},
        {name: 'coupon_num',type: 'int'},
        {name: 'begin_time',type: 'date',dateFormat:'Y-m-d H:i:s'},
        {name: 'end_time',type: 'date',dateFormat:'Y-m-d H:i:s'},
        {name: 'isValid',type: 'string'},
        {name: 'sort_order',type: 'string'},
        {name: 'prefdescribe',type: 'string'},
        {name: 'money_lower',type: 'float'},
        {name: 'money_upper',type: 'float'},
        {name: 'preferential_type',type: 'string'},
        {name: 'limit_reduce',type: 'float'},
        {name: 'discount',type: 'float'},
        {name: 'ifEffectall',type: 'string'},
        {name: 'givecouponitems',type: 'string'},
        {name: 'givecouponitemscount',type: 'string'},
        {name: 'selproductitems',type: 'string'},
        {name: 'selproductitemscount',type: 'string'},
        {name: 'preferentialrule_id',type: 'int'}
            ]}
        ),
        writer: new Ext.data.JsonWriter({
            encode: false
        }),
        listeners : {
            beforeload : function(store, options) {
                if (Ext.isReady) {
                    if (!options.params.limit)options.params.limit=Km.Coupon.Config.PageSize;
                    Ext.apply(options.params, Km.Coupon.View.Running.couponGrid.filter);//保证分页也将查询条件带上
                }
            }
        }
    }),
  /**
   * 选择优惠券
   */
  selcouponStore:new Ext.data.Store({
    reader: new Ext.data.JsonReader({
      totalProperty: 'totalCount',
      successProperty: 'success',
      root: 'data',remoteSort: true,
      fields : [
        {name: 'coupon_id',type: 'int'},
        {name: 'coupon_name',type: 'string'},
        {name: 'coupon_key',type: 'string'},
        {name: 'coupon_typeShow',type: 'string'},
        {name: 'coupon_type',type: 'string'},
        {name: 'coupon_num',type: 'int'},
        {name: 'isShowCouponCheck',type: 'string'},
        {name: 'begin_time',type: 'date',dateFormat:'Y-m-d H:i:s'},
        {name: 'end_time',type: 'date',dateFormat:'Y-m-d H:i:s'},
        {name: 'isValid',type: 'string'},
        {name: 'sort_order',type: 'string'},
        {name: 'prefdescribe',type: 'string'}
      ]}
    ),
    writer: new Ext.data.JsonWriter({
      encode: false
    }),
    listeners : {
      beforeload : function(store, options) {
        if (Ext.isReady) {
          Ext.apply(options.params, Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.filter);//保证分页也将查询条件带上
        }
      },
      load : function(records,options){
        if (records&&records.data&&records.data.items) {
          var result       = new Array();
          result['data']     =records.data.items;
          //把已经推荐的课程选中
          var sm=Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.sm;
          var rows=Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.getView().getRows();
          var updateData=[];//记录数据
          for(var i=0;i<rows.length;i++){
            if(result['data'][i]['data'].isShowCouponCheck){
              sm.selectRow(i, true);
            }
            updateData[i]={coupon_id:result['data'][i]['data'].coupon_id,isShowCouponCheck:false};
          }
          Km.Coupon.View.Running.selectCouponWindow.updateData=updateData;
        }
      }
    }
  }),
  /**
   * 选择商品
   */
  selproductStore:new Ext.data.Store({
    reader: new Ext.data.JsonReader({
      totalProperty: 'totalCount',
      successProperty: 'success',
      root: 'data',remoteSort: true,
      fields : [
        {name: 'product_id',type: 'int'},
        {name: 'product_name',type: 'string'},
        {name: 'ptype_id',type: 'int'},
        {name: 'ptype_name',type: 'string'},
        {name: 'product_code',type: 'string'},
        {name: 'market_price',type: 'float'},
        {name: 'price',type: 'float'},
        {name: 'num',type: 'int'},
        {name: 'isShowProductCheck',type: 'string'}
      ]}
    ),
    writer: new Ext.data.JsonWriter({
      encode: false
    }),
    listeners : {
      beforeload : function(store, options) {
        if (Ext.isReady) {
          Ext.apply(options.params, Km.Coupon.View.Running.selectProductWindow.selectProductGrid.filter);//保证分页也将查询条件带上
        }
      },
      load : function(records,options){
        if (records&&records.data&&records.data.items) {
          var result       = new Array();
          result['data']     =records.data.items;
          //把已经推荐的课程选中
          var sm=Km.Coupon.View.Running.selectProductWindow.selectProductGrid.sm;
          var rows=Km.Coupon.View.Running.selectProductWindow.selectProductGrid.getView().getRows();
          var updateData=[];//记录数据
          for(var i=0;i<rows.length;i++){
            if(result['data'][i]['data'].isShowProductCheck){
              sm.selectRow(i, true);
            }
            updateData[i]={product_id:result['data'][i]['data'].product_id,isShowProductCheck:false};
          }
          Km.Coupon.View.Running.selectProductWindow.updateData=updateData;
        }
      }
    }
  }),
  /**
   * 优惠券实体表
   */
  couponitemsStore:new Ext.data.Store({
    reader: new Ext.data.JsonReader({
      totalProperty: 'totalCount',
      successProperty: 'success',
      root: 'data',remoteSort: true,
      fields : [
        {name: 'couponitems_id',type: 'int'},
        {name: 'member_id',type: 'int'},
        {name: 'couponitems_key',type: 'string'},
        {name: 'coupon_id',type: 'int'},
        {name: 'coupon_value',type: 'float'},
        {name: 'phonenumber',type: 'string'},
        {name: 'isExchange',type: 'string'},
        {name: 'create_fromShow',type: 'string'},
        {name: 'create_from',type: 'string'},
        {name: 'sort_order',type: 'string'}
      ]}
    ),
    writer: new Ext.data.JsonWriter({
      encode: false
    }),
    listeners : {
      beforeload : function(store, options) {
        if (Ext.isReady) {
          if (!options.params.limit)options.params.limit=Km.Coupon.Config.PageSize;
          Ext.apply(options.params, Km.Coupon.View.Running.couponitemsGrid.filter);//保证分页也将查询条件带上
        }
      }
    }
  })
};
/**
 * View:优惠券显示组件
 */
Km.Coupon.View={
    /**
     * 编辑窗口：新建或者修改优惠券
     */
    EditWindow:Ext.extend(Ext.Window, {
    constructor: function(config) {
      config = Ext.apply({
        layout:'card',savetype:0,
        closeAction : "hide",title:'向导',
        constrainHeader:true,maximizable: true,collapsible: true,
        width : 450,height : 550,minWidth : 400,minHeight : 450,
        plain : true,buttonAlign : 'center',plain : true,
        activeItem: 'firstcard',
        listeners:{
          beforehide:function(){
            //重置所有card
            this.firstcard.editForm.form.getEl().dom.reset();
            this.secondcard.editForm.form.getEl().dom.reset();
            this.thirdcard.editForm.form.getEl().dom.reset();
            this.doreset();
            //初始化选择弹窗
            Km.Coupon.View.Running.couponGrid.hideselCoupon();
            Km.Coupon.View.Running.couponGrid.hideselProduct();
          }
        },
        items: [{
          id: 'firstcard',
          ref:'firstcard',
          buttonAlign : 'center',
          items: [
            new Ext.form.FormPanel({
              ref:'editForm',layout:'form',
              labelWidth : 100,labelAlign : "center",
              bodyStyle : 'padding:5px 5px 0',align : "center",
              api : {},
              defaults : {
                xtype : 'textfield',anchor:'98%'
              },
              items : [
                {xtype: 'hidden',name : 'coupon_id',ref:'../coupon_id'},
                {fieldLabel : '优惠券名称',name : 'coupon_name',id:'coupon_name',regex:/^[A-Za-z0-9\u4e00-\u9fa5]+$/,regexText:"只能输入中文、正整数以及英文字母",allowBlank : false},
                {fieldLabel : '优惠券号码前缀',name : 'coupon_key',id:'coupon_key',allowBlank : false,id:'coupon_key',vtype:'alphanum',vtypeText:'只能输入字母和数字'},
                {
                  xtype: 'radiogroup',id:'coupon_type',
                  fieldLabel: '优惠券类型',
                  columns: 1,
                  items: [
                    {boxLabel: '一张无限使用&nbsp;<font color="#aaa">说明：此类优惠券，顾客只需获得一张，即可在规定的时间内重复使用。</font>', name: 'coupon_type', inputValue: 2,checked: true},
                    {boxLabel: '多张使用一次&nbsp;<font color="#aaa">说明：此类优惠券，顾客可一次获得多张，但在规定时间内每张只能使用一次，无法重复使用。</font>', name: 'coupon_type', inputValue: 1}
                  ]
                },
                {
                  xtype: 'radiogroup',id:'isValid',
                  fieldLabel: '是否启用',
                  layout:'column',
                  defaults: {           //设置没一列的子元素的默认配置
                    layout: 'anchor',
                    defaults: {
                      anchor: '100%'
                    }
                  },
                  items: [
                  {
                    width: 100,
                    items: [
                      {boxLabel: '启用', name: 'isValid', inputValue: 1,columnWidth:.20}
                    ]
                  },
                  {
                    width: 100,
                    items: [
                      {boxLabel: '禁用', name: 'isValid', inputValue: 0, checked: true}
                    ]
                  }]
                },
                {fieldLabel : '排序',name : 'sort_order',id:'sort_order',ref:'../sort_order',value:50,xtype:'numberfield'}
              ]
            })
          ]
        },{
          id: 'secondcard',
          ref: 'secondcard',
          items: [
            new Ext.form.FormPanel({
              ref:'editForm',layout:'form',
              labelWidth : 100,labelAlign : "center",
              bodyStyle : 'padding:5px 5px 0',align : "center",height:500,
              api : {},
              items : [
                {
                  xtype: 'radiogroup',id:'preferential_type',
                  fieldLabel: '优惠券类型',
                  columns: 1,
                  defaults :{
                    height:20
                  },
                  items: [
                    {boxLabel: '优惠券规则a:&nbsp;<font color="#666">商品直接打折，如全场电视8折。可以对商品任意折扣，适合低价清货促销</font>', name: 'preferential_type', inputValue: 1,checked: true},
                    {boxLabel: '优惠券规则b:&nbsp;<font color="#666">购物车中商品总金额大于指定金额，客户就可得到指定的%off折扣</font>', name: 'preferential_type', inputValue: 3},
                    {boxLabel: '优惠券规则c:&nbsp;<font color="#666">购物车中商品总金额大于指定金额,就可立减某金额</font>', name: 'preferential_type', inputValue: 4},
                    {boxLabel: '优惠券规则d:&nbsp;<font color="#666">现金抵扣券,购买商品可抵扣相应金额</font>', name: 'preferential_type', inputValue: 5}
                  ]}
              ]
            })
          ]
        },{
          id: 'thirdcard',
          ref: 'thirdcard',
          items: [
            new Ext.form.FormPanel({
              ref:'editForm',layout:'form',
              labelWidth : 140,labelAlign : "center",
              bodyStyle : 'padding:5px 5px 0;',align : "center",
              api : {},
              items : [
                {
                  xtype:'fieldset',ref:'../_fieldsetway',id:'_fieldsetway',title:'优惠方式',autoHeight: true,style:'padding-left:10px;',
                  defaults :{
                    xtype:'textfield',labelWidth: 25
                  },
                  items:[
                    {
                      xtype: 'compositefield',id:'_fieldsetwaycom',
                      defaults : {
                        xtype : 'numberfield'
                      },
                      items: [
                        {fieldLabel :'订单优惠条件',width:90,allowDecimals:false,allowNegative : false,allowBlank:false,id:'money_lower'},
                        {xtype:'displayfield',value:'&le;订单金额&lt;',width:80},
                        {width:90,value:9999999,allowDecimals:false,allowNegative : false,allowBlank:false,id:'money_upper'},
                        {xtype:'displayfield',value:'',width:200,id:'discounttext'}
                      ]
                    }
                  ]
                },{
                  xtype:'fieldset',ref:'../_fieldsettime',title:'优惠券使用时间',autoHeight: true,                             style:'padding-left:10px;',
                  defaults :{
                    layout:'column',anchor:'50%'
                  },
                  items:[
                    {fieldLabel : '开始时间',name : 'begin_time',id : 'begin_time',xtype : 'datefield',format : "Y-m-d H:i:s",allowBlank:false},
                    {fieldLabel : '结束时间',name : 'end_time',id : 'end_time',xtype : 'datefield',format : "Y-m-d H:i:s",allowBlank:false}
                  ]
                },{
                  xtype:'fieldset',ref:'../_fieldsetcon',title:'优惠券内容',autoHeight: true,                             style:'padding-left:10px;',
                  defaults :{
                    layout:'column',anchor:'50%'
                  },
                  items:[
                    {fieldLabel : '请输入立减多少金额',name : 'limit_reduce',id:'limit_reduce',xtype : 'textfield',regex:/^[1-9]\d*$/ ,regexText:'输入金额格式不正确',allowBlank:false,anchor:'25%'},
                    {
                      xtype: 'compositefield',id:'discountfield',
                      defaults : {
                        xtype : 'numberfield'
                      },
                      items: [
                        {fieldLabel :'请输入给予多少折扣',regex:/^0\.\d*[1-9]\d*$/,regexText:'只能输入大于0小于1的值',allowBlank:false,name:'discount',id:'discount'},
                        {xtype:'displayfield',value:'如果打9折，请输入0.9',width:150}
                      ]
                    },
                    {
                      xtype: 'compositefield',id:'givecoupon',height:25,
                      defaults : {
                        height:25
                      },
                      items: [
                        {fieldLabel : '送优惠券',xtype : 'button',id:'givebutton',width:100,text:'请选择...',                          anchor:'12%',
                          handler : function() {
                            if(Km.Coupon.View.Running.selectCouponWindow==null || Km.Coupon.View.Running.selectCouponWindow.hidden){
                              Km.Coupon.View.Running.couponGrid.showselCoupon();
                            }else{
                              Km.Coupon.View.Running.couponGrid.hideselCoupon();
                            }
                          }
                        },
                        {xtype : 'hidden',id:'givecouponitems',name:'givecouponitems',value:''},
                        {xtype:'displayfield',id:'givebuttontext',value:'',width:200}
                      ]
                    }
                  ]
                },{
                  xtype:'fieldset',ref:'_fieldsetdes',title:'优惠券描述',autoHeight: true,style:'padding-left:10px;',
                  items:[
                    {fieldLabel : '优惠券描述',name : 'prefdescribe',id:'prefdescribe',ref:'prefdescribe',xtype : 'textarea',allowBlank:false,layout:'column',anchor:'50%',height:100}
                  ]
                }
              ]
            })
          ]
        },{
          id: 'fouthcard',
          ref: 'fouthcard',
          items: [
            new Ext.form.FormPanel({
              ref:'editForm',layout:'form',
              labelWidth : 100,labelAlign : "center",
              bodyStyle : 'padding:5px 5px 0',align : "center",height:500,
              api : {},
              items : [{
                xtype: 'radiogroup',id:'ifEffectall',
                fieldLabel: '作用范围',
                columns: 1,
                defaults :{
                  height:25
                },
                items: [
                  {boxLabel: '所有商品', name: 'ifEffectall',id:'effectall',inputValue: 1},
                  {boxLabel: '选择商品', name: 'ifEffectall',id:'effectpart', inputValue: 0}
                ]
              },{
                xtype: 'compositefield',id:'selproduct',
                items: [
                  {fieldLabel : '选择商品',xtype : 'button',id:'selbutton',height:25,width:100,text:'请选择...',
                    handler : function() {
                      if(Km.Coupon.View.Running.selectCouponWindow==null || Km.Coupon.View.Running.selectCouponWindow.hidden){
                        Km.Coupon.View.Running.couponGrid.showselProduct();
                      }else{
                        Km.Coupon.View.Running.couponGrid.hideselProduct();
                      }
                    }
                  },
                  {xtype : 'hidden',id:'selproductitems',name:'selproductitems',value:''},
                  {xtype:'displayfield',id:'selbuttontext',value:'',width:200}
                ]
              }]
            })
          ]
        },{
          id: 'fifthcard',
          ref: 'fifthcard',
          items: [
            new Ext.form.FormPanel({
              ref:'editForm',layout:'form',
              labelWidth : 100,labelAlign : "center",
              bodyStyle : 'padding:5px 5px 0',align : "center",
              api : {},
              defaults : {
                anchor:'98%'
              },
              items : [{
                xtype:'fieldset',ref:'../_fieldsetcomfirm',title:'请确认优惠券信息',autoHeight: true,style:'padding-left:10px;',
                defaults :{
                  xtype:'textfield',labelWidth: 25,layout:'column',anchor:'50%'
                },
                items:[
                  {fieldLabel : '优惠券名称',id:'coupon_nameshow',disabled:true},
                  {fieldLabel : '开始时间',id:'begin_timeshow',disabled:true},
                  {fieldLabel : '结束时间',id:'end_timeshow',disabled:true},
                  {fieldLabel : '优惠券描述',xtype : 'textarea',id:'textareashow',disabled:true}
                ]
              }]
            })
          ]
        }],
        buttons: [{
          id: 'card-pre',
          text: '上一步',scope:this,hidden:true,
          handler:function(){
            var card=this.getLayout().activeItem;
            var precard=card.previousSibling();
            var precad_id=precard.id;
            this.layout.setActiveItem(precad_id);
            //判断是否是第一步
            var firstcard=precard.previousSibling();
            if(!firstcard){
              Ext.getCmp('card-pre').hide();
            }
            //显示下一步按钮
            Ext.getCmp("card-next").show();
            //隐藏完成按钮
            Ext.getCmp("card-success").hide();
          }
        },{
          id: 'card-success',hidden:true,
          text: '完成',scope:this,
          handler:function(){
            var params=Km.Coupon.Data.couponparam;
            var card=this.getLayout().activeItem;
            var container=card.ownerCt;
            if(this.savetype==0){
              card.editForm.api.submit=ExtServiceCoupon.save;
            }else{
              card.editForm.api.submit=ExtServiceCoupon.update;
            }
            card.editForm.getForm().submit({
              method: "post",
              waitTitle : '提示',
              waitMsg : '正在验证数据请稍后...',
              params:params,
              success : function(form,action) {
                Ext.Msg.alert('提示', '保存成功!');
                Km.Coupon.View.Running.couponGrid.doSelectCoupon();
                container.doreset();
                container.hide();
              },
              failure : function(form, action) {
                Ext.Msg.alert('提示', '操作失败,请重试!');
              }
            });
          }
        },{
          id: 'card-next',
          text: '下一步',scope:this,
          handler:function(){
            //当前活动card
            var card=this.getLayout().activeItem;
            var card_id=card.id;
            if (!card.editForm.getForm().isValid()) {
              return;
            }
            switch(card_id){
              case 'firstcard':
                card.editForm.api.submit=ExtServiceCoupon.check;
                card.editForm.getForm().submit({
                  waitTitle : '提示',
                  waitMsg : '正在验证数据请稍后...',
                  success : function(form,action) {
                    if(!action.result.exist){
                      //保存表单
                      var forms=card.editForm.getForm().getValues();
                      for(var name in forms){
                        Km.Coupon.Data.couponparam[name]=forms[name];
                      }
                      //显示下一步
                      var nextcard=card.nextSibling();
                      card.ownerCt.layout.setActiveItem(nextcard.id);
                      //判断下一步是否是final
                      var finalcard=nextcard.nextSibling();
                      if(!finalcard){
                        //隐藏下一步按钮
                        Ext.getCmp("card-next").hide();
                        //显示完成按钮
                        Ext.getCmp("card-success").show();
                      }
                      //显示上一步按钮
                      Ext.getCmp("card-pre").show();
                    }else{
                      Ext.Msg.alert('提示', '该优惠券号码前缀已存在,请重新输入!');
                      Ext.getCmp('coupon_key').addClass('x-form-invalid');
                    }
                  },
                  failure : function(form, action) {
                    Ext.Msg.alert('提示', '操作失败,请重试!');
                  }
                });
              break;
              case 'secondcard':
                //保存表单
                var forms=card.editForm.getForm().getValues();
                this.saveForms(forms,card_id);
                //显示下一步
                var nextcard=card.nextSibling();
                card.ownerCt.layout.setActiveItem(nextcard.id);
                //下一步处理函数
                this.nextSetp(nextcard);
                var ruletype=Km.Coupon.Data.couponparam['preferential_type'];
                switch(ruletype){
                  case '1':
                    //显示折扣率
                    this.discount(true);
                    //选择商品
                    this.choiceproduct(false);
                    //隐藏订单优惠条件
                    this.favcondition(false);
                    //隐藏立减金额
                    this.limit_reduce(false);
                    //隐藏送优惠券
                    this.givecoupon(false);
                  break;
                  case '2':
                    //显示订单优惠条件
                    this.favcondition(true);
                    //显示送优惠券
                    this.givecoupon(true);
                    //所有商品
                    this.choiceproduct(true);
                    //隐藏折扣率
                    this.discount(false);
                    //隐藏立减金额
                    this.limit_reduce(false);
                  break;
                  case '3':
                    //显示订单优惠条件
                    this.favcondition(true);
                    //显示折扣率
                    this.discount(true);
                    //所有商品
                    this.choiceproduct(true);
                    //隐藏送优惠券
                    this.givecoupon(false);
                    //隐藏立减金额
                    this.limit_reduce(false);
                  break;
                  case '4':
                    //显示订单优惠条件
                    this.favcondition(true);
                    //显示立减金额
                    this.limit_reduce(true);
                    //所有商品
                    this.choiceproduct(true);
                    //隐藏送优惠券
                    this.givecoupon(false);
                    //隐藏折扣率
                    this.discount(false);
                  break;
                  case '5':
                    //显示立减金额
                    this.limit_reduce(true);
                    //选择商品
                    this.choiceproduct(false);
                    //隐藏订单优惠条件
                    this.favcondition(false);
                    //隐藏送优惠券
                    this.givecoupon(false);
                    //隐藏折扣率
                    this.discount(false);
                  break;
                  default:

                  break;
                }
              break;
              case 'thirdcard':
                var ruletype=Km.Coupon.Data.couponparam['preferential_type'];
                switch(ruletype){
                  case '1':
                    //判断使用时间合理性
                    var judgeflag=this.judgetime();
                    if(!judgeflag){
                      return;
                    }
                  break;
                  case '2':
                    //判断优惠条件合理性
                    var judgeflag=this.judgecondition();
                    if(!judgeflag){
                      return;
                    }
                    //判断使用时间合理性
                    var judgeflag=this.judgetime();
                    if(!judgeflag){
                      return;
                    }
                    //判断是否选择优惠券
                    var giveitems=this.judgeitems();
                    if(!giveitems){
                      return;
                    }
                  break;
                  case '3':
                    //判断优惠条件合理性
                    var judgeflag=this.judgecondition();
                    if(!judgeflag){
                      return;
                    }
                    //判断使用时间合理性
                    var judgeflag=this.judgetime();
                    if(!judgeflag){
                      return;
                    }
                  break;
                  case '4':
                    //判断优惠条件合理性
                    var judgeflag=this.judgecondition();
                    if(!judgeflag){
                      return;
                    }
                    //判断使用时间合理性
                    var judgeflag=this.judgetime();
                    if(!judgeflag){
                      return;
                    }
                  break;
                  case '5':
                    //判断使用时间合理性
                    var judgeflag=this.judgetime();
                    if(!judgeflag){
                      return;
                    }
                  break;
                  default:

                  break;
                }
                //保存表单
                var forms=card.editForm.getForm().getValues();
                this.saveForms(forms,card_id);
                //显示下一步
                var nextcard=card.nextSibling();
                card.ownerCt.layout.setActiveItem(nextcard.id);
                //下一步处理函数
                this.nextSetp(nextcard);
              break;
              case 'fouthcard':
                var ruletype=Km.Coupon.Data.couponparam['preferential_type'];
                //针对指定商品的优惠
                if(ruletype==1||ruletype==5){
                  //判断是否选中商品
                  var judgeflag=this.judgeproducts();
                  if(!judgeflag){
                    return;
                  }
                }
                //保存表单
                var forms=card.editForm.getForm().getValues();
                this.saveForms(forms,card_id);
                var coupon_nameshow=Km.Coupon.Data.couponparam['coupon_name'];
                var begin_timeshow=Km.Coupon.Data.couponparam['begin_time'];
                var end_timeshow=Km.Coupon.Data.couponparam['end_time'];
                var textareashow=Km.Coupon.Data.couponparam['prefdescribe'];
                //显示下一步
                var nextcard=card.nextSibling();
                card.ownerCt.layout.setActiveItem(nextcard.id);
                Ext.getCmp('coupon_nameshow').setValue(coupon_nameshow);
                Ext.getCmp('begin_timeshow').setValue(begin_timeshow);
                Ext.getCmp('end_timeshow').setValue(end_timeshow);
                Ext.getCmp('textareashow').setValue(textareashow);
                //下一步处理函数
                this.nextSetp(nextcard);
              break;
              default:

              break;
            }
          }
        },{
          id: 'card-cancel',
          text: '取消',scope:this,
          handler:function(){
            this.doreset();
            this.hide();
          }
        }],
        //返回初始状态
        doreset:function(){
          //返回到第一个card
          this.layout.setActiveItem("firstcard");
          //隐藏上一步按钮
          Ext.getCmp("card-pre").hide();
          //显示下一步按钮
          Ext.getCmp("card-next").show();
          //隐藏完成按钮
          Ext.getCmp("card-success").hide();
          //初始化优惠条件
          Ext.getCmp('money_lower').removeClass('x-form-invalid');
          Ext.getCmp("money_upper").setValue(9999999);
          Ext.getCmp('money_upper').removeClass('x-form-invalid');
          //初始化时间区间
          Ext.getCmp('begin_time').removeClass('x-form-invalid');
          Ext.getCmp('end_time').removeClass('x-form-invalid');
          //初始化选择优惠券
          Ext.getCmp("givecouponitems").setValue('');
          Ext.getCmp('givebutton').removeClass('x-form-invalid');
          Ext.getCmp("givebuttontext").setValue("");
          //初始化选择商品
          Ext.getCmp("selproductitems").setValue('');
          Ext.getCmp('selbutton').removeClass('x-form-invalid');
          Ext.getCmp("selbuttontext").setValue("");
          //初始化折扣提示
          Ext.getCmp("discounttext").setValue("");
          //初始化form表单
          Km.Coupon.Data.couponparam=new Array();
        },
        //下一步操作
        nextSetp:function(nextcard){
          //判断下一步是否是final
          var finalcard=nextcard.nextSibling();
          if(!finalcard){
            //隐藏下一步按钮
            Ext.getCmp("card-next").hide();
            //显示完成按钮
            Ext.getCmp("card-success").show();
          }
          //显示上一步按钮
          Ext.getCmp("card-pre").show();
        },
        //存储表单数据
        saveForms:function(forms){
          for(var name in forms){
            Km.Coupon.Data.couponparam[name]=forms[name];
          }
        },
        //订单优惠条件show or hide
        favcondition:function(flag){
          if(flag){
            Ext.getCmp('_fieldsetway').show();
            Ext.getCmp('_fieldsetwaycom').show();
          }else{
            Ext.getCmp('_fieldsetway').hide();
            Ext.getCmp('_fieldsetwaycom').hide();
          }
          Ext.getCmp('money_lower').setDisabled(!flag);
          Ext.getCmp('money_upper').setDisabled(!flag);
        },
        //立减金额show or hide
        limit_reduce:function(flag){
          if(flag){
            Ext.getCmp('limit_reduce').show();
          }else{
            Ext.getCmp('limit_reduce').hide();
          }
          Ext.getCmp('limit_reduce').setDisabled(!flag);
        },
        //折扣率show or hide
        discount:function(flag){
          if(flag){
            Ext.getCmp('discountfield').show();
          }else{
            Ext.getCmp('discountfield').hide();
          }
          Ext.getCmp('discount').setDisabled(!flag);
        },
        //送优惠券show or hide
        givecoupon:function(flag){
          if(flag){
            Ext.getCmp('givecoupon').show();
          }else{
            Ext.getCmp('givecoupon').hide();
          }
        },
        //所有商品or选择商品
        choiceproduct:function(flag){
          if(flag){
            Ext.getCmp('effectall').show();
            Ext.getCmp('effectall').setValue(true);
            Ext.getCmp('effectpart').hide();
            Ext.getCmp('selproduct').hide();
          }else{
            Ext.getCmp('effectpart').show();
            Ext.getCmp('effectpart').setValue(true);
            Ext.getCmp('selproduct').show();
            Ext.getCmp('effectall').hide();
          }
        },
        //判断优惠条件
        judgecondition:function(){
          var leftprice=Ext.getCmp("money_lower").getValue();
          var rightprice=Ext.getCmp("money_upper").getValue();
          if(leftprice>=rightprice){
            Ext.getCmp("discounttext").setValue("<font color=red>(订单优惠条件价格不合理)</font>");
            Ext.getCmp('money_lower').addClass('x-form-invalid');
            Ext.getCmp('money_upper').addClass('x-form-invalid');
            Ext.getCmp('money_lower').focus();
            return false;
          }else{
            Ext.getCmp('money_lower').removeClass('x-form-invalid');
            Ext.getCmp('money_upper').removeClass('x-form-invalid');
            Ext.getCmp("discounttext").setValue("");
            return true;
          }
        },
        //判断时间
        judgetime:function(){
          var leftprice=Ext.getCmp("begin_time").getValue();
          var rightprice=Ext.getCmp("end_time").getValue();
          if(leftprice>=rightprice){
            Ext.getCmp('begin_time').addClass('x-form-invalid');
            Ext.getCmp('end_time').addClass('x-form-invalid');
            Ext.getCmp('begin_time').focus();
            return false;
          }else{
            Ext.getCmp('begin_time').removeClass('x-form-invalid');
            Ext.getCmp('end_time').removeClass('x-form-invalid');
            return true;
          }
        },
        //判断是否选择优惠券
        judgeitems:function(){
          var items=Ext.getCmp("givecouponitems").getValue();
          if(!items){
            Ext.getCmp("givebuttontext").setValue("<font color=red>(请选择至少选择一张优惠券)</font>");
            Ext.getCmp('givebutton').addClass('x-form-invalid');
            Ext.getCmp('givebutton').focus();
            return false;
          }else{
            Ext.getCmp('givebutton').removeClass('x-form-invalid');
            return true;
          }
        },
        //判断是否选择商品
        judgeproducts:function(){
          var items=Ext.getCmp("selproductitems").getValue();
          if(!items){
            Ext.getCmp("selbuttontext").setValue("<font color=red>(请选择至少选择一件商品)</font>");
            Ext.getCmp('selbutton').addClass('x-form-invalid');
            Ext.getCmp('selbutton').focus();
            return false;
          }else{
            Ext.getCmp('selbutton').removeClass('x-form-invalid');
            return true;
          }
        }
      },config);
      Km.Coupon.View.EditWindow.superclass.constructor.call(this,config);
    }
  }),
  /**
   * 优惠券发布(通过短信)
   */
  PublishView:{
    /**
     * 编辑窗口：优惠券发布
     */
    EditWindow:Ext.extend(Ext.Window,{
      constructor : function(config) {
        config = Ext.apply({
          closeAction : "hide",title:"优惠券发布(通过短信)",
          constrainHeader:true,maximizable: true,collapsible: true,
          width : 600,height : 450,minWidth : 600,minHeight : 450,
          layout : 'fit',plain : true,buttonAlign : 'center',
          defaults : {autoScroll : true},
          listeners:{
            beforehide:function(){
              this.publisheditForm.form.getEl().dom.reset();
            }
          },
          items : [
            new Ext.form.FormPanel({
              ref:'publisheditForm',layout:'form',
              labelWidth : 100,labelAlign : "center",
              bodyStyle : 'padding:5px 5px 0',align : "center",
              api : {},
              defaults : {xtype : 'textfield',anchor:'98%'},
              items : [
                {xtype: 'hidden',  name : 'showcoupon_id',ref:'../showcoupon_id'},
                {fieldLabel : '优惠券名称',name : 'showcoupon_name',ref:'../showcoupon_name',disabled:true},
                {fieldLabel : '优惠券号码前缀',name : 'showcoupon_key',id:'showcoupon_key',ref:'../showcoupon_key',disabled:true},
                {fieldLabel : '优惠券类型',name : 'showcoupon_type',id:'showcoupon_type',ref:'../showcoupon_type',disabled:true,xtype:'displayfield'},
                {fieldLabel : '发送信息内容',name : 'showdescribe',ref:'../showdescribe',xtype: 'textarea',allowBlank:false},
                {fieldLabel : '',name : 'showmould',ref:'../showmould',xtype: 'displayfield',
                value:'<font color=red>该内容将以短信形式发送到对方手机上:</font><br /><font color=green>例:您好,您获得了价值XX元的优惠券,优惠券号码[COUPONKEY],过期时间[EXPIRETIME]</font>'
                },
                {
                  xtype: 'fieldset',id:'sendphone',collapsible: true,title:'发送至的手机号码',
                  defaults : {
                    xtype : 'textarea',anchor:'98%'
                  },
                  items: [
                    {fieldLabel : '',name : 'showphone',ref:"../../showphone",allowBlank:false},
                    {fieldLabel : '',name : 'showmould',ref:'../showmould',xtype: 'displayfield',
                    value:'<font color=green>(输入多个手机号码请以逗号分隔)</font>'},
                    {
                      xtype: 'compositefield',id:'publishcom',
                      items: [
                        {fieldLabel : '',xtype : 'button',id:'publishbutton',height:25,width:100,text:'上传手机号码',
                          handler : function() {
                            Km.Coupon.View.Running.couponGrid.importPhone();
                          }
                        },
                        {xtype : 'hidden',id:'publishphones',name:'publishphones',value:''}
                      ]
                    }
                  ]
                }
              ]
            })
          ],
          buttons : [{
            text: "确 定",ref : "../saveBtn",scope:this,
            handler : function() {
              if (!this.publisheditForm.getForm().isValid()) {
                return;
              }
              editWindow=this;
              this.publisheditForm.api.submit=ExtServiceCoupon.publishCoupon;
              this.publisheditForm.getForm().submit({
                success : function(form, action){
                  form.reset();
                  editWindow.hide();
                  Ext.Msg.alert('提示', action.result.data);
                },
                failure : function(form, action) {
                  Ext.Msg.alert('提示', action.result.data);
                },
                waitMsg : '正在提交,请稍候...'
              });
            }
          }, {
            text : "取 消",scope:this,
            handler : function() {
              this.publisheditForm.form.getEl().dom.reset();
              this.hide();
            }
          }, {
            text : "重 置",ref:'../resetBtn',scope:this,
            handler : function() {
              this.publisheditForm.form.getEl().dom.reset();
              var selectCoupon=Km.Coupon.View.Running.couponGrid.getSelectionModel().getSelected().data;
              var openwindow=Km.Coupon.View.Running.edit_window_publish;
              openwindow.showcoupon_id.setValue(selectCoupon.coupon_id);
              openwindow.showcoupon_name.setValue(selectCoupon.coupon_name);
              openwindow.showcoupon_key.setValue(selectCoupon.coupon_key);
              switch(selectCoupon.preferential_type){
                case '1':
                  openwindow.showcoupon_type.setValue("对某些商品打折");
                break;
                case '2':
                  openwindow.showcoupon_type.setValue("购物满一定金额送优惠券");
                break;
                case '3':
                  openwindow.showcoupon_type.setValue("购物满一定金额打折");
                break;
                case '4':
                  openwindow.showcoupon_type.setValue("购物满一定金额立减金额");
                break;
                case '5':
                  openwindow.showcoupon_type.setValue("现金抵扣券");
                break;
                default:
                break;
              }
            }
          }]
        }, config);
        Km.Coupon.View.PublishView.EditWindow.superclass.constructor.call(this, config);
      }
    })
  },
  /**
   * 优惠券发布
   */
  PublishEmailView:{
    /**
     * 编辑窗口：优惠券发布
     */
    EditWindow:Ext.extend(Ext.Window,{
      constructor : function(config) {
        config = Ext.apply({
          closeAction : "hide",title:"优惠券发布(通过邮件)",
          constrainHeader:true,maximizable: true,collapsible: true,
          width : 880,height : 550,minWidth : 880,minHeight : 550,
          layout : 'fit',plain : true,buttonAlign : 'center',
          defaults : {autoScroll : true},
          listeners:{
            beforehide:function(){
              this.publishemaileditForm.form.getEl().dom.reset();
            },
            afterrender:function(){
              switch (Km.Coupon.Config.OnlineEditor){
                case 2:
                  if (!Km.Coupon.View.PublishEmailView.EditWindow.KindEditor_emailcontent)Km.Coupon.View.PublishEmailView.EditWindow.KindEditor_emailcontent = KindEditor.create('textarea[name="emailcontent"]',{width:'98%',minHeith:'350px', filterMode:true});
                  break;
                case 3:
                  pageInit_emailcontent();
                  break;
                default:
                  if (!CKEDITOR.instances.emailcontent)ckeditor_replace_emailcontent();
              }
            }
          },
          items : [
            new Ext.form.FormPanel({
              ref:'publishemaileditForm',layout:'form',
              labelWidth : 100,labelAlign : "center",
              bodyStyle : 'padding:5px 5px 0',align : "center",
              api : {},
              defaults : {xtype : 'textfield',anchor:'98%'},
              items : [
                {xtype: 'hidden',  name : 'eshowcoupon_id',ref:'../eshowcoupon_id'},
                {fieldLabel : '优惠券名称',name : 'eshowcoupon_name',ref:'../eshowcoupon_name',disabled:true},
                {fieldLabel : '优惠券号码前缀',name : 'eshowcoupon_key',id:'eshowcoupon_key',ref:'../eshowcoupon_key',disabled:true},
                {fieldLabel : '优惠券类型',name : 'eshowcoupon_type',id:'eshowcoupon_type',ref:'../eshowcoupon_type',disabled:true,xtype:'displayfield'},
                {fieldLabel : '发送信息内容',name : 'emailcontent',id :'emailcontent',ref:'emailcontent',xtype: 'textarea',allowBlank:false},
                {fieldLabel : '',name : 'eshowmould',ref:'../eshowmould',xtype: 'displayfield',
                value:'<font color=red>(请定制邮件内容)</font>'
                },
                {
                  xtype: 'fieldset',id:'sendemail',collapsible: true,title:'发送至的邮箱号码',
                  defaults : {
                    xtype : 'textarea',anchor:'98%'
                  },
                  items: [
                    {fieldLabel : '',name : 'showemail',ref:"../../showemail",allowBlank:false},
                    {fieldLabel : '',name : 'eshowmould',ref:'../eshowmould',xtype: 'displayfield',
                    value:'<font color=green>(输入多个邮箱号码请以逗号分隔)</font>'},
                    {
                      xtype: 'compositefield',id:'epublishcom',
                      items: [
                        {fieldLabel : '',xtype : 'button',id:'epublishbutton',height:25,width:100,text:'上传邮箱号码',
                          handler : function() {
                            Km.Coupon.View.Running.couponGrid.importEmail();
                          }
                        },
                        {xtype : 'hidden',id:'publishemails',name:'publishemails',value:''}
                      ]
                    }
                  ]
                }
              ]
            })
          ],
          buttons : [{
            text: "确 定",ref : "../saveBtn",scope:this,
            handler : function() {
              switch (Km.Coupon.Config.OnlineEditor)
              {
                case 2:
                  if (Km.Coupon.View.PublishEmailView.EditWindow.KindEditor_emailcontent) this.publishemaileditForm.emailcontent.setValue(Km.Coupon.View.PublishEmailView.EditWindow.KindEditor_emailcontent.html());
                  break
                case 3:
                  break
                default:
                  if (CKEDITOR.instances.emailcontent) this.publishemaileditForm.emailcontent.setValue(CKEDITOR.instances.emailcontent.getData());
              }
              if (!this.publishemaileditForm.getForm().isValid()) {
                return;
              }
              editWindow=this;
              this.publishemaileditForm.api.submit=ExtServiceCoupon.publishemailCoupon;
              this.publishemaileditForm.getForm().submit({
                success : function(form, action){
                  form.reset();
                  editWindow.hide();
                  Ext.Msg.alert('提示', action.result.data);
                },
                failure : function(form, action) {
                  Ext.Msg.alert('提示', action.result.data);
                },
                waitMsg : '正在提交,请稍候...'
              });
            }
          }, {
            text : "取 消",scope:this,
            handler : function() {
              this.publishemaileditForm.form.getEl().dom.reset();
              this.hide();
            }
          }, {
            text : "重 置",ref:'../resetBtn',scope:this,
            handler : function() {
              this.publishemaileditForm.form.getEl().dom.reset();
              var selectCoupon=Km.Coupon.View.Running.couponGrid.getSelectionModel().getSelected().data;
              var openwindow=Km.Coupon.View.Running.edit_window_publishemail;
              openwindow.eshowcoupon_id.setValue(selectCoupon.coupon_id);
              openwindow.eshowcoupon_name.setValue(selectCoupon.coupon_name);
              openwindow.eshowcoupon_key.setValue(selectCoupon.coupon_key);
              switch (Km.Coupon.Config.OnlineEditor)
              {
                case 2:
                  if (Km.Coupon.View.PublishEmailView.EditWindow.KindEditor_emailcontent) Km.Coupon.View.PublishEmailView.EditWindow.KindEditor_emailcontent.html("");
                  break;
                case 3:
                  break;
                default:
                  if (CKEDITOR.instances.emailcontent) CKEDITOR.instances.emailcontent.setData("");
              }
              switch(selectCoupon.preferential_type){
                case '1':
                  openwindow.eshowcoupon_type.setValue("对某些商品打折");
                break;
                case '2':
                  openwindow.eshowcoupon_type.setValue("购物满一定金额送优惠券");
                break;
                case '3':
                  openwindow.eshowcoupon_type.setValue("购物满一定金额打折");
                break;
                case '4':
                  openwindow.eshowcoupon_type.setValue("购物满一定金额立减金额");
                break;
                case '5':
                  openwindow.eshowcoupon_type.setValue("现金抵扣券");
                break;
                default:
                break;
              }
            }
          }]
        }, config);
        Km.Coupon.View.PublishEmailView.EditWindow.superclass.constructor.call(this, config);
      }
    })
  },
  /**
   * 优惠券批量发布
   */
  PublishAllView:{
    /**
     * 编辑窗口：优惠券发布
     */
    EditWindow:Ext.extend(Ext.Window,{
      constructor : function(config) {
        config = Ext.apply({
          closeAction : "hide",title:"优惠券批量发布",
          constrainHeader:true,maximizable: true,collapsible: true,
          width : 880,height : 200,minWidth : 880,minHeight : 550,
          layout : 'fit',plain : true,buttonAlign : 'center',
          defaults : {autoScroll : true},
          listeners:{
            beforehide:function(){
              this.publishalleditForm.form.getEl().dom.reset();
            },
            afterrender:function(){
              this.publishalleditForm.num.setValue(1);
            }
          },
          items : [
            new Ext.form.FormPanel({
              ref:'publishalleditForm',layout:'form',
              labelWidth : 100,labelAlign : "center",
              bodyStyle : 'padding:5px 5px 0',align : "center",
              api : {},
              defaults : {xtype : 'textfield',anchor:'98%'},
              items : [
                {xtype: 'hidden',  name : 'eshowcoupon_id',ref:'../eshowcoupon_id'},
                {fieldLabel : '优惠券名称',name : 'eshowcoupon_name',ref:'../eshowcoupon_name',disabled:true},
                {fieldLabel : '优惠券号码前缀',name : 'eshowcoupon_key',id:'eshowcoupon_key',ref:'../eshowcoupon_key',disabled:true},
                {fieldLabel : '优惠券类型',name : 'eshowcoupon_type',id:'eshowcoupon_type',ref:'../eshowcoupon_type',disabled:true,xtype:'displayfield'},
                {fieldLabel : '生成数量',name : 'num',id :'num',ref:'num',xtype: 'numberfield',allowBlank:false}
              ]
            })
          ],
          buttons : [{
            text: "确 定",ref : "../saveBtn",scope:this,
            handler : function() {

              if (!this.publishalleditForm.getForm().isValid()) {
                return;
              }
              if (this.publishalleditForm.num.getValue()<1) {
                Ext.Msg.alert('提示', '数量必须大于1');
              }
              editWindow=this;
              this.publishalleditForm.api.submit=ExtServiceCoupon.publishallCoupon;
              this.publishalleditForm.getForm().submit({
                success : function(form, action){
                  form.reset();
                  editWindow.hide();
                  Ext.Msg.alert('提示', '成功生成'+action.result.data+"份优惠卷");
                },
                failure : function(form, action) {
                  Ext.Msg.alert('提示', '发布失败');
                },
                waitMsg : '正在提交,请稍候...'
              });
            }
          }, {
            text : "取 消",scope:this,
            handler : function() {
              this.publishalleditForm.form.getEl().dom.reset();
              this.hide();
            }
          }, {
            text : "重 置",ref:'../resetBtn',scope:this,
            handler : function() {
              this.publishalleditForm.form.getEl().dom.reset();
              var selectCoupon=Km.Coupon.View.Running.couponGrid.getSelectionModel().getSelected().data;
              var openwindow=Km.Coupon.View.Running.edit_window_publishall;
              openwindow.eshowcoupon_id.setValue(selectCoupon.coupon_id);
              openwindow.eshowcoupon_name.setValue(selectCoupon.coupon_name);
              openwindow.eshowcoupon_key.setValue(selectCoupon.coupon_key);
              openwindow.num.setValue(1);

              switch(selectCoupon.preferential_type){
                case '1':
                  openwindow.eshowcoupon_type.setValue("对某些商品打折");
                break;
                case '2':
                  openwindow.eshowcoupon_type.setValue("购物满一定金额送优惠券");
                break;
                case '3':
                  openwindow.eshowcoupon_type.setValue("购物满一定金额打折");
                break;
                case '4':
                  openwindow.eshowcoupon_type.setValue("购物满一定金额立减金额");
                break;
                case '5':
                  openwindow.eshowcoupon_type.setValue("现金抵扣券");
                break;
                default:
                break;
              }
            }
          }]
        }, config);
        Km.Coupon.View.PublishAllView.EditWindow.superclass.constructor.call(this, config);
      }
    })
  },

  /**
   * 视图：优惠券
   */
  SelectCouponView:{
    SelectCouponWindow:Ext.extend(Ext.Window,{
      constructor : function(config) {
        config = Ext.apply({
          title:"选择优惠券",updateData:null,closeAction:"hide",constrainHeader:true,maximizable:true,collapsible:true,
          width:900,minWidth:900,height:560,minHeight:450,layout:'fit',plain : true,buttonAlign : 'center',
          defaults : {autoScroll : true},
          listeners:{

          },
          items : [new Km.Coupon.View.SelectCouponView.SelectCouponGrid({ref:"selectCouponGrid"})],
          buttons : [ {
            text: "确定",ref : "../saveBtn",scope:this,
            handler : function() {
              //获取选中的项
              var selectedData=Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.getSelectionModel().getSelections();
              var selids="";
              var idcount=selectedData.length;
              //如果选中项个数不为零
              if(idcount){
                for(var i=0;i<selectedData.length;i++){
                  selids=selids+selectedData[i].get("coupon_id")+',';
                }
              }
              if(!idcount){
                idcount=0;
              }
              var selmsg='<font color=green>(您总共选择了'+idcount+'张优惠券!)</font>';
              Ext.getCmp('givecouponitems').setValue(selids);
              Ext.getCmp('givebutton').removeClass('x-form-invalid');
              Ext.getCmp('givebuttontext').setValue(selmsg);
              this.hide();
            }
          }, {
            text : "取 消",scope:this,
            handler : function() {
              this.hide();
            }
          }]
        }, config);
        Km.Coupon.View.SelectCouponView.SelectCouponWindow.superclass.constructor.call(this, config);
      }
    }),
    SelectCouponGrid:Ext.extend(Ext.grid.GridPanel,{
      constructor : function(config) {
        config = Ext.apply({
          /**
           * 查询条件
           */
          filter:null,preferentialrule_id:null,coupon_id:null,region : 'center',store : Km.Coupon.Store.selcouponStore,sm : this.sm,
          trackMouseOver : true,enableColumnMove : true,columnLines : true,loadMask : true,stripeRows : true,headerAsText : false,
          defaults : {autoScroll : true},
          cm : new Ext.grid.ColumnModel({
            defaults:{width:120,sortable : true},
            columns : [
              this.sm,
              {header : '标识',dataIndex : 'coupon_id',hidden:true},
              {header : '优惠券名称',dataIndex : 'coupon_name'},
              {header : '优惠券号码前缀',dataIndex : 'coupon_key'},
              {header : '优惠券类型',dataIndex : 'coupon_typeShow'},
              {header : '优惠券数量',dataIndex : 'coupon_num'},
              {header : '开始时间',dataIndex : 'begin_time',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i:s'),width:150},
              {header : '结束时间',dataIndex : 'end_time',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i:s'),width:150},
              {header : '是否有效',dataIndex : 'isValid',renderer:function(value){if (value == true) {return "是";}else{return "否";}}}
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
                      if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectCoupon();
                    }
                  }
                },
                items : [
                  {text: '全部',ref:'../../isSelect',xtype:'tbsplit',iconCls : 'icon-view',enableToggle: true,
                     toggleHandler:function(item, checked){
                      if (checked==true){
                        Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.topToolbar.menus.select.setChecked(true);
                      }else{
                        Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.topToolbar.menus.all.setChecked(true);
                      }
                    },
                    menu: {
                      items: [
                        {text: '全部',checked: true,group: 'isSelect',ref:'../../all',
                          checkHandler: function(item, checked){
                            if (checked){
                              Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.isSelect.setText(item.text);
                              Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.filter.selectType=0;
                            }
                            Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.doSelectCoupon();
                          }
                        },
                        {text: '未选择',checked: false,group: 'isSelect',ref:'../../unselect',
                            checkHandler: function(item, checked){
                              if (checked){
                                Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.isSelect.setText(item.text);
                                Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.filter.selectType=2;
                              }
                              Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.doSelectCoupon();
                            }
                        },
                        {text: '已选择',checked: false,group: 'isSelect',ref:'../../select',
                            checkHandler: function(item, checked){
                              if (checked){
                                Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.isSelect.setText(item.text);
                                Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.filter.selectType=1;
                              }
                              Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.doSelectCoupon();
                          }
                        }
                       ]
                    }
                  },
                  '优惠券名称','&nbsp;&nbsp;',{ref: '../selcoupon_name'},'&nbsp;&nbsp;',
                  '优惠券类型','&nbsp;&nbsp;',{hiddenName : 'selcoupon_type'
                    ,xtype:'combo',ref:'../selcoupon_type',mode : 'local',triggerAction : 'all',
                    lazyRender : true,editable: false,allowBlank : false,valueNotFoundText:'否',
                    store : new Ext.data.SimpleStore({
                      fields : ['value', 'text'],
                      data : [['1', '多张使用一次'], ['2', '一张无限使用']]
                    }),emptyText: '请选择优惠券类型',
                    valueField : 'value',displayField :'text'
                  },'&nbsp;&nbsp;',
                  {
                    xtype : 'button',text : '查询',scope: this,
                    handler : function() {
                      this.doSelectCoupon();
                    }
                  },
                  {
                    xtype : 'button',text : '重置',scope: this,
                    handler : function() {
                      this.topToolbar.selcoupon_name.setValue("");
                      this.topToolbar.selcoupon_type.setValue("");
                      this.filter={};
                      this.doSelectCoupon();
                    }
                  }
                ]
              })
            ]
          },
          bbar: new Ext.PagingToolbar({
            pageSize: Km.Coupon.Config.PageSize,
            store: Km.Coupon.Store.selcouponStore,
            scope:this,autoShow:true,displayInfo: true,
            displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
            emptyMsg: "无显示数据",
            items: [
              {xtype:'label', text: '每页显示'},
              {xtype:'numberfield', value:Km.Coupon.Config.PageSize,minValue:1,width:35,
                style:'text-align:center',allowBlank:false,
                listeners:
                {
                  change:function(Field, newValue, oldValue){
                    var num = parseInt(newValue);
                    if (isNaN(num) || !num || num<1)
                    {
                      num = Km.Coupon.Config.PageSize;
                      Field.setValue(num);
                    }
                    this.ownerCt.pageSize= num;
                    Km.Coupon.Config.PageSize = num;
                    this.ownerCt.ownerCt.doSelectCoupon();
                  },
                  specialKey :function(field,e){
                    if (e.getKey() == Ext.EventObject.ENTER){
                      var num = parseInt(field.getValue());
                      if (isNaN(num) || !num || num<1)
                      {
                        num = Km.Coupon.Config.PageSize;
                      }
                      this.ownerCt.pageSize= num;
                      Km.Coupon.Config.PageSize = num;
                      this.ownerCt.ownerCt.doSelectCoupon();
                    }
                  }
                }
              },
              {xtype:'label', text: '个'}
            ]
          })
        }, config);
        Km.Coupon.Store.selcouponStore.proxy=new Ext.data.DirectProxy({
          api: {read:ExtServiceCoupon.queryPageSelCoupon}
        });
        Km.Coupon.View.SelectCouponView.SelectCouponGrid.superclass.constructor.call(this, config);
      },
      sm : new Ext.grid.CheckboxSelectionModel(),
      doSelectCoupon : function() {
        if (this.topToolbar){
          var coupon_id=this.coupon_id;
          var preferentialrule_id=this.preferentialrule_id;
          if (!this.filter.selectType)this.filter.selectType=0;
          var selcoupon_name = this.topToolbar.selcoupon_name.getValue();
          var selcoupon_type = this.topToolbar.selcoupon_type.getValue();
          this.filter     ={'coupon_name':selcoupon_name,'coupon_type':selcoupon_type,'preferentialrule_id':preferentialrule_id,'coupon_id':coupon_id,'selectType':this.filter.selectType};
        }
        var condition = {'start':0,'limit':Km.Coupon.Config.PageSize};
        Ext.apply(condition,this.filter);
        ExtServiceCoupon.queryPageSelCoupon(condition,function(provider, response) {
          if (response.result&&response.result.data) {
            var result       = new Array();
            result['data']     =response.result.data;
            result['totalCount'] =response.result.totalCount;
            //选中的优惠券
            var ids=Ext.getCmp('givecouponitems').getValue();
            if(ids){
              var selectedData=ids.split(",");
              for(var i=0;i<selectedData.length;i++){
                for(var j=0;j<result['data'].length;j++){
                  if(result['data'][j].coupon_id==selectedData[i]){
                    result['data'][j].isShowCouponCheck=true;
                  }
                }
              }
            }
            Km.Coupon.Store.selcouponStore.loadData(result);
          } else {
            Km.Coupon.Store.selcouponStore.removeAll();
            Ext.Msg.alert('提示', '无符合条件的优惠券！');
          }
        });
      }
    })
  },
  /**
   * 视图：商品
   */
  SelectProductView:{
    SelectProductWindow:Ext.extend(Ext.Window,{
      constructor : function(config) {
        config = Ext.apply({
          title:"选择商品",updateData:null,closeAction:"hide",constrainHeader:true,maximizable:true,collapsible:true,
          width:900,minWidth:900,height:560,minHeight:450,layout:'fit',plain : true,buttonAlign : 'center',
          defaults : {autoScroll : true},
          listeners:{

          },
          items : [new Km.Coupon.View.SelectProductView.SelectProductGrid({ref:"selectProductGrid"})],
          buttons : [ {
            text: "确定",ref : "../saveBtn",scope:this,
            handler : function() {
              //获取选中的项
              var selectedData=Km.Coupon.View.Running.selectProductWindow.selectProductGrid.getSelectionModel().getSelections();
              var selids="";
              var idcount=selectedData.length;
              //如果选中项个数不为零
              if(idcount){
                for(var i=0;i<selectedData.length;i++){
                  selids=selids+selectedData[i].get("product_id")+',';
                }
              }
              if(!idcount){
                idcount=0;
              }
              var selmsg='<font color=green>(您总共选择了'+idcount+'件商品!)</font>';
              Ext.getCmp('selproductitems').setValue(selids);
              Ext.getCmp('selbutton').removeClass('x-form-invalid');
              Ext.getCmp('selbuttontext').setValue(selmsg);
              this.hide();
            }
          }, {
            text : "取 消",scope:this,
            handler : function() {
              this.hide();
            }
          }]
        }, config);
        Km.Coupon.View.SelectProductView.SelectProductWindow.superclass.constructor.call(this, config);
      }
    }),
    SelectProductGrid:Ext.extend(Ext.grid.GridPanel,{
      constructor : function(config) {
        config = Ext.apply({
          /**
           * 查询条件
           */
          filter:null,preferentialrule_id:null,region : 'center',store : Km.Coupon.Store.selproductStore,sm : this.sm,
          trackMouseOver : true,enableColumnMove : true,columnLines : true,loadMask : true,stripeRows : true,headerAsText : false,
          defaults : {autoScroll : true},
          cm : new Ext.grid.ColumnModel({
            defaults:{width:120,sortable : true},
            columns : [
              this.sm,
              {header : '商品名称',dataIndex : 'product_name'},
              {header : '商品分类',dataIndex : 'ptype_name'},
              {header : '商品货号',dataIndex : 'product_code'},
              {header : '市场价',dataIndex : 'market_price'},
              {header : '销售价',dataIndex : 'price'},
              {header : '数量',dataIndex : 'num'}
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
                      if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectProduct();
                    }
                  }
                },
                items : [
                  {text: '全部',ref:'../../isSelect',xtype:'tbsplit',iconCls : 'icon-view',enableToggle: true,
                     toggleHandler:function(item, checked){
                      if (checked==true){
                        Km.Coupon.View.Running.selectProductWindow.selectProductGrid.topToolbar.menus.select.setChecked(true);
                      }else{
                        Km.Coupon.View.Running.selectProductWindow.selectProductGrid.topToolbar.menus.all.setChecked(true);
                      }
                    },
                    menu: {
                      items: [
                        {text: '全部',checked: true,group: 'isSelect',ref:'../../all',
                          checkHandler: function(item, checked){
                            if (checked){
                              Km.Coupon.View.Running.selectProductWindow.selectProductGrid.isSelect.setText(item.text);
                              Km.Coupon.View.Running.selectProductWindow.selectProductGrid.filter.selectType=0;
                            }
                            Km.Coupon.View.Running.selectProductWindow.selectProductGrid.doSelectProduct();
                          }
                        },
                        {text: '未选择',checked: false,group: 'isSelect',ref:'../../unselect',
                            checkHandler: function(item, checked){
                              if (checked){
                                Km.Coupon.View.Running.selectProductWindow.selectProductGrid.isSelect.setText(item.text);
                                Km.Coupon.View.Running.selectProductWindow.selectProductGrid.filter.selectType=2;
                              }
                              Km.Coupon.View.Running.selectProductWindow.selectProductGrid.doSelectProduct();
                            }
                        },
                        {text: '已选择',checked: false,group: 'isSelect',ref:'../../select',
                            checkHandler: function(item, checked){
                              if (checked){
                                Km.Coupon.View.Running.selectProductWindow.selectProductGrid.isSelect.setText(item.text);
                                Km.Coupon.View.Running.selectProductWindow.selectProductGrid.filter.selectType=1;
                              }
                              Km.Coupon.View.Running.selectProductWindow.selectProductGrid.doSelectProduct();
                          }
                        }
                       ]
                    }
                  },
                  '商品名称','&nbsp;&nbsp;',{ref: '../product_name'},'&nbsp;&nbsp;',
                  {
                    xtype : 'button',text : '查询',scope: this,
                    handler : function() {
                      this.doSelectProduct();
                    }
                  },
                  {
                    xtype : 'button',text : '重置',scope: this,
                    handler : function() {
                      this.topToolbar.product_name.setValue("");
                      this.filter={};
                      this.doSelectProduct();
                    }
                  }
                ]
              })
            ]
          },
          bbar: new Ext.PagingToolbar({
            pageSize: Km.Coupon.Config.PageSize,
            store: Km.Coupon.Store.selproductStore,
            scope:this,autoShow:true,displayInfo: true,
            displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
            emptyMsg: "无显示数据",
            items: [
              {xtype:'label', text: '每页显示'},
              {xtype:'numberfield', value:Km.Coupon.Config.PageSize,minValue:1,width:35,
                style:'text-align:center',allowBlank:false,
                listeners:
                {
                  change:function(Field, newValue, oldValue){
                    var num = parseInt(newValue);
                    if (isNaN(num) || !num || num<1)
                    {
                      num = Km.Coupon.Config.PageSize;
                      Field.setValue(num);
                    }
                    this.ownerCt.pageSize= num;
                    Km.Coupon.Config.PageSize = num;
                    this.ownerCt.ownerCt.doSelectProduct();
                  },
                  specialKey :function(field,e){
                    if (e.getKey() == Ext.EventObject.ENTER){
                      var num = parseInt(field.getValue());
                      if (isNaN(num) || !num || num<1)
                      {
                        num = Km.Coupon.Config.PageSize;
                      }
                      this.ownerCt.pageSize= num;
                      Km.Coupon.Config.PageSize = num;
                      this.ownerCt.ownerCt.doSelectProduct();
                    }
                  }
                }
              },
              {xtype:'label', text: '个'}
            ]
          })
        }, config);
        Km.Coupon.Store.selproductStore.proxy=new Ext.data.DirectProxy({
          api: {read:ExtServiceCoupon.queryPageSelProduct}
        });
        Km.Coupon.View.SelectProductView.SelectProductGrid.superclass.constructor.call(this, config);
      },
      sm : new Ext.grid.CheckboxSelectionModel(),
      doSelectProduct : function() {
        if (this.topToolbar){
          var preferentialrule_id=this.preferentialrule_id;
          if (!this.filter.selectType)this.filter.selectType=0;
          var product_name = this.topToolbar.product_name.getValue();
          this.filter ={'product_name':product_name,'preferentialrule_id':preferentialrule_id,'selectType':this.filter.selectType};
        }
        var condition = {'start':0,'limit':Km.Coupon.Config.PageSize};
        Ext.apply(condition,this.filter);
        ExtServiceCoupon.queryPageSelProduct(condition,function(provider, response) {
          if (response.result&&response.result.data) {
            var result       = new Array();
            result['data']     =response.result.data;
            result['totalCount'] =response.result.totalCount;
            //选中的商品
            var ids=Ext.getCmp('selproductitems').getValue();
            if(ids){
              var selectedData=ids.split(",");
              for(var i=0;i<selectedData.length;i++){
                for(var j=0;j<result['data'].length;j++){
                  if(result['data'][j].product_id==selectedData[i]){
                    result['data'][j].isShowProductCheck=true;
                  }
                }
              }
            }
            Km.Coupon.Store.selproductStore.loadData(result);
          } else {
            Km.Coupon.Store.selproductStore.removeAll();
            Ext.Msg.alert('提示', '无符合条件的课程！');
          }
        });
      }
    })
  },
    /**
     * 显示优惠券表详情
     */
    CouponView:{
        /**
         * Tab页：容器包含显示与优惠券表所有相关的信息
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
                                if (Km.Coupon.View.Running.couponGrid.getSelectionModel().getSelected()==null){
                                    Ext.Msg.alert('提示', '请先选择优惠券！');
                                    return false;
                                }
                                Km.Coupon.Config.View.IsShow=1;
                                Km.Coupon.View.Running.couponGrid.showCoupon();
                                Km.Coupon.View.Running.couponGrid.tvpView.menu.mBind.setChecked(false);
                                return false;
                            }
                        }
                    },
                    items: [
                        {title:'+',tabTip:'取消固定',ref:'tabFix',iconCls:'icon-fix'}
                    ]
                }, config);
                Km.Coupon.View.CouponView.Tabs.superclass.constructor.call(this, config);
        Km.Coupon.View.Running.couponitemsGrid = new Km.Coupon.View.CouponitemsView.Grid();
                this.onAddItems();
            },
            /**
             * 根据布局调整Tabs的宽度或者高度以及折叠
             */
            enableCollapse:function(){
                if ((Km.Coupon.Config.View.Direction==1)||(Km.Coupon.Config.View.Direction==2)){
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
                    {title: '基本信息',ref:'tabCouponDetail',iconCls:'tabs',
                     tpl: [
                         '<table class="viewdoblock">',
             '  <tr class="entry"><td class="head">优惠券名称</td><td class="content">{coupon_name}</td></tr>',
             '  <tr class="entry"><td class="head">优惠券号码前缀</td><td class="content">{coupon_key}</td></tr>',
             '  <tr class="entry"><td class="head">优惠券类型</td><td class="content">{coupon_typeShow}</td></tr>',
             '  <tr class="entry"><td class="head">优惠券数量</td><td class="content">{coupon_num}</td></tr>',
             '  <tr class="entry"><td class="head">开始时间</td><td class="content">{begin_time:date("Y-m-d H:i:s")}</td></tr>',
             '  <tr class="entry"><td class="head">结束时间</td><td class="content">{end_time:date("Y-m-d H:i:s")}</td></tr>',
             '  <tr class="entry"><td class="head">是否有效</td><td class="content"><tpl if="isValid == true">是</tpl><tpl if="isValid == false">否</tpl></td></tr>',
             '  <tr class="entry"><td class="head">优惠券描述</td><td class="content">{prefdescribe}</td></tr>',
             '  <tr class="entry"><td class="head">排序</td><td class="content">{sort_order}</td></tr>',
                         '</table>'
                     ]},
          {title: '优惠券交易流水',ref:'tabTransaction',iconCls:'tabs',tabWidth:150,
            items:[Km.Coupon.View.Running.couponitemsGrid]
          }
                );
            }
        }),
        /**
         * 窗口:显示优惠券信息
         */
        Window:Ext.extend(Ext.Window,{
            constructor : function(config) {
                config = Ext.apply({
                    title:"查看优惠券",constrainHeader:true,maximizable: true,minimizable : true,
                    width : 705,height : 500,minWidth : 450,minHeight : 400,
                    layout : 'fit',resizable:true,plain : true,bodyStyle : 'padding:5px;',
                    closeAction : "hide",
                    items:[new Km.Coupon.View.CouponView.Tabs({ref:'winTabs',tabPosition:'top'})],
                    listeners: {
                        minimize:function(w){
                            w.hide();
                            Km.Coupon.Config.View.IsShow=0;
                            Km.Coupon.View.Running.couponGrid.tvpView.menu.mBind.setChecked(true);
                        },
                        hide:function(w){
                            Km.Coupon.Config.View.IsShow=0;
                            Km.Coupon.View.Running.couponGrid.tvpView.toggle(false);
                        }
                    },
                    buttons: [{
                        text: '新增优惠券',scope:this,
                        handler : function() {this.hide();Km.Coupon.View.Running.couponGrid.addCoupon();}
                    },{
                        text: '修改优惠券',scope:this,
                        handler : function() {this.hide();Km.Coupon.View.Running.couponGrid.updateCoupon();}
                    }]
                }, config);
                Km.Coupon.View.CouponView.Window.superclass.constructor.call(this, config);
            }
        })
    },
    /**
     * 窗口：批量上传优惠券
     */
    UploadWindow:Ext.extend(Ext.Window,{
        constructor : function(config) {
            config = Ext.apply({
                title : '批量上传优惠券数据',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
                            emptyText: '请上传优惠券Excel文件',buttonText: '',
                            accept:'application/vnd.ms-excel',
                            buttonCfg: {iconCls: 'upload-icon'}
                        }]
                    })
                ],
                buttons : [{
                        text : '上 传',
                        scope:this,
                        handler : function() {
                            uploadWindow       =this;
                            validationExpression   =/([\u4E00-\u9FA5]|\w)+(.xlsx|.XLSX|.xls|.XLS)$/;/**允许中文名*/
                            var isValidExcelFormat = new RegExp(validationExpression);
                            var result       = isValidExcelFormat.test(this.uploadForm.upload_file.getValue());
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
                                    url : 'index.php?go=admin.upload.uploadCoupon',
                                    success : function(form, response) {
                                        Ext.Msg.alert('成功', '上传成功');
                                        uploadWindow.hide();
                                        uploadWindow.uploadForm.upload_file.setValue('');
                                        Km.Coupon.View.Running.couponGrid.doSelectCoupon();
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
            Km.Coupon.View.UploadWindow.superclass.constructor.call(this, config);
        }
    }),

  /**
   * 窗口：批量上传手机号码
   */
  PhoneUploadWindow:Ext.extend(Ext.Window,{
    constructor : function(config) {
      config = Ext.apply({
        title : '批量上传手机号码',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
              emptyText: '请上传手机号码txt文件',buttonText: '',
              accept:'application/vnd.ms-excel',
              buttonCfg: {iconCls: 'upload-icon'}
            }]
          })
        ],
        buttons : [{
            text : '上 传',
            scope:this,
            handler : function() {
              uploadWindow       =this;
              var file_name      =this.uploadForm.upload_file.getValue();
              var lower_file_name      =Ext.util.Format.lowercase(file_name);
              validationExpression   =/([\u4E00-\u9FA5]|\w)+(.txt)$/;/**允许中文名*/
              var isValidExcelFormat = new RegExp(validationExpression);
              var result       = isValidExcelFormat.test(lower_file_name);
              if (!result){
                Ext.Msg.alert('提示', '请上传txt文件！');
                return;
              }
              if (this.uploadForm.getForm().isValid()) {
                this.uploadForm.getForm().submit({
                  url : 'home/admin/src/httpdata/phonenumber.php',
                  method : 'POST',
                  waitMsg: '正在保存文件...',
                  success : function(form, response) {
                    Ext.Msg.alert('提示', response.result.msg);
                    uploadWindow.hide();
                    uploadWindow.uploadForm.upload_file.setValue('');
                    Km.Coupon.View.Running.edit_window_publish.showphone.setValue(response.result.data);
                  },
                  failure : function(form, response) {
                    Ext.Msg.alert('错误', response.result.msg);
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
      Km.Coupon.View.PhoneUploadWindow.superclass.constructor.call(this, config);
    }
  }),

  /**
   * 窗口：批量上传邮箱号码
   */
  EmailUploadWindow:Ext.extend(Ext.Window,{
    constructor : function(config) {
      config = Ext.apply({
        title : '批量上传邮箱号码',width : 400,height : 110,minWidth : 300,minHeight : 100,
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
              emptyText: '请上传邮箱号码txt文件',buttonText: '',
              accept:'application/vnd.ms-excel',
              buttonCfg: {iconCls: 'upload-icon'}
            }]
          })
        ],
        buttons : [{
            text : '上 传',
            scope:this,
            handler : function() {
              uploadWindow       =this;
              var file_name      =this.uploadForm.upload_file.getValue();
              var lower_file_name      =Ext.util.Format.lowercase(file_name);
              validationExpression   =/([\u4E00-\u9FA5]|\w)+(.txt)$/;/**允许中文名*/
              var isValidExcelFormat = new RegExp(validationExpression);
              var result       = isValidExcelFormat.test(lower_file_name);
              if (!result){
                Ext.Msg.alert('提示', '请上传txt文件！');
                return;
              }
              if (this.uploadForm.getForm().isValid()) {
                this.uploadForm.getForm().submit({
                  url : 'home/admin/src/httpdata/emailnumber.php',
                  method : 'POST',
                  waitMsg: '正在保存文件...',
                  success : function(form, response) {
                    Ext.Msg.alert('提示', response.result.msg);
                    uploadWindow.hide();
                    uploadWindow.uploadForm.upload_file.setValue('');
                    Km.Coupon.View.Running.edit_window_publishemail.showemail.setValue(response.result.data);
                  },
                  failure : function(form, response) {
                    Ext.Msg.alert('错误', response.result.msg);
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
      Km.Coupon.View.EmailUploadWindow.superclass.constructor.call(this, config);
    }
  }),

  /**
   * View:优惠券实体表显示组件
   */
  CouponitemsView:{
    /**
     * 视图：优惠券实体表列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
      constructor : function(config) {
        config = Ext.apply({
          /**
           * 查询条件
           */
          filter:null,
          region : 'center',
          store : Km.Coupon.Store.couponitemsStore,
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
              {header : '标识',dataIndex : 'couponitems_id',hidden:true},
              {header : '优惠券号码',dataIndex : 'couponitems_key',width:150},
              {header : '优惠券价值',dataIndex : 'coupon_value'},
              {header : '手机号码',dataIndex : 'phonenumber'},
              {header : '是否兑换',dataIndex : 'isExchange',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
              {header : '生成方式',dataIndex : 'create_fromShow'}
            ]
          }),
          tbar : {
            xtype : 'container',layout : 'anchor',height : 27,style:'font-size:14px',
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
                      if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectCouponitems();
                    }
                  }
                },
                items : [
                  '优惠券号码:',"&nbsp;&nbsp;",{ref: '../couponitems_key',width:200},"&nbsp;&nbsp;",
                  '手机号码:',"&nbsp;&nbsp;",{ref: '../couponitemsphone_name',width:200},"&nbsp;&nbsp;",
                  {
                    xtype : 'button',text : '查询',scope: this,
                    handler : function() {
                      this.doSelectCouponitems();
                    }
                  },
                  {
                    xtype : 'button',text : '重置',scope: this,
                    handler : function() {
                      this.topToolbar.couponitemsphone_name.setValue("");
                      this.topToolbar.couponitems_key.setValue("");
                      this.filter={};
                      this.doSelectCouponitems();
                    }
                  }]
              })
            ]
          },
          bbar: new Ext.PagingToolbar({
            pageSize: Km.Coupon.Config.PageSize,
            store: Km.Coupon.Store.couponitemsStore,
            scope:this,autoShow:true,displayInfo: true,
            displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
            emptyMsg: "无显示数据",
            listeners:{
              change:function(thisbar,pagedata){
                  if (Km.Coupon.Viewport){
                    if (Km.Coupon.Config.View.IsShow==1){
                      Km.Coupon.View.IsSelectView=1;
                    }
                    this.ownerCt.hideCoupon();
                    Km.Coupon.Config.View.IsShow=0;
                  }
              }
            },
            items: [
              {xtype:'label', text: '每页显示'},
              {xtype:'numberfield', value:Km.Coupon.Config.PageSize,minValue:1,width:35,
                style:'text-align:center',allowBlank: false,
                listeners:
                {
                  change:function(Field, newValue, oldValue){
                    var num = parseInt(newValue);
                    if (isNaN(num) || !num || num<1)
                    {
                      num = Km.Coupon.Config.PageSize;
                      Field.setValue(num);
                    }
                    this.ownerCt.pageSize= num;
                    Km.Coupon.Config.PageSize = num;
                    this.ownerCt.ownerCt.doSelectCouponitems();
                  },
                  specialKey :function(field,e){
                    if (e.getKey() == Ext.EventObject.ENTER){
                      var num = parseInt(field.getValue());
                      if (isNaN(num) || !num || num<1)
                      {
                        num = Km.Coupon.Config.PageSize;
                      }
                      this.ownerCt.pageSize= num;
                      Km.Coupon.Config.PageSize = num;
                      this.ownerCt.ownerCt.doSelectCouponitems();
                    }
                  }
                }
              },
              {xtype:'label', text: '个'}
            ]
          })
        }, config);
        Km.Coupon.Store.couponitemsStore.proxy=new Ext.data.DirectProxy({
            api: {read:ExtServiceCouponitems.queryPageCouponitems}
        });
        Km.Coupon.View.Grid.superclass.constructor.call(this, config);
      },
      /**
       * 行选择器
       */
      sm : new Ext.grid.CheckboxSelectionModel({
        //handleMouseDown : Ext.emptyFn,
        listeners : {

        }
      }),
      /**
       * 是否绑定在本窗口上
       */
      onBindGrid:function(item, checked){
        if (checked){
           Km.Coupon.Config.View.IsFix=1;
        }else{
           Km.Coupon.Config.View.IsFix=0;
        }
        if (this.getSelectionModel().getSelected()==null){
          Km.Coupon.Config.View.IsShow=0;
          return ;
        }
        if (Km.Coupon.Config.View.IsShow==1){
           this.hideCouponitems();
           Km.Coupon.Config.View.IsShow=0;
        }
        this.showCouponitems();
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
       * 查询符合条件的优惠券实体表
       */
      doSelectCouponitems : function() {
        if (this.topToolbar){
          var coupon_data = Km.Coupon.View.Running.couponGrid.getSelectionModel().getSelected().data;
          var coupon_id = coupon_data.coupon_id;
          var couponitemsphone_name = this.topToolbar.couponitemsphone_name.getValue();
          var couponitems_key = this.topToolbar.couponitems_key.getValue();
          this.filter   ={'coupon_id':coupon_id,'phonenumber':couponitemsphone_name,'couponitems_key':couponitems_key};
        }
        var condition = {'start':0,'limit':Km.Coupon.Config.PageSize};
        Ext.apply(condition,this.filter);
        ExtServiceCouponitems.queryPageCouponitems(condition,function(provider, response) {
          if (response.result&&response.result.data) {
            var result       = new Array();
            result['data']     =response.result.data;
            result['totalCount'] =response.result.totalCount;
            Km.Coupon.Store.couponitemsStore.loadData(result);
          } else {
            Km.Coupon.Store.couponitemsStore.removeAll();
            Ext.Msg.alert('提示', '无符合条件的优惠券实体表！');
          }
        });
      },
      /**
       * 显示优惠券实体表视图
       * 显示优惠券实体表的视图相对优惠券实体表列表Grid的位置
       * 1:上方,2:下方,0:隐藏。
       */
      onUpDown:function(viewDirection){
        Km.Coupon.Config.View.Direction=viewDirection;
        switch(viewDirection){
          case 1:
            this.ownerCt.north.add(Km.Coupon.View.Running.viewTabs);
            break;
          case 2:
            this.ownerCt.south.add(Km.Coupon.View.Running.viewTabs);
            break;
          case 3:
            this.ownerCt.west.add(Km.Coupon.View.Running.viewTabs);
            break;
          case 4:
            this.ownerCt.east.add(Km.Coupon.View.Running.viewTabs);
            break;
        }
        Km.Coupon.Cookie.set('View.Direction',Km.Coupon.Config.View.Direction);
        if (this.getSelectionModel().getSelected()!=null){
          if ((Km.Coupon.Config.View.IsFix==0)&&(Km.Coupon.Config.View.IsShow==1)){
            this.showCouponitems();
          }
          Km.Coupon.Config.View.IsFix=1;
          Km.Coupon.View.Running.couponitemsGrid.tvpView.menu.mBind.setChecked(true,true);
          Km.Coupon.Config.View.IsShow=0;
          this.showCouponitems();
        }
      }
    })
  },
    /**
     * 视图：优惠券列表
     */
    Grid:Ext.extend(Ext.grid.GridPanel, {
        constructor : function(config) {
            config = Ext.apply({
                /**
                 * 查询条件
                 */
                filter:null,
                region : 'center',
                store : Km.Coupon.Store.couponStore,
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
            {header : '标识',dataIndex : 'coupon_id',hidden:true},
            {header : '优惠券名称',dataIndex : 'coupon_name'},
            {header : '优惠券号码前缀',dataIndex : 'coupon_key'},
            {header : '优惠券类型',dataIndex : 'coupon_typeShow'},
            {header : '优惠券数量',dataIndex : 'coupon_num'},
            {header : '开始时间',dataIndex : 'begin_time',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i:s'),width:150},
            {header : '结束时间',dataIndex : 'end_time',renderer:Ext.util.Format.dateRenderer('Y-m-d H:i:s'),width:150},
            {header : '是否有效',dataIndex : 'isValid',renderer:function(value){if (value == true) {return "是";}else{return "否";}}},
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
                                        if (e.getKey() == Ext.EventObject.ENTER)this.ownerCt.ownerCt.ownerCt.doSelectCoupon();
                                    }
                                }
                            },
                            items : [
                '优惠券名称:',"&nbsp;&nbsp;",{ref: '../coupon_name',width:200},"&nbsp;&nbsp;",
                '优惠券类型','&nbsp;&nbsp;',{ref: '../coupon_type',xtype : 'combo',mode : 'local',width:120,
                  triggerAction : 'all',lazyRender : true,editable: false,
                  store : new Ext.data.SimpleStore({
                    fields : ['value', 'text'],
                    data : [['1', '多张使用一次'],['2', '一张无限使用']]
                    }),
                  valueField : 'value',// 值
                  displayField : 'text'// 显示文本
                },'&nbsp;&nbsp;',
                '开始时间:',"&nbsp;&nbsp;", {xtype : 'datefield',ref: '../begin_time',format : "Y-m-d H:i:s",width:160},
                '结束时间:',"&nbsp;&nbsp;", {xtype : 'datefield',ref: '../end_time',format : "Y-m-d H:i:s",width:160},
                                {
                                    xtype : 'button',text : '查询',scope: this,
                                    handler : function() {
                                        this.doSelectCoupon();
                                    }
                                },
                                {
                                    xtype : 'button',text : '重置',scope: this,
                                    handler : function() {
                    this.topToolbar.coupon_name.setValue("");
                    this.topToolbar.coupon_type.setValue("");
                    this.topToolbar.begin_time.setValue("");
                    this.topToolbar.end_time.setValue("");
                                        this.filter={};
                                        this.doSelectCoupon();
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
                  text : '优惠券发布(短信)',iconCls : 'icon-export',ref: '../../btnPublish',disabled : true,
                  handler : function() {
                    this.publishCoupon();
                  }
                }
                ,'-',{
                  text : '优惠券发布(邮件)',iconCls : 'icon-export',ref: '../../btnPublishEmail',disabled : true,
                  handler : function() {
                    this.publishemailCoupon();
                  }
                },'-',{
                  text : '优惠券批量生成',iconCls : 'icon-export',ref: '../../btnPublishAll',disabled : true,
                  handler : function() {
                    this.publishallCoupon();
                  }
                },'-',{
                                    text : '添加优惠券',iconCls : 'icon-add',ref: '../../btnSave',
                                    handler : function() {
                                        this.addCoupon();
                                    }
                                },'-',{
                                    text : '修改优惠券',ref: '../../btnUpdate',iconCls : 'icon-edit',disabled : true,
                                    handler : function() {
                                        this.updateCoupon();
                                    }
                                },'-',{
                                    text : '删除优惠券', ref: '../../btnRemove',iconCls : 'icon-delete',disabled : true,
                                    handler : function() {
                                        this.deleteCoupon();
                                    }
                                },'-',{
                                    xtype:'tbsplit',text: '查看优惠券', ref:'../../tvpView',iconCls : 'icon-updown',
                                    enableToggle: true, disabled : true,
                                    handler:function(){this.showCoupon()},
                                    menu: {
                                        xtype:'menu',plain:true,
                                        items: [
                                            {text:'上方',group:'mlayout',checked:false,iconCls:'view-top',scope:this,handler:function(){this.onUpDown(1)}},
                                            {text:'下方',group:'mlayout',checked:true ,iconCls:'view-bottom',scope:this,handler:function(){this.onUpDown(2)}},
                                            {text:'左侧',group:'mlayout',checked:false,iconCls:'view-left',scope:this,handler:function(){this.onUpDown(3)}},
                                            {text:'右侧',group:'mlayout',checked:false,iconCls:'view-right',scope:this,handler:function(){this.onUpDown(4)}},
                                            {text:'隐藏',group:'mlayout',checked:false,iconCls:'view-hide',scope:this,handler:function(){this.hideCoupon();Km.Coupon.Config.View.IsShow=0;}},'-',
                                            {text: '固定',ref:'mBind',checked: true,scope:this,checkHandler:function(item, checked){this.onBindGrid(item, checked);Km.Coupon.Cookie.set('View.IsFix',Km.Coupon.Config.View.IsFix);}}
                                        ]}
                                },'-']}
                    )]
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: Km.Coupon.Config.PageSize,
                    store: Km.Coupon.Store.couponStore,
                    scope:this,autoShow:true,displayInfo: true,
                    displayMsg: '当前显示 {0} - {1}条记录/共 {2}条记录。',
                    emptyMsg: "无显示数据",
                    listeners:{
                        change:function(thisbar,pagedata){
                            if (Km.Coupon.Config.View.IsShow==1){
                                Km.Coupon.View.IsSelectView=1;
                            }
                            this.ownerCt.hideCoupon();
                            Km.Coupon.Config.View.IsShow=0;
                        }
                    },
                    items: [
                        {xtype:'label', text: '每页显示'},
                        {xtype:'numberfield', value:Km.Coupon.Config.PageSize,minValue:1,width:35,
                            style:'text-align:center',allowBlank: false,
                            listeners:
                            {
                                change:function(Field, newValue, oldValue){
                                    var num = parseInt(newValue);
                                    if (isNaN(num) || !num || num<1)
                                    {
                                        num = Km.Coupon.Config.PageSize;
                                        Field.setValue(num);
                                    }
                                    this.ownerCt.pageSize= num;
                                    Km.Coupon.Config.PageSize = num;
                                    this.ownerCt.ownerCt.doSelectCoupon();
                                },
                                specialKey :function(field,e){
                                    if (e.getKey() == Ext.EventObject.ENTER){
                                        var num = parseInt(field.getValue());
                                        if (isNaN(num) || !num || num<1)
                                        {
                                            num = Km.Coupon.Config.PageSize;
                                        }
                                        this.ownerCt.pageSize= num;
                                        Km.Coupon.Config.PageSize = num;
                                        this.ownerCt.ownerCt.doSelectCoupon();
                                    }
                                }
                            }
                        },
                        {xtype:'label', text: '个'}
                    ]
                })
            }, config);
            //初始化显示优惠券列表
            this.doSelectCoupon();
            Km.Coupon.View.Grid.superclass.constructor.call(this, config);
            //创建在Grid里显示的优惠券信息Tab页
            Km.Coupon.View.Running.viewTabs=new Km.Coupon.View.CouponView.Tabs();
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
          this.grid.btnPublish.setDisabled(sm.getCount() != 1);
          this.grid.btnPublishEmail.setDisabled(sm.getCount() != 1);
          this.grid.btnPublishAll.setDisabled(sm.getCount() != 1);
                    this.grid.tvpView.setDisabled(sm.getCount() != 1);
                },
                rowselect: function(sm, rowIndex, record) {
                    this.grid.updateViewCoupon();
                    if (sm.getCount() != 1){
                        this.grid.hideCoupon();
                        Km.Coupon.Config.View.IsShow=0;
                    }else{
                        if (Km.Coupon.View.IsSelectView==1){
                            Km.Coupon.View.IsSelectView=0;
                            this.grid.showCoupon();
                        }
                    }
                },
                rowdeselect: function(sm, rowIndex, record) {
                    if (sm.getCount() != 1){
                        if (Km.Coupon.Config.View.IsShow==1){
                            Km.Coupon.View.IsSelectView=1;
                        }
                        this.grid.hideCoupon();
                        Km.Coupon.Config.View.IsShow=0;
                    }
                }
            }
        }),
        /**
         * 双击选行
         */
        onRowDoubleClick:function(grid, rowIndex, e){
            if (!Km.Coupon.Config.View.IsShow){
                this.sm.selectRow(rowIndex);
                this.showCoupon();
                this.tvpView.toggle(true);
            }else{
                this.hideCoupon();
                Km.Coupon.Config.View.IsShow=0;
                this.sm.deselectRow(rowIndex);
                this.tvpView.toggle(false);
            }
        },
        /**
         * 是否绑定在本窗口上
         */
        onBindGrid:function(item, checked){
            if (checked){
               Km.Coupon.Config.View.IsFix=1;
            }else{
               Km.Coupon.Config.View.IsFix=0;
            }
            if (this.getSelectionModel().getSelected()==null){
                Km.Coupon.Config.View.IsShow=0;
                return ;
            }
            if (Km.Coupon.Config.View.IsShow==1){
               this.hideCoupon();
               Km.Coupon.Config.View.IsShow=0;
            }
            this.showCoupon();
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
         * 查询符合条件的优惠券
         */
        doSelectCoupon : function() {
            if (this.topToolbar){
        var coupon_name = this.topToolbar.coupon_name.getValue();
        var coupon_type = this.topToolbar.coupon_type.getValue();
        var begin_time  = this.topToolbar.begin_time.getValue();
        var end_time  = this.topToolbar.end_time.getValue();
        this.filter   ={'coupon_name':coupon_name,'coupon_type':coupon_type,'begin_time': begin_time,'end_time':end_time};
            }
            var condition = {'start':0,'limit':Km.Coupon.Config.PageSize};
            Ext.apply(condition,this.filter);
            ExtServiceCoupon.queryPageCoupon(condition,function(provider, response) {
                if (response.result&&response.result.data) {
                    var result       = new Array();
                    result['data']     =response.result.data;
                    result['totalCount'] =response.result.totalCount;
                      Km.Coupon.Store.couponStore.loadData(result);
                } else {
                    Km.Coupon.Store.couponStore.removeAll();
                    Ext.Msg.alert('提示', '无符合条件的优惠券！');
                }
            });
        },
        /**
         * 显示优惠券视图
         * 显示优惠券的视图相对优惠券列表Grid的位置
         * 1:上方,2:下方,0:隐藏。
         */
        onUpDown:function(viewDirection){
            Km.Coupon.Config.View.Direction=viewDirection;
            switch(viewDirection){
                case 1:
                    this.ownerCt.north.add(Km.Coupon.View.Running.viewTabs);
                    break;
                case 2:
                    this.ownerCt.south.add(Km.Coupon.View.Running.viewTabs);
                    break;
                case 3:
                    this.ownerCt.west.add(Km.Coupon.View.Running.viewTabs);
                    break;
                case 4:
                    this.ownerCt.east.add(Km.Coupon.View.Running.viewTabs);
                    break;
            }
            Km.Coupon.Cookie.set('View.Direction',Km.Coupon.Config.View.Direction);
            if (this.getSelectionModel().getSelected()!=null){
                if ((Km.Coupon.Config.View.IsFix==0)&&(Km.Coupon.Config.View.IsShow==1)){
                    this.showCoupon();
                }
                Km.Coupon.Config.View.IsFix=1;
                Km.Coupon.View.Running.couponGrid.tvpView.menu.mBind.setChecked(true,true);
                Km.Coupon.Config.View.IsShow=0;
                this.showCoupon();
            }
        },
        /**
         * 显示优惠券
         */
        showCoupon : function(){
            if (this.getSelectionModel().getSelected()==null){
                Ext.Msg.alert('提示', '请先选择优惠券！');
                Km.Coupon.Config.View.IsShow=0;
                this.tvpView.toggle(false);
                return ;
            }
            if (Km.Coupon.Config.View.IsFix==0){
                if (Km.Coupon.View.Running.view_window==null){
                    Km.Coupon.View.Running.view_window=new Km.Coupon.View.CouponView.Window();
                }
                if (Km.Coupon.View.Running.view_window.hidden){
                    Km.Coupon.View.Running.view_window.show();
                    Km.Coupon.View.Running.view_window.winTabs.hideTabStripItem(Km.Coupon.View.Running.view_window.winTabs.tabFix);
                    Km.Coupon.View.Running.couponitemsGrid.doSelectCouponitems();
                    this.updateViewCoupon();
                    this.tvpView.toggle(true);
                    Km.Coupon.Config.View.IsShow=1;
                }else{
                    this.hideCoupon();
                    Km.Coupon.Config.View.IsShow=0;
                }
                return;
            }
            switch(Km.Coupon.Config.View.Direction){
                case 1:
                    if (!this.ownerCt.north.items.contains(Km.Coupon.View.Running.viewTabs)){
                        this.ownerCt.north.add(Km.Coupon.View.Running.viewTabs);
                    }
                    break;
                case 2:
                    if (!this.ownerCt.south.items.contains(Km.Coupon.View.Running.viewTabs)){
                        this.ownerCt.south.add(Km.Coupon.View.Running.viewTabs);
                    }
                    break;
                case 3:
                    if (!this.ownerCt.west.items.contains(Km.Coupon.View.Running.viewTabs)){
                        this.ownerCt.west.add(Km.Coupon.View.Running.viewTabs);
                    }
                    break;
                case 4:
                    if (!this.ownerCt.east.items.contains(Km.Coupon.View.Running.viewTabs)){
                        this.ownerCt.east.add(Km.Coupon.View.Running.viewTabs);
                    }
                    break;
            }
            this.hideCoupon();
            if (Km.Coupon.Config.View.IsShow==0){
                Km.Coupon.View.Running.viewTabs.enableCollapse();
                switch(Km.Coupon.Config.View.Direction){
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
                Km.Coupon.View.Running.couponitemsGrid.doSelectCouponitems();
                this.updateViewCoupon();
                this.tvpView.toggle(true);
                Km.Coupon.Config.View.IsShow=1;
            }else{
                Km.Coupon.Config.View.IsShow=0;
            }
            this.ownerCt.doLayout();
        },
        /**
         * 隐藏优惠券
         */
        hideCoupon : function(){
            this.ownerCt.north.hide();
            this.ownerCt.south.hide();
            this.ownerCt.west.hide();
            this.ownerCt.east.hide();
            if (Km.Coupon.View.Running.view_window!=null){
                Km.Coupon.View.Running.view_window.hide();
            }
            this.tvpView.toggle(false);
            this.ownerCt.doLayout();
        },
        /**
         * 更新当前优惠券显示信息
         */
        updateViewCoupon : function() {
            if (Km.Coupon.View.Running.view_window!=null){
                Km.Coupon.View.Running.view_window.winTabs.tabCouponDetail.update(this.getSelectionModel().getSelected().data);
            }
            Km.Coupon.View.Running.viewTabs.tabCouponDetail.update(this.getSelectionModel().getSelected().data);
        },
        /**
         * 新建优惠券
         */
        addCoupon : function() {
            if (Km.Coupon.View.Running.edit_window==null){
                Km.Coupon.View.Running.edit_window=new Km.Coupon.View.EditWindow();
            }
      Km.Coupon.View.Running.edit_window.firstcard.sort_order.setValue("50");
      Km.Coupon.View.Running.edit_window.firstcard.coupon_id.setValue("");
      Ext.getCmp("coupon_key").setDisabled(false);
      Ext.getCmp("coupon_type").setDisabled(false);
            Km.Coupon.View.Running.edit_window.savetype=0;

            Km.Coupon.View.Running.edit_window.show();
            Km.Coupon.View.Running.edit_window.maximize();
        },
        /**
         * 编辑优惠券时先获得选中的优惠券信息
         */
        updateCoupon : function() {
            if (Km.Coupon.View.Running.edit_window==null){
                Km.Coupon.View.Running.edit_window=new Km.Coupon.View.EditWindow();
            }
            Km.Coupon.View.Running.edit_window.setTitle('修改优惠券');
      //赋值
      //firstcard
            var forms=this.getSelectionModel().getSelected().data;
      Km.Coupon.View.Running.edit_window.firstcard.coupon_id.setValue(forms.coupon_id);
      Ext.getCmp("coupon_name").setValue(forms.coupon_name);
      Ext.getCmp("coupon_key").setValue(forms.coupon_key);
      Ext.getCmp("coupon_key").setDisabled(true);
      Ext.getCmp("coupon_type").setValue(forms.coupon_type);
      Ext.getCmp("coupon_type").setDisabled(true);
      Ext.getCmp("isValid").setValue(forms.isValid);
      Ext.getCmp("sort_order").setValue(forms.sort_order);
      //secondcard
      Ext.getCmp("preferential_type").setValue(forms.preferential_type);
      //thirdcard
      if(forms.money_lower&&forms.money_upper){
        Ext.getCmp("money_lower").setValue(forms.money_lower);
        Ext.getCmp("money_upper").setValue(forms.money_upper);
      }
      Ext.getCmp("begin_time").setValue(forms.begin_time);
      Ext.getCmp("end_time").setValue(forms.end_time);
      if(forms.money_lower&&forms.money_upper){
        Ext.getCmp("money_lower").setValue(forms.money_lower);
        Ext.getCmp("money_upper").setValue(forms.money_upper);
      }
      if(forms.limit_reduce){
        Ext.getCmp("limit_reduce").setValue(forms.limit_reduce);
      }
      if(forms.discount){
        Ext.getCmp("discount").setValue(forms.discount);
      }
      if(forms.givecouponitems){
        Ext.getCmp("givecouponitems").setValue(forms.givecouponitems);
        Ext.getCmp("givebuttontext").setValue('<font color=green>(您总共选择了'+forms.givecouponitemscount+'张优惠券!)</font>');
      }
      Ext.getCmp("prefdescribe").setValue(forms.prefdescribe);
      //fouthcard
      if(forms.selproductitems){
        Ext.getCmp("selproductitems").setValue(forms.selproductitems);
        Ext.getCmp("selbuttontext").setValue('<font color=green>(您总共选择了'+forms.selproductitemscount+'件商品!)</font>');
      }

            Km.Coupon.View.Running.edit_window.savetype=1

            Km.Coupon.View.Running.edit_window.show();
            Km.Coupon.View.Running.edit_window.maximize();
        },
        /**
         * 删除优惠券
         */
        deleteCoupon : function() {
            Ext.Msg.confirm('提示', '确实要删除所选的优惠券吗?<br><font color=red>(若优惠券已发布,请谨慎操作!)</font>', this.confirmDeleteCoupon,this);
        },
        /**
         * 确认删除优惠券
         */
        confirmDeleteCoupon : function(btn) {
            if (btn == 'yes') {
                var del_coupon_ids ="";
                var selectedRows  = this.getSelectionModel().getSelections();
                for ( var flag = 0; flag < selectedRows.length; flag++) {
                    del_coupon_ids=del_coupon_ids+selectedRows[flag].data.coupon_id+",";
                }
                ExtServiceCoupon.deleteByIds(del_coupon_ids);
                this.doSelectCoupon();
                Ext.Msg.alert("提示", "删除成功！");
            }
        },
        /**
         * 导出优惠券
         */
        exportCoupon : function() {
            ExtServiceCoupon.exportCoupon(this.filter,function(provider, response) {
                if (response.result.data) {
                    window.open(response.result.data);
                }
            });
        },
        /**
         * 导入优惠券
         */
        importCoupon : function() {
            if (Km.Coupon.View.current_uploadWindow==null){
                Km.Coupon.View.current_uploadWindow=new Km.Coupon.View.UploadWindow();
            }
            Km.Coupon.View.current_uploadWindow.show();
        },

    /**
     * 导入手机号码
     */
    importPhone : function() {
      if (Km.Coupon.View.phone_uploadWindow==null){
        Km.Coupon.View.phone_uploadWindow=new Km.Coupon.View.PhoneUploadWindow();
      }
      Km.Coupon.View.phone_uploadWindow.show();
    },

    /**
     * 导入邮箱号码
     */
    importEmail : function() {
      if (Km.Coupon.View.email_uploadWindow==null){
        Km.Coupon.View.email_uploadWindow=new Km.Coupon.View.EmailUploadWindow();
      }
      Km.Coupon.View.email_uploadWindow.show();
    },
    /**
     * 显示选择优惠券
     */
    showselCoupon:function(){
      if (Km.Coupon.View.Running.selectCouponWindow==null){
        Km.Coupon.View.Running.selectCouponWindow=new Km.Coupon.View.SelectCouponView.SelectCouponWindow();
      }
      if(Km.Coupon.View.Running.edit_window.savetype!=0){
        var coupon_id=Km.Coupon.View.Running.couponGrid.getSelectionModel().getSelected().data.coupon_id;
        var preferentialrule_id=Km.Coupon.View.Running.couponGrid.getSelectionModel().getSelected().data.preferentialrule_id;
        Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.coupon_id=coupon_id;
        Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.preferentialrule_id=preferentialrule_id;
      }
      if (Km.Coupon.View.Running.selectCouponWindow.hidden){
        Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.topToolbar.selcoupon_name.setValue("");
        Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.filter={};
        Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.topToolbar.menus.all.setChecked(true);
        Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.isSelect.toggle(false);
      }
      Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.doSelectCoupon();
      Km.Coupon.View.Running.selectCouponWindow.show();
    },
    /**
     * 隐藏选择优惠券
     */
    hideselCoupon:function(){
      if (Km.Coupon.View.Running.selectCouponWindow!=null){
        Km.Coupon.View.Running.selectCouponWindow.hide();
        Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.coupon_id="";
        Km.Coupon.View.Running.selectCouponWindow.selectCouponGrid.preferentialrule_id="";
      }
    },
    /**
     * 显示选择商品
     */
    showselProduct:function(){
      if (Km.Coupon.View.Running.selectProductWindow==null){
        Km.Coupon.View.Running.selectProductWindow=new Km.Coupon.View.SelectProductView.SelectProductWindow();
      }
      if(Km.Coupon.View.Running.edit_window.savetype!=0){
        var preferentialrule_id=Km.Coupon.View.Running.couponGrid.getSelectionModel().getSelected().data.preferentialrule_id;
        Km.Coupon.View.Running.selectProductWindow.selectProductGrid.preferentialrule_id=preferentialrule_id;
      }
      if (Km.Coupon.View.Running.selectProductWindow.hidden){
        Km.Coupon.View.Running.selectProductWindow.selectProductGrid.topToolbar.product_name.setValue("");
        Km.Coupon.View.Running.selectProductWindow.selectProductGrid.filter={};
        Km.Coupon.View.Running.selectProductWindow.selectProductGrid.topToolbar.menus.all.setChecked(true);
        Km.Coupon.View.Running.selectProductWindow.selectProductGrid.isSelect.toggle(false);
      }
      Km.Coupon.View.Running.selectProductWindow.selectProductGrid.doSelectProduct();
      Km.Coupon.View.Running.selectProductWindow.show();
    },
    /**
     * 隐藏选择商品
     */
    hideselProduct:function(){
      if (Km.Coupon.View.Running.selectProductWindow!=null){
        Km.Coupon.View.Running.selectProductWindow.hide();
        Km.Coupon.View.Running.selectProductWindow.selectProductGrid.preferentialrule_id="";
      }
    },
    /**
     * 优惠券发布（短信）
     */
    publishCoupon:function(){
      var selectCoupon=this.getSelectionModel().getSelected().data;
      if (Km.Coupon.View.Running.edit_window_publish==null){
        Km.Coupon.View.Running.edit_window_publish=new Km.Coupon.View.PublishView.EditWindow();
      }
      var openwindow=Km.Coupon.View.Running.edit_window_publish;
      openwindow.showcoupon_id.setValue(selectCoupon.coupon_id);
      openwindow.showcoupon_name.setValue(selectCoupon.coupon_name);
      openwindow.showcoupon_key.setValue(selectCoupon.coupon_key);
      switch(selectCoupon.preferential_type){
        case '1':
          openwindow.showcoupon_type.setValue("对某些商品打折");
        break;
        case '2':
          openwindow.showcoupon_type.setValue("购物满一定金额送优惠券");
        break;
        case '3':
          openwindow.showcoupon_type.setValue("购物满一定金额打折");
        break;
        case '4':
          openwindow.showcoupon_type.setValue("购物满一定金额立减金额");
        break;
        case '5':
          openwindow.showcoupon_type.setValue("现金抵扣券");
        break;
        default:
        break;
      }
      openwindow.show();
    },
    /**
     * 优惠券发布（邮件）
     */
    publishemailCoupon:function(){
      var selectCoupon=this.getSelectionModel().getSelected().data;
      if (Km.Coupon.View.Running.edit_window_publishemail==null){
        Km.Coupon.View.Running.edit_window_publishemail=new Km.Coupon.View.PublishEmailView.EditWindow();
      }
      var openwindow=Km.Coupon.View.Running.edit_window_publishemail;
      openwindow.eshowcoupon_id.setValue(selectCoupon.coupon_id);
      openwindow.eshowcoupon_name.setValue(selectCoupon.coupon_name);
      openwindow.eshowcoupon_key.setValue(selectCoupon.coupon_key);
      switch(selectCoupon.preferential_type){
        case '1':
          openwindow.eshowcoupon_type.setValue("对某些商品打折");
        break;
        case '2':
          openwindow.eshowcoupon_type.setValue("购物满一定金额送优惠券");
        break;
        case '3':
          openwindow.eshowcoupon_type.setValue("购物满一定金额打折");
        break;
        case '4':
          openwindow.eshowcoupon_type.setValue("购物满一定金额立减金额");
        break;
        case '5':
          openwindow.eshowcoupon_type.setValue("现金抵扣券");
        break;
        default:
        break;
      }
      switch (Km.Coupon.Config.OnlineEditor)
      {
        case 2:
          if (Km.Coupon.View.PublishEmailView.EditWindow.KindEditor_emailcontent) Km.Coupon.View.PublishEmailView.EditWindow.KindEditor_emailcontent.html("");
          break;
        case 3:
          break;
        default:
          if (CKEDITOR.instances.emailcontent) CKEDITOR.instances.emailcontent.setData("");
      }
      openwindow.show();
    },
    /**
     * 优惠券批量发布
     */
    publishallCoupon:function(){
      var selectCoupon=this.getSelectionModel().getSelected().data;
      if (Km.Coupon.View.Running.edit_window_publishall==null){
        Km.Coupon.View.Running.edit_window_publishall=new Km.Coupon.View.PublishAllView.EditWindow();
      }
      var openwindow=Km.Coupon.View.Running.edit_window_publishall;
      openwindow.eshowcoupon_id.setValue(selectCoupon.coupon_id);
      openwindow.eshowcoupon_name.setValue(selectCoupon.coupon_name);
      openwindow.eshowcoupon_key.setValue(selectCoupon.coupon_key);
      switch(selectCoupon.preferential_type){
        case '1':
          openwindow.eshowcoupon_type.setValue("对某些商品打折");
        break;
        case '2':
          openwindow.eshowcoupon_type.setValue("购物满一定金额送优惠券");
        break;
        case '3':
          openwindow.eshowcoupon_type.setValue("购物满一定金额打折");
        break;
        case '4':
          openwindow.eshowcoupon_type.setValue("购物满一定金额立减金额");
        break;
        case '5':
          openwindow.eshowcoupon_type.setValue("现金抵扣券");
        break;
        default:
        break;
      }

      openwindow.show();
    }
    }),
    /**
     * 核心内容区
     */
    Panel:Ext.extend(Ext.form.FormPanel,{
        constructor : function(config) {
            Km.Coupon.View.Running.couponGrid=new Km.Coupon.View.Grid();
            if (Km.Coupon.Config.View.IsFix==0){
                Km.Coupon.View.Running.couponGrid.tvpView.menu.mBind.setChecked(false,true);
            }
            config = Ext.apply({
                region : 'center',layout : 'fit', frame:true,
                items: {
                    layout:'border',
                    items:[
                        Km.Coupon.View.Running.couponGrid,
                        {region:'north',ref:'north',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'south',ref:'south',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true,items:[Km.Coupon.View.Running.viewTabs]},
                        {region:'west',ref:'west',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true},
                        {region:'east',ref:'east',layout:'fit',collapseMode : 'mini',border:false,split: true,hidden:true}
                    ]
                }
            }, config);
            Km.Coupon.View.Panel.superclass.constructor.call(this, config);
        }
    }),
    /**
     * 当前运行的可视化对象
     */
    Running:{
        /**
         * 当前优惠券Grid对象
         */
        couponGrid:null,

        /**
         * 显示优惠券信息及关联信息列表的Tab页
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
    Ext.state.Manager.setProvider(Km.Coupon.Cookie);
    Ext.Direct.addProvider(Ext.app.REMOTING_API);
    Km.Coupon.Init();
    /**
     * 优惠券数据模型获取数据Direct调用
     */
    Km.Coupon.Store.couponStore.proxy=new Ext.data.DirectProxy({
        api: {read:ExtServiceCoupon.queryPageCoupon}
    });
    /**
     * 优惠券页面布局
     */
    Km.Coupon.Viewport = new Ext.Viewport({
        layout : 'border',
        items : [new Km.Coupon.View.Panel()]
    });
    Km.Coupon.Viewport.doLayout();
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({
            remove:true
        });
    }, 250);
});