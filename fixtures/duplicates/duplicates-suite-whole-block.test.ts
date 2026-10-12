// A whole `describe` block duplicated: same title, same children. Every child pair is a
// duplicate in its own right, but the suite is the unit that was copied -- `duplicate-suite`
// reports the copy once, and the per-test rules stay silent between the two suites instead of
// re-reporting every child pair underneath the suite-level finding.
// @vitest-dedup:extracted 4
// @vitest-dedup:expect rule=duplicate-suite verdict=redundant severity=warning
// @vitest-dedup:participant L19 "checkout"
// @vitest-dedup:participant L32 "checkout"
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable all four comparable fields (alpha, structural, behavior, contextKey) plus modifierKey are IDENTICAL between the two participants, verified against --emit-test-fingerprints. The silence is policy: duplicate-suite owns the reporting for this pair and suppresses the per-child findings. Nothing about these two children differs, so there is no variable to isolate
// @vitest-dedup:participant L20 "checkout > shows the total"
// @vitest-dedup:participant L33 "checkout > shows the total"
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable all four comparable fields (alpha, structural, behavior, contextKey) plus modifierKey are IDENTICAL between the two participants, verified against --emit-test-fingerprints. Same suppression, for the second child pair
// @vitest-dedup:participant L25 "checkout > applies the coupon"
// @vitest-dedup:participant L38 "checkout > applies the coupon"
import { describe, test, expect } from 'vitest'

describe('checkout', () => {
  test('shows the total', () => {
    const cart = { total: 90 }
    expect(cart.total).toBe(90)
  })

  test('applies the coupon', () => {
    const cart = { total: 100 }
    cart.applyCoupon('SAVE')
    expect(cart.total).toBe(90)
  })
})

describe('checkout', () => {
  test('shows the total', () => {
    const cart = { total: 90 }
    expect(cart.total).toBe(90)
  })

  test('applies the coupon', () => {
    const cart = { total: 100 }
    cart.applyCoupon('SAVE')
    expect(cart.total).toBe(90)
  })
})
