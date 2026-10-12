// Positive half of the "destructure vs member access" transformation. Precondition: the
// object is not mutated between binding and use (see near-destructure-mutation-twin.test.ts in
// this same directory for the precondition-violating twin, which already passes today). Here
// nothing mutates `config` between binding and use, so `const { retries } = config` and
// `config.retries` observe the same value.
//
// Verified against the pre-canonicalization binary: NO finding. A destructuring declaration and a
// member expression are different AST shapes, so neither `duplicate-test` (alpha-equivalence) nor
// `parameterization-candidate` (literal-only difference) links them.
//
// The `expect(config).toBeDefined()` line in both bodies exists only to clear
// `MIN_BEHAVIOR_EVENTS_FOR_NEAR_DUPLICATE`'s substance floor -- the destructure-to-member-access
// canonicalization collapses the pair to a single assertion event otherwise. It sits before the
// destructuring declaration in the first body, so it cannot count as an intervening effect between
// that declaration and `retries`'s one read.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=near-duplicate-test verdict=similar-uncertain severity=warning
// @vitest-dedup:participant L23 "reads retries via destructuring"
// @vitest-dedup:participant L29 "reads retries via member access"
import { test, expect } from 'vitest'
import { config } from './config'

test('reads retries via destructuring', () => {
  expect(config).toBeDefined()
  const { retries } = config
  expect(retries).toBe(3)
})

test('reads retries via member access', () => {
  expect(config).toBeDefined()
  expect(config.retries).toBe(3)
})
