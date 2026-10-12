// RECALL mixed -- cross-file-duplicate side of mixed-name-and-cross-file. See coupons.test.ts in
// this directory for the claim and the named weakening.
import { expect, test } from 'vitest'
import { redeem } from './coupons'

test('rejects an unknown coupon', () => {
  expect(() => redeem('NOPE')).toThrow('no such coupon')
})
