// RECALL mixed -- a table with a repeated row and a duplicated standalone pair in one file.
//
// duplicate-each-row's participants share one declaration site, which every other rule collapses
// away (`dedup_by_declaration`); the duplicated standalone pair has two declaration sites, which
// duplicate-each-row never groups. The two defects therefore live on disjoint populations, and
// the mixed claim is that each rule reports its own population with the other present -- and
// that the table's own rows never appear under duplicate-test.
//
// Expected, independently:
//   duplicate-test     error, the two `settles the balance` bodies are identical
//   duplicate-each-row warning, rows 1 and 3 of the table carry the same case
//
// Named weakening: give row 3 a third distinct value and duplicate-each-row must go while duplicate-test stays.
import { expect, test } from 'vitest'
import { parseFlag, settle, balance } from './flags'

test('settles the balance', () => {
  settle('order-1')
  expect(balance('order-1')).toBe(0)
})

test('settles the balance again', () => {
  settle('order-1')
  expect(balance('order-1')).toBe(0)
})

test.each([['on'], ['off'], ['on']])('parses the %s flag', (flag) => {
  expect(typeof parseFlag(flag)).toBe('boolean')
})
