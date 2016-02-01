
"use strict";

import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router'
import Ajax from '../lib/Ajax';
import Join from './join';
import UserCenter from './user_center';
import UserList from './user_list';
import UserInfo from './user_info';

class App extends React.Component {

    componentWillMount() {
        if (pageData.profile.user_info.is_single == -1) {
            window.location.hash = '#/join';
        }
    }

    render() {
        return (
            <UserCenter />
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
    duration >= 2000 ? entry() : setTimeout(entry, 2000 - duration);
})
