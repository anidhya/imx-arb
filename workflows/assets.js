import { getConfig, AssetsApi } from '@imtbl/core-sdk';

const config = getConfig('ropsten');
const address = '';
const getYourAsset = async (tokenAddress: string, tokenId: string) => {
  const assetsApi = new AssetsApi(config.api);

  const response = await assetsApi.getAsset({
    tokenAddress,
    tokenId,
  });

  return response;
};

const listAssets = async () => {
    const assetsApi = new AssetsApi(config.api);
    params = {user: address}
    const response = await assetsApi.listAssets();
}