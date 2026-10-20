# RedDuck Academy — Solana PRO Template

The review tasks of the Solana PRO course at [RedDuck Academy](https://academy.redduck.io). Each task is an Anchor program with a `TASK.md` brief and a `SOLUTION.md` you fill in, tested with [bankrun](https://kevinheavey.github.io/solana-bankrun/): a fast in-process bank, no local validator. It's one Anchor workspace, but every task builds and tests on its own, so an unfinished program never blocks another.

## Built with

| Area | Technology |
| --- | --- |
| Programs | Rust + [Anchor](https://www.anchor-lang.com/) 0.31.1, `pyth-solana-receiver-sdk` 1.0.1 |
| Toolchain | Solana CLI (Agave) stable |
| Tests | `solana-bankrun` + `anchor-bankrun`, Mocha + Chai via `ts-mocha` |
| Runtime | Node.js 20+ (22 recommended, see `.nvmrc`) |

The toolchain is the same as in the [RedDuck Academy Solana template](https://github.com/RedDuckTeam/redduck-academy-solana-template); its `INSTALL.md` walks through installing it.

## Tasks

| # | Task | Module | Program crate | Script |
| --- | --- | --- | --- | --- |
| 08 | [`08-value-the-position`](programs/08-value-the-position/) | Outside data | `position_value` | `npm run test:valueThePosition` |
| 09 | [`09-write-the-exit`](programs/09-write-the-exit/) | Dependencies and exits | `round_exit` | `npm run test:writeTheExit` |

The numbers follow the course modules.

## Layout

```
.
├── Anchor.toml              # workspace config + program IDs
├── Cargo.toml               # Rust workspace
├── programs/
│   ├── 08-value-the-position/
│   │   ├── src/
│   │   ├── TASK.md          # read this first
│   │   └── SOLUTION.md      # you fill this in
│   └── 09-write-the-exit/
│       ├── src/
│       ├── TASK.md
│       └── SOLUTION.md
└── tests/
    ├── helpers/             # bankrun, tokens, Pyth price accounts
    ├── 08-value-the-position/
    └── 09-write-the-exit/
```

## Getting started

```bash
npm install
npm run test:valueThePosition
npm run test:writeTheExit
```

Each script builds only its program and runs its suite. `08` is red until you implement it. `09` starts green, and the exits and their tests are yours. `npm test` builds and runs the whole workspace at once.

## Workflow per task

1. Read the task's `TASK.md`.
2. Implement the program under `programs/<task>/src/`.
3. Add your tests under `tests/<task>/`.
4. Fill in `SOLUTION.md`.
5. Push to your own fork and submit the repository URL on the lesson page.

## License

[MIT](LICENSE)
