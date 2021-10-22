# Frameworks

## Godwoken

Godwoken is a layer 2 rollup framework for use with the Nervos CKB layer 1 blockchain. When combined with the EVM-compatible Polyjuice framework, Solidity dApps can be run on Nervos' layer 2.

Godwoken is highly flexible and extensible, allowing it to support optimistic rollups, and potentially other rollup methods such as ZK-rollups in the future. Godwoken currently uses Proof of Authority based consensus, but will add Proof of Stake as an alternative in the near future.

Godwoken is designed to be used with a second framework which defines the programming model used within the layer 2 environment. Polyjuice is the first such implementation, which provides Ethereum EVM compatibility. Alternate implementations can be created to support compatibility with programming models from other blockchains, such as EOS, Stellar, and Libra.

- [Github](https://github.com/nervosnetwork/godwoken)
- [Documentation](https://github.com/nervosnetwork/godwoken/tree/master/docs)

## Godwoken Kicker

Godwoken Kicker is a tool which allows developers to quickly launch an instance of Godwoken-Polyjuice on a private Devnet. Since this runs on a brand new Devnet chain, there is no need to synchronize the Mainnet or Testnet.

This is useful to developers who need a quick solution to setup an Ethereum compatible Nervos environment to test compatibility with an existing Solidity dApps.

- [Github](https://github.com/RetricSu/godwoken-kicker)

## Polyjuice

Polyjuice is an Ethereum EVM-compatible execution environment, which allows Solidity based smart contracts to run on Nervos. The goal of the project is 100% compatibility, allowing all Ethereum contracts to run on Nervos without any modification.

Polyjuice is designed to be used with the Godwoken layer 2 rollup framework. This allows Polyjuice to completely move smart contract execution off of layer 1 to layer 2, providing scalability that goes far beyond what the Ethereum Mainnet is capable of today.

- [Github](https://github.com/nervosnetwork/godwoken-polyjuice)

## PW-SDK

PW-SDK is an interoperability dApp framework created by the [Lay2](https://lay2.tech/) development team. PW-SDK consists of two primary components, PW-Core and PW-Lock.

PW-Core is a Typescript based framework to build transactions and interface with common dApp wallets from other blockchains, such as the extremely popular [MetaMask](https://github.com/Kuzirashi/gw-gitcoin-instruction/blob/master/src/conceptual-explainers/wallets.md#metamask) wallet. While originally built for the front-end, PW-SDK now also has backend development support.

PW-Lock is a generic multi-chain lock script (smart contract) that allows Nervos to support signatures from Bitcoin, Ethereum, EOS, Tron, as well as other blockchains. This allows Nervos to directly support interoperability with other blockchains by allowing their addresses to automatically map to Nervos CKB addresses.

PW-Core and PW-Lock successfully utilize the flexibility of Nervos' underlying platform, giving Nervos distict advantage over the competition when it comes to supporting interoperability. Users from other chains can begin interacting with Nervos dApps immediately, without needing to install any new software, and without needing to change their wallet configuration.

Lay2 are also the developers of the popular [Portal Wallet](https://ckb.pw/), a web based wallet for Nervos. This wallet relies on the MetaMask wallet browser extension for private key management.

- [Github](https://github.com/lay2dev/pw-core)
- [Documentation](https://docs.lay2.dev/pw-sdk/)
