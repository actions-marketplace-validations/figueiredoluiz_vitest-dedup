// RECALL mixed -- two rules that overlap on purpose, where the correct outcome is that one of
// them stays QUIET.
//
// The other mixed cases assert that rules do not interfere. This one asserts the opposite and is
// the more delicate claim: `duplicate-suite` owns the report for a duplicated block, and the
// per-child `duplicate-test` findings inside it are deliberately suppressed. Reporting the suite
// once is the actionable remedy -- delete the block -- where reporting every child pair as well
// would be the same defect counted three times.
//
// So the expectation is one `duplicate-suite` finding and NO `duplicate-test` finding for the
// child pairs, and the second half is the part worth having written down: a change that removed
// the suppression would still produce a correct-looking `duplicate-suite` finding and pass any
// case that only checked for it.
//
// Named weakening: change one literal in one child of the second suite. The suites stop being
// duplicates, the suppression no longer applies, and the remaining identical child pair is
// reported as `duplicate-test` on its own.
import { describe, expect, test } from 'vitest'
import { invoice, tax } from './billing'

describe('billing', () => {
  test('applies tax to a subtotal', () => {
    expect(tax(100)).toBe(20)
  })

  test('renders an invoice total', () => {
    expect(invoice(100).total).toBe(120)
  })
})

describe('billing', () => {
  test('applies tax to a subtotal', () => {
    expect(tax(100)).toBe(20)
  })

  test('renders an invoice total', () => {
    expect(invoice(100).total).toBe(120)
  })
})
