// Rows of one table that differ in their literal values are distinct cases, not duplicates:
// they render different titles and substitute different bodies. Expected verdict: silence --
// duplicate-each-row keys on row identity (rendered title plus substituted body), never on the
// declaration merely being a table.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates literal
// @vitest-dedup:participant L20 "doubles 2"
// @vitest-dedup:participant L20 "doubles 5"
// CROSS-FILE COLLISION (declared, not dodged): this table's `[2]` row renders the same title and
// substitutes the same body as one of the two `[2]` rows in each-row-duplicate-rows.test.ts, so
// `cross-file-duplicate` links the two tables. The `[5]` row is linked to nothing -- within this
// file (this fixture's own claim) or across the boundary.
// `fixtures/README.md`, "Incidental cross-file collisions", explains why it is declared.
// @vitest-dedup:expect rule=cross-file-duplicate verdict=redundant severity=warning
// @vitest-dedup:participant L20 "doubles 2"
// @vitest-dedup:participant each-row-duplicate-rows.test.ts#L20 "doubles 2"
import { test, expect } from 'vitest'

test.each([[2], [5]])('doubles %i', (input) => {
  expect(input * 2).toBeGreaterThan(0)
})
