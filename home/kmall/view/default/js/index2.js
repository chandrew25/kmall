$(function(){
	$(".menu .mi").unbind();
	$(".menu .mi").not('.ptype').hover(
		function(){
			$(this).children(".bg").show();
		},
		function(){
			$(this).children(".bg").hide();
		}
	);
	$(".menu .mi").children(".typew").css({'height':'343','width':'194'}).show();

	$(".side .con").prev().hide();
	$(".side .con").next().hide();
	$(".side").hover(
		function(){
			$(this).find('.con').prev().show();
			$(this).find('.con').next().show();
		},
		function(){
			$(this).find('.con').prev().hide();
			$(this).find('.con').next().hide();
		}
	);

	//f2 f3上面2个产品名称价格显示
	$("a>img").parent().siblings('.text').hide();
	$("a>img").parent().siblings('.textbg').hide();

	$(".plist.margintop li,.hotp .pr").hover(
		function() {
			$(this).find('.text').show();
			$(this).find('.textbg').show();
		},
		function() {
			$(this).find('.text').hide();
			$(this).find('.textbg').hide();
		}
	)

	//f1-f3下方4个产品名称价格显示切换
	$('.hotp .pl a>img').parent().siblings('.name').hide();
	$('.hotp .pl a>img').parent().siblings('.namebg').hide();
	$(".hotp .pl").hover(
		function() {
			$(this).find('.name').show();
			$(this).find('.namebg').show();
		},
		function() {
			$(this).find('.name').hide();
			$(this).find('.namebg').hide();
		}
	)
	

	//f1标题图切换
	$(".f1 .plist a img").mouseover(
		function(event){
			var pic=$(this).parents(".bc").find(".imgrec >img");
			var newpic=$(this).next();
			pic.attr('src',newpic.attr('src'));
	 	}
	);

	/*****************************广告图片切换*****************************/
	var banner=$("#banner");
	show_count=banner.find(".imgw img").length;//标记图片个数
	for(var i=0;i<show_count;i++){//根据图片的个数创建相应的按钮
		banner.find(".btnw").append("<a class='"+(i==0?"f":"b")+"'>"+(i+1)+"</a>");
	}
	banner.find(".btnw a").mouseenter(function(){
		show($(this).index());
	});
	banner.find(".imgw").css("width",banner.find(".imgw img").width()*show_count);
	show(0);
	/*************************楼层跳转*************************/
	var floor = { left: 15, right: 15, bottom: parseInt($("#floor").css("bottom").replace("px", "")), cwidth: 1000 };
	$(window).bind("resize scroll", function () {
		var obj = $("#floor");
		var wwidth = $(window).width(), left;
		if (wwidth > floor.cwidth + (obj.width() + floor.left + floor.right) * 2) {
			left = wwidth / 2 + floor.cwidth / 2 + floor.left;
		} else {
			left = wwidth - obj.width() - floor.right;
		}
		if ($.browser.msie && parseInt($.browser.version) < 7) {//IE6特殊处理，绝对定位
			var top = $(window).scrollTop() + $(window).height() - obj.height() - floor.bottom;
			obj.css({ position: "absolute", top: top, bottom: "auto" });
			left += $(window).scrollLeft();
		}
		obj.css({ left: left });
	});
	$(".floor .t").click(function(){
		var top=$("#"+$(this).attr("to")).offset().top;
		$("body,html").animate({ scrollTop: top },300);
	}).hover(
		function(){
			$(this).addClass("f");
		},
		function(){
			$(this).removeClass("f");
		}
	);
	
	$(window).resize();
});
var show_timer;//切换计时器
var show_time=800;//显示效果时间
var show_spacetime=5000;//切换间隔时间
var show_count;//显示个数
var show_current=0;//当前显示索引
function show(i){//切换图片、更换按钮样式
	if(isNaN(i)||i<0||i>=show_count)i=0;
	show_current=i;
	clearTimeout(show_timer);
	var banner=$("#banner");
	banner.find(".imgw").stop();
	var width=banner.find(".imgw img").width();
	banner.find(".imgw").animate({"marginLeft":0-width*show_current},show_time);//左右移动
	banner.find(".btnw a").removeClass("f").addClass("b").eq(show_current).removeClass("b").addClass("f");
	show_timer=setTimeout(
		function(){
			show(show_current+1);
		},
		show_spacetime
	);
}
//品牌
$(document).ready(function(){
    //品牌翻滚
    var i=0;
    var count=$(".brands .con ul li").length;
    var width=$(".brands .con").find("ul li").width()+13;
    var lifirst=$(".brands").children(".con").children("ul").first("li");
    $(".brands .left").click(function(){
        if(i<count-7){
            i++;
            lifirst.css("marginLeft",0-(width*i));
        }
        
    });
    $(".brands .right").click(function(){
        if(i>0){
            i--;
            lifirst.css("marginLeft",0-width*i);
        }
        
    });
    
    
});
$(document).ready(function(){
    //right---翻滚
    var j1=0;
    var j2=0;
    var j3=0;
    $(".side .top").click(function(){
        var id=$(this).parents().parents().parents().parents().attr("id");
        var count_right=$(this).siblings(".con").children("ul").children("li").length;
        var height=$(this).siblings(".con").find("ul li").height();
        var lifirst=$(this).siblings(".con").children("ul").first("li");
        if(id=="floor1-1"&&j1<count_right-2){
            j1++;
            lifirst.css("marginTop",0-(height*j1));
        }
        if(id=="floor1-2"&&j2<count_right-2){
            j2++;
            lifirst.css("marginTop",0-(height*j2));
        }
        if(id=="floor1-3"&&j3<count_right-2){
            j3++;
            lifirst.css("marginTop",0-(height*j3));
        }
    });
    $(".side .bottom").click(function(){
        var id=$(this).parents().parents().parents().parents().attr("id");
        var count_right=$(this).siblings(".con").children("ul").children("li").length;
        var height=$(this).siblings(".con").find("ul li").height();
        var lifirst=$(this).siblings(".con").children("ul").first("li");
        if(id=="floor1-1"&&j1>0){
            j1--;
            lifirst.css("marginTop",0-(height*j1));
        }
        if(id=="floor1-2"&&j2>0){
            j2--;
            lifirst.css("marginTop",0-(height*j2));
        }
        if(id=="floor1-3"&&j3>0){
            j3--;
            lifirst.css("marginTop",0-(height*j3));
        }
    });
});