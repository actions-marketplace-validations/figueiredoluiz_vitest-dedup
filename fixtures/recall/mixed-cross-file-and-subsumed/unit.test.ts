// RECALL mixed -- a strict-subsequence pair and a cross-file copy in one run.
//
// subsumed-test is same-file and directional; cross-file-duplicate spans files on alpha
// equality. The copied declaration's behavior equals its original's exactly, which
// subsumed-test skips by definition (an equal list is never a strict subsequence), so the two
// claims cannot trade participants. The rule ships Off, so the manifest runs this case with
// `--rule subsumed-test=warning`.
//
// Expected, independently:
//   subsumed-test        warning, the coupon test's events are a strict ordered subsequence
//   cross-file-duplicate warning, the integration copy against the email declaration
//
// Named weakening: delete the recalculation statements from the larger coupon body and
// subsumed-test must go while cross-file-duplicate stays; delete the integration file and the
// reverse.
import { describe, expect, test } from 'vitest'
import { buildCart } from './cart'
import { normalizeEmail } from './email'

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

test('lowercases the domain', () => {
  const normalized = normalizeEmail('User@Example.COM')
  expect(normalized).toBe('user@example.com')
})
