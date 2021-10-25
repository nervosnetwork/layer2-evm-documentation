# Infrastructure

## Force Bridge

Force Bridge is a piece of decentralized infrastructure that connects Nervos to other blockchain platforms such as Ethereum and Cardano. This bridge is used to move tokens and assets between the different platforms.

This allows value in all forms, be it tokens, NFTs, or other assets of value, to flow between different networks quickly and inexpensively. Developers can integrate with the bridge to reach audiences across multiple networks immediately, without needing to deploy new infrastructure to do so.

Force Bridge is designed to be both trustless and permissionless, replying on incentives to ensure security and continued operation. Anyone can deploy a new bridge, use an existing bridge, or participate in an existing bridge.

Developers can also integrate the Force Bridge protocol into their projects, giving their users a seamless way to do cross-chain transfers without having to leave the developer's dApp.

Force Bridge's operation is being rolled out in two phases:

The first phase, which is currently in progress, uses a Proof of Authority (PoA) setup with multiple trusted industry partners. This is being done initially, because there will not be enough bridge traffic at launch to give proper incentivization for a fully decentralization.

The second phase is fully decentralized and based on Proof of Stake (PoS). Anyone will be able to run a validator node and earn income from their participation. Nodes are kept honest by being required to put up a bond (the stake), which will be slashed if the node attempts to do malicious actions. As long as two-thirds (66.67%) of the nodes remain honest, the bridge will remain fully secure.

- [Github](https://github.com/nervosnetwork/force-bridge)
- [Documentation](https://github.com/nervosnetwork/force-bridge/tree/main/docs)

![Force Bridge](https://raw.githubusercontent.com/nervosnetwork/layer2-evm-documentation/master/conceptual-explainers/images/nervos-force-bridge.png)

## Nervos Explorer

The Nervos Explorer is a website that analyzes and organizes the data from the blockchain and makes it accessible through a user-friendly searchable website interface. Users and developers can quickly find out information about the blockchain without having to run a node, and without having to run complex commands.

Some of the common uses for the explorer are looking up a transaction to see all of the actions that occurred within it. Looking up an address to see all the transactions it was involved with, and the amount of tokens and assets that it holds. Looking up an individual cell to see the data contain within it, and the smart contracts associated with it.

The Nervos Explorer is available for both the Mainnet and the Testnet.

- [Official Website (Mainnet)](https://explorer.nervos.org/)
- [Official Website (Testnet)](https://explorer.nervos.org/aggron)
- [Github (Backend)](https://github.com/nervosnetwork/ckb-explorer)
- [Github (Frontend)](https://github.com/nervosnetwork/ckb-explorer-frontend)

![Nervos Explorer](https://raw.githubusercontent.com/nervosnetwork/layer2-evm-documentation/master/conceptual-explainers/images/nervos-explorer.png)

## Nervos Faucet

The Nervos Faucet is a website that allows developers to claim a small amount of CKBytes on the Testnet for the purposes of research and development.

This allows developers to test their dApps easily on the Testnet, without having to mine or purchase CKBytes on the Mainnet.

Developers can currently claim 10,000 CKBytes per address every 24 hours.

- [Official Website](https://faucet.nervos.org/)
- [Github](https://github.com/nervosnetwork/ckb-testnet-faucet)

![Nervos Testnet Faucet](https://raw.githubusercontent.com/nervosnetwork/layer2-evm-documentation/master/conceptual-explainers/images/nervos-faucet.png)
