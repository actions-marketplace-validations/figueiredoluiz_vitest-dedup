// RECALL variant -- duplicate-test under dynamic titles: `not-compared`, not `distinct`.
//
// Both tests have byte-identical bodies under one context, so on body and context alone they are a
// duplicate pair. Their titles are template literals interpolating a runtime value, which the
// extractor records as `Title::Dynamic` and which marks the test's `Context` unresolved; every
// rule filters on `Context::is_comparable()` before grouping, so the pair is never compared.
//
// The expectation therefore has TWO halves, and only declaring the first would be dishonest:
//   - no `duplicate-test` finding links the pair, AND
//   - the run is `incomplete` (`unresolvedTests > 0`).
//
// Without the second half this case would be indistinguishable from a case where the analyzer
// compared the pair and correctly found it different -- which is how `not-compared` gets laundered
// into `distinct`: two tests with unreadable titles look alike. The silence here is a
// precision decision about an unreadable title, not a verdict about the bodies.
import { expect, test } from 'vitest'
import { open } from './session'

const user = process.env.USER ?? 'anonymous'

test(`opens a session for ${user}`, () => {
  const session = open({ id: 7 })
  expect(session.active).toBe(true)
})

test(`resumes a session for ${user}`, () => {
  const session = open({ id: 7 })
  expect(session.active).toBe(true)
})
