// Same assertion shape, different subject entirely: two unrelated functions called the same way
// and checked with the same matcher. Nothing about the surrounding structure differs, only WHAT is
// being tested -- the case a rule keyed purely on syntax shape must not merge.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates identifier
// @vitest-dedup:participant L12 "computes a total"
// @vitest-dedup:participant L16 "computes a discount"
import { test, expect } from 'vitest'
import { total, discount } from './pricing'

test('computes a total', () => {
  expect(total([10, 20, 30])).toBe(60)
})

test('computes a discount', () => {
  expect(discount([10, 20, 30])).toBe(60)
})
