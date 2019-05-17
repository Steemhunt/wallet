import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Routes from './Routes';
import 'url-search-params-polyfill';

import 'custom.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.params = new URLSearchParams(this.props.location.search);
  }

  render() {

    return (
      <div id="app-container" className="app-container">
        <Helmet>
          <title>HUNT Wallet</title>
          { /* Search Engine */ }
          <meta name="description" content="Daily ranking of effortlessly cool products that rewards hunters" />
          <meta name="image" content={`${process.env.PUBLIC_URL}/og-image-1200.png`} />
          { /* Schema.org for Google */ }
          <meta itemprop="name" content="Steemhunt - Discover Cool Products, Get Rewards" />
          <meta itemprop="description" content="Daily ranking of effortlessly cool products that rewards hunters" />
          <meta itemprop="image" content={`${process.env.PUBLIC_URL}/og-image-1200.png`} />
          { /* Twitter */ }
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Steemhunt - Discover Cool Products, Get Rewards" />
          <meta name="twitter:description" content="Daily ranking of effortlessly cool products that rewards hunters" />
          <meta name="twitter:image:src" content={`${process.env.PUBLIC_URL}/og-image-1024.png`} />
          <meta name="twitter:site" content="@steemhunt" />
          <meta name="twitter:creator" content="@steemhunt" />
          { /* Open Graph general (Facebook, Pinterest & Google+) */ }
          <meta property="og:title" content="Steemhunt - Discover Cool Products, Get Rewards" />
          <meta property="og:description" content="Daily ranking of effortlessly cool products that rewards hunters" />
          <meta property="og:image" content={`${process.env.PUBLIC_URL}/og-image-1200.png`} />
          <meta property="og:url" content={process.env.PUBLIC_URL} />
          <meta property="og:site_name" content="Steemhunt" />
          <meta property="og:type" content="website" />
        </Helmet>
        <Routes />
      </div>
    );
  }
}


export default withRouter(App);
