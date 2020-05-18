<?php
/**
 +---------------------------------------<br/>
 * 控制器:品牌商品分类关系<br/>
 +---------------------------------------
 * @category kmall
 * @package web.front.action
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Brandptype extends Action
{
    /**
     * 品牌商品分类关系列表
     */
    public function lists()
    {
        if ($this->isDataHave(UtilPage::$linkUrl_pageFlag)){
          $nowpage=$this->data[UtilPage::$linkUrl_pageFlag];
        }else{
          $nowpage=1;
        }
        $count=Brandptype::count();
        $ele_page=UtilPage::init($nowpage,$count);
        $this->view->countBrandptypes=$count;
        $brandptypes = Brandptype::queryPage($ele_page->getStartPoint(),$ele_page->getEndPoint());
        $this->view->set("brandptypes",$brandptypes);
    }
    /**
     * 查看品牌商品分类关系
     */
    public function view()
    {
        $brandptypeId=$this->data["id"];
        $brandptype = Brandptype::get_by_id($brandptypeId);
        $this->view->set("brandptype",$brandptype);
    }
    /**
     * 编辑品牌商品分类关系
     */
    public function edit()
    {
        if (!empty($_POST)) {
            $brandptype = $this->model->Brandptype;
            $id= $brandptype->getId();
            if (!empty($id)){
              $brandptype->update();
            }else{
              $id=$brandptype->save();
            }
            $this->redirect("brandptype","view","id=$id");
        }else{
            $brandptypeId=$this->data["id"];
            $brandptype = Brandptype::get_by_id($brandptypeId);
            $this->view->set("brandptype",$brandptype);
        }
    }
    /**
     * 删除品牌商品分类关系
     */
    public function delete()
    {
        $brandptypeId=$this->data["id"];
        $isDelete = Brandptype::deleteByID($brandptypeId);
        $this->redirect("brandptype","lists",$this->data);
    }
}

?>
