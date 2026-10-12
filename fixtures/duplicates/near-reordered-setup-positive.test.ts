// Positive half of the "reordered setup" transformation. Precondition: the reordered
// statements are independent (see near-reordered-setup-dependent-twin.test.ts in
// fixtures/duplicates/ for the precondition-violating twin, which already passes today). Here
// `configure()` and `seed()` do not touch shared state, so swapping their order changes nothing
// observable, and `near-duplicate-test` sees past the statement order to report them.
//
// This fixture was written BEFORE `near-duplicate-test` existed, as a deliberately-failing
// expectation, and its header said so for a long time after that stopped being true: that the rule
// did not exist, that the gate's `RULES`/`VERDICT_RULE` had no entry for it and would fail to
// PARSE this file, and that the pair "produces NO finding at all today". All three are now false.
// The rule ships at Warning, `fixture-directives.mjs` carries `near-duplicate-test` in both maps,
// and this pair reports `near-duplicate-test` / `similar-uncertain` -- which is exactly what the
// expectation below asserts, and it passes.
//
// Recorded rather than quietly deleted, because the fixture is a small case study in this
// repository's most repeated defect. The machine-readable half was corrected first (a
// `@vitest-dedup:pending` directive was removed), and the prose saying the same false thing was
// left behind -- so a reader was still told this active, passing expectation was pending.
//
// Verdict is `similar-uncertain`, not `redundant`, and the distinction is the whole point.
//
// The rule detects that these two bodies perform the same behavior events in a different order.
// It does NOT verify that the reordered statements are independent -- that is the precondition,
// and `not-near-reordered-setup-shared-state.test.ts` is the twin where it does not hold.
//
// An unverified precondition means the analyzer suspects equivalence rather than establishing it,
// so a human decides whether one test can go. The corpus originally expected `redundant` for
// these transformations; that was written before the rule existed and assumed the precondition
// could be checked. It cannot, so the expectation was amended rather than the verdict weakened.

// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=near-duplicate-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L38 "configures then seeds"
// @vitest-dedup:participant L44 "seeds then configures"
import { test, expect } from 'vitest'
import { configure, seed, isReady } from './setup'

test('configures then seeds', () => {
  configure({ mode: 'test' })
  seed({ users: 3 })
  expect(isReady()).toBe(true)
})

test('seeds then configures', () => {
  seed({ users: 3 })
  configure({ mode: 'test' })
  expect(isReady()).toBe(true)
})
