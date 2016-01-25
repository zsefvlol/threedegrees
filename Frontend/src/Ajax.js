
"use strict";

var request = require('superagent');
var Env = require('./Env');
var prefix = require('superagent-prefix')(window._BASE_);

var Ajax = {
    errorHandler: (req) => {
        req.on('response', (res) => {
            if (!res.ok || !res.body) {
                alert('请求失败，请稍后重试');
                throw res;
            }
            if (res.body.error_code) {
                alert(res.body.error_message);
                throw res.text;
            }
        });
    }
}
var methods = ['get', 'post', 'put', 'patch', 'del', 'head'];
methods.forEach((method) => {
    Ajax[method] = (url) => {return request[method](url).use(prefix).accept('json').use(Ajax.errorHandler)}
})
module.exports = Ajax;
