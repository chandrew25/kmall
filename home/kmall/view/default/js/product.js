//加入购物车,免注册预定阻止
function Closeallow(){
}

//加入购物车,免注册预定开放
function Openallow(){
	
}

//切换捆绑商品box
function toggleGroups (gid) {
	var group=$(".vgroup .group[val="+gid+"]");
	if (group.length>0) {
		$(".vgroup .group[val]").parent().show();
		group.show().siblings('.group[val]').hide();
	}else{
		$(".vgroup .group[val]").parent().hide();
	}
}

//切换货品
function setGoods (cgoods) {
	//确定价格
	$("#goods_price").html(cgoods.market_price);
	//确定名称
	$("#goods_name_show").attr('title',cgoods.goods_name);
	var tmpname=cgoods.goods_name;
	if(tmpname.length>32){
	  //商品名称不溢出行
	  tmpname=tmpname.substring(0,32)+"...";   
	}
	$("#goods_name_show").html(tmpname);
	//确定货号
	$("#goods_code_show").html(cgoods.goods_code);
	$("#goods_id").val(cgoods.goods_id);
	toggleGroups(cgoods.goods_id);//切换捆绑box
}

function countGroup(input){
	group=input.parents('.group');
	var old_price=parseInt(group.find('.groups_prices').html());//全部捆绑商品的价格
	var new_price=parseInt(input.parent().find('.color_red span').html());//点击的捆绑商品的价格
	var group_nums=parseInt(group.find('.group_nums').html());//选中捆绑商品的总数
	if(!input.attr('checked')){
		old_price-=new_price;
		group_nums-=1;
		old_price=(old_price<0)?old_price+=new_price:old_price;
		group_nums=(group_nums<0)?0:group_nums;
	}else{
		old_price+=new_price;
		group_nums+=1;
	}
	group.find('.groups_prices').html(old_price);
	group.find('.group_nums').html(group_nums);
}


