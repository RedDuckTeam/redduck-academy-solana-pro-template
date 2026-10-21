import { assert } from "chai";

import { oneToken, tokenBalance } from "../helpers";
import { MultisigFixture, setupMultisig } from "./fixture";
import { approve, createProposal, execute, treasuryTransfer } from "./actions";

describe("06-proposal-anyone-can-execute", () => {
  let env: MultisigFixture;

  beforeEach(async () => {
    env = await setupMultisig();
  });

  it("executes an approved transfer from the treasury with the vault PDA signing", async () => {
    const [admin, bob] = env.members;
    const bobTokens = env.memberTokens(bob.publicKey);
    const transfer = treasuryTransfer(env, bobTokens, oneToken().muln(50));

    await createProposal(env, 1, bob, transfer);
    await approve(env, 1, admin);
    await approve(env, 1, bob);

    const before = await tokenBalance(env.context, bobTokens);
    await execute(env, 1, admin, transfer);
    const after = await tokenBalance(env.context, bobTokens);

    assert.equal((after - before).toString(), oneToken().muln(50).toString());
    const proposal = await env.program.account.proposal.fetch(env.proposal(1));
    assert.isTrue(proposal.executed);
  });
});
