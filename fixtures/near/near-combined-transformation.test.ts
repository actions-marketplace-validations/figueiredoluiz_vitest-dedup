// Composition: rename locals AND reorder independent setup AND extract a local, all in one
// pair. Isolated transformations passing individually (see the five near-*-twin.test.ts negatives
// and the near-*-positive.test.ts fixtures in fixtures/duplicates/) does not prove their
// COMPOSITION works -- a rule built to bridge one transformation at a time could still fail to
// recognize a pair that combines three simultaneously.
//
// Test A: local named `user`, setup calls in declaration order, no extracted local.
// Test B: local renamed to `record`, the two independent setup calls swapped, and the repeated
// expression `record.email` extracted into a local `email` used twice.
// Both preconditions hold: `loadProfile`/`grantAccess` are independent (no shared state), and
// `record.email` is a pure read evaluated the same number of times either way.
//
// PENDING -- not because near-duplicate-test is unimplemented (it shipped, with a verified
// precondition per transformation) and not because the corpus gate cannot express it (the
// block below is a complete positive expectation: rule, verdict, severity, and participants).
// The real blocker is narrower. near-duplicate-test's single-use local inlining
// (frontend/fingerprint.rs's `DataflowSubst`, around line 488) requires the substituted local be
// read exactly once, and Test B's `email` binding above is read twice, once per `expect` call --
// so inlining is correctly declined for it. Without that substitution the two behavior
// signatures diverge on the `email` vs. `record.email` events and the pair stays `distinct`.
// This fixture stays in fixtures/near/, outside check-duplicates-corpus.mjs's finding
// assertions, until that precondition is loosened or a fallback normalization is added.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=near-duplicate-test verdict=similar-uncertain severity=warning
// @vitest-dedup:pending near-duplicate-test's single-use local inlining requires a read-once local; this fixture's second test reads its extracted local twice
// @vitest-dedup:participant L31 "grants access after loading the profile"
// @vitest-dedup:participant L38 "grants access after loading the profile, reordered and renamed"
import { test, expect } from 'vitest'
import { loadProfile, grantAccess } from './accounts'

test('grants access after loading the profile', () => {
  const user = loadProfile(1)
  grantAccess(1)
  expect(user.email).toContain('@')
  expect(user.email).not.toBe('')
})

test('grants access after loading the profile, reordered and renamed', () => {
  grantAccess(1)
  const record = loadProfile(1)
  const email = record.email
  expect(email).toContain('@')
  expect(email).not.toBe('')
})
