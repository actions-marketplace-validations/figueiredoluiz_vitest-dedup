// Same shape as the positive, but the two tests reach their subject through different free
// helpers: their behavior events carry different canonical callee paths, so neither event list
// is a subsequence of the other. Expected verdict: silence from subsumed-test.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates identifier
// @vitest-dedup:participant L20 "cart > applies the coupon"
// @vitest-dedup:participant L26 "cart > applies the coupon fully"
// CROSS-FILE COLLISION (declared, not dodged): `cart > applies the coupon` below is byte-
// identical, title included, to the same-named test in subsumed-smoke-subset.test.ts, so
// `cross-file-duplicate` links them. The second test in each file differs (`createCart` here, a
// longer body there) and is linked to nothing -- the two fixtures' own claims are untouched.
// `fixtures/README.md`, "Incidental cross-file collisions", explains why it is declared.
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant L20 "cart > applies the coupon"
// @vitest-dedup:participant subsumed-smoke-subset.test.ts#L20 "cart > applies the coupon"
import { describe, test, expect } from 'vitest'

describe('cart', () => {
  test('applies the coupon', () => {
    const cart = buildCart()
    cart.applyCoupon('SAVE')
    expect(cart.total).toBe(90)
  })

  test('applies the coupon fully', () => {
    const cart = createCart()
    cart.applyCoupon('SAVE')
    expect(cart.total).toBe(90)
  })
})
