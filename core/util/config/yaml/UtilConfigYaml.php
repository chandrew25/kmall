<?php
/**
 +-------------------------------------<br/>
 *工具类：读取Yaml配置文件类<br/>
 +-------------------------------------<br/>
 * @category kmall
 * @package util.config
 * @subpackage yaml
 * @author skygreen
 */
class UtilConfigYaml extends UtilConfig{
    function load ($file) {
        if (file_exists($file) == false) { return false; }
        $this->_settings = Spyc::YAMLLoad($file);
    }

    /**
    * 调用方法
    */
    public static function main(){
        $settings = New UtilConfigYaml();
        $settings->load(__DIR__.DIRECTORY_SEPARATOR.'setting.yaml');
        echo 'Yaml: ' . $settings->get('db.host') . '';
    }

}
?>
