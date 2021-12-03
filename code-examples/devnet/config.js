export const polyjuiceConfig = {
    web3Url: 'http://localhost:8024'
};

export const DEVNET_CONFIG = {
    ADDRESS_TRANSLATOR: {
        CKB_URL: 'http://localhost:8114',
        RPC_URL: polyjuiceConfig.web3Url,
        INDEXER_URL: 'http://localhost:8116',
        rollup_type_script: {
            args: '0x37ad0888c3c36f588b70a0e10cc13c377f488cf9092035f242a8285c3673aa89',
            code_hash: '0x9394306e2763a8e986b3a0f9636e628470d5d9ee8d697818e5361f74a9107b21',
            hash_type: 'type'
        },
        eth_account_lock_script_type_hash: '0xf96d799a3c90ac8e153ddadd1747c6067d119a594f7f1c4b1fffe9db0f304335',
        rollup_type_hash: '0x828b8a63f97e539ddc79e42fa62dac858c7a9da222d61fc80f0d61b44b5af5d4',
        deposit_lock_script_type_hash: '0x04498d5fc9cac4def9b0734c509caa1dead3ea91e07c8d3622e2e45cde94f4ab',
    }
}

// async function getPortalWalletLockLayer2DepositAddress(ethereumAddress) {
//     const depositAddress = await addressTranslator.getLayer2DepositAddress(web3, ethereumAddress, PortalWalletChainID.ckb_dev, {
//         pwLock: {
//             cellDep: new CellDep(DepType.code, new OutPoint('0xf6d9b57b6f78972ff2fdf93747cc7405141e3d2c53c000a5d269555393b880c8', '0x0')),
//             script: new Script('0xd6a5a0edb152e88e8bbc702e164441cb3890fae35da672b408d28ca9a1bde3ee', '0x', HashType.data)
//         },
//     });
//     return depositAddress.addressString;
// }