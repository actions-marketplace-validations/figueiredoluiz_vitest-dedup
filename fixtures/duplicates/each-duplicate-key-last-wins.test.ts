// Copilot review #8, Error-severity false duplicate: `RowCells::Named` used to preserve EVERY
// occurrence of a repeated static key in a `.each` object row, but a real JS object literal
// resolves a repeated key to its LAST value only -- `{ amount: 'GBP', amount: 'USD' }` binds
// `amount` to `'USD'` at runtime, never `'GBP'`. Downstream consumers (the title renderer and
// `fingerprint.rs`'s row-substitution) looked the name up with `.find`, which returns the FIRST
// match, so the first table below used to be read as `amount = 'GBP'` -- a value Vitest itself
// never produces for it. The second table genuinely does resolve to `'GBP'`, so the old
// first-wins reading collapsed two tables holding different data onto the same substituted value,
// and the pair was reported as `duplicate-test` at Error severity with `incomplete: false`.
//
// Expected verdict: consolidatable, not redundant. `registry.rs::analyze_row` now normalizes a
// `Named` row's fields to last-wins before either consumer ever sees them, so the first table
// resolves `amount` to `'USD'` and the second to `'GBP'` -- genuinely different substituted
// values under an identical body structure. That is exactly the `parameterization-candidate`
// shape (same structure, differing literal), not `duplicate-test`: the fix must silence the
// false Error, but these two cases legitimately belong in one `.each` table, so a Warning-level
// consolidation suggestion firing here is correct, not a regression.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=parameterization-candidate verdict=consolidatable severity=warning
// @vitest-dedup:participant L25 "formats one way"
// @vitest-dedup:participant L28 "formats another way"
import { test, expect } from 'vitest'
import { describeAmount } from './describe-amount'

test.each([{ amount: 'GBP', amount: 'USD' }])('formats one way', ({ amount }) => {
  expect(describeAmount(amount)).toContain('X')
})
test.each([{ amount: 'GBP' }])('formats another way', ({ amount }) => {
  expect(describeAmount(amount)).toContain('X')
})
