const Web3 = require('web3');

const CompiledContractArtifact = require(`./build/contracts/ERC20.json`);

const ETHEREUM_ADDRESS = '<YOUR_ETHEREUM_ADDRESS>';
const SUDT_PROXY_CONTRACT_ADDRESS = '<YOUR_SUDT_PROXY_CONTRACT_ADDRESS>';

const web3 = new Web3('https://godwoken-testnet-web3-v1-rpc.ckbapp.dev');

(async () => {
    console.log(`Using Ethereum address: ${ETHEREUM_ADDRESS}`);

    console.log(`Checking SUDT balance using proxy contract with address: ${SUDT_PROXY_CONTRACT_ADDRESS}...`);

    const contract = new web3.eth.Contract(CompiledContractArtifact.abi, SUDT_PROXY_CONTRACT_ADDRESS);
    console.log(await contract.methods.balanceOf(ETHEREUM_ADDRESS).call());
})();