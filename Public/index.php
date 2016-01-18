<?php
define('APP_DEBUG',True);
define('DOCUMENT_ROOT', dirname(__FILE__));
define('SITE_PREFIX', 'threedegrees_' );
define('SITE_TITLE', 'ThreeDegrees' );
define('SITE_URL', 'http://'.$_SERVER['HTTP_HOST'].'/');
define('SITE_NAME', 'ThreeDegrees');
define('APP_PATH','../Application/');
require '../ThinkPHP/ThinkPHP.php';
