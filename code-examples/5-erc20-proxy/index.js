const fs = require('fs').promises;
const Web3 = require('web3');

const CompiledContractArtifact = require(`./artifacts/contracts/SudtERC20Proxy.sol/ERC20.json`);

const ACCOUNT_PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY || '<YOUR_ETHEREUM_PRIVATE_KEY>'; // Replace this with your Ethereum private key with funds on Layer 2.
const SUDT_ID = process.env.SUDT_ID || '<YOUR_SUDT_ID>'; // Replace this with SUDT ID received from depositing SUDT to Layer 2. This should be a number.
const SUDT_NAME = process.env.SUDT_NAME || 'MyToken';
const SUDT_SYMBOL = process.env.SUDT_SYMBOL || 'MTK';
const SUDT_TOTAL_SUPPLY = 9999999999;
const SUDT_DECIMALS = 18; // Make sure this matches your token! Eg. for ckETH it is 18.

const web3 = new Web3('https://godwoken-testnet-v1.ckbapp.dev');

const account = web3.eth.accounts.wallet.add(ACCOUNT_PRIVATE_KEY);

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
