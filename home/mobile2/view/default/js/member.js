$(document).ready(function(){  
    $(".commerce_commit_btn").bind("click",function(){
        var cardno = $("#cardno").val();
        var mobile = $("#mobile").val();
        if (cardno=="") {
            jAlert("请填写卡号","温馨提示");
            return false;
        };
        if (mobile=="") {
            jAlert("手机号码不能为空","温馨提示");
            return false;
        };
        $.ajax({
            url: "index.php?go=mobile2.member.addAjax",
            type: 'post',
            dataType: 'json',
            data:$("#memberFrm").serialize(),
            success: function(response) {
                if (response.success=="success") {
                    jAlert(response.data,response.title,function(r) {
                        if (r==true) {
                           location.href = response.url;
                        }
                    });
                }else{
                    jAlert(response.data,"温馨提示");
                    return false;
                }
            }
        });

    });
    $(".gender").bind("click",function(){
        var gender = $("#gender").val();
        var _gender = $(this).attr("gender");
        if (gender == _gender) {
            return false;
        }else{
            $(".ok").addClass("on");
            $(".ok").removeClass("ok");
            $(this).removeClass("on");
            $(this).addClass("ok");
            $("#gender").val(_gender);
        }
    });
})

