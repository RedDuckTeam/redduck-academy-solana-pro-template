use anchor_lang::prelude::*;
use anchor_spl::token::{transfer_checked, Mint, Token, TokenAccount, TransferChecked};

use crate::{Book, BookError, NONE};

#[derive(Accounts)]
pub struct PlaceOrder<'info> {
    pub owner: Signer<'info>,
    #[account(mut, seeds = [b"book"], bump = book.load()?.bump)]
    pub book: AccountLoader<'info, Book>,
    #[account(address = book.load()?.mint)]
    pub mint: Account<'info, Mint>,
    #[account(mut, token::mint = mint, token::authority = owner)]
    pub owner_tokens: Account<'info, TokenAccount>,
    #[account(mut, seeds = [b"vault"], bump)]
    pub vault: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

/// Places an order. `hint` is the cell the new order should go after, or `None` for the head.
/// The given program ignores the hint and walks the list from the head instead.
pub fn place_order(
    ctx: Context<PlaceOrder>,
    price: u64,
    size: u64,
    _hint: Option<u16>,
) -> Result<()> {
    transfer_checked(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TransferChecked {
                from: ctx.accounts.owner_tokens.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
                authority: ctx.accounts.owner.to_account_info(),
            },
        ),
        size,
        ctx.accounts.mint.decimals,
    )?;

    let mut book = ctx.accounts.book.load_mut()?;
    let cell = book.free_head;
    require!(cell != NONE, BookError::BookFull);
    book.free_head = book.cells[cell as usize].next;

    // Walk from the head until the next order is cheaper than the new one. Older orders at the
    // same price stay in front. This is the O(n) part.
    let mut after = NONE;
    let mut cursor = book.head;
    while cursor != NONE && book.cells[cursor as usize].price >= price {
        after = cursor;
        cursor = book.cells[cursor as usize].next;
    }

    link(
        &mut book,
        cell,
        after,
        ctx.accounts.owner.key(),
        price,
        size,
    );
    Ok(())
}

/// Links `cell` into the list right after `after` (or at the head when `after` is NONE).
pub fn link(book: &mut Book, cell: u16, after: u16, owner: Pubkey, price: u64, size: u64) {
    let next = if after == NONE {
        book.head
    } else {
        book.cells[after as usize].next
    };
    let c = &mut book.cells[cell as usize];
    c.owner = owner;
    c.price = price;
    c.size = size;
    c.prev = after;
    c.next = next;
    c.alive = 1;
    if after == NONE {
        book.head = cell;
    } else {
        book.cells[after as usize].next = cell;
    }
    if next != NONE {
        book.cells[next as usize].prev = cell;
    }
}
