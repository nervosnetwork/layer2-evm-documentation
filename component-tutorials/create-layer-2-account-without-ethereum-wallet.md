---
description: >-
  The easiest way to create Nervos Layer 2 account is to use MetaMask. However,
  if you prefer, you can use default CKB account (eg. one created using ckb-cli)
  to create Nervos Layer 2 account.
---

# Create Layer 2 Account without Ethereum wallet

### 1. Create and Fund an Account with CKBytes on Layer 1

In this first step you must create an account on the Testnet Nervos CKB Layer 1 blockchain, fund it with some CKBytes, then export the private key for the account so it can be provided to other scripts.

This can be accomplished easily using the [ckb-cli](../concept-explainers/tooling.md#ckb-cli) command line tool that is included with the [CKB Node](../concept-explainers/tooling.md#ckb-node) software. Free Testnet CKBytes can be obtained by using the [Nervos Faucet](../concept-explainers/infrastructure.md#nervos-faucet).

For instructions on completing this step, please follow the steps in [this tutorial](1.setup.account.in.ckb.cli.md).

### 2. Deposit some CKBytes on Layer 2

In this step you must make a deposit of CKBytes from Layer 1 to the Layer 2 which is provided by Godwoken. This step is necessary for Godwoken to create the user's Layer 2 account.

On Nervos, the user is responsible for paying state rent for any on-chain data they use, and this is done by requiring the user to lock 1 CKByte for every byte of data that needs to be stored on-chain. This is different from Ethereum, where state rent is still in the planning phases and has not been implemented yet. This deposit is used by Godwoken to lock CKBytes to pay the required state rent. For a more detail explanation about the tokenomics of Nervos, we recommended you view the [Crypto-Economics Whitepaper](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0015-ckb-cryptoeconomics/0015-ckb-cryptoeconomics.md).

This deposit can be made using the example script code provided in the tutorial below. Make sure you have your private key from the previous step available since it will be needed by the example script.

For instructions on completing this step, please follow the steps in [this tutorial](4.layer2.deposit.md).
