<?php
	require_once ("../../../../init.php");
	header('Content-type: text/html; charset='.Gc::$encoding);
    session_start();
    $member_id=HttpSession::get('member_id');
    if($_REQUEST['is_new_comment']==1 && $member_id){
        $comment=new Comment();
        //定义member_id
        $comment->member_id=$member_id;
        //定义username
        $my_member=Member::get_by_id($comment->member_id);
        $comment->memberName=$my_member->username;
        //定义comment_type
        $comment->comment_type=0;
        //定义product_id
        $comment->product_id=$_REQUEST['product_id'];
        //定义content
        $comment->content=$_REQUEST['user_comment'];
        //评论ip
        $comment->ip_address=UtilNet::client_ip();
        //定义add_time
        $comment->add_time=UtilDateTime::now(EnumDateTimeFORMAT::TIMESTAMP);
        //定义is_show
        $comment->isShow = 1;        
        //将评论数据存入数据库
        $comment->save();
    }else{
        echo false;
    }
    $comment->add_time=UtilDateTime::timestampToDateTime($comment->add_time);
    $commentarr=array();
    $commentarr[]=$comment;
    echo json_encode($commentarr);
?>