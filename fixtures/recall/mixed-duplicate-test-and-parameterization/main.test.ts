// RECALL mixed -- an alpha-equal pair and a structural-equal pair in one file.
//
// duplicate-test and parameterization-candidate are exclusive on one pair by construction
// (`representative_per_alpha` collapses every group so a parameterization pair always differs at
// `alpha`), so the mixed question is whether each rule still fires on its own population when the
// other population sits in the same file and context -- and whether the alpha-equal pair stays
// OUT of parameterization-candidate, which is the invariant the collapse exists to keep.
//
// Expected, independently:
//   duplicate-test             error, the two `settles the balance` bodies are identical
//   parameterization-candidate warning, the two `charges` bodies differ only in literal values
//
// Named weakening: make the two `charges` literals equal and parameterization-candidate must go
// while duplicate-test stays; the alpha-equal pair must never appear under
// parameterization-candidate.
import { expect, test } from 'vitest'
import { charge, balance, settle } from './pricing'

test('settles the balance', () => {
  settle('order-1')
  expect(balance('order-1')).toBe(0)
})

test('settles the balance again', () => {
  settle('order-1')
  expect(balance('order-1')).toBe(0)
})

test('charges nothing for an empty basket', () => {
  expect(charge(0)).toBe(0)
})

test('charges the bulk price for ten items', () => {
  expect(charge(10)).toBe(85)
})
