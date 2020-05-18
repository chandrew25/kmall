$(function(){
    //标题价格淡入淡出效果 
    $(".floor_item").hover(
        function(){$(this).find('div').stop(1,1).fadeIn();},
        function(){$(this).find('div').stop(1,1).fadeOut();}
    )

    //菜单一只显示 
    $(".catologs").unbind();
	
    /*****************************广告图片切换*****************************/
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


});