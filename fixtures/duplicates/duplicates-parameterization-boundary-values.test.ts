// Two tests differing ONLY in literal values, at the exact boundary a business rule turns on
// (`0` vs `1`). Expected verdict: parameterization-candidate.
//
// A pair like this is `consolidatable`, not `distinct`: both cases are genuinely needed
// boundary coverage, and the remedy is a `test.each` table that keeps both rows, never deleting
// either one. It is also not
// `duplicate-test`: `body.alpha` differs (the literals `0`/`false` vs `1`/`true` are preserved),
// only `body.structural` (which collapses each literal to its kind) compares equal.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=parameterization-candidate verdict=consolidatable severity=warning
// @vitest-dedup:participant L16 "zero is not positive"
// @vitest-dedup:participant L20 "one is positive"
import { test, expect } from 'vitest'
import { isPositive } from './sign'

test('zero is not positive', () => {
  expect(isPositive(0)).toBe(false)
})

test('one is positive', () => {
  expect(isPositive(1)).toBe(true)
})
