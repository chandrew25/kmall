$(document).ready(function(){
    //选择支付方式
    $(".choice_paytype").click(function(){
        if($(this).val()=="bank"){
            $("#online_payment_handler").slideDown(300);
        }else{
            $("#online_payment_handler").slideUp(300);
            $("#ness_pay_code").val("");//清除支付银行或平台信息
            $(".platform_radio").removeAttr("checked");//清除支付平台选中
            $(".bank_radio").removeAttr("checked");//清除支付银行选中
            $("#pi_set_paytype").hide();//隐藏支付图标
            $(".paylist").hide();//隐藏银行选择
        }
    })

    //选择银行 by img
    $(".bank_img").click(function(){
        var radio = $(this).parent().prev().children();
        radio.attr("checked",'checked');
        $("#pi_set_paytype").attr("flag",radio.val()).attr("src",$(this).attr("src")).show();
        $(".platform_radio").removeAttr("checked");
    })

    //选择银行 by radio
    $(".bank_radio").click(function(){
        var img = $(this).parent().next().children();
        $("#pi_set_paytype").attr("flag",$(this).val()).attr("src",img.attr("src")).show();
        $(".platform_radio").removeAttr("checked");
    })

    //选择支付平台 by img
    $(".platform_img").click(function(){
        var index=$(this).attr("index");
        $(".paylist").hide().eq(index).show();
        var radio = $(this).parent().prev().children();
        radio.attr("checked",'checked');
        $("#pi_set_paytype").attr("flag",radio.val()).attr("src",$(this).attr("src")).show();
        $(".bank_radio").removeAttr("checked");
    })

    //选择支付平台 by radio
    $(".platform_radio").click(function(){
        var index=$(this).attr("index");
        $(".paylist").hide().eq(index).show();
        var img = $(this).parent().next().children();
        $("#pi_set_paytype").attr("flag",$(this).val()).attr("src",img.attr("src")).show();
        $(".bank_radio").removeAttr("checked");
    });

    //确认支付方式
    $("#pay_confirm_handler").click(function(){
        var bankcode = $('input:radio[name="bankcode"]').is(":checked");
        var platform = $('input:radio[name="platform"]').is(":checked");
        if(bankcode^platform){
            $("#ness_pay_code").val($("#pi_set_paytype").attr("flag"));
            $("#online_payment_handler").slideUp(300);
        }else{
            alert("请先选中支付银行或者支付平台！")
        }
    });

    $(".choice_paytype").trigger("click");
    $(".platform_radio").trigger("click");
    $(".platform_img").trigger("click");

    //提交订单
    var isubmit=false;//订单提交中标识
    $("#order_submit").click(function(){
        if(isubmit){
            return false;//防止重复提交
        }
        if (member_jifen-totalJifen<=0){
            alert('券余额: '+member_jifen+',本次使用: '+totalJifen+';券不足，无法兑换!');
            return false;
        }
        var ok=true;
        //检查收货信息
        if(!$("#ness_address").val()){
            alert('请填写收货相关信息!');
            $("html,body").animate({scrollTop:$("#checkview_consignee").offset().top},1000);
            return false;
        }
        //检查是否选择支付平台
        if(!checkbank()){
            alert('请先选择网上支付的支付平台或支付银行!');
            $("html,body").animate({scrollTop:$("#checkview_choice_paytype").offset().top},1000);
            return false;
        }
        if(ok){
            isubmit=true;
            $("#checkoverForm").submit();
        }
    });

    //屏蔽购物车hover事件
    $(".cart").unbind("hover");

});

//网上支付判断
function checkbank(){
    if($('input:radio[name="paymenttype"]:checked').val() =="bank"){
        if($("#ness_pay_code").val()){
            return true;
        }
        return false;
    }
    return true;
}
