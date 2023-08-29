// deposit eth from l1 wallet to l2 wallet
import { InfuraProvider } from '@ethersproject/providers';
// InfuraProvider
import { Wallet } from '@ethersproject/wallet';
import {
  Workflows, 
  BaseSigner, 
  getConfig, 
  generateStarkWallet,
  TokenType
} from '@imtbl/core-sdk';

import pkg from '@imtbl/core-sdk';

const ethNetwork = 'ropsten';

const infuraApiKey = 'my infura key';
const infuraProvider = new InfuraProvider(ethNetwork, infuraApiKey);

// Sets up the L1Signer
const privateKey = 'my priv key';
const l1Wallet = new Wallet(privateKey);
const l1Signer = l1Wallet.connect(infuraProvider);

// Sets up the L2Signer
const l2Wallet = await generateStarkWallet(l1Signer);
const l2Signer = new BaseSigner(l2Wallet.starkKeyPair);

const walletConnection = {l1Signer, l2Signer}

// Sets up the Core SDK workflows
const coreSdkConfig = getConfig({
  coreContractAddress: '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef',
  registrationContractAddress: '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864',
  chainID: 3,
  basePath:  'https://api.ropsten.x.immutable.com',
});

const coreSdkWorkflows = new Workflows(coreSdkConfig);

const ETHDeposit = {
  type: TokenType.ETH,
  amount: "1"
}

await coreSdkWorkflows.registerOffchain(walletConnection);

// deposit eth
const response = await coreSdkWorkflows.depositEth(l1Signer, ETHDeposit);