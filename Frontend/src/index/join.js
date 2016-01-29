
"use strict";

import React from 'react';
import { render } from 'react-dom';
import Choose from './choose';
import Doge from './doge';

export default class Join extends React.Component {

    state = {
        is_single: window.pageData.profile.user_info.is_single
    }

    chooseHandle = (is_single) => {
        this.setState({is_single: is_single});
    }

    render() {
        if (this.state.is_single == 1){
            return (<Doge profile={window.pageData.profile} />);
        }
        // if (this.state.is_single == 0)
        //     return (<Matchmaker user_info={this.user_info} />);
        return (<Choose handle={this.chooseHandle} />);
    }

}
