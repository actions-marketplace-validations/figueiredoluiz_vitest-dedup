// RECALL negative -- duplicate-suite where two suites share a title but not their children.
//
// `DuplicateSuiteKey` requires the same file, the same suite path, and the same own title -- all
// three hold here -- and then compares the block fingerprint, which does not. The second block
// tests logout, not login. Two different suites that merely happen to be addressed the same way
// must not aggregate into a suite-level redundancy claim.
//
// Load-bearing: make the second block's children identical to the first's and the pair becomes one
// `duplicate-suite` warning (that is the positive case next door). The children are also chosen so
// no leaf title collides, keeping `duplicate-test-name` out of the way -- otherwise this case could
// pass on a name-collision warning while `duplicate-suite` was dead.
//
// Both contexts resolve, so the silence is `distinct`.
import { describe, expect, test } from 'vitest'
import { login, logout } from './auth'

describe('session', () => {
  test('accepts valid credentials', () => {
    expect(login('ada', 'secret').ok).toBe(true)
  })
})

describe('session', () => {
  test('clears the token on logout', () => {
    expect(logout('ada').token).toBe(null)
  })
})
