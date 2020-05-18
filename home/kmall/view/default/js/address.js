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
	$("form").has("select[name=country]").submit(function(e){
		return checkResults(e);
	});
});
var country_notice="请选择国家";
var province_notice="请选择省份";
var city_notice="请选择城市";
var district_notice="请选择区";
var consignee_notice="（必填）";
var address_notice="（必填）";
var telmobile_empty="（电话，手机必填一项）";
var tel_notice="输入有误";
var sign_building_notice="（必填）";
var email_notice="输入有误";
var zipcode_notice="输入有误";
var mobile_notice="输入有误";
var default_txt="（必填）";
/*检查收货信息*/
function checkResults(e){
	var form=e.target;
	var ok=true;
	var country=$(form.country);
	var province=$(form.province);
	var city=$(form.city);
	var district=$(form.district);
	var consignee=$(form.consignee);
	var address=$(form.address);
	var tel=$(form.tel);
	var mobile=$(form.mobile);
	var sign_building=$(form.sign_building);
	var email=$(form.email);
	var zipcode=$(form.zipcode);
	var mobile=$(form.mobile);
		//必填，默认文本
		district.nextAll("span").removeClass("notice");
		consignee.next("span").removeClass("notice");
		address.next("span").removeClass("notice");
		tel.next("span").removeClass("notice");
		sign_building.next("span").removeClass("notice");
		email.next("span").removeClass("notice");
		district.nextAll("span").text(default_txt);
		consignee.next("span").text(default_txt);
		address.next("span").text(default_txt);
		//tel.next("span").text(default_txt);
		//sign_building.next("span").text(default_txt);
		//email.next("span").text(default_txt);
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
		tel.next("span").addClass("notice");
		tel.next("span").text(telmobile_empty);
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
    /*
	//验证邮件
	if(!Utils.isEmail(email.val())){
		email.next("span").addClass("notice");
		email.next("span").text(email_notice);
		if(ok)email[0].focus();
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