// RECALL mixed -- a repeated table row and a reordered pair in one file.
//
// The table's rows share one declaration site, so no other rule may pair them; the reordered
// pair has two declaration sites, differing `alpha` and an equal behavior multiset. Both rules
// must report their own population with the other defect present in the same file and context.
//
// Expected, independently:
//   duplicate-each-row   warning, rows 1 and 3 carry the same case
//   near-duplicate-test warning, the two setup bodies perform the same events reordered
//
// Named weakening: give row 3 a third distinct value and duplicate-each-row must go while near-duplicate-test
// stays; restore the statement order of one setup body and the reverse.
import { expect, test } from 'vitest'
import { configure, isReady, parseFlag, seed } from './setup'

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

test.each([['on'], ['off'], ['on']])('parses the %s flag', (flag) => {
  expect(typeof parseFlag(flag)).toBe('boolean')
})
