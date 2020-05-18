<?php
/**
 +---------------------------------------<br/>
 * 控制器:stock<br/>
 +---------------------------------------
 * @category betterlife
 * @package web.back.admin
 * @author skygreen skygreen2001@gmail.com
 */
class Action_Stock extends ActionAdmin
{
    /**
     * stock列表
     */
    public function lists()
    {
        
    }
    /**
     * 查看stock
     */
    public function view()
    {
        $stockId = $this->data["id"];
        $stock = Stock::get_by_id($stockId);
        $this->view->set("stock", $stock);
    }
    /**
     * 编辑stock
     */
    public function edit()
    {
        if ( !empty($_POST) ) {
            $stock = $this->model->Stock;
            $id   = $stock->getId();
            $isRedirect = true;
            if ( !empty($id) ) {
                if ( $stock->isDelegate == 'on' ) $stock->isDelegate = true; else $stock->isDelegate = false;
                $stock->update();
            } else {
                $id = $stock->save();
            }
            if ( $isRedirect ) {
                $this->redirect("stock", "view", "id=$id");
                exit;
            }
        }
        $stockId = $this->data["id"];
        $stock   = Stock::get_by_id($stockId);
        $this->view->set("stock", $stock);
        $this->load_onlineditor(array('username','addr','baccount','bstartup'));
    }
    /**
     * 删除stock
     */
    public function delete()
    {
        $stockId = $this->data["id"];
        $isDelete = Stock::deleteByID($stockId);
        return array("info" => 200, "data"  => $stockId);
    }

    /**
     * 批量上传stock
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import()
    {
        if ( !empty($_FILES) ){
            return Manager_Sadmin_Service::stockService()->import($_FILES);
        }
        return array("error" => 500,"info"  => "No Data");
    }

    /**
     * 导出stock
     */
    public function export()
    {
        return Manager_Sadmin_Service::stockService()->exportStock();
    }
}

