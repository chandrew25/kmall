$(function(){
    /******************头部、底部宽度动态调整******************/
    $(window).bind("resize scroll",function(){
        $(".main").css({width:Math.max($(".container_width").width(),$(window).width())});
    });
    
    //change img
    $(".s_c_h_hover").hover(
    function(){
        $(this).children().addClass("schh_hot");
        $(".s_c_p_show").removeClass("s_c_p_show").addClass("s_c_p_hide");
        $(".s_c_pic img:eq("+$(this).index()+")").removeClass("s_c_p_hide").addClass("s_c_p_show");
    },
    function(){
        $(this).children().removeClass("schh_hot");
    })
})