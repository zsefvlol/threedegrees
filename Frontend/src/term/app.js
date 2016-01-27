
"use strict";

import React from 'react';
import { render } from 'react-dom';
import TermArticle from './term_article';

class App extends React.Component {
    render() {
        return <TermArticle show="full" />
    }
}

console.log('Started');
render(<App />, document.getElementById('container'))
