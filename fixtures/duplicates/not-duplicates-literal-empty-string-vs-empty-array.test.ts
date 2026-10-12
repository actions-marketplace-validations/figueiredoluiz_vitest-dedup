// `['']` (one blank element) vs `[]` (no elements). Expected verdict: NOT a duplicate.
//
// The subtlest form of the literal-kind guard: an empty string literal serialized to nothing, so a
// one-element array containing it became byte-identical to an empty array. Two different edge
// cases -- blank input and absent input -- silently became one.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates literal-kind
// @vitest-dedup:participant L14 "counts a single blank entry"
// @vitest-dedup:participant L18 "counts no entries"
import { test, expect } from 'vitest'
import { countEntries } from './entries'

test('counts a single blank entry', () => {
  expect(countEntries([''])).toBe(1)
})

test('counts no entries', () => {
  expect(countEntries([])).toBe(0)
})
