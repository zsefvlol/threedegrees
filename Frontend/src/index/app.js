
"use strict";

import React from 'react';
import { render } from 'react-dom';
import { Router, Route} from 'react-router';
import Ajax from '../lib/Ajax';
import Join from './join';
import Loading from './loading';
// import WeUI from 'react-weui';
// import 'weui';

class App extends React.Component {

    state = {
        ready: false,
        profile: false
    }

    componentDidMount() {
        Ajax.get('/api/user/profile').end((err, res) => {
            this.setState({
                ready: true,
                profile: res.body.data
            })
        })
    }

    render() {
        return (
            this.state.ready ? <Join user_info={this.state.profile.user_info} /> : <Loading />
        )
    }
}

render(<App />, document.getElementById('container'))
