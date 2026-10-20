use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Market {
    pub admin: Pubkey,
    pub collateral_mint: Pubkey,
    pub debt_mint: Pubkey,
    pub collateral_feed: [u8; 32],
    pub debt_feed: [u8; 32],
    pub max_price_age: u64,
    pub borrow_ltv_bps: u16,
    pub liquidation_ltv_bps: u16,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct MarketParams {
    pub collateral_feed: [u8; 32],
    pub debt_feed: [u8; 32],
    pub max_price_age: u64,
    pub borrow_ltv_bps: u16,
    pub liquidation_ltv_bps: u16,
}
