<?php
/**
 +---------------------------------<br/>
 * 控制器:网站后台管理<br/>
 +---------------------------------
 * @category kmall
 * @package web.back.admin
 * @subpackage action
 * @author skygreen
 */
class Action_Report extends ActionExt
{
    /**
      * 控制器:购物额排名
      */
     public function buysortmoney()
     {
         $this->init();
         if(empty($this->view->viewObject))
         {
             $this->view->viewObject=new ViewObject();
         }
         UtilAjaxJquery::loadReady($this->view->viewObject);
         UtilAjaxJquery::loadJqueryUI($this->view->viewObject);
         $this->loadCss("resources/css/datepicker.css");
         $this->loadJs("js/ext/statements/buysortmoney.js");
         if(!empty($_POST)){
             $begintime=$this->data["begintime"];
             $endtime=$this->data["endtime"];
             $this->view->set("begintime",$begintime);
             $this->view->set("endtime",$endtime);
         }
         $ar=array();
         $ar[]="select m.username username,m.realname realname,sum(so.final_amount) amount,sum(sro.nums) nums";
         $ar[]="from ".Member::tablename()." m,".Order::tablename()." so,".Ordergoods::tablename()." sro";
         $ar[]="where so.member_id=m.member_id and sro.member_id=m.member_id and so.pay_status='1'";
         if(!empty($begintime)){
             $ar[]="and so.ordertime>='".UtilDateTime::dateToTimestamp($begintime)."'";
         }
         if(!empty($endtime)){
             $ar[]="and so.ordertime<='".UtilDateTime::dateToTimestamp($endtime)."'";
         }
         $ar[]="group by so.member_id order by nums desc";
         $ar[]="limit 0,10";
         $sql=implode(" ",$ar);//把数组元素用空格拼接在一起
         $list=sqlExecute($sql,true);
         $this->view->set("list",$list);
         if( $_POST["submit"]=="生成报表"){
            $arr_output_header = array(
                'username'  =>'用户名',
                'realname'=>'姓名',
                'nums'    =>'购物总量',
                'amount'=>'购物总额'
            );
            $diffpart=date("YmdHis");
            $outputFileName=Gc::$attachment_path."report".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."report$diffpart.xls";
            UtilFileSystem::createDir(dirname($outputFileName));
            UtilExcel::arraytoExcel($arr_output_header,$list,$outputFileName,true);
            $downloadPath  =Gc::$attachment_url."report/export/report$diffpart.xls";
         }

     }

     /**
      * 控制器:购买率排名
      */
     public function buysortcount()
     {
         $this->init();
         if(empty($this->view->viewObject))
         {
             $this->view->viewObject=new ViewObject();
         }
         UtilAjaxJquery::loadReady($this->view->viewObject);
         UtilAjaxJquery::loadJqueryUI($this->view->viewObject);
         $this->loadCss("resources/css/datepicker.css");
         $this->loadJs("js/ext/statements/buysortcount.js");
         if(!empty($_POST)){
             $begintime=$this->data["begintime"];
             $endtime=$this->data["endtime"];
             $this->view->set("begintime",$begintime);
             $this->view->set("endtime",$endtime);
         }
         $ar=array();
         $ar[]="select p.goods_name name,p.click_count click_count,count(sro.goods_id) buy_count,TRUNCATE((count(sro.goods_id))/(p.click_count)*100,3) scale";
         $ar[]="from ".Goods::tablename()." p,".Order::tablename()." so,".Ordergoods::tablename()." sro";
         $ar[]="where p.goods_id=sro.goods_id and sro.order_id=so.order_id";
         if(!empty($begintime)){
             $ar[]="and so.ordertime>='".UtilDateTime::dateToTimestamp($begintime)."'";
         }
         if(!empty($endtime)){
             $ar[]="and so.ordertime<='".UtilDateTime::dateToTimestamp($endtime)."'";
         }
         $ar[]="group by p.goods_id order by scale desc";
         $ar[]="limit 0,10";
         $sql=implode(" ",$ar);//把数组元素用空格拼接在一起
         $list=sqlExecute($sql,true);
         $this->view->set("list",$list);
         if( $_POST["submit"]=="生成报表"){
            $arr_output_header = array(
                'name'  =>'商品名称',
                'click_count'=>'点击次数',
                'buy_count'    =>'购买次数',
                'scale'=>'购买率'
            );
            $diffpart=date("YmdHis");
            $outputFileName=Gc::$attachment_path."report".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."report$diffpart.xls";
            UtilFileSystem::createDir(dirname($outputFileName));
            UtilExcel::arraytoExcel($arr_output_header,$list,$outputFileName,true);
            $downloadPath  =Gc::$attachment_url."report/export/report$diffpart.xls";
         }

     }

