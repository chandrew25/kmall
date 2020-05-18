$(function(){
	$(window).bind("resize",function(){
		var banner=$("#banner");
		var layer=banner.children(".bimgwlayer");
		if($(window).width()<banner.width()){
			banner.parent().css("overflow","inherit");
			layer.css({left:0,width:"100%"});
		}else{
			banner.parent().css("overflow","hidden");
			layer.css({left:banner.width()/2-$(window).width()/2,width:$(window).width()});
		}
	});
	$(window).resize();
	//标记图片个数
	bannerCount=$("#banner .bimgw img").length;
	$("#banner .dimgw img").click(function(){
		showBanner($(this).index());
	});
	//开始显示第一个图片
	setTimeout(function(){
		showBanner(1);
	},8000);
	
});
var bannerTimer;//自动切换图片计时器
var bannerShowTime=1200;//显示效果时间
var bannerTime=8000;//切换间隔时间
var bannerCount;//图片个数
var bannerCurrent=0;//当前显示的图片序号(从0开始)
/*切换图片、更换按钮样式*/
function showBanner(i){
	if(isNaN(i)||i<0||i>=bannerCount)i=0;
	bannerCurrent=i;
	clearTimeout(bannerTimer);
	$("#banner .bimgwlayer").stop();
	$("#banner .bimgw img").animate({opacity:0},bannerShowTime/2);
	$("#banner .bimgwlayer").animate({opacity:1},bannerShowTime/2,function(){
		$("#banner .bimgw img").hide().eq(bannerCurrent).show();
		$("#banner .bimgwlayer").animate({opacity:0},bannerShowTime/2);
		$("#banner .textw .t").hide().eq(bannerCurrent).show();
		$("#banner .dimgw img").removeClass("f").addClass("b").eq(bannerCurrent).removeClass("b").addClass("f");
		$("#banner .bimgw img").animate({opacity:1},bannerShowTime/2);
	});
	bannerTimer=setTimeout(
		function(){
			showBanner(bannerCurrent+1);
		},
		bannerTime
	);
}