//验证提示信息
var company_empty="单位名称不能为空";
var taxpayer_empty="纳税人识别号不能为空";
var reg_address_empty="注册地址不能为空";
var reg_tel_empty="注册电话不能为空";
var bank_empty="开户银行不能为空";
var bank_account_empty="银行账户不能为空";
$(document).ready(function(){
	//点击发票信息修改
	$("#invoice_update").click(function(){
		if($("#invoice_update").text()!="修改发票"){
			if($("#invoice_wrapper").is(":hidden")){
				$("#invoice_wrapper").slideDown(300);
				$("#invoice_update").text("取消发票");
			}else{
				$("#invoice_wrapper").slideUp(300);
				$("#invoice_update").text("添加发票");
			}
			return;
		}
		//把文本信息改为文本框输入
		$(".show").hide();
		$("#invoice label,.edit").show();
		$("#invoice input[type=text]").each(function(){
			$(this).prev().hide();
		});
		$("#invoice input").show();
		$("#invoice input[name=invoice_type]:checked").click();
	});
	//点击发票类型
	$("#invoice label:has(input[name=invoice_type])").click(function(){
		var input=$(this).find("input");
		input.attr("checked","checked");
		$("#invoice tr[class^=type]").hide();
		$(".type"+input.val()).show();
	});
	//默认点击普通发票类型
	$("#invoice label:has(input[name=invoice_type][value=1])").click();
	//点击发票抬头
	$("#invoice label:has(input[name=invoice_head])").click(function(){
		$(this).find("input").attr("checked","checked");
		$("#invoice_name_txt").text($(this).text());
	});
	//点击确认发票信息
	$("#invoiceok").click(function(){
		//选择普通发票
		var ok=invoiceCheck();
		if(!ok)return;
		$("#invoice_update").text("修改发票");
		//文本输入框改为显示文本
		$("#invoice label").each(function(){
			if($(this).is(":visible"))
				if($(this).find("input:checked").length==0)
					$(this).hide();
		});
		$("#invoice input[type=text]").each(function(){
			$(this).prev().show().text($(this).val());
		});
		$("#invoice_update,.show").show();
		$("#invoice input,.edit").hide();
	});
	//提交订单
	//订单提交中标识
    var isubmit=false;
    $("#order_submit").click(function(){
        if(isubmit){
            return
        }
        var ok=true;
        //检查是否选择支付平台
        if(!checkbank()){
            alert('请先选择网上支付的支付平台或支付银行!谢谢！');
            return false;
        }
		if($("#invoice_wrapper").is(":visible")){
			return invoiceCheck();
		}
        if($("#member_info_detail").attr("item")==0){
            alert("请先保存个人信息!");
            $("html,body").animate({scrollTop:$("#member_info").offset().top},1000);
            return false;
        }
        if(ok){
            isubmit=true;
            $("#checkoverForm").submit();
        }
	});
	/*********选择支付类型*********/
	//设置可以拖动标题栏移动
	canmove($("#paytitle"),$("#paytype_show"));
	//设置弹出框背景层大小，并且大小随窗口大小改变而改变
	$("#paytypebg").width($(document).width()).height($(document).height());
	$(window).resize(function(){
		$("#paytypebg").width($(document).width()).height($(document).height());
	});
 
     
     //显示弹出框
	$(".ptypeinput[to],.ptypeimg[to]").click(function(){
        var to=$(this).attr("to");
        var input=$(this).parents("tr:first").find(":radio");
        var paytype=$("._paytype[to="+to+"]");
        paytype.css("left",input.offset().left+220).css("top",input.offset().top-paytype.outerHeight()/2);
        paytype.fadeIn(200);
        paytype.find(".paylist input[checked=checked]").click();
        $("#paytypebg").fadeIn(200);
	});
    
/**************************只提供支付宝**********************************/  
    /*选中支付宝
    var _type=$("input[name=ptype][value=3]"); 
    _type.click(function(){
        $("#payment_id").val(2);   
    }); */
    
/************************************************************/ 
    
	//关闭弹出框
	$("#paytitleclose,#payok").click(function(){
		$("#paytypebg,#paytype_show").fadeOut(200);
	});
	//选中支付类型
	$("._paytype .paylist li").click(function(){
        var paytype=$(this).parents("._paytype:first");
        if($(this).parent().is(".plist")){//显示子类型
            var index=$(this).index();
            paytype.find(".clist").hide().eq(index).show();
        }
        paytype.find(".paylist li").removeClass("paylist_lifocus");
        paytype.find(".paylist li :radio").removeAttr("checked");
        $(this).addClass("paylist_lifocus").find(":radio").attr("checked","checked");
        var input=$(".ptypeinput[to="+paytype.attr("to")+"]");
        //显示单选按钮后面的图片
        input.parent().next().find("img:last").attr("src",$(this).find("img").attr("src")).css({visibility:"visible"});
        //取得图片名称
        var src=$(this).find("img").attr("src");
        src=src.substring(src.lastIndexOf("/")+1);
        $("#banksrc").val(src);
        $("#bankcode").val($(this).find(":radio").val());
	});
    
    //屏蔽购物车hover事件
    $(".cart").unbind("hover");

});
//发票验证
function invoiceCheck(){
	var ok=true;
	if($(".type1:visible").length>0){
		$("#invoice_name_notice").text("");
		$("#invoice_name").val($.trim($("#invoice_name").val()));
		if($("#invoice_name").val()==""){
			if(ok)
				$("#invoice_name").focus();
			$("#invoice_name_notice").text($("#invoice_name_txt").text()+"名称不能为空");
			ok=false;
		};
	//选择商业零售发票
	}else if($(".type2:visible").length>0){
		$("#company_notice").text("");
		$("#taxpayer_notice").text("");
		$("#reg_address_notice").text("");
		$("#reg_tel_notice").text("");
		$("#bank_notice").text("");
		$("#bank_account_notice").text("");
		$("#company").val($.trim($("#company").val()));
		if($("#company").val()==""){
			if(ok)
				$("#company").focus();
			$("#company_notice").text(company_empty);
			ok=false;
		}
		$("#taxpayer").val($.trim($("#taxpayer").val()));
		if($("#taxpayer").val()==""){
			if(ok)
				$("#taxpayer").focus();
			$("#taxpayer_notice").text(taxpayer_empty);
			ok=false;
		}
		$("#reg_address").val($.trim($("#reg_address").val()));
		if($("#reg_address").val()==""){
			if(ok)
				$("#reg_address").focus();
			$("#reg_address_notice").text(reg_address_empty);
			ok=false;
		}
		$("#reg_tel").val($.trim($("#reg_tel").val()));
		if($("#reg_tel").val()==""){
			if(ok)
				$("#reg_tel").focus();
			$("#reg_tel_notice").text(reg_tel_empty);
			ok=false;
		}
		$("#bank").val($.trim($("#bank").val()));
		if($("#bank").val()==""){
			if(ok)
				$("#bank").focus();
			$("#bank_notice").text(bank_empty);
			ok=false;
		}
		$("#bank_account").val($.trim($("#bank_account").val()));
		if($("#bank_account").val()==""){
			if(ok)
				$("#bank_account").focus();
			$("#bank_account_notice").text(bank_account_empty);
			ok=false;
		}
	}
	return ok;
}
/*********封装了可以移动的功能(title:要拖动的对象，wrapper：要移动的对象)*********/
function canmove(title,wrapper){
	var mpos=null,wpos=null,ismove=false;
	$(title).mousedown(function(e){
		if(e.which!=1)return;
		ismove=true;
		$(title).css("cursor","move");
		mpos={left:e.pageX,top:e.pageY};
		wpos={left:$(wrapper).css("left").trimpx(),top:$(wrapper).css("top").trimpx()};
	}).mouseup(function(){
		ismove=false;
		$(title).css("cursor","default");
	}).mouseout(function(){
		ismove=false;
		$(title).css("cursor","default");
	}).mousemove(function(e){
		if(ismove){
			var pos={left:(wpos.left+e.pageX-mpos.left),top:(wpos.top+e.pageY-mpos.top)};
			//弹出框不超过窗口四周
			if(pos.left<0)
				$(wrapper).css("left",0);
			else if(pos.left>$(document).width()-$(wrapper).outerWidth())
				$(wrapper).css("left",$(document).width()-$(wrapper).outerWidth());
			else
				$(wrapper).css("left",pos.left);
			if(pos.top<0)
				$(wrapper).css("top",0);
			else if(pos.top>$(document).height()-$(wrapper).outerHeight())
				$(wrapper).css("top",$(document).height()-$(wrapper).outerHeight());
			else
				$(wrapper).css("top",pos.top);
		}
	});
}
String.prototype.trimpx=function(){
	var r=parseInt(this.replace("px",""));
	if(isNaN(r))return 0;
	return r;
}
//网上支付的判断
function checkbank(){
    if($(".ptypeinput:checked").attr("to")=="bank"){
        if($("#bankcode").val()){
            return true;
        }
        return false;
    }
    return true;
}