import { ethers } from 'ethers';
import { Wallet } from '@ethersproject/wallet';
import { InfuraProvider } from '@ethersproject/providers';
import { ImmutableXClient, ImmutableXWallet } from '@imtbl/imx-sdk';
import { ETHTokenType } from '@imtbl/imx-sdk';
import { getClient } from '../../client';

/**
 * Registers a user on Immutable X
 */
async function registerUser(client: ImmutableXClient, wallet: Wallet)
    : Promise<string> {
    // const starkKey = await new ImmutableXWallet({publicApiUrl: 'https://api.ropsten.x.immutable.com/v1', signer: wallet}).controller.account('starkex', 'immutablex', '1');
    const starkKey = await new ImmutableXWallet({publicApiUrl: 'https://api.x.immutable.com/v1', signer: wallet}).controller.account('starkex', 'immutablex', '1');
    console.log("starkKey: ", starkKey);
    console.log("wallet address:", wallet.address);
    try {
      const result = await client.register({
        etherKey: wallet.address,
        starkPublicKey: starkKey
    });  
    console.log("client register result: ", result);
    return result;
    } catch (error) {
      console.trace(error);
      return 'error';
    }
}

function random()
    : number {
    const min = 1;
    const max = 1000000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getUserInventory(client: ImmutableXClient, user: string) {
    return client.getAssets({
        user: user,
    });
}

async function getUserBalance(client: ImmutableXClient, user: string) {
    return client.getBalance({
        user: user,
        tokenAddress: 'eth',
    });
}

async function depositEth(client: ImmutableXClient, user: string, amount: string) {
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

async function main() {
    // const ethNetwork = 'ropsten';
    const ethNetwork = 'mainnet';
    // const infuraApiKey = 'a35145aa1ad64d328db4f95f931df361';
    const infuraApiKey = process.env.infuraApiKey
    
    const provider = new InfuraProvider(ethNetwork, infuraApiKey);

    // load existing wallet testnet
    // const privateKey = '0xce2314f3533bfc0337f36d0945f8056cdfb047c76525803bccff0468ff78573e';
    // const l1Wallet = new Wallet(privateKey);

    // load existing wallet mainnet
    const privateKey = process.env.privateKey
    const l1Wallet = new Wallet(privateKey);

    // create new wallet
    // const l1Wallet = Wallet.createRandom();

    const trader = l1Wallet.connect(provider);
    
    console.log('Trader L1', trader.address, trader.privateKey);
    
    const traderClient = await getClient(trader);
    // console.log("traderClient: ", traderClient);
    
    console.log("registering user : ", await registerUser(traderClient, trader)); 
      
    console.log("deposit eth to l2 wallet");
    // Deposit eth into buyer wallet
    const sale_amount = ethers.utils.parseEther("0.015").toString();
    console.log("Deposit transaction: ", await depositEth(traderClient, trader.address, sale_amount));
    const balance = await getUserBalance(traderClient, trader.address);
    console.log("Trader ETH balance: ", balance.balance.toString());
}

main()
  .then(() => console.log('Main function call complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
});