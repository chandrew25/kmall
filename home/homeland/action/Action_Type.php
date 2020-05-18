<?php
/**
 +---------------------------------------<br/>
 * 控制器:商品类型<br/>
 +---------------------------------------
 * @category kmall
 * @package web.portal.mobile
 * @author jason.tan jakeon@126.com
 */
class Action_Type extends ActionMobile
{
    /**
     * 类型列表
     */
    public function lists()
    {
        $this->loadJs("js/fill_name.js");

        $ptype_arr=array();
        $sub_ptype_arr=array();
        $thr_ptype_arr = array();
        $product = Product::get("isShow=1 and isUp=1");
        $ids = array();
        if (!empty($product)) {
            foreach ($product as $key => $value) {
                if($value->ptype_key){
                    $ptype_key = array_filter(explode("-", $value->ptype_key));
                    $ids = array_merge($ids,$ptype_key);
                }
            }
            $ids = array_unique($ids);
        }
        $where = "";
        if (!empty($ids)) {
            $where = " and ptype_id in(".implode(",",$ids).")";
        }
        $_top_ptype_arr=Ptype::get("isShow=1 and level=1 ".$where,"sort_order desc");
        if ($_top_ptype_arr){
            foreach ($_top_ptype_arr as $ptype) {
                $ptype_arr[]=$ptype;
                $sub_ptype_arr[$ptype->ptype_id]=array();
            }
        }
        $_sub_ptype_arr=Ptype::get("isShow=1 and level=2 ".$where,"sort_order desc");
        if ($_sub_ptype_arr){
            foreach ($_sub_ptype_arr as $sub_ptype) {
                $sub_ptype_arr[$sub_ptype->parent_id][]=$sub_ptype;
            }
        }
//        $_thr_ptype_arr=Ptype::get("isShow=1 and level=3 ".$where,"sort_order desc");
//        if ($_thr_ptype_arr){
//            foreach ($_thr_ptype_arr as $thr_ptype) {
//                $thr_ptype_arr[$thr_ptype->parent_id][]=$thr_ptype;
//            }
//        }

        $this->view->set("ptype_arr",$ptype_arr);
        $this->view->set("sub_ptype_arr",$sub_ptype_arr);
//        $this->view->set("thr_ptype_arr",$thr_ptype_arr);
    }

    public function lists_info(){
        $this->loadJs("js/inner.js");
//        $this->loadJs("js/pay_success.js");
        $ptype_id = intval($this->data['ptype_id']); //二级分类
        $ptypeid = intval($this->data['ptypeid']); //三级级分类
        $pty = Ptype::get_by_id($ptype_id);
        $ptype = Ptype::get("parent_id=".$ptype_id);
        $goodsData = $data = $type = $num = array();
        if (!empty($ptype)){
            foreach ($ptype as $k=>$value ){
                $goods = Product::get("isShow=1 and isUp=1 and ptype_key like '%-".$value->ptype_id."-%'",'sort_order desc');
                if (!empty($goods)){
                    $num[] = count($goods);
                    $data[]=$goods;
                    $type[]=$value;
                }else{
                    unset($ptype[$k]);
                }

            }
        }
        arsort($num);
        foreach ($num as $key=>$value){
            $types[]=$type[$key];
            if (count($goodsData)<30){
                $goodsData = array_merge($goodsData,$data[$key]);
            }
        }
        if ($ptypeid){
            $goodsData = Product::get("isShow=1 and isUp=1 and ptype_key like '%-".$ptypeid."-%'",'sort_order desc');
        }
//        var_dump($types);die;
        $this->view->set("pty",$pty);
        $this->view->set("ptype_id",$ptype_id);
        $this->view->set("ptypeid",$ptypeid);
        $this->view->set("ptype",$types);
        $this->view->set("data",$data);
        $this->view->set("goodsData",$goodsData);
    }

}

?>