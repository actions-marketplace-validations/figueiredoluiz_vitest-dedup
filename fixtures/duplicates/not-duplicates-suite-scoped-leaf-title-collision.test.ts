// Two suites with different names, each containing one test that shares the same LEAF title
// ("renders the empty state") and has a genuinely different body. Expected verdict: NOT a
// duplicate-test-name collision. `duplicate-test-name` keys on `TestCase::full_title` (suite path
// joined with the test title, per analysis.rs's module doc: "same full_title within one file"),
// never on the bare leaf title -- so two same-named tests under different suites have different
// full titles and must not collide.
//
// This is the precondition-violating twin for duplicate-test-name.test.ts: there, the SAME full
// title with different bodies fires name-collision. Here, only the leaf title matches; the suite
// prefix differs, so the full title differs, and the rule must stay silent. If duplicate-test-name
// were ever weakened to compare leaf titles instead of full titles, this exact pair is what would
// start colliding.
//
// `check-fixture-isolation.mjs` checks this claim directly, on titles rather than fingerprints
// (`DIMENSIONS['suite-path']`, `kind: 'titles'`): the participants' LEAF titles must be equal --
// without that they are not even a name-collision candidate -- and their FULL titles must differ,
// which is exactly what keeps duplicate-test-name silent. The bodies below are deliberately NOT
// token-identical anyway: matching titles with identical bodies would instead fire duplicate-test
// across suites, per duplicates-different-suites-no-hooks.test.ts, which would make this pair the
// wrong kind of fixture.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=none verdict=distinct severity=none
// @vitest-dedup:isolates suite-path
// @vitest-dedup:participant L31 "search panel > renders the empty state"
// @vitest-dedup:participant L38 "notifications panel > renders the empty state"
import { describe, test, expect } from 'vitest'
import { search } from './search'
import { getNotificationCount, isEmpty } from './notifications'

describe('search panel', () => {
  test('renders the empty state', () => {
    const results = search('')
    expect(results).toHaveLength(0)
  })
})

describe('notifications panel', () => {
  test('renders the empty state', () => {
    const count = getNotificationCount()
    expect(count).toBe(0)
    expect(isEmpty(count)).toBe(true)
  })
})
