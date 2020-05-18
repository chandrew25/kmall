$(function(){
	//关闭窗口
	$("#pwdfindclose").click(function(){
		window.close();
	});
	//提交表单
	$("#mformbtn").click(function(){
		var form=$(this).parents("form:first");
		var pwd=form.find("input[name=password]");
		var pwd_notice=pwd.parent().siblings(".fnotice");
		pwd_notice.html("");
		if(pwd.val().length<6||pwd.val().length>16){
			pwd_notice.html("请输入6-20位密码");
			pwd.focus();
			return;
		}
		var pwdf=form.find("input[name=pwdconfirm]");
		var pwdf_notice=pwdf.parent().siblings(".fnotice");
		pwdf_notice.html("");
		if(pwdf.val() != pwd.val()){
			pwdf_notice.html("两次输入的密码不同");
			pwdf.focus();
			return;
		}
		form.submit();
	});
});