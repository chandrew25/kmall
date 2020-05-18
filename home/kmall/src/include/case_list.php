<?php
    $classicases=Classicase::get("case_type=".EnumCaseType::CLASSIC,"sort_order desc","0,3");     
    $servicecases=Classicase::get("case_type=".EnumCaseType::SERVICE,"sort_order desc","0,3");
    $welfarecases=Classicase::get("case_type=".EnumCaseType::WELFARE,"sort_order desc","0,3");
	$successcasees=Classicase::get("case_type=".EnumCaseType::SUCCESS,"sort_order desc","0,3");
    
	echo '<div id="side_content">
            
            <div class="case_list_wrapper border_color">
             
                <div class="case_list_title content_title_bkgcolor"><a href="'.Gc::$url_base.'index.php?go=kmall.classicase.lists">经典案例</a></div>  
                
                <a href="'.Gc::$url_base.'index.php?go=kmall.classicase.lists"><div class="case_title_arrow"><!--案例标题箭头标识--></div></a>
                
                <ul class="case_list border_color">';
                
                
                
    foreach ($classicases as $classicase) {
        echo '<li class="case"><div class="case_front_point"><!--案例前装饰点--></div>';
        echo '<a href="'.Gc::$url_base.'index.php?go=kmall.classicase.view&classicase_id='.$classicase->classicase_id.'">'.$classicase->case_title.'</a></li>';   
    }
                
    echo  '      </ul>

            </div>

            
            <div class="case_list_wrapper border_color">
             
                <div class="case_list_title content_title_bkgcolor"><a href="'.Gc::$url_base.'index.php?go=kmall.classicase.lists&case_type=2">福利档案</a></div>  
                
                <a href="'.Gc::$url_base.'index.php?go=kmall.classicase.lists&case_type=2"><div class="case_title_arrow"><!--案例标题箭头标识--></div></a>
                
                <ul class="case_list border_color">';
                
    foreach ($servicecases as $servicecase) {
        echo '<li class="case">
                    <div class="case_front_point"><!--案例前装饰点--></div>';    
        echo '<a href="'.Gc::$url_base.'index.php?go=kmall.classicase.view&classicase_id='.$servicecase->classicase_id.'">'.$servicecase->case_title.'</a>
                   
                    </li>';   
    }
                
    echo  '          </ul>

            </div>

             <div class="case_list_wrapper border_color"> 
                
                <div class="case_list_title content_title_bkgcolor"><a href="'.Gc::$url_base.'index.php?go=kmall.classicase.lists&case_type=3">高层访谈</a></div>  
                
                <a href="'.Gc::$url_base.'index.php?go=kmall.classicase.lists&case_type=3"><div class="case_title_arrow"><!--案例标题箭头标识--></div></a>
                
                <ul class="case_list border_color">';
                
    foreach ($welfarecases as $welfarecase) {
        echo '<li class="case">
                    <div class="case_front_point"><!--案例前装饰点--></div>';  
        echo '<a href="'.Gc::$url_base.'index.php?go=kmall.classicase.view&classicase_id='.$welfarecase->classicase_id.'">'.$welfarecase->case_title.'</a>
                   
                    </li>';   
    }
               
    echo  '          </ul>
	

            </div>
			
			
			<div class="case_list_wrapper border_color"> 
                
                <div class="case_list_title content_title_bkgcolor"><a href="'.Gc::$url_base.'index.php?go=kmall.classicase.lists&case_type=4">成功案例</a></div>  
                
                <a href="'.Gc::$url_base.'index.php?go=kmall.classicase.lists&case_type=4"><div class="case_title_arrow"><!--案例标题箭头标识--></div></a>
                
                <ul class="case_list border_color">';
                
    foreach ($successcasees as $successcase) {
        echo '<li class="case">
                    <div class="case_front_point"><!--案例前装饰点--></div>';  
        echo '<a href="'.Gc::$url_base.'index.php?go=kmall.classicase.view&classicase_id='.$successcase->classicase_id.'">'.$successcase->case_title.'</a>
                   
                    </li>';   
    }
               
    echo  '          </ul>
	

            </div>
        </div>';
?>