// Two tests with identical code whose only difference is an explanatory comment carrying
// traceability for two different screens.
// Expected verdict: duplicate-test. Comments are stripped during fingerprinting, so these compare
// equal.
//
// This fixture pins current behavior rather than an ideal, and the counter-argument is real: the
// comments carry information a reviewer may want to keep, even though the code genuinely is
// duplicated. It is the canonical case for an explicit, auditable suppression once suppressions
// exist, rather than for weakening the rule -- the intent lives somewhere the analyzer cannot see.
// @vitest-dedup:extracted 2
// @vitest-dedup:expect rule=duplicate-test verdict=redundant severity=error
// @vitest-dedup:participant L18 "rejects an empty name on create"
// @vitest-dedup:participant L23 "rejects an empty name on edit"
import { test, expect } from 'vitest'
import { validate } from './validate'

// Case ref: create screen
test('rejects an empty name on create', () => {
  expect(validate({ name: '' }).ok).toBe(false)
})

// Case ref: edit screen
test('rejects an empty name on edit', () => {
  expect(validate({ name: '' }).ok).toBe(false)
})
