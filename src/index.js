import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import MainDBCompare from "./dbcompare/component/MainDBCompare";


// ========================================

ReactDOM.render(
    <Router>
        <MainDBCompare/>
    </Router>,
    document.getElementById('root')
);






