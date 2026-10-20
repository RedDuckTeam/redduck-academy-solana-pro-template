import { assert } from "chai";

import { getTime, oneToken, timeTravel, tokenBalance } from "../helpers";
import { RoundFixture, setupRounds } from "./fixture";
import { join, openRound, settle } from "./actions";

describe("09-write-the-exit", () => {
  let env: RoundFixture;

  beforeEach(async () => {
    env = await setupRounds();
  });

  it("pays the whole pot to the winner the executor names", async () => {
    const [alice, bob] = env.players;
    const deadline = (await getTime(env.context)) + 60n;
    await openRound(env, 1, deadline);
    await join(env, 1, alice, oneToken().muln(100));
    await join(env, 1, bob, oneToken().muln(50));

    await timeTravel(env.context, deadline);
    const before = await tokenBalance(env.context, bob.tokens);
    await settle(env, 1, bob);
    const after = await tokenBalance(env.context, bob.tokens);

    assert.equal((after - before).toString(), oneToken().muln(150).toString());
    const round = await env.program.account.round.fetch(env.round(1));
    assert.isTrue(round.settled);
  });
});
