# Standards

## SUDT

The SUDT acronym stands for Simple User Defined Token. The SUDT standard is Nervos' first token standard, which allows for the creation of basic fungible tokens.

The SUDT standard is the Nervos equivalent of the Ethereum ERC20 standard. SUDT tokens are created on the Nervos CKB layer 1 blockchain to produce both native assets as well as wrapped from other blockchain token standards.

- [SUDT RFC](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0025-simple-udt/0025-simple-udt.md)
- [SUDT Official Implementation in C](https://github.com/nervosnetwork/ckb-miscellaneous-scripts/blob/master/c/simple_udt.c)
- [SUDT Example Implementation in Rust](https://github.com/jordanmack/developer-training-course-script-examples/blob/master/contracts/sudt/src/entry.rs)

## ERC20

The ERC20 token standard is the first major token in the Ethereum ecosystem. This standard allows for the creation of basic fungible tokens.

There are hundreds of thousands of ERC20 compatible tokens deployed on the Ethereum Mainnet, representing the majority of all smart contract usage on Ethereum.

Nervos can also support ERC20 tokens directly using Ethereum EVM compatibility provided by the Godwoken and Polyjuice frameworks. To facilitate this, the ERC20 token resides on a layer 2 network that is connected to the Nervos CKB layer 1 blockchain. ERC20 tokens can then move back and forth between layer 1 using the ERC20 Proxy Contract, which seamlessly exchanges an ERC20 token on layer 2 with an SUDT token on layer 1.

- [Documentation](https://ethereum.org/en/developers/docs/standards/tokens/erc-20/)
- [ERC20 RFC](https://eips.ethereum.org/EIPS/eip-20)

## ERC20 Proxy Contract

The ERC20 Proxy Contract is a special smart contract written in Solidity, which is designed to run on a layer 2 network utilizing the [Godwoken](https://github.com/Kuzirashi/gw-gitcoin-instruction/tree/master/src/conceptual-explainers/frameworks.md#godwoken) and [Polyjuice](https://github.com/Kuzirashi/gw-gitcoin-instruction/tree/master/src/conceptual-explainers/frameworks.md#polyjuice) frameworks. This contract provides a way for EVM code to interact with an ERC20 token interface that is interfacing directly with Polyjuice to control SUDT tokens on Layer 2 as if they were ERC20 tokens.

A deposit transaction is prepared on Layer 1 which takes the SUDT tokens and sends them to Godwoken to be locked, effectively taking them out of circulation on Layer 1. Godwoken will then issue the equivalent amount of SUDT tokens on Layer 2 for the user who deposited. The ERC20 Proxy Contract can then be used to view or transfer these layer 2 SUDT tokens.

A withdrawl follows the same process in reverse. The ERC20 Proxy Contract is used to send the layer 2 SUDT tokens to Godwoken where they are burned. The equivalent number of locked SUDT tokens on Layer 1 are then released back to the user.

- [Github](https://github.com/nervosnetwork/godwoken-polyjuice/tree/main/solidity/erc20)
