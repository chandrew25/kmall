$(document).ready(function(){
    //禁止a标签
    $("a").each(function () {
        $(this).css("cursor", "default");
        $(this).attr('href', '#');     //修改<a>的 href属性值为 #  这样状态栏不会显示链接地址
        $(this).click(function (event){
            event.preventDefault();   // 如果<a>定义了 target="_blank“ 需要这句来阻止打开新页面
        });
    });
    //url
    $url = $(".main").attr("url");
    //path
    $path = $(".main").attr("path");

/****************************新品上架begin*********************************/

    //新品上架排序按钮
    $(".newproduct").hover(
    function(){
        $(this).append("<div class='edit_np_sort' style='position:absolute;top:10px;left:100px;cursor:pointer;'><img src='"+$url+"/resources/images/user/reg_ico.png' width='36' height='29'/><div style='color:black;font-weight:bold;background:white;'>排序</div></div>");
    },
    function(){
        $(".edit_np_sort").remove();
    });

    //点击排序按钮
    $(".edit_np_sort").live("click",function(){
        toMask();
        $("#np_win").show();
    });

    //新品上架排序保存
    $(".np_win_submit").click(function(){
         $('#np_sort').ajaxSubmit({
            url:getPHP("tosort.php"),
            dataType:'json',
            type:'GET',
            success:function(json){
                var id = $("#newarrival").attr("id");
                $("#newarrival").remove();
                $(".newproduct").append(getLi(json,id));
            }
        });
        closeMask();
    });

/****************************新品上架end***********************************/

/****************************热卖排行begin*********************************/

    //热卖排行排序保存
    $(".hs_win_submit").click(function(){
         $('#hs_sort').ajaxSubmit({
            url:getPHP("tosort.php"),
            dataType:'json',
            type:'GET',
            success:function(json){
                id=$("#hotcharts").attr("id");
                $("#hotcharts").remove();
                $(".hotsell").append(getLi(json,id));
            }
        });
        closeMask();
    });

    //热卖排行排序按钮
    $(".hotsell").hover(
    function(){
        $(this).append("<div class='edit_hs_sort' style='position:absolute;top:10px;left:100px;cursor:pointer;'><img src='"+$url+"/resources/images/user/reg_ico.png' width='36' height='29'/><div style='color:black;font-weight:bold;background:white;'>排序</div></div>");
    }
    ,
    function(){
        $(".edit_hs_sort").remove();
    });

    //点击排序按钮
    $(".edit_hs_sort").live("click",function(){
        toMask();
        $("#hs_win").show();
    });


/****************************热卖排行end***********************************/

/****************************商品修改begin*********************************/

    //修改按钮
    $(".rela").live({
        mouseenter:
        function(){
            $(this).append("<div class='edit_np_detail' item='"+$(this).attr("item")+"' style='position:absolute;top:10px;left:10px;cursor:pointer;'><img src='"+$url+"/resources/images/icon/heart.png' width='24' height='25'/><div style='color:black;font-weight:bold;background:white;'>商品详情</div></div>");
        },
        mouseleave:
        function(){
            $(".edit_np_detail").remove();
        }
    });

    //点击修改按钮
    $(".edit_np_detail").live("click",function(){
        $tag= ".product"+$(this).attr("item");
        $($tag).show();
        toMask();
    });

    //商品信息保存
    $(".revise_submit").click(function(){
        var toform = "."+$(this).parent().attr("class");
        var protag = ".product_show"+$(this).parent().attr("item");
        var partag = ".rela"+$(this).parent().attr("item");
        $(toform).ajaxSubmit({
            url:getPHP("torevise.php"),
            dataType:'json',
            type:'post',
            success:function(json){
                $(protag).remove();
                $(partag).append(getDetail(json));
            }
        });
        closeMask();
    });

    //center商品信息保存
    $(".revise_submit_s").click(function(){
        var toform = "."+$(this).parent().attr("class");
        var protag = ".center_product_show"+$(this).parent().attr("item");
        var partag = ".rela"+$(this).parent().attr("item");
        $(toform).ajaxSubmit({
            url:getPHP("torevise.php"),
            dataType:'json',
            type:'post',
            success:function(json){
                $(protag).remove();
                $(partag).append(getCdetail(json));
            }
        });
        closeMask();
    });

/****************************商品修改end*********************************/

/****************************公共begin***********************************/
    //排序输入限定
    $(".np_win_input_show").live("keyup",function(){
        var $val = $(this).val();
        var code;
        for(var i = 0; i < $val.length; i++){
            var code = $val.charAt(i).charCodeAt(0);
            if(code < 48 || code > 57|| $val>100){
                alert("请输入100以内的数字!");
                $(this).val($(this).attr("item"));
                break;
            }
        }
    });

    //关闭窗口
    $("#win_close").click(function(){
        closeMask();
    });

    //点击蒙板关闭
    $(".dis_bg").click(function(){
        $(this).hide();
        $(".pop_win").hide();
        $(".pop_win").children().hide();
    });

/****************************公共end***********************************/

/****************************center内容 begin***********************************/

    $(".center").live({
        mouseenter:
        function(){
            $(this).append("<div class='edit_sort' item='"+$(this).attr("item")+"' style='position:absolute;top:0px;left:10px;cursor:pointer;'><img src='"+$url+"/resources/images/user/reg_ico.png' width='40' height='40'/><div style='color:black;font-weight:bold;background:white;'>内容排序</div></div>");
        },
        mouseleave:
        function(){
            $(".edit_sort").remove();
        }
    });

    //点击排序按钮
    $(".edit_sort").live("click",function(){
        toMask();
        $tag= "#"+$(this).attr("item");
        $($tag).show();
    });

    //center排序保存
    $(".center_sort_submit").click(function(){
         $('#center_form').ajaxSubmit({
            url:getPHP("center_sort.php"),
            dataType:'json',
            type:'GET',
            success:function(json){
                $(".center").children().remove();
                $(".center").append(getCenter(json));
            }
        });
        closeMask();
    });


/****************************center内容 end***********************************/

/****************************center顶部链接 begin*****************************/

    $(".classify_re_show").live({
        mouseenter:
        function(){
            $(this).append("<div class='edit_sort' item='"+$(this).attr("item")+"' style='position:absolute;top:-10px;left:10px;cursor:pointer;'><img src='"+$url+"/resources/images/user/reg_ico.png' width='20' height='20'/><div style='color:black;font-weight:bold;background:white;'>排序及链接修改</div></div>");
        },
        mouseleave:
        function(){
            $(".edit_sort").remove();
        }
    });

    $(".center_link_submit").click(function(){
        var toform = "."+$(this).prevAll('form').attr("class");
        var partag = ".classify_re_show"+$(this).prevAll('form').attr("item");
        $(toform).ajaxSubmit({
            url:getPHP("linkrevise.php"),
            dataType:'json',
            type:'get',
            success:function(json){
                $(partag).empty();
                $(partag).append(getLink(json));
            }
        });
        $(".newadd").removeClass("newadd");
        closeMask();
    });

    //增加链接
    $(".add_button").click(function(){
        var toform = "."+$(this).parent().attr("class");
        var toappend = ".center_link_form"+$(this).attr("item");
        $(toform).ajaxSubmit({
            url:getPHP("addlink.php"),
            dataType:'json',
            type:'get',
            success:function(json){
                $(toappend).append(getAddlink(json));
            }
        });
    });

    //删除链接
    $(".np_to_delete_input").live("click",function(){
        var r=confirm("确认删除？");
        if (r==true){
            var indexpage_id = $(this).attr("item");
            var data="indexpage_id="+indexpage_id;
            $.post(getPHP("todelete.php"),data,function(result){
                if(result){
                    var to_remove = ".np_win_list"+indexpage_id;
                    $(to_remove).remove();
                }else{
                    return false;
                }
            });
        }
         else return false;
    });

/****************************center顶部链接 end*******************************/

/****************************center图片 begin*****************************/

    $(".showimg_revise").live({
        mouseenter:
        function(){
            $(this).append("<div class='edit_sort' item='"+$(this).attr("item")+"' style='position:absolute;top:15px;left:15px;cursor:pointer;'><img src='"+$url+"/resources/images/user/reg_ico.png' width='30px' height='30px'/><div style='color:black;font-weight:bold;width:60px;height:20px'>图片修改</div></div>");
        },
        mouseleave:
        function(){
            $(".edit_sort").remove();
        }
    });

    //图片修改
    $(".center_img_submit").click(function(){
        var toform = "."+$(this).parent().attr("class");
        var partag = ".showimg_revise"+$(this).parent().attr("item");
        $(toform).ajaxSubmit({
            url:getPHP("imgrevise.php"),
            dataType:'json',
            type:'post',
            success:function(json){
                $(partag).children().remove();
                $(partag).append(getImg(json));
            }
        });
        closeMask();
    });

/****************************center图片 end*******************************/

/******************************新闻 begin*********************************/
    $(".right_top").hover(
    function(){
        $(this).append("<div class='edit_sort' item='"+$(this).attr("item")+"' style='position:absolute;top:10px;left:10px;cursor:pointer;'><img src='"+$url+"/resources/images/user/reg_ico.png' width='36' height='29'/><div style='color:black;font-weight:bold;background:white;'>修改排序</div></div>");
    }
    ,
    function(){
        $(".edit_sort").remove();
    });

    $(".news_revise_submit").click(function(){
        var toform = "."+$(this).parent().attr("class");
        var partag = ".news_revise";
        $(toform).ajaxSubmit({
            url:getPHP("newsrevise.php"),
            dataType:'json',
            type:'get',
            success:function(json){
                $(partag).empty();
                $(partag).append(getNews(json));
            }
        });
        closeMask();
    });
/******************************新闻 end***********************************/

});



