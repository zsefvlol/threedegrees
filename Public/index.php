<?php

define('APP_DEBUG', true);
define('FE_DEBUG', false);
define('DOCUMENT_ROOT', dirname(__FILE__));
define('SITE_PREFIX', 'threedegrees_' );
define('SITE_TITLE', 'ThreeDegrees' );
define('SITE_URL', 'http://'.$_SERVER['HTTP_HOST'].'/');
define('SITE_NAME', 'ThreeDegrees');
define('APP_PATH', DOCUMENT_ROOT.'/../Application/');
define('BASE_URL', strtr($_SERVER['SCRIPT_NAME'], array('/index.php' => '')));
define('STATIC_URL', FE_DEBUG ? 'http://'.$_SERVER['HTTP_HOST'].':8080/static' : BASE_URL.'/static');
require '../ThinkPHP/ThinkPHP.php';
