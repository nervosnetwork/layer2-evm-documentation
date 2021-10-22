import keccak256 from "keccak256";
import TronWeb from "tronweb";
import { toBuffer } from "@polyjuice-provider/godwoken";
import LumosBase from "@ckb-lumos/base";
import { utils as ethersUtils } from 'ethers';
import { Godwoker } from '@polyjuice-provider/base';
import { SerializeRawL2Transaction } from "@polyjuice-provider/godwoken/schemas/index.js";
import { NormalizeRawL2Transaction } from "@polyjuice-provider/godwoken/lib/normalizer.js";

import { POLYJUICE_CONFIG } from "./config.mjs";

const { utils } = LumosBase;

const TRON_ACCOUNT_LOCK = {
  code_hash:
    "0x28380fadb43a6f139d61a2509b69ecd2fbb2f61847ef6d39371b4f906c151ab5",
  hash_type: "type",
};

const godwoker = new Godwoker(POLYJUICE_CONFIG.web3Url, {
  godwoken: {
    eth_account_lock: {
      code_hash: POLYJUICE_CONFIG.ethAccountLockCodeHash,
      hash_type: 'type'
    },
    rollup_type_hash: POLYJUICE_CONFIG.rollupTypeHash
  }
});


export function tronAddressBase58ToHex(tronAddressEncoded) {
  return `0x${TronWeb.utils.bytes
    .byteArray2hexStr(TronWeb.utils.crypto.decode58Check(tronAddressEncoded))
    .slice(2)}`;
}

function tronAddressHexToScriptHash(tronAddress) {
  const script = {
    ...TRON_ACCOUNT_LOCK,
    args: POLYJUICE_CONFIG.rollupTypeHash + tronAddress.slice(2),
  };

  const scriptHash = utils.computeScriptHash(script);

  return scriptHash;
}

function toArrayBuffer(buf) {
  let ab = new ArrayBuffer(buf.length);
  let view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

async function getAccountIdByTronAddressHex(address) {
  const scriptHash = tronAddressHexToScriptHash(address);
  const id = parseInt(await godwoker.getAccountIdByScriptHash(scriptHash));

  return id;
}

async function assembleRawL2TransactionTron(eth_tx) {
  const from = await getAccountIdByTronAddressHex(eth_tx.from);

  if (!from || !eth_tx.gas || !eth_tx.gasPrice) {
    throw new Error("assembleRawL2Transaction has missing properties");
  }

  const to = await godwoker.allTypeEthAddressToAccountId(eth_tx.to);
  const nonce = await godwoker.getNonce(from);
  const encodedArgs = godwoker.encodeArgs(eth_tx);
  const tx = {
    from_id: "0x" + BigInt(from).toString(16),
    to_id: "0x" + BigInt(to).toString(16),
    args: encodedArgs,
    nonce: "0x" + BigInt(nonce).toString(16),
  };
  return tx;
}

function generateTransactionMessageToSignTron(
  raw_l2tx,
  _sender_script_hash,
  _receiver_script_hash,
  add_prefix = false
) {
  const raw_tx_data = SerializeRawL2Transaction(
    NormalizeRawL2Transaction(raw_l2tx)
  );

  // @ts-ignore
  const rollup_type_hash = Buffer.from(
    godwoker.godwkenUtils.rollup_type_hash.slice(2),
    "hex"
  );
  const sender_script_hash = Buffer.from(_sender_script_hash.slice(2), "hex");
  const receiver_script_hash = Buffer.from(
    _receiver_script_hash.slice(2),
    "hex"
  );

  const data = toArrayBuffer(
    Buffer.concat([
      rollup_type_hash,
      sender_script_hash,
      receiver_script_hash,
      toBuffer(raw_tx_data),
    ])
  );
  const message = utils.ckbHash(data).serializeJson();

  if (add_prefix === false) {
    return message;
  }

  const TRX_MESSAGE_HEADER = "\x19TRON Signed Message:\n32";

  const prefix_buf = Buffer.from(TRX_MESSAGE_HEADER);
  const buf = Buffer.concat([prefix_buf, Buffer.from(message.slice(2), "hex")]);
  return `0x${keccak256(buf).toString("hex")}`;
}

async function generateMessageFromEthTransactionTron(tx) {
  const { from, to } = tx;
  const to_id = await godwoker.allTypeEthAddressToAccountId(to);
  const sender_script_hash = tronAddressHexToScriptHash(from);

  const receiver_script_hash = await godwoker.getScriptHashByAccountId(
    parseInt(to_id)
  );
  const polyjuice_tx = await assembleRawL2TransactionTron(tx);

  const message = await generateTransactionMessageToSignTron(
    polyjuice_tx,
    sender_script_hash,
    receiver_script_hash,
    true
  );

  return message;
}

function calcPolyjuiceTxHash(tx) {
  const tx_hash = utils.ckbHash(SerializeRawL2Transaction(NormalizeRawL2Transaction(tx))).serializeJson();
  return tx_hash;
}

export async function sendTronTransaction(fromTronAccount, toPolyjuiceAddress, callData) {
  const tronAddressHex = tronAddressBase58ToHex(fromTronAccount.address);

  const tx = {
    from: tronAddressHex,
    to: toPolyjuiceAddress,
    nonce: "0x0",
    gasPrice: "0x0",
    gas: "0x271110",
    value: "0x0",
    data: callData,
  };

  console.log({
    tx,
  });

  const polyjuiceTx = await assembleRawL2TransactionTron(tx);

  const signingKey = new ethersUtils.SigningKey(fromTronAccount.privateKey);

  const messageToSign = await generateMessageFromEthTransactionTron(tx);

  const _signature = signingKey.signDigest(messageToSign);
  const signature = [
    "0x",
    _signature.r.substring(2),
    _signature.s.substring(2),
    Number(_signature.v).toString(16),
  ].join("");

  const l2_tx = { raw: polyjuiceTx, signature: signature };

  const signedTx = {
    messageToSign,
    v: "0x0",
    r: "0x0",
    s: signature,
    rawTransaction: godwoker.serializeL2Transaction(l2_tx),
    transactionHash: calcPolyjuiceTxHash(polyjuiceTx),
  };

  const txHash = await godwoker.gw_submitSerializedL2Transaction(
    signedTx.rawTransaction
  );
  
  return txHash;
}