$(document).ready(function(){
	$(".coupon_li_top").click(function(){
		var id = $(this).attr("id");
		var _obj = $("#bottom"+id);
		var uobj = $("#up"+id);
		var bobj = $("#ub"+id);
		if(_obj.is(":visible")==false){
			_obj.show();
			bobj.hide();
			uobj.show();
		}else{
			_obj.hide();
			bobj.show();
			uobj.hide();
		}
	});
});