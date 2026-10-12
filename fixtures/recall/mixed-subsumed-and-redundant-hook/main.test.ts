// RECALL mixed -- a strict-subsequence pair and a redundant nested hook in one file.
//
// subsumed-test walks candidate pairs under an equivalent context whose hook chain is part of
// the comparison, so the redundant hook sits inside the very state the subset relation is
// evaluated under. Both findings must appear independently. The rule ships Off, so the manifest
// runs this case with `--rule subsumed-test=warning`.
//
// Expected, independently:
//   subsumed-test  warning, the coupon test's events are a strict ordered subsequence
//   redundant-hook warning, the inner beforeEach repeats the outer one verbatim
//
// Named weakening: delete the recalculation statements from the larger coupon body and
// subsumed-test must go while redundant-hook stays; change the inner hook body and the reverse.
import { beforeEach, describe, expect, test } from 'vitest'
import { buildCart } from './cart'

beforeEach(() => {
  process.env.CART_MODE = 'gross'
})

describe('cart', () => {
  beforeEach(() => {
    process.env.CART_MODE = 'gross'
  })

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
