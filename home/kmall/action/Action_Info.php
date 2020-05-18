 <?php
/**
 +---------------------------------------<br/>
 * 控制器:购物车<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Info extends Action
{
     /**
      * 控制器:显示提示信息
      */
     public function view()
     {
        $this->loadJs("js/info.js");
        $this->loadCss("resources/css/info.css");
        if (array_key_exists("type",$this->data)){
            $type=$this->data["type"];
        }else{
            $type=0;
        }

        //$this->loadCss("resources/css/acl.css");
        $title="提示信息";
        switch ($type){
           case EnumViewInfoType::CARTADDPRODUCT:
             $content="请从正常途径选择商品进入购物车！";
             break;
           case EnumViewInfoType::CHECKOUTNOPRODUCT:
             $content="您的购物车里没有商品，请先选择商品！";
             break;
           case EnumViewInfoType::CHECKOUTOVER:
             $title="<strong>订单已提交,请尽快付款!</strong>";
             $content=$this->popPayWindow();
             if($content===true){
                 $title="<strong>感谢您在本店购物！您的订单已提交成功</strong>";
                 $content=null;
            }
             break;
           case EnumViewInfoType::PAYOVER:
             $title="<strong>感谢您在本店购物！您的订单已提交成功</strong>";
             //$content=$this->popPayWindow();
             break;
           default:
             $content="操作发生错误，请重试！";
             break;
        }

        $this->view->set("title",$title);
        $this->view->set("content",$content);

        //导航条
        $order_id = $this->data["order_id"];
        $payment_id = $this->data["payment_id"];
        $nav_info->level = 2;
        $nav_info->info = "订单信息";
        $nav_info->link = Gc::$url_base."index.php?go=kmall.info.view&&order_id=".$order_id."&type=".$type."&payment_id=".$payment_id;
        $this->view->set("nav_info",$nav_info);
     }

     /**
      * 支付完成提示
      */
     private function payOver()
     {
         $order_id=$this->data["order_id"];
         if (!empty($order_id)){
            $order=Order::get_by_id($order_id);
         }else $order=null;
         $amount=$order->total_amount;
         $pay_type_id=$order->pay_type;
         $paytype=Paymenttype::get_by_id($pay_type_id);
         $paytype_name=$paytype->name;
         $delivery_id=$order->ship_type;
         $delivery=Deliverytype::get_by_id($delivery_id);
         $delivery_name=$delivery->name;
         $content="您选定的配送方式为: <strong>$delivery_name</strong>，您选定的支付方式为: <strong>$paytype_name</strong>。您的应付款金额为: <strong>￥$amount</strong>元";
         return $content;
     }

     /**
      * 弹出支付窗口
      */
     private function popPayWindow()
     {
         $order_id=$this->data["order_id"];
         $order=Order::get_by_id($order_id);
         
         if (!empty($order)){
            if($order->pay_status==EnumPayStatus::SUCC){
                 return true;
            }else{
                $amount=$order->total_amount;
                $pay_type_id=$order->pay_type;
                $order_no = $order->order_no;
                $paytype=Paymenttype::get_by_id($pay_type_id);
                $paytype_name=$paytype->name;
                $ico=$paytype->ico;
                $this->view->set("pico",$ico);
                $delivery_id=$order->ship_type;
                $delivery=Deliverytype::get_by_id($delivery_id);
                $delivery_name=$delivery->name;
                $pbankcode=$this->data["pbankcode"];
                $deatil_url=Gc::$url_base."index.php?go=kmall.member.order_detail&order_id=".$order_id;
                $this->view->set("deatil_url",$deatil_url);
                if($pbankcode=="bank"||$pbankcode=="alipay" || $pbankcode=="wxpay"){
                    $url=Gc::$url_base."index.php?go=kmall.checkout.show&order_id=".$order_id."&pbankcode=".$pbankcode;
                    $this->view->set("url",$url);
                    $this->view->set("order_no",$order_no);
                    $this->view->set("delivery_name",$delivery_name);
                    $this->view->set("paytype_name",$paytype_name);
                    $this->view->set("amount",$amount);
                    $content="您选定的配送方式为: <strong>$delivery_name</strong>，您选定的支付方式为: <strong>$paytype_name</strong>。您的应付款金额为: <strong>￥$amount</strong>元,应支付积分为: <strong>" . $order->jifen . "</strong>积分";
                }
            }
         }
         return $content;
     }
}
?>
