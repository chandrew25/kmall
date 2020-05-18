$(document).ready(function(){
    //input 状态设置
    $("#rp_old_pwd").attr("item",0);
    $("#new_pwd").attr("item",0);
    $("#confirm_pwd").attr("item",0);
    
    $("#rp_old_pwd").blur(
        function(){
            var txt="<font color='red'>请输入您的密码</font>";
            var info="";
            var value=$.trim($(this).val());
            if(value){
                $(this).attr("item",1);
            }else{
                info=txt;
                $(this).attr("item",0);
            }
            $("#pwd_tip").html(info);
        }
    );

    //确认密码输入合法
    $("#new_pwd").blur(
        function(){
            var txt1="<font color='red'>密码不能为空且只能为英文、数字、下划线组成的6-18个字符</font>";
            var txt2="<font color='green'>密码可用</font>";
            var info="";
            var iflegal=checkpwd($(this).val())
            if(iflegal){
                info=txt2;
                $(this).attr("item",1);
            }else{
                info=txt1;
                $(this).attr("item",0);                
            }
            $("#new_pwd_tip").html(info);
        }
    )
    
    //确认密码保持一致
    $("#confirm_pwd").blur(
        function(){
            var cod2=$("#new_pwd").attr("item");
            if(cod2=="1"){
                var txt1="<font color='red'>两次输入不一致</font>";
                var txt2="<font color='green'>输入正确</font>";
                var newpwd=$("#new_pwd").val();
                var confirm=$(this).val();
                if(newpwd==confirm){
                    info=txt2;
                    $(this).attr("item",1);
                }else{
                    info=txt1;
                    $(this).attr("item",0);
                }
                $("#confirm_tip").html(info);
            }else{
                return;    
            }
        }
    )
    
    //提交修改密码
    $("#rp_submit").click(
        function(){
            var ifcan=cansubmit();
            if(ifcan){
                $("#re_form").submit();   
            }else{
                return;
            }
        }
    )
})

//判断密码合法性
function checkpwd(pwd){
    //6-18位 只由数字,字母和字符串组成
    var reg=/^[a-zA-Z0-9_-]{6,18}$/;
    if(!pwd||!reg.test(pwd)){   
        return false;
    }else{   
        return true;
    }
}

//判断是否可以提交
function cansubmit(){
    var cod1=$("#rp_old_pwd").attr("item");
    var cod2=$("#new_pwd").attr("item");
    var cod3=$("#confirm_pwd").attr("item");
    var info="<font color='red'>请先输入</font>";
    var judge=true;
    if(cod1!="1"){
        judge=false;
        $("#pwd_tip").html(info);
        return;
    }
    if(cod2!="1"){
        judge=false;
        $("#new_pwd_tip").html(info);
        return;
    }
    if(cod3!="1"){
        judge=false;
        $("#confirm_tip").html(info);
        return;
    }
    return judge;
}