
"use strict";

import React from 'react';
import { render } from 'react-dom';

export default class Choose extends React.Component {

    render(){
        return (
            <div>
                <div className="vh50" onClick={this.props.handle.bind(this, 1)}>single</div>
                <div className="vh50" onClick={this.props.handle.bind(this, 0)}>double</div>
            </div>
        )
    }

}