$(function(){ 

	//添加收藏
	$('.fav').click(function () {
	if($("#member_id").val()=="0"){
	  alert("请先登录，再收藏商品。");
	  return;
	}
	alert("已收藏商品。");
	$('#buy_product_form input[name=go]').val('kmall.product.addCollect');
	$('#buy_product_form').submit();
	});

	//套餐购买按钮
	$('.setmeal .group .total .btn').click(function(){
		$("#goods_ids").val($(this).parent().parent().attr('val'));
		alert("已添加商品，请到购物车查看。");
		$('#buy_product_form input[name=go]').val('kmall.product.addMeal');
		$('#buy_product_form').submit();
	});

	//套餐切换
	$('.setmeal .title .h').click(function(){
		$(this).addClass('f').siblings().removeClass('f');
		$('.setmeal .group[val='+$(this).attr('val')+']').show().siblings('.group').hide();
	});


	//捆绑购买按钮
	$('.vgroup .total .btn').click(function(){
		var gids=new Array($(this).parents('.group').attr('val'));
		$(this).parent().siblings('.list').find('input[val]').each(function(){
			if ($(this).attr('checked'))
				gids.push($(this).attr('val'));
		});
		$("#goods_ids").val(gids.join('-'))
		$('#buy_product_form input[name=go]').val('kmall.product.addGroup');
		$('#buy_product_form').submit();
		alert("已添加商品，请到购物车查看。");
	})

	//计算每个捆绑组合的总价
	$('.vgroup .group[val]').each(function(){
		// var group=$(this); 
		// countGroup(group);
	});

	$('.vgroup .group input[type="checkbox"]').click(function(){
		// group=$(this).parents('.group');
		countGroup($(this));
	})

	//选中全部规格标志位
	var chooseALl=false;
	if($("#goodslist").length>0){
		var goodslist=eval("("+$("#goodslist").val()+")");//货品列表
		var goods=eval("("+$("#goods").val()+")");//进入该页面的货品

		//点击和hover规格
		$(".spec .lsi").hover(
		  function(){
			var the=$(this);
			if(the.is(".e")){
			  return;
			}
			if(!the.attr("checked")){
			  the.addClass("f");
			}
		  },
		  function(){
			var the=$(this);
			if(the.is(".e")){
			  return;
			}
			if(!the.attr("checked")){
			  the.removeClass("f");
			}
		  }
		).live("click",function(){
			var the=$(this);
			if(the.is(".e")){
			  return;
			}
			if(the.attr("checked")){
			  the.removeClass("f").removeAttr("checked");
			}else{
			  the.addClass("f").attr("checked","1");
			  the.siblings().removeClass("f").removeAttr("checked");
			}
			var keys=new Array();//选中的规格
			$(".spec .bs .lsi[checked]").each(function(){
			  keys[keys.length]=$(this).attr("val");
			});
			$(".spec .bsi").each(function(){
			  var ls=$(this).find(".lsi");
			  var chkid=$(this).find(".lsi[checked]").attr("val");//同一父规格的选中规格
			  ls.each(function(){
				//跟之前选中的规格进行比对，是否还可选择
				var attr_id=$(this).attr("val");
				var ok;
				for(var i=0;i<goodslist.length;i++){
				  ok=true;
				  for(var j=0;j<keys.length;j++){
					if(keys[j]!=chkid && goodslist[i].pspec_key.indexOf("-"+keys[j]+"-")==-1){
					  ok=false;
					  break;
					}
				  }
				  if(attr_id!=chkid && goodslist[i].pspec_key.indexOf("-"+attr_id+"-")==-1){
					ok=false;
				  }
				  if(ok){
					break;
				  }
				}
				if(ok){
				  $(this).removeClass("e");
				}else{
				  $(this).addClass("e").removeClass("f");
				}
			  });
			});
			//选中所有类型的规格则显示选中货品的信息
			var allchecked=true;
			$(".spec .bsi").each(function(){
			  if($(this).find(".lsi[checked]").length==0){
				allchecked=false;
				Closeallow();
				chooseALl=false;
				return false;
			  }
			});
			if(allchecked){
			  //开放加入购物车和购买
			  Openallow();
			  chooseALl=true;
			  var ok,cgoods;
			  for(var i=0;i<goodslist.length;i++){
				var ok=true;
				for(var j=0;j<keys.length;j++){
				  if(goodslist[i].pspec_key.indexOf("-"+keys[j]+"-")==-1){
					ok=false;
					break;
				  }
				}
				if(ok){
				  cgoods=goodslist[i];
				  break;
				}
			  }
			  setGoods(cgoods);//切换货品
			}else{
			  $("#goods_price").html($("#goods_price").attr("val"));
			  $("#goods_name_show").html($("#goods_name_show").attr("val"));
			}
		});
		//选择当前货品
		var keys=goods.pspec_key.split("-");
		for(var i=1;i<keys.length-1;i++){
			$(".spec .lsi[val="+keys[i]+"]").click();
		}
		setGoods(goods);
		//初始开放加入购物车...
		Openallow();
		chooseALl=true;
	}else{
		chooseALl=true;    
	}

	//加入购物车
	$('#addcart').click(function(){
		if(chooseALl){
		  var num = $(this).attr("num");
		  if (num) {
		  	var url_base=$("#msg_form").val();
			var product_id=$("#product_id").val();
			var num=$("#num").val();
			var url=url_base+"index.php?go=kmall.product.isLimited";
			var comdata="product_id="+product_id+"&num="+num;
			$.post(url,comdata,function(result){
				if(result.code==1){
			  		$('#buy_product_form input[name=go]').val('kmall.product.addProduct');
					$('#buy_product_form').submit();
					alert("已添加商品，请到购物车查看。");
			  	}else{
			  		alert(result.msg);
			  	}
			},"json");
		  	
		  }else{
			$('#buy_product_form input[name=go]').val('kmall.product.addProduct');
			$('#buy_product_form').submit();
			alert("已添加商品，请到购物车查看。");
		  }
		}else{
			alert("请选择全部规格。");
		}
		 
	});
	//立即购买
	$('#addcart2').click(function(){
		if(chooseALl){
		  var num = $(this).attr("num");
		  if (num) {
		  	var url_base=$("#msg_form").val();
			var product_id=$("#product_id").val();
			var num=$("#num").val();
			var url=url_base+"index.php?go=kmall.product.isLimited";
			var comdata="product_id="+product_id+"&num="+num;
			$.post(url,comdata,function(result){
				if(result.code==1){
			  		$('#buy_product_form input[name=go]').val('kmall.product.addProduct2');
					$('#buy_product_form').submit();
			  	}else{
			  		alert(result.msg);
			  		window.location.reload();
			  	}
			},"json");
		  	
		  }else{
			$('#buy_product_form input[name=go]').val('kmall.product.addProduct2');
			$('#buy_product_form').submit();
		  }
		}else{
			alert("请选择全部规格。");
		}
		 
	});
	//价格加减
	$('.dd div').click(function(){
		var num=parseInt($('.dd input.num').val());
		 if($(this).hasClass('minus')){
			num-=1;
		 }else  if($(this).hasClass('plus')){
			num+=1;
		 }
		 num=(num<=0) ? 1 : num;
		 $('.dd input.num').val(num);
	});

	/***************图片延迟加载***************/
	$("img[original]").lazyload();
	/***************图片放大镜***************/
	var options={
		position:"right",
		zoomType: "standard",
		zoomWidth:529,
		zoomHeight:428,
		xOffset:18,
		yOffset:0,
		preloadText:"图片加载中"
	};
	$(".jqzoom").jqzoom(options);
	/***************商品系列图***************/
	var seriesImgWidth=$("#seriesImgs li").outerWidth(true);
	var seriesImgsWidth=$("#seriesImgs li").length*seriesImgWidth;
	var seriesImgswWidth=$("#seriesImgs").parent().width();
	$("#seriesImgs").width(seriesImgsWidth);
	if($("#seriesImgs li").length<=5){//系列图的个数不多则隐藏右查看
		$("#seriesImgright").hide();
	}
	$("#seriesImgs li").mouseenter(function(){
		$(this).addClass("f").siblings().removeClass("f");
	});
	//左
	$("#seriesImgleft").click(function(){
		var marginLeft=parseFloat($("#seriesImgs").css("marginLeft").replace("px",""));
		$("#seriesImgs").animate({marginLeft:marginLeft+seriesImgWidth},300,function(){
			if(0-marginLeft<=seriesImgWidth){
				$("#seriesImgleft").hide();
			}
		});
		$("#seriesImgright").show();
	});
	//右
	$("#seriesImgright").click(function(){
		var marginLeft=parseFloat($("#seriesImgs").css("marginLeft").replace("px",""));
		$("#seriesImgs").animate({marginLeft:marginLeft-seriesImgWidth},300,function(){
			if(seriesImgswWidth-marginLeft>=seriesImgsWidth-seriesImgWidth*2){
				$("#seriesImgright").hide();
			}
		});
		$("#seriesImgleft").show();
	});
	/***************套餐、组合***************/
	$(".box .con .list ul").each(function(){
		var iwidth=$(this).children("li").outerWidth(true);
		var count=$(this).children("li").length;
		var parent=$(this).parent();
		$(this).width(iwidth*count);
		if($(this).width()>parent.width()){
			parent.css("height","202");
		}
	});
	/***************商品详情、规格、咨询***************/
	$(".box .title .i[to]").click(function(){
		$(this).addClass("f").siblings().removeClass("f");
		var box=$(this).parents(".box:first");
		box.find(".con>div[to="+$(this).attr("to")+"]").show().siblings("[to]").hide();
	});
});


