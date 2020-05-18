<?php
//加载初始化设置
class_exists("Service")||require("../init.php");
/**
 +---------------------------------------<br/>
 * 服务类:会员<br/>
 +---------------------------------------
 * @category kmall
 * @package admin.services
 * @subpackage ext
 * @author skygreen skygreen2001@gmail.com
 */
class ExtServiceMember extends ServiceBasic
{
    /**
     * 保存数据对象:会员
     * @param array|DataObject $member
     * @return int 保存对象记录的ID标识号
     */
    public function save($member)
    {
        if ($member["username"]){
            $member_name= $member["username"];
            $member_had=Member::get_one("username='".$member_name."'");
            if ($member_had){
                return array(
                    'success' => false,
                    'msg'    => "用户名:{$member_name}已存在，请尝试使用别的用户名注册！",
                );
            }
        }
        if (isset($member["isCanEmail"])&&($member["isCanEmail"]=='1'))$member["isCanEmail"]=true; else $member["isCanEmail"]=false;
        if (isset($member["isCanSms"])&&($member["isCanSms"]=='1'))$member["isCanSms"]=true; else $member["isCanSms"]=false;
        if (isset($member["isValEmail"])&&($member["isValEmail"]=='1'))$member["isValEmail"]=true; else $member["isValEmail"]=false;
        if (isset($member["isValSms"])&&($member["isValSms"]=='1'))$member["isValSms"]=true; else $member["isValSms"]=false;
        if (isset($member["isValCard"])&&($member["isValCard"]=='1'))$member["isValCard"]=true; else $member["isValCard"]=false;
        $member["regtime"]=UtilDateTime::dateToTimestamp($member["regtime"]);
        if(!empty($member["password"])){
            $member["password"]=md5($member["password"]);
        }
        if (is_array($member)){
            $memberObj=new Member($member);
        }

        $jifenlog = new Jifenlog();
        $isSave = true;
        if (!empty($memberObj->mobile)) {
          $hadMember=Member::get_one("mobile='" . $memberObj->mobile . "'");
          if ($hadMember!=null) {
            $isSave = false;
          }
        }
        if ($isSave) {
          if ($memberObj instanceof Member){
              $data=$memberObj->save();
              $jifenlog->member_id = $result;
              $jifenlog->jifenoriginal = 0;
              $jifenlog->jifenraise = $member->jifen;

              $message = "后台会员保存，券增加:" . intval($jifenlog->jifenraise) . "！ ";
              $jifenlog->discribe = $message;
              $jifenlog->discribe = $message;
              $jifenlog->save();
          }else{
              $data=false;
          }
        } else {
          $jifenlog->member_id = $hadMember->member_id;
          $member->member_id = $hadMember->member_id;
          if ($memberObj->jifen) {
            $sum_jifen = $memberObj->jifen + $hadMember->jifen;
            $member->jifen = $sum_jifenn;
            $result = $member->update();
            $jifenlog->jifenoriginal = $hadMember->jifen;
            $jifenlog->jifenraise = $member->jifen;

            $message = "后台会员变更，券增加:" . intval($jifenlog->jifenraise) . "！ ";
            $jifenlog->discribe = $message;
            $jifenlog->save();
          }
        }

        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 更新数据对象 :会员
     * @param array|DataObject $member
     * @return boolen 是否更新成功；true为操作正常
     */
    public function update($member)
    {
        if ($member["username"]){
            $member_name= $member["username"];
            $member_had=Member::get_one("username='".$member_name."' and member_id!=".$member["member_id"]);
            if ($member_had){
                return array(
                    'success' => false,
                    'msg'    => "用户名:{$member_name}已存在，请尝试使用别的用户名注册！",
                );
            }
        }
        if (isset($member["isCanEmail"])&&($member["isCanEmail"]=='1'))$member["isCanEmail"]=true; else $member["isCanEmail"]=false;
        if (isset($member["isCanSms"])&&($member["isCanSms"]=='1'))$member["isCanSms"]=true; else $member["isCanSms"]=false;
        if (isset($member["isValEmail"])&&($member["isValEmail"]=='1'))$member["isValEmail"]=true; else $member["isValEmail"]=false;
        if (isset($member["isValSms"])&&($member["isValSms"]=='1'))$member["isValSms"]=true; else $member["isValSms"]=false;
        if (isset($member["isValCard"])&&($member["isValCard"]=='1'))$member["isValCard"]=true; else $member["isValCard"]=false;
        $member["regtime"]=UtilDateTime::dateToTimestamp($member["regtime"]);
        if (is_array($member)){
            $memberObj=new Member($member);
        }
        if ($memberObj instanceof Member){
            if(!empty($memberObj->password))
            {
                $memberObj->password=md5($memberObj->password);
            }else{
                $memberObj->password= $member["password_old"];
            }
            $data=$memberObj->update();
        }else{
            $data=false;
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 根据主键激活数据对象:会员的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4
     * @return boolen 是否激活成功；true为操作正常
     */
    public function activeByIds($ids)
    {
        $ids=preg_split('/[,， ]/', $ids);
        // LogMe::log("activeByIds:" . print_pre($ids));
        foreach ($ids as $id) {
            if (!empty($id)) {
                $member = Member::get_by_id($id);
                if ($member) {
                    if (!empty($member->mobile)){
                        // $content = "【菲生活】亲爱的会员，请用您的手机号码+密码: 123456登录菲生活网 http://www.phoebelife.com 进行积分兑换，祝你购物愉快！";
                        $content = "【菲彼生活】您的券已激活，账户为手机号，密码123456，关注公众号“菲彼生活”购买，正品行货假一罚十，祝您愉快！";
                        $isSendSucc = UtilSMS::send($member->mobile,$content);
                        $password = md5("123456");
                        Member::updateProperties($id, array("isActive"=>true, "password"=>$password));
                    }
                }
            }
        }
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 根据主键删除数据对象:会员的多条数据记录
     * @param array|string $ids 数据对象编号
     * 形式如下:
     * 1.array:array(1,2,3,4,5)
     * 2.字符串:1,2,3,4
     * @return boolen 是否删除成功；true为操作正常
     */
    public function deleteByIds($ids)
    {
        $data=parent::deleteByIds($ids);
        return array(
            'success' => true,
            'data'    => $data
        );
    }

    /**
     * 数据对象:会员分页查询
     * @param stdclass $formPacket  查询条件对象
     * 必须传递分页参数：start:分页开始数，默认从0开始
     *                   limit:分页查询数，默认10个。
     * @return 数据对象:会员分页查询列表
     */
    public function queryPageMember($formPacket=null)
    {
        $start=1;
        $limit=10;
        $condition=UtilObject::object_to_array($formPacket);
        if (isset($condition['start'])){
            $start=$condition['start']+1;
          }
        if (isset($condition['limit'])){
            $limit=$condition['limit'];
            $limit=$start+$limit-1;
        }
        unset($condition['start'],$condition['limit']);
        $condition=$this->filtertoCondition($condition);
        $count=parent::count($condition);
        if ($count>0){
            if ($limit>$count)$limit=$count;
            $data =parent::queryPage($start,$limit,$condition);
            if ((!empty($data))&&(count($data)>0))
            {
                Member::propertyShow($data,array('usertype','sex'));
            }
            foreach ($data as $member) {
                $member["regtime"]=UtilDateTime::timestampToDateTime($member["regtime"]);
                $member->rankshow=$member->getUserrankShow();
                $member_id = $member->member_id;
                $sum_total_amount = Order::sum("total_amount", array("member_id"=>$member_id, "pay_status" => "1"));
                $sum_jifen        = Order::sum("jifen", array("member_id"=>$member_id, "pay_status" => "1"));
                $member->sum_total_amount = $sum_total_amount ? sprintf("%.2f", $sum_total_amount) : 0;
                $member->sum_jifen        = $sum_jifen ? $sum_jifen : 0;
                $member->birthday         = $member->birthday != "0000-00-00" ? $member->birthday : "";
            }
            if ($data==null)$data=array();
        }else{
            $data=array();
        }
        return array(
            'success' => true,
            'totalCount'=>$count,
            'data'    => $data
        );
    }

    /**
     * 批量上传会员
     * @param mixed $upload_file <input name="upload_file" type="file">
     */
    public function import($files)
    {
        $diffpart=date("YmdHis");
        if (!empty($files["upload_file"])){
            $tmptail = end(explode('.', $files["upload_file"]["name"]));
            $uploadPath =GC::$attachment_path."member".DIRECTORY_SEPARATOR."import".DIRECTORY_SEPARATOR."member$diffpart.$tmptail";
            $result     =UtilFileSystem::uploadFile($files,$uploadPath);
            if ($result&&($result['success']==true)){
                if (array_key_exists('file_name',$result)){
                    $arr_import_header = self::fieldsMean(Member::tablename());
                    $data              = UtilExcel::exceltoArray($uploadPath,$arr_import_header);
                    $result=false;
                    foreach ($data as $member) {
                        $member=new Member($member);
                        if (empty($member->username)) {
                          continue;
                        }
                        if (!EnumUsertype::isEnumValue($member["usertype"])){
                            $member["usertype"]=EnumUsertype::usertypeByShow($member["usertype"]);
                        }
                        if (!EnumSex::isEnumValue($member["sex"])){
                            $member["sex"]=EnumSex::sexByShow($member["sex"]);
                        }
                        $member_id=$member->getId();

                        $jifenlog = new Jifenlog();
                        if (!empty($member_id)){
                            $jifenlog->member_id = $member_id;
                            $hadMember=Member::get_by_id($member->getId());
                            if ($hadMember!=null){
                                $jifenlog->jifenoriginal = $member->jifen;
                                $jifenlog->jifenraise = $hadMember->jifen - $member->jifen;
                                $result=$member->update();
                            }else{
                                $isSave = true;
                                if (!empty($member->mobile)) {
                                  $hadMember=Member::get_one("mobile='" . $member->mobile . "'");
                                  if ($hadMember!=null) {
                                    $isSave = false;
                                  }
                                }
                                if ($isSave) {
                                  $result=$member->save();
                                  $jifenlog->member_id = $result;
                                  $jifenlog->jifenoriginal = 0;
                                  $jifenlog->jifenraise = $member->jifen;
                                } else {
                                  $member->member_id = $hadMember->member_id;
                                  $jifenlog->member_id = $hadMember->member_id;
                                  $sum_jifen = $member->jifen + $hadMember->jifen;
                                  $content = "【菲生活】亲爱的会员，本次新增券: " . $member->jifen . "，券余额: " . $sum_jifen . "，祝你购物愉快！";
                                  $isSendSucc = UtilSMS::send($member->mobile,$content);
                                  $member->jifen = $sum_jifenn;

                                  $jifenlog->jifenoriginal = $hadMember->jifen;
                                  $jifenlog->jifenraise = $member->jifen;
                                  $result = $member->update();
                                }
                            }
                        } else {
                            $isSave = true;
                            if (!empty($member->mobile)) {
                              $hadMember=Member::get_one("mobile='" . $member->mobile . "'");
                              if ($hadMember!=null) {
                                $isSave = false;
                              }
                            }
                            if ($isSave) {
                              $result=$member->save();
                              $jifenlog->member_id = $result;
                              $jifenlog->jifenoriginal = 0;
                              $jifenlog->jifenraise = $member->jifen;
                            } else {
                              $jifenlog->member_id = $hadMember->member_id;
                              $member->member_id = $hadMember->member_id;
                              $sum_jifen = $member->jifen + $hadMember->jifen;
                              $content = "【菲生活】亲爱的会员，本次新增券: " . $member->jifen . "，券余额: " . $sum_jifen . "，祝你购物愉快！";
                              $isSendSucc = UtilSMS::send($member->mobile,$content);
                              $member->jifen = $sum_jifenn;
                              $result = $member->update();

                              $jifenlog->jifenoriginal = $hadMember->jifen;
                              $jifenlog->jifenraise = $member->jifen;
                            }
                        }
                        $message = "后台会员批量导入，券增加:" . intval($jifenlog->jifenraise) . "！ ";
                        $jifenlog->discribe = $message;
                        $jifenlog->save();
                    }
                }else{
                    $result=false;
                }
            }else{
                return $result;
            }
        }
        return array(
            'success' => true,
            'data'    => $result
        );
    }

    /**
     * 导出会员
     * @param mixed $filter
     */
    public function exportMember($filter=null)
    {
        if ($filter) $filter=$this->filtertoCondition($filter);
        $data = parent::get($filter);
        if ((!empty($data))&&(count($data)>0))
        {
            Member::propertyShow($data, array('sex'));
            foreach ($data as $member) {
              $member->sex = $member->sexShow;
              if (isset($member->isCanEmail)&&($member->isCanEmail=='1'))$member->isCanEmail="是"; else $member->isCanEmail="否";
              if (isset($member->isCanSms)&&($member->isCanSms=='1'))$member->isCanSms="是"; else $member->isCanSms="否";
              if (isset($member->isValEmail)&&($member->isValEmail=='1'))$member->isValEmail="是"; else $member->isValEmail="否";
              if (isset($member->isValSms)&&($member->isValSms=='1'))$member->isValSms="是"; else $member->isValSms="否";
              if (isset($member->isValCard)&&($member->isValCard=='1'))$member->isValCard="是"; else $member->isValCard="否";
            }
        }
        $arr_output_header= self::fieldsMean(Member::tablename());
        unset($arr_output_header['usertype'], $arr_output_header['sexShow']);
        unset($arr_output_header['updateTime']);
        unset($arr_output_header['commitTime']);
        $diffpart=date("YmdHis");
        $outputFileName=Gc::$attachment_path."member".DIRECTORY_SEPARATOR."export".DIRECTORY_SEPARATOR."member$diffpart.xls";
        UtilFileSystem::createDir(dirname($outputFileName));
        UtilExcel::arraytoExcel($arr_output_header,$data,$outputFileName,false);
        $downloadPath  =Gc::$attachment_url."member/export/member$diffpart.xls";
        return array(
            'success' => true,
            'data'    => $downloadPath
        );
    }

    /**
     * 更新会员积分
     * @param array|DataObject $member
     * @return boolen 是否更新成功；true为操作正常
     */
    public function updatejifen($member)
    {
        if (is_numeric($member["jifenrevise"])&&is_numeric($member["rankjifenrevise"])){
            $memberoriginal = Member::get_by_id($member["member_id"]);
            $tip = EnumOperation::operationShow("1");
            $tip_enum = EnumOperation::operationByshow($tip);
            if($member["jifenrevise"]!=0){
                $jifenlog = new Jifenlog();
                $jifenlog->member_id = $member["member_id"];
                $jifenlog->jifenoriginal = $member["jifen"];
                if($member["jifenrevise"]>0){
                    $jifenlog->jifenraise = $member["jifenrevise"];
                    $message1 = "消费券增加<font color=red>".abs($member["jifenrevise"])."</font>！ ";
                }else{
                    $jifenlog->jifenreduce = $member["jifenrevise"];
                    $message1 = "消费券减少<font color=red>".abs($member["jifenrevise"])."</font>！ ";
                }
                $jifenlog->discribe = $tip;
                $jifenlog->discribe_enum = $tip_enum;
                $jifenlog->save();
                $member["jifen"] = $memberoriginal->jifen+$member["jifenrevise"];
            }else{
                $message1 = "";
            }
            if($member["rankjifenrevise"]!=0){
                $rankjifenlog = new Rankjifenlog();
                $rankjifenlog->member_id = $member["member_id"];
                $rankjifenlog->jifenoriginal = $memberoriginal["rankjifen"];
                if($member["rankjifenrevise"]>0){
                    $rankjifenlog->jifenraise = $member["rankjifenrevise"];
                    $message2 = "等级券增加<font color=red>".abs($member["rankjifenrevise"])."</font>！";
                }else{
                    $rankjifenlog-> jifenreduce= $member["rankjifenrevise"];
                    $message2 = "等级券减少<font color=red>".abs($member["rankjifenrevise"])."</font>！";
                }
                $rankjifenlog->discribe = $tip;
                $rankjifenlog->discribe_enum = $tip_enum;
                $rankjifenlog->save();
                $member["rankjifen"] = $memberoriginal->rankjifen+$member["rankjifenrevise"];
            }
            else{
                $message2 = "";
            }
            if($message1||$message2){
                $msg = "您所做的修改为：".$message1.$message2;
            }else{
                $msg = "您未做任何修改！";
            }
            Member::updateProperties($member["member_id"],array("jifen"=>$member["jifen"],"rankjifen"=>$member["rankjifen"]));
        } else{
            return array(
                'success' => false,
                'msg'    => "券只能为整数！"
                );
        }
        return array(
            'success' => true,
            'msg'     => $msg,
            'data'    => true
        );
    }
}
?>
