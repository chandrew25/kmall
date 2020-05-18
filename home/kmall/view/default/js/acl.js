/* 用户点击“已阅读并接受用户协议”后才可点击“立即注册” */
/* Written by Linghao (linghao@xun-ao.com). */
$(document).ready(function(){

	//用户点击了“已阅读”的复选框区域
	$("#is_read").click(function(){
		
		//如果此复选框为选中的状态
		if($("#agreement_submit").attr("checked")=="checked"){
			//将“立即注册”按钮变为可点击的状态
			$("#register_submit").prop({disabled:false});
			//将“立即注册”按钮变为激活色
			$("#register_submit").removeClass('register_submit_disabled');
			$("#register_submit").addClass('register_submit_abled');
			
		}
		
		//如果此复选框为未选中的状态
		else{
			
			//将“立即注册”按钮变为不可点击的状态
			$("#register_submit").prop({disabled:true});
			//将“立即注册”按钮变为非激活色
			$("#register_submit").removeClass('register_submit_abled');
			$("#register_submit").addClass('register_submit_disabled');
			
		}

	});
	
});	
/* Chinese initialisation for the jQuery UI date picker plugin. */
/* Written by Cloudream (cloudream@gmail.com). */
 jQuery(function($){
		$.datepicker.regional['zh-CN'] = {
				closeText: '关闭',
				prevText: '&#x3c;上月',
				nextText: '下月&#x3e;',
				currentText: '今天',
				monthNames: ['一月','二月','三月','四月','五月','六月',
				'七月','八月','九月','十月','十一月','十二月'],
				monthNamesShort: ['一','二','三','四','五','六',
				'七','八','九','十','十一','十二'],
				dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
				dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
				dayNamesMin: ['日','一','二','三','四','五','六'],
				weekHeader: '周',
				dateFormat: 'yy-mm-dd',
				firstDay: 1,
				isRTL: false,
				showMonthAfterYear: true,    
				yearSuffix: '年'};
		$.datepicker.setDefaults($.datepicker.regional['zh-CN']);
});
$(function() {
   $("#birthday").datepicker({
	   showMonthAfterYear: true,
	   changeMonth: true,    
	   changeYear: true,
	   buttonImageOnly: true,
//       minDate: '-1y', maxDate: '+2y',  
	   dateFormat: 'yy-mm-dd', 
	   weekHeader: '周',
	   yearRange: 'c-70:c'
//       onSelect: function(dateText, inst) {
		   //alert('ee');    
//       }
   });
});
var process_request = "正在处理您的请求...";
var username_empty = "- 用户名不能为空。";
var username_shorter = "- 用户名长度不能少于 3 个字符。";
var username_invalid = "- 用户名只能是由字母数字以及下划线组成。";
var password_empty = "- 登录密码不能为空。";
var password_shorter = "- 登录密码不能少于 6 个字符。";
var confirm_password_invalid = "- 两次输入密码不一致";
var email_empty = "- Email 为空";
var email_invalid = "- Email 不是合法的地址";
var agreement = "- 您没有接受协议";
var msn_invalid = "- msn地址不是一个有效的邮件地址";
var qq_invalid = "- QQ号码不是一个有效的号码";
var home_phone_invalid = "- 家庭电话不是一个有效号码";
var office_phone_invalid = "- 办公电话不是一个有效号码";
var mobile_phone_invalid = "- 手机号码不是一个有效号码";
var msg_un_blank = "* 用户名不能为空";
var msg_un_length = "* 用户名最长不得超过7个汉字";
var msg_un_format = "* 用户名含有非法字符";
var msg_un_registered = "* 用户名已经存在,请重新输入";
var msg_can_rg = "* 可以注册";
var msg_email_blank = "* 邮件地址不能为空";
var msg_email_registered = "* 邮箱已存在,请重新输入";
var msg_email_format = "* 邮件地址不合法";
var msg_blank = "不能为空";
var no_select_question = "- 您没有完成密码提示问题的操作";
var passwd_balnk = "- 密码中不能包含空格";
var username_exist = "用户名 %s 已经存在";

function chkstr(str)
{
  for (var i = 0; i < str.length; i++)
  {
	if (str.charCodeAt(i) < 127 && !str.substr(i,1).match(/^\w+$/ig))
	{
	  return false;
	}
  }
  return true;
}

function is_registered( username )
{
	var submit_disabled = false;
	var unlen = username.replace(/[^\x00-\xff]/g, "**").length;

	if ( username == '' )
	{
		document.getElementById('username_notice').innerHTML = msg_un_blank;
		var submit_disabled = true;
	}

	if ( !chkstr( username ) )
	{
		document.getElementById('username_notice').innerHTML = msg_un_format;
		var submit_disabled = true;
	}
	if ( unlen < 3 )
	{ 
		document.getElementById('username_notice').innerHTML = username_shorter;
		var submit_disabled = true;
	}
	if ( unlen > 14 )
	{
		document.getElementById('username_notice').innerHTML = msg_un_length;
		var submit_disabled = true;
	}
	if ( submit_disabled )
	{
	   // document.forms['formUser'].elements['Submit'].disabled = 'disabled';
		return false;
	}
	document.getElementById('username_notice').innerHTML=msg_can_rg;
	return true;                                                                                                       
}


