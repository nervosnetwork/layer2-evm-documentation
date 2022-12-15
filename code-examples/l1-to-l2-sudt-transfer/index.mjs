import {
  Address,
  AddressType,
  default as PWCoreDefault,
  IndexerCollector,
  RawProvider,
  SUDT,
  Platform,
  NervosAddressVersion,
  LockType
} from "@lay2/pw-core";
import { RPC } from "ckb-js-toolkit";

const PWCore = PWCoreDefault.default;

const ETHEREUM_PRIVATE_KEY =
  "0xd9066ff9f753a1898709b568119055660a77d9aae4d7a4ad677b8fb3d2a571e5";
const SUDT_ISSUER_LOCK_HASH =
  "0x232678824938dfd87a049122c4e244af88dad7faa79a262362f5bc5356ee4c64"; // aka Type Script arguments. You should find it in Layer 1 explorer SUDT Cell info.
const TARGET_ACCOUNT = '';

const _config = {
  INDEXER_URL: "https://mainnet.ckb.dev/indexer",
  CKB_URL: "https://mainnet.ckb.dev/rpc",
};

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

  const sudt = new SUDT(SUDT_ISSUER_LOCK_HASH);
  const sudtBalance = await collector.getSUDTBalance(sudt, new Address(ckbAddress.toCKBAddress(NervosAddressVersion.pre2021, LockType.pw), AddressType.ckb));

  console.log(`SUDT balance: ${sudtBalance}`);

  // console.log(`Transferring to another account: ${TARGET_ACCOUNT}`);
  // const layer1TxHash = await pwCore.sendSUDT(
  //   sudt,
  //   TARGET_ACCOUNT,
  //   sudtBalance,
  //   false,
  // );
  // console.log(`Layer 1 transaction hash: ${layer1TxHash}`);
})();