/**********************评论**********************/

$(document).ready(function(){    
	/**********************生成商品评价**********************/
	var url_base=$("#msg_form").val();
	var url=url_base+"index.php?go=kmall.ajax.getComment";
	var comdata="product_id="+$("#product_id").val();
	$.post(url,comdata,function(result){
		//返回的comment
		var comments=result.comments;
		//comment计数
		var count=result.count;
		//当前显示coumment数目
		var now=result.now;
		if(comments){//购物车
			commentshow=getLi(comments);
			if(count>5){
				var more=[
					"<li id='seemore' style='height:20px;line-height:20px;text-align:right;margin:15px 0px;font-size:13px;border:0px;'>",
						"<a href='javascript:;'>查看更多评论</a>",
					"</li>",
				];
				commentshow=commentshow+more.join("");
			}
		}else{
			commentshow="";
		}
		$("#comment_show_num").attr("value",count);
		$("#comment_num").html(count);
		$("#rate_num").html(count);
		$("#other_comments").html(commentshow);
		$("#other_comments li:hidden").show();
	},"json");

	/*-----------------商品评价------------------------------*/
	//点击我要评价
	$("#msg_submit").click(function(){
	if($("#member_id").val()=="0"){
	  $(window).resize();
	  var msg_max_notice="请先登录，再评论。";
	  var color="rgb(255, 0, 0)";//更改的字体颜色
	  $("#msg_comment_input_notice").css("color",color);
			$("#msg_comment_input_notice").text(msg_max_notice);
	  return;
	}
		if(!checkContent()){
			$("#msg_comment_input").focus();
			return;//文本验证不通过则返回
		}
		var data="product_id="+$("#product_id").val()
				+"&is_new_comment="+$("#is_new_comment").val()
				+"&user_comment="+$("#msg_comment_input").val();
		$("#msg_comment_input").val("");
		$.post(getPHP("order_new.php"),data,function(result){
			if(result!=null){
				//当前显示评论数
				var nowcount=parseInt($("#comment_num").html());
				$("#comment_show_num").html(nowcount+1);
				$("#comment_num").html(nowcount+1);
				$("#other_comments").prepend(getLi(result));
				$("#other_comments li:hidden:not(#seemore)").slideDown("fast");
			}
		},"json");
	});
	//点击查看更多
	 ajaxing=false;
	$("#seemore").live("click",function(){
		if(ajaxing){//正在执行ajax操作
			return;
		}
		//标识正在执行ajax
		ajaxing=true;
		var data="product_id="+$("#product_id").val()+"&start="+($("#comment_show_num").val()==""?0:$("#comment_show_num").val());
		var url=url_base+"index.php?go=kmall.ajax.getComment";
		$.post(url,data,function(result){
			//恢复
			ajaxing=false;
			//返回的comment
			var comments=result.comments;
			var now=result.now;
			if(comments!=null&&comments.length>0){
				//当前显示评论数
				var nowcount=parseInt($("#comment_show_num").val());
				//获得的评论数
				var now=parseInt(now);
				$("#comment_show_num").val(nowcount+now);//重新设定已显示评论数量
				$("#seemore").before(getLi(comments));
				$("#other_comments li:hidden").slideDown(300);
			}else{
				$("#seemore").before("<li style='height:40px;font-size:14px;font-weight:bold;text-align:center;'>已经没有更多的评论了!</li>");
				$("#seemore").hide();
			}
		},"json");
	})
});

