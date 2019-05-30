import React from "react";
import api from "utils/api";
import Web3 from "pages/Wallet/Web3";
import { notification } from "antd";
import { extractErrorMessage } from "utils/errorMessage";
import { getToken, setToken, getLoginURL } from "utils/token";
import { format } from "utils/utils";
import steemConnectAPI from "utils/steemConnectAPI";
import steem from "steem";

const WalletContext = React.createContext();
const { Provider, Consumer } = WalletContext;
const NETWORK = "https://etherscan.io";
const CONTRACT = "0x9aab071b4129b083b01cb5a0cb513ce7eca26fa5";

class WalletProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      balances: {},
      totalClaimed: 0.0,
      ethAddress: null,
      transactions: [],
      withdrawals: [],
      isLoading: true,
      isUpdating: false,
      me: null,
      transferModalVisible: false
    };
  }

  componentWillMount() {
    const url = getLoginURL();
    console.log("login url", url);
  }

  componentWillUnmount() {
    clearInterval(this.refresher);
  }

  async componentDidMount() {
    // await this.getTransactions();
  }

  toggleTransferModal = () =>
    this.setState({ transferModalVisible: !this.state.transferModalVisible });

  handleTransfer = async amount => {
    try {
      const result = await api.post(
        `/erc_transactions.json`,
        { amount: amount },
        true
      );
      this.setState({ ...result });
    } catch (e) {
      notification["error"]({ message: extractErrorMessage(e) });
    }
  };

  setEthAddress = async (address, message, signature) => {
    try {
      // const result = await api.post(`/users/set_eth_address.json`, { eth_address: address, eth_message: message, eth_signature: signature}, true);
      this.setState({ ethAddress: address });
    } catch (e) {
      notification["error"]({ message: extractErrorMessage(e) });
    }
  };

  etherscanLink(walletAddress) {
    return `${NETWORK}/token/${CONTRACT}?a=${walletAddress}`;
  }

  refreshMe = async() => {
    if (!getToken()) {
      return;
    }
  
    try {
      const me = await steemConnectAPI.me();
      this.setState({me})
    } catch(e) {
      console.error(e);
    }
  }

  getMe = async token => {
    this.setState({isLoading: true});
    try {
      token = token || getToken();
      console.log("token received", token);
      if (!token) {
        // yield put(getMeFailure('Not logged in'));
        return;
      }
      steemConnectAPI.setAccessToken(token);

      const me = await steemConnectAPI.me();
      setToken(token);

      console.log("me!", me);

      // This is the only time sending non-encrypted token to the server (so server can validate users)
      // Make sure tokens must be filtered from all the logs and should not be saved in a raw format

      const info = await api.post('/users.json', { user: { username: me.account.name, token: token } });

      // For transaction tracking
      // REF: https://steemit.com/steemapps/@therealwolf/steem-apps-update-4-more-data

      steemConnectAPI.broadcast([['custom_json', { // async
        required_auths: [],
        required_posting_auths: [me.account.name],
        id: 'hunt_active_user',
        json: JSON.stringify({
          account: me.account.name,
          user_score: info.detailed_user_score,
          app: 'steemhunt'
        })
      }]]);

      await this.setState({
        me,
      });

      await this.getTransactions();

    } catch (e) {
      console.error(e);
    }
  };

  getTransactions = async () => {
    try {
      // const result = await api.get(`/hunt_transactions.json`, null, true);

      // for testing purposes
      const result = require("test_hunt_transactions.json");

      setTimeout(() => {
        this.setState({ ...result, isLoading: false});
      }, 1000);
    } catch (e) {
      notification["error"]({ message: extractErrorMessage(e) });
    }
  };

  render() {
    return (
      <Provider
        value={{
          ...this.state,
          toggleTransferModal: this.toggleTransferModal,
          etherscanLink: this.etherscanLink,
          setEthAddress: this.setEthAddress,
          requestSignTransaction: this.web3 && this.web3.requestSignTransaction,
          handleTransfer: this.handleTransfer,
          getTransactions: this.getTransactions,
          getMe: this.getMe,
          refreshMe: this.refreshMe
        }}
      >
        {this.props.children}
        <Web3 setRef={v => (this.web3 = v)} />
      </Provider>
    );
  }
}

export { WalletProvider, Consumer as WalletConsumer };
export default WalletContext;
