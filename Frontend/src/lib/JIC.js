/*!
 * JIC JavaScript Library v1.1.1
 * https://github.com/brunobar79/J-I-C/
 *
 * Copyright 2015, Bruno Barbieri
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: Tue May 19 21:30:03 2015 -0400
 */



/**
 * Create the jic object.
 * @constructor
 */

var jic = {

    /**
     * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
     * @param {Image} source The source Image Object
     * @param {Integer} quality The output quality of Image Object
     * @param {String} output format. Possible values are jpg and png
     * @return {String} newImageData The compressed Image Object
     */
    compress: function (source, quality, output_format, max_size) {
        max_size = max_size || 800;
        var mime_type = 'image/jpeg';
        if (typeof output_format !== 'undefined' && output_format === 'png') {
            mime_type = 'image/png';
        }
        var width  = source.naturalWidth || source.width;
        var height  = source.naturalHeight || source.height;
        var cvs = document.createElement('canvas');
        var max = Math.max(width, height);
        var zoom = max >= max_size ? max_size / max : 1;
        cvs.width = Math.round(width * zoom);
        cvs.height = Math.round(height * zoom);
        var ctx = cvs.getContext('2d').drawImage(source, 0, 0, cvs.width, cvs.height);
        var newImageData = cvs.toDataURL(mime_type, quality/100);
        return newImageData;
    },

    /**
     * Receives an Image Object and upload it to the server via ajax
     * @param {Image} compressed_img_obj The Compressed Image Object
     * @param {String} The server side url to send the POST request
     * @param {String} file_input_name The name of the input that the server will receive with the file
     * @param {String} filename The name of the file that will be sent to the server
     * @param {function} successCallback The callback to trigger when the upload is succesful.
     * @param {function} (OPTIONAL) errorCallback The callback to trigger when the upload failed.
     * @param {function} (OPTIONAL) duringCallback The callback called to be notified about the image's upload progress.
     * @param {Object} (OPTIONAL) customHeaders An object representing key-value  properties to inject to the request header.
     */
    upload: function(compressed_img_obj, upload_url, file_input_name, filename, successCallback, errorCallback, duringCallback, customHeaders){
        var data = '';
        if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
            XMLHttpRequest.prototype.sendAsBinary = function(string) {
                var bytes = Array.prototype.map.call(string, function(c) {
                    return c.charCodeAt(0) & 0xff;
                });
                this.send(new Uint8Array(bytes).buffer);
            };
        }
        if (typeof compressed_img_obj !== 'string') {
            var cvs = document.createElement('canvas');
            cvs.width = compressed_img_obj.naturalWidth;
            cvs.height = compressed_img_obj.naturalHeight;
            var ctx = cvs.getContext("2d").drawImage(compressed_img_obj, 0, 0);
            data = cvs.toDataURL(type);
        } else {
            data = compressed_img_obj;
        }
        var type = data.match(/data:(\S+);/)[1];
        data = data.replace(/^[^,]+,/, '');
        var xhr = new XMLHttpRequest();
        xhr.open('POST', upload_url, true);
        var boundary = 'someboundary';

        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);

        // Set custom request headers if customHeaders parameter is provided
        if (customHeaders && typeof customHeaders === "object") {
            for (var headerKey in customHeaders){
                xhr.setRequestHeader(headerKey, customHeaders[headerKey]);
            }
        }

        // If a duringCallback function is set as a parameter, call that to notify about the upload progress
        if (duringCallback && duringCallback instanceof Function) {
            xhr.upload.onprogress = function progress(e) {
                if (e.total > 0) {
                    e.percent = e.loaded / e.total * 100;
                }
                duringCallback(e);
            };
        }

        xhr.onerror = errorCallback;

        function getBody(xhr) {
            var text = xhr.responseText || xhr.response;
            if (!text) {
                return text;
            }
            try {
                return JSON.parse(text);
            }   catch (e) {
                return text;
            }
        }
        var decodeBase64 = function(s) {
            var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
            var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            for(i=0;i<64;i++){e[A.charAt(i)]=i;}
            for(x=0;x<L;x++){
                c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
                while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
            }
            return r;
        };
        xhr.onload = function onload() {
            if (xhr.status !== 200) {
                return errorCallback(xhr);
            }
            successCallback(getBody(xhr));
        };
        xhr.sendAsBinary(['--' + boundary, 'Content-Disposition: form-data; name="' + file_input_name + '"; filename="' + filename + '"', 'Content-Type: ' + type, '', decodeBase64(data), '--' + boundary + '--'].join('\r\n'));
    }
};

module.exports = jic;
