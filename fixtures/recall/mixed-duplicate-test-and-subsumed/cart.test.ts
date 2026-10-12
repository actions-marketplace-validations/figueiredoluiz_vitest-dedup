// RECALL mixed -- an alpha-equal pair and a strict-subsequence pair in one file.
//
// subsumed-test skips pairs whose `alpha` or behavior already matches, so the alpha-equal pair is
// duplicate-test's alone here and the subset pair is subsumed-test's alone; the mixed question is
// whether each still fires with the other population present, and whether the alpha-equal pair
// stays out of subsumed-test entirely. The rule ships Off, so the manifest runs this case with
// `--rule subsumed-test=warning`.
//
// Expected, independently:
//   duplicate-test error, the two `settles the balance` bodies are identical
//   subsumed-test   warning, the coupon test's events are a strict ordered subsequence of the
//                   recalculating test's
//
// Named weakening: delete one statement from the larger coupon test until the bodies match and
// subsumed-test must go while duplicate-test stays.
import { describe, expect, test } from 'vitest'
import { buildCart, settle, balance } from './cart'

test('settles the balance', () => {
  settle('order-1')
  expect(balance('order-1')).toBe(0)
})

test('settles the balance again', () => {
  settle('order-1')
  expect(balance('order-1')).toBe(0)
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
