// Two suites that differ ONLY in an enclosing `.skipIf` condition, each containing one nested
// test with an identical body.
// Expected verdict: NOT a duplicate. `ModifierKey` (analysis.rs) keys `duplicate-test` on a
// suite's own `Each`/`SkipIf`/`RunIf`, but only once those are inherited into the nested test's
// own `modifiers` (F3) -- before that fix, entering a suite pushed its title/hook scope but
// dropped its own modifiers, so both nested tests carried an empty chain and this pair collapsed
// into an error-level false duplicate despite running under genuinely different conditions.
// (Suite/test titles are deliberately distinct so `duplicate-test-name` has nothing to say about
// this pair -- the fix under test is `duplicate-test`'s modifier key, not name matching.)
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates modifier
// @vitest-dedup:participant L21 "feature one > does the thing"
// @vitest-dedup:participant L27 "feature two > does the thing"
import { describe, test, expect } from 'vitest'

declare const FEATURE_A: boolean
declare const FEATURE_B: boolean

describe.skipIf(FEATURE_A)('feature one', () => {
  test('does the thing', () => {
    expect(1 + 1).toBe(2)
  })
})

describe.skipIf(FEATURE_B)('feature two', () => {
  test('does the thing', () => {
    expect(1 + 1).toBe(2)
  })
})
