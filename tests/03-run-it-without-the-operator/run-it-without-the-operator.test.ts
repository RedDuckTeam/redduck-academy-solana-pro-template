import { assert } from "chai";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { oneToken, toBN, tokenBalance } from "../helpers";
import { RewardsFixture, setupRewards } from "./fixture";
import { accrue, buy, payReward, setPrice } from "./actions";

describe("03-run-it-without-the-operator", () => {
  let env: RewardsFixture;

  beforeEach(async () => {
    env = await setupRewards();
  });

  it("pays a reward and sells tokens while the admin and the bot are running", async () => {
    await accrue(env, env.user.publicKey, oneToken().muln(100));
    await payReward(env, env.user.publicKey, env.userTokens);
    assert.equal(
      (await tokenBalance(env.context, env.userTokens)).toString(),
      oneToken().muln(100).toString(),
    );

    // one whole token costs 0.01 SOL
    await setPrice(env, toBN(LAMPORTS_PER_SOL / 100));
    await buy(
      env,
      env.stranger,
      env.strangerTokens,
      toBN(LAMPORTS_PER_SOL / 10),
    );
    assert.equal(
      (await tokenBalance(env.context, env.strangerTokens)).toString(),
      oneToken().muln(10).toString(),
    );
  });
});
