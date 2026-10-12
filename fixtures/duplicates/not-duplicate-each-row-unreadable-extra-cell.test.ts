// OBSERVED IN REAL CODE: a test framework's own display suite -- rows `['%s',100]`, `['%s',100n]`,
// `['%s',-0]`, `['%s',null]` under the title `format(%s)` (11 of the rule's 35 false positives).
// The title's `%s` consumes the FIRST cell (the literal string '%s'), so every row renders the
// same title; the second cell reaches the body only through the callback's REST PARAMETER, whose
// spread the row substitution cannot see through, so the body half of the rule's claim does not
// discriminate either. `duplicate-each-row` links these rows today, so the expectation is pending
// until the S7 fix lands. Named weakening: replace the unreadable extra cells (`100n`, `-0`) with
// plain integers the body CAN bind -- rows then diverge and only a genuinely repeated row (two
// identical full rows) still fires, which is duplicate-each-row-extra-cell-real-repeat.test.ts.
// @vitest-dedup:extracted 4
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the rows differ only in cells that neither the title nor the substitutable body can observe, so every emitted field agrees and no relation between participants could fail; the guard is the corpus gate's silence assertion plus the named weakening in the header
// @vitest-dedup:participant L17 "format(%s)"
// @vitest-dedup:participant L17 "format(%s)"
import { it, expect } from 'vitest'

it.each([
  ['%s', 100],
  ['%s', 100n],
  ['%s', -0],
  ['%s', null],
])('format(%s)', (formatString, ...args) => {
  expect(format([formatString, ...args])).toBe(inspect(formatString))
})
