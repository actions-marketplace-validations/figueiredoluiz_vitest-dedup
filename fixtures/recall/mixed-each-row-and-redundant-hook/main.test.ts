// RECALL mixed -- a repeated table row and a redundant nested hook in one file.
//
// duplicate-each-row sub-groups the rows of one declaration; redundant-hook compares hook
// bodies along one hook chain. The table's rows run under the hook chain carrying the
// redundancy, so the per-row grouping happens inside the very context the hook finding is
// about. Both findings must appear independently.
//
// Expected, independently:
//   duplicate-each-row warning, rows 1 and 3 carry the same case
//   redundant-hook     warning, the inner beforeEach repeats the outer one verbatim
//
// Named weakening: give row 3 a third distinct value and duplicate-each-row must go while redundant-hook stays;
// change the inner hook body and the reverse.
import { beforeEach, describe, expect, test } from 'vitest'
import { parseFlag } from './flags'

beforeEach(() => {
  process.env.FLAG_MODE = 'strict'
})

describe('flags', () => {
  beforeEach(() => {
    process.env.FLAG_MODE = 'strict'
  })

  test.each([['on'], ['off'], ['on']])('parses the %s flag', (flag) => {
    expect(typeof parseFlag(flag)).toBe('boolean')
  })
})
