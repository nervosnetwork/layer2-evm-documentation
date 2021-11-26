import { SUDT_ERC20_PROXY_ABI } from "./contracts/SudtERC20Proxy-abi.mjs";

export const GODWOKEN_RPC_URL = 'https://godwoken-testnet-web3-rpc.ckbapp.dev';
export const POLYJUICE_CONFIG = {
    web3Url: GODWOKEN_RPC_URL,
    abiItems: SUDT_ERC20_PROXY_ABI
};
