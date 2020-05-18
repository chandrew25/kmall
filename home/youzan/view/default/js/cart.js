function cartNum(cartId,num){
    var data = {cartId:cartId,num:num}
    $.ajax({
        url: "index.php?go=mobile.cart.setNum",
        type: 'post',
        dataType: 'json',
        data:data,
        success: function(response) {
            if (response.success=="success") {
                var _html = "<span>￥</span>"+response.data;
                $("#cartprice_price").html(_html);
            }else{
                jAlert(response.data,response.title);
                return false;
            }
        }
    });
}
$(document).ready(function(){
    $(".cart_del").bind("click",function(){
        var cartId = $(this).attr("cartId");
        var _obj = $("#num"+cartId);
        var num = _obj.val();
        if(num<=1){
            return false;
        }
        var Num = Number(num)-1;
        cartNum(cartId,Num);
        _obj.val(Num);
        
        
    });
    $(".cart_add").bind("click",function(){
        var cartId = $(this).attr("cartId");
        var _obj = $("#num"+cartId);
        var num = _obj.val();
        var Num = Number(num)+1;
        cartNum(cartId,Num);
        _obj.val(Num);
        
    });
    $(".del_goods").bind("click",function(){
        var cartId = $(this).attr("cartId");
        var data = {
            cartId:cartId
        }
        var _obj = $("#"+cartId);
        jConfirm("您确定要删除购物车中的改商品？","温馨提示",function(e){
            if (e) {
                $.ajax({
                    url: "index.php?go=mobile.cart.delCart",
                    type: 'post',
                    dataType: 'json',
                    data:data,
                    success: function(response) {
                        if (response.success=="success") {
                            var _html = "<span>￥</span>"+response.data;
                            $("#cartprice_price").html(_html);
                            _obj.remove();
                            var price = Number(response.data);
                            if (price ==0) {
                                location.href = "index.php?go=mobile.cart.cartno";
                            };
                        }else{
                            jAlert(response.data,response.title);
                            return false;
                        }
                    }
                });
            };
        });
    }); 
    $(".checkout").bind("click",function(){
        var data = {
            cart:1
        }
        $.ajax({
            url: "index.php?go=mobile.member.checkOrder",
            type: 'post',
            dataType: 'json',
            data:data,
            success: function(response) {
                if (response.success=="success") {
                    $("#orderFrm").submit();
                }else{
                    jAlert(response.data,response.title,function(e){
                        if (true) {
                            if (response.url) {
                                location.href = response.url;
                            }else{
                                return false;
                            }
                        }
                    });
                }
            }
        });
    });
})
