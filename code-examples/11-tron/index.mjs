import Web3 from "web3";
import { PolyjuiceHttpProvider } from "@polyjuice-provider/web3";

import { POLYJUICE_CONFIG } from "./config.mjs";
import { sendTronTransaction } from "./helpers.mjs";

const ACCOUNT_PRIVATE_KEY = '<YOUR_TRON_PRIVATE_KEY>'; // Replace this with your Tron private key with funds on Layer 2.
const CONTRACT_ABI = [<YOUR_CONTRACT_ABI>]; // this should be an Array []
const CONTRACT_ADDRESS = '<YOUR_CONTRACT_ADDRESS>';
const TRON_ADDRESS = '<YOUR_TRON_ADDRESS>';

const provider = new PolyjuiceHttpProvider(
  POLYJUICE_CONFIG.web3Url,
  POLYJUICE_CONFIG,
);

const web3 = new Web3(provider);

async function readCall() {
  const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

  const callResult = await contract.methods.<YOUR_READ_FUNCTION_NAME>().call();

  console.log(`Read call result: ${callResult}`);
}

async function writeCall() {
  const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

  const callData = contract.methods.<YOUR_WRITE_FUNCTION_NAME>().encodeABI();

  const txHash = await sendTronTransaction(
    { address: TRON_ADDRESS, privateKey: ACCOUNT_PRIVATE_KEY },
    CONTRACT_ADDRESS,
    callData
  );

  console.log(`Write call transaction hash: ${txHash}`);

  console.log(`Waiting for tx receipt doesn't work for Tron calls, but if transaction was submitted then you can check the smart-contract state after 120s and the state should be changed successfully. Waiting 2 minutes...`);
  await new Promise(r => setTimeout(r, 120 * 1000));

  console.log(`Write call finished.`);
}

(async () => {
  console.log(`Using Tron address: ${TRON_ADDRESS}`);
  console.log("Calling contract...");

  // Check smart contract state before state change.
  await readCall();

  // Change smart contract state.
  await writeCall();

  // Check smart contract state after state change.
  await readCall();
})();
