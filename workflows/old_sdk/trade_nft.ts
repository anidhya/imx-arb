import { ethers } from 'ethers';
import { Wallet } from '@ethersproject/wallet';
import { ImmutableXClient, sleep } from '@imtbl/imx-sdk';
import { ERC20TokenType, ERC721TokenType, ImmutableMethodParams, ETHTokenType, ImmutableOrderStatus } from '@imtbl/imx-sdk';
import { InfuraProvider } from '@ethersproject/providers';
import { getClient } from '../../client';
import { id } from 'ethers/lib/utils';

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
 * Creates a sell order for a given NFT in Eth market
 */
async function sellNFT(client: ImmutableXClient, user: string, contract_address: string, token_id: string, sale_amount: string) {
  const params: ImmutableMethodParams.ImmutableGetSignableOrderParamsTS = {
      user: user,
      tokenSell: {
          type: ERC721TokenType.ERC721,
          data: {
              tokenAddress: contract_address,
              tokenId: token_id
          },
      },
      amountSell: ethers.BigNumber.from('1'),
      tokenBuy: {
          type: ETHTokenType.ETH,
          data: {
              decimals: 18,
          },
      },
      amountBuy: ethers.utils.parseUnits(sale_amount, 18)
  }
  return client.createOrder(params);
}

/**
 * Creates a sell order for a given NFT in Gods market
 */
 async function sellNFTGods(client: ImmutableXClient, user: string, contract_address: string, token_id: string, sale_amount: string) {
  const params: ImmutableMethodParams.ImmutableGetSignableOrderParamsTS = {
      user: user,
      tokenSell: {
          type: ERC721TokenType.ERC721,
          data: {
              tokenAddress: contract_address,
              tokenId: token_id
          },
      },
      amountSell: ethers.BigNumber.from('1'),
      tokenBuy: {
          type: ERC20TokenType.ERC20,
          data: {
              symbol: 'GODS',
              decimals: 18,
              tokenAddress: "0xccc8cb5229b0ac8069c51fd58367fd1e622afd97",
          },
      },
      amountBuy: ethers.utils.parseUnits(sale_amount, 18)
  }
  return client.createOrder(params);
}

/**
* Creates a buy order (trade) for a given sell order
*/
async function buyNFT(client: ImmutableXClient, user: string, contract_address: string, token_id: string, order_id: number, buy_amount: string) {
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
      amountSell: ethers.BigNumber.from(buy_amount)
  }
  return client.createTrade(params);
}

async function listOrders(client: ImmutableXClient, sell_token_address: string, sell_metadata: string) {
  return client.getOrders({
    sell_metadata: sell_metadata,
    sell_token_address: sell_token_address,
    page_size: 10,
    direction: ImmutableMethodParams.ImmutableSortOrder.asc,
    status: ImmutableOrderStatus.active,
    order_by: 'buy_quantity'
  });
}

async function listOrdersGods(client: ImmutableXClient, sell_token_address: string, sell_metadata: string, buy_token_address: string) {
  return client.getOrders({
    buy_token_address: buy_token_address,
    sell_metadata: sell_metadata,
    sell_token_address: sell_token_address,
    page_size: 10,
    direction: ImmutableMethodParams.ImmutableSortOrder.asc,
    status: ImmutableOrderStatus.active,
    order_by: 'buy_quantity',
    include_fees: true
  });
}

async function listTrades(client: ImmutableXClient) {
  return client.getTrades();
}

async function getAsset(client: ImmutableXClient, collection: string) {
  return client.getAssets({
      collection: collection,
  });
}

// async function getAssetDetails(client: ImmutableXClient, token_address: string, token_id: string) {
//   return client.getAsset({
//       token_address: token_address,
//       token_id: token_id
//   });
// }

async function bestAsk(client: ImmutableXClient, sell_token_address: string, sell_metadata: string) {
  const orders = await listOrders(
    client,
    sell_token_address,
    sell_metadata
  );
  // console.log(orders.result[0])
  return orders.result[0];
}

async function bestAskGods(client: ImmutableXClient, sell_token_address: string, sell_metadata: string, buy_token_address: string) {
  const orders = await listOrdersGods(
    client,
    sell_token_address,
    sell_metadata,
    buy_token_address
  );
  // console.log(orders.result[0])
  return orders.result[0];
}

// async function arbNFT(best_ask_eth, best_ask_gods) {
//   const priceDiff = best_ask_gods.buy.data.quantity_with_fees - best_ask_eth.buy.data.quantity_with_fees
//   return priceDiff
// }

async function cancelOrder(client: ImmutableXClient, id: number) {
  return client.cancelOrder(id);  
}

