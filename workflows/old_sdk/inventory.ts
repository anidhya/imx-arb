import { ethers, BigNumber } from 'ethers';
import { Wallet } from '@ethersproject/wallet';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { ERC721TokenType, ImmutableMethodParams, ETHTokenType } from '@imtbl/imx-sdk';
import { InfuraProvider } from '@ethersproject/providers';
import { getClient } from '../../client';

/**
 * List users current assets
 */
async function getUserInventory(client: ImmutableXClient, user: string) {
  return client.getAssets({
      user: user,
  });
}
  
async function getUserBalance(client: ImmutableXClient, user: string, tokenAddress: string) {
  return client.getBalance({
    user: user,
    tokenAddress: 'eth',
  });
}

async function getUserBalanceGods(client: ImmutableXClient, user: string) {
  return client.getBalance({
      user: user,
      tokenAddress: 'gods',
  });
}

  /**
 * Workflow::
 * 1. Load trader’s L1 and L2 wallets
 * 2. Print inventory and balances
 * 3. Buy assets in the list off the best market rates.
 * 4. Print inventory and balances 
 */
async function main() {
  // const ethNetwork = 'ropsten';
  const ethNetwork = 'mainnet';
  // const infuraApiKey = 'a35145aa1ad64d328db4f95f931df361';
  const infuraApiKey = process.env.infuraApiKey

  const provider = new InfuraProvider(ethNetwork, infuraApiKey);

  // get trader account
  // const privateKey = '0xce2314f3533bfc0337f36d0945f8056cdfb047c76525803bccff0468ff78573e';
  // const address = '0x444AE4B67834ab05124960EEe8A9057c8c239d5d';
  const privateKey = process.env.privateKey
  const l1Wallet = new Wallet(privateKey);
  const trader = l1Wallet.connect(provider);
  
  // console.log('Trader L1', trader.address, trader.privateKey);
  
  const traderClient = await getClient(trader);

  console.log('User Inventory', await getUserInventory(traderClient, trader.address));
  const bal_result = await getUserBalance(traderClient, trader.address, 'eth')
  const balance_gods = await getUserBalanceGods(traderClient, trader.address);
  // console.log("User ETH balance: ", bal_result);
  console.log("User ETH balance: ", bal_result.balance.toString());
  console.log("--------------------------------------");
  console.log("User Gods balance: ", balance_gods.balance.toString());
  console.log("--------------------------------------");
}


setInterval(() => {
  main()
  .then(() => console.log('Main function call complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
}, 3000)
