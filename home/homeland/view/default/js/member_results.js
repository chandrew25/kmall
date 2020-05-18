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
    //确认修改
    $(".bc").click(function(e){
        checkResults(e);
    });
    //新增收货地址
    $(".add_bc").click(function(e){
        checkResults(e);
    });
    //删除
    $(".del").click(function(e){
        if(!confirm("确认要删除该收货地址？"))return;
        var form=$(e.target).parents("form")[0];
        form["go"].value=form["del_go"].value;
        form.submit();
    });
    //显示新增表单
    $(".add").click(function(){
        $("#tab_add").show();
    });
    //隐藏新增表单
    $(".back").click(function(){
        $("#tab_add input").attr("value","");
        $("#tab_add select").attr("value","0");
        $("#tab_add").hide();
    });
    //显示修改表单
    $(".update").click(function(){
        $(this).hide();
        $(this).siblings(".del").hide();
        $(this).siblings(".bc").show();

        $(this).siblings("table").find("input").show();
        $(this).siblings("table").find("select").show();
        $(this).siblings("table").find("input").show();
        $(this).siblings("table").find(".span_f").css("float","left");
        $(this).siblings("table").find("span").text("");
    });
});
var country_notice="（请选择国家）";
var province_notice="（请选择省份）";
var city_notice="（请选择城市）";
var district_notice="（请选择区）";
var consignee_notice="（必填）";
var address_notice="（必填）";
var telmobile_empty="（必填）";
var tel_notice="（输入有误）";
var sign_building_notice="（必填）";
var email_notice="（输入有误）";
var zipcode_notice="（输入有误）";
var mobile_notice="（输入有误）";
var default_txt="（必填）";
/*检查收货信息*/
function checkResults(e){
    var form=$(e.target).parents("form")[0];
    var ok=true;
    var country=$(form.country);
    var province=$(form.province);
    var city=$(form.city);
    var district=$(form.district);
    var consignee=$(form.consignee);
    var address=$(form.address);
    var sign_building=$(form.sign_building);
    var mobile=$(form.mobile);
    //必填，默认文本
    district.nextAll("span").removeClass("notice");
    consignee.next("span").removeClass("notice");
    address.next("span").removeClass("notice");
    sign_building.next("span").removeClass("notice");
    district.nextAll("span").text("");
    consignee.next("span").text("");
    address.next("span").text("");
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
    //验证手机
    if(mobile.val()==""){
        mobile.next("span").addClass("notice");
        mobile.next("span").text(telmobile_empty);
        mobile.focus();
        ok=false;
    }else{
        if(mobile.val()!=""&&!Utils.isPhone(mobile.val())){
            mobile.next("span").addClass("notice");
            mobile.next("span").text(mobile_notice);
            if(ok)mobile[0].focus();
            ok=false;
        }
    }

    if(form["add_go"])form["go"].value=form["add_go"].value;
    if(ok)form.submit();
}