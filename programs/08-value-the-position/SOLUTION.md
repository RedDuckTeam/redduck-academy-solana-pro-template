# Solution

## Which end of the band each value uses

For the collateral and for the debt, which end of the Pyth band does your program use in `borrow`, and which in `liquidate`? Why that end?

## The two lines

Why is the borrow line stricter than the liquidation line? Which checks does `borrow` make that `liquidate` does not, and why must a liquidation not inherit them?

## The value from the market's own state

What does the market keep in its account, and how is it updated? Which instruction uses it, and why not the others? What happens to a borrow during a short price spike, and what happens when the price really falls?

## A price that is too old

What does your program do with a price older than `max_price_age`, and who can fix it?
