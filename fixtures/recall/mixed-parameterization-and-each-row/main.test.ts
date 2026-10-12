// RECALL mixed -- a repeated table row and a literal-variant pair in one file.
//
// The table's rows share a declaration site and (for the repeated row) a substituted body, so
// they are a duplicate-each-row claim and never a parameterization one (`dedup_by_declaration`
// collapses them out of it); the standalone literal-variant pair has two declaration sites and
// is the reverse. Each rule must report its own population with the other defect present.
//
// Expected, independently:
//   duplicate-each-row    warning, rows 1 and 3 carry the same case
//   parameterization-candidate warning, the two standalone `charges` bodies
//
// Named weakening: give row 3 a third distinct value and duplicate-each-row must go while
// parameterization-candidate stays; equalize the two `charges` literals and the reverse.
import { expect, test } from 'vitest'
import { charge, parseFlag } from './shop'

test('charges nothing for an empty basket', () => {
  expect(charge(0)).toBe(0)
})

test('charges the bulk price for ten items', () => {
  expect(charge(10)).toBe(85)
})

test.each([['on'], ['off'], ['on']])('parses the %s flag', (flag) => {
  expect(typeof parseFlag(flag)).toBe('boolean')
})
