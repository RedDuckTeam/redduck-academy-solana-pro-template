use anchor_lang::prelude::*;
use pyth_solana_receiver_sdk::price_update::PriceUpdateV2;

use crate::{MarketError, PRICE_DECIMALS};

pub struct Band {
    pub low: u64,
    pub mid: u64,
    pub high: u64,
}

pub fn read_band(
    _update: &PriceUpdateV2,
    _feed_id: &[u8; 32],
    _max_age: u64,
    _clock: &Clock,
) -> Result<Band> {
    todo!()
}

pub fn value(amount: u64, price: u64, decimals: u8) -> Result<u128> {
    Ok((amount as u128)
        .checked_mul(price as u128)
        .ok_or(MarketError::MathOverflow)?
        / 10u128.pow(decimals as u32))
}

pub fn scale(value: u64, exponent: i32) -> Result<u64> {
    let target = -(PRICE_DECIMALS as i32);
    let value = value as u128;
    let scaled = if exponent < target {
        value / 10u128.pow((target - exponent) as u32)
    } else {
        value
            .checked_mul(10u128.pow((exponent - target) as u32))
            .ok_or(MarketError::MathOverflow)?
    };
    u64::try_from(scaled).map_err(|_| MarketError::MathOverflow.into())
}
