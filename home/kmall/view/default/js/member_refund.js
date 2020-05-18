$(document).ready(function(){
	//查询列表输入提示
	$("#queryText").focus(function(){
		if($("#queryText").val()=="商品名称、商品编号、订单编号"){
			$("#queryText").removeClass("hui_color");
			$("#queryText").val("");
		}
	}).blur(function(){
		if($("#queryText").val()==""){
			$("#queryText").addClass("hui_color");
			$("#queryText").val("商品名称、商品编号、订单编号");
		}
	});
	//提交申请退款
	$("#refundForm").submit(function(){
		$("#refund_orderid_notice").text("");
		$("#refund_name_notice").text("");
		$("#refund_reason_notice").text("");
		var ok=true;
		$("#refund_orderid").val($.trim($("#refund_orderid").val()));
		if($("#refund_orderid").val()==""){
			if(ok)
				$("#refund_orderid").focus();
			$("#refund_orderid_notice").text(refund_orderid_empty);
			ok=false;
		}
		$("#refund_name").val($.trim($("#refund_name").val()));
		if($("#refund_name").val()==""){
			if(ok)
				$("#refund_name").focus();
			$("#refund_name_notice").text(refund_name_empty);
			ok=false;
		}
		$("#refund_reason").val($.trim($("#refund_reason").val()));
		if($("#refund_reason").val()==""){
			if(ok)
				$("#refund_reason").focus();
			$("#refund_reason_notice").text(refund_reason_empty);
			ok=false;
		}
	});
});
//提示信息
var refund_orderid_empty="订单号码不能为空";
var refund_name_empty="申请人姓名不能为空";
var refund_reason_empty="申请原因不能为空";
