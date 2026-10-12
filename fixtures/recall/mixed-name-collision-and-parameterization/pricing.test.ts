// RECALL mixed -- a name collision and a parameterization candidate in one file, on disjoint
// pairs, each of which must be reported without reference to the other.
//
// The pairing is chosen because these two rules reason about opposite halves of a test: one keys
// on the TITLE and ignores the body, the other keys on the BODY and ignores the title. A change
// that made either rule consult the other half would show up here as a finding appearing on the
// wrong pair, which no single-rule case can observe.
//
// Expected, independently:
//   duplicate-test-name        the two `rejects an unknown coupon` tests, which do different work
//   parameterization-candidate the three `charges ...` tests, one shape and three literals
//
// Named weakening: rename one `rejects an unknown coupon` and the name collision must go while the
// parameterization findings stay.
import { expect, test } from 'vitest'
import { charge, redeem } from './pricing'

test('rejects an unknown coupon', () => {
  expect(() => redeem('NOPE')).toThrow('no such coupon')
})

test('rejects an unknown coupon', () => {
  expect(redeem('EXPIRED').accepted).toBe(false)
})

test('charges nothing for an empty basket', () => {
  expect(charge(0)).toBe(0)
})

test('charges the unit price for one item', () => {
  expect(charge(1)).toBe(10)
})

test('charges the bulk price for ten items', () => {
  expect(charge(10)).toBe(85)
})
