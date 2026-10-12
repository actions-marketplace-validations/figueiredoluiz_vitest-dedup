// RECALL mixed -- a same-file title collision and a cross-file copy in one run.
//
// duplicate-test-name is scoped to one file by its key; cross-file-duplicate spans files and
// never consults titles. The two claims here sit on overlapping participants -- the copied test
// is one half of the title collision -- so a scope leak in either rule (a title rule reaching
// across files, a body rule swallowing the title pair) is observable only in this arrangement.
//
// Expected, independently:
//   duplicate-test-name  warning, the two `rejects an unknown coupon` tests in this file
//   cross-file-duplicate warning, the audit-file copy against the first declaration
//
// Named weakening: rename one coupon test and duplicate-test-name must go while
// cross-file-duplicate stays; delete the audit file and the reverse.
import { expect, test } from 'vitest'
import { redeem } from './coupons'

test('rejects an unknown coupon', () => {
  expect(() => redeem('NOPE')).toThrow('no such coupon')
})

test('rejects an unknown coupon', () => {
  expect(redeem('EXPIRED').accepted).toBe(false)
})