    /**
      * 控制器:销售额排名
      */
     public function sellsortmoney()
     {
         $this->init();
         if(empty($this->view->viewObject))
         {
             $this->view->viewObject=new ViewObject();
         }
         UtilAjaxJquery::loadReady($this->view->viewObject);
         UtilAjaxJquery::loadJqueryUI($this->view->viewObject);
         $this->loadCss("resources/css/datepicker.css");
         $this->loadJs("js/ext/statements/sellsortmoney.js");
         if(!empty($_POST)){
             $begintime=$this->data["begintime"];
             $endtime=$this->data["endtime"];
             $keyword=trim($this->data["keyword"]);
             $this->view->set("begintime",$begintime);
             $this->view->set("endtime",$endtime);
             $this->view->set("keyword",$keyword);
         }
         $ar=array();
         $ar[]="select re.name name,re.ns sell_count,re.ns*re.pr sell_money from";
         $ar[]="(select p.goods_name name,sum(sro.nums) ns,sro.price pr";
         $ar[]="from ".Goods::tablename()." p,".Order::tablename()." so,".Ordergoods::tablename()." sro";
         $ar[]="where p.goods_id=sro.goods_id and sro.order_id=so.order_id and so.pay_status='0'";
         if(!empty($begintime)){
             $ar[]="and so.ordertime>='".UtilDateTime::dateToTimestamp($begintime)."'";
         }
         if(!empty($endtime)){
             $ar[]="and so.ordertime<='".UtilDateTime::dateToTimestamp($endtime)."'";
         }
         if(!empty($keyword)){
             $ar[]="and p.goods_name like '%".$keyword."%'";
         }
         $ar[]="group by p.goods_id)as re order by sell_money desc";
         $ar[]="limit 0,10";
         $sql=implode(" ",$ar);//把数组元素用空格拼接在一起
         $list=sqlExecute($sql,true);
         $this->view->set("list",$list);
         if( $_POST["submit"]=="生成报表"){
            $arr_output_header = array(
                'name'  =>'商品名称',
                'sell_count'=>'销售量',
                'sell_money'    =>'销售总额',
            );
            $diffpart=date("YmdHis");
            $outputFileName=Gc::$attachment_path."report".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."report$diffpart.xls";
            UtilFileSystem::createDir(dirname($outputFileName));
            UtilExcel::arraytoExcel($arr_output_header,$list,$outputFileName,true);
            $downloadPath  =Gc::$attachment_url."report/export/report$diffpart.xls";
         }
     }

    /**
      * 控制器:订单统计排名
      */
     public function ordersort()
     {
         $this->init();
         if(empty($this->view->viewObject))
         {
             $this->view->viewObject=new ViewObject();
         }
         UtilAjaxJquery::loadReady($this->view->viewObject);
         UtilAjaxJquery::loadJqueryUI($this->view->viewObject);
         $this->loadJs("js/ordersort.js");
         $this->loadCss("resources/css/datepicker.css");
         if(!empty($_POST)){
             $begintime=$this->data["begintime"];
             $endtime=$this->data["endtime"];
             $this->view->set("begintime",$begintime);
             $this->view->set("endtime",$endtime);
         }
         //客户平均订单金额
         $ar=array();
         $ar[]="select re.a money,re.b count,re.a/re.b avg";
         $ar[]="from(select sum(final_amount) a,count(order_id) b from ".Order::tablename().") re";
         $sql=implode(" ",$ar);
         $list1=sqlExecute($sql);
         foreach ($list1 as $key=>$value) {
             $value->avg=substr($value->avg,0,strpos($value->avg,".")+4);
         }
         $this->view->set("list1",$list1);
         //订单转化率
         $ar=array();
         $ar[]="select b.a ordercount,a.a clickcount,b.a*100/a.a scale";
         $ar[]="from(select sum(click_count) a from ".Goods::tablename().") a,(select count(order_id) a from ".Order::tablename().") b";
         $sql=implode(" ",$ar);
         $list2=sqlExecute($sql);
         foreach ($list2 as $key=>$value) {
             $value->scale=substr($value->scale,0,strpos($value->scale,".")+4);
         }
         $this->view->set("list2",$list2);
         //平均会员订单量
         $ar=array();
         $ar[]="select b.a ordercount,a.a membercount,b.a/a.a avgorder from";
         $ar[]="(select count(member_id) a from ".Member::tablename().") a,(select count(order_id) a from ".Order::tablename().") b";
         $sql=implode(" ",$ar);
         $list3=sqlExecute($sql);
         foreach ($list3 as $key=>$value) {
             $value->avgorder=substr($value->avgorder,0,strpos($value->avgorder,".")+4);
         }
         $this->view->set("list3",$list3);
         //注册会员购买率
         $ar=array();
         $ar[]="select a.a ordercount,b.a membercount,a.a*100/b.a scale from";
         $ar[]="(select count(*) a from(select member_id from ".Order::tablename()." group by member_id) x) a,(select count(member_id) a from ".Member::tablename().") b";
         $sql=implode(" ",$ar);
         $list4=sqlExecute($sql);
         foreach ($list4 as $key=>$value) {
             $value->scale=substr($value->scale,0,strpos($value->scale,".")+4);
         }
         $this->view->set("list4",$list4);
     }
}
?>
