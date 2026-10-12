// RECALL mixed -- a title collision and a repeated table row in one file.
//
// Rows 1 and 3 of the table render the SAME full title as each other, so they are a title
// collision candidate exactly like the two standalone tests -- and `dedup_by_declaration`
// collapses them out of duplicate-test-name because they share one declaration site. This case
// pins that boundary inside a file that also contains a genuine two-declaration title collision:
// the standalone pair must be reported, the table's own rows must not.
//
// Expected, independently:
//   duplicate-test-name warning, the two `rejects an unknown coupon` tests
//   duplicate-each-row   warning, rows 1 and 3 of the table carry the same case
//
// Named weakening: rename one standalone test and duplicate-test-name must go while
// duplicate-each-row stays; give row 3 a third distinct value and the reverse.
import { expect, test } from 'vitest'
import { parseFlag, redeem } from './coupons'

test('rejects an unknown coupon', () => {
  expect(() => redeem('NOPE')).toThrow('no such coupon')
})

test('rejects an unknown coupon', () => {
  expect(redeem('EXPIRED').accepted).toBe(false)
})

test.each([['on'], ['off'], ['on']])('parses the %s flag', (flag) => {
  expect(typeof parseFlag(flag)).toBe('boolean')
})
