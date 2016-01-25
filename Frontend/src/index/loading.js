
"use strict";

import React from 'react';
import { render } from 'react-dom';

export default class Loading extends React.Component{

    componentWillUnmount() {
        console.log('loading unmount');
    }

    render(props){
        return (
            <div>
                <div className="vh50 bg-red" id="upBox"></div>
                <div className="vh50 bg-red" id="downBox"></div>
            </div>
        )
    }
}
