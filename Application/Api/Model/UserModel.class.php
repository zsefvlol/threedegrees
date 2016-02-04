<?php
namespace Api\Model;

use Think\Model;

class UserModel extends Model{

    public function getUserFromOpenId($openid){
        $exist = $this->where(array('openid'=>$openid))->find();
        if($exist) return $exist;
        else {
            $uid = $this->add(array(
                'openid'    =>  $openid,
                'create_time'   =>  date('Y-m-d H:i:s'),
            ));
            $this->createUserInfoItem($uid);
            return $this->getUserFromOpenId($openid);
        }
    }

    public function createUserInfoItem($uid){
        if(!$uid) return;
        if(!D('UserInfo')->find($uid))
            D('UserInfo')->add(array(
                'uid'   =>  $uid,
                'birthday'  =>  '1990-01-01',
                'height'  =>  150,
                'weight'  =>  60,
                'is_single' =>  -1
            ));
    }

}