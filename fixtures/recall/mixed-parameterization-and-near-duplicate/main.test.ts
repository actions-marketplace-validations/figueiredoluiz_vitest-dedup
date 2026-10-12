// RECALL mixed -- a literal-variant pair and a reordered pair in one file.
//
// parameterization-candidate needs `structural` equal with literal VALUES differing;
// near-duplicate-test needs the behavior MULTISET equal with `alpha` differing. The literal
// values reach the behavior events as payloads, so the two populations cannot trade places: the
// reordered pair must stay out of parameterization-candidate and the literal pair must stay out
// of near-duplicate-test. Both findings coexisting here is that disjointness observed.
//
// Expected, independently:
//   parameterization-candidate warning, the two `charges` bodies differ only in literals
//   near-duplicate-test          warning, the two setup bodies perform the same events reordered
//
// Named weakening: equalize the two `charges` literals and parameterization-candidate must go
// while near-duplicate-test stays; restore the statement order of one setup body and the reverse.
import { expect, test } from 'vitest'
import { charge, configure, isReady, seed } from './shop'

test('charges nothing for an empty basket', () => {
  expect(charge(0)).toBe(0)
})

test('charges the bulk price for ten items', () => {
  expect(charge(10)).toBe(85)
})

test('configures then seeds', () => {
  configure({ mode: 'test' })
  seed({ users: 3 })
  expect(isReady()).toBe(true)
})

test('seeds then configures', () => {
  seed({ users: 3 })
  configure({ mode: 'test' })
  expect(isReady()).toBe(true)
})
