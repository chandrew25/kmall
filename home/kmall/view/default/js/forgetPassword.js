$(function(){
	/*************登录按钮*************/
	$("#btn_login").click(function(){
		var obj=$(this);
		var form=obj.parents("form:first");
		form.submit();
	});
});
var username_short_number=3;
var username_short="用户名长度不能少于 "+username_short_number+" 个字符";
var username_long_number=15;
var username_long="用户名最长不能多于 "+username_long_number+" 个字符";
var username_invalid="用户名只能是由字母数字以及下划线组成";
var password_short_number=6;
var password_short="密码不能少于 "+password_short_number+" 个字符";
var password_long_number=15;
var password_long="密码不能多于 "+password_long_number+" 个字符";
var password_invalid="密码中不能包含空格";
var confirm_password_invalid="两次输入密码不一致";
var email_invalid="电子邮箱格式有误";
var mobile_invalid="手机号码格式有误";
var validate_invalid="请输入4位验证码";
var agreement="您没有接受条款";
var msg_can="字符合法";
$(function(){
  $("#btnSmsSend").click(function(){
  	  var num = $(this).attr("num");
  	  if (num !="1") {
      	return;
      }
      var username = $("#username").val();
      if (username=="") {
      	$("#message").html("请输入账户");
      	return;
      }
      var smsSendUrlValidate="home/kmall/src/httpdata/checkUsername.php?username="+username;
      $.get(smsSendUrlValidate, function(response){
          if (response==""){
          		$("#message").html("账户错误或未绑定手机号");
          } else {
            	settime();
            	var smsSendUrl="home/kmall/src/httpdata/smsSend.php?mobile="+response;
      			$.get(smsSendUrl);
          }
      });
      
	});
  $("#smsPwd").keyup(function(){
      $("#message").html("");
  });
	$("#smsPwd").blur(function(){
      var smsPwd = $("#smsPwd").val();
      var smsSendUrlValidate="home/kmall/src/httpdata/smsSendValidate.php?smsPwd="+smsPwd;
      $.get(smsSendUrlValidate, function(response){
          if (response=="1"){
            $(".verifyPass").css("display", "table-row");
          } else {
            $("#message").html("输入手机验证码错误！");
          }
      });
  });

	/*************修改密码*************/
	$("#btn_forgetPassword").click(function(){
		var obj=$(this);
		if(checkRegister()){
			var form=obj.parents("form:first");
			form.submit();
		}
	});
	$("#password").blur(checkPassword);
	$("#password").keyup(function(){
		checkIntensity($("#password").val());
	});
	$("#confirm_password").blur(checkConfirm_Password);
	// $("#email").blur(checkEmail);
	$("#mobile").blur(checkMobile);
});
var countdown = 60;
function settime() { 
	var val = $("#btnSmsSend");
	if (countdown == 0) { 
		val.css("background-color","#ff9600"); 
		val.attr("num",1);   
		val.text("发送验证码"); 
		countdown = 60; 
		clearInterval();
	} else { 
		val.css("background-color","#ccc");
		val.text("已发送("+countdown+"秒)"); 
		val.attr("num",2);
		countdown--; 
	} 
	setTimeout(function() { 
		settime() 
	},1000);
}
//检查用户名
function checkUsername(){
	//最小长度
	if($("#username").val().length<username_short_number){
		$("#message").text(username_short);
		return false;
	}
	//最大长度
	if($("#username").val().length>username_long_number){
		$("#message").text(username_long);
		return false;
	}
	//是否由字母数字下划线组成
	var re=/^[\w_]+$/;
	if(!re.test($("#username").val())){
		$("#message").text(username_invalid);
		return false;
	}
	$("#message").text(msg_can);
	return true;
}
//检查密码
function checkPassword(){
	//最小长度
	if($("#password").val().length<password_short_number){
		$("#message").text(password_short);
		return false;
	}
	//最大长度
	if($("#password").val().length>password_long_number){
		$("#message").text(password_long);
		return false;
	}
	//是否包含空格
	var re=/ /;
	if(re.test($("#password").val())){
		$("#message").text(password_invalid);
		return false;
	}
	$("#message").text(msg_can);
	return true;
}
//检查重复密码
function checkConfirm_Password(){
	if(!checkPassword()){
		$("#message").text(password_short);
		return false;
	}
	if($("#confirm_password").val()!=$("#password").val()){
		$("#message").text(confirm_password_invalid);
		return false;
	}
	$("#message").text(msg_can);
	return true;
}
//检查电子邮箱
function checkEmail(){
	if(!Utils.isEmail($("#email").val())){
		$("#message").text(email_invalid);
		return false;
	}
	$("#message").text(msg_can);
	return true;
}
//检查手机号码
function checkMobile(){
	if(!Utils.isPhone($("#mobile").val())){
		$("#message").text(mobile_invalid);
		return false;
	}
	$("#message").text(msg_can);
	return true;
}
//检查验证码
function checkValidate(){
	if($("#validate").val().length!=4){
		$("#message").text(validate_invalid);
		return false;
	}
	$("#message").text(msg_can);
	return true;
}
//检查同意协议
function checkAgree(){
	if(!$("#agree").is(":checked")){
		$("#message").text(agreement);
		return false;
	}
	$("#message").text(msg_can);
	return true;
}
//检查是否能注册
function checkRegister(){
	if(!checkUsername()){
		$("#username").focus();
		return false;
	}
	if(!checkPassword()){
		$("#password").focus();
		return false;
	}
	if(!checkConfirm_Password()){
		$("#confirm_password").focus();
		return false;
	}
	// if(!checkMobile()){
	// 	$("#mobile").focus();
	// 	return false;
	// }
	// if(!checkEmail()){
	// 	$("#email").focus();
	// 	return false;
	// }
	// if(!checkValidate()){
	// 	$("#validate").focus();
	// 	return false;
	// }
	// if(!checkAgree()){
	// 	return false;
	// }
	return true;
}
//检查安全级别
function checkIntensity(pwd){
	var Mcolor = "#FFF",Lcolor = "#FFF",Hcolor = "#FFF";
	var m=0;
	var Modes = 0;
	for (i=0; i<pwd.length; i++){
		var charType = 0;
		var t = pwd.charCodeAt(i);
		if (t>=48 && t <=57)
		{
			charType = 1;
		}
		else if (t>=65 && t <=90)
		{
			charType = 2;
		}
		else if (t>=97 && t <=122)
			charType = 4;
		else
			charType = 4;
		Modes |= charType;
	}
	for (i=0;i<4;i++){
		if (Modes & 1) m++;
		Modes>>>=1;
	}
	if (pwd.length<=4){
		m = 1;
	}
	switch(m){
		case 1 :
			Lcolor = "2px solid red";
			Mcolor = Hcolor = "2px solid #DADADA";
			break;
		case 2 :
			Mcolor = "2px solid #f90";
			Lcolor = Hcolor = "2px solid #DADADA";
			break;
		case 3 :
			Hcolor = "2px solid #3c0";
			Lcolor = Mcolor = "2px solid #DADADA";
			break;
		case 4 :
			Hcolor = "2px solid #3c0";
			Lcolor = Mcolor = "2px solid #DADADA";
			break;
		default :
			Hcolor = Mcolor = Lcolor = "";
			break;
	}
	if (document.getElementById("pwd_lower")){
		document.getElementById("pwd_lower").style.borderBottom = Lcolor;
		document.getElementById("pwd_middle").style.borderBottom = Mcolor;
		document.getElementById("pwd_high").style.borderBottom = Hcolor;
	}
}
