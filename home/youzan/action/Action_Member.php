<?php
/**
 +---------------------------------------<br/>
 * 控制器:会员<br/>
 +---------------------------------------
 * @category kmall
 * @package web.portal.mobile
 * @author jason.tan jakeon@126.com
 */
class Action_Member extends ActionMobile
{
    /**
     *添加会员页面
     */
    public function add(){
        $this->loadCss("resources/css/address.css");
        $this->loadCss("resources/css/msg.css");
        $this->loadCss("resources/css/myscroll.css");
        $this->loadCss("resources/css/scrollbar.css");
        $this->loadJs("js/iscroll.js");
        $this->loadJs("js/myscroll.js");
        $this->loadJs("js/msg.js"); 
        $this->loadJs("js/member.js"); 
        $this->view->set("site_name","绑定会员卡");
    }

    /**
     *添加会员
     */
    public function addAjax(){
        $isok = true;
        $data = array();
        $data['realname']= isset($_POST['name'])?$_POST['name']:"";
        $data['password'] = "";
        $data['mobile'] = isset($_POST['mobile'])?$_POST['mobile']:"";
        $data['email'] = "";
        $data['birthday'] = isset($_POST['birthday'])?$_POST['birthday']:"";
        $data['gender'] = isset($_POST['gender'])?$_POST['gender']:"";
        $users = Usersinfo::get_one("mobile='".$data['mobile']."'");
        if ($users) {
            $response = array(
                "success" => "no",
                "title" => "失败",
                "data" => "此手机号已被绑定！"
            );
            $isok = flase;
        }else{
            $member = UtilApi::getMember($data['mobile']);
            if ($member->code != "A00006") {
                $result = UtilApi::member_add($data);
                if ($result->code != "A00006") {
                    $response = array(
                        "success" => "no",
                        "title" => "失败",
                        "data" => $result->result
                    );
                    $isok = flase;
                }
            }
        }
        
        if ($isok) {
            $usersinfo = new  Usersinfo();
            $usersinfo->name = $data['realname'];
            $usersinfo->birthday = $data['birthday'];
            $usersinfo->gender = $data['gender'];
            $usersinfo->mobile = $data['mobile'];
            $openid = HttpSession::get("openid");
            $usersinfo->openid = $openid;
            $usersinfo_id = $usersinfo->save();
            HttpSession::set("usersinfo", $usersinfo);
            HttpSession::set("usersinfo_id", $usersinfo_id);
            HttpSession::set("mobile", $usersinfo->mobile);
            $response = array(
                "success" => "success",
                "title" => "温馨提示",
                "data" => "绑定成功!",
                "url" => "index.php?go=youzan.member.info"
            );
            UtilApi::bindCoupon($data['mobile']);
        }
        echo json_encode($response);
        exit;
    }

    /**
     * 会员中心
     */
    public function info()
    {
        $this->loadCss("resources/css/member_info.css");
        $this->loadJs("js/member_info.js"); 
        $mobile = HttpSession::get("mobile");
        if($mobile){
            $data = UtilApi::getMember($mobile);
            $member = $data->data;
            HttpSession::set("cardno",$member->card_no);
        }else{
            $this->redirect("member", "add");
            die();
        }
        $data = array();
        $data['user_mobile'] = $mobile;
        $data['status'] = 0;
        $data['inv_type'] = 2;
        $result = UtilApi::buy_coupon($data);
        if ($result->code == "A00006") {
            $coupon = (array)$result->data;
            $count = count($coupon);
        }else{
            $count = 0 ;
        }
        $this->view->set("member",$member);
        $this->view->set("count",$count);
        $this->view->set("site_name","会员中心");
    }

    /**
     * 修改会员信息
     */
    public function edit(){
        $this->loadCss("resources/css/address.css");
        $this->loadCss("resources/css/msg.css");
        $this->loadCss("resources/css/myscroll.css");
        $this->loadCss("resources/css/scrollbar.css");
        $this->loadJs("js/iscroll.js");
        $this->loadJs("js/myscroll.js");
        $this->loadJs("js/msg.js"); 
        $this->loadJs("js/member.js"); 
        $openid = HttpSession::get("openid");
        $member = Usersinfo::get_one("openid='".$openid."'");
        $this->view->set("member",$member);
        $this->view->set("site_name","修改会员信息");
    }

    public function ajaxEdit(){
        $usersinfo = Usersinfo::get_by_id($_POST['usersinfo_id']);
        $usersinfo->name = $_POST['name'];
        $usersinfo->birthday = $_POST['birthday'];
        $usersinfo->gender = $_POST['gender'];
        $usersinfo->mobile = $_POST['mobile'];
        $usersinfo_id = $usersinfo->update();
        $response = array(
            "success" => "success",
            "title" => "温馨提示",
            "data" => "修改成功!",
            "usres" => $usersinfo,
            "url" => "index.php?go=youzan.member.info"
        );
        echo json_encode($response);
        exit;
    }
}

?>