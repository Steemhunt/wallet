import React from 'react';
import api from 'utils/api';
import Web3 from './Web3';
import {notification} from 'antd';
import { extractErrorMessage } from 'utils/errorMessage';

const WalletContext = React.createContext();
const { Provider, Consumer } = WalletContext;

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

  componentDidMount() {
    this.getTransactions();
  }

  toggleTransferModal = () =>
    this.setState({ transferModalVisible: !this.state.transferModalVisible });

  handleTransfer() {}

  setEthAddress = async (address, message, signature) => {
    try {
        // const result = await api.post(`/users/set_eth_address.json`, { eth_address: address, eth_message: message, eth_signature: signature}, true);
        this.setState({ethAddress: address});
      } catch(e) {
         notification['error']({ message: extractErrorMessage(e) });
      }
  }

  etherscanLink() {}

  getTransactions = async () => {
    try {
      // const result = await api.get(`/hunt_transactions.json`, null, true);

      // for testing purposes
      const result = require('test_hunt_transactions.json');
      this.setState({ ...result });
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
        }}
      >
        {this.props.children}
        <Web3 setRef={v => (this.web3 = v)} />
      </Provider>
    );
  }
}

export { WalletProvider, Consumer as WalletConsumer, WalletContext };
