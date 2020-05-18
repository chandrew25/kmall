function click_update(){
    $("#tab_ud .update").css("display","none");
    $("#tab_ud .del").css("display","none");
    $("#tab_ud table span").val("");
    $("#tab_ud .bc").css("display","");
    $("#tab_ud input").css("display","");
    $("#tab_ud select").css("display","");
    $("#tab_ud .span_f").css("display","");
    $("#tab_ud .td_tl").css("float","right");
}
function click_add(){
    $("#tab_add").css("display","");
}
function click_back(){
    $("#tab_add input").attr("value","");
    //$("#tab_add select").attr("selected","selected");
    $("#tab_add").css("display","none");
}
function click_addbc(){
    if($("#tab_add #input_name").val()==""){
        alert("姓名不能为空！");
        return;
    }
    if($("#tab_add #input_address").val()==""){
        alert("地址不能为空！");
        return;
    }
    if($("#tab_add #input_phone").val()==""){
        alert("电话不能为空！");
        return;
    }
    /*$("#tab_add").css("display","none");*/
}
function click_bc(){
    //click_addbc();
    /*$("#tab_ud .update").css("display","");
    $("#tab_ud .del").css("display","");
    $("#tab_ud table span").css("display","");
    $("#tab_ud .bc").css("display","none");
    $("#tab_ud input").css("display","none");
    $("#tab_ud select").css("display","none");
    $("#tab_ud .span_f").css("display","none");
    $("#tab_ud .td_tl").css("float","right");*/
}