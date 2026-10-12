// RECALL positive -- duplicate-each-row.
//
// One `test.each` table carrying the same row twice. `emit_duplicate_each_row` sub-groups the rows
// of a single declaration by (rendered title, substituted body) -- the two facts that make two
// rows the same case -- so rows 1 and 3 are one finding and row 2 is untouched. A repeated row is
// a copy-paste slip: the verdict is `redundant` at Warning severity.
//
// Both participants share the declaration's `Location`, so this rule's findings are distinguished
// by their rendered TITLES, not by line. That is also why the table's title pattern interpolates
// the row value: a pattern without a placeholder would render every row identically and make the
// duplicate-row claim unfalsifiable from the report alone.
import { expect, test } from 'vitest'
import { parseFlag } from './parse'

test.each([['on'], ['off'], ['on']])('parses the %s flag', (flag) => {
  expect(typeof parseFlag(flag)).toBe('boolean')
})
