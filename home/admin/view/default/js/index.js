$(function(){
	/*************链接美观*************/
	$("a").focus(function(){
		$(this).blur();
	});
	/*************处理png图片在IE6下的透明问题*************/
	if(window.DD_belatedPNG){
		DD_belatedPNG.fix(".png");
	}
	/*************按钮效果*************/
	$("#header .btn,#contract,#imglist .btn:not(.un)").hover(
		function(){
			$(this).addClass("f");
		},
		function(){
			$(this).removeClass("f");
		}
	);
	/*************收缩条*************/
	$("#contract").click(function(){
		var header=$("#deskheader");
		var mcon=$("#mcon");
		var ico=$(this).find(".i");
		if(header.is(":visible")){
			ico.addClass("b").removeClass("t");
			header.hide();
			mcon.css("height",mcon.height()+header.height());
		}else{
			ico.addClass("t").removeClass("b");
			header.show();
			mcon.css("height",mcon.height()-header.height());
		}
		$("#imglist").css("marginTop",($("#mcon").height()-$("#mctop").height()-$("#imglist").height())/2);
	});
	//$("#imglist").css("marginTop",($("#mcon").height()-$("#mctop").height()-$("#imglist").height())/2);
	/*************内容切换*************/
	$("#txtlist li").mouseenter(function(){
		var the=$(this);
		var txtlist=$("#txtlist");
		txtlist.find("li").removeClass("f");
		the.addClass("f");
		var imglist=$("#imglist");
		var width=imglist.find("li:eq(0)").width();
		var index=txtlist.find("li").index(the);
		imglist.stop().animate({marginLeft:0-index*width},500);
	});
});