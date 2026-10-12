// Two tests whose bodies differ only in the KIND of a literal: boolean `true` vs string `'true'`.
// Expected verdict: NOT a duplicate. They must have different `alpha` and identical `structural`.
//
// A subject that branches on `typeof` treats these as genuinely different inputs, so merging them
// would hide a real test case.
//
// Regression guard: an earlier serializer kept a literal's raw text but discarded its kind in
// `alpha` mode, so `true` and `'true'` both rendered as `true` and the two tests collapsed into a
// duplicate at error severity. Note that a fixture comparing two literals of the SAME kind cannot
// catch this -- both sides erase identically and the test passes on a broken implementation.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates literal-kind
// @vitest-dedup:participant L19 "accepts a boolean"
// @vitest-dedup:participant L23 "accepts the string form"
import { test, expect } from 'vitest'
import { parse } from './parse'

test('accepts a boolean', () => {
  expect(parse(true)).toBe(1)
})

test('accepts the string form', () => {
  expect(parse('true')).toBe(1)
})
