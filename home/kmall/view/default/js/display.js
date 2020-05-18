$(document).ready(function(){
/*    $("#hot_product_list img").lazyload({
        threshold:0,//图片没有看到之前暂用的像素
        placeholder:"home/ele/view/default/resources/images/index/loading.jpg",//未加载时显示的图片路径
        event:"scroll",//触发加载的事件
        effect:"fadeIn"//图片显示方式jquery函数
    });
    $("#show_product img").lazyload({
        threshold:0,//图片没有看到之前暂用的像素
        placeholder:"home/ele/view/default/resources/images/index/loading.jpg",//未加载时显示的图片路径
        event:"scroll",//触发加载的事件
        effect:"fadeIn"//图片显示方式jquery函数
    });*/
    $("#products_re").width($("#products_re").innerWidth());
    /*没有下一页，则按钮不显示*/
    if(!$("#rec_products_after").val()){
        $("#prev_btn_re,#next_btn_re").hide();
        return;
    }
    $("#next_btn_re").removeClass("paging_disabled_btn").addClass("paging_able_btn").removeAttr("disabled");
    var ulWidth=746;//列表显示的宽度
    var ulTime=500;//切换时间
    var pageNO=1;//当前显示的页码
    var pageCount=1;//已显示的页数
    var isMax=false;//是否已经查询到了最后一页
    /*点击上一页*/
    $("#prev_btn_re").click(function(){
        $("#products_re").animate({left:"+="+ulWidth},ulTime);
        pageNO--;
        if(pageNO<=1){//如果显示第一页，则上一页不可点击
            $("#prev_btn_re").removeClass("paging_able_btn").addClass("paging_disabled_btn").attr("disabled","");
        }
        //下一页按钮可点
        $("#next_btn_re").removeClass("paging_disabled_btn").addClass("paging_able_btn").removeAttr("disabled");
    });
    /*点击下一页*/
    $("#next_btn_re").click(function(){
        pageNO++;
        if(!isMax&&pageNO>pageCount){//如果没有查询过最后一页且要查看的页码大于显示页数
            var data="ptype_id="+$("#ptype_id").val()+"&rec_products_no="+$("#rec_products_no").val();
            $.post(getPHP("display_recommend.php"),data,function(result){
                $("#rec_products_no").val(result["rec_products_no"]);
                if(result["rec_products_after"]=="false"){//没有下一页，则下一页不可点
                    $("#next_btn_re").removeClass("paging_able_btn").addClass("paging_disabled_btn").attr("disabled","");
                    isMax=true;
                }
                pageCount++;//已查看页数增加
                $("#products_re").append(getLi(result["products"])).animate({left:"-="+ulWidth},ulTime);
            },"json");
        }else{
            if(isMax&&pageNO==pageCount){//如果已经查询过最后一页且要查看的页码等于显示页数，则下一页不可点
                $("#next_btn_re").removeClass("paging_able_btn").addClass("paging_disabled_btn").attr("disabled","");
            }
            $("#products_re").animate({left:"-="+ulWidth},ulTime);
        }
        //显示上一页按钮
        $("#prev_btn_re").removeClass("paging_disabled_btn").addClass("paging_able_btn").removeAttr("disabled");
    });

    /*背景切换*/
    $("#main .content .pros .box .items li").hover(
    function(){
        $(this).css("background","#E1E1E1")
    },
    function(){
        $(this).css("background","none")
    });

});
/*获取php url*/
function getPHP(file){
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    var root= window.location.protocol + '\/\/' + window.location.host + '/'+ webName + '/';
    return root+"home/kmall/src/httpdata/"+file;
}
/*把相应的json格式数据转换为列表项*/
function getLi(result){
    var str="";
    if(result==null||result.length==0)return str;
    for(var i=0;i<result.length;i++){
        str+="<li>";
            str+="<div class='recommend_product_new'>";
                str+="<div class='r_p_n_img'>";
                    str+="<a href='"+$("#url_base").val()+"index.php?go=kmall.product.view&product_id="+result[i].product_id+"' title='"+result[i].product_name+"'>";
                        str+="<img src='"+$("#url_base").val()+"upload/images/"+result[i].image+"' alt='"+result[i].product_name+"' width='101' height='87' />";
                    str+="</a>";
                str+="</div>";
                str+="<div class='r_p_n_intro'>";
                    str+="<div class='intro_name color_black'>";
                        str+="<a href='"+$("#url_base").val()+"index.php?go=kmall.product.view&product_id="+result[i].product_id+"' title='"+result[i].product_name+"'>"+result[i].product_name.substring(1,8)+"...</a>";
                    str+="</div>";
                    if(result[i].message&&$.trim(result[i].message)!=""){
                        str+="<div class='intro_words'>"+result[i].message.substring(1,10)+"...</div>";
                    }else{
                        str+="<div class='intro_words'></div>";
                    }
                    str+="<div class='intro_prise'>";
                        str+="<span class='intro_selling'>￥"+parseInt(result[i].price)+"&nbsp;</span><span class='intro_del'>￥"+parseInt(result[i].market_price)+"</span>";
                    str+="</div>";
                    str+="<div class='intro_img'><a href='"+$("#url_base").val()+"index.php?go=kmall.product.addProduct&product_id="+result[i].product_id+"&num=1'></a>";
                    str+="</div>";
                str+="</div>";
            str+="</div>";
        str+="</li>";
    }
    return str;
}
