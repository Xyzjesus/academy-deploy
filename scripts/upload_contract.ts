import { Contract, getMnemonic } from "./helpers/utils";
import { connect } from "./helpers/connect";
import { malagaConfig } from "./networks";
import { hitFaucet } from "./helpers/hitFaucet";
import { uploadContracts } from "./helpers/uploadContracts";
import { initToken } from "./helpers/initToken";

const contracts: Contract[] = [
  {
    name: "cw20_base",
    wasmFile: "./contracts/cw20_base.wasm",
  },
];

async function main(): Promise<void> {
  /**
   *  We're going to upload & initialise the contract here!
   *  Check out the video course on academy.cosmwasm.com!
   */

  // get our mnemonic
  const mnemonic = getMnemonic();

  //get a signingclient
  const {client, address} = await connect(mnemonic, malagaConfig);

  //check if given wallet has enough balance
  const {amount} = await client.getBalance(address, malagaConfig.feeToken);

  // call a faucet
  if (amount === "0") {
    console.warn("not enough tokens on given wallet. calling faucet!");

    await hitFaucet(address, malagaConfig.feeToken, malagaConfig.faucetUrl);
    const {amount} = await client.getBalance(address, malagaConfig.feeToken);
    console.log(`new balance of ${address} is ${amount}`);
  }

  //upload the contract
  const codeId = await uploadContracts(client, address, contracts);

  //instantiate the contract
  const contractAddress = await initToken(client, address, codeId.cw20_base);
  
  console.log(contractAddress);

  }




main().then(
  () => {
    process.exit(0);
  },
  (error) => {
    console.error(error);
    process.exit(1);
  }
);
