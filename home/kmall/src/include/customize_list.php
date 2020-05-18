<?php
    $successcasees=Classicase::get("case_type=".EnumCaseType::SUCCESS,"sort_order desc","0,1");
	$successcase_top=$successcasees[0];
     
    $welfares=Classicase::get("case_type=".EnumCaseType::WELFARE,"sort_order desc","0,6");
    
    
    echo '<div id="side_content">

            <div id="welfare_list" class="border_color">

                <div id="welfare_title" class="content_title_bkgcolor"><a href="'.Gc::$url_base.'index.php?go=kmall.classicase.lists&case_type=3">福利策划</a></div>
                
                <div class="side_content_bkg_bar border_color"><!--细横条背景图片--></div>'; 
                
    if(count($welfares)>0)
    {
        echo '<div id="welfare_pic_news">
        
                <a href="'.Gc::$url_base.'index.php?go=kmall.classicase.view&classicase_id='.$welfares[0]->classicase_id.'"><img src="'.Gc::$url_base.'upload/images/'.$welfares[0]->image.'" alt="welfare" /></a>
                    
                    <ul id="pic_news_wrapper">
                    
                        <li><a href="'.Gc::$url_base.'index.php?go=kmall.classicase.view&classicase_id='.$welfares[0]->classicase_id.'">'.UtilString::word_trim($welfares[0]->case_title, 13 , TRUE ).'</a></li>
                    
                    </ul>
                          
                </div>';
    }
               
    echo '            <ul id="welfare_wrapper">';
    
    
    
    for($i = 0;$i<count($welfares);$i++)
        {
            if($i!=0)
            {
                echo '    <li>      
                        <div class="dot_in_title"><!--新闻前面的点--></div>
                         
                        <a href="'.Gc::$url_base.'index.php?go=kmall.classicase.view&classicase_id='.$wealfares[$i]->classicase_id.'">'.UtilString::word_trim($welfares[$i]->case_title, 13 , TRUE ).'</a>
                        
                    </li>
                ';
            }
        }
                    
    echo '           </ul>             
                
            </div>

            <div id="successful_case" class="side_content_wrapper border_color">
                    
                    <div class="side_content_title content_title_bkgcolor"><a href="'.Gc::$url_base.'index.php?go=kmall.classicase.lists&case_type=4">成功案例</a></div>
                    
                    <div class="side_content_bkg_bar border_color"><!--细横条背景图片--></div>
                    
                    <div id="successful_case_pic"><a href="'.Gc::$url_base.'index.php?go=kmall.classicase.view&classicase_id='.$successcase_top->classicase_id.'"><img src="'.Gc::$url_base.'upload/images/'.$successcase_top->image.'" alt="successful_case" width="184px" height="175px"/></a></div>
                    
                    <div id="successful_case_title"><a href="'.Gc::$url_base.'index.php?go=kmall.classicase.view&classicase_id='.$successcase_top->classicase_id.'">'.$successcase_top->case_title.'</a></div>
                    
            </div>

        </div>';

        
        
        
?>
