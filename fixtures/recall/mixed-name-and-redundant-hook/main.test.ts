// RECALL mixed -- a title collision and a redundant nested hook in one file.
//
// duplicate-test-name reasons about titles and never looks at hooks; redundant-hook reasons
// about hook bodies and never looks at titles. Each population is invisible to the other rule,
// and the mixed claim is simply that both still fire when both defects sit in one file -- the
// cheapest interference there is, and the baseline every stronger pairing builds on.
//
// Expected, independently:
//   duplicate-test-name warning, the two `rejects an unknown coupon` tests
//   redundant-hook       warning, the inner beforeEach repeats the outer one verbatim
//
// Named weakening: rename one coupon test and duplicate-test-name must go while redundant-hook
// stays; change the inner hook body and the reverse.
import { beforeEach, describe, expect, test } from 'vitest'
import { redeem } from './coupons'

beforeEach(() => {
  process.env.COUPON_MODE = 'strict'
})

describe('coupons', () => {
  beforeEach(() => {
    process.env.COUPON_MODE = 'strict'
  })

  test('rejects an unknown coupon', () => {
    expect(() => redeem('NOPE')).toThrow('no such coupon')
  })

  test('rejects an unknown coupon', () => {
    expect(redeem('EXPIRED').accepted).toBe(false)
  })
})
