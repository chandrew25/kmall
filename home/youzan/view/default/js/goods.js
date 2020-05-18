$(document).ready(function(){
    $("#maximg").bind("click",function(){
        $("#maxImages").css("display","block");
        $("#maxImages_bj").css("display","block");
    });
    $("#maxImages").bind("click",function(){
        $(this).css("display","none");
        $("#maxImages_bj").css("display","none");
    });
    $("#maxImages_bj").bind("click",function(){
        $("#maxImages").css("display","none");
        $(this).css("display","none");
    });
    $("#num").bind('input propertychange',function(){
        var num = $(this).val();
        var sales_price = $("#sales_price").val();
        var price = (Number(sales_price*num)).toFixed(2);
        $("#price").html("￥"+price);
    });
    $(".mp_btn").bind("click",function(){
        var str = $(this).attr("str");
        var num = $("#num").val();
        if (str=="-") {
            if(num<=1){
                return false;
            }
            var Num = num-1;
            $("#num").val(Num);
        }else if(str=="+"){
            var Num = Number(num)+1;
            $("#num").val(Num);
        }
        var sales_price = $("#sales_price").val();
        var price = (Number(sales_price*Num)).toFixed(2);
        $("#price").html("￥"+price);
    });
    $(".addcart").bind("click",function(){
        var num = $("#num").val();
        var goods_id = $("#goods_id").val();
        if(goods_id==""){
            jAlert("请选择购买的商品","温馨提示");
            return false;
        }
        if(num<1){
            jAlert("购买商品的数量最少一个","温馨提示");
            return false;
        }
        var data = {
            goods_id:goods_id,
            num:num
        }
        $.ajax({
            url: "index.php?go=mobile.cart.addCart",
            type: 'post',
            dataType: 'json',
            data:data,
            success: function(response) {
                if (response.success=="success") {
                    if (response.cartnum==1) {
                        var _cartnum = $("#cartnum").text();
                        _cartnum = parseInt(_cartnum)+1;
                        $("#cartnum").html(_cartnum);
                    };
                    jAlert(response.data,response.title);
                    return false;
                }else{
                    jAlert(response.data,response.title);
                    return false;
                }
            }
        });
    });
    $(".shopping").bind("click",function(){
        var num = $("#num").val();
        var goods_id = $("#goods_id").val();
        if(goods_id==""){
            jAlert("请选择购买的商品","温馨提示");
            return false;
        }
        if(num<1){
            jAlert("购买商品的数量最少一个","温馨提示");
            return false;
        }
        var data = {
            goods_id:goods_id,
            num:num
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

