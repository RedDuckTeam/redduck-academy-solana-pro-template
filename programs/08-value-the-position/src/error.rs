use anchor_lang::prelude::*;

#[error_code]
pub enum MarketError {
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("The borrow limit must be below the liquidation limit")]
    InvalidParams,
}
