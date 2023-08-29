// deposit eth from l1 wallet to l2 wallet
import { InfuraProvider } from '@ethersproject/providers';
// InfuraProvider
import { Wallet } from '@ethersproject/wallet';
import {
  Workflows, 
  BaseSigner, 
  getConfig, 
  generateStarkWallet,
  TokenType,
  UsersApi
} from '@imtbl/core-sdk';

import pkg from '@imtbl/core-sdk';

import { ImmutableXClient, ImmutableXWallet } from '@imtbl/imx-sdk';

const ethNetwork = 'ropsten';

const infuraApiKey = process.env.infuraApiKey2
const infuraProvider = new InfuraProvider(ethNetwork, infuraApiKey);

// Sets up the L1Signer
const privateKey = process.env.privateKey2
const l1Wallet = new Wallet(privateKey);
const l1Signer = l1Wallet.connect(infuraProvider);
const l1balance = await l1Signer.getBalance();
console.log(l1balance);
// pkey = 0xce2314f3533bfc0337f36d0945f8056cdfb047c76525803bccff0468ff78573e

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

const amount = 1
const assetType = 'ETH'

const ETHDeposit = {
  type: TokenType.ETH,
  amount: "1"
}

// register user onchain
await coreSdkWorkflows.registerOffchain(walletConnection);


/**
 * IMX client
 */
imxClient = await ImmutableXClient.build({ 
  publicApiUrl: 'https://api.ropsten.x.immutable.com',
  l1Signer,
  starkContractAddress: '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef',
  registrationContractAddress: '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864'
})

/**
 * Registers a user on Immutable X
 */
 async function registerUser(client: ImmutableXClient, wallet: ethers.Wallet)
 {
 const starkKey = await new ImmutableXWallet(wallet).controller.account('starkex', 'immutablex', '1');
 return client.register({
     etherKey: wallet.address,
     starkPublicKey: starkKey,
 });
}

await registerUser(imxClient, l1Wallet);
function depositEth(client: ImmutableXClient, user: string, amount: string) {
  const token = {
      type: ETHTokenType.ETH,
      data: {
          decimals: 18,
      },
  }
  const quantity = ethers.BigNumber.from(amount);
  return client.deposit({
      user: user,
      token: token,
      quantity: quantity
  });
}

console.log("Deposit transaction: ", await depositEth(buyerClient, buyer.address, sale_amount));

// const usersApi = new UsersApi(config.apiConfiguration);

// const regUserRes = await usersApi.registerUser({
//   registerUserRequest: {
//     'an@gmail.com',
//     l1Signer,
//     l2Signer
//   }
// });

// deposit eth
// debugger
const response = await coreSdkWorkflows.depositEth(l1Signer, ETHDeposit);
// debugger
console.log(response);