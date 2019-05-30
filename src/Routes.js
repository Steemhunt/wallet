import React, { Component, useContext } from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
import queryString from "query-string";
import asyncComponent from "asyncComponent";
// import { getMeBegin, refreshMeBegin } from 'features/User/actions/getMe';
import NotFound from "components/NotFound";
import { getLoginURL } from "utils/token";
import {WalletConsumer} from "contexts/WalletContext";

const Wallet = asyncComponent(() => import("pages/Wallet"));

export default () => (
  <WalletConsumer>
    {context => <RoutesWithRouter context={context} />}
  </WalletConsumer>
);


class Routes extends Component {
  componentWillMount() {
    let accessToken = null;
    if (this.props.location.search) {
      try {
        accessToken = queryString.parse(this.props.location.search)
          .access_token;
      } catch (e) {
        console.error("URI Parse error", this.props.location.search);
      }
    }

    this.props.context.getMe(accessToken); // with existing token
    this.refresher = setInterval(this.props.context.refreshMe, 60000); // to update voting power gage
  }

  componentWillUnmount() {
    clearInterval(this.refresher);
  }

  render() {
    let redirectPath = null;
    // SteemConnect redirect path
    if (this.props.location.search) {
      try {
        const parsedParams = queryString.parse(this.props.location.search);
        redirectPath =
          parsedParams.state || (parsedParams.access_token ? "/" : null);
      } catch (e) {
        console.error("URI Parse error", this.props.location.search);
      }
    }

    const { me, isLoading } = this.props.context;

    if (me) {
      redirectPath = "/";
    } else if (!isLoading && !me) {
      window.location = getLoginURL();
    }

    return (
      <>
        {redirectPath && <Redirect to={redirectPath} />}
        <Switch>
          <Route path="/" exact component={Wallet} />
          <Route path="*" component={NotFound} />
        </Switch>
      </>
    );
  }
}

const RoutesWithRouter = withRouter(Routes);