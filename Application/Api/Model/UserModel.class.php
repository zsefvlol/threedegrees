<?php
namespace Api\Model;

use Think\Model;

class UserModel extends Model{

    public function getUserFromOpenId($openid){
        $exist = D('User')->where(array('openid'=>$openid))->find();
        if($exist) return $exist;
        else {
            D('User')->add(array(
                'openid'    =>  $openid,
                'create_time'   =>  date('Y-m-d H:i:s')
            ));
            return $this->getUserFromOpenId($openid);
        }
    }

}