// RECALL variant -- duplicate-each-row over a static member cell.
//
// The second of T1's readable causes: a cell that reads a property off a module-scope `const`
// object. Static members were 243 cells on the census that sized that row. Reading one is
// sound only under a discipline, and this case exercises it end to end: the object is declared
// once, never written through (`LEVELS.audit = 4`, `delete`, `++` all refuse), and never
// allowed to escape to a call (an `Object.assign(LEVELS, ...)` anywhere in the file refuses,
// because the analyzer cannot see through calls) -- so the declared literal is still the
// object's value when the table is constructed.
//
// The row reads as `3`: same title, same row class, same substituted body as the literal row
// beside it, so the pair is reported exactly as the all-literal positive is.
import { expect, test } from 'vitest'
import { parseFlag } from './parse'

const LEVELS = { audit: 3 }

test.each([[LEVELS.audit], [3]])('records at level %d', (level) => {
  expect(typeof parseFlag(String(level))).toBe('boolean')
})
