// RECALL mixed -- a duplicated suite pair and a strict-subsequence pair OUTSIDE the copies.
//
// The suite-level suppression list covers the equality-keyed per-test rules, not the directional
// subset rule, but the interesting boundary is positional, not enumerative: a subsumed-test
// pair living entirely outside the copied describes must survive next to the suite finding,
// while the copies' own cross-copy duplicate-test restatement stays suppressed. The rule ships
// Off, so the manifest runs this case with `--rule subsumed-test=warning`.
//
// Expected, independently:
//   duplicate-suite warning, the two `taxes` blocks
//   subsumed-test    warning, the coupon test's events are a strict ordered subsequence
//
// Named weakening: move one coupon test inside a copy (keeping its twin outside) and the
// subsumed-test finding must go while the suite finding stays.
import { describe, expect, test } from 'vitest'
import { applyTax, buildCart } from './cart'

describe('taxes', () => {
  test('applies tax to a subtotal', () => {
    expect(applyTax(100)).toBe(110)
  })
})

describe('taxes', () => {
  test('applies tax to a subtotal', () => {
    expect(applyTax(100)).toBe(110)
  })
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
