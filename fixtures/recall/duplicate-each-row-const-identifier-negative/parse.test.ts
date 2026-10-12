// RECALL negative -- duplicate-each-row over const-named cells with DIFFERENT values.
//
// The companion of `duplicate-each-row-const-identifier`: reading a named cell is only sound if
// what is compared is the VALUE the name resolves to, never the name. Two consts, two values,
// two rendered titles -- nothing may be reported. A renderer that fell back to the identifier's
// text would render `runs the FAST path` and `runs the SLOW path`, also distinct, also silent --
// so this case alone cannot catch a name-based renderer; the positive case (same value through
// a name and a literal) is what pins value-based grouping, and this one guards the other
// direction: two different values must never collide through the feature that reads them.
//
// The table is a readable array literal with fully readable rows, so the run is NOT incomplete
// and the silence is `distinct` rather than `not-compared`.
import { expect, test } from 'vitest'
import { parseFlag } from './parse'

const FAST = 'fast'
const SLOW = 'slow'

test.each([[FAST], [SLOW]])('runs the %s path', (mode) => {
  expect(typeof parseFlag(mode)).toBe('boolean')
})
