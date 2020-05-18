$(function(){
    //处理chrome input背景
    if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) {
        $(window).load(function(){
            $('input:-webkit-autofill').each(function(){
                var text = $(this).val();
                var name = $(this).attr('name');
                $(this).after(this.outerHTML).remove();
                $('input[name=' + name + ']').val(text);
            });
        });
    }
	$("a").focus(function(){
		$(this).blur();
	});
	//处理透明图片
	if(window.DD_belatedPNG){
		DD_belatedPNG.fix(".png");
	}
	//表单验证
	$("#loginform_username,#loginform_password,#loginform_vcode").keydown(function(e){
		if(e.keyCode==13){
			$("#btnlogin").click();
		}
	});
	$("#btnlogin").hover(
		function(){
			$(this).addClass("f");
		},function(){
			$(this).removeClass("f");
		}
	).click(function(){
		var ok=true;
		var msg=$("#message");
		msg.html("");
		var loginform_username=$("#loginform_username");
		if(loginform_username.val()==""){
			if(ok){
				ok=false;
				msg.html("请输入用户名");
				loginform_username.focus();
			}
		}
		var loginform_password=$("#loginform_password");
		if(loginform_password.val()==""){
			if(ok){
				ok=false;
				msg.html("请输入密码");
				loginform_password.focus();
			}
		}
		var loginform_vcode=$("#loginform_vcode");
		if(loginform_vcode.val().length<4){
			if(ok){
				ok=false;
				msg.html("请输入4位验证码");
				loginform_vcode.focus();
			}
		}
		if(ok){
			$("#loginform").submit();
		}
	});
	$("#loginform_username").focus();
    $(function(){
        document.onkeydown = function(e){
            var ev = document.all ? window.event : e;
            if(ev.keyCode==13) {
                   $("#loginform").submit();//处理事件
            }
        }
    });   
});
/**
 * 解决IE6 Css样式input[type=submit]兼容性的问题 
 */
/*
$(function() {
	var inputHover = function() { 
		oldBgColor = $(this).css("background-color");
		$(this).css("color","#000");          
		$(this).css("background-color","#FFF");   
		$(this).css("border","1px solid green");  
	};
	var inputUnHover = function() { 
		$(this).css("color","#FFF");          
		if (this.type=="submit"){
			$(this).css("background-color","#000");
		}else{
			$(this).css("background-color","gray");
		}
		$(this).css("border","1px solid gray");
	};
	$(".inputNormal,.inputVerify,.btnSubmit").focusin(inputHover);
	$(".inputNormal,.inputVerify,.btnSubmit").focusout(inputUnHover);    
	$(".inputNormal,.inputVerify,.btnSubmit").hover(inputHover,inputUnHover);           
});
*/