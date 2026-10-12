// RECALL variant -- duplicate-each-row over the `.for` form.
//
// `.for` takes the same table syntax and the same title-derivation rules as `.each`; the only
// difference is at the callback-argument level, where an array row is NOT spread into positional
// parameters and the second parameter is the `TestContext`
// (docs/vitest-surface.md ss4). `EachTable::is_for` records which spelling was used, and
// `ModifierKey` includes the whole table, so the two forms are never conflated.
//
// The repeated row must be reported here exactly as it is under `.each`. Every other
// `duplicate-each-row` case in this corpus uses `.each`; an extractor that recognized only
// `.each` as a table-producing chain step would leave all of them green while `.for` tables --
// the form Vitest's own docs steer concurrent tests toward -- went unanalyzed entirely.
//
// The callback takes the row whole (`[flag]` destructured from the array row) rather than a spread
// positional parameter, which is the behavioral difference `.for` exists for and therefore the
// spelling this case has to use.
import { expect, test } from 'vitest'
import { parseFlag } from './parse'

test.for([['on'], ['off'], ['on']])('parses the %s flag', ([flag]) => {
  expect(typeof parseFlag(flag)).toBe('boolean')
})
