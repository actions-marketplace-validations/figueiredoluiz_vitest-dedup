// A `.each` table and a hand-written test that duplicates one of its
// rows. Verdict: redundant, via `duplicate-test` -- this is an EXACT duplicate once the row's
// concrete values are substituted in, not merely a near-duplicate.
//
// This fixture used to live in `fixtures/near/` and could not pass at all: before row-value
// substitution existed, a `.each` row's comparable body was built from the callback's OWN
// parameter identifiers (`a`, `b`, `expected`), never substituted with that row's concrete
// values, so `expect(add(a, b)).toBe(expected)` (every row, verbatim) was never alpha-equivalent
// to `expect(add(1, 1)).toBe(2)` (the hand-written duplicate of row 1) -- confirmed at the time
// with recordCount: 0 on exactly this file. `src/frontend/fingerprint.rs`'s module doc, "Row
// substitution", covers the fix: when a row's cells are all statically known, they are
// substituted into that row's own body fingerprint in place of the parameters they bind to, so
// row 1 below now fingerprints identically to the hand-written test beneath it.
//
// Row 2 (`add(1, 2) = 3`) has no hand-written counterpart and must stay unlinked to anything.
// It also must never be reported as a duplicate of row 1, even though both come from the same
// `.each` declaration and (after substitution) now genuinely differ in body: that guard
// (`analysis.rs`'s `dedup_by_declaration`) collapses every row of one declaration to a single
// representative, sharing one call-site Location, before any rule ever compares rows to each
// other -- see `fixtures/duplicates/each-differing-input-expected-pairs.test.ts` for a fixture
// dedicated to exactly that guard.
// @vitest-dedup:extracted 3
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L42 "add(1, 1) = 2"
// @vitest-dedup:participant L49 "duplicate of the first row"
// TWO CROSS-FILE COLLISIONS (declared, not dodged): after row substitution, both rows of the
// table below are byte-identical to two of the hand-written tests in
// each-rows-vs-separate-declarations.test.ts, so `cross-file-duplicate` links each row to its
// twin. Both participants on this side share the table's declaration line, as `dedup_by_
// declaration` requires; the titles are what tell the two findings apart. That the substituted
// rows are reachable from another file is the same fact this fixture already asserts within one.
// `fixtures/README.md`, "Incidental cross-file collisions", explains why it is declared.
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant L42 "add(1, 1) = 2"
// @vitest-dedup:participant each-rows-vs-separate-declarations.test.ts#L31 "add(1, 1) = 2"
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant L42 "add(1, 2) = 3"
// @vitest-dedup:participant each-rows-vs-separate-declarations.test.ts#L35 "add(1, 2) = 3"
import { test, expect } from 'vitest'
import { add } from './math'

test.each([
  [1, 1, 2],
  [1, 2, 3],
])('add(%i, %i) = %i', (a, b, expected) => {
  expect(add(a, b)).toBe(expected)
})

test('duplicate of the first row', () => {
  expect(add(1, 1)).toBe(2)
})
