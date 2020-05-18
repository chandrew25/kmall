$(document).ready(function(){
	var timer;
	var bTotal = $('.banner_item').length;
	var bTime1 = 3000;
	var bTime2 = 1000;
	var bNum = 0;

	function show() {
		clearInterval(timer);
		$('.banner_item').eq(bNum).fadeIn(bTime2).siblings(".banner_item").fadeOut(bTime2);
		$('.btn_item').eq(bNum).addClass('on_btn_item').siblings(".btn_item").removeClass('on_btn_item');
		bNum++;
		if(bNum == bTotal) {
			bNum = 0;
		}
		timer = setInterval(show, bTime1);
	}
	show();
	$(".btn_item").hover(function() {
		bNum = $(this).index();
		show();
	});

	$('.allBrand_filter_letters a').on('click',function(){
		$(this).addClass('active').siblings().removeClass('active')
	});

	//活动轮播
var _now = 0;
var oul = $(".myslidetwo");
var numl = $(".label li");
var wid = $(".myslide").eq(0).width();
//数字图标实现
numl.click(function() {
		var index = $(this).index();
		$(this).addClass("current").siblings().removeClass();
		oul.animate({
			'left': -wid * index
		}, 500);
	})
	//左右箭头轮播
	$(".pre").click(function() {
		if(_now >= 1) _now--;
		else _now = 3;
		ani();
	});
	$(".next").click(function() {
		if(_now == numl.size() - 1) {
			_now = 0;
		} else _now++;
		ani();
	});
	//动画函数
	function ani() {
		numl.eq(_now).addClass("current").siblings().removeClass();
		oul.animate({
			'left': -wid * _now
		}, 500);
	}
	//以下代码如果不需要自动轮播可删除
	//自动动画
	var _interval = setInterval(showTime, 2000);

	function showTime() {
		if(_now == numl.size() - 1) {
			_now = 0;
		} else _now++;
		ani();
	}
	//鼠标停留在画面时停止自动动画，离开恢复
	$(".myslide").mouseover(function() {
		clearTimeout(_interval);
	});
	$(".myslide").mouseout(function() {
		_interval = setInterval(showTime, 2000);
	});

});	