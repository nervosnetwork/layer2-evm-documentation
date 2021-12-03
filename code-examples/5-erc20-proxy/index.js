const fs = require('fs').promises;
const Web3 = require('web3');
const { PolyjuiceHttpProvider, PolyjuiceAccounts } = require("@polyjuice-provider/web3");

const CompiledContractArtifact = require(`./build/contracts/ERC20.json`);

const ACCOUNT_PRIVATE_KEY = '<YOUR_ETHEREUM_PRIVATE_KEY>'; // Replace this with your Ethereum private key with funds on Layer 2.
const SUDT_ID = '<YOUR_SUDT_ID>'; // Replace this with SUDT ID received from depositing SUDT to Layer 2. This should be a number.
const SUDT_NAME = 'MyToken';
const SUDT_SYMBOL = 'MTK';
const SUDT_TOTAL_SUPPLY = 9999999999;
const SUDT_DECIMALS = 18; // Make sure this matches your token! Eg. for ckETH it is 18.

const polyjuiceConfig = {
    web3Url: 'https://godwoken-testnet-web3-rpc.ckbapp.dev'
};
  
const provider = new PolyjuiceHttpProvider(
    polyjuiceConfig.web3Url,
    polyjuiceConfig,
);

provider.setMultiAbi([CompiledContractArtifact.abi]);

const web3 = new Web3(provider);

web3.eth.accounts = new PolyjuiceAccounts(polyjuiceConfig);
const account = web3.eth.accounts.wallet.add(ACCOUNT_PRIVATE_KEY);
web3.eth.Contract.setProvider(provider, web3.eth.accounts);

(async () => {
    // You need to use this exact bytecode for SUDT proxy otherwise it won't work
    const SudtProxyBytecode = (await (await fs.readFile('./contracts/SudtERC20Proxy.bin')).toString());

    console.log(`Using Ethereum address: ${account.address}`);

    const balance = BigInt(await web3.eth.getBalance(account.address));

    if (balance === 0n) {
        console.log(`Insufficient balance. Can't deploy contract. Please deposit funds to your Ethereum address: ${account.address}`);
        return;
    }

    console.log(`Deploying contract...`);

    const deployTx = new web3.eth.Contract(CompiledContractArtifact.abi).deploy({
        data: SudtProxyBytecode,
        arguments: [SUDT_NAME, SUDT_SYMBOL, SUDT_TOTAL_SUPPLY, SUDT_ID, SUDT_DECIMALS]
    }).send({
        from: account.address,
        gas: 6000000,
    });

    deployTx.on('transactionHash', hash => console.log(`Transaction hash: ${hash}`));

    const contract = await deployTx;

    console.log(`Deployed SUDT-ERC20 Proxy contract address: ${contract.options.address}`);
})();
