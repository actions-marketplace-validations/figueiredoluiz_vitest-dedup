// A single `test.each` table whose rows vary BOTH the input and the expected output.
// Expected verdict: distinct between the table's own rows. Varying input and expected together is
// the signature of real, already-consolidated coverage -- these rows are not a consolidation
// candidate (they already ARE the consolidated form) and must not be reported as duplicates of each
// other, which is the `.each` self-duplication defect (see analysis.rs's handling of a
// table's own generated rows). Contrast with each-rows-vs-separate-declarations.test.ts, where
// varying only the literal arguments across HAND-WRITTEN tests is the actual consolidation signal.
// Note on participant locations: every row of one `test.each` declaration is attributed to the
// SAME source span (the declaration itself has no per-row location), so both participants below
// share one line and differ only by rendered title -- which is also why this expectation, unlike
// the cross-declaration cases elsewhere in this corpus, can never be satisfied by an actual finding:
// a single location cannot carry two different titles at once. It is declared anyway for
// documentation and so a regression that starts attributing distinct per-row locations doesn't
// silently drop this fixture's meaning; the load-bearing assertions are `extracted 3` and this
// verdict's `incomplete: false` requirement.
// @vitest-dedup:extracted 3
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates literal
// @vitest-dedup:participant L24 "classify(2, 4) = 'even-even'"
// @vitest-dedup:participant L24 "classify(3, 5) = 'odd-odd'"
import { test, expect } from 'vitest'
import { classify } from './parity'

test.each([
  [2, 4, 'even-even'],
  [3, 4, 'odd-even'],
  [3, 5, 'odd-odd'],
])("classify(%i, %i) = '%s'", (a, b, expected) => {
  expect(classify(a, b)).toBe(expected)
})
