// RECALL positive -- duplicate-each-row over a cell that names its value.
//
// T1: the first row's cell is an identifier bound by a module-scope `const`. Before T1 that
// made the row unreadable as a class -- identifiers were the largest readable cause on the
// census that sized that row -- and the row, plus every test in it, was excluded from
// comparison. A `const` binding's initializer is statically THE value (no reassignment, and a
// reference that runs first is a TDZ crash, not a different value), so the row now reads as
// `'strict'`: same title, same row class, same substituted body as the literal row beside it.
//
// The pairing is the point: one row names the value, one row spells it. A renderer that could
// only read literals would leave the declaration half-compared; a renderer that compared names
// instead of values would never group these. Resolution is by symbol, never by name -- see
// `const_bound_cells_resolve_by_symbol_not_by_name` in `src/frontend/extract.rs` for the
// sibling-scope case that pins that.
import { expect, test } from 'vitest'
import { parseFlag } from './parse'

const MODE = 'strict'

test.each([[MODE], ['strict']])('parses the %s flag', (flag) => {
  expect(typeof parseFlag(flag)).toBe('boolean')
})
