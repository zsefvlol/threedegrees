
"use strict";

import React from 'react';
import { render } from 'react-dom';
import { Router, Route} from 'react-router';
import Ajax from '../lib/Ajax';
import Join from './join';
// import WeUI from 'react-weui';
// import 'weui';

class App extends React.Component {

    state = {
        ready: false,
        profile: false
    }

    componentDidMount() {
        Ajax.get('/api/user/profile').end((err, res) => {
            window.timer.loaded = +new Date();
            var duration = window.timer.loaded - window.timer.startAt;
            console.log(`load cost: ${duration} ms`);
            var func = () => {
                document.getElementById('loadingPage').remove();
                this.setState({
                    ready: true,
                    profile: res.body.data
                });
            }
            if (duration >= 2000) {
                func();
            } else {
                setTimeout(func, 2000 - duration);
            }
        })
    }

    render() {
        return (
            this.state.ready ? <Join profile={this.state.profile} /> : null
        )
    }
}

render(<App />, document.getElementById('container'))
