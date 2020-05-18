$(function(){
	/******************获取登录信息******************/
	var url_base=$("#url_base").val();
    //订单详情页面
    if(!url_base){
        url_base=$("#order_detail_url").val();
    }
	var url=url_base+"index.php?go=kmall.ajax.getLogininfo";
	$.post(url,null,function(result){
		var member=result.member;
		var cart=result.cart;
		var carttotal=result.carttotal;
		if(member){//会员信息
			var html=[
				"<span style='color:white'>"+member.member_name+"&nbsp;!&nbsp;欢迎来到菲彼生活官方商城&nbsp;!&nbsp;</span>",
				"<a href='"+url_base+"index.php?go=kmall.member.view'>个人中心|</a>",
				"<a href='"+url_base+"index.php?go=kmall.auth.logout'>退出</a>"
			];
			$("#headerlogin").html(html.join(""));
            //标记已登录
            $("#headerlogin").attr("value","logined");
		}
		if(cart){//购物车
			var ps=[];

			for(var i in cart){
				var goods=cart[i];
                var gift_show="";
                var gift_arr=goods.gift_arr;
                if(gift_arr){
                    var gs=[];
                    for(var j in gift_arr){
                        gift=gift_arr[j];
                        gift_show=gift_show+"<div class='cds_gift' title='"+gift.gift_name+"'><a href='"+url_base+"index.php?go=kmall.product.view&goods_id="+gift.gift_id+"' target='_blank'>[赠品]"+gift.gift_name+"×"+gift.gift_num+"</a></div>";
                    }
                }
				var p=[
					"<div class='cds_detail'>",
						"<div class='cds_img'>",
							"<a href='html/product/product_"+goods.product_id+".html' title='"+goods.goods_name+"' target='_blank'>",
								"<img src='"+url_base+"upload/images/"+goods.ico+"' alt='"+goods.goods_name+"' width='60' height='60'/>",
							"</a>",
						"</div>",
						"<div class='cds_con'>",
							"<div class='cdsc_name'>",
								"<a href='"+url_base+"html/product/product_"+goods.product_id+".html' title='"+goods.goods_name+"' target='_blank'>"+goods.goods_name+"</a>",
							"</div>",
							"<div class='cdsc_price'>",
								"<span>",
									"<span class='color_red'>￥"+goods.sales_price+"</span>&nbsp;×&nbsp;<span class='color_red'>"+goods.num+"</span>",
								"</span>",
							"</div>",
						"</div>",
						"<div class='cart_delete color_red' item='"+goods.goods_id+"'>删除</div>",
                        gift_show,
					"</div>",
                    "<div class='cds_line'></div>"
				];
				ps[i]=p.join("");
			}
			$("#cartpsshow").html(ps.join(""));
			//购物车统计
			$("#cartpicshow").html("<a href='"+url_base+"index.php?go=kmall.cart.lists'>"+$("#cartpicshow").html()+"</a>");
			$("#cartpcount").html(carttotal.totalcount);
			$("#cartpsshowcount").html(carttotal.totalcount);
			$("#cartpsshowprice").html(carttotal.totalprice);
		}
	},"json");
});
