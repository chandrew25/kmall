<?php 
    /**
    +---------------------------------------<br/>
    * 商品多规格信息
    +---------------------------------------
    * @category kmall
    * @package admin.src.httpdata
    * @author fxf 924197212@qq.com
    */
    require_once ("../../../../init.php");
    $product_id = !empty($_POST['product'])&&($_POST['product']!="?")&&($_POST['product']!="？") ? trim($_POST['product']) : "";
    $product = Product::get_by_id($product_id);
    //判断商品存在且为多规格
    if($product&&$product->isMultiplespec){
        //规格对象
        $specObj = new stdClass();
        //规格数组
        $specArr = array();
        //货品数组
        $goodsArr = array();
        //可选规格数组
        $canSelArr = new stdClass();
        //数组计数
        $count = 0;
        //规格序列(如果为空,后续程序会中断,需优化)
        $speckey = Goods::select_one('pspec_key',"product_id=".$product_id);
        $specExp = explode("-",$speckey);
        //生成规格信息数据结构
        foreach($specExp as $spec){
            if($spec){
                //找出符合的数据,解析组合
                $prospec = Productspec::select_one("attr_p_id,attr_p_name",array("attribute_id=".$spec,"product_id=".$product_id),"productspec_id asc");
                //规格项标识
                $attr_pid = $prospec->attr_p_id;
                //规格项名称
                $attr_name = $prospec->attr_p_name;
                //所选下属规格值
                $specs = Productspec::get(array("attr_p_id=".$attr_pid,"product_id=".$product_id),"productspec_id asc");
                //下属可选规格值集
                $allspec = Attribute::select("attribute_id id,attribute_name name","parent_id=".$attr_pid);
                //可选规格对象
                $cansel = new stdClass();
                $cansel->name = $attr_name;
                $cansel->id = $attr_pid;
                $cansel->data = $allspec;
                $cansel->count = count($allspec);
                $canSelArr->$attr_pid = $cansel;
                
                $specObj->$attr_pid->data=array();
                //将规格值存入data
                foreach($specs as $specv){
                    $spvalue = new stdClass();
                    $spvalue->id=$specv->attribute_id;
                    $spvalue->name=$specv->attr_name;
                    $specObj->$attr_pid->data[]=$spvalue;     
                }
                $specObj->$attr_pid->pname=$attr_name;
                //动态列name
                $specArr[] = "attr".$attr_pid; 
            }        
        }
        //货品
        $goods = Goods::get("product_id=".$product_id);
        foreach($goods as $eachgoods){
            $goodsArr[$count]->goods_id = $eachgoods->goods_id;
            $goodsArr[$count]->goods_name = $eachgoods->goods_name;
            $goodsArr[$count]->goods_code = $eachgoods->goods_code;
            $goodsArr[$count]->sales_price = $eachgoods->sales_price;
            $goodsArr[$count]->market_price = $eachgoods->market_price;
            $goodsArr[$count]->stock = $eachgoods->stock;
            $goodsArr[$count]->pspec_key = $eachgoods->pspec_key;
            if($eachgoods->isUp){
                $goodsArr[$count]->isUp = '是';    
            }else{
                $goodsArr[$count]->isUp = '否';    
            }
            //多规格序列
            $pspec_key = $eachgoods->pspec_key;
            $pspec_Exp = explode("-",$pspec_key);
            $specount = 0;
            foreach($pspec_Exp as $pspec){
                if($pspec){
                    //规格信息
                    $attr_name = Productspec::select_one("attr_name",array("attribute_id=".$pspec,"product_id=".$product_id));
                    $specname = $specArr[$specount++];
                    $goodsArr[$count]->$specname = $attr_name;
                }
            }
            $count++;            
        }
        $success = true; 
    }else{
        $success = false;
    }
    $result["success"] = $success;
    $result["spec"] = $specObj;  
    $result["cansel"] = $canSelArr;              
    $result["goods"] = $goodsArr;
    echo json_encode($result);
?>
