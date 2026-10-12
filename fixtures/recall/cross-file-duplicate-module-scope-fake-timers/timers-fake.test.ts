// RECALL known false positive -- module-scope ambient state, case 1 of 3.
//
// Two files whose tests are byte-identical and whose ONLY difference is the timer mode they run
// under. `scheduleRetry(1000)` does not do the same thing when timers are faked as when they are
// real -- that is the entire reason a suite reaches for `vi.useFakeTimers()` -- so these two tests
// are not the same case and deleting either loses coverage. The analyzer reports
// `cross-file-duplicate` and says the two are "under an equivalent context".
//
// MECHANISM, verified rather than assumed: `Context::module_setup` captures module-scope setup
// calls that are AWAITED. `vi.useFakeTimers()` is synchronous, so nothing about it reaches the
// context, the two contexts compare equal, and the bodies do the rest. The control case
// `cross-file-duplicate-awaited-module-setup` pins the other half of that sentence: replace this
// call with an awaited one and the finding disappears, which is how the boundary was measured.
//
// The mock fold does not help here either. It is over hoisted `vi.mock` registrations; a timer
// switch is not one.
//
// Named weakening: give both files the SAME timer mode and the finding becomes correct -- two
// genuinely identical tests in one scope.
import { expect, test, vi } from 'vitest'
import { scheduleRetry } from './retry'

vi.useFakeTimers()

test('schedules a retry under fake timers', () => {
  const handle = scheduleRetry(1000)
  expect(handle.pending).toBe(true)
})
