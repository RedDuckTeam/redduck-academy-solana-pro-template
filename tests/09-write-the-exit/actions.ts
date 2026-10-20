import { BN } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { sendIxs } from "../helpers";
import { Player, RoundFixture } from "./fixture";

export const openRound = async (env: RoundFixture, id: number, deadline: bigint) => {
  const ix = await env.program.methods
    .openRound(new BN(id), new BN(deadline.toString()))
    .accountsPartial({ admin: env.payer.publicKey, round: env.round(id) })
    .instruction();
  await sendIxs(env.context, [env.payer], ix);
};

export const join = async (env: RoundFixture, id: number, player: Player, amount: BN) => {
  const ix = await env.program.methods
    .join(amount)
    .accountsPartial({
      player: player.keypair.publicKey,
      round: env.round(id),
      mint: env.mint,
      playerTokens: player.tokens,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
  await sendIxs(env.context, [player.keypair], ix);
};

export const settle = async (env: RoundFixture, id: number, winner: Player) => {
  const round = env.round(id);
  const ix = await env.program.methods
    .settle()
    .accountsPartial({
      executor: env.executor.publicKey,
      round,
      winnerEntry: env.entry(round, winner.keypair.publicKey),
      mint: env.mint,
      winnerTokens: winner.tokens,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
  await sendIxs(env.context, [env.executor], ix);
};