/*获取php url*/
function getPHP(file){
	var pathName = window.location.pathname.substring(1);
	var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
	var root= window.location.protocol + '\/\/' + window.location.host + '/'+ webName + '/';
	return root+"home/kmall/src/httpdata/"+file;
}
/*检查评论输入*/
function checkContent(){
	var color="rgb(255, 0, 0)";//更改的字体颜色
	var maxCount=200;//最大字数限制
	var msg_max_notice="内容不超过"+maxCount+"个字";
	var msg_empty_notice="评论不能为空";
	$("#msg_comment_input").val($.trim($("#msg_comment_input").val()));
	if($("#msg_comment_input").val()==""){//如果字数验证不通过则更换字体颜色
		$("#msg_comment_input_notice").css("color",color);
		$("#msg_comment_input_notice").text(msg_empty_notice);
		return false;
	}
	if($("#msg_comment_input").val().length>maxCount){//如果字数验证不通过则更换字体颜色
		$("#msg_comment_input_notice").css("color",color);
		$("#msg_comment_input_notice").text(msg_max_notice);
		return false;
	}
	$("#msg_comment_input_notice").css("color","");
	$("#msg_comment_input_notice").text(msg_max_notice);
	return true;
}
/*把相应的json格式数据转换为列表项*/
function getLi(result){
	var str="";
	if(result==null)return str;
	for(var i=0;i<result.length;i++){
		str+="<li style='display:none;'>"
		str+="	<div class='q'>"
		str+="		<div class='t'>会员："+($.trim(result[i].memberName)==""?"匿名":result[i].memberName)+"</div>"
		str+="		<div class='u'>"+result[i].add_time.replace(/:\d{1,2}$/,"")+"</div>"
		str+="	</div>"
		str+="	<div class='a'>"
		str+="		<div class='t'>"+result[i].content+"</div>"
		str+="	</div>"
		str+="</li>"
	}
	return str;
}

function isLimited(){
	var url_base=$("#msg_form").val();
	var product_id=$("#product_id").val();
	var num=$("#num").val();
	var url=url_base+"index.php?go=kmall.product.isLimited";
	var comdata="product_id="+product_id+"&num="+num;
	$.post(url,comdata,function(result){
		return result;
	},"json");
}

