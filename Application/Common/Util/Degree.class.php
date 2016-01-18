<?php

namespace Common\Util;

class Degree{

    private static $MAX_DEGREE = 5;

    public static function getDegreeByUid($uid){
        $zero_degree_uid = self::getZeroDegreeUser();
        if($uid == $zero_degree_uid) return 0;
        $degree = 0;
        while($degree ++ < self::$MAX_DEGREE){
            $uid = D('InviteCode')->where(array('to_uid'=>$uid))->getField('from_uid');
            if($uid == $zero_degree_uid) break;
        }
        return $degree;
    }

    public static function getZeroDegreeUser(){
        return C('ZERO_DEGREE_UID');
    }

}