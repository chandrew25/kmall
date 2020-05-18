<?php
/**
 +---------------------------------------<br/>
 * 控制器:证券<br/>
 +---------------------------------------
 * @category kmall
 * @package web.portal.stock
 * @author skyggreen2001 skygreen2001@gmail.com
 */
class Action_Stock extends ActionBasic
{
    /**
     * 显示股票信息
     */
    public function index()
    {
        

    }

    /**
     * 填写表格
     */
    public function form() {


    }

    /**
     * 申请
     */
    public function apply() {
        $stock = $this->model->Stock;
        $type  = $this->data["type"];
        if ( $type == 2 ) {
            $stock->isDelegate = 1;
        } else {
            $stock->isDelegate = 0;
        }
        if ( $stock && $stock->username && $stock->mobile && 
            $stock->email && $stock->addr && $stock->cardNo ) {
            $stock_id = HttpSession::get('stock_id');
            if ( $stock_id ) {
                $stock->stock_id = $stock_id;
                $stockOld = Stock::get_by_id($stock_id);
                if ( $stockOld && $stockOld->username == $stock->username && $stockOld->mobile == $stock->mobile && $stockOld->cardNo == $stock->cardNo) {
                    $stock->update();
                } else {
                    $stock_id = $stock->save($stock);
                }
            } else {
                $whereClause = " username='" . $stock->username . "' and mobile='" . $stock->mobile . "' and cardNo='" . $stock->cardNo . "' and TO_DAYS(commitTime) = TO_DAYS(NOW()) ";
                $stockOld    = Stock::get_one($whereClause);
                if ( $stockOld ) {
                    $stock_id        = $stockOld->stock_id;
                    $stock->stock_id = $stock_id;
                    $stock->update();
                } else {
                    $stock_id = $stock->save($stock);
                }
            }
        }
        HttpSession::set('stock_id', $stock_id);
    }

    /**
     * 提示费用信息
     */
    public function fee() {
        $stock_id = HttpSession::get('stock_id');
        $stock    = Stock::get_by_id($stock_id);
        $money    = $this->data["money"];
        $money    = number_format($money, 2, '.', '');
        if ( $stock ) {
            $stock->money = $money;
            $stock->update();
        }
    }

    /**
     * 选择支付
     */
    public function pay() {


    }

    /**
     * 提交成功
     */
    public function success(){

    }
    
}

?>