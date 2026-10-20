use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

use crate::{Market, Position};

#[derive(Accounts)]
pub struct Borrow<'info> {
    pub owner: Signer<'info>,
    #[account(mut, seeds = [b"market"], bump = market.bump)]
    pub market: Account<'info, Market>,
    #[account(
        mut,
        seeds = [b"position", owner.key().as_ref()],
        bump = position.bump,
        has_one = owner,
    )]
    pub position: Account<'info, Position>,
    #[account(address = market.collateral_mint)]
    pub collateral_mint: Account<'info, Mint>,
    #[account(address = market.debt_mint)]
    pub debt_mint: Account<'info, Mint>,
    #[account(mut, token::mint = debt_mint)]
    pub owner_debt: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"debt_vault"], bump)]
    pub debt_vault: Account<'info, TokenAccount>,
    pub collateral_price: Account<'info, PriceUpdateV2>,
    pub debt_price: Account<'info, PriceUpdateV2>,
    pub token_program: Program<'info, Token>,
}

pub fn borrow(_ctx: Context<Borrow>, _amount: u64) -> Result<()> {
    todo!()
}
