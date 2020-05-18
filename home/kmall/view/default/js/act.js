$(document).ready(function(){
  //页面宽度自适应
  reviseWidth();
  $(window).resize(function() {
    reviseWidth();
});
  
});
function reviseWidth(){
    var width = $(window).width();
    var isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
    if(isChrome){
        cwidth = parseInt(width);
        if(cwidth % 2 ==0){
            width = cwidth;
        }else{
            width = cwidth+1;
        } 
    }
    $(".act").width(width);
}