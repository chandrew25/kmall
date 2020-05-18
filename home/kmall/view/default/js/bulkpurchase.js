$(document).ready(function(){
    //成功提交提示框
    if($(".success").attr("item")==1){
        alert("提交大宗订单成功,请等候审核！");
    }else if($(".success").attr("item")==2){
        alert("提交大宗订单失败！！！请重新提交或与本网站工作人员联系！");
    }

    //关闭弹出框
    $(".bwt_close,.dis_bg").click(function(){
        $(".dis_bg").hide();
        $(".bulk_win").hide();
    });
    //弹出框
    $(".bulk_purchase").click(function(){
       $(".dis_bg").show();
       $(".bulk_win").show();
       $img = $(this).children().attr("alt");
       if($img){
           $(".bwc_title").html($img);
           $(".product_id_i").val($(this).children().attr("item"));
       }else{
           $(".bwc_title").html($(this).attr("title"));
           $(".product_id_i").val($(this).attr("item"));
       }
    });

    //弹出框提交
    $(".bwcd_button").click(function(){
        var is_email=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        var isMobile=/^1[3|5|8][0-9]\d{8}$/;
        var isPhone=/^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/;
        if(!$(".bq_name_sub").val()){
            alert("请填写您的姓名！");
            $(".bq_name_sub").focus();
            return false;
        }
        if(!isMobile.test($(".bq_tel_sub").val()) && !isPhone.test($(".bq_tel_sub").val())){
            alert("请正确填写您的电话或手机号码！");
            $(".bq_tel_sub").focus();
            return false;
        }
        if(!$(".bq_com_name_sub").val()){
            alert("请填写您的公司名称！");
            $(".bq_com_name_sub").focus();
            return false;
        }
        if(!$(".bq_addr_sub").val()){
            alert("请填写您公司的详细地址！");
            $(".bq_addr_sub").focus();
            return false;
        }
        if(!$(".le_message").val()){
            alert("请详细填写您的需求！");
            $(".le_message").focus();
            return false;
        }
        if(!is_email.test($(".bq_email_sub").val())){
            alert("请填写有效的邮箱地址！");
            $(".bq_email_sub").focus();
            return false;
        }
        checkCode();
        if(code_right){
            alert("验证码有误,请重新输入!");
            $("#validate").focus();
        }else{
            $("#bulk_submit").submit();
        }
    });

    //验证码
    $("#validate").blur(function(){
        checkCode();
    });

    /*背景切换*/
    $("#main .content .pros .box .items li").hover(
    function(){
        $(this).css("background","#E1E1E1")
    },
    function(){
        $(this).css("background","none")
    });

});

$.ajaxSetup({
    async : false
});
code_right =true;
/*检查验证码*/
function checkCode(){
    var data="verify="+$("#validate").val();
    $.post(getPHP("register.php"),data,function(result){
        if(result){
            $(".message_re").css("color","green");
            $(".message_re").html("* 正确");
            code_right=false;
        }else{
            $(".message_re").html("-验证码有误!-");
            $(".message_re").css("color","red");
            code_right=true;
            changeCode();
        }
    });
}

/*获取php url*/
function getPHP(file){
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    var root= window.location.protocol + '\/\/' + window.location.host + '/'+ webName + '/';
    return root+"home/kmall/src/httpdata/"+file;
}
