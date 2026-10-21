import { BN } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { sendIxs } from "../helpers";
import { RewardsFixture } from "./fixture";

export const accrue = async (
  env: RewardsFixture,
  owner: PublicKey,
  amount: BN,
) => {
  const ix = await env.program.methods
    .accrue(amount)
    .accountsPartial({ admin: env.payer.publicKey, owner })
    .instruction();
  await sendIxs(env.context, [env.payer], ix);
};

export const payReward = async (
  env: RewardsFixture,
  owner: PublicKey,
  ownerTokens: PublicKey,
) => {
  const ix = await env.program.methods
    .payReward()
    .accountsPartial({
      admin: env.payer.publicKey,
      user: env.userAccount(owner),
      mint: env.mint,
      userTokens: ownerTokens,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
  await sendIxs(env.context, [env.payer], ix);
};

export const setPrice = async (
  env: RewardsFixture,
  price: BN,
  signer: Keypair = env.bot,
) => {
  const ix = await env.program.methods
    .setPrice(price)
    .accountsPartial({ bot: signer.publicKey })
    .instruction();
  await sendIxs(env.context, [signer], ix);
};

export const buy = async (
  env: RewardsFixture,
  buyer: Keypair,
  buyerTokens: PublicKey,
  lamports: BN,
) => {
  const ix = await env.program.methods
    .buy(lamports)
    .accountsPartial({
      buyer: buyer.publicKey,
      mint: env.mint,
      buyerTokens,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
  await sendIxs(env.context, [buyer], ix);
};
