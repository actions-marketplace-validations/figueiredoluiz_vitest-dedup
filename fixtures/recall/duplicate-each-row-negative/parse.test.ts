// RECALL negative -- duplicate-each-row over a table whose rows are all distinct.
//
// Three rows, three different values, three different rendered titles. Nothing is repeated, so
// nothing may be reported -- and nothing else may fire either: the rows of one declaration are
// collapsed one-per-`Location` by every other rule (`dedup_by_declaration`), which is what stops a
// table from being reported as duplicating itself.
//
// That self-duplication was a real defect, not a hypothetical: nine `.each` self-duplicates were
// found on the external corpus and fixed. This case is the recall-side guard that the fix
// did not go too far -- `duplicate-each-row-positive` next door proves real repeated rows are
// still reported, so "silent here" cannot mean "the rule was switched off".
//
// The table is a readable array literal, so the run is NOT incomplete and the silence is
// `distinct` rather than `not-compared`.
import { expect, test } from 'vitest'
import { parseFlag } from './parse'

test.each([['on'], ['off'], ['auto']])('parses the %s flag', (flag) => {
  expect(typeof parseFlag(flag)).toBe('boolean')
})
