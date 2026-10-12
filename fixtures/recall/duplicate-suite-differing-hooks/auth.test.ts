// RECALL variant -- duplicate-suite where the blocks differ ONLY in their hooks.
//
// Byte-identical titles and byte-identical children; the two `beforeEach` bodies differ (one seeds
// an admin, the other a guest). The suite fingerprint covers hooks as well as children precisely
// so that this pair is not a copy: the same test bodies under different setup observe different
// behavior, and context compatibility is the single biggest precision lever in the design.
//
// This is the most dangerous negative for this rule. The children ARE duplicates of each other
// textually, so any implementation that compared only the child list would report an
// error-severity duplicate between two tests that exercise different roles -- and a suite-level
// `redundant` verdict on top of it.
//
// Load-bearing: make the two `beforeEach` bodies identical and the pair becomes one
// `duplicate-suite` warning. Both contexts resolve, so the silence is `distinct`.
//
// One finding IS expected here and it is not the one under test: the two blocks must share a title
// for the suite key to match at all, so both tests end up addressed as
// `login > accepts valid credentials` and `duplicate-test-name` reports that collision. It is
// correct -- `vitest -t` cannot reach either test individually -- and it is declared in the
// manifest rather than engineered away, because removing it would mean changing a suite title and
// losing the isolation this case exists for.
import { beforeEach, describe, expect, test } from 'vitest'
import { login, seedUser } from './auth'

describe('login', () => {
  beforeEach(() => {
    seedUser({ name: 'ada', role: 'admin' })
  })

  test('accepts valid credentials', () => {
    expect(login('ada', 'secret').ok).toBe(true)
  })
})

describe('login', () => {
  beforeEach(() => {
    seedUser({ name: 'ada', role: 'guest' })
  })

  test('accepts valid credentials', () => {
    expect(login('ada', 'secret').ok).toBe(true)
  })
})
