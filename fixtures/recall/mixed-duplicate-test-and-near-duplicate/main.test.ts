// RECALL mixed -- an alpha-equal pair and a reordered-setup pair in one file.
//
// duplicate-test keys on order-preserving `alpha`; near-duplicate-test keys on the SORTED
// behavior multiset. A pure reorder moves one and not the other, so both rules have claims here
// on disjoint pairs, and each must stay silent on the other's pair: the alpha-equal pair must not
// appear under near-duplicate-test (one representative per `alpha` collapses it) and the
// reordered pair must not appear under duplicate-test (`alpha` differs).
//
// Expected, independently:
//   duplicate-test     error, the two `settles the balance` bodies are identical
//   near-duplicate-test warning, the two setup bodies perform the same events in a different order
//
// Named weakening: reorder the two statements of one `settles the balance` body and
// duplicate-test must go while near-duplicate-test stays.
import { expect, test } from 'vitest'
import { configure, isReady, seed, settle, balance } from './setup'

test('settles the balance', () => {
  settle('order-1')
  expect(balance('order-1')).toBe(0)
})

test('settles the balance again', () => {
  settle('order-1')
  expect(balance('order-1')).toBe(0)
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
