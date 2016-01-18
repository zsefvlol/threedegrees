<?php
/**
 * Created by PhpStorm.
 * User: Mengtian
 * Date: 2016/1/18
 * Time: 21:11
 */
namespace Api\Util;

use Common\Util\Degree;
use Common\Util\ImWx;

class WxHandler{

    public static function handleCode($code){
        $openid = ImWx::getRequestUserId();
        $userInfo = D('User')->getUserFromOpenId($openid);
        if($userInfo['verified'] == 1)
            ImWx::fetchTextResult('您已经完成验证，无需再次输入邀请码。请进入'.self::generateEntryUrl().'。');
        $exist = D('InviteCode')->where(array('code'=>$code))->find();
        if(!$exist)
            ImWx::fetchTextResult('您输入的邀请码有误，请核实后再试。');
        if($exist['to_uid'] || $exist['use_time'])
            ImWx::fetchTextResult('您输入的邀请码已被使用过，您可以请求推荐人为您申请新的邀请码。');
        D('InviteCode')->where(array('code'=>$code))->save(array(
            'to_uid'    =>  $userInfo['uid'],
            'use_time'  =>  time()
        ));
        $degree = Degree::getDegreeByUid($userInfo['uid']);
        D('User')->where(array('uid'=>$userInfo['uid']))->save(array(
            'verified'  =>  1,
            //当前仅允许1度邀请12个人
            'degree'    =>  $degree == 1 ? 12 : 0,
        ));
        ImWx::fetchTextResult('验证成功。请进入'.self::generateEntryUrl().'。');
    }

    public static function generateEntryUrl($text = '个人中心'){
        $openid = ImWx::getRequestUserId();
        return '<a href="'.SITE_URL.'index/wechat_entrance/wechat_id/'.$openid
            .'">'.$text.'</a>(链接包含您的登录信息，请不要分享)';
    }

}