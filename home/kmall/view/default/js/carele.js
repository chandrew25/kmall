$(document).ready(function(){
    /******************头部、底部宽度动态调整******************/
    $(window).bind("resize scroll",function(){
        $("#headerw,#footer,.footer_top").css({width:Math.max($("#shadow").width(),$(window).width())});
    });
    
    /*sort style*/
    $(".btn_hover").hover(
        function(){
            $(this).addClass("carele_c_t_ul_bg");
        },function(){
            $(this).removeClass("carele_c_t_ul_bg");
        }
    )
})