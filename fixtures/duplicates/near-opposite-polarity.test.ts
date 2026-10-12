// Same subject, opposite boolean expectation, near-identical shell: `expect(pred(user)).toBe(true)`
// vs `expect(otherPred(user)).toBe(false)`.
//
// Caution for whoever tunes a similarity threshold against this file: `toBe(true)` vs `toBe(false)`
// on the SAME callee and SAME input (e.g. `isPositive(0)` -> false, `isPositive(1)` -> true) is NOT
// this case -- that pair is a legitimate boundary-value
// coverage continuum and is `consolidatable`, not `distinct` (see
// duplicates-parameterization-boundary-values.test.ts). What makes THIS pair dangerous instead is
// that the predicate itself differs (`isAdmin` vs `isBanned`) while the subject is held constant and
// the boolean flips -- a similarity measure that keys on "same subject, same shell, inverted
// literal" without noticing the callee changed would merge two checks of completely unrelated
// facts about the same user.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates identifier,literal
// @vitest-dedup:participant L22 "user is an admin"
// @vitest-dedup:participant L26 "user is not banned"
import { test, expect } from 'vitest'
import { isAdmin, isBanned } from './access'
import { user } from './fixtures-data'

test('user is an admin', () => {
  expect(isAdmin(user)).toBe(true)
})

test('user is not banned', () => {
  expect(isBanned(user)).toBe(false)
})
