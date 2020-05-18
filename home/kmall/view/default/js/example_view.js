
/*
*  右边图片切换
*/
//右击
var count=6;
function click_right(){
    var dangq=parseInt($("#dangq").text());
    var zongy=parseInt($("#zongy").text());
    var num=0;
    var nums=0;
    for(var i=1;i<=count;i++){
        if($("#img_list"+dangq+" #list_img_"+i).hasClass("img_bor")){
            if(i==1&&dangq==1){
                $(".right_show #left_b").removeClass("lefth");
                $(".right_show #left_b").addClass("leftc");
            }
            if(i==count-1&&dangq==zongy){
                $(".right_show #right_b").removeClass("rightc");
                $(".right_show #right_b").addClass("righth");
            }
            if(i==count&&dangq==zongy){
                nums=2;
                break;
                }
            if(i==count){
                click_sright();
                nums=1;
                break;
            }
            num=i;
         }
    }
    if(nums==0){
        updatecss(num+1);
    }
    else if(nums==2){
        updatecss(6);
    }
    else{
        updatecss(1);
    }
}
/**
* for(var n=1;n<=zongy;n++){
        for(var i=1;i<=count;i++){
            if($("#img_list"+n+" #list_img_"+i).hasClass("img_bor")&&n==dangq){
                if(i==1&&dangq==1){
                    $(".right_show #left_b").removeClass("lefth");
                    $(".right_show #left_b").addClass("leftc");
                }
                if(i==count-1&&dangq==zongy){
                    $(".right_show #right_b").removeClass("rightc");
                    $(".right_show #right_b").addClass("righth");
                }
                if(i==count&&dangq==zongy){
                    nums=2;
                    break;
                    }
                if(i==count){
                    click_sright();
                    nums=1;
                    break;
                }
                num=i;
             }
             if($("#img_list"+n+" #list_img_"+i).hasClass("img_bor")&&n!=dangq){
                $("#img_list"+dangq).css("display","none");
                $("#img_list"+n).css("display","");
                $("#dangq").text(n);
            }
        }
    }
*/
//左击
function click_left(){
    var dangq=parseInt($("#dangq").text());
    var zongy=parseInt($("#zongy").text());
    for(var i=1;i<=count;i++){
        if($("#img_list"+dangq+" #list_img_"+i).hasClass("img_bor")){
            if(i==1&&dangq==1){
                break;
            }
            if(i==2&&dangq==1){
                $(".right_show #left_b").removeClass("leftc");
                $(".right_show #left_b").addClass("lefth");
            }
            if(i==count&&dangq==zongy){
                $(".right_show #right_b").removeClass("righth");
                $(".right_show #right_b").addClass("rightc");
            }
            if(i==1){
                click_sleft();
                updatecss(6);
                break;
            }
            updatecss(i-1);
            break;
        }
    }
}
/**
* else{
            for(var n=1;n<=zongy;n++){
                for(var j=1;j<=count;j++){
                    if($("#img_list"+n+" #list_img_"+j).hasClass("img_bor")&&n!=dangq){
                        $("#img_list"+dangq).css("display","none");
                        $("#img_list"+n).css("display","");
                        $("#dangq").text(n);
                        dangq=parseInt($("#dangq").text());
                        if(j==1&&dangq==1){
                            break;
                        }
                        if(j==2&&dangq==1){
                            $(".right_show #left_b").removeClass("leftc");
                            $(".right_show #left_b").addClass("lefth");
                        }
                        if(j==count&&dangq==zongy){
                            $(".right_show #right_b").removeClass("righth");
                            $(".right_show #right_b").addClass("rightc");
                        }
                        if(j==1){
                            click_sleft();
                            updatecss(6);
                            break;
                        }
                        updatecss(j-1);
                        break;
                    }
                }
            }
        }
*/

/**
* 点击左边图片列表
*/
var img_num=0;
var list_bor_num=0;
function click_img(num){
    var dangq=parseInt($("#dangq").text());
    var zongy=parseInt($("#zongy").text());
    if(num==1&&dangq==1){
        $(".right_show #left_b").removeClass("leftc");
        $(".right_show #left_b").addClass("lefth");
        $(".right_show #right_b").removeClass("righth");
        $(".right_show #right_b").addClass("rightc");
        }
    else if(num==count&&dangq==zongy){
        $(".right_show #left_b").removeClass("lefth");
        $(".right_show #left_b").addClass("leftc");
        $(".right_show #right_b").removeClass("rightc");
        $(".right_show #right_b").addClass("righth");
            }
    else{
        $(".right_show #left_b").removeClass("lefth");
        $(".right_show #left_b").addClass("leftc");
        $(".right_show #right_b").removeClass("righth");
        $(".right_show #right_b").addClass("rightc");
            }
    updatecss(num);
    }
/**
* 修改右边图片路径
*/
function updatecss(num){
    var dangq=parseInt($("#dangq").text());
    var zongy=parseInt($("#zongy").text());
    for(var i=1;i<=zongy;i++){
        for(var j=1;j<=count;j++){
            $("#img_list"+i+" #list_img_"+j).removeClass("img_bor");
        }
    }
    $("#img_list"+dangq+" #list_img_"+num).addClass("img_bor");
    var src=$("#img_list"+dangq+" #list_img_"+num).attr("src");
    $("#show_img").attr("src",src);
} 
/*
*  左边图片切换
*/
//右击
function click_sright(){   
    var num1=parseInt($("#dangq").text());
    var num2=parseInt($("#zongy").text());
    if(num1==1){
        jia(num1);
        $("#left_s").removeClass("left1");
        $("#left_s").addClass("left2");
    }
    if(num1==num2){
        
    }
    else if(num1==(num2-1)){
        jia(num1);
        $("#right_s").removeClass("right2");
        $("#right_s").addClass("right1");
    }
    else{
        jia(num1);
    }
}
function jia(num){
    var num1=parseInt(num);
    $("#img_list"+num1).css("display","none");
    $("#img_list"+(num1+1)).css("display","");
    $("#dangq").text(num1+1);
}
//左击
function click_sleft(){
    var num1=parseInt($("#dangq").text());
    var num2=parseInt($("#zongy").text());
    if(num1==1){
        
    }
    else if(num1==2){
        jian(num1);
        $("#left_s").removeClass("left2");
        $("#left_s").addClass("left1");
    }
    else if(num1==num2){
        jian(num1);
        $("#right_s").removeClass("right1");
        $("#right_s").addClass("right2");
    }
    else{
        jian(num1);
    }
}
function jian(num){
    var num1=parseInt(num);
    $("#img_list"+num1).css("display","none");
    $("#img_list"+(num1-1)).css("display","");
    $("#dangq").text(num1-1);
}


