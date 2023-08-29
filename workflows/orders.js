const loadWalletConnection = async (provider: AlchemyProvider) : Promise<WalletConnection> => {
    // L1 credentials
    const privateKey = ""
    const l1Wallet = new Wallet(privateKey);
    const l1Signer = l1Wallet.connect(alchemyProvider);
    // L2 credentials
    const starkWallet = await generateStarkWallet(l1Signer);
    const l2Signer = new BaseSigner(starkWallet.starkKeyPair);
  
    return {
      l1Signer,
      l2Signer,
    };
  };
  
const walletConnection = await loadWalletConnection(alchemyProvider);

const contractAddress = "0xaa84c36e454e632c6880d2563986be75718fbc6f"
const tokenID = ""
var request = {
  amountSell: "1",
  amountBuy: price, //2 ETH price
  user: process.env.ADDRESS.toLowerCase(), //Address of the wallet you are using
  include_fees: true, //Includes fees in price (true/false)
  tokenSell: {
    type: ERC721TokenType.ERC721,
    data: {
      tokenAddress: contractAddress.toLowerCase(),
      tokenId: tokenID.toLowerCase(),
    },
  },
  tokenBuy: {
    type: ETHTokenType.ETH,
    data: {
      decimals: 18,
    },
  },
}

await coreSdkWorkflows.createOrder(walletConnection,request);