function checkIntensity(pwd)
{
	var Mcolor = "#FFF",Lcolor = "#FFF",Hcolor = "#FFF";
	var m=0;
	var Modes = 0;
	for (i=0; i<pwd.length; i++)
	{
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
	for (i=0;i<4;i++)
	{
		if (Modes & 1) m++;
		Modes>>>=1;
	}
	if (pwd.length<=4)
	{
		m = 1;
	}
	switch(m)
	{
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
	if (document.getElementById("pwd_lower"))
	{
		document.getElementById("pwd_lower").style.borderBottom = Lcolor;
		document.getElementById("pwd_middle").style.borderBottom = Mcolor;
		document.getElementById("pwd_high").style.borderBottom = Hcolor;
	}
}

function check_password( password )
{
	if ( password.length < 6 )
	{
		document.getElementById('password_notice').innerHTML = password_shorter;
	}
	else
	{
		document.getElementById('password_notice').innerHTML = msg_can_rg;
	}
}

function check_conform_password( conform_password )
{
	password = document.getElementById('password1').value;
	if ( conform_password.length < 6 )
	{
		document.getElementById('conform_password_notice').innerHTML = password_shorter;
		return false;
	}
	if ( conform_password != password )
	{
		document.getElementById('conform_password_notice').innerHTML = confirm_password_invalid;
	}
	else
	{
		document.getElementById('conform_password_notice').innerHTML = msg_can_rg;
	}
}  
			  
/* *
 * 处理注册用户
 */
function register()
{   
  var frm  = document.forms['formUser'];	
  var username  = Utils.trim(frm.elements['username'].value);
  var realname  = Utils.trim(frm.elements['realname'].value);
  var email  = frm.elements['email'].value;	
  var password  = Utils.trim(frm.elements['password'].value);	
  var confirm_password = Utils.trim(frm.elements['confirm_password'].value);
  var checked_agreement = frm.elements['agreement'].checked;
  if(checked_agreement != true)
  {
	alert(agreement);
	return false;
  }
 // var msn = frm.elements['extend_field1'] ? Utils.trim(frm.elements['extend_field1'].value) : '';
  //var qq = frm.elements['extend_field2'] ? Utils.trim(frm.elements['extend_field2'].value) : '';
 // var home_phone = frm.elements['extend_field4'] ? Utils.trim(frm.elements['extend_field4'].value) : '';
 // var office_phone = frm.elements['extend_field3'] ? Utils.trim(frm.elements['extend_field3'].value) : '';
 
  var mobile_phone = frm.elements['mobilephone'] ? Utils.trim(frm.elements['mobilephone'].value) : '';
 // var passwd_answer = frm.elements['passwd_answer'] ? Utils.trim(frm.elements['passwd_answer'].value) : '';
 // var sel_question =  frm.elements['sel_question'] ? Utils.trim(frm.elements['sel_question'].value) : '';

  
  var msg = "";
  // 检查输入
  var msg = '';
  if (username.length == 0)
  {
	msg += username_empty + '\n';
	alert(msg);
	return false;
  }
  else if (username.match(/^\s*$|^c:\\con\\con$|[%,\'\*\"\s\t\<\>\&\\]/))
  {
	msg += username_invalid + '\n';
  }
  else if (username.length < 3)
  {
	//msg += username_shorter + '\n';
  }

  if (email.length == 0)
  {
	msg += email_empty + '\n';
  }
  else
  {
	if ( ! (Utils.isEmail(email)))
	{
	  msg += email_invalid + '\n';
	}
  }
  if (password.length == 0)
  {
	msg += password_empty + '\n';
  }
  else if (password.length < 6)
  {
	msg += password_shorter + '\n';
  }
  if (/ /.test(password) == true)
  {
	msg += passwd_balnk + '\n';
  }
  if (confirm_password != password )
  {
	msg += confirm_password_invalid + '\n';
  }
 /* if(checked_agreement != true)
  {
	msg += agreement + '\n';
  }*/

  /*if (msn.length > 0 && (!Utils.isEmail(msn)))
  {
	msg += msn_invalid + '\n';
  }*/

  /*if (qq.length > 0 && (!Utils.isNumber(qq)))
  {
	msg += qq_invalid + '\n';
  }*/

  /*  if (office_phone.length>0)
  {
	var reg = /^[\d|\-|\s]+$/;
	if (!reg.test(office_phone))
	{
	  msg += office_phone_invalid + '\n';
	}
  }*/
  /*if (home_phone.length>0)
  {
	var reg = /^[\d|\-|\s]+$/;

	if (!reg.test(home_phone))
	{
	  msg += home_phone_invalid + '\n';
	}
  }*/
  if (mobile_phone.length>0)
  {
	var reg = /^[\d|\-|\s]+$/;
	if (!reg.test(mobile_phone))
	{
	  msg += mobile_phone_invalid + '\n';
	}
  }
  
/*  if (passwd_answer.length > 0 && sel_question == 0 || document.getElementById('passwd_quesetion') && passwd_answer.length == 0)
  {
	msg += no_select_question + '\n';
  }*/

  for (i = 4; i < frm.elements.length - 4; i++)	// 从第五项开始循环检查是否为必填项
  {
	needinput = document.getElementById(frm.elements[i].name + 'i') ? document.getElementById(frm.elements[i].name + 'i') : '';

	if (needinput != '' && frm.elements[i].value.length == 0)
	{
	  msg += '- ' + needinput.innerHTML + msg_blank + '\n';
	}
  }

  if (msg.length > 0)
  {
	alert(msg);
	return false;
  }
  else
  {
	return true;
  }
}