import { assert } from "chai";

import { oneToken, tokenBalance } from "../helpers";
import { PoolFixture, setupPool } from "./fixture";
import { addRewards, claim, stake } from "./actions";

describe("04-rewards-without-a-loop", () => {
  let env: PoolFixture;

  beforeEach(async () => {
    env = await setupPool();
  });

  it("splits a reward between three stakers in proportion to their stake", async () => {
    const [a, b, c] = env.stakers;
    await stake(env, a, oneToken().muln(100));
    await stake(env, b, oneToken().muln(300));
    await stake(env, c, oneToken().muln(600));
    const before = await Promise.all(
      env.stakers.map((s) => tokenBalance(env.context, s.tokens)),
    );

    await addRewards(env, oneToken().muln(100));
    await claim(env, a);
    await claim(env, b);
    await claim(env, c);

    const after = await Promise.all(
      env.stakers.map((s) => tokenBalance(env.context, s.tokens)),
    );
    assert.equal(
      (after[0] - before[0]).toString(),
      oneToken().muln(10).toString(),
    );
    assert.equal(
      (after[1] - before[1]).toString(),
      oneToken().muln(30).toString(),
    );
    assert.equal(
      (after[2] - before[2]).toString(),
      oneToken().muln(60).toString(),
    );
  });
});
