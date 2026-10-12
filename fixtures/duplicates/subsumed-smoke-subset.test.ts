// One test whose behavior events are a strict ordered subset of another's over the same subject:
// every step the small test performs, the larger one also performs, plus more. Expected verdict:
// subsumed-test -- a review prompt (the analyzer establishes the subset relation, not that the
// extra observations in the larger test are irrelevant), never a deletion order.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=subsumed-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L20 "cart > applies the coupon"
// @vitest-dedup:participant L26 "cart > applies the coupon and recalculates"
// CROSS-FILE COLLISION (declared, not dodged): `cart > applies the coupon` below is the shared
// small test of this rule's positive/negative pair, so it is byte-identical to the same-named
// test in not-subsumed-different-helper.test.ts and `cross-file-duplicate` links the two files.
// The larger test here is linked to nothing across the boundary.
// `fixtures/README.md`, "Incidental cross-file collisions", explains why it is declared.
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant not-subsumed-different-helper.test.ts#L20 "cart > applies the coupon"
// @vitest-dedup:participant L20 "cart > applies the coupon"
import { describe, test, expect } from 'vitest'

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
