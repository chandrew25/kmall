// var oBtn = document.getElementById("menu");
// var uLi = oBtn.getElementsByTagName("a");
// var n = uLi.length;
// for (var i = 0 ; i<n ; i++)
// {
// 	uLi[i].index = i;
// 	uLi[i].addEventListener("touchend",function(){
// 		for (var j = 0 ; j<n ; j++)
// 		{
// 			uLi[j].className = "";
// 		}
// 	this.className = "red";
// 	},false)
//
// /*index end*/
// }
$(document).ready(function(){
    var menu = getUrlParam('go');
    menu = menu.split(".");
    menu = menu[1];
    if (menu=="index"){
        $("#memu_index").addClass("red");
    }else if (menu=="type"){
        $("#memu_type").addClass("red");
    }else if (menu=="cart"){
        $("#memu_cart").addClass("red");
    }else if (menu=="member"){
        $("#memu_member").addClass("red");
    }
})
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}