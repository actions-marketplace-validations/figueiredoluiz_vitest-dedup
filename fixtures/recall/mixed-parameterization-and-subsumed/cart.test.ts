// RECALL mixed -- a literal-variant pair and a strict-subsequence pair in one file.
//
// parameterization-candidate requires `structural` equality, which a strict subsequence pair
// never has (the larger body has more structure); subsumed-test requires a behavior subset,
// which a literal-variant pair never has (the differing literals are behavior payloads). Each
// rule must fire on its own pair and stay silent on the other's. The rule ships Off, so the
// manifest runs this case with `--rule subsumed-test=warning`.
//
// Expected, independently:
//   parameterization-candidate warning, the two `charges` bodies differ only in literals
//   subsumed-test               warning, the coupon test's events are a strict subsequence
//
// Named weakening: equalize the two `charges` literals and parameterization-candidate must go
// while subsumed-test stays; delete the recalculation statements and the reverse.
import { describe, expect, test } from 'vitest'
import { buildCart, charge } from './cart'

test('charges nothing for an empty basket', () => {
  expect(charge(0)).toBe(0)
})

test('charges the bulk price for ten items', () => {
  expect(charge(10)).toBe(85)
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
