<?php
/**
 * 所有按钮类的基类
 * @author FXF
 *
 */
class Button{
	public $name;
	
	public function getName(){
		return $this->name;
	}
	
	/**
	 * urlencode 处理中文转json问题
	 * @param string $name
	 */
	public function setName($name){
		$this->name = urlencode($name);
	}
}

/**
 * 事件按钮（event）
 * @author FXF
 *
 */
class ClickButton extends Button{
	public $type;
	public $key;
	
	public function getType(){
		return $this->type;
	}
	
	public function setType($type){
		$this->type = $type;
	}
	
	public function getKey(){
		return $this->key;
	}
	
	public function setKey($key){
		$this->key = $key;
	}
}

/**
 * 链接按钮（url）
 * @author FXF
 *
 */
class ViewButton extends Button{
	public  $type;
	public $url;

	public function getType(){
		return $this->type;
	}

	public function setType($type){
		$this->type = $type;
	}

	public function getUrl(){
		return $this->url;
	}

	public function setUrl($url){
		$this->url = urlencode($url);
	}
}

/**
 * 复合按钮
 * @author FXF
 *
 */
class ComButton extends Button{
	public $sub_button=array();

	public function getSubButton(){
		return $this->sub_button;
	}

	public function setSubButton($subButton){
		$this->sub_button[] = $subButton;
	}
}
?>