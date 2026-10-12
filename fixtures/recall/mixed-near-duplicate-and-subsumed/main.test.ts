// RECALL mixed -- a reordered pair and a strict-subsequence pair in one file.
//
// Both rules key on behavior events: near-duplicate-test on the SORTED multiset,
// subsumed-test on the ORDERED strict subset. A reorder makes the multisets equal and neither
// ordered list a subsequence of the other; a strict subset makes one ordered list contain the
// other and the multisets differ. The two shapes are exactly complementary, so this file is the
// cleanest statement that each rule claims its shape and not the other's. The rule ships Off, so
// the manifest runs this case with `--rule subsumed-test=warning`.
//
// Expected, independently:
//   near-duplicate-test warning, the two setup bodies perform the same events reordered
//   subsumed-test        warning, the coupon test's events are a strict ordered subsequence
//
// Named weakening: restore the statement order of one setup body and near-duplicate-test must go
// while subsumed-test stays; delete the recalculation statements from the larger coupon body and
// the reverse.
import { describe, expect, test } from 'vitest'
import { buildCart, configure, isReady, seed } from './shop'

test('configures then seeds', () => {
  configure({ mode: 'test' })
  seed({ users: 3 })
  expect(isReady()).toBe(true)
})

test('seeds then configures', () => {
  seed({ users: 3 })
  configure({ mode: 'test' })
  expect(isReady()).toBe(true)
})

describe('cart', () => {
  test('applies the coupon', () => {
    const cart = buildCart()
    cart.applyCoupon('SAVE')
    expect(cart.total).toBe(90)
  })

  test('applies the coupon and recalculates', () => {
    const cart = buildCart()
    cart.applyCoupon('SAVE')
    expect(cart.total).toBe(90)
    cart.recalculate()
    expect(cart.tax).toBe(9)
  })
})
