<?php

define('APP_DEBUG', true);
define('DOCUMENT_ROOT', dirname(__FILE__));
define('SITE_PREFIX', 'threedegrees_' );
define('SITE_TITLE', 'ThreeDegrees' );
define('SITE_URL', ($_SERVER['REQUEST_SCHEME'] ?: 'http').'://'.$_SERVER['HTTP_HOST'].'/');
define('BASE_URL', $_SERVER['SCRIPT_NAME'] ? strtr($_SERVER['SCRIPT_NAME'], array('/index.php' => '')) : '');
define('SITE_NAME', 'ThreeDegrees');
define('APP_PATH','../Application/');
require '../ThinkPHP/ThinkPHP.php';
