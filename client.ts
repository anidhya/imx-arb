import { ethers } from 'ethers';
// import { Wallet } from '@ethersproject/wallet';
import { ImmutableXClient } from '@imtbl/imx-sdk';

/**
 * Return the ImmutableXClient for a given user (i.e. wallet). This is
 * used to sign the corresponding requests.
 * @param w - Ethereum wallet used to fund any L1 transactions
 * @param gasLimit - maximum amount of Gas that a user is willing to pay for performing this action or confirming a transaction (a minimum of 21,000)
 * @param gasPrice - price of Gas (Gas Price) is the amount of Gwei that the user is willing to spend on each unit of Gas
 */
export async function getClient(w: ethers.Wallet)
  : Promise<ImmutableXClient> {

  // return await ImmutableXClient.build({
  //   publicApiUrl: 'https://api.ropsten.x.immutable.com/v1',
  //   signer: w,
  //   starkContractAddress: '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef',
  //   registrationContractAddress: '0x6C21EC8DE44AE44D0992ec3e2d9f1aBb6207D864'
  // });
  return await ImmutableXClient.build({
    publicApiUrl: 'https://api.x.immutable.com/v1',
    signer: w,
    starkContractAddress: '0x5fdcca53617f4d2b9134b29090c87d01058e27e9',
    registrationContractAddress: '0x72a06bf2a1CE5e39cBA06c0CAb824960B587d64c'
  });
}

// export async function getSigner(network: string, privateKey: string)
//   : Promise<Wallet> {
//       const provider = new ethers.providers.JsonRpcProvider((network == "mainnet") ? process.env.MAINNET_ETH_PROVIDER_URL : process.env.ROPSTEN_ETH_PROVIDER_URL);
//       const signer = new Wallet(privateKey).connect(provider)
//       return signer
// }