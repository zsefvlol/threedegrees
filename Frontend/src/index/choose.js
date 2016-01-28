
"use strict";

import React from 'react';
import { render } from 'react-dom';
import WeUI from 'react-weui';
import 'weui'
import TermArticle from '../term/term_article';
const {Button} = WeUI;

export default class Choose extends React.Component {

    render(){
        return (
            <div>
                <TermArticle show="brief" />
                <div className="clearfix" style={{marginTop: -5, marginBottom: 20,}}>
                    <div className="fl" style={{width: "42vw", marginLeft: 10}}>
                        <Button type="warn" onClick={this.props.handle.bind(this, 1)}>单身</Button>
                    </div>
                    <div className="fr" style={{width: "42vw", marginRight: 10}}>
                        <Button type="default" onClick={this.props.handle.bind(this, 0)}>介绍人</Button>
                    </div>
                </div>
                
            </div>
        )
    }

}
