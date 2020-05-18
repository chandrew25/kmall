$(function(){
    //点击提交
    $(".submit_btn").click(function(){
        var flag = true;
        $(".inputField").each(function(i,e){
            var evalue = $.trim(e.value);
            if(evalue==""||!AntiSqlValid(e)){
                flag = false;
                e.focus();
                return false;
            }
        })
        if(!flag){
            alert('请输入礼券号码以及对应正确的礼券密码!');
            return false;
        }
        $("#voucherForm").submit();
    });
    //点击重置
    $(".reset_btn").click(function(){
        $(".inputField").val("");
    });
    
    var flag = request("flag");
    switch(flag){
        case 1:
            alert("非法操作,请通过正常途径提领商品!");
            break;
        case 2:
            alert("对不起,您输入的卡券号码无效!");
            break;
        case 3:
            alert("对不起,您输入的卡券号码未到开始时间，尚未生效!");
            break;
        case 4:
            alert("对不起,您输入的卡号或密码错误!");
            break;
        case 5:
            alert("对不起,卡支付失败!");
            break;
        case 6:
            alert("对不起,您输入的卡券号码未到开始时间，尚未生效!");
            break;
        default:
            return;
    }
})