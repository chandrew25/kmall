$(document).ready(function(){
	$("#infoForm").submit(function(){
		var ok=true;
		$("#realname_notice").text("*");
		if(!Utils.isName($("#realname").val())){
			if(ok)$("#realname")[0].focus();
			$("#realname_notice").text(realname_notice);
			ok=false;
		}
		$("#mobile_notice").text("*");
		if(!Utils.isPhone($("#mobile").val())){
			if(ok)$("#mobile")[0].focus();
			$("#mobile_notice").text(mobile_notice);
			ok=false;
		}
		$("#email_notice").text("");
		if($("#email").val()!=""&&!Utils.isEmail($("#email").val())){
			if(ok)$("#email")[0].focus();
			$("#email_notice").text(email_notice);
			ok=false;
		}
		$("#com_name_notice").text("*");
		if(!Utils.isComName($("#com_name").val())){
			if(ok)$("#com_name")[0].focus();
			$("#com_name_notice").text(com_name_notice);
			ok=false;
		}
		$("#com_mcode_notice").text("");
		if($("#com_mcode").val()!=""&&!Utils.isPostCode($("#com_mcode").val())){
			if(ok)$("#com_mcode")[0].focus();
			$("#com_mcode_notice").text(com_mcode_notice);
			ok=false;
		}
		$("#com_tel_notice").removeClass("notice").text("(电话和传真二者选一)");
		$("#com_fax_notice").removeClass("notice").text("(电话和传真二者选一)");
		if($("#com_tel").val()==""&&$("#com_fax").val()==""){
			if(ok)$("#com_tel")[0].focus();
			$("#com_tel_notice").addClass("notice").text("(电话和传真二者选一)");
			$("#com_fax_notice").addClass("notice").text("(电话和传真二者选一)");
			ok=false;
		}
		if($("#com_tel").val()!=""&&!Utils.isTel($("#com_tel").val())){
			if(ok)$("#com_tel")[0].focus();
			$("#com_tel_notice").addClass("notice").text(com_tel_notice);
			ok=false;
		}
		if($("#com_fax").val()!=""&&!Utils.isFax($("#com_fax").val())){
			if(ok)$("#com_fax")[0].focus();
			$("#com_fax_notice").addClass("notice").text(com_fax_notice);
			ok=false;
		}
		$("#com_welfare_notice").text("*");
		var chks=$("input[name^=com_welfare]");
		for(var i=0;i<chks.length;i++)
			if(chks[i].checked)
				break;
		if(i==chks.length){
			$("#com_welfare_notice").text(com_welfare_notice);
			ok=false;
		}
		return ok;
	});
});
var realname_notice="请输入合法的姓名";
var mobile_notice="请输入合法的手机号码";
var email_notice="请输入合法的电子邮箱";
var com_name_notice="请输入公司名称";
var com_mcode_notice="请输入正确的邮编";
var com_tel_fax_empty="(电话和传真二者选一)";
var com_tel_notice="请输入合法的联系电话";
var com_fax_notice="请输入合法的传真";
var com_welfare_notice="至少选择一项";
