
"use strict";

import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router'
import Ajax from '../lib/Ajax';
import Join from './join';
import UserCenter from './user_center';
import UserList from './user_list';
import UserInfo from './user_info';
// import WeUI from 'react-weui';
// import 'weui';

class App extends React.Component {

    render() {
        return (
            pageData.profile.user_info.is_single == -1 ? <Join /> : <UserCenter />
        );
    }
}

function entry() {
    document.getElementById('loadingPage').remove();
    render((
      <Router>
        <Route path="/" component={App} />
        <Route path="join" component={Join} />
        <Route path="users" component={UserList} />
        <Route path="user/:id" component={UserInfo} />
      </Router>
    ), document.getElementById('container'))
}

Ajax.get('/api/user/profile').end((err, res) => {
    window.timer.loaded = +new Date();
    window.pageData.profile = res.body.data;
    var duration = window.timer.loaded - window.timer.startAt;
    console.log(`load cost: ${duration} ms`);
    if (duration >= 2000) {
        entry();
    } else {
        setTimeout(entry, 2000 - duration);
    }
})
