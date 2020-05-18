$(document).ready(function(){


	//总计金额变化 商品总金额变化
	var retotal=function() {
		$('#formCart').attr('action',"index.php?go=kmall.cart.refresh");
		$('#formCart').submit();
	}

 	//直接输入数量 回车
 	$(".nums input").keypress(function(e) {
	 	if (e.which == 13){
	 		var num=parseInt($(this).val());
	 		if(isNaN(num)||num<1 ||$(this).val().length!=num.toString().length){
	 			$(this).select();
	 			showTishi("请输入大于0的整数",e);
	 			return false;
	 		}
	 		var isLimited = $(this).attr("isLimited");
			var goods_id = $(this).attr("goods_id");
	 		if (isLimited>0) {
				var url="index.php?go=kmall.cart.isLimited";
				var comdata="product_id="+goods_id+"&isLimited="+isLimited+"&num="+num;
				$.post(url,comdata,function(result){
					if(result.code==1){
	 					retotal();
				  	}else{
				  		alert(result.msg);
				  		return false;
				  	}
				},"json");
			}else{
	 			retotal();
			}
	 }

 })


	//数量加减按钮
	$(".nums div").click(function(){

		//数量变化
		var input=$(this).siblings('input');
		var num=parseInt(input.val());
		var isLimited = input.attr("isLimited");
		var goods_id = input.attr("goods_id");
		if($(this).hasClass('minus')){
			num-=1;
		}else  if($(this).hasClass('plus')){
			num+=1;
		}
		num=(num<=0) ? 1 : num;
		if (isLimited>0) {
			var url="index.php?go=kmall.cart.isLimited";
			var comdata="product_id="+goods_id+"&isLimited="+isLimited+"&num="+num;
			$.post(url,comdata,function(result){
				if(result.code==1){
			  		input.val(num);
 					retotal();
			  	}else{
			  		alert(result.msg);
			  		return false;
			  	}
			},"json");
		}else{
			input.val(num);
 			retotal();
		}
	});

	//选择全部
	$('#selall').click(function(){
		$(".sel").attr('checked',!$(".sel").attr('checked'));
		setTotal();
	});
	$('.sel').click(function(){
		setTotal();
	});
	$('#isbmit').click(function(){
		$('#formCart').attr('action',"index.php?go=kmall.checkout.view&location=cart");
		$('#formCart').submit();
	});

	//删除选中的
	$("#delsel").click(function(){
		var ids=new Array();
		$('#cartlists').find('.sel').each(function(){
			 if ($(this).attr('checked')) {
			 	var name=$(this).parents('tr').find('.nums input').attr('name');
			 	ids.push(name.substr(8));
			 };
		});
		if(ids.length>0){
			$('#formCart').attr('action',"index.php?go=kmall.cart.delSelProducts");
			$('#formCart').submit();
		}else{
			alert('请选择一个商品');
		}

	})

	//*某科学的分割线*/


    /*calcPrice();
    var checkcoupon=$("#checkcoupon").val();
    if(checkcoupon){
        calcoupon(checkcoupon);
    }*/
	/**********点击增加，减少按钮*********/
	$(".addnum").click(function(e){
		var input=$(this).prev("input");
		var num=parseInt(input.val());
		input.val(num+1);
		calcPrice();
        if($(".success_img").css("display")=="block"){
            var coupontext=$(".couponkey").text();
            if(coupontext){
                calcoupon(coupontext);
            }
        }
        showTishi("请点击更新购物车按钮",e);
	});
	$(".cutnum").click(function(e){
		var input=$(this).next("input");
		var num=parseInt(input.val());
		if(num<=1)num=2;
		input.val(num-1);
		calcPrice();
        if($(".success_img").css("display")=="block"){
            var coupontext=$(".couponkey").text();
            if(coupontext){
                calcoupon(coupontext);
            }
        }
        showTishi("请点击更新购物车按钮",e);
	});
	/************修改购买数量************/
	var tishi_tmr;//提示框计时器
	var tishi_time=3000;//提示框停留的时间
	var tishi_fade=300;//显示，消失时间
	var opacity=0.8;//提示框的透明度
	$(document.body).append("<div id='tishi'><p id='tishi_up'></p><p id='tishi_down'>关闭</p></div>");
	$("#tishi").click(function(){
		$(this).fadeOut(tishi_fade);
	});
	/*按键松开时检查数字的合法性*/
	/*$("input[name^=buy_num]").keyup(function(e){
		var num=parseInt($(this).val());
		if(isNaN(num)||num<1){
			$(this).select();
			showTishi("请输入大于0的整数",e);
		}else{
			$(this).val(num);
			showTishi("请点击更新购物车按钮",e);
		}
	}).blur(function(e){//失去焦点时如果不是数字，则默认为1
		var num=parseInt($(this).val());
		if(isNaN(num)||num<1){
			$(this).val(1);
		}
	});*/
	/*优惠券*/
	$(".submitcoupon").click(function(){
       var coupontext=$("#inputcoupon").val();
       calcoupon(coupontext);
	})
    $(".canelcoupon2,.canelcoupon1").click(function(){
        var data="canle=1";
        $(".coupon_name,.usecouponstatus,.couponprice,.success_img").hide();
        $(".pleasecoupon,.usecouponform").show()
        $.post(getPHP("coupon.php"),data,function(result){
        },"json");
        calcPrice();
    })
	/*显示提示框*/
	function showTishi(txt,e){
		$("#tishi_up").text(txt);
		$("#tishi").css("left",$(e.target).offset().left+$(e.target).width()/2-$("#tishi").width()/2);
		$("#tishi").css("top",$(e.target).offset().top-$("#tishi").height()-10);
		clearTimeout(tishi_tmr);
		$("#tishi").show().animate({opacity:opacity},0,function(){
			tishi_tmr=setTimeout(function(){
				$("#tishi").fadeOut(tishi_fade);
			},tishi_time);
		});
	}
});
/*更改购物车购买数量，参数product_id,count
function changeCount(product_id,product_count){
    var products = eval("("+$.cookie("kmall_cart")+")");
	for(var p in products){
		if(product_id==p){
			products[p].num=product_count;
			break;
		}
	};
    var jsonobj=$.toJSON(products);
	$.cookie("kmall_cart",jsonobj,{expires:30,path:"/"});
}*/
function setTotal(){
	var prices_all = 0;
	var jifen_all = 0;
	var isSbmit = true;
	$(".sel").each(function(){
	    if ($(this).attr("checked")) {
	    	var price = $(this).parents("tr").find(".prices").html();
	    	var jifen = $(this).parents("tr").find(".jifen").html();
	    	prices_all +=parseFloat(price);
	    	jifen_all +=parseInt(jifen);
	    	isSbmit = false;
	    }
	});
	$("#prices_all").html(prices_all);
	var total_all = prices_all+" + "+jifen_all+"积分";
	$("#total_all").html(total_all);
	if (isSbmit) {
		$("#isbmit").hide();
	}else{
		$("#isbmit").show();
	}
}
function convertString(s){
	var str="";
	var reg=/[\u4e00-\u9fa5]/;
	for(var i=0;i<s.length;i++){
		if(reg.test(s.charAt(i))){
			str+="\\u"+Number(s.charCodeAt(i)).toString(16);
		}else if(s.charAt(i)=='\/'){
			str+="\\/";
		}else{
			str+=s.charAt(i);
		}
	}
	return str;
}
function formatJSON(o){
	var arr=[];
	var fmt=function(s){
		if(typeof s=='object'&&s!=null)
			return formatJSON(s);
		return /^string$/.test(typeof s)?"\""+convertString(s)+"\"":s;
	};
	for(var i in o)
		arr.push("\""+i+"\":"+fmt(o[i]));
	return '{'+arr.join(',')+'}';
}
function getCookie(name){
	var cookies=document.cookie.split(";");
	for(var i=0;i<cookies.length;i++){
		var cookie=unescape(cookies[i]);
		var reg=new RegExp("^\\s*"+name+"\\s*$");
		if(reg.test(cookie.substring(0,cookie.indexOf("=")))){
			return cookie.substring(cookie.indexOf("=")+1);
		}
	}
}
function setCookie(name,value){
	document.cookie=name+"="+escape(value);
}
/*计算价格*/
function calcPrice(){
    var buy_num=$(".buy_num");//购买数量
    var market_price=$(".market_price");//市场价
    var price=$(".price");//本店价
    var little_calc=$(".little_calc");//小计
    var ar={market_price:0,price:0,savePrice:0}
    var fareprice=0;
    for(var i=0;i<price.length;i++){
        var num=parseInt(buy_num[i].value);
        ar.market_price+=parseFloat(market_price[i].innerHTML)*num;
        var calc=parseFloat(price[i].innerHTML)*num+"";
        little_calc[i].innerHTML=calc.replace(/^(\d+)\.\d*$/,"$1")
        ar.price+=parseFloat(price[i].innerHTML)*num;
    }
    ar.savePrice=ar.market_price-ar.price;
    var totalprice=ar.price+fareprice;
    $(".computeprice").eq(0).text(ar.price.toFixed(2));
    $(".computeprice").eq(1).text(ar.savePrice.toFixed(2));
    $(".computeprice").eq(2).text(fareprice.toFixed(2));
    if($(".success_img").css("display")=="none" || $(".coupon_name").css("display")=="none"){
        $(".finalprice").eq(1).text(totalprice.toFixed(2));
    }
}
/*获取URL*/
function getPHP(file){
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    var root= window.location.protocol + '\/\/' + window.location.host + '/'+ webName + '/';
    return root+"home/kmall/src/httpdata/"+file;
}
String.prototype.trimpx=function(){
    var r=parseInt(this.replace("px",""));
    if(isNaN(r))return 0;
    return r;
}
String.prototype.ltrim=function(){
    return this.replace(/^\s+/,"");
}
String.prototype.rtrim=function(){
    return this.replace(/\s+$/,"");
}
String.prototype.trim=function(){
    return this.ltrim().rtrim();
}
function calcoupon(coupontext){
    var totalprice=$(".computeprice").eq(0).text();
    var num=$(".cartpid").size();
    var pids=new Array();
    var calcs=new Array();
    for(i=0;i<num;i++){
        pids[i]=$(".cartpid").eq(i).attr("pid");
        calcs[i]=$(".little_calc").eq(i).text();
    }
    var data="coupontext="+coupontext+"&totalprice="+totalprice+"&pids="+pids+"&calcs="+calcs;
    $(".couponkey").text(coupontext);
    $(".pleasecoupon,.usecouponform").hide();
    $.post(getPHP("coupon.php"),data,function(result){
        if(result!=0.00){
            var couponprice=result;
            var finalprice=(totalprice-couponprice).toFixed(2);
            $(".subtotal").addClass("subtotal2");
            $(".canelcoupon2,.desc_failure,.failure_img").hide();
            $(".coupon_name,.canelcoupon1,.usecouponstatus,.couponprice,.desc_success,.success_img").show();
            $(".finalprice").eq(1).text(finalprice);
            $(".computeprice").eq(3).text(couponprice);

        }else{
            $(".desc_success,.success_img,.canelcoupon1").hide();
            $(".coupon_name,.canelcoupon2,.usecouponstatus,.desc_failure,.failure_img").show();
        }
    },"json");
}
