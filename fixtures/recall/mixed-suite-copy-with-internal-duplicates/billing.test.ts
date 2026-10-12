// RECALL mixed -- a duplicated suite whose copies EACH contain an internal duplicate pair.
//
// The suite-level suppression drops only per-test findings whose participants sit in DIFFERENT
// copies of one duplicated suite group. This case pins both edges of that scoping at once: the
// within-copy duplicate-test and duplicate-test-name findings must SURVIVE next to the
// duplicate-suite finding, and the cross-copy restatements must stay suppressed. An
// over-broad suppression (any finding inside a twin span) and an under-broad one (cross-copy
// pairs leaking through) are both visible here and nowhere else.
//
// Expected:
//   duplicate-suite      warning, the two `billing` blocks
//   duplicate-test       error, one finding per copy, over that copy's internal pair
//   duplicate-test-name  warning, one finding per copy, same participants as the above
//
// Named weakening: un-duplicate one copy's internal pair and that copy's two per-test findings
// must go while the other copy's and the duplicate-suite finding stay.
import { describe, expect, test } from 'vitest'
import { applyTax } from './billing'

describe('billing', () => {
  test('applies tax to a subtotal', () => {
    expect(applyTax(100)).toBe(110)
  })

  test('applies tax to a subtotal', () => {
    expect(applyTax(100)).toBe(110)
  })
})

describe('billing', () => {
  test('applies tax to a subtotal', () => {
    expect(applyTax(100)).toBe(110)
  })

  test('applies tax to a subtotal', () => {
    expect(applyTax(100)).toBe(110)
  })
})
