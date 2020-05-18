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
    /*保存信息*/
    $("#checkaddress").click(function(){ 
        var act = checkResults();
        if(act){
            $("#name_confirm").text($("#consignee_check").val());
            var area =$("#country_check").find("option:selected").text()+" "+$("#province").find("option:selected").text()+" "+$("#city").find("option:selected").text()+" "+$("#district").find("option:selected").text();
            $("#area_confirm").text(area);
            var zipcode = $("#zipcode_chech").val(); 
            if(!zipcode){
                zipcode = "-";
            }
            var email = $("#email_check").val();
            if(!email){
                email = "-";
            }
			var remark = $("#remark_check").val();
			if(!remark){
				remark = "-";
			}
            $("#email_confirm").text(email);             
            $("#code_confirm").text(zipcode);
            $("#remark_confirm").text(remark);			
            $("#address_confirm").text($("#address_check").val());
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
    
    //提交订单
    //订单提交中标识
    var isubmit=false;
    $("#order_submit").click(function(){
        if(isubmit){
            return
        }
        var ok=true;
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
});
var country_notice="（请选择国家）";
var province_notice="（请选择省份）";
var city_notice="（请选择城市";
var district_notice="（请选择区）";
var must_notice="（必填）";
var error_notice="（输入有误）";
var zipcode_notice="（邮编输入有误）";
var email_notice="（邮箱格式有误）";
var phone_notice="（请输入正确格式的手机号码）";
var consignee_notice=" (请输入详细的收货地址)";
var legal_notice=" (请输入合法的信息)";
/*检查收货信息*/
function checkResults(){
    var ok=true;
    var country=$("#country_check");
    var province=$("#province");
    var city=$("#city");
    var district=$("#district");
    var consignee=$("#consignee_check");
    var address=$("#address_check");
    var mobile=$("#mobile_check");
    var email=$("#email_check");
    var zipcode=$("#zipcode_chech");
	var remark=$("#remark_check");
    //必填，默认文本
    district.nextAll("span").removeClass("notice");
    consignee.next("span").removeClass("notice");
    address.next("span").removeClass("notice");
    email.next("span").removeClass("notice");
    district.nextAll("span").text("");
    consignee.next("span").text("");
    address.next("span").text("");
    email.next("span").text("");
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
    if($.trim(email.val())!="" && !Utils.isEmail(email.val())){
        email.next("span").addClass("notice");
        email.next("span").text(email_notice);
        if(ok)email[0].focus();
        ok=false;
    }
    if(consignee.val()==""){
        consignee.next("span").addClass("notice");
        consignee.next("span").text(must_notice);
        if(ok)consignee[0].focus();
        ok=false;
    }
    //验证详细地址
    if(address.val()==""||!AntiSqlValid(address)){
        address.next("span").addClass("notice");
        address.next("span").text(consignee_notice);
        if(ok)address[0].focus();
        ok=false;
    }
    //验证备注信息
    if(!AntiSqlValid(remark)){
        remark.next("span").addClass("notice");
        remark.next("span").text(legal_notice);
        if(ok)remark[0].focus();
        ok=false;
    }
    //验证手机
    if(!Utils.isPhone(mobile.val())){
        mobile.next("span").addClass("notice");
        mobile.next("span").text(phone_notice);
        if(ok)mobile[0].focus();
        ok=false;
    }
    //验证邮政编码
    if(zipcode.val()!=""&&!Utils.isPostCode(zipcode.val())){
        zipcode.next("span").addClass("notice");
        zipcode.next("span").text(error_notice);
        if(ok)zipcode[0].focus();
        ok=false;
    }
    return ok;
}