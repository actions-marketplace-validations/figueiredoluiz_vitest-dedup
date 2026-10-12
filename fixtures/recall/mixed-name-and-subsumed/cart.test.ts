// RECALL mixed -- duplicate-test-name and subsumed-test on the SAME pair of participants.
//
// The two tests share a full title and one's events are a strict ordered subsequence of the
// other's, so both rules claim exactly these declarations. duplicate-test stays silent (`alpha`
// differs) and near-duplicate-test stays silent (the multisets differ), which is the boundary
// this case pins alongside the two findings themselves. The rule ships Off, so the manifest runs
// this case with `--rule subsumed-test=warning`.
//
// Expected, independently:
//   duplicate-test-name warning, both render `applies the coupon`
//   subsumed-test        warning, the smaller body's events are a strict subsequence
//
// Named weakening: rename one test and duplicate-test-name must go while subsumed-test stays;
// delete the recalculation statements from the larger body and subsumed-test must go while
// duplicate-test-name stays.
import { expect, test } from 'vitest'
import { buildCart } from './cart'

test('applies the coupon', () => {
  const cart = buildCart()
  cart.applyCoupon('SAVE')
  expect(cart.total).toBe(90)
})

test('applies the coupon', () => {
  const cart = buildCart()
  cart.applyCoupon('SAVE')
  expect(cart.total).toBe(90)
  cart.recalculate()
  expect(cart.tax).toBe(9)
})
