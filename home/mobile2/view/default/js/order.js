$(document).ready(function(){    
    $(".zf_btn").bind("click",function(){
        var status = $(this).attr("status");
        if (status=="2") {
            return false;
        }
        var goods_id = $("#goods_id").val();
        var order_no = $("#order_no").val();
        var passwd = $("#passwd").val();
        var num = $("#num").val();
        var ship_name = $("#ship_name").val();
        var ship_mobile = $("#ship_mobile").val();
        var ship_addr = $("#ship_addr").val();
        // if(goods_id==""){
        //     jAlert("请选择购买的商品","温馨提示");
        //     return false;
        // }
        // if(num<1){
        //     jAlert("购买商品的数量最少一个","温馨提示");
        //     return false;
        // }
        if(order_no==""){
            jAlert("订单号不能为空","温馨提示");
            return false;
        }
        if(ship_name==""){
            jAlert("请填写收货人","温馨提示");
            return false;
        }
        if(ship_mobile==""){
            jAlert("请填写联系人电话","温馨提示");
            return false;
        }
        if(ship_addr==""){
            jAlert("请填写收货地址","温馨提示");
            return false;
        }
        if(passwd==""){
            jAlert("请填写卡支付密码","温馨提示");
            return false;
        }
        $(this).attr("status","2");
        $(this).css("background-color","#ccc");
        var _obj = $(this);
        $.ajax({
            url: "index.php?go=mobile2.order.checkOrder",
            type: 'post',
            dataType: 'json',
            data:$("#addFrm").serialize(),
            success: function(response) {
                if (response.success=="success") {
                    jAlert(response.data,response.title,function(r){
                        if (true) {
                            location.href = "index.php?go=mobile2.order.lists"
                        };
                    });
                }else{
                    jAlert(response.data,response.title);
                    _obj.attr("status","1");
                    _obj.css("background-color","#ff8f0f");
                    return false;
                }
            }
        });
    });
    
})

