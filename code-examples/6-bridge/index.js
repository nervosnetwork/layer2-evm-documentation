const Web3 = require('web3');
const { PolyjuiceHttpProvider } = require("@polyjuice-provider/web3");
const { AddressTranslator } = require('nervos-godwoken-integration');

const ETHEREUM_ADDRESS = '<YOUR_ETHEREUM_ADDRESS>';

const polyjuiceConfig = {
    web3Url: 'https://godwoken-testnet-web3-rpc.ckbapp.dev'
};
  
const provider = new PolyjuiceHttpProvider(
    polyjuiceConfig.web3Url,
    polyjuiceConfig,
);

const web3 = new Web3(provider);

(async () => {
    console.log(`Using Ethereum address: ${ETHEREUM_ADDRESS}`);
    
    const addressTranslator = new AddressTranslator();

    const depositAddress = await addressTranslator.getLayer2DepositAddress(web3, ETHEREUM_ADDRESS);

    console.log(`Deposit to Layer 2 address on Layer 1: \n${depositAddress.addressString}`);
})();