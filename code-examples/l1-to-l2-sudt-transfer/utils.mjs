import { Godwoker }from "@polyjuice-provider/base";
import { GODWOKEN_RPC_URL, POLYJUICE_CONFIG } from './config.mjs';

import lumos from '@ckb-lumos/base';
const { utils } = lumos;

export async function getSudtIdFromTypeArgs(sudtTypeArgs) {
  const godwoker = new Godwoker(GODWOKEN_RPC_URL, {
    godwoken: {
      rollup_type_hash: POLYJUICE_CONFIG.rollupTypeHash,
      eth_account_lock: {
        code_hash: POLYJUICE_CONFIG.ethAccountLockCodeHash,
        hash_type: "type",
      },
    },
  });

  const sudtTypeScript = {
    code_hash:
      "0xc5e5dcf215925f7ef4dfaf5f4b4f105bc321c02776d6e7d52a1db3fcd9d011a4",
    hash_type: "type",
    args: sudtTypeArgs,
  };
  const sudtScriptHash = utils.computeScriptHash(sudtTypeScript);

  const scriptHash = await godwoker.getScriptHashByAccountId(1);
  const script = await godwoker.getScriptByScriptHash(scriptHash);

  const layer2SudtScript = {
    code_hash: script.code_hash,
    hash_type: script.hash_type,
    args: POLYJUICE_CONFIG.rollupTypeHash + sudtScriptHash.slice(2),
  };

  const layer2SudtScriptHash = utils.computeScriptHash(layer2SudtScript);

  try {
    const sudtId = await godwoker.getAccountIdByScriptHash(layer2SudtScriptHash);
    return parseInt(sudtId, 16);
  } catch (error) {
    console.log(`Error: Couldn't get SUDT ID. Please make sure that SUDT has been deposited to Layer 2. It is necessary before trying to get its ID on Layer 2.`);

    console.error(error);
  }
}
