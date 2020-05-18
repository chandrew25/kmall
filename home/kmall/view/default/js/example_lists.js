var temp=0;
function click_fg(id){
    temp=id;
	for(var i=0;i<=5;i++){
		$("#center_top"+i).css("display","none");
		$("#center_mcon"+i).css("display","none");
	}
	$("#center_top"+id).css("display","");
	$("#center_mcon"+id).css("display","");
	click_left('1',id);
	//scrollTo(0,$("#fg_"+id).offset().top);
}
function click_left(num,id){
	for(var i=0;i<=3;i++){
		$("#center_mcon"+id+" #foot"+i).css("display","none");
	}
	$("#center_mcon"+id+" #foot"+num).css("display","");
	right_img("1",id,num);
}	
function right_img(img,mcon,foot){
	$("#center_mcon"+mcon+" #right_img_show").attr("src",$("#center_mcon"+mcon+" #foot"+foot+" #img"+img).attr("src"));
}
//风格
$(document).ready(function(){
    $("#fg_list li").hover(
        function(){
            var num=$(this).index()+1;
            var src=$(this).find("img").attr("src");
            for(var i=0;i<=5;i++){
                $(this).parents().find("#top_img"+i).hide();
                $("#fg_list #fg_"+i).removeClass("li_click"+i);
                $("#fg_list #fg_"+i).addClass("bg_img"+i);
            }
            $(this).parents().find("#top_img"+num).show();
            $(this).removeClass("bg_img"+num);
            $(this).addClass("li_click"+num);
        },
        function(){
            if(temp>0){
                for(var i=0;i<=5;i++){
                    $(this).parents().find("#top_img"+i).hide();
                    $("#fg_list #fg_"+i).removeClass("li_click"+i);
                    $("#fg_list #fg_"+i).addClass("bg_img"+i);
                }
                $("#fg_list #fg_"+temp).parents().find("#top_img"+temp).show();
                $("#fg_list #fg_"+temp).removeClass("bg_img"+temp);
                $("#fg_list #fg_"+temp).addClass("li_click"+temp);   
            }
        }
    );
    $(".foot").hover(
        function(){
            $(this).find(".left_btn").show();
            $(this).find(".right_btn").show();
        },
        function(){
            $(this).find(".left_btn").hide();
            $(this).find(".right_btn").hide();
        }
    );
    var i=0;
    var count=$(".foot .list").length;
    var width=$(".foot").find(".list").width()+20;
    var lifirst=$(".foot").children(".lists");
    $(".foot .left_btn").click(function(){
        if(i<count-4){
            i++;
            lifirst.css("marginLeft",0-(width*i));
        }
        
    });
    $(".foot .right_btn").click(function(){
        if(i>0){
            i--;
            lifirst.css("marginLeft",0-width*i);
        }
        
    });
});