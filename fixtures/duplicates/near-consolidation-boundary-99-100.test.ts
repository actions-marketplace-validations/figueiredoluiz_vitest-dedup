// The second boundary pair in this corpus. There is
// no general static distinction between an "ordinary" value and a "boundary" one: 99 and 100
// straddle a business rule exactly as 0 and 1 do in
// duplicates-parameterization-boundary-values.test.ts. Both boundary pairs are `consolidatable`,
// never `redundant` -- the remedy keeps both rows in one `test.each` table, it never deletes either
// case.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=parameterization-candidate verdict=consolidatable severity=warning
// @vitest-dedup:participant L14 "99 does not qualify for the bulk discount"
// @vitest-dedup:participant L18 "100 qualifies for the bulk discount"
import { test, expect } from 'vitest'
import { qualifiesForBulkDiscount } from './pricing-rules'

test('99 does not qualify for the bulk discount', () => {
  expect(qualifiesForBulkDiscount(99)).toBe(false)
})

test('100 qualifies for the bulk discount', () => {
  expect(qualifiesForBulkDiscount(100)).toBe(true)
})
