 <?php
/**
 +---------------------------------------<br/>
 * 控制器:订单查询<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author fxf 924197212@qq.com
 */
class Action_Ordersearch extends Action
{       
     /**
      * 控制器:订单查询页面
      */
     public function lists()
     { 
        $this->loadCss("resources/css/ordersearch.css");
        $phonenumber=$this->data['phonenumber'];
        $identify=$this->data['identify'];
        $seidentify=HttpSession::get(Gc::$appName."_identify_code");
        if($identify==$seidentify){
            $orders=Order::get("ship_mobile=".$phonenumber);
            foreach($orders as $order){
                $order->goods=Ordergoods::get("order_id=".$order->order_id);
            }
            $this->view->set("orders",$orders);
        }else{
            
        }
        //导航条
        $nonav = 1;
        $this->view->set("nonav",$nonav);
     }
    
}
?>
