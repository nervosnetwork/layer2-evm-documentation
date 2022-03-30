import Web3 from "web3";
import { AddressTranslator } from "nervos-godwoken-integration";
import {
  Address,
  AddressType,
  Amount,
  AmountUnit,
  Builder,
  default as PWCoreDefault,
  IndexerCollector,
  RawProvider,
  SUDT,
  Platform,
  NervosAddressVersion,
  LockType
} from "@lay2/pw-core";
import { RPC } from "ckb-js-toolkit";
import fs from 'fs/promises';

import { SUDT_ERC20_PROXY_ABI } from "./contracts/SudtERC20Proxy-abi.mjs";
import { GODWOKEN_RPC_URL } from "./config.mjs";
import { getSudtIdFromTypeArgs } from "./utils.mjs";

/**
 * This script transfers SUDT from L1 account secured by PortalWallet to Godwoken (L2).
 */

const PWCore = PWCoreDefault.default;

const ETHEREUM_PRIVATE_KEY =
  "0xd9066ff9f753a1898709b568119055660a77d9aae4d7a4ad677b8fb3d2a571e5";
const ETHEREUM_ADDRESS = "0xD173313A51f8fc37BcF67569b463abd89d81844f";
const SUDT_ISSUER_LOCK_HASH =
  "0xc43009f083e70ae3fee342d59b8df9eec24d669c1c3a3151706d305f5362c37e"; // aka Type Script arguments. You should find it in Layer 1 explorer SUDT Cell info.
const SUDT_AMOUNT_TO_SEND = new Amount("1", AmountUnit.ckb); // 1 SUDT
const SUDT_NAME = "dCKB";
const SUDT_SYMBOL = "dCKB";
const SUDT_TOTAL_SUPPLY = "9999999999999999999";
const SUDT_DECIMALS = 8;
const EXISTING_SUDT_PROXY_ADDRESS = '0x884541623C1B26A926a5320615F117113765fF81'; // OPTIONAL, CAN SKIP DEPLOYMENT

const _config = {
  INDEXER_URL: "https://testnet.ckb.dev/indexer",
  CKB_URL: "https://testnet.ckb.dev/rpc",
};

const web3 = new Web3(GODWOKEN_RPC_URL);

const account = web3.eth.accounts.wallet.add(ETHEREUM_PRIVATE_KEY);

function asyncSleep(ms = 1000) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitUntilCommitted(txHash, rpc, timeout = 18) {
  for (let index = 0; index < timeout; index++) {
    const data = await rpc.get_transaction(txHash);
    const status = data.tx_status.status;
    console.log(`tx ${txHash} is ${status}, waited for ${index * 10} seconds`);
    await asyncSleep(10000);
    if (status === "committed") {
      return;
    }
  }
  throw new Error(`tx ${txHash} not committed in ${timeout * 10} seconds`);
}

/**
 * This demo will transfer SUDT from Layer 1 to Layer 2.
 *
 * Your Layer 1 CKB address needs to have some SUDTs already.
 */
(async () => {
  const rpc = new RPC(_config.CKB_URL);
  const provider = new RawProvider(ETHEREUM_PRIVATE_KEY, Platform.eth);
  await provider.init();
  const collector = new IndexerCollector(_config.INDEXER_URL);
  const pwCore = await new PWCore(_config.CKB_URL).init(provider, collector);
  
  const ckbAddress = provider.address;
  console.log(`Transferring from CKB address: ${ckbAddress.toCKBAddress(NervosAddressVersion.ckb2021, LockType.pw)}`);

  const addressTranslator = new AddressTranslator();
  await addressTranslator.init('testnet');
  console.log(`To Ethereum address on Layer 2: ${ETHEREUM_ADDRESS}`);

  const layer2depositAddress = await addressTranslator.getLayer2DepositAddress(
    ETHEREUM_ADDRESS
  );
  console.log(
    `Deposit to Layer 2 address on Layer 1: \n${layer2depositAddress}`
  );

  const sudt = new SUDT(SUDT_ISSUER_LOCK_HASH);
  const sudtBalance = await collector.getSUDTBalance(sudt, new Address(ckbAddress.toCKBAddress(NervosAddressVersion.pre2021, LockType.pw), AddressType.ckb));
  const options = {
    witnessArgs: Builder.WITNESS_ARGS.Secp256k1Pw,
    autoCalculateCapacity: true,
    minimumOutputCellCapacity: new Amount('400', AmountUnit.ckb),
    defaultCollectorOptions: {
      lockType: LockType.pw
    },
    changeCellLockType: LockType.pw
  };

  console.log(`SUDT balance: ${sudtBalance}`);

  if (sudtBalance.lt(SUDT_AMOUNT_TO_SEND)) {
    console.log(`
            You don't have enough SUDT balance.
            Required balance: "${SUDT_AMOUNT_TO_SEND.toString()}".
            Your balance: "${sudtBalance.toString()}".
            Try sending more SUDT tokens to your Layer 1 address: "${
              ckbAddress.addressString
            }".    
        `);
    process.exit(1);
  }

  console.log(`Transferring to Layer 2`);
  const layer1TxHash = await pwCore.sendSUDT(
    sudt,
    new Address(layer2depositAddress, AddressType.ckb),
    SUDT_AMOUNT_TO_SEND,
    false,
    null,
    options
  );
  console.log(`Layer 1 transaction hash: ${layer1TxHash}`);

  await waitUntilCommitted(layer1TxHash, rpc);

  console.log(`Getting SUDT ID on Layer 2...`);

  const sudtId = await getSudtIdFromTypeArgs(SUDT_ISSUER_LOCK_HASH);

  console.log(`SUDT ID on Layer 2: ${sudtId}`);

  console.log(`Deploying SUDT proxy contract to check balance on Layer 2...`);

  const SudtProxyBytecode = await (
    await fs.readFile("./contracts/SudtERC20Proxy.bin")
  ).toString();

  const balance = BigInt(await web3.eth.getBalance(account.address));

  if (balance === 0n) {
    console.log(
      `Insufficient balance on Layer 2. Can't deploy contract. Please deposit funds to your Ethereum address: ${account.address}`
    );
    return;
  }

  let contract;
  if (EXISTING_SUDT_PROXY_ADDRESS) {
    contract = new web3.eth.Contract(SUDT_ERC20_PROXY_ABI, EXISTING_SUDT_PROXY_ADDRESS);
  } else {
    console.log(`Deploying contract...`);

    const deployTx = new web3.eth.Contract(SUDT_ERC20_PROXY_ABI)
      .deploy({
        data: SudtProxyBytecode,
        arguments: [
          SUDT_NAME,
          SUDT_SYMBOL,
          SUDT_TOTAL_SUPPLY,
          sudtId,
          SUDT_DECIMALS,
        ],
      })
      .send({
        from: account.address,
        gas: 6000000
      });

    deployTx.on("transactionHash", (hash) =>
      console.log(`Layer 2 SUDT-ERC20 Proxy deploy transaction hash: ${hash}`)
    );

    contract = await deployTx;

    console.log(
      `Deployed SUDT-ERC20 Proxy contract address: ${contract.options.address}`
    );
  }

  console.log(`Getting balance on Layer 2...`);

  console.log(`Waiting 120s before checking Layer 2 balance to give operator time to process SUDT deposit.`);
  await asyncSleep(120000);

  const tokenBalanceOnLayer2 = await contract.methods.balanceOf(ETHEREUM_ADDRESS).call();
  console.log({
      tokenBalanceOnLayer2
  });
})();
