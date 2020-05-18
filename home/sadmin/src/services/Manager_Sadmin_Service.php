<?php
/**
 +---------------------------------------<br/>
 * 服务类:所有Service的管理类<br/>
 +---------------------------------------
 * @category betterlife
 * @package services
 * @author skygreen skygreen2001@gmail.com
 */
class Manager_Sadmin_Service extends Manager
{
    private static $stockService;

    /**
     * 提供服务: stock
     */
    public static function stockService()
    {
        if ( self::$stockService == null ) {
            self::$stockService = new ServiceStock();
        }
        return self::$stockService;
    }
}
