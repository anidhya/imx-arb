// User registration workflow example
// import { AlchemyProvider } from '@ethersproject/providers';
import { InfuraProvider } from '@ethersproject/providers';
// InfuraProvider
import { Wallet } from '@ethersproject/wallet';
import {
  WalletConnection, 
  Workflows, 
  BaseSigner, 
  getConfig, 
  generateStarkWallet  
} from '@imtbl/core-sdk';

// import {
//   AssetsApi,
//   OrdersApi,
//   DepositsApi,
//   CollectionsApi,
//   TradesApi
// } from '@imtbl/core-sdk';


import pkg from '@imtbl/core-sdk';

const ethNetwork = 'ropsten';
// const ethNetwork = 'goerli';

// Sets up the provider
// const alchemyApiKey = process.env.alchemyApiKey;
// const alchemyProvider = new AlchemyProvider(ethNetwork, alchemyApiKey);

const infuraApiKey = process.env.infuraApiKey2
const infuraProvider = new InfuraProvider(ethNetwork, infuraApiKey);

// Sets up the L1Signer
// const privateKey = 'UPDATE WITH THE PRIVATE KEY HERE';
// const l1Wallet = new Wallet(privateKey);
// const l1Wallet = Wallet.createRandom();
// await l1wallet.getBalance();
// const l1Signer = l1Wallet.connect(alchemyProvider);
// pkey = process.env.privateKey2

// Sets up the L2Signer
// const l2Wallet = await generateStarkWallet(l1Signer);
// const l2Signer = new BaseSigner(l2Wallet.starkKeyPair);


// generate your own stark wallet
// const generateWallets = async (provider: AlchemyProvider) => {
//   // L1 credentials
//   const wallet = Wallet.createRandom().connect(provider);

//   // L2 credentials
//   // Obtain stark key pair associated with this user
//   const starkWallet = await generateStarkWallet(wallet); // this is sdk helper function

//   return {
//     wallet,
//     starkWallet,
//   };
// };

const generateWalletConnection = async (provider: InfuraProvider) : Promise<WalletConnection> => {
  // L1 credentials
  const l1Signer = Wallet.createRandom().connect(provider);

  // L2 credentials
  const starkWallet = await generateStarkWallet(l1Signer);
  const l2Signer = new BaseSigner(starkWallet.starkKeyPair);

  return {
    l1Signer,
    l2Signer,
  };
};

const {l1Signer, l2Signer} = await generateWalletConnection(infuraProvider);

const loadWalletConnection = async (provider: InfuraProvider) : Promise<WalletConnection> => {
  // L1 credentials
  const privateKey = ""
  const l1Wallet = new Wallet(privateKey);
  const l1Signer = l1Wallet.connect(infuraProvider);
  // L2 credentials
  const starkWallet = await generateStarkWallet(l1Signer);
  const l2Signer = new BaseSigner(starkWallet.starkKeyPair);

  return {
    l1Signer,
    l2Signer,
  };
};

const walletConnection = await loadWalletConnection(infuraProvider);


// Sets up the Core SDK workflows
// const coreSdkConfig = getConfig({
//   coreContractAddress: '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef',
//   registrationContractAddress: '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864',
//   chainID: 3,
//   basePath:  'https://api.ropsten.x.immutable.com',
// });

const coreSdkConfig = getConfig(ethNetwork);

const coreSdkWorkflows = new Workflows(coreSdkConfig);

// Registers the user
// const walletConnection = { l1Signer, l2Signer };

const registerUser = async () => {
  const response = await coreSdkWorkflows.registerOffchain(walletConnection);
  console.log(response);
};

// await coreSdkWorkflows.registerOffchain(walletConnection);
registerUser();

// Get requests to get data
// var ordersList = await OrdersApi.listOrders(status: 'active')


// L1 testnet details
// Wallet {
//   _isSigner: true,
//   _signingKey: [Function (anonymous)],
//   _mnemonic: [Function (anonymous)],
//   address: '0x10E53efBD7216420a43A74afd0594C7B641b1ac2',
//   provider: null
// }
// 0xce2314f3533bfc0337f36d0945f8056cdfb047c76525803bccff0468ff78573e
// 0x04fe4dc8c679278e16ef7c0132aae36b5967357bd940e3d43c7393940e840c900c76945896ede7175975252edc510df66aed139a95594bca0485591335705a275d
// 0x10E53efBD7216420a43A74afd0594C7B641b1ac2

// L2 testnet details
// {
//   path: "m/2645'/579218131'/211006541'/1679497922'/548575478'/1",
//   starkPublicKey: process.env.starkPrivateKey2,
//   starkKeyPair: KeyPair {
//     ec: EC {
//       curve: [ShortCurve],
//       n: <BN: 800000000000010ffffffffffffffffb781126dcae7b2321e66a241adc64d2f>,
//       nh: <BN: 4000000000000087fffffffffffffffdbc08936e573d9190f335120d6e32697>,
//       g: [Point],
//       hash: [Function]
//     },
//     priv: BN { negative: 0, words: [Array], length: 10, red: null },
//     pub: Point {
//       curve: [ShortCurve],
//       type: 'affine',
//       precomputed: null,
//       x: [BN],
//       y: [BN],
//       inf: false
//     }
//   }
// }