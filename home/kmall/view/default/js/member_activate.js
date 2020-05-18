$(document).ready(function(){
	$("#activate_form").submit(function(){
		var cardno_re=/^\w{16}$/;
		var code_re=/^\w{4}$/;
		$("#activate_cardno_notice").text("");
		if(!cardno_re.test($("#activate_cardno").val())){
			$("#activate_cardno_notice").text(activate_cardno_notice);
			$("#activate_cardno").focus();
			return false;
		}
		$("#validate_code_notice").text("");
		if(!code_re.test($("#validate_code").val())){
			$("#validate_code_notice").text(validate_code_notice);
			$("#validate_code").focus();
			return false;
		}
		return true;
	});
});
var activate_cardno_notice="卡号输入错误";
var validate_code_notice="请输入4位字符";