import { ethers } from 'ethers';
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

/**
* Creates a buy order (trade) for a given sell order
*/
async function buyNFT(client: ImmutableXClient, user: string, contract_address: string, token_id: string, order_id: number) {
  const params: ImmutableMethodParams.ImmutableGetSignableTradeParamsTS = {
      orderId: order_id,
      user: user,
      tokenBuy: {
          type: ERC721TokenType.ERC721,
          data: {
              tokenAddress: contract_address,
              tokenId: token_id
          },
      },
      amountBuy: ethers.BigNumber.from('1'),
      tokenSell: {
          type: ETHTokenType.ETH,
          data: {
              decimals: 18,
          },
      },
      amountSell: ethers.BigNumber.from('6743520000000000')      
  }
  return client.createTrade(params);
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
    const privateKey = process.env.privateKey
    const l1Wallet = new Wallet(privateKey);
    const trader = l1Wallet.connect(provider);
    
    console.log('Trader L1', trader.address, trader.privateKey);
    
    const traderClient = await getClient(trader);
  
    console.log('User Inventory', await getUserInventory(traderClient, trader.address));
    let bal_result = await getUserBalance(traderClient, trader.address, 'eth')
    console.log("User ETH balance: ", bal_result.balance.toString());
  
    // const token_address = '<YOUR_CONTRACT_ADDRESS>';
    const token_address = '0xacb3c6a43d15b907e8433077b6d38ae40936fe2c';
    
    
    let nftList = [];

    // TODO:  foreach, nftlist item, call buynft and print result
    // Buy the nft listed for sale (create trade)
    const token_id = '23617963';
    const order_id = 235864921;
    const trade_result = await buyNFT(traderClient, trader.address, token_address, token_id, order_id);
    console.log("Created trade with id: ", trade_result.trade_id, "status: ", trade_result.status);
  
    console.log(`Transaction Complete`);

    console.log('User Inventory', await getUserInventory(traderClient, trader.address));
    
    bal_result = await getUserBalance(traderClient, trader.address, 'eth')
    console.log("User ETH balance: ", bal_result.balance.toString());
    
  }


main()
.then(() => console.log('Main function call complete'))
.catch(err => {
  console.error(err);
  process.exit(1);
});