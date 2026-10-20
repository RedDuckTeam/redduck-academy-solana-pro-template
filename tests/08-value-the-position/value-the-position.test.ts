import { assert } from "chai";

import { oneToken, tokenBalance } from "../helpers";
import { MarketFixture, setupMarket } from "./fixture";
import { borrow, deposit } from "./actions";

describe("08-value-the-position", () => {
  let env: MarketFixture;

  beforeEach(async () => {
    env = await setupMarket();
  });

  it("borrows against deposited collateral", async () => {
    await env.setPrices([150, 1], [1, 0.001]);
    await deposit(env, oneToken().muln(10));

    const before = await tokenBalance(env.context, env.payerDebt);
    await borrow(env, oneToken().muln(1_000));
    const after = await tokenBalance(env.context, env.payerDebt);

    assert.equal((after - before).toString(), oneToken().muln(1_000).toString());
    const position = await env.program.account.position.fetch(
      env.position(env.payer.publicKey),
    );
    assert.equal(position.collateral.toString(), oneToken().muln(10).toString());
    assert.equal(position.debt.toString(), oneToken().muln(1_000).toString());
  });
});
