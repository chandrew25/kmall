$(function(){
    //点击图片
    $(".pro_img").click(function(){
    	var $radio=$(this).parent().prev().children('input[name=goods_id]');
    	if(!$radio.prop("disabled")){
    		$radio.prop("checked",true);
    	}
    });
    //点击提交
    $("#vi_btn_submit").click(function(){
    	var checked=$("input:radio[name='goods_id']:checked").val();
    	if(checked){
    		$("#selGoodsForm").submit();
    	}
    });
})