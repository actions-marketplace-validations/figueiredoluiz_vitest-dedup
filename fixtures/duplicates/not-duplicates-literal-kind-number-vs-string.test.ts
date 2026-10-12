// Numeric `1000` vs string `'1000'`. Expected verdict: NOT a duplicate.
// Same literal-kind guard as the boolean case, for the numeric/string pairing that a lookup
// function accepting either form would deliberately test twice.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates literal-kind
// @vitest-dedup:participant L12 "looks up by numeric id"
// @vitest-dedup:participant L16 "looks up by string id"
import { test, expect } from 'vitest'
import { findById } from './records'

test('looks up by numeric id', () => {
  expect(findById(1000)).toBeDefined()
})

test('looks up by string id', () => {
  expect(findById('1000')).toBeDefined()
})
