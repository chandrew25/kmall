$(document).ready(function(){
	//更改下拉列表时更改
	$("select[name=country]").change(function(){
		region.changed(this, 1, $(this).nextAll("select")[0].id);
	});
	$("select[name=province]").change(function(){
		region.changed(this, 2, $(this).nextAll("select")[0].id);
	});
	$("select[name=city]").change(function(){
		region.changed(this, 3, $(this).nextAll("select")[0].id);
	});
    
    /*保存收货地址*/
	$("#checkaddress").click(function(){ 
        var act = checkResults();
        if(act&&emailuse){
            $("#email_confirm").text($("#email_check").val());
            $("#name_confirm").text($("#consignee_check").val());
            var area =$("#country_check").find("option:selected").text()+" "+$("#province").find("option:selected").text()+" "+$("#city").find("option:selected").text()+" "+$("#district").find("option:selected").text();
            $("#area_confirm").text(area);
            var zipcode = $("#zipcode_chech").val(); 
            if(!zipcode){
                zipcode = "-";
            }
            $("#code_confirm").text(zipcode);
            $("#address_confirm").text($("#address_check").val());
            $("#tel_confirm").text($("#tel_check").val());
            $("#phone_confirm").text($("#mobile_check").val());
            $("#member_info").slideToggle("slow",function(){
                $("#member_info_detail").slideDown("slow");
            });
            $("#member_info_detail").attr("item","1");    
        }else{ 
            return false;
        }
	});
    /*返回修改*/
    $("#backaddress").click(function(){
        $("#member_info_detail").slideToggle("slow",function(){
            $("#member_info").slideDown("slow");
        });
        $("#member_info_detail").attr("item","0");
        return checkResults();
    });
    
    $("#email_check").blur(function(){ 
        if(!Utils.isEmail($(this).val())){
            $(this).next("span").addClass("notice");
            $(this).next("span").text(email_notice);
            $("#mail_fail").show();
            $("#mail_ok").hide();
        }else{
            checkEmail();
            $("#mail_user").text($(this).val());
            $("#mail_fail").hide();
            $("#mail_ok").show(); 
        }
    })
});
var emailuse=false;//邮箱被使用
var country_notice=" 请选择国家";
var province_notice=" 请选择省份";
var city_notice=" 请选择城市";
var district_notice=" 请选择区";
var consignee_notice="（必填）";
var address_notice="（必填）";
var telmobile_empty="（电话，手机必填一项）";
var tel_notice=" 输入有误";
var sign_building_notice="（必填）";
var email_notice=" 邮箱格式有误";
var emailre_notice=" 该邮箱已经被使用!";
var zipcode_notice=" 输入有误";
var mobile_notice=" 输入有误";
var default_txt="（必填）";
/*检查收货信息*/
function checkResults(){
	var ok=true;
	var country=$("#country_check");
	var province=$("#province");
	var city=$("#city");
	var district=$("#district");
	var consignee=$("#consignee_check");
	var address=$("#address_check");
	var tel=$("#tel_check");
	var mobile=$("#mobile_check");
	var sign_building=$("#sign_building_check");
	var email=$("#email_check");
	var zipcode=$("#zipcode_chech");
	//必填，默认文本
	district.nextAll("span").removeClass("notice");
	consignee.next("span").removeClass("notice");
	address.next("span").removeClass("notice");
	tel.next("span").removeClass("notice");
	sign_building.next("span").removeClass("notice");
	district.nextAll("span").text(default_txt);
	consignee.next("span").text(default_txt);
	address.next("span").text(default_txt);
	tel.next("span").text("");
	//sign_building.next("span").text(default_txt);
	zipcode.next("span").text("");
	mobile.next("span").text("");
	if(district.val()==0){
		district.nextAll("span").addClass("notice");
		district.nextAll("span").text(district_notice);
		if(ok)district[0].focus();
		ok=false;
	}
	if(city.val()==0){
		city.nextAll("span").addClass("notice");
		city.nextAll("span").text(city_notice);
		if(ok)city[0].focus();
		ok=false;
	}
	if(province.val()==0){
		province.nextAll("span").addClass("notice");
		province.nextAll("span").text(province_notice);
		if(ok)province[0].focus();
		ok=false;
	}
	if(country.val()==0){
		country.nextAll("span").addClass("notice");
		country.nextAll("span").text(country_notice);
		if(ok)country[0].focus();
		ok=false;
	}
	if(consignee.val()==""){
		consignee.next("span").addClass("notice");
		consignee.next("span").text(consignee_notice);
		if(ok)consignee[0].focus();
		ok=false;
	}
	//验证详细地址
	if(address.val()==""){
		address.next("span").addClass("notice");
		address.next("span").text(address_notice);
		if(ok)address[0].focus();
		ok=false;
	}
	if(tel.val()==""&&mobile.val()==""){
		mobile.next("span").addClass("notice");
		mobile.next("span").text(telmobile_empty);
		mobile.focus();
		ok=false;
	}else{
		//验证电话
		if(tel.val()!=""&&!Utils.isTel(tel.val())){
			tel.next("span").addClass("notice");
			tel.next("span").text(tel_notice);
			if(ok)tel[0].focus();
			ok=false;
		}
		//验证手机
		if(mobile.val()!=""&&!Utils.isPhone(mobile.val())){
			mobile.next("span").addClass("notice");
			mobile.next("span").text(mobile_notice);
			if(ok)mobile[0].focus();
			ok=false;
		}
	}
	/*
	//验证标志性建筑
	if(sign_building.val()==""){
		sign_building.next("span").addClass("notice");
		sign_building.next("span").text(sign_building_notice);
		if(ok)sign_building[0].focus();
		ok=false;
	}
	*/

	//验证邮政编码
	if(zipcode.val()!=""&&!Utils.isPostCode(zipcode.val())){
		zipcode.next("span").addClass("notice");
		zipcode.next("span").text(zipcode_notice);
		if(ok)zipcode[0].focus();
		ok=false;
	}
	return ok;
}

function checkEmail(){
    emailuse=false; 
    var email=$("#email_check");
    ok=true;  
    //经过js验证并且该用户名可以使用才会执行ajax请求
    if(Utils.isEmail(email.val())){
        var data="email="+email.val();
        var url=$("#url_base").val()+"index.php?go=kmall.ajax.emailregister";
        $.post(url,data,function(result){
            if(result.status==0){
                email.next("span").addClass("notice");
                email.next("span").removeClass("success");
                email.next("span").text(emailre_notice);
                ok=false;
            }else{
                email.next("span").removeClass("notice");
                email.next("span").addClass("success");
                email.next("span").text(" 邮箱可以使用！");
                emailuse=true;   
            }
        },"json");
    }
    return ok;
}