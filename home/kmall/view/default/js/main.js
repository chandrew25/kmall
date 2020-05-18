$(function() {
	var top1 = $("#to_f1").offset().top;
	var top2 = $("#to_f2").offset().top;
	var top3 = $("#to_f3").offset().top;
	var top4 = $("#to_f4").offset().top;
	var top5 = $("#to_f5").offset().top;
	var top6 = $("#to_f6").offset().top;
	var top7 = $("#to_f7").offset().top;
	var top8 = $("#to_f8").offset().top;
	var top9 = $("#to_f9").offset().top;
	var top10 = $("#to_f10").offset().top;
	var top11 = $("#to_f11").offset().top;
	var top12 = $("#to_f12").offset().top;
	var top13 = $("#to_f13").offset().top;
	$(window).scroll(function(){
		
    if ($(window).scrollTop()>679) {
    	$(".f_nav").show();
    }else{
    	$(".f_nav").hide();
    }
    var scrollT = $(window).scrollTop();
    if (scrollT>=top1&&scrollT<top2) {
    	$('.f_nav_item').removeClass('f_nav_item_on').eq(0).addClass('f_nav_item_on');
    }else if (scrollT>=top2&&scrollT<top3) {
    	$('.f_nav_item').removeClass('f_nav_item_on').eq(1).addClass('f_nav_item_on');
    }else if (scrollT>=top3&&scrollT<top4) {
    	$('.f_nav_item').removeClass('f_nav_item_on').eq(2).addClass('f_nav_item_on');
    }else if (scrollT>=top4&&scrollT<top5) {
    	$('.f_nav_item').removeClass('f_nav_item_on').eq(3).addClass('f_nav_item_on');
    }else if (scrollT>=top5&&scrollT<top6) {
    	$('.f_nav_item').removeClass('f_nav_item_on').eq(4).addClass('f_nav_item_on');
    }else if (scrollT>=top6&&scrollT<top7) {
    	$('.f_nav_item').removeClass('f_nav_item_on').eq(5).addClass('f_nav_item_on');
    }else if (scrollT>=top7&&scrollT<top8) {
    	$('.f_nav_item').removeClass('f_nav_item_on').eq(6).addClass('f_nav_item_on');
    }else if (scrollT>=top8&&scrollT<top9) {
    	$('.f_nav_item').removeClass('f_nav_item_on').eq(7).addClass('f_nav_item_on');
    }else if (scrollT>=top9&&scrollT<top10) {
    	$('.f_nav_item').removeClass('f_nav_item_on').eq(8).addClass('f_nav_item_on');
    }else if (scrollT>=top10&&scrollT<top11) {
    	$('.f_nav_item').removeClass('f_nav_item_on').eq(9).addClass('f_nav_item_on');
    }else if (scrollT>=top11&&scrollT<top12) {
    	$('.f_nav_item').removeClass('f_nav_item_on').eq(10).addClass('f_nav_item_on');
    }else if (scrollT>=top12&&scrollT<top13) {
    	$('.f_nav_item').removeClass('f_nav_item_on').eq(11).addClass('f_nav_item_on');
    }else if (scrollT>=top13) {
    	$('.f_nav_item').removeClass('f_nav_item_on').eq(12).addClass('f_nav_item_on');
    }
  });

  /*** 礼包切换 ***/
  var toggleTime = 1000;
  function toggle(obj) {
    var number = obj.data('num');
    // obj.children(".f3_item_li").eq(number).show().siblings(".f3_item_li").hide();
    obj.children(".f3_item_li").eq(number).fadeIn(toggleTime).siblings(".f3_item_li").fadeOut(toggleTime);
  }
  $('.f3_item_box').each(function(){
    $(this).data('num',0);
    $(this).data('total',$(this).children(".f3_item_li").length);
    toggle($(this));
  });
  $('.f3_item_left').click(function(){
    var tNum = $(this).next().data('num');
    var liCount = $(this).next().data('total');
    tNum--;
    if(tNum == -1){
      tNum = liCount-1;
    }
    $(this).next().data('num',tNum);
    toggle($(this).next());
  });
  $('.f3_item_right').click(function(){
    var tNum = $(this).prev().data('num');
    var liCount = $(this).prev().data('total');
    tNum++;
    if(tNum == liCount){
      tNum = 0;
    }
    $(this).prev().data('num',tNum);
    toggle($(this).prev());
  });
  /*** banner切换 ***/
  var timer;
  var bTotal = $('.banner_item').length;
  var bTime1 = 5000;
  var bTime2 = 2000;
  var bNum = 0;
  function show() {
    clearInterval(timer);
    $('.banner_item').eq(bNum).fadeIn(bTime2).siblings(".banner_item").fadeOut(bTime2);
    $('.btn_item').eq(bNum).addClass('on_btn_item').siblings(".btn_item").removeClass('on_btn_item');
    bNum++;
    if(bNum == bTotal){
      bNum = 0;
    }
    timer = setInterval(show,bTime1);
  }
  show();
  $(".btn_item").hover(function(){
    bNum = $(this).index();
    show();
  });

  /*** 首页礼包切换 ***/
  var num0 = $(".f3_banner_0").children().length;
  var num1 = $(".f3_banner_1").children().length;
  var num2 = $(".f3_banner_2").children().length;
  var num3 = $(".f3_banner_3").children().length;
  var bTime3 = 5000;
  if (num0>1) {
     var i=0;
     timer0 = setInterval(bannershow0,bTime3);
  }

    /**
     * 关闭公告
     */
    $(".colse").click(function () {
        $(".notice_msg").hide();
        $(".notice_body").hide();
    })

  function bannershow0(){
    var j = i-1;
    if (j<0) {
      j=num0;
    }
    $('.f3_banner_0').children(".f3_item_li").hide();
    $('.f3_banner_0').children().eq(i).show();
    i++;
    if(i == num0){
      i = 0;
    }
  }

  if (num1>1) {
     var i1=0;
     timer1 = setInterval(bannershow1,bTime3);
  }


  function bannershow1(){
    var j1 = i1-1;
    if (j1<0) {
      j1=num1;
    }
    $('.f3_banner_1').children(".f3_item_li").hide();
    $('.f3_banner_1').children().eq(i1).show();
    i1++;
    if(i1 == num1){
      i1 = 0;
    }
  }

  if (num2>1) {
     var i2=0;
     timer2 = setInterval(bannershow2,bTime3);
  }


  function bannershow2(){
    var j2 = i2-1;
    if (j2<0) {
      j2=num2;
    }
    $('.f3_banner_2').children(".f3_item_li").hide();
    $('.f3_banner_2').children().eq(i2).show();
    i2++;
    if(i2 == num2){
      i2 = 0;
    }
    
  }
  
  if (num3>1) {
     var i3=0;
     timer3 = setInterval(bannershow3,bTime3);
  }


  function bannershow3(){
    var j3 = i3-1;
    if (j3<0) {
      j3=num3;
    }
    $('.f3_banner_3').children(".f3_item_li").hide();
    $('.f3_banner_3').children().eq(i3).show();
    i3++;
    if(i3 == num3){
      i3 = 0;
    }
    
  }
});


