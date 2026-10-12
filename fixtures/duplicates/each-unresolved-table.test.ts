// Two `.each(loadCases())` tables whose row data comes from a function call, not a
// literal array/tagged-template. Neither table's rows can be enumerated from source, so the
// frontend cannot know what either table holds -- a known limit of static reading, which the
// analyzer must treat as `Context::unresolved` -- excluded from comparison entirely, not silently
// judged distinct.
//
// Expected verdict: not-compared. This is the `.each` case most worth watching: two unresolvable
// tables are indistinguishable from each other from the analyzer's point of view, so "no finding"
// here proves NOTHING about whether they're actually duplicates. Counting that silence as a
// successful `distinct` negative is exactly how `not-compared` gets laundered into `distinct`. The
// corpus gate enforces this by asserting the solo run's `incomplete` flag is true for this pair, not
// merely that no finding links them.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=not-compared severity=none
// @vitest-dedup:isolates not-isolable this expectation has no isolation claim to make: the fixture's entire content is that two unresolvable `.each` tables are INDISTINGUISHABLE to the analyzer, which is what its not-compared verdict records. --emit-test-fingerprints confirms it -- all six fields, modifierKey included, are identical -- so "isolates modifier" was never true and no assertion here could fail. The guard is check-duplicates-corpus.mjs's eligibility assertion: not-compared fails unless the solo run reports an unresolved context
// @vitest-dedup:participant L28 "first unresolved case"
// @vitest-dedup:participant L32 "second unresolved case"
import { test, expect } from 'vitest'

function loadFirstCases() {
  return [[1, 2]]
}

function loadSecondCases() {
  return [[3, 4]]
}

test.each(loadFirstCases())('first unresolved case', (a, b) => {
  expect(a).toBeLessThan(b)
})

test.each(loadSecondCases())('second unresolved case', (a, b) => {
  expect(a).toBeLessThan(b)
})
