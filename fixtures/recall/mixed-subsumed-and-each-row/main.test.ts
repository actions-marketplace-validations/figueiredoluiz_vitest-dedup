// RECALL mixed -- a strict-subsequence pair and a repeated table row in one file.
//
// The table's rows share one declaration site, which `emit_subsumed_test`'s population shares
// with every other rule but whose content (identical substituted bodies) never forms a strict
// subset relation; the standalone pair has two declaration sites and one event list strictly
// inside the other. Both rules must report their own population with the other defect present.
// The rule ships Off, so the manifest runs this case with `--rule subsumed-test=warning`.
//
// Expected, independently:
//   subsumed-test   warning, the coupon test's events are a strict ordered subsequence
//   duplicate-each-row warning, rows 1 and 3 of the table carry the same case
//
// Named weakening: delete the recalculation statements from the larger coupon body and
// subsumed-test must go while duplicate-each-row stays; give row 3 a third distinct value and the reverse.
import { describe, expect, test } from 'vitest'
import { buildCart, parseFlag } from './shop'

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

test.each([['on'], ['off'], ['on']])('parses the %s flag', (flag) => {
  expect(typeof parseFlag(flag)).toBe('boolean')
})
