// The TRUE-POSITIVE twin of observed-mixed-each-table.test.ts, and the reason that fixture's
// silence is a precision result rather than a rule that stopped reading tables.
//
// SHAPE: every row of this table IS an array, so Vitest spreads each row across the callback's
// parameters. The callback takes ONE parameter, so the second cell of each row is dropped: row
// `[1, 2]` and row `[1, 3]` both bind `value = 1`, both render the title `accepts 1`, and both
// run the identical body. Verified against real Vitest 5, which is the point of the pair -- the
// mixed table binds rows whole and these two rows would then be different cases; the uniform
// table spreads and they are the same case twice.
//
// WHAT IT MUST DO: report ONE `duplicate-each-row`, at Warning, between the two rows of the
// single declaration. Both participants name the same line because both cases come from the same
// `it.each` call; that is what a table-row finding looks like.
//
// A reviewer reading only the negative twin could conclude the analyzer had been taught to
// distrust `.each` tables generally. This is the fixture that says otherwise, and it fails if a
// future "fix" for the mixed-table false positive is implemented by giving up on row expansion.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-each-row verdict=redundant severity=warning
// @vitest-dedup:participant L24 "accepts 1"
// @vitest-dedup:participant L24 "accepts 1"
import { it, expect } from 'vitest'

it.each([[1, 2], [1, 3]])('accepts %s', (value) => {
  expect(typeof value).toBe('number')
})
