
"use strict";

import React from 'react';
import { render } from 'react-dom';
import Loading from './loading';
import { Router, Route} from 'react-router';
// import WeUI from 'react-weui';
// import 'weui';
import Ajax from '../Ajax';

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
            this.state.ready ? <div>loaded</div> : <Loading />
        )
    }
}

render(<App />, document.getElementById('container'))
