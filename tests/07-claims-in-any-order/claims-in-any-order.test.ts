import { assert } from "chai";

import { oneToken, toBN, tokenBalance } from "../helpers";
import { ClaimsFixture, setupClaims } from "./fixture";
import { claim } from "./actions";

describe("07-claims-in-any-order", () => {
  let env: ClaimsFixture;

  beforeEach(async () => {
    env = await setupClaims();
  });

  it("pays a reward the oracle signed", async () => {
    await claim(env, oneToken().muln(10), toBN(1));
    assert.equal(
      (await tokenBalance(env.context, env.ownerTokens)).toString(),
      oneToken().muln(10).toString(),
    );
    const device = await env.program.account.device.fetch(env.device);
    assert.equal(device.nonce.toNumber(), 1);
  });
});