/***************************调用**************************************/

/*获取php url*/
function getPHP(file){
    var pathName = window.location.pathname.substring(1);
    var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
    var root= window.location.protocol + '\/\/' + window.location.host + '/'+ webName + '/';
    return root+"home/kmall/src/httpdata/"+file;
}

/*蒙板*/
function toMask(){
    $(".dis_bg").show();
    $(".pop_win").css("top",100+$(document).scrollTop());
    $(".pop_win").animate({
    width: ['toggle', 'swing'],
    height: ['toggle', 'swing'],
    opacity: 'toggle'
  }, 1000);
    $("#win_close").show();
}

/*关闭蒙板*/
function closeMask(){
    $(".dis_bg").hide();
    $(".pop_win").hide();
    $(".pop_win").children().hide();
}

/*把相应的json格式数据转换为列表项********排序********/
function getLi(result,id){
    var str="";
    var url=$(".main").attr("item");
    if(result==null||result.length==0)return str;
    str+="<ul id='"+id+"'>";
    for(var i=0;i<result.length;i++){
        str+="<li class='rela"+result[i].indexpage_id+" rela' item='"+result[i].indexpage_id+"'>";
            str+="<img class='new fixpng' src='"+$url+"resources/images/new.png' />";
            str+="<div class='product_show"+result[i].indexpage_id+" product_show'>"
                str+="<a class='img_link' href='"+result[i].link+"'>";
                    str+="<img src='"+result[i].image+"' width='"+result[i].width+"' height='"+result[i].height+"' title='"+result[i].mouseover+"' />";
                str+="</a>";
                str+="<h4>";
                    str+="<a href='"+result[i].link+"' title='"+result[i].mouseover+"'>"+result[i].type_name+"<span>&nbsp;&nbsp;"+result[i].discribe+"</span><br /><span>"+result[i].title+"</span></a><br />";
                    str+="<span class='scj'>商城价</span><span class='red'>￥"+result[i].price+"</span>";
                str+="</h4>";
            str+="</div>"
        str+="</li>";
        str+="<li><img class='fixpng' src='"+$url+"resources/images/fenggexian.png' /></li>"
    }
    str+="</ul>";
    return str;
}

