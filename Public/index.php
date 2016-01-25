<?php

define('APP_DEBUG',True);
define('DOCUMENT_ROOT', dirname(__FILE__));
define('SITE_PREFIX', 'threedegrees_' );
define('SITE_TITLE', 'ThreeDegrees' );
define('SITE_URL', 'http://'.$_SERVER['HTTP_HOST'].'/');
define('SITE_NAME', 'ThreeDegrees');
define('APP_PATH','../Application/');
define('STATIC_URL', APP_DEBUG ? 'http://'.$_SERVER['HTTP_HOST'].':8080/static' : '/static');
define('BASE_URL', APP_DEBUG ? strtr($_SERVER['SCRIPT_NAME'], array('/index.php' => '')) : '');
require '../ThinkPHP/ThinkPHP.php';
