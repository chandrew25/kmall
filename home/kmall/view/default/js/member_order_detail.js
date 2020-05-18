$(document).ready(function(){
    var username = $("#voucher_username").val();
    var isnew = request("isnew");
    if(isnew){
        alert("您的用户名为:"+username+",登录密码为123456,请通过'个人中心'内的'修改密码'功能设置您的个人密码!"); 
    }
});