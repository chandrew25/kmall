<?php

/**
 +---------------------------------<br/>
 * 操作<br/>
 +---------------------------------
 * @category kmall
 * @package web.back
 * @subpackage operation
 * @author 924197212@qq.com
 */
 
 class Operation extends Viewable
 {
    /**
     * 标识
     * @var string 
     */
    private $id;
    /**
     * 所属Grid名称
     * @var string 
     */
    private $gridname;
    /**
     * 操作名称
     * @var string 
     */
    private $name;
    /**
     * 操作地址
     * @var string 
     */
    private $address; 
    /**
     * 操作介绍说明
     * @var string 
     */
    private $title;
    /**
     * 操作访问限制
     * @var string 
     */
    private $for; 
    
    public function setId($id)
    {
        $this->id=$id;
    }

    public function getId()
    {
        return $this->id;
    }
    
    public function setGridname($gridname)
    {
        $this->gridname=gridname;
    }

    public function getGridname()
    {
        return $this->$gridname;
    }
    
    public function setName($name)
    {
        $this->name=$name;
    }

    public function getName()
    {
        return $this->name;
    }
    
    public function setAddress($address)
    {
        $this->address=$address;
    }

    public function getAddress()
    {
        return $this->address;
    }             
    
    public function setTitle($title)
    {
        $this->title=$title;
    }

    public function getTitle()
    {
        return $this->title;
    }
    
    public function setFor($for)
    {
        $this->for=$for;
    }

    public function getFor()
    {
        return $this->for;
    } 
 }
 
?>