/*把相应的json格式数据转换为列表项********商品详细********/
function getDetail(result){
    var str="";
    if(result==null||result.length==0)return str;
        str+="<div class='product_show"+result.indexpage_id+" product_show'>"
            str+="<a class='img_link' href='"+result.link+"'>";
                str+="<img src='"+result.image+"' width='"+result.width+"' height='"+result.height+"' title='"+result.mouseover+"' />";
            str+="</a>";
            str+="<h4>";
                str+="<a href='"+result.link+"' title='"+result.mouseover+"'>"+result.type_name+"<span>&nbsp;&nbsp;"+result.discribe+"</span><br /><span>"+result.title+"</span></a><br />";
                str+="<span class='scj'>商城价</span><span class='red'>￥"+result.price+"</span>";
            str+="</h4>";
        str+="</div>"
    return str;
}

/*把相应的json格式数据转换为列表项********商品详细(center)********/
function getCdetail(result){
    var str="";
    if(result==null||result.length==0)return str;
        str+="<div class='center_product_show"+result.indexpage_id+" center_product_show'>"
            str+="<a href='"+result.link+"' title='"+result.mouseover+"'>";
                str+="<img src='"+result.image+"' width='"+result.width+"' height='"+result.height+"' />";
            str+="</a>";
            str+="<h4>";
                str+="<a href='"+result.link+"' title='"+result.mouseover+"'>&nbsp;<strong>"+result.type_name+"&nbsp;</strong>"+result.discribe+"<br>"+result.title+"</a><br />";
            str+="</h4>";
            str+="<span class='scj'>商城价</span><span class='red'>￥"+result.price+"</span>";
        str+="</div>"
    return str;
}

