<?php

define('FRONTEND_DEBUG',false);
define('DOCUMENT_ROOT', dirname(__FILE__));
define('SITE_PREFIX', 'threedegrees_' );
define('SITE_TITLE', 'ThreeDegrees' );
define('SITE_URL', 'http://'.$_SERVER['HTTP_HOST'].'/');
define('SITE_NAME', 'ThreeDegrees');
define('APP_PATH', DOCUMENT_ROOT.'/../Application/');
define('STATIC_URL', FRONTEND_DEBUG ? 'http://'.$_SERVER['HTTP_HOST'].':8080/static' : '/static');
define('BASE_URL', FRONTEND_DEBUG ? strtr($_SERVER['SCRIPT_NAME'], array('/index.php' => '')) : '');
require '../ThinkPHP/ThinkPHP.php';
