<?php
namespace Api\Controller;

use Api\Exception\CommonException;
use Common\Util\Degree;

class UserController extends RestCommonController {

    public function profile_get(){
        if(!$this->uid)
            $this->responseError(new CommonException('200102'));
        $uid = I('get.uid', $this->uid);
        if($uid != $this->uid) $this->others_profile($uid);
        $result = D('User')->find($this->uid);
        $invite_list = D('InviteCode')->where(array('from_uid'=>$this->uid))
            ->join('left join tb_user_info on tb_invite_code.to_uid = tb_user_info.uid')
            ->field('tb_invite_code.*,truename,relation,is_single')->select();
        $result['used_code_count'] = 0;
        $result['generated_code_count'] = 0;
        foreach($invite_list as $invite){
            if($invite['to_uid']) $result['used_code_count']++;
            $result['generated_code_count']++;
        }
        $result['invite_list'] = $invite_list;

        $result['user_info'] = D('UserInfo')->where(array('uid'=>$this->uid))->find();
        if(!$result['user_info']){
            D('User')->createUserInfoItem($this->uid);
            $result['user_info'] = D('UserInfo')->where(array('uid'=>$this->uid))->find();
        }

        $like_me = D('Like')->where(array('to_uid'=>$this->uid, 'like_status'=>1))
            ->join('left join tb_user_info on tb_like.from_uid = tb_user_info.uid')
            ->field('truename,relation,uid')->select();
        $i_like = D('Like')->where(array('from_uid'=>$this->uid, 'like_status'=>1))
            ->join('left join tb_user_info on tb_like.to_uid = tb_user_info.uid')
            ->field('truename,relation,uid')->select();

        $result['like_me'] = $like_me;
        $result['i_like'] = $i_like;

        $this->responseSuccess($result);
    }

    private function others_profile($uid){
        $myUser = D('User')->find($this->uid);
        //非验证用户无法访问
        if($myUser['verified'] != 1)
            $this->responseError(new CommonException('200101'));
        $myUserInfo = D('UserInfo')->find($this->uid);
        //未选择身份无法访问
        if($myUserInfo['is_single'] == -1)
            $this->responseError(new CommonException('200101'));
        //介绍人身份
        if($myUserInfo['is_single'] == 0){
            //只能访问自己邀请的人的信息
            $myInvites = D('InviteCode')->where(array('from_uid'=>$this->uid))->select();
            $myInviteUids = array();
            foreach ($myInvites as $value)
                if($value['to_uid'])
                    $myInviteUids[] = $value['to_uid'];
            if(!in_array($uid, $myInviteUids))
                $this->responseError(new CommonException('200101'));
        }

        $result = D('User')->where(array('verified'=>1))->find($uid);
        //不允许访问错误的uid，或者未认证的uid
        if(!$result) $this->responseError(new CommonException('200101'));
        unset($result['openid']);
        $result['user_info'] = D('UserInfo')->where(array('uid'=>$uid))->find();
        if(!$result['user_info']){
            D('User')->createUserInfoItem($uid);
            $result['user_info'] = D('UserInfo')->where(array('uid'=>$uid))->find();
        }
        //不允许访问介绍人或未选身份人的信息
        if($result['user_info']['is_single'] != 1){
            $this->responseError(new CommonException('200101'));
        }
        $result['relation_text'] = Degree::getRelationText($this->uid, $uid);
        $this->responseSuccess($result);
    }

    public function profile_post(){
        $request = $_REQUEST;
        if(!$this->uid)
            $this->responseError(new CommonException('200102'));

        $allow_fields = array("is_single","truename","relation","gender","birthday","constellation","height","weight","current_location","future_location","month_income","homeland","people","animal","parent","siblings","smoking","drinking","year_before_marriage","child_count","hobby","self_comment","r_age","r_height","r_education","r_location","r_income","r_comment");
        $field_to_save = array('uid'=>$this->uid);
        foreach($request as $field=>$value){
            if(in_array($field, $allow_fields)) $field_to_save[$field] = $value;
        }
        D('User')->createUserInfoItem($this->uid);
        D('UserInfo')->save($field_to_save);
        $this->responseSuccess(array('result'=>1));
    }

    public function list_get(){

    }

    public function set_uid_for_test(){
        cookie('wechat_id',$_GET['wechat_id']?$_GET['wechat_id']:'o0-6is0a3sVuq5851uFftcAC7KgI');
    }



}
