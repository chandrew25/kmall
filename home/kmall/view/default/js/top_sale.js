$(document).ready(function(){

		//点击改变排行方式
		$(".order").click(function(){
			//去除所有排行方式的选中状态
			$(".order").removeClass("order_selected");
			$(".order").removeClass("theme_color_dark");
			//为当前排行方式加上选中状态
			$(this).addClass("order_selected");
			$(this).addClass("theme_color_dark");
		});
		
		//点击按销售量排行
		$("#order_by_sales_count").click(function(){
			//隐藏所有分类
			$(".cate_list").hide();
			//显示销售量排行的分类
			$("#cate_list_by_sales_count").show();
		});
		
		//点击按销售额排行
		$("#order_by_sales_money").click(function(){
			//隐藏所有分类
			$(".cate_list").hide();
			//显示销售额排行的分类
			$("#cate_list_by_sales_money").show();
		});
		
});	