/*把相应的json格式数据转换为列表项********center内容********/
function getCenter(result){
    var str="";
    $url = $(".main").attr("url");
    if(result==null||result.length==0)return str;
    for(var i=0;i<result.length;i++){
        str+="<div class='ishowbox' style='background:url("+result[i].image+") no-repeat;'>";
            str+="<span class='classify_re_show classify_re_show"+result[i].indexpage_id+"' item='center_link_sort"+result[i].indexpage_id+"'>";
                for(var j=0;j<result[i].children.length;j++){
                    str+="<a href='"+result[i].children[j].link_url+"'>"+result[i].children[j].title+"</a>";
                    if(j<result[i].children.length-1){
                        str+="&nbsp;&nbsp;|&nbsp;&nbsp;";
                    }
                }
            str+="</span>";
            str+="<div class='tv_pic'>";
                str+="<div class='showimg_revise showimg_revise"+result[i].showimg.indexpage_id+"' item='allimage"+result[i].showimg.indexpage_id+"'>";
                    str+="<img src='"+result[i].showimg.image+"' width='"+result[i].showimg.width+"' height='"+result[i].showimg.height+"' title='"+result[i].showimg.height+"'/>";
                str+="</div>";
                str+="<ul class='showbox_product_sort'>";
                    str+="<img src='"+$url+"resources/images/bg/jianbian_short.jpg' />";
                    for(var k=0;k<result[i].kids.length;k++){
                        str+="<li class='rela"+result[i].kids[k].indexpage_id+" rela' item='"+result[i].kids[k].indexpage_id+"'>";
                            str+="<div class='center_product_show"+result[i].kids[k].indexpage_id+" center_product_show'>";
                                str+="<a href='"+result[i].kids[k].link_url+"' title='"+result[i].kids[k].mouseover+"'><img src='"+result[i].kids[k].image+"' width='"+result[i].kids[k].width+"' height='"+result[i].kids[k].height+"' /></a>";
                                str+="<h4><a href='"+result[i].kids[k].link_url+"' title='"+result[i].kids[k].mouseover+"'>&nbsp;<strong>"+result[i].kids[k].type_name+"&nbsp;</strong>"+result[i].kids[k].discribe+"<br>"+result[i].kids[k].title+"</a><br /></h4>";
                                str+="<span class='scj'>商城价</span><span class='red'>￥"+result[i].kids[k].price+"</span>";
                            str+="</div>";
                        str+="</li>";
                        if(k<result[i].kids.length-1){
                            str+="<li class='fenge'><img src='"+$url+"resources/images/fenggexian.png' /></li>";
                        }
                    }
                str+="</ul>";
            str+="</div>";
        str+="</div>";
        str+="<div class='center_bottom'></div>";
    }
    return str;
}

/*把相应的json格式数据转换为列表项********图片(center)********/
function getImg(result){
    var str="";
    if(result==null||result.length==0)return str;
        str+="<img src='"+result.image+"' width='"+result.width+"' height='"+result.height+"' title='"+result.mouseover+"' />";
    return str;
}

/*把相应的json格式数据转换为列表项********顶部链接********/
function getLink(result){
    var str="";
    if(result==null||result.length==0)return str;
    for(var i=0;i<result.length;i++){
        str+="<a href='"+result[i].link+"'>"+result[i].title+"</a>";
        if(i<result.length-1){
            str+="&nbsp;&nbsp;|&nbsp;&nbsp;";
        }
    }
    return str;
}

/*把相应的json格式数据转换为列表项********添加顶部链接********/
function getAddlink(result){
    var str="";
    if(result==null||result.length==0)return str;
        str+="<div class='np_win_list np_win_list"+result.indexpage_id+"'>";
            str+="<div class='center_win_title'>";
                str+="<input type='text' value='"+result.title+"' name='clink["+result.indexpage_id+"][title]' class='center_win_title_input'>";
            str+="</div>";
            str+="<div class='center_win_link2'>";
                str+="<input type='text' value='"+result.link+"' name='clink["+result.indexpage_id+"][link]' class='center_win_link2_input'>";
            str+="</div>";
            str+="<div class='np_win_input2'>";
                str+="<input type='text' value='"+result.sort_order+"' item='"+result.sort_order+"' name='clink["+result.indexpage_id+"][sort_order]' class='np_win_input_show'>";
            str+="</div>";
            str+="<div class='np_to_delete_input' item='"+result.indexpage_id+"'>删除</div>";
        str+="</div>";
    return str;
}

/*把相应的json格式数据转换为列表项********新闻********/
function getNews(result){
    var str="";
    if(result==null||result.length==0)return str;
    for(var i=0;i<result.length;i++){
        str+="<li><a href='"+result[i].link+"' title='"+result[i].mouseover+"' target='_blank'>"+result[i].title+"</a></li>";
    }
    return str;
}

/***************************调用end***********************************/
