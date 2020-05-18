<?php
/**
 +---------------------------------------<br/>
 * 支付方式<br/>
 +---------------------------------------
 * @category kmall
 * @package dic
 * @author skygreen skygreen2001@gmail.com
 */
class Paymenttype extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var string
     * @access public
     */
    public $paymenttype_id;
    /**
     * 支付方式代码
     * @var string
     * @access public
     */
    public $paymenttype_code;
    /**
     * 名称
     * @var string
     * @access public
     */
    public $name;
    /**
     * 描述
     * @var string
     * @access public
     */
    public $description;
    /**
     * 值
     * @var string
     * @access public
     */
    public $value;
    /**
     * 是否安装
     * @var string
     * @access public
     */
    public $issetup;
    /**
     * 手续费
     * @var string
     * @access public
     */
    public $pay_fee;
    /**
     * 图标
     * @var string
     * @access public
     */
    public $ico;
    /**
     * 目录层级
     * @var string
     * @access public
     */
    public $level;
    /**
     * 所属父类型标识
     * @var string
     * @access public
     */
    public $parent_id;
    /**
     * 排序<br/>
     * 权重越大，越靠前
     * @var int
     * @access public
     */
    public $sort_order;
    //</editor-fold>
    /**
     * 子支付方式
     */
    public function childs()
    {
        if(empty($this->childs)){//如果没有获取子类型
            $paymenttypes=Paymenttype::get("issetup=1 and parent_id=".$this->paymenttype_id);
            $this->paymenttypes=$paymenttypes;
        }
        $paymenttypes=$this->paymenttypes;
        return $paymenttypes;
    }
    /**
     * 子支付方式数量
     */
    public function childscount()
    {
        $paymenttypes=$this->childs();
        return count($paymenttypes);
    }
    /**
    * 根据键获取值
    */
    public function getValue($key){
        if(empty($this->values)&&!empty($this->value)){
            $values=array();
            $vs=explode("&",$this->value);
            for($i=0;$i<count($vs);$i++){
                $v=explode("=",$vs[$i]);
                $values[$v[0]]=$v[1];
            }
            $this->values=$values;
        }
        $values=$this->values;
        if(is_array($values)){
            return $values[$key];
        }else{
            return null;
        }
    }
    /**
     * 最高的层次，默认为3 
     */
    public static function maxlevel()
    {
        return Paymenttype::select("max(level)");//return 3;
    }

}
?>