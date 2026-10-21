use anchor_lang::prelude::*;

use crate::Config;

/// Only the team's bot can write the price. While the bot runs, the protocol has a price.
#[derive(Accounts)]
pub struct SetPrice<'info> {
    pub bot: Signer<'info>,
    #[account(mut, seeds = [b"config"], bump = config.bump, has_one = bot)]
    pub config: Account<'info, Config>,
}

pub fn set_price(ctx: Context<SetPrice>, price: u64) -> Result<()> {
    let config = &mut ctx.accounts.config;
    config.price = price;
    config.price_time = Clock::get()?.unix_timestamp;
    Ok(())
}
