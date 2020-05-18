<?php
/**
 * 控制器:会员管理
 *
 * @author ufs
 */
class Action_Member extends ActionExt
{
	/**
	 * 控制器:系统管理人员
	 */
	 public function admin()
	 {
		 $this->init();
		 $this->ExtDirectMode();
		 $this->ExtUpload();
		 $this->loadExtJs('member/admin.js');
	 }

     /**
      * 控制器:会员
      */
     public function member()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('member/member.js');
         $this->loadExtComponent("ComboBoxTree.js");
         //$this->load_onlineditor(array('address','intro'));
     }

     /**
      * 控制器:会员收货人地址信息
      */
     public function address()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtComponent("ComboBoxTree.js");
         $this->loadExtJs('member/address.js');
         $this->view->editorHtml=UtilCKEeditor::loadReplace("address");
     }

     /**
      * 控制器:企业信息
      */
     public function company()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('member/company.js');
     }

     /**
      * 控制器:会员评论
      */
     public function comment()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('member/comment.js');
         $this->view->editorHtml=UtilCKEeditor::loadReplace("content");
     }

     /**
      * 控制器:顾客留言
      */
     public function consult()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('member/consult.js');
         $this->load_onlineditor(array('comments','reply'));
     }

     /**
      * 控制器:会员等级表
      */
     public function rank()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtJs('member/rank.js');
     }

}
?>
