<?php
namespace Api\Controller;

use Api\Exception\CommonException;
use Common\Util\Degree;
use Common\Util\Privilege;
use Common\Util\IP;

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

        $result['photo'] = D('Photo')->where(array('uid'=>$this->uid,'status'=>1));

        if ($result['user_info']['is_single'] == -1) {
            $ip = IP::getClinetIP();
            $ip = '220.181.38.116';
            $loc = IP::find($ip);
            $result['user_info']['loc'] = is_array($loc) ? $loc : array();
        }

        $this->responseSuccess($result);
    }

    private function others_profile($uid){
        /*
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
        */
        $userInfos = Privilege::canIntereact($this->uid, $uid);
        if(!$userInfos) $this->responseError(new CommonException('200101'));
        $fromUserInfo = $userInfos[0];
        $toUserInfo = $userInfos[1];
        //不允许单身访问同性的信息
        if($fromUserInfo['is_single']==1 && $toUserInfo['user_info']['gender'] == $fromUserInfo['user_info']['gender'])
            $this->responseError(new CommonException('200101'));
        unset($toUserInfo['openid']);
        $toUserInfo['relation_text'] = Degree::getRelationText($this->uid, $uid);
        $toUserInfo['photo'] = D('Photo')->where(array('uid'=>$uid,'status'=>1));
        D('ViewLog')->add(array(
            'from_uid'  =>  $this->uid,
            'to_uid'    =>  $uid,
            'view_time' =>  time()
        ));
        $this->responseSuccess($toUserInfo);
    }

    public function profile_post(){
        $request = $_REQUEST;
        if(!$this->uid)
            $this->responseError(new CommonException('200102'));
        $myUser = D('User')->find($this->uid);
        //非验证用户无法访问
        if($myUser['verified'] != 1)
            $this->responseError(new CommonException('200101'));

        $allow_fields = array("is_single","wechat_id","truename","relation","gender","birthday","constellation","height","weight","current_location","future_location","month_income","homeland","people","animal","parent","siblings","smoking","drinking","year_before_marriage","child_count","hobby","self_comment","r_age","r_height","r_education","r_location","r_income","r_comment");
        $field_to_save = array('uid'=>$this->uid);
        foreach($request as $field=>$value){
            if(in_array($field, $allow_fields)) $field_to_save[$field] = $value;
        }
        D('User')->createUserInfoItem($this->uid);
        D('UserInfo')->save($field_to_save);
        $this->responseSuccess(array('result'=>1));
    }

    public function list_get(){
        $page = I('get.page',1);
        $limit = I('get.limit',10);
        if(!$this->uid)
            $this->responseError(new CommonException('200102'));
        $fromUser = Privilege::isValidUser($this->uid);
        if(!$fromUser) $this->responseError(new CommonException('200101'));

        //介绍人身份
        $filter = array('is_single' =>  '1');
        if($fromUser['user_info']['is_single'] == 0){
            //只能访问自己邀请的人的信息
            $myInvites = D('InviteCode')->where(array('from_uid'=>$this->uid))->select();
            $myInviteUids = array();
            foreach ($myInvites as $value)
                if($value['to_uid'])
                    $myInviteUids[] = $value['to_uid'];
            $filter['uid'] = array('in',$myInviteUids);
        }else{
            //单身不允许访问同性
            $filter['gender'] = $fromUser['user_info']['gender'] == '男' ? '女' : '男';
        }
        $list = D('UserInfo')->where($filter)
            ->field('uid,truename,birthday,height,weight,current_location,future_location,hobby,self_comment')
            ->page($page, $limit)->order('uid desc')->select();

        foreach($list as $k=>$user){
            $list[$k]['age'] = intval(date('Y')) - intval(substr($user['birthday'],0,4));
        }

        $this->responseSuccess($list);

    }

    public function set_uid_for_test(){
        cookie('wechat_id',$_GET['wechat_id']?$_GET['wechat_id']:'o0-6is0a3sVuq5851uFftcAC7KgI');
    }

    public function generate_code_get(){
        if(!$this->uid)
            $this->responseError(new CommonException('200102'));
        $userInfo = Privilege::isValidUser($this->uid);
        $generatedCount = D('InviteCode')->where(array('from_uid'=>$this->uid))->count();
        if($generatedCount >= $userInfo['allow_invite_count']){
            $this->responseError(new CommonException('200104'));
        }
        $max_tried_time = 0;
        while($max_tried_time++ < 10){
            $code = rand(10000000,99999999);
            $exist = D('InviteCode')->where(array('code'=>$code))->find();
            if($exist) continue;
            D('InviteCode')->add(array('code'=>$code,'from_uid'=>$this->uid,'create_time'=>time()));
            $this->responseSuccess(array('code'=>$code));
        }

        $this->responseError(new CommonException('200401'));
    }



}
