function cartNum(cartId,num,t){
    var data = {goods_id:cartId,num:num,t:t}
    $.ajax({
        url: "index.php?go=mobile.cart.addCart",
        type: 'post',
        dataType: 'json',
        data:data,
        success: function(response) {
            if (response.success=="success") {
                window.location.href="index.php?go=mobile.cart.lists";
            }else{
                alert(response.data);
                return false;
            }
        }
    });
}
$(document).ready(function(){
    $(".cart_del").bind("click",function(){
        var cartId = $(this).attr("goods_id");
        var num = $(this).next().val();
        if(num<=1){
            return false;
        }
        cartNum(cartId,1,1);
    });
    $(".cart_add").bind("click",function(){
        var cartId = $(this).attr("goods_id");
        cartNum(cartId,1,0);

    });
    $("#addcart").bind("click",function(){
        var cartId = $(this).attr("goods_id");
        var Num = 1;
        cartNum(cartId,Num,0);
    });
    $(".del_goods").bind("click",function(){
        var cartId = $(this).attr("goods_id");
        var data = {
            goods_id:cartId
        }
        var _obj = $("#"+cartId);
        var isConfim = confirm("您确定要删除购物车中的该商品?");
        if (isConfim) {
            $.ajax({
                url: "index.php?go=mobile.cart.delCart",
                type: 'post',
                dataType: 'json',
                data:data,
                success: function(response) {
                    if (response.success=="success") {
                        location.href = "index.php?go=mobile.cart.lists";
                    }else{
                        alert(response.data,response.title);
                        return false;
                    }
                }
            });
        }
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
