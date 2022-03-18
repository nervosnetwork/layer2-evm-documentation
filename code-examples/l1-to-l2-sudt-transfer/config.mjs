export const GODWOKEN_RPC_URL =
  "https://godwoken-testnet-web3-v1-rpc.ckbapp.dev";

export async function getPolyjuiceConfig() {
  return {
    rollupTypeHash: (
      await (
        await fetch(GODWOKEN_RPC_URL, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "poly_getRollupTypeHash",
            params: [],
            id: 1,
          }),
        })
      ).json()
    ).result,
    ethAccountLockCodeHash: (
      await (
        await fetch(GODWOKEN_RPC_URL, {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "poly_getEthAccountLockHash",
            params: [],
            id: 1,
          }),
        })
      ).json()
    ).result,
  };
}
