use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Device {
    pub owner: Pubkey,
    /// The nonce of the last claim. The next claim has to carry nonce + 1.
    pub nonce: u64,
    pub bump: u8,
}
