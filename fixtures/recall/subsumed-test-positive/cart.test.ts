// RECALL positive -- subsumed-test.
//
// Every behavior event the first test performs, the second also performs in the same order, plus
// two more. `is_strict_subsequence` establishes that ordered-subset relation; the verdict is
// `similar-uncertain`, never `redundant`, because whether the larger test's extra observations
// make the smaller one pointless is a judgement only a human can make. A review prompt, not a
// deletion order.
//
// The rule ships `Severity::Off` on measured evidence (a Warning default added ~2,900 findings on
// the pinned external corpus, mostly from homogeneous parametric suites that go quadratic), so the
// manifest runs this case with `--rule subsumed-test=warning`. A rule whose default is a product
// decision must not become untested the moment that decision lands.
import { describe, expect, test } from 'vitest'
import { buildCart } from './cart'

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
