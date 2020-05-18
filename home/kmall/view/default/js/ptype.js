$(function(){
	$("img[original]").lazyload();
});
$(function(){
    $('.show_all').click(
        function(){
            var str = $(this).find("a").html();
            var height="200px";
            var html="";
            if (str=="显示全部国家") {
                html="显示部分国家";
            }else if (str=="显示全部品牌") {
                html="显示部分品牌";
            }else if (str=="显示部分国家") {
                height="20px";
                html="显示全部国家";
            }else if (str=="显示部分品牌") {
                height="20px";
                html="显示全部品牌";
            }
            $(this).parent().find('.fl_ul').css('max-height',height);
            $(this).find("a").html(html);
        }
    );       
});