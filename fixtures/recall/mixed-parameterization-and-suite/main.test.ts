// RECALL mixed -- a duplicated suite pair and a literal-variant pair OUTSIDE the copies.
//
// The suite-level suppression drops per-test findings only between the copies of one duplicated
// suite group, never findings that live outside it. This case pins that scoping from the outside:
// the parameterization pair sits at the top level of the same file as the copied describes, and
// its finding must survive next to the suite finding, while the copies' own cross-copy
// duplicate-test restatement stays suppressed.
//
// Expected, independently:
//   duplicate-suite           warning, the two `taxes` blocks
//   parameterization-candidate warning, the two top-level `charges` bodies
//
// Named weakening: move one `charges` test inside a copy (keeping its twin outside) and the
// parameterization finding must go -- a cross-copy finding -- while the suite finding stays.
import { describe, expect, test } from 'vitest'
import { applyTax, charge } from './pricing'

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

test('charges nothing for an empty basket', () => {
  expect(charge(0)).toBe(0)
})

test('charges the bulk price for ten items', () => {
  expect(charge(10)).toBe(85)
})
