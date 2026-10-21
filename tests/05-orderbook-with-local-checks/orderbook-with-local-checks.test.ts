import { assert } from "chai";

import { oneToken, toBN, tokenBalance } from "../helpers";
import { BookFixture, findHint, listOrders, setupBook } from "./fixture";
import { cancelOrder, placeOrder } from "./actions";

describe("05-orderbook-with-local-checks", () => {
  let env: BookFixture;

  beforeEach(async () => {
    env = await setupBook();
  });

  it("keeps the orders sorted from the highest price to the lowest", async () => {
    const [alice, bob, carol] = env.traders;
    for (const [trader, price] of [
      [alice, 10],
      [bob, 30],
      [carol, 20],
    ] as const) {
      const hint = findHint(await env.readBook(), toBN(price));
      await placeOrder(env, trader, toBN(price), oneToken(), hint);
    }

    const book = await env.readBook();
    const prices = listOrders(book).map((cell) =>
      book.cells[cell].price.toNumber(),
    );
    assert.deepEqual(prices, [30, 20, 10]);
    assert.equal(
      (await tokenBalance(env.context, env.vault)).toString(),
      oneToken().muln(3).toString(),
    );

    const bobsCell = listOrders(book)[0];
    await cancelOrder(env, bob, bobsCell);
    const after = await env.readBook();
    assert.deepEqual(
      listOrders(after).map((cell) => after.cells[cell].price.toNumber()),
      [20, 10],
    );
  });
});
