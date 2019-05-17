import React from 'react';
import api from 'utils/api';
import Web3 from 'pages/Wallet/Web3';
import {notification} from 'antd';
import { extractErrorMessage } from 'utils/errorMessage';


const WalletContext = React.createContext();
const { Provider, Consumer } = WalletContext;
const NETWORK = 'https://etherscan.io';
const CONTRACT = '0x9aab071b4129b083b01cb5a0cb513ce7eca26fa5';

class WalletProvider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      balances: {},
      totalClaimed: 0.0,
      ethAddress: null,
      transactions: [],
      withdrawals: [],
      isLoading: false,
      isUpdating: false,
      me: '',
      transferModalVisible: false
    };
  }

  componentWillMount() {
    // let accessToken = null;
    // if (this.props.location.search) {
    //   try {
    //     accessToken = queryString.parse(this.props.location.search).access_token;
    //   } catch(e) {
    //     console.error('URI Parse error', this.props.location.search);
    //   }
    // }

    // this.props.getMe(accessToken); // with existing token
    // this.refresher = setInterval(this.props.refreshMe, 60000); // to update voting power gage
  }

  componentWillUnmount() {
    clearInterval(this.refresher);
  }

  async componentDidMount() {
    await this.getTransactions();
  }

  toggleTransferModal = () =>
    this.setState({ transferModalVisible: !this.state.transferModalVisible });

  handleTransfer = async (amount) => {
    try {
        const result = await api.post(`/erc_transactions.json`, { amount: amount }, true);
        this.setState({...result})
      } catch(e) {
         notification['error']({ message: extractErrorMessage(e) });
      }
  }

  setEthAddress = async (address, message, signature) => {
    try {
        // const result = await api.post(`/users/set_eth_address.json`, { eth_address: address, eth_message: message, eth_signature: signature}, true);
        this.setState({ethAddress: address});
      } catch(e) {
         notification['error']({ message: extractErrorMessage(e) });
      }
  }

  etherscanLink(walletAddress) {
    return `${NETWORK}/token/${CONTRACT}?a=${walletAddress}`
  }

  getTransactions = async () => {
    this.setState({isLoading: true});
    try {
      // const result = await api.get(`/hunt_transactions.json`, null, true);

      // for testing purposes
      const result = require('test_hunt_transactions.json');

      setTimeout(() => {
      this.setState({ ...result, isLoading: false });
      }, 1000)
    } catch (e) {
      notification['error']({ message: extractErrorMessage(e) });
    }
  }

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
          getTransactions: this.getTransactions
        }}
      >
        {this.props.children}
        <Web3 setRef={v => (this.web3 = v)} />
      </Provider>
    );
  }
}

export { WalletProvider, Consumer as WalletConsumer, WalletContext };