async function getOrder(client: ImmutableXClient, id: number) {
  return client.getOrder({orderId: id});
}

async function checkOrderStatus(client: ImmutableXClient, trader: ethers.Wallet, orderId: number) {
  // check order status , if active settimeout again, if filled, stop timer
  const order_result = await getOrder(client, orderId);
  if (order_result.status === 'active') {
    console.log("Not traded yet!")
    setTimeout(() => {checkOrderStatus(client, trader, orderId)}, 5000);
  }
  else {
    const sell_token_address = '0xacb3c6a43d15b907e8433077b6d38ae40936fe2c';
    const sell_metadata = "%7B%22proto%22%3A%5B%22803%22%5D%2C%22quality%22%3A%5B%22Meteorite%22%5D%7D";
    const best_ask = await bestAsk(client, sell_token_address, sell_metadata);
    const trade_result = await buyNFT(client, trader.address, sell_token_address, best_ask.sell.data.token_id, orderId, best_ask.buy.data.quantity.toString());
    console.log("Created trade with id: ", trade_result.trade_id, "status: ", trade_result.status);
  }
  return null;
}

// const tokenList = [];


/**
 * Workflow::
 * 1. Get Trader L1 wallet;
 * 2. Get Trader L2 wallet;
 * 3. Print Trader L1 and L2 balances;
 * 4. List traders inventory, and holding GU cards;
 * 5. Get latest traders on 
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
  
  // console.log('Trader L1', trader.address, trader.privateKey);
  
  const traderClient = await getClient(trader);

  const inventory = await getUserInventory(traderClient, trader.address)
  // console.log('User Inventory', inventory.result);
  // console.log("User ETH balance: ", await getUserBalance(traderClient, trader.address, 'eth'));

  // print best ask of card eth: return to the cave
  const sell_token_address = '0xacb3c6a43d15b907e8433077b6d38ae40936fe2c';
  const sell_metadata = "%7B%22proto%22%3A%5B%22803%22%5D%2C%22quality%22%3A%5B%22Meteorite%22%5D%7D";
  // const best_ask = await bestAsk(traderClient, sell_token_address, sell_metadata);
  // console.log(best_ask)

  // print best ask of card gods: return to the cave
  const sell_token_address_gods = '0xacb3c6a43d15b907e8433077b6d38ae40936fe2c';
  const sell_metadata_gods = "%7B%22proto%22%3A%5B%22803%22%5D%2C%22quality%22%3A%5B%22Meteorite%22%5D%7D";
  const buy_token_address_gods = '0xccc8cb5229b0ac8069c51fd58367fd1e622afd97'
  const best_ask_gods = await bestAskGods(traderClient, sell_token_address_gods, sell_metadata_gods, buy_token_address_gods);
  console.log(ethers.utils.formatUnits(best_ask_gods.buy.data.quantity));


  // // print arb

  // const arb = await arbNFT(best_ask, best_ask_gods);
  // console.log("arb -> ", arb);


  // List the nft for sale
  const item = inventory.result[0]
  const price_data = best_ask_gods.buy.data
  const sale_amount = parseInt(ethers.utils.formatEther(price_data.quantity)) + 1.21;
  // ethers.utils.parseUnits(
  console.log("sale", sale_amount.toString());
  const order_result = await sellNFTGods(traderClient, trader.address, sell_token_address, item.token_id, sale_amount.toString());
  console.log("Created sell order with id:", order_result);

  // cancel order with order id
  // console.log("cancelling order ::", order_result.order_id)
  // const result = await cancelOrder(traderClient, order_result.order_id);

  /**
   * settimeout with created order id, crawl order status every 5 secs
   * as soon as order is filled/traded, call buyNFT method, and terminate settimeout.
   *  */ 

   setTimeout(() => {checkOrderStatus(traderClient, trader, order_result.order_id)}, 5000);


  // Buy the nft listed for sale (create trade)
  // const order_id = best_ask.order_id;
  // const buy_amount = best_ask.buy.data.quantity_with_fees
  // const trade_result = await buyNFT(traderClient, trader.address, sell_token_address, best_ask.sell.data.token_id, order_id, buy_amount);
  // console.log("Created trade with id: ", trade_result.trade_id, "status: ", trade_result.status);

  // console.log(`Trade Complete`);
  // console.log('User Inventory', await getUserInventory(traderClient, trader.address));
  
  // console.log("User ETH balance: ", await getUserBalance(traderClient, trader.address, 'eth'));
  
}

main()
.then(() => console.log('Main function call complete'))
.catch(err => {
  console.error(err);
  process.exit(1);
});