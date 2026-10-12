// RECALL negative -- subsumed-test where the relation is a subset but NOT an ordered subsequence.
//
// The smaller test's events all appear in the larger test, so a set-based implementation would
// report subsumption. They appear in a different ORDER: the small test asserts the total before
// applying the coupon, the large test applies it first. Running the large test therefore does not
// cover what the small test observes -- the small test is checking the pre-coupon total, which the
// large test never looks at.
//
// `is_strict_subsequence` is ordered for exactly this reason, and this case is what makes that
// choice falsifiable. Load-bearing: swap the first two statements of the small test so its events
// become an ordered prefix, and the pair becomes one `subsumed-test` warning -- which is the
// positive case next door.
//
// Run with the rule enabled (`--rule subsumed-test=warning`), so the silence is a verdict rather
// than the shipped `Off` default.
import { describe, expect, test } from 'vitest'
import { buildCart } from './cart'

describe('cart', () => {
  test('reports the total before the coupon', () => {
    const cart = buildCart()
    expect(cart.total).toBe(100)
    cart.applyCoupon('SAVE')
  })

  test('applies the coupon then reports the total', () => {
    const cart = buildCart()
    cart.applyCoupon('SAVE')
    expect(cart.total).toBe(90)
    cart.recalculate()
  })
})
