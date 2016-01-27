
"use strict";

import React from 'react';
import WeUI from 'react-weui';
import 'weui'
const {Article} = WeUI;

export default class ErrorArticle extends React.Component {

    render (){
        return (
            <Article>
                <div className="hd"><h1 className="page_title">页面无法显示</h1></div>
                <section>
                    <section>
                        <h2>您可能没有相关权限，或是网站出了些问题。</h2>
                    </section>
                    <section>
                        <h3>您可以尝试：</h3>
                        <p>从公众号中重新进入页面（发送任意内容即可）</p>
                        <p>联系网站管理员报告错误</p>
                    </section>
                    <section>
                        <h3>这是什么网站？</h3>
                        <p><a href={`${window._BASE_}/index/term`} >了解 ThreeDegrees</a></p>
                    </section>
                </section>
            </Article>)
    }

}
