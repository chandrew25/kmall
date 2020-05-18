$(document).ready(function(){
    /******************头部、底部宽度动态调整******************/
    $(window).bind("resize scroll",function(){
        $("#headerw,#footer,.footer_top,.main").css({width:Math.max($(".content").width(),$(window).width())});
    });
})