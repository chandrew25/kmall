$(document).ready(function(){
    //活动公告等切换
    $("#activity_announcement").hover(function(){
        $(".tipshow").removeClass("tipshow_hover");
        $(this).addClass("tipshow_hover");
        $(".box_show").hide();
        $("#activity_announcement_show").show();
    });
    $("#newest_trends").hover(function(){
        $(".tipshow").removeClass("tipshow_hover");
        $(this).addClass("tipshow_hover");
        $(".box_show").hide();
        $("#newest_trends_show").show();
    });
    $("#newhand_course").hover(function(){
        $(".tipshow").removeClass("tipshow_hover");
        $(this).addClass("tipshow_hover");
        $(".box_show").hide();
        $("#newhand_course_show").show();
    });
    
    //免费下载切换
    $(".free_page_no").click(function(){
        $(".free_page_no").removeClass("free_page_no_show");
        $(this).addClass("free_page_no_show");
    });

    $("#free_page_no1").click(function(){
        $(".free_show").hide();
        $(".free_first_page").show();
    });
    $("#free_page_no2").click(function(){
        $(".free_show").hide();
        $(".free_second_page").show();
    });
    $("#free_page_no3").click(function(){
        $(".free_show").hide();
        $(".free_third_page").show();
    });
    
    $("#free_left").click(function(){
        $no = $(".free_page_no_show").html();
        $(".free_page_no").removeClass("free_page_no_show");
        if($no==1){
            $("#free_page_no3").addClass("free_page_no_show");
            $(".free_show").hide();
            $(".free_third_page").show();
        }else if($no==2){
            $("#free_page_no1").addClass("free_page_no_show");
            $(".free_show").hide();
            $(".free_first_page").show();
        }else{
            $("#free_page_no2").addClass("free_page_no_show");
            $(".free_show").hide();
            $(".free_second_page").show();
        }
    });
    
    $("#free_right").click(function(){
        $no = $(".free_page_no_show").html();
        $(".free_page_no").removeClass("free_page_no_show");
        if($no==3){
            $("#free_page_no1").addClass("free_page_no_show");
            $(".free_show").hide();
            $(".free_first_page").show();
        }else if($no==2){
            $("#free_page_no3").addClass("free_page_no_show");            
            $(".free_show").hide();
            $(".free_third_page").show();
        }else{
            $("#free_page_no2").addClass("free_page_no_show");            
            $(".free_show").hide();
            $(".free_second_page").show();
        }
    });
    
    //热门推荐切换
    $(".hot_page_no").click(function(){
        $(".hot_page_no").removeClass("hot_page_no_show");
        $(this).addClass("hot_page_no_show");
    });

    $("#hot_page_no1").click(function(){
        $(".hot_show").hide();
        $(".hot_first_page").show();
    });
    $("#hot_page_no2").click(function(){
        $(".hot_show").hide();
        $(".hot_second_page").show();
    });
    $("#hot_page_no3").click(function(){
        $(".hot_show").hide();
        $(".hot_third_page").show();
    });
    
    $("#hot_left").click(function(){
        $no = $(".hot_page_no_show").html();
        $(".hot_page_no").removeClass("hot_page_no_show");
        if($no==1){
            $("#hot_page_no3").addClass("hot_page_no_show");
            $(".hot_show").hide();
            $(".hot_third_page").show();
        }else if($no==2){
            $("#hot_page_no1").addClass("hot_page_no_show");
            $(".hot_show").hide();
            $(".hot_first_page").show();
        }else{
            $("#hot_page_no2").addClass("hot_page_no_show");
            $(".hot_show").hide();
            $(".hot_second_page").show();
        }
    });
    
    $("#hot_right").click(function(){
        $no = $(".hot_page_no_show").html();
        $(".hot_page_no").removeClass("hot_page_no_show");
        if($no==3){
            $("#hot_page_no1").addClass("hot_page_no_show");
            $(".hot_show").hide();
            $(".hot_first_page").show();
        }else if($no==2){
            $("#hot_page_no3").addClass("hot_page_no_show");            
            $(".hot_show").hide();
            $(".hot_third_page").show();
        }else{
            $("#hot_page_no2").addClass("hot_page_no_show");            
            $(".hot_show").hide();
            $(".hot_second_page").show();
        }
    });
    
    
    //最新上架切换
    $(".newest_page_no").click(function(){
        $(".newest_page_no").removeClass("newest_page_no_show");
        $(this).addClass("newest_page_no_show");
    });

    $("#newest_page_no1").click(function(){
        $(".newest_show").hide();
        $(".newest_first_page").show();
    });
    $("#newest_page_no2").click(function(){
        $(".newest_show").hide();
        $(".newest_second_page").show();
    });
    $("#newest_page_no3").click(function(){
        $(".newest_show").hide();
        $(".newest_third_page").show();
    });
    
    $("#newest_left").click(function(){
        $no = $(".newest_page_no_show").html();
        $(".newest_page_no").removeClass("newest_page_no_show");
        if($no==1){
            $("#newest_page_no3").addClass("newest_page_no_show");
            $(".newest_show").hide();
            $(".newest_third_page").show();
        }else if($no==2){
            $("#newest_page_no1").addClass("newest_page_no_show");
            $(".newest_show").hide();
            $(".newest_first_page").show();
        }else{
            $("#newest_page_no2").addClass("newest_page_no_show");
            $(".newest_show").hide();
            $(".newest_second_page").show();
        }
    });
    
    $("#newest_right").click(function(){
        $no = $(".newest_page_no_show").html();
        $(".newest_page_no").removeClass("newest_page_no_show");
        if($no==3){
            $("#newest_page_no1").addClass("newest_page_no_show");
            $(".newest_show").hide();
            $(".newest_first_page").show();
        }else if($no==2){
            $("#newest_page_no3").addClass("newest_page_no_show");            
            $(".newest_show").hide();
            $(".newest_third_page").show();
        }else{
            $("#newest_page_no2").addClass("newest_page_no_show");            
            $(".newest_show").hide();
            $(".newest_second_page").show();
        }
    });
    
    //应用下载详细切换
    $(".app_tip").hover(function(){
        $(".app_tip").removeClass("app_tip_hover");
        $(this).addClass("app_tip_hover");
    });
    
    $("#app_detail").hover(function(){
        $("#use_in_show").hide();
        $("#app_detail_show").show();
    });
    $("#use_in").hover(function(){
        $("#app_detail_show").hide();
        $("#use_in_show").show();
    });
    
    //综合排行切换
    $("#week_hover").children().css("color","black");
    $("#week_hover").click(function(){
        $(this).children().css("color","black");
        $("#month_hover").children().css("color","white");
        $(".week_month").removeClass("week_month_show");
        $(this).addClass("week_month_show");
        $("#month_show").hide();
        $("#week_show").show();
    });
    $("#month_hover").click(function(){
        $(this).children().css("color","black");
        $("#week_hover").children().css("color","white");
        $(".week_month").removeClass("week_month_show");
        $(this).addClass("week_month_show");
        $("#week_show").hide();
        $("#month_show").show();
    });
    
    //排行榜切换(周)
    $(".week_show_lists").hover(function(){
        $(".week_show_detail").removeClass("week_show_detail_show");
        $(".week_show_lists").removeClass("week_show_lists_hide");
        $(this).prev().addClass("week_show_detail_show");
        $(this).addClass("week_show_lists_hide")
    });
    
    //排行榜切换(月)
    $(".month_show_lists").hover(function(){
        $(".month_show_detail").removeClass("month_show_detail_show");
        $(".month_show_lists").removeClass("month_show_lists_hide");
        $(this).prev().addClass("month_show_detail_show");
        $(this).addClass("month_show_lists_hide")
    });
    
});    
