 <?php
/**
 +---------------------------------------<br/>
 * 控制器:智能卡<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author fxf 924197212@qq.com
 */
class Action_Smartcard extends Action
{
     /**
      * 控制器:显示提示信息
      */
     public function lists()
     {
        $this->loadCss("resources/css/smartcard.css");
        $this->loadJs("js/smartcard.js");
        
        //初始化商品搜索条件
        $where_clause=array();
        //智能卡
        $where_clause["ptype_key"]= "-19-";
        //货品上架
        $where_clause["isUp"]=1;
        //允许显示
        $where_clause["isShow"]=1;
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
