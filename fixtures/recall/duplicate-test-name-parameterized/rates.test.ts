// RECALL variant -- duplicate-test-name over parameterized titles: ONE finding PER ROW.
//
// Two `test.each` declarations render the same title pattern over the same rows, so after title
// rendering the file contains `rounds 1`, `rounds 2`, `rounds 1`, `rounds 2` -- two collisions, one
// per row, not one collision per declaration.
//
// That distinction is the whole variant. `emit_duplicate_test_name` collapses a group with
// `dedup_by_declaration`, which is what stops the rows of a SINGLE `.each` from pairing with each
// other (they share one declaration location). Here the colliding rows come from two DIFFERENT
// declarations, so the collapse must not fire and the rule must report each rendered title
// separately. An implementation that keyed on the declaration rather than the rendered title would
// report one finding, or none.
//
// The two callbacks do unrelated work, so no body-level rule may fire and mask the count.
import { expect, test } from 'vitest'
import { ceilRate, floorRate } from './rates'

test.each([[1], [2]])('rounds %i', (input) => {
  expect(ceilRate(input)).toBeGreaterThan(0)
})

test.each([[1], [2]])('rounds %i', (input) => {
  expect(floorRate(input)).toBeLessThan(100)
})
