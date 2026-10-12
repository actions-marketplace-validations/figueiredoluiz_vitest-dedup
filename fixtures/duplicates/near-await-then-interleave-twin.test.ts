// Precondition-violating twin for the "await f() vs return f().then(...)" transformation.
// The transformation's precondition is a single awaited call with no interleaving; here a SECOND
// await interleaves between the first call and the assertion, so the `.then()` form (which skips
// straight from the first call's resolution to the assertion) observes a different, earlier state
// than the doubly-awaited form.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates not-isolable the claim is not a relation between these two participants at all: the isolated variable is an EXTRA interleaved await relative to a DIFFERENT fixture's pair (near-await-vs-then-positive.test.ts). No relation between two records in this file can state "differs from that other pair by one await"
// @vitest-dedup:participant L14 "awaits setup then a second interleaving step before asserting"
// @vitest-dedup:participant L20 "chains straight from setup to the assertion"
import { test, expect } from 'vitest'
import { setup, advance, state } from './pipeline'

test('awaits setup then a second interleaving step before asserting', async () => {
  await setup()
  await advance()
  expect(state()).toBe('advanced')
})

test('chains straight from setup to the assertion', () => {
  return setup().then(() => {
    expect(state()).toBe('initial')
  })
})
