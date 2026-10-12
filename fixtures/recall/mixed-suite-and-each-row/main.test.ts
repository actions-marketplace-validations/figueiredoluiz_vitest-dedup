// RECALL mixed -- a duplicated suite pair and a repeated table row in one file.
//
// duplicate-suite compares whole `describe` blocks; duplicate-each-row compares rows of one
// table declaration. A `describe.each` instance never pairs at suite level (its instances share
// one declaration site), and a table's rows never leave their declaration, so the two rules
// cannot trade participants; both findings must coexist in one file.
//
// Expected, independently:
//   duplicate-suite   warning, the two `taxes` blocks
//   duplicate-each-row warning, rows 1 and 3 of the table carry the same case
//
// Named weakening: change one copy's child title and duplicate-suite must go while
// duplicate-each-row stays; give row 3 a third distinct value and the reverse.
import { describe, expect, test } from 'vitest'
import { applyTax, parseFlag } from './flags'

describe('taxes', () => {
  test('applies tax to a subtotal', () => {
    expect(applyTax(100)).toBe(110)
  })
})

describe('taxes', () => {
  test('applies tax to a subtotal', () => {
    expect(applyTax(100)).toBe(110)
  })
})

test.each([['on'], ['off'], ['on']])('parses the %s flag', (flag) => {
  expect(typeof parseFlag(flag)).toBe('boolean')
})
