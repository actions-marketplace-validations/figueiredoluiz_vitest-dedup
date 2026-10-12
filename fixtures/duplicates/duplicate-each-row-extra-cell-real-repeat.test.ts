// Twin of not-duplicate-each-row-unreadable-extra-cell.test.ts: the same rest-parameter shape,
// but the two rows are identical in EVERY cell, so the repeat is real -- the table registers the
// same case twice no matter how the extra cell is read. Must fire before and after the S7 fix; a
// fix that simply refuses tables with extra cells, rather than requiring the compared body to
// actually discriminate, deletes this true positive along with the false positives.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-each-row verdict=redundant severity=warning
// @vitest-dedup:participant L12 "format(%s)"
// @vitest-dedup:participant L12 "format(%s)"
import { it, expect } from 'vitest'

it.each([
  ['%s', 100],
  ['%s', 100],
])('format(%s)', (formatString, ...args) => {
  expect(String(format([formatString, ...args]))).toBe(inspect(formatString))
})
