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
	$("#banner .btnw").html("");
    $("#banner .btnw").append("<div class='button_hack'></div>");
	for(var i=0;i<bannerCount;i++)
		$("#banner .btnw").append("<div class='btn b'></div>");
    $("#banner .btnw .button_hack").html("");
    for(var i=0;i<bannerCount;i++)
        $("#banner .btnw .button_hack").append("<div class='btnh'></div>");
        
    //点击按钮
	$("#banner .btnw .button_hack .btnh").click(function(){
		showBanner($(".btnh").index($(this)));
	});
	//开始显示第一个图片
	showBanner(0);
    
    var path = $(".url").attr("item");//路径
    //复选框
    var url_off="url("+path+"/resources/images/icon/list_icon.jpg)";
    var url_on="url("+path+"/resources/images/icon/list_icon_on.jpg)";
    
    $("label").click(function(){
        if($(this).children().first().children().attr('checked')==undefined){
            $(this).children().first().children().attr('checked','true');
            $(this).children().first().css("background",url_on);
        }else{
            $(this).children().first().children().removeAttr("checked");
            $(this).children().first().css("background",url_off);
        }
    });
    
    $("input").click(function(){
        if($(this).attr('checked')==undefined){
            $(this).attr('checked','true');
            $(this).parent().css("background",url_on);
        }else{
            $(this).removeAttr("checked");
            $(this).parent().css("background",url_off);
        }
    });
    
});
var bannerTimer;//自动切换图片计时器
var bannerShowTime=1000;//显示效果时间
var bannerTime=5000;//切换间隔时间
var bannerCount;//图片个数
var bannerCurrent=0;//当前显示的图片序号(从0开始)
/*切换图片、更换按钮样式*/
function showBanner(i){
	if(isNaN(i)||i<0||i>=bannerCount)i=0;
	bannerCurrent=i;
	clearTimeout(bannerTimer);
    var path = $(".url").attr("item");//路径
	$("#banner .bimgwlayer").stop();
    $("#banner .bimgw").animate({opacity:0},bannerShowTime/2);
	$("#banner .bimgwlayer").animate({opacity:1},bannerShowTime/2,function(){
		$("#banner .bimgw img").hide().eq(bannerCurrent).show();
        $("#banner .btnw .button_hack .btnh").css("background","none");
        $("#banner .btnw .button_hack .btnh").eq(bannerCurrent).css("background-image","url("+path+"/resources/images/icon/st_icon_up.jpg)");
		$("#banner .bimgwlayer").animate({opacity:0},bannerShowTime/2);
        $("#banner .bimgw").animate({opacity:1},bannerShowTime/2);
	});
	bannerTimer=setTimeout(
		function(){
			showBanner(bannerCurrent+1);
		},
		bannerTime
	);
}