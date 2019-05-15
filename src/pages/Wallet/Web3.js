import React, { Component } from 'react';
import { Modal, notification } from 'antd';
import metaMaskImage from 'assets/images/wallet/img-no-metamask@3x.png';
import initializeWeb3 from 'web3.js';
import { WalletConsumer } from './WalletContext';

export default ({ setRef }) => (
  <WalletConsumer>
    {context => <Web3 setRef={setRef} context={context} />}
  </WalletConsumer>
);

class Web3 extends Component {
  componentDidMount() {
    this.web3 = initializeWeb3();
    this.props.setRef(this);
  }

  async validEthereumNetwork() {
    if (this.web3 === null) {
      Modal.error({
        title: 'Please install Metamask',
        className: 'metamask-install-modal',
        autoFocusButton: null,
        maskClosable: true,
        content: (
          <div className={'metamask-install-body'}>
            <p>
              You need to use Metamask to connect your own Ether wallet address.
            </p>
            <img src={metaMaskImage} alt="Metamask" className="fox" />
          </div>
        ),
        okText: 'Get Metamask',
        onOk: () => window.open('https://metamask.io/', '_blank')
      });
      return false;
    }

    let ethAccounts = await this.web3.eth.getAccounts();
    if (ethAccounts.length === 0) {
      if (window.ethereum) {
        ethAccounts = await window.ethereum.enable();
      }

      if (ethAccounts.length === 0) {
        notification['error']({ message: 'You need to login on Metamask.' });
        return false;
      }
    }

    const ethNetwork = await this.web3.eth.net.getNetworkType();
    if (ethNetwork !== 'main') {
      Modal.error({
        title: 'Incorrect Network',
        content: `You are currently in ${ethNetwork} network. Please change your network to Main Ethereum Network.`
      });

      return false;
    }

    return true;
  }

  requestSignTransaction = async () => {
    if (!(await this.validEthereumNetwork())) {
      return false;
    }

    const ethAccounts = await this.web3.eth.getAccounts();

    Modal.success({
      title: 'Connect External Wallet',
      className: 'metamask-install-modal',
      autoFocusButton: null,
      maskClosable: true,
      content: (
        <div className={'metamask-install-body'}>
          <p>
            You can connect your own Ether wallet address by using MetaMask.
          </p>
          <img src={metaMaskImage} alt="Metamask" className="fox" />
          <p>Please notice that</p>
          <ul>
            <li>
              You can only connect one Ether wallet at a time, and you can only
              transfer HUNT tokens to the wallet you're currently connected to.
            </li>
            <li>
              Exchange&#39;s wallet is not able to be connected (MetaMask is
              required to connect).
            </li>
            <li>
              The HUNT balance from the wallet address above is automatically
              added to your total HUNT token balance, which will be counted for
              your user score.
            </li>
          </ul>
        </div>
      ),
      okText: 'Connect to Metamask',
      onOk: async () => {
        console.log('context', this.props.context);
        const { me, setEthAddress } = this.props.context;

        const message = `Connect this Ethereum address to your Steemhunt account, ${me}. (Timestamp: ${new Date().getTime()})`;

        const signature = await this.web3.eth.personal.sign(
          message,
          ethAccounts[0],
          null
        );

        setEthAddress(ethAccounts[0], message, signature);
      }
    });
  };

  render() {
    return null;
  }
}
