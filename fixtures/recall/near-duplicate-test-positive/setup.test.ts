// RECALL positive -- near-duplicate-test under the reordered-setup transformation.
//
// Two bodies perform the same behavior events in a different order. `near-duplicate-test` keys on
// the SORTED MULTISET of `body.behavior` events, so a pure reordering makes the multisets equal
// while `body.alpha` (order-preserving) differs -- which is why `duplicate-test` correctly stays
// silent here and this rule does not.
//
// Verdict `similar-uncertain`, not `redundant`, and the distinction is the point: the
// transformation's precondition is that the reordered statements are INDEPENDENT, and nothing
// verifies that. `configure()` and `seed()` touch no shared state here, so the precondition holds
// -- but the analyzer cannot know it, so a human decides whether one test can go.
//
// This is also the product claim in one file: the two bodies share almost no token sequence in
// order, so a token-level copy-paste detector cannot link them.
import { expect, test } from 'vitest'
import { configure, isReady, seed } from './setup'

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
