$(function(){
    /******************头部、底部宽度动态调整******************/
    $(window).bind("resize scroll",function(){
        $(".main").css({width:Math.max($(".container_width").width(),$(window).width())});
    });
})