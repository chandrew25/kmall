<?php
/**
 +---------------------------------------<br/>
 * 合同文件<br/>
 +---------------------------------------
 * @category yile
 * @package supplier.contract
 * @author skygreen skygreen2001@gmail.com
 */
class Confiles extends DataObject
{
    //<editor-fold defaultstate="collapsed" desc="定义部分">
    /**
     * 标识
     * @var int
     * @access public
     */
    public $confiles_id;
    /**
     * 合同标识
     * @var string
     * @access public
     */
    public $contract_id;
    /**
     * 原名称<br/>
     * 用户上传之前的文件名称
     * @var string
     * @access public
     */
    public $origin_name;
    /**
     * 文件显示名
     * @var string
     * @access public
     */
    public $file_name;
    /**
     * 文件实际路径名称
     * @var string
     * @access public
     */
    public $file_path;
    /**
     * 文件大小
     * @var string
     * @access public
     */
    public $file_size;
    /**
     * 文件类型
     * @var string
     * @access public
     */
    public $file_type;
    /**
     * 备注说明
     * @var string
     * @access public
     */
    public $intro;
    //</editor-fold>

    /**
     * 从属一对一关系
     */
    static $belong_has_one=array(
        "contract"=>"Contract"
    );
}
?>