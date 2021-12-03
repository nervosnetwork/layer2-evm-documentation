const { Godwoker } = require("@polyjuice-provider/base");
const { utils } = require("@ckb-lumos/base");
const fetch = require('node-fetch');

const SUDT_TYPE_ARGS = "<YOUR_SUDT_TYPE_ARGS>";
const GODWOKEN_RPC_URL = "https://godwoken-testnet-web3-rpc.ckbapp.dev";

(async () => {
  const polyjuiceConfig = {
    rollupTypeHash: (await (await fetch(GODWOKEN_RPC_URL, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({jsonrpc:"2.0",method:"poly_getRollupTypeHash",params: [],id:1})
    })).json()).result,
    ethAccountLockCodeHash: (await (await fetch(GODWOKEN_RPC_URL, {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({jsonrpc:"2.0",method:"poly_getEthAccountLockHash",params: [],id:1})
      })).json()).result,
    web3Url: GODWOKEN_RPC_URL,
  };

  console.log(`Fetching SUDT ID for SUDT with Type Args: ${SUDT_TYPE_ARGS}`);
  const godwoker = new Godwoker(GODWOKEN_RPC_URL, {
    godwoken: {
      rollup_type_hash: polyjuiceConfig.rollupTypeHash,
      eth_account_lock: {
        code_hash: polyjuiceConfig.ethAccountLockCodeHash,
        hash_type: "type",
      },
    },
  });

  const sudtTypeScript = {
    code_hash:
      "0xc5e5dcf215925f7ef4dfaf5f4b4f105bc321c02776d6e7d52a1db3fcd9d011a4",
    hash_type: "type",
    args: SUDT_TYPE_ARGS,
  };
  const sudtScriptHash = utils.computeScriptHash(sudtTypeScript);

  console.log(`Layer 1 SUDT script hash:`, sudtScriptHash);

  const scriptHash = await godwoker.getScriptHashByAccountId(1);
  const script = await godwoker.getScriptByScriptHash(scriptHash);

  const layer2SudtScript = {
    code_hash: script.code_hash,
    hash_type: script.hash_type,
    args: polyjuiceConfig.rollupTypeHash + sudtScriptHash.slice(2),
  };
  console.log("Layer 2 SUDT script:", layer2SudtScript);

  const layer2SudtScriptHash = utils.computeScriptHash(layer2SudtScript);
  console.log(`Layer 2 SUDT script hash:`, layer2SudtScriptHash);

  try {
    const sudtId = await godwoker.getAccountIdByScriptHash(layer2SudtScriptHash);
    console.log(`
        >>>>> SUDT ID: ${parseInt(sudtId, 16)}
    `);
  } catch (error) {
    console.log(`Error: Couldn't get SUDT ID. Please make sure that SUDT has been deposited to Layer 2. It is necessary before trying to get its ID on Layer 2.`);

    console.error(error);
  }
})();
