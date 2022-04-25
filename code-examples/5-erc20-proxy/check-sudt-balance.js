const { ethers } = require('hardhat');

const ETHEREUM_ADDRESS = process.env.ETHEREUM_ADDRESS || '<YOUR_ETHEREUM_ADDRESS>';
const SUDT_PROXY_CONTRACT_ADDRESS = process.env.SUDT_PROXY_CONTRACT_ADDRESS || '<YOUR_SUDT_PROXY_CONTRACT_ADDRESS>';

(async () => {
    console.log(`Using Ethereum address: ${ETHEREUM_ADDRESS}`);

    console.log(`Checking SUDT balance using proxy contract with address: ${SUDT_PROXY_CONTRACT_ADDRESS}...`);

    if (ETHEREUM_ADDRESS === '<YOUR_ETHEREUM_ADDRESS>') {
        throw new Error('You need to fill <YOUR_ETHEREUM_ADDRESS> before starting the program.');
    }

    const provider = new ethers.providers.JsonRpcProvider('https://godwoken-testnet-web3-v1-rpc.ckbapp.dev');
    const contract = (await ethers.getContractFactory('ERC20')).attach(SUDT_PROXY_CONTRACT_ADDRESS).connect(provider);

    console.log(await contract.callStatic.balanceOf(ETHEREUM_ADDRESS));
})();