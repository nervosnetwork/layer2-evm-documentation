require("@nomiclabs/hardhat-waffle");

const PRIVATE_KEY = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

if (!process.env.PRIVATE_KEY) {
  console.log('Warning: PRIVATE_KEY environment variable is missing.');
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    'godwoken-testnet': {
        url: `https://godwoken-testnet-v1.ckbapp.dev`,
        accounts: [PRIVATE_KEY]
    }
  }
};
