<?php
/**
 +---------------------------------------<br/>
 * 秒杀商品<br/>
 +---------------------------------------
 * @category kmall
 * @package product
 * @author skygreen skygreen2001@gmail.com
 */
class Seckill extends DataObject
{
	//<editor-fold defaultstate="collapsed" desc="定义部分">
	/**
	 * 标示
	 * @var int
	 * @access public
	 */
	public $seckill_id;
	/**
	 * 秒杀名称
	 * @var string
	 * @access public
	 */
	public $seckill_name;
	/**
	 * 开始时间
	 * @var date
	 * @access public
	 */
	public $begin_datetime;
	/**
	 * 结束时间
	 * @var date
	 * @access public
	 */
	public $end_datetime;
	//</editor-fold>

	//货品对应商品 多对一
	static $belong_has_one=array(
			"product"=>"Product"
	);

	public function getProduct(){
		$product = array();
		if($this->seckill_id){
			$product = Seckillproduct::get("seckill_id=".$this->seckill_id);
		}
		return $product;
	}
	public function isRob(){
		$start = strtotime($this->begin_datetime);
		$end = strtotime($this->end_datetime);
		if($start <=time() && $end>=time()){
			return true;
		}else{
			return false;
		}
	}
	public function getBeginTime(){
		$xq = $this->begin_datetime;
		if($this->begin_datetime){
			$w = date('w',strtotime($this->begin_datetime));
			switch ($w) {
				case '1':
					$xq = "周一";
					break;
				case '2':
					$xq = "周二";
					break;
				case '3':
					$xq = "周三";
					break;
				case '4':
					$xq = "周四";
					break;
				case '5':
					$xq = "周五";
					break;
				case '6':
					$xq = "周六";
					break;
				default:
					$xq = "周日";
					break;
			}
			$no=date("H",strtotime($this->begin_datetime));
			if ($no>=0&&$no<=6){
				$xq = $xq."凌晨".$no."点开始秒杀";
			}
			if ($no>6&&$no<12){
				$xq = $xq."上午".$no."点开始秒杀";
			}
			if ($no>=12&&$no<=18){
				$xq = $xq."下午".($no-12)."点开始秒杀";
			}
			if ($no>18&&$no<=24){
				$xq = $xq."晚上".($no-12)."点开始秒杀";
			}
		}
		return $xq;
	}
}
?>
