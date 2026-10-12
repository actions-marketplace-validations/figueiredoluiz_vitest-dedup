// OBSERVED IN REAL CODE: a private 24,147-test Vue/TypeScript codebase, 2026-09-20. Two sibling
// `test.each` tables -- a "basic cases" table and an "edge cases" table -- each carried a row whose
// `params` and `expected` objects were byte-identical to a row in the other, under different
// Japanese descriptions. Confirmed redundant against the source; this is that shape, translated.
//
// SHAPE: `.each` tables of objects whose fields are themselves objects. Before composite cells
// were readable, ANY object or array cell made its row unresolved, which excluded every test in
// that row from every rule -- objects and arrays were 62% of the unreadable cells on that corpus
// (2,182 and 837 of 4,886), so this was the single largest blind spot the extractor had. Both
// findings below were invisible until composite cells could be read.
//
// WHAT IT MUST DO NOW: report the cross-table pair whose data is identical, and stay silent about
// the row whose nested `expected.date` differs by one. That row is the negative half, and it is
// ONE character from changing the report: edit its `date: 31` to `date: 30` -- making `expected`
// identical to the second table's row, with only `params` still differing -- and a third finding
// appears, `near-duplicate-test` between exactly those two (measured, not assumed; it does not
// become a `duplicate-test`, because `params` still differs). The nested-object comparison is the
// load-bearing part: `params` alone is equal across the first and third rows, so a `expected`
// compared as one opaque blob, or not compared at all, would change both verdicts below.
//
// The title pattern is `$name`, which selects a scalar field. Composite cells render in a title
// too -- `render_field` and `render_coerce` implement Vitest's own formatting, verified against
// 5.0.1 -- so nothing here depends on the title avoiding them; `$name` is simply what the
// observed code used. observed-mixed-each-table.test.ts pins the composite-in-a-title case.
// @vitest-dedup:extracted 3
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L40 "month end rolls back a day"
// @vitest-dedup:participant L58 "the 31st rolls back a day"
// The negative row is not silent, and declaring what it DOES produce is the point: it differs
// from the second table's row only in nested literal values, which is a parameterization
// candidate and not a duplicate. Two rules reading the same two composite cells and reaching
// different verdicts is the distinction composite folding has to preserve -- if `expected` were
// compared as one opaque blob, or not at all, this would be a duplicate or nothing.
// @vitest-dedup:expect rule=parameterization-candidate verdict=consolidatable severity=warning
// @vitest-dedup:participant L40 "a day earlier does not roll back"
// @vitest-dedup:participant L58 "the 31st rolls back a day"
import { test, expect } from 'vitest'
import { maxEndDate } from './max-end-date'

test.each([
  {
    name: 'month end rolls back a day',
    params: '2024-03-31',
    expected: { year: 2025, month: 3, date: 30 },
  },
  {
    name: 'a day earlier does not roll back',
    params: '2024-03-30',
    expected: { year: 2025, month: 3, date: 31 },
  },
])('$name', ({ params, expected }) => {
  const result = maxEndDate(params)
  expect(result.getFullYear()).toBe(expected.year)
  expect(result.getMonth() + 1).toBe(expected.month)
  expect(result.getDate()).toBe(expected.date)
})

test.each([
  {
    name: 'the 31st rolls back a day',
    params: '2024-03-31',
    expected: { year: 2025, month: 3, date: 30 },
  },
])('$name', ({ params, expected }) => {
  const result = maxEndDate(params)
  expect(result.getFullYear()).toBe(expected.year)
  expect(result.getMonth() + 1).toBe(expected.month)
  expect(result.getDate()).toBe(expected.date)
})
