// RECALL mixed -- a literal-variant pair and a cross-file copy in one run.
//
// parameterization-candidate is same-file and keys on `structural`; cross-file-duplicate spans
// files and keys on `alpha`. The copied declaration is alpha-equal to its original and therefore
// NEVER a parameterization candidate of it (`representative_per_alpha` collapses equal-alpha
// groups), while the literal pair is same-file and never a cross-file claim. One run carrying
// both defects is the only place that double boundary is asserted against real output.
//
// Expected, independently:
//   parameterization-candidate warning, the two `charges` bodies in this file
//   cross-file-duplicate         warning, the integration copy against the email declaration
//
// Named weakening: equalize the two `charges` literals and parameterization-candidate must go
// while cross-file-duplicate stays; delete the integration file and the reverse.
import { expect, test } from 'vitest'
import { charge } from './pricing'
import { normalizeEmail } from './email'

test('charges nothing for an empty basket', () => {
  expect(charge(0)).toBe(0)
})

test('charges the bulk price for ten items', () => {
  expect(charge(10)).toBe(85)
})

test('lowercases the domain', () => {
  const normalized = normalizeEmail('User@Example.COM')
  expect(normalized).toBe('user@example.com')
})
