 <?php
/**
 +---------------------------------------<br/>
 * 控制器:汽车电子<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author fxf 924197212@qq.com
 */
class Action_Carele extends Action
{
     /**
      * 控制器:显示提示信息
      */
     public function lists()
     {
        $this->loadCss("resources/css/carele.css");
        $this->loadJs("js/carele.js");
        
        //初始化商品搜索条件
        $where_clause=array();
        //汽车电子
        //获取分类id
        $ptype_id=$this->data["ptype_id"];
        if($ptype_id){
            $where_clause["ptype_key"]= "-16-".$ptype_id."-";
            $this->view->set("ptype_id",$ptype_id);
        }else{
            $where_clause["ptype_key"]= "-16-";
        }
        //货品上架
        $where_clause["isUp"]=1;
        //允许显示
        $where_clause["isShow"]=1;
        //条件数组转为字符串
        $where_clause=$this->filtertoCondition($where_clause);
        //sort 
        $sorting = $this->data['sorting'];
        switch ($sorting){
            case 1: $sort_order = "sales_count desc"; break;
            case 2: $sort_order = "updateTime desc"; break;
            case 3: $sort_order = "sales_price desc"; break;
            case 4: $sort_order = "click_count desc"; break;
            case 5: $sort_order = ""; break;//评论次数 todo
            default: 
                $sort_order = "sales_count desc";
                $sorting=1;
                break;
        }
        $this->view->set("sorting",$sorting);
        
        //分页
        if ($this->isDataHave(UtilPage::$linkUrl_pageFlag)){          
            $nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
        }else{
            $nowpage=1;
        }
        $count=Goods::count($where_clause);
        $bb_page=UtilPage::init($nowpage,$count,12); 
        $goods = Goods::queryPage($bb_page->getStartPoint(),$bb_page->getEndPoint(),$where_clause,$sort_order);  
        $this->view->set("count",$count);
        $this->view->set("goods",$goods);
            
        //导航条
        $nonav = 1;
        $this->view->set("nonav",$nonav);
     }
}
?>
