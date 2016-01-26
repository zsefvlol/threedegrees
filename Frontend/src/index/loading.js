
"use strict";

import React from 'react';
import { render } from 'react-dom';

export default class Loading extends React.Component{

    componentWillUnmount() {
        console.log('loading unmount');
    }

    render() {
        return (
            <div className="table center vh100 bg-red">
                <div className="table-cell py4">
                    <h1 className="white h1 mb2">ThreeDegrees</h1>
                    <img src={`${window._BASE_}/static/loading-bars.svg`} width="64" height="64" />
                </div>
            </div>
        )
    }
}
