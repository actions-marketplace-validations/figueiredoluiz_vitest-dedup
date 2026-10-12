// Two rows of one `test.each` table carry identical values: the same case is registered twice
// and runs twice. Expected verdict: duplicate-each-row -- deleting one row loses no coverage,
// exactly like a duplicated test, one table inward. Substitution folds each statically-known row
// into its own body fingerprint, so identical rows render the same title AND the same body; the
// rule keys on exactly that pair.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-each-row verdict=redundant severity=warning
// @vitest-dedup:participant L20 "doubles 2"
// @vitest-dedup:participant L20 "doubles 2"
// CROSS-FILE COLLISION (declared, not dodged): the `doubles 2` case below is also registered by
// each-row-distinct-rows.test.ts, so `cross-file-duplicate` links the two tables -- one
// representative per file, which is why this finding names one `doubles 2` and not both rows.
// The within-table repetition is `duplicate-each-row`'s, declared above and unaffected.
// `fixtures/README.md`, "Incidental cross-file collisions", explains why it is declared.
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant each-row-distinct-rows.test.ts#L20 "doubles 2"
// @vitest-dedup:participant L20 "doubles 2"
import { test, expect } from 'vitest'

test.each([[2], [2]])('doubles %i', (input) => {
  expect(input * 2).toBeGreaterThan(0)
})
