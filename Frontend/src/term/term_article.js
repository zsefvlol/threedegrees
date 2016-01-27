
"use strict";

import React from 'react';
import WeUI from 'react-weui';
import 'weui'
const {Article, Button} = WeUI;

export default class TermArticle extends React.Component {

    state = {
        show: this.props.show // 'brief' 'full'
    };

    render (){
        let extra_content = this.state.show=='full' ? (
            <div>
                <section>
                    <h2>为什么我不能邀请其他好友？</h2>
                    <p>测试期我们仅允许一度（小温的朋友）邀请12个同学，这些同学（也就是二度）不再能够邀请其他人。</p>
                    <p>如果你目前状态是二度，而你又认识小温，你可以直接联系他将自己改为一度，以便获取12个邀请名额。</p>
                    <p>如果你用完了自己的邀请码，想要更多，也请联系小温。</p>
                    <p>如果都不是，见下面这条。</p>
                </section>
                <section>
                    <h2>我是二度，但是我有好资源，怎么让TA加入呢？</h2>
                    <p>为了保证资源质量，请联系你的一度介绍人，让TA来认识并了解这个新同学，并且使用一度介绍人的邀请码进行邀请。</p>
                </section>
                <section>
                    <h2>我觉得某同学不错，我怎么联系TA呢？</h2>
                    <p>资料页有微信号码，请添加微信进行沟通（请说明是在三度看到的）。或者通过介绍人了解更多情况。</p>
                    <p>我们只提供资料，并不提供恋爱指导，请自主发挥聪明才智哦。</p>
                </section>
                <section>
                    <h2>收费吗？</h2>
                    <p>当然，不收了。服务器、域名和带宽等费用由小温承担。但是也欢迎给小温同学的微信或支付宝转账攒人品。</p>
                </section>
                <section>
                    <h2>网站源代码是否开源？</h2>
                    <p>是的，欢迎提交pull-request</p>
                    <p><a href="https://github.com/zsefvlol/threedegrees">https://github.com/zsefvlol/threedegrees</a></p>
                        <p>非技术同学请放心，你们的资料并不是开放访问的。</p>
                </section>
                <section>
                    <h2>ThreeDegrees会一直在线吗？</h2>
                    <p>不会，当大家都有自己的好归宿，这个站就会被关闭，资料会被删除。</p>
                </section>
                <section>
                    <h2>ThreeDegrees是小温做的吗？</h2>
                    <p>是的，但不全是。</p>
                    <p>感谢产品经理，小温的老婆，菁菁大人。</p>
                    <p>感谢肩扛前端开发的狼厂高薪单身优质男程序员，小齐。对，你在网站中也可以看到他的资料，手慢无。</p>
                </section>
                <section>
                    <a href={`${window._BASE_}/index/index`}>
                        <Button type="primary">返回首页</Button>
                    </a>
                </section>
        </div>) : (
            <section>
                <h2>
                    <a href={`${window._BASE_}/index/term`}>查看完整介绍</a>
                </h2>
            </section>);

        return (
            <Article>
                <div className="hd">
                    <h1 className="page_title">欢迎</h1>
                    <p className="page_subtitle">请您先阅读以下内容，以便能了解这里</p>
                </div>
                <section>
                    <section>
                        <h2>什么是ThreeDegrees？</h2>
                        <p>三度。小温同学周围有很多优质单身男女青年，这里希望能够给大家提供相互认识的渠道，是的，俗称相亲。</p>
                    </section>
                    <section>
                        <h2>为什么是ThreeDegrees？</h2>
                        <p>由六度空间理论想到的。这里只接受以小温为出发点三度（测试期两度）的朋友加入。即小温的朋友的朋友。这样是为了保证所有加入ThreeDegrees的同学均是有紧密联系的、真正有价值的。</p>
                    </section>
                    <section>
                        <h2>怎么使用ThreeDegrees？</h2>
                        <p>如果你单身，很简单，填写你的资料，查看别人的资料，和心仪的人联系。</p>
                        <p>如果你是来邀请“下线”的介绍人，你可以生成邀请码，发给优质男女青年。</p>
                    </section>
                    <section>
                        <h2>我的资料安全吗？</h2>
                        <p>我们尽力保证它安全。只有你的邀请人和单身异性能看到你的资料。别忘了所有人还都是在三度以内的紧密圈子中。然而，我们仍然不建议你填写任何你觉得不宜公开的内容，比如你的银行卡密码。</p>
                    </section>
                    {extra_content}
                </section>
            </Article>)
    }
}
