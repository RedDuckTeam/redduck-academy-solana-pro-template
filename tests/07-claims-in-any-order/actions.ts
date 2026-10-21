import { BN } from "@coral-xyz/anchor";
import {
  Ed25519Program,
  Keypair,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import { sendIxs } from "../helpers";
import { ClaimsFixture } from "./fixture";

/** The message the oracle signs: device, amount as u64 LE, nonce as u64 LE. */
export const claimMessage = (device: PublicKey, amount: BN, nonce: BN) =>
  Buffer.concat([
    device.toBuffer(),
    amount.toArrayLike(Buffer, "le", 8),
    nonce.toArrayLike(Buffer, "le", 8),
  ]);

export const claim = async (
  env: ClaimsFixture,
  amount: BN,
  nonce: BN,
  caller: Keypair = env.payer,
  signer: Keypair = env.oracle,
) => {
  const signatureCheck = Ed25519Program.createInstructionWithPrivateKey({
    privateKey: signer.secretKey,
    message: claimMessage(env.device, amount, nonce),
  });
  const ix = await env.program.methods
    .claim(amount, nonce)
    .accountsPartial({
      caller: caller.publicKey,
      device: env.device,
      mint: env.mint,
      ownerTokens: env.ownerTokens,
      instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .instruction();
  await sendIxs(env.context, [caller], signatureCheck, ix);
};
