// RECALL positive -- parameterization-candidate.
//
// Three tests with one structure and three differing numeric literals. The verdict is
// `consolidatable`, NOT `redundant`: every case is real coverage and the remedy is a `test.each`
// table that keeps all three rows, never deleting two of them. `0`/`1` straddle a business rule
// exactly as `99`/`100` would -- there is no static distinction between the two to rely on.
//
// Reported as a spanning set of pairwise findings, not a cluster and not the full cross product:
// `SPANNING_GROUP_MAX` is 4, so a three-member group is linked consecutively (first-second,
// second-third) and every member appears in at least one finding. The rule groups on `structural`
// (the body with literals erased); `representative_per_alpha` keeps one member per distinct
// `alpha`, which guarantees none of these pairs is also a `duplicate-test`.
import { expect, test } from 'vitest'
import { discount } from './discount'

test('applies no discount at zero items', () => {
  const result = discount({ items: 0, total: 100 })
  expect(result.total).toBe(100)
})

test('applies no discount at one item', () => {
  const result = discount({ items: 1, total: 100 })
  expect(result.total).toBe(100)
})

test('applies the bulk discount at ten items', () => {
  const result = discount({ items: 10, total: 100 })
  expect(result.total).toBe(90)
})
