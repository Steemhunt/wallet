import React from 'react';
import ReactDOM from 'react-dom';
import Wallet from 'pages/Wallet';
import * as serviceWorker from 'serviceWorker';
import steem from 'steem';
import 'custom.css';

require('./utils/polyfill');


ReactDOM.render(<Wallet />, document.getElementById('root'));

steem.api.setOptions({ url: process.env.REACT_APP_STEEM_API_URL });

window.API_ROOT = process.env.REACT_APP_API_ROOT;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
