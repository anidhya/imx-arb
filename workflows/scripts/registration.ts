import { ethers } from 'ethers';
// import { getConfig } from '@imtbl/core-sdk';
import { InfuraProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { generateStarkWallet } from '@imtbl/core-sdk';
// import { ec } from 'elliptic';

// const config = Config.PRODUCTION;
// console.log(config);
// const client = getConfig('mainnet');

const ethNetwork = 'mainnet';
const infuraApiKey = process.env.infuraApiKey
const provider = new InfuraProvider(ethNetwork, infuraApiKey);
const privateKey = process.env.privateKey
const ethSigner = new Wallet(privateKey).connect(provider);

// Create Stark signer
// const starkPrivateKey = generateStarkPrivateKey(); // Or retrieve previously generated key
// console.log(starkPrivateKey);
// const starkSigner = createStarkSigner(starkPrivateKey);

// const signers = { ethSigner, starkSigner };

async function main() {

    const starkWallet = await generateStarkWallet(ethSigner);
    console.log(starkWallet.starkPublicKey);
    console.log(starkWallet.starkKeyPair.privateKey);
    console.log(starkWallet.starkKeyPair.getPrivate().toString('hex'));

    // register keys
    // client.registerOffchain(signers);
    // print keys
    // console.log("stark priv key ->", starkPrivateKey);
    // 0x040ee2425e8b9f4d726c1cbdceaf441f881c7872e0e4e902c57d171a0b3d0865
}

main()
.then(() => console.log('Main function call complete'))
.catch(err => {
  console.error(err);
  process.exit(1);
});