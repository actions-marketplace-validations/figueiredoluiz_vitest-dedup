// Positive half of the "await f() vs return f().then(...)" transformation. Precondition: a
// single awaited call with no interleaving (see near-await-then-interleave-twin.test.ts in this
// same directory for the precondition-violating twin -- a second, interleaving await -- which
// already passes today). Here both forms await exactly one call before asserting, so they observe
// the same state.
//
// Verified against the pre-canonicalization binary: NO finding. `await f(); expect(...)` and
// `return f().then(() => { expect(...) })` are structurally very different shapes (an await
// expression statement vs a `.then()` call with a callback), so neither existing rule links them.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=near-duplicate-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L17 "awaits setup then asserts"
// @vitest-dedup:participant L22 "chains setup then asserts"
import { test, expect } from 'vitest'
import { setup, state } from './pipeline'

test('awaits setup then asserts', async () => {
  await setup()
  expect(state()).toBe('ready')
})

test('chains setup then asserts', () => {
  return setup().then(() => {
    expect(state()).toBe('ready')
  })
})
