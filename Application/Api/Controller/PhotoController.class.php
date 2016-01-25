<?php
namespace Api\Controller;

use Api\Exception\CommonException;
use Common\Util\Privilege;

class PhotoController extends RestCommonController {

    public function upload_post(){
        if(!$this->uid)
            $this->responseError(new CommonException('200102'));
        $userInfo = Privilege::isValidUser($this->uid);
        if(!$userInfo) $this->responseError(new CommonException('200101'));
        $this->do_upload();
    }

    public function remove_get(){
        if(!$this->uid)
            $this->responseError(new CommonException('200102'));
        $userInfo = Privilege::isValidUser($this->uid);
        if(!$userInfo) $this->responseError(new CommonException('200101'));
        D('Photo')->where(array('pid'=>I('get.pid',-1,'intval'),'uid'=>$this->uid))->save(array('status'=>0));
        $this->responseSuccess(array('result'=>1));
    }

    private function do_upload(){
        // Make sure file is not cached (as it happens for example on iOS devices)
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
        header("Cache-Control: no-store, no-cache, must-revalidate");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            exit; // finish preflight CORS requests here
        }
        if ( !empty($_REQUEST[ 'debug' ]) ) {
            $random = rand(0, intval($_REQUEST[ 'debug' ]) );
            if ( $random === 0 ) {
                header("HTTP/1.0 500 Internal Server Error");
                exit;
            }
        }
        @set_time_limit(5 * 60);
        $uploadBaseDir = DOCUMENT_ROOT.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR;
        $targetDir = $uploadBaseDir.'tmp';
        $uploadDir = $uploadBaseDir. date('Y'.DIRECTORY_SEPARATOR.'m');
        $cleanupTargetDir = true; // Remove old files
        $maxFileAge = 5 * 3600; // Temp file age in seconds
        // Create target dir
        if (!file_exists($targetDir)) {
            @mkdir($targetDir);
        }
        // Create target dir
        if (!file_exists($uploadDir)) {
            @mkdir($uploadDir);
        }
        // Get a file name
//        if (isset($_REQUEST["name"])) {
//            $fileName = $_REQUEST["name"];
//        } elseif (!empty($_FILES)) {
//            $fileName = $_FILES["file"]["name"];
//        } else {
//            $fileName = uniqid("file_");
//        }
        $fileName = uniqid("pic_");
        $md5File = @file($uploadBaseDir.'md5list2.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $md5File = $md5File ? $md5File : array();
        if (isset($_REQUEST["md5"]) && array_search($_REQUEST["md5"], $md5File ) !== FALSE ) {
            die('{"jsonrpc" : "2.0", "result" : null, "id" : "id", "exist": 1}');
        }
        $filePath = $targetDir . DIRECTORY_SEPARATOR . $fileName;
        $uploadPath = $uploadDir . DIRECTORY_SEPARATOR . $fileName;
        // Chunking might be enabled
        $chunk = isset($_REQUEST["chunk"]) ? intval($_REQUEST["chunk"]) : 0;
        $chunks = isset($_REQUEST["chunks"]) ? intval($_REQUEST["chunks"]) : 0;
        // Remove old temp files
        if ($cleanupTargetDir) {
            if (!is_dir($targetDir) || !$dir = opendir($targetDir)) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 100, "message": "Failed to open temp directory."}, "id" : "id"}');
            }
            while (($file = readdir($dir)) !== false) {
                $tmpfilePath = $targetDir . DIRECTORY_SEPARATOR . $file;
                // If temp file is current file proceed to the next
                if ($tmpfilePath == "{$filePath}.part") {
                    continue;
                }
                // Remove temp file if it is older than the max age and is not the current file
                if (preg_match('/\.part$/', $file) && (filemtime($tmpfilePath) < time() - $maxFileAge)) {
                    @unlink($tmpfilePath);
                }
            }
            closedir($dir);
        }
        // Open temp file
        if (!$out = @fopen("{$filePath}.part", $chunks ? "ab" : "wb")) {
            die('{"jsonrpc" : "2.0", "error" : {"code": 102, "message": "Failed to open output stream."}, "id" : "id"}');
        }
        if (!empty($_FILES)) {
            if ($_FILES["file"]["error"] || !is_uploaded_file($_FILES["file"]["tmp_name"])) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 103, "message": "Failed to move uploaded file."}, "id" : "id"}');
            }
            // Read binary input stream and append it to temp file
            if (!$in = @fopen($_FILES["file"]["tmp_name"], "rb")) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}, "id" : "id"}');
            }
        } else {
            if (!$in = @fopen("php://input", "rb")) {
                die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}, "id" : "id"}');
            }
        }
        while ($buff = fread($in, 4096)) {
            fwrite($out, $buff);
        }
        @fclose($out);
        @fclose($in);
        // Check if file has been uploaded
        if (!$chunks || $chunk == $chunks - 1) {
            // Strip the temp .part suffix off
            rename("{$filePath}.part", $filePath);
            rename($filePath, $uploadPath);
            array_push($md5File, $this->mymd5($uploadPath));
            $md5File = array_unique($md5File);
            file_put_contents($uploadBaseDir.'md5list2.txt', join($md5File, "\n"));
        }

        // Return Success JSON-RPC response
        D('Photo')->add(array(
            'uid'   =>  $this->uid,
            'file_path' =>  str_replace(DOCUMENT_ROOT, '', $uploadPath),
            'status'    =>  1,
        ));
        die('{"jsonrpc" : "2.0", "result" : null, "id" : "id"}');
    }

    private function mymd5( $file ) {
        $fragment = 65536;
        $rh = fopen($file, 'rb');
        $size = filesize($file);
        $part1 = fread( $rh, $fragment );
        fseek($rh, $size-$fragment);
        $part2 = fread( $rh, $fragment);
        fclose($rh);
        return md5( $part1.$part2 );
    }

}
