<?php
/**
 * 控制器:内容发布系统
 * @category kmall
 * @package web.back.admin
 * @subpackage action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Cms extends ActionExt
{
     /**
      * 控制器:新闻
      */
     public function news()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('cms/news.js');
         $this->online_editor = EnumOnlineEditorType::CKEDITOR;
         $this->load_onlineditor('news_content');
     }

     /**
      * 控制器:帮助中心
      */
     public function helpcenter()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('cms/helpcenter.js');
         $this->load_onlineditor('help_content');
     }
}
?>
