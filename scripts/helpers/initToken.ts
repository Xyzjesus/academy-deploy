import { SigningCosmWasmClient } from "cosmwasm";
import { Cw20Coin, InstantiateMsg } from "../../bindings/Cw20.types";

export async function initToken(
  client: SigningCosmWasmClient,
  address: string,
  code: number
) {
  const initial_balances: Cw20Coin[] = [{ address, amount: "4200000000" }];
  const initMsg: InstantiateMsg = {
    name: "cryptopunk4201 token",
    symbol: "PUNK",
    decimals: 6,
    initial_balances,
    mint: {
      minter: address,
    },
  };

  const info = await client.instantiate(
    address,
    code,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    initMsg,
    "punk's not dead",
    "auto",
    {
      admin: address,
    }
  );
  return info.contractAddress;
}
