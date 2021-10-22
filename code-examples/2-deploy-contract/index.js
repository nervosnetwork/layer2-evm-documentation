const { existsSync } = require('fs');
const Web3 = require('web3');
const { PolyjuiceHttpProvider, PolyjuiceAccounts } = require("@polyjuice-provider/web3");

const contractName = process.argv.slice(2)[0];

if (!contractName) {
    throw new Error(`No compiled contract specified to deploy. Please put it in "src/examples/2-deploy-contract/build/contracts" directory and provide its name as an argument to this program, eg.: "node index.js SimpleStorage.json"`);
}

let compiledContractArtifact = null;
const filenames = [`./build/contracts/${contractName}`, `./${contractName}`];
for(const filename of filenames)
{
    if(existsSync(filename))
    {
        console.log(`Found file: ${filename}`);
        compiledContractArtifact = require(filename);
        break;
    }
    else
        console.log(`Checking for file: ${filename}`);
}

if(compiledContractArtifact === null)
    throw new Error(`Unable to find contract file: ${contractName}`);

const DEPLOYER_PRIVATE_KEY = '<YOUR_ETHEREUM_PRIVATE_KEY>'; // Replace this with your Ethereum private key with funds on Layer 2.

const polyjuiceConfig = {
    web3Url: 'https://godwoken-testnet-web3-rpc.ckbapp.dev'
};
  
const provider = new PolyjuiceHttpProvider(
    polyjuiceConfig.web3Url,
    polyjuiceConfig,
);

const web3 = new Web3(provider);

web3.eth.accounts = new PolyjuiceAccounts(polyjuiceConfig);
const deployerAccount = web3.eth.accounts.wallet.add(DEPLOYER_PRIVATE_KEY);
web3.eth.Contract.setProvider(provider, web3.eth.accounts);

(async () => {
    const balance = BigInt(await web3.eth.getBalance(deployerAccount.address));

    if (balance === 0n) {
        console.log(`Insufficient balance. Can't deploy contract. Please deposit funds to your Ethereum address: ${deployerAccount.address}`);
        return;
    }

    console.log(`Deploying contract...`);

    const deployTx = new web3.eth.Contract(compiledContractArtifact.abi).deploy({
        data: getBytecodeFromArtifact(compiledContractArtifact),
        arguments: []
    }).send({
        from: deployerAccount.address,
        gas: 6000000,
    });

    deployTx.on('transactionHash', hash => console.log(`Transaction hash: ${hash}`));

    const contract = await deployTx;

    console.log(`Deployed contract address: ${contract.options.address}`);
})();

function getBytecodeFromArtifact(contractArtifact) {
    return contractArtifact.bytecode || contractArtifact.data?.bytecode?.object
}