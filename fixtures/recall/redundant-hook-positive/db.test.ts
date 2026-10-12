// RECALL positive -- redundant-hook.
//
// A nested `beforeEach` whose body is alpha-equal to an ancestor `beforeEach` already in the same
// chain. `Context::hooks` is the test's full chain outermost-first, so "a hook repeats an
// ancestor" is an intra-chain equality check over the same alpha normalization `duplicate-test`
// uses on test bodies. Every test under the inner suite pays for the same setup twice; the verdict
// is `redundant` at Warning severity, because redundant setup costs runtime, not correctness.
//
// The finding's participants are the two HOOK locations, and a hook has no title of its own -- the
// report uses the hook kind as the participant label, so both titles read `beforeEach`. The
// manifest therefore pins this case's finding by location as well as by rule, since titles alone
// cannot tell two `beforeEach` findings apart.
//
// Only one test exists in the file, so no test-level rule can fire and mask this.
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { rowCount } from './db'

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

describe('queries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  test('starts from an empty table', () => {
    expect(rowCount()).toBe(0)
  })
})
