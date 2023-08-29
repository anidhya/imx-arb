import { ethers } from 'ethers';
import { Wallet } from '@ethersproject/wallet';
import { InfuraProvider } from '@ethersproject/providers';
import { ERC20TokenType, ERC20TokenTypeT, ImmutableXClient, ImmutableXWallet, sleep } from '@imtbl/imx-sdk';
import { ETHTokenType } from '@imtbl/imx-sdk';
import { getClient } from '../../client';

async function getUserBalance(client: ImmutableXClient, user: string) {
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

async function withdrawEth(client: ImmutableXClient, user: string, amount: string) {
    const token = {
        type: ETHTokenType.ETH,
        data: {
            decimals: 18,
        },
    }
    const quantity = ethers.BigNumber.from(amount);
    return client.prepareWithdrawal({
        user: user,
        token: token,
        quantity: quantity
    });
}

async function withdrawGods(client: ImmutableXClient, user: string, amount: string) {
    const token = {
        type: ERC20TokenType.ERC20,
        data: {
            symbol: 'gods',
            decimals: 18,
            tokenAddress: ''
        },
    }
    const quantity = ethers.BigNumber.from(amount);
    return client.prepareWithdrawal({
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
    
    // console.log("registering user : ", await registerUser(traderClient, trader)); 
      
    // // Withdraw eth 
    // console.log("withdraw eth to l1 wallet");
    // const sale_amount = ethers.utils.parseEther("0.015").toString();
    // console.log("Withdraw transaction: ", await withdrawEth(traderClient, trader.address, sale_amount));

    // Withdraw gods 
    console.log("withdraw gods to l1 wallet");
    const sale_amount = ethers.utils.parseUnits("0.015", 18).toString();
    console.log("Withdraw transaction: ", await withdrawGods(traderClient, trader.address, sale_amount));

    sleep(3)
    const balance = await getUserBalance(traderClient, trader.address);
    const balance_gods = await getUserBalanceGods(traderClient, trader.address);
    console.log("Trader ETH balance: ", balance.balance.toString());
    console.log("Trader Gods balance: ", balance_gods.balance.toString());
}

main()
  .then(() => console.log('Main function call complete'))
  .catch(err => {
    console.error(err);
    process.exit(1);
});