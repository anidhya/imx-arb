const axios = require('axios').default;

axios.defaults.baseURL = 'https://api.coingecko.com/api/v3';

async function getEthUsdPrice() {
  try {
    const response = await axios.get('/simple/price?ids=ethereum&vs_currencies=usd');
    console.log(Object.values(response.data)[0]);
    return Object.values(response.data)[0]
  } catch (error) {
    console.error(error);
  }
}

async function getGodsUsdPrice() {
  try {
    const response = await axios.get('/simple/token_price/ethereum?contract_addresses=0xccc8cb5229b0ac8069c51fd58367fd1e622afd97&vs_currencies=usd');
    console.log(Object.values(response.data)[0]);
    return Object.values(response.data)[0]
  } catch (error) {
    console.error(error);
  }
}

export { getEthUsdPrice,getGodsUsdPrice }

// async function main() {
//   await getEthUsdPrice();
//   await getGodsUsdPrice();
// }

// main()
//   .then(() => console.log('Main function call complete'))
//   .catch(err => {
//     console.error(err);
//     process.exit(1);
//   });


// https://api.coingecko.com/api/v3/simple/price?ids=immutable-x%2Cethereum%2Cgods-unchained%2Cguild-of-guardians%2Cusd-coin%2Cecomi%2Capecoin&vs_currencies=usd

// https://api.x.immutable.com/v1/tokens

// https://api.x.immutable.com/v1/orders?auxiliary_fee_percentages=1&auxiliary_fee_recipients=0x12cB8E42c7ec27d30df6Cb8f44aa6445D0e1a78C&buy_token_address=0xccc8cb5229b0ac8069c51fd58367fd1e622afd97&buy_token_type=ERC20&direction=asc&include_fees=true&order_by=buy_quantity_with_fees&page_size=48&sell_token_address=0xacb3c6a43d15b907e8433077b6d38ae40936fe2c&sell_token_name=return%20to%20the%20cave&sell_token_type=ERC721&status=active