import { ethers } from 'ethers';
import { ImmutableX, Config, WalletConnection } from '@imtbl/core-sdk';
import { InfuraProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { generateStarkPrivateKey, createStarkSigner } from '@imtbl/core-sdk';

// const config = Config.SANDBOX; // Or PRODUCTION or ROPSTEN
const config = Config.PRODUCTION;
// console.log(config);
const client = new ImmutableX(config);

const ethNetwork = 'mainnet';
const infuraApiKey = process.env.infuraApiKey
const provider = new InfuraProvider(ethNetwork, infuraApiKey);

const privateKey = process.env.privateKey
const ethSigner = new Wallet(privateKey).connect(provider);

// Create Stark signer
// const starkPrivateKey = generateStarkPrivateKey(); // Or retrieve previously generated key
const starkPrivateKey = process.env.starkPrivateKey
// const starkWallet = await generateStarkWallet(wallet)
const starkSigner = createStarkSigner(starkPrivateKey);

const signers = { ethSigner, starkSigner };

async function main() {
  client.prepareWithdrawal(signers, 100);
  client.completeWithdrawal(ethSigner, starkSigner, 'gods');
}

main()
.then(() => console.log('Main function call complete'))
.catch(err => {
  console.error(err);
  process.exit(1);
});