const Web3 = require('web3');
const { PolyjuiceHttpProvider, PolyjuiceAccounts } = require("@polyjuice-provider/web3");

const CONTRACT_ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_base",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_quote",
          "type": "string"
        }
      ],
      "name": "getReferenceData",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "rate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lastUpdatedBase",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lastUpdatedQuote",
              "type": "uint256"
            }
          ],
          "internalType": "struct IStdReference.ReferenceData",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_bases",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "_quotes",
          "type": "string[]"
        }
      ],
      "name": "getReferenceDataBulk",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "rate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lastUpdatedBase",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "lastUpdatedQuote",
              "type": "uint256"
            }
          ],
          "internalType": "struct IStdReference.ReferenceData[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];
const CONTRACT_ADDRESS = '0x633B14f58A1343Aeb43e9C68c8aFB4c866eBb649';

const polyjuiceConfig = {
    web3Url: 'https://godwoken-testnet-web3-rpc.ckbapp.dev',
    abiItems: CONTRACT_ABI
};
  
const provider = new PolyjuiceHttpProvider(
    polyjuiceConfig.web3Url,
    polyjuiceConfig,
);

const web3 = new Web3(provider);

web3.eth.accounts = new PolyjuiceAccounts(polyjuiceConfig);
web3.eth.Contract.setProvider(provider, web3.eth.accounts);

async function readCall() {
    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    const callResult = await contract.methods.getReferenceDataBulk(["BTC","ETH","CKB"], ["USD","USD","USD"]).call();

    console.log(`Read call result: ${callResult}`);
}

(async () => {
    console.log('Calling contract...');

    await readCall();
})();
