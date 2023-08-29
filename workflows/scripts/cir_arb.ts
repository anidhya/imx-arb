require('dotenv').config();
import { ethers } from 'ethers';
import { ImmutableX, Config, WalletConnection } from '@imtbl/core-sdk';
import { InfuraProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { generateStarkPrivateKey, createStarkSigner } from '@imtbl/core-sdk';
const axios = require('axios').default;

axios.defaults.baseURL = 'https://api.coingecko.com/api/v3';

// import { getEthUsdPrice, getGodsUsdPrice } from './coingecko'
// import { ImmutableMethodParams,  } from '@imtbl/core-sdk';

// const config = Config.SANDBOX; // Or PRODUCTION or ROPSTEN
const config = Config.PRODUCTION;
// console.log(config);
const client = new ImmutableX(config);

// Create Ethereum signer
// const ethNetwork = 'goerli'; // Or 'mainnet'
// const provider = new InfuraProvider(ethNetwork, YOUR_INFURA_API_KEY);
// const ethSigner = new Wallet(YOUR_PRIVATE_ETH_KEY).connect(provider);

const ethNetwork = 'mainnet';
const infuraApiKey = process.env.infuraApiKey;
const provider = new InfuraProvider(ethNetwork, infuraApiKey);

const privateKey = process.env.privateKey
const ethSigner = new Wallet(privateKey).connect(provider);

// Create Stark signer
// const starkPrivateKey = generateStarkPrivateKey(); // Or retrieve previously generated key
const starkPrivateKey = process.env.starkPrivateKey
// const starkWallet = await generateStarkWallet(wallet)
const starkSigner = createStarkSigner(starkPrivateKey);

const signers = { ethSigner, starkSigner };

/**
 * List users current assets
 */
async function getUserInventory(client: ImmutableX, user: string) {
  return client.listAssets({
      user: user,
      pageSize: 10,
  });
}

/**
 * Reading order books
 */
async function listOrders(client: ImmutableX, sell_token_address: string, sell_metadata: string) {
  return client.listOrders({
    sellMetadata: sell_metadata,
    sellTokenAddress: sell_token_address,
    pageSize: 10,
    direction: 'asc',
    status: 'active',
    orderBy: 'buy_quantity'
  });
}

async function bestAsk(client: ImmutableX, sell_token_address: string, sell_metadata: string) {
  const orders = await listOrders(
    client,
    sell_token_address,
    sell_metadata
  );
  // console.log(orders.result[0])
  return orders.result[0];
}

async function listOrdersGods(client: ImmutableX, sell_token_address: string, sell_metadata: string, buy_token_address: string) {
  return client.listOrders({
    buyTokenAddress: buy_token_address,
    sellMetadata: sell_metadata,
    sellTokenAddress: sell_token_address,
    pageSize: 10,
    direction: 'asc',
    status: 'active',
    orderBy: 'buy_quantity',
    includeFees: true
  });
}

async function bestAskGods(client: ImmutableX, sell_token_address: string, sell_metadata: string, buy_token_address: string) {
  const orders = await listOrdersGods(
    client,
    sell_token_address,
    sell_metadata,
    buy_token_address
  );
  // console.log(orders.result[0])
  return orders.result[0];
}

/**
 * Other order operations
 */

 async function cancelOrder(client: ImmutableX, id: number) {
  return client.cancelOrder(signers, {order_id: id});
}

async function getOrder(client: ImmutableX, id: string) {
  return client.getOrder({id: id});
}

async function completeTrade(client: ImmutableX, orderId: number) {
  // check order status , if active settimeout again, if filled, stop timer
  const order_result = await getOrder(client, orderId.toString());
  // console.log("order result ----> ", order_result);
  if (order_result.status === 'active') {
    console.log("Not traded yet!")
    setTimeout(() => {completeTrade(client, orderId)}, 5000);
  }
  else {
    const sell_token_address = '0xacb3c6a43d15b907e8433077b6d38ae40936fe2c';
    const sell_metadata = "%7B%22proto%22%3A%5B%22803%22%5D%2C%22quality%22%3A%5B%22Meteorite%22%5D%7D";
    const best_ask = await bestAsk(client, sell_token_address, sell_metadata);
    const trade_result = await buyNFT(signers, ethSigner.address, orderId);
    console.log("Created trade with id: ", trade_result.trade_id, "status: ", trade_result.status);
  }
  return null;
}

/**
 * Creates a sell order for a given NFT in Gods market
 */
async function sellNFTGods(signers: WalletConnection, params:{amount: string, token_address: string, token_id: string}) {  
  console.log("amount selling --> ", ethers.utils.parseUnits(params.amount, 18).toString());
  return client.createOrder(signers, {
    buy: {
      type: 'ERC20',
      tokenAddress: "0xccc8cb5229b0ac8069c51fd58367fd1e622afd97",
      amount: ethers.utils.parseUnits(params.amount, 18).toString(), //'1230000000000000000', // Sale price in wei
    },
    sell: {
      type: 'ERC721',
      tokenAddress: params.token_address, //'0x0fb969a08c7c39ba99c1628b59c0b7e5611bd396',
      tokenId: params.token_id, //'5',
    },
  });  
}


/**
* Creates a buy order (trade) for a given sold asset
*/

async function buyNFT(signers: WalletConnection, user: string, order_id: number) {
  return client.createTrade(signers, {user: user, order_id: order_id})  
}

/**
 * Get gods/usd price
 */
async function getGodsUsdPrice() : Promise<any> {
  try {
    const response = await axios.get('/simple/token_price/ethereum?contract_addresses=0xccc8cb5229b0ac8069c51fd58367fd1e622afd97&vs_currencies=usd');
    console.log(Object.values(response.data));
    return Object.values(response.data)
  } catch (error) {
    console.error(error);
    return Object
  }
}

/**
 * Main arb logic
 */
async function main() {
  
  const inventory = await getUserInventory(client, ethSigner.address)
  console.log('User Inventory', inventory.result);
  // console.log("User ETH balance: ", await getUserBalance(traderClient, trader.address, 'eth'));

  // print best ask of card gods: return to the cave
  const sell_token_address_gods = '0xacb3c6a43d15b907e8433077b6d38ae40936fe2c';
  const sell_metadata_gods = "%7B%22proto%22%3A%5B%22803%22%5D%2C%22quality%22%3A%5B%22Meteorite%22%5D%7D";
  const buy_token_address_gods = '0xccc8cb5229b0ac8069c51fd58367fd1e622afd97'
  const best_ask_gods = await bestAskGods(client, sell_token_address_gods, sell_metadata_gods, buy_token_address_gods);
  console.log(ethers.utils.formatUnits(best_ask_gods.buy.data.quantity));

  // List the nft for sale
  const item = inventory.result[0]
  const price_data = best_ask_gods.buy.data
  
  let gods_usd_price = await getGodsUsdPrice();
  console.log(typeof(gods_usd_price[0]))
  gods_usd_price = gods_usd_price[0].usd;

  let sale_amount = parseInt(ethers.utils.formatUnits(price_data.quantity))
  const sale_amount_usd = sale_amount * gods_usd_price
  sale_amount = sale_amount + (0.1*sale_amount);
  // ethers.utils.parseUnits(
  console.log("sale", sale_amount.toString());

  const params = {amount: sale_amount.toString(), token_address: sell_token_address_gods, token_id: item.token_id}

  const order_result = await sellNFTGods(signers, params);
  console.log("Created sell order with id:", order_result);

  // cancel order with order id
  // console.log("cancelling order ::", order_result.order_id)
  // const result = await cancelOrder(client, order_result.order_id);

  setTimeout(() => {completeTrade(client, order_result.order_id)}, 5000);

}

main()
  .then(() => console.log('Main function call complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

