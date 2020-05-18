<?php
require_once("ButtonManager.php");
class WeChatMenu{
	public $button=array();

	public function getButton(){
		return $this->button;
	}

	public function setButton($button){
		$this->button[] = $button;
	}
}

class MenuManager{
	const CONFIG_XML = "menu.xml";
	const MENU_CREATE_URL = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
	private $json_menu;
	
	/**
	 * 构造函数
	 */
	function __construct() {
		$this->createMenu();
	}
	
	public function getJson_Menu(){
		return $this->json_menu;
	}
	
	private function setJson_Menu($json_menu){
		$this->json_menu = $json_menu;
	}
	
	/**
	 * generate menu json string
	 * @return string
	 */
	private function createMenu(){
		$path=dirname(__FILE__).DIRECTORY_SEPARATOR.self::CONFIG_XML;
		$menuXml=UtilXmlSimple::fileXmlToObject($path);
		if ($menuXml!=null)
		{
			$menu=new WeChatMenu();
			foreach ($menuXml as $button)
			{
				$attr=$this->obtainButtonAttributes($button);
				switch ($attr->type) {
					case "click":
						$genButton=$this->createClickButton($attr->type, $attr->name, $attr->key);
					break;
					case "view":
						$genButton=$this->createViewButton($attr->type, $attr->name, $attr->url);
					break;
					default:
						$subButton=$button->subButton;
						$genButton=new ComButton();
						$genButton->setName($attr->name);
						foreach($subButton as $subBtn){
							$subattr=$this->obtainButtonAttributes($subBtn);
							switch ($subattr->type) {
								case "click":
									$genBtn=$this->createClickButton($subattr->type, $subattr->name, $subattr->key);
									break;
								case "view":
									$genBtn=$this->createViewButton($subattr->type, $subattr->name, $subattr->url);
									break;
							}
							$genButton->setSubButton($genBtn);
						}
					break;
				}
				$menu->setButton($genButton);
			}
		}
		$this->setJson_Menu($this->toJson($menu));
	}
	
	/**
	 * generate menu create url
	 * @param string $access_token
	 * @return mixed
	 */
	public function genMenuCreateUrl($access_token){
		$url=self::MENU_CREATE_URL;
		$url=str_replace("ACCESS_TOKEN",$access_token,$url);
		return $url;
	}
	
	/**
	 * obtain xml attributes
	 * @param simplexml $button
	 * @return obj
	 */
	private function obtainButtonAttributes($button){
		$attributes=$button->attributes();
		$attr->type=$attributes->type."";
		$attr->name=$attributes->name."";
		$attr->key=$attributes->key."";
		$attr->url=$attributes->url."";
		return $attr;	
	}
	
	/**
	 * instantiating ClickButton
	 * @param string $type
	 * @param string $name
	 * @param string $key
	 * @return ClickButton
	 */
	private function createClickButton($type,$name,$key){
		$clickButton=new ClickButton();
		$clickButton->setType($type);
		$clickButton->setName($name);
		$clickButton->setKey($key);
		return $clickButton;
	}
	
	/**
	 * instantiating ViewButton
	 * @param string $type
	 * @param string $name
	 * @param string $url
	 * @return ViewButton
	 */
	private function createViewButton($type,$name,$url){
		$viewButton=new ViewButton();
		$viewButton->setType($type);
		$viewButton->setName($name);
		$viewButton->setUrl($url);
		return $viewButton;
	}
	
	/**
	 * convert to json(已做中文处理)
	 * @param var $menu
	 * @return string
	 */
	private function toJson($menu) {
		$temStr = json_encode($menu);
		return urldecode($temStr);
	}
}
?>