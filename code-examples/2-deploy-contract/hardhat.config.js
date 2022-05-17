require("@nomiclabs/hardhat-waffle");

if (!process.env.PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY environment variable is missing.');
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
        accounts: [process.env.PRIVATE_KEY]
    }
  }
};
