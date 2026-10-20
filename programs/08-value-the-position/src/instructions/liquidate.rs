use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

use crate::{Market, Position};

#[derive(Accounts)]
pub struct Liquidate<'info> {
    pub liquidator: Signer<'info>,
    #[account(mut, seeds = [b"market"], bump = market.bump)]
    pub market: Account<'info, Market>,
    #[account(mut, seeds = [b"position", position.owner.as_ref()], bump = position.bump)]
    pub position: Account<'info, Position>,
    #[account(address = market.collateral_mint)]
    pub collateral_mint: Account<'info, Mint>,
    #[account(address = market.debt_mint)]
    pub debt_mint: Account<'info, Mint>,
    #[account(mut, token::mint = debt_mint, token::authority = liquidator)]
    pub liquidator_debt: Account<'info, TokenAccount>,
    #[account(mut, token::mint = collateral_mint)]
    pub liquidator_collateral: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"debt_vault"], bump)]
    pub debt_vault: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"collateral_vault"], bump)]
    pub collateral_vault: Account<'info, TokenAccount>,
    pub collateral_price: Account<'info, PriceUpdateV2>,
    pub debt_price: Account<'info, PriceUpdateV2>,
    pub token_program: Program<'info, Token>,
}

pub fn liquidate(_ctx: Context<Liquidate>) -> Result<()> {
    todo!()
}
