# Solution

## The chain as you found it

List the checks `withdraw` made in the given program, in order. For each one, name the account it depends on and say whether the caller could have created that account.

## Where the chain ended

Which account did the whole chain depend on, and how did your exploit test fake it?

## The root

Which account is the root now, why can the caller not create it, and how does every other check in `withdraw` depend on it?

## One root for every instruction

Which other instructions read the config, and how do they check it?
