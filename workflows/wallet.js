const privateKey = 'UPDATE WITH THE PRIVATE KEY HERE';
const l1Wallet = new Wallet(privateKey);

const loadWalletConnection = async (provider: AlchemyProvider) : Promise<WalletConnection> => {
    // L1 credentials    
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