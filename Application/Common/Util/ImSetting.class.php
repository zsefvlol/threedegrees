<?php
namespace Common\Util;
/**
 * 设置类
 * 可用于自定义设置项和内容。
 * @author mengtian.wen
 */
class ImSetting
{

	static $dao;
	static $expire = 86400;

	private function init(){
		if (!self::$dao) {
			self::$dao = D('Setting');
		}
	}

	/**
	 * 设置
	 * @param string $type
	 * @param string $key
	 * @param string $value
	 */
	public static function set($type,$key,$value){
		self::init();
		$map = array('type'=>$type,'skey'=>$key);
		$id = self::$dao->where($map)->getField('id');
		$map['svalue'] = $value;
		if ($id) {
			$map['id'] = $id;
			self::$dao->save($map);
		}
		else self::$dao->add($map);
	}

	/**
	 * 增加某字段的值
	 * @param string $type
	 * @param string $key
	 * @param int $int 增加的量
	 * @param int $max 最大值，默认不限制，如果给定，当增加后的值超过$max，则将值设定为$max
	 * @return int $svalue 当前值
	 */
	public static function setInc($type,$key,$inc,$max=false){
		self::init();
		$valNow = self::get($type,$key);
		$valNow = $valNow ? $valNow : 0;
		$map = array('type'=>$type,'skey'=>$key);
		$id = self::$dao->where($map)->getField('id');
		$map['svalue'] = $valNow + $inc;
		if ($max && $map['svalue'] > $max) $map['svalue'] = $max;
		if ($id) {
			$map['id'] = $id;
			self::$dao->save($map);
		}
		else self::$dao->add($map);

		return $map['svalue'];
	}

	/**
	 * 获取配置信息。
	 * 传type和key，返回是字符串的value值。
	 * 只传type不传key，返回一维数组，键名为key，键值value。
	 * 啥都不传，返回二维数组，第一维键名为type
	 * @param string $type
	 * @param string $key
	 * @return mixed
	 */
	public static function get($type='',$key=''){
		self::init();
		$map = array();
		if ($type) $map['type'] = $type;
		if ($key) $map['skey'] = $key;
		$result = self::$dao->where($map)->select();
		if (isset($map['skey'])) {
			return $result[0]['svalue'];
		}
		elseif (isset($map['type'])){
			foreach ($result as $k => $v)
				$formattedResult[$v['skey']] = $v['svalue'];
			return $formattedResult;
		}
		else {
			foreach ($result as $k => $v)
				$formattedResult[$v['type']][$v['skey']] = $v['svalue'];
			return $formattedResult;
		}
	}

}
