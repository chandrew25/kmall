$(function () {
    function params(k,url){
      url = url || location.search;
      var p={};
      url.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(s,k,v){p[k]=v})
      return k?p[k]:p;
    }
    //自动高亮当前页面链接地址对应的导航菜单
    function showLayoutMenuActive(linkName){
      var urlstatus = false;
      var urlstr    = location.href;
      $(linkName).each(function () {
        if (!$(this).attr('href')) return;
        var link = $(this).attr('href').replace(/\.\.\//g, "");
        // link     = link.substring(0, link.lastIndexOf(".")+1);
        link     = params("go", link);
        url_p    = params("go", urlstr);
        if ( link && ( url_p==link) && ( link != '' ) && ( link != '#' ) ) {
          $(this).addClass('current');
          urlstatus = true;
        } else {
          $(this).removeClass('current');
        }
        if($(linkName + ".current").length>1){
          $(linkName).eq(0).removeClass('current');
        }
      });
      if (!urlstatus) {
        $(linkName).eq(0).addClass('current');
      }
    }
    showLayoutMenuActive(".menu .menu_item a");




    $(window).scroll(function(){
        if($(window).scrollTop() >= 135){
            $(".fixed_search").show();
        }else{
            $(".fixed_search").hide();
        }
        if($(window).scrollTop() >= 80){
            $("#needtohelp_0_contactus").show();
        }else{
            $("#needtohelp_0_contactus").hide();
        }
    });
//	$('.catologs_list').css('left',($(window).width()-1000)/2);
	$('.catologs').hover(function () {
		$('.catologs_list').stop(1, 1).fadeIn();
	}, function () {
		$('.catologs_list').stop(1, 1).fadeOut();
	});
    $('.iconi-img').hover(function () {
        var str = $(this).attr("src");
        str = str.replace('car-','cars-');
        $(this).attr("src",str);
    }, function () {
        var str = $(this).attr("src");
        str = str.replace('cars-', 'car-');
        $(this).attr("src",str);
    });
    /*************************购物车*************************/
    var sidecartBtm = 0;
    if ( $("#sidecart")&& $("#sidecart").css("bottom") ) sidecartBtm = $("#sidecart").css("bottom").replace("px", "");
    var sidecart = { left: 15, right: 15, bottom: parseInt(sidecartBtm), showheight: 200, opacity: 1, spacetime: 100, cwidth: 1000 };
    // var setSideCart=function() {
    //     var obj = $("#sidecart");
    //     var wwidth = $(window).width(), left;
    //     if (wwidth > sidecart.cwidth + (obj.width() + sidecart.left + sidecart.right) * 2) {
    //         left = wwidth / 2 + sidecart.cwidth / 2 + sidecart.left;
    //     } else {
    //         left = wwidth - obj.width() - sidecart.right;
    //     }
    //     obj.css({ left: left });
    // };
    // setSideCart();

    $(window).bind("resize scroll",function(){
        var $obj=$("#sidecart"),objdata=sidecart,wwidth=$(window).width(),left;
        if(wwidth>objdata.cwidth+($obj.width()+objdata.left+objdata.right)*2){
            left=wwidth/2+objdata.cwidth/2+objdata.left;
        }else{
            left=wwidth-$obj.width()-objdata.right;
        }
        if($.browser.msie&&parseInt($.browser.version)<7){//IE6特殊处理，绝对定位
            var top=$(window).scrollTop()+objdata.top;
            $obj.css({position:"absolute",top:top});
            left+=$(window).scrollLeft();
        }
        $obj.css({left:left});
    });

    /*************************回到顶部*************************/

    var goupBtm = 0;
    if ( $("#goup")&& $("#goup").css("bottom") ) goupBtm = $("#goup").css("bottom").replace("px", "");
    var goup = { left: 15, right: 15, bottom: parseInt(goupBtm), showheight: 200, opacity: 1, spacetime: 100, cwidth: 1000 };

    $("#goup").click(function () {
        $("body,html").animate({ scrollTop: 0 }, goup.spacetime);
    });


    $(window).bind("resize scroll", function () {
        var obj = $("#goup");
        var sidecart=$('#sidecart');
        if ($(window).scrollTop() < goup.showheight) {
            obj.stop().animate({ opacity: 0 }, goup.spacetime, function () {
                $(this).hide();
            });
        } else {
            obj.stop().show().animate({ opacity: goup.opacity }, goup.spacetime);
            var wwidth = $(window).width(), left;
            if (wwidth > goup.cwidth + (obj.width() + goup.left + goup.right) * 2) {
                left = wwidth / 2 + goup.cwidth / 2 + goup.left;
            } else {
                left = wwidth - obj.width() - goup.right;
            }
            if ($.browser.msie && parseInt($.browser.version) < 7) {//IE6特殊处理，绝对定位
                var top = $(window).scrollTop() + $(window).height() - obj.height() - goup.bottom;
                obj.css({ position: "absolute", top: top, bottom: "auto" });
                left += $(window).scrollLeft();
            }
            obj.css({ left: left });
        }
    });

    /********节日通知********/
    //var noticeData = { left: 15, right: 15, bottom: parseInt($("#notice").css("bottom").replace("px", "")), showheight: 200, opacity: 1, spacetime: 100, cwidth: 1000 };
    //浮动
//    $(window).bind("resize scroll",function(){
//        var $obj=$("#notice"),objdata=noticeData,wwidth=$(window).width(),left;
//        if(wwidth>objdata.cwidth+($obj.width()+objdata.left+objdata.right)*2){
//            left=wwidth/2+objdata.cwidth/2+objdata.left;
//        }else{
//            left=wwidth-$obj.width()-objdata.right;
//        }
//        if($.browser.msie&&parseInt($.browser.version)<7){//IE6特殊处理，绝对定位
//            var top=$(window).scrollTop()+objdata.top;
//            $obj.css({position:"absolute",top:top});
//            left+=$(window).scrollLeft();
//        }
//        $obj.css({left:left});
//    });
    //关闭
    $("#notice_close").click(function(){
        $("#notice").hide();
    });
    /********节日通知********/

    $(window).resize();
    $(window).scroll();

    $("#sidecart").show();
    $("#notice").show();

    /*** category ***/
  $(".all_cg").hover(
    function(){
      $('.category').show();
    },
    function(){
      $('.category').hide();
    }
  );
  $(".category").hover(
    function(){
      $('.category').show();
    },
    function(){
      $('.category').hide();
    }
  );
  $(".category_item").hover(
    function(){
      $('.ptype_lists').hide().eq($(this).index()).show();
    },
    function(){
      $('.ptype_lists').hide();
    }
  );
  $(".ptype_lists").hover(
    function(){
      $('.category').show();
      $(this).show();
      $('.category_item').removeClass('category_item_on').eq($(this).index()).addClass('category_item_on');
      $('.category_item').eq($(this).index()).addClass('category_item_on'+($(this).index()+1));
    },
    function(){
      $('.category').hide();
      $('.ptype_lists').hide();
      $('.category_item').removeClass('category_item_on');
      $('.category_item').eq($(this).index()).removeClass('category_item_on'+($(this).index()+1));
    }
  );

});

//获取url参数
function request(paras)
{
    var url = location.href;
    var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
    var paraObj = {}
    for (i=0; i<paraString.length ; i++){
        j=paraString[i];
        paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
    }
    var returnValue = paraObj[paras.toLowerCase()];
    if(typeof(returnValue)=="undefined"){
        return "";
    }else{
        return parseInt(returnValue);
    }
}

//防止sql注入
function AntiSqlValid(oField)
{
    re= /select|update|delete|exec|count|’|"|=|;|>|<|%/i;
    if (re.test(oField.value))
    {
        return false;
    }
    return true;
}

 function addFavorite() {
    var url = window.location;
    var title = document.title;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("360se") > -1) {
        alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
    }else if (ua.indexOf("msie 8") > -1) {
        window.external.AddToFavoritesBar(url, title); //IE8
    }else if (document.all) {
        try{
            window.external.addFavorite(url, title);
        }catch(e){
            alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
        }
    }else if (window.sidebar) {
        window.sidebar.addPanel(title, url, "");
    }else {
        alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
    }

}
