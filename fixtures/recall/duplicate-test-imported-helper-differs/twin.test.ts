// RECALL negative -- duplicate-test must NOT fire.
//
// The mirror of duplicate-test-imported-helper-equivalent with one literal inside helper B
// changed (`toBeGreaterThan(1)` vs `(0)`). The contexts compare (both helper modules drop out of
// the compared imports exactly as in the positive case), the inlined bodies are compared, and
// they differ -- so the silence is `distinct`, a compared-and-found-different outcome, not a
// pair that never became eligible.
import { test } from 'vitest'
import { checkActive } from './helpers-a'
import { assertNonEmpty } from './helpers-b'

test('accepts a plain label', () => {
  checkActive('dashboard')
})

test('accepts a plain label, again', () => {
  assertNonEmpty('dashboard')
})
