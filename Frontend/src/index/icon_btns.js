
"use strict";

import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router'

export class Goback extends React.Component {

    render() {
        return (
            <div {...this.props}>
                <Link to="/users">
                    <svg onClick={this.clickHandle} width="32" height="32" viewBox="0 0 32 32">
                        <path fill="#666" d="M23.808 32c3.554-6.439 4.153-16.26-9.808-15.932v7.932l-12-12 12-12v7.762c16.718-0.436 18.58 14.757 9.808 24.238z"></path>
                    </svg>
                </Link>
            </div>
        )
    }

}
