const { AddressTranslator } = require('nervos-godwoken-integration');

const ETHEREUM_ADDRESS = '<YOUR_ETHEREUM_ADDRESS>';

(async () => {
    console.log(`Using Ethereum address: ${ETHEREUM_ADDRESS}`);

    const addressTranslator = new AddressTranslator();
    await addressTranslator.init('testnet');

    const depositAddress = await addressTranslator.getLayer2DepositAddress(ETHEREUM_ADDRESS);

    console.log(`Deposit to Layer 2 address on Layer 1: \n${depositAddress}`);
})();