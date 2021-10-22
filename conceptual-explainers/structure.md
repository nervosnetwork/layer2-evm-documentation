# Structure

### Mainnet / Testnet / Devnet

Nervos officially supports three different types of networks.

The Mainnet, also known as "Lina", is the live production network for Nervos. This public network is fully decentralized and permissionless, and relies on a robust Proof of Work (PoW) based incentive system to protect all of the assets on the network.

The Mainnet is the network people are referring to when they are talking about the "Nervos Blockchain" or when they casually refer to something being "on CKB". In casual conversation, Mainnet may also refer to any layer 2 network that is also connected connected to the layer 1 Mainnet.

The Testnet, also known as "Aggron", is the public sandbox network. The software used by this network is exactly the same as the Mainnet, but all tokens and assets on the Testnet have no value. This environment provides a safe place for developers to experiment in a realistic shared environment with other developers, without the associated cost or risk.

New features are always tested on the Testnet prior to release on the Mainnet. For this reason, the Testnet may occasionally not have 100% reliability. The Testnet also uses Proof of Work, but because none of the tokens have value, there is only a minimal amount of security provided. Due to the nature of a Testnet, all data there should be viewed as imperminant.

CKBytes on the Testnet have no value, but are still needed for testing. Developers can get free CKBytes from the [faucet](https://faucet.nervos.org).

A Devnet is a private network for testing purposes. It is similar to the Aggron Testnet, except that it is not a publicly shared environment. Devnets normally reside entirely on the developer's computer, and are created on-demand as they are needed by the developer. Multiple Devnets can be created as needed, and they can each have slightly different configurations, and be paused or deleted as needed.

When a developer begins working on a new dApp, using a Devnet is recommended place to begin. A new network can be created instantly, without having to wait for the network to synchronize. A Devnet uses simulated mining, meaning it is centralized, but extremely efficient and low power to operate. There is no faucet on a Devnet. Instead, there is a well-known account that contains a very large amount of CKBytes which are created in the genesis block. A developer can use the provided private keys to access these CKBytes, which should be more that enough for any necessary testing.

![Network Type Compare](https://raw.githubusercontent.com/Kuzirashi/gw-gitcoin-instruction/master/src/conceptual-explainers/images/network-type-compare.png)

### Layer 1 / Layer 2

Nervos uses a multi-layer architecture to address the blockchain challenges of security, scalability, and decentralization. Achieving high levels of all three on a single layer is difficult to impossible, and there are always tradeoffs. However, different layers can each address different concerns.

* Nervos' Layer 1 focuses on security and decentralization, providing trust to higher layers.
* Nervos' Layer 2 focuses on scalability, providing nearly instantaneous transactions for millions of users.

The two layers function together to achieve higher levels of decentralization, security, and scalability than would be possible on any single layer.

The Nervos blockchain represents layer 1 in this stack. Also known as the Common Knowledge Base, is the bottom-most layer in the Nervos ecosystem. It serves as a foundation to build on and provides trust to all layers built on top. It is designed to maximize decentralization while remaining minimal, flexible, and secure. Its main purpose is the reliable preservation of any data and assets stored within it.

Layer 2 is represented by multiple separate chains, each of which may have unique characteristics both in operation and governance. Layer 2 chains can take many forms, and do not have a rigid definition on Nervos.

A discrete layer 2 chain could be used for a single project or a group of projects. The consensus could be Proof of Authority based, Proof of Stake based, or a different mechanism. Even the programming model used on the layer 2 chain can be changed from the native Cell Model, to alternative models like EVM (for Ethereum Solidity compatibility) or EOS (for EOS compatibility).

Most layer 2 chains on Nervos will have certain common characteristics:

* Ability to transfer tokens and other assets to and from layer 1.
* Process transactions in parallel to the layer 1 chain to achieve higher scalability.
* Rely on layer 1 to settle consensus disputes and achieve higher levels of security than would otherwise be possible.

Nervos' first layer 2 offering will utilize the Godwoken and Polyjuice frameworks together to create an Ethereum compatible EVM environment that is capable of supporting Solidity based dApps. This layer 2 chain will be initially run by the Nervos Foundation during the initial launch phase, but will eventually convert into a decentralized chain which is operated by the community. All developers will be able to use this layer 2 chain permissionlessly, using the same tooling that is used for development with Ethereum.

![Layer 1 / Layer 2](https://raw.githubusercontent.com/Kuzirashi/gw-gitcoin-instruction/master/src/conceptual-explainers/images/layer-1-layer-2.png)

### Common User Action Flow

The dApp universe is expanding rapidly, but the majority of users are still on Ethereum. Because of this, support for Ethereum users is high priority for all dApp developers, and interoperability is essential for upcoming blockchains.

Recognizing this reality is one of the driving factors in Nervos' infrastructure design considerations. Nervos' interoperability is achieved with other blockchains by providing key pieces of infrastructure. One is [Force Bridge](https://github.com/Kuzirashi/gw-gitcoin-instruction/blob/master/src/conceptual-explainers/infrastructure.md#force-bridge), which allows tokens and assets to transfer to and from other blockchains seamlessly. Another is [PW-SDK](https://github.com/Kuzirashi/gw-gitcoin-instruction/blob/master/src/conceptual-explainers/frameworks.md#pw-sdk), a interoperability framework that allows users from different blockchains to immediately interact with Nervos Network using their existing dApp wallets.

An average Ethereum user will be able to transfer assets from other blockchains to Nervos using [Force Bridge](https://github.com/Kuzirashi/gw-gitcoin-instruction/blob/master/src/conceptual-explainers/infrastructure.md#force-bridge). Once the bridge transfer is complete, tokens and assets that were transferred over the bridge will reside on Nervos' Layer 1 blockchain. From there they can navigate through the Nervos ecosystem, interacting with dApps on Layer 1, or Layer 2.

![Common User Action Flow](https://raw.githubusercontent.com/Kuzirashi/gw-gitcoin-instruction/master/src/conceptual-explainers/images/common-user-flow.jpg)

The image above shows how an Ethereum user would start from the Ethereum blockchain, and end up interacting with a Solidity smart contract that is running on Nervos. The steps are as follows:

1. The user starts with assets, such as ETH, DAI, USDC, and USDT, in their MetaMask wallet.
2. The user opens Force Bridge in a web browser, and initiates an asset transfer to Nervos.
3. Force Bridge validates their deposit transaction, and issues a wrapped token, in the form of an [SUDT](https://github.com/Kuzirashi/gw-gitcoin-instruction/blob/master/src/conceptual-explainers/standards.md#sudt) on Layer 1.
4. The user would then use a dApp to deposit their SUDT assets from Layer 1 to the Layer 2 which has EVM compatibility provided by the [Godwoken](https://github.com/Kuzirashi/gw-gitcoin-instruction/blob/master/src/conceptual-explainers/frameworks.md#godwoken) and [Polyjuice](https://github.com/Kuzirashi/gw-gitcoin-instruction/blob/master/src/conceptual-explainers/frameworks.md#polyjuice) frameworks.
5. The user would then continue interacting with the dApp, and enjoy the benefits of Layer 2, such as extremely low fees and high transaction speed.

This process can be further streamlined. Developers will have the option of integrating directly with Force Bridge and can combine steps 2-4 into a single action which is done without leaving the dApp. The user will only need to use their existing MetaMask wallet throughout the entire process. They may not even be aware they have left Ethereum and are now using Nervos!
