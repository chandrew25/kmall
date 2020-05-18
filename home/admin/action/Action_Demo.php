<?php
/**
 * 控制器:演示
 * @category kmall
 * @package web.back.admin
 * @subpackage action
 * @author fxf 924197212@qq.com
 */
class Action_Demo extends ActionExt
{        
     /**
      * 控制器:demo1
      */
     public function d1()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtComponentCss("treegrid.css",true);
         $this->loadExtJs('shared/treegrid/TreeGridSorter.js',true);
         $this->loadExtJs('shared/treegrid/TreeGridColumnResizer.js',true);
         $this->loadExtJs('shared/treegrid/TreeGridNodeUI.js',true);
         $this->loadExtJs('shared/treegrid/TreeGridLoader.js',true);
         $this->loadExtJs('shared/treegrid/TreeGridColumns.js',true);
         $this->loadExtJs('shared/treegrid/TreeGrid.js',true);
         $this->loadExtJs('shared/App.js',true);
         $this->loadExtJs('demo/d1.js');
     }      

     public function d2()
     {
         $this->init();
         $this->ExtDirectMode();
         $this->ExtUpload();
         $this->loadExtComponentCss("treegrid.css",true);         
         $this->loadExtJs('shared/treegrid/TreeGridSorter.js',true);
         $this->loadExtJs('shared/treegrid/TreeGridColumnResizer.js',true);
         $this->loadExtJs('shared/treegrid/TreeGridNodeUI.js',true);
         $this->loadExtJs('shared/treegrid/TreeGridLoader.js',true);
         $this->loadExtJs('shared/treegrid/TreeGridColumns.js',true);
         $this->loadExtJs('shared/treegrid/TreeGrid.js',true);
         $this->loadExtJs('demo/d2.js');
     }    
} 
?>