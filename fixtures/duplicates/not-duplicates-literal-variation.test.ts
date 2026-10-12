// Two tests whose bodies differ ONLY in literal values.
// Expected verdict: parameterization-candidate, NOT duplicate-test. Identical
// `structural`, different `alpha`.
//
// Naming note: this file's `not-duplicates-` prefix is now stale under
// `scripts/check/check-duplicates-corpus.mjs`'s current binary "some rule fired / none did"
// convention -- `parameterization-candidate` genuinely fires on this pair, as it should,
// so the whole-corpus run reports a finding here. The filename is kept as `not-duplicates-*`
// anyway because `src/frontend/fingerprint.rs`'s
// `literal_variation_matches_structurally_but_not_alpha` test reads this exact path from disk, and
// renaming it would break that test instead. The stale name is the visible edge of an older
// confusion: this file was filed as "NOT a duplicate" *and* "a parameterization candidate" at
// once, which is only contradictory while one word, "duplicate", stands for three claims with
// three different remedies. Needs re-classification under the gate's per-rule expectations.
// Bodies are unique to this fixture to avoid cross-contaminating a whole-directory corpus run.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=parameterization-candidate verdict=consolidatable severity=warning
// @vitest-dedup:participant L23 "area of a 2x3 rectangle"
// @vitest-dedup:participant L27 "area of a 4x5 rectangle"
import { test, expect } from 'vitest'
import { area } from './geometry'

test('area of a 2x3 rectangle', () => {
  expect(area(2, 3)).toBe(6)
})

test('area of a 4x5 rectangle', () => {
  expect(area(4, 5)).toBe(20)
})
