<?php
namespace Api\Controller;

use Api\Exception\CommonException;

class UserController extends RestCommonController {

    protected $allowMethod = array('get','post','put');

    public function profile_get(){
        if(!$this->uid)
            $this->responseError(new CommonException('200102'));
        $result = D('User')->find($this->uid);
        $invite_list = D('InviteCode')->where(array('from_uid'=>$this->uid))
            ->join('left join tb_user_info on tb_invite_code.to_uid = tb_user_info.uid')
            ->field('tb_invite_code.*,truename,relation')->select();
        $result['used_code_count'] = 0;
        $result['generated_code_count'] = 0;
        foreach($invite_list as $invite){
            if($invite['to_uid']) $result['used_code_count']++;
            $result['generated_code_count']++;
        }
        $result['invite_list'] = $invite_list;
        $result['user_info'] = D('UserInfo')->where(array('uid'=>$this->uid))->find();
        $this->responseSuccess($result);
    }

    public function set_uid_for_test(){
        cookie('wechat_id',$_GET['wechat_id']?$_GET['wechat_id']:'o0-6is0a3sVuq5851uFftcAC7KgI');
    }



}
