<?php
/**
 * 控制器:提供打印功能
 * @author skygreen
 */
class Action_Print extends ActionExt
{  
	/**
	 * 打印配送单 
	 */
	public function delivery()
	{
		$order_id=$this->data->order_id;
		$order=Order::get_by_id($order_id);

		$province = Region::get_by_id($order->province);
		$order->province = $province->region_name;
		$city = Region::get_by_id($order->city);
		$order->city = $city->region_name;
		$district = Region::get_by_id($order->district);
		$order->district = $district->region_name;
		$order->addr = $province->region_name."省".$city->region_name."市".$district->region_name;
		$goods=$order->ordergoods;
		$this->view->order=$order;
		$this->view->ordergoods=$goods;
	}
	
	/**
	 * 打印发票 
	 */
	public function invoice()
	{
		$order_id=$this->data->order_id;
		$order=Order::get_by_id($order_id);
		$invoices=$order->invoices;
		$invoice_nos="";
		foreach ($invoices as $invoice) {
			$invoice_nos.=$invoice->invoice_code."<br/>";
		}
		$this->view->order=$order;
		$this->view->invoices=$invoices;
		$this->view->invoice_nos=$invoice_nos;
	}
	
	/**
	 * 打印快递单 
	 */
	public function express()
	{
		$layout=array(
			"d2"=>array(
				"bg"=>"dly_bg_6.jpg",
				"delivery"=>array(
					"left"=>"112px","top"=>"158px"
				),
				"companyNameAlias"=>array(
					"left"=>"132px","top"=>"100px"
				),
				"ship_tel_from"=>array(
					"left"=>"152px","top"=>"224px"
				),
				"ship_mobile_from"=>array(
					"left"=>"152px","top"=>"236px"
				),
				"ship_zip_from"=>array(
					"left"=>"313px","top"=>"229px"
				),
				"ship_addr"=>array(
					"left"=>"469px","top"=>"168px"
				),
				"ship_name"=>array(
					"left"=>"491px","top"=>"117px"
				),
				"ship_tel"=>array(
					"left"=>"-1000px","top"=>"-1000px"
				),
				"ship_mobile"=>array(
					"left"=>"649px","top"=>"112px"
				),
				"ship_zip"=>array(
					"left"=>"695px","top"=>"231px"
				),     
				"ship_area"=>array(
					"left"=>"470px","top"=>"233px","width"=>"310px"
				),
				"num"=>array(
					"left"=>"312px","top"=>"326px"
				),
				"gouxuan"=>array(
					"left"=>"557px","top"=>"282px"
				)
			),
			"d5"=>array(
				"bg"=>"dly_bg_2.jpg",
				"delivery"=>array(
					"left"=>"132px","top"=>"190px"
				),
				"companyNameAlias"=>array(
					"left"=>"142px","top"=>"222px"
				),
				"ship_tel_from"=>array(
					"left"=>"139px","top"=>"253px"
				),
				"ship_mobile_from"=>array(
					"left"=>"133px","top"=>"268px"
				),
				"ship_zip_from"=>array(
					"left"=>"268px","top"=>"259px"
				),
				"ship_addr"=>array(
					"left"=>"434px","top"=>"140px"
				),
				"ship_name"=>array(
					"left"=>"455px","top"=>"219px"
				),
				"ship_tel"=>array(
					"left"=>"442px","top"=>"252px"
				),
				"ship_mobile"=>array(
					"left"=>"436px","top"=>"268px"
				),
				"ship_zip"=>array(
					"left"=>"571px","top"=>"259px"
				),     
				"ship_area"=>array(
					"left"=>"700px","top"=>"181px","width"=>"110px"
				),
				"num"=>array(
					"left"=>"718px","top"=>"230px"
				),
				"gouxuan"=>array(
					"left"=>"508px","top"=>"359px"
				)
			)
		);
		
		$order_id=$this->data->order_id;
		$dtype=$this->data->dtype;
		$order=Order::get_by_id($order_id);
		$delivery=$order->delivery;
		
		
		if ($delivery->ship_zip){            
			$arr_ship_zip = str_split($delivery->ship_zip);
			if (count($arr_ship_zip)==6){
				$delivery->ship_zip=$arr_ship_zip[0]."&nbsp;&nbsp;".$arr_ship_zip[1]."&nbsp;&nbsp;".$arr_ship_zip[2]."&nbsp;".$arr_ship_zip[3]."&nbsp;&nbsp;".$arr_ship_zip[4]."&nbsp;".$arr_ship_zip[5];
			}else{
				$delivery->ship_zip=implode("&nbsp;&nbsp;",$arr_ship_zip);
			}
		}
		$this->view->layout=$layout["d".$dtype];
		$this->view->order=$order;
		$this->view->delivery=$delivery;
		$itemCount=Orderproducts::count("order_id=".$order_id);
		$this->view->itemCount=$itemCount;
		
	}
}
?>
