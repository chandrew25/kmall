<?php
/**
 +---------------------------------------<br/>
 * 商店配置类<br/>
 +---------------------------------------
 * @category kmall
 *
 * @package core.config
 * @author skygreen
 */
class ConfigStore extends ConfigBB
{
    /**
    * 网站标题
    *
    * @var mixed
    */
    public static $title;
    /**
    * 网站logo
    *
    * @var mixed
    */
    public static $logo;
    /**
    * 网站地址
    *
    * @var mixed
    */
    public static $shopurl;
    /**
    * 订单是否审核
    *
    * @var mixed
    */
    public static $ordercheck;
    /**
    * 订单是否确认
    *
    * @var mixed
    */
    public static $orderconfirm;
    /**
    * 短信服务器地址
    *
    * @var mixed
    */
    public static $smsurl;
    /**
    * 短信服务器用户名
    *
    * @var mixed
    */
    public static $smsuname;
    /**
    * 短信服务器用户密码
    *
    * @var mixed
    */
    public static $smsupswd;
    /**
    * 电子邮箱服务器地址
    *
    * @var mixed
    */
    public static $emailhost;
    /**
    * 电子邮箱服务器端口
    *
    * @var mixed
    */
    public static $emailport;
    /**
    * 电子邮箱账户名
    *
    * @var mixed
    */
    public static $emailuname;
    /**
    * 电子邮箱密码
    *
    * @var mixed
    */
    public static $emailpswd;
    /**
    * 邮件发件人地址
    *
    * @var mixed
    */
    public static $emailaddress;

    /**
     * 加载库的规格Xml文件名。
     */
    const FILE_SPEC_LOAD_CONFIGSTORE="store.config.xml";

    /**
     * 初始化工作
     * 将xml配置文件内容注入变量
     */
    public static function init() {
        $settings = self::loadXml();
        $dataobjects = $settings->xpath("//settinggroup");
        $data=array();
        foreach ($dataobjects as $dataobject) {
            $setting_obj=$dataobject->setting;
            foreach ($setting_obj as $setting) {
                $setting_attributes=$setting->attributes();
                $name=$setting_attributes->id;
                $value=$setting."";
                self::${$name}=$value;
                $data[$name.'']=$value;
            }
        }
        return $data;
    }

    /**
     * 根据kv数组更新xml文件
     */
    public static function update($data){
      $settings= self::loadXml();
      foreach ($data as $key => $value) {
        $setting=$settings->xpath('//setting[@id="'.$key.'"]');
        $setting[0][0]=$value;
      }
      $fh=fopen(self::getPath(), "w");
      return fwrite($fh, $settings->asXML());
    }

    /**
     * 返回xml文件路径
     */
    private static function getPath(){
      return dirname(__FILE__).DIRECTORY_SEPARATOR.self::FILE_SPEC_LOAD_CONFIGSTORE;
    }

    /**
     * 返回simplexml对象
     */
    private static function loadXml(){
      return UtilXmlSimple::fileXmlToObject(self::getPath());
    }

}
?>
